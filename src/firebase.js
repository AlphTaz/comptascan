import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";

// ⚠️ Remplacez ces valeurs par celles de votre console Firebase :
// Console Firebase → Paramètres du projet (⚙️) → Vos applications → Config
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "finaia-94f65.firebaseapp.com",
  projectId: "finaia-94f65",
  storageBucket: "finaia-94f65.appspot.com",
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
  appId: "VOTRE_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { signOut };
export const PROXY_URL = "https://proxyai-2czfc6w5yq-uc.a.run.app";
