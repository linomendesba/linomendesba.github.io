import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDmLGMBnUa2YOdP0b-zlZepXjm-zlV477A",
  authDomain: "linoautenticador.firebaseapp.com",
  projectId: "linoautenticador",
  storageBucket: "linoautenticador.firebasestorage.app",
  messagingSenderId: "946057648829",
  appId: "1:946057648829:web:ac5c2b1ba66e651f9d75d4",
  measurementId: "G-4WT805FFHQ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// URL do servidor admin (fire.js) — usado pra checar se a assinatura
// está em dia. Fica aqui pra proteger TODAS as páginas que importam
// esse arquivo, sem precisar mexer em cada uma delas.
const ADMIN_API_URL = 'https://betstat.site/admin';

// A cada quanto tempo reverificar a assinatura enquanto a aba fica aberta
const SUBSCRIPTION_CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutos

let isRedirecting = false;

// ─── FIREBASE DEVICE CONTROL ─────────────────────────────
function getDeviceId() {
  let id = localStorage.getItem("deviceId");
  if (!id) {
    id = "device_" + Date.now() + "_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("deviceId", id);
  }
  return id;
}

async function registerCurrentDevice(user) {
  if (!user) return false;
  const userRef = doc(db, "users", user.uid);
  const deviceId = getDeviceId();
  try {
    await setDoc(userRef, {
      deviceId,
      lastLogin: new Date().toISOString(),
      lastLoginTime: Date.now()
    }, { merge: true });
    return true;
  } catch (e) {
    console.error("Erro ao registrar dispositivo:", e);
    return false;
  }
}

function setupDeviceMonitor(user) {
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const deviceId = getDeviceId();
  return onSnapshot(userRef, (snap) => {
    if (isRedirecting) return;
    if (snap.exists()) {
      const data = snap.data();
      if (data.deviceId && data.deviceId !== deviceId) {
        console.log("Sessão em outro dispositivo. Logout.");
        isRedirecting = true;
        localStorage.removeItem("deviceId");
        signOut(auth).then(() => {
          setTimeout(() => { window.location.href = "auth.html"; }, 100);
        });
      }
    }
  });
}

// ─── CHECAGEM DE ASSINATURA (VENCIMENTO) ─────────────────
// Não existe mais renovação: quando a assinatura vence, o servidor exclui
// o cliente (Firebase + Supabase) e /meu-status passa a responder 404.
// Aqui a gente só detecta isso e desloga, mandando pra tela de login —
// de lá o cliente clica em "Assine aqui" e faz um cadastro novo.

// Páginas onde essa checagem não deve rodar, pra não criar loop de
// redirecionamento (o próprio fluxo de login/cadastro já cuida disso).
function paginaIsenta() {
  const p = window.location.pathname;
  return p.includes("auth.html") || p.includes("cadastro.html");
}

async function checkSubscription(user) {
  if (!user || isRedirecting || paginaIsenta()) return;
  try {
    const idToken = await user.getIdToken();
    // Token vai como querystring (não como header Authorization) pra evitar
    // que o navegador precise de um preflight CORS liberando esse header.
    const resp = await fetch(`${ADMIN_API_URL}/meu-status?token=${encodeURIComponent(idToken)}`);

    if (resp.status === 404) {
      console.log("Assinatura vencida. Conta removida — deslogando.");
      isRedirecting = true;
      localStorage.removeItem("deviceId");
      await signOut(auth);
      window.location.href = "auth.html";
      return;
    }

    // Qualquer outro erro (rede, servidor fora do ar, etc.) não bloqueia
    // o cliente por precaução — só tenta de novo no próximo ciclo.
  } catch (e) {
    console.error("Erro ao checar assinatura:", e);
  }
}

let unsubscribeDeviceMonitor = null;
let subscriptionCheckInterval = null;

function pararChecagemDeAssinatura() {
  if (subscriptionCheckInterval) {
    clearInterval(subscriptionCheckInterval);
    subscriptionCheckInterval = null;
  }
}

onAuthStateChanged(auth, async (user) => {
  console.log("Auth:", user ? "Logado" : "Deslogado");

  if (unsubscribeDeviceMonitor) {
    unsubscribeDeviceMonitor();
    unsubscribeDeviceMonitor = null;
  }
  pararChecagemDeAssinatura();

  if (!user) {
    if (!isRedirecting && !window.location.href.includes("auth.html")) {
      window.location.href = "auth.html";
    }
    return;
  }

  await registerCurrentDevice(user);
  unsubscribeDeviceMonitor = setupDeviceMonitor(user);

  // Checa a assinatura assim que autentica...
  await checkSubscription(user);
  // ...e continua checando periodicamente enquanto a aba ficar aberta,
  // pra pegar o caso de a assinatura vencer com o usuário já logado.
  if (!isRedirecting) {
    subscriptionCheckInterval = setInterval(() => checkSubscription(user), SUBSCRIPTION_CHECK_INTERVAL_MS);
  }

  if (window.location.href.includes("auth.html")) {
    window.location.href = "/home.html";
  }
});

window.login = async function (email, password) {
  try {
    isRedirecting = false;
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  } catch (e) {
    console.error("Erro no login:", e);
    alert("Erro ao fazer login: " + e.message);
    throw e;
  }
};

window.logout = function () {
  isRedirecting = true;
  pararChecagemDeAssinatura();
  localStorage.removeItem("deviceId");
  signOut(auth)
    .then(() => setTimeout(() => { window.location.href = "auth.html"; }, 100))
    .catch(() => setTimeout(() => { window.location.href = "auth.html"; }, 100));
};