import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { productService } from '@/services/product.service';

// Regénère le sitemap toutes les heures (sinon il est figé au build, sans les produits)
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/a-propos', '/produits', '/boutique', '/services', '/contact', '/devis', '/faq', '/cgu', '/confidentialite', '/panier'].map((path) => ({ url: `${SITE_URL}${path || '/'}`, lastModified: new Date(), changeFrequency: path === '/produits' || path === '/boutique' ? 'daily' as const : 'monthly' as const, priority: path === '' ? 1 : .7 }));
  const [products, categories] = await Promise.all([productService.list({}, 1, 60).catch(() => ({ items: [] })), productService.categories().catch(() => [])]);
  return [...staticRoutes, ...categories.map((c) => ({ url: `${SITE_URL}/categories/${c.slug}`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: .6 })), ...products.items.map((p) => ({ url: `${SITE_URL}/produits/${p.slug}`, lastModified: p.createdAt ? new Date(p.createdAt) : new Date(), changeFrequency: 'weekly' as const, priority: .5 }))];
}