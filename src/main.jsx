import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";
import ComptaScan from "./ComptaScan.jsx";
import AuthScreen from "./AuthScreen.jsx";
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("Nouvelle version disponible. Mettre à jour ?")) updateSW(true);
  },
});

function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  if (user === undefined) {
    return (
      <div style={{ background: "#0C0F14", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #3ECF8E, #2BA86E)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#0C0F14" }}>C</div>
      </div>
    );
  }

  if (!user) return <AuthScreen />;
  return <ComptaScan user={user} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
