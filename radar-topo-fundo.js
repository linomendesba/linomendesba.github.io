/* =============================================================================
 *  RADAR DE LIGAS — cards de ligas (multi-casa)
 *  ---------------------------------------------------------------------------
 *  Duas análises INDEPENDENTES, cada uma com seu próprio seletor de mercado
 *  e de horas, mais um único par Aplicar/Parar e um botão pra ocultar a
 *  barra de controles (o motor continua rodando escondido).
 *
 *   1) ⭐ MELHOR LIGA — maior incidência do mercado escolhido na janela.
 *   2) 🔶 TOPO / FUNDO — card pisca em amarelo ao bater mínimo/máximo
 *      histórico de Gols FT (blocos de LINES_TO_SUM jogos, igual ao bot).
 *
 *  MULTI-CASA: em vez de mapear cada card pelo texto do <h3> (o que só
 *  funcionava pra Betano), o script lê o arquivo de destino do card
 *  (href ou onclick="window.location.href='...'") e aplica a MESMA lógica
 *  de detecção de arquivo do seu detectarLigaAtual() no config.js — LIGA_
 *  REGISTRY abaixo é uma cópia fiel disso. Então funciona em qualquer
 *  página de qualquer casa que já exista no seu config.js, sem precisar
 *  editar nada aqui quando você adicionar essa mesma barra nas páginas de
 *  Bet365 / Kiron / EstrelaBet.
 *
 *  Config de cada análise, estado ativo/parado e visibilidade da barra
 *  ficam salvos no localStorage, valendo pra qualquer página do site.
 *
 *  IMPORTANTE — confira antes de usar:
 *   1) "World" (mundial.html) não tem constante em LIGAS no seu config.js.
 *      Uso a string 'World' direto, que cai na rota genérica de fallback
 *      do ROTAS_API.resultados (.../resultados/World) — funciona sem
 *      precisar mexer no config.js.
 *   2) Assume que ROTAS_API.resultados(liga) devolve um array de jogos em
 *      ordem cronológica crescente (mais antigo -> mais recente), campo
 *      "ft" no formato "1 x 0". Se vier invertido, troque
 *      RESULTS_ORDER_ASC para false lá embaixo.
 *
 *  Como usar: inclua DEPOIS do config.js e depois do HTML dos cards, em
 *  qualquer página de liga (Betano, Bet365, Kiron, EstrelaBet):
 *      <script src="radar-topo-fundo.js"></script>
 * ===========================================================================
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------------
  // REGISTRO DE LIGAS POR ARQUIVO (cópia do detectarLigaAtual do config.js)
  // ---------------------------------------------------------------------
  const LEAGUE_REGISTRY = [
    { test: f => f.includes('brasileirao.html'),                    liga: () => LIGAS.BRASILEIRAO,            gph: 20 },
    { test: f => f.includes('campeonato_italiano.html'),             liga: () => LIGAS.ITALIANO,               gph: 20 },
    { test: f => f.includes('copa_america.html'),                    liga: () => LIGAS.COPA_AMERICA,           gph: 20 },
    { test: f => f.includes('copa_das_estrelas.html'),                liga: () => LIGAS.COPA_ESTRELAS,          gph: 20 },
    { test: f => f.includes('euro.html') && !f.includes('bet365'),   liga: () => LIGAS.EURO,                   gph: 20 },
    { test: f => f.includes('bet365copa.html'),                      liga: () => LIGAS.BET365_COPA,            gph: 20 },
    { test: f => f.includes('bet365euro.html'),                      liga: () => LIGAS.BET365_EURO,            gph: 20 },
    { test: f => f.includes('bet365super.html'),                     liga: () => LIGAS.BET365_SUPER,           gph: 20 },
    { test: f => f.includes('bet365premier.html'),                   liga: () => LIGAS.BET365_PREMIER,         gph: 20 },
    { test: f => f.includes('kironbrazil.html'),                     liga: () => LIGAS.KIRON_BRAZIL,           gph: 30 },
    { test: f => f.includes('kironengland.html'),                    liga: () => LIGAS.KIRON_ENGLAND,          gph: 30 },
    { test: f => f.includes('kironitaly.html'),                      liga: () => LIGAS.KIRON_ITALY,            gph: 30 },
    { test: f => f.includes('kironamerica.html'),                    liga: () => LIGAS.KIRON_AMERICA,          gph: 30 },
    { test: f => f.includes('kironspain.html'),                      liga: () => LIGAS.KIRON_SPAIN,            gph: 30 },
    { test: f => f.includes('estrelacopamundo.html'),                liga: () => LIGAS.ESTRELA_COPA_MUNDO,     gph: 20 },
    { test: f => f.includes('estrelachampions.html'),                liga: () => LIGAS.ESTRELA_CHAMPIONS,      gph: 20 },
    { test: f => f.includes('estrelaamericalatina.html'),            liga: () => LIGAS.ESTRELA_AMERICA_LATINA, gph: 20 },
    { test: f => f.includes('mundial.html'),                         liga: () => 'World',                      gph: 20 },
    { test: f => f.includes('index.html') || f === '' || f === '/',  liga: () => LIGAS.GLORIA_ETERNA,          gph: 20 },
  ];

  function resolverCard(card) {
    let href = '';
    const a = card.querySelector('a[href]');
    if (a) {
      href = a.getAttribute('href') || '';
    } else {
      const onclick = card.getAttribute('onclick') || '';
      const m = onclick.match(/href\s*=\s*['"]([^'"]+)['"]/);
      if (m) href = m[1];
      else if (card.dataset && card.dataset.href) href = card.dataset.href;
    }
    const arquivo = href.toLowerCase();
    if (!arquivo) return null;
    for (const entry of LEAGUE_REGISTRY) {
      if (entry.test(arquivo)) return { liga: entry.liga(), gph: entry.gph };
    }
    return null;
  }

  // ---------------------------------------------------------------------
  // CONFIGURÁVEL
  // ---------------------------------------------------------------------
  const LINES_TO_SUM_PADRAO = 20;  // base do bloco topo/fundo (30 se gph=30, igual ao bot)
  const MIN_GAMES_ESTRELA   = 10;  // mín. de jogos na janela pra liga entrar no ranking da ⭐
  const CHECK_INTERVAL_MS   = 60_000;
  const RESULTS_ORDER_ASC   = true;

  const HOUR_OPTIONS = [
    { value: 3,  label: '3h'  }, { value: 6,  label: '6h'  },
    { value: 12, label: '12h' }, { value: 24, label: '24h' },
    { value: 48, label: '48h' }, { value: 72, label: '72h' },
  ];

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
  const LS_CFG_TF      = 'radarTopoFundo_config';
  const LS_ACTIVE      = 'radarLigas_active';
  const LS_VISIVEL     = 'radarLigas_visivel';

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
      const val = calcMarketValue(allData.slice(i - linesToSum + 1, i + 1), 'golsFT');
      if (val < min) min = val;
      if (val > max) max = val;
    }
    return { min: min === Infinity ? null : min, max: max === -Infinity ? null : max };
  }

  function calcGames(hours, gph) { return hours * gph; }

  // ---------------------------------------------------------------------
  // CONFIG / ESTADO
  // ---------------------------------------------------------------------
  function loadCfgEstrela() {
    try { const s = JSON.parse(localStorage.getItem(LS_CFG_ESTRELA)); if (s && s.mercado && s.horas) return s; } catch (e) {}
    return { mercado: 'over2.5', horas: 24 };
  }
  function saveCfgEstrela(cfg) { localStorage.setItem(LS_CFG_ESTRELA, JSON.stringify(cfg)); }

  function loadCfgTF() {
    try { const s = JSON.parse(localStorage.getItem(LS_CFG_TF)); if (s && s.modo && s.horas) return s; } catch (e) {}
    return { modo: 'fundo', horas: 12 };
  }
  function saveCfgTF(cfg) { localStorage.setItem(LS_CFG_TF, JSON.stringify(cfg)); }

  function isActive() { return localStorage.getItem(LS_ACTIVE) === '1'; }
  function setActive(v) { localStorage.setItem(LS_ACTIVE, v ? '1' : '0'); }

  function isVisivel() { return localStorage.getItem(LS_VISIVEL) !== '0'; } // padrão: visível
  function setVisivel(v) { localStorage.setItem(LS_VISIVEL, v ? '1' : '0'); }

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
  // ANÁLISE 1 — ⭐ MELHOR LIGA
  // ---------------------------------------------------------------------
  function analisarEstrela(dadosCompletos, horas, mercado, gph) {
    const janela = dadosCompletos.slice(-calcGames(horas, gph));
    if (janela.length < MIN_GAMES_ESTRELA) return null;
    const info = MARKET_INFO[mercado];
    const valor = calcMarketValue(janela, mercado);
    const metrica = info.tipo === 'pct' ? (valor / janela.length) * 100 : (valor / janela.length);
    return { metrica, valor, jogos: janela.length };
  }

  // ---------------------------------------------------------------------
  // ANÁLISE 2 — 🔶 TOPO / FUNDO (mercado fixo Gols FT)
  // ---------------------------------------------------------------------
  function analisarTopoFundo(dadosCompletos, horas, gph) {
    const linesToSum = gph === 30 ? 30 : LINES_TO_SUM_PADRAO;
    const dados = dadosCompletos.slice(-calcGames(horas, gph));
    if (dados.length < linesToSum * 2) return null;
    const { min, max } = computeMinMax(dados, linesToSum);
    if (min === null || max === null) return null;
    const atual = calcMarketValue(dados.slice(-linesToSum), 'golsFT');
    return { atual, min, max, noFundo: atual <= min, noTopo: atual >= max };
  }

  // ---------------------------------------------------------------------
  // EXECUÇÃO DO CICLO
  // ---------------------------------------------------------------------
  async function rodarAnalise() {
    const cfgEstrela = loadCfgEstrela();
    const cfgTF = loadCfgTF();
    const cards = document.querySelectorAll('.cardsligasbetano-card');
    if (!cards.length) return;

    cards.forEach(card => {
      card.classList.remove('rdlg-hit-fundo', 'rdlg-hit-topo');
      const estrelaAntiga = card.querySelector('.rdlg-estrela');
      if (estrelaAntiga) estrelaAntiga.remove();
    });

    const semLiga = [];
    const tarefas = [];
    cards.forEach(card => {
      const info = resolverCard(card);
      if (!info || !info.liga) {
        const h3 = card.querySelector('h3');
        semLiga.push(h3 ? h3.textContent.trim() : '(sem título)');
        return;
      }
      tarefas.push(fetchLiga(info.liga).then(dados => ({ card, dados, gph: info.gph })));
    });
    if (semLiga.length) console.warn('[radar-ligas] card sem liga resolvida: ' + semLiga.join(', '));

    const resultados = await Promise.all(tarefas);

    let melhor = null;
    resultados.forEach(({ card, dados, gph }) => {
      if (!dados) return;
      const r = analisarEstrela(dados, cfgEstrela.horas, cfgEstrela.mercado, gph);
      if (!r) return;
      if (!melhor || r.metrica > melhor.metrica) melhor = { card, ...r };
    });
    if (melhor) {
      const h3 = melhor.card.querySelector('h3');
      if (h3 && !h3.querySelector('.rdlg-estrela')) {
        const info = MARKET_INFO[cfgEstrela.mercado];
        const txt = info.tipo === 'pct' ? `${melhor.metrica.toFixed(0)}% ${info.label}` : `${melhor.metrica.toFixed(2)} gols/jogo`;
        const estrela = document.createElement('span');
        estrela.className = 'rdlg-estrela';
        estrela.title = `Melhor liga: ${txt} (últimas ${cfgEstrela.horas}h)`;
        estrela.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.63 22 9.24 16.5 13.97 18.18 21 12 17.27 5.82 21 7.5 13.97 2 9.24 8.91 8.63 12 2"/></svg>';
        h3.appendChild(estrela);
      }
    }

    resultados.forEach(({ card, dados, gph }) => {
      if (!dados) return;
      const r = analisarTopoFundo(dados, cfgTF.horas, gph);
      if (!r) return;
      const hitFundo = (cfgTF.modo === 'fundo' || cfgTF.modo === 'ambos') && r.noFundo;
      const hitTopo  = (cfgTF.modo === 'topo'  || cfgTF.modo === 'ambos') && r.noTopo;
      if (hitFundo) card.classList.add('rdlg-hit-fundo');
      if (hitTopo)  card.classList.add('rdlg-hit-topo');
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
      card.classList.remove('rdlg-hit-fundo', 'rdlg-hit-topo');
      const estrela = card.querySelector('.rdlg-estrela');
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
      .rdlg-wrap, .rdlg-wrap * {
        box-sizing: border-box;
        font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        line-height: 1.2;
      }
      .rdlg-wrap {
        display: flex; align-items: center; gap: 8px;
        flex-wrap: wrap;
        background: rgba(15,23,42,.9);
        border: 1px solid rgba(148,163,184,.18);
        border-radius: 8px;
        padding: 5px 8px;
        margin: 0 0 8px;
        font-size: 11px;
        color: #cbd5e1;
        position: relative;
      }
      .rdlg-toggle {
        display: inline-flex; align-items: center; justify-content: center;
        width: 22px; height: 22px; flex: 0 0 auto;
        border: 1px solid rgba(148,163,184,.3);
        border-radius: 5px;
        background: rgba(148,163,184,.1);
        color: #cbd5e1;
        font-size: 12px; cursor: pointer;
      }
      .rdlg-toggle:hover { background: rgba(148,163,184,.22); }
      .rdlg-status {
        display: inline-flex; align-items: center; gap: 4px;
        font-size: 10px; color: #94a3b8; white-space: nowrap;
      }
      .rdlg-status .rdlg-dot { width: 6px; height: 6px; border-radius: 50%; background: #64748b; flex: 0 0 auto; }
      .rdlg-status.on .rdlg-dot { background: #22c55e; }
      .rdlg-controls {
        display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
      }
      .rdlg-controls.rdlg-hidden { display: none; }
      .rdlg-grupo {
        display: flex; align-items: center; gap: 4px;
        padding-right: 8px;
        border-right: 1px solid rgba(148,163,184,.2);
      }
      .rdlg-grupo:last-of-type { border-right: none; }
      .rdlg-wrap select {
        background: #0f172a; color: #e2e8f0;
        border: 1px solid rgba(148,163,184,.3);
        border-radius: 5px;
        font-size: 11px;
        padding: 2px 4px;
        height: 22px;
        max-width: 120px;
      }
      .rdlg-wrap button {
        border: none; border-radius: 5px;
        font-size: 11px; font-weight: 600;
        padding: 0 10px; height: 22px;
        cursor: pointer;
      }
      .rdlg-btn-aplicar { background: #0d9488; color: #f0fdfa; }
      .rdlg-btn-aplicar:hover { background: #0f766e; }
      .rdlg-btn-parar {
        background: rgba(148,163,184,.15); color: #cbd5e1;
        border: 1px solid rgba(148,163,184,.3);
      }
      .rdlg-btn-parar:hover { background: rgba(148,163,184,.25); }

      .cardsligasbetano-card.rdlg-hit-fundo,
      .cardsligasbetano-card.rdlg-hit-topo {
        border-color: #f59e0b !important;
        animation: rdlgPisca 1s steps(1, end) infinite;
      }
      @keyframes rdlgPisca {
        0%, 100% { background: #78350f; box-shadow: 0 0 4px 1px #f59e0b inset; }
        50%      { background: #f59e0b; box-shadow: 0 0 16px 4px #fde68a inset; }
      }
      .rdlg-estrela { margin-left: 4px; vertical-align: middle; display: inline-block; }
    `;
    document.head.appendChild(style);
  }

  function atualizarStatus() {
    const statusEl = document.getElementById('rdlg-status');
    if (!statusEl) return;
    const ativo = isActive();
    statusEl.classList.toggle('on', ativo);
    statusEl.querySelector('span:last-child').textContent = ativo ? 'Ativo' : 'Parado';
  }

  function injetarUI() {
    const container = document.querySelector('.cardsligasbetano-container');
    if (!container || document.querySelector('.rdlg-wrap')) return;

    const cfgEstrela = loadCfgEstrela();
    const cfgTF = loadCfgTF();

    const opcoesMercado = Object.entries(MARKET_INFO).map(([id, m]) => `<option value="${id}">${m.label}</option>`).join('');
    const opcoesHoras = HOUR_OPTIONS.map(o => `<option value="${o.value}">${o.label}</option>`).join('');

    const wrap = document.createElement('div');
    wrap.className = 'rdlg-wrap';
    wrap.innerHTML = `
      <button type="button" class="rdlg-toggle" id="rdlg-toggle" title="Mostrar/ocultar controles">☰</button>
      <span class="rdlg-status" id="rdlg-status"><span class="rdlg-dot"></span><span>Parado</span></span>
      <div class="rdlg-controls" id="rdlg-controls">
        <span class="rdlg-grupo" title="Análise 1: melhor liga">
          ⭐
          <select id="rdlg-estrela-mercado">${opcoesMercado}</select>
          <select id="rdlg-estrela-horas">${opcoesHoras}</select>
        </span>
        <span class="rdlg-grupo" title="Análise 2: topo/fundo (independente da ⭐)">
          🔶
          <select id="rdlg-tf-modo">
            <option value="fundo">⬇️ Fundo</option>
            <option value="topo">⬆️ Topo</option>
            <option value="ambos">🎯 Ambos</option>
          </select>
          <select id="rdlg-tf-horas">${opcoesHoras}</select>
        </span>
        <button type="button" class="rdlg-btn-aplicar" id="rdlg-aplicar">Aplicar</button>
        <button type="button" class="rdlg-btn-parar" id="rdlg-parar">Parar</button>
      </div>
    `;
    container.parentNode.insertBefore(wrap, container);

    wrap.querySelector('#rdlg-estrela-mercado').value = cfgEstrela.mercado;
    wrap.querySelector('#rdlg-estrela-horas').value = String(cfgEstrela.horas);
    wrap.querySelector('#rdlg-tf-modo').value = cfgTF.modo;
    wrap.querySelector('#rdlg-tf-horas').value = String(cfgTF.horas);

    wrap.querySelector('#rdlg-aplicar').addEventListener('click', () => {
      saveCfgEstrela({
        mercado: wrap.querySelector('#rdlg-estrela-mercado').value,
        horas: parseInt(wrap.querySelector('#rdlg-estrela-horas').value, 10),
      });
      saveCfgTF({
        modo: wrap.querySelector('#rdlg-tf-modo').value,
        horas: parseInt(wrap.querySelector('#rdlg-tf-horas').value, 10),
      });
      iniciar();
    });
    wrap.querySelector('#rdlg-parar').addEventListener('click', parar);

    const controlsEl = wrap.querySelector('#rdlg-controls');
    const toggleEl = wrap.querySelector('#rdlg-toggle');
    function aplicarVisibilidade() {
      const visivel = isVisivel();
      controlsEl.classList.toggle('rdlg-hidden', !visivel);
      toggleEl.textContent = visivel ? '☰' : '⋯';
    }
    toggleEl.addEventListener('click', () => { setVisivel(!isVisivel()); aplicarVisibilidade(); });
    aplicarVisibilidade();

    atualizarStatus();
  }

  // ---------------------------------------------------------------------
  // BOOT
  // ---------------------------------------------------------------------
  function boot() {
    if (typeof ROTAS_API === 'undefined' || typeof LIGAS === 'undefined') {
      console.warn('[radar-ligas] ROTAS_API/LIGAS não encontrados — confira a ordem dos <script> (config.js antes deste).');
      return;
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