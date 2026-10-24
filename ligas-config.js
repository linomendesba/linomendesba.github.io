const LIGAS_INFO = {

  // ───────────── 1WIN (20 jogos/hora, de 3 em 3 minutos) ─────────────
  "1win Inglaterra": {
    casa: "1WIN", nomeExibicao: "England", arquivo: "onewininglaterra.html",
    minutos: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58],
  },
  "1win Espanha": {
    casa: "1WIN", nomeExibicao: "Espanha", arquivo: "onewinespanha.html",
    minutos: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59],
  },
  "1win Itália": {
    casa: "1WIN", nomeExibicao: "Itália", arquivo: "onewinitalia.html",
    minutos: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57],
  },

  // ───────────── BETGREEN (12 jogos/hora, de 5 em 5 minutos) ─────────────
  "BetGreen Premier League": {
    casa: "BETGREEN", nomeExibicao: "Premier", arquivo: "betgreenpremier.html",
    minutos: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
  },
  "BetGreen La Liga": {
    casa: "BETGREEN", nomeExibicao: "La Liga", arquivo: "betgreenlaliga.html",
    minutos: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
  },
  "BetGreen World Cup": {
    casa: "BETGREEN", nomeExibicao: "World Cup", arquivo: "betgreenworldcup.html",
    minutos: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
  },
  "BetGreen Primera Division": {
    casa: "BETGREEN", nomeExibicao: "Chile", arquivo: "betgreenchile.html",
    minutos: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
  },
  "BetGreen Champions League": {
    casa: "BETGREEN", nomeExibicao: "Champions", arquivo: "betgreenchampions.html",
    minutos: [3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53, 58],
  },


  // ───────────── ESTRELA (agora agrupada na casa KIRON) ─────────────
  "Copa do Mundo": {
    casa: "KIRON", nomeExibicao: "Copa", arquivo: "estrelacopamundo.html",
    minutos: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57],
  },
  "Ligas dos Campeões": {
    casa: "KIRON", nomeExibicao: "Campeões", arquivo: "estrelachampions.html",
    minutos: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57],
  },
  "América Latina": {
    casa: "KIRON", nomeExibicao: "Latina", arquivo: "estrelaamericalatina.html",
    minutos: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58],
  },
  "Premier League": {
    casa: "KIRON", nomeExibicao: "Premier", arquivo: "estrelapremier.html",
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
  "Kiron Liga Brasil": {
    casa: "KIRON", nomeExibicao: "Brasil", arquivo: "kironbrazil.html",
    minutos: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59],
  },
  "Kiron Liga América Latina": {
    casa: "KIRON", nomeExibicao: "América Latina", arquivo: "kironamerica.html",
    minutos: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59],
  },
  "Kiron Liga Mundial": {
    casa: "KIRON", nomeExibicao: "Mundial", arquivo: "kironmundial.html",
    minutos: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58],
  },

};

function inicializarLigaAtual() {
  const chave = typeof LIGA_ATUAL !== "undefined" ? LIGA_ATUAL : null;
  const liga = chave ? LIGAS_INFO[chave] : null;

  if (!liga) {
    console.warn(`[ligas-config] LIGA_ATUAL "${chave}" não encontrada em LIGAS_INFO.`);
    return;
  }


  const h4 = document.querySelector("h4.custom-color");
  if (h4) h4.textContent = liga.nomeExibicao;


  const container = document.getElementById("cardsLigasContainer");
  if (container) {
    // Intervalo entre jogos da liga (ex.: 3 em 3 minutos)
    const intervalo = (l) => (l.minutos && l.minutos.length > 1 ? l.minutos[1] - l.minutos[0] : 0);

    // Ligas de 3 minutos primeiro; as demais mantêm a ordem original (sort estável)
    const cardsDaCasa = Object.values(LIGAS_INFO)
      .filter((l) => l.casa === liga.casa)
      .sort((a, b) => (intervalo(b) === 3) - (intervalo(a) === 3));
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