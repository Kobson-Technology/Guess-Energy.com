/**
 * Constantes du site GUESS ENERGY + SARL.
 *
 * ⚠️ Firewall côté client :
 * Les variables SANS préfixe NEXT_PUBLIC_ ne sont disponibles que côté serveur
 * (Server Components, API routes, services). Les composants client ne doivent
 * jamais lire directement des secrets : ils reçoivent les valeurs par props.
 */

import { parseIntSafe } from './utils';

const TENANT_ID_ENV = process.env.GUES_TENANT_ID ?? '24';
const BOUTIQUE_ID_ENV = process.env.GUES_BOUTIQUE_ID ?? '3';

/** Tenant GesCom de GUESS ENERGY (source de vérité). */
export const TENANT_ID = parseIntSafe(TENANT_ID_ENV, 24);
/** Boutique GesCom de GUESS ENERGY. */
export const BOUTIQUE_ID = parseIntSafe(BOUTIQUE_ID_ENV, 3);

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'GUESS ENERGY SARL';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/+$/, '');
export const SITE_TAGLINE = 'Votre partenaire en matériel électrique';
export const SITE_DESCRIPTION =
  'GUESS ENERGY + SARL — distributeur professionnel de matériel électrique : câbles, disjoncteurs, tableau électrique, éclairage LED, prises et interrupteurs. Qualité, fiabilité et prix compétitifs.';

/** Numéro WhatsApp (format international sans "+", ex : "22507000000"). */
export const WHATSAPP_NUMBER =
  process.env.WHATSAPP_NUMBER || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

/** Clé API des endpoints d'écriture (optionnelle, forte recommandation en prod). */
export const GUES_API_KEY = process.env.GUES_API_KEY ?? '';

// ─── Logistique ───────────────────────────────────────────────
export const SHIPPING_FEE_DEFAULT = parseIntSafe(process.env.SHIPPING_FEE_DEFAULT ?? '', 5000);
export const FREE_SHIPPING_THRESHOLD = parseIntSafe(process.env.FREE_SHIPPING_THRESHOLD ?? '', 100000);
export const CURRENCY = 'FCFA';

// ─── Catalogue ────────────────────────────────────────────────
export const PAGE_SIZE_DEFAULT = 24;
export const MAX_PAGE_SIZE = 60;
export const MAX_CART_QUANTITY = 999;
export const PRODUCT_IMAGE_PATH_PREFIX = '/api/products';

// ─── Statuts de commande (mappés sur l'existant GesCom) ──────
export const ORDER_STATUS = Object.freeze({
  PENDING: 'En attente', // — GesCom natif
  PAID: 'Payée', // — GesCom natif
} as const);

// ─── Clé localStorage du panier ───────────────────────────────
export const CART_STORAGE_KEY = 'gues-energy.cart.v1';