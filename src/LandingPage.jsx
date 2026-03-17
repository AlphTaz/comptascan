import { useState } from "react";
import { palette, font, fontDisplay, mono, GLOBAL_CSS } from "./design.js";

const NAV_H = 64;

// ─── NAVBAR ───
function Navbar({ user, onGoApp, onGoAccount, onLogin }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, height: NAV_H, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px",
      background: "rgba(8,11,16,0.85)",
      backdropFilter: "blur(16px)",
      borderBottom: `1px solid ${palette.border}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${palette.accent}, ${palette.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: palette.bg, boxShadow: `0 0 16px ${palette.accentGlow}` }}>C</div>
        <span style={{ fontSize: 16, fontWeight: 700, color: palette.white, letterSpacing: -0.3 }}>ComptaScan</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {user ? (
          <>
            <button onClick={onGoAccount} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${palette.border}`, background: "transparent", color: palette.textMuted, fontSize: 13, fontWeight: 500 }}>
              Mon compte
            </button>
            <button onClick={onGoApp} style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${palette.accent}, ${palette.accentDark})`, color: palette.bg, fontSize: 13, fontWeight: 700 }}>
              Ouvrir l'outil →
            </button>
          </>
        ) : (
          <>
            <button onClick={onLogin} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${palette.border}`, background: "transparent", color: palette.textMuted, fontSize: 13, fontWeight: 500 }}>
              Connexion
            </button>
            <button onClick={onLogin} style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${palette.accent}, ${palette.accentDark})`, color: palette.bg, fontSize: 13, fontWeight: 700 }}>
              Essayer gratuitement
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

// ─── HERO ───
function Hero({ user, onGoApp, onLogin }) {
  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: `${NAV_H + 60}px 24px 80px`, textAlign: "center", position: "relative", overflow: "hidden" }}>
      {/* Fond radial */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${palette.accentGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />
      {/* Grille de fond */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${palette.border} 1px, transparent 1px), linear-gradient(90deg, ${palette.border} 1px, transparent 1px)`, backgroundSize: "48px 48px", opacity: 0.3, pointerEvents: "none" }} />

      <div style={{ position: "relative", maxWidth: 720 }}>
        <div className="fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 20, border: `1px solid ${palette.accentGlow}`, background: palette.accentDim, marginBottom: 28 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: palette.accent, animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: palette.accent, letterSpacing: 0.5 }}>COMPTABILITÉ ASSISTÉE PAR IA</span>
        </div>

        <h1 className="fade-up-1" style={{ fontFamily: fontDisplay, fontSize: "clamp(42px, 8vw, 72px)", fontWeight: 400, lineHeight: 1.1, color: palette.white, marginBottom: 24, letterSpacing: -1 }}>
          Scannez vos factures,<br />
          <em style={{ color: palette.accent, fontStyle: "italic" }}>générez vos écritures.</em>
        </h1>

        <p className="fade-up-2" style={{ fontSize: 18, color: palette.textMuted, lineHeight: 1.7, maxWidth: 520, margin: "0 auto 40px", fontWeight: 300 }}>
          ComptaScan analyse vos factures par IA et génère automatiquement les écritures comptables conformes au PCG — pour les entreprises et les associations.
        </p>

        <div className="fade-up-3" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={user ? onGoApp : onLogin} style={{ padding: "14px 28px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${palette.accent}, ${palette.accentDark})`, color: palette.bg, fontSize: 15, fontWeight: 700, boxShadow: `0 0 32px ${palette.accentGlow}`, transition: "all 0.2s" }}
            onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
            {user ? "Ouvrir ComptaScan →" : "Commencer gratuitement →"}
          </button>
          <a href="#features" style={{ padding: "14px 24px", borderRadius: 12, border: `1px solid ${palette.border}`, background: "transparent", color: palette.textMuted, fontSize: 15, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}
            onMouseOver={e => { e.currentTarget.style.borderColor = palette.borderLight; e.currentTarget.style.color = palette.text; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = palette.border; e.currentTarget.style.color = palette.textMuted; }}>
            Voir les fonctionnalités ↓
          </a>
        </div>

        {/* Stats */}
        <div className="fade-up-4" style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 64, flexWrap: "wrap" }}>
          {[
            { value: "PCG complet", label: "Plan comptable" },
            { value: "< 10s", label: "Analyse IA" },
            { value: "100%", label: "Hors-ligne PWA" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: mono, fontSize: 22, fontWeight: 500, color: palette.white }}>{s.value}</div>
              <div style={{ fontSize: 12, color: palette.textDim, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FEATURES ───
const FEATURES = [
  {
    icon: "◈",
    title: "Scan IA de factures",
    desc: "Photographiez ou importez vos factures (JPG, PNG, PDF). L'IA extrait automatiquement fournisseur, montants HT/TVA/TTC et génère l'écriture complète.",
    color: palette.accent,
  },
  {
    icon: "⊞",
    title: "Plan comptable complet",
    desc: "Plus de 400 comptes PCG intégrés pour entreprises et associations. Recherche instantanée, ajout de comptes personnalisés, import/export CSV.",
    color: palette.blue,
  },
  {
    icon: "⟳",
    title: "Mémoire FEC",
    desc: "Importez votre Fichier d'Écriture Comptable : ComptaScan reconnaît vos fournisseurs habituels et réutilise automatiquement leurs comptes.",
    color: palette.orange,
  },
  {
    icon: "✓",
    title: "Équilibre garanti",
    desc: "Chaque écriture est vérifiée débit = crédit au centime près. En cas d'écart, une correction automatique est appliquée et signalée.",
    color: palette.purple,
  },
  {
    icon: "⬇",
    title: "Export CSV",
    desc: "Exportez vos écritures au format CSV compatible avec Sage, Cegid, EBP, QuadraCompta et la plupart des logiciels comptables.",
    color: palette.accent,
  },
  {
    icon: "◉",
    title: "Application installable",
    desc: "PWA installable sur Android et iOS directement depuis le navigateur. Fonctionne hors-ligne, caméra native, sans passer par les stores.",
    color: palette.blue,
  },
];

function Features() {
  return (
    <section id="features" style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: palette.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>FONCTIONNALITÉS</div>
        <h2 style={{ fontFamily: fontDisplay, fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 400, color: palette.white, lineHeight: 1.2 }}>
          Tout ce dont vous avez besoin,<br /><em style={{ color: palette.textMuted, fontStyle: "italic" }}>rien de superflu.</em>
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 2 }}>
        {FEATURES.map((f, i) => (
          <div key={i}
            style={{ padding: "32px 28px", background: palette.surface, border: `1px solid ${palette.border}`, transition: "all 0.25s", cursor: "default" }}
            onMouseOver={e => { e.currentTarget.style.background = palette.surfaceHigh; e.currentTarget.style.borderColor = palette.borderLight; }}
            onMouseOut={e => { e.currentTarget.style.background = palette.surface; e.currentTarget.style.borderColor = palette.border; }}>
            <div style={{ fontSize: 28, color: f.color, marginBottom: 16, fontFamily: mono }}>{f.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: palette.white, marginBottom: 10 }}>{f.title}</div>
            <div style={{ fontSize: 14, color: palette.textMuted, lineHeight: 1.7 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── FAQ ───
const FAQS = [
  { q: "ComptaScan est-il conforme au PCG français ?", a: "Oui. Les plans comptables intégrés suivent le Plan Comptable Général (PCG) avec plus de 400 comptes pour les entreprises et plus de 180 pour les associations loi 1901, incluant les classes 1 à 8." },
  { q: "Quels formats de fichiers sont acceptés ?", a: "JPG, PNG, WebP pour les images, et PDF pour les documents multi-pages. Chaque page d'un PDF est analysée individuellement. Le FEC peut être importé au format texte (.txt) avec séparateur | ou tabulation." },
  { q: "Mes données sont-elles sécurisées ?", a: "Les images sont envoyées à l'API d'analyse uniquement le temps du traitement et ne sont pas stockées. Votre compte est sécurisé par Firebase Authentication. Aucune donnée comptable n'est conservée sur nos serveurs." },
  { q: "Puis-je utiliser ComptaScan sans connexion internet ?", a: "L'application PWA fonctionne hors-ligne pour la navigation, la consultation des écritures et du plan comptable. L'analyse IA des factures nécessite une connexion internet active." },
  { q: "Comment fonctionne la reconnaissance de fournisseurs via le FEC ?", a: "En important votre FEC, ComptaScan extrait automatiquement les fournisseurs déjà comptabilisés et leurs comptes associés. Lors de l'analyse d'une nouvelle facture, si le fournisseur est reconnu, son compte est réutilisé automatiquement." },
  { q: "Qu'est-ce qu'un token ?", a: "Chaque analyse de facture consomme un token. Le nombre de tokens disponibles dépend de votre plan. Vous pouvez consulter votre solde et votre historique dans la page Mon Compte." },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" style={{ padding: "100px 24px", maxWidth: 760, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: palette.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>FAQ</div>
        <h2 style={{ fontFamily: fontDisplay, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 400, color: palette.white }}>Questions fréquentes</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {FAQS.map((f, i) => (
          <div key={i} style={{ background: palette.surface, border: `1px solid ${open === i ? palette.borderLight : palette.border}`, overflow: "hidden", transition: "border-color 0.2s" }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "transparent", border: "none", color: palette.text, fontSize: 15, fontWeight: 500, textAlign: "left", gap: 16 }}>
              <span>{f.q}</span>
              <span style={{ flexShrink: 0, color: palette.accent, fontSize: 20, transform: open === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
            </button>
            {open === i && (
              <div style={{ padding: "0 24px 20px", fontSize: 14, color: palette.textMuted, lineHeight: 1.8 }}>{f.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CTA FINAL ───
function CTAFinal({ user, onGoApp, onLogin }) {
  return (
    <section style={{ padding: "100px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 500, height: 300, background: `radial-gradient(ellipse, ${palette.accentGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
        <h2 style={{ fontFamily: fontDisplay, fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 400, color: palette.white, marginBottom: 20, lineHeight: 1.2 }}>
          Prêt à automatiser<br /><em style={{ color: palette.accent, fontStyle: "italic" }}>votre comptabilité ?</em>
        </h2>
        <p style={{ fontSize: 16, color: palette.textMuted, marginBottom: 36 }}>Commencez gratuitement, sans carte bancaire.</p>
        <button onClick={user ? onGoApp : onLogin} style={{ padding: "16px 36px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${palette.accent}, ${palette.accentDark})`, color: palette.bg, fontSize: 16, fontWeight: 700, boxShadow: `0 0 40px ${palette.accentGlow}`, transition: "all 0.2s" }}
          onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
          {user ? "Ouvrir ComptaScan →" : "Créer mon compte →"}
        </button>
      </div>
    </section>
  );
}

// ─── FOOTER ───
function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${palette.border}`, padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: `linear-gradient(135deg, ${palette.accent}, ${palette.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: palette.bg }}>C</div>
        <span style={{ fontSize: 13, color: palette.textDim }}>ComptaScan © {new Date().getFullYear()}</span>
      </div>
      <div style={{ fontSize: 12, color: palette.textDim }}>Conforme PCG · Entreprises & Associations</div>
    </footer>
  );
}

// ─── LANDING PAGE ───
export default function LandingPage({ user, onGoApp, onGoAccount, onLogin }) {
  return (
    <div style={{ fontFamily: font, background: palette.bg, color: palette.text, minHeight: "100vh" }}>
      <style>{GLOBAL_CSS}</style>
      <Navbar user={user} onGoApp={onGoApp} onGoAccount={onGoAccount} onLogin={onLogin} />
      <Hero user={user} onGoApp={onGoApp} onLogin={onLogin} />
      <Features />
      <FAQ />
      <CTAFinal user={user} onGoApp={onGoApp} onLogin={onLogin} />
      <Footer />
    </div>
  );
}
