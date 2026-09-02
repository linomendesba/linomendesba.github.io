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
  let currentPeriodo = 1440; // quantidade de jogos a analisar (não é minuto!)
  let currentPeriodoIndex = 5; // posição no seletor: 0=3h ... 5=72h
  let currentMercado = 'over25';
  let currentMinJogos = 0; // 0 = sem mínimo
  let searchQuery = ''; // filtro de busca por nome de time (só na tabela completa)
  let rankingOrderDir = 'desc'; // desc = maiores, asc = menores
  let rankingData = [];
  let allGamesForPeriod = []; // Guarda todos os jogos do período pra análise
  let latestGameTime = null;
  let gamesAnalyzedCount = 0;

  // Cache dos jogos brutos por liga, pra não refazer o fetch na API toda
  // vez que só o período/mercado/mínimo de jogos muda — só quando a
  // liga selecionada é diferente da última buscada.
  let gamesCache = { liga: null, games: [], loaded: false };

  // ────────────────────────────────────────────────────────────────
  // CONFIG DO SELETOR DE PERÍODO
  // ────────────────────────────────────────────────────────────────
  // O seletor de "horas" na verdade representa uma quantidade fixa de
  // jogos (as ligas virtuais rodam em intervalos fixos, então cada
  // janela de tempo corresponde a um número de jogos). A Kiron tem um
  // ritmo de jogos diferente das demais casas, por isso usa outra
  // tabela de valores para os mesmos rótulos.

  const PERIODO_LABELS = ['3 Horas', '6 Horas', '12 Horas', '24 Horas', '48 Horas', '72 Horas'];
  const PERIODO_VALUES_PADRAO = [60, 120, 240, 480, 960, 1440];
  const PERIODO_VALUES_KIRON = [90, 180, 360, 720, 1440, 2160];

  function isKiron(casa) {
    return (casa || '').trim().toUpperCase() === 'KIRON';
  }

  function populatePeriodoSelect(casa) {
    const select = document.getElementById('periodoSelect');
    if (!select) return;

    const valores = isKiron(casa) ? PERIODO_VALUES_KIRON : PERIODO_VALUES_PADRAO;

    select.innerHTML = '';
    PERIODO_LABELS.forEach((label, idx) => {
      const opt = document.createElement('option');
      opt.value = valores[idx];
      opt.textContent = label;
      select.appendChild(opt);
    });

    // Mantém a mesma posição selecionada (ex.: "72 Horas"), já que os
    // valores mudam entre Kiron e as demais casas, mas os rótulos não.
    select.selectedIndex = currentPeriodoIndex;
    currentPeriodo = valores[currentPeriodoIndex];
  }

  // ────────────────────────────────────────────────────────────────
  // UTILIDADES DE DATA
  // ────────────────────────────────────────────────────────────────

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

  // ────────────────────────────────────────────────────────────────
  // DETECÇÃO DO RESULTADO E DOS MERCADOS
  // ────────────────────────────────────────────────────────────────

  function getMatchGoals(result) {
    // result pode ser um objeto { placar: "X X Y" } ou um número/string
    let placar = result;

    if (typeof result === 'object' && result !== null) {
      placar = result.placar || result.score || result.resultado || '';
    }

    if (typeof placar !== 'string') {
      placar = String(placar || '0 0 0');
    }

    // Extrai os gols: "3 x 2" → golsCasa=3, golsFora=2
    const match = placar.match(/(\d+)\s*[xX×]\s*(\d+)/);
    if (!match) return null;

    const golsCasa = parseInt(match[1], 10);
    const golsFora = parseInt(match[2], 10);

    return {
      golsCasa,
      golsFora,
      totalGols: golsCasa + golsFora,
    };
  }

  // Cada chave é o value usado no <select id="mercadoSelect"> do HTML.
  // A função retorna true se o mercado ACONTECEU naquele jogo.
  const MARKET_HANDLERS = {
    casa: (g) => g.golsCasa > g.golsFora,
    fora: (g) => g.golsFora > g.golsCasa,
    empate: (g) => g.golsCasa === g.golsFora,
    btts_sim: (g) => g.golsCasa > 0 && g.golsFora > 0,
    btts_nao: (g) => !(g.golsCasa > 0 && g.golsFora > 0),
    over15: (g) => g.totalGols > 1.5,
    over25: (g) => g.totalGols > 2.5,
    over35: (g) => g.totalGols > 3.5,
    over5: (g) => g.totalGols >= 5,
    under15: (g) => g.totalGols < 1.5,
    under25: (g) => g.totalGols < 2.5,
    under35: (g) => g.totalGols < 3.5,
  };

  function marketHappened(marketKey, goals) {
    const handler = MARKET_HANDLERS[marketKey];
    if (!handler) {
      console.warn('[RankingMaxima] Mercado desconhecido:', marketKey);
      return false;
    }
    return handler(goals);
  }

  // ────────────────────────────────────────────────────────────────
  // CÁLCULO DA MÁXIMA
  // ────────────────────────────────────────────────────────────────

  function calculateMaximaForTeam(games, market) {
    // games: array de jogos do time, já filtrados e ordenados por data
    // market: uma das chaves de MARKET_HANDLERS
    //
    // Retorna a maior sequência de jogos consecutivos em que o
    // mercado NÃO aconteceu.

    if (games.length === 0) return 0;

    let maxSequence = 0;
    let currentSequence = 0;

    games.forEach(game => {
      const goals = getMatchGoals(game.ft || game.resultado || game.placar);
      if (!goals) return; // pula jogos sem resultado

      if (!marketHappened(market, goals)) {
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

  function calculateCurrentStreakForTeam(games, market) {
    // games: array de jogos do time, já ordenados cronologicamente
    // (do mais antigo pro mais recente).
    //
    // Retorna a sequência ATUAL: quantos jogos seguidos, contando a
    // partir do jogo mais recente pra trás, o mercado não aconteceu.
    // Para assim que encontrar um jogo em que o mercado aconteceu.

    let streak = 0;

    for (let i = games.length - 1; i >= 0; i--) {
      const goals = getMatchGoals(games[i].ft || games[i].resultado || games[i].placar);
      if (!goals) continue; // pula jogos sem resultado, sem quebrar a sequência

      if (!marketHappened(market, goals)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // ────────────────────────────────────────────────────────────────
  // BUSCA (COM CACHE) E PROCESSAMENTO DE DADOS
  // ────────────────────────────────────────────────────────────────

  async function fetchGamesForLiga(liga) {
    // Reaproveita os jogos já buscados se a liga não mudou — troca de
    // período, mercado ou mínimo de jogos não precisa de nova chamada
    // à API, só de recalcular em cima dos mesmos dados.
    if (gamesCache.loaded && gamesCache.liga === liga) {
      console.log('[RankingMaxima] Usando cache de jogos para', liga);
      return gamesCache.games;
    }

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

    gamesCache = { liga, games: allGames, loaded: true };
    return allGames;
  }

  function computeRanking(allGames, periodo, mercado, minJogos) {
    // "periodo" representa a quantidade de jogos a analisar (não minutos).
    // Ordena todos os jogos do mais recente para o mais antigo e pega
    // os N primeiros, onde N = periodo selecionado.
    const sortedByDateDesc = [...allGames].sort((a, b) => {
      const dateA = parseDate(a.data || a.date) || new Date(0);
      const dateB = parseDate(b.data || b.date) || new Date(0);
      return dateB - dateA;
    });

    const filteredGames = sortedByDateDesc.slice(0, periodo);

    console.log('[RankingMaxima] Jogos selecionados no período:', filteredGames.length, 'de', periodo, 'solicitados');

    // O jogo mais recente é o primeiro após a ordenação desc
    const mostRecentGame = filteredGames[0] || null;
    const mostRecentDate = mostRecentGame ? parseDate(mostRecentGame.data || mostRecentGame.date) : null;

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

    // Calcula a máxima e a sequência atual para cada time
    const ranking = Object.entries(teamGames)
      .map(([team, games]) => {
        // Ordena por data
        games.sort((a, b) => {
          const dateA = parseDate(a.data || a.date) || new Date(0);
          const dateB = parseDate(b.data || b.date) || new Date(0);
          return dateA - dateB;
        });

        const maxima = calculateMaximaForTeam(games, mercado);
        const streakAtual = calculateCurrentStreakForTeam(games, mercado);
        return { team, maxima, streakAtual, gameCount: games.length, games };
      })
      .filter(r => r.gameCount > 0 && r.gameCount >= minJogos);

    // Reseta sorting para padrão (máxima desc)
    sortBy = 'maxima';
    sortDir = 'desc';

    console.log('[RankingMaxima] Ranking final:', ranking);

    return ranking;
  }

  async function processRanking(liga, periodo, mercado, minJogos) {
    const loading = document.getElementById('loadingIndicator');
    const precisaBuscar = !gamesCache.loaded || gamesCache.liga !== liga;
    if (precisaBuscar && loading) loading.style.display = 'flex';

    try {
      const allGames = await fetchGamesForLiga(liga);
      const ranking = computeRanking(allGames, periodo, mercado, minJogos);

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
      } else if (sortBy === 'streak') {
        aVal = a.streakAtual;
        bVal = b.streakAtual;
      }

      if (typeof aVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      } else {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
    });

    return sorted;
  }

  function applySearchFilter(data) {
    if (!searchQuery) return data;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return data;
    return data.filter(item => item.team.toLowerCase().includes(q));
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
          <td colspan="4" class="empty-state">
            <div class="empty-state-icon">📭</div>
            <div class="empty-state-text">Nenhum jogo encontrado neste período</div>
          </td>
        </tr>
      `;
      renderTop5Cards();
      return;
    }

    const filtered = applySearchFilter(ranking);

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="empty-state">
            <div class="empty-state-icon">🔍</div>
            <div class="empty-state-text">Nenhum time encontrado para "${escapeHtml(searchQuery)}"</div>
          </td>
        </tr>
      `;
      updateSortIndicators();
      renderTop5Cards();
      return;
    }

    const sorted = applySorting(filtered);

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
        <td><div class="streak-value">${item.streakAtual}</div></td>
      `;

      tbody.appendChild(row);
    });

    updateSortIndicators();
    renderTop5Cards();
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
      renderTop5LineChart([]);
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
            <div class="top5-streak">Seq. atual: ${item.streakAtual}</div>
          </div>
        `;
      })
      .join('');

    section.style.display = 'block';
    renderTop5LineChart(top5);
  }

  // ────────────────────────────────────────────────────────────────
  // GRÁFICO DE SEQUÊNCIA VISUAL (TOP 5)
  // ────────────────────────────────────────────────────────────────
  // Um "walk" acumulado por time: cada jogo soma +1 se o mercado
  // selecionado bateu naquele jogo, ou -1 se não bateu. O resultado é
  // uma linha que sobe em trechos de mercado batendo e desce em
  // trechos de seca — visualmente parecido com um Renko, mas em cima
  // dos mesmos jogos que já entram no cálculo da máxima.

  let top5ChartInstance = null;
  const TOP5_CHART_COLORS = ['#e6a817', '#c0c0c0', '#cd7f32', '#177b8e', '#2ecc71'];

  function formatGameTime(game) {
    // Pega a hora:minuto direto da string bruta (regex), em vez de
    // depender do parseDate (que não trata a parte de horário em
    // todos os formatos) — funciona tanto com ISO ("...T14:35:00")
    // quanto com "DD/MM/AAAA HH:mm" ou variações parecidas.
    const raw = String(game.data || game.date || game.hora || '');
    const match = raw.match(/(\d{1,2}):(\d{2})/);
    if (!match) return null;
    return `${match[1].padStart(2, '0')}:${match[2]}`;
  }

  function buildWalkSeries(games, market) {
    let cumulative = 0;
    const points = [{ x: 0, y: 0, t: null }]; // ponto inicial, antes do primeiro jogo

    games.forEach(game => {
      const goals = getMatchGoals(game.ft || game.resultado || game.placar);
      if (!goals) return; // pula jogos sem resultado, sem quebrar a linha

      cumulative += marketHappened(market, goals) ? 1 : -1;
      points.push({ x: points.length, y: cumulative, t: formatGameTime(game) });
    });

    return points;
  }

  function renderTop5LineChart(top5) {
    const section = document.getElementById('top5ChartSection');
    const canvas = document.getElementById('top5LineChart');
    if (!section || !canvas) return;

    if (!top5 || top5.length === 0 || typeof Chart === 'undefined') {
      section.style.display = 'none';
      if (top5ChartInstance) {
        top5ChartInstance.destroy();
        top5ChartInstance = null;
      }
      return;
    }

    const datasets = top5.map((item, idx) => ({
      label: item.team,
      data: buildWalkSeries(item.games || [], currentMercado),
      borderColor: TOP5_CHART_COLORS[idx],
      backgroundColor: 'transparent',
      borderWidth: 2,
      pointRadius: 2,
      pointHoverRadius: 4,
      tension: 0.15,
      hidden: idx !== 0, // por padrão só o 1º lugar vem ligado; os outros ficam na legenda pra ativar clicando
    }));

    if (top5ChartInstance) {
      top5ChartInstance.destroy();
    }

    // Precisa mostrar a seção ANTES de criar o Chart: se o container
    // ainda estiver com display:none, o Chart.js mede o canvas com
    // largura/altura zero e o gráfico fica em branco mesmo depois de
    // exibir a seção.
    section.style.display = 'block';

    top5ChartInstance = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'nearest', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#e4e8f0', font: { family: 'DM Sans', size: 11 }, boxWidth: 12 },
          },
          tooltip: {
            callbacks: {
              title: (items) => {
                const raw = items[0].raw;
                const hora = raw && raw.t;
                return hora ? `Jogo ${items[0].parsed.x} · ${hora}` : `Jogo ${items[0].parsed.x}`;
              },
              label: (item) => `${item.dataset.label}: ${item.parsed.y > 0 ? '+' : ''}${item.parsed.y}`,
            },
          },
        },
        scales: {
          x: {
            type: 'linear',
            title: { display: true, text: 'Jogos', color: '#7a8499' },
            ticks: { stepSize: 1, color: '#7a8499', precision: 0 },
            grid: { color: 'rgba(255,255,255,0.05)' },
          },
          y: {
            title: { display: true, text: 'Sequência acumulada', color: '#7a8499' },
            ticks: { stepSize: 1, color: '#7a8499', precision: 0 },
            grid: { color: 'rgba(255,255,255,0.05)' },
          },
        },
      },
    });
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
        <td colspan="4" class="empty-state">
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
      populatePeriodoSelect(currentCasa);
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
      searchQuery = '';
      const buscaInput = document.getElementById('buscaTimeInput');
      if (buscaInput) buscaInput.value = '';
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
      currentPeriodoIndex = select.selectedIndex;
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

  function initMinJogosSelect() {
    const select = document.getElementById('minJogosSelect');
    if (!select) return;
    select.addEventListener('change', (e) => {
      currentMinJogos = parseInt(e.target.value, 10) || 0;
      if (currentLiga) {
        procesarRanking();
      }
      salvarFiltros();
    });
  }

  function initBuscaInput() {
    const input = document.getElementById('buscaTimeInput');
    if (!input) return;
    input.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderRanking(rankingData);
    });
  }

  function procesarRanking() {
    if (!currentLiga) return;
    processRanking(currentLiga, currentPeriodo, currentMercado, currentMinJogos);
  }

  // ────────────────────────────────────────────────────────────────
  // SALVAMENTO DE FILTROS (localStorage)
  // ────────────────────────────────────────────────────────────────

  function salvarFiltros() {
    const filtros = {
      casa: currentCasa,
      liga: currentLiga,
      periodoIndex: currentPeriodoIndex,
      mercado: currentMercado,
      minJogos: currentMinJogos,
      rankingOrder: rankingOrderDir,
    };
    localStorage.setItem('rankingMaximaFiltros', JSON.stringify(filtros));
  }

  // Compatibilidade com filtros salvos antes da expansão de mercados
  // (quando só existia 'over' e 'under', equivalentes a Over/Under 2.5).
  function migrarMercadoAntigo(mercado) {
    if (mercado === 'over') return 'over25';
    if (mercado === 'under') return 'under25';
    return mercado;
  }

  function restaurarFiltros() {
    const saved = localStorage.getItem('rankingMaximaFiltros');
    if (!saved) return false;

    try {
      const filtros = JSON.parse(saved);
      currentCasa = filtros.casa || null;
      currentLiga = filtros.liga || null;
      currentPeriodoIndex = typeof filtros.periodoIndex === 'number' ? filtros.periodoIndex : 5;
      currentMercado = migrarMercadoAntigo(filtros.mercado) || 'over25';
      currentMinJogos = typeof filtros.minJogos === 'number' ? filtros.minJogos : 0;
      rankingOrderDir = filtros.rankingOrder || 'desc';

      document.getElementById('casaSelect').value = currentCasa || '';
      document.getElementById('ligaSelect').value = currentLiga || '';
      populatePeriodoSelect(currentCasa); // define currentPeriodo com o valor certo pra essa casa
      document.getElementById('mercadoSelect').value = currentMercado;
      const minJogosSelect = document.getElementById('minJogosSelect');
      if (minJogosSelect) minJogosSelect.value = currentMinJogos;
      document.getElementById('rankingOrderSelect').value = rankingOrderDir;

      if (currentCasa) {
        updateLigaSelect();
        document.getElementById('ligaSelect').value = currentLiga || '';
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
    populatePeriodoSelect(currentCasa); // garante os valores certos (Kiron vs demais) antes de qualquer interação
    initPeriodoSelect();
    initMercadoSelect();
    initMinJogosSelect();
    initBuscaInput();
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
      minJogos: currentMinJogos,
      searchQuery,
      rankingOrderDir,
      ranking: rankingData,
      latestGameTime,
      gamesAnalyzedCount,
      cache: { liga: gamesCache.liga, totalJogos: gamesCache.games.length },
    }),
  };
})();