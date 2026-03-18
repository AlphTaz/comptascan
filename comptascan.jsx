import { useState, useCallback, useRef, useEffect } from "react";
import { auth, signOut, PROXY_URL } from "./firebase.js";

// ─── PLANS COMPTABLES ───
const PLAN_ENTREPRISE = [
  { compte: "101000", libelle: "Capital", type: "passif" },
  { compte: "401000", libelle: "Fournisseurs", type: "passif" },
  { compte: "401100", libelle: "Fournisseurs — achats de biens et services", type: "passif" },
  { compte: "403000", libelle: "Fournisseurs — effets à payer", type: "passif" },
  { compte: "404000", libelle: "Fournisseurs d'immobilisations", type: "passif" },
  { compte: "408000", libelle: "Fournisseurs — factures non parvenues", type: "passif" },
  { compte: "411000", libelle: "Clients", type: "actif" },
  { compte: "421000", libelle: "Personnel — rémunérations dues", type: "passif" },
  { compte: "431000", libelle: "Sécurité sociale", type: "passif" },
  { compte: "437000", libelle: "Autres organismes sociaux", type: "passif" },
  { compte: "445660", libelle: "TVA déductible sur autres biens et services", type: "actif" },
  { compte: "445670", libelle: "TVA déductible sur immobilisations", type: "actif" },
  { compte: "445710", libelle: "TVA collectée", type: "passif" },
  { compte: "445800", libelle: "Acomptes — régime simplifié / Octroi de Mer", type: "passif" },
  { compte: "447000", libelle: "Autres impôts, taxes et versements assimilés", type: "passif" },
  { compte: "512000", libelle: "Banques comptes courants", type: "actif" },
  { compte: "519000", libelle: "Concours bancaires courants", type: "passif" },
  { compte: "530000", libelle: "Caisse", type: "actif" },
  { compte: "601000", libelle: "Achats de matières premières", type: "charge" },
  { compte: "604000", libelle: "Achats d'études et prestations de services", type: "charge" },
  { compte: "606100", libelle: "Fournitures non stockables — eau, énergie", type: "charge" },
  { compte: "606200", libelle: "Fournitures consommables", type: "charge" },
  { compte: "606300", libelle: "Fournitures d'entretien et petit équipement", type: "charge" },
  { compte: "606400", libelle: "Fournitures administratives", type: "charge" },
  { compte: "606500", libelle: "Fournitures informatiques", type: "charge" },
  { compte: "607000", libelle: "Achats de marchandises", type: "charge" },
  { compte: "611000", libelle: "Sous-traitance générale", type: "charge" },
  { compte: "612100", libelle: "Crédit-bail mobilier", type: "charge" },
  { compte: "612200", libelle: "Crédit-bail immobilier", type: "charge" },
  { compte: "613100", libelle: "Locations mobilières", type: "charge" },
  { compte: "613200", libelle: "Locations immobilières", type: "charge" },
  { compte: "615000", libelle: "Entretien et réparations sur biens propres", type: "charge" },
  { compte: "616000", libelle: "Primes d'assurances", type: "charge" },
  { compte: "617000", libelle: "Études et recherches", type: "charge" },
  { compte: "621000", libelle: "Personnel extérieur à l'entreprise", type: "charge" },
  { compte: "622600", libelle: "Honoraires", type: "charge" },
  { compte: "622700", libelle: "Frais d'actes et de contentieux", type: "charge" },
  { compte: "623100", libelle: "Annonces et insertions publicitaires", type: "charge" },
  { compte: "623700", libelle: "Frais de promotion — site internet", type: "charge" },
  { compte: "624100", libelle: "Transport sur achats", type: "charge" },
  { compte: "625100", libelle: "Voyages et déplacements", type: "charge" },
  { compte: "626100", libelle: "Frais postaux", type: "charge" },
  { compte: "626200", libelle: "Frais téléphoniques et internet", type: "charge" },
  { compte: "627100", libelle: "Frais bancaires sur opérations courantes", type: "charge" },
  { compte: "635100", libelle: "Contribution économique territoriale", type: "charge" },
  { compte: "635400", libelle: "Taxes foncières", type: "charge" },
  { compte: "641100", libelle: "Salaires et appointements — non cadre", type: "charge" },
  { compte: "641200", libelle: "Salaires et appointements — cadre", type: "charge" },
  { compte: "645100", libelle: "Cotisations à l'URSSAF", type: "charge" },
  { compte: "645200", libelle: "Cotisations aux mutuelles", type: "charge" },
  { compte: "661100", libelle: "Intérêts des emprunts et dettes", type: "charge" },
  { compte: "681100", libelle: "Dotations aux amortissements — incorporelles", type: "charge" },
  { compte: "681200", libelle: "Dotations aux amortissements — corporelles", type: "charge" },
  { compte: "695000", libelle: "Impôts sur les bénéfices", type: "charge" },
  { compte: "701000", libelle: "Ventes de produits finis", type: "produit" },
  { compte: "706000", libelle: "Prestations de services", type: "produit" },
  { compte: "707000", libelle: "Ventes de marchandises", type: "produit" },
  { compte: "708000", libelle: "Produits des activités annexes", type: "produit" },
  { compte: "740000", libelle: "Subventions d'exploitation", type: "produit" },
  { compte: "764000", libelle: "Revenus des valeurs mobilières", type: "produit" },
];

const PLAN_ASSOCIATION = [
  { compte: "102000", libelle: "Fonds associatifs sans droit de reprise", type: "passif" },
  { compte: "120000", libelle: "Excédent de l'exercice", type: "passif" },
  { compte: "131000", libelle: "Subventions d'équipement de l'État", type: "passif" },
  { compte: "194000", libelle: "Fonds dédiés sur subventions conditionnelles", type: "passif" },
  { compte: "401000", libelle: "Fournisseurs", type: "passif" },
  { compte: "411000", libelle: "Usagers, adhérents, bénéficiaires", type: "actif" },
  { compte: "441000", libelle: "État — subventions à recevoir", type: "actif" },
  { compte: "443000", libelle: "Collectivités territoriales — subventions à recevoir", type: "actif" },
  { compte: "445660", libelle: "TVA déductible", type: "actif" },
  { compte: "445800", libelle: "Octroi de Mer", type: "passif" },
  { compte: "512000", libelle: "Banque", type: "actif" },
  { compte: "530000", libelle: "Caisse", type: "actif" },
  { compte: "604000", libelle: "Achats d'études et prestations", type: "charge" },
  { compte: "606100", libelle: "Fournitures non stockables", type: "charge" },
  { compte: "606400", libelle: "Fournitures administratives", type: "charge" },
  { compte: "613200", libelle: "Locations immobilières", type: "charge" },
  { compte: "615000", libelle: "Entretien et réparations", type: "charge" },
  { compte: "616000", libelle: "Primes d'assurances", type: "charge" },
  { compte: "622600", libelle: "Honoraires", type: "charge" },
  { compte: "625100", libelle: "Voyages et déplacements", type: "charge" },
  { compte: "626200", libelle: "Frais téléphoniques et internet", type: "charge" },
  { compte: "627000", libelle: "Services bancaires", type: "charge" },
  { compte: "641100", libelle: "Salaires et appointements", type: "charge" },
  { compte: "645100", libelle: "Cotisations à l'URSSAF", type: "charge" },
  { compte: "657000", libelle: "Subventions versées par l'association", type: "charge" },
  { compte: "706000", libelle: "Prestations de services", type: "produit" },
  { compte: "740000", libelle: "Subventions d'exploitation", type: "produit" },
  { compte: "741000", libelle: "Subventions de l'État", type: "produit" },
  { compte: "742000", libelle: "Subventions des départements et régions", type: "produit" },
  { compte: "743000", libelle: "Subventions des communes", type: "produit" },
  { compte: "754000", libelle: "Cotisations des membres", type: "produit" },
  { compte: "756000", libelle: "Dons manuels", type: "produit" },
  { compte: "864000", libelle: "Personnel bénévole", type: "emploi_vol" },
  { compte: "871000", libelle: "Bénévolat", type: "ressource_vol" },
];

const ENTITY_CONFIG = {
  entreprise: { label: "Entreprise", plan: PLAN_ENTREPRISE, defaultJournal: "ACH", tvaApplicable: true, compteTVA: "445660", compteFournisseur: "401000" },
  association: { label: "Association", plan: PLAN_ASSOCIATION, defaultJournal: "ACH", tvaApplicable: false, compteTVA: "445660", compteFournisseur: "401000" },
};

// ─── PALETTE ───
const p = {
  bg: "#0C0F14", surface: "#151921", surface2: "#1C2230",
  border: "#252D3A", borderLight: "#2E3848",
  accent: "#3ECF8E", accentDim: "rgba(62,207,142,0.12)", accentGlow: "rgba(62,207,142,0.3)",
  purple: "#A78BFA", purpleDim: "rgba(167,139,250,0.12)",
  danger: "#F87171", dangerDim: "rgba(248,113,113,0.12)",
  warn: "#FBBF24", warnDim: "rgba(251,191,36,0.12)",
  blue: "#60A5FA", blueDim: "rgba(96,165,250,0.12)",
  orange: "#FB923C",
  text: "#E8ECF1", textMuted: "#8896A8", textDim: "#5C6B7F", white: "#FFFFFF",
};
const font = `'DM Sans', sans-serif`;
const mono = `'DM Mono', monospace`;

// ─── UTILS ───
function generateCSV(ecritures) {
  const rows = ecritures.flatMap(e => e.lignes.map(l => [e.date, e.piece, l.compte, `"${(l.libelle||"").replace(/"/g,'""')}"`, l.debit?l.debit.toFixed(2):"", l.credit?l.credit.toFixed(2):"", e.journal]));
  return "\uFEFF" + ["Date;N° Pièce;Compte;Libellé;Débit;Crédit;Journal", ...rows.map(r => r.join(";"))].join("\n");
}
function downloadCSV(content, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
  a.download = filename; a.click();
}
function checkBalance(lignes) {
  const d = lignes.reduce((s,l)=>s+(parseFloat(l.debit)||0),0);
  const c = lignes.reduce((s,l)=>s+(parseFloat(l.credit)||0),0);
  return { d, c, ecart: Math.round((d-c)*100)/100, ok: Math.abs(d-c)<0.01 };
}
function genererEcritures(factures, planComptable, entityType, fecData) {
  const config = ENTITY_CONFIG[entityType];
  const compteLength = fecData?._compteLength || 6;
  const structure = fecData?._structure || null;

  const compteFournisseurBase = structure?.compteFournisseurPrincipal || adapterCompte(config.compteFournisseur, compteLength);
  const compteTVABase = structure?.compteTVAPrincipal || adapterCompte(config.compteTVA, compteLength);
  const journalAchat = structure?.journalAchatDetecte || config.defaultJournal;

  return factures.map((f, idx) => {
    const piece = f.numero_facture || `FAC-${String(idx + 1).padStart(4, "0")}`;
    const fecMatch = matchFournisseurFEC(f.fournisseur, fecData);
    const compteChargeRaw = f.compte_charge || "607000";
    const compteCharge = fecMatch?.compteCharge || adapterCompte(compteChargeRaw, compteLength);
    const libelleCharge = planComptable.find((c) => c.compte === compteChargeRaw)?.libelle || "Achat";

    const lignes = [{
      compte: compteCharge,
      libelle: `${f.fournisseur} - ${f.description || libelleCharge} - ${piece}`,
      debit: Math.round((config.tvaApplicable ? f.montant_ht : f.montant_ttc) * 100) / 100,
      credit: 0,
    }];

    if (config.tvaApplicable && f.tva > 0) {
      lignes.push({ compte: compteTVABase, libelle: `TVA déductible ${f.taux_tva || 20}% - ${f.fournisseur}`, debit: Math.round(f.tva * 100) / 100, credit: 0 });
    }

    lignes.push({
      compte: fecMatch?.compteAux || compteFournisseurBase,
      compteAux: fecMatch?.compteAuxNum || null,
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
      journal: journalAchat,
      lignes: lignesFinales,
      status: "validée", entityType,
      fecMatch: !!fecMatch, fecMatchNom: fecMatch?.nomOriginal,
      equilibre, ecartAvantCorrection: ecart, compteLength,
    };
  });
}

// ─── VÉRIFICATION D'ÉQUILIBRE ───
function verifierEquilibre(lignes) {
  const totalDebit = lignes.reduce((s, l) => s + (l.debit || 0), 0);
  const totalCredit = lignes.reduce((s, l) => s + (l.credit || 0), 0);
  const ecart = Math.round((totalDebit - totalCredit) * 100) / 100;
  if (Math.abs(ecart) < 0.01) return { equilibre: true, ecart: 0, lignes };
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
// ─── FEC PARSER ───
// FEC colonnes standard : JournalCode|JournalLib|EcritureNum|EcritureDate|CompteNum|CompteLib|CompAuxNum|CompAuxLib|PieceRef|PieceDate|EcritureLib|Debit|Credit|EcritureLet|DateLet|ValidDate|Montantdevise|Idevise
// ─── ANALYSE STRUCTURELLE DU FEC ───
function detecterStructureFEC(lines, sep) {
  const headers = lines[0].split(sep).map(h => h.trim().replace(/"/g, "").toLowerCase());

  const col = (candidates) => {
    for (const c of candidates) {
      const i = headers.findIndex(h => h === c || h.replace(/[_\s]/g, "") === c.replace(/[_\s]/g, ""));
      if (i >= 0) return i;
    }
    return -1;
  };

  const idx = {
    journalCode:  col(["journalcode","journal_code","codejournal"]),
    journalLib:   col(["journallib","journal_lib","libellejournal"]),
    ecritureNum:  col(["ecriturenum","ecriture_num","numeropiece"]),
    ecritureDate: col(["ecrituredate","ecriture_date","date","datepiece"]),
    compteNum:    col(["comptenum","compte_num","numerocompte"]),
    compteLib:    col(["comptelib","compte_lib","libellecompte"]),
    compAuxNum:   col(["compauxnum","compaux_num","numerocomptaux","comptauxiliaire"]),
    compAuxLib:   col(["compauxlib","compaux_lib","libellecomptaux"]),
    pieceRef:     col(["pieceref","piece_ref","referencedocument","numerofacture"]),
    pieceDate:    col(["piecedate","piece_date"]),
    ecritureLib:  col(["ecriturelib","ecriture_lib","libellecriture","libelle"]),
    debit:        col(["debit","montantdebit"]),
    credit:       col(["credit","montantcredit"]),
    montant:      col(["montant","montantdevise"]),
    sens:         col(["sens","debitcredit"]),
    lettrage:     col(["ecriturelet","ecriture_let","lettrage"]),
    validDate:    col(["validdate","valid_date","datevalidation"]),
  };

  const sample = lines.slice(1, 301).map(l => l.split(sep).map(c => c.trim().replace(/"/g, "")));

  // Longueur modale des comptes
  const longueurs = sample.map(c => idx.compteNum >= 0 ? c[idx.compteNum] : "").filter(v => v && /^\d+$/.test(v)).map(v => v.length);
  const freqLen = longueurs.reduce((a, l) => { a[l] = (a[l] || 0) + 1; return a; }, {});
  const compteLength = parseInt(Object.entries(freqLen).sort((a,b) => b[1]-a[1])[0]?.[0] || "6");

  // Comptes auxiliaires
  const aCompteAux = idx.compAuxNum >= 0 && sample.some(c => c[idx.compAuxNum]?.trim());
  const aCompAuxLib = idx.compAuxLib >= 0 && sample.some(c => c[idx.compAuxLib]?.trim());

  // Journaux
  const journaux = {};
  sample.forEach(c => { const j = idx.journalCode >= 0 ? c[idx.journalCode] : ""; if (j) journaux[j] = (journaux[j] || 0) + 1; });
  const journauxAchat = Object.keys(journaux).filter(j => /^(ACH|AH|HA|AC|FAC|FOU|ACHAT)/i.test(j));
  const journalAchatDetecte = journauxAchat[0] || "ACH";

  // Format date
  const dateEx = idx.ecritureDate >= 0 ? (sample.find(c => c[idx.ecritureDate]) || [])[idx.ecritureDate] : null;
  let formatDate = "YYYYMMDD";
  if (dateEx) {
    if (/^\d{4}-\d{2}-\d{2}/.test(dateEx)) formatDate = "YYYY-MM-DD";
    else if (/^\d{2}\/\d{2}\/\d{4}/.test(dateEx)) formatDate = "DD/MM/YYYY";
    else if (/^\d{2}-\d{2}-\d{4}/.test(dateEx)) formatDate = "DD-MM-YYYY";
  }

  // Mode montant unique + sens vs débit/crédit séparés
  const modeMontant = idx.sens >= 0 || (idx.debit < 0 && idx.montant >= 0);

  // Comptes fournisseurs et TVA les plus utilisés
  const cptFourn = {}; const cptTVA = {};
  sample.forEach(c => {
    const num = idx.compteNum >= 0 ? c[idx.compteNum] : "";
    if (num.startsWith("401")) cptFourn[num] = (cptFourn[num] || 0) + 1;
    if (num.startsWith("4456")) cptTVA[num] = (cptTVA[num] || 0) + 1;
  });
  const compteFournisseurPrincipal = Object.entries(cptFourn).sort((a,b) => b[1]-a[1])[0]?.[0] || null;
  const compteTVAPrincipal = Object.entries(cptTVA).sort((a,b) => b[1]-a[1])[0]?.[0] || null;

  return { idx, sep, headers, compteLength, aCompteAux, aCompAuxLib, journaux, journalAchatDetecte, formatDate, modeMontant, compteFournisseurPrincipal, compteTVAPrincipal };
}

function parseFEC(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  const sep = lines[0].includes("\t") ? "\t" : "|";
  const structure = detecterStructureFEC(lines, sep);
  const { idx, compteLength, journalAchatDetecte } = structure;

  const fournisseurMap = {};

  lines.slice(1).forEach(line => {
    const cols = line.split(sep).map(c => c.trim().replace(/"/g, ""));
    const compteNum   = idx.compteNum   >= 0 ? cols[idx.compteNum]   : "";
    const compAuxLib  = idx.compAuxLib  >= 0 ? cols[idx.compAuxLib]  : "";
    const compAuxNum  = idx.compAuxNum  >= 0 ? cols[idx.compAuxNum]  : "";
    const ecritureLib = idx.ecritureLib >= 0 ? cols[idx.ecritureLib] : "";
    const journalCode = idx.journalCode >= 0 ? cols[idx.journalCode] : "";
    const pieceRef    = idx.pieceRef    >= 0 ? cols[idx.pieceRef]    : "";

    let debit = 0, credit = 0;
    if (structure.modeMontant && idx.montant >= 0) {
      const montant = parseFloat((cols[idx.montant] || "0").replace(",", ".")) || 0;
      const sens = idx.sens >= 0 ? (cols[idx.sens] || "").toUpperCase() : "";
      if (sens === "D") debit = montant; else credit = montant;
    } else {
      debit  = parseFloat((idx.debit  >= 0 ? cols[idx.debit]  : "0").replace(",", ".")) || 0;
      credit = parseFloat((idx.credit >= 0 ? cols[idx.credit] : "0").replace(",", ".")) || 0;
    }

    if (compteNum.startsWith("401")) {
      const nomFourn = compAuxLib || ecritureLib || "";
      if (nomFourn) {
        const nomNorm = nomFourn.trim().toLowerCase();
        if (!fournisseurMap[nomNorm]) {
          fournisseurMap[nomNorm] = { nomOriginal: nomFourn.trim(), compteAux: compteNum, compteAuxNum: compAuxNum || null, journal: journalCode, ecritures: [] };
        }
        fournisseurMap[nomNorm].ecritures.push({ ecritureLib, pieceRef, debit, credit });
      }
    }

    const isJournalAchat = journalCode === journalAchatDetecte || /^(ACH|AH)/i.test(journalCode);
    if (compteNum.startsWith("6") && ecritureLib && isJournalAchat) {
      const nomNorm = ecritureLib.toLowerCase().replace(/\s*-\s*facture.*$/i,"").replace(/\s*\d{4,}.*$/,"").trim();
      if (nomNorm.length > 2) {
        if (!fournisseurMap[nomNorm]) fournisseurMap[nomNorm] = { nomOriginal: nomNorm, compteCharge: compteNum, journal: journalCode, ecritures: [] };
        if (!fournisseurMap[nomNorm].compteCharge) fournisseurMap[nomNorm].compteCharge = compteNum;
      }
    }
  });

  const result = Object.values(fournisseurMap);
  Object.defineProperty(result, "_structure", { value: structure, enumerable: false });
  Object.defineProperty(result, "_compteLength", { value: compteLength, enumerable: false });
  return result;
}

function adapterCompte(comptePCG, longueurCible) {
  if (!longueurCible || longueurCible === comptePCG.length) return comptePCG;
  if (longueurCible > comptePCG.length) return comptePCG.padEnd(longueurCible, "0");
  return comptePCG.slice(0, longueurCible);
}

function matchFournisseurFEC(nomFacture, fecData) {
  if (!fecData || !fecData.length || !nomFacture) return null;
  const nom = nomFacture.toLowerCase().trim();
  let match = fecData.find(f => f.nomOriginal.toLowerCase() === nom);
  if (match) return match;
  match = fecData.find(f => { const fn = f.nomOriginal.toLowerCase(); return fn.includes(nom) || nom.includes(fn); });
  return match || null;
}

function genererEcritures(factures, planComptable, entityType, fecData) {
  const config = ENTITY_CONFIG[entityType];
  const compteLength = fecData?._compteLength || 6;
  const structure = fecData?._structure || null;

  const compteFournisseurBase = structure?.compteFournisseurPrincipal || adapterCompte(config.compteFournisseur, compteLength);
  const compteTVABase = structure?.compteTVAPrincipal || adapterCompte(config.compteTVA, compteLength);
  const journalAchat = structure?.journalAchatDetecte || config.defaultJournal;

  return factures.map((f, idx) => {
    const piece = f.numero_facture || `FAC-${String(idx + 1).padStart(4, "0")}`;
    const fecMatch = matchFournisseurFEC(f.fournisseur, fecData);
    const compteChargeRaw = f.compte_charge || "607000";
    const compteCharge = fecMatch?.compteCharge || adapterCompte(compteChargeRaw, compteLength);
    const libelleCharge = planComptable.find((c) => c.compte === compteChargeRaw)?.libelle || "Achat";

    const lignes = [{
      compte: compteCharge,
      libelle: `${f.fournisseur} - ${f.description || libelleCharge} - ${piece}`,
      debit: Math.round((config.tvaApplicable ? f.montant_ht : f.montant_ttc) * 100) / 100,
      credit: 0,
    }];

    if (config.tvaApplicable && f.tva > 0) {
      lignes.push({ compte: compteTVABase, libelle: `TVA déductible ${f.taux_tva || 20}% - ${f.fournisseur}`, debit: Math.round(f.tva * 100) / 100, credit: 0 });
    }

    lignes.push({
      compte: fecMatch?.compteAux || compteFournisseurBase,
      compteAux: fecMatch?.compteAuxNum || null,
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
      journal: journalAchat,
      lignes: lignesFinales,
      status: "validée", entityType,
      fecMatch: !!fecMatch, fecMatchNom: fecMatch?.nomOriginal,
      equilibre, ecartAvantCorrection: ecart, compteLength,
    };
  });
}

// ─── VÉRIFICATION D'ÉQUILIBRE ───
function verifierEquilibre(lignes) {
  const totalDebit = lignes.reduce((s, l) => s + (l.debit || 0), 0);
  const totalCredit = lignes.reduce((s, l) => s + (l.credit || 0), 0);
  const ecart = Math.round((totalDebit - totalCredit) * 100) / 100;
  if (Math.abs(ecart) < 0.01) return { equilibre: true, ecart: 0, lignes };
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

// ─── AI ───
async function extractInvoiceData(images, planComptable, entityType, fecData) {
  const config = ENTITY_CONFIG[entityType];
  const planSummary = planComptable.map((c) => `${c.compte} - ${c.libelle} (${c.type})`).join("\n");
  const imageContents = images.map((img) => ({ type: "image", source: { type: "base64", media_type: img.type, data: img.data } }));

  const tvaInstruction = config.tvaApplicable
    ? `L'entité est ASSUJETTIE à la TVA. Extrais le montant HT, la TVA et le TTC.`
    : `L'entité est une ASSOCIATION NON ASSUJETTIE à la TVA. Mets tva à 0 et montant_ht = montant_ttc SAUF si TVA explicite.`;

  const contextInstruction = entityType === "association"
    ? `C'est la comptabilité d'une ASSOCIATION loi 1901.`
    : `C'est la comptabilité d'une ENTREPRISE commerciale.`;

  const fecContext = fecData && fecData.length > 0
    ? `\nFOURNISSEURS FEC :\n${fecData.slice(0, 30).map(f => `- "${f.nomOriginal}" → compte charge: ${f.compteCharge || "?"}, compte aux: ${f.compteAux || "?"}`).join("\n")}\n\nSi le fournisseur correspond, utilise IMPÉRATIVEMENT son compte_charge.`
    : "";

  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Utilisateur non connecté");
  const token = await currentUser.getIdToken();

  const response = await fetch(PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      tool: "comptascan",
      messages: [{ role: "user", content: [
        ...imageContents,
        { type: "text", text: `Tu es un expert-comptable français. ${contextInstruction}\n\n${tvaInstruction}\n\nPLAN COMPTABLE :\n${planSummary}${fecContext}\n\nRéponds UNIQUEMENT avec un JSON valide :\n{"factures":[{"fournisseur":"","numero_facture":"","date":"YYYY-MM-DD","montant_ht":0,"tva":0,"taux_tva":20,"montant_ttc":0,"description":"","compte_charge":"","taxes":[],"fec_match":false}]}` }
      ]}]
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



// ─── ICONS ───
const Icon = {
  scan: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"/><line x1="3" y1="12" x2="21" y2="12" strokeDasharray="3 3"/></svg>,
  dl: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>,
  trash: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  plus: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  x: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>,
  upload: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>,
  edit: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  search: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  chev: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
};

// ─── STYLE HELPERS ───
const s = {
  card: { background: p.surface, borderRadius: 14, border: `1px solid ${p.border}`, padding: 16, marginBottom: 10 },
  btn: (v="primary") => ({ padding:"11px 18px", borderRadius:10, border: v==="ghost"?`1px solid ${p.border}`:"none", background: v==="primary"?`linear-gradient(135deg,${p.accent},#2BA86E)`:"transparent", color: v==="primary"?p.bg:p.text, fontSize:13, fontWeight:600, fontFamily:font, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7, width:"100%" }),
  btnSm: (v="ghost", clr) => ({ padding:"5px 10px", borderRadius:7, border: v==="ghost"?`1px solid ${p.border}`:"none", background: v==="accent"?p.accentDim:v==="blue"?p.blueDim:v==="danger"?p.dangerDim:"transparent", color: clr||(v==="accent"?p.accent:v==="blue"?p.blue:v==="danger"?p.danger:p.textMuted), fontSize:11, fontWeight:600, fontFamily:font, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:4 }),
  input: { width:"100%", padding:"9px 12px", borderRadius:9, border:`1px solid ${p.border}`, background:p.bg, color:p.text, fontSize:13, fontFamily:font, outline:"none", boxSizing:"border-box" },
  tag: { display:"inline-block", padding:"2px 7px", borderRadius:5, background:p.accentDim, color:p.accent, fontSize:10, fontWeight:700, fontFamily:mono },
  badge: (c=p.accent) => ({ display:"inline-flex", alignItems:"center", padding:"2px 8px", borderRadius:20, background:`${c}18`, color:c, fontSize:10, fontWeight:700 }),
  infoBox: (c=p.blue) => ({ background:`${c}12`, border:`1px solid ${c}30`, borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:12, color:c, lineHeight:1.5 }),
  spinner: { width:17, height:17, border:`2px solid ${p.border}`, borderTop:`2px solid ${p.accent}`, borderRadius:"50%", animation:"spin 0.8s linear infinite" },
};

const typeColor = { charge:p.orange, produit:p.accent, actif:p.blue, passif:p.purple, emploi_vol:p.warn, ressource_vol:p.warn };

// ─── COMPTE SELECTOR ───
function CompteSelector({ value, onChange, planComptable, onAddCompte, placeholder="Sélectionner un compte..." }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newNum, setNewNum] = useState("");
  const [newLib, setNewLib] = useState("");
  const [newType, setNewType] = useState("charge");
  const ref = useRef(); const inputRef = useRef();

  useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open]);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setShowAdd(false); setSearch(""); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = planComptable.filter(c => c.compte.includes(search) || c.libelle.toLowerCase().includes(search.toLowerCase())).slice(0, 50);
  const selected = planComptable.find(c => c.compte === value);

  const handleAdd = () => {
    if (!newNum.trim() || !newLib.trim()) return;
    onAddCompte({ compte: newNum.trim(), libelle: newLib.trim(), type: newType });
    onChange(newNum.trim());
    setNewNum(""); setNewLib(""); setShowAdd(false); setOpen(false); setSearch("");
  };

  return (
    <div ref={ref} style={{ position:"relative" }}>
      <div onClick={() => { setOpen(o=>!o); setSearch(""); setShowAdd(false); }}
        style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 11px", borderRadius:9, border:`1px solid ${open?p.accent:p.border}`, background:p.bg, cursor:"pointer", gap:8, transition:"border-color 0.15s" }}>
        <div style={{ flex:1, minWidth:0 }}>
          {selected ? (
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <span style={{ ...s.tag, flexShrink:0 }}>{selected.compte}</span>
              <span style={{ fontSize:12, color:p.textMuted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{selected.libelle}</span>
            </div>
          ) : <span style={{ fontSize:12, color:p.textDim }}>{value||placeholder}</span>}
        </div>
        <span style={{ color:p.textDim, flexShrink:0, transition:"transform 0.15s", transform:open?"rotate(180deg)":"none" }}>{Icon.chev}</span>
      </div>

      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, background:p.surface2, border:`1px solid ${p.borderLight}`, borderRadius:10, zIndex:2000, boxShadow:"0 8px 32px rgba(0,0,0,0.55)", overflow:"hidden" }}>
          {/* Search */}
          <div style={{ padding:"8px 10px", borderBottom:`1px solid ${p.border}`, display:"flex", alignItems:"center", gap:7 }}>
            <span style={{ color:p.textDim }}>{Icon.search}</span>
            <input ref={inputRef} style={{ flex:1, background:"transparent", border:"none", outline:"none", color:p.text, fontSize:12, fontFamily:font }} placeholder="N° ou libellé..." value={search} onChange={e=>setSearch(e.target.value)} />
            {search && <button onClick={()=>setSearch("")} style={{ background:"none", border:"none", color:p.textDim, cursor:"pointer", padding:0 }}>{Icon.x}</button>}
          </div>

          {/* List */}
          <div style={{ maxHeight:220, overflowY:"auto" }}>
            {filtered.length===0
              ? <div style={{ padding:"14px 12px", textAlign:"center", color:p.textDim, fontSize:12 }}>Aucun compte trouvé</div>
              : filtered.map(c => (
                <div key={c.compte}
                  onClick={() => { onChange(c.compte); setOpen(false); setSearch(""); }}
                  style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 12px", cursor:"pointer", background:c.compte===value?p.accentDim:"transparent", borderBottom:`1px solid ${p.border}18`, transition:"background 0.1s" }}
                  onMouseOver={e => { if(c.compte!==value) e.currentTarget.style.background=`${p.white}06`; }}
                  onMouseOut={e => { if(c.compte!==value) e.currentTarget.style.background="transparent"; }}
                >
                  <span style={{ ...s.tag, flexShrink:0, minWidth:54, textAlign:"center" }}>{c.compte}</span>
                  <span style={{ flex:1, fontSize:12, color:p.text, lineHeight:1.3 }}>{c.libelle}</span>
                  <span style={{ fontSize:9, color:typeColor[c.type]||p.textDim, textTransform:"uppercase", flexShrink:0, fontWeight:700 }}>{c.type}</span>
                  {c.compte===value && <span style={{ color:p.accent }}>{Icon.check}</span>}
                </div>
              ))
            }
          </div>

          {/* Add */}
          {!showAdd
            ? <div style={{ padding:"8px 10px", borderTop:`1px solid ${p.border}` }}>
                <button onClick={()=>{ setShowAdd(true); setNewNum(search.match(/^\d+$/)?search:""); }} style={{ ...s.btnSm("ghost"), width:"100%", justifyContent:"center", padding:"7px", borderStyle:"dashed", color:p.accent, borderColor:`${p.accent}44` }}>
                  {Icon.plus} Ajouter un compte au plan
                </button>
              </div>
            : <div style={{ padding:"10px", borderTop:`1px solid ${p.border}`, background:p.accentDim }}>
                <div style={{ fontSize:11, fontWeight:600, color:p.accent, marginBottom:7 }}>Nouveau compte</div>
                <div style={{ display:"flex", gap:5, marginBottom:6 }}>
                  <input style={{ ...s.input, width:90, fontSize:12, padding:"6px 8px" }} placeholder="N°" value={newNum} onChange={e=>setNewNum(e.target.value)} />
                  <input style={{ ...s.input, flex:1, fontSize:12, padding:"6px 8px" }} placeholder="Libellé" value={newLib} onChange={e=>setNewLib(e.target.value)} />
                </div>
                <div style={{ display:"flex", gap:5 }}>
                  <select style={{ ...s.input, flex:1, fontSize:12, padding:"6px 8px" }} value={newType} onChange={e=>setNewType(e.target.value)}>
                    {["charge","produit","actif","passif","emploi_vol","ressource_vol"].map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                  <button onClick={handleAdd} style={{ ...s.btnSm("accent"), padding:"6px 12px" }}>{Icon.check} OK</button>
                  <button onClick={()=>setShowAdd(false)} style={{ ...s.btnSm("ghost"), padding:"6px 10px" }}>{Icon.x}</button>
                </div>
              </div>
          }
        </div>
      )}
    </div>
  );
}

// ─── LIGNE MODAL ───
function LigneModal({ ligne, index, planComptable, onAddCompte, onSave, onClose }) {
  const [draft, setDraft] = useState({ ...ligne });
  const initMode = (parseFloat(ligne.debit)||0) > 0 ? "debit" : "credit";
  const [mode, setMode] = useState(initMode);
  const montant = mode==="debit" ? (parseFloat(draft.debit)||0) : (parseFloat(draft.credit)||0);

  const setMontant = val => {
    const n = parseFloat(val)||0;
    setDraft(d => mode==="debit" ? {...d, debit:n, credit:0} : {...d, credit:n, debit:0});
  };
  const switchMode = m => {
    const cur = m==="debit" ? (parseFloat(draft.credit)||0) : (parseFloat(draft.debit)||0);
    setMode(m);
    setDraft(d => m==="debit" ? {...d, debit:cur, credit:0} : {...d, credit:cur, debit:0});
  };

  const valid = draft.compte && ((parseFloat(draft.debit)||0)+(parseFloat(draft.credit)||0))>0;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(5px)", zIndex:6000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
      onClick={onClose}>
      <div style={{ background:p.surface, borderRadius:18, border:`1px solid ${p.borderLight}`, width:"100%", maxWidth:420, boxShadow:`0 24px 60px rgba(0,0,0,0.65), 0 0 0 1px ${p.accent}22` }}
        onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding:"15px 18px", borderBottom:`1px solid ${p.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:p.white }}>Modifier la ligne</div>
            <div style={{ fontSize:11, color:p.textDim, marginTop:1 }}>Ligne {index+1}</div>
          </div>
          <button onClick={onClose} style={{ ...s.btnSm("ghost"), padding:"5px 7px" }}>{Icon.x}</button>
        </div>

        {/* Body */}
        <div style={{ padding:"18px" }}>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:10, fontWeight:700, color:p.textMuted, textTransform:"uppercase", letterSpacing:0.9, display:"block", marginBottom:6 }}>Compte</label>
            <CompteSelector value={draft.compte} onChange={v=>setDraft(d=>({...d,compte:v}))} planComptable={planComptable} onAddCompte={onAddCompte} />
          </div>

          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:10, fontWeight:700, color:p.textMuted, textTransform:"uppercase", letterSpacing:0.9, display:"block", marginBottom:6 }}>Libellé</label>
            <input style={s.input} value={draft.libelle||""} onChange={e=>setDraft(d=>({...d,libelle:e.target.value}))} placeholder="Libellé de la ligne..." />
          </div>

          <div style={{ marginBottom:18 }}>
            <label style={{ fontSize:10, fontWeight:700, color:p.textMuted, textTransform:"uppercase", letterSpacing:0.9, display:"block", marginBottom:6 }}>Montant</label>
            <div style={{ display:"flex", gap:4, marginBottom:8 }}>
              {[["debit","Débit",p.blue],["credit","Crédit",p.accent]].map(([m,label,c])=>(
                <button key={m} onClick={()=>switchMode(m)} style={{ flex:1, padding:"8px", borderRadius:8, border:`1px solid ${mode===m?c:p.border}`, background:mode===m?`${c}16`:"transparent", color:mode===m?c:p.textMuted, fontSize:12, fontWeight:700, fontFamily:font, cursor:"pointer", transition:"all 0.15s" }}>{label}</button>
              ))}
            </div>
            <div style={{ position:"relative" }}>
              <input type="number" step="0.01" min="0" style={{ ...s.input, fontFamily:mono, fontSize:20, fontWeight:700, textAlign:"right", paddingRight:40, color:mode==="credit"?p.accent:p.blue }} value={montant||""} onChange={e=>setMontant(e.target.value)} placeholder="0.00" />
              <span style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", color:p.textDim, fontSize:14, fontWeight:600, pointerEvents:"none" }}>€</span>
            </div>
          </div>

          {/* Preview pill */}
          {draft.compte && montant>0 && (
            <div style={{ background:p.bg, borderRadius:10, padding:"9px 13px", marginBottom:16, border:`1px solid ${p.border}`, display:"flex", alignItems:"center", gap:8 }}>
              <span style={s.tag}>{draft.compte}</span>
              <span style={{ flex:1, fontSize:11, color:p.textMuted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{draft.libelle||"—"}</span>
              <span style={{ fontFamily:mono, fontSize:12, fontWeight:700, color:mode==="credit"?p.accent:p.blue, flexShrink:0 }}>{mode==="debit"?"D":"C"} {montant.toFixed(2)} €</span>
            </div>
          )}

          <div style={{ display:"flex", gap:8 }}>
            <button onClick={onClose} style={{ ...s.btn("ghost"), flex:1, padding:"10px" }}>Annuler</button>
            <button onClick={()=>{ if(valid){onSave(draft);onClose();} }} disabled={!valid}
              style={{ ...s.btn("primary"), flex:2, padding:"10px", opacity:valid?1:0.4, cursor:valid?"pointer":"not-allowed" }}>
              {Icon.check} Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ECRITURE MODAL (bottom sheet) ───
function EcritureModal({ ecriture, planComptable, onAddCompte, onSave, onClose }) {
  const [draft, setDraft] = useState(JSON.parse(JSON.stringify(ecriture)));
  const [editingLigne, setEditingLigne] = useState(null);

  const { d, c, ecart, ok } = checkBalance(draft.lignes);

  const updateLigne = (i, l) => setDraft(d => { const ls=[...d.lignes]; ls[i]=l; return {...d,lignes:ls}; });
  const deleteLigne = i => setDraft(d => ({ ...d, lignes:d.lignes.filter((_,j)=>j!==i) }));
  const addLigne = () => {
    const idx = draft.lignes.length;
    setDraft(d => ({ ...d, lignes:[...d.lignes, { compte:"", libelle:"", debit:0, credit:0 }] }));
    setTimeout(()=>setEditingLigne(idx), 30);
  };
  const handleSave = () => {
    const ttc = draft.lignes.reduce((s,l)=>s+(parseFloat(l.credit)||0),0);
    const { ok:eq, ecart:e, lignes } = (() => {
      const ls=[...draft.lignes];
      const D=ls.reduce((s,l)=>s+(parseFloat(l.debit)||0),0);
      const C=ls.reduce((s,l)=>s+(parseFloat(l.credit)||0),0);
      const ec=Math.round((D-C)*100)/100;
      if(Math.abs(ec)<0.01) return {ok:true,ecart:0,lignes:ls};
      const idx=ls.findIndex(l=>(parseFloat(l.debit)||0)>0);
      if(idx>=0) ls[idx]={...ls[idx],debit:Math.round(((parseFloat(ls[idx].debit)||0)-ec)*100)/100};
      return {ok:false,ecart:ec,lignes:ls};
    })();
    onSave({ ...draft, montantTTC:Math.round(ttc*100)/100, lignes, equilibre:eq });
    onClose();
  };

  return (
    <>
      <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(4px)", zIndex:4000, display:"flex", alignItems:"flex-end", justifyContent:"center" }}
        onClick={onClose}>
        <div style={{ background:p.surface, borderRadius:"18px 18px 0 0", border:`1px solid ${p.borderLight}`, width:"100%", maxWidth:520, maxHeight:"88vh", display:"flex", flexDirection:"column", boxShadow:"0 -20px 60px rgba(0,0,0,0.5)" }}
          onClick={e=>e.stopPropagation()}>

          {/* Header */}
          <div style={{ padding:"16px 20px", borderBottom:`1px solid ${p.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:p.white }}>Modifier l'écriture</div>
              <div style={{ fontSize:11, color:p.textDim, marginTop:1 }}>{draft.fournisseur} · {draft.piece}</div>
            </div>
            <button onClick={onClose} style={{ ...s.btnSm("ghost"), padding:"5px 7px" }}>{Icon.x}</button>
          </div>

          {/* Infos */}
          <div style={{ padding:"14px 20px", borderBottom:`1px solid ${p.border}`, flexShrink:0 }}>
            <div style={{ display:"flex", gap:8, marginBottom:8 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, color:p.textDim, marginBottom:4 }}>FOURNISSEUR</div>
                <input style={{ ...s.input, fontSize:12 }} value={draft.fournisseur} onChange={e=>setDraft(d=>({...d,fournisseur:e.target.value}))} />
              </div>
              <div style={{ width:118 }}>
                <div style={{ fontSize:10, color:p.textDim, marginBottom:4 }}>DATE</div>
                <input style={{ ...s.input, fontSize:12 }} type="date" value={draft.date} onChange={e=>setDraft(d=>({...d,date:e.target.value}))} />
              </div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, color:p.textDim, marginBottom:4 }}>N° PIÈCE</div>
                <input style={{ ...s.input, fontSize:12 }} value={draft.piece} onChange={e=>setDraft(d=>({...d,piece:e.target.value}))} />
              </div>
              <div style={{ width:70 }}>
                <div style={{ fontSize:10, color:p.textDim, marginBottom:4 }}>JOURNAL</div>
                <input style={{ ...s.input, fontSize:12 }} value={draft.journal} onChange={e=>setDraft(d=>({...d,journal:e.target.value}))} />
              </div>
            </div>
          </div>

          {/* Lignes */}
          <div style={{ flex:1, overflowY:"auto", padding:"14px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <div style={{ fontSize:11, fontWeight:700, color:p.textMuted, textTransform:"uppercase", letterSpacing:0.8 }}>Lignes ({draft.lignes.length})</div>
              <div style={{ fontSize:11, fontFamily:mono, color:ok?p.accent:p.danger, background:ok?p.accentDim:p.dangerDim, padding:"3px 9px", borderRadius:20, fontWeight:700 }}>
                {ok ? "✓ Équilibré" : `Écart ${ecart>0?"+":""}${ecart.toFixed(2)}€`}
              </div>
            </div>

            {draft.lignes.map((l,i) => {
              const deb = parseFloat(l.debit)||0;
              const cred = parseFloat(l.credit)||0;
              const side = deb>0 ? "D" : "C";
              const montant = deb>0 ? deb : cred;
              const lineColor = side==="C" ? p.accent : p.blue;
              const info = planComptable.find(c=>c.compte===l.compte);
              return (
                <div key={i} onClick={()=>setEditingLigne(i)}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 13px", borderRadius:10, border:`1px solid ${p.border}`, marginBottom:6, cursor:"pointer", background:p.surface, transition:"all 0.12s" }}
                  onMouseOver={e=>{e.currentTarget.style.borderColor=`${p.accent}55`;e.currentTarget.style.background=p.accentDim;}}
                  onMouseOut={e=>{e.currentTarget.style.borderColor=p.border;e.currentTarget.style.background=p.surface;}}>
                  <div style={{ flexShrink:0 }}>
                    {l.compte ? <span style={s.tag}>{l.compte}</span> : <span style={{ ...s.tag, background:p.dangerDim, color:p.danger }}>???</span>}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, color:p.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.libelle||<span style={{color:p.textDim}}>Sans libellé</span>}</div>
                    {info && <div style={{ fontSize:10, color:p.textDim, marginTop:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{info.libelle}</div>}
                  </div>
                  <span style={{ fontFamily:mono, fontSize:13, fontWeight:700, color:lineColor, flexShrink:0 }}>{side} {montant.toFixed(2)}</span>
                  <span style={{ color:p.textDim, flexShrink:0, opacity:0.7 }}>{Icon.edit}</span>
                  <button onClick={e=>{e.stopPropagation();deleteLigne(i);}} style={{ ...s.btnSm("ghost"), padding:"3px 5px", color:p.danger, border:"none", flexShrink:0 }}>{Icon.trash}</button>
                </div>
              );
            })}

            <button onClick={addLigne} style={{ ...s.btnSm("ghost"), width:"100%", justifyContent:"center", padding:"10px", borderStyle:"dashed", color:p.accent, borderColor:`${p.accent}44`, marginTop:4 }}>
              {Icon.plus} Ajouter une ligne
            </button>
          </div>

          {/* Footer */}
          <div style={{ padding:"12px 20px", borderTop:`1px solid ${p.border}`, display:"flex", gap:8, flexShrink:0 }}>
            <button onClick={onClose} style={{ ...s.btn("ghost"), flex:1, padding:"10px" }}>Annuler</button>
            <button onClick={handleSave} style={{ ...s.btn("primary"), flex:2, padding:"10px" }}>{Icon.check} Enregistrer</button>
          </div>
        </div>
      </div>

      {/* Nested ligne modal */}
      {editingLigne!==null && draft.lignes[editingLigne]!==undefined && (
        <LigneModal
          ligne={draft.lignes[editingLigne]}
          index={editingLigne}
          planComptable={planComptable}
          onAddCompte={onAddCompte}
          onSave={l=>updateLigne(editingLigne,l)}
          onClose={()=>setEditingLigne(null)}
        />
      )}
    </>
  );
}

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
        compteLength: parsed._compteLength || 6,
        // Infos structure
        sep: parsed._structure?.sep || "|",
        formatDate: parsed._structure?.formatDate || "YYYYMMDD",
        journalAchatDetecte: parsed._structure?.journalAchatDetecte || "ACH",
        aCompteAux: parsed._structure?.aCompteAux || false,
        modeMontant: parsed._structure?.modeMontant || false,
        journaux: parsed._structure?.journaux || {},
        compteFournisseurPrincipal: parsed._structure?.compteFournisseurPrincipal || null,
        compteTVAPrincipal: parsed._structure?.compteTVAPrincipal || null,
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
          <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
            {[
              { label: "Fournisseurs", value: stats?.totalFournisseurs || fecData.length, color: palette.orange },
              { label: "Avec compte", value: stats?.avecCompte || fecData.filter(f => f.compteCharge).length, color: palette.accent },
              { label: "Format comptes", value: `${stats?.compteLength || fecData._compteLength || 6} chiffres`, color: palette.blue },
            ].map((s, i) => (
              <div key={i} style={{ ...css.card, flex: 1, minWidth: 90, marginBottom: 0, padding: 14 }}>
                <div style={{ fontSize: 10, color: palette.textDim, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
                <div style={{ fontFamily: mono, fontSize: 20, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Infos structure détectée */}
          {stats && (
            <div style={{ ...css.infoBox(palette.blue), marginBottom: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Structure détectée</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", fontSize: 11 }}>
                <span>📋 Séparateur : <strong>{stats.sep === "\t" ? "Tabulation" : "Pipe (|)"}</strong></span>
                <span>📅 Format date : <strong>{stats.formatDate}</strong></span>
                <span>📒 Journal achat : <strong>{stats.journalAchatDetecte}</strong></span>
                <span>🔢 Comptes aux : <strong>{stats.aCompteAux ? "Oui" : "Non"}</strong></span>
                {stats.modeMontant && <span>💰 Mode : <strong>Montant + Sens</strong></span>}
                {stats.compteFournisseurPrincipal && <span>401 : <strong>{stats.compteFournisseurPrincipal}</strong></span>}
                {stats.compteTVAPrincipal && <span>TVA : <strong>{stats.compteTVAPrincipal}</strong></span>}
                {Object.keys(stats.journaux || {}).length > 0 && (
                  <span>Journaux : <strong>{Object.entries(stats.journaux).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([j,n])=>`${j}(${n})`).join(" · ")}</strong></span>
                )}
              </div>
            </div>
          )}

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
                  <div style={{ fontSize: 10, color: palette.textDim, display: "flex", gap: 8, marginTop: 2 }}>
                    {f.compteAux && <span>401 : {f.compteAux}</span>}
                    {f.compteAuxNum && <span>Aux : {f.compteAuxNum}</span>}
                    {f.journal && <span>Journal : {f.journal}</span>}
                  </div>
                </div>
                <div style={{ flexShrink: 0, marginLeft: 8 }}>
                  {f.compteCharge
                    ? <span style={css.tag}>{f.compteCharge}</span>
                    : <span style={{ fontSize: 11, color: palette.textDim }}>— non détecté</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── SCAN VIEW ───
function ScanView({ planComptable, entityType, onEcrituresGenerated }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Analyse IA...");
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // ── Conversion PDF → images via PDF.js (chargé dynamiquement) ──
  const convertPdfToImages = async (file) => {
    if (!window.pdfjsLib) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.onload = resolve;
        script.onerror = () => reject(new Error("Impossible de charger PDF.js"));
        document.head.appendChild(script);
      });
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    }
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
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
        id: crypto.randomUUID(),
        name: `${file.name} — p.${i}`,
        data: dataUrl.split(",")[1],
        type: "image/jpeg",
        preview: dataUrl,
        isPdf: true,
        pageNum: i,
        totalPages: pdf.numPages,
        sourceFile: file.name,
      });
    }
    return pageImages;
  };

  const handleFiles = useCallback(async (files) => {
    for (const f of Array.from(files)) {
      if (f.type === "application/pdf") {
        setLoadingMsg(`Conversion PDF "${f.name}"…`);
        setLoading(true);
        try {
          const pages = await convertPdfToImages(f);
          setImages(prev => [...prev, ...pages]);
        } catch(e) {
          setError("Erreur PDF : " + e.message);
        }
        setLoading(false);
        setLoadingMsg("Analyse IA...");
      } else if (f.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = ev => setImages(prev => [...prev, {
          id: crypto.randomUUID(), name: f.name,
          data: ev.target.result.split(",")[1], type: f.type, preview: ev.target.result,
        }]);
        reader.readAsDataURL(f);
      }
    }
  }, []);

  const analyze = async () => {
    if (!images.length) return;
    setLoading(true); setError(null);
    try {
      const result = await extractInvoiceData(images, planComptable, entityType);
      onEcrituresGenerated(genererEcritures(result.factures, planComptable, entityType));
      setImages([]);
    } catch(e) { setError("Erreur : "+e.message); }
    setLoading(false);
  };

  const iconCamera = (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );

  return (
    <div style={{ padding:"18px" }}>
      <div style={{ fontSize:11, fontWeight:700, color:p.textMuted, textTransform:"uppercase", letterSpacing:1.2, marginBottom:14 }}>
        Ajouter des factures
      </div>

      <div style={s.infoBox(entityType==="association" ? p.purple : p.blue)}>
        {entityType==="association"
          ? <><strong>Mode Association</strong> — Sans TVA. Plan 1901.</>
          : <><strong>Mode Entreprise</strong> — TVA extraite automatiquement.</>}
      </div>

      {/* ── Boutons d'import ── */}
      <div style={{ display:"flex", gap:10, marginBottom:14 }}>
        {/* Caméra — capture directe mobile */}
        <button
          onClick={() => cameraInputRef.current?.click()}
          style={{ ...s.btn("primary"), flex:1 }}
        >
          {iconCamera} Photo
        </button>
        {/* Galerie / fichiers */}
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{ ...s.btn("ghost"), flex:1 }}
        >
          {Icon.upload} Galerie / PDF
        </button>
      </div>

      {/* Inputs cachés — déclenchés programmatiquement via ref */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display:"none" }}
        onChange={e => { handleFiles(e.target.files); e.target.value=""; }}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
        multiple
        style={{ display:"none" }}
        onChange={e => { handleFiles(e.target.files); e.target.value=""; }}
      />

      {/* Zone drag & drop desktop */}
      <div
        style={{
          background: dragOver ? p.accentDim : p.surface,
          borderRadius: 14,
          border: `2px dashed ${dragOver ? p.accent : p.borderLight}`,
          padding: "24px 20px",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.25s",
          marginBottom: 14,
        }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      >
        <div style={{ fontSize:12, color:p.textDim, marginBottom:3 }}>Ou glisser-déposer ici</div>
        <div style={{ fontSize:11, color:p.textDim }}>JPG · PNG · WEBP · <span style={{ color:p.orange }}>PDF</span></div>
      </div>

      {/* Miniatures des images chargées */}
      {images.length > 0 && (
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
          {images.map(img => (
            <div key={img.id} style={{ position:"relative", width:66, height:66, borderRadius:8, overflow:"hidden", border:`1px solid ${p.border}` }}>
              <img src={img.preview} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              {/* Badge page PDF */}
              {img.isPdf && (
                <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"rgba(251,146,60,0.85)", fontSize:9, fontWeight:700, color:"#fff", textAlign:"center", padding:"2px 0", fontFamily:mono }}>
                  p.{img.pageNum}/{img.totalPages}
                </div>
              )}
              <div
                style={{ position:"absolute", top:2, right:2, background:"rgba(0,0,0,0.75)", borderRadius:4, padding:"2px 4px", cursor:"pointer", display:"flex" }}
                onClick={() => setImages(prev => prev.filter(x => x.id !== img.id))}
              >
                {Icon.x}
              </div>
            </div>
          ))}
          {/* Bouton + pour ajouter d'autres images */}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{ width:66, height:66, borderRadius:8, border:`1px dashed ${p.borderLight}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:p.textDim }}
          >
            {Icon.plus}
          </div>
        </div>
      )}

      {/* Bouton analyser */}
      <button
        style={{ ...s.btn("primary"), opacity: images.length===0 ? 0.35 : 1, cursor: images.length===0 ? "not-allowed" : "pointer" }}
        onClick={analyze}
        disabled={loading || images.length===0 || noTokens}
      >
        {loading
          ? <><div style={s.spinner}/> {loadingMsg}</>
          : <>{Icon.scan} Analyser {images.length > 0 ? `${images.length} page(s)` : "des factures"}</>
        }
      </button>

      {error && (
        <div style={{ ...s.card, marginTop:12, borderColor:p.danger, background:p.dangerDim, color:p.danger, fontSize:12 }}>
          {error}
        </div>
      )}
    </div>
  );
}

// ─── ECRITURES VIEW ───
function EcrituresView({ ecritures, planComptable, onAddCompte, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const totalTTC = ecritures.reduce((s,e)=>s+e.montantTTC, 0);
  const editing = ecritures.find(e=>e.id===editingId);

  if (!ecritures.length) return (
    <div style={{ padding:"18px" }}>
      <div style={{ fontSize:11, fontWeight:700, color:p.textMuted, textTransform:"uppercase", letterSpacing:1.2, marginBottom:14 }}>Écritures comptables</div>
      <div style={{ textAlign:"center", padding:"40px 20px", color:p.textDim, fontSize:13 }}>
        <div style={{ fontSize:28, marginBottom:10, opacity:0.3 }}>📒</div>
        Aucune écriture. Importez des factures dans l'onglet Scan.
      </div>
    </div>
  );

  return (
    <div style={{ padding:"18px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <div style={{ fontSize:11, fontWeight:700, color:p.textMuted, textTransform:"uppercase", letterSpacing:1.2 }}>Écritures</div>
        <button style={s.btnSm("accent")} onClick={()=>downloadCSV(generateCSV(ecritures),`ecritures_${new Date().toISOString().split("T")[0]}.csv`)}>{Icon.dl} Exporter</button>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {[{label:"Écritures",value:ecritures.length,color:p.accent},{label:"Total TTC",value:totalTTC.toFixed(2)+" €",color:p.text}].map((st,i)=>(
          <div key={i} style={{ ...s.card, flex:1, marginBottom:0, padding:12 }}>
            <div style={{ fontSize:9, color:p.textDim, textTransform:"uppercase", letterSpacing:1 }}>{st.label}</div>
            <div style={{ fontFamily:mono, fontSize:18, fontWeight:700, color:st.color, marginTop:3 }}>{st.value}</div>
          </div>
        ))}
      </div>

      {ecritures.map(e => {
        const {ok} = checkBalance(e.lignes);
        return (
          <div key={e.id} style={s.card}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:14, color:p.white, marginBottom:3 }}>{e.fournisseur}</div>
                <div style={{ fontSize:11, color:p.textMuted }}>{e.date} · {e.piece} · <span style={s.badge(p.accent)}>{e.journal}</span></div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0, marginLeft:10 }}>
                <div style={{ fontFamily:mono, fontWeight:700, fontSize:16, color:p.accent }}>{e.montantTTC.toFixed(2)} €</div>
                {e.entityType==="association" && <span style={s.badge(p.purple)}>ASSO</span>}
              </div>
            </div>

            <div style={{ fontSize:11, borderRadius:7, padding:"4px 10px", marginBottom:10, color:ok?p.accent:p.warn, background:ok?p.accentDim:p.warnDim }}>
              {ok ? "✓ Équilibrée" : "⚠ Déséquilibre détecté — cliquez pour corriger"}
            </div>

            {/* Lignes cliquables → ouvre le modal de l'écriture */}
            <div style={{ marginBottom:10 }}>
              {e.lignes.map((l,i) => {
                const deb=parseFloat(l.debit)||0, cred=parseFloat(l.credit)||0;
                const side=deb>0?"D":"C", montant=deb>0?deb:cred;
                const lineColor=side==="C"?p.accent:p.blue;
                return (
                  <div key={i} onClick={()=>setEditingId(e.id)}
                    style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:8, marginBottom:3, cursor:"pointer", transition:"background 0.12s" }}
                    onMouseOver={ev=>ev.currentTarget.style.background=p.accentDim}
                    onMouseOut={ev=>ev.currentTarget.style.background="transparent"}>
                    <span style={{ ...s.tag, flexShrink:0 }}>{l.compte||"???"}</span>
                    <span style={{ flex:1, fontSize:11, color:p.textMuted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.libelle}</span>
                    <span style={{ fontFamily:mono, fontSize:11, fontWeight:700, color:lineColor, flexShrink:0 }}>{side} {montant.toFixed(2)}</span>
                    <span style={{ color:p.textDim, opacity:0.6 }}>{Icon.edit}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ display:"flex", gap:6 }}>
              <button style={{ ...s.btnSm("blue"), flex:2 }} onClick={()=>setEditingId(e.id)}>{Icon.edit} Modifier</button>
              <button style={s.btnSm()} onClick={()=>downloadCSV(generateCSV([e]),`ecriture_${e.piece}.csv`)}>{Icon.dl}</button>
              <button style={{ ...s.btnSm("ghost"),color:p.danger }} onClick={()=>onDelete(e.id)}>{Icon.trash}</button>
            </div>
          </div>
        );
      })}

      {editing && (
        <EcritureModal
          ecriture={editing}
          planComptable={planComptable}
          onAddCompte={onAddCompte}
          onSave={u=>{onUpdate(u);setEditingId(null);}}
          onClose={()=>setEditingId(null)}
        />
      )}
    </div>
  );
}

// ─── PLAN VIEW ───
function PlanComptableView({ planComptable, setPlanComptable, entityType }) {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newC, setNewC] = useState(""); const [newL, setNewL] = useState(""); const [newT, setNewT] = useState("charge");
  const cfg = ENTITY_CONFIG[entityType];
  const filtered = planComptable.filter(c=>c.compte.includes(search)||c.libelle.toLowerCase().includes(search.toLowerCase()));
  const grouped = filtered.reduce((acc,c)=>{ const k={"1":"Classe 1","2":"Classe 2","3":"Classe 3","4":"Classe 4","5":"Classe 5","6":"Classe 6 – Charges","7":"Classe 7 – Produits","8":"Classe 8"}[c.compte[0]]||"Autre"; if(!acc[k]) acc[k]=[]; acc[k].push(c); return acc; },{});
  return (
    <div style={{ padding:"18px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <div style={{ fontSize:11, fontWeight:700, color:p.textMuted, textTransform:"uppercase", letterSpacing:1.2 }}>Plan comptable</div>
        <button style={s.btnSm("ghost")} onClick={()=>setPlanComptable([...cfg.plan])}>↻ Réinitialiser</button>
      </div>
      <input style={{ ...s.input, marginBottom:12 }} placeholder="Rechercher…" value={search} onChange={e=>setSearch(e.target.value)} />
      {!showAdd
        ? <button style={{ ...s.btn("ghost"), borderStyle:"dashed", marginBottom:14 }} onClick={()=>setShowAdd(true)}>{Icon.plus} Ajouter</button>
        : <div style={{ ...s.card, marginBottom:14 }}>
            <div style={{ display:"flex", gap:6, marginBottom:7 }}>
              <input style={{ ...s.input, width:"35%" }} placeholder="N°" value={newC} onChange={e=>setNewC(e.target.value)} />
              <input style={{ ...s.input, flex:1 }} placeholder="Libellé" value={newL} onChange={e=>setNewL(e.target.value)} />
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <select style={{ ...s.input, flex:1 }} value={newT} onChange={e=>setNewT(e.target.value)}>
                {["charge","produit","actif","passif","emploi_vol","ressource_vol"].map(t=><option key={t} value={t}>{t}</option>)}
              </select>
              <button style={{ ...s.btnSm("accent"), padding:"7px 13px" }} onClick={()=>{ if(!newC||!newL) return; setPlanComptable(prev=>[...prev,{compte:newC,libelle:newL,type:newT}].sort((a,b)=>a.compte.localeCompare(b.compte))); setNewC("");setNewL("");setShowAdd(false); }}>{Icon.check}</button>
              <button style={s.btnSm()} onClick={()=>setShowAdd(false)}>{Icon.x}</button>
            </div>
          </div>
      }
      <div style={{ maxHeight:400, overflowY:"auto" }}>
        {Object.entries(grouped).map(([g,cs])=>(
          <div key={g} style={{ marginBottom:14 }}>
            <div style={{ fontSize:10, fontWeight:700, color:p.textDim, textTransform:"uppercase", letterSpacing:0.8, padding:"4px 0", borderBottom:`1px solid ${p.border}`, marginBottom:4 }}>{g} ({cs.length})</div>
            {cs.map(c=>(
              <div key={c.compte} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"6px 4px", borderBottom:`1px solid ${p.border}18` }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, flex:1, minWidth:0 }}>
                  <span style={s.tag}>{c.compte}</span>
                  <span style={{ fontSize:12, color:p.textMuted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.libelle}</span>
                </div>
                <button style={{ ...s.btnSm("ghost"), padding:"2px 5px", color:p.danger, border:"none" }} onClick={()=>setPlanComptable(prev=>prev.filter(x=>x.compte!==c.compte))}>{Icon.trash}</button>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ fontSize:11, color:p.textDim, marginTop:10 }}>{planComptable.length} comptes</div>
    </div>
  );
}

// ─── APP ───
export default function ComptaScan({ user, userProfile, onHome }) {
  const [entityType, setEntityType] = useState("entreprise");
  const [tab, setTab] = useState("scan");
  const [ecritures, setEcritures] = useState([]);
  const [planComptable, setPlanComptable] = useState(PLAN_ENTREPRISE);
  const [fecData, setFecData] = useState([]);
  const [toast, setToast] = useState(null);

  const switchEntity = t => {
    if (t===entityType) return;
    setEntityType(t); setPlanComptable([...ENTITY_CONFIG[t].plan]);
    showToast(`Plan ${t==="association"?"associatif":"entreprise"} chargé`);
  };
  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(null),2500); };
  const handleAddCompte = c => {
    setPlanComptable(prev => prev.find(x=>x.compte===c.compte) ? prev : [...prev,c].sort((a,b)=>a.compte.localeCompare(b.compte)));
    showToast(`Compte ${c.compte} ajouté ✓`);
  };

  const navItems = [{id:"scan",label:"Scan"},{id:"ecritures",label:`Écritures${ecritures.length?` (${ecritures.length})`:""}`},{id:"fec",label:`FEC${fecData.length?" ✓":""}`},{id:"plan",label:"Plan"}];

  return (
    <div style={{ fontFamily:font, background:p.bg, color:p.text, minHeight:"100vh", maxWidth:480, margin:"0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:${p.border};border-radius:4px}
        input:focus,select:focus{border-color:${p.accent}!important;outline:none}
        button{transition:opacity 0.15s,transform 0.1s}
        button:hover{opacity:0.85}
        button:active{transform:scale(0.97)}
      `}</style>

      {/* HEADER */}
      <div style={{ padding:"18px 18px 0", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:34, height:34, borderRadius:9, background:`linear-gradient(135deg,${p.accent},#2BA86E)`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, color:p.bg, fontSize:17, boxShadow:`0 0 18px ${p.accentGlow}` }}>C</div>
        <div style={{ fontSize:19, fontWeight:700, letterSpacing:-0.5, color:p.white }}>ComptaScan</div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>

          {/* Tokens */}
          {userProfile && (
            <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 9px", borderRadius:20, background:p.surface, border:`1px solid ${p.border}` }}>
              {userProfile.tokensRemaining === -1 ? (
                <span style={{ fontSize:10, color:p.accent, fontFamily:mono, fontWeight:700 }}>∞</span>
              ) : (
                <>
                  <div style={{ width:30, height:3, borderRadius:2, background:p.border, overflow:"hidden" }}>
                    <div style={{ height:"100%", borderRadius:2, transition:"width 0.4s",
                      background: userProfile.tokensRemaining === 0 ? p.danger : userProfile.tokensRemaining <= Math.ceil((userProfile.tokensTotal||10)*0.2) ? p.warn : p.accent,
                      width:`${Math.min(100,Math.round((userProfile.tokensRemaining/(userProfile.tokensTotal||10))*100))}%`
                    }}/>
                  </div>
                  <span style={{ fontSize:10, fontFamily:mono, fontWeight:600, color:userProfile.tokensRemaining===0?p.danger:p.textMuted }}>
                    {userProfile.tokensRemaining}<span style={{ color:p.textDim }}>/{userProfile.tokensTotal}</span>
                  </span>
                </>
              )}
            </div>
          )}

          {/* Accueil */}
          {onHome && (
            <button onClick={onHome} style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 11px", borderRadius:20, border:`1px solid ${p.border}`, background:p.surface, color:p.textMuted, fontSize:11, fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
              Accueil
            </button>
          )}

          {/* Quitter */}
          <button onClick={() => signOut(auth)} style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 11px", borderRadius:20, border:`1px solid ${p.dangerDim}`, background:p.dangerDim, color:p.danger, fontSize:11, fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            Quitter
          </button>

        </div>
      </div>

      {/* Tokens épuisés */}
      {userProfile && userProfile.tokensRemaining === 0 && userProfile.tokensRemaining !== -1 && (
        <div style={{ margin:"8px 18px 0", padding:"9px 13px", borderRadius:9, background:p.dangerDim, border:`1px solid ${p.danger}44`, fontSize:12, color:p.danger }}>
          <strong>Tokens épuisés</strong> — Quota mensuel atteint. <a href="tarifs.html" style={{ color:p.danger, fontWeight:700 }}>Passer au plan supérieur →</a>
        </div>
      )}

      {/* ENTITY */}
      <div style={{ display:"flex", background:p.surface, borderRadius:12, padding:3, border:`1px solid ${p.border}`, margin:"14px 18px 0" }}>
        {["entreprise","association"].map(t=>(
          <button key={t} style={{ flex:1, padding:"9px 14px", borderRadius:10, border:"none", background:entityType===t?(t==="entreprise"?p.accentDim:p.purpleDim):"transparent", color:entityType===t?(t==="entreprise"?p.accent:p.purple):p.textMuted, fontSize:13, fontWeight:600, fontFamily:font, cursor:"pointer" }} onClick={()=>switchEntity(t)}>
            {t==="entreprise"?"🏢 Entreprise":"🤝 Association"}
          </button>
        ))}
      </div>

      {/* NAV */}
      <div style={{ display:"flex", gap:4, background:p.surface, borderRadius:12, padding:3, margin:"10px 18px 0", border:`1px solid ${p.border}` }}>
        {navItems.map(t=>(
          <button key={t.id} style={{ flex:1, padding:"8px 10px", borderRadius:10, border:"none", background:tab===t.id?p.accentDim:"transparent", color:tab===t.id?p.accent:p.textMuted, fontSize:12, fontWeight:600, fontFamily:font, cursor:"pointer" }} onClick={()=>setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* CONTENT */}
      <div key={`${tab}-${entityType}`} style={{ animation:"fadeIn 0.25s ease" }}>
        {tab==="scan" && <ScanView planComptable={planComptable} entityType={entityType} onEcrituresGenerated={n=>{setEcritures(prev=>[...n,...prev]);setTab("ecritures");showToast(`${n.length} écriture(s) générée(s) ✓`);}} fecData={fecData} noTokens={userProfile && userProfile.tokensRemaining === 0 && userProfile.tokensRemaining !== -1} />}
        {tab==="ecritures" && <EcrituresView ecritures={ecritures} planComptable={planComptable} onAddCompte={handleAddCompte} onDelete={id=>{setEcritures(prev=>prev.filter(e=>e.id!==id));showToast("Supprimée");}} onUpdate={u=>{setEcritures(prev=>prev.map(e=>e.id===u.id?u:e));showToast("Modifiée ✓");}} />}
        {tab==="fec" && <FecView fecData={fecData} setFecData={setFecData} />}
        {tab==="plan" && <PlanComptableView planComptable={planComptable} setPlanComptable={setPlanComptable} entityType={entityType} />}
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:entityType==="association"?p.purple:p.accent, color:p.bg, padding:"9px 18px", borderRadius:10, fontWeight:600, fontSize:13, boxShadow:`0 4px 18px ${p.accentGlow}`, animation:"slideUp 0.3s ease", zIndex:9999, whiteSpace:"nowrap" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
