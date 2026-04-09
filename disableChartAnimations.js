/**
 * disableChartAnimations.js
 * Script para desabilitar animações em todos os gráficos Chart.js
 * Para usar: <script src="disableChartAnimations.js"></script>
 */

(function() {
    'use strict';
    
    let isInitialized = false;
    
    function waitForChart() {
        if (typeof Chart !== 'undefined' && !isInitialized) {
            initializeNoAnimations();
            isInitialized = true;
        } else if (!isInitialized) {
            setTimeout(waitForChart, 100);
        }
    }
    
    function initializeNoAnimations() {
        try {
            // Configurações globais padrão do Chart.js
            Chart.defaults.animation = false;
            Chart.defaults.animations = false;
            
            // Configurar plugins globalmente
            if (Chart.defaults.plugins) {
                if (Chart.defaults.plugins.tooltip) {
                    Chart.defaults.plugins.tooltip.animation = false;
                }
                if (Chart.defaults.plugins.legend) {
                    Chart.defaults.plugins.legend.animation = false;
                }
            }
            
            // Interceptar criação de novos gráficos
            const OriginalChart = Chart;
            
            window.Chart = function(ctx, config) {
                if (config) {
                    // Garantir que options existe
                    if (!config.options) config.options = {};
                    
                    // Desabilitar animações
                    config.options.animation = false;
                    config.options.animations = false;
                    
                    // Desabilitar transições
                    config.options.transitions = {
                        active: { animation: { duration: 0 }},
                        resize: { animation: { duration: 0 }},
                        show: { animation: { duration: 0 }},
                        hide: { animation: { duration: 0 }}
                    };
                    
                    // Configurar plugins
                    if (!config.options.plugins) config.options.plugins = {};
                    
                    if (!config.options.plugins.tooltip) {
                        config.options.plugins.tooltip = {};
                    }
                    config.options.plugins.tooltip.animation = false;
                    
                    if (!config.options.plugins.legend) {
                        config.options.plugins.legend = {};
                    }
                    config.options.plugins.legend.animation = false;
                    
                    // Otimizar interações para performance
                    if (!config.options.interaction) {
                        config.options.interaction = {};
                    }
                    config.options.interaction.intersect = false;
                    config.options.interaction.mode = 'index';
                }
                
                // Criar instância do gráfico
                const chartInstance = new OriginalChart(ctx, config);
                
                // Interceptar update para remover animações
                const originalUpdate = chartInstance.update;
                chartInstance.update = function(mode) {
                    return originalUpdate.call(this, mode || 'none');
                };
                
                return chartInstance;
            };
            
            // Preservar funcionalidades do Chart original
            Object.setPrototypeOf(window.Chart, OriginalChart);
            for (let key in OriginalChart) {
                if (OriginalChart.hasOwnProperty(key)) {
                    window.Chart[key] = OriginalChart[key];
                }
            }
            
            console.log('Chart.js animations disabled globally');
            
        } catch (error) {
            console.error('Erro ao desabilitar animações do Chart.js:', error);
        }
    }
    
    // Múltiplos pontos de inicialização para garantir execução
    if (typeof Chart !== 'undefined') {
        // Chart.js já carregado
        initializeNoAnimations();
    } else {
        // Aguardar carregamento
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', waitForChart);
        } else {
            waitForChart();
        }
        
        // Fallback adicional
        window.addEventListener('load', waitForChart);
    }
    
})();