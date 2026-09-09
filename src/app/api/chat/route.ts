import { streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/services/product.service';
import { siteService } from '@/services/site.service';

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

function buildSystemPrompt(products: Array<{ id: number; nom: string; reference: string; prixTtc: number; enStock: boolean; stock: number; categorie: string }>, shop: { phone?: string | null; email?: string | null; address?: string | null; city?: string | null }) {
  const productContext = products.length > 0
    ? 'CATALOGUE DE PRODUITS DISPONIBLE (donnees reelles, ne jamais inventer de prix ou stock) :\n' + products.map((p) =>
        `- ${p.nom} (ref ${p.reference || ''}) - ${p.prixTtc.toLocaleString('fr-FR')} FCFA TTC${p.enStock ? '' : ' - RUPTURE DE STOCK'} - stock: ${p.stock} - ${p.categorie}`).join('\n') + '\n'
    : '';

  const contactLines = [
    shop.phone ? `Telephone : ${shop.phone.replace(/\s/g, '')}` : null,
    shop.email ? `Email : ${shop.email}` : null,
    (shop.address || shop.city) ? `Adresse : ${[shop.address, shop.city].filter(Boolean).join(', ')}` : null,
  ].filter(Boolean).map((l) => `- ${l}.`).join('\n');

  return [
    "Tu es l'assistant virtuel de GUESS ENERGY SARL, distributeur professionnel de materiel electrique en Cote d'Ivoire.",
    "Tu reponds en francais, courtoisement, precisement et de facon concise.",
    "N'utilise PAS de formatage Markdown (pas de **, *, #, listes a puces) : reponds en texte simple, avec des retours a la ligne si necessaire.",
    "",
    "INFORMATIONS COMMERCIALES :",
    "- Catalogue : materiel electrique (cables, disjoncteurs, tableaux electriques, eclairage LED, groupes electrogenes, panneaux solaires, batteries).",
    "- Livraison en Cote d'Ivoire : GRATUITE a partir de 100 000 FCFA d'achat, sinon 5 000 FCFA.",
    "- Delais de livraison : 24 a 72h selon la zone.",
    "- Paiement : aucun paiement en ligne, confirmation par telephone ou WhatsApp.",
    "- Horaires : Lundi-Samedi 08h00-18h00, Dimanche ferme.",
    "- Pour un devis : /devis. Pour voir les produits : /produits.",
    "- WhatsApp : +225 07 00 00 00 00.",
    contactLines,
    "",
    productContext,
    "REGLE CRITIQUE :",
    "- Si le produit demande n'est pas dans le catalogue ci-dessus, ne JAMAIS inventer de prix ni de reference. Reponds honnetement que le produit n'est pas encore reference et propose un devis personnalise via /devis.",
    "- Les prix sont TOUJOURS en FCFA TTC.",
    "- Tu ne peux pas traiter les commandes directement dans le chat : redirige vers /devis ou /contact.",
  ]
    .filter((l) => l !== '')
    .join('\n')
    .trim();
}

function buildFallbackText(query: string): string {
  const lower = query.toLowerCase().trim();
  if (lower.includes('produit') || lower.includes('catalogue') || lower.includes('acheter'))
    return "Nous proposons une large gamme de materiel electrique : cables, disjoncteurs, tableaux, eclairage LED, groupes electrogenes, panneaux solaires et bien plus. Visitez notre catalogue pour decouvrir tous nos produits !";
  if (lower.includes('devis') || lower.includes('prix') || lower.includes('cout'))
    return "Pour demander un devis, ajoutez les produits souhaitez a votre panier puis rendez-vous sur la page Demander un devis. Notre equipe vous repondra sous 24h !";
  if (lower.includes('horaire') || lower.includes('ouvert') || lower.includes('heure'))
    return "Nous sommes ouverts du Lundi au Samedi de 08h00 a 18h00. Le dimanche nous sommes fermes. N'hesitez pas a nous contacter par WhatsApp en dehors de ces heures !";
  if (lower.includes('contact') || lower.includes('telephone') || lower.includes('email') || lower.includes('adresse'))
    return "Vous pouvez nous contacter par : Telephone +225 07 00 00 00 00, Email contact@guess-energy.ci, Adresse Abidjan (Cote d'Ivoire), WhatsApp 24h/24.";
  if (lower.includes('livraison') || lower.includes('expedition') || lower.includes('delai'))
    return "Nous livrons dans toute la Cote d'Ivoire : livraison GRATUITE a partir de 100 000 FCFA, sinon 5 000 FCFA. Delai de 24 a 72h selon la zone.";
  return "Merci pour votre message ! Je suis l'assistant virtuel de GUESS ENERGY. Comment puis-je vous aider aujourd'hui ?";
}

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !Array.isArray(body.messages)) {
      return new NextResponse(buildFallbackText(''), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }

    const history = body.messages
      .filter((m: { role?: string; content?: string }) => typeof m.content === 'string' && m.content.trim() !== '')
      .slice(-MAX_HISTORY_MESSAGES)
      .map((m: { role?: string; content?: string }) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content as string,
      }));

    const lastUserQuery = [...history].reverse().find((m) => m.role === 'user')?.content ?? '';

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return new NextResponse(buildFallbackText(lastUserQuery), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }

    const shop = await siteService.getShopInfo().catch(() => ({})) as { phone?: string | null; email?: string | null; address?: string | null; city?: string | null };
    const products = await searchRelevantProducts(lastUserQuery);
    const systemPrompt = buildSystemPrompt(products, shop);

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
    return new NextResponse(buildFallbackText(''), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
}
