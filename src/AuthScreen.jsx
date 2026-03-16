import { useState } from "react";
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "./firebase.js";

const font = `'DM Sans', 'Avenir', sans-serif`;
const palette = {
  bg: "#0C0F14", surface: "#151921", border: "#252D3A", borderLight: "#2E3848",
  accent: "#3ECF8E", accentDim: "rgba(62,207,142,0.12)", accentGlow: "rgba(62,207,142,0.25)",
  danger: "#F87171", dangerDim: "rgba(248,113,113,0.12)",
  text: "#E8ECF1", textMuted: "#8896A8", textDim: "#5C6B7F", white: "#FFFFFF",
};

export default function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEmail = async () => {
    if (!email || !password) return;
    setLoading(true); setError(null);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (e) {
      const msgs = {
        "auth/invalid-credential": "Email ou mot de passe incorrect.",
        "auth/email-already-in-use": "Cet email est déjà utilisé.",
        "auth/weak-password": "Mot de passe trop faible (6 caractères minimum).",
        "auth/invalid-email": "Adresse email invalide.",
        "auth/too-many-requests": "Trop de tentatives. Réessayez plus tard.",
      };
      setError(msgs[e.code] || "Erreur : " + e.message);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true); setError(null);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      setError("Erreur Google : " + e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: font, background: palette.bg, color: palette.text, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${palette.accent}, #2BA86E)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: palette.bg, boxShadow: `0 0 24px ${palette.accentGlow}` }}>C</div>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5, color: palette.white }}>ComptaScan</div>
      </div>

      <div style={{ width: "100%", maxWidth: 400, background: palette.surface, borderRadius: 16, border: `1px solid ${palette.border}`, padding: 28 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: palette.white, marginBottom: 6 }}>
          {mode === "login" ? "Connexion" : "Créer un compte"}
        </div>
        <div style={{ fontSize: 13, color: palette.textMuted, marginBottom: 24 }}>
          {mode === "login" ? "Connectez-vous pour accéder à ComptaScan" : "Créez votre compte ComptaScan"}
        </div>

        <button onClick={handleGoogle} disabled={loading} style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: `1px solid ${palette.borderLight}`, background: "transparent", color: palette.text, fontSize: 14, fontWeight: 600, fontFamily: font, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continuer avec Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: palette.border }} />
          <span style={{ fontSize: 12, color: palette.textDim }}>ou</span>
          <div style={{ flex: 1, height: 1, background: palette.border }} />
        </div>

        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleEmail()}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.bg, color: palette.text, fontSize: 14, fontFamily: font, outline: "none", marginBottom: 10 }} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleEmail()}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.bg, color: palette.text, fontSize: 14, fontFamily: font, outline: "none", marginBottom: 16 }} />

        {error && (
          <div style={{ background: palette.dangerDim, border: `1px solid ${palette.danger}44`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: palette.danger, marginBottom: 14 }}>
            {error}
          </div>
        )}

        <button onClick={handleEmail} disabled={loading || !email || !password}
          style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${palette.accent}, #2BA86E)`, color: palette.bg, fontSize: 14, fontWeight: 700, fontFamily: font, cursor: loading ? "default" : "pointer", opacity: (!email || !password) ? 0.5 : 1 }}>
          {loading ? "Chargement..." : mode === "login" ? "Se connecter" : "Créer le compte"}
        </button>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: palette.textMuted }}>
          {mode === "login" ? "Pas encore de compte ? " : "Déjà un compte ? "}
          <span onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }} style={{ color: palette.accent, cursor: "pointer", fontWeight: 600 }}>
            {mode === "login" ? "S'inscrire" : "Se connecter"}
          </span>
        </div>
      </div>
    </div>
  );
}
