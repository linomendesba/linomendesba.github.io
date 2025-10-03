
(function() {
    const _0x1a2b3c = atob('QUl6YVN5QXdydFl6bFF4ek1mQkhLM2s2c3c1cUFXVFM3akJTU05R');
    const _0x4d5e6f = atob('aHR0cHM6Ly9nZW5lcmF0aXZlbGFuZ3VhZ2UuZ29vZ2xlYXBpcy5jb20vdjFiZXRhL21vZGVscy9nZW1pbmktMi4wLWZsYXNoOmdlbmVyYXRlQ29udGVudA==');
    const _0x2f3a1b = {
        'betano': { name: 'Betano', ligas: ['Taça Glória Eterna', 'Copa América', 'Euro', 'Campeonato Italiano', 'Copa das Estrelas', 'Brasileirão Betano'] },
        'kiron': { name: 'Kiron', ligas: ['England', 'Italy', 'Spain'], path: 'kiron' },
        'estrela': { name: 'Estrelabet', ligas: ['estrela'], path: 'estrela' },
        'betsson': { name: 'Betsson', ligas: ['Espanha', 'Inglaterra', 'Brasil'], path: 'betsson' }
    };
    document.querySelectorAll('.btn-grid').forEach(g => {
        g.addEventListener('click', e => {
            if (e.target.classList.contains('btn')) {
                const c = g.querySelector('.btn.active');
                if (c) { c.classList.remove('active'); }
                e.target.classList.add('active');
                if (g.id === 'casas-group') { _0x5c6d7e(e.target.dataset.value); }
            }
        });
    });
    function _0x5c6d7e(c) {
        const ls = document.getElementById('liga-section');
        const lg = document.getElementById('ligas-group');
        if (!_0x2f3a1b[c]) { ls.style.display = 'none'; return; }
        lg.innerHTML = '';
        _0x2f3a1b[c].ligas.forEach(l => {
            const b = document.createElement('button');
            b.className = 'btn'; b.dataset.value = l; b.textContent = l; lg.appendChild(b);
        });
        ls.style.display = 'block';
    }
    function _0x3e4f5a(id) { const el = document.getElementById(id).querySelector('.btn.active'); return el ? el.dataset.value : null; }
    function _0x1b2c3d(id) { const el = document.getElementById(id).querySelector('.btn.active'); return el ? el.innerText : null; }
    window.limparAnalise = function() {
        document.querySelectorAll('.btn.active').forEach(b => b.classList.remove('active'));
        document.getElementById('observacao').value = '';
        document.getElementById('image-upload').value = '';
        document.getElementById('image-status').textContent = 'Nenhum arquivo selecionado';
        document.getElementById('image-preview').style.display = 'none';
        document.getElementById('result-container').style.display = 'none';
        document.getElementById('liga-section').style.display = 'none';
    };
    function _0x4a5b6c(games, mercado) {
        const s = {};
        games.forEach(g => {
            const { time_a: ta, time_b: tb, ft } = g;
            if (!ft || !ft.includes(' x ')) return;
            const [ga, gb] = ft.split(' x ').map(Number);
            const tg = ga + gb;
            [ta, tb].forEach(t => { if (!s[t]) { s[t] = { name: t, totalGames: 0, marketCount: 0 }; } });
            s[ta].totalGames++; s[tb].totalGames++;
            let m = false;
            switch (mercado) {
                case 'ambasMarcam': m = ga > 0 && gb > 0; break;
                case 'ambasNaoMarcam': m = ga === 0 || gb === 0; break;
                case 'empate': m = ga === gb; break;
                case 'over1.5': m = tg > 1; break;
                case 'under1.5': m = tg < 2; break;
                case 'over2.5': m = tg > 2; break;
                case 'under2.5': m = tg < 3; break;
                case 'over3.5': m = tg > 3; break;
                case 'under3.5': m = tg < 4; break;
                case 'over5': m = tg >= 5; break;
                case 'exact1': m = tg === 1; break;
                case 'exact2': m = tg === 2; break;
                case 'exact3': m = tg === 3; break;
                case 'exact4': m = tg === 4; break;
            }
            if (m) { s[ta].marketCount++; s[tb].marketCount++; }
            if (mercado === 'casaVence' && ga > gb) s[ta].marketCount++;
            if (mercado === 'foraVence' && gb > ga) s[tb].marketCount++;
        });
        const arr = Object.values(s).map(t => ({ ...t, percentage: t.totalGames > 0 ? ((t.marketCount / t.totalGames) * 100).toFixed(1) : "0.0" }));
        arr.sort((a, b) => b.marketCount - a.marketCount || parseFloat(b.percentage) - parseFloat(a.percentage));
        return arr;
    }
    async function _0x5d6e7f(casa, liga, numJogos) {
        const conf = _0x2f3a1b[casa];
        if (!conf) throw new Error(`Casa ${casa} não encontrada`);
        const data = { casa: conf.name, liga: liga, totalJogos: 0, dadosCru: [] };
        try {
            const le = encodeURIComponent(liga);
            const bu = atob('aHR0cHM6Ly9iZXRzdGF0LnNpdGU=');
            let ru, pu;
            if (conf.path) {
                ru = `${bu}/resultados/${conf.path}/${le}`;
                pu = `${bu}/proximos/${conf.path}/${le}`;
            } else {
                ru = `${bu}/resultados/${le}`;
                pu = `${bu}/proximos/${le}`;
            }
            const [res, prox] = await Promise.all([fetch(ru).then(r => r.json()), fetch(pu).then(r => r.json())]);
            const recent = res.slice(-numJogos);
            for (const j of recent) {
                const fs = (j.ft || "x").split("x").map((s) => parseInt(s.trim(), 10));
                const [a, b] = [fs[0], fs[1]];
                if (Number.isFinite(a) && Number.isFinite(b)) { data.dadosCru.push([a, b, a + b, (j.time_a || "").trim(), (j.time_b || "").trim(), j.hora, j.minuto]); }
            }
            data.proximos = prox.slice(0, 6);
            data.totalJogos = data.dadosCru.length;
            return data;
        } catch (error) {
            console.error('Erro API:', error);
            throw new Error(`Falha na API: ${error.message}`);
        }
    }
    const _0x1c2d3e = `self.onmessage=(e)=>{const p=e.data;if(!p||p.cmd!=='analyze')return;const res=analyzeAll(p.payload);self.postMessage({ok:true,id:p.id,result:res})};function enumerateCombos(t){if(t.length===1)return t[0].map(c=>[c]);if(t.length===2){const o=[];for(const a of t[0])for(const b of t[1])o.push([a,b]);return o}if(t.length===3){const o=[];for(const a of t[0])for(const b of t[1])for(const c of t[2])o.push([a,b,c]);return o}const o=[],u=[];(function r(i){if(i===t.length){o.push(u.slice());return}for(const e of t[i]){u.push(e);r(i+1);u.pop()}})(0);return o}function getOffsetsByTipo(t){if(t==='1')return[0];if(t==='2')return[0,1];if(t==='3')return[0,1,2];if(t==='1_pula_1')return[0,2];if(t==='1_pula_1_pula_1')return[0,2,4];return[0,1]}function tokensDoJogo(a,b,l,m,v){const t=new Set();t.add(\`\${a}-\${b}\`);t.add(a>0&&b>0?'ambasMarcam':'ambasNaoMarcam');t.add(a>b?'casaVence':(a<b?'foraVence':'empate'));if(l>=2)t.add('over1.5');if(l<2)t.add('under1.5');if(l>=3)t.add('over2.5');if(l<3)t.add('under2.5');if(l>=4)t.add('over3.5');if(l<4)t.add('under3.5');if(l>=5)t.add('over5');if(l===1)t.add('exact1');if(l===2)t.add('exact2');if(l===3)t.add('exact3');if(l===4)t.add('exact4');if(m)t.add(m.toLowerCase());if(v)t.add(v.toLowerCase());return Array.from(t)}function isGreenForMarket(m,a,b,t){if(m==='ambasMarcam')return a>0&&b>0;if(m==='ambasNaoMarcam')return a===0||b===0;if(m==='casaVence')return a>b;if(m==='foraVence')return a<b;if(m==='empate')return a===b;if(m==='over1.5')return t>=2;if(m==='under1.5')return t<2;if(m==='over2.5')return t>=3;if(m==='under2.5')return t<3;if(m==='over3.5')return t>=4;if(m==='under3.5')return t<4;if(m==='over5')return t>=5;if(m==='exact1')return t===1;if(m==='exact2')return t===2;if(m==='exact3')return t===3;if(m==='exact4')return t===4;return false}function analisarAutoPadroes(d,t,s,m,i,f){const r=[];const o=getOffsetsByTipo(t);const a=o[o.length-1];for(let p=i;p<=f;p++){const c={};const n=(a+1)+p+s;if(d.length<n)continue;for(let j=0;j<=d.length-n;j++){const k=[];for(const x of o){const[v,w,z,m,u]=d[j+x];k.push(tokensDoJogo(v,w,z,m,u))}const b=enumerateCombos(k);let g=false;const h=j+a+1+p,e=h+s;for(let l=h;l<e&&l<d.length;l++){const[v,w,z]=d[l];if(isGreenForMarket(m,v,w,z)){g=true;break}}for(const q of b){const y=q.join(' | ');if(!c[y]){c[y]={ocorrencias:0,greens:0}}c[y].ocorrencias++;if(g)c[y].greens++}}}for(const k in c){const st=c[k];if(st.ocorrencias>=3){r.push({padrao:k,pular_jogos:p,ocorrencias:st.ocorrencias,greens:st.greens,percentual:((st.greens/st.ocorrencias)*100).toFixed(1)})}}r.sort((a,b)=>parseFloat(b.percentual)-parseFloat(a.percentual)||b.ocorrencias-a.ocorrencias);return r.slice(0,15)}function analyzeAll(p){const{dados:d,tiros:t,market:m,combinado:c}=p;const i=c?['2','3','1_pula_1','1_pula_1_pula_1']:['2'];let a=[];for(const s of i){const r=analisarAutoPadroes(d,s,t,m,1,10);r.forEach(x=>x.tipo_padrao=s);a=a.concat(r)}a.sort((x,y)=>parseFloat(y.percentual)-parseFloat(x.percentual)||y.ocorrencias-x.ocorrencias);return{resultados:a.slice(0,15)}}`;
    let _0x2e3f4a = null;
    function _0x3b4c5d() { if (!_0x2e3f4a) { const b = new Blob([_0x1c2d3e], { type: "application/javascript" }); _0x2e3f4a = new Worker(URL.createObjectURL(b)); } return _0x2e3f4a; }
    function _0x4c5d6e(dados, opts) {
        return new Promise((res, rej) => {
            const w = _0x3b4c5d(); const id = Math.random().toString(36).slice(2);
            const onMsg = (ev) => { const msg = ev.data; if (!msg || msg.id !== id) return; w.removeEventListener("message", onMsg); if (msg.ok) res(msg.result); else rej(msg.error || "Erro no worker"); };
            w.addEventListener("message", onMsg);
            w.postMessage({ cmd: "analyze", id, payload: { dados, ...opts } });
        });
    }
    function _0x5f6a7b(v) {
        const m = { 'ambasMarcam':'ambasSim', 'ambasNaoMarcam':'ambasNao', 'casaVence':'casaVence', 'foraVence':'foraVence', 'empate':'empate', 'over1.5':'over1.5', 'over2.5':'over2.5', 'over3.5':'over3.5', 'under1.5':'under1.5', 'under2.5':'under2.5', 'under3.5':'under3.5', 'exact1':'umGolExato', 'exact2':'doisGolsExatos', 'exact3':'tresGolsExatos', 'exact4':'quatroGolsExatos', 'over5':'cincoOuMaisGols' };
        return m[v] || v;
    }
    function _0x1d2e3f(m, h, a, t) {
        switch (m) {
            case 'ambasSim': return h > 0 && a > 0 ? 1 : 0;
            case 'ambasNao': return h === 0 || a === 0 ? 1 : 0;
            case 'casaVence': return h > a ? 1 : 0;
            case 'foraVence': return a > h ? 1 : 0;
            case 'empate': return h === a ? 1 : 0;
            case 'over1.5': return t > 1.5 ? 1 : 0;
            case 'over2.5': return t > 2.5 ? 1 : 0;
            case 'over3.5': return t > 3.5 ? 1 : 0;
            case 'under1.5': return t < 1.5 ? 1 : 0;
            case 'under2.5': return t < 2.5 ? 1 : 0;
            case 'under3.5': return t < 3.5 ? 1 : 0;
            case 'umGolExato': return t === 1 ? 1 : 0;
            case 'doisGolsExatos': return t === 2 ? 1 : 0;
            case 'tresGolsExatos': return t === 3 ? 1 : 0;
            case 'quatroGolsExatos': return t === 4 ? 1 : 0;
            case 'cincoOuMaisGols': return t >= 5 ? 1 : 0;
            default: return 0;
        }
    }
    function _0x2f3a4b(dados, searchedMarket, numberOfGames, linesToSum, verifyLines) {
        const combinedData = dados.dadosCru.map(item => [`${item[5].toString().padStart(2, '0')}:${item[6].toString().padStart(2, '0')}`, item[0], item[1], item[3], item[4], item[2], dados.liga.toLowerCase()]).slice(-numberOfGames);
        if (combinedData.length === 0) { return { currentPercentage: 0, top5: [] }; }
        const recentGames = combinedData.slice(-linesToSum);
        const currentMarketCount = recentGames.reduce((sum, row) => sum + _0x1d2e3f(searchedMarket, row[1], row[2], row[5]), 0);
        const currentPercentage = (currentMarketCount / linesToSum * 100).toFixed(0);
        const marketGroups = {};
        combinedData.forEach((row, i) => {
            if (i >= linesToSum - 1) {
                const sumMarket = combinedData.slice(i - linesToSum + 1, i + 1).reduce((sum, row) => sum + _0x1d2e3f(searchedMarket, row[1], row[2], row[5]), 0);
                const marketPercentage = Math.round(sumMarket / linesToSum * 100);
                let result = "red"; let greens = 0; let reds = 0;
                if (i + verifyLines <= combinedData.length) {
                    const nextRows = combinedData.slice(i + 1, i + 1 + verifyLines);
                    greens = nextRows.filter(row => _0x1d2e3f(searchedMarket, row[1], row[2], row[5]) === 1).length;
                    reds = verifyLines - greens;
                    if (nextRows.some(row => _0x1d2e3f(searchedMarket, row[1], row[2], row[5]) === 1)) { result = "green"; }
                }
                const marketGroup = `${searchedMarket} ${marketPercentage}%`;
                if (!marketGroups[marketGroup]) { marketGroups[marketGroup] = { occurrences: 0, greens: 0, reds: 0, totalGreens: greens, totalReds: reds }; }
                marketGroups[marketGroup].occurrences += 1;
                if (result === "green") { marketGroups[marketGroup].greens += 1; } else { marketGroups[marketGroup].reds += 1; }
                marketGroups[marketGroup].totalGreens = greens;
                marketGroups[marketGroup].totalReds = reds;
            }
        });
        const sortedGroups = Object.keys(marketGroups).map(key => {
            const group = marketGroups[key]; const greenPercentage = (group.greens / group.occurrences * 100).toFixed(2); let analysis = ''; const percentageNum = parseFloat(greenPercentage);
            if (percentageNum > 75) { analysis = 'Alta chance de acerto'; } else if (percentageNum > 50) { analysis = 'Moderada chance'; } else if (percentageNum > 25) { analysis = 'Risco elevado'; } else { analysis = 'Alta chance de falha'; }
            return { marketGroup: key, marketPercentage: parseFloat(key.split(' ')[1]), occurrences: group.occurrences, greens: group.greens, reds: group.reds, greenPercentage: greenPercentage, totalGreens: group.totalGreens, totalReds: group.totalReds, analysis: analysis };
        }).sort((a, b) => b.greenPercentage - a.greenPercentage || b.greens - a.greens).slice(0, 100);
        return { currentPercentage, top5: sortedGroups.slice(0, 5) };
    }
    function _0x3c4d5e(dados, parametros) {
        return `
Você é um analista especialista em futebol virtual, focado em interpretar dados pré-processados para identificar oportunidades de investimento de alto valor.
DADOS PARA ANÁLISE:
- Casa: ${dados.casa}
- Liga: ${dados.liga}
- Mercado: ${parametros.mercado}
- Total de jogos analisados: ${dados.totalJogos}
- Estratégia Martingale: ${parametros.martingale}
- Observações do Usuário: ${parametros.observacao || 'Nenhuma'}
${parametros.imagem ? '- Imagem fornecida: Uma imagem foi enviada e deve ser considerada na análise.' : ''}

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
1.  Sua missão é conectar TODAS as informações acima. Não processe dados brutos, apenas interprete os resultados que eu forneci.
2.  Incorpore ativamente as 'Observações do Usuário' na sua análise. Se o usuário fornecer uma diretriz (ex: "evitar times X e Y" ou "priorizar jogos da noite"), sua justificativa e recomendação final DEVEM refletir essa instrução.
3.  Analise os "TOP 15 PADRÕES". Identifique quais têm o maior percentual de acerto (percentual) e um número sólido de ocorrências. Padrões com 100% de acerto e poucas ocorrências são promissores, mas de alto risco.
4.  Observe os "PRÓXIMOS 6 CONFRONTOS". Verifique se algum desses jogos envolve times que estão bem posicionados no "RANKING DE TIMES".
5.  Cruze as informações: A oportunidade de maior valor acontece quando um padrão forte aponta para um dos próximos confrontos E esse confronto envolve times com bom desempenho histórico no mercado, E está de acordo com as observações do usuário.
6.  Se uma imagem foi fornecida, mencione que ela foi considerada e como ela pode ter influenciado a análise (ex: 'A imagem anexa, que parece mostrar um pico de desempenho recente, reforça a escolha por este mercado'), sem descrever o conteúdo da imagem.
7.  Baseado nesta síntese, gere a sua análise no formato abaixo. O número de sugestões de horários deve seguir a estratégia Martingale (Nenhum = 1 jogo, 1 Cobertura = 2 jogos, etc.).
8.  Se nenhum padrão forte se alinhar com os próximos jogos de times bem ranqueados ou com as observações, seja honesto e informe que nenhuma oportunidade clara foi encontrada.
9.  Para as sugestões de horários: Selecione o próximo confronto que melhor se alinha com padrões fortes e times bem ranqueados como o principal. Em seguida, adicione as coberturas como os confrontos sequenciais seguintes. Garanta que os horários estejam em sequência cronológica crescente e baseados exclusivamente nos próximos confrontos.
10. Inclua uma seção independente para a Análise de Gráfico de Mercado, comentando a porcentagem atual e destacando as top 5 melhores porcentagens.

FORMATO DA RESPOSTA (Use um tom natural e profissional, evite usar negrito com asteriscos **):

🎯 ANÁLISE ESTATÍSTICA
[Comente brevemente sobre o desempenho dos times no ranking e a força geral dos padrões encontrados.]

📊 PADRÕES RELEVANTES
[Destaque 2 ou 3 dos padrões mais promissores, explicando por que são relevantes.]

📈 ANÁLISE DE GRÁFICO DE MERCADO
[Comente sobre a porcentagem atual do mercado e destaque as top 5 melhores porcentagens.]

⚡ PRÓXIMAS OPORTUNIDADES
[Baseado na sua análise combinada e nas observações do usuário, liste as entradas recomendadas. Se nenhuma for encontrada, justifique. Se o usuário fez uma observação, mencione como ela foi aplicada aqui.]
Formato se encontrar:
Liga: [liga]
Mercado: [mercado]
⏰ Horários
▸ [hora:minuto] ▸ [hora:minuto] ... (número baseado na Martingale)
Justificativa: [Explicação da entrada, mencionando o padrão, os times, e como as observações do usuário ou a imagem influenciaram a decisão.]

🎲 ESTRATÉGIA MARTINGALE
[Avalie a segurança da estratégia para este cenário.]

💡 RECOMENDAÇÃO FINAL
[Dê uma recomendação final clara e objetiva, resumindo o porquê da entrada ser ou não recomendada.]
`;
    }
    async function _0x4e5f6a(dados, parametros) {
        const prompt = _0x3c4d5e(dados, parametros);
        const response = await fetch(`${_0x4d5e6f}?key=${_0x1a2b3c}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 2048, }
            })
        });
        if (!response.ok) {
            const err = await response.json();
            console.error("Erro Gemini:", err);
            throw new Error(`Erro API Gemini: ${response.status}`);
        }
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
    window.gerarAnalise = async function() {
        const casa = _0x3e4f5a('casas-group');
        const liga = _0x3e4f5a('ligas-group');
        const mercadoValue = _0x3e4f5a('mercados-group');
        const mercadoText = _0x1b2c3d('mercados-group');
        const martingaleCoberturas = parseInt(_0x3e4f5a('martingale-group') || '0', 10);
        const martingaleText = _0x1b2c3d('martingale-group');
        const periodo = _0x3e4f5a('periodo-group');
        const observacao = document.getElementById('observacao').value;
        const imagem = document.getElementById('image-upload').files[0];
        if (!casa || !liga || !mercadoValue || !periodo) { alert('Por favor, selecione Casa, Liga, Mercado e Período de Análise.'); return; }
        const btn = document.querySelector('.btn-generate');
        const resCont = document.getElementById('result-container');
        const resTitle = document.getElementById('result-title');
        const resContent = document.getElementById('result-content');
        btn.disabled = true;
        btn.innerHTML = '<div class="spinner"></div> Processando...';
        resCont.style.display = 'block';
        resContent.innerHTML = '';
        try {
            resTitle.innerHTML = `<div class="loading"><div class="spinner"></div>Coletando ${periodo} jogos...</div>`;
            const dados = await _0x5d6e7f(casa, liga, parseInt(periodo));
            dados.ranking = _0x4a5b6c(dados.dadosCru.map(j => ({ time_a: j[3], time_b: j[4], ft: `${j[0]} x ${j[1]}` })), mercadoValue);
            resTitle.innerHTML = '<div class="loading"><div class="spinner"></div>Analisando padrões...</div>';
            const tiros = martingaleCoberturas + 1;
            const { resultados } = await _0x4c5d6e(dados.dadosCru, { tiros: tiros, market: mercadoValue, combinado: true });
            dados.padroesEncontrados = resultados;
            const searchedMarket = _0x5f6a7b(mercadoValue);
            const linesToSum = (casa === 'kiron') ? 30 : 20;
            const verifyLines = martingaleCoberturas + 1;
            dados.marketAnalysis = _0x2f3a4b(dados, searchedMarket, dados.totalJogos, linesToSum, verifyLines);
            resTitle.innerHTML = '<div class="loading"><div class="spinner"></div>Gerando análise com IA...</div>';
            const params = { mercado: mercadoText, liga, martingale: martingaleText || 'Nenhum', periodo: periodo + ' jogos', observacao, imagem: !!imagem };
            const analise = await _0x4e5f6a(dados, params);
            resTitle.innerHTML = '✓ Análise Concluída - ' + _0x2f3a1b[casa].name + ' (' + liga + ')';
            resContent.textContent = analise;
        } catch (error) {
            console.error('Erro no processo:', error);
            resTitle.innerHTML = '❌ Erro na Análise';
            resContent.innerHTML = `<div class="error"><strong>Erro:</strong> ${error.message}<br><br><strong>Causas possíveis:</strong> Falha na API BetStat, erro na análise de padrões ou limite da API Gemini atingido. Verifique o console para mais detalhes. Se for erro 404 na Gemini, obtenha uma nova chave API em https://aistudio.google.com/app/apikey e substitua no código.</div>`;
        } finally {
            btn.disabled = false;
            btn.innerHTML = 'Gerar Análise IA';
        }
    };
    document.getElementById('image-upload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const preview = document.getElementById('image-preview');
        const status = document.getElementById('image-status');
        if (file) {
            const reader = new FileReader();
            reader.onload = function(ev) { preview.src = ev.target.result; preview.style.display = 'block'; };
            reader.readAsDataURL(file);
            status.textContent = file.name;
        } else {
            preview.style.display = 'none';
            status.textContent = 'Nenhum arquivo selecionado';
        }
    });
})();