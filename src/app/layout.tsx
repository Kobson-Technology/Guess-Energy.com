import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { Phone, MessageCircle } from 'lucide-react';
import { CartProvider } from '@/features/cart/CartContext';
import { HeaderClient } from '@/components/layout/HeaderClient';
import { Footer } from '@/components/layout/Footer';
import { ChatBot } from '@/components/chatbot/ChatBot';
import { siteService } from '@/services/site.service';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/constants';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'matériel électrique Côte d\'Ivoire',
    'distributeur matériel électrique Abidjan',
    'panneaux solaires Côte d\'Ivoire',
    'groupe électrogène Abidjan',
    'éclairage public LED',
    'disjoncteur tableau électrique',
    'câble électrique RO2V',
    'batterie solaire lithium',
    'achat matériel électrique Abidjan',
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [{ url: '/logo.png', width: 512, height: 512, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary',
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: '#0a1a33',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const shop = await siteService.getShopInfo().catch(() => null);
  const waNumber = shop?.whatsappNumber ?? '';

  const orgJsonLd = organizationJsonLd(shop);
  const webJsonLd = websiteJsonLd();

  return (
    <html lang="fr" className={manrope.className}>
      <body>
        <CartProvider>
          <div className="topbar">
            <div className="container topbar-inner">
              <span className="topbar-item hide-sm">⚡ Matériel électrique professionnel &amp; particulier</span>
              <span className="topbar-item">
                {shop?.phone && (
                  <a href={`tel:${shop.phone.replace(/\s/g, '')}`}>
                    <Phone size={13} /> {shop.phone}
                  </a>
                )}
              </span>
            </div>
          </div>

          <HeaderClient siteName={SITE_NAME} quoteHref="/devis" />

          <main>{children}</main>

          <Footer
            phone={shop?.phone ?? null}
            email={shop?.email ?? null}
            address={shop?.address ?? null}
            city={shop?.city ?? null}
          />

          {waNumber.length >= 8 && (
            <a
              className="wa-float"
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                'Bonjour GUESS ENERGY SARL, je souhaite un renseignement.',
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact WhatsApp"
            >
              <MessageCircle size={20} />
              <span>WhatsApp</span>
            </a>
          )}

          <ChatBot shop={shop} />

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(webJsonLd) }}
          />
        </CartProvider>
      </body>
    </html>
  );
}