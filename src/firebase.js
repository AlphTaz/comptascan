import { initializeApp } from "firebase/app";
import {
  getAuth, signOut, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup,
} from "firebase/auth";

// ⚠️ Remplacez ces valeurs par celles de votre console Firebase :
// Console Firebase → Paramètres du projet (⚙️) → Vos applications → Config
const firebaseConfig = {
  apiKey: "AIzaSyBw0C9oLrIFG73VTqLuoFw3xGkBaknScl8",
  authDomain: "finaia-94f65.firebaseapp.com",
  projectId: "finaia-94f65",
  storageBucket: "finaia-94f65.appspot.com",
  messagingSenderId: "679838711631",
  appId: "1:679838711631:web:34c6fa194a4844cf4a4f3a",
  measurementId: "G-SWYD4FSZNN",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup };
export const PROXY_URL = "https://proxyai-2czfc6w5yq-uc.a.run.app";
