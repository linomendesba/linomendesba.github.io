// Lista de seletores que não devem ser salvos
const excludedSelectors = [
  "ligas",
  "avancado-betano",
  "ligas365",
  "avancado-bet365",
  "redes",
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

// Funções para salvar e restaurar o estado do accordion (assumindo uso da classe 'collapsed' para estado fechado)
function saveAccordionState(accordionId) {
  const button = document.getElementById(accordionId);
  if (button) {
    const isOpen = !button.classList.contains('collapsed');
    localStorage.setItem(accordionId + '_state', isOpen ? 'open' : 'closed');
  }
}

function restoreAccordionState(accordionId) {
  const button = document.getElementById(accordionId);
  if (button) {
    const savedState = localStorage.getItem(accordionId + '_state');
    const isCurrentlyOpen = !button.classList.contains('collapsed');
    if ((savedState === 'open' && !isCurrentlyOpen) || (savedState === 'closed' && isCurrentlyOpen)) {
      toggleAccordion(button);
    }
  }
}

// Configura o evento onclick do accordion para salvar o estado após toggle
function setupAccordion(accordionId) {
  const button = document.getElementById(accordionId);
  if (button) {
    const originalOnclick = button.onclick;
    button.onclick = function() {
      originalOnclick.call(this);
      saveAccordionState(accordionId);
    };
  }
}

// Inicializa o script ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  restoreSelections();
  setupSelectors();
  restoreAccordionState('accordionGols');
  setupAccordion('accordionGols');
});

// Tentativa adicional de salvar seleções antes de redirecionar
window.addEventListener("beforeunload", () => {
  saveAllSelections();
});