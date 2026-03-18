import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import { auth, onAuthStateChanged } from "./firebase.js";
import LandingPage from "./LandingPage.jsx";
import AuthScreen from "./AuthScreen.jsx";
import AccountPage from "./AccountPage.jsx";
import ComptaScan from "./ComptaScan.jsx";
import TarifsPage from "./TarifsPage.jsx";
import { registerSW } from "virtual:pwa-register";

registerSW({ onNeedRefresh() { if (confirm("Nouvelle version disponible. Mettre à jour ?")) location.reload(); } });

function App() {
  const [user, setUser] = useState(undefined);
  const [route, setRoute] = useState("landing");
  const prevUser = useRef(undefined);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      const wasNull = prevUser.current === null;
      const isNowLoggedIn = !!u;
      prevUser.current = u;
      setUser(u);

      // Redirection automatique après connexion
      if (wasNull && isNowLoggedIn) {
        // Venait de l'écran auth → retour landing
        setRoute("landing");
        return;
      }

      // Déconnexion → retour landing
      if (!u) {
        setRoute("landing");
        return;
      }

      // Chargement initial : lire le hash URL
      if (prevUser.current === undefined) return;
      const hash = window.location.hash.replace("#", "");
      if (hash === "app")     setRoute("app");
      else if (hash === "account") setRoute("account");
    });
  }, []);

  // Sync URL hash
  useEffect(() => {
    window.location.hash = route === "landing" ? "" : route;
  }, [route]);

  const goApp     = () => user ? setRoute("app")     : setRoute("auth");
  const goAccount = () => user ? setRoute("account") : setRoute("auth");
  const goHome    = () => setRoute("landing");
  const goAuth    = () => setRoute("auth");
  const goTarifs  = () => setRoute("tarifs");

  // Chargement initial Firebase
  if (user === undefined) {
    return (
      <div style={{ background: "#080B10", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #3ECF8E, #2BA86E)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#080B10", boxShadow: "0 0 20px rgba(62,207,142,0.3)" }}>C</div>
      </div>
    );
  }

  if (route === "auth")    return <AuthScreen onBack={goHome} />;
  if (route === "app")     return <ComptaScan user={user} onHome={goHome} />;
  if (route === "account") return <AccountPage user={user} onHome={goHome} onGoApp={goApp} />;
  if (route === "tarifs")  return <TarifsPage user={user} onHome={goHome} onLogin={goAuth} />;

  return (
    <LandingPage
      user={user}
      onGoApp={goApp}
      onGoAccount={goAccount}
      onLogin={goAuth}
      onGoTarifs={goTarifs}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
