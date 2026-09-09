/**
 * Base de connaissances du chatbot GUESS ENERGY.
 * Chaque entr�e poss�de des mots-cl�s de d�clenchement (normalis�s sans accents).
 * Les entr�es `always: true` sont toujours inject�es dans le prompt syst�me ;
 * les autres ne sont ajout�es que si la question de l'utilisateur correspond,
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
      "IDENTITE : GUESS ENERGY + SARL est un distributeur de mat�riels �lectriques (gros et d�tail) en C�te d'Ivoire. L'entreprise r�alise aussi des travaux �lectriques (installation, pose, montage sur chantiers), dispose d'un bureau d'�tudes (analyse des besoins, dimensionnement) et assure un service apr�s-vente (SAV, maintenance). Clients : particuliers, entreprises, installateurs, collectivit�s et chantiers de toute envergure.",
  },
  {
    id: 'regles-commerciales',
    always: true,
    keywords: [],
    content:
      "REGLES COMMERCIALES : Livraison en C�te d'Ivoire GRATUITE � partir de 100 000 FCFA d'achat, sinon 5 000 FCFA. D�lais de 24 � 72h selon la zone. Aucun paiement en ligne : apr�s r�ception de la commande, l'�quipe confirme les modalit�s par t�l�phone ou WhatsApp. Horaires : Lundi-Samedi 08h00-18h00, Dimanche ferm�. Quatre p�les produits : �lectricit� B�timent, �clairage Public & �quipements Urbains, �nergie Solaire & Renouvelable, Groupes �lectrog�nes & Autonomie �nerg�tique.",
  },
  {
    id: 'electricite-batiment',
    keywords: ['electricite', 'batiment', 'residentiel', 'tertiaire', 'distribution', 'protection', 'appareillage'],
    content:
      "ELECTRICITE BATIMENT (Tertiaire & R�sidentiel) : Distribution, protection et appareillage du b�timent. Sous-cat�gories : Tableaux & Protection �lectrique (coffrets, armoires, disjoncteurs Ph+N/bipolaires/tripolaires/t�trapolaires, interrupteurs et disjoncteurs diff�rentiels Type AC/A/Hpi/F, fusibles, parafoudres, contacteurs, t�l�rupteurs, borniers, peignes). Cheminement, C�blage & Connexion (c�bles RO2V/HO7VU/HO7VK, fils 1.5 � 10mm�, gaines ICTA/annel�es, tubes IRL, moulures/plinthes/goulottes PVC, bo�tes d'encastrement/d�rivation, bornes Wago, dominos). Appareillage & Domotique (interrupteurs simple/va-et-vient/poussoir/double, prises 2P+T �tanches IP55, RJ45/TV/Satellite, variateurs/dimmers, thermostats, d�tecteurs de mouvement/pr�sence).",
  },
  {
    id: 'tableaux-protection',
    keywords: ['tableau', 'coffret', 'armoire', 'disjoncteur', 'differentiel', 'fusible', 'parafoudre', 'contacteur', 'telerupteur', 'bornier', 'peigne'],
    content:
      "TABLEAUX & PROTECTION ELECTRIQUE : Coffrets et armoires �lectriques (nus ou pr�-�quip�s), disjoncteurs magn�tothermiques (Ph+N, bipolaires, tripolaires, t�trapolaires), interrupteurs et disjoncteurs diff�rentiels (Type AC, A, Hpi/F), fusibles et porte-fusibles, parafoudres (protection foudre), contacteurs de puissance, t�l�rupteurs, borniers de r�partition, peignes d'alimentation horizontaux/verticaux.",
  },
  {
    id: 'cablage-connexion',
    keywords: ['cable', 'fil', 'gaine', 'icta', 'irl', 'moulure', 'plinthe', 'goulotte', 'boite', 'encastrement', 'derivation', 'wago', 'domino', 'borne'],
    content:
      "CHEMINEMENT, CABLE & CONNEXION : C�bles �lectriques (RO2V, HO7VU, HO7VK, c�bles blind�s), fils de c�blage (1.5mm�, 2.5mm�, 4mm�, 6mm�, 10mm� et plus), gaines isolantes (ICTA, annel�es) et tubes IRL rigides, moulures/plinthes/goulottes PVC, bo�tes d'encastrement (cloisons s�ches, ma�onnerie), bo�tes de d�rivation, bornes de connexion rapide (Wago) et dominos.",
  },
  {
    id: 'appareillage-domotique',
    keywords: ['interrupteur', 'prise', 'rj45', 'variateur', 'dimmer', 'thermostat', 'detecteur', 'mouvement', 'presence', 'domotique'],
    content:
      "APPAREILLAGE & DOMOTIQUE : Interrupteurs (simple allumage, va-et-vient, poussoir, double), prises de courant (2P+T, �tanches IP55), prises de communication (RJ45, TV, Satellite), variateurs de lumi�re (dimmers), thermostats d'ambiance, modules de gestion d'�nergie, d�tecteurs de mouvement et de pr�sence int�rieurs.",
  },
  {
    id: 'eclairage-public',
    keywords: ['eclairage public', 'urbain', 'exterieur', 'ip65', 'ip66', 'ik', 'luminaire', 'lanterne', 'projecteur', 'mast', 'mat'],
    content:
      "ECLAIRAGE PUBLIC & EQUIPEMENTS URBAINS : Mat�riel robuste � fort indice de protection (IP) et r�sistance aux impacts (IK) pour l'ext�rieur. Luminaires & Lanternes (lanternes routi�res/urbaines LED, projecteurs ext�rieurs haute puissance LED/iodures m�talliques, projecteurs architecturaux, l�che-murs, hublots ext�rieurs, appliques murales �tanches IP65/IP66, bornes lumineuses de balisage). Supports & Infrastructures (m�ts cylindro-coniques acier galvanis�/aluminium, crosses de fixation simples/doubles/murales, remont�es de c�bles, coffrets de pied de m�t). Commande & R�seau Public (armoires de commande, cellules photo�lectriques, horloges astronomiques, c�bles arm�s souterrains, regards de chauss�e, conduits PEHD/gaines rouges).",
  },
  {
    id: 'luminaires-exterieur',
    keywords: ['lanterne', 'projecteur', 'hublot', 'applique', 'lampadaire', 'eclairage exterieur', 'leche-mur', 'balisage', 'borne lumineuse'],
    content:
      "LUMINAIRES EXTERIEURS : Lanternes routi�res et urbaines � LED, projecteurs ext�rieurs haute puissance (LED, iodures m�talliques), projecteurs architecturaux et l�che-murs, hublots ext�rieurs et appliques murales �tanches (IP65/IP66), bornes lumineuses de balisage pour chemins et parcs.",
  },
  {
    id: 'infrastructures-urbaines',
    keywords: ['mat', 'mast', 'crosse', 'armoire commande', 'cellule photoelectrique', 'horloge astronomique', 'regard', 'pehd', 'gaine rouge'],
    content:
      "INFRASTRUCTURES URBAINES : M�ts cylindro-coniques en acier galvanis� ou aluminium, crosses de fixation (simples, doubles, murales), remont�es de c�bles et coffrets de pied de m�t (coupe-circuit), armoires de commande d'�clairage public (cellules photo�lectriques, horloges astronomiques), c�bles d'alimentation arm�s souterrains, regards de chauss�e et conduits de protection PEHD (gaines rouges).",
  },
  {
    id: 'solaire',
    keywords: ['solaire', 'photovoltaique', 'panneau', 'renouvelable', 'pv', 'monocristallin', 'polycristallin', 'perc', 'n-type'],
    content:
      "ENERGIE SOLAIRE & RENOUVELABLE : Installations photovolta�ques isol�es (sites autonomes) ou raccord�es au r�seau. Production & Capture (panneaux monocristallins, polycristallins, PERC/N-Type, panneaux souples/pliables nomades). Conversion & Gestion (onduleurs r�seau String/micro-onduleurs, onduleurs hybrides, convertisseurs Pur Sinus 12V/24V/48V?230V, r�gulateurs MPPT/PWM). Stockage (batteries Lithium LiFePO4, Gel, AGM, Plomb-Acide stationnaires, BMS). Structures & Protection DC (fixation toitures tuiles/t�le/toit plat, montage au sol, trackers, coffrets DC, fusibles DC, parafoudres DC, c�bles solaires UV 4-6mm�, connecteurs MC4).",
  },
  {
    id: 'panneaux-solaires',
    keywords: ['panneau solaire', 'photovoltaique', 'monocristallin', 'polycristallin', 'perc', 'n-type', 'souple', 'pliable'],
    content:
      "PANNEAUX SOLAIRES : Monocristallins, polycristallins, technologies PERC et N-Type pour rendement maximal. Panneaux souples ou pliables pour applications nomades. Tous types disponibles selon le projet (r�sidentiel, industriel, site isol�).",
  },
  {
    id: 'onduleurs-regulateurs',
    keywords: ['onduleur', 'convertisseur', 'regulateur', 'mppt', 'pwm', 'pur sinus', 'hybride', 'micro-onduleur', 'string'],
    content:
      "CONVERSION & GESTION SOLAIRE : Onduleurs r�seau (String inverters, micro-onduleurs), onduleurs hybrides (gestion simultan�e r�seau/panneaux/batteries), convertisseurs de tension Pur Sinus (12V/24V/48V vers 230V), r�gulateurs de charge solaire (MPPT pour rendement maximal, ou PWM pour petits syst�mes).",
  },
  {
    id: 'batteries',
    keywords: ['batterie', 'lithium', 'lifepo4', 'gel', 'agm', 'plomb', 'stockage', 'bms'],
    content:
      "STOCKAGE D'ENERGIE : Batteries Lithium LiFePO4 (norme actuelle, durabilit�), batteries Gel et AGM (sans entretien, solaire stationnaire), batteries Plomb-Acide ouvertes (stationnaires), syst�mes de gestion de batterie (BMS).",
  },
  {
    id: 'protection-solaire',
    keywords: ['structure solaire', 'fixation', 'toiture', 'tracker', 'coffret dc', 'fusible dc', 'parafoudre dc', 'cable solaire', 'mc4', 'connecteur'],
    content:
      "STRUCTURES & PROTECTION DC : Syst�mes de fixation pour toitures (tuiles, t�le ondul�e, toit plat), structures au sol et suiveurs solaires (trackers), coffrets de protection DC (interrupteurs-sectionneurs, fusibles DC, parafoudres DC), c�bles solaires r�sistants aux UV (4mm� ou 6mm�), connecteurs �tanches type MC4.",
  },
  {
    id: 'groupe-electrogene',
    keywords: ['groupe electrogene', 'generateur', 'electrogene', 'secours', 'generatrice', 'kva', 'essence', 'diesel', 'gaz', 'inverter'],
    content:
      "GROUPES ELECTROGENES & AUTONOMIE ENERGETIQUE : Alimentation de secours ou principale. Par type d'�nergie : Essence (portables 1-8 kVA), Diesel (professionnels/industriels 5-2000+ kVA), Gaz ou GPL, Inverter (courant stable pour �lectronique sensible). Configurations : ouverts (locaux techniques), insonoris�s (capotage ext�rieur), mobiles (remorque tract�e). Syst�mes d'inversion : manuels (commutateurs rotatifs), automatiques (ATS/Normal-Secours), centrales de commande digitales, pr�chauffage moteur, cuves � carburant externes et pompes de transfert.",
  },
  {
    id: 'groupes-types',
    keywords: ['groupe essence', 'groupe diesel', 'groupe gaz', 'groupe inverter', 'insonorise', 'mobile', 'remorque', 'ouvert'],
    content:
      "TYPES DE GROUPES ELECTROGENES : Essence (portables, 1 � 8 kVA), Diesel (professionnels/industriels, 5 � plus de 2000 kVA), Gaz ou GPL, Inverter (courant stable, id�al �lectronique sensible). Configurations : ouverts sur ch�ssis (locaux techniques), insonoris�s sous capotage (ext�rieur), mobiles sur remorque tract�e.",
  },
  {
    id: 'inverseurs-commandes',
    keywords: ['inverseur de source', 'ats', 'normal secours', 'automatique', 'manuel', 'commutateur', 'centale commande', 'prechauffage', 'cuve', 'pompe transfert'],
    content:
      "INVERSION & COMMANDE : Inverseurs de source manuels (commutateurs rotatifs), inverseurs automatiques ATS/Normal-Secours (d�marrage automatique lors d'une coupure), centrales de commande digitales (�crans param�tres moteurs/alternateurs), syst�mes de pr�chauffage moteur (d�marrage rapide en hiver), cuves � carburant externes et pompes de transfert automatique.",
  },
  {
    id: 'devis',
    keywords: ['devis', 'quote', 'estimation', 'chiffrer', 'dimensionnement'],
    content:
      "DEVIS : Pour demander un devis, l'utilisateur ajoute les produits souhait�s � son panier puis utilise la page /devis. Les devis multi-produits sont accept�s. Notre �quipe r�pond sous 24h. Redirige vers /devis pour toute demande de devis ou de dimensionnement (groupes �lectrog�nes, installations solaires, �clairage public).",
  },
  {
    id: 'commande-sans-compte',
    keywords: ['compte', 'inscription', 'connexion', 'commander sans'],
    content:
      "COMMANDE : Il est possible de commander sans cr�er de compte, en tant que visiteur, en laissant ses coordonn�es de contact. La disponibilit� et les prix sont relus c�t� serveur depuis la base de gestion commerciale Kobson GesCom, et le stock est rev�rifi� au moment de la commande.",
  },
  {
    id: 'modification-commande',
    keywords: ['modifier', 'annuler', 'annulation', 'suivi', 'suivre ma commande'],
    content:
      "SUIVI ET MODIFICATION : Pour modifier ou annuler une commande d�j� envoy�e, le client contacte l'�quipe par t�l�phone ou WhatsApp en pr�cisant son num�ro de commande. Le chatbot ne peut pas traiter les commandes directement : rediriger vers /contact ou /devis.",
  },
  {
    id: 'stock',
    keywords: ['stock', 'disponible', 'disponibilite', 'rupture', 'reellement disponible'],
    content:
      "STOCK : La disponibilit� affich�e sur le site provient en temps r�el de Kobson GesCom, le syst�me de gestion commerciale de GUESS ENERGY. Elle est rev�rifi�e au moment de la commande pour �viter de vendre un produit indisponible. Si un produit appara�t en rupture, proposer un devis via /devis.",
  },
  {
    id: 'paiement',
    keywords: ['paiement', 'payer', 'carte bancaire', 'mobile money', 'orange money', 'wave', 'momo', 'virement', 'especes', 'cash'],
    content:
      "PAIEMENT : Aucun paiement en ligne. Apr�s r�ception de la commande, l'�quipe contacte le client par t�l�phone ou WhatsApp pour confirmer les modalit�s de paiement et de livraison.",
  },
  {
    id: 'livraison',
    keywords: ['livraison', 'livrer', 'expedition', 'delai', 'transport', 'abidjan', 'bouake', 'yamoussoukro'],
    content:
      "LIVRAISON : Dans toute la C�te d'Ivoire. GRATUITE � partir de 100 000 FCFA d'achat, sinon 5 000 FCFA. D�lais 24 � 72h selon la zone. Les modalit�s sont confirm�es par l'�quipe apr�s commande.",
  },
  {
    id: 'prix-frais',
    keywords: ['frais', 'gratuit', 'tva', 'taxe', 'ttc'],
    content:
      "FRAIS : Livraison gratuite d�s 100 000 FCFA, sinon 5 000 FCFA. Tous les prix affich�s sont en FCFA TTC. Les prix sont relus c�t� serveur depuis la base GesCom ; le navigateur ne peut pas imposer un prix.",
  },
  {
    id: 'entreprise-pourquoi',
    keywords: ['a propos', 'entreprise', 'qui etes vous', 'mission', 'qualite', 'pourquoi vous choisir', 'societe'],
    content:
      "ENTREPRISE : Mission : fournir des mat�riels fiables et accompagner chaque projet, de l'�tude � la mise en �uvre. Engagement qualit� : produits s�lectionn�s, service professionnel, suivi rigoureux. Atouts : qualit�, fiabilit�, expertise, large catalogue (4 p�les), prix comp�titifs. Rediriger vers /a-propos.",
  },
];

/**
 * Retourne le bloc de connaissances � injecter dans le prompt syst�me :
 * les entr�es `always` + les entr�es th�matiques correspondant � la requ�te.
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