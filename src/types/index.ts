/**
 * Types de domaine partagés entre services, API et composants.
 */

// ─── Catalogue ────────────────────────────────────────────────

export interface CategoryDTO {
  id: number;
  name: string;
  slug: string;
  productCount: number;
}

export interface ProductSummary {
  id: number;
  name: string;
  slug: string;
  reference: string | null;
  ean13: string | null;
  categoryId: number | null;
  categoryName: string | null;
  categorySlug: string | null;
  brand: string | null;
  unit: string | null;
  /** Prix unitaire HT (source GesCom). */
  priceHt: number;
  /** Taux de TVA appliqué (décimal, ex : 0.18). */
  taxRate: number;
  /** Prix unitaire TTC calculé côté serveur. */
  priceTtc: number;
  stock: number | null;
  available: boolean;
  lowStock: boolean;
  hasImage: boolean;
  imageUrl: string | null;
  description: string | null;
  features: FeatureItem[];
  status: string;
  createdAt: string | null;
}

export interface FeatureItem {
  label: string;
  value: string;
}

// ─── Panier / Checkout ────────────────────────────────────────

export interface CartItemInput {
  productId: number;
  quantity: number;
}

export interface CartLine extends CartItemInput {
  name: string;
  reference: string | null;
  slug: string;
  unit: string | null;
  unitPriceHt: number;
  unitPriceTtc: number;
  subtotalHt: number;
  subtotalTtc: number;
  stock: number | null;
  available: boolean;
  maxOrderable: number;
  hasImage: boolean;
  imageUrl: string | null;
  /** Message de refus éventuel (stock insuffisant, indisponible…). */
  issue?: string;
}

export interface CartTotals {
  subtotalHt: number;
  taxAmount: number;
  subtotalTtc: number;
  shippingFee: number;
  totalTtc: number;
  freeShippingThreshold: number;
  currency: string;
}

export interface CartValidationResult {
  lines: CartLine[];
  totals: CartTotals;
  valid: boolean;
  issues: CartLine[];
  /** Quantités ajoutées dans la panier côté serveur si nécessaire. */
}

// ─── Client ───────────────────────────────────────────────────

export interface OrderCustomerInput {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  type: 'B2C' | 'B2B';
  company?: string;
  note?: string;
}

// ─── Commande ─────────────────────────────────────────────────

export interface OrderCreateInput {
  customer: OrderCustomerInput;
  items: CartItemInput[];
}

export interface OrderResult {
  orderId: number;
  reference: string;
  status: string;
  currency: string;
  totals: CartTotals;
  lines: OrderResultLine[];
  createdAt: string;
  whatsappUrl: string;
}

export interface OrderResultLine {
  productId: number;
  name: string;
  quantity: number;
  unitPriceHt: number;
  subtotalHt: number;
  subtotalTtc: number;
}

export interface OrderStatusEvent {
  status: string;
  label: string;
  description?: string;
  date: string;
}

// ─── Devis / Contact ──────────────────────────────────────────

export interface QuoteCreateInput {
  nom: string;
  telephone: string;
  email: string;
  entreprise?: string;
  commentaire?: string;
  items: CartItemInput[];
}

export interface QuoteResult {
  reference: string;
  createdAt: string;
  whatsappUrl: string;
  totalTtc: number;
}

export interface ContactCreateInput {
  nom: string;
  email: string;
  telephone?: string;
  sujet: string;
  message: string;
}

// ─── Infos boutique ───────────────────────────────────────────

export interface ShopInfo {
  name: string;
  tagline: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  currency: string;
  taxRate: number;
  whatsappNumber: string;
}

// ─── API commune ──────────────────────────────────────────────

export interface ApiErrorBody {
  error: string;
  code?: string;
  details?: unknown;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}