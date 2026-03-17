import { useState, useEffect } from "react";
import { auth, signOut } from "./firebase.js";
import { palette, font, fontDisplay, mono, GLOBAL_CSS } from "./design.js";
import { getFirestore, doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const NAV_H = 64;

function Navbar({ onHome, onGoApp }) {
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, height: NAV_H, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: "rgba(8,11,16,0.9)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${palette.border}` }}>
      <button onClick={onHome} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer" }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${palette.accent}, ${palette.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: palette.bg }}>C</div>
        <span style={{ fontSize: 16, fontWeight: 700, color: palette.white, letterSpacing: -0.3 }}>ComptaScan</span>
      </button>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onHome} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${palette.border}`, background: "transparent", color: palette.textMuted, fontSize: 13 }}>← Accueil</button>
        <button onClick={onGoApp} style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${palette.accent}, ${palette.accentDark})`, color: palette.bg, fontSize: 13, fontWeight: 700 }}>Ouvrir l'outil →</button>
      </div>
    </nav>
  );
}

// ─── TOKEN RING ───
function TokenRing({ remaining, total }) {
  const isUnlimited = total === -1;
  const pct = isUnlimited ? 100 : Math.max(0, Math.min(100, (remaining / total) * 100));
  const r = 54, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct > 50 ? palette.accent : pct > 20 ? palette.warn : palette.danger;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ position: "relative", width: 140, height: 140 }}>
        <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="70" cy="70" r={r} fill="none" stroke={palette.border} strokeWidth="8" />
          <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1s ease, stroke 0.5s" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div style={{ fontFamily: mono, fontSize: 28, fontWeight: 700, color: palette.white, lineHeight: 1 }}>
            {isUnlimited ? "∞" : remaining}
          </div>
          <div style={{ fontSize: 11, color: palette.textDim, marginTop: 4 }}>tokens</div>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, color: palette.textMuted }}>
          {isUnlimited ? "Tokens illimités" : `${remaining} restants sur ${total}`}
        </div>
        {!isUnlimited && (
          <div style={{ fontSize: 12, color: color, marginTop: 4, fontWeight: 600 }}>
            {pct > 50 ? "Bon niveau" : pct > 20 ? "Attention, bientôt épuisé" : "Niveau critique"}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PLAN BADGE ───
const PLANS = {
  free:    { label: "Gratuit",       color: palette.textMuted, tokens: 10 },
  starter: { label: "Starter",       color: palette.blue,      tokens: 100 },
  pro:     { label: "Pro",           color: palette.accent,    tokens: 500 },
  agency:  { label: "Agence",        color: palette.purple,    tokens: -1 },
};

export default function AccountPage({ user, onHome, onGoApp }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("compte"); // compte | abonnement
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState("");
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState(null);

  useEffect(() => {
    if (!user) return;
    const db = getFirestore();
    getDoc(doc(db, "users", user.uid)).then(snap => {
      if (snap.exists()) setUserData(snap.data());
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const plan = userData?.plan ? PLANS[userData.plan] || PLANS.free : PLANS.free;
  const remaining = userData?.tokensRemaining ?? 0;
  const total = userData?.tokensTotal ?? PLANS.free.tokens;

  const card = (children, style = {}) => (
    <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 16, padding: "24px 28px", ...style }}>
      {children}
    </div>
  );

  const label = (txt) => (
    <div style={{ fontSize: 11, fontWeight: 600, color: palette.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{txt}</div>
  );

  if (loading) return (
    <div style={{ background: palette.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: `3px solid ${palette.border}`, borderTop: `3px solid ${palette.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  return (
    <div style={{ fontFamily: font, background: palette.bg, color: palette.text, minHeight: "100vh" }}>
      <style>{GLOBAL_CSS}</style>
      <Navbar onHome={onHome} onGoApp={onGoApp} />

      <main style={{ maxWidth: 800, margin: "0 auto", padding: `${NAV_H + 48}px 24px 80px` }}>
        {/* En-tête */}
        <div className="fade-up" style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: palette.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>MON COMPTE</div>
          <h1 style={{ fontFamily: fontDisplay, fontSize: 36, fontWeight: 400, color: palette.white, marginBottom: 8 }}>
            Bonjour, {user?.displayName?.split(" ")[0] || "vous"}.
          </h1>
          <div style={{ fontSize: 14, color: palette.textMuted }}>{user?.email}</div>
        </div>

        {/* Onglets */}
        <div style={{ display: "flex", gap: 4, background: palette.surface, borderRadius: 12, padding: 4, border: `1px solid ${palette.border}`, marginBottom: 32, width: "fit-content" }}>
          {[["compte", "Mon compte"], ["abonnement", "Abonnement"]].map(([id, lbl]) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding: "8px 18px", borderRadius: 9, border: "none", background: tab === id ? palette.accentDim : "transparent", color: tab === id ? palette.accent : palette.textMuted, fontSize: 13, fontWeight: 600, transition: "all 0.2s" }}>
              {lbl}
            </button>
          ))}
        </div>

        {tab === "compte" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Tokens */}
            {card(
              <div style={{ display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap" }}>
                <TokenRing remaining={remaining} total={total} />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: palette.white, marginBottom: 6 }}>Tokens d'analyse</div>
                  <div style={{ fontSize: 14, color: palette.textMuted, lineHeight: 1.7, marginBottom: 16 }}>
                    Chaque analyse de facture consomme 1 token. Les tokens se renouvellent chaque mois selon votre plan.
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ padding: "4px 12px", borderRadius: 20, background: `${plan.color}18`, color: plan.color, fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>
                      Plan {plan.label}
                    </span>
                    <button onClick={() => setTab("abonnement")} style={{ fontSize: 12, color: palette.accent, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                      Changer de plan →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Historique d'utilisation */}
            {card(<>
              <div style={{ fontSize: 15, fontWeight: 600, color: palette.white, marginBottom: 4 }}>Utilisation par outil</div>
              <div style={{ fontSize: 13, color: palette.textMuted, marginBottom: 20 }}>Nombre d'analyses effectuées</div>
              {userData?.usage ? Object.entries(userData.usage).map(([tool, count]) => (
                <div key={tool} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${palette.border}` }}>
                  <span style={{ fontSize: 14, color: palette.text, textTransform: "capitalize" }}>{tool}</span>
                  <span style={{ fontFamily: mono, fontSize: 14, color: palette.accent }}>{count} analyse{count > 1 ? "s" : ""}</span>
                </div>
              )) : (
                <div style={{ fontSize: 14, color: palette.textDim, padding: "16px 0" }}>Aucune utilisation enregistrée.</div>
              )}
            </>)}

            {/* Profil */}
            {card(<>
              <div style={{ fontSize: 15, fontWeight: 600, color: palette.white, marginBottom: 20 }}>Informations du profil</div>
              {label("Adresse email")}
              <div style={{ fontSize: 14, color: palette.text, marginBottom: 20, padding: "10px 14px", background: palette.bgAlt, borderRadius: 8, border: `1px solid ${palette.border}` }}>
                {user?.email}
              </div>
              {label("Nom affiché")}
              {editName ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={newName} onChange={e => setNewName(e.target.value)} placeholder={user?.displayName || "Votre nom"} style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.bgAlt, color: palette.text, fontSize: 14 }} />
                  <button onClick={() => setEditName(false)} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: palette.accentDim, color: palette.accent, fontSize: 13, fontWeight: 600 }}>OK</button>
                  <button onClick={() => setEditName(false)} style={{ padding: "10px 16px", borderRadius: 8, border: `1px solid ${palette.border}`, background: "transparent", color: palette.textMuted, fontSize: 13 }}>✕</button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 14, color: palette.text, flex: 1, padding: "10px 14px", background: palette.bgAlt, borderRadius: 8, border: `1px solid ${palette.border}` }}>
                    {user?.displayName || "—"}
                  </div>
                  <button onClick={() => { setEditName(true); setNewName(user?.displayName || ""); }} style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${palette.border}`, background: "transparent", color: palette.textMuted, fontSize: 13 }}>Modifier</button>
                </div>
              )}
            </>)}

            {/* Déconnexion */}
            <button onClick={() => signOut(auth)} style={{ width: "100%", padding: "14px", borderRadius: 12, border: `1px solid ${palette.danger}44`, background: palette.dangerDim, color: palette.danger, fontSize: 14, fontWeight: 600 }}>
              Se déconnecter
            </button>
          </div>
        )}

        {tab === "abonnement" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 14, color: palette.textMuted, marginBottom: 8 }}>
              Plan actuel : <strong style={{ color: plan.color }}>{plan.label}</strong>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
              {Object.entries(PLANS).map(([id, p]) => {
                const isCurrent = (userData?.plan || "free") === id;
                return (
                  <div key={id} style={{ padding: "24px 20px", borderRadius: 14, border: `${isCurrent ? "2px" : "1px"} solid ${isCurrent ? p.color : palette.border}`, background: isCurrent ? `${p.color}08` : palette.surface, position: "relative" }}>
                    {isCurrent && (
                      <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: p.color, color: palette.bg, fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 10, whiteSpace: "nowrap" }}>
                        PLAN ACTUEL
                      </div>
                    )}
                    <div style={{ fontSize: 16, fontWeight: 700, color: palette.white, marginBottom: 6 }}>{p.label}</div>
                    <div style={{ fontFamily: mono, fontSize: 24, color: p.color, fontWeight: 500, marginBottom: 12 }}>
                      {p.tokens === -1 ? "∞" : p.tokens}
                      <span style={{ fontSize: 13, color: palette.textDim, fontFamily: font, fontWeight: 400 }}> tokens/mois</span>
                    </div>
                    {!isCurrent && (
                      <button style={{ width: "100%", padding: "9px", borderRadius: 8, border: `1px solid ${p.color}`, background: "transparent", color: p.color, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                        Choisir →
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 13, color: palette.textDim, padding: "16px 20px", borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.surface }}>
              Pour changer de plan ou gérer votre facturation, contactez-nous à <span style={{ color: palette.accent }}>support@comptascan.fr</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
