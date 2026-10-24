/* ════════════════════════════════════════════════════════════════════
   catalogo-ferramentas.js — CENTRAL DE CASAS E LIGAS DAS FERRAMENTAS
   ────────────────────────────────────────────────────────────────────
   É a ÚNICA fonte de casas, ligas, rotas da API e ciclo de minutos para
   as páginas de ferramentas (buscadores, fluxo, 365porcent, ...).
   NÃO depende de config.js nem de ligas-config.js (e não altera nenhum).

   COMO USAR NUMA PÁGINA
     <script src="catalogo-ferramentas.js"></script>
     Catalogo.preencherCasas(selCasa);
     Catalogo.preencherLigas(selLiga, selCasa.value);
     Catalogo.preencherJanela(selJanela, Catalogo.getLiga(selLiga.value));
     fetch(Catalogo.urlApi("resultados", selLiga.value));

   COMO ADICIONAR / REMOVER / TROCAR
     • Nova liga ........ acrescente uma linha em LIGAS (id, casa, label, rota, minutos)
     • Remover liga ..... apague a linha OU coloque ativa: false (some dos seletores)
     • Nova casa ........ acrescente em CASAS e use a chave nas ligas
     • Trocar domínio ... mude só API_BASE
     • Ciclo de minutos . ciclo(inicio, passo): ciclo(1,3) = 1,4,7,...,58 (20 jogos/h)

   O "id" da liga é o MESMO nome usado no config.js (LIGA_ATUAL), então
   Catalogo.getLiga(LIGA_ATUAL) funciona em qualquer página.
   ════════════════════════════════════════════════════════════════════ */
(function (root) {
  "use strict";

  const API_BASE = "https://datavirtual.com.br";

  // Minutos da hora em que a liga joga: começa em `inicio` e anda de `passo` em `passo`.
  function ciclo(inicio, passo) {
    const out = [];
    for (let m = inicio; m < 60; m += passo) out.push(m);
    return out;
  }

  /* ───────────── CASAS ─────────────
     (Estrela está agrupada em KIRON, igual ao ligas-config.js.
      Para separar: crie "ESTRELA" aqui e troque casa: "KIRON" por "ESTRELA" nas 4 ligas dela.) */
  const CASAS = {
    "1WIN":     { label: "1Win" },
    "BETGREEN": { label: "BetGreen" },
    "KIRON":    { label: "Kiron / Estrela" },
  };

  /* ───────────── LIGAS ─────────────
     id      = nome da liga no config.js (LIGA_ATUAL)
     rota    = trecho da URL depois de /resultados/, /proximos/ e /odds/
     minutos = ciclo de jogos da liga (define jogos/hora e o intervalo)
     ativa   = false esconde dos seletores (opcional, padrão true)          */
  const LIGAS = [
    // ── 1WIN (20 jogos/h, de 3 em 3) ──
    { id: "1win Inglaterra", casa: "1WIN", label: "Inglaterra", rota: "onewin/Inglaterra",      minutos: ciclo(1, 3) },
    { id: "1win Espanha",    casa: "1WIN", label: "Espanha",    rota: "onewin/Espanha",         minutos: ciclo(2, 3) },
    { id: "1win Itália",     casa: "1WIN", label: "Itália",     rota: "onewin/It%C3%A1lia",     minutos: ciclo(0, 3) },

    // ── BETGREEN (12 jogos/h, de 5 em 5) ──
    { id: "BetGreen Premier League",    casa: "BETGREEN", label: "Premier League",   rota: "betgreen/England.%20Premier%20League",  minutos: ciclo(0, 5) },
    { id: "BetGreen La Liga",           casa: "BETGREEN", label: "La Liga",          rota: "betgreen/Spain.%20La%20Liga",           minutos: ciclo(0, 5) },
    { id: "BetGreen World Cup",         casa: "BETGREEN", label: "World Cup",        rota: "betgreen/World%20Cup.%20Play-offs",     minutos: ciclo(0, 5) },
    { id: "BetGreen Primera Division",  casa: "BETGREEN", label: "Chile",            rota: "betgreen/Chile.%20Primera%20Division",  minutos: ciclo(0, 5) },
    { id: "BetGreen Champions League",  casa: "BETGREEN", label: "Champions League", rota: "betgreen/Champions%20League",           minutos: ciclo(3, 5) },

    // ── KIRON (2 em 2 min = 30 jogos/h; Brasil e América Latina de 3 em 3 = 20 jogos/h) ──
    { id: "Kiron Liga Inglaterra",     casa: "KIRON", label: "Inglaterra",     rota: "kiron/England",                  minutos: ciclo(0, 2) },
    { id: "Kiron Liga Itália",         casa: "KIRON", label: "Itália",         rota: "kiron/Italy",                    minutos: ciclo(1, 2) },
    { id: "Kiron Liga Espanha",        casa: "KIRON", label: "Espanha",        rota: "kiron/Spain",                    minutos: ciclo(1, 2) },
    { id: "Kiron Liga Brasil",         casa: "KIRON", label: "Brasil",         rota: "kiron/Brasil",                   minutos: ciclo(2, 3) },
    { id: "Kiron Liga América Latina", casa: "KIRON", label: "América Latina", rota: "kiron/Am%C3%A9rica%20Latina",    minutos: ciclo(2, 3) },
    { id: "Kiron Liga Mundial",         casa: "KIRON", label: "Mundial",        rota: "kiron/Mundial",                  minutos: ciclo(0, 2) },

    // ── ESTRELA (agrupada na casa KIRON) ──
    { id: "Copa do Mundo",      casa: "KIRON", label: "Estrela · Copa do Mundo",   rota: "estrela/Copa%20do%20Mundo",            minutos: ciclo(0, 3) },
    { id: "Ligas dos Campeões", casa: "KIRON", label: "Estrela · Campeões",        rota: "estrela/Ligas%20dos%20Campe%C3%B5es",  minutos: ciclo(0, 3) },
    { id: "América Latina",     casa: "KIRON", label: "Estrela · América Latina",  rota: "estrela/Am%C3%A9rica%20Latina",        minutos: ciclo(1, 3) },
    { id: "Premier League",     casa: "KIRON", label: "Estrela · Premier",         rota: "estrela/Premier%20League",             minutos: ciclo(0, 3) },

  ];

  /* ───────────── CONSULTAS ───────────── */

  function ligasAtivas() {
    return LIGAS.filter(function (l) { return l.ativa !== false; });
  }

  function ligasDaCasa(casaKey) {
    return ligasAtivas().filter(function (l) { return l.casa === casaKey; });
  }

  // Casas com pelo menos uma liga ativa, na ordem de CASAS.
  function casasAtivas() {
    return Object.keys(CASAS)
      .filter(function (k) { return CASAS[k].ativa !== false; })
      .map(function (k) { return { key: k, label: CASAS[k].label, ligas: ligasDaCasa(k) }; })
      .filter(function (c) { return c.ligas.length > 0; });
  }

  // Procura também entre as inativas (uma página antiga ainda pode apontar pra elas).
  function getLiga(id) {
    return LIGAS.find(function (l) { return l.id === id; }) || null;
  }

  function urlApi(recurso, ligaId) {
    const liga = getLiga(ligaId);
    if (!liga) throw new Error("[catalogo] liga não encontrada: " + ligaId);
    return API_BASE + "/" + recurso + "/" + liga.rota;
  }

  /* ───────────── CICLO DE MINUTOS ───────────── */

  function jogosPorHora(liga) {
    return liga.minutos.length;
  }

  // Intervalo (em minutos) entre um jogo e o seguinte: 2, 3 ou 5.
  function intervalo(liga) {
    return liga.minutos.length > 1 ? liga.minutos[1] - liga.minutos[0] : 60;
  }

  // Tolerância (em minutos) pra casar odd x resultado: sempre MENOR que o intervalo,
  // senão uma odd poderia casar com o jogo vizinho (ex.: ciclo de 2 min → ±1).
  function toleranciaMin(liga) {
    return Math.min(2, intervalo(liga) - 1);
  }

  // Opções do seletor "Jogos Analisados": horas × jogos/hora da liga
  // (ex.: 6 Hs = 120 jogos a 20/h, 180 jogos a 30/h, 72 jogos a 12/h).
  var HORAS_PADRAO = [3, 6, 12, 24, 48];
  function opcoesJanela(liga, horas) {
    var jph = jogosPorHora(liga);
    return (horas || HORAS_PADRAO).map(function (h) {
      return { horas: h, value: h * jph, label: String(h).padStart(2, "0") + " Hs" };
    });
  }

  // Posição ("slot") do jogo no ciclo da liga. Jogos consecutivos têm slots consecutivos,
  // mesmo na virada da hora. tsMs = timestamp do relógio do jogo (Date.UTC de ano/mês/dia/hora/minuto).
  // noCiclo = true quando o minuto do jogo NÃO pertence ao ciclo da liga.
  function slotDe(liga, tsMs) {
    var iv = intervalo(liga);
    var deslocamento = liga.minutos[0] % iv;
    var rel = Math.round(tsMs / 60000) - deslocamento;
    return { slot: Math.round(rel / iv), noCiclo: rel % iv !== 0 };
  }

  /* ───────────── SELETORES (DOM) ───────────── */

  function valorExiste(sel, valor) {
    return Array.prototype.some.call(sel.options, function (o) { return o.value === valor; });
  }

  function preencherCasas(sel, valor) {
    sel.innerHTML = casasAtivas()
      .map(function (c) { return '<option value="' + c.key + '">' + c.label + "</option>"; })
      .join("");
    if (valor && valorExiste(sel, valor)) sel.value = valor;
  }

  function preencherLigas(sel, casaKey, valor) {
    sel.innerHTML = ligasDaCasa(casaKey)
      .map(function (l) { return '<option value="' + l.id + '">' + l.label + "</option>"; })
      .join("");
    if (valor && valorExiste(sel, valor)) sel.value = valor;
  }

  // Refaz o seletor de janela pro ritmo da liga, mantendo as HORAS escolhidas
  // (se a janela de 12 Hs estava marcada, continua 12 Hs mesmo mudando o nº de jogos).
  function preencherJanela(sel, liga, horasPadrao) {
    var padrao = horasPadrao || 6;
    var atual = sel.selectedIndex >= 0 ? sel.options[sel.selectedIndex] : null;
    var horasAtual = atual && atual.dataset.horas ? Number(atual.dataset.horas) : padrao;
    var ops = opcoesJanela(liga);
    sel.innerHTML = ops
      .map(function (o) { return '<option value="' + o.value + '" data-horas="' + o.horas + '">' + o.label + "</option>"; })
      .join("");
    var alvo = ops.find(function (o) { return o.horas === horasAtual; }) ||
               ops.find(function (o) { return o.horas === padrao; }) || ops[0];
    sel.value = String(alvo.value);
  }

  /* ───────────── AUTO-CHECAGEM DO CATÁLOGO ───────────── */
  (function validar() {
    var vistos = {};
    LIGAS.forEach(function (l) {
      if (vistos[l.id]) console.warn("[catalogo] id duplicado:", l.id);
      vistos[l.id] = true;
      if (!CASAS[l.casa]) console.warn("[catalogo] casa inexistente em", l.id, "->", l.casa);
      var iv = intervalo(l);
      if (60 % iv !== 0) console.warn("[catalogo] intervalo não divide 60 em", l.id, "->", iv);
    });
  })();

  root.Catalogo = {
    API_BASE: API_BASE,
    CASAS: CASAS,
    LIGAS: LIGAS,
    ciclo: ciclo,
    casasAtivas: casasAtivas,
    ligasDaCasa: ligasDaCasa,
    getLiga: getLiga,
    urlApi: urlApi,
    jogosPorHora: jogosPorHora,
    intervalo: intervalo,
    toleranciaMin: toleranciaMin,
    opcoesJanela: opcoesJanela,
    slotDe: slotDe,
    preencherCasas: preencherCasas,
    preencherLigas: preencherLigas,
    preencherJanela: preencherJanela,
  };
})(typeof window !== "undefined" ? window : globalThis);