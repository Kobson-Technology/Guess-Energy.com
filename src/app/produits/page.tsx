import Link from 'next/link';
import type { Metadata } from 'next';
import { Filter, Search, SlidersHorizontal } from 'lucide-react';
import { productService } from '@/services/product.service';
import { ProductGrid, EmptyCatalogue } from '@/components/catalogue/ProductCard';
import { MobileFilters } from '@/components/catalogue/MobileFilters';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants';
import { parseIntSafe } from '@/lib/utils';
import { filteredPageRobots } from '@/lib/seo';

export const revalidate = 60;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * SEO : la page liste (/produits) est indexée avec une description riche ;
 * les pages filtrées (?q=, ?categoryId=, ?available=1) sont en noindex pour
 * éviter le contenu dupliqué et concentrer le budget de crawl.
 */
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const params = await searchParams;
  const q = (Array.isArray(params.q) ? params.q[0] : params.q)?.trim() ?? '';
  const isFiltered = Boolean(
    q || params.categoryId || params.sort || params.available,
  );
  return {
    title: isFiltered
      ? 'Recherche dans le catalogue'
      : 'Catalogue de matériel électrique — Câbles, disjoncteurs, solaire, éclairage',
    description:
      'Catalogue complet GUESS ENERGY : câbles électriques, disjoncteurs et tableaux, éclairage LED et public, panneaux solaires, batteries, groupes électrogènes. Prix TTC en FCFA, stock réel, livraison 24-72h en Côte d\'Ivoire.',
    alternates: { canonical: '/produits' },
    robots: filteredPageRobots(isFiltered),
  };
}

function value(params: Record<string, string | string[] | undefined>, key: string) {
  const v = params[key];
  return Array.isArray(v) ? v[0] : v;
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = value(params, 'q')?.trim() ?? '';
  const page = Math.max(1, parseIntSafe(value(params, 'page'), 1));
  const categoryId = parseIntSafe(value(params, 'categoryId'), 0) || undefined;
  const sortRaw = value(params, 'sort');
  const sort = ['relevance', 'price_asc', 'price_desc', 'newest'].includes(sortRaw ?? '')
    ? (sortRaw as 'relevance' | 'price_asc' | 'price_desc' | 'newest') : undefined;

  const [result, categories] = await Promise.all([
    productService.list({ search: q || undefined, categoryId, sort, inStockOnly: value(params, 'available') === '1' }, page, PAGE_SIZE_DEFAULT).catch(() => ({ items: [], page, pageSize: PAGE_SIZE_DEFAULT, total: 0, totalPages: 1 })),
    productService.categories().catch(() => []),
  ]);

  function linkFor(nextPage: number) {
    const query = new URLSearchParams();
    if (q) query.set('q', q);
    if (categoryId) query.set('categoryId', String(categoryId));
    if (sort) query.set('sort', sort);
    if (value(params, 'available') === '1') query.set('available', '1');
    query.set('page', String(nextPage));
    return `/produits?${query.toString()}`;
  }

  return (
    <>
      <section className="page-hero"><div className="container">
        <div className="breadcrumbs"><Link href="/">Accueil</Link><span>/</span><span>Produits</span></div>
        <h1>Catalogue de matériel électrique</h1>
        <p>Câbles, disjoncteurs, tableaux électriques, éclairage LED et public, panneaux solaires, batteries et groupes électrogènes. Prix TTC et disponibilité mis à jour en continu.</p>
      </div></section>
      <section className="section"><div className="container">
        <div className="toolbar">
          <div className="search-box" style={{ maxWidth: 420, flex: 1 }}><Search size={17}/><span style={{ color: 'var(--muted)', fontSize: 14 }}>{q ? `Résultats pour « ${q} »` : 'Tous les produits'}</span></div>
          <span className="result-count">{result.total} produit{result.total > 1 ? 's' : ''}</span>
          <form><select name="sort" defaultValue={sort ?? ''} aria-label="Trier">
            <option value="">Pertinence</option><option value="price_asc">Prix croissant</option><option value="price_desc">Prix décroissant</option><option value="newest">Nouveautés</option>
          </select><button className="btn btn-outline btn-sm" type="submit"><SlidersHorizontal size={15}/> Trier</button></form>
        </div>
        <div className="catalog-layout">
          <aside className="filters hide-mobile"><fieldset><legend><Filter size={14} style={{ verticalAlign: 'middle' }}/> Catégories</legend>
            <Link href="/produits" className={!categoryId ? 'is-active' : ''}>Toutes les catégories</Link>
            {categories.map((cat) => <Link key={cat.id} href={`/produits?categoryId=${cat.id}`} className={categoryId === cat.id ? 'is-active' : ''}>{cat.name} ({cat.productCount})</Link>)}
          </fieldset><fieldset><legend>Disponibilité</legend><Link href={`/produits?available=1${q ? `&q=${encodeURIComponent(q)}` : ''}`}><span className="check"><input type="checkbox" readOnly checked={value(params, 'available') === '1'}/> En stock uniquement</span></Link></fieldset></aside>
          <div>
            <MobileFilters 
              categories={categories} 
              selectedCategoryId={categoryId} 
              availableOnly={value(params, 'available') === '1'} 
              query={q} 
            />
            {result.items.length ? <ProductGrid products={result.items}/> : <EmptyCatalogue/>}
            {result.totalPages > 1 && <div className="pagination"><Link href={linkFor(Math.max(1, page - 1))}>←</Link>{Array.from({ length: result.totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map((p) => <Link key={p} href={linkFor(p)} className={p === page ? 'is-current' : ''}>{p}</Link>)}<Link href={linkFor(Math.min(result.totalPages, page + 1))}>→</Link></div>}
          </div>
        </div>
      </div></section>
    </>
  );
}