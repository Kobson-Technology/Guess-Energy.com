import Link from 'next/link';
import { ArrowRight, BatteryCharging, Cable, Factory, Lightbulb, Sun, Zap, ShieldCheck, Award, Truck, Clock } from 'lucide-react';
import { productService } from '@/services/product.service';
import { siteService } from '@/services/site.service';
import type { ProductSummary } from '@/types';

export const revalidate = 60;

const CATEGORIES_SHOWCASE = [
  { icon: Lightbulb, title: 'Éclairage LED', slug: 'eclairage-led', desc: 'Lampes, ampoules et lanternes LED pour bâtiment et éclairage public.', image: '/images/materiel/materiel-01.png' },
  { icon: Cable, title: 'Câbles & Réseaux', slug: 'cablage-reseaux', desc: 'Câbles électriques pour bâtiments et réseaux, tous types et sections.', image: '/images/materiel/materiel-02.png' },
  { icon: Factory, title: 'Groupes Électrogènes', slug: 'groupes-electrogenes', desc: 'Vente et installation de groupes électrogènes pour le secours en énergie.', image: '/images/materiel/materiel-03.png' },
  { icon: Sun, title: 'Énergies Renouvelables', slug: 'energies-renouvelables', desc: 'Panneaux photovoltaïques, convertisseurs hybrides et régulateurs de charge.', image: '/images/materiel/materiel-04.png' },
  { icon: BatteryCharging, title: 'Batteries & Stockage', slug: 'batteries-stockage', desc: 'Batteries lithium et gel pour installations solaires et secours énergétique.', image: '/images/materiel/materiel-05.png' },
  { icon: Zap, title: 'Protection Électrique', slug: 'protection-electrique', desc: 'Disjoncteurs, tableaux électriques et équipements de protection.', image: '/images/materiel/materiel-06.png' },
];

const ENGAGEMENTS = [
  { icon: ShieldCheck, title: 'Qualité Garantie', desc: 'Des produits sélectionnés selon les normes électriques en vigueur.' },
  { icon: Award, title: 'Expertise Technique', desc: 'Une équipe experte pour vous conseiller et dimensionner vos installations.' },
  { icon: Truck, title: 'Livraison Possible', desc: 'Modalités de livraison à convenir selon votre zone et votre commande.' },
  { icon: Clock, title: 'Disponibilité', desc: 'Un stock réel consultable en ligne, vérifié au moment de la commande.' },
];

async function getFeaturedProducts(): Promise<ProductSummary[]> {
  try {
    const result = await productService.list({}, 1, 8);
    return result.items;
  } catch {
    return [];
  }
}

export default async function BoutiquePage() {
  const [featured, shopInfo] = await Promise.all([
    getFeaturedProducts(),
    siteService.getShopInfo().catch(() => null),
  ]);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Accueil</Link>
            <span>/</span>
            <span>Boutique</span>
          </div>
          <h1>Notre Boutique en Ligne</h1>
          <p>Découvrez notre sélection de matériels électriques professionnels. Qualité, expertise et stock réel au service de vos projets.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            <Link href="/produits" className="btn btn-gold"><ArrowRight size={17}/> Voir tout le catalogue</Link>
            <Link href="/devis" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,.3)', color: '#fff' }}>Demander un devis</Link>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-kicker">Sélection</span>
                <h2 className="section-title">Produits Vedettes</h2>
                <p className="section-sub">Une sélection de produits populaires disponibles actuellement.</p>
              </div>
              <Link href="/produits" className="btn btn-sm btn-outline">Tout voir <ArrowRight size={15}/></Link>
            </div>
            <div className="product-grid">
              {featured.map((product) => (
                <Link key={product.id} href={`/produits/${product.slug}`} className="product-card">
                  <div className="product-image">
                    {product.hasImage ? (
                      <img src={`/api/products/${product.id}/image`} alt={product.name} loading="lazy"/>
                    ) : (
                      <div className="product-image-placeholder"><Zap size={32}/></div>
                    )}
                  </div>
                  <div className="product-info">
                    <span className="product-category">{product.categoryName || 'Produit'}</span>
                    <h3 className="product-name">{product.name}</h3>
                    {product.reference && <span className="product-ref">Réf. : {product.reference}</span>}
                    <div className="product-price-row">
                      <span className="product-price">{product.priceTtc.toLocaleString('fr-FR')} F CFA</span>
                      <span className={`product-stock ${product.available ? 'in-stock' : 'out-of-stock'}`}>
                        {product.available ? 'En stock' : 'Rupture'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-kicker">Catégories</span>
              <h2 className="section-title">Explorer par Univers</h2>
              <p className="section-sub">Trouvez rapidement le matériel électrique adapté à votre besoin.</p>
            </div>
            <Link href="/categories" className="btn btn-sm btn-outline">Toutes les catégories <ArrowRight size={15}/></Link>
          </div>
          <div className="boutique-categories-grid">
            {CATEGORIES_SHOWCASE.map((cat) => (
              <Link key={cat.slug} href={`/categories/${cat.slug}`} className="boutique-category-card">
                <div className="boutique-category-image">
                  <img src={cat.image} alt={cat.title} loading="lazy"/>
                  <div className="boutique-category-overlay">
                    <cat.icon size={28} strokeWidth={1.5}/>
                  </div>
                </div>
                <div className="boutique-category-info">
                  <h3>{cat.title}</h3>
                  <p>{cat.desc}</p>
                  <span className="boutique-category-link">Découvrir <ArrowRight size={14}/></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="section-head" style={{ textAlign: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="section-kicker">Nos Engagements</span>
              <h2 className="section-title">Pourquoi Choisir GUESS ENERGY ?</h2>
              <div className="section-divider" style={{ margin: '14px auto 20px' }}/>
              <p className="section-sub" style={{ maxWidth: 600 }}>Qualité, expertise et service au cœur de chaque projet électrique.</p>
            </div>
          </div>
          <div className="engagements-grid">
            {ENGAGEMENTS.map((eng) => (
              <div key={eng.title} className="engagement-card">
                <div className="engagement-icon"><eng.icon size={24}/></div>
                <h3>{eng.title}</h3>
                <p>{eng.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-band">
            <div>
              <h2>Un Projet Électrique en Cours ?</h2>
              <p>Contactez notre équipe pour un devis personnalisé ou un accompagnement technique.</p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/devis" className="btn btn-gold">Demander un devis</Link>
              <Link href="/contact" className="btn btn-outline">Nous contacter</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}