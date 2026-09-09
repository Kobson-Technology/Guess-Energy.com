/**
 * Repository Stock — décrément ATOMIQUE avec garde.
 *
 * Pattern critique multi-canal (magasin / Kobson Shop / GUESS ENERGY) :
 *   UPDATE Produits SET stock_actuel = stock_actuel - ?q
 *   WHERE id_produit = ?id AND id_tenant = ?t AND id_boutique = ?b
 *     AND stock_actuel >= ?q          ← garde anti-surenchère
 *
 * Si 0 ligne affectée → le stock est insuffisant : la transaction est annulée.
 * Ce mécanisme empêche de vendre plus que le stock réel (même en concurrence).
 */
import type { Prisma } from '@prisma/client';

export interface StockReservation {
  productId: number;
  quantity: number;
}

export const stockRepository = {
  /**
   * Réserve `quantity` unités de stock de façon atomique.
   * @returns true si la réservation a abouti, false si stock insuffisant.
   */
  async reserve(
    tx: Prisma.TransactionClient,
    productId: number,
    quantity: number,
    tenantId: number,
    boutiqueId: number,
  ): Promise<boolean> {
    const result = await tx.produits.updateMany({
      where: {
        id_produit: productId,
        id_tenant: tenantId,
        id_boutique: boutiqueId,
        stock_actuel: { gte: quantity },
      },
      data: { stock_actuel: { decrement: quantity } },
    });
    return result.count === 1;
  },

  /** Re-stocke (annulation/réduction) — reservé aux corrections. */
  async restore(
    tx: Prisma.TransactionClient,
    productId: number,
    quantity: number,
    tenantId: number,
    boutiqueId: number,
  ): Promise<void> {
    await tx.produits.updateMany({
      where: { id_produit: productId, id_tenant: tenantId, id_boutique: boutiqueId },
      data: { stock_actuel: { increment: quantity } },
    });
  },
};