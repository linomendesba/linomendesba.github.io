        const GEMINI_API_KEY = 'AIzaSyAwrtYzlQxzMfBHK3k6sw5qAWTS7jBSSNQ';
        const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

        const casasConfig = {
            'betano': {
                name: 'Betano',
                ligas: ['Taça Glória Eterna', 'Copa América', 'Euro', 'Campeonato Italiano', 'Copa das Estrelas', 'Brasileirão Betano']
            },
            'kiron': { name: 'Kiron', ligas: ['England', 'Italy', 'Spain'], path: 'kiron' },
            'estrela': { name: 'Estrelabet', ligas: ['estrela'], path: 'estrela' },
            'betsson': { name: 'Betsson', ligas: ['Espanha', 'Inglaterra', 'Brasil'], path: 'betsson' }
        };

        document.querySelectorAll('.btn-grid').forEach(group => {
            group.addEventListener('click', event => {
                if (event.target.classList.contains('btn')) {
                    const currentActive = group.querySelector('.btn.active');
                    if (currentActive) {
                        currentActive.classList.remove('active');
                    }
                    event.target.classList.add('active');
                    if (group.id === 'casas-group') {
                        mostrarLigas(event.target.dataset.value);
                    }
                }
            });
        });

        function mostrarLigas(casa) {
            const ligaSection = document.getElementById('liga-section');
            const ligasGroup = document.getElementById('ligas-group');
            if (!casasConfig[casa]) {
                ligaSection.style.display = 'none';
                return;
            }
            ligasGroup.innerHTML = '';
            casasConfig[casa].ligas.forEach(liga => {
                const btn = document.createElement('button');
                btn.className = 'btn';
                btn.dataset.value = liga;
                btn.textContent = liga;
                ligasGroup.appendChild(btn);
            });
            ligaSection.style.display = 'block';
        }

        function getSelectedValue(groupId) {
            const group = document.getElementById(groupId);
            const activeButton = group.querySelector('.btn.active');
            return activeButton ? activeButton.dataset.value : null;
        }

        function getSelectedText(groupId) {
            const group = document.getElementById(groupId);
            const activeButton = group.querySelector('.btn.active');
            return activeButton ? activeButton.innerText : null;
        }

        function limparAnalise() {
            document.querySelectorAll('.btn.active').forEach(btn => btn.classList.remove('active'));
            document.getElementById('observacao').value = '';
            document.getElementById('image-upload').value = '';
            document.getElementById('image-status').textContent = 'Nenhum arquivo selecionado';
            document.getElementById('image-preview').style.display = 'none';
            document.getElementById('result-container').style.display = 'none';
            document.getElementById('liga-section').style.display = 'none';
        }

        function calcularRankingTimes(games, mercado) {
            const teamStats = {};
            games.forEach(game => {
                const { time_a, time_b, ft } = game;
                if (!ft || !ft.includes(' x ')) return;
                const [golsA, golsB] = ft.split(' x ').map(Number);
                const totalGols = golsA + golsB;

                [time_a, time_b].forEach(team => {
                    if (!teamStats[team]) {
                        teamStats[team] = { name: team, totalGames: 0, marketCount: 0 };
                    }
                });

                teamStats[time_a].totalGames++;
                teamStats[time_b].totalGames++;

                let marketOccurred = false;
                switch (mercado) {
                    case 'ambasMarcam':   marketOccurred = golsA > 0 && golsB > 0; break;
                    case 'ambasNaoMarcam':marketOccurred = golsA === 0 || golsB === 0; break;
                    case 'empate':        marketOccurred = golsA === golsB; break;
                    case 'over1.5':       marketOccurred = totalGols > 1; break;
                    case 'under1.5':      marketOccurred = totalGols < 2; break;
                    case 'over2.5':       marketOccurred = totalGols > 2; break;
                    case 'under2.5':      marketOccurred = totalGols < 3; break;
                    case 'over3.5':       marketOccurred = totalGols > 3; break;
                    case 'under3.5':      marketOccurred = totalGols < 4; break;
                    case 'over5':         marketOccurred = totalGols >= 5; break;
                    case 'exact1':        marketOccurred = totalGols === 1; break;
                    case 'exact2':        marketOccurred = totalGols === 2; break;
                    case 'exact3':        marketOccurred = totalGols === 3; break;
                    case 'exact4':        marketOccurred = totalGols === 4; break;
                }

                if (marketOccurred) {
                    teamStats[time_a].marketCount++;
                    teamStats[time_b].marketCount++;
                }
                if (mercado === 'casaVence' && golsA > golsB) teamStats[time_a].marketCount++;
                if (mercado === 'foraVence' && golsB > golsA) teamStats[time_b].marketCount++;
            });

            const statsArray = Object.values(teamStats).map(team => ({
                ...team,
                percentage: team.totalGames > 0 ? ((team.marketCount / team.totalGames) * 100).toFixed(1) : "0.0"
            }));

            statsArray.sort((a, b) => b.marketCount - a.marketCount || parseFloat(b.percentage) - parseFloat(a.percentage));
            return statsArray;
        }

        async function buscarDadosAPI(casa, liga, numJogos) {
            const config = casasConfig[casa];
            if (!config) throw new Error(`Casa ${casa} não encontrada`);

            const dadosCompletos = { casa: config.name, liga: liga, totalJogos: 0, dadosCru: [] };
            try {
                const ligaEncoded = encodeURIComponent(liga);
                const baseUrl = 'https://betstat.site';
                let resultadosUrl, proximosUrl;
                
                if (config.path) {
                    resultadosUrl = `${baseUrl}/resultados/${config.path}/${ligaEncoded}`;
                    proximosUrl = `${baseUrl}/proximos/${config.path}/${ligaEncoded}`;
                } else {
                    resultadosUrl = `${baseUrl}/resultados/${ligaEncoded}`;
                    proximosUrl = `${baseUrl}/proximos/${ligaEncoded}`;
                }

                const [resultados, proximos] = await Promise.all([
                    fetch(resultadosUrl).then(r => r.json()),
                    fetch(proximosUrl).then(r => r.json())
                ]);

                const jogosRecentes = resultados.slice(-numJogos);
                
                for (const jogo of jogosRecentes) {
                    const ftScore = (jogo.ft || "x").split("x").map((s) => parseInt(s.trim(), 10));
                    const a = ftScore[0], b = ftScore[1];
                    if (Number.isFinite(a) && Number.isFinite(b)) {
                        dadosCompletos.dadosCru.push([a, b, a + b, (jogo.time_a || "").trim(), (jogo.time_b || "").trim(), jogo.hora, jogo.minuto]);
                    }
                }

                dadosCompletos.proximos = proximos.slice(0, 6);
                dadosCompletos.totalJogos = dadosCompletos.dadosCru.length;
                return dadosCompletos;
            } catch (error) {
                console.error('Erro ao buscar dados da API:', error);
                throw new Error(`Falha ao conectar com a API: ${error.message}`);
            }
        }

        const ANALYZE_WORKER_SRC = `
        self.onmessage = (e) => {
            const p = e.data;
            if (!p || p.cmd !== 'analyze') return;
            const res = analyzeAll(p.payload);
            self.postMessage({ ok: true, id: p.id, result: res });
        };
        function enumerateCombos(tok){
            if(tok.length===1) return tok[0].map(t=>[t]);
            if(tok.length===2){ const out=[]; for(const a of tok[0]) for(const b of tok[1]) out.push([a,b]); return out; }
            if(tok.length===3){ const out=[]; for(const a of tok[0]) for(const b of tok[1]) for(const c of tok[2]) out.push([a,b,c]); return out; }
            const out=[],cur=[];
            (function rec(i){ if(i===tok.length){ out.push(cur.slice()); return; } for(const t of tok[i]){ cur.push(t); rec(i+1); cur.pop(); } })(0);
            return out;
        }
        function getOffsetsByTipo(t){
            if(t==='1') return [0];
            if(t==='2') return [0,1];
            if(t==='3') return [0,1,2];
            if(t==='1_pula_1') return [0,2];
            if(t==='1_pula_1_pula_1') return [0,2,4];
            return [0,1];
        }
        function tokensDoJogo(a,b,total,mandante,visitante){
            const t = new Set();
            t.add(\`\${a}-\${b}\`);
            t.add(a > 0 && b > 0 ? 'ambasMarcam' : 'ambasNaoMarcam');
            t.add(a > b ? 'casaVence' : (a < b ? 'foraVence' : 'empate'));
            if (total >= 2) t.add('over1.5'); if (total < 2) t.add('under1.5');
            if (total >= 3) t.add('over2.5'); if (total < 3) t.add('under2.5');
            if (total >= 4) t.add('over3.5'); if (total < 4) t.add('under3.5');
            if (total >= 5) t.add('over5');
            if (total === 1) t.add('exact1');
            if (total === 2) t.add('exact2');
            if (total === 3) t.add('exact3');
            if (total === 4) t.add('exact4');
            if (mandante) t.add(mandante.toLowerCase());
            if (visitante) t.add(visitante.toLowerCase());
            return Array.from(t);
        }
        function isGreenForMarket(m,a,b,total){
            if (m === 'ambasMarcam') return a > 0 && b > 0;
            if (m === 'ambasNaoMarcam') return a === 0 || b === 0;
            if (m === 'casaVence') return a > b;
            if (m === 'foraVence') return a < b;
            if (m === 'empate') return a === b;
            if (m === 'over1.5') return total >= 2;
            if (m === 'under1.5') return total < 2;
            if (m === 'over2.5') return total >= 3;
            if (m === 'under2.5') return total < 3;
            if (m === 'over3.5') return total >= 4;
            if (m === 'under3.5') return total < 4;
            if (m === 'over5') return total >= 5;
            if (m === 'exact1') return total === 1;
            if (m === 'exact2') return total === 2;
            if (m === 'exact3') return total === 3;
            if (m === 'exact4') return total === 4;
            return false;
        }
        function analisarAutoPadroes(dados,tipo,tiros,market,inicio,fim){
            const res=[]; const offs=getOffsetsByTipo(tipo); const last=offs[offs.length-1];
            for(let p=inicio;p<=fim;p++){
                const comb={}; const need=(last+1)+p+tiros; if(dados.length<need) continue;
                for(let i=0;i<=dados.length-need;i++){
                    const tok=[];
                    for(const o of offs){
                        const [a,b,t,mandante,visitante]=dados[i+o];
                        tok.push(tokensDoJogo(a,b,t,mandante,visitante));
                    }
                    const combos=enumerateCombos(tok);
                    let green=false;
                    const ini=i+last+1+p, fimA=ini+tiros;
                    for(let j=ini;j<fimA&&j<dados.length;j++){
                        const [a,b,sum]=dados[j];
                        if(isGreenForMarket(market,a,b,sum)){ green=true; break; }
                    }
                    for(const seq of combos){
                        const key=seq.join(' | ');
                        if(!comb[key]){ comb[key]={ocorrencias:0,greens:0}; }
                        comb[key].ocorrencias++; if(green) comb[key].greens++;
                    }
                }
                for(const k in comb){
                    const st=comb[k];
                    if(st.ocorrencias>=3){
                        res.push({ padrao:k, pular_jogos:p, ocorrencias:st.ocorrencias, greens:st.greens, percentual:((st.greens/st.ocorrencias)*100).toFixed(1) });
                    }
                }
            }
            res.sort((a,b)=>parseFloat(b.percentual)-parseFloat(a.percentual)||b.ocorrencias-a.ocorrencias);
            return res.slice(0,15);
        }
        function analyzeAll(payload){
            const { dados, tiros, market, combinado } = payload;
            const tipos = combinado ? ['2','3','1_pula_1','1_pula_1_pula_1'] : ['2'];
            let todos=[];
            for(const t of tipos){
                const r = analisarAutoPadroes(dados, t, tiros, market, 1, 10);
                r.forEach(x=>x.tipo_padrao=t);
                todos = todos.concat(r);
            }
            todos.sort((a,b)=>parseFloat(b.percentual)-parseFloat(a.percentual)||b.ocorrencias-a.ocorrencias);
            return { resultados: todos.slice(0,15) };
        }
        `;
        let ANALYZE_WORKER = null;
        function getAnalyzeWorker() {
            if (!ANALYZE_WORKER) {
                const blob = new Blob([ANALYZE_WORKER_SRC], { type: "application/javascript" });
                ANALYZE_WORKER = new Worker(URL.createObjectURL(blob));
            }
            return ANALYZE_WORKER;
        }
        function analyzeInWorker(dados, opts) {
            return new Promise((resolve, reject) => {
                const w = getAnalyzeWorker();
                const id = Math.random().toString(36).slice(2);
                const onMsg = (ev) => {
                    const msg = ev.data;
                    if (!msg || msg.id !== id) return;
                    w.removeEventListener("message", onMsg);
                    if (msg.ok) resolve(msg.result);
                    else reject(msg.error || "Erro no worker de análise");
                };
                w.addEventListener("message", onMsg);
                w.postMessage({ cmd: "analyze", id, payload: { dados, ...opts } });
            });
        }

        function mapMercado(mercadoValue) {
            const map = {
                'ambasMarcam': 'ambasSim',
                'ambasNaoMarcam': 'ambasNao',
                'casaVence': 'casaVence',
                'foraVence': 'foraVence',
                'empate': 'empate',
                'over1.5': 'over1.5',
                'over2.5': 'over2.5',
                'over3.5': 'over3.5',
                'under1.5': 'under1.5',
                'under2.5': 'under2.5',
                'under3.5': 'under3.5',
                'exact1': 'umGolExato',
                'exact2': 'doisGolsExatos',
                'exact3': 'tresGolsExatos',
                'exact4': 'quatroGolsExatos',
                'over5': 'cincoOuMaisGols'
            };
            return map[mercadoValue] || mercadoValue;
        }

        function checkMarket(market, homeGoals, awayGoals, totalGoals) {
            switch (market) {
                case 'ambasSim':
                    return homeGoals > 0 && awayGoals > 0 ? 1 : 0;
                case 'ambasNao':
                    return homeGoals === 0 || awayGoals === 0 ? 1 : 0;
                case 'casaVence':
                    return homeGoals > awayGoals ? 1 : 0;
                case 'foraVence':
                    return awayGoals > homeGoals ? 1 : 0;
                case 'empate':
                    return homeGoals === awayGoals ? 1 : 0;
                case 'over1.5':
                    return totalGoals > 1.5 ? 1 : 0;
                case 'over2.5':
                    return totalGoals > 2.5 ? 1 : 0;
                case 'over3.5':
                    return totalGoals > 3.5 ? 1 : 0;
                case 'under1.5':
                    return totalGoals < 1.5 ? 1 : 0;
                case 'under2.5':
                    return totalGoals < 2.5 ? 1 : 0;
                case 'under3.5':
                    return totalGoals < 3.5 ? 1 : 0;
                case 'umGolExato':
                    return totalGoals === 1 ? 1 : 0;
                case 'doisGolsExatos':
                    return totalGoals === 2 ? 1 : 0;
                case 'tresGolsExatos':
                    return totalGoals === 3 ? 1 : 0;
                case 'quatroGolsExatos':
                    return totalGoals === 4 ? 1 : 0;
                case 'cincoOuMaisGols':
                    return totalGoals >= 5 ? 1 : 0;
                default:
                    return 0;
            }
        }

        function calculateMarketAnalysis(dados, searchedMarket, numberOfGames, linesToSum, verifyLines) {
            const combinedData = dados.dadosCru.map(item => [
                `${item[5].toString().padStart(2, '0')}:${item[6].toString().padStart(2, '0')}`,
                item[0],
                item[1],
                item[3],
                item[4],
                item[2],
                dados.liga.toLowerCase()
            ]).slice(-numberOfGames);

            if (combinedData.length === 0) {
                return { currentPercentage: 0, top5: [] };
            }


            const recentGames = combinedData.slice(-linesToSum);
            const currentMarketCount = recentGames.reduce((sum, row) => sum + checkMarket(searchedMarket, row[1], row[2], row[5]), 0);
            const currentPercentage = (currentMarketCount / linesToSum * 100).toFixed(0);

            const marketGroups = {};
            combinedData.forEach((row, i) => {
                const [dateTime, homeGoals, awayGoals, homeTeam, awayTeam, totalGoals, league] = row;

                if (i >= linesToSum - 1) {
                    const sumMarket = combinedData.slice(i - linesToSum + 1, i + 1).reduce((sum, row) => sum + checkMarket(searchedMarket, row[1], row[2], row[5]), 0);
                    const marketPercentage = Math.round(sumMarket / linesToSum * 100);

                    let result = "red";
                    let greens = 0;
                    let reds = 0;
                    if (i + verifyLines <= combinedData.length) {
                        const nextRows = combinedData.slice(i + 1, i + 1 + verifyLines);
                        greens = nextRows.filter(row => checkMarket(searchedMarket, row[1], row[2], row[5]) === 1).length;
                        reds = verifyLines - greens;
                        const searchResult = nextRows.some(row => checkMarket(searchedMarket, row[1], row[2], row[5]) === 1);
                        if (searchResult) {
                            result = "green";
                        }
                    }

                    const marketGroup = `${searchedMarket} ${marketPercentage}%`;
                    if (!marketGroups[marketGroup]) {
                        marketGroups[marketGroup] = { occurrences: 0, greens: 0, reds: 0, totalGreens: greens, totalReds: reds };
                    }
                    marketGroups[marketGroup].occurrences += 1;
                    if (result === "green") {
                        marketGroups[marketGroup].greens += 1;
                    } else {
                        marketGroups[marketGroup].reds += 1;
                    }
                    marketGroups[marketGroup].totalGreens = greens;
                    marketGroups[marketGroup].totalReds = reds;
                }
            });

            const sortedGroups = Object.keys(marketGroups).map(key => {
                const group = marketGroups[key];
                const greenPercentage = (group.greens / group.occurrences * 100).toFixed(2);
                let analysis = '';
                const percentageNum = parseFloat(greenPercentage);
                if (percentageNum > 75) {
                    analysis = 'Alta chance de acerto';
                } else if (percentageNum > 50) {
                    analysis = 'Moderada chance';
                } else if (percentageNum > 25) {
                    analysis = 'Risco elevado';
                } else {
                    analysis = 'Alta chance de falha';
                }

                return {
                    marketGroup: key,
                    marketPercentage: parseFloat(key.split(' ')[1]),
                    occurrences: group.occurrences,
                    greens: group.greens,
                    reds: group.reds,
                    greenPercentage: greenPercentage,
                    totalGreens: group.totalGreens,
                    totalReds: group.totalReds,
                    analysis: analysis
                };
            }).sort((a, b) => b.greenPercentage - a.greenPercentage || b.greens - a.greens).slice(0, 100);

            const top5 = sortedGroups.slice(0, 5);

            return { currentPercentage, top5 };
        }

        function criarPromptAnalise(dados, parametros) {
            return `
Você é um analista especialista em futebol virtual, focado em interpretar dados pré-processados para identificar oportunidades de investimento de alto valor.

DADOS PARA ANÁLISE:
- Casa: ${dados.casa}
- Liga: ${dados.liga}
- Mercado: ${parametros.mercado}
- Total de jogos analisados: ${dados.totalJogos}
- Estratégia Martingale: ${parametros.martingale}
- Observações do Usuário: ${parametros.observacao || 'Nenhuma'}
${parametros.imagem ? '- Imagem fornecida: Uma imagem foi enviada para análise adicional.' : ''}

INFORMAÇÕES PRÉ-PROCESSADAS:

1. RANKING DE TIMES PARA O MERCADO "${parametros.mercado}" (Top 10):
${JSON.stringify(dados.ranking.slice(0, 10), null, 2)}

2. TOP 15 PADRÕES ENCONTRADOS PARA O MERCADO "${parametros.mercado}":
${JSON.stringify(dados.padroesEncontrados, null, 2)}

3. PRÓXIMOS 6 CONFRONTOS:
${JSON.stringify(dados.proximos, null, 2)}

4. ANÁLISE DE GRÁFICO DE MERCADO PARA O MERCADO "${parametros.mercado}":
Porcentagem Atual: ${dados.marketAnalysis.currentPercentage}%
Top 5 Melhores Porcentagens:
${JSON.stringify(dados.marketAnalysis.top5, null, 2)}

INSTRUÇÕES DE ANÁLISE (SUA TAREFA):
1.  Sua missão é conectar as informações acima. Não processe dados brutos, apenas interprete os resultados que eu forneci.
2.  Analise os "TOP 15 PADRÕES". Identifique quais têm o maior percentual de acerto (percentual) e um número sólido de ocorrências. Padrões com 100% de acerto e poucas ocorrências são promissores, mas de alto risco.
3.  Observe os "PRÓXIMOS 6 CONFRONTOS". Verifique se algum desses jogos envolve times que estão bem posicionados no "RANKING DE TIMES".
4.  Cruze as informações: A oportunidade de maior valor acontece quando um padrão forte aponta para um dos próximos confrontos E esse confronto envolve times com bom desempenho histórico no mercado.
5.  Se uma imagem foi fornecida, considere que ela pode conter informações visuais complementares (como estatísticas ou gráficos) e mencione que ela foi considerada na análise, mas não tente descrevê-la diretamente.
6.  Baseado nesta síntese, gere a sua análise no formato abaixo. O número de sugestões de horários deve seguir a estratégia Martingale (Nenhum = 1 jogo, 1 Cobertura = 2 jogos, 2 Coberturas = 3 jogos, 3 Coberturas = 4 jogos).
7.  Se nenhum padrão forte se alinhar com os próximos jogos de times bem ranqueados, seja honesto e informe que nenhuma oportunidade clara foi encontrada.
8.  Para as sugestões de horários: Selecione o próximo confronto que melhor se alinha com padrões fortes e times bem ranqueados como o principal. Em seguida, adicione as coberturas como os confrontos sequenciais seguintes. Garanta que os horários estejam em sequência cronológica crescente, sem repetições, e baseados exclusivamente nos horários fornecidos nos próximos confrontos. Assuma que a lista de próximos está ordenada por tempo, e selecione apenas horários futuros ou os mais próximos. O primeiro horário é o principal com padrão e análise, os demais são coberturas.
9.  Inclua uma seção independente para a Análise de Gráfico de Mercado, comentando a porcentagem atual e destacando as top 5 melhores porcentagens, considerando o Martingale selecionado para a verificação.

FORMATO DA RESPOSTA (Use um tom natural e profissional, evite usar negrito com asteriscos **):

🎯 ANÁLISE ESTATÍSTICA
[Comente brevemente sobre o desempenho dos times no ranking e a força geral dos padrões encontrados. Ex: "Observa-se que os times X e Y são dominantes neste mercado. Foram encontrados N padrões com mais de 80% de acerto, indicando consistência..."]

📊 PADRÕES RELEVANTES
[Destaque 2 ou 3 dos padrões mais promissores da lista, explicando por que são relevantes. Ex: "O padrão 'over2.5 | 1-2' se destaca com 85% de acerto em 20 ocorrências, mostrando ser um gatilho confiável..."]

📈 ANÁLISE DE GRÁFICO DE MERCADO
[Comente sobre a porcentagem atual do mercado e destaque as top 5 melhores porcentagens, incluindo greenPercentage, occurrences, etc., considerando o Martingale selecionado para a verificação de linhas.]

⚡ PRÓXIMAS OPORTUNIDADES
[Baseado na sua análise combinada, liste as entradas recomendadas. Se nenhuma for encontrada, justifique o motivo.
Formato se encontrar:
Liga: [liga]
Mercado: [mercado]
⏰ Horários
▸ [hora:minuto] ▸ [hora:minuto] ... (número baseado na Martingale, em sequência sem repetições)
Justificativa: [Breve explicação do porquê esta é uma boa entrada, mencionando o padrão e os times envolvidos. Note que o primeiro horário é o principal onde padrões foram encontrados, os demais são coberturas sequenciais.]

🎲 ESTRATÉGIA MARTINGALE
[Avalie a segurança da estratégia para este cenário. Ex: "Considerando a força dos padrões encontrados, a estratégia de [N] coberturas parece [segura/arriscada]..."]

💡 RECOMENDAÇÃO FINAL
[Dê uma recomendação final clara e objetiva. Ex: "Recomendo a entrada nos horários sugeridos devido à forte confluência entre o padrão X e o confronto envolvendo o time Y, que possui um histórico excelente neste mercado."]
`;
        }

        async function analisarComGemini(dados, parametros) {
            const prompt = criarPromptAnalise(dados, parametros);
            const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    }
                })
            });
            if (!response.ok) {
                const errorBody = await response.json();
                console.error("Erro na API Gemini:", errorBody);
                throw new Error(`Erro na API do Gemini: ${response.status}`);
            }
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        }

        async function gerarAnalise() {
            const casa = getSelectedValue('casas-group');
            const liga = getSelectedValue('ligas-group');
            const mercadoValue = getSelectedValue('mercados-group');
            const mercadoText = getSelectedText('mercados-group');
            const martingaleCoberturas = parseInt(getSelectedValue('martingale-group') || '0', 10);
            const martingaleText = getSelectedText('martingale-group');
            const periodo = getSelectedValue('periodo-group');
            const observacao = document.getElementById('observacao').value;
            const imagem = document.getElementById('image-upload').files[0];

            if (!casa || !liga || !mercadoValue || !periodo) {
                alert('Por favor, selecione Casa, Liga, Mercado e Período de Análise.');
                return;
            }

            const generateBtn = document.querySelector('.btn-generate');
            const resultContainer = document.getElementById('result-container');
            const resultTitle = document.getElementById('result-title');
            const resultContent = document.getElementById('result-content');

            generateBtn.disabled = true;
            generateBtn.innerHTML = '<div class="spinner"></div> Processando...';
            resultContainer.style.display = 'block';
            resultContent.innerHTML = '';
            
            try {
                resultTitle.innerHTML = `<div class="loading"><div class="spinner"></div>Coletando ${periodo} jogos...</div>`;
                const dados = await buscarDadosAPI(casa, liga, parseInt(periodo));
                
                dados.ranking = calcularRankingTimes(dados.dadosCru.map(j => ({time_a: j[3], time_b: j[4], ft: `${j[0]} x ${j[1]}`})), mercadoValue);
                
                resultTitle.innerHTML = '<div class="loading"><div class="spinner"></div>Analisando padrões...</div>';
                const tiros = martingaleCoberturas + 1;
                const { resultados } = await analyzeInWorker(dados.dadosCru, {
                    tiros: tiros,
                    market: mercadoValue,
                    combinado: true 
                });
                dados.padroesEncontrados = resultados;
                

                const searchedMarket = mapMercado(mercadoValue);
                const linesToSum = (casa === 'kiron') ? 30 : 20; 
                const verifyLines = martingaleCoberturas + 1;
                dados.marketAnalysis = calculateMarketAnalysis(dados, searchedMarket, dados.totalJogos, linesToSum, verifyLines);
                
                resultTitle.innerHTML = '<div class="loading"><div class="spinner"></div>Gerando análise com IA...</div>';
                const parametros = {
                    mercado: mercadoText,
                    liga,
                    martingale: martingaleText || 'Nenhum',
                    periodo: periodo + ' jogos',
                    observacao,
                    imagem: imagem ? true : false
                };
                const analise = await analisarComGemini(dados, parametros);
                
                resultTitle.innerHTML = '✓ Análise Concluída - ' + casasConfig[casa].name + ' (' + liga + ')';
                resultContent.textContent = analise;

            } catch (error) {
                console.error('Erro no processo de análise:', error);
                resultTitle.innerHTML = '❌ Erro na Análise';
                resultContent.innerHTML = `<div class="error">
                    <strong>Erro:</strong> ${error.message}<br><br>
                    <strong>Causas possíveis:</strong> Falha na API BetStat, erro na análise de padrões ou limite da API Gemini atingido. Verifique o console para mais detalhes. Se for erro 404 na Gemini, obtenha uma nova chave API em https://aistudio.google.com/app/apikey e substitua no código. Além disso, verifique se o nome do modelo está correto (ex: gemini-2.5-flash).
                </div>`;
            } finally {
                generateBtn.disabled = false;
                generateBtn.innerHTML = 'Gerar Análise IA';
            }
        }

        document.getElementById('image-upload').addEventListener('change', function(event) {
            const file = event.target.files[0];
            const preview = document.getElementById('image-preview');
            const status = document.getElementById('image-status');
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
                status.textContent = file.name;
            } else {
                preview.style.display = 'none';
                status.textContent = 'Nenhum arquivo selecionado';
            }
        });