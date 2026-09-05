
const LIGAS_INFO = {

  // ───────────── BET365 ─────────────
  "Copa": {
    casa: "BET365", nomeExibicao: "Copa", arquivo: "bet365copa.html",
    minutos: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58],
  },
  "Super": {
    casa: "BET365", nomeExibicao: "Super", arquivo: "bet365super.html",
    minutos: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58],
  },
  "Euro": {
    casa: "BET365", nomeExibicao: "Euro", arquivo: "bet365euro.html",
    minutos: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59],
  },
  "Premier": {
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


  if (typeof marcarLigaAtiva === "function") marcarLigaAtiva();
}

document.addEventListener("DOMContentLoaded", inicializarLigaAtual);