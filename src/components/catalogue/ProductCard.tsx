import Link from 'next/link';
import { ImageOff } from 'lucide-react';
import { formatFCFA } from '@/lib/utils';
import { AddToCartButton } from '@/components/catalogue/AddToCartButton';
import type { ProductSummary } from '@/types';

export function StockBadge({ available, lowStock }: { available: boolean; lowStock?: boolean }) {
  if (!available) return <span className="badge badge-out">Rupture de stock</span>;
  if (lowStock) return <span className="badge badge-low">Stock limité</span>;
  return <span className="badge badge-in">En stock</span>;
}

export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <article className="product-card">
      <Link href={`/produits/${product.slug}`} className="pc-media" aria-label={product.name}>
        {product.hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl ?? ''} alt={product.name} loading="lazy" />
        ) : (
          <ImageOff size={40} />
        )}
      </Link>
      <div className="pc-body">
        {product.categoryName && <span className="pc-cat">{product.categoryName}</span>}
        <Link href={`/produits/${product.slug}`} className="pc-name">{product.name}</Link>
        {product.reference && <span className="pc-ref">Réf. {product.reference}</span>}
        <span className="pc-price">
          {formatFCFA(product.priceTtc)} <small>TTC</small>
        </span>
        <StockBadge available={product.available} lowStock={product.lowStock} />
        <div className="pc-actions">
          <Link href={`/produits/${product.slug}`} className="btn btn-outline btn-sm">Voir le produit</Link>
          <AddToCartMini product={product} />
        </div>
      </div>
    </article>
  );
}

function AddToCartMini({ product }: { product: ProductSummary }) {
  if (!product.available) {
    return <button className="btn btn-primary btn-sm is-disabled" disabled>Ajouter</button>;
  }
  return (
    <AddToCartButton
      compact
      product={{
        productId: product.id,
        name: product.name,
        slug: product.slug,
        unitPriceTtc: product.priceTtc,
        reference: product.reference,
        hasImage: product.hasImage,
        maxStock: product.stock,
      }}
    />
  );
}

export function ProductGrid({ products }: { products: ProductSummary[] }) {
  return (
    <div className="grid-cards">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export function EmptyCatalogue() {
  return (
    <div className="empty-state">
      <ImageOff size={44} />
      <h3 style={{ color: 'var(--navy-900)', marginBottom: 8 }}>Catalogue en préparation</h3>
      <p style={{ maxWidth: 460, margin: '0 auto' }}>
        Nos produits seront bientôt disponibles en ligne. Ils sont gérés en temps réel depuis notre logiciel de
        gestion Kobson GesCom. Contactez-nous pour vos besoins immédiats.
      </p>
    </div>
  );
}