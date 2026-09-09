/**
 * Service Devis — demande de devis (évoluera vers un module devis complet).
 * Enregistrement dans la table additive Web_Devis + lien WhatsApp.
 */
import { prisma } from '@/lib/prisma';
import { productRepository } from '@/repositories/product.repository';
import { productService } from './product.service';
import { buildQuoteWhatsAppMessage, buildWhatsAppLink } from '@/lib/whatsapp';
import { formatFCFA } from '@/lib/utils';
import {
  BOUTIQUE_ID,
  TENANT_ID,
  MAX_CART_QUANTITY,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE_DEFAULT,
} from '@/lib/constants';
import { validateQuote, normalizeCartItems } from '@/lib/validation';
import { computeTotals } from '@/lib/pricing';
import { badRequest } from '@/lib/errors';
import type { QuoteCreateInput, QuoteResult } from '@/types';

async function nextDevisReference(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `DVT-${year}-`;
  const last = await prisma.web_Devis.findFirst({
    where: { reference: { startsWith: prefix } },
    orderBy: { reference: 'desc' },
    select: { reference: true },
  });
  let seq = 0;
  if (last) {
    const tail = parseInt(last.reference.slice(prefix.length), 10);
    if (Number.isInteger(tail)) seq = tail;
  }
  return `${prefix}${String(seq + 1).padStart(6, '0')}`;
}

export const quoteService = {
  async create(input: QuoteCreateInput): Promise<QuoteResult> {
    const items = normalizeCartItems(input.items, MAX_CART_QUANTITY);
    const vErrors = validateQuote({
      nom: input.nom,
      telephone: input.telephone,
      email: input.email,
      entreprise: input.entreprise,
      commentaire: input.commentaire,
      hasItems: items.length > 0,
    });
    if (vErrors.length > 0) throw badRequest('Formulaire de devis invalide.', 'VALIDATION', vErrors);

    // Total estimatif (prix officiels, serveur)
    const rows = await productRepository.findByIds(items.map((i) => i.productId));
    const rowById = new Map(rows.map((r) => [Number(r.id_produit), r]));
    const lines = items
      .filter((i) => rowById.has(i.productId))
      .map((i) => ({ quantity: i.quantity, unitPriceHt: Number(rowById.get(i.productId)!.prix_unitaire_vente_ht) }));
    const taxRate = await productService.getTaxRate();
    const totals = computeTotals(lines, taxRate, { fee: SHIPPING_FEE_DEFAULT, freeThreshold: FREE_SHIPPING_THRESHOLD });

    // Référence avec repli en cas de collision (unicité sur la table)
    let reference = '';
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        reference = await nextDevisReference();
        await prisma.web_Devis.create({
          data: {
            reference,
            id_tenant: TENANT_ID,
            id_boutique: BOUTIQUE_ID,
            nom: input.nom.trim().slice(0, 150),
            telephone: input.telephone.trim().slice(0, 50),
            email: input.email.trim().slice(0, 150),
            entreprise: input.entreprise?.trim().slice(0, 150) || null,
            commentaire: input.commentaire?.trim().slice(0, 4000) || null,
            items_json: JSON.stringify(
              items.map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
                name: rowById.get(i.productId)?.nom_produit ?? null,
              })),
            ),
          },
        });
        break;
      } catch (error) {
        if (attempt === 2) throw error;
      }
    }

    console.log(`Demande de devis créée: ${reference} — ${items.length} article(s).`);

    const itemsText = items
      .map((i) => {
        const name = rowById.get(i.productId)?.nom_produit ?? `Produit #${i.productId}`;
        return `- ${name} x${i.quantity}`;
      })
      .join('\n');

    const waMessage = buildQuoteWhatsAppMessage({
      reference,
      items: itemsText,
      total: formatFCFA(totals.totalTtc),
      nom: input.nom.trim(),
      telephone: input.telephone.trim(),
      entreprise: input.entreprise?.trim(),
    });

    return {
      reference,
      createdAt: new Date().toISOString(),
      whatsappUrl: buildWhatsAppLink(waMessage),
      totalTtc: totals.totalTtc,
    };
  },
};