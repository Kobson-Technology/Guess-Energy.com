import Link from 'next/link';
import { notFound } from 'next/navigation';
import { productService } from '@/services/product.service';
import { parseIdFromSlug } from '@/lib/utils';
import { ProductGrid, EmptyCatalogue } from '@/components/catalogue/ProductCard';

export const revalidate = 60;

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }) {
  const { slug } = await params; const sp = await searchParams; const id = parseIdFromSlug(slug); if (!id) notFound();
  const categories = await productService.categories(); const category = categories.find((c) => c.id === id); if (!category) notFound();
  const page = Math.max(1, Number(sp.page ?? 1) || 1); const products = await productService.list({ categoryId: id }, page, 24).catch(() => ({ items: [], page, pageSize: 24, total: 0, totalPages: 1 }));
  return <><section className="page-hero"><div className="container"><div className="breadcrumbs"><Link href="/">Accueil</Link><span>/</span><Link href="/produits">Produits</Link><span>/</span><span>{category.name}</span></div><h1>{category.name}</h1><p>{category.productCount} produit{category.productCount > 1 ? 's' : ''} dans cette catégorie.</p></div></section><section className="section"><div className="container">{products.items.length ? <ProductGrid products={products.items}/> : <EmptyCatalogue/>}</div></section></>;
}