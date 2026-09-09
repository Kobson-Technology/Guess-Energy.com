import Link from 'next/link';
import { FileText, Send, MessageCircle, CheckCircle } from 'lucide-react';
import { QuoteForm } from '@/components/forms/QuoteForm';

export const metadata = {
  title: 'Demander un devis — GUESS ENERGY + SARL',
  description: 'Demandez un devis personnalisé à GUESS ENERGY pour vos besoins en matériel électrique, travaux et installations.',
};

const STEPS = [
  { icon: FileText, title: 'Ajoutez au panier', text: 'Parcourez le catalogue et ajoutez les produits souhaités à votre panier.' },
  { icon: Send, title: 'Envoyez la demande', text: 'Remplissez vos coordonnées et envoyez votre demande de devis.' },
  { icon: MessageCircle, title: 'Recevez votre devis', text: 'Notre équipe vous contacte rapidement avec une proposition adaptée.' },
];

const BENEFITS = [
  'Devis gratuit et sans engagement',
  'Réponse sous 24h ouvrées',
  'Prix compétitifs et transparents',
  'Accompagnement personnalisé',
  'Livraison possible selon zone',
  'Garantie sur tous nos produits',
];

export default function QuotePage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Accueil</Link>
            <span>/</span>
            <span>Devis</span>
          </div>
          <h1>Demander un devis</h1>
          <p>
            Obtenez un devis personnalisé pour vos projets électriques.
            Ajoutez des produits à votre panier et envoyez votre demande en quelques clics.
          </p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head" style={{ textAlign: 'center', justifyContent: 'center', display: 'block' }}>
            <span className="section-kicker">Comment ça marche</span>
            <h2 className="section-title">Un devis en 3 étapes simples</h2>
            <div className="section-divider" style={{ margin: '14px auto 20px' }} />
          </div>
          <div className="quote-steps">
            {STEPS.map((step, i) => (
              <div className="quote-step" key={step.title}>
                <div className="quote-step-number">{i + 1}</div>
                <div className="quote-step-icon">
                  <step.icon size={24} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head" style={{ textAlign: 'center', justifyContent: 'center', display: 'block' }}>
            <span className="section-kicker">Votre devis</span>
            <h2 className="section-title">Récapitulatif et coordonnées</h2>
            <div className="section-divider" style={{ margin: '14px auto 20px' }} />
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Le récapitulatif se met à jour automatiquement selon votre panier.
            </p>
          </div>
          <QuoteForm />
        </div>
      </section>

      <section className="section section-alt" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="quote-benefits">
            <div className="quote-benefits-header">
              <CheckCircle size={24} />
              <h3>Pourquoi demander un devis ?</h3>
            </div>
            <div className="quote-benefits-grid">
              {BENEFITS.map((benefit) => (
                <div key={benefit} className="quote-benefit-item">
                  <CheckCircle size={16} />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}