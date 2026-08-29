// video.js – Vídeo automático por liga
// Reaproveita LIGAS e LIGA_ATUAL que já vêm do config.js (carregado ANTES deste
// arquivo na página). NÃO altera nada no config.js.
//
// Como funciona:
// - Cada liga cadastrada aqui tem um vídeo (iframe ou HLS).
// - A liga sem entrada aqui (ex: todas as do Bet365) simplesmente não tem
//   vídeo -> o bloco "Streaming ao Vivo" some sozinho na página.
// - O vídeo só carrega de verdade quando o accordion é aberto (lazy load),
//   igual já funcionava antes.

(function () {

    const VIDEOS_POR_LIGA = {
        // ── BETANO ──
        [LIGAS.GLORIA_ETERNA]: { tipo: 'iframe', src: 'https://stoiximan-br.live.inspiredvss.co.uk/inggWebViewer/?cust=stoiximan-br&ch=soccercopabr' },
        [LIGAS.COPA_AMERICA]:  { tipo: 'iframe', src: 'https://stoiximanintl.live.inspiredvss.co.uk/inggWebViewer/?cust=stoiximanintl&ch=soccer3copaamerica&type=mobile' },
        [LIGAS.EURO]:          { tipo: 'iframe', src: 'https://stoiximanintl.live.inspiredvss.co.uk/inggWebViewer/?cust=stoiximanintl&ch=soccer3international&type=mobile' },
        [LIGAS.ITALIANO]:      { tipo: 'iframe', src: 'https://stoiximan-br.live.inspiredvss.co.uk/inggWebViewer/?cust=stoiximan-br&ch=soccerserieAbr' },
        [LIGAS.COPA_ESTRELAS]: { tipo: 'iframe', src: 'https://stoiximan-br.live.inspiredvss.co.uk/inggWebViewer/?cust=stoiximan-br&ch=soccerstarsbr' },
        [LIGAS.BRASILEIRAO]:   { tipo: 'iframe', src: 'https://stoiximan-br.live.inspiredvss.co.uk/inggWebViewer/?cust=stoiximan-br&ch=soccer3brasilerio&type=mobile' },
        [LIGAS.MUNDIAL]:       { tipo: 'iframe', src: 'https://stoiximan-br.live.inspiredvss.co.uk/inggWebViewer/?cust=stoiximan-br&ch=worldcup26' },

        // ── BET365 ── (sem vídeo, de propósito — nenhuma entrada aqui)

        // ── KIRON ──
        [LIGAS.KIRON_ENGLAND]: { tipo: 'iframe', src: 'https://iframe.net4media.net/streams/0199ce77-5337-7017-bae4-4df2438ddba0' },
        [LIGAS.KIRON_ITALY]:   { tipo: 'iframe', src: 'https://iframe.net4media.net/streams/0199ce72-62fd-72f8-a616-0d5413281f85' },
        [LIGAS.KIRON_SPAIN]:   { tipo: 'iframe', src: 'https://iframe.net4media.net/streams/0199ce73-c384-705b-84f9-88c522fb45a4' },
        // KIRON_BRAZIL e KIRON_AMERICA: sem vídeo cadastrado na página live (de propósito)

        // ── ESTRELA BET ──
        [LIGAS.ESTRELA_AMERICA_LATINA]: { tipo: 'iframe', src: 'https://altenar.live.inspiredvss.co.uk/inggWebViewer/?cust=altenar&ch=soccer3' },
        [LIGAS.ESTRELA_CHAMPIONS]:      { tipo: 'iframe', src: 'https://altenar.live.inspiredvss.co.uk/inggWebViewer/?cust=altenar&ch=champ' },
        [LIGAS.ESTRELA_COPA_MUNDO]:     { tipo: 'iframe', src: 'https://altenar.live.inspiredvss.co.uk/inggWebViewer/?cust=altenar&ch=international' },

        // ── BETSSON (stream HLS, precisa de hls.js) ──
        [LIGAS.BETSSON_INGLATERRA]: { tipo: 'hls', src: 'https://vfvideolive-vs001.akamaized.net/live/vwmf1_srvg-england-1024x576-1000k-mr-v3_channel0/playlist.m3u8' },
        [LIGAS.BETSSON_BRASIL]:     { tipo: 'hls', src: 'https://vfvideolive-vs001.akamaized.net/live/vwmf1_srvg-brazil-1024x576-1000k-mr-v3_channel0/playlist.m3u8' },
        [LIGAS.BETSSON_ESPANHA]:    { tipo: 'hls', src: 'https://vfvideolive-vs001.akamaized.net/live/vwmf1_srvg-spain-1024x576-1000k-mr-v3_channel0/playlist.m3u8' },
    };

    function iniciar() {
        // Se por algum motivo o config.js ainda não rodou (ordem de carregamento
        // diferente em alguma página), espera o DOM terminar e tenta de novo uma vez.
        if (typeof LIGA_ATUAL === 'undefined') {
            document.addEventListener('DOMContentLoaded', iniciarComSeguranca, { once: true });
            return;
        }
        montar();
    }

    function iniciarComSeguranca() {
        if (typeof LIGA_ATUAL === 'undefined') return; // config.js não está na página
        montar();
    }

    function montar() {
        const item    = document.getElementById('accordionItemVidLiga');
        const content = document.getElementById('accordeonVidBetanoClassicos');
        const iframe  = document.getElementById('iframeVidBetanoClassicos');
        const videoEl = document.getElementById('videoVidBetanoClassicos');

        if (!item || !content) return;

        const video = VIDEOS_POR_LIGA[LIGA_ATUAL];

        // Liga sem vídeo cadastrado (ex: qualquer liga do Bet365) -> some com o bloco inteiro
        if (!video) {
            item.style.display = 'none';
            return;
        }

        // Deixa visível só o player certo pro tipo de vídeo desta liga
        if (iframe)  iframe.style.display  = (video.tipo === 'iframe') ? 'block' : 'none';
        if (videoEl) videoEl.style.display = 'none'; // só aparece quando o HLS carregar

        let carregado = false;
        let hls = null;

        function estaAberto() {
            return window.getComputedStyle(content).display !== 'none';
        }

        function garantirHlsJs(callback) {
            if (window.Hls) { callback(); return; }
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.7/hls.min.js';
            s.onload = callback;
            document.head.appendChild(s);
        }

        function carregarVideo() {
            if (video.tipo === 'iframe') {
                iframe.src = video.src;
                return;
            }
            // tipo hls
            garantirHlsJs(function () {
                videoEl.style.display = 'block';
                if (window.Hls && Hls.isSupported()) {
                    hls = new Hls({ enableWorker: true, lowLatencyMode: true });
                    hls.loadSource(video.src);
                    hls.attachMedia(videoEl);
                    hls.on(Hls.Events.MANIFEST_PARSED, () => videoEl.play().catch(() => {}));
                } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
                    videoEl.src = video.src;
                    videoEl.addEventListener('loadedmetadata', () => videoEl.play().catch(() => {}));
                }
            });
        }

        function pararVideo() {
            if (video.tipo === 'iframe') {
                iframe.removeAttribute('src');
            } else {
                if (hls) { hls.destroy(); hls = null; }
                videoEl.removeAttribute('src');
                videoEl.style.display = 'none';
            }
        }

        function sincronizar() {
            const aberto = estaAberto();
            if (aberto && !carregado) {
                carregado = true;
                carregarVideo();
            } else if (!aberto && carregado) {
                pararVideo();
                carregado = false;
            }
        }

        new MutationObserver(sincronizar).observe(content, {
            attributes: true,
            attributeFilter: ['class', 'style']
        });

        sincronizar();
    }

    iniciar();
})();