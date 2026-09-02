// ranking-maxima.js
// ────────────────────────────────────────────────────────────────
// Calcula a máxima (maior sequência de jogos sem um mercado)
// para cada time dentro de um período selecionado.
// ────────────────────────────────────────────────────────────────

console.log('[RankingMaxima] Script carregado');
console.log('[RankingMaxima] ROTAS_API existe?', typeof ROTAS_API);
console.log('[RankingMaxima] LIGAS_INFO existe?', typeof LIGAS_INFO);

const RankingMaxima = (() => {
  console.log('[RankingMaxima] Inicializando módulo');
  // Estados
  let currentCasa = null;
  let currentLiga = null;
  let currentPeriodo = 1440; // minutos (72 horas)
  let currentMercado = 'over';
  let rankingOrderDir = 'desc'; // desc = maiores, asc = menores
  let rankingData = [];
  let allGamesForPeriod = []; // Guarda todos os jogos do período pra análise
  let latestGameTime = null;
  let gamesAnalyzedCount = 0;

  // ────────────────────────────────────────────────────────────────
  // UTILIDADES DE DATA
  // ────────────────────────────────────────────────────────────────

  function getTimeRangeForMinutes(minutes) {
    const now = new Date();
    const start = new Date(now.getTime() - minutes * 60 * 1000);
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
      const result = getMarketResult(game.ft || game.resultado || game.placar);
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
      console.log('[RankingMaxima] Buscando:', url);
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} em ${url}`);
      }

      let allGames = await response.json();
      console.log('[RankingMaxima] Dados brutos recebidos:', allGames);

      // Garante que é um array
      if (!Array.isArray(allGames)) {
        if (allGames && typeof allGames === 'object') {
          // Se é um objeto, tenta extrair um array de dentro
          allGames = Object.values(allGames).find(v => Array.isArray(v)) || [];
        } else {
          allGames = [];
        }
      }

      console.log('[RankingMaxima] Total de jogos:', allGames.length);

      // Filtra por período
      const { start, end } = getTimeRangeForMinutes(periodo);
      const filteredGames = allGames.filter(g => isWithinRange(g.data || g.date, start, end));

      console.log('[RankingMaxima] Jogos no período:', filteredGames.length);

      // Encontra o jogo mais recente
      let mostRecentGame = null;
      let mostRecentDate = null;

      filteredGames.forEach(game => {
        const gameDate = parseDate(game.data || game.date);
        if (gameDate && (!mostRecentDate || gameDate > mostRecentDate)) {
          mostRecentDate = gameDate;
          mostRecentGame = game;
        }
      });

      if (mostRecentGame && mostRecentDate) {
        latestGameTime = mostRecentDate.toLocaleString('pt-BR', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        gamesAnalyzedCount = filteredGames.length;
        console.log('[RankingMaxima] Jogo mais recente:', latestGameTime, 'Total:', gamesAnalyzedCount);
      }

      allGamesForPeriod = filteredGames;

      // Agrupa jogos por time
      const teamGames = {};

      filteredGames.forEach((game, idx) => {
        // Tenta vários nomes de campo
        const home = (game.time_a || game.time_casa || game.team_home || '').trim();
        const away = (game.time_b || game.time_visitante || game.team_visit || '').trim();
        const resultado = game.ft || game.resultado || game.placar || '';

        if (!home || !away) {
          console.warn(`[RankingMaxima] Jogo ${idx} sem times:`, game);
          return;
        }

        if (!resultado) {
          console.warn(`[RankingMaxima] Jogo ${idx} sem resultado:`, { home, away });
          return;
        }

        // Inicializa arrays se não existem
        if (!teamGames[home]) teamGames[home] = [];
        if (!teamGames[away]) teamGames[away] = [];

        // Adiciona o jogo aos dois times
        teamGames[home].push(game);
        teamGames[away].push(game);
      });

      console.log('[RankingMaxima] Times únicos encontrados:', Object.keys(teamGames).length);

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
        .filter(r => r.gameCount > 0);

      // Reseta sorting para padrão (máxima desc)
      sortBy = 'maxima';
      sortDir = 'desc';

      console.log('[RankingMaxima] Ranking final:', ranking);

      rankingData = ranking;
      renderRanking(ranking);
    } catch (error) {
      console.error('[RankingMaxima] Erro ao processar ranking:', error);
      showError('Erro ao carregar dados. Verifique o console para detalhes.');
    } finally {
      if (loading) loading.style.display = 'none';
    }
  }

  // ────────────────────────────────────────────────────────────────
  // SORTING
  // ────────────────────────────────────────────────────────────────

  let sortBy = 'maxima';
  let sortDir = 'desc';

  function applySorting(data) {
    const sorted = [...data];

    sorted.sort((a, b) => {
      let aVal, bVal;

      if (sortBy === 'maxima') {
        aVal = a.maxima;
        bVal = b.maxima;
      } else if (sortBy === 'team') {
        aVal = a.team.toLowerCase();
        bVal = b.team.toLowerCase();
      } else if (sortBy === 'games') {
        aVal = a.gameCount;
        bVal = b.gameCount;
      }

      if (typeof aVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      } else {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
    });

    return sorted;
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

    const sorted = applySorting(ranking);

    sorted.forEach((item, index) => {
      const pos = index + 1;
      const isTop3 = pos <= 3;
      const badge = getPosBadge(pos);

      const row = document.createElement('tr');
      if (isTop3) row.classList.add(`top-${pos}`);

      row.innerHTML = `
        <td style="text-align: center;">
          <div class="pos-badge ${badge.class}">${badge.icon}</div>
        </td>
        <td><span class="team-name">${escapeHtml(item.team)}</span></td>
        <td><div class="maxima-value">${item.maxima}</div></td>
      `;

      tbody.appendChild(row);
    });

    updateSortIndicators();
    renderTop5Cards();
    updatePeriodInfo();
  }

  function updateSortIndicators() {
    const headers = document.querySelectorAll('.ranking-table th');
    headers.forEach(h => {
      h.classList.remove('sort-asc', 'sort-desc');
      if (h.dataset.sort === sortBy) {
        h.classList.add(sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
      }
    });
  }

  function renderTop5Cards() {
    const container = document.getElementById('top5Grid');
    const section = document.getElementById('top5Section');
    
    if (!container || rankingData.length === 0) {
      if (section) section.style.display = 'none';
      return;
    }

    // Ordena conforme rankingOrderDir
    let sorted = [...rankingData];
    sorted.sort((a, b) => {
      return rankingOrderDir === 'desc' ? b.maxima - a.maxima : a.maxima - b.maxima;
    });

    const top5 = sorted.slice(0, 5);

    container.innerHTML = top5
      .map((item, idx) => {
        const pos = idx + 1;
        const badge = getPosBadge(pos);
        const rankClass = pos <= 3 ? `rank-${pos}` : '';

        return `
          <div class="top5-card ${rankClass}">
            <div class="top5-rank">${pos}º lugar</div>
            <div class="top5-badge">${badge.icon}</div>
            <div class="top5-name">${escapeHtml(item.team)}</div>
            <div class="top5-value">${item.maxima}</div>
            <div class="top5-label">Máxima</div>
          </div>
        `;
      })
      .join('');

    section.style.display = 'block';
  }

  function updatePeriodInfo() {
    const section = document.getElementById('periodInfo');
    if (!section) return;

    if (latestGameTime && gamesAnalyzedCount > 0) {
      document.getElementById('gamesAnalyzedCount').textContent = gamesAnalyzedCount;
      document.getElementById('latestGameTime').textContent = latestGameTime;
      section.style.display = 'flex';
    } else {
      section.style.display = 'none';
    }
  }

  function setupSortHeaders() {
    const headers = document.querySelectorAll('.ranking-table th.sortable');
    headers.forEach(h => {
      h.addEventListener('click', () => {
        const newSort = h.dataset.sort;
        if (sortBy === newSort) {
          sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          sortBy = newSort;
          sortDir = 'desc';
        }
        renderRanking(rankingData);
      });
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
    console.log('[RankingMaxima] getCasasUnicas chamado');
    if (typeof LIGAS_INFO === 'undefined') {
      console.error('[RankingMaxima] LIGAS_INFO não está definido!');
      return [];
    }
    const casas = new Set();
    Object.values(LIGAS_INFO).forEach(liga => {
      casas.add(liga.casa);
    });
    const resultado = Array.from(casas).sort();
    console.log('[RankingMaxima] Casas únicas:', resultado);
    return resultado;
  }

  function getLigasByCasa(casa) {
    return Object.entries(LIGAS_INFO)
      .filter(([_, liga]) => liga.casa === casa)
      .map(([key, liga]) => ({ key, ...liga }));
  }

  function initCasaSelect() {
    console.log('[RankingMaxima] initCasaSelect chamado');
    const select = document.getElementById('casaSelect');
    if (!select) {
      console.error('[RankingMaxima] Elemento #casaSelect NÃO ENCONTRADO!');
      return;
    }
    const casas = getCasasUnicas();
    console.log('[RankingMaxima] Casas encontradas:', casas);

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

  function initRankingOrderSelect() {
    const select = document.getElementById('rankingOrderSelect');
    if (!select) return;
    select.addEventListener('change', (e) => {
      rankingOrderDir = e.target.value;
      renderTop5Cards();
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
      rankingOrder: rankingOrderDir,
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
      currentPeriodo = filtros.periodo || 1440;
      currentMercado = filtros.mercado || 'over';
      rankingOrderDir = filtros.rankingOrder || 'desc';

      document.getElementById('casaSelect').value = currentCasa || '';
      document.getElementById('ligaSelect').value = currentLiga || '';
      document.getElementById('periodoSelect').value = currentPeriodo;
      document.getElementById('mercadoSelect').value = currentMercado;
      document.getElementById('rankingOrderSelect').value = rankingOrderDir;

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
    console.log('[RankingMaxima] Init começando...');
    initCasaSelect();
    initLigaSelect();
    initPeriodoSelect();
    initMercadoSelect();
    initRankingOrderSelect();
    setupSortHeaders();
    restaurarFiltros();
    console.log('[RankingMaxima] Init concluído');
  }

  console.log('[RankingMaxima] Adicionando listener DOMContentLoaded');
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
      rankingOrderDir,
      ranking: rankingData,
      latestGameTime,
      gamesAnalyzedCount,
    }),
  };
})();