/** Validation serveur (le client n'est jamais fiable). */

export interface FieldError {
  field: string;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value: unknown): boolean {
  return typeof value === 'string' && value.length <= 254 && EMAIL_RE.test(value.trim());
}

/** Téléphone : au moins 8 chiffres (tolère +, espaces, tirets, parenthèses). */
export function isPhone(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

export function isRequiredString(value: unknown, max = 255): boolean {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max;
}

export function clampedLength(value: string, max: number): string {
  return value.trim().slice(0, max);
}

/** Validation des données client de commande. */
export function validateCustomer(input: {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  address?: unknown;
  city?: unknown;
}): FieldError[] {
  const errors: FieldError[] = [];
  if (!isRequiredString(input.name, 150)) {
    errors.push({ field: 'name', message: 'Le nom complet est obligatoire.' });
  }
  if (!isEmail(input.email)) {
    errors.push({ field: 'email', message: 'Adresse e-mail invalide.' });
  }
  if (input.phone !== undefined && input.phone !== null && !isPhone(input.phone)) {
    errors.push({ field: 'phone', message: 'Numéro de téléphone invalide.' });
  }
  if (input.address !== undefined && input.address !== null && !isRequiredString(input.address, 500)) {
    errors.push({ field: 'address', message: 'Adresse invalide ou trop longue.' });
  }
  if (input.city !== undefined && input.city !== null && !isRequiredString(input.city, 100)) {
    errors.push({ field: 'city', message: 'Ville invalide ou trop longue.' });
  }
  return errors;
}

/** Normalise les lignes du panier envoyées par le client (quantités entières > 0). */
export function normalizeCartItems(rawItems: unknown, maxQty: number): { productId: number; quantity: number }[] {
  if (!Array.isArray(rawItems)) return [];
  const seen = new Map<number, number>();
  for (const raw of rawItems) {
    if (!raw || typeof raw !== 'object') continue;
    const obj = raw as Record<string, unknown>;
    const productId = Number(obj.productId ?? obj.idProduit ?? NaN);
    const quantity = Math.floor(Number(obj.quantity ?? NaN));
    if (!Number.isInteger(productId) || productId <= 0) continue;
    if (!Number.isInteger(quantity) || quantity <= 0) continue;
    const qty = Math.min(quantity, maxQty);
    seen.set(productId, (seen.get(productId) ?? 0) + qty);
  }
  return Array.from(seen.entries())
    .filter(([, q]) => q > 0)
    .map(([productId, quantity]) => ({ productId, quantity: Math.min(quantity, maxQty) }));
}

/** Validation du formulaire de contact. */
export function validateContact(input: {
  nom?: unknown;
  email?: unknown;
  telephone?: unknown;
  sujet?: unknown;
  message?: unknown;
}): FieldError[] {
  const errors: FieldError[] = [];
  if (!isRequiredString(input.nom, 150)) errors.push({ field: 'nom', message: 'Votre nom est obligatoire.' });
  if (!isEmail(input.email)) errors.push({ field: 'email', message: 'Adresse e-mail invalide.' });
  if (input.telephone && !isPhone(input.telephone) && input.telephone !== '') errors.push({ field: 'telephone', message: 'Téléphone invalide.' });
  if (!isRequiredString(input.sujet, 100)) errors.push({ field: 'sujet', message: 'Le sujet est obligatoire.' });
  if (!isRequiredString(input.message, 4000)) errors.push({ field: 'message', message: 'Votre message est obligatoire (max 4000 caractères).' });
  return errors;
}

/** Validation du formulaire de devis. */
export function validateQuote(input: {
  nom?: unknown;
  telephone?: unknown;
  email?: unknown;
  entreprise?: unknown;
  commentaire?: unknown;
  hasItems: boolean;
}): FieldError[] {
  const errors: FieldError[] = [];
  if (!isRequiredString(input.nom, 150)) errors.push({ field: 'nom', message: 'Votre nom est obligatoire.' });
  if (!isPhone(input.telephone)) errors.push({ field: 'telephone', message: 'Numéro de téléphone invalide.' });
  if (!isEmail(input.email)) errors.push({ field: 'email', message: 'Adresse e-mail invalide.' });
  if (input.entreprise !== undefined && input.entreprise !== null && !isRequiredString(input.entreprise, 150)) {
    errors.push({ field: 'entreprise', message: 'Nom d’entreprise invalide.' });
  }
  if (!input.hasItems) errors.push({ field: 'items', message: 'Sélectionnez au moins un produit.' });
  return errors;
}