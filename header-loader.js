// header-loader.js

(function() {
  'use strict';

  function carregarHeader() {
    const headerDiv = document.getElementById('header');
    
    if (!headerDiv) {
      console.error('Elemento #header não encontrado!');
      return;
    }

    fetch('/header.html')
      .then(response => {
        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        return response.text();
      })
      .then(html => {
        headerDiv.innerHTML = html;
      })
      .catch(error => {
        console.error('Erro ao carregar header:', error);
        headerDiv.innerHTML = '<p style="color:red;padding:20px;">Erro ao carregar menu.</p>';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', carregarHeader);
  } else {
    carregarHeader();
  }

})();

// Funções globais
window.redirecionar = function(select) {
  const url = select.value;
  if (url) window.location.href = url;
};

window.voltarHome = function() {
  window.location.href = '/home';
};

window.logout = function() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = '/auth.html';
};