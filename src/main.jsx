import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { auth, onAuthStateChanged } from "./firebase.js";
import LandingPage from "./LandingPage.jsx";
import AuthScreen from "./AuthScreen.jsx";
import AccountPage from "./AccountPage.jsx";
import ComptaScan from "./ComptaScan.jsx";
import { registerSW } from "virtual:pwa-register";

registerSW({ onNeedRefresh() { if (confirm("Nouvelle version disponible. Mettre à jour ?")) location.reload(); } });

// Routes : "landing" | "auth" | "app" | "account"
function App() {
  const [user, setUser] = useState(undefined);
  const [route, setRoute] = useState("landing");

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      // Si l'URL hash demande une route spécifique au chargement
      const hash = window.location.hash.replace("#", "");
      if (hash === "app" && u) setRoute("app");
      else if (hash === "account" && u) setRoute("account");
    });
  }, []);

  // Sync URL hash avec la route
  useEffect(() => {
    window.location.hash = route === "landing" ? "" : route;
  }, [route]);

  const goApp     = () => user ? setRoute("app")     : setRoute("auth");
  const goAccount = () => user ? setRoute("account") : setRoute("auth");
  const goHome    = () => setRoute("landing");
  const goAuth    = () => setRoute("auth");

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

  return (
    <LandingPage
      user={user}
      onGoApp={goApp}
      onGoAccount={goAccount}
      onLogin={goAuth}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
