// Lista de seletores que não devem ser salvos
const excludedSelectors = [
  "ligas",
  "avancado-betano",
  "ligas365",
  "avancado-bet365",
  "redes",
  "pointsSelector",
  "pointsSelectorGolsPlus",
  "averageSelector",
  "averageSelectorGolsPlus"
];

// Salva a seleção no LocalStorage, exceto para os seletores excluídos
function saveSelection(selectorId) {
  const selector = document.getElementById(selectorId);
  if (selector && !excludedSelectors.includes(selectorId)) {
    const selectedValue = selector.value;
    localStorage.setItem(selectorId, selectedValue);
  }
}

// Restaura as seleções do LocalStorage, exceto para os seletores excluídos
function restoreSelections() {
  const selectors = document.querySelectorAll("select");
  selectors.forEach(selector => {
    if (!excludedSelectors.includes(selector.id)) {
      const savedValue = localStorage.getItem(selector.id);
      if (savedValue) {
        selector.value = savedValue;
      }
    }
  });
}

// Adiciona eventos onchange para salvar automaticamente as alterações
function setupSelectors() {
  const selectors = document.querySelectorAll("select");
  selectors.forEach(selector => {
    selector.addEventListener("change", () => saveSelection(selector.id));
  });
}

// Função de redirecionamento (assumindo que já existe/No seu código)
function redirecionar(selector) {
  if (selector.value) {
    window.location.href = selector.value;
  }
}

// Função de logout (assumindo que já existe no seu código)
function logout() {
  // Implemente sua lógica de logout aqui
  console.log("Logout realizado");
}

// Inicializa o script ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  restoreSelections();
  setupSelectors();
});