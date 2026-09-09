import { streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/services/product.service';
import { siteService } from '@/services/site.service';
import { getRelevantKnowledge } from '@/lib/chatbot-knowledge';

const MAX_HISTORY_MESSAGES = 10;

async function searchRelevantProducts(query: string) {
  try {
    const result = await productService.list({ search: query }, 1, 6);
    return result.items.map((p) => ({
      id: p.id,
      nom: p.name,
      reference: String(p.reference ?? ''),
      prixTtc: Math.round(p.priceTtc),
      enStock: p.available,
      stock: p.stock ?? 0,
      categorie: p.categoryName ?? '',
    }));
  } catch {
    return [];
  }
}

function buildSystemPrompt(products: Array<{ id: number; nom: string; reference: string; prixTtc: number; enStock: boolean; stock: number; categorie: string }>, shop: { phone?: string | null; email?: string | null; address?: string | null; city?: string | null }, query: string) {
  const productContext = products.length > 0
    ? 'CATALOGUE DE PRODUITS DISPONIBLE (donnees reelles, ne jamais inventer de prix ou stock) :\n' + products.map((p) =>
        `- ${p.nom} (ref ${p.reference || ''}) - ${p.prixTtc.toLocaleString('fr-FR')} FCFA TTC${p.enStock ? '' : ' - RUPTURE DE STOCK'} - stock: ${p.stock} - ${p.categorie}`).join('\n') + '\n'
    : '';

  const contactLines = [
    shop.phone ? `Telephone : ${shop.phone.replace(/\s/g, '')}` : null,
    shop.email ? `Email : ${shop.email}` : null,
    (shop.address || shop.city) ? `Adresse : ${[shop.address, shop.city].filter(Boolean).join(', ')}` : null,
  ].filter(Boolean).map((l) => `- ${l}.`).join('\n');

  // WhatsApp dérivé du téléphone de la table Boutiques (format international : 225 + numéro sans le 0)
  const waDigits = (shop.phone ?? '').replace(/\D/g, '');
  const waLine = waDigits.length >= 8
    ? `- WhatsApp : +${waDigits.startsWith('0') ? `225 ${waDigits.slice(1)}` : waDigits}.`
    : null;

  const knowledge = getRelevantKnowledge(query);

  return [
    "Tu es l'assistant virtuel de GUESS ENERGY SARL, distributeur professionnel de materiel electrique en Cote d'Ivoire.",
    "Tu reponds en francais, courtoisement, precisement et de facon concise.",
    "N'utilise PAS de formatage Markdown (pas de **, *, #, listes a puces) : reponds en texte simple, avec des retours a la ligne si necessaire.",
    "",
    "BASE DE CONNAISSANCES (utilise ces informations pour repondre, elles font foi) :",
    knowledge,
    "",
    "COORDONNEES ACTUELLES (source : table Boutiques de la base de donnees, prioritaires sur la base de connaissances si differentes) :",
    contactLines,
    waLine,
    "",
    productContext,
    "REGLE CRITIQUE :",
    "- Si une coordonnee (telephone, email, adresse, WhatsApp) n'apparait PAS dans la liste ci-dessus, ne l'invente JAMAIS : redirige simplement le client vers la page /contact.",
    "- Si le produit demande n'est pas dans le catalogue ci-dessus, ne JAMAIS inventer de prix ni de reference. Reponds honnetement que le produit n'est pas encore reference et propose un devis personnalise via /devis.",
    "- Les prix sont TOUJOURS en FCFA TTC.",
    "- Tu ne peux pas traiter les commandes directement dans le chat : redirige vers /devis ou /contact.",
  ]
    .filter((l) => l !== null && l !== '')
    .join('\n')
    .trim();
}

function buildFallbackText(query: string, shop?: { phone?: string | null; email?: string | null; address?: string | null; city?: string | null }): string {
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const q = norm(query.trim());
  const has = (...keys: string[]) => keys.some((k) => q.includes(norm(k)));
  if (has('produit', 'catalogue', 'acheter'))
    return "Nous proposons une large gamme de materiel electrique : cables, disjoncteurs, tableaux, eclairage LED, groupes electrogenes, panneaux solaires et bien plus. Visitez notre catalogue pour decouvrir tous nos produits !";
  if (has('devis', 'prix', 'cout', 'tarif'))
    return "Pour demander un devis, ajoutez les produits souhaites a votre panier puis rendez-vous sur la page Demander un devis. Notre equipe vous repondra sous 24h !";
  if (has('horaire', 'ouvert', 'heure'))
    return "Nous sommes ouverts du Lundi au Samedi de 08h00 a 18h00. Le dimanche nous sommes fermes. N'hesitez pas a nous contacter par WhatsApp en dehors de ces heures !";
  if (has('contact', 'telephone', 'email', 'adresse')) {
    const parts: string[] = [];
    if (shop?.phone) parts.push(`Telephone ${shop.phone}`);
    if (shop?.email) parts.push(`Email ${shop.email}`);
    if (shop?.address) parts.push(`Adresse ${shop.address}${shop.city ? ` (${shop.city})` : ''}`);
    if (parts.length === 0) parts.push('via notre page /contact');
    else parts.push('WhatsApp 24h/24');
    return `Vous pouvez nous contacter par : ${parts.join(', ')}.`;
  }
  if (has('livraison', 'expedition', 'delai'))
    return "Nous livrons dans toute la Cote d'Ivoire : livraison GRATUITE a partir de 100 000 FCFA, sinon 5 000 FCFA. Delai de 24 a 72h selon la zone.";
  if (has('paiement', 'payer', 'mobile money', 'wave', 'orange money', 'carte'))
    return "Aucun paiement en ligne pour le moment : apres votre commande, notre equipe vous contacte par telephone ou WhatsApp pour confirmer les modalites de paiement et de livraison.";
  if (has('service', 'installation', 'travaux', 'chantier', 'maintenance', 'sav'))
    return "GUESS ENERGY propose : distribution de materiel electrique, travaux electriques (installation, pose, montage), bureau d'etudes et dimensionnement, et service apres-vente. Visitez notre page Services pour en savoir plus !";
  if (has('solaire', 'photovoltaique', 'panneau', 'batterie', 'lithium', 'gel'))
    return "Nous proposons des solutions d'energies renouvelables : panneaux photovoltaiques, convertisseurs solaires et hybrides, regulateurs de charge, batteries lithium et gel. Demandez un devis pour une solution adaptee !";
  if (has('groupe', 'electrogene', 'generateur'))
    return "Nous vendons, installons et mettons en service des groupes electrogenes pour l'energie de secours. Contactez-nous pour un dimensionnement adapte a vos besoins !";
  if (has('stock', 'disponible', 'rupture'))
    return "Les disponibilites affichees sur le site proviennent en temps reel de notre systeme de gestion Kobson GesCom et sont revérifiees au moment de la commande. Pour un produit en rupture, demandez un devis personnalise !";
  if (has('compte', 'inscription', 'connexion'))
    return "Bonne nouvelle : vous pouvez commander sans creer de compte, en tant que visiteur, en laissant simplement vos coordonnees de contact !";
  if (has('annuler', 'modifier', 'suivi', 'suivre'))
    return "Pour modifier ou annuler une commande, contactez notre equipe par telephone ou WhatsApp en precisant votre numero de commande.";
  return "Merci pour votre message ! Je suis l'assistant virtuel de GUESS ENERGY. Comment puis-je vous aider aujourd'hui ?";
}

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  // Infos de la table Boutiques : disponibles pour le prompt IA ET les fallbacks (une seule requete)
  const shop = await siteService.getShopInfo().catch(() => ({})) as { phone?: string | null; email?: string | null; address?: string | null; city?: string | null };

  try {
    const body = await request.json().catch(() => null);
    if (!body || !Array.isArray(body.messages)) {
      return new NextResponse(buildFallbackText('', shop), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }

    const history: Array<{ role: 'user' | 'assistant'; content: string }> = body.messages
      .filter((m: { role?: string; content?: string }) => typeof m.content === 'string' && m.content.trim() !== '')
      .slice(-MAX_HISTORY_MESSAGES)
      .map((m: { role?: string; content?: string }) => ({
        role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: m.content as string,
      }));

    const lastUserQuery = [...history].reverse().find((m) => m.role === 'user')?.content ?? '';

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return new NextResponse(buildFallbackText(lastUserQuery, shop), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }

    const products = await searchRelevantProducts(lastUserQuery);
    // Regroupe les 3 dernières questions de l'utilisateur pour la sélection des connaissances
    const knowledgeQuery = history.filter((m) => m.role === 'user').slice(-3).map((m) => m.content).join(' ');
    const systemPrompt = buildSystemPrompt(products, shop, knowledgeQuery);

    const groq = createGroq({ apiKey: GROQ_API_KEY });

    const result = streamText({
      model: groq('openai/gpt-oss-120b'),
      system: systemPrompt,
      messages: history,
      temperature: 0.5,
      maxOutputTokens: 800,
    });

    return result.toTextStreamResponse({
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    console.error('[API chat]', err);
    return new NextResponse(buildFallbackText('', shop), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
}