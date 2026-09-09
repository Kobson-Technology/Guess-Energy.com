/**
 * Service Panier / Inventaire — validation du panier côté serveur.
 * Le panier client (localStorage) n'est JAMAIS fiable :
 * prix, stock et totaux sont toujours recalculés depuis la base.
 */
import { productRepository } from '@/repositories/product.repository';
import { productService } from './product.service';
import { siteRepository } from '@/repositories/category.repository';
import { computeTotals } from '@/lib/pricing';
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE_DEFAULT,
  MAX_CART_QUANTITY,
} from '@/lib/constants';
import type { CartItemInput, CartLine, CartTotals, CartValidationResult } from '@/types';

export const cartService = {
  /**
   * Reconstruit un panier fiable depuis des lignes brutes.
   * - relit les produits en base (existence, prix, stock)
   * - calcule les totaux côté serveur (TVA + livraison)
   */
  async hydrateCart(itemsInput: CartItemInput[]): Promise<CartValidationResult> {
    const items = itemsInput
      .filter((i) => Number.isInteger(i.productId) && i.productId > 0 && Number.isInteger(i.quantity) && i.quantity > 0)
      .map((i) => ({ productId: i.productId, quantity: Math.min(Math.floor(i.quantity), MAX_CART_QUANTITY) }));

    // Agréger les doublons
    const merged = new Map<number, number>();
    for (const item of items) {
      merged.set(item.productId, Math.min((merged.get(item.productId) ?? 0) + item.quantity, MAX_CART_QUANTITY));
    }
    const uniqueItems = Array.from(merged.entries()).map(([productId, quantity]) => ({ productId, quantity }));

    const taxRate = await productService.getTaxRate();
    const rows = await productRepository.findByIds(uniqueItems.map((i) => i.productId));
    if (rows.length === 0) {
      return {
        lines: [],
        totals: emptyTotals(taxRate),
        valid: false,
        issues: [],
      };
    }

    const rowById = new Map(rows.map((r) => [Number(r.id_produit), r]));
    const flags = await productRepository.hasImageFlags(rows.map((r) => Number(r.id_produit)));

    const lines: CartLine[] = [];
    for (const item of uniqueItems) {
      const row = rowById.get(item.productId);
      if (!row) continue;

      const stock = row.stock_actuel === null ? null : Number(row.stock_actuel);
      const available = stock !== null && stock > 0;
      const maxOrderable = stock === null ? 0 : Math.max(0, Math.floor(stock));
      const requestedQty = item.quantity;
      const effectiveQty = Math.min(requestedQty, Math.max(1, maxOrderable));
      const unitPriceHt = Number(row.prix_unitaire_vente_ht);
      const unitPriceTtc = Number((unitPriceHt * (1 + taxRate)).toFixed(2));

      let issue: string | undefined;
      if (!available) issue = 'Rupture de stock';
      else if (requestedQty > maxOrderable) issue = `Stock limité à ${maxOrderable} unité(s)`;

      lines.push({
        productId: Number(row.id_produit),
        quantity: requestedQty,
        name: row.nom_produit,
        reference: row.reference_interne?.trim() || null,
        slug: `${slugifyName(row.nom_produit)}-${Number(row.id_produit)}`,
        unit: row.unite_mesure?.trim() || null,
        unitPriceHt,
        unitPriceTtc,
        subtotalHt: Number((requestedQty * unitPriceHt).toFixed(2)),
        subtotalTtc: Number((requestedQty * unitPriceTtc).toFixed(2)),
        stock,
        available,
        maxOrderable,
        hasImage: flags.get(Number(row.id_produit)) ?? false,
        imageUrl: flags.get(Number(row.id_produit)) ? `/api/products/${Number(row.id_produit)}/image` : null,
        issue,
      });
    }

    const computed = computeTotals(
      lines.map((l) => ({ quantity: l.quantity, unitPriceHt: l.unitPriceHt })),
      taxRate,
      { fee: SHIPPING_FEE_DEFAULT, freeThreshold: FREE_SHIPPING_THRESHOLD },
    );

    const issues = lines.filter((l) => l.issue);
    const totals = {
      ...computed,
      currency: 'FCFA',
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    };
    return {
      lines,
      totals,
      valid: issues.length === 0 && lines.length > 0,
      issues,
    };
  },

  /** Vérifie le stock des lignes SANS construire le panier complet. */
  async checkAvailability(items: CartItemInput[]): Promise<{ ok: boolean; productId: number; requested: number; available: number }[]> {
    const rows = await productRepository.findByIds(items.map((i) => i.productId));
    const map = new Map(rows.map((r) => [Number(r.id_produit), r]));
    return items.map((item) => {
      const row = map.get(item.productId);
      const stock = row?.stock_actuel === null ? null : Number(row?.stock_actuel ?? 0);
      const available = row ? Math.max(0, Math.floor(stock ?? 0)) : 0;
      return {
        productId: item.productId,
        requested: item.quantity,
        available,
        ok: row !== undefined && available >= item.quantity,
      };
    });
  },
};

function slugifyName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

export function emptyTotals(taxRate: number): CartTotals {
  const totals = computeTotals([], taxRate, { fee: SHIPPING_FEE_DEFAULT, freeThreshold: FREE_SHIPPING_THRESHOLD });
  return { ...totals, currency: 'FCFA', freeShippingThreshold: FREE_SHIPPING_THRESHOLD };
}