import Link from 'next/link';
import { BatteryCharging, Cable, ClipboardList, Factory, Headphones, Lightbulb, MessageSquare, Ruler, Sun, Truck, Wrench } from 'lucide-react';

export const metadata = {
  title: 'Services — GUESS ENERGY + SARL',
  description: 'Découvrez les services GUESS ENERGY : distribution matériel électrique, travaux, études, éclairage LED, groupes électrogènes, énergies renouvelables, SAV.',
};

const SERVICES = [
  { icon: Cable, title: 'Distribution de matériels électriques', text: 'Vente en gros et au détail de câbles, équipements électriques, matériels de réseau et solutions destinées au bâtiment comme aux professionnels.' },
  { icon: Wrench, title: 'Travaux électriques', text: 'Installation, pose, montage et accompagnement des équipements sur les chantiers.' },
  { icon: Ruler, title: 'Bureau d\'études & dimensionnement', text: 'Analyse des besoins, dimensionnement et orientation vers des produits adaptés et de bonne qualité.' },
  { icon: Lightbulb, title: 'Éclairage public & bâtiment — LED', text: 'Lampes, ampoules économiques, lanternes LED, commandes et systèmes de contrôle d\'allumage.' },
  { icon: Factory, title: 'Groupes électrogènes & énergie de secours', text: 'Vente, installation et mise en service de groupes électrogènes.' },
  { icon: Sun, title: 'Énergies renouvelables', text: 'Panneaux photovoltaïques, convertisseurs solaires et hybrides et régulateurs de charge.' },
  { icon: BatteryCharging, title: 'Batteries & stockage d\'énergie', text: 'Batteries au lithium et batteries au gel pour les installations solaires et le secours énergétique.' },
  { icon: Headphones, title: 'Service après-vente — SAV', text: 'Suivi des travaux, assistance, maintenance et accompagnement après installation.' },
];

const AREAS = [
  'Câbles électriques pour bâtiments et réseaux',
  'Transformateurs haute tension et moyenne tension',
  'Commandes et équipements de transformateurs sur poteaux',
  'Poteaux électriques et équipements de réseau',
  'Lampes, ampoules et lanternes LED',
  'Panneaux photovoltaïques et convertisseurs hybrides',
  'Régulateurs de charge, batteries lithium et batteries gel',
];

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Accueil</Link>
            <span>/</span>
            <span>Services</span>
          </div>
          <h1>Des solutions électriques<br />de la conception au suivi</h1>
          <p>Distribution, travaux, études, éclairage, puissance, solaire et service après-vente : GUESS ENERGY accompagne vos projets de bout en bout.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-kicker">Notre savoir-faire</span>
              <h2 className="section-title">Un accompagnement adapté à chaque besoin</h2>
              <p className="section-sub">Particuliers, entreprises, installateurs et chantiers : nous vous aidons à choisir, installer et maintenir vos solutions électriques.</p>
            </div>
          </div>
          <div className="value-grid">
            {SERVICES.map((s) => (
              <div className="value-card" key={s.title}>
                <span className="v-icon"><s.icon size={21} /></span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, .8fr)', gap: 44, alignItems: 'center' }}>
            <div>
              <span className="section-kicker">Domaines d'intervention</span>
              <h2 className="section-title">Matériel électrique, réseau et énergie</h2>
              <div className="section-divider" />
              <p className="section-sub" style={{ marginTop: 12 }}>Notre expertise couvre notamment les familles de solutions suivantes.</p>
              <ul className="check-list" style={{ marginTop: 24 }}>
                {AREAS.map((area) => (
                  <li key={area} className="check-item"><ClipboardList size={17} />{area}</li>
                ))}
              </ul>
            </div>
            <div className="value-card" style={{ background: 'var(--navy-900)', color: '#fff' }}>
              <span className="v-icon" style={{ background: 'rgba(212,175,55,.16)', color: 'var(--gold-500)' }}>
                <Truck size={21} />
              </span>
              <h3 style={{ color: '#fff' }}>Un projet ou un chantier en préparation ?</h3>
              <p style={{ color: '#c3cede', marginTop: 8 }}>Contactez notre équipe pour un devis ou un accompagnement personnalisé.</p>
              <Link href="/devis" className="btn btn-gold" style={{ marginTop: 18 }}>Demander un devis</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band">
            <div>
              <h2>Besoin d'une étude ou d'une installation ?</h2>
              <p>Échangeons sur votre projet électrique.</p>
            </div>
            <Link href="/contact" className="btn btn-gold">
              <MessageSquare size={17} /> Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}