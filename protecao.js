            // Bloqueia o menu de contexto (clique direito)
document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
});

// Bloqueia atalhos de teclado comuns para ferramentas de desenvolvimento
document.addEventListener("keydown", function(e) {
    // F12
    if (e.key === "F12") {
        e.preventDefault();
    }
    
    // Ctrl + Shift + I
    if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
    }
    
    // Ctrl + U (ver código fonte)
    if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
    }
    
    // Ctrl + Shift + J (console)
    if (e.ctrlKey && e.shiftKey && e.key === "J") {
        e.preventDefault();
    }
    
    // Ctrl + Shift + C (inspeção de elementos)
    if (e.ctrlKey && e.shiftKey && e.key === "C") {
        e.preventDefault();
    }
    
    // Ctrl + S (salvar página)
    if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
    }
    
    // Ctrl + P (imprimir)
    if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
    }
});

// Detecta abertura de ferramentas de desenvolvimento
const devtools = { open: false };
const element = new Image();
Object.defineProperty(element, 'id', {
    get: function () {
        devtools.open = true;
    }
});

// Adiciona detecção alternativa de devtools
(function() {
    const threshold = 160;
    const checkDevTools = function() {
        if ((window.outerWidth - window.innerWidth) > threshold || 
            (window.outerHeight - window.innerHeight) > threshold) {
            devtools.open = true;
        }
    };
    
    window.addEventListener('resize', checkDevTools);
    setInterval(checkDevTools, 500);
})();

// Monitoramento contínuo
console.log('%c', element);
setInterval(function() {
    if (devtools.open) {
        document.body.innerHTML = '<h1>Acesso não autorizado detectado</h1>';
        // Ou redirecionar:
        // window.location.href = 'about:blank';
        devtools.open = false;
    }
}, 1000);

// Impede seleção de texto
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
});

// Impede arrastar e soltar
document.addEventListener('dragstart', function(e) {
    e.preventDefault();
});

// Ofusca console
console.log = function() {};
console.debug = function() {};
console.info = function() {};