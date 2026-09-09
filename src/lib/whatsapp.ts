/** Construction des liens WhatsApp (numéro configurable via variable d’environnement). */
import { WHATSAPP_NUMBER } from './constants';

function normalizeNumber(number: string): string {
  return number.replace(/[^\d]/g, '').replace(/^0+/, '');
}

export function getWhatsAppNumber(): string {
  return normalizeNumber(WHATSAPP_NUMBER);
}

export function hasWhatsApp(): boolean {
  return getWhatsAppNumber().length >= 8;
}

/** Lien wa.me simple. */
export function buildWhatsAppLink(message: string): string {
  const number = getWhatsAppNumber();
  if (!hasWhatsApp()) return '#';
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Message de confirmation de commande (format demandé par GUESS ENERGY).
 */
export function buildOrderWhatsAppMessage(order: {
  reference: string;
  lines: { name: string; quantity: number }[];
  total: string;
  customer?: { name: string; phone?: string };
}): string {
  const productLines = order.lines.map((line) => `- ${line.name} x${line.quantity}`).join('\n');
  const lines: string[] = [
    'Bonjour GUESS ENERGY + SARL,',
    '',
    'Je souhaite passer une commande.',
    '',
    `Commande : ${order.reference}`,
    '',
    'Produits :',
    productLines,
    '',
    `Total : ${order.total}`,
    '',
    order.customer ? `Nom : ${order.customer.name}` : '',
    order.customer?.phone ? `Téléphone : ${order.customer.phone}` : '',
    '',
    'Merci.',
  ];
  return lines.filter(Boolean).join('\n');
}

/** Message de demande de devis. */
export function buildQuoteWhatsAppMessage(payload: {
  reference: string;
  items: string;
  total?: string;
  nom: string;
  telephone?: string;
  entreprise?: string;
}): string {
  const lines: string[] = [
    'Bonjour GUESS ENERGY + SARL,',
    '',
    'Je souhaite une demande de devis.',
    '',
    `Référence : ${payload.reference}`,
    '',
    'Produits :',
    payload.items,
  ];
  if (payload.total) lines.push('', `Estimation : ${payload.total}`);
  lines.push('', `Nom : ${payload.nom}`);
  if (payload.telephone) lines.push(`Téléphone : ${payload.telephone}`);
  if (payload.entreprise) lines.push(`Entreprise : ${payload.entreprise}`);
  lines.push('', 'Merci.');
  return lines.join('\n');
}

/** Message du formulaire de contact. */
export function buildContactWhatsAppMessage(payload: {
  nom: string;
  sujet: string;
  message: string;
  telephone?: string;
  email?: string;
}): string {
  const lines: string[] = [
    `Bonjour GUESS ENERGY + SARL,`,
    '',
    `Sujet : ${payload.sujet}`,
    '',
    payload.message,
    '',
    `Nom : ${payload.nom}`,
    payload.telephone ? `Téléphone : ${payload.telephone}` : '',
    payload.email ? `Email : ${payload.email}` : '',
  ];
  return lines.filter(Boolean).join('\n');
}