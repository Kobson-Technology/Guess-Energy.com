/**
 * Service Commandes — création transactionnelle d'une commande web.
 * Option A : écriture directe dans la base unifiée (comme GesCom).
 * Anti-surenchère : décrément atomique du stock avec garde (stock_actuel >= qty).
 */
import { prisma } from '@/lib/prisma';
import { productRepository } from '@/repositories/product.repository';
import { clientRepository } from '@/repositories/client.repository';
import { stockRepository } from '@/repositories/stock.repository';
import { orderRepository } from '@/repositories/order.repository';
import { productService } from './product.service';
import { computeTotals } from '@/lib/pricing';
import {
  BOUTIQUE_ID,
  TENANT_ID,
  FREE_SHIPPING_THRESHOLD,
  ORDER_STATUS,
  SHIPPING_FEE_DEFAULT,
  MAX_CART_QUANTITY,
} from '@/lib/constants';
import { validateCustomer, normalizeCartItems } from '@/lib/validation';
import { AppError, badRequest, conflict } from '@/lib/errors';
import { buildOrderWhatsAppMessage, buildWhatsAppLink } from '@/lib/whatsapp';
import { formatFCFA } from '@/lib/utils';
import type { OrderCreateInput, OrderResult } from '@/types';

const SHIPPING = { fee: SHIPPING_FEE_DEFAULT, freeThreshold: FREE_SHIPPING_THRESHOLD };

export const orderService = {
  async create(input: OrderCreateInput): Promise<OrderResult> {
    const customer = input.customer ?? {};
    const errors = validateCustomer(customer);
    if (errors.length > 0) throw badRequest('Informations client invalides.', 'VALIDATION', errors);

    const items = normalizeCartItems(input.items, MAX_CART_QUANTITY);
    if (items.length === 0) throw badRequest('Le panier doit contenir au moins un article.', 'EMPTY_CART');

    const rows = await productRepository.findByIds(items.map((i) => i.productId));
    const rowById = new Map(rows.map((r) => [Number(r.id_produit), r]));
    if (rowById.size !== items.length) {
      throw badRequest('Un ou plusieurs produits sont indisponibles.', 'PRODUCT_NOT_FOUND');
    }

    const taxRate = await productService.getTaxRate();

    // Lignes & totaux calculés côté serveur (jamais ceux du client)
    const lines = items.map((item) => {
      const row = rowById.get(item.productId)!;
      return {
        productId: item.productId,
        name: row.nom_produit,
        quantity: item.quantity,
        unitPriceHt: Number(row.prix_unitaire_vente_ht),
      };
    });
    const computedTotals = computeTotals(lines, taxRate, SHIPPING);
    const totals = {
      ...computedTotals,
      currency: 'FCFA',
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    };

    let orderId = 0;
    let reference = '';
    // === point de reprise transaction ===

    await prisma.$transaction(async (tx) => {
      reference = await orderRepository.nextReference(tx, TENANT_ID, new Date().getFullYear());

      const client = await clientRepository.findOrCreate(tx, TENANT_ID, BOUTIQUE_ID, {
        nom_raison_sociale: customer.name.trim(),
        email: customer.email.trim(),
        telephone: customer.phone?.trim(),
        adresse_livraison: [customer.address?.trim(), customer.city?.trim()].filter(Boolean).join(', ') || null,
        type_client: customer.type ?? 'B2C',
      });

      // Réserve ATOMIQUE du stock — échec ⇒ rollback complet
      for (const line of lines) {
        const reserved = await stockRepository.reserve(tx, line.productId, line.quantity, TENANT_ID, BOUTIQUE_ID);
        if (!reserved) {
          const stock = Number(rowById.get(line.productId)!.stock_actuel ?? 0);
          throw conflict(
            `Stock insuffisant pour « ${line.name} » (disponible: ${Math.max(0, Math.floor(stock))}).`,
            'INSUFFICIENT_STOCK',
          );
        }
      }

      orderId = await orderRepository.createOrder(tx, {
        tenantId: TENANT_ID,
        boutiqueId: BOUTIQUE_ID,
        clientId: client.id_client,
        reference,
        statut: ORDER_STATUS.PENDING,
        taxRate,
        items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity, unitPriceHt: l.unitPriceHt })),
      });

      for (const line of lines) {
        await orderRepository.addDetail(tx, {
          tenantId: TENANT_ID,
          boutiqueId: BOUTIQUE_ID,
          commandeId: orderId,
          productId: line.productId,
          quantity: line.quantity,
          unitPriceHt: line.unitPriceHt,
        });
        await orderRepository.addStockMovement(tx, {
          tenantId: TENANT_ID,
          boutiqueId: BOUTIQUE_ID,
          productId: line.productId,
          quantity: line.quantity,
          commentaire: `Commande web ${reference}`,
        });
      }

      await orderRepository.addTrackingEvent(tx, {
        tenantId: TENANT_ID,
        boutiqueId: BOUTIQUE_ID,
        commandeId: orderId,
        statut: 'En attente',
        libelle: 'Commande reçue',
        description: customer.note?.slice(0, 250) ?? 'Commande passée via le site GUESS ENERGY.',
      });
    }).catch((error: unknown) => {
      if (error instanceof AppError) throw error;
      console.error('[ORDER] Échec création commande:', error);
      throw error;
    });

    console.log(
      `Commande créée: ${reference} (id=${orderId}) — ${lines.length} ligne(s), ${formatFCFA(totals.totalTtc)}`,
    );

    const waMessage = buildOrderWhatsAppMessage({
      reference,
      lines: lines.map((l) => ({ name: l.name, quantity: l.quantity })),
      total: formatFCFA(totals.totalTtc),
      customer: { name: customer.name.trim(), phone: customer.phone?.trim() },
    });

    return {
      orderId,
      reference,
      status: ORDER_STATUS.PENDING,
      currency: 'FCFA',
      totals,
      lines: lines.map((l) => ({
        productId: l.productId,
        name: l.name,
        quantity: l.quantity,
        unitPriceHt: l.unitPriceHt,
        subtotalHt: Math.round(l.quantity * l.unitPriceHt * 100) / 100,
        subtotalTtc: Math.round(l.quantity * l.unitPriceHt * (1 + taxRate) * 100) / 100,
      })),
      createdAt: new Date().toISOString(),
      whatsappUrl: buildWhatsAppLink(waMessage),
    };
  },

  async findByReference(reference: string) {
    return prisma.commandes.findFirst({
      where: { id_tenant: TENANT_ID, id_boutique: BOUTIQUE_ID, is_deleted: false, numero_facture_chrono: reference.trim() },
      select: {
        id_commande: true,
        numero_facture_chrono: true,
        statut: true,
        date_commande: true,
        Clients: { select: { nom_raison_sociale: true, email: true, telephone: true } },
        Details_Commandes: {
          where: { is_deleted: false },
          select: { id_produit: true, quantite: true, prix_vente: true },
        },
      },
    });
  },
};