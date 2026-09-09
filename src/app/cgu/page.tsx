import Link from 'next/link';
import { FileText } from 'lucide-react';

export const metadata = {
  title: 'Conditions générales — GUESS ENERGY + SARL',
  description: "Conditions générales d'utilisation du site GUESS ENERGY.",
};

export default function TermsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Accueil</Link>
            <span>/</span>
            <span>CGU</span>
          </div>
          <h1>
            Conditions générales
            <br />
            d&apos;utilisation
          </h1>
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
                <FileText size={22} />
              </div>
              <div>
                <h2 className="section-title" style={{ fontSize: 20, margin: 0 }}>
                  Informations légales
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>
                  Dernière mise à jour : 2026
                </p>
              </div>
            </div>
          </div>

          <div className="prose" style={{ marginTop: 24 }}>
            <h2>Objet</h2>
            <p>
              Le site GUESS ENERGY + SARL présente un catalogue de matériel électrique et permet
              d&apos;envoyer des demandes de commande et de devis.
            </p>

            <h2>Produits et disponibilité</h2>
            <p>
              Les produits, prix et disponibilités proviennent du système de gestion commerciale de
              GUESS ENERGY. Une vérification est effectuée côté serveur avant toute validation de
              commande.
            </p>

            <h2>Commande</h2>
            <p>
              Une commande envoyée via le site constitue une demande de réservation. Elle est
              confirmée par GUESS ENERGY selon la disponibilité et les modalités convenues avec le
              client.
            </p>

            <h2>Responsabilité</h2>
            <p>
              GUESS ENERGY s&apos;efforce de maintenir les informations à jour. Une erreur
              exceptionnelle de prix, de description ou de disponibilité peut être corrigée lors de
              la confirmation.
            </p>

            <h2>Paiement</h2>
            <p>
              Le site ne propose actuellement aucun paiement en ligne. Les modalités de paiement
              sont convenues directement avec le client après confirmation de la commande.
            </p>

            <h2>Contact</h2>
            <p>
              Pour toute question, utilisez la page{' '}
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