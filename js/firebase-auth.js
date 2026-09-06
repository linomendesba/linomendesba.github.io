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

let isRedirecting = false;

// ─── CHECAGEM DE ASSINATURA (bloqueia acesso se vencida) ─────────
const ADMIN_API_URL = "https://betstat.site/admin";
let assinaturaCheckInterval = null;

// ─── BADGE DE DIAS RESTANTES (simples, autocontido) ──────────────
// Não depende do header nem de nenhum outro arquivo: cria seu próprio
// CSS e elemento na primeira vez que roda, e só atualiza texto/cor
// nas vezes seguintes.
function garantirBadgeAssinatura() {
  let el = document.getElementById("badge-assinatura");
  if (el) return el;

  const style = document.createElement("style");
  style.textContent = `
    #badge-assinatura {
      position: fixed;
      top: 12px;
      right: 12px;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 6px 12px;
      border-radius: 8px;
      font: 600 12px/1 -apple-system, "Segoe UI", sans-serif;
      white-space: nowrap;
      border: 1px solid rgba(148,163,184,0.25);
      background: #15181f;
      color: #94a3b8;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    #badge-assinatura .dot { width:7px; height:7px; border-radius:50%; background: currentColor; flex-shrink:0; }
    #badge-assinatura.verde    { color:#4ade80; border-color: rgba(34,197,94,0.35); }
    #badge-assinatura.amarelo  { color:#facc15; border-color: rgba(234,179,8,0.35); animation: piscarBadgeAssinatura 1.5s ease-in-out infinite; }
    #badge-assinatura.vermelho { color:#f87171; border-color: rgba(239,68,68,0.35); }
    @keyframes piscarBadgeAssinatura { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
  `;
  document.head.appendChild(style);

  el = document.createElement("div");
  el.id = "badge-assinatura";
  el.innerHTML = `<span class="dot"></span><span class="txt">Assinatura</span>`;
  document.body.appendChild(el);
  return el;
}

function atualizarBadgeAssinatura(dados) {
  if (!document.body || !dados) return;
  const el = garantirBadgeAssinatura();
  const txt = el.querySelector(".txt");
  const dias = dados.dias;

  let cor, texto;
  if (dias === null || dias === undefined) {
    cor = "";
    texto = "Assinatura: sem dados";
  } else if (dias < 0) {
    const abs = Math.abs(dias);
    cor = "vermelho";
    texto = `Assinatura venceu há ${abs} dia${abs !== 1 ? "s" : ""}`;
  } else if (dias <= 5) {
    cor = "amarelo";
    texto = `Assinatura: ${dias} dia${dias !== 1 ? "s" : ""} restante${dias !== 1 ? "s" : ""}`;
  } else {
    cor = "verde";
    texto = `Assinatura: ${dias} dias restantes`;
  }

  el.className = cor;
  txt.textContent = texto;
}

async function checkSubscriptionStatus(user) {
  if (!user || isRedirecting) return;
  // Não checa nas próprias páginas de auth/cadastro, senão gera loop
  const path = window.location.pathname;
  if (path.includes("auth.html") || path.includes("cadastro.html")) {
    return;
  }
  try {
    const token = await user.getIdToken();
    const resp = await fetch(`${ADMIN_API_URL}/meu-status`, {
      headers: { Authorization: "Bearer " + token }
    });
    // 404 = conta já não existe mais no Supabase (foi removida por vencimento
    // antes do próprio Firebase invalidar a sessão) — desloga na hora.
    if (resp.status === 404) {
      isRedirecting = true;
      localStorage.removeItem("deviceId");
      await signOut(auth).catch(() => {});
      window.location.href = "/auth.html";
      return;
    }
    if (!resp.ok) return; // outro erro de rede/servidor não deve travar quem está em dia
    const data = await resp.json();

    // Mostra os dias restantes num badge simples, criado pelo próprio
    // script — não depende do header nem de nenhum outro arquivo.
    atualizarBadgeAssinatura(data);

    if (data.bloqueado) {
      isRedirecting = true;
      localStorage.removeItem("deviceId");
      await signOut(auth).catch(() => {});
      window.location.href = "/auth.html";
    }
  } catch (e) {
    console.error("Erro ao checar assinatura:", e);
  }
}

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

let unsubscribeDeviceMonitor = null;

onAuthStateChanged(auth, async (user) => {
  console.log("Auth:", user ? "Logado" : "Deslogado");

  if (unsubscribeDeviceMonitor) {
    unsubscribeDeviceMonitor();
    unsubscribeDeviceMonitor = null;
  }
  if (assinaturaCheckInterval) {
    clearInterval(assinaturaCheckInterval);
    assinaturaCheckInterval = null;
  }

  if (!user) {
    if (!isRedirecting && !window.location.href.includes("auth.html")) {
      window.location.href = "auth.html";
    }
    return;
  }

  await registerCurrentDevice(user);
  unsubscribeDeviceMonitor = setupDeviceMonitor(user);

  // Checa assinatura agora, e periodicamente enquanto a sessão ficar aberta
  // (cobre quem já estava logado e a assinatura vence com a aba aberta,
  // ou quem a conta foi removida por vencimento em algum momento depois
  // do login já ter sido feito).
  await checkSubscriptionStatus(user);
  if (assinaturaCheckInterval) clearInterval(assinaturaCheckInterval);
  assinaturaCheckInterval = setInterval(() => checkSubscriptionStatus(user), 5 * 60 * 1000);

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
  if (assinaturaCheckInterval) {
    clearInterval(assinaturaCheckInterval);
    assinaturaCheckInterval = null;
  }
  localStorage.removeItem("deviceId");
  signOut(auth)
    .then(() => setTimeout(() => { window.location.href = "auth.html"; }, 100))
    .catch(() => setTimeout(() => { window.location.href = "auth.html"; }, 100));
};