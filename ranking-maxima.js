// ranking-maxima.js
// ────────────────────────────────────────────────────────────────
// Calcula a máxima (maior sequência de jogos sem um mercado)
// para cada time dentro de um período selecionado.
// ────────────────────────────────────────────────────────────────

const RankingMaxima = (() => {
  // Estados
  let currentCasa = null;
  let currentLiga = null;
  let currentPeriodo = 72; // horas
  let currentMercado = 'over';
  let rankingData = [];

  // ────────────────────────────────────────────────────────────────
  // UTILIDADES DE DATA
  // ────────────────────────────────────────────────────────────────

  function getTimeRangeForHours(hours) {
    const now = new Date();
    const start = new Date(now.getTime() - hours * 60 * 60 * 1000);
    return { start, end: now };
  }

  function parseDate(dateStr) {
    if (!dateStr) return null;
    // Tenta varios formatos: ISO, DD/MM/YYYY, DD-MM-YYYY
    if (dateStr.includes('T')) {
      return new Date(dateStr);
    }
    const parts = dateStr.split(/[-/]/);
    if (parts.length === 3) {
      const [d, m, y] = parts;
      // Se o primeiro é 4 dígitos, é YYYY-MM-DD
      if (d.length === 4) {
        return new Date(`${d}-${m}-${d}`);
      }
      // Senão assume DD/MM/YYYY
      return new Date(y, m - 1, d);
    }
    return null;
  }

  function isWithinRange(dateStr, start, end) {
    const date = parseDate(dateStr);
    if (!date || isNaN(date)) return false;
    return date >= start && date <= end;
  }

  // ────────────────────────────────────────────────────────────────
  // DETECÇÃO DO RESULTADO (OVER vs UNDER)
  // ────────────────────────────────────────────────────────────────

  function getMarketResult(result) {
    // result pode ser um objeto { placar: "X X Y" } ou um número/string
    let placar = result;

    if (typeof result === 'object' && result !== null) {
      placar = result.placar || result.score || result.resultado || '';
    }

    if (typeof placar !== 'string') {
      placar = String(placar || '0 0 0');
    }

    // Extrai os gols: "3 x 2" → 5
    const match = placar.match(/(\d+)\s*[xX×]\s*(\d+)/);
    if (!match) return null;

    const goalsHome = parseInt(match[1], 10);
    const goalsAway = parseInt(match[2], 10);
    const totalGoals = goalsHome + goalsAway;

    return {
      totalGoals,
      isOver: totalGoals > 2.5,  // true = Over 2.5, false = Under 2.5
    };
  }

  // ────────────────────────────────────────────────────────────────
  // CÁLCULO DA MÁXIMA
  // ────────────────────────────────────────────────────────────────

  function calculateMaximaForTeam(games, market) {
    // games: array de jogos do time, já filtrados e ordenados por data
    // market: 'over' ou 'under'
    //
    // Retorna a maior sequência de jogos consecutivos em que o
    // mercado NÃO aconteceu.

    if (games.length === 0) return 0;

    let maxSequence = 0;
    let currentSequence = 0;

    games.forEach(game => {
      const result = getMarketResult(game.resultado || game.placar);
      if (!result) return; // pula jogos sem resultado

      const marketHappened = market === 'over' ? result.isOver : !result.isOver;

      if (!marketHappened) {
        // Mercado NÃO aconteceu, incrementa a sequência
        currentSequence++;
        maxSequence = Math.max(maxSequence, currentSequence);
      } else {
        // Mercado aconteceu, reseta a sequência
        currentSequence = 0;
      }
    });

    return maxSequence;
  }

  // ────────────────────────────────────────────────────────────────
  // BUSCA E PROCESSAMENTO DE DADOS
  // ────────────────────────────────────────────────────────────────

  async function processRanking(liga, periodo, mercado) {
    const loading = document.getElementById('loadingIndicator');
    if (loading) loading.style.display = 'flex';

    try {
      // Busca os resultados da liga
      const url = ROTAS_API.resultados(liga);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const allGames = await response.json();

      // Filtra por período
      const { start, end } = getTimeRangeForHours(periodo);
      const filteredGames = Array.isArray(allGames)
        ? allGames.filter(g => isWithinRange(g.data || g.date, start, end))
        : [];

      // Agrupa jogos por time
      const teamGames = {};

      filteredGames.forEach(game => {
        const home = (game.time_casa || game.team_home || '').trim();
        const away = (game.time_visitante || game.team_visit || '').trim();

        if (!home || !away) return;

        // Inicializa arrays se não existem
        if (!teamGames[home]) teamGames[home] = [];
        if (!teamGames[away]) teamGames[away] = [];

        // Adiciona o jogo aos dois times (tanto como mandante quanto visitante)
        teamGames[home].push(game);
        teamGames[away].push(game);
      });

      // Calcula a máxima para cada time
      const ranking = Object.entries(teamGames)
        .map(([team, games]) => {
          // Ordena por data
          games.sort((a, b) => {
            const dateA = parseDate(a.data || a.date) || new Date(0);
            const dateB = parseDate(b.data || b.date) || new Date(0);
            return dateA - dateB;
          });

          const maxima = calculateMaximaForTeam(games, mercado);
          return { team, maxima, gameCount: games.length };
        })
        .filter(r => r.gameCount > 0)
        .sort((a, b) => b.maxima - a.maxima);

      rankingData = ranking;
      renderRanking(ranking);
    } catch (error) {
      console.error('[RankingMaxima] Erro ao processar ranking:', error);
      showError('Erro ao carregar dados. Tente novamente.');
    } finally {
      if (loading) loading.style.display = 'none';
    }
  }

  // ────────────────────────────────────────────────────────────────
  // RENDERIZAÇÃO
  // ────────────────────────────────────────────────────────────────

  function renderRanking(ranking) {
    const tbody = document.getElementById('rankingBody');
    tbody.innerHTML = '';

    if (ranking.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="3" class="empty-state">
            <div class="empty-state-icon">📭</div>
            <div class="empty-state-text">Nenhum jogo encontrado neste período</div>
          </td>
        </tr>
      `;
      return;
    }

    ranking.forEach((item, index) => {
      const pos = index + 1;
      const isTop3 = pos <= 3;
      const badge = getPosBadge(pos);

      const row = document.createElement('tr');
      if (isTop3) row.classList.add('top-3');

      row.innerHTML = `
        <td>
          <div class="pos-badge ${badge.class}">${badge.icon}</div>
        </td>
        <td><span class="team-name">${escapeHtml(item.team)}</span></td>
        <td><div class="maxima-value">${item.maxima}</div></td>
      `;

      tbody.appendChild(row);
    });
  }

  function getPosBadge(pos) {
    switch (pos) {
      case 1:
        return { icon: '🥇', class: 'top-1' };
      case 2:
        return { icon: '🥈', class: 'top-2' };
      case 3:
        return { icon: '🥉', class: 'top-3' };
      default:
        return { icon: pos.toString(), class: '' };
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function showError(message) {
    const tbody = document.getElementById('rankingBody');
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <div class="empty-state-text">${escapeHtml(message)}</div>
        </td>
      </tr>
    `;
  }

  // ────────────────────────────────────────────────────────────────
  // SELETORES E EVENTOS
  // ────────────────────────────────────────────────────────────────

  function getCasasUnicas() {
    const casas = new Set();
    Object.values(LIGAS_INFO).forEach(liga => {
      casas.add(liga.casa);
    });
    return Array.from(casas).sort();
  }

  function getLigasByCasa(casa) {
    return Object.entries(LIGAS_INFO)
      .filter(([_, liga]) => liga.casa === casa)
      .map(([key, liga]) => ({ key, ...liga }));
  }

  function initCasaSelect() {
    const select = document.getElementById('casaSelect');
    const casas = getCasasUnicas();

    casas.forEach(casa => {
      const opt = document.createElement('option');
      opt.value = casa;
      opt.textContent = casa;
      select.appendChild(opt);
    });

    select.addEventListener('change', (e) => {
      currentCasa = e.target.value;
      updateLigaSelect();
      salvarFiltros();
    });
  }

  function updateLigaSelect() {
    const ligaSelect = document.getElementById('ligaSelect');
    ligaSelect.innerHTML = '<option value="">Selecionar...</option>';

    if (!currentCasa) return;

    const ligas = getLigasByCasa(currentCasa);
    ligas.forEach(liga => {
      const opt = document.createElement('option');
      opt.value = liga.key;
      opt.textContent = liga.nomeExibicao;
      ligaSelect.appendChild(opt);
    });
  }

  function initLigaSelect() {
    const select = document.getElementById('ligaSelect');
    select.addEventListener('change', (e) => {
      currentLiga = e.target.value;
      if (currentLiga) {
        procesarRanking();
      }
      salvarFiltros();
    });
  }

  function initPeriodoSelect() {
    const select = document.getElementById('periodoSelect');
    select.addEventListener('change', (e) => {
      currentPeriodo = parseInt(e.target.value, 10);
      if (currentLiga) {
        procesarRanking();
      }
      salvarFiltros();
    });
  }

  function initMercadoSelect() {
    const select = document.getElementById('mercadoSelect');
    select.addEventListener('change', (e) => {
      currentMercado = e.target.value;
      if (currentLiga) {
        procesarRanking();
      }
      salvarFiltros();
    });
  }

  function procesarRanking() {
    if (!currentLiga) return;
    processRanking(currentLiga, currentPeriodo, currentMercado);
  }

  // ────────────────────────────────────────────────────────────────
  // SALVAMENTO DE FILTROS (localStorage)
  // ────────────────────────────────────────────────────────────────

  function salvarFiltros() {
    const filtros = {
      casa: currentCasa,
      liga: currentLiga,
      periodo: currentPeriodo,
      mercado: currentMercado,
    };
    localStorage.setItem('rankingMaximaFiltros', JSON.stringify(filtros));
  }

  function restaurarFiltros() {
    const saved = localStorage.getItem('rankingMaximaFiltros');
    if (!saved) return false;

    try {
      const filtros = JSON.parse(saved);
      currentCasa = filtros.casa || null;
      currentLiga = filtros.liga || null;
      currentPeriodo = filtros.periodo || 72;
      currentMercado = filtros.mercado || 'over';

      document.getElementById('casaSelect').value = currentCasa || '';
      document.getElementById('ligaSelect').value = currentLiga || '';
      document.getElementById('periodoSelect').value = currentPeriodo;
      document.getElementById('mercadoSelect').value = currentMercado;

      if (currentCasa) {
        updateLigaSelect();
      }

      if (currentLiga) {
        procesarRanking();
      }

      return true;
    } catch (e) {
      console.error('[RankingMaxima] Erro ao restaurar filtros:', e);
      return false;
    }
  }

  // ────────────────────────────────────────────────────────────────
  // INICIALIZAÇÃO
  // ────────────────────────────────────────────────────────────────

  function init() {
    initCasaSelect();
    initLigaSelect();
    initPeriodoSelect();
    initMercadoSelect();
    restaurarFiltros();

    // Inicializa cards de navegação (mesmo padrão das outras páginas)
    if (typeof inicializarLigaAtual === 'function') {
      inicializarLigaAtual();
    }
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    init,
    processRanking,
    // Debug
    _getCurrentState: () => ({
      casa: currentCasa,
      liga: currentLiga,
      periodo: currentPeriodo,
      mercado: currentMercado,
      ranking: rankingData,
    }),
  };
})();
