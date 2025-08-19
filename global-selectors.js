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
    // Verificamos se o seletor já tem um manipulador onclick que poderia redirecionar
    const hasRedirectHandler = selector.hasAttribute("onclick") && 
                              selector.getAttribute("onclick").includes("redirecionar");
    
    if (hasRedirectHandler) {
      // Para seletores com redirecionamento, adicionamos um evento que salva antes do redirecionamento
      const originalOnclick = selector.getAttribute("onclick");
      
      // Substituímos o manipulador onclick para primeiro salvar e depois redirecionar
      selector.setAttribute("onclick", `saveSelection('${selector.id}'); ${originalOnclick}`);
    } else {
      // Para seletores sem redirecionamento, adicionamos o evento change normal
      selector.addEventListener("change", () => saveSelection(selector.id));
    }
  });
}

// Função auxiliar para usar no evento beforeunload
function saveAllSelections() {
  const selectors = document.querySelectorAll("select");
  selectors.forEach(selector => {
    if (!excludedSelectors.includes(selector.id)) {
      saveSelection(selector.id);
    }
  });
}

// Inicializa o script ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  restoreSelections();
  setupSelectors();
});

// Tentativa adicional de salvar seleções antes de redirecionar
window.addEventListener("beforeunload", () => {
  saveAllSelections();
});