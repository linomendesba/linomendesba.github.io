import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyDmLGMBnUa2YOdP0b-zlZepXjm-zlV477A",
  authDomain: "linoautenticador.firebaseapp.com",
  projectId: "linoautenticador",
  storageBucket: "linoautenticador.firebasestorage.app",
  messagingSenderId: "946057648829",
  appId: "1:946057648829:web:ac5c2b1ba66e651f9d75d4",
};

// Reutiliza o app já iniciado pelo firebase-auth.js
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

const SUPABASE_URL = "https://pxhmwhswhqvaaohhuqmj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4aG13aHN3aHF2YWFvaGh1cW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNDE1MTgsImV4cCI6MjA2ODYxNzUxOH0.9zaDX79OClGfsjBxsNRi1plZLXXryMkRn6efFZvqDvw";

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/clients?email=eq.${encodeURIComponent(user.email)}&select=name,days_remaining,start_date&limit=1`, {
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
  });
  const data = await res.json();
  const cliente = data?.[0];
  if (!cliente) return;

  const venc = new Date(cliente.start_date);
  venc.setDate(venc.getDate() + cliente.days_remaining);
  const dias = Math.ceil((venc - new Date()) / 86400000);
  const classe = dias <= 0 ? "vermelho" : dias <= 5 ? "laranja" : "verde";
  const texto = dias <= 0 ? "⛔ Expirado" : dias <= 5 ? `⚠️ Vence em ${dias}d` : `✅ ${dias} dias`;

  const container = document.getElementById("betstat-user-info");
  if (!container) return;
  container.innerHTML = `
    <span class="ui-nome">👤 ${cliente.name}</span>
    <span class="ui-badge ${classe}" title="Vence: ${venc.toLocaleDateString('pt-BR')}">${texto}</span>
  `;
});