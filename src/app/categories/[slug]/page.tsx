import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { productService } from '@/services/product.service';
import { parseIdFromSlug } from '@/lib/utils';
import { ProductGrid, EmptyCatalogue } from '@/components/catalogue/ProductCard';
import { SITE_NAME } from '@/lib/constants';
import { breadcrumbJsonLd, categoryJsonLd } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const id = parseIdFromSlug(slug);
  const categories = id ? await productService.categories().catch(() => []) : [];
  const category = categories.find((c) => c.id === id);
  if (!category) return { title: 'Catégorie introuvable', robots: { index: false, follow: false } };
  const description = `${category.name} chez GUESS ENERGY + SARL : ${category.productCount} produit${category.productCount > 1 ? 's' : ''} disponible${category.productCount > 1 ? 's' : ''} en stock, prix TTC affichés, livraison dans toute la Côte d'Ivoire.`;
  return {
    title: `${category.name} — Matériel électrique`,
    description,
    alternates: { canonical: `/categories/${category.slug}` },
    openGraph: {
      title: `${category.name} | ${SITE_NAME}`,
      description,
      url: `/categories/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }) {
  const { slug } = await params; const sp = await searchParams; const id = parseIdFromSlug(slug); if (!id) notFound();
  const categories = await productService.categories(); const category = categories.find((c) => c.id === id); if (!category) notFound();
  const page = Math.max(1, Number(sp.page ?? 1) || 1); const products = await productService.list({ categoryId: id }, page, 24).catch(() => ({ items: [], page, pageSize: 24, total: 0, totalPages: 1 }));
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Accueil', path: '/' },
    { name: 'Produits', path: '/produits' },
    { name: category.name, path: `/categories/${category.slug}` },
  ]);
  const collection = categoryJsonLd(category, products.items);
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />
    <section className="page-hero"><div className="container"><div className="breadcrumbs"><Link href="/">Accueil</Link><span>/</span><Link href="/produits">Produits</Link><span>/</span><span>{category.name}</span></div><h1>{category.name}</h1><p>{category.productCount} produit{category.productCount > 1 ? 's' : ''} dans cette catégorie.</p></div></section><section className="section"><div className="container">{products.items.length ? <ProductGrid products={products.items}/> : <EmptyCatalogue/>}</div></section>
  </>;
}