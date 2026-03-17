import { useState, useCallback, useRef, useEffect } from "react";

// ─── PLANS COMPTABLES COMPLETS (PCG) ───
const PLAN_ENTREPRISE = [
  // CLASSE 1 — COMPTES DE CAPITAUX
  { compte: "101000", libelle: "Capital", type: "passif" },
  { compte: "101100", libelle: "Capital souscrit non appelé", type: "passif" },
  { compte: "101200", libelle: "Capital souscrit appelé, non versé", type: "passif" },
  { compte: "101300", libelle: "Capital souscrit appelé, versé", type: "passif" },
  { compte: "104000", libelle: "Primes liées au capital social", type: "passif" },
  { compte: "104100", libelle: "Primes d'émission", type: "passif" },
  { compte: "104200", libelle: "Primes de fusion", type: "passif" },
  { compte: "104400", libelle: "Primes de conversion d'obligations en actions", type: "passif" },
  { compte: "106100", libelle: "Réserve légale", type: "passif" },
  { compte: "106200", libelle: "Réserves statutaires ou contractuelles", type: "passif" },
  { compte: "106300", libelle: "Réserves réglementées", type: "passif" },
  { compte: "106800", libelle: "Autres réserves", type: "passif" },
  { compte: "107000", libelle: "Écart d'équivalence", type: "passif" },
  { compte: "108000", libelle: "Compte de l'exploitant", type: "passif" },
  { compte: "110000", libelle: "Report à nouveau (solde créditeur)", type: "passif" },
  { compte: "119000", libelle: "Report à nouveau (solde débiteur)", type: "actif" },
  { compte: "120000", libelle: "Résultat de l'exercice (bénéfice)", type: "passif" },
  { compte: "129000", libelle: "Résultat de l'exercice (perte)", type: "actif" },
  { compte: "130000", libelle: "Subventions d'investissement", type: "passif" },
  { compte: "131000", libelle: "Subventions d'équipement", type: "passif" },
  { compte: "138000", libelle: "Autres subventions d'investissement", type: "passif" },
  { compte: "139000", libelle: "Subventions d'investissement inscrites au compte de résultat", type: "passif" },
  { compte: "142000", libelle: "Provisions réglementées relatives aux immobilisations", type: "passif" },
  { compte: "143000", libelle: "Provisions réglementées relatives aux stocks", type: "passif" },
  { compte: "144000", libelle: "Provisions réglementées relatives aux autres éléments de l'actif", type: "passif" },
  { compte: "145000", libelle: "Amortissements dérogatoires", type: "passif" },
  { compte: "146000", libelle: "Provision spéciale de réévaluation", type: "passif" },
  { compte: "147000", libelle: "Plus-values réinvesties", type: "passif" },
  { compte: "148000", libelle: "Autres provisions réglementées", type: "passif" },
  { compte: "151000", libelle: "Provisions pour risques", type: "passif" },
  { compte: "153000", libelle: "Provisions pour pensions et obligations similaires", type: "passif" },
  { compte: "154000", libelle: "Provisions pour restructurations", type: "passif" },
  { compte: "155000", libelle: "Provisions pour impôts", type: "passif" },
  { compte: "156000", libelle: "Provisions pour renouvellement des immobilisations", type: "passif" },
  { compte: "157000", libelle: "Provisions pour charges à répartir sur plusieurs exercices", type: "passif" },
  { compte: "158000", libelle: "Autres provisions pour charges", type: "passif" },
  { compte: "161000", libelle: "Emprunts obligataires convertibles", type: "passif" },
  { compte: "163000", libelle: "Autres emprunts obligataires", type: "passif" },
  { compte: "164000", libelle: "Emprunts auprès des établissements de crédit", type: "passif" },
  { compte: "165000", libelle: "Dépôts et cautionnements reçus", type: "passif" },
  { compte: "166000", libelle: "Participation des salariés aux résultats", type: "passif" },
  { compte: "167000", libelle: "Emprunts et dettes assortis de conditions particulières", type: "passif" },
  { compte: "168000", libelle: "Autres emprunts et dettes assimilées", type: "passif" },
  { compte: "169000", libelle: "Primes de remboursement des obligations", type: "actif" },
  // CLASSE 2 — COMPTES D'IMMOBILISATIONS
  { compte: "201000", libelle: "Frais d'établissement", type: "actif" },
  { compte: "203000", libelle: "Frais de recherche et développement", type: "actif" },
  { compte: "205000", libelle: "Concessions, brevets, licences, marques, procédés", type: "actif" },
  { compte: "206000", libelle: "Droit au bail", type: "actif" },
  { compte: "207000", libelle: "Fonds commercial", type: "actif" },
  { compte: "208000", libelle: "Autres immobilisations incorporelles", type: "actif" },
  { compte: "211000", libelle: "Terrains (nus)", type: "actif" },
  { compte: "211200", libelle: "Terrains aménagés", type: "actif" },
  { compte: "211300", libelle: "Terrains de gisement", type: "actif" },
  { compte: "211400", libelle: "Terrains de carrières", type: "actif" },
  { compte: "212000", libelle: "Agencements et aménagements de terrains", type: "actif" },
  { compte: "213100", libelle: "Bâtiments", type: "actif" },
  { compte: "213500", libelle: "Installations générales, agencements des constructions", type: "actif" },
  { compte: "214000", libelle: "Constructions sur sol d'autrui", type: "actif" },
  { compte: "215000", libelle: "Installations techniques, matériel et outillage industriels", type: "actif" },
  { compte: "215400", libelle: "Matériel industriel", type: "actif" },
  { compte: "215700", libelle: "Agencements et aménagements du matériel", type: "actif" },
  { compte: "218100", libelle: "Installations générales, agencements divers", type: "actif" },
  { compte: "218200", libelle: "Matériel de transport", type: "actif" },
  { compte: "218300", libelle: "Matériel de bureau et informatique", type: "actif" },
  { compte: "218400", libelle: "Mobilier", type: "actif" },
  { compte: "218500", libelle: "Cheptel", type: "actif" },
  { compte: "218600", libelle: "Emballages récupérables", type: "actif" },
  { compte: "231000", libelle: "Immobilisations corporelles en cours", type: "actif" },
  { compte: "232000", libelle: "Immobilisations incorporelles en cours", type: "actif" },
  { compte: "237000", libelle: "Avances et acomptes versés sur commandes d'immobilisations incorporelles", type: "actif" },
  { compte: "238000", libelle: "Avances et acomptes versés sur commandes d'immobilisations corporelles", type: "actif" },
  { compte: "261000", libelle: "Titres de participation", type: "actif" },
  { compte: "266000", libelle: "Autres formes de participation", type: "actif" },
  { compte: "267000", libelle: "Créances rattachées à des participations", type: "actif" },
  { compte: "271000", libelle: "Titres immobilisés (droit de propriété) — actions", type: "actif" },
  { compte: "272000", libelle: "Titres immobilisés (droit de créance) — obligations", type: "actif" },
  { compte: "274000", libelle: "Prêts", type: "actif" },
  { compte: "275000", libelle: "Dépôts et cautionnements versés", type: "actif" },
  { compte: "276000", libelle: "Autres créances immobilisées", type: "actif" },
  { compte: "280100", libelle: "Amortissements des frais d'établissement", type: "actif" },
  { compte: "280300", libelle: "Amortissements des frais de recherche et développement", type: "actif" },
  { compte: "280500", libelle: "Amortissements des concessions, brevets, licences", type: "actif" },
  { compte: "281100", libelle: "Amortissements des terrains", type: "actif" },
  { compte: "281300", libelle: "Amortissements des constructions", type: "actif" },
  { compte: "281500", libelle: "Amortissements des installations techniques", type: "actif" },
  { compte: "281800", libelle: "Amortissements des autres immobilisations corporelles", type: "actif" },
  { compte: "290000", libelle: "Dépréciations des immobilisations incorporelles", type: "actif" },
  { compte: "291000", libelle: "Dépréciations des immobilisations corporelles", type: "actif" },
  { compte: "296000", libelle: "Dépréciations des participations et créances rattachées", type: "actif" },
  { compte: "297000", libelle: "Dépréciations des autres immobilisations financières", type: "actif" },
  // CLASSE 3 — COMPTES DE STOCKS ET EN-COURS
  { compte: "310000", libelle: "Matières premières (et fournitures)", type: "actif" },
  { compte: "311000", libelle: "Matières premières", type: "actif" },
  { compte: "312000", libelle: "Matières et fournitures consommables", type: "actif" },
  { compte: "313000", libelle: "Combustibles", type: "actif" },
  { compte: "314000", libelle: "Produits d'entretien", type: "actif" },
  { compte: "315000", libelle: "Fournitures d'atelier et d'usine", type: "actif" },
  { compte: "316000", libelle: "Fournitures de magasin", type: "actif" },
  { compte: "317000", libelle: "Fournitures de bureau", type: "actif" },
  { compte: "320000", libelle: "Autres approvisionnements", type: "actif" },
  { compte: "321000", libelle: "Matières consommables", type: "actif" },
  { compte: "322000", libelle: "Fournitures consommables", type: "actif" },
  { compte: "326000", libelle: "Emballages", type: "actif" },
  { compte: "331000", libelle: "Produits en cours", type: "actif" },
  { compte: "332000", libelle: "Travaux en cours", type: "actif" },
  { compte: "333000", libelle: "Services en cours", type: "actif" },
  { compte: "341000", libelle: "Études en cours", type: "actif" },
  { compte: "342000", libelle: "Prestations de services en cours", type: "actif" },
  { compte: "351000", libelle: "Produits intermédiaires", type: "actif" },
  { compte: "355000", libelle: "Produits finis", type: "actif" },
  { compte: "358000", libelle: "Produits résiduels ou matières de récupération", type: "actif" },
  { compte: "370000", libelle: "Stocks de marchandises", type: "actif" },
  { compte: "380000", libelle: "Stocks en voie d'acheminement", type: "actif" },
  { compte: "390000", libelle: "Dépréciations des stocks et en-cours", type: "actif" },
  // CLASSE 4 — COMPTES DE TIERS
  { compte: "401000", libelle: "Fournisseurs", type: "passif" },
  { compte: "401100", libelle: "Fournisseurs — achats de biens et services", type: "passif" },
  { compte: "403000", libelle: "Fournisseurs — effets à payer", type: "passif" },
  { compte: "404000", libelle: "Fournisseurs d'immobilisations", type: "passif" },
  { compte: "405000", libelle: "Fournisseurs d'immobilisations — effets à payer", type: "passif" },
  { compte: "408000", libelle: "Fournisseurs — factures non parvenues", type: "passif" },
  { compte: "409000", libelle: "Fournisseurs débiteurs", type: "actif" },
  { compte: "409100", libelle: "Fournisseurs — avances et acomptes versés sur commandes", type: "actif" },
  { compte: "409700", libelle: "Fournisseurs — autres avoirs", type: "actif" },
  { compte: "411000", libelle: "Clients", type: "actif" },
  { compte: "411100", libelle: "Clients — ventes de biens et services", type: "actif" },
  { compte: "413000", libelle: "Clients — effets à recevoir", type: "actif" },
  { compte: "416000", libelle: "Clients douteux ou litigieux", type: "actif" },
  { compte: "418000", libelle: "Clients — produits non encore facturés", type: "actif" },
  { compte: "419000", libelle: "Clients créditeurs", type: "passif" },
  { compte: "419100", libelle: "Clients — avances et acomptes reçus sur commandes", type: "passif" },
  { compte: "419700", libelle: "Clients — autres avoirs à établir", type: "passif" },
  { compte: "421000", libelle: "Personnel — rémunérations dues", type: "passif" },
  { compte: "422000", libelle: "Comités d'entreprise, d'établissement", type: "passif" },
  { compte: "423000", libelle: "Personnel — acomptes et avances", type: "actif" },
  { compte: "424000", libelle: "Personnel — participation aux résultats", type: "passif" },
  { compte: "425000", libelle: "Personnel — avances et acomptes", type: "actif" },
  { compte: "426000", libelle: "Personnel — dépôts", type: "passif" },
  { compte: "427000", libelle: "Personnel — oppositions", type: "passif" },
  { compte: "428000", libelle: "Personnel — charges à payer et produits à recevoir", type: "passif" },
  { compte: "431000", libelle: "Sécurité sociale", type: "passif" },
  { compte: "437000", libelle: "Autres organismes sociaux", type: "passif" },
  { compte: "438000", libelle: "Organismes sociaux — charges à payer et produits à recevoir", type: "passif" },
  { compte: "441000", libelle: "État — subventions à recevoir", type: "actif" },
  { compte: "442000", libelle: "État — impôts et versements assimilés", type: "passif" },
  { compte: "443000", libelle: "Opérations particulières avec l'État", type: "passif" },
  { compte: "444000", libelle: "État — impôts sur les bénéfices", type: "passif" },
  { compte: "445000", libelle: "État — taxes sur le chiffre d'affaires", type: "passif" },
  { compte: "445100", libelle: "TVA à collecter", type: "passif" },
  { compte: "445200", libelle: "TVA due intracommunautaire", type: "passif" },
  { compte: "445300", libelle: "TVA à décaisser", type: "passif" },
  { compte: "445400", libelle: "TVA — régularisations", type: "passif" },
  { compte: "445500", libelle: "État — TVA à décaisser", type: "passif" },
  { compte: "445600", libelle: "Taxes sur le chiffre d'affaires déductibles", type: "actif" },
  { compte: "445620", libelle: "TVA sur immobilisations", type: "actif" },
  { compte: "445660", libelle: "TVA déductible sur autres biens et services", type: "actif" },
  { compte: "445670", libelle: "TVA déductible sur immobilisations", type: "actif" },
  { compte: "445710", libelle: "TVA collectée", type: "passif" },
  { compte: "445800", libelle: "Acomptes — régime simplifié d'imposition", type: "passif" },
  { compte: "446000", libelle: "Obligations cautionnées", type: "passif" },
  { compte: "447000", libelle: "Autres impôts, taxes et versements assimilés", type: "passif" },
  { compte: "448000", libelle: "État — charges à payer et produits à recevoir", type: "passif" },
  { compte: "451000", libelle: "Groupe — opérations", type: "passif" },
  { compte: "455000", libelle: "Associés — comptes courants", type: "passif" },
  { compte: "456000", libelle: "Associés — opérations sur le capital", type: "passif" },
  { compte: "457000", libelle: "Associés — dividendes à payer", type: "passif" },
  { compte: "458000", libelle: "Associés — opérations faites en commun", type: "passif" },
  { compte: "462000", libelle: "Créances sur cessions d'immobilisations", type: "actif" },
  { compte: "464000", libelle: "Dettes sur acquisitions de valeurs mobilières de placement", type: "passif" },
  { compte: "465000", libelle: "Créances sur cessions de valeurs mobilières de placement", type: "actif" },
  { compte: "467000", libelle: "Autres comptes débiteurs ou créditeurs", type: "actif" },
  { compte: "468000", libelle: "Divers — charges à payer et produits à recevoir", type: "passif" },
  { compte: "471000", libelle: "Comptes d'attente", type: "actif" },
  { compte: "476000", libelle: "Différences de conversion — actif", type: "actif" },
  { compte: "477000", libelle: "Différences de conversion — passif", type: "passif" },
  { compte: "480000", libelle: "Charges à répartir sur plusieurs exercices", type: "actif" },
  { compte: "481000", libelle: "Charges à étaler", type: "actif" },
  { compte: "486000", libelle: "Charges constatées d'avance", type: "actif" },
  { compte: "487000", libelle: "Produits constatés d'avance", type: "passif" },
  { compte: "491000", libelle: "Dépréciations des comptes de clients", type: "actif" },
  { compte: "496000", libelle: "Dépréciations des comptes de débiteurs divers", type: "actif" },
  // CLASSE 5 — COMPTES FINANCIERS
  { compte: "501000", libelle: "Valeurs mobilières de placement — obligations", type: "actif" },
  { compte: "503000", libelle: "Actions", type: "actif" },
  { compte: "504000", libelle: "Autres valeurs mobilières de placement et créances assimilées", type: "actif" },
  { compte: "506000", libelle: "Obligations", type: "actif" },
  { compte: "507000", libelle: "Bons du Trésor et bons de caisse à court terme", type: "actif" },
  { compte: "508000", libelle: "Autres valeurs mobilières et créances assimilées", type: "actif" },
  { compte: "511000", libelle: "Valeurs à l'encaissement", type: "actif" },
  { compte: "512000", libelle: "Banques comptes courants", type: "actif" },
  { compte: "513000", libelle: "Chèques postaux", type: "actif" },
  { compte: "514000", libelle: "Chèques et cartes bancaires à encaisser", type: "actif" },
  { compte: "515000", libelle: "Virements internes", type: "actif" },
  { compte: "516000", libelle: "Autres organismes financiers", type: "actif" },
  { compte: "517000", libelle: "Autres organismes financiers — dépôts", type: "actif" },
  { compte: "518000", libelle: "Intérêts courus", type: "actif" },
  { compte: "519000", libelle: "Concours bancaires courants", type: "passif" },
  { compte: "530000", libelle: "Caisse", type: "actif" },
  { compte: "531000", libelle: "Caisse principale", type: "actif" },
  { compte: "532000", libelle: "Caisses secondaires", type: "actif" },
  { compte: "540000", libelle: "Régies d'avances et accréditifs", type: "actif" },
  { compte: "581000", libelle: "Virements internes", type: "actif" },
  { compte: "590000", libelle: "Dépréciations des valeurs mobilières de placement", type: "actif" },
  // CLASSE 6 — COMPTES DE CHARGES
  { compte: "601000", libelle: "Achats de matières premières", type: "charge" },
  { compte: "602100", libelle: "Achats stockés — matières premières", type: "charge" },
  { compte: "602200", libelle: "Achats stockés — autres approvisionnements", type: "charge" },
  { compte: "603100", libelle: "Variation des stocks de matières premières", type: "charge" },
  { compte: "603200", libelle: "Variation des stocks des autres approvisionnements", type: "charge" },
  { compte: "604000", libelle: "Achats d'études et prestations de services", type: "charge" },
  { compte: "605000", libelle: "Achats de matériel, équipements et travaux", type: "charge" },
  { compte: "606100", libelle: "Fournitures non stockables — eau, énergie", type: "charge" },
  { compte: "606200", libelle: "Fournitures consommables", type: "charge" },
  { compte: "606300", libelle: "Fournitures d'entretien et petit équipement", type: "charge" },
  { compte: "606400", libelle: "Fournitures administratives", type: "charge" },
  { compte: "606500", libelle: "Fournitures informatiques", type: "charge" },
  { compte: "606800", libelle: "Autres matières et fournitures", type: "charge" },
  { compte: "607000", libelle: "Achats de marchandises", type: "charge" },
  { compte: "609000", libelle: "Rabais, remises et ristournes obtenus sur achats", type: "charge" },
  { compte: "611000", libelle: "Sous-traitance générale", type: "charge" },
  { compte: "612000", libelle: "Redevances de crédit-bail et contrats similaires", type: "charge" },
  { compte: "612100", libelle: "Crédit-bail mobilier", type: "charge" },
  { compte: "612200", libelle: "Crédit-bail immobilier", type: "charge" },
  { compte: "613100", libelle: "Locations mobilières", type: "charge" },
  { compte: "613200", libelle: "Locations immobilières", type: "charge" },
  { compte: "613500", libelle: "Locations de matériel et de mobilier", type: "charge" },
  { compte: "614000", libelle: "Charges locatives et de copropriété", type: "charge" },
  { compte: "615000", libelle: "Entretien et réparations sur biens propres", type: "charge" },
  { compte: "615200", libelle: "Entretien et réparations sur biens immobiliers", type: "charge" },
  { compte: "615300", libelle: "Entretien et réparations sur biens mobiliers", type: "charge" },
  { compte: "616000", libelle: "Primes d'assurances", type: "charge" },
  { compte: "616100", libelle: "Assurances multirisques", type: "charge" },
  { compte: "616200", libelle: "Assurances responsabilité civile", type: "charge" },
  { compte: "616400", libelle: "Assurances du personnel", type: "charge" },
  { compte: "616600", libelle: "Assurances transport", type: "charge" },
  { compte: "617000", libelle: "Études et recherches", type: "charge" },
  { compte: "618000", libelle: "Divers — documentation générale", type: "charge" },
  { compte: "618100", libelle: "Documentation générale", type: "charge" },
  { compte: "618500", libelle: "Frais de colloques, séminaires, conférences", type: "charge" },
  { compte: "621000", libelle: "Personnel extérieur à l'entreprise", type: "charge" },
  { compte: "621100", libelle: "Personnel intérimaire", type: "charge" },
  { compte: "621200", libelle: "Personnel détaché ou prêté à l'entreprise", type: "charge" },
  { compte: "622100", libelle: "Commissions et courtages sur achats", type: "charge" },
  { compte: "622200", libelle: "Commissions et courtages sur ventes", type: "charge" },
  { compte: "622300", libelle: "Commissions sur prestations de services", type: "charge" },
  { compte: "622600", libelle: "Honoraires", type: "charge" },
  { compte: "622700", libelle: "Frais d'actes et de contentieux", type: "charge" },
  { compte: "622800", libelle: "Rémunérations d'intermédiaires et honoraires divers", type: "charge" },
  { compte: "623100", libelle: "Annonces et insertions publicitaires", type: "charge" },
  { compte: "623200", libelle: "Catalogues et imprimés publicitaires", type: "charge" },
  { compte: "623300", libelle: "Foires et expositions", type: "charge" },
  { compte: "623400", libelle: "Cadeaux à la clientèle", type: "charge" },
  { compte: "623500", libelle: "Publications et relations publiques", type: "charge" },
  { compte: "623600", libelle: "Échantillons", type: "charge" },
  { compte: "623700", libelle: "Frais de promotion — site internet, réseaux sociaux", type: "charge" },
  { compte: "623800", libelle: "Divers publicité", type: "charge" },
  { compte: "624100", libelle: "Transport sur achats", type: "charge" },
  { compte: "624200", libelle: "Transport sur ventes", type: "charge" },
  { compte: "624300", libelle: "Transport entre établissements ou chantiers", type: "charge" },
  { compte: "624500", libelle: "Transport du personnel", type: "charge" },
  { compte: "625100", libelle: "Voyages et déplacements", type: "charge" },
  { compte: "625200", libelle: "Missions", type: "charge" },
  { compte: "625600", libelle: "Missions et réceptions", type: "charge" },
  { compte: "625700", libelle: "Réceptions", type: "charge" },
  { compte: "626000", libelle: "Frais postaux et de télécommunications", type: "charge" },
  { compte: "626100", libelle: "Frais postaux", type: "charge" },
  { compte: "626200", libelle: "Frais téléphoniques et internet", type: "charge" },
  { compte: "627000", libelle: "Services bancaires et assimilés", type: "charge" },
  { compte: "627100", libelle: "Frais bancaires sur opérations courantes", type: "charge" },
  { compte: "627200", libelle: "Commissions sur virements et prélèvements", type: "charge" },
  { compte: "627400", libelle: "Frais sur effets de commerce", type: "charge" },
  { compte: "627500", libelle: "Location de coffres, gardiennage de valeurs", type: "charge" },
  { compte: "628100", libelle: "Cotisations et dons — associations professionnelles", type: "charge" },
  { compte: "628200", libelle: "Cotisations syndicales professionnelles", type: "charge" },
  { compte: "628400", libelle: "Frais de recrutement du personnel", type: "charge" },
  { compte: "628600", libelle: "Frais de gardiennage et sécurité", type: "charge" },
  { compte: "628800", libelle: "Divers charges externes", type: "charge" },
  { compte: "631000", libelle: "Impôts, taxes et versements assimilés sur rémunérations", type: "charge" },
  { compte: "631100", libelle: "Taxe sur les salaires", type: "charge" },
  { compte: "631200", libelle: "Taxe d'apprentissage", type: "charge" },
  { compte: "631300", libelle: "Participation à la formation professionnelle continue", type: "charge" },
  { compte: "631400", libelle: "Participation à l'effort de construction", type: "charge" },
  { compte: "631500", libelle: "Versement libératoire", type: "charge" },
  { compte: "633000", libelle: "Impôts, taxes et versements assimilés — autres impôts", type: "charge" },
  { compte: "635100", libelle: "Contribution économique territoriale — cotisation foncière", type: "charge" },
  { compte: "635200", libelle: "Contribution économique territoriale — cotisation sur la valeur ajoutée", type: "charge" },
  { compte: "635400", libelle: "Taxes foncières", type: "charge" },
  { compte: "635500", libelle: "Taxe sur les véhicules de sociétés", type: "charge" },
  { compte: "635800", libelle: "Autres impôts locaux", type: "charge" },
  { compte: "637000", libelle: "Autres impôts, taxes et versements assimilés", type: "charge" },
  { compte: "641100", libelle: "Salaires et appointements — personnel non cadre", type: "charge" },
  { compte: "641200", libelle: "Salaires et appointements — personnel cadre", type: "charge" },
  { compte: "641600", libelle: "Congés payés", type: "charge" },
  { compte: "641700", libelle: "Rémunérations des dirigeants d'entreprise", type: "charge" },
  { compte: "645100", libelle: "Cotisations à l'URSSAF", type: "charge" },
  { compte: "645200", libelle: "Cotisations aux mutuelles", type: "charge" },
  { compte: "645300", libelle: "Cotisations aux caisses de retraite", type: "charge" },
  { compte: "645400", libelle: "Cotisations aux ASSEDIC", type: "charge" },
  { compte: "645500", libelle: "Cotisations à Pôle Emploi", type: "charge" },
  { compte: "645800", libelle: "Cotisations aux autres organismes sociaux", type: "charge" },
  { compte: "646000", libelle: "Cotisations sociales personnelles de l'exploitant", type: "charge" },
  { compte: "647000", libelle: "Autres charges sociales", type: "charge" },
  { compte: "647100", libelle: "Prestations directes", type: "charge" },
  { compte: "647200", libelle: "Versements aux comités d'entreprise", type: "charge" },
  { compte: "647400", libelle: "Médecine du travail, pharmacie", type: "charge" },
  { compte: "648000", libelle: "Autres charges de personnel", type: "charge" },
  { compte: "651000", libelle: "Redevances pour concessions, brevets, licences, marques", type: "charge" },
  { compte: "652000", libelle: "Revenus des terres et bâtiments affectés à des oeuvres", type: "charge" },
  { compte: "653000", libelle: "Jetons de présence", type: "charge" },
  { compte: "654000", libelle: "Pertes sur créances irrécouvrables", type: "charge" },
  { compte: "655000", libelle: "Quote-part de résultat sur opérations faites en commun", type: "charge" },
  { compte: "656000", libelle: "Charges nettes sur cessions de valeurs mobilières de placement", type: "charge" },
  { compte: "658000", libelle: "Charges diverses de gestion courante", type: "charge" },
  { compte: "661000", libelle: "Charges d'intérêts — intérêts des emprunts et dettes", type: "charge" },
  { compte: "661100", libelle: "Intérêts des emprunts et dettes", type: "charge" },
  { compte: "661200", libelle: "Intérêts des dépôts et cautionnements reçus", type: "charge" },
  { compte: "661600", libelle: "Intérêts bancaires sur opérations de financement", type: "charge" },
  { compte: "664000", libelle: "Revenus des valeurs mobilières de placement", type: "charge" },
  { compte: "665000", libelle: "Escomptes accordés", type: "charge" },
  { compte: "666000", libelle: "Pertes de change", type: "charge" },
  { compte: "667000", libelle: "Charges nettes sur cessions de valeurs mobilières de placement", type: "charge" },
  { compte: "668000", libelle: "Autres charges financières", type: "charge" },
  { compte: "671000", libelle: "Charges exceptionnelles sur opérations de gestion", type: "charge" },
  { compte: "672000", libelle: "Charges sur exercices antérieurs", type: "charge" },
  { compte: "675000", libelle: "Valeurs comptables des éléments d'actif cédés", type: "charge" },
  { compte: "678000", libelle: "Autres charges exceptionnelles", type: "charge" },
  { compte: "681100", libelle: "Dotations aux amortissements sur immobilisations incorporelles", type: "charge" },
  { compte: "681200", libelle: "Dotations aux amortissements sur immobilisations corporelles", type: "charge" },
  { compte: "681500", libelle: "Dotations aux dépréciations sur immobilisations incorporelles", type: "charge" },
  { compte: "681600", libelle: "Dotations aux dépréciations sur immobilisations corporelles", type: "charge" },
  { compte: "686000", libelle: "Dotations aux amortissements et dépréciations — charges financières", type: "charge" },
  { compte: "687000", libelle: "Dotations aux amortissements et dépréciations — charges exceptionnelles", type: "charge" },
  { compte: "690000", libelle: "Participation des salariés aux résultats", type: "charge" },
  { compte: "695000", libelle: "Impôts sur les bénéfices", type: "charge" },
  { compte: "696000", libelle: "Taxes assimilées aux impôts sur les bénéfices", type: "charge" },
  { compte: "697000", libelle: "Imposition forfaitaire annuelle des sociétés", type: "charge" },
  { compte: "699000", libelle: "Produits — reports en arrière des déficits", type: "charge" },
  // CLASSE 7 — COMPTES DE PRODUITS
  { compte: "701000", libelle: "Ventes de produits finis", type: "produit" },
  { compte: "701100", libelle: "Produits finis — groupe", type: "produit" },
  { compte: "701200", libelle: "Produits finis — hors groupe", type: "produit" },
  { compte: "702000", libelle: "Ventes de produits intermédiaires", type: "produit" },
  { compte: "703000", libelle: "Ventes de produits résiduels", type: "produit" },
  { compte: "704000", libelle: "Travaux", type: "produit" },
  { compte: "705000", libelle: "Études", type: "produit" },
  { compte: "706000", libelle: "Prestations de services", type: "produit" },
  { compte: "707000", libelle: "Ventes de marchandises", type: "produit" },
  { compte: "708000", libelle: "Produits des activités annexes", type: "produit" },
  { compte: "708100", libelle: "Produits des services exploités dans l'intérêt du personnel", type: "produit" },
  { compte: "708200", libelle: "Commissions et courtages", type: "produit" },
  { compte: "708300", libelle: "Locations diverses", type: "produit" },
  { compte: "708400", libelle: "Mise à disposition de personnel facturée", type: "produit" },
  { compte: "708500", libelle: "Ports et frais accessoires facturés", type: "produit" },
  { compte: "708600", libelle: "Emballages facturés", type: "produit" },
  { compte: "709000", libelle: "Rabais, remises et ristournes accordés par l'entreprise", type: "produit" },
  { compte: "710000", libelle: "Variation des stocks (en-cours de production, produits)", type: "produit" },
  { compte: "711000", libelle: "Variation des stocks de produits en cours", type: "produit" },
  { compte: "713000", libelle: "Variation des stocks de produits finis", type: "produit" },
  { compte: "720000", libelle: "Production immobilisée", type: "produit" },
  { compte: "721000", libelle: "Immobilisations incorporelles — production de l'entreprise", type: "produit" },
  { compte: "722000", libelle: "Immobilisations corporelles — production de l'entreprise", type: "produit" },
  { compte: "740000", libelle: "Subventions d'exploitation", type: "produit" },
  { compte: "741000", libelle: "Subventions d'exploitation", type: "produit" },
  { compte: "750000", libelle: "Redevances pour concessions, brevets, licences, marques", type: "produit" },
  { compte: "751000", libelle: "Redevances pour concessions", type: "produit" },
  { compte: "752000", libelle: "Revenus des immeubles non affectés aux activités professionnelles", type: "produit" },
  { compte: "753000", libelle: "Jetons de présence et rémunérations d'administrateurs", type: "produit" },
  { compte: "754000", libelle: "Ristournes perçues des coopératives (affectées aux coopérateurs)", type: "produit" },
  { compte: "755000", libelle: "Quote-part de résultat sur opérations faites en commun", type: "produit" },
  { compte: "756000", libelle: "Produits nets sur cessions de valeurs mobilières de placement", type: "produit" },
  { compte: "758000", libelle: "Produits divers de gestion courante", type: "produit" },
  { compte: "761000", libelle: "Produits de participations", type: "produit" },
  { compte: "762000", libelle: "Produits des autres immobilisations financières", type: "produit" },
  { compte: "763000", libelle: "Revenus des créances immobilisées", type: "produit" },
  { compte: "764000", libelle: "Revenus des valeurs mobilières de placement", type: "produit" },
  { compte: "765000", libelle: "Escomptes obtenus", type: "produit" },
  { compte: "766000", libelle: "Gains de change", type: "produit" },
  { compte: "767000", libelle: "Produits nets sur cessions de valeurs mobilières de placement", type: "produit" },
  { compte: "768000", libelle: "Autres produits financiers", type: "produit" },
  { compte: "771000", libelle: "Produits exceptionnels sur opérations de gestion", type: "produit" },
  { compte: "772000", libelle: "Produits sur exercices antérieurs", type: "produit" },
  { compte: "775000", libelle: "Produits des cessions d'éléments d'actif", type: "produit" },
  { compte: "777000", libelle: "Quote-part des subventions d'investissement virée au résultat", type: "produit" },
  { compte: "778000", libelle: "Autres produits exceptionnels", type: "produit" },
  { compte: "781000", libelle: "Reprises sur amortissements et dépréciations — charges d'exploitation", type: "produit" },
  { compte: "786000", libelle: "Reprises sur dépréciations et provisions — charges financières", type: "produit" },
  { compte: "787000", libelle: "Reprises sur dépréciations et provisions — charges exceptionnelles", type: "produit" },
  { compte: "791000", libelle: "Transferts de charges d'exploitation", type: "produit" },
  { compte: "796000", libelle: "Transferts de charges financières", type: "produit" },
  { compte: "797000", libelle: "Transferts de charges exceptionnelles", type: "produit" },
];

const PLAN_ASSOCIATION = [
  // CLASSE 1 — FONDS ASSOCIATIFS ET RÉSERVES
  { compte: "102000", libelle: "Fonds associatifs sans droit de reprise", type: "passif" },
  { compte: "102100", libelle: "Fonds associatifs avec droit de reprise", type: "passif" },
  { compte: "103000", libelle: "Apports", type: "passif" },
  { compte: "106100", libelle: "Réserves statutaires", type: "passif" },
  { compte: "106300", libelle: "Réserves réglementées", type: "passif" },
  { compte: "106800", libelle: "Autres réserves", type: "passif" },
  { compte: "110000", libelle: "Report à nouveau (excédent)", type: "passif" },
  { compte: "119000", libelle: "Report à nouveau (déficit)", type: "actif" },
  { compte: "120000", libelle: "Excédent de l'exercice", type: "passif" },
  { compte: "129000", libelle: "Déficit de l'exercice", type: "actif" },
  { compte: "131000", libelle: "Subventions d'équipement de l'État", type: "passif" },
  { compte: "132000", libelle: "Subventions d'équipement des collectivités territoriales", type: "passif" },
  { compte: "133000", libelle: "Subventions d'équipement d'autres organismes", type: "passif" },
  { compte: "138000", libelle: "Autres subventions d'investissement", type: "passif" },
  { compte: "151000", libelle: "Provisions pour risques", type: "passif" },
  { compte: "157000", libelle: "Provisions pour charges à répartir", type: "passif" },
  { compte: "158000", libelle: "Autres provisions pour charges", type: "passif" },
  { compte: "164000", libelle: "Emprunts auprès des établissements de crédit", type: "passif" },
  { compte: "165000", libelle: "Dépôts et cautionnements reçus", type: "passif" },
  { compte: "167000", libelle: "Emprunts et dettes assortis de conditions particulières", type: "passif" },
  { compte: "168000", libelle: "Autres emprunts et dettes assimilées", type: "passif" },
  { compte: "194000", libelle: "Fonds dédiés sur subventions conditionnelles", type: "passif" },
  { compte: "195000", libelle: "Fonds dédiés sur dons manuels conditionnels", type: "passif" },
  { compte: "196000", libelle: "Fonds dédiés sur legs conditionnels", type: "passif" },
  // CLASSE 2 — IMMOBILISATIONS
  { compte: "201000", libelle: "Frais d'établissement", type: "actif" },
  { compte: "203000", libelle: "Frais de recherche et développement", type: "actif" },
  { compte: "205000", libelle: "Concessions, brevets, licences", type: "actif" },
  { compte: "206000", libelle: "Droit au bail", type: "actif" },
  { compte: "208000", libelle: "Autres immobilisations incorporelles", type: "actif" },
  { compte: "211000", libelle: "Terrains", type: "actif" },
  { compte: "213100", libelle: "Bâtiments", type: "actif" },
  { compte: "214000", libelle: "Constructions sur sol d'autrui", type: "actif" },
  { compte: "215000", libelle: "Installations techniques, matériel", type: "actif" },
  { compte: "218100", libelle: "Installations générales, agencements divers", type: "actif" },
  { compte: "218200", libelle: "Matériel de transport", type: "actif" },
  { compte: "218300", libelle: "Matériel de bureau et informatique", type: "actif" },
  { compte: "218400", libelle: "Mobilier", type: "actif" },
  { compte: "231000", libelle: "Immobilisations corporelles en cours", type: "actif" },
  { compte: "238000", libelle: "Avances et acomptes sur immobilisations", type: "actif" },
  { compte: "261000", libelle: "Titres de participation", type: "actif" },
  { compte: "271000", libelle: "Titres immobilisés", type: "actif" },
  { compte: "274000", libelle: "Prêts", type: "actif" },
  { compte: "275000", libelle: "Dépôts et cautionnements versés", type: "actif" },
  { compte: "281100", libelle: "Amortissements des frais d'établissement", type: "actif" },
  { compte: "281300", libelle: "Amortissements des constructions", type: "actif" },
  { compte: "281500", libelle: "Amortissements des installations techniques", type: "actif" },
  { compte: "281800", libelle: "Amortissements des autres immobilisations", type: "actif" },
  // CLASSE 3 — STOCKS
  { compte: "310000", libelle: "Matières premières et fournitures", type: "actif" },
  { compte: "360000", libelle: "Stocks d'imprimés et publications", type: "actif" },
  { compte: "370000", libelle: "Stocks de marchandises", type: "actif" },
  // CLASSE 4 — COMPTES DE TIERS
  { compte: "401000", libelle: "Fournisseurs", type: "passif" },
  { compte: "403000", libelle: "Fournisseurs — effets à payer", type: "passif" },
  { compte: "404000", libelle: "Fournisseurs d'immobilisations", type: "passif" },
  { compte: "408000", libelle: "Fournisseurs — factures non parvenues", type: "passif" },
  { compte: "409100", libelle: "Fournisseurs — avances et acomptes versés", type: "actif" },
  { compte: "411000", libelle: "Usagers, adhérents, bénéficiaires", type: "actif" },
  { compte: "413000", libelle: "Adhérents — effets à recevoir", type: "actif" },
  { compte: "416000", libelle: "Créances douteuses ou litigieuses", type: "actif" },
  { compte: "418000", libelle: "Produits non encore facturés", type: "actif" },
  { compte: "419100", libelle: "Avances et acomptes reçus sur commandes", type: "passif" },
  { compte: "421000", libelle: "Personnel — rémunérations dues", type: "passif" },
  { compte: "423000", libelle: "Personnel — acomptes et avances", type: "actif" },
  { compte: "425000", libelle: "Personnel — avances et acomptes", type: "actif" },
  { compte: "431000", libelle: "Sécurité sociale", type: "passif" },
  { compte: "437000", libelle: "Autres organismes sociaux", type: "passif" },
  { compte: "438000", libelle: "Charges sociales à payer", type: "passif" },
  { compte: "441000", libelle: "État — subventions à recevoir", type: "actif" },
  { compte: "443000", libelle: "Collectivités territoriales — subventions à recevoir", type: "actif" },
  { compte: "444000", libelle: "Organismes sociaux — subventions à recevoir", type: "actif" },
  { compte: "445000", libelle: "État — taxes sur le chiffre d'affaires", type: "passif" },
  { compte: "445660", libelle: "TVA déductible sur autres biens et services", type: "actif" },
  { compte: "445710", libelle: "TVA collectée", type: "passif" },
  { compte: "447000", libelle: "Autres impôts, taxes et versements assimilés", type: "passif" },
  { compte: "448000", libelle: "État et collectivités — charges à payer et produits à recevoir", type: "passif" },
  { compte: "462000", libelle: "Créances sur cessions d'immobilisations", type: "actif" },
  { compte: "467000", libelle: "Autres comptes débiteurs ou créditeurs", type: "actif" },
  { compte: "471000", libelle: "Comptes d'attente", type: "actif" },
  { compte: "480000", libelle: "Charges à répartir sur plusieurs exercices", type: "actif" },
  { compte: "486000", libelle: "Charges constatées d'avance", type: "actif" },
  { compte: "487000", libelle: "Produits constatés d'avance", type: "passif" },
  { compte: "491000", libelle: "Dépréciations des comptes clients", type: "actif" },
  // CLASSE 5 — COMPTES FINANCIERS
  { compte: "503000", libelle: "Actions et valeurs assimilées", type: "actif" },
  { compte: "512000", libelle: "Banque", type: "actif" },
  { compte: "513000", libelle: "Chèques postaux (CCP)", type: "actif" },
  { compte: "514000", libelle: "Chèques et cartes bancaires à encaisser", type: "actif" },
  { compte: "519000", libelle: "Concours bancaires courants (découvert)", type: "passif" },
  { compte: "530000", libelle: "Caisse", type: "actif" },
  { compte: "540000", libelle: "Régies d'avances et accréditifs", type: "actif" },
  // CLASSE 6 — COMPTES DE CHARGES (EMPLOIS)
  { compte: "604000", libelle: "Achats d'études et prestations de services", type: "charge" },
  { compte: "606100", libelle: "Fournitures non stockables — eau, énergie", type: "charge" },
  { compte: "606200", libelle: "Fournitures consommables", type: "charge" },
  { compte: "606300", libelle: "Fournitures d'entretien et petit équipement", type: "charge" },
  { compte: "606400", libelle: "Fournitures administratives", type: "charge" },
  { compte: "606500", libelle: "Fournitures informatiques", type: "charge" },
  { compte: "607000", libelle: "Achats de marchandises", type: "charge" },
  { compte: "609000", libelle: "Rabais, remises et ristournes obtenus sur achats", type: "charge" },
  { compte: "611000", libelle: "Sous-traitance générale", type: "charge" },
  { compte: "612000", libelle: "Redevances de crédit-bail", type: "charge" },
  { compte: "613100", libelle: "Locations mobilières", type: "charge" },
  { compte: "613200", libelle: "Locations immobilières", type: "charge" },
  { compte: "614000", libelle: "Charges locatives et de copropriété", type: "charge" },
  { compte: "615000", libelle: "Entretien et réparations", type: "charge" },
  { compte: "615200", libelle: "Entretien et réparations — biens immobiliers", type: "charge" },
  { compte: "615300", libelle: "Entretien et réparations — biens mobiliers", type: "charge" },
  { compte: "616000", libelle: "Primes d'assurances", type: "charge" },
  { compte: "616100", libelle: "Assurances multirisques", type: "charge" },
  { compte: "616400", libelle: "Assurances du personnel", type: "charge" },
  { compte: "617000", libelle: "Études et recherches", type: "charge" },
  { compte: "618000", libelle: "Documentation générale", type: "charge" },
  { compte: "618500", libelle: "Frais de colloques, séminaires, conférences", type: "charge" },
  { compte: "621000", libelle: "Personnel extérieur", type: "charge" },
  { compte: "621100", libelle: "Personnel intérimaire", type: "charge" },
  { compte: "622600", libelle: "Honoraires", type: "charge" },
  { compte: "622700", libelle: "Frais d'actes et de contentieux", type: "charge" },
  { compte: "622800", libelle: "Rémunérations d'intermédiaires", type: "charge" },
  { compte: "623100", libelle: "Annonces et insertions publicitaires", type: "charge" },
  { compte: "623300", libelle: "Foires et expositions", type: "charge" },
  { compte: "623500", libelle: "Publications et relations publiques", type: "charge" },
  { compte: "623700", libelle: "Frais de promotion — site internet, réseaux sociaux", type: "charge" },
  { compte: "624100", libelle: "Transport sur achats", type: "charge" },
  { compte: "624500", libelle: "Transport du personnel", type: "charge" },
  { compte: "625100", libelle: "Voyages et déplacements", type: "charge" },
  { compte: "625700", libelle: "Réceptions", type: "charge" },
  { compte: "626000", libelle: "Frais postaux et de télécommunications", type: "charge" },
  { compte: "626100", libelle: "Frais postaux", type: "charge" },
  { compte: "626200", libelle: "Frais téléphoniques et internet", type: "charge" },
  { compte: "627000", libelle: "Services bancaires et assimilés", type: "charge" },
  { compte: "628100", libelle: "Cotisations aux associations professionnelles", type: "charge" },
  { compte: "628800", libelle: "Autres charges externes", type: "charge" },
  { compte: "631300", libelle: "Participation à la formation professionnelle continue", type: "charge" },
  { compte: "635100", libelle: "Contribution économique territoriale", type: "charge" },
  { compte: "635400", libelle: "Taxes foncières", type: "charge" },
  { compte: "637000", libelle: "Autres impôts, taxes et versements assimilés", type: "charge" },
  { compte: "641100", libelle: "Salaires et appointements", type: "charge" },
  { compte: "641600", libelle: "Congés payés", type: "charge" },
  { compte: "645100", libelle: "Cotisations à l'URSSAF", type: "charge" },
  { compte: "645200", libelle: "Cotisations aux mutuelles", type: "charge" },
  { compte: "645300", libelle: "Cotisations aux caisses de retraite", type: "charge" },
  { compte: "645800", libelle: "Cotisations aux autres organismes sociaux", type: "charge" },
  { compte: "647000", libelle: "Autres charges sociales", type: "charge" },
  { compte: "647200", libelle: "Versements aux comités d'entreprise", type: "charge" },
  { compte: "647400", libelle: "Médecine du travail, pharmacie", type: "charge" },
  { compte: "651000", libelle: "Redevances pour concessions, brevets, licences", type: "charge" },
  { compte: "654000", libelle: "Pertes sur créances irrécouvrables", type: "charge" },
  { compte: "657000", libelle: "Subventions versées par l'association", type: "charge" },
  { compte: "658000", libelle: "Charges diverses de gestion courante", type: "charge" },
  { compte: "661000", libelle: "Charges d'intérêts", type: "charge" },
  { compte: "665000", libelle: "Escomptes accordés", type: "charge" },
  { compte: "666000", libelle: "Pertes de change", type: "charge" },
  { compte: "668000", libelle: "Autres charges financières", type: "charge" },
  { compte: "671000", libelle: "Charges exceptionnelles sur opérations de gestion", type: "charge" },
  { compte: "675000", libelle: "Valeurs comptables des éléments d'actif cédés", type: "charge" },
  { compte: "678000", libelle: "Autres charges exceptionnelles", type: "charge" },
  { compte: "681100", libelle: "Dotations aux amortissements sur immobilisations incorporelles", type: "charge" },
  { compte: "681200", libelle: "Dotations aux amortissements sur immobilisations corporelles", type: "charge" },
  { compte: "681600", libelle: "Dotations aux dépréciations sur immobilisations", type: "charge" },
  { compte: "686000", libelle: "Dotations aux amortissements — charges financières", type: "charge" },
  // CLASSE 7 — COMPTES DE PRODUITS (RESSOURCES)
  { compte: "706000", libelle: "Prestations de services", type: "produit" },
  { compte: "707000", libelle: "Ventes de marchandises", type: "produit" },
  { compte: "708000", libelle: "Produits des activités annexes", type: "produit" },
  { compte: "708300", libelle: "Locations diverses", type: "produit" },
  { compte: "709000", libelle: "Rabais, remises et ristournes accordés", type: "produit" },
  { compte: "713000", libelle: "Variation des stocks de produits", type: "produit" },
  { compte: "721000", libelle: "Productions immobilisées — incorporelles", type: "produit" },
  { compte: "722000", libelle: "Productions immobilisées — corporelles", type: "produit" },
  { compte: "740000", libelle: "Subventions d'exploitation", type: "produit" },
  { compte: "741000", libelle: "Subventions de l'État", type: "produit" },
  { compte: "742000", libelle: "Subventions des départements et régions", type: "produit" },
  { compte: "743000", libelle: "Subventions des communes et groupements", type: "produit" },
  { compte: "744000", libelle: "Subventions d'autres organismes publics", type: "produit" },
  { compte: "745000", libelle: "Subventions de l'Union Européenne", type: "produit" },
  { compte: "746000", libelle: "Subventions des organismes sociaux", type: "produit" },
  { compte: "747000", libelle: "Subventions des organismes internationaux", type: "produit" },
  { compte: "748000", libelle: "Contributions et aides diverses", type: "produit" },
  { compte: "750000", libelle: "Redevances pour concessions, brevets, licences", type: "produit" },
  { compte: "752000", libelle: "Revenus des immeubles non affectés aux activités", type: "produit" },
  { compte: "754000", libelle: "Cotisations des membres", type: "produit" },
  { compte: "755000", libelle: "Cotisations des membres actifs", type: "produit" },
  { compte: "756000", libelle: "Dons manuels", type: "produit" },
  { compte: "757000", libelle: "Legs et donations", type: "produit" },
  { compte: "758000", libelle: "Dons en nature", type: "produit" },
  { compte: "759000", libelle: "Produits divers de gestion courante", type: "produit" },
  { compte: "761000", libelle: "Produits de participations", type: "produit" },
  { compte: "764000", libelle: "Revenus des valeurs mobilières de placement", type: "produit" },
  { compte: "765000", libelle: "Escomptes obtenus", type: "produit" },
  { compte: "766000", libelle: "Gains de change", type: "produit" },
  { compte: "768000", libelle: "Autres produits financiers", type: "produit" },
  { compte: "771000", libelle: "Produits exceptionnels sur opérations de gestion", type: "produit" },
  { compte: "775000", libelle: "Produits des cessions d'éléments d'actif", type: "produit" },
  { compte: "777000", libelle: "Quote-part des subventions d'investissement virée au résultat", type: "produit" },
  { compte: "778000", libelle: "Autres produits exceptionnels", type: "produit" },
  { compte: "781000", libelle: "Reprises sur amortissements et dépréciations", type: "produit" },
  { compte: "791000", libelle: "Transferts de charges d'exploitation", type: "produit" },
  // CLASSE 8 — COMPTES SPÉCIAUX (CONTRIBUTIONS VOLONTAIRES EN NATURE)
  { compte: "860000", libelle: "Emplois des contributions volontaires en nature", type: "emploi_vol" },
  { compte: "861000", libelle: "Secours en nature", type: "emploi_vol" },
  { compte: "862000", libelle: "Mise à disposition gratuite de biens et de prestations", type: "emploi_vol" },
  { compte: "863000", libelle: "Prestations de services en nature", type: "emploi_vol" },
  { compte: "864000", libelle: "Personnel bénévole", type: "emploi_vol" },
  { compte: "865000", libelle: "Participation non monétaire de bénévoles", type: "emploi_vol" },
  { compte: "870000", libelle: "Contributions volontaires en nature", type: "ressource_vol" },
  { compte: "871000", libelle: "Bénévolat", type: "ressource_vol" },
  { compte: "872000", libelle: "Prestations en nature", type: "ressource_vol" },
  { compte: "873000", libelle: "Dons en nature", type: "ressource_vol" },
  { compte: "874000", libelle: "Mécénat de compétences", type: "ressource_vol" },
  { compte: "875000", libelle: "Dons en nature reçus", type: "ressource_vol" },
  { compte: "876000", libelle: "Legs en nature", type: "ressource_vol" },
  { compte: "877000", libelle: "Mise à disposition gratuite de biens reçus", type: "ressource_vol" },
];

const ENTITY_CONFIG = {
  entreprise: {
    label: "Entreprise", emoji: "🏢", plan: PLAN_ENTREPRISE,
    defaultJournal: "ACH", journals: ["ACH", "VTE", "BQ", "CAI", "OD"],
    tvaApplicable: true, compteTVA: "445660", compteFournisseur: "401000", resultLabel: "Résultat net",
  },
  association: {
    label: "Association", emoji: "🤝", plan: PLAN_ASSOCIATION,
    defaultJournal: "ACH", journals: ["ACH", "REC", "BQ", "CAI", "OD", "SUB"],
    tvaApplicable: false, compteTVA: "445660", compteFournisseur: "401000", resultLabel: "Excédent / Déficit",
  },
};

// ─── STYLES ───
const font = `'DM Sans', 'Avenir', sans-serif`;
const mono = `'DM Mono', 'Fira Code', monospace`;
const palette = {
  bg: "#0C0F14", surface: "#151921", surfaceHover: "#1C2230",
  border: "#252D3A", borderLight: "#2E3848",
  accent: "#3ECF8E", accentDim: "rgba(62,207,142,0.12)", accentGlow: "rgba(62,207,142,0.25)",
  purple: "#A78BFA", purpleDim: "rgba(167,139,250,0.12)",
  danger: "#F87171", dangerDim: "rgba(248,113,113,0.12)",
  warn: "#FBBF24", warnDim: "rgba(251,191,36,0.12)",
  blue: "#60A5FA", blueDim: "rgba(96,165,250,0.12)",
  orange: "#FB923C", orangeDim: "rgba(251,146,60,0.12)",
  text: "#E8ECF1", textMuted: "#8896A8", textDim: "#5C6B7F", white: "#FFFFFF",
};

const css = {
  app: { fontFamily: font, background: palette.bg, color: palette.text, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", overflow: "hidden" },
  header: { padding: "20px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: { width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${palette.accent}, #2BA86E)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: palette.bg, boxShadow: `0 0 20px ${palette.accentGlow}` },
  logoText: { fontSize: 15, fontWeight: 700, letterSpacing: -0.5, color: palette.white },
  entityToggle: { display: "flex", gap: 0, background: palette.surface, borderRadius: 12, padding: 3, border: `1px solid ${palette.border}`, margin: "16px 20px 0" },
  entityBtn: (active, type) => ({ flex: 1, padding: "10px 14px", borderRadius: 10, border: "none", background: active ? (type === "entreprise" ? palette.accentDim : palette.purpleDim) : "transparent", color: active ? (type === "entreprise" ? palette.accent : palette.purple) : palette.textMuted, fontSize: 13, fontWeight: 600, fontFamily: font, cursor: "pointer", transition: "all 0.25s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }),
  nav: { display: "flex", gap: 4, background: palette.surface, borderRadius: 12, padding: 3, margin: "12px 20px 0" },
  navBtn: (active) => ({ flex: 1, padding: "9px 10px", borderRadius: 10, border: "none", background: active ? palette.accentDim : "transparent", color: active ? palette.accent : palette.textMuted, fontSize: 12, fontWeight: 600, fontFamily: font, cursor: "pointer", transition: "all 0.2s", textAlign: "center" }),
  section: { padding: "20px 20px" },
  sectionTitle: { fontSize: 13, fontWeight: 600, color: palette.textMuted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 14 },
  card: { background: palette.surface, borderRadius: 14, border: `1px solid ${palette.border}`, padding: 18, marginBottom: 12, transition: "all 0.2s" },
  uploadZone: (drag) => ({ background: drag ? palette.accentDim : palette.surface, borderRadius: 16, border: `2px dashed ${drag ? palette.accent : palette.borderLight}`, padding: "40px 20px", textAlign: "center", cursor: "pointer", transition: "all 0.25s" }),
  btn: (variant = "primary") => ({ padding: "12px 20px", borderRadius: 10, border: variant === "ghost" ? `1px solid ${palette.border}` : "none", background: variant === "primary" ? `linear-gradient(135deg, ${palette.accent}, #2BA86E)` : variant === "danger" ? palette.dangerDim : "transparent", color: variant === "primary" ? palette.bg : variant === "danger" ? palette.danger : palette.text, fontSize: 14, fontWeight: 600, fontFamily: font, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%" }),
  btnSmall: (variant = "ghost") => ({ padding: "6px 12px", borderRadius: 8, border: variant === "ghost" ? `1px solid ${palette.border}` : "none", background: variant === "accent" ? palette.accentDim : variant === "orange" ? palette.orangeDim : variant === "purple" ? palette.purpleDim : "transparent", color: variant === "accent" ? palette.accent : variant === "orange" ? palette.orange : variant === "purple" ? palette.purple : palette.textMuted, fontSize: 12, fontWeight: 600, fontFamily: font, cursor: "pointer", transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 4 }),
  input: { width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.bg, color: palette.text, fontSize: 14, fontFamily: font, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" },
  select: { width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.bg, color: palette.text, fontSize: 14, fontFamily: font, outline: "none", boxSizing: "border-box" },
  badge: (color = palette.accent) => ({ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, background: color === palette.accent ? palette.accentDim : color === palette.purple ? palette.purpleDim : color === palette.orange ? palette.orangeDim : color === palette.blue ? palette.blueDim : palette.warnDim, color, fontSize: 11, fontWeight: 700, letterSpacing: 0.3 }),
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: { padding: "8px 10px", textAlign: "left", color: palette.textMuted, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, borderBottom: `1px solid ${palette.border}` },
  td: { padding: "10px 10px", borderBottom: `1px solid ${palette.border}`, fontFamily: mono, fontSize: 12, color: palette.text },
  emptyState: { textAlign: "center", padding: "40px 20px", color: palette.textDim, fontSize: 14 },
  tag: { display: "inline-block", padding: "2px 8px", borderRadius: 6, background: palette.accentDim, color: palette.accent, fontSize: 11, fontWeight: 600, fontFamily: mono },
  spinner: { width: 20, height: 20, border: `2px solid ${palette.border}`, borderTop: `2px solid ${palette.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  infoBox: (color = palette.blue) => ({ background: color === palette.blue ? palette.blueDim : color === palette.purple ? palette.purpleDim : color === palette.orange ? palette.orangeDim : palette.accentDim, border: `1px solid ${color}33`, borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 12, color, lineHeight: 1.5 }),
};

const Icons = {
  upload: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={palette.accent} strokeWidth="1.8" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>),
  uploadSm: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>),
  scan: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"/><line x1="3" y1="12" x2="21" y2="12" strokeDasharray="3 3"/></svg>),
  trash: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>),
  download: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>),
  x: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  plus: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  check: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>),
  fec: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>),
  brain: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9.5 2A2.5 2.5 0 017 4.5v0A2.5 2.5 0 014.5 7v0A2.5 2.5 0 012 9.5v5A2.5 2.5 0 004.5 17v0A2.5 2.5 0 007 19.5v0A2.5 2.5 0 009.5 22h5a2.5 2.5 0 002.5-2.5v0A2.5 2.5 0 0019.5 17v0A2.5 2.5 0 0022 14.5v-5A2.5 2.5 0 0019.5 7v0A2.5 2.5 0 0017 4.5v0A2.5 2.5 0 0014.5 2h-5z"/></svg>),
};

// ─── CSV / FEC UTILS ───
function generateCSV(ecritures) {
  const headers = ["Date", "N° Pièce", "Compte", "Libellé", "Débit", "Crédit", "Journal"];
  const rows = ecritures.flatMap((e) =>
    e.lignes.map((l) => [e.date, e.piece, l.compte, `"${(l.libelle || "").replace(/"/g, '""')}"`, l.debit ? l.debit.toFixed(2) : "", l.credit ? l.credit.toFixed(2) : "", e.journal || "ACH"])
  );
  return "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
}
function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ─── FEC PARSER ───
// FEC colonnes standard : JournalCode|JournalLib|EcritureNum|EcritureDate|CompteNum|CompteLib|CompAuxNum|CompAuxLib|PieceRef|PieceDate|EcritureLib|Debit|Credit|EcritureLet|DateLet|ValidDate|Montantdevise|Idevise
function parseFEC(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  const sep = lines[0].includes("\t") ? "\t" : "|";
  const headers = lines[0].split(sep).map(h => h.trim().replace(/"/g, "").toLowerCase());

  const idx = {
    compteNum: headers.findIndex(h => h === "comptenum" || h === "compte_num" || h === "compte num"),
    compteLib: headers.findIndex(h => h === "comptelib" || h === "compte_lib"),
    compAuxLib: headers.findIndex(h => h === "compauxlib" || h === "compaux_lib"),
    ecritureLib: headers.findIndex(h => h === "ecriturelib" || h === "ecriture_lib"),
    journalCode: headers.findIndex(h => h === "journalcode" || h === "journal_code"),
    debit: headers.findIndex(h => h === "debit" || h === "montantdebit"),
    credit: headers.findIndex(h => h === "credit" || h === "montantcredit"),
  };

  const fournisseurMap = {}; // normalized name → { compte, libelle, journal, ecritures[] }

  lines.slice(1).forEach(line => {
    const cols = line.split(sep).map(c => c.trim().replace(/"/g, ""));
    const compteNum = idx.compteNum >= 0 ? cols[idx.compteNum] : "";
    const ecritureLib = idx.ecritureLib >= 0 ? cols[idx.ecritureLib] : "";
    const compAuxLib = idx.compAuxLib >= 0 ? cols[idx.compAuxLib] : "";
    const journalCode = idx.journalCode >= 0 ? cols[idx.journalCode] : "";
    const debit = parseFloat((idx.debit >= 0 ? cols[idx.debit] : "0").replace(",", ".")) || 0;
    const credit = parseFloat((idx.credit >= 0 ? cols[idx.credit] : "0").replace(",", ".")) || 0;

    // On s'intéresse aux comptes fournisseurs (401xxx) pour extraire le nom du fournisseur
    if (compteNum.startsWith("401") && compAuxLib) {
      const nomNorm = compAuxLib.trim().toLowerCase();
      if (!fournisseurMap[nomNorm]) {
        fournisseurMap[nomNorm] = { nomOriginal: compAuxLib.trim(), compteAux: compteNum, journal: journalCode, ecritures: [] };
      }
      fournisseurMap[nomNorm].ecritures.push({ ecritureLib, debit, credit });
    }

    // Aussi on cherche les lignes de charges associées dans le journal ACH
    if (compteNum.startsWith("6") && ecritureLib && (journalCode === "ACH" || journalCode === "ACH")) {
      const nomNorm = ecritureLib.toLowerCase().replace(/\s*-\s*facture.*$/i, "").replace(/\s*\d{4,}.*$/, "").trim();
      if (nomNorm.length > 2 && !fournisseurMap[nomNorm]) {
        fournisseurMap[nomNorm] = { nomOriginal: nomNorm, compteCharge: compteNum, journal: journalCode, ecritures: [] };
      }
      if (fournisseurMap[nomNorm] && !fournisseurMap[nomNorm].compteCharge) {
        fournisseurMap[nomNorm].compteCharge = compteNum;
      }
    }
  });

  return Object.values(fournisseurMap);
}

// Recherche un fournisseur connu dans le FEC à partir d'un nom extrait de facture
function matchFournisseurFEC(nomFacture, fecData) {
  if (!fecData || !fecData.length || !nomFacture) return null;
  const nom = nomFacture.toLowerCase().trim();
  // Correspondance exacte d'abord
  let match = fecData.find(f => f.nomOriginal.toLowerCase() === nom);
  if (match) return match;
  // Correspondance partielle (le nom FEC contient le nom facture ou inversement)
  match = fecData.find(f => {
    const fn = f.nomOriginal.toLowerCase();
    return fn.includes(nom) || nom.includes(fn);
  });
  return match || null;
}

// ─── AI ───
import { auth, PROXY_URL } from "./firebase.js";
import { signOut } from "./firebase.js";

async function extractInvoiceData(images, planComptable, entityType, fecData) {
  const config = ENTITY_CONFIG[entityType];
  const planSummary = planComptable.map((c) => `${c.compte} - ${c.libelle} (${c.type})`).join("\n");
  const imageContents = images.map((img) => ({ type: "image", source: { type: "base64", media_type: img.type, data: img.data } }));

  const tvaInstruction = config.tvaApplicable
    ? `L'entité est ASSUJETTIE à la TVA. Extrais le montant HT, la TVA et le TTC. Si la TVA n'apparaît pas, essaie de la déduire (taux standard 20%, intermédiaire 10%, réduit 5.5%).`
    : `L'entité est une ASSOCIATION généralement NON ASSUJETTIE à la TVA. Le montant TTC = montant total payé. Mets tva à 0 et montant_ht = montant_ttc SAUF si la facture montre explicitement une TVA récupérable.`;

  const contextInstruction = entityType === "association"
    ? `C'est la comptabilité d'une ASSOCIATION loi 1901. Utilise la terminologie associative (emplois/ressources, excédent/déficit).`
    : `C'est la comptabilité d'une ENTREPRISE commerciale. Terminologie classique (charges/produits, bénéfice/perte).`;

  const fecContext = fecData && fecData.length > 0
    ? `\nFOURNISSEURS DÉJÀ COMPTABILISÉS (extrait du FEC) :\n${fecData.slice(0, 30).map(f => `- "${f.nomOriginal}" → compte charge: ${f.compteCharge || "?"}, compte aux: ${f.compteAux || "?"}`).join("\n")}\n\nSi le fournisseur de la facture correspond à un fournisseur du FEC, utilise IMPÉRATIVEMENT son compte_charge déjà utilisé.`
    : "";

  // Récupérer le token Firebase Auth
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Utilisateur non connecté");
  const token = await currentUser.getIdToken();

  const response = await fetch(PROXY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      tool: "comptascan",
      messages: [{
        role: "user",
        content: [
          ...imageContents,
          {
            type: "text",
            text: `Tu es un expert-comptable français. ${contextInstruction}

Analyse cette/ces facture(s) et extrais les données pour générer les écritures comptables.

${tvaInstruction}

PLAN COMPTABLE DISPONIBLE :
${planSummary}
${fecContext}

Réponds UNIQUEMENT avec un JSON valide (sans backticks, sans texte autour) :
{
  "factures": [
    {
      "fournisseur": "Nom du fournisseur",
      "numero_facture": "N° de facture",
      "date": "YYYY-MM-DD",
      "montant_ht": 0.00,
      "tva": 0.00,
      "montant_ttc": 0.00,
      "taux_tva": 20,
      "description": "Description courte",
      "compte_charge": "Numéro de compte le plus approprié",
      "fec_match": true
    }
  ]
}

Si le fournisseur est reconnu dans le FEC, mets fec_match à true. Utilise les comptes du plan comptable fourni.`,
          },
        ],
      }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Erreur proxy (${response.status})`);
  }

  const data = await response.json();
  const text = data.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

// ─── VÉRIFICATION D'ÉQUILIBRE ───
function verifierEquilibre(lignes) {
  const totalDebit = lignes.reduce((s, l) => s + (l.debit || 0), 0);
  const totalCredit = lignes.reduce((s, l) => s + (l.credit || 0), 0);
  const ecart = Math.round((totalDebit - totalCredit) * 100) / 100;
  if (Math.abs(ecart) < 0.01) return { equilibre: true, ecart: 0, lignes };
  // Correction automatique : ajustement sur la dernière ligne de charge (débit)
  const lignesCorrigees = [...lignes];
  const idxCharge = lignesCorrigees.findIndex(l => l.debit > 0);
  if (idxCharge >= 0) {
    lignesCorrigees[idxCharge] = {
      ...lignesCorrigees[idxCharge],
      debit: Math.round((lignesCorrigees[idxCharge].debit - ecart) * 100) / 100,
    };
  }
  return { equilibre: false, ecart, lignes: lignesCorrigees };
}

function genererEcritures(factures, planComptable, entityType, fecData) {
  const config = ENTITY_CONFIG[entityType];
  return factures.map((f, idx) => {
    const piece = f.numero_facture || `FAC-${String(idx + 1).padStart(4, "0")}`;
    const fecMatch = matchFournisseurFEC(f.fournisseur, fecData);
    const compteCharge = (fecMatch?.compteCharge) || f.compte_charge || "607000";
    const libelleCharge = planComptable.find((c) => c.compte === compteCharge)?.libelle || "Achat";

    const lignes = [{
      compte: compteCharge,
      libelle: `${f.fournisseur} - ${f.description || libelleCharge}- ${piece}`,
      debit: Math.round((config.tvaApplicable ? f.montant_ht : f.montant_ttc) * 100) / 100,
      credit: 0,
    }];
    if (config.tvaApplicable && f.tva > 0) {
      lignes.push({
        compte: config.compteTVA,
        libelle: `TVA déductible ${f.taux_tva || 20}% - ${f.fournisseur}`,
        debit: Math.round(f.tva * 100) / 100,
        credit: 0,
      });
    }
    lignes.push({
      compte: config.compteFournisseur,
      libelle: `${f.fournisseur} - Facture ${piece}`,
      debit: 0,
      credit: Math.round(f.montant_ttc * 100) / 100,
    });

    const { equilibre, ecart, lignes: lignesFinales } = verifierEquilibre(lignes);

    return {
      id: crypto.randomUUID(),
      date: f.date || new Date().toISOString().split("T")[0],
      piece, fournisseur: f.fournisseur,
      montantTTC: Math.round(f.montant_ttc * 100) / 100,
      journal: config.defaultJournal,
      lignes: lignesFinales,
      status: "validée",
      entityType,
      fecMatch: !!fecMatch,
      fecMatchNom: fecMatch?.nomOriginal,
      equilibre,
      ecartAvantCorrection: ecart,
    };
  });
}

// ─── FEC VIEW ───
function FecView({ fecData, setFecData }) {
  const fecRef = useRef();
  const [dragOver, setDragOver] = useState(false);
  const [stats, setStats] = useState(null);

  const handleFECFile = useCallback((file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const parsed = parseFEC(text);
      setFecData(parsed);
      setStats({
        totalFournisseurs: parsed.filter(f => f.nomOriginal).length,
        avecCompte: parsed.filter(f => f.compteCharge).length,
        lignesTotal: text.split("\n").length - 1,
      });
    };
    reader.readAsText(file, "utf-8");
  }, [setFecData]);

  const onDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFECFile(file);
  };

  return (
    <div style={css.section}>
      <div style={css.sectionTitle}>Fichier d'Écriture Comptable (FEC)</div>

      <div style={css.infoBox(palette.orange)}>
        <strong>À quoi ça sert ?</strong> En important votre FEC, ComptaScan reconnaît automatiquement vos fournisseurs habituels et réutilise leurs comptes comptables déjà utilisés — zéro ressaisie.
      </div>

      {!fecData || fecData.length === 0 ? (
        <div
          style={css.uploadZone(dragOver)}
          onClick={() => fecRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <div style={{ marginBottom: 12, opacity: 0.9 }}>{Icons.fec}</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: palette.text, marginBottom: 6 }}>
            Importer votre FEC
          </div>
          <div style={{ fontSize: 12, color: palette.textDim, marginBottom: 4 }}>
            Fichier texte FEC (.txt) — séparateur | ou tabulation
          </div>
          <div style={{ fontSize: 11, color: palette.textDim }}>
            Généré depuis votre logiciel comptable (Sage, Cegid, EBP, QuadraCompta…)
          </div>
          <input ref={fecRef} type="file" accept=".txt,.csv" style={{ display: "none" }} onChange={(e) => handleFECFile(e.target.files[0])} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            {[
              { label: "Fournisseurs détectés", value: stats?.totalFournisseurs || fecData.length, color: palette.orange },
              { label: "Avec compte charge", value: stats?.avecCompte || fecData.filter(f => f.compteCharge).length, color: palette.accent },
              { label: "Lignes FEC", value: stats?.lignesTotal || "—", color: palette.textMuted },
            ].map((s, i) => (
              <div key={i} style={{ ...css.card, flex: 1, minWidth: 90, marginBottom: 0, padding: 14 }}>
                <div style={{ fontSize: 10, color: palette.textDim, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
                <div style={{ fontFamily: mono, fontSize: 20, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <button style={{ ...css.btnSmall("orange"), flex: 1, justifyContent: "center" }} onClick={() => fecRef.current?.click()}>
              {Icons.uploadSm} Changer de FEC
            </button>
            <button style={{ ...css.btnSmall("ghost"), flex: 1, justifyContent: "center", color: palette.danger }} onClick={() => { setFecData([]); setStats(null); }}>
              {Icons.trash} Supprimer
            </button>
            <input ref={fecRef} type="file" accept=".txt,.csv" style={{ display: "none" }} onChange={(e) => handleFECFile(e.target.files[0])} />
          </div>

          <div style={{ maxHeight: 380, overflowY: "auto" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: palette.textDim, textTransform: "uppercase", letterSpacing: 0.8, padding: "6px 0", borderBottom: `1px solid ${palette.border}`, marginBottom: 8 }}>
              Fournisseurs reconnus
            </div>
            {fecData.filter(f => f.nomOriginal).map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 4px", borderBottom: `1px solid ${palette.border}22` }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: palette.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.nomOriginal}</div>
                  {f.compteAux && <div style={{ fontSize: 10, color: palette.textDim }}>Aux : {f.compteAux}</div>}
                </div>
                <div style={{ flexShrink: 0, marginLeft: 8 }}>
                  {f.compteCharge ? (
                    <span style={css.tag}>{f.compteCharge}</span>
                  ) : (
                    <span style={{ fontSize: 11, color: palette.textDim }}>— compte non détecté</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── CAMERA VIEW ───
// Rendu via un portail DOM sur document.body pour couvrir tout l'écran en PWA Android
function CameraView({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [camError, setCamError] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } }
    }).then(stream => {
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().then(() => setReady(true)).catch(() => setReady(true));
      }
    }).catch(() => setCamError(true));
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
      document.body.style.overflow = "";
    };
  }, []);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      onCapture(new File([blob], `scan_${Date.now()}.jpg`, { type: "image/jpeg" }));
    }, "image/jpeg", 0.92);
  };

  // Style plein écran — injecté via une balise <style> pour contourner
  // la limite maxWidth du conteneur React parent
  return (
    <>
      <style>{`
        #camera-overlay {
          position: fixed !important;
          top: 0 !important; left: 0 !important;
          width: 100vw !important; height: 100vh !important;
          background: #000;
          z-index: 99999 !important;
          display: flex; flex-direction: column;
        }
        #camera-overlay video {
          flex: 1; object-fit: cover; width: 100%; min-height: 0;
        }
        #camera-overlay .cam-bar {
          background: rgba(0,0,0,0.88);
          padding: 16px 30px env(safe-area-inset-bottom, 24px);
          display: flex; align-items: center; justify-content: space-between;
        }
        #camera-overlay .cam-viewfinder {
          position: absolute; top: 0; left: 0; right: 0; bottom: 110px;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none;
        }
        #camera-overlay .cam-frame {
          width: 80%; aspect-ratio: 3/2;
          border: 2px solid #3ECF8E; border-radius: 12px;
        }
      `}</style>
      <div id="camera-overlay">
        {camError ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, gap: 16, color: palette.danger, fontSize: 14, textAlign: "center" }}>
            Impossible d'accéder à la caméra.<br />Vérifiez les permissions dans les réglages.
            <button onClick={onClose} style={{ marginTop: 12, padding: "10px 24px", borderRadius: 8, border: `1px solid ${palette.border}`, background: "transparent", color: palette.text, cursor: "pointer" }}>Fermer</button>
          </div>
        ) : (
          <>
            <video ref={videoRef} playsInline muted autoPlay />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div className="cam-viewfinder"><div className="cam-frame" /></div>
            <div className="cam-bar">
              <button onClick={onClose} style={{ padding: "10px 18px", borderRadius: 8, border: `1px solid ${palette.border}`, background: "transparent", color: palette.text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Annuler
              </button>
              <button onClick={capture} disabled={!ready} style={{ width: 68, height: 68, borderRadius: "50%", border: `3px solid ${palette.accent}`, background: palette.accentDim, display: "flex", alignItems: "center", justifyContent: "center", cursor: ready ? "pointer" : "default", opacity: ready ? 1 : 0.4, transition: "opacity 0.2s" }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#3ECF8E" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </button>
              <div style={{ width: 70 }} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ─── SCAN VIEW ───
function ScanView({ planComptable, entityType, onEcrituresGenerated, fecData }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Analyse en cours...");
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  // Mode batch : chaque image est une facture distincte
  // Mode groupé : toutes les images = une seule facture multi-pages
  const [batchMode, setBatchMode] = useState(false);

  const convertPdfToImages = async (file) => {
    if (!window.pdfjsLib) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    }
    const pdfjsLib = window.pdfjsLib;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pageImages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      pageImages.push({
        id: crypto.randomUUID(), name: `${file.name}_p${i}.jpg`,
        data: dataUrl.split(",")[1], type: "image/jpeg", preview: dataUrl,
        isPdfPage: true, pageNum: i, sourceFile: file.name,
      });
    }
    return pageImages;
  };

  const handleFiles = useCallback(async (files) => {
    for (const file of Array.from(files)) {
      if (file.type === "application/pdf") {
        setLoadingMsg("Conversion PDF en cours...");
        setLoading(true);
        try {
          const pages = await convertPdfToImages(file);
          // En mode batch, chaque PDF = une facture (toutes ses pages groupées)
          setImages((prev) => [...prev, ...pages.map(p => ({ ...p, batchGroup: file.name }))]);
        } catch (e) { setError("Erreur lecture PDF : " + e.message); }
        setLoading(false);
        setLoadingMsg("Analyse en cours...");
      } else if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages((prev) => [...prev, {
            id: crypto.randomUUID(), name: file.name,
            data: e.target.result.split(",")[1], type: file.type,
            preview: e.target.result, batchGroup: file.name,
          }]);
        };
        reader.readAsDataURL(file);
      }
    }
  }, []);

  const handleCameraCapture = (file) => { handleFiles([file]); setShowCamera(false); };

  const analyze = async () => {
    if (!images.length) return;
    setLoading(true); setLoadingMsg("Analyse en cours..."); setError(null);
    try {
      if (batchMode && images.length > 1) {
        // Mode batch : analyser chaque groupe séparément
        const groups = images.reduce((acc, img) => {
          const key = img.batchGroup || img.id;
          if (!acc[key]) acc[key] = [];
          acc[key].push(img);
          return acc;
        }, {});
        const allEcritures = [];
        const keys = Object.keys(groups);
        for (let i = 0; i < keys.length; i++) {
          setLoadingMsg(`Analyse facture ${i + 1}/${keys.length}...`);
          const result = await extractInvoiceData(groups[keys[i]], planComptable, entityType, fecData);
          const ecritures = genererEcritures(result.factures, planComptable, entityType, fecData);
          allEcritures.push(...ecritures);
        }
        onEcrituresGenerated(allEcritures);
      } else {
        const result = await extractInvoiceData(images, planComptable, entityType, fecData);
        const ecritures = genererEcritures(result.factures, planComptable, entityType, fecData);
        onEcrituresGenerated(ecritures);
      }
      setImages([]);
    } catch (e) { setError("Erreur lors de l'analyse : " + e.message); }
    setLoading(false);
  };

  const cameraIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );

  return (
    <div style={css.section}>
      {showCamera && <CameraView onCapture={handleCameraCapture} onClose={() => setShowCamera(false)} />}

      <div style={css.sectionTitle}>Ajouter des factures</div>

      {fecData && fecData.length > 0 && (
        <div style={css.infoBox(palette.orange)}>
          {Icons.brain} <strong>FEC chargé</strong> — {fecData.filter(f => f.compteCharge).length} fournisseurs mémorisés. Les comptes seront réutilisés automatiquement.
        </div>
      )}

      <div style={css.infoBox(entityType === "association" ? palette.purple : palette.blue)}>
        {entityType === "association"
          ? <><strong>Mode Association</strong> — Écritures sans TVA déductible (sauf mention explicite). Plan comptable 86/87.</>
          : <><strong>Mode Entreprise</strong> — TVA déductible extraite automatiquement. Écritures HT / TVA / TTC.</>}
      </div>

      {/* Deux boutons : caméra PWA native + galerie */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <button style={{ ...css.btn("primary"), flex: 1 }} onClick={() => setShowCamera(true)}>
          {cameraIcon} Prendre en photo
        </button>
        <label style={{ ...css.btn("ghost"), flex: 1, cursor: "pointer", margin: 0 }}>
          {Icons.upload} Galerie / PDF
          <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf" multiple style={{ display: "none" }} onChange={(e) => handleFiles(e.target.files)} />
        </label>
      </div>

      {/* Zone de dépôt (desktop) */}
      <label
        style={{ ...css.uploadZone(dragOver), display: "block", cursor: "pointer" }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      >
        <div style={{ fontSize: 12, color: palette.textDim, marginBottom: 4 }}>Ou glisser-déposer ici</div>
        <div style={{ fontSize: 11, color: palette.textDim }}>JPG, PNG, PDF • Plusieurs fichiers à la fois</div>
        <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf" multiple style={{ display: "none" }} onChange={(e) => handleFiles(e.target.files)} />
      </label>

      {/* Toggle mode batch */}
      {images.length > 1 && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, border: `1px solid ${batchMode ? palette.accent : palette.border}`, background: batchMode ? palette.accentDim : palette.surface, marginBottom: 14, cursor: "pointer" }}
          onClick={() => setBatchMode(b => !b)}>
          <div style={{ width: 36, height: 20, borderRadius: 10, background: batchMode ? palette.accent : palette.border, position: "relative", flexShrink: 0, transition: "background 0.2s" }}>
            <div style={{ position: "absolute", top: 2, left: batchMode ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: palette.white, transition: "left 0.2s" }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: batchMode ? palette.accent : palette.text }}>
              Mode lot — {images.length} factures distinctes
            </div>
            <div style={{ fontSize: 11, color: palette.textDim, marginTop: 2 }}>
              {batchMode ? "Chaque fichier = une écriture séparée" : "Tous les fichiers = une seule facture multi-pages"}
            </div>
          </div>
        </div>
      )}
      {images.length > 0 && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          {images.map((img, i) => (
            <div key={img.id} style={{ position: "relative", width: 72, height: 72, borderRadius: 10, overflow: "hidden", border: `1px solid ${palette.border}` }}>
              <img src={img.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", top: 0, right: 0, background: "rgba(0,0,0,0.7)", borderRadius: "0 0 0 8px", padding: "3px 5px", cursor: "pointer", display: "flex" }}
                onClick={(e) => { e.stopPropagation(); setImages((p) => p.filter((x) => x.id !== img.id)); }}>
                {Icons.x}
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.6)", padding: "2px 6px", fontSize: 9, color: palette.textMuted, textAlign: "center" }}>
                Page {i + 1}
              </div>
            </div>
          ))}
          <label style={{ width: 72, height: 72, borderRadius: 10, border: `1px dashed ${palette.borderLight}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: palette.textDim }}>
            {Icons.plus}
            <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf" multiple style={{ display: "none" }} onChange={(e) => handleFiles(e.target.files)} />
          </label>
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <button
          style={{ ...css.btn("primary"), opacity: images.length === 0 ? 0.35 : 1, cursor: images.length === 0 ? "not-allowed" : "pointer" }}
          onClick={analyze}
          disabled={loading || images.length === 0}
        >
          {loading
            ? (<><div style={css.spinner} /> {loadingMsg}</>)
            : images.length === 0
              ? (<>{Icons.scan} Importer des factures pour analyser</>)
              : (<>{Icons.scan} Analyser {images.length} page{images.length > 1 ? "s" : ""}</>)
          }
        </button>
      </div>

      {error && (
        <div style={{ ...css.card, marginTop: 14, borderColor: palette.danger, background: palette.dangerDim, color: palette.danger, fontSize: 13 }}>
          {error}
        </div>
      )}
    </div>
  );
}

// ─── ECRITURES VIEW ───
function EcrituresView({ ecritures, entityType, onDelete }) {
  const exportOne = (e) => downloadCSV(generateCSV([e]), `ecriture_${e.piece}.csv`);
  const exportAll = () => {
    if (!ecritures.length) return;
    downloadCSV(generateCSV(ecritures), `ecritures_${entityType}_${new Date().toISOString().split("T")[0]}.csv`);
  };
  const totalDebit = ecritures.reduce((s, e) => s + e.lignes.reduce((a, l) => a + (l.debit || 0), 0), 0);
  const totalCredit = ecritures.reduce((s, e) => s + e.lignes.reduce((a, l) => a + (l.credit || 0), 0), 0);

  return (
    <div style={css.section}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={css.sectionTitle}>Écritures comptables</div>
        {ecritures.length > 0 && <button style={css.btnSmall("accent")} onClick={exportAll}>{Icons.download} Tout exporter</button>}
      </div>

      {ecritures.length > 0 && (
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { label: "Écritures", value: ecritures.length, color: palette.accent },
            { label: "Total TTC", value: totalCredit.toFixed(2) + "€", color: palette.text },
            { label: "Équilibre", value: Math.abs(totalDebit - totalCredit) < 0.01 ? "✓ OK" : `${(totalDebit - totalCredit).toFixed(2)}€`, color: Math.abs(totalDebit - totalCredit) < 0.01 ? palette.accent : palette.danger },
          ].map((s, i) => (
            <div key={i} style={{ ...css.card, flex: 1, minWidth: 100, marginBottom: 0, padding: 14 }}>
              <div style={{ fontSize: 10, color: palette.textDim, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
              <div style={{ fontFamily: mono, fontSize: 20, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {ecritures.length === 0 ? (
        <div style={css.emptyState}>
          <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.4 }}>{entityType === "association" ? "🤝" : "📒"}</div>
          <div>Aucune écriture pour le moment</div>
          <div style={{ fontSize: 12, marginTop: 6, color: palette.textDim }}>Ajoutez des photos de factures pour générer des écritures</div>
        </div>
      ) : (
        ecritures.map((e) => (
          <div key={e.id} style={css.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{e.fournisseur}</div>
                <div style={{ fontSize: 12, color: palette.textMuted }}>{e.date} • {e.piece}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 16, color: palette.accent }}>{e.montantTTC.toFixed(2)} €</div>
                <div style={{ display: "flex", gap: 4, justifyContent: "flex-end", marginTop: 4, flexWrap: "wrap" }}>
                  <span style={css.badge(palette.accent)}>{e.journal}</span>
                  {e.entityType === "association" && <span style={css.badge(palette.purple)}>ASSO</span>}
                  {e.fecMatch && <span style={css.badge(palette.orange)}>FEC ✓</span>}
                  {!e.fecMatch && <span style={{ ...css.badge(palette.blue), border: `1px dashed ${palette.blue}` }}>✦ Nouveau</span>}
                </div>
              </div>
            </div>

            {e.fecMatch && (
              <div style={{ fontSize: 11, color: palette.orange, background: palette.orangeDim, borderRadius: 8, padding: "4px 10px", marginBottom: 8 }}>
                🔁 Compte réutilisé depuis le FEC — fournisseur connu ({e.fecMatchNom})
              </div>
            )}

            {!e.equilibre && (
              <div style={{ fontSize: 11, color: palette.warn, background: palette.warnDim, borderRadius: 8, padding: "4px 10px", marginBottom: 8 }}>
                ⚠️ Écart détecté ({e.ecartAvantCorrection > 0 ? "+" : ""}{e.ecartAvantCorrection?.toFixed(2)}€) — corrigé automatiquement sur le compte de charge
              </div>
            )}
            {e.equilibre && (
              <div style={{ fontSize: 11, color: palette.accent, background: palette.accentDim, borderRadius: 8, padding: "4px 10px", marginBottom: 8 }}>
                ✓ Écriture équilibrée
              </div>
            )}

            <div style={{ overflowX: "auto", margin: "10px -4px" }}>
              <table style={css.table}>
                <thead>
                  <tr>
                    <th style={css.th}>Compte</th>
                    <th style={css.th}>Libellé</th>
                    <th style={{ ...css.th, textAlign: "right" }}>Débit</th>
                    <th style={{ ...css.th, textAlign: "right" }}>Crédit</th>
                  </tr>
                </thead>
                <tbody>
                  {e.lignes.map((l, i) => (
                    <tr key={i}>
                      <td style={css.td}><span style={css.tag}>{l.compte}</span></td>
                      <td style={{ ...css.td, fontFamily: font, fontSize: 12, color: palette.textMuted, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.libelle}</td>
                      <td style={{ ...css.td, textAlign: "right", color: l.debit ? palette.text : palette.textDim }}>{l.debit ? l.debit.toFixed(2) : "-"}</td>
                      <td style={{ ...css.td, textAlign: "right", color: l.credit ? palette.accent : palette.textDim }}>{l.credit ? l.credit.toFixed(2) : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button style={css.btnSmall("ghost")} onClick={() => exportOne(e)}>{Icons.download} CSV</button>
              <button style={{ ...css.btnSmall("ghost"), color: palette.danger, borderColor: "rgba(248,113,113,0.3)" }} onClick={() => onDelete(e.id)}>{Icons.trash} Supprimer</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── PLAN COMPTABLE VIEW ───
function PlanComptableView({ planComptable, setPlanComptable, entityType }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newCompte, setNewCompte] = useState("");
  const [newLibelle, setNewLibelle] = useState("");
  const [newType, setNewType] = useState("charge");
  const [search, setSearch] = useState("");
  const importRef = useRef();
  const config = ENTITY_CONFIG[entityType];

  const filtered = planComptable.filter((c) => c.compte.includes(search) || c.libelle.toLowerCase().includes(search.toLowerCase()) || c.type.toLowerCase().includes(search.toLowerCase()));
  const grouped = filtered.reduce((acc, c) => {
    const cls = c.compte.charAt(0);
    const labels = { "1": "Classe 1 – Capitaux" + (entityType === "association" ? " / Fonds associatifs" : ""), "2": "Classe 2 – Immobilisations", "3": "Classe 3 – Stocks", "4": "Classe 4 – Tiers", "5": "Classe 5 – Financiers", "6": "Classe 6 – Charges" + (entityType === "association" ? " / Emplois" : ""), "7": "Classe 7 – Produits" + (entityType === "association" ? " / Ressources" : ""), "8": "Classe 8 – Comptes spéciaux" + (entityType === "association" ? " (Contributions volontaires)" : "") };
    const key = labels[cls] || `Classe ${cls}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  const add = () => {
    if (!newCompte || !newLibelle) return;
    setPlanComptable((prev) => [...prev, { compte: newCompte, libelle: newLibelle, type: newType }].sort((a, b) => a.compte.localeCompare(b.compte)));
    setNewCompte(""); setNewLibelle(""); setShowAdd(false);
  };

  const handleImportCSV = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split("\n").filter((l) => l.trim());
      const imported = lines.slice(1).map((line) => {
        const parts = line.split(/[;,]/);
        return { compte: (parts[0] || "").trim().replace(/"/g, ""), libelle: (parts[1] || "").trim().replace(/"/g, ""), type: (parts[2] || "charge").trim().replace(/"/g, "") };
      }).filter((c) => c.compte && c.libelle);
      if (imported.length) setPlanComptable(imported);
    };
    reader.readAsText(file);
  };

  const exportPlan = () => {
    const csv = "\uFEFF" + ["Compte;Libellé;Type", ...planComptable.map((c) => `${c.compte};${c.libelle};${c.type}`)].join("\n");
    downloadCSV(csv, `plan_comptable_${entityType}.csv`);
  };

  const typeOptions = entityType === "association" ? ["charge", "produit", "actif", "passif", "emploi_vol", "ressource_vol"] : ["charge", "produit", "actif", "passif"];

  return (
    <div style={css.section}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={css.sectionTitle}>Plan comptable {entityType === "association" ? "associatif" : "entreprise"}</div>
        <div style={{ display: "flex", gap: 6 }}>
          <button style={css.btnSmall("ghost")} onClick={() => importRef.current?.click()}>{Icons.uploadSm} Import</button>
          <button style={css.btnSmall("ghost")} onClick={exportPlan}>{Icons.download} Export</button>
          <input ref={importRef} type="file" accept=".csv,.txt" style={{ display: "none" }} onChange={handleImportCSV} />
        </div>
      </div>

      {entityType === "association" && (
        <div style={css.infoBox(palette.purple)}>
          <strong>Spécificités associatives</strong> — Comptes 86x/87x pour les contributions volontaires en nature (bénévolat, mises à disposition). Compte 194 pour les fonds dédiés aux subventions affectées.
        </div>
      )}

      <input style={{ ...css.input, marginBottom: 14 }} placeholder="Rechercher un compte..." value={search} onChange={(e) => setSearch(e.target.value)} />

      {!showAdd ? (
        <button style={{ ...css.btn("ghost"), borderStyle: "dashed", marginBottom: 14 }} onClick={() => setShowAdd(true)}>
          {Icons.plus} Ajouter un compte
        </button>
      ) : (
        <div style={{ ...css.card, marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input style={{ ...css.input, width: "35%" }} placeholder="N° compte" value={newCompte} onChange={(e) => setNewCompte(e.target.value)} />
            <input style={{ ...css.input, flex: 1 }} placeholder="Libellé" value={newLibelle} onChange={(e) => setNewLibelle(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <select style={{ ...css.select, flex: 1 }} value={newType} onChange={(e) => setNewType(e.target.value)}>
              {typeOptions.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1).replace("_", " ")}</option>)}
            </select>
            <button style={{ ...css.btnSmall("accent"), padding: "8px 16px" }} onClick={add}>{Icons.check} OK</button>
            <button style={css.btnSmall("ghost")} onClick={() => setShowAdd(false)}>✕</button>
          </div>
        </div>
      )}

      <div style={{ maxHeight: 420, overflow: "auto" }}>
        {Object.entries(grouped).map(([group, comptes]) => (
          <div key={group} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: palette.textDim, textTransform: "uppercase", letterSpacing: 0.8, padding: "6px 0", borderBottom: `1px solid ${palette.border}`, marginBottom: 4 }}>
              {group} ({comptes.length})
            </div>
            {comptes.map((c) => (
              <div key={c.compte} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 8px", borderBottom: `1px solid ${palette.border}22` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                  <span style={css.tag}>{c.compte}</span>
                  <span style={{ fontSize: 12, color: palette.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.libelle}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 9, color: palette.textDim, textTransform: "uppercase" }}>{c.type}</span>
                  <button style={{ ...css.btnSmall("ghost"), padding: 3, color: palette.danger, border: "none" }} onClick={() => setPlanComptable((p) => p.filter((x) => x.compte !== c.compte))}>
                    {Icons.trash}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <div style={{ fontSize: 11, color: palette.textDim }}>{planComptable.length} comptes</div>
        <button style={{ ...css.btnSmall("ghost"), fontSize: 11 }} onClick={() => setPlanComptable([...config.plan])}>
          ↻ Réinitialiser plan {entityType === "association" ? "asso" : "entreprise"}
        </button>
      </div>
    </div>
  );
}

// ─── APP ───
export default function ComptaScan({ user, onHome }) {
  const [entityType, setEntityType] = useState("entreprise");
  const [tab, setTab] = useState("scan");
  const [ecritures, setEcritures] = useState([]);
  const [planComptable, setPlanComptable] = useState(PLAN_ENTREPRISE);
  const [fecData, setFecData] = useState([]);
  const [toast, setToast] = useState(null);

  const switchEntity = (type) => {
    if (type === entityType) return;
    setEntityType(type);
    setPlanComptable([...ENTITY_CONFIG[type].plan]);
    showToast(`Plan comptable ${type === "association" ? "associatif" : "entreprise"} chargé`);
  };

  const handleNewEcritures = (n) => {
    setEcritures((prev) => [...n, ...prev]);
    setTab("ecritures");
    showToast(`${n.length} écriture(s) générée(s)`);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const navItems = [
    { id: "scan", label: "Scan" },
    { id: "ecritures", label: `Écritures${ecritures.length ? ` (${ecritures.length})` : ""}` },
    { id: "fec", label: `FEC${fecData.length ? " ✓" : ""}` },
    { id: "plan", label: "Plan" },
  ];

  // Icônes nav
  const IconHome = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  );
  const IconLogout = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
    </svg>
  );

  return (
    <div style={css.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${palette.border}; border-radius: 4px; }
        input:focus, select:focus { border-color: ${palette.accent} !important; }
        button:hover { opacity: 0.85; }
        button:active { transform: scale(0.97); }
        .logo-text { display: block; }
        @media (max-width: 360px) { .logo-text { display: none; } }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ ...css.header, padding: "16px 20px" }}>
        {/* Logo */}
        <div style={css.logo}>
          <div style={css.logoIcon}>C</div>
          <div className="logo-text" style={css.logoText}>ComptaScan</div>
        </div>

        {/* Actions droite */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {fecData.length > 0 && (
            <div style={{ fontSize: 10, color: palette.orange, background: palette.orangeDim, padding: "3px 8px", borderRadius: 20, fontWeight: 700, letterSpacing: 0.3 }}>
              FEC
            </div>
          )}

          {/* Bouton Accueil */}
          {onHome && (
            <button
              onClick={onHome}
              title="Accueil"
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.surface, color: palette.textMuted, fontSize: 12, fontWeight: 600, fontFamily: font, cursor: "pointer", transition: "all 0.2s" }}
              onMouseOver={e => { e.currentTarget.style.borderColor = palette.borderLight; e.currentTarget.style.color = palette.text; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = palette.border; e.currentTarget.style.color = palette.textMuted; }}
            >
              <IconHome />
              <span className="logo-text">Accueil</span>
            </button>
          )}

          {/* Bouton Déconnexion */}
          <button
            onClick={() => signOut(auth)}
            title={`Déconnexion (${user?.email || ""})`}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 10, border: `1px solid ${palette.dangerDim}`, background: palette.dangerDim, color: palette.danger, fontSize: 12, fontWeight: 600, fontFamily: font, cursor: "pointer", transition: "all 0.2s" }}
            onMouseOver={e => e.currentTarget.style.background = "rgba(248,113,113,0.18)"}
            onMouseOut={e => e.currentTarget.style.background = palette.dangerDim}
          >
            <IconLogout />
            <span className="logo-text">Quitter</span>
          </button>
        </div>
      </div>

      <div style={css.entityToggle}>
        <button style={css.entityBtn(entityType === "entreprise", "entreprise")} onClick={() => switchEntity("entreprise")}>🏢 Entreprise</button>
        <button style={css.entityBtn(entityType === "association", "association")} onClick={() => switchEntity("association")}>🤝 Association</button>
      </div>

      <div style={css.nav}>
        {navItems.map((t) => (
          <button key={t.id} style={css.navBtn(tab === t.id)} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      <div style={{ animation: "fadeIn 0.3s ease" }} key={`${tab}-${entityType}`}>
        {tab === "scan" && <ScanView planComptable={planComptable} entityType={entityType} onEcrituresGenerated={handleNewEcritures} fecData={fecData} />}
        {tab === "ecritures" && <EcrituresView ecritures={ecritures} entityType={entityType} onDelete={(id) => { setEcritures((p) => p.filter((e) => e.id !== id)); showToast("Écriture supprimée"); }} />}
        {tab === "fec" && <FecView fecData={fecData} setFecData={setFecData} />}
        {tab === "plan" && <PlanComptableView planComptable={planComptable} setPlanComptable={setPlanComptable} entityType={entityType} />}
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: 30, left: "50%", transform: "translateX(-50%)", background: entityType === "association" ? palette.purple : palette.accent, color: entityType === "association" ? palette.white : palette.bg, padding: "10px 20px", borderRadius: 12, fontWeight: 600, fontSize: 13, boxShadow: `0 4px 20px ${entityType === "association" ? palette.purpleDim : palette.accentGlow}`, animation: "slideUp 0.3s ease", zIndex: 2000, whiteSpace: "nowrap" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
