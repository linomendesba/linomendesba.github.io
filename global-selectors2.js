// ---> NOVO: Lista de páginas onde o script deve funcionar
const allowedPages = [
  "kironengland.html",
  "kironitaly.html",
  "kironspain.html"
];

// ---> NOVO: Pega o nome do arquivo da URL atual
const currentPage = window.location.pathname.split('/').pop();

// ---> NOVO: Executa todo o código somente se a página atual estiver na lista de permitidas
if (allowedPages.includes(currentPage)) {

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

  // ---> MODIFICADO: Salva o estado do acordeão com um prefixo de página
  function saveAccordionState(buttonElement) {
    if (!isTargetAccordion(buttonElement)) return;

    const accordionContent = buttonElement.nextElementSibling;
    const isOpen = accordionContent && accordionContent.style.display !== "none";

    // Prefixo com o nome da página para isolar o dado
    localStorage.setItem(`accordion_state_${currentPage}`, isOpen);
  }

  // ---> MODIFICADO: Restaura o estado do acordeão com o prefixo de página
  function restoreAccordionState() {
    const accordionButtons = document.querySelectorAll('.accordion-button');

    accordionButtons.forEach(button => {
      if (isTargetAccordion(button)) {
        // Busca o dado isolado da página atual
        const savedState = localStorage.getItem(`accordion_state_${currentPage}`);

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

  // Função melhorada para toggle do acordeão
  function toggleAccordion(buttonElement) {
    const accordionContent = buttonElement.nextElementSibling;

    if (accordionContent.style.display === "none" || accordionContent.style.display === "") {
      accordionContent.style.display = "block";
      buttonElement.textContent = buttonElement.textContent.replace('▼', '▲');
    } else {
      accordionContent.style.display = "none";
      buttonElement.textContent = buttonElement.textContent.replace('▲', '▼');
    }

    if (isTargetAccordion(buttonElement)) {
      saveAccordionState(buttonElement);

      const selectorsInAccordion = accordionContent.querySelectorAll('select, input[type="checkbox"]');
      selectorsInAccordion.forEach(element => {
        if (!excludedSelectors.includes(element.id)) {
          saveSelection(element.id);
        }
      });
    }
  }

  // ---> MODIFICADO: Salva a seleção com um prefixo de página
  function saveSelection(elementId) {
    const element = document.getElementById(elementId);
    if (element && !excludedSelectors.includes(elementId)) {
      const key = `${currentPage}_${elementId}`; // Cria chave única: "kironengland.html_meu-seletor"
      if (element.type === 'checkbox') {
        localStorage.setItem(key, element.checked);
      } else {
        localStorage.setItem(key, element.value);
      }
    }
  }

  // ---> MODIFICADO: Restaura as seleções com o prefixo de página
  function restoreSelections() {
    // Restaura selects
    const selectors = document.querySelectorAll("select");
    selectors.forEach(selector => {
      if (!excludedSelectors.includes(selector.id)) {
        const key = `${currentPage}_${selector.id}`;
        const savedValue = localStorage.getItem(key);
        if (savedValue) {
          selector.value = savedValue;
          const changeEvent = new Event('change', { bubbles: true });
          selector.dispatchEvent(changeEvent);
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
        const key = `${currentPage}_${checkbox.id}`;
        const savedValue = localStorage.getItem(key);
        if (savedValue !== null) {
          checkbox.checked = savedValue === 'true';
          const changeEvent = new Event('change', { bubbles: true });
          checkbox.dispatchEvent(changeEvent);
          if (checkbox.onchange) {
            checkbox.onchange();
          }
        }
      }
    });
  }

  // Adiciona eventos onchange para salvar automaticamente as alterações (lógica interna inalterada)
  function setupSelectors() {
    // Setup para selects
    const selectors = document.querySelectorAll("select");
    selectors.forEach(selector => {
      const accordionButton = selector.closest('.accordion-content')?.previousElementSibling;
      const isInTargetAccordion = accordionButton && isTargetAccordion(accordionButton);

      if (isInTargetAccordion || !accordionButton) {
        const hasRedirectHandler = selector.hasAttribute("onclick") &&
                                 selector.getAttribute("onclick").includes("redirecionar");

        if (hasRedirectHandler) {
          const originalOnclick = selector.getAttribute("onclick");
          selector.setAttribute("onclick", `saveSelection('${selector.id}'); ${originalOnclick}`);
        } else {
          selector.addEventListener("change", () => {
            saveSelection(selector.id);
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
      const accordionButton = checkbox.closest('.accordion-content')?.previousElementSibling;
      const isInTargetAccordion = accordionButton && isTargetAccordion(accordionButton);
      
      if (isInTargetAccordion || !accordionButton) {
        checkbox.addEventListener("change", () => {
          saveSelection(checkbox.id);
          if (isInTargetAccordion) {
            saveAccordionState(accordionButton);
          }
        });
      }
    });
  }
  
  // Função auxiliar para usar no evento beforeunload (lógica interna inalterada)
  function saveAllSelections() {
    const allElements = document.querySelectorAll("select, input[type='checkbox']");
    allElements.forEach(element => {
      const accordionButton = element.closest('.accordion-content')?.previousElementSibling;
      const isInTargetAccordion = accordionButton && isTargetAccordion(accordionButton);
      if (!excludedSelectors.includes(element.id) && (isInTargetAccordion || !accordionButton)) {
        saveSelection(element.id);
      }
    });

    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
      if (isTargetAccordion(button)) {
        saveAccordionState(button);
      }
    });
  }

  // Inicializa o script ao carregar a página
  window.addEventListener("DOMContentLoaded", () => {
    restoreAccordionState();
    setTimeout(() => {
      restoreSelections();
      setupSelectors();
    }, 100);
  });

  // Salva seleções antes de redirecionar
  window.addEventListener("beforeunload", () => {
    saveAllSelections();
  });

} // ---> NOVO: Fim do bloco condicional