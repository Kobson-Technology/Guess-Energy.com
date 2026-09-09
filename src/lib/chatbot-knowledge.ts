/**
 * Base de connaissances du chatbot GUESS ENERGY.
 * Chaque entree possede des mots-cles de declenchement (normalises sans accents).
 * Les entrees `always: true` sont toujours injectees dans le prompt systeme ;
 * les autres ne sont ajoutees que si la question de l'utilisateur correspond,
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
      "IDENTITE : GUESS ENERGY + SARL est un distributeur de materiels electriques (gos et detail) en Cote d'Ivoire. L'entreprise realise aussi des travaux electriques (installation, pose, montage sur chantiers), dispose d'un bureau d'etudes (analyse des besoins, dimensionnement) et assure un service apres-vente (SAV, maintenance). Clients : particuliers, entreprises, installateurs, collectivites et chantiers de toute envergure.",
  },
  {
    id: 'regles-commerciales',
    always: true,
    keywords: [],
    content:
      "REGLES COMMERCIALES : Livraison en Cote d'Ivoire GRATUITE a partir de 100 000 FCFA d'achat, sinon 5 000 FCFA. Delais de 24 a 72h selon la zone. Aucun paiement en ligne : apres reception de la commande, l'equipe confirme les modalites par telephone ou WhatsApp. Horaires : Lundi-Samedi 08h00-18h00, Dimanche ferme. Quatre poles produits : Electricite Batiment, Eclairage Public & Equipements Urbains, Energie Solaire & Renouvelable, Groupes Electrogenes & Autonomie Energetique.",
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
  },
  {
    id: 'horaires',
    always: true,
    keywords: ['horaire', 'heure', 'ouvert', 'ferme', 'disponible', 'quand', 'quel horaire', 'vos heures', 'ouverture', 'fermeture', 'travaillez vous', 'etes vous ouvert'],
    content:
      "HORAIRES : GUESS ENERGY est ouvert du Lundi au Samedi de 08h00 a 18h00. Dimanche ferme. En dehors de ces horaires, les clients peuvent laisser un message via WhatsApp ou le formulaire de contact. Les commandes en ligne sont acceptees 24h/24 mais traitees pendant les heures d'ouverture.",
  },
  {
    id: 'localisation',
    always: true,
    keywords: ['ou etes vous', 'adresse', 'localisation', 'situe', 'trouver', 'venir', 'magasin', 'boutique', 'siege', 'bureau', 'coordonnees', 'contact telephone'],
    content:
      "LOCALISATION : GUESS ENERGY est situe en Cote d'Ivoire. Pour l'adresse exacte, le numero de telephone et l'email, consultez la page /contact ou demandez a l'equipe. Les coordonnees affichees sur le site proviennent de la base de donnees officielle de l'entreprise.",
  },
  {
    id: 'emotions',
    always: true,
    keywords: ['colere', 'enerve', 'mecontent', 'insatisfait', 'probleme', 'panne', 'marche pas', 'defectueux', 'casse', 'abime', 'retard', 'trop lent', 'inacceptable', 'arnaque', 'arnaqueur', 'arnaqueurs', 'escroc', 'escroquerie'],
    content:
      "GESTION DES EMOTIONS : Si l'utilisateur exprime de la colere, de la frustration ou une mecontentement, reponds avec empathie et professionnalisme. Excuse-toi pour le desagrement, propose de resoudre le probleme et redirige vers le service client (/contact) ou le SAV. Ne prends pas les choses personnellement. Reste calme, courtois et oriente vers une solution concrete.",
  },
  {
    id: 'clarification',
    always: true,
    keywords: ['comprends pas', 'pas compris', 'explique', 'expliquer', 'detail', 'details', 'precision', 'preciser', 'autre chose', 'autre question', 'different', 'pas clair', 'confus', 'aide moi', 'besoin aide'],
    content:
      "CLARIFICATION : Si l'utilisateur ne comprend pas ou demande plus de details, reformule ta reponse de maniere plus simple et plus claire. Propose des exemples concrets. Si necessaire, decompose ta reponse en etapes. Restis patient et pedagogue. Propose de rediriger vers un conseiller humain si la question est trop technique.",
  },
  {
    id: 'langues',
    always: true,
    keywords: ['anglais', 'english', 'francais', 'french', 'dioula', 'baoule', 'bambara', 'senoufo', 'bete', 'attie', 'malinke', 'wolof', 'espagnol', 'arabe', 'chinois'],
    content:
      "LANGUES : GUESS ENERGY communique principalement en francais. Si l'utilisateur parle une autre langue (anglais, dioula, baoule, etc.), reponds dans la langue demandee si possible, ou propose de le rediriger vers un conseiller qui parle cette langue. Le service client peut etre contacte via WhatsApp pour echange en langue locale.",
  },  {
    id: 'electricite-batiment',
    keywords: ['electricite', 'batiment', 'residentiel', 'tertiaire', 'distribution', 'protection', 'appareillage'],
    content:
      "ELECTRICITE BATIMENT (Tertiaire & Residentiel) : Distribution, protection et appareillage du batiment. Sous-categories : Tableaux & Protection Electrique (coffrets, armoires, disjoncteurs Ph+N/bipolaires/tripolaires/tetrapolaires, interrupteurs et disjoncteurs differentiels Type AC/A/Hpi/F, fusibles, parafoudres, contacteurs, telerupteurs, borniers, peignes). Cheminement, Cablage & Connexion (cables RO2V/HO7VU/HO7VK, fils 1.5 a 10mm2, gaines ICTA/annelees, tubes IRL, moulures/plinthes/goulottes PVC, boites d'encastrement/derivation, bornes Wago, dominos). Appareillage & Domotique (interrupteurs simple/va-et-vient/poussoir/double, prises 2P+T etanches IP55, RJ45/TV/Satellite, variateurs/dimmers, thermostats, detecteurs de mouvement/presence).",
  },
  {
    id: 'tableaux-protection',
    keywords: ['tableau', 'coffret', 'armoire', 'disjoncteur', 'differentiel', 'fusible', 'parafoudre', 'contacteur', 'telerupteur', 'bornier', 'peigne'],
    content:
      "TABLEAUX & PROTECTION ELECTRIQUE : Coffrets et armoires electriques (nus ou pre-equipes), disjoncteurs magnetothermiques (Ph+N, bipolaires, tripolaires, tetrapolaires), interrupteurs et disjoncteurs differentiels (Type AC, A, Hpi/F), fusibles et porte-fusibles, parafoudres (protection foudre), contacteurs de puissance, telerupteurs, borniers de repartition, peignes d'alimentation horizontaux/verticaux.",
  },
  {
    id: 'cablage-connexion',
    keywords: ['cable', 'fil', 'gaine', 'icta', 'irl', 'moulure', 'plinthe', 'goulotte', 'boite', 'encastrement', 'derivation', 'wago', 'domino', 'borne'],
    content:
      "CHEMINEMENT, CABLE & CONNEXION : Cables electriques (RO2V, HO7VU, HO7VK, cables blindes), fils de cablage (1.5mm2, 2.5mm2, 4mm2, 6mm2, 10mm2 et plus), gaines isolantes (ICTA, annelees) et tubes IRL rigides, moulures/plinthes/goulottes PVC, boites d'encastrement (cloisons seches, maconnerie), boites de derivation, bornes de connexion rapide (Wago) et dominos.",
  },
  {
    id: 'appareillage-domotique',
    keywords: ['interrupteur', 'prise', 'rj45', 'variateur', 'dimmer', 'thermostat', 'detecteur', 'mouvement', 'presence', 'domotique'],
    content:
      "APPAREILLAGE & DOMOTIQUE : Interrupteurs (simple allumage, va-et-vient, poussoir, double), prises de courant (2P+T, etanches IP55), prises de communication (RJ45, TV, Satellite), variateurs de lumiere (dimmers), thermostats d'ambiance, modules de gestion d'energie, detecteurs de mouvement et de presence interieurs.",
  },
  {
    id: 'eclairage-public',
    keywords: ['eclairage public', 'urbain', 'exterieur', 'ip65', 'ip66', 'ik', 'luminaire', 'lanterne', 'projecteur', 'mast', 'mat'],
    content:
      "ECLAIRAGE PUBLIC & EQUIPEMENTS URBAINS : Materiel robuste a fort indice de protection (IP) et resistance aux impacts (IK) pour l'exterieur. Luminaires & Lanternes (lanternes routieres/urbaines LED, projecteurs exterieurs haute puissance LED/iodures metalliques, projecteurs architecturaux, leche-murs, hublots exterieurs, appliques murales etanches IP65/IP66, bornes lumineuses de balisage). Supports & Infrastructures (mats cylindro-coniques acier galvanise/aluminium, crosses de fixation simples/doubles/murales, remontees de cables, coffrets de pied de mat). Commande & Reseau Public (armoires de commande, cellules photo-electriques, horloges astronomiques, cables armes souterrains, regards de chaussee, conduits PEHD/gaines rouges).",
  },
  {
    id: 'luminaires-exterieur',
    keywords: ['lanterne', 'projecteur', 'hublot', 'applique', 'lampadaire', 'eclairage exterieur', 'leche-mur', 'balisage', 'borne lumineuse'],
    content:
      "LUMINAIRES EXTERIEURS : Lanternes routieres et urbaines a LED, projecteurs exterieurs haute puissance (LED, iodures metalliques), projecteurs architecturaux et leche-murs, hublots exterieurs et appliques murales etanches (IP65/IP66), bornes lumineuses de balisage pour chemins et parcs.",
  },
  {
    id: 'infrastructures-urbaines',
    keywords: ['mat', 'mast', 'crosse', 'armoire commande', 'cellule photoelectrique', 'horloge astronomique', 'regard', 'pehd', 'gaine rouge'],
    content:
      "INFRASTRUCTURES URBAINES : Mats cylindro-coniques en acier galvanise ou aluminium, crosses de fixation (simples, doubles, murales), remontees de cables et coffrets de pied de mat (coupe-circuit), armoires de commande d'eclairage public (cellules photo-electriques, horloges astronomiques), cables d'alimentation armes souterrains, regards de chaussee et conduits de protection PEHD (gaines rouges).",
  },  {
    id: 'solaire',
    keywords: ['solaire', 'photovoltaique', 'panneau', 'renouvelable', 'pv', 'monocristallin', 'polycristallin', 'perc', 'n-type'],
    content:
      "ENERGIE SOLAIRE & RENOUVELABLE : Installations photovoltaiques isolees (sites autonomes) ou raccordees au reseau. Production & Capture (panneaux monocristallins, polycristallins, PERC/N-Type, panneaux souples/pliables nomades). Conversion & Gestion (onduleurs reseau String/micro-onduleurs, onduleurs hybrides, convertisseurs Pur Sinus 12V/24V/48V->230V, regulateurs MPPT/PWM). Stockage (batteries Lithium LiFePO4, Gel, AGM, Plomb-Acide stationnaires, BMS). Structures & Protection DC (fixation toitures tuiles/tole/toit plat, montage au sol, trackers, coffrets DC, fusibles DC, parafoudres DC, cables solaires UV 4-6mm2, connecteurs MC4).",
  },
  {
    id: 'panneaux-solaires',
    keywords: ['panneau solaire', 'photovoltaique', 'monocristallin', 'polycristallin', 'perc', 'n-type', 'souple', 'pliable'],
    content:
      "PANNEAUX SOLAIRES : Monocristallins, polycristallins, technologies PERC et N-Type pour rendement maximal. Panneaux souples ou pliables pour applications nomades. Tous types disponibles selon le projet (residentiel, industriel, site isole).",
  },
  {
    id: 'onduleurs-regulateurs',
    keywords: ['onduleur', 'convertisseur', 'regulateur', 'mppt', 'pwm', 'pur sinus', 'hybride', 'micro-onduleur', 'string'],
    content:
      "CONVERSION & GESTION SOLAIRE : Onduleurs reseau (String inverters, micro-onduleurs), onduleurs hybrides (gestion simultanee reseau/panneaux/batteries), convertisseurs de tension Pur Sinus (12V/24V/48V vers 230V), regulateurs de charge solaire (MPPT pour rendement maximal, ou PWM pour petits systemes).",
  },
  {
    id: 'batteries',
    keywords: ['batterie', 'lithium', 'lifepo4', 'gel', 'agm', 'plomb', 'stockage', 'bms'],
    content:
      "STOCKAGE D'ENERGIE : Batteries Lithium LiFePO4 (norme actuelle, durabilite), batteries Gel et AGM (sans entretien, solaire stationnaire), batteries Plomb-Acide ouvertes (stationnaires), systemes de gestion de batterie (BMS).",
  },
  {
    id: 'protection-solaire',
    keywords: ['structure solaire', 'fixation', 'toiture', 'tracker', 'coffret dc', 'fusible dc', 'parafoudre dc', 'cable solaire', 'mc4', 'connecteur'],
    content:
      "STRUCTURES & PROTECTION DC : Systemes de fixation pour toitures (tuiles, tole ondulee, toit plat), structures au sol et suiveurs solaires (trackers), coffrets de protection DC (interrupteurs-sectionneurs, fusibles DC, parafoudres DC), cables solaires resistants aux UV (4mm2 ou 6mm2), connecteurs etanches type MC4.",
  },
  {
    id: 'groupe-electrogene',
    keywords: ['groupe electrogene', 'generateur', 'electrogene', 'secours', 'generatrice', 'kva', 'essence', 'diesel', 'gaz', 'inverter'],
    content:
      "GROUPES ELECTROGENES & AUTONOMIE ENERGETIQUE : Alimentation de secours ou principale. Par type d'energie : Essence (portables 1-8 kVA), Diesel (professionnels/industriels 5-2000+ kVA), Gaz ou GPL, Inverter (courant stable pour electronique sensible). Configurations : ouverts (locaux techniques), insonorises (capotage exterieur), mobiles (remorque tractee). Systemes d'inversion : manuels (commutateurs rotatifs), automatiques (ATS/Normal-Secours), centrales de commande digitales, prechauffage moteur, cuves a carburant externes et pompes de transfert.",
  },
  {
    id: 'groupes-types',
    keywords: ['groupe essence', 'groupe diesel', 'groupe gaz', 'groupe inverter', 'insonorise', 'mobile', 'remorque', 'ouvert'],
    content:
      "TYPES DE GROUPES ELECTROGENES : Essence (portables, 1 a 8 kVA), Diesel (professionnels/industriels, 5 a plus de 2000 kVA), Gaz ou GPL, Inverter (courant stable, ideal electronique sensible). Configurations : ouverts sur chassis (locaux techniques), insonorises sous capotage (exterieur), mobiles sur remorque tractee.",
  },
  {
    id: 'inverseurs-commandes',
    keywords: ['inverseur de source', 'ats', 'normal secours', 'automatique', 'manuel', 'commutateur', 'centale commande', 'prechauffage', 'cuve', 'pompe transfert'],
    content:
      "INVERSION & COMMANDE : Inverseurs de source manuels (commutateurs rotatifs), inverseurs automatiques ATS/Normal-Secours (demarrage automatique lors d'une coupure), centrales de commande digitales (ecrans parametres moteurs/alternateurs), systemes de prechauffage moteur (demarrage rapide en hiver), cuves a carburant externes et pompes de transfert automatique.",
  },  {
    id: 'installation',
    keywords: ['installation', 'installer', 'pose', 'montage', 'chantier', 'travaux', 'electricien', 'branchement', 'cablage', 'mise en service', 'raccordement'],
    content:
      "INSTALLATION : GUESS ENERGY propose des services d'installation, de pose et de montage sur chantiers. L'equipe realise les travaux electriques, le cablage, le branchement et la mise en service. Pour un devis d'installation ou une intervention sur chantier, rediriger vers /devis ou /services. Le bureau d'etudes peut analyser les besoins et dimensionner l'installation.",
  },
  {
    id: 'sav',
    keywords: ['sav', 'service apres vente', 'maintenance', 'reparation', 'garantie', 'defaut', 'dysfonctionnement', 'retour', 'echange', 'remboursement', 'SAV'],
    content:
      "SERVICE APRES-VENTE : GUESS ENERGY assure un service apres-vente (SAV) incluant la maintenance, la reparation et le suivi des produits. En cas de defaut, de dysfonctionnement ou de probleme apres l'achat, le client contacte l'equipe via /contact ou WhatsApp. La garantie depend du produit et du fabricant. Le SAV est disponible pendant les heures d'ouverture.",
  },
  {
    id: 'prix',
    keywords: ['prix', 'cout', 'combien', 'tarif', 'budget', 'cher', 'pas cher', 'economique', 'promotion', 'reduction', 'remise', 'solde', 'offre', 'devis gratuit'],
    content:
      "PRIX : Les prix des produits sont affiches en FCFA TTC sur le site. Pour les prix en gros ou les devis personnalises, rediriger vers /devis. Les prix sont relus cote serveur depuis la base Kobson GesCom. Aucune promotion ou reduction n'est affichee sur le site : pour les offres speciales, contacter l'equipe directement.",
  },
  {
    id: 'catalogue',
    keywords: ['catalogue', 'produit', 'produits', 'article', 'articles', 'reference', 'references', 'liste', 'gamme', 'assortiment', 'que vendez vous', 'que proposez vous'],
    content:
      "CATALOGUE : GUESS ENERGY propose 4 poles de produits : 1) Electricite Batiment (tableaux, disjoncteurs, cablage, domotique), 2) Eclairage Public & Equipements Urbains (lanternes, projecteurs, mats), 3) Energie Solaire & Renouvelable (panneaux, onduleurs, batteries), 4) Groupes Electrogenes (essence, diesel, inverter). Visitez /produits pour voir le catalogue complet.",
  },
  {
    id: 'suivi-commande',
    keywords: ['commande', 'commande passee', 'statut commande', 'etat commande', 'livraison', 'delai', 'quand arrive', 'ou est ma commande', 'suivre', 'suivi', 'numero commande', 'reference commande'],
    content:
      "SUIVI DE COMMANDE : Pour suivre une commande, le client doit contacter l'equipe GUESS ENERGY par telephone ou WhatsApp en precisant son numero de commande. Le chatbot ne peut pas acceder au suivi des commandes en temps reel. Rediriger vers /contact ou donner le numero de telephone si disponible.",
  },
  {
    id: 'opinions',
    keywords: ['pensez vous', 'pense tu', 'avis', 'opinion', 'recommandation', 'conseil', 'lequel choisir', 'quel est le meilleur', 'que me conseillez vous', 'que recommandez vous'],
    content:
      "CONSEILS ET RECOMMANDATIONS : Quand l'utilisateur demande un conseil, une opinion, une recommandation ou quel produit choisir, tu peux donner des conseils generiques bases sur les categories de produits. Mais pour un conseil personnalise ou un dimensionnement exact (puissance solaire, calibre disjoncteur, taille groupe electrogene), rediriger vers le bureau d'etudes via /devis ou /contact. Ne jamais donner de faux chiffres ou de fausses capacites. Sois honnete et professionnel.",
  },
  {
    id: 'devis',
    keywords: ['devis', 'quote', 'estimation', 'chiffrer', 'dimensionnement'],
    content:
      "DEVIS : Pour demander un devis, l'utilisateur ajoute les produits souhaites a son panier puis utilise la page /devis. Les devis multi-produits sont acceptes. Notre equipe repond sous 24h. Redirige vers /devis pour toute demande de devis ou de dimensionnement (groupes electrogenes, installations solaires, eclairage public).",
  },
  {
    id: 'commande-sans-compte',
    keywords: ['compte', 'inscription', 'connexion', 'commander sans'],
    content:
      "COMMANDE : Il est possible de commander sans creer de compte, en tant que visiteur, en laissant ses coordonnees de contact. La disponibilite et les prix sont relus cote serveur depuis la base de gestion commerciale Kobson GesCom, et le stock est revrifie au moment de la commande.",
  },
  {
    id: 'modification-commande',
    keywords: ['modifier', 'annuler', 'annulation', 'suivi', 'suivre ma commande'],
    content:
      "SUIVI ET MODIFICATION : Pour modifier ou annuler une commande deja envoyee, le client contacte l'equipe par telephone ou WhatsApp en precisant son numero de commande. Le chatbot ne peut pas traiter les commandes directement : rediriger vers /contact ou /devis.",
  },
  {
    id: 'stock',
    keywords: ['stock', 'disponible', 'disponibilite', 'rupture', 'reellement disponible'],
    content:
      "STOCK : La disponibilite affichee sur le site provient en temps reel de Kobson GesCom, le systeme de gestion commerciale de GUESS ENERGY. Elle est revrifiee au moment de la commande pour eviter de vendre un produit indisponible. Si un produit apparait en rupture, proposer un devis via /devis.",
  },  {
    id: 'paiement',
    keywords: ['paiement', 'payer', 'carte bancaire', 'mobile money', 'orange money', 'wave', 'momo', 'virement', 'especes', 'cash'],
    content:
      "PAIEMENT : Aucun paiement en ligne. Apres reception de la commande, l'equipe contacte le client par telephone ou WhatsApp pour confirmer les modalites de paiement et de livraison.",
  },
  {
    id: 'livraison',
    keywords: ['livraison', 'livrer', 'expedition', 'delai', 'transport', 'abidjan', 'bouake', 'yamoussoukro'],
    content:
      "LIVRAISON : Dans toute la Cote d'Ivoire. GRATUITE a partir de 100 000 FCFA d'achat, sinon 5 000 FCFA. Delais 24 a 72h selon la zone. Les modalites sont confirmees par l'equipe apres commande.",
  },
  {
    id: 'prix-frais',
    keywords: ['frais', 'gratuit', 'tva', 'taxe', 'ttc'],
    content:
      "FRAIS : Livraison gratuite des 100 000 FCFA, sinon 5 000 FCFA. Tous les prix affiches sont en FCFA TTC. Les prix sont relus cote serveur depuis la base GesCom ; le navigateur ne peut pas imposer un prix.",
  },
  {
    id: 'entreprise-pourquoi',
    keywords: ['a propos', 'entreprise', 'qui etes vous', 'mission', 'qualite', 'pourquoi vous choisir', 'societe'],
    content:
      "ENTREPRISE : Mission : fournir des materiels fiables et accompagner chaque projet, de l'etude a la mise en oeuvre. Engagement qualite : produits selectionnes, service professionnel, suivi rigoureux. Atouts : qualite, fiabilite, expertise, large catalogue (4 poles), prix competitifs. Rediriger vers /a-propos.",
  },
];

/**
 * Retourne le bloc de connaissances a injecter dans le prompt systeme :
 * les entrees `always` + les entrees correspondant a la requete.
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