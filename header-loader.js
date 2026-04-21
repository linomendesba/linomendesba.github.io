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
    'day.html': 'betano',
    'betanoradar.html': 'betano',
    'buscadorodd': 'betano',
    'buscadorodd.html': 'betano',
    'buscadortime': 'betano',
    'buscadortime.html': 'betano',
    'betanobuscador': 'betano',
    'betanobuscador.html': 'betano',
    'buscaconfronto': 'betano',
    'buscaconfronto.html': 'betano',
    'manutencao.html': 'betano',
    'referencia.html': 'betano',
    'tv': 'betano',

    // ═══════════════════════════════
    // BET365
    // ═══════════════════════════════
    'bet365copa': 'bet365',
    'referencia.html': 'bet365',
    'day.html': 'bet365',
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

    // ═══════════════════════════════
    // KIRON
    // ═══════════════════════════════
    'kironengland': 'kiron',
    'day.html': 'kiron',
    'referencia.html': 'kiron',
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
    'day.html': 'estrelabet',
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
    'referencia.html': 'estrelabet',
    'estrelabuscador.html': 'estrelabet',

  };

  function detectarCasa() {
    const caminho = window.location.pathname.toLowerCase();
    // Remove barra final e pega o último segmento
    let nomeArquivo = caminho.replace(/\/$/, '').split('/').pop();
    // Remove extensão .html se tiver
    const semExtensao = nomeArquivo.replace('.html', '');

    // Tenta primeiro com extensão, depois sem
    if (MAPEAMENTO_CASAS[nomeArquivo]) return MAPEAMENTO_CASAS[nomeArquivo];
    if (MAPEAMENTO_CASAS[semExtensao]) return MAPEAMENTO_CASAS[semExtensao];

    // Fallback: localStorage ou betano
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

// ⚠️ window.logout é gerenciado pelo auth.js via Firebase signOut
// Não redefinir aqui para não sobrescrever o logout do Firebase