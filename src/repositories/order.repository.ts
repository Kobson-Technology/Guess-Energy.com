/**
 * Repository Commandes — écritures transactionnelles dans les
 * tables GesCom natives (source de vérité) :
 *   Commandes · Details_Commandes · Mouvements_Stock · Evenements_Suivi
 */
import type { Prisma } from '@prisma/client';

export interface OrderDetailedItem {
  productId: number;
  quantity: number;
  unitPriceHt: number;
}

export interface NewOrderInput {
  tenantId: number;
  boutiqueId: number;
  clientId: number;
  reference: string;
  statut: string;
  taxRate: number;
  items: OrderDetailedItem[];
  note?: string;
}

export const orderRepository = {
  /**
   * Génère la référence de commande "GE-YYYY-NNNNNN" dans la transaction.
   * La lecture du MAX + incrément se fait au même moment que l'insertion
   * pour minimiser les collisions entre canaux.
   */
  async nextReference(
    tx: Prisma.TransactionClient,
    tenantId: number,
    year: number,
  ): Promise<string> {
    const prefix = `GE-${year}-`;
    const rows = await tx.commandes.findMany({
      where: { id_tenant: tenantId, numero_facture_chrono: { startsWith: prefix } },
      select: { numero_facture_chrono: true },
      orderBy: { numero_facture_chrono: 'desc' },
      take: 50,
    });

    let maxSeq = 0;
    for (const row of rows) {
      const tail = row.numero_facture_chrono?.slice(prefix.length) ?? '';
      const seq = parseInt(tail, 10);
      if (Number.isInteger(seq) && seq > maxSeq) maxSeq = seq;
    }
    const next = maxSeq + 1;
    return `${prefix}${String(next).padStart(6, '0')}`;
  },

  async createOrder(
    tx: Prisma.TransactionClient,
    input: NewOrderInput,
  ): Promise<number> {
    const now = new Date();
    const commande = await tx.commandes.create({
      data: {
        id_tenant: input.tenantId,
        id_boutique: input.boutiqueId,
        id_client: input.clientId,
        numero_facture_chrono: input.reference,
        taux_tva_applicable: Math.round(input.taxRate * 100 * 100) / 100,
        statut: input.statut,
        date_commande: now,
        date_derniere_modification: now,
      },
      select: { id_commande: true },
    });
    return commande.id_commande;
  },

  async addDetail(
    tx: Prisma.TransactionClient,
    input: {
      tenantId: number;
      boutiqueId: number;
      commandeId: number;
      productId: number;
      quantity: number;
      unitPriceHt: number;
    },
  ): Promise<void> {
    await tx.details_Commandes.create({
      data: {
        id_tenant: input.tenantId,
        id_boutique: input.boutiqueId,
        id_commande: input.commandeId,
        id_produit: input.productId,
        quantite: input.quantity,
        prix_vente: Math.round(input.unitPriceHt * 100) / 100,
      },
    });
  },

  async addStockMovement(
    tx: Prisma.TransactionClient,
    input: {
      tenantId: number;
      boutiqueId: number;
      productId: number;
      quantity: number;
      commentaire: string;
    },
  ): Promise<void> {
    await tx.mouvements_Stock.create({
      data: {
        id_tenant: input.tenantId,
        id_boutique: input.boutiqueId,
        id_produit: input.productId,
        type_mouvement: 'Sortie',
        quantite: input.quantity,
        date_mouvement: new Date(),
        commentaire: input.commentaire,
      },
    });
  },

  async addTrackingEvent(
    tx: Prisma.TransactionClient,
    input: {
      tenantId: number;
      boutiqueId: number;
      commandeId: number;
      statut: string;
      libelle: string;
      description?: string;
    },
  ): Promise<void> {
    await tx.evenements_Suivi.create({
      data: {
        id_tenant: input.tenantId,
        id_boutique: input.boutiqueId,
        id_commande: input.commandeId,
        statut: input.statut,
        libelle: input.libelle,
        description: input.description?.slice(0, 255),
        date_evenement: new Date(),
      },
    });
  },
};