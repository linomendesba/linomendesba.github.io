const LIGAS = {
    'betano-classicos-america': 'https://stoiximan-br.live.inspiredvss.co.uk/inggWebViewer/?cust=stoiximan-br&ch=soccercopabr',
    'betano-copa-america':      'https://stoiximanintl.live.inspiredvss.co.uk/inggWebViewer/?cust=stoiximanintl&ch=soccer3copaamerica&type=mobile',
    'betano-euro':               'https://stoiximanintl.live.inspiredvss.co.uk/inggWebViewer/?cust=stoiximanintl&ch=soccer3international&type=mobile',
    'betano-copa-estrelas':      'https://stoiximan-br.live.inspiredvss.co.uk/inggWebViewer/?cust=stoiximan-br&ch=soccerstarsbr',
    'betano-italiano':           'https://stoiximan-br.live.inspiredvss.co.uk/inggWebViewer/?cust=stoiximan-br&ch=soccerserieAbr',
    'betano-brasileirao':        'https://stoiximan-br.live.inspiredvss.co.uk/inggWebViewer/?cust=stoiximan-br&ch=soccer3brasilerio&type=mobile',
    'kiron-england': 'https://iframe.net4media.net/streams/0199ce77-5337-7017-bae4-4df2438ddba0',
    'kiron-italy':   'https://iframe.net4media.net/streams/0199ce72-62fd-72f8-a616-0d5413281f85',
    'kiron-spain':   'https://iframe.net4media.net/streams/0199ce73-c384-705b-84f9-88c522fb45a4',
    'estrelabet-america-latina': 'https://altenar.live.inspiredvss.co.uk/inggWebViewer/?cust=altenar&ch=soccer3',
    'estrelabet-champions':      'https://altenar.live.inspiredvss.co.uk/inggWebViewer/?cust=altenar&ch=champ',
    'estrelabet-copa-mundo':     'https://altenar.live.inspiredvss.co.uk/inggWebViewer/?cust=altenar&ch=international',
};

// Ativa o vídeo só quando o acordeon abrir, e remove quando fechar
document.querySelectorAll('.video-accordion').forEach((content) => {
    const url = LIGAS[content.dataset.league];
    const wrap = content.querySelector('.video-wrap');
    let carregado = false;

    function checar() {
        const aberto = getComputedStyle(content).display !== 'none';
        if (aberto && !carregado) {
            wrap.innerHTML = `<iframe src="${url}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
            carregado = true;
        } else if (!aberto && carregado) {
            wrap.innerHTML = '';
            carregado = false;
        }
    }

    new MutationObserver(checar).observe(content, { attributes: true });
    checar();
});