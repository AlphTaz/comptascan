import { useState } from "react";
import { palette, font, fontDisplay, mono, GLOBAL_CSS } from "./design.js";
import { auth } from "./firebase.js";

const NAV_H = 64;

const CHECKOUT_URL = "https://createcheckoutsession-2czfc6w5yq-uc.a.run.app";

const PLANS = [
  {
    id: "free",
    name: "Essai",
    desc: "Explorez la puissance des outils Finaïa gratuitement. Testez tous les outils sans engagement.",
    price: null,
    tokens: "10",
    tokensLabel: "tokens offerts\nà l'inscription",
    tokensFree: true,
    features: [
      "Tous les outils Finaïa Association (CRC 99-01)",
      "Tous les outils Finaïa Entreprise (PCG)",
      "Tous les territoires (Métropole + DOM)",
      "Export CSV",
      "ComptaScan — scan de factures IA",
          ],
    ctaLabel: "Créer mon compte →",
    ctaStyle: "green",
    pop: false,
  },
  {
    id: "starter",
    name: "Starter",
    desc: "Pour les petites structures — trésorier bénévole, micro-association, auto-entrepreneur.",
    price: "29€",
    tokens: "50",
    tokensLabel: "tokens\npar mois",
    features: [
      "Tous les outils Finaïa de l'Essai",
      "50 analyses IA / mois",
      "Historique des analyses",
      "Support email",
      "ComptaScan — scan de factures IA",
          ],
    ctaLabel: "Choisir Starter →",
    ctaStyle: "ghost",
    pop: false,
  },
  {
    id: "pro",
    name: "Pro",
    desc: "Pour les structures actives — associations employeuses, TPE, cabinets de gestion.",
    price: "59€",
    tokens: "200",
    tokensLabel: "tokens\npar mois",
    features: [
      "Tous les outils Finaïa du Starter",
      "200 analyses IA / mois",
      "Analyse coûts cachés",
      "Rapport de gestion IA",
      "Support prioritaire",
      "ComptaScan — scan de factures IA",
          ],
    ctaLabel: "Choisir Pro →",
    ctaStyle: "primary",
    pop: true,
    popTag: "Populaire",
  },
  {
    id: "expert",
    name: "Expert",
    desc: "Pour les professionnels — experts-comptables, cabinets, DAF multi-structures.",
    price: "99€",
    tokens: "∞",
    tokensLabel: "tokens\nillimités",
    tokensInf: true,
    features: [
      "Tous les outils Finaïa du Pro",
      "Analyses illimitées",
      "Multi-structures",
      "Accès anticipé nouvelles fonctionnalités",
      "Support dédié",
      "ComptaScan — scan illimité de factures",
          ],
    ctaLabel: "Choisir Expert →",
    ctaStyle: "ghost",
    pop: false,
  },
];

const FAQS = [
  {
    q: "Qu'est-ce qu'un token ?",
    a: "Un token correspond à une analyse IA : import d'une facture, contrôle d'un bulletin de paie, génération d'un rapport, analyse d'un FEC… Chaque appel à l'intelligence artificielle consomme 1 token.",
  },
  {
    q: "Les tokens non utilisés sont-ils reportés ?",
    a: "Non, les tokens sont réinitialisés chaque mois à la date de renouvellement de votre abonnement. Le plan Expert bénéficie de tokens illimités.",
  },
  {
    q: "Puis-je changer de plan en cours de mois ?",
    a: "Oui, vous pouvez upgrader à tout moment. Le changement prend effet immédiatement et le prorata est calculé automatiquement. Vous pouvez aussi downgrader, le changement s'appliquera au prochain renouvellement.",
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Vos fichiers (FEC, factures, bulletins) sont traités localement dans votre navigateur. Seuls les agrégats nécessaires à l'analyse IA transitent par nos serveurs sécurisés. Aucun fichier brut n'est stocké.",
  },
  {
    q: "Comment fonctionne l'essai gratuit ?",
    a: "Créez votre compte gratuitement — aucune carte bancaire n'est demandée. Vous recevez 10 tokens pour tester tous les outils. Une fois les tokens épuisés, choisissez un plan payant pour continuer.",
  },
  {
    q: "Puis-je annuler à tout moment ?",
    a: "Oui, tous les plans sont sans engagement. Annulez depuis votre espace client — votre accès reste actif jusqu'à la fin de la période payée.",
  },
];

async function handlePlan(plan, user) {
  if (plan === "free") {
    window.location.href = "https://finaia.web.app/dashboard.html";
    return;
  }
  if (!user) {
    window.location.href = "https://finaia.web.app/dashboard.html?plan=" + plan;
    return;
  }
  try {
    const token = await user.getIdToken();
    const resp = await fetch(CHECKOUT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ plan }),
    });
    const data = await resp.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Erreur : " + (data.error || "Impossible de créer la session"));
    }
  } catch (e) {
    alert("Erreur : " + e.message);
  }
}

function PlanCard({ plan, user }) {
  const [loading, setLoading] = useState(false);

  const ctaColors = {
    green: {
      background: "rgba(34,197,94,0.12)",
      border: "1px solid rgba(34,197,94,0.3)",
      color: "#86efac",
    },
    ghost: {
      background: "transparent",
      border: `1px solid ${palette.border}`,
      color: palette.textMuted,
    },
    primary: {
      background: `linear-gradient(135deg, ${palette.accentDark}, ${palette.accent})`,
      border: "none",
      color: palette.bg,
    },
  };

  const handleClick = async () => {
    if (plan.id === "free" && user) return; // already registered
    setLoading(true);
    await handlePlan(plan.id, user);
    setLoading(false);
  };

  const isAlreadyFree = plan.id === "free" && !!user;

  return (
    <div
      style={{
        background: palette.surface,
        border: `1px solid ${plan.pop ? "rgba(62,207,142,0.35)" : palette.border}`,
        borderRadius: 20,
        padding: "36px 30px 32px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        boxShadow: plan.pop ? `0 0 0 1px rgba(62,207,142,0.1), 0 24px 60px rgba(0,0,0,0.4)` : "none",
        transition: "transform 0.3s, border-color 0.3s, box-shadow 0.3s",
      }}
      onMouseOver={e => { e.currentTarget.style.transform = "translateY(-4px)"; }}
      onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {plan.pop && (
        <>
          <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: `radial-gradient(ellipse 80% 50% at 50% 0%, rgba(62,207,142,0.07), transparent)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 16, right: 16, padding: "3px 10px", borderRadius: 6, fontFamily: mono, fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase", background: `linear-gradient(135deg, ${palette.accentDark}, ${palette.accent})`, color: "#fff", fontWeight: 500 }}>
            {plan.popTag}
          </div>
        </>
      )}

      {/* Name & desc */}
      <div style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 900, letterSpacing: -0.3, marginBottom: 4, color: palette.white }}>{plan.name}</div>
      <div style={{ fontSize: 13, color: palette.textDim, lineHeight: 1.5, marginBottom: 20, minHeight: 52 }}>{plan.desc}</div>

      {/* Price */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4, minHeight: 48 }}>
        {plan.price ? (
          <>
            <span style={{ fontFamily: fontDisplay, fontSize: 42, fontWeight: 900, letterSpacing: -2, lineHeight: 1, color: palette.white }}>{plan.price}</span>
            <span style={{ fontSize: 13, color: palette.textDim }}> / mois</span>
          </>
        ) : (
          <span style={{ fontFamily: fontDisplay, fontSize: 36, fontWeight: 900, letterSpacing: -2, lineHeight: 1, color: "#86efac" }}>Gratuit</span>
        )}
      </div>

      {/* Divider */}
      <div style={{ marginBottom: 24, height: 1, background: `linear-gradient(90deg, transparent, ${palette.border}, ${plan.pop ? "rgba(62,207,142,0.3)" : "rgba(62,207,142,0.15)"}, ${palette.border}, transparent)` }} />

      {/* Tokens */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 10, background: palette.surfaceHigh, border: `1px solid ${palette.border}`, marginBottom: 24 }}>
        <span style={{ fontFamily: fontDisplay, fontSize: plan.tokensInf ? 20 : 24, fontWeight: 900, color: plan.tokensFree || plan.tokensInf ? "#86efac" : "#6EE7B7" }}>{plan.tokens}</span>
        <span style={{ fontSize: 12, color: palette.textDim, lineHeight: 1.4, whiteSpace: "pre-line" }}>{plan.tokensLabel}</span>
      </div>

      {/* Features */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28, flex: 1 }}>
        {plan.features.map((feat, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12.5, color: palette.textMuted, lineHeight: 1.45 }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, background: plan.pop ? "rgba(62,207,142,0.15)" : "rgba(62,207,142,0.08)", color: palette.accent }}>✓</div>
            {feat}
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={handleClick}
        disabled={isAlreadyFree || loading}
        style={{
          display: "block",
          width: "100%",
          textAlign: "center",
          padding: "12px 24px",
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 500,
          cursor: isAlreadyFree ? "default" : "pointer",
          opacity: isAlreadyFree ? 0.4 : 1,
          fontFamily: font,
          transition: "all 0.22s",
          ...ctaColors[plan.ctaStyle],
        }}
      >
        {loading ? "Redirection…" : isAlreadyFree ? "Déjà inscrit ✓" : plan.ctaLabel}
      </button>
    </div>
  );
}

function FaqSection() {
  const [open, setOpen] = useState(null);
  return (
    <section style={{ padding: "0 24px 80px", maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ fontFamily: fontDisplay, fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 900, letterSpacing: -1, textAlign: "center", marginBottom: 40, color: palette.white }}>
        Questions <em style={{ fontStyle: "italic", fontWeight: 300, color: "#6EE7B7" }}>fréquentes</em>
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {FAQS.map((f, i) => (
          <div
            key={i}
            style={{ border: `1px solid ${open === i ? palette.borderLight : palette.border}`, borderRadius: 14, overflow: "hidden", background: palette.surface, transition: "border-color 0.2s" }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{ width: "100%", padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "transparent", border: "none", color: palette.text, fontSize: 14, fontWeight: 500, textAlign: "left", gap: 16, cursor: "pointer", fontFamily: font }}
            >
              <span>{f.q}</span>
              <span style={{ flexShrink: 0, color: open === i ? palette.accent : palette.textDim, fontSize: 18, transform: open === i ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>›</span>
            </button>
            {open === i && (
              <div style={{ padding: "0 22px 18px", fontSize: 13, color: palette.textDim, lineHeight: 1.7 }}>{f.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function TarifsPage({ onHome, onLogin, user }) {
  return (
    <div style={{ fontFamily: font, background: palette.bg, color: palette.text, minHeight: "100vh" }}>
      <style>{GLOBAL_CSS}</style>

      {/* Fond radial */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(62,207,142,0.05) 0%, transparent 60%)" }} />

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, height: NAV_H, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: "rgba(8,11,16,0.85)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${palette.border}` }}>
        <button onClick={onHome} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${palette.accent}, ${palette.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: palette.bg, boxShadow: `0 0 16px ${palette.accentGlow}` }}>C</div>
          <span style={{ fontSize: 16, fontWeight: 700, color: palette.white, letterSpacing: -0.3 }}>ComptaScan</span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={onHome} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${palette.border}`, background: "transparent", color: palette.textMuted, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
            ← Retour
          </button>
          {!user && (
            <button onClick={onLogin} style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${palette.accent}, ${palette.accentDark})`, color: palette.bg, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Essayer gratuitement
            </button>
          )}
        </div>
      </nav>

      {/* HERO */}
      <div style={{ padding: `${NAV_H + 60}px 24px 40px`, maxWidth: 1380, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 99, background: "rgba(62,207,142,0.06)", border: "1px solid rgba(62,207,142,0.2)", fontFamily: mono, fontSize: 11, color: "#6EE7B7", letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 28 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: palette.accent, boxShadow: `0 0 8px ${palette.accent}` }} />
          Compte partagé Finaïa · Mêmes tokens
        </div>
        <h1 style={{ fontFamily: fontDisplay, fontSize: "clamp(40px, 5.5vw, 72px)", fontWeight: 900, letterSpacing: -2.5, lineHeight: 0.94, marginBottom: 20, color: palette.white }}>
          Compta<em style={{ fontStyle: "italic", fontWeight: 300, color: "#6EE7B7" }}>Scan</em> — Tarifs
        </h1>
        <p style={{ fontSize: 16, color: palette.textMuted, lineHeight: 1.7, maxWidth: 520, margin: "0 auto 12px" }}>
          ComptaScan est inclus dans votre abonnement Finaïa. Scan de factures IA — même compte, mêmes tokens.
        </p>
        <p style={{ fontFamily: mono, fontSize: 13, color: palette.textDim }}>
          1 token = 1 analyse IA · Essai gratuit · Sans engagement · Annulable à tout moment
        </p>
      </div>

      {/* PRICING GRID */}
      <div style={{ position: "relative", zIndex: 1, padding: "20px 24px 80px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, alignItems: "stretch" }}>
          {PLANS.map(plan => (
            <PlanCard key={plan.id} plan={plan} user={user} />
          ))}
        </div>
      </div>

      <FaqSection />

      {/* FOOTER */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${palette.border}`, padding: "24px", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, fontFamily: mono, fontSize: 11, color: palette.textDim }}>
        <span style={{ fontFamily: fontDisplay, fontSize: 14, fontWeight: 700, background: `linear-gradient(90deg, ${palette.accent}, ${palette.accentDark})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginRight: "auto" }}>Finaïa</span>
        <span>Associations & Entreprises · France · Barème 2025</span>
        <span>·</span>
        <button onClick={onHome} style={{ background: "none", border: "none", color: palette.accent, cursor: "pointer", fontFamily: mono, fontSize: 11, padding: 0 }}>Accueil</button>
        <span>·</span>
        <span>Propulsé par <a href="https://www.libradevmq.com/" target="_blank" rel="noreferrer" style={{ color: palette.accent, textDecoration: "none" }}>LibraDev</a></span>
      </footer>
    </div>
  );
}
