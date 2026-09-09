/**
 * Base de connaissances du chatbot GUESS ENERGY.
 * Chaque entrée possède des mots-clés de déclenchement (normalisés sans accents).
 * Les entrées `always: true` sont toujours injectées dans le prompt système ;
 * les autres ne sont ajoutées que si la question de l'utilisateur correspond,
 * afin de rester sous les limites de tokens.
 */

export interface KnowledgeEntry {
  id: string;
  keywords: string[];
  content: string;
  always?: boolean;
}

/** Normalisation : minuscules + suppression des accents. */
export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export const KNOWLEDGE_ENTRIES: KnowledgeEntry[] = [
  // ─── Toujours injectées (connaissances fondamentales) ───
  {
    id: 'identite',
    always: true,
    keywords: [],
    content:
      "IDENTITE : GUESS ENERGY + SARL est un distributeur de matériels électriques (gros et détail) en Côte d'Ivoire. L'entreprise réalise aussi des travaux électriques (installation, pose, montage sur chantiers), dispose d'un bureau d'études (analyse des besoins, dimensionnement) et assure un service après-vente (SAV, maintenance). Clients : particuliers, entreprises, installateurs, collectivités et chantiers de toute envergure.",
  },
  {
    id: 'regles-commerciales',
    always: true,
    keywords: [],
    content:
      "REGLES COMMERCIALES : Livraison en Côte d'Ivoire GRATUITE à partir de 100 000 FCFA d'achat, sinon 5 000 FCFA. Délais de 24 à 72h selon la zone. Aucun paiement en ligne : après réception de la commande, l'équipe confirme les modalités par téléphone ou WhatsApp. Horaires : Lundi-Samedi 08h00-18h00, Dimanche fermé. Catalogue : câbles, disjoncteurs, tableaux électriques, éclairage LED, groupes électrogènes, panneaux solaires, batteries, transformateurs.",
  },


  // ─── Entrées thématiques (injectées selon les mots-clés) ───
  {
    id: 'devis',
    keywords: ['devis', 'quote', 'estimation', 'chiffrer'],
    content:
      "DEVIS : Pour demander un devis, l'utilisateur ajoute les produits souhaités à son panier puis utilise la page /devis. Les devis multi-produits sont acceptés. Notre équipe répond sous 24h. Redirige vers /devis pour toute demande de devis.",
  },
  {
    id: 'commande-sans-compte',
    keywords: ['compte', 'inscription', 'connexion', 'commander sans'],
    content:
      "COMMANDE : Il est possible de commander sans créer de compte, en tant que visiteur, en laissant ses coordonnées de contact. La disponibilité et les prix sont relus côté serveur depuis la base de gestion commerciale Kobson GesCom, et le stock est revérifié au moment de la commande.",
  },
  {
    id: 'modification-commande',
    keywords: ['modifier', 'annuler', 'annulation', 'suivi', 'suivre ma commande'],
    content:
      "SUIVI ET MODIFICATION : Pour modifier ou annuler une commande déjà envoyée, le client contacte l'équipe par téléphone ou WhatsApp en précisant son numéro de commande. Le chatbot ne peut pas traiter les commandes directement : rediriger vers /contact ou /devis.",
  },
  {
    id: 'stock',
    keywords: ['stock', 'disponible', 'disponibilite', 'rupture', 'reellement disponible'],
    content:
      "STOCK : La disponibilité affichée sur le site provient en temps réel de Kobson GesCom, le système de gestion commerciale de GUESS ENERGY. Elle est revérifiée au moment de la commande pour éviter de vendre un produit indisponible. Si un produit apparaît en rupture, proposer un devis via /devis.",
  },
  {
    id: 'services',
    keywords: ['service', 'installation', 'travaux', 'chantier', 'pose', 'montage', 'maintenance', 'sav', 'etude', 'dimensionnement', 'conseil'],
    content:
      "SERVICES : 1) Distribution de matériels électriques (gros et détail, bâtiment et professionnels). 2) Travaux électriques : installation, pose, montage et accompagnement des équipements sur chantiers. 3) Bureau d'études : analyse des besoins, dimensionnement, orientation vers des produits adaptés. 4) SAV : suivi des travaux, assistance, maintenance après installation. Rediriger vers /services pour plus de détails.",
  },
  {
    id: 'eclairage',
    keywords: ['eclairage', 'led', 'lampe', 'ampoule', 'lanterne', 'luminaire', 'lampadaire'],
    content:
      "ECLAIRAGE : Lampes, ampoules économiques, lanternes LED, lampadaires, éclairage public et de bâtiment, commandes et systèmes de contrôle d'allumage.",
  },
  {
    id: 'groupe-electrogene',
    keywords: ['groupe electrogene', 'generateur', 'electrogene', 'secours', 'generatrice'],
    content:
      "GROUPES ELECTROGENES : Vente, installation et mise en service de groupes électrogènes pour l'énergie de secours. Proposer un devis via /devis pour un dimensionnement adapté.",
  },
  {
    id: 'solaire',
    keywords: ['solaire', 'photovoltaique', 'panneau', 'renouvelable', 'convertisseur', 'onduleur', 'hybride', 'regulateur'],
    content:
      "ENERGIES RENOUVELABLES : Panneaux photovoltaïques, convertisseurs solaires et hybrides, régulateurs de charge. Solutions complètes d'installation solaire.",
  },
  {
    id: 'batteries',
    keywords: ['batterie', 'lithium', 'gel', 'stockage'],
    content:
      "BATTERIES : Batteries au lithium et batteries au gel pour installations solaires et secours énergétique.",
  },
  {
    id: 'reseau',
    keywords: ['cable', 'transformateur', 'tension', 'poteau', 'reseau'],
    content:
      "RESEAU ELECTRIQUE : Câbles électriques pour bâtiments et réseaux, transformateurs haute tension et moyenne tension, commandes et équipements de transformateurs sur poteaux, poteaux électriques et équipements de réseau.",
  },
  {
    id: 'paiement',
    keywords: ['paiement', 'payer', 'carte bancaire', 'mobile money', 'orange money', 'wave', 'momo', 'virement', 'especes', 'cash'],
    content:
      "PAIEMENT : Aucun paiement en ligne. Après réception de la commande, l'équipe contacte le client par téléphone ou WhatsApp pour confirmer les modalités de paiement et de livraison.",
  },
  {
    id: 'livraison',
    keywords: ['livraison', 'livrer', 'expedition', 'delai', 'transport', 'abidjan', 'bouake', 'yamoussoukro'],
    content:
      "LIVRAISON : Dans toute la Côte d'Ivoire. GRATUITE à partir de 100 000 FCFA d'achat, sinon 5 000 FCFA. Délais 24 à 72h selon la zone. Les modalités sont confirmées par l'équipe après commande.",
  },
  {
    id: 'prix-frais',
    keywords: ['frais', 'gratuit', 'tva', 'taxe', 'ttc'],
    content:
      "FRAIS : Livraison gratuite dès 100 000 FCFA, sinon 5 000 FCFA. Tous les prix affichés sont en FCFA TTC. Les prix sont relus côté serveur depuis la base GesCom ; le navigateur ne peut pas imposer un prix.",
  },
  {
    id: 'entreprise-pourquoi',
    keywords: ['a propos', 'entreprise', 'qui etes vous', 'mission', 'qualite', 'pourquoi vous choisir', 'societe'],
    content:
      "ENTREPRISE : Mission : fournir des matériels fiables et accompagner chaque projet, de l'étude à la mise en œuvre. Engagement qualité : produits sélectionnés, service professionnel, suivi rigoureux. Atouts : qualité, fiabilité, expertise, large catalogue, prix compétitifs. Rediriger vers /a-propos.",
  },
];

/**
 * Retourne le bloc de connaissances à injecter dans le prompt système :
 * les entrées `always` + les entrées thématiques correspondant à la requête.
 */
export function getRelevantKnowledge(query: string, maxMatches = 5): string {
  const q = normalizeText(query || '');
  const matched = KNOWLEDGE_ENTRIES.filter(
    (e) => !e.always && e.keywords.some((k) => q.includes(normalizeText(k))),
  ).slice(0, maxMatches);
  const always = KNOWLEDGE_ENTRIES.filter((e) => e.always);
  const selected = [...always, ...matched];
  return selected.map((e) => '- ' + e.content).join('\n');
}

