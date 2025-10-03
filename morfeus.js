const _0x400e6e = _0xb88d;
(function (_0x2fb801, _0x1c766e) {
  const _0x20d589 = _0xb88d,
    _0x40b66f = _0x2fb801();
  while (!![]) {
    try {
      const _0x3f7477 =
        (parseInt(_0x20d589(0x222)) / 0x1) *
          (-parseInt(_0x20d589(0x23c)) / 0x2) +
        parseInt(_0x20d589(0x245)) / 0x3 +
        (parseInt(_0x20d589(0x216)) / 0x4) *
          (-parseInt(_0x20d589(0x1bb)) / 0x5) +
        -parseInt(_0x20d589(0x219)) / 0x6 +
        -parseInt(_0x20d589(0x249)) / 0x7 +
        -parseInt(_0x20d589(0x255)) / 0x8 +
        (parseInt(_0x20d589(0x1d7)) / 0x9) * (parseInt(_0x20d589(0x23f)) / 0xa);
      if (_0x3f7477 === _0x1c766e) break;
      else _0x40b66f["push"](_0x40b66f["shift"]());
    } catch (_0x522650) {
      _0x40b66f["push"](_0x40b66f["shift"]());
    }
  }
})(_0x5019, 0x6ba6e);
const GEMINI_API_KEY = _0x400e6e(0x1ab),
  GEMINI_URL = _0x400e6e(0x1f4),
  casasConfig = {
    betano: {
      name: _0x400e6e(0x1c3),
      ligas: [
        _0x400e6e(0x1f5),
        _0x400e6e(0x1d3),
        _0x400e6e(0x221),
        _0x400e6e(0x240),
        "Copa\x20das\x20Estrelas",
        _0x400e6e(0x1d9),
      ],
    },
    kiron: {
      name: "Kiron",
      ligas: ["England", _0x400e6e(0x1e8), _0x400e6e(0x1a2)],
      path: _0x400e6e(0x210),
    },
    estrela: {
      name: _0x400e6e(0x223),
      ligas: [_0x400e6e(0x20c)],
      path: _0x400e6e(0x20c),
    },
    betsson: {
      name: "Betsson",
      ligas: [_0x400e6e(0x231), _0x400e6e(0x1de), "Brasil"],
      path: "betsson",
    },
  };
document[_0x400e6e(0x1d1)](_0x400e6e(0x22e))[_0x400e6e(0x1b5)]((_0x1f3962) => {
  const _0x47a765 = _0x400e6e;
  _0x1f3962[_0x47a765(0x1c1)](_0x47a765(0x205), (_0x608330) => {
    const _0x18c8f4 = _0x47a765;
    if (
      _0x608330[_0x18c8f4(0x20a)][_0x18c8f4(0x241)][_0x18c8f4(0x208)](
        _0x18c8f4(0x238)
      )
    ) {
      const _0x514a85 = _0x1f3962[_0x18c8f4(0x228)](_0x18c8f4(0x22b));
      _0x514a85 &&
        _0x514a85[_0x18c8f4(0x241)][_0x18c8f4(0x1ec)](_0x18c8f4(0x220)),
        _0x608330[_0x18c8f4(0x20a)]["classList"]["add"]("active"),
        _0x1f3962["id"] === _0x18c8f4(0x1a3) &&
          mostrarLigas(_0x608330[_0x18c8f4(0x20a)][_0x18c8f4(0x20b)]["value"]);
    }
  });
});
function mostrarLigas(_0x16b0b5) {
  const _0x34c414 = _0x400e6e,
    _0x636530 = document[_0x34c414(0x1b6)](_0x34c414(0x1e4)),
    _0x263299 = document[_0x34c414(0x1b6)](_0x34c414(0x224));
  if (!casasConfig[_0x16b0b5]) {
    _0x636530[_0x34c414(0x24d)][_0x34c414(0x1e2)] = _0x34c414(0x1f3);
    return;
  }
  (_0x263299[_0x34c414(0x23a)] = ""),
    casasConfig[_0x16b0b5]["ligas"]["forEach"]((_0x2613d3) => {
      const _0x2f2aef = _0x34c414,
        _0x2d2428 = document[_0x2f2aef(0x207)](_0x2f2aef(0x1c4));
      (_0x2d2428[_0x2f2aef(0x21b)] = _0x2f2aef(0x238)),
        (_0x2d2428[_0x2f2aef(0x20b)]["value"] = _0x2613d3),
        (_0x2d2428[_0x2f2aef(0x242)] = _0x2613d3),
        _0x263299[_0x2f2aef(0x264)](_0x2d2428);
    }),
    (_0x636530["style"][_0x34c414(0x1e2)] = _0x34c414(0x1bd));
}
function getSelectedValue(_0x5bba9d) {
  const _0x2ad050 = _0x400e6e,
    _0x2874f8 = document[_0x2ad050(0x1b6)](_0x5bba9d),
    _0x505674 = _0x2874f8["querySelector"](".btn.active");
  return _0x505674 ? _0x505674[_0x2ad050(0x20b)][_0x2ad050(0x1ef)] : null;
}
function getSelectedText(_0x12df8f) {
  const _0x5a25a6 = _0x400e6e,
    _0x281f6b = document["getElementById"](_0x12df8f),
    _0x346d2a = _0x281f6b[_0x5a25a6(0x228)](_0x5a25a6(0x22b));
  return _0x346d2a ? _0x346d2a[_0x5a25a6(0x21f)] : null;
}
function _0x5019() {
  const _0x320411 = [
    "0.0",
    "7596340epvtfV",
    "Campeonato\x20Italiano",
    "classList",
    "textContent",
    "\x0a\x0a4.\x20ANÁLISE\x20DE\x20GRÁFICO\x20DE\x20MERCADO\x20PARA\x20O\x20MERCADO\x20\x22",
    "filter",
    "1474314Jgdqsf",
    "under3.5",
    "random",
    "percentage",
    "515221iCqCZW",
    "?key=",
    "trim",
    "\x0a\x0aINFORMAÇÕES\x20PRÉ-PROCESSADAS:\x0a\x0a1.\x20RANKING\x20DE\x20TIMES\x20PARA\x20O\x20MERCADO\x20\x22",
    "style",
    "slice",
    "keys",
    "marketAnalysis",
    "Casa\x20",
    "greenPercentage",
    "length",
    "\x20jogos...</div>",
    "33392GzEnsI",
    "hora",
    "\x0a\x0aINSTRUÇÕES\x20DE\x20ANÁLISE\x20(SUA\x20TAREFA):\x0a1.\x20\x20Sua\x20missão\x20é\x20conectar\x20as\x20informações\x20acima.\x20Não\x20processe\x20dados\x20brutos,\x20apenas\x20interprete\x20os\x20resultados\x20que\x20eu\x20forneci.\x0a2.\x20\x20Analise\x20os\x20\x22TOP\x2015\x20PADRÕES\x22.\x20Identifique\x20quais\x20têm\x20o\x20maior\x20percentual\x20de\x20acerto\x20(percentual)\x20e\x20um\x20número\x20sólido\x20de\x20ocorrências.\x20Padrões\x20com\x20100%\x20de\x20acerto\x20e\x20poucas\x20ocorrências\x20são\x20promissores,\x20mas\x20de\x20alto\x20risco.\x0a3.\x20\x20Observe\x20os\x20\x22PRÓXIMOS\x206\x20CONFRONTOS\x22.\x20Verifique\x20se\x20algum\x20desses\x20jogos\x20envolve\x20times\x20que\x20estão\x20bem\x20posicionados\x20no\x20\x22RANKING\x20DE\x20TIMES\x22.\x0a4.\x20\x20Cruze\x20as\x20informações:\x20A\x20oportunidade\x20de\x20maior\x20valor\x20acontece\x20quando\x20um\x20padrão\x20forte\x20aponta\x20para\x20um\x20dos\x20próximos\x20confrontos\x20E\x20esse\x20confronto\x20envolve\x20times\x20com\x20bom\x20desempenho\x20histórico\x20no\x20mercado.\x0a5.\x20\x20Se\x20uma\x20imagem\x20foi\x20fornecida,\x20considere\x20que\x20ela\x20pode\x20conter\x20informações\x20visuais\x20complementares\x20(como\x20estatísticas\x20ou\x20gráficos)\x20e\x20mencione\x20que\x20ela\x20foi\x20considerada\x20na\x20análise,\x20mas\x20não\x20tente\x20descrevê-la\x20diretamente.\x0a6.\x20\x20Baseado\x20nesta\x20síntese,\x20gere\x20a\x20sua\x20análise\x20no\x20formato\x20abaixo.\x20O\x20número\x20de\x20sugestões\x20de\x20horários\x20deve\x20seguir\x20a\x20estratégia\x20Martingale\x20(Nenhum\x20=\x201\x20jogo,\x201\x20Cobertura\x20=\x202\x20jogos,\x202\x20Coberturas\x20=\x203\x20jogos,\x203\x20Coberturas\x20=\x204\x20jogos).\x0a7.\x20\x20Se\x20nenhum\x20padrão\x20forte\x20se\x20alinhar\x20com\x20os\x20próximos\x20jogos\x20de\x20times\x20bem\x20ranqueados,\x20seja\x20honesto\x20e\x20informe\x20que\x20nenhuma\x20oportunidade\x20clara\x20foi\x20encontrada.\x0a8.\x20\x20Para\x20as\x20sugestões\x20de\x20horários:\x20Selecione\x20o\x20próximo\x20confronto\x20que\x20melhor\x20se\x20alinha\x20com\x20padrões\x20fortes\x20e\x20times\x20bem\x20ranqueados\x20como\x20o\x20principal.\x20Em\x20seguida,\x20adicione\x20as\x20coberturas\x20como\x20os\x20confrontos\x20sequenciais\x20seguintes.\x20Garanta\x20que\x20os\x20horários\x20estejam\x20em\x20sequência\x20cronológica\x20crescente,\x20sem\x20repetições,\x20e\x20baseados\x20exclusivamente\x20nos\x20horários\x20fornecidos\x20nos\x20próximos\x20confrontos.\x20Assuma\x20que\x20a\x20lista\x20de\x20próximos\x20está\x20ordenada\x20por\x20tempo,\x20e\x20selecione\x20apenas\x20horários\x20futuros\x20ou\x20os\x20mais\x20próximos.\x20O\x20primeiro\x20horário\x20é\x20o\x20principal\x20com\x20padrão\x20e\x20análise,\x20os\x20demais\x20são\x20coberturas.\x0a9.\x20\x20Inclua\x20uma\x20seção\x20independente\x20para\x20a\x20Análise\x20de\x20Gráfico\x20de\x20Mercado,\x20comentando\x20a\x20porcentagem\x20atual\x20e\x20destacando\x20as\x20top\x205\x20melhores\x20porcentagens,\x20considerando\x20o\x20Martingale\x20selecionado\x20para\x20a\x20verificação.\x0a\x0aFORMATO\x20DA\x20RESPOSTA\x20(Use\x20um\x20tom\x20natural\x20e\x20profissional,\x20evite\x20usar\x20negrito\x20com\x20asteriscos\x20**):\x0a\x0a🎯\x20ANÁLISE\x20ESTATÍSTICA\x0a[Comente\x20brevemente\x20sobre\x20o\x20desempenho\x20dos\x20times\x20no\x20ranking\x20e\x20a\x20força\x20geral\x20dos\x20padrões\x20encontrados.\x20Ex:\x20\x22Observa-se\x20que\x20os\x20times\x20X\x20e\x20Y\x20são\x20dominantes\x20neste\x20mercado.\x20Foram\x20encontrados\x20N\x20padrões\x20com\x20mais\x20de\x2080%\x20de\x20acerto,\x20indicando\x20consistência...\x22]\x0a\x0a📊\x20PADRÕES\x20RELEVANTES\x0a[Destaque\x202\x20ou\x203\x20dos\x20padrões\x20mais\x20promissores\x20da\x20lista,\x20explicando\x20por\x20que\x20são\x20relevantes.\x20Ex:\x20\x22O\x20padrão\x20\x27over2.5\x20|\x201-2\x27\x20se\x20destaca\x20com\x2085%\x20de\x20acerto\x20em\x2020\x20ocorrências,\x20mostrando\x20ser\x20um\x20gatilho\x20confiável...\x22]\x0a\x0a📈\x20ANÁLISE\x20DE\x20GRÁFICO\x20DE\x20MERCADO\x0a[Comente\x20sobre\x20a\x20porcentagem\x20atual\x20do\x20mercado\x20e\x20destaque\x20as\x20top\x205\x20melhores\x20porcentagens,\x20incluindo\x20greenPercentage,\x20occurrences,\x20etc.,\x20considerando\x20o\x20Martingale\x20selecionado\x20para\x20a\x20verificação\x20de\x20linhas.]\x0a\x0a⚡\x20PRÓXIMAS\x20OPORTUNIDADES\x0a[Baseado\x20na\x20sua\x20análise\x20combinada,\x20liste\x20as\x20entradas\x20recomendadas.\x20Se\x20nenhuma\x20for\x20encontrada,\x20justifique\x20o\x20motivo.\x0aFormato\x20se\x20encontrar:\x0aLiga:\x20[liga]\x0aMercado:\x20[mercado]\x0a⏰\x20Horários\x0a▸\x20[hora:minuto]\x20▸\x20[hora:minuto]\x20...\x20(número\x20baseado\x20na\x20Martingale,\x20em\x20sequência\x20sem\x20repetições)\x0aJustificativa:\x20[Breve\x20explicação\x20do\x20porquê\x20esta\x20é\x20uma\x20boa\x20entrada,\x20mencionando\x20o\x20padrão\x20e\x20os\x20times\x20envolvidos.\x20Note\x20que\x20o\x20primeiro\x20horário\x20é\x20o\x20principal\x20onde\x20padrões\x20foram\x20encontrados,\x20os\x20demais\x20são\x20coberturas\x20sequenciais.]\x0a\x0a🎲\x20ESTRATÉGIA\x20MARTINGALE\x0a[Avalie\x20a\x20segurança\x20da\x20estratégia\x20para\x20este\x20cenário.\x20Ex:\x20\x22Considerando\x20a\x20força\x20dos\x20padrões\x20encontrados,\x20a\x20estratégia\x20de\x20[N]\x20coberturas\x20parece\x20[segura/arriscada]...\x22]\x0a\x0a💡\x20RECOMENDAÇÃO\x20FINAL\x0a[Dê\x20uma\x20recomendação\x20final\x20clara\x20e\x20objetiva.\x20Ex:\x20\x22Recomendo\x20a\x20entrada\x20nos\x20horários\x20sugeridos\x20devido\x20à\x20forte\x20confluência\x20entre\x20o\x20padrão\x20X\x20e\x20o\x20confronto\x20envolvendo\x20o\x20time\x20Y,\x20que\x20possui\x20um\x20histórico\x20excelente\x20neste\x20mercado.\x22]\x0a",
    "ambasNaoMarcam",
    "sort",
    "\x20jogos",
    "values",
    "Alta\x20chance\x20de\x20acerto",
    "-\x20Imagem\x20fornecida:\x20Uma\x20imagem\x20foi\x20enviada\x20para\x20análise\x20adicional.",
    "under1.5",
    "martingale-group",
    "time_b",
    "✓\x20Análise\x20Concluída\x20-\x20",
    "imagem",
    "doisGolsExatos",
    "appendChild",
    "over5",
    "Spain",
    "casas-group",
    "totalReds",
    "readAsDataURL",
    "/proximos/",
    "occurrences",
    "\x0a-\x20Liga:\x20",
    "some",
    "removeEventListener",
    "AIzaSyAwrtYzlQxzMfBHK3k6sw5qAWTS7jBSSNQ",
    "stringify",
    "\x0aVocê\x20é\x20um\x20analista\x20especialista\x20em\x20futebol\x20virtual,\x20focado\x20em\x20interpretar\x20dados\x20pré-processados\x20para\x20identificar\x20oportunidades\x20de\x20investimento\x20de\x20alto\x20valor.\x0a\x0aDADOS\x20PARA\x20ANÁLISE:\x0a-\x20Casa:\x20",
    "\x20não\x20encontrada",
    "dadosCru",
    "\x0a-\x20Mercado:\x20",
    "toString",
    "top5",
    "ranking",
    "\x22:\x0a",
    "forEach",
    "getElementById",
    "marketCount",
    "currentPercentage",
    "\x20x\x20",
    "Erro\x20na\x20API\x20Gemini:",
    "938495czorHi",
    "result-content",
    "block",
    "<div\x20class=\x22loading\x22><div\x20class=\x22spinner\x22></div>Gerando\x20análise\x20com\x20IA...</div>",
    "data",
    "Por\x20favor,\x20selecione\x20Casa,\x20Liga,\x20Mercado\x20e\x20Período\x20de\x20Análise.",
    "addEventListener",
    "Nenhuma",
    "Betano",
    "button",
    "image-status",
    "result-container",
    "Moderada\x20chance",
    "Erro\x20na\x20API\x20do\x20Gemini:\x20",
    "over1.5",
    "round",
    "quatroGolsExatos",
    "ambasSim",
    "\x0a-\x20Observações\x20do\x20Usuário:\x20",
    "red",
    "/resultados/",
    "proximos",
    "querySelectorAll",
    "minuto",
    "Copa\x20América",
    "Erro\x20ao\x20buscar\x20dados\x20da\x20API:",
    "❌\x20Erro\x20na\x20Análise",
    "exact1",
    "27hdvKhW",
    "message",
    "Brasileirão\x20Betano",
    "exact2",
    "reduce",
    "Risco\x20elevado",
    "mercados-group",
    "Inglaterra",
    "cincoOuMaisGols",
    "application/javascript",
    "totalGames",
    "display",
    "all",
    "liga-section",
    "isFinite",
    "empate",
    "toLowerCase",
    "Italy",
    "ambasMarcam",
    "map",
    "POST",
    "remove",
    "green",
    "totalGreens",
    "value",
    "time_a",
    "padStart",
    "application/json",
    "none",
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    "Taça\x20Glória\x20Eterna",
    "path",
    "<div\x20class=\x22spinner\x22></div>\x20Processando...",
    "<br><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<strong>Causas\x20possíveis:</strong>\x20Falha\x20na\x20operação.\x20Atualize\x20a\x20página\x20e\x20tente\x20outra\x20vez\x20mais\x20tarde.\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>",
    "<div\x20class=\x22loading\x22><div\x20class=\x22spinner\x22></div>Coletando\x20",
    "toFixed",
    "mercado",
    "tresGolsExatos",
    "\x22\x20(Top\x2010):\x0a",
    "totalJogos",
    "padroesEncontrados",
    "then",
    "casaVence",
    "https://betstat.site",
    "src",
    "disabled",
    "click",
    "over3.5",
    "createElement",
    "contains",
    "json",
    "target",
    "dataset",
    "estrela",
    "reds",
    "foraVence",
    "files",
    "kiron",
    "under2.5",
    "onload",
    "observacao",
    "casa",
    "result",
    "16rLiroi",
    "exact3",
    "greens",
    "3948276IkKsPY",
    "parts",
    "className",
    "Nenhum\x20arquivo\x20selecionado",
    "image-upload",
    "name",
    "innerText",
    "active",
    "Euro",
    "1wuznXG",
    "Estrelabet",
    "ligas-group",
    ".btn-generate",
    "\x0a\x0a2.\x20TOP\x2015\x20PADRÕES\x20ENCONTRADOS\x20PARA\x20O\x20MERCADO\x20\x22",
    "text",
    "querySelector",
    "ambasNao",
    "error",
    ".btn.active",
    "liga",
    "exact4",
    ".btn-grid",
    "Nenhum",
    "result-title",
    "Espanha",
    "split",
    "candidates",
    "Erro\x20no\x20worker\x20de\x20análise",
    "postMessage",
    "over2.5",
    "martingale",
    "btn",
    "<div\x20class=\x22loading\x22><div\x20class=\x22spinner\x22></div>Analisando\x20padrões...</div>",
    "innerHTML",
    "image-preview",
    "1685558oLbwtD",
    "periodo-group",
  ];
  _0x5019 = function () {
    return _0x320411;
  };
  return _0x5019();
}
function _0xb88d(_0x4fc481, _0x45b139) {
  const _0x5019be = _0x5019();
  return (
    (_0xb88d = function (_0xb88db, _0xa467f2) {
      _0xb88db = _0xb88db - 0x1a2;
      let _0x1e47b5 = _0x5019be[_0xb88db];
      return _0x1e47b5;
    }),
    _0xb88d(_0x4fc481, _0x45b139)
  );
}
function limparAnalise() {
  const _0x2abb28 = _0x400e6e;
  document[_0x2abb28(0x1d1)](_0x2abb28(0x22b))[_0x2abb28(0x1b5)]((_0x1ce570) =>
    _0x1ce570[_0x2abb28(0x241)]["remove"]("active")
  ),
    (document["getElementById"](_0x2abb28(0x213))[_0x2abb28(0x1ef)] = ""),
    (document[_0x2abb28(0x1b6)]("image-upload")[_0x2abb28(0x1ef)] = ""),
    (document[_0x2abb28(0x1b6)]("image-status")[_0x2abb28(0x242)] =
      _0x2abb28(0x21c)),
    (document[_0x2abb28(0x1b6)](_0x2abb28(0x23b))[_0x2abb28(0x24d)][
      _0x2abb28(0x1e2)
    ] = _0x2abb28(0x1f3)),
    (document[_0x2abb28(0x1b6)]("result-container")[_0x2abb28(0x24d)][
      "display"
    ] = "none"),
    (document[_0x2abb28(0x1b6)](_0x2abb28(0x1e4))[_0x2abb28(0x24d)]["display"] =
      _0x2abb28(0x1f3));
}
function calcularRankingTimes(_0x4cc63c, _0x1a6538) {
  const _0x4b2536 = _0x400e6e,
    _0x224681 = {};
  _0x4cc63c[_0x4b2536(0x1b5)]((_0x2ff65a) => {
    const _0x4db404 = _0x4b2536,
      { time_a: _0x46fa33, time_b: _0xa3865b, ft: _0x51b831 } = _0x2ff65a;
    if (!_0x51b831 || !_0x51b831["includes"](_0x4db404(0x1b9))) return;
    const [_0x318b3a, _0x14f2e2] = _0x51b831[_0x4db404(0x232)](
        _0x4db404(0x1b9)
      )["map"](Number),
      _0x4ca14b = _0x318b3a + _0x14f2e2;
    [_0x46fa33, _0xa3865b]["forEach"]((_0x4fe583) => {
      !_0x224681[_0x4fe583] &&
        (_0x224681[_0x4fe583] = {
          name: _0x4fe583,
          totalGames: 0x0,
          marketCount: 0x0,
        });
    }),
      _0x224681[_0x46fa33][_0x4db404(0x1e1)]++,
      _0x224681[_0xa3865b][_0x4db404(0x1e1)]++;
    let _0x1db737 = ![];
    switch (_0x1a6538) {
      case _0x4db404(0x1e9):
        _0x1db737 = _0x318b3a > 0x0 && _0x14f2e2 > 0x0;
        break;
      case _0x4db404(0x258):
        _0x1db737 = _0x318b3a === 0x0 || _0x14f2e2 === 0x0;
        break;
      case "empate":
        _0x1db737 = _0x318b3a === _0x14f2e2;
        break;
      case _0x4db404(0x1c9):
        _0x1db737 = _0x4ca14b > 0x1;
        break;
      case _0x4db404(0x25e):
        _0x1db737 = _0x4ca14b < 0x2;
        break;
      case "over2.5":
        _0x1db737 = _0x4ca14b > 0x2;
        break;
      case _0x4db404(0x211):
        _0x1db737 = _0x4ca14b < 0x3;
        break;
      case _0x4db404(0x206):
        _0x1db737 = _0x4ca14b > 0x3;
        break;
      case _0x4db404(0x246):
        _0x1db737 = _0x4ca14b < 0x4;
        break;
      case _0x4db404(0x265):
        _0x1db737 = _0x4ca14b >= 0x5;
        break;
      case _0x4db404(0x1d6):
        _0x1db737 = _0x4ca14b === 0x1;
        break;
      case _0x4db404(0x1da):
        _0x1db737 = _0x4ca14b === 0x2;
        break;
      case _0x4db404(0x217):
        _0x1db737 = _0x4ca14b === 0x3;
        break;
      case _0x4db404(0x22d):
        _0x1db737 = _0x4ca14b === 0x4;
        break;
    }
    _0x1db737 &&
      (_0x224681[_0x46fa33][_0x4db404(0x1b7)]++,
      _0x224681[_0xa3865b][_0x4db404(0x1b7)]++);
    if (_0x1a6538 === "casaVence" && _0x318b3a > _0x14f2e2)
      _0x224681[_0x46fa33][_0x4db404(0x1b7)]++;
    if (_0x1a6538 === "foraVence" && _0x14f2e2 > _0x318b3a)
      _0x224681[_0xa3865b][_0x4db404(0x1b7)]++;
  });
  const _0x1e3659 = Object[_0x4b2536(0x25b)](_0x224681)[_0x4b2536(0x1ea)](
    (_0x42e4a2) => ({
      ..._0x42e4a2,
      percentage:
        _0x42e4a2[_0x4b2536(0x1e1)] > 0x0
          ? ((_0x42e4a2["marketCount"] / _0x42e4a2[_0x4b2536(0x1e1)]) * 0x64)[
              _0x4b2536(0x1fa)
            ](0x1)
          : _0x4b2536(0x23e),
    })
  );
  return (
    _0x1e3659[_0x4b2536(0x259)](
      (_0x2a361b, _0x52b0de) =>
        _0x52b0de[_0x4b2536(0x1b7)] - _0x2a361b["marketCount"] ||
        parseFloat(_0x52b0de[_0x4b2536(0x248)]) -
          parseFloat(_0x2a361b["percentage"])
    ),
    _0x1e3659
  );
}
async function buscarDadosAPI(_0x5f5344, _0xffca8e, _0x42da96) {
  const _0x459b6a = _0x400e6e,
    _0x323d7d = casasConfig[_0x5f5344];
  if (!_0x323d7d)
    throw new Error(_0x459b6a(0x251) + _0x5f5344 + _0x459b6a(0x1ae));
  const _0x514a47 = {
    casa: _0x323d7d[_0x459b6a(0x21e)],
    liga: _0xffca8e,
    totalJogos: 0x0,
    dadosCru: [],
  };
  try {
    const _0x46ceac = encodeURIComponent(_0xffca8e),
      _0x20f1dd = _0x459b6a(0x202);
    let _0x357b74, _0x1c0a55;
    _0x323d7d[_0x459b6a(0x1f6)]
      ? ((_0x357b74 =
          _0x20f1dd + _0x459b6a(0x1cf) + _0x323d7d["path"] + "/" + _0x46ceac),
        (_0x1c0a55 =
          _0x20f1dd +
          _0x459b6a(0x1a6) +
          _0x323d7d[_0x459b6a(0x1f6)] +
          "/" +
          _0x46ceac))
      : ((_0x357b74 = _0x20f1dd + "/resultados/" + _0x46ceac),
        (_0x1c0a55 = _0x20f1dd + _0x459b6a(0x1a6) + _0x46ceac));
    const [_0x31b4ba, _0x451f49] = await Promise[_0x459b6a(0x1e3)]([
        fetch(_0x357b74)[_0x459b6a(0x200)]((_0x5c0c58) => _0x5c0c58["json"]()),
        fetch(_0x1c0a55)[_0x459b6a(0x200)]((_0x221d6a) => _0x221d6a["json"]()),
      ]),
      _0x55ffd5 = _0x31b4ba["slice"](-_0x42da96);
    for (const _0x52f34a of _0x55ffd5) {
      const _0x1a9c39 = (_0x52f34a["ft"] || "x")
          [_0x459b6a(0x232)]("x")
          ["map"]((_0x3d1297) => parseInt(_0x3d1297[_0x459b6a(0x24b)](), 0xa)),
        _0x193e24 = _0x1a9c39[0x0],
        _0x1770d0 = _0x1a9c39[0x1];
      Number[_0x459b6a(0x1e5)](_0x193e24) &&
        Number[_0x459b6a(0x1e5)](_0x1770d0) &&
        _0x514a47[_0x459b6a(0x1af)]["push"]([
          _0x193e24,
          _0x1770d0,
          _0x193e24 + _0x1770d0,
          (_0x52f34a[_0x459b6a(0x1f0)] || "")[_0x459b6a(0x24b)](),
          (_0x52f34a[_0x459b6a(0x260)] || "")[_0x459b6a(0x24b)](),
          _0x52f34a[_0x459b6a(0x256)],
          _0x52f34a[_0x459b6a(0x1d2)],
        ]);
    }
    return (
      (_0x514a47[_0x459b6a(0x1d0)] = _0x451f49[_0x459b6a(0x24e)](0x0, 0x6)),
      (_0x514a47[_0x459b6a(0x1fe)] = _0x514a47[_0x459b6a(0x1af)]["length"]),
      _0x514a47
    );
  } catch (_0x327dd5) {
    console[_0x459b6a(0x22a)](_0x459b6a(0x1d4), _0x327dd5);
    throw new Error(
      "Falha\x20ao\x20conectar\x20com\x20a\x20API:\x20" + _0x327dd5["message"]
    );
  }
}
const ANALYZE_WORKER_SRC =
  "\x0a\x20\x20\x20\x20\x20\x20\x20\x20self.onmessage\x20=\x20(e)\x20=>\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20p\x20=\x20e.data;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(!p\x20||\x20p.cmd\x20!==\x20\x27analyze\x27)\x20return;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20res\x20=\x20analyzeAll(p.payload);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20self.postMessage({\x20ok:\x20true,\x20id:\x20p.id,\x20result:\x20res\x20});\x0a\x20\x20\x20\x20\x20\x20\x20\x20};\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20enumerateCombos(tok){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(tok.length===1)\x20return\x20tok[0].map(t=>[t]);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(tok.length===2){\x20const\x20out=[];\x20for(const\x20a\x20of\x20tok[0])\x20for(const\x20b\x20of\x20tok[1])\x20out.push([a,b]);\x20return\x20out;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(tok.length===3){\x20const\x20out=[];\x20for(const\x20a\x20of\x20tok[0])\x20for(const\x20b\x20of\x20tok[1])\x20for(const\x20c\x20of\x20tok[2])\x20out.push([a,b,c]);\x20return\x20out;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20out=[],cur=[];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20(function\x20rec(i){\x20if(i===tok.length){\x20out.push(cur.slice());\x20return;\x20}\x20for(const\x20t\x20of\x20tok[i]){\x20cur.push(t);\x20rec(i+1);\x20cur.pop();\x20}\x20})(0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20out;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20getOffsetsByTipo(t){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(t===\x271\x27)\x20return\x20[0];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(t===\x272\x27)\x20return\x20[0,1];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(t===\x273\x27)\x20return\x20[0,1,2];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(t===\x271_pula_1\x27)\x20return\x20[0,2];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(t===\x271_pula_1_pula_1\x27)\x20return\x20[0,2,4];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20[0,1];\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20tokensDoJogo(a,b,total,mandante,visitante){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20t\x20=\x20new\x20Set();\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20t.add(`${a}-${b}`);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20t.add(a\x20>\x200\x20&&\x20b\x20>\x200\x20?\x20\x27ambasMarcam\x27\x20:\x20\x27ambasNaoMarcam\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20t.add(a\x20>\x20b\x20?\x20\x27casaVence\x27\x20:\x20(a\x20<\x20b\x20?\x20\x27foraVence\x27\x20:\x20\x27empate\x27));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20>=\x202)\x20t.add(\x27over1.5\x27);\x20if\x20(total\x20<\x202)\x20t.add(\x27under1.5\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20>=\x203)\x20t.add(\x27over2.5\x27);\x20if\x20(total\x20<\x203)\x20t.add(\x27under2.5\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20>=\x204)\x20t.add(\x27over3.5\x27);\x20if\x20(total\x20<\x204)\x20t.add(\x27under3.5\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20>=\x205)\x20t.add(\x27over5\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20===\x201)\x20t.add(\x27exact1\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20===\x202)\x20t.add(\x27exact2\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20===\x203)\x20t.add(\x27exact3\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20===\x204)\x20t.add(\x27exact4\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(mandante)\x20t.add(mandante.toLowerCase());\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(visitante)\x20t.add(visitante.toLowerCase());\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20Array.from(t);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20isGreenForMarket(m,a,b,total){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27ambasMarcam\x27)\x20return\x20a\x20>\x200\x20&&\x20b\x20>\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27ambasNaoMarcam\x27)\x20return\x20a\x20===\x200\x20||\x20b\x20===\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27casaVence\x27)\x20return\x20a\x20>\x20b;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27foraVence\x27)\x20return\x20a\x20<\x20b;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27empate\x27)\x20return\x20a\x20===\x20b;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27over1.5\x27)\x20return\x20total\x20>=\x202;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27under1.5\x27)\x20return\x20total\x20<\x202;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27over2.5\x27)\x20return\x20total\x20>=\x203;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27under2.5\x27)\x20return\x20total\x20<\x203;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27over3.5\x27)\x20return\x20total\x20>=\x204;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27under3.5\x27)\x20return\x20total\x20<\x204;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27over5\x27)\x20return\x20total\x20>=\x205;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27exact1\x27)\x20return\x20total\x20===\x201;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27exact2\x27)\x20return\x20total\x20===\x202;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27exact3\x27)\x20return\x20total\x20===\x203;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27exact4\x27)\x20return\x20total\x20===\x204;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20false;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20analisarAutoPadroes(dados,tipo,tiros,market,inicio,fim){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20res=[];\x20const\x20offs=getOffsetsByTipo(tipo);\x20const\x20last=offs[offs.length-1];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(let\x20p=inicio;p<=fim;p++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20comb={};\x20const\x20need=(last+1)+p+tiros;\x20if(dados.length<need)\x20continue;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(let\x20i=0;i<=dados.length-need;i++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20tok=[];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(const\x20o\x20of\x20offs){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20[a,b,t,mandante,visitante]=dados[i+o];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20tok.push(tokensDoJogo(a,b,t,mandante,visitante));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20combos=enumerateCombos(tok);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20green=false;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20ini=i+last+1+p,\x20fimA=ini+tiros;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(let\x20j=ini;j<fimA&&j<dados.length;j++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20[a,b,sum]=dados[j];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(isGreenForMarket(market,a,b,sum)){\x20green=true;\x20break;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(const\x20seq\x20of\x20combos){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20key=seq.join(\x27\x20|\x20\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(!comb[key]){\x20comb[key]={ocorrencias:0,greens:0};\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20comb[key].ocorrencias++;\x20if(green)\x20comb[key].greens++;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(const\x20k\x20in\x20comb){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20st=comb[k];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(st.ocorrencias>=3){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20res.push({\x20padrao:k,\x20pular_jogos:p,\x20ocorrencias:st.ocorrencias,\x20greens:st.greens,\x20percentual:((st.greens/st.ocorrencias)*100).toFixed(1)\x20});\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20res.sort((a,b)=>parseFloat(b.percentual)-parseFloat(a.percentual)||b.ocorrencias-a.ocorrencias);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20res.slice(0,15);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20analyzeAll(payload){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20{\x20dados,\x20tiros,\x20market,\x20combinado\x20}\x20=\x20payload;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20tipos\x20=\x20combinado\x20?\x20[\x272\x27,\x273\x27,\x271_pula_1\x27,\x271_pula_1_pula_1\x27]\x20:\x20[\x272\x27];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20todos=[];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(const\x20t\x20of\x20tipos){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20r\x20=\x20analisarAutoPadroes(dados,\x20t,\x20tiros,\x20market,\x201,\x2010);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20r.forEach(x=>x.tipo_padrao=t);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20todos\x20=\x20todos.concat(r);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20todos.sort((a,b)=>parseFloat(b.percentual)-parseFloat(a.percentual)||b.ocorrencias-a.ocorrencias);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20{\x20resultados:\x20todos.slice(0,15)\x20};\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20";
let ANALYZE_WORKER = null;
function getAnalyzeWorker() {
  const _0x3d1f16 = _0x400e6e;
  if (!ANALYZE_WORKER) {
    const _0x28530e = new Blob([ANALYZE_WORKER_SRC], {
      type: _0x3d1f16(0x1e0),
    });
    ANALYZE_WORKER = new Worker(URL["createObjectURL"](_0x28530e));
  }
  return ANALYZE_WORKER;
}
function analyzeInWorker(_0x3ec90b, _0x58894a) {
  return new Promise((_0x2595c1, _0x6fb7b3) => {
    const _0x395b85 = _0xb88d,
      _0x2815cb = getAnalyzeWorker(),
      _0x501708 = Math[_0x395b85(0x247)]()
        [_0x395b85(0x1b1)](0x24)
        [_0x395b85(0x24e)](0x2),
      _0x520716 = (_0x12e4cf) => {
        const _0xbbd91b = _0x395b85,
          _0x209577 = _0x12e4cf[_0xbbd91b(0x1bf)];
        if (!_0x209577 || _0x209577["id"] !== _0x501708) return;
        _0x2815cb[_0xbbd91b(0x1aa)](_0xbbd91b(0x1d8), _0x520716);
        if (_0x209577["ok"]) _0x2595c1(_0x209577[_0xbbd91b(0x215)]);
        else _0x6fb7b3(_0x209577[_0xbbd91b(0x22a)] || _0xbbd91b(0x234));
      };
    _0x2815cb[_0x395b85(0x1c1)](_0x395b85(0x1d8), _0x520716),
      _0x2815cb[_0x395b85(0x235)]({
        cmd: "analyze",
        id: _0x501708,
        payload: { dados: _0x3ec90b, ..._0x58894a },
      });
  });
}
function mapMercado(_0x22f0be) {
  const _0x4c951d = _0x400e6e,
    _0xa2a1c5 = {
      ambasMarcam: _0x4c951d(0x1cc),
      ambasNaoMarcam: _0x4c951d(0x229),
      casaVence: _0x4c951d(0x201),
      foraVence: _0x4c951d(0x20e),
      empate: _0x4c951d(0x1e6),
      "over1.5": _0x4c951d(0x1c9),
      "over2.5": _0x4c951d(0x236),
      "over3.5": _0x4c951d(0x206),
      "under1.5": _0x4c951d(0x25e),
      "under2.5": "under2.5",
      "under3.5": "under3.5",
      exact1: "umGolExato",
      exact2: "doisGolsExatos",
      exact3: _0x4c951d(0x1fc),
      exact4: _0x4c951d(0x1cb),
      over5: "cincoOuMaisGols",
    };
  return _0xa2a1c5[_0x22f0be] || _0x22f0be;
}
function checkMarket(_0x2f85f1, _0x1b9c43, _0x3adc15, _0x30aae3) {
  const _0x3792cc = _0x400e6e;
  switch (_0x2f85f1) {
    case _0x3792cc(0x1cc):
      return _0x1b9c43 > 0x0 && _0x3adc15 > 0x0 ? 0x1 : 0x0;
    case _0x3792cc(0x229):
      return _0x1b9c43 === 0x0 || _0x3adc15 === 0x0 ? 0x1 : 0x0;
    case _0x3792cc(0x201):
      return _0x1b9c43 > _0x3adc15 ? 0x1 : 0x0;
    case _0x3792cc(0x20e):
      return _0x3adc15 > _0x1b9c43 ? 0x1 : 0x0;
    case _0x3792cc(0x1e6):
      return _0x1b9c43 === _0x3adc15 ? 0x1 : 0x0;
    case _0x3792cc(0x1c9):
      return _0x30aae3 > 1.5 ? 0x1 : 0x0;
    case "over2.5":
      return _0x30aae3 > 2.5 ? 0x1 : 0x0;
    case _0x3792cc(0x206):
      return _0x30aae3 > 3.5 ? 0x1 : 0x0;
    case "under1.5":
      return _0x30aae3 < 1.5 ? 0x1 : 0x0;
    case "under2.5":
      return _0x30aae3 < 2.5 ? 0x1 : 0x0;
    case _0x3792cc(0x246):
      return _0x30aae3 < 3.5 ? 0x1 : 0x0;
    case "umGolExato":
      return _0x30aae3 === 0x1 ? 0x1 : 0x0;
    case _0x3792cc(0x263):
      return _0x30aae3 === 0x2 ? 0x1 : 0x0;
    case _0x3792cc(0x1fc):
      return _0x30aae3 === 0x3 ? 0x1 : 0x0;
    case _0x3792cc(0x1cb):
      return _0x30aae3 === 0x4 ? 0x1 : 0x0;
    case _0x3792cc(0x1df):
      return _0x30aae3 >= 0x5 ? 0x1 : 0x0;
    default:
      return 0x0;
  }
}
function calculateMarketAnalysis(
  _0x36f7a7,
  _0x57bb70,
  _0x49e4bd,
  _0x5b4973,
  _0x1c0245
) {
  const _0x39d7ce = _0x400e6e,
    _0x54b2ea = _0x36f7a7[_0x39d7ce(0x1af)]
      [_0x39d7ce(0x1ea)]((_0x578976) => [
        _0x578976[0x5][_0x39d7ce(0x1b1)]()[_0x39d7ce(0x1f1)](0x2, "0") +
          ":" +
          _0x578976[0x6]["toString"]()[_0x39d7ce(0x1f1)](0x2, "0"),
        _0x578976[0x0],
        _0x578976[0x1],
        _0x578976[0x3],
        _0x578976[0x4],
        _0x578976[0x2],
        _0x36f7a7[_0x39d7ce(0x22c)][_0x39d7ce(0x1e7)](),
      ])
      ["slice"](-_0x49e4bd);
  if (_0x54b2ea[_0x39d7ce(0x253)] === 0x0)
    return { currentPercentage: 0x0, top5: [] };
  const _0x4e8ebb = _0x54b2ea[_0x39d7ce(0x24e)](-_0x5b4973),
    _0x4c891f = _0x4e8ebb[_0x39d7ce(0x1db)](
      (_0x15ff84, _0x2444b9) =>
        _0x15ff84 +
        checkMarket(_0x57bb70, _0x2444b9[0x1], _0x2444b9[0x2], _0x2444b9[0x5]),
      0x0
    ),
    _0x58cd3b = ((_0x4c891f / _0x5b4973) * 0x64)[_0x39d7ce(0x1fa)](0x0),
    _0x2a7b89 = {};
  _0x54b2ea["forEach"]((_0x53c51b, _0x1adba4) => {
    const _0x3b0cec = _0x39d7ce,
      [
        _0x86664,
        _0x6e88d4,
        _0xb1219f,
        _0x12ea18,
        _0x2ba188,
        _0x309f15,
        _0x4aeca8,
      ] = _0x53c51b;
    if (_0x1adba4 >= _0x5b4973 - 0x1) {
      const _0x4fd0fc = _0x54b2ea[_0x3b0cec(0x24e)](
          _0x1adba4 - _0x5b4973 + 0x1,
          _0x1adba4 + 0x1
        )[_0x3b0cec(0x1db)](
          (_0x5e0c07, _0x55899d) =>
            _0x5e0c07 +
            checkMarket(
              _0x57bb70,
              _0x55899d[0x1],
              _0x55899d[0x2],
              _0x55899d[0x5]
            ),
          0x0
        ),
        _0x2a403c = Math[_0x3b0cec(0x1ca)]((_0x4fd0fc / _0x5b4973) * 0x64);
      let _0x29a0b0 = _0x3b0cec(0x1ce),
        _0x2bd019 = 0x0,
        _0x291bde = 0x0;
      if (_0x1adba4 + _0x1c0245 <= _0x54b2ea["length"]) {
        const _0x2a8bf1 = _0x54b2ea["slice"](
          _0x1adba4 + 0x1,
          _0x1adba4 + 0x1 + _0x1c0245
        );
        (_0x2bd019 = _0x2a8bf1[_0x3b0cec(0x244)](
          (_0x878604) =>
            checkMarket(
              _0x57bb70,
              _0x878604[0x1],
              _0x878604[0x2],
              _0x878604[0x5]
            ) === 0x1
        )[_0x3b0cec(0x253)]),
          (_0x291bde = _0x1c0245 - _0x2bd019);
        const _0x24bc30 = _0x2a8bf1[_0x3b0cec(0x1a9)](
          (_0x209545) =>
            checkMarket(
              _0x57bb70,
              _0x209545[0x1],
              _0x209545[0x2],
              _0x209545[0x5]
            ) === 0x1
        );
        _0x24bc30 && (_0x29a0b0 = _0x3b0cec(0x1ed));
      }
      const _0x5c8702 = _0x57bb70 + "\x20" + _0x2a403c + "%";
      !_0x2a7b89[_0x5c8702] &&
        (_0x2a7b89[_0x5c8702] = {
          occurrences: 0x0,
          greens: 0x0,
          reds: 0x0,
          totalGreens: _0x2bd019,
          totalReds: _0x291bde,
        }),
        (_0x2a7b89[_0x5c8702]["occurrences"] += 0x1),
        _0x29a0b0 === _0x3b0cec(0x1ed)
          ? (_0x2a7b89[_0x5c8702]["greens"] += 0x1)
          : (_0x2a7b89[_0x5c8702][_0x3b0cec(0x20d)] += 0x1),
        (_0x2a7b89[_0x5c8702][_0x3b0cec(0x1ee)] = _0x2bd019),
        (_0x2a7b89[_0x5c8702][_0x3b0cec(0x1a4)] = _0x291bde);
    }
  });
  const _0x24d0d9 = Object[_0x39d7ce(0x24f)](_0x2a7b89)
      [_0x39d7ce(0x1ea)]((_0x1ee747) => {
        const _0x40a9bb = _0x39d7ce,
          _0x2f5645 = _0x2a7b89[_0x1ee747],
          _0x5ea585 = ((_0x2f5645[_0x40a9bb(0x218)] /
            _0x2f5645[_0x40a9bb(0x1a7)]) *
            0x64)[_0x40a9bb(0x1fa)](0x2);
        let _0x3c548d = "";
        const _0x25960e = parseFloat(_0x5ea585);
        if (_0x25960e > 0x4b) _0x3c548d = _0x40a9bb(0x25c);
        else {
          if (_0x25960e > 0x32) _0x3c548d = _0x40a9bb(0x1c7);
          else
            _0x25960e > 0x19
              ? (_0x3c548d = _0x40a9bb(0x1dc))
              : (_0x3c548d = "Alta\x20chance\x20de\x20falha");
        }
        return {
          marketGroup: _0x1ee747,
          marketPercentage: parseFloat(_0x1ee747["split"]("\x20")[0x1]),
          occurrences: _0x2f5645[_0x40a9bb(0x1a7)],
          greens: _0x2f5645[_0x40a9bb(0x218)],
          reds: _0x2f5645[_0x40a9bb(0x20d)],
          greenPercentage: _0x5ea585,
          totalGreens: _0x2f5645[_0x40a9bb(0x1ee)],
          totalReds: _0x2f5645[_0x40a9bb(0x1a4)],
          analysis: _0x3c548d,
        };
      })
      [_0x39d7ce(0x259)](
        (_0x26007d, _0x267c81) =>
          _0x267c81[_0x39d7ce(0x252)] - _0x26007d[_0x39d7ce(0x252)] ||
          _0x267c81[_0x39d7ce(0x218)] - _0x26007d["greens"]
      )
      [_0x39d7ce(0x24e)](0x0, 0x64),
    _0xf9f6a3 = _0x24d0d9[_0x39d7ce(0x24e)](0x0, 0x5);
  return { currentPercentage: _0x58cd3b, top5: _0xf9f6a3 };
}
function criarPromptAnalise(_0x4d4a65, _0x996949) {
  const _0x37a12c = _0x400e6e;
  return (
    _0x37a12c(0x1ad) +
    _0x4d4a65[_0x37a12c(0x214)] +
    _0x37a12c(0x1a8) +
    _0x4d4a65[_0x37a12c(0x22c)] +
    _0x37a12c(0x1b0) +
    _0x996949["mercado"] +
    "\x0a-\x20Total\x20de\x20jogos\x20analisados:\x20" +
    _0x4d4a65[_0x37a12c(0x1fe)] +
    "\x0a-\x20Estratégia\x20Martingale:\x20" +
    _0x996949[_0x37a12c(0x237)] +
    _0x37a12c(0x1cd) +
    (_0x996949["observacao"] || _0x37a12c(0x1c2)) +
    "\x0a" +
    (_0x996949[_0x37a12c(0x262)] ? _0x37a12c(0x25d) : "") +
    _0x37a12c(0x24c) +
    _0x996949["mercado"] +
    _0x37a12c(0x1fd) +
    JSON[_0x37a12c(0x1ac)](_0x4d4a65["ranking"]["slice"](0x0, 0xa), null, 0x2) +
    _0x37a12c(0x226) +
    _0x996949["mercado"] +
    _0x37a12c(0x1b4) +
    JSON[_0x37a12c(0x1ac)](_0x4d4a65[_0x37a12c(0x1ff)], null, 0x2) +
    "\x0a\x0a3.\x20PRÓXIMOS\x206\x20CONFRONTOS:\x0a" +
    JSON[_0x37a12c(0x1ac)](_0x4d4a65[_0x37a12c(0x1d0)], null, 0x2) +
    _0x37a12c(0x243) +
    _0x996949[_0x37a12c(0x1fb)] +
    "\x22:\x0aPorcentagem\x20Atual:\x20" +
    _0x4d4a65[_0x37a12c(0x250)][_0x37a12c(0x1b8)] +
    "%\x0aTop\x205\x20Melhores\x20Porcentagens:\x0a" +
    JSON["stringify"](
      _0x4d4a65[_0x37a12c(0x250)][_0x37a12c(0x1b2)],
      null,
      0x2
    ) +
    _0x37a12c(0x257)
  );
}
async function analisarComGemini(_0x1c464b, _0x1c5ff6) {
  const _0x42e01f = _0x400e6e,
    _0x3147f2 = criarPromptAnalise(_0x1c464b, _0x1c5ff6),
    _0x34a17f = await fetch(GEMINI_URL + _0x42e01f(0x24a) + GEMINI_API_KEY, {
      method: _0x42e01f(0x1eb),
      headers: { "Content-Type": _0x42e01f(0x1f2) },
      body: JSON[_0x42e01f(0x1ac)]({
        contents: [{ parts: [{ text: _0x3147f2 }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 0x28,
          topP: 0.95,
          maxOutputTokens: 0x800,
        },
      }),
    });
  if (!_0x34a17f["ok"]) {
    const _0x582b00 = await _0x34a17f[_0x42e01f(0x209)]();
    console[_0x42e01f(0x22a)](_0x42e01f(0x1ba), _0x582b00);
    throw new Error(_0x42e01f(0x1c8) + _0x34a17f["status"]);
  }
  const _0x2fc488 = await _0x34a17f[_0x42e01f(0x209)]();
  return _0x2fc488[_0x42e01f(0x233)][0x0]["content"][_0x42e01f(0x21a)][0x0][
    _0x42e01f(0x227)
  ];
}
async function gerarAnalise() {
  const _0x40c6b0 = _0x400e6e,
    _0x117370 = getSelectedValue(_0x40c6b0(0x1a3)),
    _0x56acbc = getSelectedValue(_0x40c6b0(0x224)),
    _0x1b663b = getSelectedValue("mercados-group"),
    _0x88621a = getSelectedText(_0x40c6b0(0x1dd)),
    _0x7cab4b = parseInt(getSelectedValue(_0x40c6b0(0x25f)) || "0", 0xa),
    _0x45f845 = getSelectedText(_0x40c6b0(0x25f)),
    _0x2bd6e5 = getSelectedValue(_0x40c6b0(0x23d)),
    _0x5cf487 = document[_0x40c6b0(0x1b6)](_0x40c6b0(0x213))[_0x40c6b0(0x1ef)],
    _0x1a6433 = document[_0x40c6b0(0x1b6)](_0x40c6b0(0x21d))[
      _0x40c6b0(0x20f)
    ][0x0];
  if (!_0x117370 || !_0x56acbc || !_0x1b663b || !_0x2bd6e5) {
    alert(_0x40c6b0(0x1c0));
    return;
  }
  const _0x10f6a5 = document["querySelector"](_0x40c6b0(0x225)),
    _0x4a6c91 = document[_0x40c6b0(0x1b6)](_0x40c6b0(0x1c6)),
    _0x2f9596 = document["getElementById"](_0x40c6b0(0x230)),
    _0x294c4d = document[_0x40c6b0(0x1b6)](_0x40c6b0(0x1bc));
  (_0x10f6a5["disabled"] = !![]),
    (_0x10f6a5[_0x40c6b0(0x23a)] = _0x40c6b0(0x1f7)),
    (_0x4a6c91[_0x40c6b0(0x24d)][_0x40c6b0(0x1e2)] = _0x40c6b0(0x1bd)),
    (_0x294c4d[_0x40c6b0(0x23a)] = "");
  try {
    _0x2f9596[_0x40c6b0(0x23a)] =
      _0x40c6b0(0x1f9) + _0x2bd6e5 + _0x40c6b0(0x254);
    const _0x4f2baf = await buscarDadosAPI(
      _0x117370,
      _0x56acbc,
      parseInt(_0x2bd6e5)
    );
    (_0x4f2baf[_0x40c6b0(0x1b3)] = calcularRankingTimes(
      _0x4f2baf[_0x40c6b0(0x1af)][_0x40c6b0(0x1ea)]((_0x572061) => ({
        time_a: _0x572061[0x3],
        time_b: _0x572061[0x4],
        ft: _0x572061[0x0] + _0x40c6b0(0x1b9) + _0x572061[0x1],
      })),
      _0x1b663b
    )),
      (_0x2f9596["innerHTML"] = _0x40c6b0(0x239));
    const _0x4641bb = _0x7cab4b + 0x1,
      { resultados: _0x160592 } = await analyzeInWorker(_0x4f2baf["dadosCru"], {
        tiros: _0x4641bb,
        market: _0x1b663b,
        combinado: !![],
      });
    _0x4f2baf[_0x40c6b0(0x1ff)] = _0x160592;
    const _0x47e104 = mapMercado(_0x1b663b),
      _0x23d1dc = _0x117370 === _0x40c6b0(0x210) ? 0x1e : 0x14,
      _0x4bca13 = _0x7cab4b + 0x1;
    (_0x4f2baf[_0x40c6b0(0x250)] = calculateMarketAnalysis(
      _0x4f2baf,
      _0x47e104,
      _0x4f2baf[_0x40c6b0(0x1fe)],
      _0x23d1dc,
      _0x4bca13
    )),
      (_0x2f9596[_0x40c6b0(0x23a)] = _0x40c6b0(0x1be));
    const _0x4d9b03 = {
        mercado: _0x88621a,
        liga: _0x56acbc,
        martingale: _0x45f845 || _0x40c6b0(0x22f),
        periodo: _0x2bd6e5 + _0x40c6b0(0x25a),
        observacao: _0x5cf487,
        imagem: _0x1a6433 ? !![] : ![],
      },
      _0xeb8662 = await analisarComGemini(_0x4f2baf, _0x4d9b03);
    (_0x2f9596["innerHTML"] =
      _0x40c6b0(0x261) +
      casasConfig[_0x117370][_0x40c6b0(0x21e)] +
      "\x20(" +
      _0x56acbc +
      ")"),
      (_0x294c4d[_0x40c6b0(0x242)] = _0xeb8662);
  } catch (_0x582cb6) {
    console[_0x40c6b0(0x22a)](
      "Erro\x20no\x20processo\x20de\x20análise:",
      _0x582cb6
    ),
      (_0x2f9596["innerHTML"] = _0x40c6b0(0x1d5)),
      (_0x294c4d["innerHTML"] =
        "<div\x20class=\x22error\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<strong>Erro:</strong>\x20" +
        _0x582cb6["message"] +
        _0x40c6b0(0x1f8));
  } finally {
    (_0x10f6a5[_0x40c6b0(0x204)] = ![]),
      (_0x10f6a5["innerHTML"] = "Gerar\x20Análise\x20IA");
  }
}
document[_0x400e6e(0x1b6)](_0x400e6e(0x21d))[_0x400e6e(0x1c1)](
  "change",
  function (_0x562fcc) {
    const _0x10634b = _0x400e6e,
      _0x2373c7 = _0x562fcc[_0x10634b(0x20a)][_0x10634b(0x20f)][0x0],
      _0x4fd9ec = document[_0x10634b(0x1b6)](_0x10634b(0x23b)),
      _0x3e2d67 = document[_0x10634b(0x1b6)](_0x10634b(0x1c5));
    if (_0x2373c7) {
      const _0x3373a3 = new FileReader();
      (_0x3373a3[_0x10634b(0x212)] = function (_0x3ebd75) {
        const _0x345a19 = _0x10634b;
        (_0x4fd9ec[_0x345a19(0x203)] =
          _0x3ebd75[_0x345a19(0x20a)][_0x345a19(0x215)]),
          (_0x4fd9ec[_0x345a19(0x24d)][_0x345a19(0x1e2)] = _0x345a19(0x1bd));
      }),
        _0x3373a3[_0x10634b(0x1a5)](_0x2373c7),
        (_0x3e2d67[_0x10634b(0x242)] = _0x2373c7[_0x10634b(0x21e)]);
    } else
      (_0x4fd9ec[_0x10634b(0x24d)]["display"] = _0x10634b(0x1f3)),
        (_0x3e2d67[_0x10634b(0x242)] = "Nenhum\x20arquivo\x20selecionado");
  }
);
