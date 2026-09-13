/* =========================================================================
   BUSCAR PADRÕES — módulo independente
   -------------------------------------------------------------------------
   Como usar:
   1) Inclua este arquivo com <script> LOGO DEPOIS do tabela.js na página
      (ele depende de variáveis/funções globais que o tabela.js já define:
      Estado, minutosFixos, getLigaKey, getDateStr, qdCheckMarket,
      MERCADO_THRESHOLD, LABEL_CURTO_MERCADO, _cacheResultados, criarTabela).
   2) Pronto — o botão "Buscar Padrões" aparece sozinho acima da tabela
      (#tabelaResultados). Não precisa mexer no tabela.js.

   O que ele faz:
   - Você escolhe um placar-gatilho (ex.: "2 x 0"), quantos jogos "pular"
     depois dele, quantas "entradas" checar em seguida, e qual mercado.
   - Ele varre o histórico já carregado (_cacheResultados) em ordem
     cronológica, encontra toda ocorrência do gatilho, e verifica se o
     mercado bateu em alguma das entradas seguintes (para no primeiro green,
     como uma estratégia de gales).
   - Mostra o percentual de acerto e destaca as células na tabela.
   ========================================================================= */
(function () {
  "use strict";

  // Evita injeção duplicada se o script for incluído mais de uma vez
  if (window.__bpBuscarPadroesInit) return;
  window.__bpBuscarPadroesInit = true;

  // ---------------------------------------------------------------------
  // Nomes amigáveis para os mercados (cai no valor bruto se não mapeado)
  // ---------------------------------------------------------------------
  const BP_NOME_MERCADO = {
    ambasMarcam: "Ambas Marcam Sim",
    ambasNaoMarcam: "Ambas Marcam Não",
    casaVence: "Casa Vence",
    foraVence: "Fora Vence",
    empate: "Empate",
    viradinha: "Viradinha",
    empateOuFora: "Empate ou Fora",
    empateOuCasa: "Empate ou Casa",
    casaOuFora: "Casa ou Fora",
    "over0.5": "Mais de 0.5 gols",
    "over1.5": "Mais de 1.5 gols",
    "over2.5": "Mais de 2.5 gols",
    "over3.5": "Mais de 3.5 gols",
    over5: "5 ou mais gols",
    "under0.5": "Menos de 0.5 gols",
    "under1.5": "Menos de 1.5 gols",
    "under2.5": "Menos de 2.5 gols",
    "under3.5": "Menos de 3.5 gols",
    exato0: "Exatos 0 gols",
    exato1: "Exatos 1 gol",
    exato2: "Exatos 2 gols",
    exato3: "Exatos 3 gols",
    exato4: "Exatos 4 gols",
    exato2t0: "2ºT exatos 0 gols",
    exato2t1: "2ºT exatos 1 gol",
    exato2t2: "2ºT exatos 2 gols",
    exato2t3: "2ºT exatos 3 gols",
    exato2t4: "2ºT exatos 4 gols",
    casa0Gols: "Casa 0 gols",
    casa1Gol: "Casa 1 gol",
    casa2Gols: "Casa 2 gols",
    casa3Gols: "Casa 3 gols",
    casa4Gols: "Casa 4 gols",
    fora0Gols: "Fora 0 gols",
    fora1Gol: "Fora 1 gol",
    fora2Gols: "Fora 2 gols",
    fora3Gols: "Fora 3 gols",
    fora4Gols: "Fora 4 gols",
  };

  function bpNomeMercado(chave) {
    return BP_NOME_MERCADO[chave] || (window.LABEL_CURTO_MERCADO && LABEL_CURTO_MERCADO[chave]) || chave;
  }

  // ---------------------------------------------------------------------
  // Estado / persistência simples por liga
  // ---------------------------------------------------------------------
  function bpChaveConfig() {
    const liga = (typeof getLigaKey === "function") ? getLigaKey() : "default";
    return `bpConfig_${liga}`;
  }

  const bpEstado = {
    placar: null,
    tipo: "ft",     // "ft" ou "ht"
    pulos: 0,
    entradas: 3,
    mercado: "ambasMarcam",
    ocorrencias: [],
    painelAberto: false,
  };

  function bpCarregarConfig() {
    try {
      const raw = localStorage.getItem(bpChaveConfig());
      if (!raw) return;
      const cfg = JSON.parse(raw);
      Object.assign(bpEstado, cfg, { ocorrencias: [] });
    } catch (e) { /* ignora config corrompida */ }
  }

  function bpSalvarConfig() {
    try {
      localStorage.setItem(bpChaveConfig(), JSON.stringify({
        placar: bpEstado.placar,
        tipo: bpEstado.tipo,
        pulos: bpEstado.pulos,
        entradas: bpEstado.entradas,
        mercado: bpEstado.mercado,
      }));
    } catch (e) { /* localStorage indisponível: segue sem persistir */ }
  }

  // ---------------------------------------------------------------------
  // Coleta e ordena os jogos cronologicamente (mais antigo primeiro)
  // ---------------------------------------------------------------------
  function bpTimestamp(jogo) {
    const ds = getDateStr(jogo.data);
    const hh = String(jogo.hora).padStart(2, "0");
    const mm = String(jogo.minuto).padStart(2, "0");
    return new Date(`${ds}T${hh}:${mm}:00`).getTime();
  }

  function bpColetarJogosOrdenados() {
    const base = (typeof _cacheResultados !== "undefined" && Array.isArray(_cacheResultados)) ? _cacheResultados : [];
    return base
      .filter(j => j && j.ft && j.ft.includes("x") && j.data != null && j.hora != null && j.minuto != null)
      .map(j => Object.assign({}, j, { _ts: bpTimestamp(j) }))
      .sort((a, b) => a._ts - b._ts);
  }

  // ---------------------------------------------------------------------
  // Lista de placares disponíveis (para popular o <select>)
  // ---------------------------------------------------------------------
  function bpPlacaresDisponiveis(tipo) {
    const jogos = bpColetarJogosOrdenados();
    const campo = tipo === "ht" ? "ht" : "ft";
    const set = new Set();
    jogos.forEach(j => { if (j[campo] && j[campo].includes("x")) set.add(j[campo]); });
    if (set.size === 0) {
      // fallback: gera grade 0x0..5x5 caso ainda não haja dados carregados
      for (let a = 0; a <= 5; a++) for (let b = 0; b <= 5; b++) set.add(`${a} x ${b}`);
    }
    return Array.from(set).sort((a, b) => {
      const [a1, a2] = a.split(" x ").map(Number);
      const [b1, b2] = b.split(" x ").map(Number);
      return (a1 + a2) - (b1 + b2) || a1 - b1;
    });
  }

  // ---------------------------------------------------------------------
  // Motor de busca do padrão
  // ---------------------------------------------------------------------
  function bpExecutarBusca() {
    const jogos = bpColetarJogosOrdenados();
    const campo = bpEstado.tipo === "ht" ? "ht" : "ft";
    const pulos = Math.max(0, parseInt(bpEstado.pulos, 10) || 0);
    const entradas = Math.max(1, parseInt(bpEstado.entradas, 10) || 1);
    const mercado = bpEstado.mercado;
    const placar = bpEstado.placar;

    const ocorrencias = [];
    if (!placar) return ocorrencias;

    for (let i = 0; i < jogos.length; i++) {
      if (jogos[i][campo] !== placar) continue;

      const inicioEntradas = i + pulos + 1;
      const jogosPulo = jogos.slice(i + 1, inicioEntradas);
      const jogosEntrada = jogos.slice(inicioEntradas, inicioEntradas + entradas);

      // se não há jogos suficientes ainda carregados para completar a
      // janela de pulos+entradas, ignora essa ocorrência (dado incompleto)
      if (jogosPulo.length < pulos || jogosEntrada.length === 0) continue;

      let idxGreen = -1;
      for (let k = 0; k < jogosEntrada.length; k++) {
        if (qdCheckMarket(jogosEntrada[k].ft, jogosEntrada[k].ht, mercado)) { idxGreen = k; break; }
      }

      ocorrencias.push({
        gatilho: jogos[i],
        jogosPulo,
        jogosEntrada,
        green: idxGreen !== -1,
        idxGreen,
        incompleta: jogosEntrada.length < entradas && idxGreen === -1,
      });
    }
    return ocorrencias;
  }

  // ---------------------------------------------------------------------
  // Highlight na tabela (reaplicado toda vez que a tabela é redesenhada)
  // ---------------------------------------------------------------------
  function bpCelulaPara(jogo) {
    const chave = `${getDateStr(jogo.data)}-${jogo.hora}`;
    const linha = document.querySelector(`#tabelaResultados tbody tr[data-chave="${CSS.escape(chave)}"]`);
    if (!linha) return null;
    const minNorm = minutosFixos.reduce((p, c) => Math.abs(c - jogo.minuto) < Math.abs(p - jogo.minuto) ? c : p);
    const idx = minutosFixos.indexOf(minNorm);
    if (idx === -1) return null;
    return linha.children[1 + idx] || null;
  }

  function bpLimparHighlight() {
    document.querySelectorAll(".bp-marcado").forEach(cel => {
      cel.classList.remove("bp-marcado", "bp-cel-gatilho", "bp-cel-pulo", "bp-cel-entrada-green", "bp-cel-entrada-red", "bp-cel-entrada-idle");
      const badge = cel.querySelector(".bp-badge");
      if (badge) badge.remove();
    });
  }

  function bpBadge(cel, texto, tipoClasse) {
    if (!cel) return;
    const b = document.createElement("span");
    b.className = `bp-badge bp-badge-${tipoClasse}`;
    b.textContent = texto;
    cel.appendChild(b);
  }

  function bpAplicarHighlight() {
    bpLimparHighlight();
    if (!bpEstado.ocorrencias || bpEstado.ocorrencias.length === 0) return;

    bpEstado.ocorrencias.forEach((oc, ocIdx) => {
      const celGatilho = bpCelulaPara(oc.gatilho);
      if (celGatilho) {
        celGatilho.classList.add("bp-marcado", "bp-cel-gatilho");
        bpBadge(celGatilho, `P${ocIdx + 1}`, "gatilho");
      }
      oc.jogosPulo.forEach((j, i) => {
        const cel = bpCelulaPara(j);
        if (!cel) return;
        cel.classList.add("bp-marcado", "bp-cel-pulo");
        bpBadge(cel, String(i + 1), "pulo");
      });
      oc.jogosEntrada.forEach((j, i) => {
        const cel = bpCelulaPara(j);
        if (!cel) return;
        let classe = "bp-cel-entrada-idle", rotulo = `E${i + 1}`;
        if (oc.idxGreen === i) { classe = "bp-cel-entrada-green"; rotulo += " ✓"; }
        else if (oc.idxGreen !== -1 && i > oc.idxGreen) { /* não chega a usar, mas deixa marcado como idle */ }
        else if (oc.idxGreen === -1 && i === oc.jogosEntrada.length - 1) { classe = "bp-cel-entrada-red"; rotulo += " ✕"; }
        cel.classList.add("bp-marcado", classe);
        bpBadge(cel, rotulo, classe.replace("bp-cel-", ""));
      });
    });
  }

  // ---------------------------------------------------------------------
  // Renderização dos resultados (texto/estatística) dentro do painel
  // ---------------------------------------------------------------------
  function bpFormatarDataHora(jogo) {
    const ds = getDateStr(jogo.data);
    const [y, m, d] = ds.split("-");
    return `${d}/${m} ${String(jogo.hora).padStart(2, "0")}:${String(jogo.minuto).padStart(2, "0")}`;
  }

  function bpRenderResultados() {
    const el = document.getElementById("bpResultado");
    if (!el) return;
    const ocorrencias = bpEstado.ocorrencias;
    if (!ocorrencias.length) {
      el.innerHTML = `<div style="opacity:.7;padding:6px 2px;">Nenhuma ocorrência encontrada com esses parâmetros (ou dados insuficientes carregados).</div>`;
      return;
    }
    const greens = ocorrencias.filter(o => o.green).length;
    const pct = ((greens / ocorrencias.length) * 100).toFixed(1);

    const linhas = ocorrencias.map((o, i) => {
      const cor = o.green ? "#22c55e" : "#ef4444";
      const status = o.green ? `green (E${o.idxGreen + 1})` : "red";
      return `<div style="display:flex;justify-content:space-between;gap:8px;padding:3px 4px;border-bottom:1px solid rgba(255,255,255,.06);font-size:11px;">
        <span>#${i + 1} · ${bpFormatarDataHora(o.gatilho)}</span>
        <span style="color:${cor};font-weight:700;">${status}</span>
      </div>`;
    }).join("");

    el.innerHTML = `
      <div style="display:flex;align-items:baseline;gap:10px;padding:4px 2px 8px 2px;">
        <span style="font-size:20px;font-weight:800;color:${pct >= 50 ? "#22c55e" : "#ef4444"};">${pct}%</span>
        <span style="font-size:12px;opacity:.75;">${greens}/${ocorrencias.length} ocorrências</span>
      </div>
      <div style="max-height:220px;overflow-y:auto;border-top:1px solid rgba(255,255,255,.08);">${linhas}</div>
    `;
  }

  // ---------------------------------------------------------------------
  // Construção do painel/UI
  // ---------------------------------------------------------------------
  function bpPreencherSelectPlacar(select) {
    const valorAtual = select.value;
    select.innerHTML = "";
    bpPlacaresDisponiveis(bpEstado.tipo).forEach(p => {
      const opt = document.createElement("option");
      opt.value = p; opt.textContent = p;
      select.appendChild(opt);
    });
    if (bpEstado.placar && Array.from(select.options).some(o => o.value === bpEstado.placar)) {
      select.value = bpEstado.placar;
    } else if (valorAtual && Array.from(select.options).some(o => o.value === valorAtual)) {
      select.value = valorAtual;
    }
    bpEstado.placar = select.value || null;
  }

  function bpPreencherSelectMercado(select) {
    const chaves = (typeof MERCADO_THRESHOLD === "object") ? Object.keys(MERCADO_THRESHOLD) : Object.keys(BP_NOME_MERCADO);
    select.innerHTML = "";
    chaves.forEach(k => {
      const opt = document.createElement("option");
      opt.value = k; opt.textContent = bpNomeMercado(k);
      select.appendChild(opt);
    });
    if (bpEstado.mercado && chaves.includes(bpEstado.mercado)) select.value = bpEstado.mercado;
  }

  function bpMontarPainel() {
    if (document.getElementById("bpPainelBuscarPadroes")) return; // já montado

    const tabela = document.getElementById("tabelaResultados");
    const host = tabela ? tabela.parentElement : document.body;

    const wrap = document.createElement("div");
    wrap.id = "bpPainelBuscarPadroes";
    wrap.style.cssText = "margin:8px 0;font-family:inherit;";

    wrap.innerHTML = `
      <button id="bpBtnAbrir" type="button" style="
        background:#7c3aed1a;border:1px solid #7c3aed80;color:#c4b5fd;
        padding:6px 14px;border-radius:8px;font-weight:700;font-size:13px;
        cursor:pointer;">🔎 Buscar Padrões</button>

      <div id="bpPainelConfig" style="display:none;margin-top:8px;padding:10px;
        border:1px solid #7c3aed40;border-radius:10px;background:#0f0f1a99;">
        <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:end;">

          <label style="display:flex;flex-direction:column;font-size:11px;gap:3px;">
            Tipo
            <select id="bpTipo" style="padding:4px;border-radius:6px;">
              <option value="ft">Placar Final (FT)</option>
              <option value="ht">1º Tempo (HT)</option>
            </select>
          </label>

          <label style="display:flex;flex-direction:column;font-size:11px;gap:3px;">
            Placar gatilho
            <select id="bpPlacar" style="padding:4px;border-radius:6px;min-width:90px;"></select>
          </label>

          <label style="display:flex;flex-direction:column;font-size:11px;gap:3px;">
            Pulos
            <input id="bpPulos" type="number" min="0" max="30" style="width:60px;padding:4px;border-radius:6px;">
          </label>

          <label style="display:flex;flex-direction:column;font-size:11px;gap:3px;">
            Entradas
            <input id="bpEntradas" type="number" min="1" max="10" style="width:60px;padding:4px;border-radius:6px;">
          </label>

          <label style="display:flex;flex-direction:column;font-size:11px;gap:3px;flex:1;min-width:160px;">
            Mercado alvo
            <select id="bpMercado" style="padding:4px;border-radius:6px;"></select>
          </label>

          <button id="bpBtnBuscar" type="button" style="
            background:#7c3aed;border:none;color:#fff;padding:7px 16px;
            border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;">Buscar</button>

          <button id="bpBtnLimpar" type="button" style="
            background:transparent;border:1px solid #6b7280;color:#d1d5db;
            padding:7px 12px;border-radius:8px;font-size:13px;cursor:pointer;">Limpar</button>
        </div>

        <div id="bpResultado" style="margin-top:10px;"></div>
      </div>
    `;

    if (tabela) host.insertBefore(wrap, tabela);
    else host.appendChild(wrap);

    const elTipo = wrap.querySelector("#bpTipo");
    const elPlacar = wrap.querySelector("#bpPlacar");
    const elPulos = wrap.querySelector("#bpPulos");
    const elEntradas = wrap.querySelector("#bpEntradas");
    const elMercado = wrap.querySelector("#bpMercado");
    const elBtnAbrir = wrap.querySelector("#bpBtnAbrir");
    const elPainelConfig = wrap.querySelector("#bpPainelConfig");
    const elBtnBuscar = wrap.querySelector("#bpBtnBuscar");
    const elBtnLimpar = wrap.querySelector("#bpBtnLimpar");

    elTipo.value = bpEstado.tipo;
    elPulos.value = bpEstado.pulos;
    elEntradas.value = bpEstado.entradas;
    bpPreencherSelectPlacar(elPlacar);
    bpPreencherSelectMercado(elMercado);

    elBtnAbrir.addEventListener("click", () => {
      bpEstado.painelAberto = !bpEstado.painelAberto;
      elPainelConfig.style.display = bpEstado.painelAberto ? "block" : "none";
      if (bpEstado.painelAberto) { bpPreencherSelectPlacar(elPlacar); bpPreencherSelectMercado(elMercado); }
    });

    elTipo.addEventListener("change", () => { bpEstado.tipo = elTipo.value; bpPreencherSelectPlacar(elPlacar); });
    elPlacar.addEventListener("change", () => { bpEstado.placar = elPlacar.value; });
    elMercado.addEventListener("change", () => { bpEstado.mercado = elMercado.value; });

    elBtnBuscar.addEventListener("click", () => {
      bpEstado.tipo = elTipo.value;
      bpEstado.placar = elPlacar.value;
      bpEstado.pulos = parseInt(elPulos.value, 10) || 0;
      bpEstado.entradas = parseInt(elEntradas.value, 10) || 1;
      bpEstado.mercado = elMercado.value;
      bpSalvarConfig();

      bpEstado.ocorrencias = bpExecutarBusca();
      bpRenderResultados();
      bpAplicarHighlight();
    });

    elBtnLimpar.addEventListener("click", () => {
      bpEstado.ocorrencias = [];
      bpRenderResultados();
      bpLimparHighlight();
    });
  }

  // ---------------------------------------------------------------------
  // CSS do módulo (injetado uma única vez)
  // ---------------------------------------------------------------------
  function bpInjetarCSS() {
    const style = document.createElement("style");
    style.textContent = `
      .bp-cel-gatilho { box-shadow: inset 0 0 0 2px #a855f7, 0 0 10px -2px #a855f7 !important; position: relative; }
      .bp-cel-pulo { opacity: .45 !important; box-shadow: inset 0 0 0 1px #64748b80 !important; position: relative; }
      .bp-cel-entrada-green { box-shadow: inset 0 0 0 2px #22c55e, 0 0 10px -2px #22c55e !important; position: relative; }
      .bp-cel-entrada-red { box-shadow: inset 0 0 0 2px #ef4444, 0 0 10px -2px #ef4444 !important; position: relative; }
      .bp-cel-entrada-idle { box-shadow: inset 0 0 0 1px #94a3b880 !important; position: relative; }
      .bp-badge {
        position: absolute; top: 0; left: 0; z-index: 5;
        font-size: 7px; font-weight: 800; line-height: 1;
        padding: 1px 3px; border-radius: 0 0 4px 0;
        background: #a855f7; color: #fff; pointer-events: none;
      }
      .bp-badge-gatilho { background: #a855f7; }
      .bp-badge-pulo { background: #64748b; }
      .bp-badge-entrada-green { background: #22c55e; }
      .bp-badge-entrada-red { background: #ef4444; }
      .bp-badge-entrada-idle { background: #94a3b8; }
    `;
    document.head.appendChild(style);
  }

  // ---------------------------------------------------------------------
  // Ganchos: reaplica highlight sempre que a tabela é redesenhada
  // ---------------------------------------------------------------------
  function bpInterceptarCriarTabela() {
    if (typeof window.criarTabela !== "function") return false;
    if (window.criarTabela.__bpWrapped) return true;
    const original = window.criarTabela;
    const wrapped = function (...args) {
      const r = original.apply(this, args);
      // pequena espera para garantir que o DOM da tabela já foi montado
      setTimeout(bpAplicarHighlight, 0);
      return r;
    };
    wrapped.__bpWrapped = true;
    window.criarTabela = wrapped;
    return true;
  }

  // ---------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------
  function bpBoot() {
    bpCarregarConfig();
    bpInjetarCSS();
    bpMontarPainel();
    // criarTabela pode ainda não existir no instante do DOMContentLoaded
    // (depende da ordem dos scripts) — tenta interceptar com retentativas
    let tentativas = 0;
    const iv = setInterval(() => {
      tentativas++;
      if (bpInterceptarCriarTabela() || tentativas > 40) clearInterval(iv);
    }, 250);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bpBoot);
  } else {
    bpBoot();
  }
})();