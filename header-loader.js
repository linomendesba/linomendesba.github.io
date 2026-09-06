// header-loader.js - Carrega o header correto baseado na casa de apostas

(function() {
  'use strict';

  const MAPEAMENTO_CASAS = {

    // ═══════════════════════════════
    // BETANO
    // ═══════════════════════════════
    'index': 'betano',
    'index.html': 'betano',
    'euro': 'betano',
    'euro.html': 'betano',
    'copa_america': 'betano',
    'copa_america.html': 'betano',
    'copa_das_estrelas': 'betano',
    'copa_das_estrelas.html': 'betano',
    'brasileirao': 'betano',
    'brasileirao.html': 'betano',
    'campeonato_italiano': 'betano',
    'campeonato_italiano.html': 'betano',
    'manutencao': 'betano',
    'manutencao.html': 'betano',
    'betanopre': 'betano',
    'betanopre.html': 'betano',
    'fluxo': 'betano',
    'fluxo.html': 'betano',
    'maximabetano': 'betano',
    'maximabetano.html': 'betano',
    'ranking': 'betano',
    'ranking.html': 'betano',
    'equipes': 'betano',
    'equipes.html': 'betano',
    'palpites': 'betano',
    'palpites.html': 'betano',
    'gols': 'betano',
    'gols.html': 'betano',
    'betanobar': 'betano',
    'betanobar.html': 'betano',
    'betanofixo': 'betano',
    'betanofixo.html': 'betano',
    'ligastat': 'betano',
    'ligastat.html': 'betano',
    'multbetano': 'betano',
    'multbetano.html': 'betano',
    'localizai': 'betano',
    'localizai.html': 'betano',
    'timeminuto': 'betano',
    'timeminuto.html': 'betano',
    'betanotips': 'betano',
    'betanotips.html': 'betano',
    'simulador': 'betano',
    'simulador.html': 'betano',
    'porcentagembetano': 'betano',
    'porcentagembetano.html': 'betano',
    'classificacao': 'betano',
    'classificacao.html': 'betano',
    'sequencia': 'betano',
    'sequencia.html': 'betano',
    'betanofiboexato': 'betano',
    'betanofiboexato.html': 'betano',
    'betanofiboht': 'betano',
    'betanofiboht.html': 'betano',
    'graficosgols': 'betano',
    'graficosgols.html': 'betano',
    'graficoodd': 'betano',
    'graficoodd.html': 'betano',
    'graficotime': 'betano',
    'graficotime.html': 'betano',
    'macrobetano': 'betano',
    'macrobetano.html': 'betano',
    'quadrantesgols': 'betano',
    'quadrantesgols.html': 'betano',
    'betanoradar': 'betano',
    'betanoradar.html': 'betano',
    'day.html': 'betano',
    'buscadorodd': 'betano',
    'buscadorodd.html': 'betano',
    'buscadortime': 'betano',
    'buscadortime.html': 'betano',
    'betanobuscador': 'betano',
    'betanobuscador.html': 'betano',
    'buscaconfronto': 'betano',
    'buscaconfronto.html': 'betano',
    'referencia.html': 'betano',
    'tv': 'betano',

    // ═══════════════════════════════
    // BET365
    // ═══════════════════════════════
    'bet365copa': 'bet365',
    'bet365copa.html': 'bet365',
    'bet365premier': 'bet365',
    'bet365premier.html': 'bet365',
    'bet365super': 'bet365',
    'bet365super.html': 'bet365',
    'bet365euro': 'bet365',
    'bet365euro.html': 'bet365',
    'bet365pre': 'bet365',
    'bet365pre.html': 'bet365',
    'mult365': 'bet365',
    'mult365.html': 'bet365',
    '365localizai': 'bet365',
    '365localizai.html': 'bet365',
    '365fluxo': 'bet365',
    '365fluxo.html': 'bet365',
    '365maximas': 'bet365',
    '365maximas.html': 'bet365',
    '365raking': 'bet365',
    '365raking.html': 'bet365',
    '365equipes': 'bet365',
    '365equipes.html': 'bet365',
    '365palpites': 'bet365',
    '365palpites.html': 'bet365',
    '365gols': 'bet365',
    '365gols.html': 'bet365',
    '365bar': 'bet365',
    '365bar.html': 'bet365',
    '365fixo': 'bet365',
    '365fixo.html': 'bet365',
    '365stat': 'bet365',
    '365stat.html': 'bet365',
    '365timeminuto': 'bet365',
    '365timeminuto.html': 'bet365',
    '365projecoes': 'bet365',
    '365projecoes.html': 'bet365',
    '365porcent': 'bet365',
    '365porcent.html': 'bet365',
    'bet365clasificacao': 'bet365',
    'bet365clasificacao.html': 'bet365',
    '365sequencia': 'bet365',
    '365sequencia.html': 'bet365',
    '365radar': 'bet365',
    '365radar.html': 'bet365',
    '365ft': 'bet365',
    '365ft.html': 'bet365',
    '365ht': 'bet365',
    '365ht.html': 'bet365',
    '365gf': 'bet365',
    '365gf.html': 'bet365',
    '365gratime': 'bet365',
    '365gratime.html': 'bet365',
    '365macro': 'bet365',
    '365macro.html': 'bet365',
    '365qua': 'bet365',
    '365qua.html': 'bet365',
    '365buscatime': 'bet365',
    '365buscatime.html': 'bet365',
    '365placar': 'bet365',
    '365placar.html': 'bet365',
    '365odds': 'bet365',
    '365odds.html': 'bet365',
    '365confronto': 'bet365',
    '365confronto.html': 'bet365',
    '365buscador': 'bet365',
    '365buscador.html': 'bet365',
    '365maximaconfronto': 'bet365',
    '365maximaconfronto.html': 'bet365',
    '365fiboht': 'bet365',
    '365fiboht.html': 'bet365',
    '365tips': 'bet365',
    '365tips.html': 'bet365',
    '365fiboexato': 'bet365',
    '365fiboexato.html': 'bet365',
    'porcentagem365': 'bet365',
    'porcentagem365.html': 'bet365',
    'maxima365': 'bet365',
    'maxima365.html': 'bet365',

    // ═══════════════════════════════
    // BETSSON
    // ═══════════════════════════════
    'betssonespanha': 'betsson',
    'betssonespanha.html': 'betsson',
    'betssoningland': 'betsson',
    'betssoningland.html': 'betsson',
    'betssonbrasil': 'betsson',
    'betssonbrasil.html': 'betsson',
    'betssonpre': 'betsson',
    'betssonpre.html': 'betsson',
    'multbetsson': 'betsson',
    'multbetsson.html': 'betsson',
    'betssonlocalizai': 'betsson',
    'betssonlocalizai.html': 'betsson',
    'betssonfluxo': 'betsson',
    'betssonfluxo.html': 'betsson',
    'betssonmaximas': 'betsson',
    'betssonmaximas.html': 'betsson',
    'betssonranking': 'betsson',
    'betssonranking.html': 'betsson',
    'betssonequipes': 'betsson',
    'betssonequipes.html': 'betsson',
    'betssonpalpites': 'betsson',
    'betssonpalpites.html': 'betsson',
    'betssonbar': 'betsson',
    'betssonbar.html': 'betsson',
    'betssonstat': 'betsson',
    'betssonstat.html': 'betsson',
    'betssonft': 'betsson',
    'betssonft.html': 'betsson',
    'betssonht': 'betsson',
    'betssonht.html': 'betsson',
    'betssonprojecoes': 'betsson',
    'betssonprojecoes.html': 'betsson',
    'betssonporcent': 'betsson',
    'betssonporcent.html': 'betsson',
    'betssonclassificacao': 'betsson',
    'betssonclassificacao.html': 'betsson',
    'betssonsequencia': 'betsson',
    'betssonsequencia.html': 'betsson',
    'betssonradar': 'betsson',
    'betssonradar.html': 'betsson',
    'betssongols': 'betsson',
    'betssongols.html': 'betsson',
    'betssongf': 'betsson',
    'betssongf.html': 'betsson',
    'betssongratime': 'betsson',
    'betssongratime.html': 'betsson',
    'betssonmacro': 'betsson',
    'betssonmacro.html': 'betsson',
    'betssonqua': 'betsson',
    'betssonqua.html': 'betsson',
    'betssonbuscatime': 'betsson',
    'betssonbuscatime.html': 'betsson',
    'betssonplacar': 'betsson',
    'betssonplacar.html': 'betsson',
    'betssonodds': 'betsson',
    'betssonodds.html': 'betsson',
    'betssonconfonto': 'betsson',
    'betssonconfonto.html': 'betsson',
    'betssonduelo': 'betsson',
    'betssonduelo.html': 'betsson',
    'betssonfixo': 'betsson',
    'betssonfixo.html': 'betsson',
    'betssonbuscador': 'betsson',
    'betssonbuscador.html': 'betsson',
    'betssonminuto': 'betsson',
    'betssonminuto.html': 'betsson',
    'betssonclassifica': 'betsson',
    'betssonclassifica.html': 'betsson',

    // ═══════════════════════════════
    // KIRON
    // ═══════════════════════════════
    'kironengland': 'kiron',
    'kironengland.html': 'kiron',
    'kironitaly': 'kiron',
    'kironitaly.html': 'kiron',
    'kironspain': 'kiron',
    'kironspain.html': 'kiron',
    'kironbrazil': 'kiron',
    'kironbrazil.html': 'kiron',
    'kironamerica': 'kiron',
    'kironamerica.html': 'kiron',
    'kironpre': 'kiron',
    'kironpre.html': 'kiron',
    'tvkiron': 'kiron',
    'kironfluxo': 'kiron',
    'kironfluxo.html': 'kiron',
    'maximaskiron': 'kiron',
    'maximaskiron.html': 'kiron',
    'rankingkiron': 'kiron',
    'rankingkiron.html': 'kiron',
    'kironequipes': 'kiron',
    'kironequipes.html': 'kiron',
    'kironpalpites': 'kiron',
    'kironpalpites.html': 'kiron',
    'golskiron': 'kiron',
    'golskiron.html': 'kiron',
    'kironbar': 'kiron',
    'kironbar.html': 'kiron',
    'fixokiron': 'kiron',
    'fixokiron.html': 'kiron',
    'ligastatkiron': 'kiron',
    'ligastatkiron.html': 'kiron',
    'multkiron': 'kiron',
    'multkiron.html': 'kiron',
    'localizaikiron': 'kiron',
    'localizaikiron.html': 'kiron',
    'kironminuto': 'kiron',
    'kironminuto.html': 'kiron',
    'kironprojecao': 'kiron',
    'kironprojecao.html': 'kiron',
    'porcentagemkiron': 'kiron',
    'porcentagemkiron.html': 'kiron',
    'classificacaokiron': 'kiron',
    'classificacaokiron.html': 'kiron',
    'kironsequencia': 'kiron',
    'kironsequencia.html': 'kiron',
    'kirongf': 'kiron',
    'kirongf.html': 'kiron',
    'kironft': 'kiron',
    'kironft.html': 'kiron',
    'kironht': 'kiron',
    'kironht.html': 'kiron',
    'kirongraficoood': 'kiron',
    'kirongraficoood.html': 'kiron',
    'kirongraficotime': 'kiron',
    'kirongraficotime.html': 'kiron',
    'kironmacro': 'kiron',
    'kironmacro.html': 'kiron',
    'kironquadrantes': 'kiron',
    'kironquadrantes.html': 'kiron',
    'kironradar': 'kiron',
    'kironradar.html': 'kiron',
    'buscadoroddkiron': 'kiron',
    'buscadoroddkiron.html': 'kiron',
    'buscadortimekiron': 'kiron',
    'buscadortimekiron.html': 'kiron',
    'kironbuscador': 'kiron',
    'kironbuscador.html': 'kiron',
    'kironduelo': 'kiron',
    'kironduelo.html': 'kiron',

    // ═══════════════════════════════
    // ESTRELABET
    // ═══════════════════════════════
    'estrelachampions': 'estrelabet',
    'estrelachampions.html': 'estrelabet',
    'estrelacopamundo': 'estrelabet',
    'estrelacopamundo.html': 'estrelabet',
    'estrelaamericalatina': 'estrelabet',
    'estrelaamericalatina.html': 'estrelabet',
    'estrelapre': 'estrelabet',
    'estrelapre.html': 'estrelabet',
    'estrelafluxo': 'estrelabet',
    'estrelafluxo.html': 'estrelabet',
    'estrelatv': 'estrelabet',
    'estrelatv.html': 'estrelabet',
    'golsestrela': 'estrelabet',
    'golsestrela.html': 'estrelabet',
    'estrelabar': 'estrelabet',
    'estrelabar.html': 'estrelabet',
    'maximaestrela': 'estrelabet',
    'maximaestrela.html': 'estrelabet',
    'estrelaequipes': 'estrelabet',
    'estrelaequipes.html': 'estrelabet',
    'rankingestrela': 'estrelabet',
    'rankingestrela.html': 'estrelabet',
    'estrelamult': 'estrelabet',
    'estrelamult.html': 'estrelabet',
    'estrelapalpites': 'estrelabet',
    'estrelapalpites.html': 'estrelabet',
    'estrelastat': 'estrelabet',
    'estrelastat.html': 'estrelabet',
    'localizaistar': 'estrelabet',
    'localizaistar.html': 'estrelabet',
    'estrelaprojecoes': 'estrelabet',
    'estrelaprojecoes.html': 'estrelabet',
    'estrelafixo': 'estrelabet',
    'estrelafixo.html': 'estrelabet',
    'estrelaodds': 'estrelabet',
    'estrelaodds.html': 'estrelabet',
    'estrelaft': 'estrelabet',
    'estrelaft.html': 'estrelabet',
    'estrelagf': 'estrelabet',
    'estrelagf.html': 'estrelabet',
    'estrelaght': 'estrelabet',
    'estrelaght.html': 'estrelabet',
    'estrelasimulador': 'estrelabet',
    'estrelasimulador.html': 'estrelabet',
    'estrelasequencia': 'estrelabet',
    'estrelasequencia.html': 'estrelabet',
    'estrelaquadrante': 'estrelabet',
    'estrelaquadrante.html': 'estrelabet',
    'porcentagemstar': 'estrelabet',
    'porcentagemstar.html': 'estrelabet',
    'estrelaclassificacao': 'estrelabet',
    'estrelaclassificacao.html': 'estrelabet',
    'estrelatimeminuto': 'estrelabet',
    'estrelatimeminuto.html': 'estrelabet',
    'estrelamacro': 'estrelabet',
    'estrelamacro.html': 'estrelabet',
    'estrelaclassifica': 'estrelabet',
    'estrelaclassifica.html': 'estrelabet',
    'estrelaradar': 'estrelabet',
    'estrelaradar.html': 'estrelabet',
    'buscadoroddstar': 'estrelabet',
    'buscadoroddstar.html': 'estrelabet',
    'estreladuelo': 'estrelabet',
    'estreladuelo.html': 'estrelabet',
    'buscadortimestar': 'estrelabet',
    'buscadortimestar.html': 'estrelabet',
    'estrelabuscador': 'estrelabet',
    'estrelabuscador.html': 'estrelabet',

  };

  function detectarCasa() {
    const caminho = window.location.pathname.toLowerCase();
    let nomeArquivo = caminho.replace(/\/$/, '').split('/').pop();
    const semExtensao = nomeArquivo.replace('.html', '');

    if (MAPEAMENTO_CASAS[nomeArquivo]) return MAPEAMENTO_CASAS[nomeArquivo];
    if (MAPEAMENTO_CASAS[semExtensao]) return MAPEAMENTO_CASAS[semExtensao];

    return localStorage.getItem('casaSelecionada') || 'betano';
  }

  function carregarHeader() {
    const headerDiv = document.getElementById('header');

    if (!headerDiv) {
      console.error('Elemento #header não encontrado!');
      return;
    }

    const casa = detectarCasa();
    localStorage.setItem('casaSelecionada', casa);

    const headerFile = `/header-${casa}.html`;

    fetch(headerFile)
      .then(response => {
        if (!response.ok) throw new Error(`Erro ao carregar header: ${response.status}`);
        return response.text();
      })
      .then(html => {
        headerDiv.innerHTML = html;
        console.log(`✅ Header "${casa}" carregado com sucesso!`);
        // Se o status da assinatura já tiver chegado antes do header terminar
        // de carregar (comum, já que os dois fetches rodam em paralelo),
        // aplica o valor em cache assim que o badge existir no DOM.
        if (window.__statusAssinatura) {
          window.atualizarBadgeAssinatura(window.__statusAssinatura);
        }
      })
      .catch(error => {
        console.error('Erro ao carregar header:', error);
        headerDiv.innerHTML = '<p style="color:red;padding:20px;">Erro ao carregar menu de navegação.</p>';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', carregarHeader);
  } else {
    carregarHeader();
  }

})();


// ═══════════════════════════════════════
// FUNÇÕES GLOBAIS
// ═══════════════════════════════════════

window.redirecionar = function(select) {
  const url = select.value;
  if (url) window.location.href = url;
};

window.voltarHome = function() {
  window.location.href = '/home';
};

// ═══════════════════════════════════════
// BADGE DE DIAS RESTANTES DA ASSINATURA
// Alimentado pelo evento 'betstat:assinatura-status', disparado pelo
// firebase-auth.js sempre que ele consulta /meu-status (login e a cada
// 5 min) — nenhum fetch extra é feito aqui.
// ═══════════════════════════════════════
window.atualizarBadgeAssinatura = function(dados) {
  const el = document.getElementById('dias-restantes');
  if (!el || !dados) return;
  const txt = el.querySelector('.dias-txt');
  const dias = dados.dias;

  let cor, texto;
  if (dias === null || dias === undefined) {
    cor = 'cinza';
    texto = 'Assinatura: sem dados';
  } else if (dias < 0) {
    const abs = Math.abs(dias);
    cor = 'vermelho';
    texto = `Venceu há ${abs} dia${abs !== 1 ? 's' : ''}`;
  } else if (dias <= 5) {
    cor = 'amarelo';
    texto = `${dias} dia${dias !== 1 ? 's' : ''} restante${dias !== 1 ? 's' : ''}`;
  } else {
    cor = 'verde';
    texto = `${dias} dias restantes`;
  }

  el.className = 'dias-badge dias-' + cor;
  txt.textContent = texto;
};

window.addEventListener('betstat:assinatura-status', (e) => window.atualizarBadgeAssinatura(e.detail));

// ⚠️ window.logout é gerenciado pelo auth.js via Firebase signOut
// Não redefinir aqui para não sobrescrever o logout do Firebase