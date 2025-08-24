const minutosFixos = [
  1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58,
];

let placarSelecionado = localStorage.getItem("placarSelecionado");
let timeSelecionado = localStorage.getItem("timeSelecionado");
let oddSelecionada = localStorage.getItem("oddSelecionada");

function showErrorMessage(message) {
  const errorMessageDiv = document.getElementById("errorMessage");
  errorMessageDiv.textContent = message;
  errorMessageDiv.style.display = "block";
}

function hideErrorMessage() {
  const errorMessageDiv = document.getElementById("errorMessage");
  errorMessageDiv.textContent = "";
  errorMessageDiv.style.display = "none";
}

function selecionarPlacaresIguais(placarAlvo) {
  const placares = document.querySelectorAll(".placar");
  placares.forEach((placar) => {
    const texto = placar.querySelector(".placar-texto")?.textContent.trim() || placar.textContent.trim();
    if (placarAlvo && texto.includes(placarAlvo)) {
      placar.classList.add("placar-selecionado");
    } else {
      placar.classList.remove("placar-selecionado");
    }
  });
}

function selecionarJogosPorTime(timeAlvo) {
  const placares = document.querySelectorAll(".placar");
  if (!timeAlvo || document.querySelector("#mostrarTimes").value !== "sim") {
    placares.forEach((placar) => {
      placar.classList.remove("time-selecionado");
    });
    return;
  }
  placares.forEach((placar) => {
    const timeA = placar.getAttribute("data-time-a");
    const timeB = placar.getAttribute("data-time-b");
    if (timeA === timeAlvo || timeB === timeAlvo) {
      placar.classList.add("time-selecionado");
    } else {
      placar.classList.remove("time-selecionado");
    }
  });
}

function selecionarOddsIguais(oddAlvo) {
  const oddsElements = document.querySelectorAll(".odds");
  oddsElements.forEach((oddElement) => {
    const oddTexto = oddElement.textContent.trim();
    if (oddAlvo && oddTexto === oddAlvo) {
      oddElement.classList.add("odd-selecionada");
    } else {
      oddElement.classList.remove("odd-selecionada");
    }
  });
}

function calculateGoalStats(todasLinhas) {
  const totalGols = todasLinhas.reduce(
    (acc, row) =>
      acc + parseInt(row.children[row.children.length - 3].textContent || 0),
    0
  );
  const totalHorasJogadas = todasLinhas.length;
  const mediaGolsHora =
    totalHorasJogadas > 0
      ? (totalGols / totalHorasJogadas).toFixed(2)
      : 0;

  return {
    totalGols,
    mediaGolsHora,
  };
}

async function fetchOdds() {
  try {
    const response = await fetch("https://betstat.site/odds/Ta%C3%A7a%20Gl%C3%B3ria%20eterna");
    if (!response.ok) {
      throw new Error(`Erro ao buscar odds: ${response.status} ${response.statusText}`);
    }
    const oddsData = await response.json();
    console.log("Odds fetched:", oddsData);
    return oddsData;
  } catch (error) {
    console.error("Erro ao buscar odds:", error);
    return [];
  }
}

async function fetchProximosJogos() {
  try {
    const response = await fetch("https://betstat.site/proximos/Ta%C3%A7a%20Gl%C3%B3ria%20eterna");
    if (!response.ok) {
      throw new Error(`Erro ao buscar próximos jogos: ${response.status} ${response.statusText}`);
    }
    const jogos = await response.json();
    console.log("Próximos jogos fetched:", jogos);
    return jogos.sort((a, b) => new Date(a.start_time) - new Date(b.start_time)).slice(0, 6);
  } catch (error) {
    console.error("Erro ao buscar próximos jogos:", error);
    showErrorMessage(`Erro ao carregar próximos jogos: ${error.message}`);
    return [];
  }
}

function normalizeString(str) {
  return str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function formatDateToDDMMYYYY(dateStr) {
  let date;
  if (dateStr.includes("T")) {
    date = new Date(dateStr);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  } else {
    const [day, month, year] = dateStr.split("/");
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  }
  if (isNaN(date)) return null;
}

function findOddsForMatch(match, oddsData) {
  const matchDate = formatDateToDDMMYYYY(match.data);
  const matchTime = `${match.hora.toString().padStart(2, "0")}:${match.minuto.toString().padStart(2, "0")}`;
  const teamMapping = {
    "peixe": "boca",
    // Add other mappings as needed
  };
  const matchTimeA = normalizeString(teamMapping[match.time_a.toLowerCase()] || match.time_a);
  const matchTimeB = normalizeString(teamMapping[match.time_b.toLowerCase()] || match.time_b);

  console.log(`Searching odds for match: ${matchTimeA} vs ${matchTimeB} on ${matchDate} at ${matchTime}`);

  let matchedOdd = oddsData.find(odd => {
    const oddDate = odd.data_captura;
    const oddTime = odd.horario;
    const oddTimeCasa = normalizeString(odd.time_casa);
    const oddTimeVisitante = normalizeString(odd.time_visitante);

    const isMatch =
      oddTimeCasa === matchTimeA &&
      oddTimeVisitante === matchTimeB &&
      oddDate === matchDate &&
      oddTime === matchTime;

    if (isMatch) {
      console.log(`Found odds by full match:`, odd);
    }
    return isMatch;
  });

  if (!matchedOdd) {
    matchedOdd = oddsData.find(odd => {
      const oddTime = odd.horario;
      const oddTimeCasa = normalizeString(odd.time_casa);
      const oddTimeVisitante = normalizeString(odd.time_visitante);
      const isTeamMatch =
        (oddTimeCasa === matchTimeA || oddTimeVisitante === matchTimeA || 
         oddTimeCasa === matchTimeB || oddTimeVisitante === matchTimeB) &&
        oddTime === matchTime;
      if (isTeamMatch) {
        console.log(`Found odds by team and time:`, odd);
      }
      return isTeamMatch;
    });
  }

  if (!matchedOdd) {
    console.log(`No odds found for ${matchTimeA} vs ${matchTimeB} on ${matchDate} at ${matchTime}`);
  }

  return matchedOdd;
}

function getOddValue(odds, resultado) {
  const oddMap = {
    ambasMarcam: "odds_ambas_marcam_sim",
    ambasNaoMarcam: "odds_ambas_marcam_nao",
    casaVence: "odds_casa_vence",
    foraVence: "odds_visitante_vence",
    empate: "odds_empate",
    "over1.5": "odds_mais_1_5",
    "under1.5": "odds_menos_1_5",
    "over2.5": "odds_mais_2_5",
    "under2.5": "odds_menos_2_5",
    "over3.5": "odds_mais_3_5",
    "under3.5": "odds_menos_3_5",
    over5: "odds_mais_5_gols",
  };
  const oddValue = odds ? odds[oddMap[resultado]] || "N/A" : "N/A";
  return oddValue;
}

function extractTimeFromDateTime(dateTimeStr) {
  if (!dateTimeStr || isNaN(new Date(dateTimeStr))) {
    console.warn(`Data/hora inválida: ${dateTimeStr}`);
    return { time: "Horário indisponível", date: null, hour: null, minute: null };
  }
  const date = new Date(dateTimeStr);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  const closestMinute = minutosFixos.reduce((prev, curr) =>
    Math.abs(curr - minute) < Math.abs(prev - minute) ? curr : prev
  );
  console.log(`Parsed time: ${dateTimeStr} -> local time: ${date.toISOString()} -> hour: ${hour}, minute: ${minute}, closestMinute: ${closestMinute}`);
  return { time, date: date, hour, minute: closestMinute };
}

function abbreviateTeamName(teamName) {
  if (!teamName) return "";
  const words = teamName.trim().split(" ");
  if (words.length > 1) {
    return words.map(word => word.charAt(0).toUpperCase()).join("") + words[words.length - 1].slice(0, 3).toLowerCase();
  }
  return teamName.length > 5 ? teamName.slice(0, 5).toUpperCase() : teamName.toUpperCase();
}

function getDateStr(data) {
  if (data.includes("T")) {
    return new Date(data).toISOString().split("T")[0];
  } else {
    const [day, month, year] = data.split("/");
    return `${year}-${month}-${day}`;
  }
}

function criarTabela(dados, oddsData, proximosJogos) {
  const tabelaBody = document.querySelector("#tabelaResultados tbody");
  const linhaPercentual = document.getElementById("linhaPercentual");
  const linhaTotalGols = document.getElementById("linhaTotalGols");
  const linhaAcertosMercado = document.getElementById("linhaAcertosMercado");
  if (!tabelaBody || !linhaPercentual || !linhaTotalGols || !linhaAcertosMercado) {
    console.error("Elementos da tabela não encontrados!");
    showErrorMessage("Erro interno: Estrutura da tabela não encontrada.");
    return;
  }

  linhaPercentual.innerHTML = "<th>📊</th>";
  linhaTotalGols.innerHTML = "<th>⚽</th>";
  linhaAcertosMercado.innerHTML = "<th>✔️</th>";
  tabelaBody.innerHTML = "";

  const seletorHoras = document.querySelector("#seletorHoras");
  const seletorResultado = document.querySelector("#seletorResultado");
  const seletorTipoPlacar = document.querySelector("#seletorTipoPlacar");
  const mostrarTimesSelect = document.querySelector("#mostrarTimes");
  const mostrarHTSelect = document.querySelector("#mostrarHT");
  const mostrarOddsSelect = document.querySelector("#mostrarOdds");
  const mostrarTimes = mostrarTimesSelect ? mostrarTimesSelect.value === "sim" : false;
  const mostrarOdds = mostrarOddsSelect ? mostrarOddsSelect.value === "sim" : false;
  const mostrarHT = mostrarHTSelect ? mostrarHTSelect.value === "sim" : false;

  if (!seletorHoras || !seletorResultado || !seletorTipoPlacar || !mostrarTimesSelect || !mostrarHTSelect || !mostrarOddsSelect) {
    console.error("Seletores não encontrados!");
    showErrorMessage("Erro interno: Seletores do formulário não encontrados.");
    return;
  }

  const horasSelecionadas = parseInt(seletorHoras.value) || 12;

  dados.sort((a, b) => {
    const dateStrA = getDateStr(a.data);
    const dateStrB = getDateStr(b.data);
    const dataHoraA = new Date(
      `${dateStrA}T${a.hora.toString().padStart(2, "0")}:${a.minuto.toString().padStart(2, "0")}:00`
    ).getTime();
    const dataHoraB = new Date(
      `${dateStrB}T${b.hora.toString().padStart(2, "0")}:${b.minuto.toString().padStart(2, "0")}:00`
    ).getTime();
    return dataHoraA - dataHoraB;
  });

  const proximosJogosComHoras = proximosJogos.map(jogo => {
    const [horaStr, minutoStr] = jogo.time.split(":");
    const hora = parseInt(horaStr, 10);
    const minute = parseInt(minutoStr, 10);
    const closestMinute = minutosFixos.reduce((prev, curr) =>
      Math.abs(curr - minute) < Math.abs(prev - minute) ? curr : prev
    );
    const date = new Date(jogo.start_time);
    return { ...jogo, time: jogo.time, date, hora, minuto: closestMinute, team_visitante: jogo.team_visit };
  }).sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  console.log("Próximos jogos processados:", proximosJogosComHoras);

  const chavesJaProcessadas = new Set();
  const mapeamentoChaveLinha = {};
  let contagemLinhas = 0;

  const now = new Date();
  proximosJogosComHoras.forEach(jogo => {
    const hora = jogo.hora;
    const dataStr = jogo.captured_date ? jogo.captured_date.split("/").reverse().join("-") : jogo.date.toISOString().split("T")[0];
    const chave = `${dataStr}-${hora}`;
    if (!chavesJaProcessadas.has(chave)) {
      const jogoDateTime = new Date(jogo.start_time);
      if (jogoDateTime > now) {
        const novaLinha = document.createElement("tr");
        novaLinha.setAttribute("data-chave", chave);
        const colunaHora = document.createElement("td");
        colunaHora.textContent = hora.toString().padStart(2, "0");
        novaLinha.appendChild(colunaHora);
        minutosFixos.forEach(() => novaLinha.appendChild(document.createElement("td")));
        novaLinha.appendChild(document.createElement("td")).textContent = "0";
        novaLinha.appendChild(document.createElement("td")).textContent = "0";
        novaLinha.appendChild(document.createElement("td")).textContent = "0%";
        tabelaBody.insertBefore(novaLinha, tabelaBody.firstChild);
        chavesJaProcessadas.add(chave);
        mapeamentoChaveLinha[chave] = novaLinha;
        contagemLinhas++;
        console.log(`Criada linha para hora futura (topo): ${chave}`);
      }
    }
  });

  dados.reverse().forEach((dado) => {
    if (contagemLinhas >= horasSelecionadas) return;
    const dateStr = getDateStr(dado.data);
    const hora = dado.hora;
    const chave = `${dateStr}-${hora}`;
    if (!chavesJaProcessadas.has(chave)) {
      const novaLinha = document.createElement("tr");
      novaLinha.setAttribute("data-chave", chave);
      const colunaHora = document.createElement("td");
      colunaHora.textContent = hora.toString().padStart(2, "0");
      novaLinha.appendChild(colunaHora);
      minutosFixos.forEach(() => novaLinha.appendChild(document.createElement("td")));
      novaLinha.appendChild(document.createElement("td")).textContent = "0";
      novaLinha.appendChild(document.createElement("td")).textContent = "0";
      novaLinha.appendChild(document.createElement("td")).textContent = "0%";
      tabelaBody.appendChild(novaLinha);
      chavesJaProcessadas.add(chave);
      mapeamentoChaveLinha[chave] = novaLinha;
      contagemLinhas++;
      console.log(`Criada linha para dados passados: ${chave}`);
    }
  });

  function handlePlacarClick(event) {
    if (mostrarTimes) return;
    const placarElement = event.currentTarget.querySelector(".placar-texto") || event.currentTarget;
    const placarClicado = placarElement.textContent.trim();
    if (placarSelecionado === placarClicado) {
      placarSelecionado = null;
      localStorage.removeItem("placarSelecionado");
      selecionarPlacaresIguais(null);
    } else {
      placarSelecionado = placarClicado;
      localStorage.setItem("placarSelecionado", placarClicado);
      selecionarPlacaresIguais(placarClicado);
    }
  }

  function handleTimeClick(event) {
    if (!mostrarTimes) return;
    const timeElement = event.target;
    const timeClicado = timeElement.getAttribute("data-full-time");
    if (!timeClicado) return;
    if (timeSelecionado === timeClicado) {
      timeSelecionado = null;
      localStorage.removeItem("timeSelecionado");
      selecionarJogosPorTime(null);
    } else {
      timeSelecionado = timeClicado;
      localStorage.setItem("timeSelecionado", timeClicado);
      selecionarJogosPorTime(timeClicado);
    }
  }

  function handleOddClick(event) {
    event.stopPropagation();
    const oddClicada = event.currentTarget.textContent.trim();
    if (oddSelecionada === oddClicada) {
      oddSelecionada = null;
      localStorage.removeItem("oddSelecionada");
      selecionarOddsIguais(null);
    } else {
      oddSelecionada = oddClicada;
      localStorage.setItem("oddSelecionada", oddClicada);
      selecionarOddsIguais(oddClicada);
    }
  }

  const totalGolsPorColuna = Array(minutosFixos.length).fill(0);
  const totalAcertosPorColuna = Array(minutosFixos.length).fill(0);
  const processedMatches = new Set();

  dados.forEach((dado) => {
    const dateStr = getDateStr(dado.data);
    const hora = dado.hora;
    const chave = `${dateStr}-${hora}`;
    const linha = mapeamentoChaveLinha[chave];
    const matchKey = `${dado.time_a}-${dado.time_b}-${chave}-${dado.minuto}`;

    if (linha && !processedMatches.has(matchKey)) {
      const indexMinuto = minutosFixos.indexOf(dado.minuto);
      if (indexMinuto !== -1) {
        const colunaMinuto = linha.children[1 + indexMinuto];

        if (!colunaMinuto.querySelector(".placar")) {
          const placar = document.createElement("div");
          placar.className = "placar";
          placar.setAttribute("data-time-a", dado.time_a);
          placar.setAttribute("data-time-b", dado.time_b);

          const tipoPlacar = seletorTipoPlacar.value;
          const placarFT = dado.ft;
          const placarHT = dado.ht;

          const placarTexto = document.createElement("div");
          placarTexto.className = "placar-texto";

          let primaryScore = tipoPlacar === "ft" ? placarFT : placarHT;
          let secondaryScore = tipoPlacar === "ft" ? placarHT : placarFT;

          if (mostrarTimes) {
            const timeA = abbreviateTeamName(dado.time_a);
            const timeB = abbreviateTeamName(dado.time_b);
            let textoPlacar = `<span class="time-casa" style="cursor: pointer;" data-full-time="${dado.time_a}">${timeA}</span>`;
            textoPlacar += `<span>${primaryScore}</span>`;
            if (mostrarHT) {
              textoPlacar += `<span>(${secondaryScore})</span>`;
            }
            textoPlacar += `<span class="time-fora" style="cursor: pointer;" data-full-time="${dado.time_b}">${timeB}</span>`;
            placarTexto.innerHTML = textoPlacar;
          } else {
            let textoPlacar = `<span>${primaryScore}</span>`;
            if (mostrarHT) {
              textoPlacar += `<span>(${secondaryScore})</span>`;
            }
            placarTexto.innerHTML = textoPlacar;
          }
          placar.appendChild(placarTexto);

          if (mostrarOdds) {
            const odds = findOddsForMatch(dado, oddsData);
            const oddValue = getOddValue(odds, seletorResultado.value);
            const oddsElement = document.createElement("div");
            oddsElement.className = "odds";
            oddsElement.textContent = `@${oddValue}`;
            oddsElement.addEventListener("click", handleOddClick);
            placar.appendChild(oddsElement);
          }

          placar.addEventListener("click", handlePlacarClick);
          if (mostrarTimes) {
            const timeCasa = placar.querySelector(".time-casa");
            const timeFora = placar.querySelector(".time-fora");
            if (timeCasa) timeCasa.addEventListener("click", handleTimeClick);
            if (timeFora) timeFora.addEventListener("click", handleTimeClick);
          }

          const tooltip = document.createElement("span");
          tooltip.className = "tooltip";
          tooltip.innerHTML = `
            <span class="times">${dado.time_a} vs ${dado.time_b}</span>
            <span class="placares">${placarFT} <span class="placarHT">(${placarHT})</span></span>
          `;
          placar.appendChild(tooltip);

          colunaMinuto.appendChild(placar);
          processedMatches.add(matchKey);
          console.log(`Adicionado resultado passado: ${dado.time_a} vs ${dado.time_b} em ${chave} minuto ${dado.minuto}`);

          if (placarSelecionado && !mostrarTimes && placarTexto.textContent.includes(placarSelecionado)) {
            placar.classList.add("placar-selecionado");
          }
          if (timeSelecionado && mostrarTimes && (dado.time_a === timeSelecionado || dado.time_b === timeSelecionado)) {
            placar.classList.add("time-selecionado");
          }
          if (oddSelecionada && mostrarOdds) {
            const oddElement = placar.querySelector(".odds");
            if (oddElement && oddElement.textContent === oddSelecionada) {
              oddElement.classList.add("odd-selecionada");
            }
          }

          const selecaoResultado = seletorResultado.value;
          let acerto = false;
          const placarAtual = tipoPlacar === "ft" ? placarFT : placarHT;
          const [resultadoA, resultadoB] = placarAtual.split(" x ").map(num => parseInt(num) || 0);

          if (selecaoResultado === "ambasMarcam") {
            acerto = resultadoA > 0 && resultadoB > 0;
          } else if (selecaoResultado === "ambasNaoMarcam") {
            acerto = resultadoA === 0 || resultadoB === 0;
          } else if (selecaoResultado === "over1.5") {
            acerto = resultadoA + resultadoB > 1.5;
          } else if (selecaoResultado === "under1.5") {
            acerto = resultadoA + resultadoB <= 1.5;
          } else if (selecaoResultado === "over2.5") {
            acerto = resultadoA + resultadoB > 2.5;
          } else if (selecaoResultado === "under2.5") {
            acerto = resultadoA + resultadoB <= 2.5;
          } else if (selecaoResultado === "over3.5") {
            acerto = resultadoA + resultadoB > 3.5;
          } else if (selecaoResultado === "under3.5") {
            acerto = resultadoA + resultadoB <= 3.5;
          } else if (selecaoResultado === "over5") {
            acerto = resultadoA + resultadoB >= 5;
          } else if (selecaoResultado === "casaVence") {
            acerto = resultadoA > resultadoB;
          } else if (selecaoResultado === "foraVence") {
            acerto = resultadoB > resultadoA;
          } else if (selecaoResultado === "empate") {
            acerto = resultadoA === resultadoB;
          }

          colunaMinuto.style.backgroundColor = acerto ? "#018b06" : "#be0e02";

          if (acerto) {
            linha.children[linha.children.length - 2].textContent =
              parseInt(linha.children[linha.children.length - 2].textContent) + 1;
            totalAcertosPorColuna[indexMinuto]++;
          }

          const totalGolsCelula = linha.children[linha.children.length - 3];
          const totalGols = resultadoA + resultadoB;
          totalGolsCelula.textContent = parseInt(totalGolsCelula.textContent) + totalGols;

          totalGolsPorColuna[indexMinuto] += totalGols;
        }
      }
    }
  });

  proximosJogosComHoras.forEach(jogo => {
    const dataStr = jogo.captured_date ? jogo.captured_date.split("/").reverse().join("-") : jogo.date.toISOString().split("T")[0];
    const hora = jogo.hora;
    const chave = `${dataStr}-${hora}`;
    const linha = mapeamentoChaveLinha[chave];
    const matchKey = `${jogo.team_home}-${jogo.team_visit}-${chave}-${jogo.minuto}`;

    if (linha && jogo.minuto !== null && !processedMatches.has(matchKey)) {
      const resultadoExistente = dados.find(dado => {
        const dadoData = getDateStr(dado.data);
        return (
          normalizeString(dado.time_a) === normalizeString(jogo.team_home) &&
          normalizeString(dado.time_b) === normalizeString(jogo.team_visit) &&
          dadoData === dataStr &&
          dado.hora === hora &&
          dado.minuto === jogo.minuto
        );
      });

      if (!resultadoExistente) {
        const indexMinuto = minutosFixos.indexOf(jogo.minuto);
        if (indexMinuto !== -1) {
          const colunaMinuto = linha.children[1 + indexMinuto];
          if (!colunaMinuto.querySelector(".placar")) {
            console.log(`Adicionando jogo futuro: ${jogo.team_home} vs ${jogo.team_visit} em ${chave} minuto ${jogo.minuto}`);
            const placar = document.createElement("div");
            placar.className = "placar placar-futuro";
            placar.setAttribute("data-time-a", jogo.team_home);
            placar.setAttribute("data-time-b", jogo.team_visit);

            const placarTexto = document.createElement("div");
            placarTexto.className = "placar-texto";

            if (mostrarTimes) {
              const timeA = abbreviateTeamName(jogo.team_home);
              const timeB = abbreviateTeamName(jogo.team_visit);
              placarTexto.innerHTML = `
                <span class="time-casa" style="cursor: pointer;" data-full-time="${jogo.team_home}">${timeA}</span><br>
                <span>vs</span><br>
                <span class="time-fora" style="cursor: pointer;" data-full-time="${jogo.team_visit}">${timeB}</span>
              `;
            } else {
              const timeA = abbreviateTeamName(jogo.team_home);
              const timeB = abbreviateTeamName(jogo.team_visit);
              placarTexto.innerHTML = `${timeA}<br>vs<br>${timeB}`;
            }
            placar.appendChild(placarTexto);

            placar.addEventListener("click", handlePlacarClick);
            if (mostrarTimes) {
              const timeCasa = placar.querySelector(".time-casa");
              const timeFora = placar.querySelector(".time-fora");
              if (timeCasa) timeCasa.addEventListener("click", handleTimeClick);
              if (timeFora) timeFora.addEventListener("click", handleTimeClick);
            }

            const tooltip = document.createElement("span");
            tooltip.className = "tooltip";
            tooltip.innerHTML = `<span class="times">${jogo.team_home} vs ${jogo.team_visit}</span>`;
            placar.appendChild(tooltip);

            colunaMinuto.appendChild(placar);
            processedMatches.add(matchKey);

            if (timeSelecionado && mostrarTimes && (jogo.team_home === timeSelecionado || jogo.team_visit === timeSelecionado)) {
              placar.classList.add("time-selecionado");
            }

          }
        } else {
          console.warn(`Minuto ${jogo.minuto} não encontrado em minutosFixos para jogo ${jogo.team_home} vs ${jogo.team_visit}`);
        }
      } else {
        console.log(`Jogo ${jogo.team_home} vs ${jogo.team_visit} já tem resultado, não será adicionado como futuro`);
      }
    } else {
      console.warn(`Linha não encontrada para chave ${chave} ou minuto nulo para jogo ${jogo.team_home} vs ${jogo.team_visit}`);
    }
  });

  totalGolsPorColuna.forEach((total, index) => {
    const cell = document.createElement("td");
    cell.className = "total-goals";
    cell.textContent = total;
    linhaTotalGols.appendChild(cell);
  });

  totalAcertosPorColuna.forEach((total, index) => {
    const cell = document.createElement("td");
    cell.className = "market-hits";
    cell.textContent = total;
    linhaAcertosMercado.appendChild(cell);
  });

  for (let i = 0; i < 3; i++) {
    const emptyCellGols = document.createElement("td");
    emptyCellGols.textContent = "";
    linhaTotalGols.appendChild(emptyCellGols);

    const emptyCellMercados = document.createElement("td");
    emptyCellMercados.textContent = "";
    linhaAcertosMercado.appendChild(emptyCellMercados);
  }

  const todasLinhas = Array.from(tabelaBody.querySelectorAll("tr"));
  todasLinhas.forEach((row) => {
    const totalCelsProcessadas = Array.from(row.cells)
      .slice(1, -3)
      .filter((cell) => cell.querySelector(".placar")).length;
    const celsMercado = parseInt(
      row.children[row.children.length - 2].textContent
    );

    const porcentagem =
      totalCelsProcessadas > 0
        ? Math.floor((celsMercado / totalCelsProcessadas) * 100)
        : 0;
    const porcentagemCell = row.children[row.children.length - 1];
    porcentagemCell.textContent = `${porcentagem}%`;

    if (porcentagem >= 50) {
      porcentagemCell.classList.add("porcentagem-verde");
      porcentagemCell.classList.remove("porcentagem-branca");
    } else {
      porcentagemCell.classList.add("porcentagem-branca");
      porcentagemCell.classList.remove("porcentagem-verde");
    }
  });

  const totalColunas = minutosFixos.length;
  const totalMercadosPorColuna = Array(totalColunas).fill(0);

  todasLinhas.forEach((row) => {
    Array.from(row.cells)
      .slice(1, -3)
      .forEach((cell, index) => {
        if (cell.querySelector(".placar")) {
          totalMercadosPorColuna[index]++;
        }
      });
  });

  linhaPercentual.innerHTML = "<th>📈</th>";

  totalMercadosPorColuna.forEach((totalMercados, index) => {
    const cell = document.createElement("td");
    const porcentagemVertical =
      totalMercados > 0
        ? Math.floor((totalAcertosPorColuna[index] / totalMercados) * 100)
        : 0;
    cell.textContent = `${porcentagemVertical}%`;

    if (porcentagemVertical > 49) {
      cell.classList.add("porcentagem-verde");
      cell.classList.remove("porcentagem-branca");
    } else {
      cell.classList.add("porcentagem-branca");
      cell.classList.remove("porcentagem-verde");
    }

    linhaPercentual.appendChild(cell);
  });

  for (let i = 0; i < 3; i++) {
    const emptyCell = document.createElement("td");
    emptyCell.textContent = "";
    linhaPercentual.appendChild(emptyCell);
  }

  const minuteHeaders = document.querySelectorAll("#tabelaResultados thead tr:last-child th.minute-header");
  minuteHeaders.forEach(header => {
    header.style.backgroundColor = "#2c303b";
  });

  const stats = calculateGoalStats(todasLinhas);
  document.getElementById("totalGols").textContent = `Gols: ${stats.totalGols}`;
  document.getElementById("mediaGolsHora").textContent = `Médias: ${stats.mediaGolsHora}`;

  if (placarSelecionado && !mostrarTimes) {
    selecionarPlacaresIguais(placarSelecionado);
  }
  if (timeSelecionado && mostrarTimes) {
    selecionarJogosPorTime(timeSelecionado);
  }
  if (oddSelecionada && mostrarOdds) {
    selecionarOddsIguais(oddSelecionada);
  }
}

async function buscarDados() {
  hideErrorMessage();
  let dados = [];
  let oddsData = [];
  let proximosJogos = [];

  try {
    const resultadosResponse = await fetch("https://betstat.site/resultados/Ta%C3%A7a%20Gl%C3%B3ria%20eterna");
    if (!resultadosResponse.ok) {
      throw new Error(`Erro ao buscar resultados: ${resultadosResponse.status} ${resultadosResponse.statusText}`);
    }
    dados = await resultadosResponse.json();
    console.log("Resultados fetched:", dados);
  } catch (error) {
    console.error("Erro ao buscar resultados:", error);
    showErrorMessage(`Erro ao carregar resultados: ${error.message}`);
  }

  try {
    oddsData = await fetchOdds();
  } catch (error) {
    console.error("Erro ao buscar odds:", error);
    showErrorMessage(`Erro ao carregar odds: ${error.message}. Exibindo tabela sem odds.`);
  }

  try {
    proximosJogos = await fetchProximosJogos();
  } catch (error) {
    console.error("Erro ao buscar próximos jogos:", error);
    showErrorMessage(`Erro ao carregar próximos jogos: ${error.message}. Exibindo tabela sem jogos futuros.`);
  }

  if (dados.length > 0 || proximosJogos.length > 0) {
    criarTabela(dados, oddsData, proximosJogos);
  } else {
    showErrorMessage("Nenhum dado disponível. Verifique a conexão com o servidor.");
  }
}

buscarDados();
setInterval(buscarDados, 5000);

const seletorHoras = document.querySelector("#seletorHoras");
const seletorResultado = document.querySelector("#seletorResultado");
const seletorTipoPlacar = document.querySelector("#seletorTipoPlacar");
const mostrarTimesSelect = document.querySelector("#mostrarTimes");
const mostrarHTSelect = document.querySelector("#mostrarHT");
const mostrarOddsSelect = document.querySelector("#mostrarOdds");

if (seletorHoras) seletorHoras.addEventListener("change", buscarDados);
if (seletorResultado) seletorResultado.addEventListener("change", buscarDados);
if (seletorTipoPlacar) seletorTipoPlacar.addEventListener("change", buscarDados);
if (mostrarTimesSelect) {
  mostrarTimesSelect.addEventListener("change", () => {
    if (mostrarTimesSelect.value !== "sim") {
      placarSelecionado = null;
      timeSelecionado = null;
      localStorage.removeItem("placarSelecionado");
      localStorage.removeItem("timeSelecionado");
      selecionarPlacaresIguais(null);
      selecionarJogosPorTime(null);
    }
    buscarDados();
  });
}
if (mostrarHTSelect) mostrarHTSelect.addEventListener("change", buscarDados);
if (mostrarOddsSelect) {
  mostrarOddsSelect.addEventListener("change", () => {
    if (mostrarOddsSelect.value !== "sim") {
      oddSelecionada = null;
      localStorage.removeItem("oddSelecionada");
      selecionarOddsIguais(null);
    }
    buscarDados();
  });
}