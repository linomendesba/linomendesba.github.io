// header-loader.js - Carrega o header correto baseado na casa de apostas

(function() {
  'use strict';

  // Mapeamento de páginas para casas
  const MAPEAMENTO_CASAS = {
    // BETANO
    'index.html': 'betano',
    'manutencao': 'betano',
    'euro.html': 'betano',
    'copa_america.html': 'betano',
    'copa_das_estrelas.html': 'betano',
    'brasileirao.html': 'betano',
    'campeonato_italiano.html': 'betano',
    
    // BET365
    'bet365copa.html': 'bet365',
    'bet365euro.html': 'bet365',
    'bet365super.html': 'bet365',
    'bet365premier.html': 'bet365',
    
    // KIRON
    'kironbrazil.html': 'kiron',
    'kironengland.html': 'kiron',
    'kironitaly.html': 'kiron',
    'kironamerica.html': 'kiron',
    'kironspain.html': 'kiron',
    
    // ESTRELABET
    'estrelacopamundo.html': 'estrelabet',
    'estrelachampions.html': 'estrelabet',
    'estrelaamericalatina.html': 'estrelabet'
  };

  /**
   * Detecta qual casa de apostas pela URL atual
   */
  function detectarCasa() {
    const caminho = window.location.pathname.toLowerCase();
    const nomeArquivo = caminho.split('/').pop();
    
    if (MAPEAMENTO_CASAS[nomeArquivo]) {
      return MAPEAMENTO_CASAS[nomeArquivo];
    }
    
    return localStorage.getItem('casaSelecionada') || 'betano';
  }

  /**
   * Carrega o header correto
   */
  function carregarHeader() {
    const casa = detectarCasa();
    const headerDiv = document.getElementById('header');
    
    if (!headerDiv) {
      console.error('Elemento #header não encontrado!');
      return;
    }

    localStorage.setItem('casaSelecionada', casa);

const headerFile = `/header-${casa}.html`;
    
    fetch(headerFile)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro ao carregar header: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        headerDiv.innerHTML = html;
        console.log(`Header ${casa} carregado com sucesso!`);
      })
      .catch(error => {
        console.error('Erro ao carregar header:', error);
        headerDiv.innerHTML = '<p style="color: red; padding: 20px;">Erro ao carregar menu de navegação.</p>';
      });
  }

  // Executa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', carregarHeader);
  } else {
    carregarHeader();
  }

})();


// 🔥 FUNÇÕES GLOBAIS (ESSENCIAL PRA FUNCIONAR)

window.redirecionar = function(select) {
  const url = select.value;
  if (url) {
    window.location.href = url;
  }
};

window.voltarHome = function() {
  window.location.href = '/home';
};

window.logout = function() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = '/auth.html';
};