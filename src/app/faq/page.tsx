import Link from 'next/link';
import { HelpCircle, MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'FAQ — Questions fréquentes',
  description: 'Questions fréquentes sur les produits, commandes, devis et livraisons de GUESS ENERGY.',
  alternates: { canonical: '/faq' },
};

const FAQ = [
  ['Les produits affichés sont-ils réellement disponibles ?', 'La disponibilité affichée provient de Kobson GesCom, le système de gestion commerciale utilisé par GUESS ENERGY. Elle est revérifiée au moment de la commande.'],
  ['Puis-je commander sans créer de compte ?', 'Oui. Le site permet de passer une commande en tant que visiteur avec vos coordonnées de contact.'],
  ['Comment les prix sont-ils calculés ?', 'Les prix sont relus côté serveur depuis la base GesCom. Le navigateur ne peut pas imposer un prix ou un stock.'],
  ['Quels moyens de paiement sont disponibles ?', 'Le site ne propose actuellement aucun paiement en ligne. Après réception, notre équipe vous contacte pour confirmer les modalités.'],
  ['Puis-je demander un devis pour plusieurs produits ?', 'Oui. Ajoutez les produits concernés à votre panier puis utilisez la page Demander un devis.'],
  ['Proposez-vous la livraison ?', 'La livraison peut être proposée selon la zone et la commande. Les modalités sont confirmées par notre équipe.'],
  ['Comment se passe la vérification du stock ?', "Le stock est vérifié une première fois à l'affichage, puis une nouvelle fois au moment de la commande côté serveur. Cela évite de vendre un produit indisponible."],
  ['Puis-je modifier ma commande après envoi ?', 'Contactez notre équipe par téléphone ou WhatsApp avec votre numéro de commande pour toute modification.'],
];

// Données structurées FAQPage : extraits enrichis dans les résultats Google
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Accueil</Link>
            <span>/</span>
            <span>FAQ</span>
          </div>
          <h1>Questions fréquentes</h1>
          <p>Les réponses aux questions les plus courantes sur nos produits et services.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 850 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--electric-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--electric-600)' }}>
              <HelpCircle size={22} />
            </div>
            <div>
              <h2 className="section-title" style={{ fontSize: 22, margin: 0 }}>Besoin d'aide ?</h2>
              <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>Consultez les réponses ci-dessous ou contactez-nous directement.</p>
            </div>
          </div>
          {FAQ.map(([q, a]) => (
            <details className="faq-item" key={q}>
              <summary>{q}</summary>
              <div className="faq-body">{a}</div>
            </details>
          ))}
        </div>
      </section>

      <section className="section section-alt" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band">
            <div>
              <h2>Vous avez une autre question ?</h2>
              <p>Notre équipe est disponible pour vous répondre.</p>
            </div>
            <Link href="/contact" className="btn btn-gold">
              <MessageCircle size={17} /> Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}