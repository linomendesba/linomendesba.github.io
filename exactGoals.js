// Lista de novos mercados
const exactGoalsMarkets = ['exactGoals0', 'exactGoals1', 'exactGoals2', 'exactGoals3', 'exactGoals4'];

// Função para verificar se o mercado é de "Gols Exatos"
function isExactGoalsMarket(market) {
  return exactGoalsMarkets.includes(market);
}

// Função para verificar se o mercado "Gols Exatos" foi atingido
function checkExactGoalsMarket(resultadoA, resultadoB, market) {
  const totalGoals = resultadoA + resultadoB;
  switch (market) {
    case 'exactGoals0':
      return totalGoals === 0;
    case 'exactGoals1':
      return totalGoals === 1;
    case 'exactGoals2':
      return totalGoals === 2;
    case 'exactGoals3':
      return totalGoals === 3;
    case 'exactGoals4':
      return totalGoals === 4;
    default:
      return false;
  }
}

// Preserva a função original criarTabela
const originalCriarTabela = window.criarTabela;

// Sobrescreve criarTabela para adicionar lógica dos novos mercados
window.criarTabela = function (dados, oddsData, proximosJogos) {
  const seletorResultado = document.querySelector("#seletorResultado");
  const selecaoResultado = seletorResultado ? seletorResultado.value : '';

  // Se não for um mercado de "Gols Exatos", delega para a função original
  if (!isExactGoalsMarket(selecaoResultado)) {
    return originalCriarTabela(dados, oddsData, proximosJogos);
  }

  // Reutiliza a maior parte da lógica original, mas com modificações para acertos
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

  // Ordena dados por data-hora descendente
  dados.sort((a, b) => {
    const dateStrA = getDateStr(a.data);
    const dateStrB = getDateStr(b.data);
    const dataHoraA = new Date(`${dateStrA}T${a.hora.toString().padStart(2, "0")}:${a.minuto.toString().padStart(2, "0")}:00`).getTime();
    const dataHoraB = new Date(`${dateStrB}T${b.hora.toString().padStart(2, "0")}:${b.minuto.toString().padStart(2, "0")}:00`).getTime();
    return dataHoraB - dataHoraA;
  });

  // Processa proximosJogos
  const proximosJogosComHoras = proximosJogos.map(jogo => {
    const [horaStr, minutoStr] = jogo.time.split(":");
    const hora = parseInt(horaStr, 10);
    const minute = parseInt(minutoStr, 10);
    const closestMinute = minutosFixos.reduce((prev, curr) =>
      Math.abs(curr - minute) < Math.abs(prev - minute) ? curr : prev
    );
    const date = new Date(jogo.start_time);
    return { ...jogo, time: jogo.time, date, hora, minuto: closestMinute, team_visitante: jogo.team_visit };
  }).sort((a, b) => new Date(b.start_time) - new Date(a.start_time));

  // Coletar horas únicas
  const todasHorasComTimestamp = new Set();
  proximosJogosComHoras.forEach(jogo => {
    const dataStr = jogo.captured_date ? jogo.captured_date.split("/").reverse().join("-") : jogo.date.toISOString().split("T")[0];
    const timestamp = new Date(`${dataStr}T${jogo.hora.toString().padStart(2, "0")}:00:00`).getTime();
    todasHorasComTimestamp.add(JSON.stringify({ hora: jogo.hora, timestamp, data: dataStr }));
  });
  dados.forEach(dado => {
    const dateStr = getDateStr(dado.data);
    const timestamp = new Date(`${dateStr}T${dado.hora.toString().padStart(2, "0")}:00:00`).getTime();
    todasHorasComTimestamp.add(JSON.stringify({ hora: dado.hora, timestamp, data: dateStr }));
  });

  const horasUnicas = Array.from(todasHorasComTimestamp)
    .map(str => JSON.parse(str))
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, horasSelecionadas);

  const chavesOrdenadas = horasUnicas.map(item => ({
    chave: `${item.data}-${item.hora}`,
    timestamp: item.timestamp,
    hora: item.hora,
    data: item.data
  }));

  const mapeamentoChaveLinha = {};
  chavesOrdenadas.forEach(item => {
    const chave = item.chave;
    const hora = item.hora;
    const novaLinha = document.createElement("tr");
    novaLinha.setAttribute("data-chave", chave);
    const colunaHora = document.createElement("td");
    colunaHora.textContent = hora.toString().padStart(2, "0");
    novaLinha.appendChild(colunaHora);
    minutosFixos.forEach(() => novaLinha.appendChild(document.createElement("td")));
    novaLinha.appendChild(document.createElement("td")).textContent = "0"; // Total gols
    novaLinha.appendChild(document.createElement("td")).textContent = "0"; // Acertos
    novaLinha.appendChild(document.createElement("td")).textContent = "0%"; // Porcentagem
    tabelaBody.appendChild(novaLinha);
    mapeamentoChaveLinha[chave] = novaLinha;
  });

  const totalGolsPorColuna = Array(minutosFixos.length).fill(0);
  const totalAcertosPorColuna = Array(minutosFixos.length).fill(0);
  const processedMatches = new Set();

  dados.forEach((dado) => {
    const dateStr = getDateStr(dado.data);
    const chave = `${dateStr}-${dado.hora}`;
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
            const oddValue = getOddValue(odds, selecaoResultado);
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

          const placarAtual = tipoPlacar === "ft" ? placarFT : placarHT;
          const [resultadoA, resultadoB] = placarAtual.split(" x ").map(num => parseInt(num) || 0);
          let acerto = checkExactGoalsMarket(resultadoA, resultadoB, selecaoResultado);

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
    const chave = `${dataStr}-${jogo.hora}`;
    const linha = mapeamentoChaveLinha[chave];
    const matchKey = `${jogo.team_home}-${jogo.team_visit}-${chave}-${jogo.minuto}`;

    if (linha && jogo.minuto !== null && !processedMatches.has(matchKey)) {
      const resultadoExistente = dados.find(dado => {
        const dadoData = getDateStr(dado.data);
        return (
          normalizeString(dado.time_a) === normalizeString(jogo.team_home) &&
          normalizeString(dado.time_b) === normalizeString(jogo.team_visit) &&
          dadoData === dataStr &&
          dado.hora === jogo.hora &&
          dado.minuto === jogo.minuto
        );
      });

      if (!resultadoExistente) {
        const indexMinuto = minutosFixos.indexOf(jogo.minuto);
        if (indexMinuto !== -1) {
          const colunaMinuto = linha.children[1 + indexMinuto];
          if (!colunaMinuto.querySelector(".placar")) {
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
              if (timeFora) timeCasa.addEventListener("click", handleTimeClick);
            }

            const tooltip = document.createElement("span");
            tooltip.className = "tooltip";
            tooltip.innerHTML = `<span class="times">${jogo.team_home} vs ${jogo.team_visit}</span>`;
            placar.appendChild(tooltip);

            colunaMinuto.appendChild(placar);
            processedMatches.add(matchKey);
          }
        }
      }
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
      .filter((cell) => cell.querySelector(".placar") && !cell.querySelector(".placar-futuro")).length;
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
        if (cell.querySelector(".placar") && !cell.querySelector(".placar-futuro")) {
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
};