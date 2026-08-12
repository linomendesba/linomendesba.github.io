/* =============================================================================
 *  RADAR DE LIGAS — cards de ligas
 *  ---------------------------------------------------------------------------
 *  Duas análises INDEPENDENTES, cada uma com seu próprio seletor de mercado
 *  e de horas. Um único par de botões (Aplicar/Parar) liga/desliga as duas
 *  de uma vez (pra manter a UI pequena), mas o resultado de uma nunca afeta
 *  o da outra.
 *
 *   1) ⭐ MELHOR LIGA
 *      Você escolhe um mercado (Over 2.5, Ambas Sim, Gols FT, etc) e uma
 *      janela de horas. A liga com a maior incidência desse mercado nessa
 *      janela recebe uma ⭐ ao lado do nome no card.
 *
 *   2) 🔶 TOPO / FUNDO
 *      Você escolhe o modo (Fundo, Topo ou Ambos) e uma janela de horas.
 *      Quando a liga bate o mínimo/máximo histórico de Gols FT (mesma
 *      lógica do bot de Telegram, blocos de LINES_TO_SUM jogos), o CARD
 *      daquela liga pisca em amarelo. Isso é TOTALMENTE separado da ⭐.
 *
 *  Config de cada análise + estado ativo/parado ficam salvos no
 *  localStorage, valendo pra qualquer página de liga do site.
 *
 *  IMPORTANTE — confira antes de usar:
 *   1) LIGA_MAP faz "texto do card" -> valor de liga esperado pela API.
 *      Usa as constantes reais do seu config.js (LIGAS.*). "World" não
 *      tem constante em LIGAS, mas como o próprio ROTAS_API.resultados
 *      tem uma rota genérica de fallback (.../resultados/World), passar a
 *      string 'World' direto funciona sem precisar mexer no config.js.
 *   2) Assume que ROTAS_API.resultados(liga) devolve um array de jogos em
 *      ordem cronológica crescente (mais antigo -> mais recente), com
 *      campo "ft" no formato "1 x 0" — igual ao restante do site já usa.
 *      Se no seu caso vier do mais novo pro mais velho, troque
 *      RESULTS_ORDER_ASC para false lá embaixo.
 *
 *  Como usar: inclua DEPOIS do config.js e depois do HTML dos cards, por
 *  exemplo antes de </body>:
 *      <script src="radar-topo-fundo.js"></script>
 * ===========================================================================
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------------
  // CONFIGURÁVEL
  // ---------------------------------------------------------------------
  const LIGA_MAP = {
    'World':        'World', // sem constante em LIGAS — usa a rota genérica de fallback
    'Euro':         (typeof LIGAS !== 'undefined' && LIGAS.EURO) || null,
    'América':      (typeof LIGAS !== 'undefined' && LIGAS.COPA_AMERICA) || null,
    'Estrelas':     (typeof LIGAS !== 'undefined' && LIGAS.COPA_ESTRELAS) || null,
    'Brasileirão':  (typeof LIGAS !== 'undefined' && LIGAS.BRASILEIRAO) || null,
    'Clássicos':    (typeof LIGAS !== 'undefined' && LIGAS.GLORIA_ETERNA) || null,
    'Italiano':     (typeof LIGAS !== 'undefined' && LIGAS.ITALIANO) || null,
  };

  const GAMES_PER_HOUR     = 20;         // jogos/hora da casa (Betano)
  const LINES_TO_SUM       = 20;         // base do bloco topo/fundo (igual ao bot)
  const MIN_GAMES_ESTRELA  = 10;         // mín. de jogos na janela pra liga entrar no ranking da ⭐
  const CHECK_INTERVAL_MS  = 60_000;     // re-checa a cada 60s (igual ao bot)
  const RESULTS_ORDER_ASC  = true;       // true = mais antigo primeiro

  const HOUR_OPTIONS = [
    { value: 3,  label: '3h'  },
    { value: 6,  label: '6h'  },
    { value: 12, label: '12h' },
    { value: 24, label: '24h' },
    { value: 48, label: '48h' },
    { value: 72, label: '72h' },
  ];

  // Mesma lista de mercados do bot (id -> {label, tipo})
  const MARKET_INFO = {
    golsFT:            { label: 'Gols FT (Total)',     tipo: 'soma' },
    golsHT:            { label: 'Gols HT (1º Tempo)',  tipo: 'soma' },
    casaVence:         { label: 'Casa Vence',           tipo: 'pct' },
    empate:            { label: 'Empate',               tipo: 'pct' },
    foraVence:         { label: 'Fora Vence',           tipo: 'pct' },
    ambasSim:          { label: 'Ambas Sim',            tipo: 'pct' },
    ambasNao:          { label: 'Ambas Não',            tipo: 'pct' },
    'over1.5':         { label: 'Over 1.5',             tipo: 'pct' },
    'over2.5':         { label: 'Over 2.5',             tipo: 'pct' },
    'over3.5':         { label: 'Over 3.5',             tipo: 'pct' },
    'under1.5':        { label: 'Under 1.5',            tipo: 'pct' },
    'under2.5':        { label: 'Under 2.5',            tipo: 'pct' },
    'under3.5':        { label: 'Under 3.5',            tipo: 'pct' },
    zeroGolsExatos:    { label: '0 Gol Exato',          tipo: 'pct' },
    umGolExato:        { label: '1 Gol Exato',          tipo: 'pct' },
    doisGolsExatos:    { label: '2 Gols Exatos',        tipo: 'pct' },
    tresGolsExatos:    { label: '3 Gols Exatos',        tipo: 'pct' },
    cincoOuMaisGols:   { label: '5+ Gols',              tipo: 'pct' },
  };

  const LS_CFG_ESTRELA = 'radarEstrela_config';
  const LS_CFG_TF       = 'radarTopoFundo_config';
  const LS_ACTIVE        = 'radarLigas_active';

  // ---------------------------------------------------------------------
  // LÓGICA (portada do bot)
  // ---------------------------------------------------------------------
  function parseFt(ft) {
    if (!ft) return { h: 0, a: 0, total: 0 };
    const parts = String(ft).split(/\s*x\s*/i).map(s => parseInt(s, 10) || 0);
    const h = parts[0] || 0, a = parts[1] || 0;
    return { h, a, total: h + a };
  }

  function parseHtGoals(ht) {
    if (!ht) return 0;
    const s = String(ht).trim();
    if (s.toUpperCase() === 'OUT') return 3;
    const parts = s.split(/\s*x\s*/i).map(Number);
    return (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) ? parts[0] + parts[1] : 0;
  }

  function checkMkt(market, h, a, t) {
    switch (market) {
      case 'casaVence':        return h > a ? 1 : 0;
      case 'empate':           return h === a ? 1 : 0;
      case 'foraVence':        return a > h ? 1 : 0;
      case 'ambasSim':         return h > 0 && a > 0 ? 1 : 0;
      case 'ambasNao':         return h === 0 || a === 0 ? 1 : 0;
      case 'over1.5':          return t > 1.5 ? 1 : 0;
      case 'over2.5':          return t > 2.5 ? 1 : 0;
      case 'over3.5':          return t > 3.5 ? 1 : 0;
      case 'under1.5':         return t < 1.5 ? 1 : 0;
      case 'under2.5':         return t < 2.5 ? 1 : 0;
      case 'under3.5':         return t < 3.5 ? 1 : 0;
      case 'zeroGolsExatos':   return t === 0 ? 1 : 0;
      case 'umGolExato':       return t === 1 ? 1 : 0;
      case 'doisGolsExatos':   return t === 2 ? 1 : 0;
      case 'tresGolsExatos':   return t === 3 ? 1 : 0;
      case 'cincoOuMaisGols':  return t >= 5 ? 1 : 0;
      default: return 0;
    }
  }

  // Soma (golsFT/golsHT) ou contagem de acertos (demais mercados)
  function calcMarketValue(slice, marketId) {
    if (!slice.length) return 0;
    const info = MARKET_INFO[marketId];
    if (!info) return 0;

    if (info.tipo === 'soma') {
      let soma = 0;
      for (const jogo of slice) {
        if (marketId === 'golsFT') soma += parseFt(jogo.ft).total;
        else if (marketId === 'golsHT') soma += parseHtGoals(jogo.ht);
      }
      return Math.round(soma);
    }

    let count = 0;
    for (const jogo of slice) {
      const { h, a, total } = parseFt(jogo.ft);
      count += checkMkt(marketId, h, a, total);
    }
    return count;
  }

  function computeMinMax(allData, linesToSum) {
    if (allData.length < linesToSum) return { min: null, max: null };
    let min = Infinity, max = -Infinity;
    for (let i = linesToSum - 1; i < allData.length; i++) {
      const slice = allData.slice(i - linesToSum + 1, i + 1);
      const val = calcMarketValue(slice, 'golsFT');
      if (val < min) min = val;
      if (val > max) max = val;
    }
    return {
      min: min === Infinity ? null : min,
      max: max === -Infinity ? null : max,
    };
  }

  function calcGames(hours) {
    return hours * GAMES_PER_HOUR;
  }

  // ---------------------------------------------------------------------
  // CONFIG / ESTADO
  // ---------------------------------------------------------------------
  function loadCfgEstrela() {
    try {
      const s = JSON.parse(localStorage.getItem(LS_CFG_ESTRELA));
      if (s && s.mercado && s.horas) return s;
    } catch (e) {}
    return { mercado: 'over2.5', horas: 24 };
  }
  function saveCfgEstrela(cfg) { localStorage.setItem(LS_CFG_ESTRELA, JSON.stringify(cfg)); }

  function loadCfgTF() {
    try {
      const s = JSON.parse(localStorage.getItem(LS_CFG_TF));
      if (s && s.modo && s.horas) return s;
    } catch (e) {}
    return { modo: 'fundo', horas: 12 };
  }
  function saveCfgTF(cfg) { localStorage.setItem(LS_CFG_TF, JSON.stringify(cfg)); }

  function isActive() { return localStorage.getItem(LS_ACTIVE) === '1'; }
  function setActive(v) { localStorage.setItem(LS_ACTIVE, v ? '1' : '0'); }

  let intervalId = null;

  // ---------------------------------------------------------------------
  // BUSCA
  // ---------------------------------------------------------------------
  async function fetchLiga(ligaValue) {
    try {
      const res = await fetch(ROTAS_API.resultados(ligaValue) + `?ts=${Date.now()}`);
      if (!res.ok) throw new Error(res.status);
      let dados = await res.json();
      if (!Array.isArray(dados)) return null;
      if (!RESULTS_ORDER_ASC) dados = [...dados].reverse();
      return dados;
    } catch (e) {
      console.warn('[radar-ligas] falha ao buscar', ligaValue, e.message);
      return null;
    }
  }

  // ---------------------------------------------------------------------
  // ANÁLISE 1 — ⭐ MELHOR LIGA (independente)
  // ---------------------------------------------------------------------
  function analisarEstrela(dadosCompletos, horas, mercado) {
    const janela = dadosCompletos.slice(-calcGames(horas));
    if (janela.length < MIN_GAMES_ESTRELA) return null;

    const info = MARKET_INFO[mercado];
    const valor = calcMarketValue(janela, mercado);
    const metrica = info.tipo === 'pct'
      ? (valor / janela.length) * 100   // percentual de incidência
      : (valor / janela.length);        // média de gols por jogo

    return { metrica, valor, jogos: janela.length };
  }

  // ---------------------------------------------------------------------
  // ANÁLISE 2 — 🔶 TOPO / FUNDO (independente, mercado fixo Gols FT)
  // ---------------------------------------------------------------------
  function analisarTopoFundo(dadosCompletos, horas) {
    const dados = dadosCompletos.slice(-calcGames(horas));
    if (dados.length < LINES_TO_SUM * 2) return null;

    const { min, max } = computeMinMax(dados, LINES_TO_SUM);
    if (min === null || max === null) return null;

    const atual = calcMarketValue(dados.slice(-LINES_TO_SUM), 'golsFT');
    return { atual, min, max, noFundo: atual <= min, noTopo: atual >= max };
  }

  // ---------------------------------------------------------------------
  // EXECUÇÃO DO CICLO (busca 1x por liga, roda as 2 análises em cima)
  // ---------------------------------------------------------------------
  async function rodarAnalise() {
    const cfgEstrela = loadCfgEstrela();
    const cfgTF = loadCfgTF();
    const cards = document.querySelectorAll('.cardsligasbetano-card');
    if (!cards.length) return;

    cards.forEach(card => {
      card.classList.remove('radar-hit-fundo', 'radar-hit-topo');
      const estrelaAntiga = card.querySelector('.radar-estrela');
      if (estrelaAntiga) estrelaAntiga.remove();
    });

    const tarefas = [];
    cards.forEach(card => {
      const h3 = card.querySelector('h3');
      const nome = h3 ? h3.textContent.trim() : null;
      const ligaValue = nome ? LIGA_MAP[nome] : null;
      if (!ligaValue) return;
      tarefas.push(fetchLiga(ligaValue).then(dados => ({ card, dados })));
    });

    const resultados = await Promise.all(tarefas);

    // --- Análise 1: melhor liga (⭐) ---
    let melhor = null;
    resultados.forEach(({ card, dados }) => {
      if (!dados) return;
      const r = analisarEstrela(dados, cfgEstrela.horas, cfgEstrela.mercado);
      if (!r) return;
      if (!melhor || r.metrica > melhor.metrica) melhor = { card, ...r };
    });
    if (melhor) {
      const h3 = melhor.card.querySelector('h3');
      if (h3 && !h3.querySelector('.radar-estrela')) {
        const info = MARKET_INFO[cfgEstrela.mercado];
        const txt = info.tipo === 'pct'
          ? `${melhor.metrica.toFixed(0)}% ${info.label}`
          : `${melhor.metrica.toFixed(2)} gols/jogo`;
        const estrela = document.createElement('span');
        estrela.className = 'radar-estrela';
        estrela.title = `Melhor liga: ${txt} (últimas ${cfgEstrela.horas}h)`;
        estrela.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.63 22 9.24 16.5 13.97 18.18 21 12 17.27 5.82 21 7.5 13.97 2 9.24 8.91 8.63 12 2"/></svg>';
        h3.appendChild(estrela);
      }
    }

    // --- Análise 2: topo/fundo (🔶) ---
    resultados.forEach(({ card, dados }) => {
      if (!dados) return;
      const r = analisarTopoFundo(dados, cfgTF.horas);
      if (!r) return;
      const hitFundo = (cfgTF.modo === 'fundo' || cfgTF.modo === 'ambos') && r.noFundo;
      const hitTopo  = (cfgTF.modo === 'topo'  || cfgTF.modo === 'ambos') && r.noTopo;
      if (hitFundo) card.classList.add('radar-hit-fundo');
      if (hitTopo)  card.classList.add('radar-hit-topo');
    });
  }

  function iniciar() {
    setActive(true);
    if (intervalId) clearInterval(intervalId);
    rodarAnalise();
    intervalId = setInterval(rodarAnalise, CHECK_INTERVAL_MS);
    atualizarStatus();
  }

  function parar() {
    setActive(false);
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    document.querySelectorAll('.cardsligasbetano-card').forEach(card => {
      card.classList.remove('radar-hit-fundo', 'radar-hit-topo');
      const estrela = card.querySelector('.radar-estrela');
      if (estrela) estrela.remove();
    });
    atualizarStatus();
  }

  // ---------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------
  function injetarCSS() {
    const style = document.createElement('style');
    style.textContent = `
      .radar-tf-bar {
        display: flex; align-items: center; gap: 5px;
        flex-wrap: wrap;
        padding: 4px 6px;
        margin: 4px 0 6px;
        font-size: 11px;
        color: #cbd5e1;
      }
      .radar-tf-bar .radar-grupo {
        display: flex; align-items: center; gap: 4px;
        padding: 2px 5px 2px 2px;
        border-right: 1px solid rgba(148,163,184,.2);
      }
      .radar-tf-bar select {
        background: #0f172a; color: #e2e8f0;
        border: 1px solid rgba(148,163,184,.3);
        border-radius: 5px;
        font-size: 11px;
        padding: 2px 4px;
        height: 22px;
        max-width: 120px;
      }
      .radar-tf-bar button {
        border: none; border-radius: 5px;
        font-size: 11px; font-weight: 600;
        padding: 2px 8px; height: 22px;
        cursor: pointer;
      }
      .radar-tf-bar .radar-btn-aplicar { background: #0d9488; color: #f0fdfa; }
      .radar-tf-bar .radar-btn-aplicar:hover { background: #0f766e; }
      .radar-tf-bar .radar-btn-parar {
        background: rgba(148,163,184,.15); color: #cbd5e1;
        border: 1px solid rgba(148,163,184,.3);
      }
      .radar-tf-bar .radar-btn-parar:hover { background: rgba(148,163,184,.25); }
      .radar-tf-status {
        display: inline-flex; align-items: center; gap: 4px;
        margin-left: 2px; font-size: 10px; color: #94a3b8;
      }
      .radar-tf-status .dot { width: 6px; height: 6px; border-radius: 50%; background: #64748b; }
      .radar-tf-status.on .dot { background: #22c55e; }

      .cardsligasbetano-card.radar-hit-fundo,
      .cardsligasbetano-card.radar-hit-topo {
        background: #92400e !important;
        border-color: #f59e0b !important;
        box-shadow: 0 0 0 1px #f59e0b inset;
        animation: radarPulso 1.6s ease-in-out infinite;
      }
      @keyframes radarPulso {
        0%, 100% { box-shadow: 0 0 0 1px #f59e0b inset; }
        50%      { box-shadow: 0 0 8px 1px #fbbf24 inset; }
      }
      .radar-estrela { margin-left: 4px; vertical-align: middle; display: inline-block; }
    `;
    document.head.appendChild(style);
  }

  function atualizarStatus() {
    const statusEl = document.getElementById('radar-tf-status');
    if (!statusEl) return;
    const ativo = isActive();
    statusEl.classList.toggle('on', ativo);
    statusEl.querySelector('span').textContent = ativo ? 'Ativo' : 'Parado';
  }

  function injetarUI() {
    const container = document.querySelector('.cardsligasbetano-container');
    if (!container || document.querySelector('.radar-tf-bar')) return;

    const cfgEstrela = loadCfgEstrela();
    const cfgTF = loadCfgTF();

    const opcoesMercado = Object.entries(MARKET_INFO)
      .map(([id, m]) => `<option value="${id}">${m.label}</option>`).join('');
    const opcoesHoras = HOUR_OPTIONS
      .map(o => `<option value="${o.value}">${o.label}</option>`).join('');

    const bar = document.createElement('div');
    bar.className = 'radar-tf-bar';
    bar.innerHTML = `
      <span class="radar-grupo" title="Análise 1: melhor liga">
        ⭐
        <select id="radar-estrela-mercado">${opcoesMercado}</select>
        <select id="radar-estrela-horas">${opcoesHoras}</select>
      </span>
      <span class="radar-grupo" title="Análise 2: topo/fundo (independente da ⭐)">
        🔶
        <select id="radar-tf-modo">
          <option value="fundo">⬇️ Fundo</option>
          <option value="topo">⬆️ Topo</option>
          <option value="ambos">🎯 Ambos</option>
        </select>
        <select id="radar-tf-horas">${opcoesHoras}</select>
      </span>
      <button type="button" class="radar-btn-aplicar" id="radar-tf-aplicar">Aplicar</button>
      <button type="button" class="radar-btn-parar" id="radar-tf-parar">Parar</button>
      <span class="radar-tf-status" id="radar-tf-status"><span class="dot"></span><span>Parado</span></span>
    `;
    container.parentNode.insertBefore(bar, container);

    bar.querySelector('#radar-estrela-mercado').value = cfgEstrela.mercado;
    bar.querySelector('#radar-estrela-horas').value = String(cfgEstrela.horas);
    bar.querySelector('#radar-tf-modo').value = cfgTF.modo;
    bar.querySelector('#radar-tf-horas').value = String(cfgTF.horas);

    bar.querySelector('#radar-tf-aplicar').addEventListener('click', () => {
      saveCfgEstrela({
        mercado: bar.querySelector('#radar-estrela-mercado').value,
        horas: parseInt(bar.querySelector('#radar-estrela-horas').value, 10),
      });
      saveCfgTF({
        modo: bar.querySelector('#radar-tf-modo').value,
        horas: parseInt(bar.querySelector('#radar-tf-horas').value, 10),
      });
      iniciar();
    });

    bar.querySelector('#radar-tf-parar').addEventListener('click', parar);

    atualizarStatus();
  }

  // ---------------------------------------------------------------------
  // BOOT
  // ---------------------------------------------------------------------
  function boot() {
    if (typeof ROTAS_API === 'undefined') {
      console.warn('[radar-ligas] ROTAS_API não encontrado — confira a ordem dos <script>.');
      return;
    }

    const semMapa = Object.entries(LIGA_MAP).filter(([, v]) => !v).map(([k]) => k);
    if (semMapa.length) {
      console.warn('[radar-ligas] sem liga mapeada (fora da análise): ' + semMapa.join(', '));
    }

    injetarCSS();
    injetarUI();
    if (isActive()) iniciar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
