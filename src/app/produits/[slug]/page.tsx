import Link from 'next/link';
import type { Metadata } from 'next';
import { ImageOff } from 'lucide-react';
import { notFound } from 'next/navigation';
import { productService } from '@/services/product.service';
import { AddToCartButton } from '@/components/catalogue/AddToCartButton';
import { ProductGrid } from '@/components/catalogue/ProductCard';
import { formatFCFA } from '@/lib/utils';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await productService.detailBySlug(slug).catch(() => null);
  if (!product) return { title: 'Produit introuvable', robots: { index: false, follow: false } };
  const description =
    product.description?.replace(/<[^>]+>/g, '').slice(0, 155) ||
    `${product.name} — ${formatFCFA(product.priceTtc)} TTC${product.categoryName ? `, ${product.categoryName.toLowerCase()}` : ''}. Disponible chez GUESS ENERGY SARL, livraison dans toute la Côte d'Ivoire.`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/produits/${product.slug}` },
    openGraph: {
      title: `${product.name} | ${SITE_NAME}`,
      description,
      type: 'website',
      url: `${SITE_URL}/produits/${product.slug}`,
      ...(product.hasImage && product.imageUrl ? { images: [{ url: product.imageUrl, alt: product.name }] } : {}),
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await productService.detailBySlug(slug);
  if (!product) notFound();
  const similar = await productService.similar(product.id, product.categoryId, 4).catch(() => []);
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    ...(product.description ? { description: product.description.replace(/<[^>]+>/g, '').slice(0, 300) } : {}),
    sku: product.reference ?? product.id,
    ...(product.ean13 ? { gtin13: product.ean13 } : {}),
    ...(product.categoryName ? { category: product.categoryName } : {}),
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/produits/${product.slug}`,
      priceCurrency: 'XOF',
      price: product.priceTtc,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
    <section className="section"><div className="container">
      <div className="breadcrumbs"><Link href="/">Accueil</Link><span>/</span><Link href="/produits">Produits</Link><span>/</span><span>{product.name}</span></div>
      <div className="pdp-layout">
        <div className="pdp-media">{product.hasImage ? <img src={product.imageUrl!} alt={product.name}/> : <ImageOff size={56}/>}</div>
        <div className="pdp-info">
          {product.categoryName && <span className="section-kicker">{product.categoryName}</span>}
          <h1>{product.name}</h1>
          {product.reference && <div className="pdp-meta"><span>Référence : <b>{product.reference}</b></span>{product.ean13 && <span>EAN : <b>{product.ean13}</b></span>}</div>}
          <div className="pdp-price">{formatFCFA(product.priceTtc)} <small>TTC</small></div>
          {product.stock !== null && <p style={{ color: product.available ? 'var(--green-600)' : '#c0392b', fontWeight: 700, marginTop: 8 }}>{product.available ? `${Math.floor(product.stock)} unité(s) disponible(s)` : 'Rupture de stock'}</p>}
          {product.available && <AddToCartButton product={{ productId: product.id, name: product.name, slug: product.slug, unitPriceTtc: product.priceTtc, reference: product.reference, hasImage: product.hasImage, maxStock: product.stock }}/>} 
          {product.description && <div className="desc-text" style={{ marginTop: 24 }}>{product.description}</div>}
          {product.features.length > 0 && <table className="features-table"><tbody>{product.features.map((f, i) => <tr key={i}><td>{f.label}</td><td>{f.value}</td></tr>)}</tbody></table>}
        </div>
      </div>
    </div></section>
    {similar.length > 0 && <section className="section" style={{ background: 'var(--bg-soft)' }}><div className="container"><div className="section-head"><h2 className="section-title">Produits similaires</h2></div><ProductGrid products={similar}/></div></section>}
  </>;
}