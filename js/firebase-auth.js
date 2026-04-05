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

// Configuração do Firebase
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

// ─── SUPABASE ────────────────────────────────────────────
const SUPABASE_URL = "https://pxhmwhswhqvaaohhuqmj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4aG13aHN3aHF2YWFvaGh1cW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNDE1MTgsImV4cCI6MjA2ODYxNzUxOH0.9zaDX79OClGfsjBxsNRi1plZLXXryMkRn6efFZvqDvw";

async function fetchClientData(email) {
  const url = `${SUPABASE_URL}/rest/v1/clients?email=eq.${encodeURIComponent(email)}&select=name,start_date,months_paid&limit=1`;
  const res = await fetch(url, {
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    }
  });
  if (!res.ok) throw new Error("Erro Supabase");
  const data = await res.json();
  return data.length > 0 ? data[0] : null;
}

function calcularVencimento(start_date, months_paid) {
  if (!start_date) return null;
  const d = new Date(start_date);
  d.setMonth(d.getMonth() + (months_paid || 1));
  return d;
}

function formatarData(d) {
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// Aguarda o elemento #subscription-info aparecer no DOM (header é injetado via fetch)
function waitForElement(selector, callback, maxTries = 30) {
  const el = document.querySelector(selector);
  if (el) {
    callback(el);
    return;
  }
  if (maxTries <= 0) return;
  setTimeout(() => waitForElement(selector, callback, maxTries - 1), 200);
}

async function renderSubscriptionInfo(email) {
  waitForElement("#subscription-info", async (div) => {
    try {
      const client = await fetchClientData(email);

      if (!client) {
        div.classList.add("vencido");
        div.innerHTML = `<span class="sub-nome">Sem assinatura</span>`;
        return;
      }

      const vencimento = calcularVencimento(client.start_date, client.months_paid);
      const hoje = new Date();
      const dias = vencimento ? Math.ceil((vencimento - hoje) / 86400000) : null;
      const vencido = dias !== null && dias < 0;

      if (vencido) div.classList.add("vencido");

      div.innerHTML = `
        <span class="sub-nome">${client.name}</span>
        <span class="sub-divider">|</span>
        <span class="sub-data">${vencimento ? formatarData(vencimento) : "–"}</span>
        <span class="sub-badge ${vencido ? "vencido" : "ativo"}">
          ${vencido ? "Vencido" : dias !== null ? `${dias}d` : "Ativo"}
        </span>
      `;
    } catch (e) {
      console.error("Erro assinatura:", e);
      div.innerHTML = `<span class="sub-nome">Erro</span>`;
    }
  });
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

  if (!user) {
    if (!isRedirecting && !window.location.href.includes("auth.html")) {
      window.location.href = "auth.html";
    }
    return;
  }

  await registerCurrentDevice(user);
  unsubscribeDeviceMonitor = setupDeviceMonitor(user);

  // ✅ Carrega dados de assinatura
  renderSubscriptionInfo(user.email);

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
  localStorage.removeItem("deviceId");
  signOut(auth)
    .then(() => setTimeout(() => { window.location.href = "auth.html"; }, 100))
    .catch(() => setTimeout(() => { window.location.href = "auth.html"; }, 100));
};