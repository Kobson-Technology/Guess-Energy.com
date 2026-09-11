import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { productService } from '@/services/product.service';

// Regénère le sitemap toutes les heures (sinon il est figé au build, sans les produits)
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/a-propos', '/produits', '/boutique', '/services', '/contact', '/devis', '/faq', '/cgu', '/confidentialite', '/panier'].map((path) => ({ url: `${SITE_URL}${path || '/'}`, lastModified: new Date(), changeFrequency: path === '/produits' || path === '/boutique' ? 'daily' as const : 'monthly' as const, priority: path === '' ? 1 : .7 }));
  // Récupère jusqu'à 300 produits (5 pages de 60) pour ne rien laisser hors index.
  const productPages = await Promise.all(
    Array.from({ length: 5 }, (_, i) => productService.list({}, i + 1, 60).catch(() => ({ items: [] }))),
  );
  const products = productPages.flatMap((r) => r.items);
  const categories = await productService.categories().catch(() => []);
  return [...staticRoutes, ...categories.map((c) => ({ url: `${SITE_URL}/categories/${c.slug}`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: .6 })), ...products.map((p) => ({ url: `${SITE_URL}/produits/${p.slug}`, lastModified: p.createdAt ? new Date(p.createdAt) : new Date(), changeFrequency: 'weekly' as const, priority: .5 }))];
}