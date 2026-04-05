// =====================================================
// subscription-info.js
// Inclua DEPOIS do firebase.js no seu HTML:
// <script src="firebase.js"></script>
// <script src="subscription-info.js"></script>
// =====================================================

(function () {
  const SUPABASE_URL = "https://pxhmwhswhqvaaohhuqmj.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4aG13aHN3aHF2YWFvaGh1cW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNDE1MTgsImV4cCI6MjA2ODYxNzUxOH0.9zaDX79OClGfsjBxsNRi1plZLXXryMkRn6efFZvqDvw";

  async function fetchClientData(email) {
    const url = `${SUPABASE_URL}/rest/v1/clients?email=eq.${encodeURIComponent(email)}&select=name,start_date,months_paid&limit=1`;
    const response = await fetch(url, {
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) throw new Error("Erro Supabase");
    const data = await response.json();
    return data.length > 0 ? data[0] : null;
  }

  function calcularVencimento(start_date, months_paid) {
    if (!start_date) return null;
    const inicio = new Date(start_date);
    inicio.setMonth(inicio.getMonth() + (months_paid || 1));
    return inicio;
  }

  function formatarData(data) {
    return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function renderInfo(client) {
    const div = document.getElementById("subscription-info");
    if (!div) return;

    const vencimento = calcularVencimento(client.start_date, client.months_paid);
    const hoje = new Date();
    const diasRestantes = vencimento ? Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24)) : null;
    const vencido = diasRestantes !== null && diasRestantes < 0;

    if (vencido) div.classList.add("vencido");

    div.innerHTML = `
      <span class="sub-nome">${client.name}</span>
      <span class="sub-divider">|</span>
      <span class="sub-data">${vencimento ? formatarData(vencimento) : "–"}</span>
      <span class="sub-badge ${vencido ? "vencido" : "ativo"}">
        ${vencido ? "Vencido" : diasRestantes !== null ? `${diasRestantes}d` : "Ativo"}
      </span>
    `;
  }

  function renderErro() {
    const div = document.getElementById("subscription-info");
    if (!div) return;
    div.classList.add("vencido");
    div.innerHTML = `<span class="sub-nome">Sem assinatura</span>`;
  }

  // Aguarda o Firebase ficar disponível e então escuta o usuário logado
  function waitForFirebase() {
    // firebase e firebase.auth() são expostos pelo firebase.js via CDN compat
    // Se você usa a versão modular com script normal, usamos a variável global "auth" exposta pelo firebase.js
    if (typeof firebase !== "undefined" && firebase.auth) {
      // Versão CDN compat (firebase-app.js CDN antigo)
      firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) return;
        try {
          const client = await fetchClientData(user.email);
          client ? renderInfo(client) : renderErro();
        } catch (e) {
          console.error("Erro assinatura:", e);
          renderErro();
        }
      });
    } else if (window._firebaseAuth) {
      // Variável global exposta pelo firebase.js modular (veja instruções abaixo)
      window._firebaseAuth.onAuthStateChanged(async (user) => {
        if (!user) return;
        try {
          const client = await fetchClientData(user.email);
          client ? renderInfo(client) : renderErro();
        } catch (e) {
          console.error("Erro assinatura:", e);
          renderErro();
        }
      });
    } else {
      // Firebase ainda não carregou, tenta de novo em 200ms
      setTimeout(waitForFirebase, 200);
    }
  }

  waitForFirebase();
})();