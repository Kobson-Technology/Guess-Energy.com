import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Confidentialité — GUESS ENERGY + SARL',
  description: 'Politique de confidentialité et protection des données de GUESS ENERGY.',
};

export default function PrivacyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Accueil</Link>
            <span>/</span>
            <span>Confidentialité</span>
          </div>
          <h1>Politique de confidentialité</h1>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 850 }}>
          <div className="value-card" style={{ padding: 28, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'var(--electric-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--electric-600)',
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <div>
                <h2 className="section-title" style={{ fontSize: 20, margin: 0 }}>
                  Protection de vos données
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>
                  Transparence et sécurité
                </p>
              </div>
            </div>
          </div>

          <div className="prose" style={{ marginTop: 24 }}>
            <h2>Données collectées</h2>
            <p>
              Lors d&apos;une commande, d&apos;une demande de devis ou d&apos;un message, nous
              collectons uniquement les informations nécessaires : nom, téléphone, e-mail, adresse et
              contenu de la demande.
            </p>

            <h2>Utilisation</h2>
            <p>
              Ces informations servent à traiter votre demande, vous contacter et assurer le suivi
              commercial dans le système de gestion de GUESS ENERGY.
            </p>

            <h2>Protection</h2>
            <p>
              Les données sont transmises au serveur Next.js et ne sont jamais envoyées directement
              depuis le navigateur vers SQL Server. Les secrets et identifiants de connexion restent
              côté serveur.
            </p>

            <h2>Vos droits</h2>
            <p>
              Vous pouvez demander l&apos;accès, la correction ou la suppression de vos données en
              nous contactant via la page{' '}
              <Link href="/contact" style={{ color: 'var(--electric-600)', fontWeight: 700 }}>
                Contact
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}