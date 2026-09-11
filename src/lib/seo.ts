import { SITE_NAME, SITE_URL } from './constants';
import type { CategoryDTO, ProductSummary } from '@/types';

/**
 * Helpers SEO centralisés : JSON-LD, métadonnées communes.
 * Toutes les URL sont absolues (exigence Google pour les données structurées).
 */

export interface ShopInfoLike {
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  whatsappNumber?: string | null;
}

/** URL absolue à partir d'un chemin relatif. */
export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * JSON-LD BreadcrumbList — fil d'Ariane enrichi dans les SERP Google.
 * @param items Liste ordonnée { name, path? } (path absent = dernier élément courant).
 */
export function breadcrumbJsonLd(items: { name: string; path?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      ...(it.path ? { item: absoluteUrl(it.path) } : {}),
    })),
  };
}

/**
 * JSON-LD WebSite + SearchAction → active la "sitelinks searchbox" de Google
 * (champ de recherche du site directement dans les résultats de recherche).
 */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'fr-FR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/produits?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * JSON-LD Organization enrichi : horaires, zone desservie, contact.
 * Améliore le Knowledge Panel et le référencement local Côte d'Ivoire.
 */
export function organizationJsonLd(shop: ShopInfoLike | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: 'GUESS ENERGY + SARL',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    ...(shop?.phone ? { telephone: shop.phone } : {}),
    ...(shop?.email ? { email: shop.email } : {}),
    address: shop?.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: shop.address,
          ...(shop.city ? { addressLocality: shop.city } : {}),
          addressCountry: 'CI',
        }
      : { '@type': 'PostalAddress', addressCountry: 'CI' },
    areaServed: { '@type': 'Country', name: "Côte d'Ivoire" },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
  };
}

/**
 * JSON-LD CollectionPage + ItemList pour une page catégorie.
 * Google comprend que la page liste des produits (meilleure indexation du catalogue).
 */
export function categoryJsonLd(
  category: Pick<CategoryDTO, 'name' | 'slug'>,
  products: Pick<ProductSummary, 'name' | 'slug'>[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    url: absoluteUrl(`/categories/${category.slug}`),
    isPartOf: { '@id': `${SITE_URL}/#organization` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.name,
        url: absoluteUrl(`/produits/${p.slug}`),
      })),
    },
  };
}

/** Canonical + noindex pour les pages filtrées/recherche (pour éviter le contenu dupliqué). */
export function filteredPageRobots(isFiltered: boolean) {
  return isFiltered ? { index: false, follow: true } : { index: true, follow: true };
}
