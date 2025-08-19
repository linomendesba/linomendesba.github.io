// Lista de seletores que não devem ser salvos
const excludedSelectors = [
  "ligas",
  "avancado-betano",
  "ligas365",
  "avancado-bet365",
  "redes"
];

// ========== NOVAS VARIÁVEIS E FUNÇÕES PARA GRÁFICOS ==========

// Variável para armazenar as instâncias dos gráficos
let chartInstances = {};

// Salva o estado das linhas visíveis do gráfico
function saveChartState(chartId, visibleDatasets) {
  const stateKey = `chart_state_${chartId}`;
  localStorage.setItem(stateKey, JSON.stringify(visibleDatasets));
}

// Restaura o estado das linhas do gráfico
function restoreChartState(chartId) {
  const stateKey = `chart_state_${chartId}`;
  const savedState = localStorage.getItem(stateKey);
  
  if (savedState) {
    try {
      return JSON.parse(savedState);
    } catch (e) {
      console.error('Erro ao restaurar estado do gráfico:', e);
    }
  }
  
  return null;
}

// Função para salvar estados de todos os gráficos ativos
function saveAllChartsState() {
  Object.keys(chartInstances).forEach(chartId => {
    const chart = chartInstances[chartId];
    if (chart && !chart.destroyed) {
      const currentState = {};
      chart.data.datasets.forEach((dataset, idx) => {
        currentState[dataset.label] = chart.isDatasetVisible(idx);
      });
      saveChartState(chartId, currentState);
    }
  });
}

// Função melhorada para criar gráfico com salvamento de estado
function createStatsChart(ctx, labels, data, league) {
  // Gera um ID único para o gráfico baseado no contexto
  const chartId = ctx.canvas.id || `chart_${league}_${Date.now()}`;
  
  // Restaura estado salvo ou usa o padrão
  const savedState = restoreChartState(chartId);
  let visibleDatasets;
  
  if (savedState) {
    visibleDatasets = savedState;
  } else {
    // Estado padrão do statsChartVisibleDatasets
    visibleDatasets = window.statsChartVisibleDatasets || {
      'Gols FT': true,
      'Casa Vence': true,
      'Empate': true,
      'Fora Vence': true,
      'Ambas Sim': true,
      'Ambas Não': true,
      'Over 1.5': true,
      'Over 2.5': true,
      'Over 3.5': true,
      'Under 1.5': true,
      'Under 2.5': true,
      'Under 3.5': true,
      '0 Gol Exato': true,
      '1 Gol Exato': true,
      '2 Gols Exatos': true,
      '3 Gols Exatos': true,
      '4 Gols Exatos': true,
      '5 Gols Exatos': true
    };
  }

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        { label: 'Gols FT', data: data.golsFT, borderColor: '#1E88E5', backgroundColor: '#1E88E5', pointBackgroundColor: data.golsFTColors, hidden: !visibleDatasets['Gols FT'] },
        { label: 'Casa Vence', data: data.casaVence, borderColor: '#AB47BC', backgroundColor: '#AB47BC', pointBackgroundColor: data.casaVenceColors, hidden: !visibleDatasets['Casa Vence'] },
        { label: 'Empate', data: data.empate, borderColor: '#78909C', backgroundColor: '#78909C', pointBackgroundColor: data.empateColors, hidden: !visibleDatasets['Empate'] },
        { label: 'Fora Vence', data: data.foraVence, borderColor: '#2196F3', backgroundColor: '#2196F3', pointBackgroundColor: data.foraVenceColors, hidden: !visibleDatasets['Fora Vence'] },
        { label: 'Ambas Sim', data: data.ambasSim, borderColor: '#B0BEC5', backgroundColor: '#B0BEC5', pointBackgroundColor: data.ambasSimColors, hidden: !visibleDatasets['Ambas Sim'] },
        { label: 'Ambas Não', data: data.ambasNao, borderColor: '#F44336', backgroundColor: '#F44336', pointBackgroundColor: data.ambasNaoColors, hidden: !visibleDatasets['Ambas Não'] },
        { label: 'Over 1.5', data: data.over15, borderColor: '#26A69A', backgroundColor: '#26A69A', pointBackgroundColor: data.over15Colors, hidden: !visibleDatasets['Over 1.5'] },
        { label: 'Over 2.5', data: data.over25, borderColor: '#FFEB3B', backgroundColor: '#FFEB3B', pointBackgroundColor: data.over25Colors, hidden: !visibleDatasets['Over 2.5'] },
        { label: 'Over 3.5', data: data.over35, borderColor: '#00BCD4', backgroundColor: '#00BCD4', pointBackgroundColor: data.over35Colors, hidden: !visibleDatasets['Over 3.5'] },
        { label: 'Under 1.5', data: data.under15, borderColor: '#388E3C', backgroundColor: '#388E3C', pointBackgroundColor: data.under15Colors, hidden: !visibleDatasets['Under 1.5'] },
        { label: 'Under 2.5', data: data.under25, borderColor: '#FF9800', backgroundColor: '#FF9800', pointBackgroundColor: data.under25Colors, hidden: !visibleDatasets['Under 2.5'] },
        { label: 'Under 3.5', data: data.under35, borderColor: '#F06292', backgroundColor: '#F06292', pointBackgroundColor: data.under35Colors, hidden: !visibleDatasets['Under 3.5'] },
        { label: '0 Gol Exato', data: data.gol0, borderColor: '#D81B60', backgroundColor: '#D81B60', pointBackgroundColor: data.gol0Colors, hidden: !visibleDatasets['0 Gol Exato'] },
        { label: '1 Gol Exato', data: data.gol1, borderColor: '#8E24AA', backgroundColor: '#8E24AA', pointBackgroundColor: data.gol1Colors, hidden: !visibleDatasets['1 Gol Exato'] },
        { label: '2 Gols Exatos', data: data.gol2, borderColor: '#A0522D', backgroundColor: '#A0522D', pointBackgroundColor: data.gol2Colors, hidden: !visibleDatasets['2 Gols Exatos'] },
        { label: '3 Gols Exatos', data: data.gol3, borderColor: '#546E7A', backgroundColor: '#546E7A', pointBackgroundColor: data.gol3Colors, hidden: !visibleDatasets['3 Gols Exatos'] },
        { label: '4 Gols Exatos', data: data.gol4, borderColor: '#FFB300', backgroundColor: '#FFB300', pointBackgroundColor: data.gol4Colors, hidden: !visibleDatasets['4 Gols Exatos'] },
        { label: '5 Gols Exatos', data: data.gol5, borderColor: '#00897B', backgroundColor: '#00897B', pointBackgroundColor: data.gol5Colors, hidden: !visibleDatasets['5 Gols Exatos'] }
      ].map(dataset => ({
        ...dataset,
        borderWidth: 2,
        pointRadius: 4,
        fill: false
      }))
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          onClick: function(e, legendItem, legend) {
            // Comportamento padrão do Chart.js para mostrar/ocultar datasets
            const index = legendItem.datasetIndex;
            const ci = legend.chart;
            
            if (ci.isDatasetVisible(index)) {
              ci.hide(index);
              legendItem.hidden = true;
            } else {
              ci.show(index);
              legendItem.hidden = false;
            }
            
            // Salva o novo estado
            const currentState = {};
            ci.data.datasets.forEach((dataset, idx) => {
              currentState[dataset.label] = ci.isDatasetVisible(idx);
            });
            
            saveChartState(chartId, currentState);
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  
  // Armazena a instância do gráfico para referência futura
  chartInstances[chartId] = chart;
  
  return chart;
}

// ========== FUNÇÕES ORIGINAIS DO SEU CÓDIGO ==========

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
      // Verificamos se o seletor já tem um manipulador onclick que poderia redirecionar
      const hasRedirectHandler = selector.hasAttribute("onclick") &&
                                 selector.getAttribute("onclick").includes("redirecionar");
          
      if (hasRedirectHandler) {
        // Para seletores com redirecionamento, adicionamos um evento que salva antes do redirecionamento
        const originalOnclick = selector.getAttribute("onclick");
              
        // Substituímos o manipulador onclick para primeiro salvar e depois redirecionar
        selector.setAttribute("onclick", `saveSelection('${selector.id}'); saveAllChartsState(); ${originalOnclick}`);
      } else {
        // Para seletores sem redirecionamento, adicionamos o evento change normal
        selector.addEventListener("change", () => {
          saveSelection(selector.id);
          
          // Se estiver no acordeão específico, salva o estado do acordeão
          if (isInTargetAccordion) {
            saveAccordionState(accordionButton);
          }
          
          // Salva estados dos gráficos quando alterar seletores
          saveAllChartsState();
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
        
        // Salva estados dos gráficos quando alterar checkboxes
        saveAllChartsState();
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
  
  // Salva estados dos gráficos antes de sair da página
  saveAllChartsState();
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
  
  // Remove estados dos gráficos
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('chart_state_')) {
      localStorage.removeItem(key);
    }
  });
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