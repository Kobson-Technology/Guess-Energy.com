import Link from 'next/link';
import { Award, Eye, HardHat, Headphones, Target, Users } from 'lucide-react';

export const metadata = {
  title: 'À propos — GUESS ENERGY + SARL',
  description:
    'Découvrez GUESS ENERGY + SARL, distributeur de matériels électriques, travaux électriques, études, conseils et accompagnement énergétique.',
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Accueil</Link>
            <span>/</span>
            <span>À propos</span>
          </div>
          <h1>
            Une expertise électrique
            <br />
            au service de vos projets
          </h1>
          <p>
            GUESS ENERGY + SARL réunit distribution, travaux électriques, études, conseils et
            accompagnement énergétique.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 850 }}>
            <span className="section-kicker">Notre entreprise</span>
            <h2 className="section-title">Votre partenaire en électricité et énergie</h2>
            <div className="section-divider" />
            <p style={{ marginTop: 18 }}>
              GUESS ENERGY + SARL est distributeur de matériels électriques, en gros et au détail.
              L'entreprise intervient également dans la réalisation de travaux électriques,
              l'installation, la pose et le montage des équipements sur les chantiers.
            </p>
            <p>
              Notre bureau d'études accompagne les clients dans l'analyse de leurs
              besoins, le dimensionnement et le choix de produits adaptés. Nous développons aussi
              des solutions d'éclairage LED, de puissance, de réseau, de secours énergétique et
              d'énergies renouvelables.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="value-grid">
            <div className="value-card">
              <span className="v-icon">
                <Target size={21} />
              </span>
              <h3>Notre mission</h3>
              <p>Fournir des matériels fiables et accompager chaque projet, de l'étude à la mise en œuvre.</p>
            </div>
            <div className="value-card">
              <span className="v-icon">
                <HardHat size={21} />
              </span>
              <h3>Travaux & chantiers</h3>
              <p>Installation, pose, montage et suivi des équipements électriques sur les sites.</p>
            </div>
            <div className="value-card">
              <span className="v-icon">
                <Eye size={21} />
              </span>
              <h3>Études & conseils</h3>
              <p>Analyse des besoins, dimensionnement et orientation vers la solution adaptée.</p>
            </div>
            <div className="value-card">
              <span className="v-icon">
                <Headphones size={21} />
              </span>
              <h3>SAV & maintenance</h3>
              <p>Suivi des travaux, assistance et maintenance après installation.</p>
            </div>
            <div className="value-card">
              <span className="v-icon">
                <Users size={21} />
              </span>
              <h3>Types de clients</h3>
              <p>Particuliers, entreprises, installateurs, collectivités et chantiers de toute envergure.</p>
            </div>
            <div className="value-card">
              <span className="v-icon">
                <Award size={21} />
              </span>
              <h3>Engagement qualité</h3>
              <p>Des produits sélectionnés, un service professionnel et un suivi rigoureux.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-band">
            <div>
              <h2>Pourquoi choisir GUESS ENERGY + SARL ?</h2>
              <p>Qualité, fiabilité, expertise, large catalogue, prix compétitifs et service professionnel.</p>
            </div>
            <Link href="/contact" className="btn btn-gold">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
