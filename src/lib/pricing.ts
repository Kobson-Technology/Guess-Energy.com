/**
 * Calcul des totaux panier/commande — fonctions pures (testables).
 * Les prix sont TOUJOURS relus en base côté serveur.
 */
import { round2 } from './utils';

export interface PricingLine {
  quantity: number;
  unitPriceHt: number;
}

export interface ShippingConfig {
  fee: number;
  freeThreshold: number;
}

export interface ComputedTotals {
  subtotalHt: number;
  taxAmount: number;
  subtotalTtc: number;
  shippingFee: number;
  totalTtc: number;
}

/** Soustotal HT d'une ligne. */
export function lineSubtotalHt(quantity: number, unitPriceHt: number): number {
  return round2(quantity * unitPriceHt);
}

/** Soustotal TTC d'une ligne. */
export function lineSubtotalTtc(quantity: number, unitPriceHt: number, taxRate: number): number {
  return round2(lineSubtotalHt(quantity, unitPriceHt) * (1 + taxRate));
}

/**
 * Totaux globaux : HT → TVA → TTC → livraison (gratuite au-delà du seuil).
 */
export function computeTotals(
  lines: PricingLine[],
  taxRate: number,
  shipping: ShippingConfig,
): ComputedTotals {
  const subtotalHt = round2(lines.reduce((acc, line) => acc + lineSubtotalHt(line.quantity, line.unitPriceHt), 0));
  const taxAmount = round2(subtotalHt * taxRate);
  const subtotalTtc = round2(subtotalHt + taxAmount);
  const freeShipping = shipping.freeThreshold > 0 && subtotalTtc >= shipping.freeThreshold;
  const shippingFee = freeShipping ? 0 : shipping.fee;
  const totalTtc = round2(subtotalTtc + shippingFee);
  return { subtotalHt, taxAmount, subtotalTtc, shippingFee, totalTtc };
}