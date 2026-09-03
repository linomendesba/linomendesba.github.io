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
  let currentHoras = 72; // quantidade de HORAS selecionada (não jogos)
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

  // Cache dos PRÓXIMOS jogos (card "Próximos Confrontos"), por liga.
  // Independe de mercado/período/mínimo de jogos — só refaz o fetch
  // quando a liga muda.
  let proximosCache = { liga: null, jogos: [], loaded: false };

  // Times fixados manualmente no gráfico de sequência, além do Top 5,
  // digitados pelo usuário no campo de busca do gráfico. Guarda o nome
  // exatamente como aparece no ranking (não o que o usuário digitou).
  let pinnedTeams = [];

  // ────────────────────────────────────────────────────────────────
  // CONFIG DO SELETOR DE PERÍODO
  // ────────────────────────────────────────────────────────────────
  // O seletor guarda a quantidade de HORAS mesmo (3/6/12/24/48/72). A
  // quantidade de JOGOS correspondente é calculada em tempo real —
  // ver obterJogosPorHora() — porque cada liga/casa tem um ritmo
  // diferente de jogos por hora, então um número fixo de jogos não
  // representa a mesma janela de tempo em todo lugar.

  const PERIODO_LABELS = ['3 Horas', '6 Horas', '12 Horas', '24 Horas', '48 Horas', '72 Horas'];
  const PERIODO_HORAS = [3, 6, 12, 24, 48, 72];

  function populatePeriodoSelect() {
    const select = document.getElementById('periodoSelect');
    if (!select) return;

    select.innerHTML = '';
    PERIODO_LABELS.forEach((label, idx) => {
      const opt = document.createElement('option');
      opt.value = PERIODO_HORAS[idx];
      opt.textContent = label;
      select.appendChild(opt);
    });

    select.selectedIndex = currentPeriodoIndex;
    currentHoras = PERIODO_HORAS[currentPeriodoIndex];
  }

  // ────────────────────────────────────────────────────────────────
  // ORDEM CRONOLÓGICA DOS JOGOS
  // ────────────────────────────────────────────────────────────────
  // O campo "data" da API traz o dia certo, mas a hora embutida nele
  // não é confiável pros jogos virtuais — quem tem a hora real são os
  // campos separados "hora" e "minuto". Por isso a chave de ordenação
  // junta a PARTE DO DIA de "data" com "hora"/"minuto" reais, em vez
  // de usar "data" sozinho (impreciso) ou "id" sozinho (reflete ordem
  // de inserção no banco, que não é necessariamente a ordem real dos
  // jogos).

  function valorOrdenacao(game) {
    if (!game || !game.data) return null;

    const diaStr = String(game.data).includes('T') ? String(game.data).split('T')[0] : String(game.data);
    const hora = String(Number(game.hora) || 0).padStart(2, '0');
    const minuto = String(Number(game.minuto) || 0).padStart(2, '0');

    const t = new Date(`${diaStr}T${hora}:${minuto}:00`).getTime();
    return isNaN(t) ? null : t;
  }

  function normalizarOrdemCronologica(data) {
    if (!Array.isArray(data) || data.length < 2) return data;

    const comChave = data.map((jogo, i) => ({ jogo, i, v: valorOrdenacao(jogo) }));

    if (comChave.some(x => x.v === null)) {
      console.warn('[RankingMaxima] Não foi possível calcular data+hora de algum jogo. Mantendo ordem original da rota.');
      return data;
    }

    // Ordem ascendente (mais antigo -> mais recente); desempate estável
    // pelo índice original quando dois jogos caem no mesmo minuto exato.
    comChave.sort((a, b) => a.v - b.v || a.i - b.i);

    return comChave.map(x => x.jogo);
  }

  // ────────────────────────────────────────────────────────────────
  // DETECÇÃO AUTOMÁTICA DE JOGOS/HORA
  // ────────────────────────────────────────────────────────────────
  // Cada liga roda num ritmo diferente. Em vez de fixar um número,
  // agrupamos os jogos (já em ordem cronológica) pelo campo "hora"
  // real (0-23) e contamos quantos jogos caem em cada hora cheia. A
  // média dos grupos "fechados" (ignorando o primeiro e o último, que
  // podem estar cortados no meio) é o ritmo real da liga.

  function detectarJogosPorHora(data) {
    const FALLBACK = 20;
    if (!Array.isArray(data) || data.length < 10) return FALLBACK;

    const grupos = [];
    let chaveAtual = null;
    let contagemAtual = 0;

    data.forEach(jogo => {
      const hora = jogo ? jogo.hora : '?';
      const chave = String(hora);

      if (chave === chaveAtual) {
        contagemAtual++;
      } else {
        if (chaveAtual !== null) grupos.push(contagemAtual);
        chaveAtual = chave;
        contagemAtual = 1;
      }
    });
    if (contagemAtual > 0) grupos.push(contagemAtual);

    if (grupos.length < 3) {
      const soma = grupos.reduce((a, b) => a + b, 0);
      return grupos.length ? Math.max(1, Math.round(soma / grupos.length)) : FALLBACK;
    }

    // descarta o primeiro e o último grupo (podem vir incompletos)
    const gruposCompletos = grupos.slice(1, -1);
    const soma = gruposCompletos.reduce((a, b) => a + b, 0);
    const media = soma / gruposCompletos.length;

    return Math.max(1, Math.round(media));
  }

  // Fonte primária: se ligas-config.js definir, pra liga atual, um
  // array fixo "minutos" (os minutos exatos em que os jogos acontecem
  // dentro de cada hora), usamos o tamanho dele — é um dado estático
  // e conhecido, não precisa ser detectado em runtime. A detecção
  // heurística acima vira só um fallback pra liga não cadastrada.
  function obterJogosPorHora(data, liga) {
    if (typeof LIGAS_INFO !== 'undefined' && liga) {
      const info = LIGAS_INFO[liga];
      if (info && Array.isArray(info.minutos) && info.minutos.length > 0) {
        return info.minutos.length;
      }
    }
    return detectarJogosPorHora(data);
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

  // ────────────────────────────────────────────────────────────────
  // PRÓXIMOS CONFRONTOS
  // ────────────────────────────────────────────────────────────────
  // Usa a mesma rota /proximos/<liga> já usada na Central de Odds.
  // Se ROTAS_API.proximos existir (config.js), usa direto; senão,
  // deriva a URL a partir de ROTAS_API.resultados trocando o trecho
  // "/resultados/" por "/proximos/" (mesmo padrão de BASE da Central
  // de Odds: `${BASE}/proximos/${liga}`).
  function obterUrlProximos(liga) {
    if (typeof ROTAS_API !== 'undefined' && typeof ROTAS_API.proximos === 'function') {
      return ROTAS_API.proximos(liga);
    }
    if (typeof ROTAS_API !== 'undefined' && typeof ROTAS_API.resultados === 'function') {
      const urlResultados = ROTAS_API.resultados(liga);
      if (urlResultados && urlResultados.includes('/resultados/')) {
        return urlResultados.replace('/resultados/', '/proximos/');
      }
    }
    return null;
  }

  async function fetchProximos(liga) {
    if (proximosCache.loaded && proximosCache.liga === liga) {
      return proximosCache.jogos;
    }

    const url = obterUrlProximos(liga);
    if (!url) {
      console.warn('[RankingMaxima] Não foi possível montar a URL de /proximos/ para', liga);
      proximosCache = { liga, jogos: [], loaded: true };
      return [];
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status} em ${url}`);
      let jogos = await response.json();
      if (!Array.isArray(jogos)) jogos = [];
      proximosCache = { liga, jogos, loaded: true };
      return jogos;
    } catch (error) {
      console.error('[RankingMaxima] Erro ao carregar próximos confrontos:', error);
      proximosCache = { liga, jogos: [], loaded: true };
      return [];
    }
  }

  // "start_time" (ISO) é o formato mais comum em /proximos/; alguns
  // retornos já trazem um campo "time" (HH:MM) pronto.
  function extractTimeFromDateTime(str) {
    if (!str || isNaN(new Date(str))) return '--:--';
    const d = new Date(str);
    return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;
  }

  // Procura, no ranking já calculado, o time cujo nome bate (ignorando
  // acentos/maiúsculas) com o nome informado.
  function findRankingEntry(teamName) {
    if (!teamName) return null;
    const alvo = normalizeForSearch(teamName);
    return rankingData.find(r => normalizeForSearch(r.team) === alvo) || null;
  }

  function renderProximosConfrontos() {
    const section = document.getElementById('confrontosSection');
    const grid = document.getElementById('confrontosGrid');
    if (!section || !grid) return;

    const jogos = proximosCache.jogos || [];

    if (!currentLiga || jogos.length === 0 || rankingData.length === 0) {
      section.style.display = 'none';
      grid.innerHTML = '';
      return;
    }

    const cards = jogos.map(jogo => {
      const homeTeam = (jogo.team_home || jogo.time_casa || '').trim();
      const awayTeam = (jogo.team_visit || jogo.time_visitante || '').trim();
      if (!homeTeam || !awayTeam) return '';

      const hora = jogo.time || extractTimeFromDateTime(jogo.start_time);

      const homeEntry = findRankingEntry(homeTeam);
      const awayEntry = findRankingEntry(awayTeam);

      // "Quase máxima" = falta exatamente 1 jogo (sequência atual é a
      // máxima menos 1) pra igualar a maior sequência já vista.
      const homeQuase = !!(homeEntry && homeEntry.maxima > 0 && homeEntry.streakAtual === homeEntry.maxima - 1);
      const awayQuase = !!(awayEntry && awayEntry.maxima > 0 && awayEntry.streakAtual === awayEntry.maxima - 1);
      const isQuase = homeQuase || awayQuase;

      const flags = [];
      if (homeQuase) flags.push(`🔥 ${escapeHtml(homeTeam)} a 1 jogo da máxima (${homeEntry.streakAtual}/${homeEntry.maxima})`);
      if (awayQuase) flags.push(`🔥 ${escapeHtml(awayTeam)} a 1 jogo da máxima (${awayEntry.streakAtual}/${awayEntry.maxima})`);

      return `
        <div class="game-card ${isQuase ? 'quase-maxima' : ''}">
          <div class="gc-time">${escapeHtml(hora)}</div>
          <div class="gc-teams">
            <span class="gc-team ${homeQuase ? 'quase-team' : ''}">${escapeHtml(homeTeam)}</span>
            <span class="gc-vs">x</span>
            <span class="gc-team ${awayQuase ? 'quase-team' : ''}">${escapeHtml(awayTeam)}</span>
          </div>
          ${flags.map(f => `<div class="gc-flag">${f}</div>`).join('')}
        </div>
      `;
    }).filter(Boolean);

    grid.innerHTML = cards.length
      ? cards.join('')
      : '<div class="confrontos-empty">Nenhum confronto disponível no momento.</div>';

    section.style.display = 'block';
  }

  function computeRanking(allGames, liga, horas, mercado, minJogos) {
    // Normaliza a ordem cronológica de TODOS os jogos da liga (mais
    // antigo -> mais recente). Se não der pra confiar na data/hora de
    // algum jogo, normalizarOrdemCronologica devolve a ordem original
    // da API sem mexer (a API já entrega mais ou menos em ordem).
    const normalizados = normalizarOrdemCronologica(allGames);

    // Ritmo real de jogos/hora dessa liga — não é mais um número fixo
    // chutado, é calculado a partir da própria liga (ou detectado nos
    // dados caso a liga não tenha "minutos" configurado).
    const jogosPorHora = obterJogosPorHora(normalizados, liga);
    const totalJogosPeriodo = horas * jogosPorHora;

    // Pega os N jogos mais recentes (final do array, já que está em
    // ordem ascendente) — essa janela é da LIGA INTEIRA, com todos os
    // times misturados; o agrupamento por time acontece depois.
    const filteredGames = normalizados.slice(-totalJogosPeriodo);

    console.log('[RankingMaxima] Jogos/hora detectado:', jogosPorHora, '| Jogos selecionados no período:', filteredGames.length, 'de', totalJogosPeriodo, 'solicitados (', horas, 'h )');

    // O jogo mais recente é o último após a ordenação ascendente
    const mostRecentGame = filteredGames[filteredGames.length - 1] || null;

    if (mostRecentGame) {
      const horaLabel = formatGameTime(mostRecentGame);
      latestGameTime = horaLabel ? `${horaLabel} (id ${mostRecentGame.id})` : `id ${mostRecentGame.id}`;
      gamesAnalyzedCount = filteredGames.length;
      console.log('[RankingMaxima] Jogo mais recente:', latestGameTime, 'Total:', gamesAnalyzedCount);
    }

    allGamesForPeriod = filteredGames;

    // Agrupa jogos por time — como filteredGames já está em ordem
    // cronológica ascendente, os arrays por time saem naturalmente
    // ordenados também (sem precisar reordenar de novo).
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

  async function processRanking(liga, horas, mercado, minJogos) {
    const loading = document.getElementById('loadingIndicator');
    const precisaBuscar = !gamesCache.loaded || gamesCache.liga !== liga;
    if (precisaBuscar && loading) loading.style.display = 'flex';

    try {
      const allGames = await fetchGamesForLiga(liga);
      const ranking = computeRanking(allGames, liga, horas, mercado, minJogos);

      rankingData = ranking;
      renderRanking(ranking);

      // Próximos confrontos: não trava a renderização do ranking em si
      // se essa parte falhar (fetchProximos já trata os próprios erros).
      fetchProximos(liga).then(() => renderProximosConfrontos());
    } catch (error) {
      console.error('[RankingMaxima] Erro ao processar ranking:', error);
      showError('Erro ao carregar dados. Verifique o console para detalhes.');
      const confrontosSection = document.getElementById('confrontosSection');
      if (confrontosSection) confrontosSection.style.display = 'none';
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

    renderPinnedChips();

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

    // Times fixados manualmente (que ainda não estejam no Top 5) entram
    // como séries extras no gráfico, sempre visíveis por padrão.
    const extras = pinnedTeams
      .map(nome => findRankingEntry(nome))
      .filter(Boolean)
      .filter(item => !top5.some(t => t.team === item.team));

    const chartItems = [
      ...top5.map(item => ({ ...item, pinned: false })),
      ...extras.map(item => ({ ...item, pinned: true })),
    ];

    renderTop5LineChart(chartItems);
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
  // Cores extras pra times fixados manualmente (além do Top 5), num
  // ciclo próprio pra não repetir as cores do pódio.
  const PINNED_CHART_COLORS = ['#a78bfa', '#f472b6', '#38bdf8', '#fb923c', '#34d399', '#f87171'];
  const WALK_GREEN = '#2ecc71';
  const WALK_RED = '#e74c3c';
  const WALK_NEUTRAL = 'rgba(122,132,153,0.6)';

  function formatGameTime(game) {
    // "hora"/"minuto" são os campos confiáveis (hora do dia do jogo).
    // O campo "data" da API vem fixo/genérico pros jogos virtuais, não
    // dá pra confiar nele nem pra ordenação nem pra exibir horário.
    if (game.hora !== undefined && game.hora !== null && game.minuto !== undefined && game.minuto !== null) {
      const hh = String(game.hora).padStart(2, '0');
      const mm = String(game.minuto).padStart(2, '0');
      return `${hh}:${mm}`;
    }
    // Fallback pro formato antigo (string de data com hora embutida),
    // caso apareça algum jogo sem hora/minuto separados.
    const raw = String(game.data || game.date || '');
    const match = raw.match(/(\d{1,2}):(\d{2})/);
    if (!match) return null;
    return `${match[1].padStart(2, '0')}:${match[2]}`;
  }

  function buildWalkSeries(games, market) {
    let cumulative = 0;
    const points = [{ x: 0, y: 0, t: null }]; // ponto inicial, antes do primeiro jogo
    // Cor de cada ponto (verde = mercado bateu naquele jogo, vermelho =
    // não bateu), no mesmo espírito do grafico-mercado.js.
    const colors = [WALK_NEUTRAL];

    games.forEach(game => {
      const goals = getMatchGoals(game.ft || game.resultado || game.placar);
      if (!goals) return; // pula jogos sem resultado, sem quebrar a linha

      const bateu = marketHappened(market, goals);
      cumulative += bateu ? 1 : -1;
      points.push({ x: points.length, y: cumulative, t: formatGameTime(game) });
      colors.push(bateu ? WALK_GREEN : WALK_RED);
    });

    return { points, colors };
  }

  // ────────────────────────────────────────────────────────────────
  // PLUGIN — LINHA ATUAL
  // ────────────────────────────────────────────────────────────────
  // Desenha uma linha horizontal tracejada + badge no valor mais
  // recente de cada série visível — mesmo padrão usado no
  // grafico-mercado.js (linhaAtualPlugin).
  const linhaAtualPlugin = {
    id: 'linhaAtual',
    afterDraw(chart, args, opts) {
      const cfg = (opts && opts.enabled !== undefined)
        ? opts
        : ((chart.options.plugins && chart.options.plugins.linhaAtual) || {});
      if (cfg.enabled === false) return;

      const { ctx, chartArea, scales } = chart;
      if (!chartArea || !scales.y) return;

      const { left, right, top, bottom } = chartArea;
      const padX = 5, BAD_H = 18;
      const entries = [];

      chart.data.datasets.forEach((ds, i) => {
        if (!chart.isDatasetVisible(i)) return;
        const arr = ds.data;
        if (!arr || !arr.length) return;

        const ultimo = arr[arr.length - 1];
        const yVal = ultimo && typeof ultimo === 'object' ? ultimo.y : ultimo;
        if (yVal === null || yVal === undefined || !isFinite(yVal)) return;

        const yPx = scales.y.getPixelForValue(yVal);
        if (!isFinite(yPx) || yPx < top || yPx > bottom) return;

        entries.push({ yVal, yPx, color: ds.borderColor || '#fff' });
      });

      if (!entries.length) return;

      entries.sort((a, b) => a.yPx - b.yPx);
      for (let i = 1; i < entries.length; i++) {
        const prev = entries[i - 1], curr = entries[i];
        curr.badgeY = (curr.yPx - (prev.badgeY ?? prev.yPx) < BAD_H + 2)
          ? (prev.badgeY ?? prev.yPx) + BAD_H + 2
          : curr.yPx;
        if (i === 1) prev.badgeY = prev.badgeY ?? prev.yPx;
      }
      if (entries.length === 1) entries[0].badgeY = entries[0].yPx;

      entries.forEach(({ yVal, yPx, badgeY, color }) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(left, yPx);
        ctx.lineTo(right, yPx);
        ctx.stroke();
        ctx.setLineDash([]);

        const text = (yVal > 0 ? '+' : '') + yVal;
        ctx.font = "600 10.5px 'DM Mono', monospace";
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        const bw = Math.ceil(ctx.measureText(text).width) + padX * 2;
        const bx = right + 4, by = badgeY - BAD_H / 2, br = 4;

        ctx.fillStyle = 'rgba(13,16,26,0.96)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(bx, by, bw, BAD_H, br);
        } else {
          ctx.beginPath();
          ctx.rect(bx, by, bw, BAD_H);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.fillText(text, bx + padX, badgeY);
        ctx.restore();
      });
    },
  };

  function corParaItemChart(item, idx, totalTop5) {
    if (!item.pinned) return TOP5_CHART_COLORS[idx] || '#e4e8f0';
    const pinnedIdx = idx - totalTop5;
    return PINNED_CHART_COLORS[pinnedIdx % PINNED_CHART_COLORS.length];
  }

  function renderTop5LineChart(items) {
    const section = document.getElementById('top5ChartSection');
    const canvas = document.getElementById('top5LineChart');
    if (!section || !canvas) return;

    if (!items || items.length === 0 || typeof Chart === 'undefined') {
      section.style.display = 'none';
      if (top5ChartInstance) {
        top5ChartInstance.destroy();
        top5ChartInstance = null;
      }
      return;
    }

    const totalTop5 = items.filter(i => !i.pinned).length;

    const datasets = items.map((item, idx) => {
      const { points, colors } = buildWalkSeries(item.games || [], currentMercado);
      const cor = corParaItemChart(item, idx, totalTop5);

      return {
        label: item.pinned ? `${item.team} (fixado)` : item.team,
        data: points,
        borderColor: cor,
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        // Cada bolinha vem verde (mercado bateu) ou vermelha (não bateu)
        // naquele jogo específico — a linha em si mantém a cor do time.
        pointBackgroundColor: colors,
        pointBorderColor: 'rgba(8,11,20,0.9)',
        pointBorderWidth: 1,
        tension: 0.15,
        // Por padrão só o 1º lugar do Top 5 vem ligado (os outros ficam
        // na legenda pra ativar clicando); times fixados manualmente
        // pelo usuário sempre entram já visíveis.
        hidden: !item.pinned && idx !== 0,
      };
    });

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
        // Espaço extra à direita pros badges da "linha atual".
        layout: { padding: { right: 56 } },
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
          linhaAtual: { enabled: true },
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
      plugins: [linhaAtualPlugin],
    });
  }

  // ────────────────────────────────────────────────────────────────
  // TIME FIXADO NO GRÁFICO (campo de busca + chips removíveis)
  // ────────────────────────────────────────────────────────────────

  function addPinnedTeam(rawName) {
    const errorEl = document.getElementById('pinTeamError');
    const input = document.getElementById('pinTeamInput');
    if (errorEl) {
      errorEl.style.display = 'none';
      errorEl.textContent = '';
    }

    const nome = (rawName || '').trim();
    if (!nome) return;

    const entry = findRankingEntry(nome);
    if (!entry) {
      if (errorEl) {
        errorEl.textContent = `Time "${nome}" não encontrado no ranking atual (confira o nome ou os filtros aplicados).`;
        errorEl.style.display = 'block';
      }
      return;
    }

    const jaExiste = pinnedTeams.some(t => normalizeForSearch(t) === normalizeForSearch(entry.team));
    if (!jaExiste) {
      pinnedTeams.push(entry.team);
    }

    if (input) input.value = '';
    renderTop5Cards(); // reprocessa Top5 + regenera o gráfico já com o time fixado
  }

  function removePinnedTeam(teamName) {
    pinnedTeams = pinnedTeams.filter(t => normalizeForSearch(t) !== normalizeForSearch(teamName));
    renderTop5Cards();
  }

  function renderPinnedChips() {
    const list = document.getElementById('pinnedTeamsList');
    if (!list) return;

    list.innerHTML = pinnedTeams.map(team => `
      <div class="pinned-chip">
        <span>${escapeHtml(team)}</span>
        <button type="button" data-team="${escapeHtml(team)}" title="Remover do gráfico">✕</button>
      </div>
    `).join('');

    list.querySelectorAll('button[data-team]').forEach(btn => {
      btn.addEventListener('click', () => removePinnedTeam(btn.dataset.team));
    });
  }

  function initPinTeamControls() {
    const btn = document.getElementById('pinTeamBtn');
    const input = document.getElementById('pinTeamInput');
    if (!btn || !input) return;

    btn.addEventListener('click', () => addPinnedTeam(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addPinnedTeam(input.value);
      }
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

      // Times fixados e próximos confrontos são específicos da liga
      // anterior — reseta ao trocar de liga.
      pinnedTeams = [];
      proximosCache = { liga: null, jogos: [], loaded: false };
      renderPinnedChips();

      if (currentLiga) {
        procesarRanking();
      }
      salvarFiltros();
    });
  }

  function initPeriodoSelect() {
    const select = document.getElementById('periodoSelect');
    select.addEventListener('change', (e) => {
      currentHoras = parseInt(e.target.value, 10);
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
    processRanking(currentLiga, currentHoras, currentMercado, currentMinJogos);
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
      populatePeriodoSelect();
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
    populatePeriodoSelect();
    initPeriodoSelect();
    initMercadoSelect();
    initMinJogosSelect();
    initBuscaInput();
    initRankingOrderSelect();
    initPinTeamControls();
    setupSortHeaders();
    restaurarFiltros();
    console.log('[RankingMaxima] Init concluído');
  }

  console.log('[RankingMaxima] Adicionando listener DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', init);

  // ────────────────────────────────────────────────────────────────
  // DEBUG: investigar jogos de um time específico dentro do período
  // atualmente carregado. Roda no console: RankingMaxima._debugTeam('curacao')
  // ────────────────────────────────────────────────────────────────
  function normalizeForSearch(str) {
    return (str || '')
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .trim()
      .toLowerCase();
  }

  function _debugTeam(nomeParcial) {
    const alvo = normalizeForSearch(nomeParcial);
    const variantes = new Set();
    const jogosDoTime = [];

    allGamesForPeriod.forEach(game => {
      const home = (game.time_a || '').trim();
      const away = (game.time_b || '').trim();
      if (normalizeForSearch(home).includes(alvo)) {
        variantes.add(home);
        jogosDoTime.push(game);
      } else if (normalizeForSearch(away).includes(alvo)) {
        variantes.add(away);
        jogosDoTime.push(game);
      }
    });

    console.log('[Debug] Variações de nome encontradas no período atual:', Array.from(variantes));
    console.log('[Debug] Total de jogos encontrados:', jogosDoTime.length, 'de', allGamesForPeriod.length, 'jogos no período');
    console.table(jogosDoTime.map(g => ({
      id: g.id, time_a: g.time_a, time_b: g.time_b, ft: g.ft, hora: g.hora, minuto: g.minuto,
    })));

    return jogosDoTime;
  }

  return {
    init,
    processRanking,
    // Debug
    _getCurrentState: () => ({
      casa: currentCasa,
      liga: currentLiga,
      horas: currentHoras,
      mercado: currentMercado,
      minJogos: currentMinJogos,
      searchQuery,
      rankingOrderDir,
      ranking: rankingData,
      latestGameTime,
      gamesAnalyzedCount,
      cache: { liga: gamesCache.liga, totalJogos: gamesCache.games.length },
      pinnedTeams,
      proximosCache: { liga: proximosCache.liga, totalJogos: proximosCache.jogos.length },
    }),
    _debugTeam,
  };
})();