/* ════════════════════════════════════════════════════════════════
   LIGAS-CONFIG.JS
   Fonte única de verdade para TODAS as ligas do BetStat.

   Cada página só precisa ter, no config.js dela, a variável:
       const LIGA_ATUAL = "chave-da-liga-aqui";
   (a mesma que já é usada hoje pra apontar a rota da API).

   A partir dessa única variável, este arquivo resolve sozinho:
     1) o nome exibido no h4 (título da liga na página)
     2) os cards de navegação da "casa" (Betano, Bet365, etc.)

   Os minutos de cada liga também ficam guardados aqui dentro
   (LIGAS_INFO[...].minutos), mas só como referência/fonte única de
   dados — o tabela.js continua com seu próprio MINUTOS_POR_LIGA
   interno cuidando disso, sem nenhuma mudança. (ver nota mais
   abaixo, antes da função inicializarLigaAtual)

   Pra adicionar uma liga nova (a 21ª, 22ª...):
     - Duplique a página normalmente.
     - No config.js da página nova, defina LIGA_ATUAL com uma chave
       que ainda não existe aqui embaixo.
     - Adicione UMA entrada nova no objeto LIGAS_INFO abaixo (nome,
       casa, arquivo e minutos).
     - Pronto. Nenhuma outra página precisa ser tocada — os cards de
       todas as páginas da mesma casa vão puxar a liga nova sozinhos.
   ════════════════════════════════════════════════════════════════ */

const LIGAS_INFO = {

  // ───────────── BET365 ─────────────
  "Bet365 Copa": {
    casa: "BET365", nomeExibicao: "Copa", arquivo: "bet365copa.html",
    minutos: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58],
  },
  "Bet365 Super": {
    casa: "BET365", nomeExibicao: "Super", arquivo: "bet365super.html",
    minutos: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58],
  },
  "Bet365 Euro": {
    casa: "BET365", nomeExibicao: "Euro", arquivo: "bet365euro.html",
    minutos: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59],
  },
  "Bet365 Premier": {
    casa: "BET365", nomeExibicao: "Premier", arquivo: "bet365premier.html",
    minutos: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57],
  },

  // ───────────── BETANO ─────────────
  "Taça Glória Eterna": {
    casa: "BETANO", nomeExibicao: "Clássicos", arquivo: "index.html",
    minutos: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58],
  },
  "Copa América": {
    casa: "BETANO", nomeExibicao: "América", arquivo: "copa_america.html",
    minutos: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59],
  },
  "Euro": {
    casa: "BETANO", nomeExibicao: "Euro", arquivo: "euro.html",
    minutos: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58],
  },
  "Campeonato Italiano": {
    casa: "BETANO", nomeExibicao: "Italiano", arquivo: "campeonato_italiano.html",
    minutos: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59],
  },
  "Copa das Estrelas": {
    casa: "BETANO", nomeExibicao: "Estrelas", arquivo: "copa_das_estrelas.html",
    minutos: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57],
  },
  "Brasileirão Betano": {
    casa: "BETANO", nomeExibicao: "Brasileirão", arquivo: "brasileirao.html",
    minutos: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57],
  },
  "Mundial": {
    casa: "BETANO", nomeExibicao: "World", arquivo: "mundial.html",
    minutos: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58],
  },

  // ───────────── ESTRELABET ─────────────
  "Copa do Mundo": {
    casa: "ESTRELABET", nomeExibicao: "Copa", arquivo: "estrelacopamundo.html",
    minutos: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57],
  },
  "Ligas dos Campeões": {
    casa: "ESTRELABET", nomeExibicao: "Campeões", arquivo: "estrelachampions.html",
    minutos: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57],
  },
  "América Latina": {
    casa: "ESTRELABET", nomeExibicao: "Latina", arquivo: "estrelaamericalatina.html",
    minutos: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58],
  },

  // ───────────── BETSSON ─────────────
  "Betsson Espanha": {
    casa: "BETSSON", nomeExibicao: "Espanha", arquivo: "betssonespanha.html",
    minutos: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59],
  },
  "Betsson Inglaterra": {
    casa: "BETSSON", nomeExibicao: "England", arquivo: "betssoningland.html",
    minutos: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58],
  },
  "Betsson Brasil": {
    casa: "BETSSON", nomeExibicao: "Brasil", arquivo: "betssonbrasil.html",
    minutos: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57],
  },

  // ───────────── KIRON (30 jogos/hora) ─────────────
  "Kiron Liga Inglaterra": {
    casa: "KIRON", nomeExibicao: "England", arquivo: "kironengland.html",
    minutos: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58],
  },
  "Kiron Liga Itália": {
    casa: "KIRON", nomeExibicao: "Italy", arquivo: "kironitaly.html",
    minutos: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59],
  },
  "Kiron Liga Espanha": {
    casa: "KIRON", nomeExibicao: "Spain", arquivo: "kironspain.html",
    minutos: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59],
  },

};

/* ════════════════════════════════════════════════════════════════
   IMPORTANTE: este arquivo NÃO declara um MINUTOS_POR_LIGA global.
   O tabela.js já tem o dele próprio (const MINUTOS_POR_LIGA = {...}
   lá dentro) e, como <script src> compartilham o mesmo escopo,
   declarar de novo aqui causaria "Identifier already declared" e
   quebraria o tabela.js inteiro. Os minutos ficam guardados dentro
   de cada liga em LIGAS_INFO[...].minutos só como referência /
   fonte de dados pra você copiar pro tabela.js quando cadastrar
   uma liga nova — não são lidos automaticamente por ele.
   ════════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════════
   Injeta automaticamente:
     1) o texto do h4.custom-color (nome da liga)
     2) os cards de navegação da casa (todas as ligas com a mesma
        propriedade "casa" da liga atual)
   Só precisa existir na página:
     <h4 class="custom-color"></h4>                (pode ficar vazio)
     <div id="cardsLigasContainer"></div>           (substitui o bloco fixo)
     <script src="config.js"></script>              (define LIGA_ATUAL)
     <script src="ligas-config.js"></script>        (este arquivo)
   ════════════════════════════════════════════════════════════════ */
function inicializarLigaAtual() {
  const chave = typeof LIGA_ATUAL !== "undefined" ? LIGA_ATUAL : null;
  const liga = chave ? LIGAS_INFO[chave] : null;

  if (!liga) {
    console.warn(`[ligas-config] LIGA_ATUAL "${chave}" não encontrada em LIGAS_INFO.`);
    return;
  }

  // 1) nome da liga no h4
  const h4 = document.querySelector("h4.custom-color");
  if (h4) h4.textContent = liga.nomeExibicao;

  // 2) cards da mesma casa
  const container = document.getElementById("cardsLigasContainer");
  if (container) {
    const cardsDaCasa = Object.values(LIGAS_INFO).filter((l) => l.casa === liga.casa);
    container.innerHTML = cardsDaCasa
      .map(
        (l) =>
          `<div class="cardsligasbetano-card" onclick="window.location.href='${l.arquivo}'"><h3>${l.nomeExibicao}</h3></div>`
      )
      .join("");
  }

  // 3) reaplica o destaque da liga ativa, se a função já existir na página
  if (typeof marcarLigaAtiva === "function") marcarLigaAtiva();
}

document.addEventListener("DOMContentLoaded", inicializarLigaAtual);