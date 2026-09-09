import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { SITE_NAME } from '@/lib/constants';

export function Footer(props: {
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/logo.png" alt={`${SITE_NAME} — logo`} />
            <p style={{ fontSize: 14, lineHeight: 1.7 }}>
              Votre partenaire de confiance en matériel électrique. Qualité, fiabilité et expertise au service des
              particuliers et des professionnels.
            </p>
          </div>

          <div>
            <h4>Entreprise</h4>
            <div className="footer-links">
              <Link href="/a-propos">À propos</Link>
              <Link href="/services">Nos services</Link>
              <Link href="/produits">Catalogue produits</Link>
              <Link href="/boutique">Boutique en ligne</Link>
              <Link href="/devis">Demander un devis</Link>
            </div>
          </div>

          <div>
            <h4>Informations</h4>
            <div className="footer-links">
              <Link href="/faq">Questions fréquentes</Link>
              <Link href="/cgu">Conditions générales</Link>
              <Link href="/confidentialite">Confidentialité</Link>
              <Link href="/contact">Nous contacter</Link>
              <Link href="/panier">Mon panier</Link>
            </div>
          </div>

          <div>
            <h4>Contact</h4>
            {props.phone && (
              <p className="contact-line"><Phone size={16} /> <span>{props.phone}</span></p>
            )}
            {props.email && (
              <p className="contact-line"><Mail size={16} /> <span>{props.email}</span></p>
            )}
            {(props.address || props.city) && (
              <p className="contact-line">
                <MapPin size={16} /> <span>{[props.address, props.city].filter(Boolean).join(', ')}</span>
              </p>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} {SITE_NAME}. Tous droits réservés.</span>
          <span>Alimenté par l&apos;écosystème Kobson GesCom</span>
        </div>
      </div>
    </footer>
  );
}