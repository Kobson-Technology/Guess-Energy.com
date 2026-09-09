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
      "REGLES COMMERCIALES : Livraison en Côte d'Ivoire GRATUITE à partir de 100 000 FCFA d'achat, sinon 5 000 FCFA. Délais de 24 à 72h selon la zone. Aucun paiement en ligne : après réception de la commande, l'équipe confirme les modalités par téléphone ou WhatsApp. Horaires : Lundi-Samedi 08h00-18h00, Dimanche fermé. Quatre pôles produits : Électricité Bâtiment, Éclairage Public & Équipements Urbains, Énergie Solaire & Renouvelable, Groupes Électrogènes & Autonomie Énergétique.",
  },
  {
    id: 'salutations',
    always: true,
    keywords: ['bonjour', 'salut', 'bonsoir', 'hello', 'hi', 'coucou', 'hey', 'bonne journee', 'bonne soiree', 'bon matin', 'yo', 'wesh', 'salam', 'salutations'],
    content:
      "SALUTATIONS : Quand l'utilisateur te dit bonjour, salut, bonsoir, hello, hi, coucou, hey, yo, wesh ou toute autre salutation, reponds chaleureusement en te presentant comme l'assistant virtuel de GUESS ENERGY. Propose ton aide de maniere conviviale et suggere quelques sujets : produits, services, devis, livraison, contact. Restis professionnel mais accessible. Exemple : 'Bonjour ! Bienvenue chez GUESS ENERGY. Je suis votre assistant virtuel, comment puis-je vous aider aujourd'hui ? Je peux vous renseigner sur nos produits (electricite, eclairage, solaire, groupes electrogenes), nos services, la livraison ou vous aider a obtenir un devis !'",
  },
  {
    id: 'remerciements',
    always: true,
    keywords: ['merci', 'merci beaucoup', 'thanks', 'thank you', 'je vous remercie', 'tres reconnaissant', 'parfait', 'super', 'excellent', 'genial', 'bravo'],
    content:
      "REMERCIEMENTS : Quand l'utilisateur te dit merci, merci beaucoup, thanks, parfait, super, excellent ou toute autre expression de gratitude, reponds courtoisement en francais. Propose ton aide pour autre chose. Exemple : 'Je vous en prie ! N'hesitez pas si vous avez d'autres questions sur nos produits ou services. Je suis la pour vous aider !'",
  },
  {
    id: 'aurevoir',
    always: true,
    keywords: ['au revoir', 'bye', 'a bientot', 'a plus', 'bonne journee', 'bonne soiree', 'bonne nuit', 'a la prochaine', 'ciao', 'adieu'],
    content:
      "AU REVOIR : Quand l'utilisateur te dit au revoir, bye, a bientot, bonne journee, bonne soiree, ciao ou toute formule de fin, reponds chaleureusement en francais. Souhaite une bonne journee ou une bonne soiree, et invite a revenir. Exemple : 'Au revoir ! Merci de votre visite chez GUESS ENERGY. N'hesitez pas a revenir si vous avez des questions. Excellente journee !'",
  },
  {
    id: 'presentation',
    always: true,
    keywords: ['qui es tu', 'que fais tu', 'que pouvez vous faire', 'aide', 'help', 'que sais tu faire', 'comment ca marche', 'qui etes vous', 'votre role', 'vos fonctions'],
    content:
      "PRESENTATION : Quand l'utilisateur te demande qui tu es, que tu fais, que tu peux faire ou demande de l'aide, explique que tu es l'assistant virtuel de GUESS ENERGY, distributeur de materiel electrique en Cote d'Ivoire. Liste ce que tu peux faire : renseigner sur les produits (electricite, eclairage, solaire, groupes electrogenes), expliquer les services (installation, bureau d'etudes, SAV), donner des infos sur la livraison et les paiements, aider a demander un devis. Invite a poser des questions precises. Sois convivial et professionnel.",
  },  {
    id: 'electricite-batiment',
    keywords: ['electricite', 'batiment', 'residentiel', 'tertiaire', 'distribution', 'protection', 'appareillage'],
    content:
      "ELECTRICITE BATIMENT (Tertiaire & Résidentiel) : Distribution, protection et appareillage du bâtiment. Sous-catégories : Tableaux & Protection Électrique (coffrets, armoires, disjoncteurs Ph+N/bipolaires/tripolaires/tétrapolaires, interrupteurs et disjoncteurs différentiels Type AC/A/Hpi/F, fusibles, parafoudres, contacteurs, télérupteurs, borniers, peignes). Cheminement, Câblage & Connexion (câbles RO2V/HO7VU/HO7VK, fils 1.5 à 10mm², gaines ICTA/annelées, tubes IRL, moulures/plinthes/goulottes PVC, boîtes d'encastrement/dérivation, bornes Wago, dominos). Appareillage & Domotique (interrupteurs simple/va-et-vient/poussoir/double, prises 2P+T étanches IP55, RJ45/TV/Satellite, variateurs/dimmers, thermostats, détecteurs de mouvement/présence).",
  },
  {
    id: 'tableaux-protection',
    keywords: ['tableau', 'coffret', 'armoire', 'disjoncteur', 'differentiel', 'fusible', 'parafoudre', 'contacteur', 'telerupteur', 'bornier', 'peigne'],
    content:
      "TABLEAUX & PROTECTION ELECTRIQUE : Coffrets et armoires électriques (nus ou pré-équipés), disjoncteurs magnétothermiques (Ph+N, bipolaires, tripolaires, tétropolaires), interrupteurs et disjoncteurs différentiels (Type AC, A, Hpi/F), fusibles et porte-fusibles, parafoudres (protection foudre), contacteurs de puissance, télérupteurs, borniers de répartition, peignes d'alimentation horizontaux/verticaux.",
  },
  {
    id: 'cablage-connexion',
    keywords: ['cable', 'fil', 'gaine', 'icta', 'irl', 'moulure', 'plinthe', 'goulotte', 'boite', 'encastrement', 'derivation', 'wago', 'domino', 'borne'],
    content:
      "CHEMINEMENT, CABLE & CONNEXION : Câbles électriques (RO2V, HO7VU, HO7VK, câbles blindés), fils de câblage (1.5mm², 2.5mm², 4mm², 6mm², 10mm² et plus), gaines isolantes (ICTA, annelées) et tubes IRL rigides, moulures/plinthes/goulottes PVC, boîtes d'encastrement (cloisons sèches, maçonnerie), boîtes de dérivation, bornes de connexion rapide (Wago) et dominos.",
  },
  {
    id: 'appareillage-domotique',
    keywords: ['interrupteur', 'prise', 'rj45', 'variateur', 'dimmer', 'thermostat', 'detecteur', 'mouvement', 'presence', 'domotique'],
    content:
      "APPAREILLAGE & DOMOTIQUE : Interrupteurs (simple allumage, va-et-vient, poussoir, double), prises de courant (2P+T, étanches IP55), prises de communication (RJ45, TV, Satellite), variateurs de lumière (dimmers), thermostats d'ambiance, modules de gestion d'énergie, détecteurs de mouvement et de présence intérieurs.",
  },  {
    id: 'eclairage-public',
    keywords: ['eclairage public', 'urbain', 'exterieur', 'ip65', 'ip66', 'ik', 'luminaire', 'lanterne', 'projecteur', 'mast', 'mat'],
    content:
      "ECLAIRAGE PUBLIC & EQUIPEMENTS URBAINS : Matériel robuste à fort indice de protection (IP) et résistance aux impacts (IK) pour l'extérieur. Luminaires & Lanternes (lanternes routières/urbaines LED, projecteurs extérieurs haute puissance LED/iodures métalliques, projecteurs architecturaux, lèche-murs, hublots extérieurs, appliques murales étanches IP65/IP66, bornes lumineuses de balisage). Supports & Infrastructures (mâts cylindro-coniques acier galvanisé/aluminium, crosses de fixation simples/doubles/murales, remontées de câbles, coffrets de pied de mât). Commande & Réseau Public (armoires de commande, cellules photoélectriques, horloges astronomiques, câbles armés souterrains, regards de chaussée, conduits PEHD/gaines rouges).",
  },
  {
    id: 'luminaires-exterieur',
    keywords: ['lanterne', 'projecteur', 'hublot', 'applique', 'lampadaire', 'eclairage exterieur', 'leche-mur', 'balisage', 'borne lumineuse'],
    content:
      "LUMINAIRES EXTERIEURS : Lanternes routières et urbaines à LED, projecteurs extérieurs haute puissance (LED, iodures métalliques), projecteurs architecturaux et lèche-murs, hublots extérieurs et appliques murales étanches (IP65/IP66), bornes lumineuses de balisage pour chemins et parcs.",
  },
  {
    id: 'infrastructures-urbaines',
    keywords: ['mat', 'mast', 'crosse', 'armoire commande', 'cellule photoelectrique', 'horloge astronomique', 'regard', 'pehd', 'gaine rouge'],
    content:
      "INFRASTRUCTURES URBAINES : Mâts cylindro-coniques en acier galvanisé ou aluminium, crosses de fixation (simples, doubles, murales), remontées de câbles et coffrets de pied de mât (coupe-circuit), armoires de commande d'éclairage public (cellules photoélectriques, horloges astronomiques), câbles d'alimentation armés souterrains, regards de chaussée et conduits de protection PEHD (gaines rouges).",
  },  {
    id: 'solaire',
    keywords: ['solaire', 'photovoltaique', 'panneau', 'renouvelable', 'pv', 'monocristallin', 'polycristallin', 'perc', 'n-type'],
    content:
      "ENERGIE SOLAIRE & RENOUVELABLE : Installations photovoltaïques isolées (sites autonomes) ou raccordées au réseau. Production & Capture (panneaux monocristallins, polycristallins, PERC/N-Type, panneaux souples/pliables nomades). Conversion & Gestion (onduleurs réseau String/micro-onduleurs, onduleurs hybrides, convertisseurs Pur Sinus 12V/24V/48V?230V, régulateurs MPPT/PWM). Stockage (batteries Lithium LiFePO4, Gel, AGM, Plomb-Acide stationnaires, BMS). Structures & Protection DC (fixation toitures tuiles/tôle/toit plat, montage au sol, trackers, coffrets DC, fusibles DC, parafoudres DC, câbles solaires UV 4-6mm², connecteurs MC4).",
  },
  {
    id: 'panneaux-solaires',
    keywords: ['panneau solaire', 'photovoltaique', 'monocristallin', 'polycristallin', 'perc', 'n-type', 'souple', 'pliable'],
    content:
      "PANNEAUX SOLAIRES : Monocristallins, polycristallins, technologies PERC et N-Type pour rendement maximal. Panneaux souples ou pliables pour applications nomades. Tous types disponibles selon le projet (résidentiel, industriel, site isolé).",
  },
  {
    id: 'onduleurs-regulateurs',
    keywords: ['onduleur', 'convertisseur', 'regulateur', 'mppt', 'pwm', 'pur sinus', 'hybride', 'micro-onduleur', 'string'],
    content:
      "CONVERSION & GESTION SOLAIRE : Onduleurs réseau (String inverters, micro-onduleurs), onduleurs hybrides (gestion simultanée réseau/panneaux/batteries), convertisseurs de tension Pur Sinus (12V/24V/48V vers 230V), régulateurs de charge solaire (MPPT pour rendement maximal, ou PWM pour petits systèmes).",
  },
  {
    id: 'batteries',
    keywords: ['batterie', 'lithium', 'lifepo4', 'gel', 'agm', 'plomb', 'stockage', 'bms'],
    content:
      "STOCKAGE D'ENERGIE : Batteries Lithium LiFePO4 (norme actuelle, durabilité), batteries Gel et AGM (sans entretien, solaire stationnaire), batteries Plomb-Acide ouvertes (stationnaires), systèmes de gestion de batterie (BMS).",
  },
  {
    id: 'protection-solaire',
    keywords: ['structure solaire', 'fixation', 'toiture', 'tracker', 'coffret dc', 'fusible dc', 'parafoudre dc', 'cable solaire', 'mc4', 'connecteur'],
    content:
      "STRUCTURES & PROTECTION DC : Systèmes de fixation pour toitures (tuiles, tôle ondulée, toit plat), structures au sol et suiveurs solaires (trackers), coffrets de protection DC (interrupteurs-sectionneurs, fusibles DC, parafoudres DC), câbles solaires résistants aux UV (4mm² ou 6mm²), connecteurs étanches type MC4.",
  },  {
    id: 'groupe-electrogene',
    keywords: ['groupe electrogene', 'generateur', 'electrogene', 'secours', 'generatrice', 'kva', 'essence', 'diesel', 'gaz', 'inverter'],
    content:
      "GROUPES ELECTROGENES & AUTONOMIE ENERGETIQUE : Alimentation de secours ou principale. Par type d'énergie : Essence (portables 1-8 kVA), Diesel (professionnels/industriels 5-2000+ kVA), Gaz ou GPL, Inverter (courant stable pour électronique sensible). Configurations : ouverts (locaux techniques), insonorisés (capotage extérieur), mobiles (remorque tractée). Systèmes d'inversion : manuels (commutateurs rotatifs), automatiques (ATS/Normal-Secours), centrales de commande digitales, préchauffage moteur, cuves à carburant externes et pompes de transfert.",
  },
  {
    id: 'groupes-types',
    keywords: ['groupe essence', 'groupe diesel', 'groupe gaz', 'groupe inverter', 'insonorise', 'mobile', 'remorque', 'ouvert'],
    content:
      "TYPES DE GROUPES ELECTROGENES : Essence (portables, 1 à 8 kVA), Diesel (professionnels/industriels, 5 à plus de 2000 kVA), Gaz ou GPL, Inverter (courant stable, idéal électronique sensible). Configurations : ouverts sur châssis (locaux techniques), insonorisés sous capotage (extérieur), mobiles sur remorque tractée.",
  },
  {
    id: 'inverseurs-commandes',
    keywords: ['inverseur de source', 'ats', 'normal secours', 'automatique', 'manuel', 'commutateur', 'centale commande', 'prechauffage', 'cuve', 'pompe transfert'],
    content:
      "INVERSION & COMMANDE : Inverseurs de source manuels (commutateurs rotatifs), inverseurs automatiques ATS/Normal-Secours (démarrage automatique lors d'une coupure), centrales de commande digitales (écrans paramètres moteurs/alternateurs), systèmes de préchauffage moteur (démarrage rapide en hiver), cuves à carburant externes et pompes de transfert automatique.",
  },  {
    id: 'opinions',
    keywords: ['pensez vous', 'pense tu', 'avis', 'opinion', 'recommandation', 'conseil', 'lequel choisir', 'quel est le meilleur', 'que me conseillez vous', 'que recommandez vous'],
    content:
      "CONSEILS ET RECOMMANDATIONS : Quand l'utilisateur demande un conseil, une opinion, une recommandation ou quel produit choisir, tu peux donner des conseils generiques bases sur les categories de produits. Mais pour un conseil personnalise ou un dimensionnement exact (puissance solaire, calibre disjoncteur, taille groupe electrogene), rediriger vers le bureau d'etudes via /devis ou /contact. Ne jamais donner de faux chiffres ou de fausses capacites. Sois honnete et professionnel.",
  },
  {
    id: 'devis',
    keywords: ['devis', 'quote', 'estimation', 'chiffrer', 'dimensionnement'],
    content:
      "DEVIS : Pour demander un devis, l'utilisateur ajoute les produits souhaités à son panier puis utilise la page /devis. Les devis multi-produits sont acceptés. Notre équipe répond sous 24h. Redirige vers /devis pour toute demande de devis ou de dimensionnement (groupes électrogènes, installations solaires, éclairage public).",
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
      "ENTREPRISE : Mission : fournir des matériels fiables et accompagner chaque projet, de l'étude à la mise en œuvre. Engagement qualité : produits sélectionnés, service professionnel, suivi rigoureux. Atouts : qualité, fiabilité, expertise, large catalogue (4 pôles), prix compétitifs. Rediriger vers /a-propos.",
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