(function () {
    const content = document.getElementById('accordeonVidBetanoClassicos');
    const iframe  = document.getElementById('iframeVidBetanoClassicos');
    let carregado = false;

    function estaAberto() {
        return window.getComputedStyle(content).display !== 'none';
    }

    function sincronizar() {
        const aberto = estaAberto();

        if (aberto && !carregado) {
            iframe.src = iframe.dataset.src;
            carregado = true;
        } else if (!aberto && carregado) {
            iframe.removeAttribute('src');
            carregado = false;
        }
    }

    new MutationObserver(sincronizar).observe(content, {
        attributes: true,
        attributeFilter: ['class', 'style']
    });

    sincronizar();
})();