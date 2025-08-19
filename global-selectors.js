// Lista de seletores que não devem ser salvos
const excludedSelectors = [
  "ligas",
  "avancado-betano",
  "ligas365",
  "avancado-bet365",
  "redes"
];

// Verifica se é o acordeão específico que deve ser salvo
function isTargetAccordion(buttonElement) {
  return buttonElement.textContent.includes("Tendência Gols / Mercados");
}

// Salva o estado do acordeão (apenas para o acordeão específico)
function saveAccordionState(buttonElement) {
  if (!isTargetAccordion(buttonElement)) return;
  
  const accordionContent = buttonElement.nextElementSibling;
  const isOpen = accordionContent && accordionContent.style.display !== "none";
  
  localStorage.setItem('accordion_tendencia_gols_mercados', isOpen);
}

// Restaura o estado do acordeão (apenas para o acordeão específico)
function restoreAccordionState() {
  const accordionButtons = document.querySelectorAll('.accordion-button');
  
  accordionButtons.forEach(button => {
    if (isTargetAccordion(button)) {
      const savedState = localStorage.getItem('accordion_tendencia_gols_mercados');
      
      if (savedState !== null) {
        const isOpen = savedState === 'true';
        const accordionContent = button.nextElementSibling;
        
        if (accordionContent) {
          if (isOpen) {
            accordionContent.style.display = "block";
            button.textContent = button.textContent.replace('▼', '▲');
          } else {
            accordionContent.style.display = "none";
            button.textContent = button.textContent.replace('▲', '▼');
          }
        }
      }
    }
  });
}

// Função melhorada para toggle do acordeão que salva o estado (apenas para o acordeão específico)
function toggleAccordion(buttonElement) {
  const accordionContent = buttonElement.nextElementSibling;
  
  if (accordionContent.style.display === "none" || accordionContent.style.display === "") {
    accordionContent.style.display = "block";
    buttonElement.textContent = buttonElement.textContent.replace('▼', '▲');
  } else {
    accordionContent.style.display = "none";
    buttonElement.textContent = buttonElement.textContent.replace('▲', '▼');
  }
  
  // Salva o estado apenas se for o acordeão específico
  if (isTargetAccordion(buttonElement)) {
    saveAccordionState(buttonElement);
    
    // Salva também os seletores dentro do acordeão específico
    const selectorsInAccordion = accordionContent.querySelectorAll('select, input[type="checkbox"]');
    selectorsInAccordion.forEach(element => {
      if (!excludedSelectors.includes(element.id)) {
        saveSelection(element.id);
      }
    });
  }
}

// Salva a seleção no LocalStorage, exceto para os seletores excluídos
function saveSelection(elementId) {
  const element = document.getElementById(elementId);
  if (element && !excludedSelectors.includes(elementId)) {
    if (element.type === 'checkbox') {
      localStorage.setItem(elementId, element.checked);
    } else {
      localStorage.setItem(elementId, element.value);
    }
  }
}

// Restaura as seleções do LocalStorage, exceto para os seletores excluídos
function restoreSelections() {
  // Restaura selects
  const selectors = document.querySelectorAll("select");
  selectors.forEach(selector => {
    if (!excludedSelectors.includes(selector.id)) {
      const savedValue = localStorage.getItem(selector.id);
      if (savedValue) {
        selector.value = savedValue;
        
        // Dispara o evento change para carregar os dados
        const changeEvent = new Event('change', { bubbles: true });
        selector.dispatchEvent(changeEvent);
        
        // Também tenta disparar eventos personalizados se existirem
        if (selector.onchange) {
          selector.onchange();
        }
      }
    }
  });
  
  // Restaura checkboxes
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    if (!excludedSelectors.includes(checkbox.id)) {
      const savedValue = localStorage.getItem(checkbox.id);
      if (savedValue !== null) {
        checkbox.checked = savedValue === 'true';
        
        // Dispara o evento change para checkboxes também
        const changeEvent = new Event('change', { bubbles: true });
        checkbox.dispatchEvent(changeEvent);
        
        if (checkbox.onchange) {
          checkbox.onchange();
        }
      }
    }
  });
}

// Adiciona eventos onchange para salvar automaticamente as alterações
function setupSelectors() {
  // Setup para selects
  const selectors = document.querySelectorAll("select");
  selectors.forEach(selector => {
    // Verifica se o seletor está dentro do acordeão específico
    const accordionButton = selector.closest('.accordion-content')?.previousElementSibling;
    const isInTargetAccordion = accordionButton && isTargetAccordion(accordionButton);
    
    // Só adiciona eventos se estiver no acordeão específico ou não estiver em nenhum acordeão
    if (isInTargetAccordion || !accordionButton) {
      // Verificamos se o seletor já tem um manipulador onchange que poderia redirecionar
      const hasRedirectHandler = selector.hasAttribute("onchange") &&
                                 selector.getAttribute("onchange").includes("redirecionar");
          
      if (hasRedirectHandler) {
        // Para seletores com redirecionamento, adicionamos um evento que salva antes do redirecionamento
        const originalOnchange = selector.getAttribute("onchange");
              
        // Substituímos o manipulador onchange para primeiro salvar e depois redirecionar
        selector.setAttribute("onchange", `saveSelection('${selector.id}'); ${originalOnchange}`);
      } else {
        // Para seletores sem redirecionamento, adicionamos o evento change normal
        selector.addEventListener("change", () => {
          saveSelection(selector.id);
          
          // Se estiver no acordeão específico, salva o estado do acordeão
          if (isInTargetAccordion) {
            saveAccordionState(accordionButton);
          }
        });
      }
    }
  });
  
  // Setup para checkboxes
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    // Verifica se o checkbox está dentro do acordeão específico
    const accordionButton = checkbox.closest('.accordion-content')?.previousElementSibling;
    const isInTargetAccordion = accordionButton && isTargetAccordion(accordionButton);
    
    // Só adiciona eventos se estiver no acordeão específico ou não estiver em nenhum acordeão
    if (isInTargetAccordion || !accordionButton) {
      checkbox.addEventListener("change", () => {
        saveSelection(checkbox.id);
        
        // Se estiver no acordeão específico, salva o estado do acordeão
        if (isInTargetAccordion) {
          saveAccordionState(accordionButton);
        }
      });
    }
  });
}

// Função auxiliar para usar no evento beforeunload
function saveAllSelections() {
  // Salva selects (apenas os que estão no acordeão específico)
  const selectors = document.querySelectorAll("select");
  selectors.forEach(selector => {
    const accordionButton = selector.closest('.accordion-content')?.previousElementSibling;
    const isInTargetAccordion = accordionButton && isTargetAccordion(accordionButton);
    
    if (!excludedSelectors.includes(selector.id) && (isInTargetAccordion || !accordionButton)) {
      saveSelection(selector.id);
    }
  });
  
  // Salva checkboxes (apenas os que estão no acordeão específico)
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    const accordionButton = checkbox.closest('.accordion-content')?.previousElementSibling;
    const isInTargetAccordion = accordionButton && isTargetAccordion(accordionButton);
    
    if (!excludedSelectors.includes(checkbox.id) && (isInTargetAccordion || !accordionButton)) {
      saveSelection(checkbox.id);
    }
  });
  
  // Salva apenas o estado do acordeão específico
  const accordionButtons = document.querySelectorAll('.accordion-button');
  accordionButtons.forEach(button => {
    if (isTargetAccordion(button)) {
      saveAccordionState(button);
    }
  });
}

// Função para limpar dados salvos (útil para debug/reset)
function clearSavedData() {
  // Remove selects salvos (apenas os do acordeão específico)
  const selectors = document.querySelectorAll("select");
  selectors.forEach(selector => {
    const accordionButton = selector.closest('.accordion-content')?.previousElementSibling;
    const isInTargetAccordion = accordionButton && isTargetAccordion(accordionButton);
    
    if (!excludedSelectors.includes(selector.id) && (isInTargetAccordion || !accordionButton)) {
      localStorage.removeItem(selector.id);
    }
  });
  
  // Remove checkboxes salvos (apenas os do acordeão específico)
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    const accordionButton = checkbox.closest('.accordion-content')?.previousElementSibling;
    const isInTargetAccordion = accordionButton && isTargetAccordion(accordionButton);
    
    if (!excludedSelectors.includes(checkbox.id) && (isInTargetAccordion || !accordionButton)) {
      localStorage.removeItem(checkbox.id);
    }
  });
  
  // Remove apenas o estado do acordeão específico
  localStorage.removeItem('accordion_tendencia_gols_mercados');
}

// Inicializa o script ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  restoreAccordionState();
  
  // Pequeno delay para garantir que todos os elementos estejam prontos
  setTimeout(() => {
    restoreSelections();
    setupSelectors();
  }, 100);
});

// Tentativa adicional de salvar seleções antes de redirecionar
window.addEventListener("beforeunload", () => {
  saveAllSelections();
});