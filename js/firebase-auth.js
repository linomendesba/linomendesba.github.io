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

// ── Compatibilidade de API com o domínio antigo (betstat.site) ──
// api-dominio.js
// Redireciona automaticamente chamadas de API do domínio antigo (betstat.site)
// para o domínio atual do site. Carregue ANTES dos scripts da página.
//
// NOVA_BASE = endereço da API (sem www). Se mudar, altere só ali,
// ex.: var NOVA_BASE = "https://datavirtual.com.br";
(function () {
  if (window.__apiDominioShim) return;
  window.__apiDominioShim = true;

  var ANTIGO = /^https?:\/\/(www\.)?betstat\.site(?=\/|$)/i;
  var NOVA_BASE = "https://datavirtual.com.br";  // API (sem www)

  function reescrever(u) {
    return typeof u === "string" ? u.replace(ANTIGO, NOVA_BASE) : u;
  }

  if (window.fetch) {
    var fetchOriginal = window.fetch;
    window.fetch = function (input, init) {
      try {
        if (typeof input === "string") {
          input = reescrever(input);
        } else if (typeof URL !== "undefined" && input instanceof URL) {
          input = new URL(reescrever(input.href));
        } else if (input && input.url && ANTIGO.test(input.url)) {
          input = new Request(reescrever(input.url), input);
        }
      } catch (e) {}
      return fetchOriginal.call(this, input, init);
    };
  }

  if (window.XMLHttpRequest) {
    var openOriginal = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
      var args = Array.prototype.slice.call(arguments);
      args[1] = reescrever(String(url));
      return openOriginal.apply(this, args);
    };
  }
})();


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