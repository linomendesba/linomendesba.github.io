/**
 * subscription-check.js  —  BetStat
 * ─────────────────────────────────────────────────────────────
 * Coloque no header do site (após firebase-auth.js):
 *
 *   <script type="module" src="js/subscription-check.js"></script>
 *
 * Onde quiser mostrar as infos do usuário, adicione:
 *
 *   <div id="subscription-info"></div>
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey:            "AIzaSyDmLGMBnUa2YOdP0b-zlZepXjm-zlV477A",
  authDomain:        "linoautenticador.firebaseapp.com",
  projectId:         "linoautenticador",
  storageBucket:     "linoautenticador.firebasestorage.app",
  messagingSenderId: "946057648829",
  appId:             "1:946057648829:web:ac5c2b1ba66e651f9d75d4",
};

// ── ENDEREÇO DA SUA API ──────────────────────────────────────────────────
const API_BASE = 'http://145.223.92.222:3001/api/assinantes';

// Se true, redireciona para auth.html quando assinatura vencida
const BLOQUEAR_SE_VENCIDO = true;

const auth = getAuth(initializeApp(firebaseConfig));

async function buscarAssinatura(email) {
  const CACHE_KEY = 'betsub_' + email;
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, ts } = JSON.parse(cached);
    if (Date.now() - ts < 5 * 60 * 1000) return data;
  }
  try {
    const r = await fetch(`${API_BASE}/email/${encodeURIComponent(email)}`);
    if (!r.ok) return null;
    const data = await r.json();
    // adapta o formato para o renderInfo
    data.encontrado = true;
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
    return data;
  } catch {
    return null;
  }
}

function renderInfo(info) {
  const el = document.getElementById('subscription-info');
  if (!el) return;

  if (!info || !info.encontrado) {
    el.innerHTML = `<span style="color:#e05252;font-size:13px;">⚠️ Assinatura não encontrada</span>`;
    return;
  }

  const cor = { ativo:'#1fac89', vencendo:'#e0b84e', vencido:'#e05252' }[info.status] || '#7a9488';
  const diasTxt = info.diasRestantes < 0
    ? `Vencido há ${Math.abs(info.diasRestantes)}d`
    : info.diasRestantes === 0 ? 'Vence hoje!'
    : `${info.diasRestantes}d restantes`;

  el.innerHTML = `
    <span style="display:inline-flex;align-items:center;gap:8px;font-size:13px;
      background:${cor}18;border:1px solid ${cor}44;border-radius:8px;padding:5px 14px;">
      <span style="color:${cor}">●</span>
      <strong style="color:#e8f0ec">${info.nome}</strong>
      <span style="color:#7a9488">|</span>
      <span style="color:${cor}">Vence ${info.vencimentoBR}</span>
      <span style="color:#7a9488;font-size:11px">(${diasTxt})</span>
    </span>`;
}

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const info = await buscarAssinatura(user.email);
  renderInfo(info);

  if (BLOQUEAR_SE_VENCIDO && (!info || !info.ativo)) {
    sessionStorage.clear();
    const el = document.getElementById('subscription-info');
    if (el) el.innerHTML = `<span style="color:#e05252;font-weight:700">⛔ Assinatura vencida. Redirecionando…</span>`;
    setTimeout(() => { window.location.href = 'auth.html'; }, 3000);
  }
});