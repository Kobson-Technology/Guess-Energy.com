/** Fonctions utilitaires pures (testables). */

/** Arrondi à 2 décimales, centré sur la précision des montants FCFA. */
export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Arrondi à l'entier supérieur pour les quantités (units). */
export function roundUpQty(value: number): number {
  return Math.ceil(Math.max(0, value));
}

/** Formatage monétaire FCFA : 12500 -> "12 500 FCFA". */
export function formatFCFA(amount: number, withCurrency = true): string {
  const n = round2(amount);
  const formatted = new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(n);
  return withCurrency ? `${formatted} ${CURRENCY_LABEL}` : formatted;
}

const CURRENCY_LABEL = 'FCFA';

/** Slug URL ASCII : "Disjoncteur 20A (3P)" -> "disjoncteur-20a-3p". */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

/** Slug produit stable et unique : "{slug-du-nom}-{id}". */
export function buildProductSlug(name: string, id: number): string {
  return `${slugify(name)}-${id}`;
}

/** Slug catégorie stable et unique. */
export function buildCategorySlug(name: string, id: number): string {
  return `${slugify(name)}-${id}`;
}

/** Extrait l'id produit depuis un slug "...-123". Retourne null si absent. */
export function parseIdFromSlug(slug: string): number | null {
  const match = /-(\d+)$/.exec(slug);
  if (!match) return null;
  const id = Number(match[1]);
  return Number.isInteger(id) && id > 0 ? id : null;
}

/** Encodage JSON sûr. */
export function safeJsonParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Vérifie que la chaîne est un nombre entier strictement positif. */
export function isPositiveInt(value: unknown, max = 1_000_000): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value > 0 &&
    value <= max
  );
}

/** Tronque une chaîne (texte long). */
export function truncate(value: string, max: number): string {
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`;
}

/** Parse sécurisé d'un entier avec repli. */
export function parseIntSafe(value: string | undefined | null, fallback: number): number {
  if (value === undefined || value === null || value.trim() === '') return fallback;
  const n = parseInt(value.trim(), 10);
  return Number.isNaN(n) ? fallback : n;
}