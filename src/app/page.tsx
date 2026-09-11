import Link from 'next/link';
import {
  ArrowRight, Award, BatteryCharging, Cable, CircleCheckBig, Factory, Headset, Lightbulb,
  Plug, ShieldCheck, Sun, Truck, Wrench, Zap,
} from 'lucide-react';
import { ProductGrid, EmptyCatalogue } from '@/components/catalogue/ProductCard';
import { ProductShowcase, ShowcaseSlide } from '@/components/home/ProductShowcase';
import { productService } from '@/services/product.service';

export const revalidate = 120;

const CATEGORIES_FALLBACK = [
  { label: 'Éclairage public & LED', icon: Lightbulb },
  { label: 'Câbles & réseaux électriques', icon: Cable },
  { label: 'Transformateurs & puissance', icon: Zap },
  { label: 'Groupes électrogènes', icon: Factory },
  { label: 'Solaire & énergies renouvelables', icon: Sun },
  { label: 'Batteries & régulateurs', icon: BatteryCharging },
];

const WHY_US = [
  { icon: Award, title: 'Matériel de qualité', text: 'Des solutions sélectionnées pour répondre aux exigences des installations électriques.' },
  { icon: ShieldCheck, title: 'Fiabilité & sécurité', text: 'Des équipements adaptés aux besoins du bâtiment, des réseaux et de l’énergie.' },
  { icon: Headset, title: 'Études & conseils', text: 'Analyse des besoins, dimensionnement et orientation vers les produits adaptés.' },
  { icon: Wrench, title: 'Travaux électriques', text: 'Installation, pose et montage sur les chantiers, selon les besoins du projet.' },
  { icon: Truck, title: 'Accompagnement', text: 'Un suivi de proximité avant, pendant et après vos travaux.' },
  { icon: BatteryCharging, title: 'Énergie de secours & solaire', text: 'Groupes électrogènes, panneaux, convertisseurs et solutions de stockage.' },
];

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    productService.featured(8).catch(() => []),
    productService.categories().catch(() => []),
  ]);

  const showcaseSlides: ShowcaseSlide[] = products.length > 0
    ? products.slice(0, 5).map((product) => ({
      id: `product-${product.id}`,
      eyebrow: product.categoryName ?? 'Catalogue GUESS ENERGY',
      title: product.name,
      description: product.description ?? 'Une référence disponible dans notre catalogue professionnel de matériel électrique.',
      href: `/produits/${product.slug}`,
      imageUrl: product.imageUrl,
      priceTtc: product.priceTtc,
      reference: product.reference,
      icon: 'power' as const,
      product: true,
    }))
    : [
      { id: 'materiel-01', eyebrow: 'Sélection matériel électrique', title: 'Des équipements pour vos installations', description: 'Découvrez une sélection de matériels électriques proposés par GUESS ENERGY + SARL.', href: '/produits', imageUrl: '/images/materiel/materiel-01.png', icon: 'power' as const, product: false },
      { id: 'materiel-02', eyebrow: 'Éclairage & équipements LED', title: 'Des solutions pensées pour vos projets', description: 'Lampes, ampoules, équipements LED et accessoires pour le bâtiment et les espaces professionnels.', href: '/services', imageUrl: '/images/materiel/materiel-02.png', icon: 'led' as const, product: false },
      { id: 'materiel-03', eyebrow: 'Énergie & puissance', title: 'Fiabilité pour vos besoins électriques', description: 'Matériels, câbles et équipements pour vos installations, réseaux et projets énergétiques.', href: '/services', imageUrl: '/images/materiel/materiel-03.png', icon: 'power' as const, product: false },
      { id: 'materiel-04', eyebrow: 'Solutions professionnelles', title: 'Un accompagnement de proximité', description: 'Distribution, travaux électriques, études, conseils et service après-vente.', href: '/contact', imageUrl: '/images/materiel/materiel-04.png', icon: 'cable' as const, product: false },
    ];

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="section-kicker" style={{ color: 'var(--gold-500)' }}>GUESS ENERGY + SARL</span>
            <h1>
              Matériel électrique, <em>solaire &amp; groupes électrogènes</em> en Côte d'Ivoire
            </h1>
            <p>
              Distribution de matériels électriques, réalisation de travaux, études, conseils et solutions
              d’éclairage, de puissance et d’énergies renouvelables pour les particuliers et les professionnels.
            </p>
            <div className="hero-cta">
              <Link href="/produits" className="btn btn-gold btn-lg">
                Découvrir nos produits <ArrowRight size={18} />
              </Link>
              <Link href="/devis" className="btn btn-ghost-light btn-lg">Demander un devis</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><b>4 pôles</b><span>Distribution, travaux, études, énergie</span></div>
              <div className="hero-stat"><b>LED</b><span>Éclairage bâtiment &amp; public</span></div>
              <div className="hero-stat"><b>Solaire</b><span>Autonomie &amp; stockage</span></div>
            </div>
          </div>
          <ProductShowcase slides={showcaseSlides} />
        </div>
      </section>

      {/* ─── CATÉGORIES ─── */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-kicker">Nos domaines d’intervention</span>
              <h2 className="section-title">Des solutions pour chaque projet</h2>
            </div>
            <Link href="/produits" className="btn btn-outline btn-sm">
              Tout le catalogue <ArrowRight size={15} />
            </Link>
          </div>

          {categories.length > 0 ? (
            <div className="cat-grid">
              {categories.slice(0, 8).map((cat) => (
                <Link key={cat.id} href={`/categories/${cat.slug}`} className="cat-card">
                  <span className="cat-icon"><Zap size={22} /></span>
                  <span>
                    <b>{cat.name}</b>
                    <small>{cat.productCount} produit{cat.productCount > 1 ? 's' : ''}</small>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="cat-grid">
              {CATEGORIES_FALLBACK.map((cat) => (
                <Link key={cat.label} href="/produits" className="cat-card">
                  <span className="cat-icon"><cat.icon size={22} /></span>
                  <span>
                    <b>{cat.label}</b>
                    <small>Découvrir l’offre</small>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── PRODUITS ─── */}
      <section className="section" style={{ background: 'var(--bg-soft)' }}>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-kicker">Nouveautés &amp; sélection</span>
              <h2 className="section-title">Produits disponibles</h2>
              <p className="section-sub">
                Les références, prix et disponibilités sont synchronisés avec notre gestion commerciale Kobson GesCom.
              </p>
            </div>
          </div>
          {products.length > 0 ? <ProductGrid products={products} /> : <EmptyCatalogue />}
        </div>
      </section>

      {/* ─── POURQUOI NOUS ─── */}
      <section className="section">
        <div className="container">
          <div className="section-head" style={{ justifyContent: 'center', textAlign: 'center', display: 'block' }}>
            <span className="section-kicker">Pourquoi nous choisir</span>
            <h2 className="section-title">Pourquoi choisir GUESS ENERGY + SARL ?</h2>
          </div>
          <div className="value-grid">
            {WHY_US.map((item) => (
              <div key={item.title} className="value-card">
                <span className="v-icon"><item.icon size={21} /></span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
          <ul className="check-list" style={{ marginTop: 28 }}>
            {['Distribution gros & détail', 'Travaux électriques', 'Études & dimensionnement', 'Conseil client', 'Éclairage LED', 'Puissance & réseaux', 'Solaire & stockage', 'Service après-vente'].map((label) => (
              <li key={label} className="check-item">
                <CircleCheckBig size={17} /> {label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band">
            <div>
              <h2>Un projet électrique ? Demandez votre devis gratuit.</h2>
              <p>Réponse sous 24h — particuliers, entreprises et chantiers.</p>
            </div>
            <Link href="/devis" className="btn btn-gold btn-lg">
              Demander un devis <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}