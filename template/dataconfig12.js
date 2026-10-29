/* dataconfig12.js — constantes de jogos/hora da liga (rodam logo após ligas-config.js) */

      // Jogos por hora da liga atual (fonte: ligas-config.js -> LIGAS_INFO[LIGA_ATUAL].minutos).
      // BetGreen = 12 jogos/hora (de 5 em 5 min) => 4 quadrantes de 3 jogos.
      const BS_JOGOS_POR_HORA = (function () {
        try {
          const l = (typeof LIGAS_INFO !== "undefined" && typeof LIGA_ATUAL !== "undefined") ? LIGAS_INFO[LIGA_ATUAL] : null;
          if (l && Array.isArray(l.minutos) && l.minutos.length > 0) return l.minutos.length;
        } catch (e) {}
        return 20;
      })();
      const BS_QD_BLOCO = BS_JOGOS_POR_HORA === 12 ? 3 : 5;               // jogos por quadrante
      const BS_LIMIAR_QD_PADRAO = Math.round((12 * BS_QD_BLOCO / 5) * 2) / 2; // 12 gols p/ 5 jogos (=7 p/ 3 jogos)
      // Sufixo p/ chaves de localStorage que guardam quantidades de jogos (evita herdar valores de ligas de 20 jogos/hora)
      const BS_KEY_SUFIXO = BS_JOGOS_POR_HORA === 20 ? "" : ":jph" + BS_JOGOS_POR_HORA;
