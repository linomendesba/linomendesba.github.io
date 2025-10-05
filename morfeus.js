const _0x423b82 = _0x4c9a;
(function (_0x240121, _0x30de1b) {
  const _0x2764b2 = _0x4c9a,
    _0x43422d = _0x240121();
  while (!![]) {
    try {
      const _0x34e7bb =
        (-parseInt(_0x2764b2(0x185)) / 0x1) *
          (parseInt(_0x2764b2(0xfc)) / 0x2) +
        parseInt(_0x2764b2(0x15c)) / 0x3 +
        -parseInt(_0x2764b2(0x168)) / 0x4 +
        -parseInt(_0x2764b2(0x128)) / 0x5 +
        -parseInt(_0x2764b2(0xd7)) / 0x6 +
        parseInt(_0x2764b2(0x131)) / 0x7 +
        (parseInt(_0x2764b2(0x113)) / 0x8) * (parseInt(_0x2764b2(0x160)) / 0x9);
      if (_0x34e7bb === _0x30de1b) break;
      else _0x43422d["push"](_0x43422d["shift"]());
    } catch (_0x586450) {
      _0x43422d["push"](_0x43422d["shift"]());
    }
  }
})(_0x38e8, 0xf1cc6);
const GEMINI_API_KEY = "AIzaSyAwrtYzlQxzMfBHK3k6sw5qAWTS7jBSSNQ",
  GEMINI_URL = _0x423b82(0xcb),
  casasConfig = {
    betano: {
      name: _0x423b82(0x147),
      ligas: [
        _0x423b82(0x175),
        _0x423b82(0xee),
        "Euro",
        "Campeonato\x20Italiano",
        _0x423b82(0x17c),
        _0x423b82(0x15b),
      ],
    },
    kiron: {
      name: _0x423b82(0x10b),
      ligas: [_0x423b82(0x12e), _0x423b82(0x11d), "Spain"],
      path: _0x423b82(0xc3),
    },
    estrela: {
      name: _0x423b82(0xdd),
      ligas: ["estrela"],
      path: _0x423b82(0xba),
    },
    betsson: {
      name: _0x423b82(0xe7),
      ligas: [_0x423b82(0xd4), _0x423b82(0x138), _0x423b82(0x14f)],
      path: _0x423b82(0x156),
    },
  };
document[_0x423b82(0xdb)](_0x423b82(0x11c))[_0x423b82(0x10f)]((_0x140252) => {
  const _0x1909b1 = _0x423b82;
  _0x140252[_0x1909b1(0x118)]("click", (_0x289a90) => {
    const _0x11d1e0 = _0x1909b1;
    if (
      _0x289a90[_0x11d1e0(0xfa)]["classList"][_0x11d1e0(0x106)](
        _0x11d1e0(0x162)
      )
    ) {
      const _0x22d867 = _0x140252[_0x11d1e0(0x127)](".btn.active");
      _0x22d867 && _0x22d867["classList"][_0x11d1e0(0xfb)]("active"),
        _0x289a90[_0x11d1e0(0xfa)][_0x11d1e0(0xf6)]["add"](_0x11d1e0(0x180)),
        _0x140252["id"] === _0x11d1e0(0x170) &&
          mostrarLigas(_0x289a90["target"][_0x11d1e0(0xbf)][_0x11d1e0(0x126)]);
    }
  });
});
function _0x38e8() {
  const _0x5d2752 = [
    "estrela",
    "<div\x20class=\x22error\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<strong>Erro:</strong>\x20",
    "padStart",
    "<div\x20class=\x22loading\x22><div\x20class=\x22spinner\x22></div>Gerando\x20análise\x20com\x20IA...</div>",
    "empate",
    "dataset",
    "exact2",
    "?key=",
    "application/json",
    "kiron",
    "tresGolsExatos",
    "observacao",
    "stringify",
    "totalJogos",
    "message",
    "random",
    "✓\x20Análise\x20Concluída\x20-\x20",
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    "Falha\x20ao\x20conectar\x20com\x20a\x20API:\x20",
    "/proximos/",
    "greens",
    "martingale-group",
    "removeEventListener",
    "\x22:\x0a",
    "\x0a\x0aINSTRUÇÕES\x20DE\x20ANÁLISE\x20(SUA\x20TAREFA):\x0a1.\x20\x20Sua\x20missão\x20é\x20conectar\x20as\x20informações\x20acima.\x0aNão\x20processe\x20dados\x20brutos,\x20apenas\x20interprete\x20os\x20resultados\x20que\x20eu\x20forneci.\x0a2.\x20\x20Analise\x20os\x20\x22TOP\x2015\x20PADRÕES\x22.\x0aIdentifique\x20quais\x20têm\x20o\x20maior\x20percentual\x20de\x20acerto\x20(percentual)\x20e\x20um\x20número\x20sólido\x20de\x20ocorrências.\x0aPadrões\x20com\x20100%\x20de\x20acerto\x20e\x20poucas\x20ocorrências\x20são\x20promissores,\x20mas\x20de\x20alto\x20risco.\x0a3.\x20\x20Observe\x20os\x20\x22PRÓXIMOS\x206\x20CONFRONTOS\x22.\x20Verifique\x20se\x20algum\x20desses\x20jogos\x20envolve\x20times\x20que\x20estão\x20bem\x20posicionados\x20no\x20\x22RANKING\x20DE\x20TIMES\x22.\x0a4.\x20\x20Cruze\x20as\x20informações:\x20A\x20oportunidade\x20de\x20maior\x20valor\x20acontece\x20quando\x20um\x20padrão\x20forte\x20aponta\x20para\x20um\x20dos\x20próximos\x20confrontos\x20E\x20esse\x20confronto\x20envolve\x20times\x20com\x20bom\x20desempenho\x20histórico\x20no\x20mercado.\x0a5.\x20\x20Se\x20uma\x20imagem\x20foi\x20fornecida,\x20considere\x20que\x20ela\x20pode\x20conter\x20informações\x20visuais\x20complementares\x20(como\x20estatísticas\x20ou\x20gráficos)\x20e\x20mencione\x20que\x20ela\x20foi\x20considerada\x20na\x20análise,\x20mas\x20não\x20tente\x20descrevê-la\x20diretamente.\x0a6.\x20\x20Baseado\x20nesta\x20síntese,\x20gere\x20a\x20sua\x20análise\x20no\x20formato\x20abaixo.\x0aO\x20número\x20de\x20sugestões\x20de\x20horários\x20deve\x20seguir\x20a\x20estratégia\x20Martingale\x20(Nenhum\x20=\x201\x20jogo,\x201\x20Cobertura\x20=\x202\x20jogos,\x202\x20Coberturas\x20=\x203\x20jogos,\x203\x20Coberturas\x20=\x204\x20jogos).\x0a7.\x20\x20Se\x20nenhum\x20padrão\x20forte\x20se\x20alinhar\x20com\x20os\x20próximos\x20jogos\x20de\x20times\x20bem\x20ranqueados,\x20seja\x20honesto\x20e\x20informe\x20que\x20nenhuma\x20oportunidade\x20clara\x20foi\x20encontrada.\x0a8.\x20\x20Para\x20as\x20sugestões\x20de\x20horários:\x20Selecione\x20o\x20próximo\x20confronto\x20que\x20melhor\x20se\x20alinha\x20com\x20padrões\x20fortes\x20e\x20times\x20bem\x20ranqueados\x20como\x20o\x20principal.\x0aEm\x20seguida,\x20adicione\x20as\x20coberturas\x20como\x20os\x20confrontos\x20sequenciais\x20seguintes.\x0aGaranta\x20que\x20os\x20horários\x20estejam\x20em\x20sequência\x20cronológica\x20crescente,\x20sem\x20repetições,\x20e\x20baseados\x20exclusivamente\x20nos\x20horários\x20fornecidos\x20nos\x20próximos\x20confrontos.\x0aAssuma\x20que\x20a\x20lista\x20de\x20próximos\x20está\x20ordenada\x20por\x20tempo,\x20e\x20selecione\x20apenas\x20horários\x20futuros\x20ou\x20os\x20mais\x20próximos.\x0aO\x20primeiro\x20horário\x20é\x20o\x20principal\x20com\x20padrão\x20e\x20análise,\x20os\x20demais\x20são\x20coberturas.\x0a9.\x20\x20Inclua\x20uma\x20seção\x20independente\x20para\x20a\x20Análise\x20de\x20Gráfico\x20de\x20Mercado,\x20comentando\x20a\x20porcentagem\x20atual\x20e\x20destacando\x20as\x20top\x205\x20melhores\x20porcentagens,\x20considerando\x20o\x20Martingale\x20selecionado\x20para\x20a\x20verificação.\x0aFORMATO\x20DA\x20RESPOSTA\x20(Use\x20um\x20tom\x20natural\x20e\x20profissional,\x20evite\x20usar\x20negrito\x20com\x20asteriscos\x20**):\x0a\x0a🎯\x20ANÁLISE\x20ESTATÍSTICA\x0a[Comente\x20brevemente\x20sobre\x20o\x20desempenho\x20dos\x20times\x20no\x20ranking\x20e\x20a\x20força\x20geral\x20dos\x20padrões\x20encontrados.\x0aEx:\x20\x22Observa-se\x20que\x20os\x20times\x20X\x20e\x20Y\x20são\x20dominantes\x20neste\x20mercado.\x20Foram\x20encontrados\x20N\x20padrões\x20com\x20mais\x20de\x2080%\x20de\x20acerto,\x20indicando\x20consistência...\x22]\x0a\x0a📊\x20PADRÕES\x20RELEVANTES\x0a[Destaque\x202\x20ou\x203\x20dos\x20padrões\x20mais\x20promissores\x20da\x20lista,\x20explicando\x20por\x20que\x20são\x20relevantes.\x0aEx:\x20\x22O\x20padrão\x20\x27over2.5\x20|\x201-2\x27\x20se\x20destaca\x20com\x2085%\x20de\x20acerto\x20em\x2020\x20ocorrências,\x20mostrando\x20ser\x20um\x20gatilho\x20confiável...\x22]\x0a\x0a📈\x20ANÁLISE\x20DE\x20GRÁFICO\x20DE\x20MERCADO\x0a[Comente\x20sobre\x20a\x20porcentagem\x20atual\x20do\x20mercado\x20e\x20destaque\x20as\x20top\x205\x20melhores\x20porcentagens,\x20incluindo\x20greenPercentage,\x20occurrences,\x20etc.,\x20considerando\x20o\x20Martingale\x20selecionado\x20para\x20a\x20verificação\x20de\x20linhas.]\x0a\x0a⚡\x20PRÓXIMAS\x20OPORTUNIDADES\x0a[Baseado\x20na\x20sua\x20análise\x20combinada,\x20liste\x20as\x20entradas\x20recomendadas.\x0aSe\x20nenhuma\x20for\x20encontrada,\x20justifique\x20o\x20motivo.\x0aFormato\x20se\x20encontrar:\x0aLiga:\x20[liga]\x0aMercado:\x20[mercado]\x0a⏰\x20Horários\x0a▸\x20[hora:minuto]\x20▸\x20[hora:minuto]\x20...\x20(número\x20baseado\x20na\x20Martingale,\x20em\x20sequência\x20sem\x20repetições)\x0aJustificativa:\x20[Breve\x20explicação\x20do\x20porquê\x20esta\x20é\x20uma\x20boa\x20entrada,\x20mencionando\x20o\x20padrão\x20e\x20os\x20times\x20envolvidos.\x0aNote\x20que\x20o\x20primeiro\x20horário\x20é\x20o\x20principal\x20onde\x20padrões\x20foram\x20encontrados,\x20os\x20demais\x20são\x20coberturas\x20sequenciais.]\x0a\x0a🎲\x20ESTRATÉGIA\x20MARTINGALE\x0a[Avalie\x20a\x20segurança\x20da\x20estratégia\x20para\x20este\x20cenário.\x0aEx:\x20\x22Considerando\x20a\x20força\x20dos\x20padrões\x20encontrados,\x20a\x20estratégia\x20de\x20[N]\x20coberturas\x20parece\x20[segura/arriscada]...\x22]\x0a\x0a💡\x20RECOMENDAÇÃO\x20FINAL\x0a[Dê\x20uma\x20recomendação\x20final\x20clara\x20e\x20objetiva.\x0aEx:\x20\x22Recomendo\x20a\x20entrada\x20nos\x20horários\x20sugeridos\x20devido\x20à\x20forte\x20confluência\x20entre\x20o\x20padrão\x20X\x20e\x20o\x20confronto\x20envolvendo\x20o\x20time\x20Y,\x20que\x20possui\x20um\x20histórico\x20excelente\x20neste\x20mercado.\x22]\x0a",
    "Erro\x20na\x20API\x20do\x20Gemini:\x20",
    "Espanha",
    "toISOString",
    "exact1",
    "2546676pzkwEz",
    "reduce",
    "\x0a-\x20Total\x20de\x20jogos\x20analisados:\x20",
    "Casa\x20",
    "querySelectorAll",
    "error",
    "Estrelabet",
    "under1.5",
    ".btn.active",
    "ambasSim",
    ".btn-generate",
    "ranking",
    "appendChild",
    "periodo-group",
    "<div\x20class=\x22loading\x22><div\x20class=\x22spinner\x22></div>Analisando\x20padrões...</div>",
    "marketCount",
    "Betsson",
    "/resultados/",
    "analyze",
    "dadosCru",
    "parts",
    "over1.5",
    "reds",
    "Copa\x20América",
    "\x0a\x0a4.\x20ANÁLISE\x20DE\x20GRÁFICO\x20DE\x20MERCADO\x20PARA\x20O\x20MERCADO\x20\x22",
    "totalGreens",
    "mercado",
    "data",
    "Alta\x20chance\x20de\x20acerto",
    "Erro\x20ao\x20buscar\x20dados\x20da\x20API:",
    "image-preview",
    "classList",
    "path",
    "analysisUsage",
    "Gerar\x20Análise\x20IA",
    "target",
    "remove",
    "4QGGiEh",
    "status",
    "none",
    "result",
    "change",
    "0.0",
    "cincoOuMaisGols",
    "json",
    "\x0a-\x20Estratégia\x20Martingale:\x20",
    "setItem",
    "contains",
    "hora",
    "display",
    "under2.5",
    "quatroGolsExatos",
    "Kiron",
    "totalGames",
    "createObjectURL",
    "time_b",
    "forEach",
    "ligas",
    "exact4",
    "ceil",
    "14968gDFLbr",
    "\x0a-\x20Observações\x20do\x20Usuário:\x20",
    "sort",
    "toFixed",
    "exact3",
    "addEventListener",
    "umGolExato",
    "\x20jogos",
    "textContent",
    ".btn-grid",
    "Italy",
    "Erro\x20na\x20API\x20Gemini:",
    "files",
    "red",
    "Alta\x20chance\x20de\x20falha",
    "values",
    "Erro\x20no\x20worker\x20de\x20análise",
    "\x20jogos...</div>",
    "\x20x\x20",
    "value",
    "querySelector",
    "6775840OWxIFi",
    "casaVence",
    "length",
    "<div\x20class=\x22loading\x22><div\x20class=\x22spinner\x22></div>Coletando\x20",
    "postMessage",
    "Você\x20atingiu\x20o\x20limite\x20de\x206\x20análises\x20por\x20dia.\x20Por\x20favor,\x20volte\x20amanhã.",
    "England",
    "green",
    "proximos",
    "11045244fwOKMK",
    "padroesEncontrados",
    "disabled",
    "push",
    "Risco\x20elevado",
    "\x0a\x0a3.\x20PRÓXIMOS\x206\x20CONFRONTOS:\x0a",
    "top5",
    "Inglaterra",
    "filter",
    "\x22\x20(Top\x2010):\x0a",
    "count",
    "over3.5",
    "over5",
    "content",
    "getItem",
    "ligas-group",
    "trim",
    "Nenhum\x20arquivo\x20selecionado",
    "innerHTML",
    "Moderada\x20chance",
    "block",
    "occurrences",
    "Betano",
    "doisGolsExatos",
    "image-upload",
    "keys",
    "result-content",
    "foraVence",
    "ambasMarcam",
    "\x0a\x0aINFORMAÇÕES\x20PRÉ-PROCESSADAS:\x0a\x0a1.\x20RANKING\x20DE\x20TIMES\x20PARA\x20O\x20MERCADO\x20\x22",
    "Brasil",
    "includes",
    "ambasNao",
    "style",
    "\x0a\x20\x20\x20\x20\x20\x20\x20\x20self.onmessage\x20=\x20(e)\x20=>\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20p\x20=\x20e.data;\x0aif\x20(!p\x20||\x20p.cmd\x20!==\x20\x27analyze\x27)\x20return;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20res\x20=\x20analyzeAll(p.payload);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20self.postMessage({\x20ok:\x20true,\x20id:\x20p.id,\x20result:\x20res\x20});\x0a\x20\x20\x20\x20\x20\x20\x20\x20};\x0afunction\x20enumerateCombos(tok){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(tok.length===1)\x20return\x20tok[0].map(t=>[t]);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(tok.length===2){\x20const\x20out=[];\x0afor(const\x20a\x20of\x20tok[0])\x20for(const\x20b\x20of\x20tok[1])\x20out.push([a,b]);\x20return\x20out;\x0a}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(tok.length===3){\x20const\x20out=[];\x0afor(const\x20a\x20of\x20tok[0])\x20for(const\x20b\x20of\x20tok[1])\x20for(const\x20c\x20of\x20tok[2])\x20out.push([a,b,c]);\x20return\x20out;\x0a}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20out=[],cur=[];\x0a(function\x20rec(i){\x20if(i===tok.length){\x20out.push(cur.slice());\x20return;\x20}\x20for(const\x20t\x20of\x20tok[i]){\x20cur.push(t);\x20rec(i+1);\x20cur.pop();\x20}\x20})(0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20out;\x0a}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20getOffsetsByTipo(t){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(t===\x271\x27)\x20return\x20[0];\x0aif(t===\x272\x27)\x20return\x20[0,1];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(t===\x273\x27)\x20return\x20[0,1,2];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(t===\x271_pula_1\x27)\x20return\x20[0,2];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(t===\x271_pula_1_pula_1\x27)\x20return\x20[0,2,4];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20[0,1];\x0a}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20tokensDoJogo(a,b,total,mandante,visitante){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20t\x20=\x20new\x20Set();\x0at.add(`${a}-${b}`);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20t.add(a\x20>\x200\x20&&\x20b\x20>\x200\x20?\x20\x27ambasMarcam\x27\x20:\x20\x27ambasNaoMarcam\x27);\x0at.add(a\x20>\x20b\x20?\x20\x27casaVence\x27\x20:\x20(a\x20<\x20b\x20?\x20\x27foraVence\x27\x20:\x20\x27empate\x27));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20>=\x202)\x20t.add(\x27over1.5\x27);\x0aif\x20(total\x20<\x202)\x20t.add(\x27under1.5\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20>=\x203)\x20t.add(\x27over2.5\x27);\x20if\x20(total\x20<\x203)\x20t.add(\x27under2.5\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20>=\x204)\x20t.add(\x27over3.5\x27);\x0aif\x20(total\x20<\x204)\x20t.add(\x27under3.5\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20>=\x205)\x20t.add(\x27over5\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20===\x201)\x20t.add(\x27exact1\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20===\x202)\x20t.add(\x27exact2\x27);\x0aif\x20(total\x20===\x203)\x20t.add(\x27exact3\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20===\x204)\x20t.add(\x27exact4\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(mandante)\x20t.add(mandante.toLowerCase());\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(visitante)\x20t.add(visitante.toLowerCase());\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20Array.from(t);\x0a}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20isGreenForMarket(m,a,b,total){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27ambasMarcam\x27)\x20return\x20a\x20>\x200\x20&&\x20b\x20>\x200;\x0aif\x20(m\x20===\x20\x27ambasNaoMarcam\x27)\x20return\x20a\x20===\x200\x20||\x20b\x20===\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27casaVence\x27)\x20return\x20a\x20>\x20b;\x0aif\x20(m\x20===\x20\x27foraVence\x27)\x20return\x20a\x20<\x20b;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27empate\x27)\x20return\x20a\x20===\x20b;\x0aif\x20(m\x20===\x20\x27over1.5\x27)\x20return\x20total\x20>=\x202;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27under1.5\x27)\x20return\x20total\x20<\x202;\x0aif\x20(m\x20===\x20\x27over2.5\x27)\x20return\x20total\x20>=\x203;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27under2.5\x27)\x20return\x20total\x20<\x203;\x0aif\x20(m\x20===\x20\x27over3.5\x27)\x20return\x20total\x20>=\x204;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27under3.5\x27)\x20return\x20total\x20<\x204;\x0aif\x20(m\x20===\x20\x27over5\x27)\x20return\x20total\x20>=\x205;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27exact1\x27)\x20return\x20total\x20===\x201;\x0aif\x20(m\x20===\x20\x27exact2\x27)\x20return\x20total\x20===\x202;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27exact3\x27)\x20return\x20total\x20===\x203;\x0aif\x20(m\x20===\x20\x27exact4\x27)\x20return\x20total\x20===\x204;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20false;\x0a}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20analisarAutoPadroes(dados,tipo,tiros,market,inicio,fim){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20res=[];\x0aconst\x20offs=getOffsetsByTipo(tipo);\x20const\x20last=offs[offs.length-1];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(let\x20p=inicio;p<=fim;p++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20comb={};\x0aconst\x20need=(last+1)+p+tiros;\x20if(dados.length<need)\x20continue;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(let\x20i=0;i<=dados.length-need;i++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20tok=[];\x0afor(const\x20o\x20of\x20offs){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20[a,b,t,mandante,visitante]=dados[i+o];\x0atok.push(tokensDoJogo(a,b,t,mandante,visitante));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20combos=enumerateCombos(tok);\x0alet\x20green=false;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20ini=i+last+1+p,\x20fimA=ini+tiros;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(let\x20j=ini;j<fimA&&j<dados.length;j++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20[a,b,sum]=dados[j];\x0aif(isGreenForMarket(market,a,b,sum)){\x20green=true;\x20break;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(const\x20seq\x20of\x20combos){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20key=seq.join(\x27\x20|\x20\x27);\x0aif(!comb[key]){\x20comb[key]={ocorrencias:0,greens:0};\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20comb[key].ocorrencias++;\x0aif(green)\x20comb[key].greens++;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(const\x20k\x20in\x20comb){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20st=comb[k];\x0aif(st.ocorrencias>=3){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20res.push({\x20padrao:k,\x20pular_jogos:p,\x20ocorrencias:st.ocorrencias,\x20greens:st.greens,\x20percentual:((st.greens/st.ocorrencias)*100).toFixed(1)\x20});\x0a}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20res.sort((a,b)=>parseFloat(b.percentual)-parseFloat(a.percentual)||b.ocorrencias-a.ocorrencias);\x0areturn\x20res.slice(0,15);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20analyzeAll(payload){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20{\x20dados,\x20tiros,\x20market,\x20combinado\x20}\x20=\x20payload;\x0aconst\x20tipos\x20=\x20combinado\x20?\x20[\x272\x27,\x273\x27,\x271_pula_1\x27,\x271_pula_1_pula_1\x27]\x20:\x20[\x272\x27];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20todos=[];\x0afor(const\x20t\x20of\x20tipos){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20r\x20=\x20analisarAutoPadroes(dados,\x20t,\x20tiros,\x20market,\x201,\x2010);\x0ar.forEach(x=>x.tipo_padrao=t);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20todos\x20=\x20todos.concat(r);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20todos.sort((a,b)=>parseFloat(b.percentual)-parseFloat(a.percentual)||b.ocorrencias-a.ocorrencias);\x0areturn\x20{\x20resultados:\x20todos.slice(0,15)\x20};\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20",
    "map",
    "src",
    "betsson",
    "under3.5",
    "casa",
    "createElement",
    "split",
    "Brasileirão\x20Betano",
    "4175016pOWMOg",
    "martingale",
    "Nenhum",
    "\x22:\x0aPorcentagem\x20Atual:\x20",
    "2799pBWnbV",
    "\x0a-\x20Mercado:\x20",
    "btn",
    "minuto",
    "some",
    "mercados-group",
    "\x20minuto(s)\x20antes\x20de\x20gerar\x20uma\x20nova\x20análise.",
    "onload",
    "614916lsAKJR",
    "then",
    "over2.5",
    "liga",
    "application/javascript",
    "getElementById",
    "parse",
    "<br><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<strong>Causas\x20possíveis:</strong>\x20Falha\x20na\x20operação.\x0aAtualize\x20a\x20página\x20e\x20tente\x20outra\x20vez\x20mais\x20tarde.\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>",
    "casas-group",
    "totalReds",
    "greenPercentage",
    "currentPercentage",
    "lastAnalysis",
    "Taça\x20Glória\x20Eterna",
    "innerText",
    "result-title",
    "image-status",
    "slice",
    "marketAnalysis",
    "<div\x20class=\x22spinner\x22></div>\x20Processando...",
    "Copa\x20das\x20Estrelas",
    "isFinite",
    "liga-section",
    "percentage",
    "active",
    "name",
    "Por\x20favor,\x20selecione\x20Casa,\x20Liga,\x20Mercado\x20e\x20Período\x20de\x20Análise.",
    "result-container",
    "Nenhuma",
    "313848fYtPfF",
    "toLowerCase",
    "\x0a\x0a2.\x20TOP\x2015\x20PADRÕES\x20ENCONTRADOS\x20PARA\x20O\x20MERCADO\x20\x22",
  ];
  _0x38e8 = function () {
    return _0x5d2752;
  };
  return _0x38e8();
}
function mostrarLigas(_0x3996de) {
  const _0x5e710d = _0x423b82,
    _0x42bd91 = document[_0x5e710d(0x16d)](_0x5e710d(0x17e)),
    _0x405b7a = document["getElementById"]("ligas-group");
  if (!casasConfig[_0x3996de]) {
    _0x42bd91[_0x5e710d(0x152)]["display"] = _0x5e710d(0xfe);
    return;
  }
  (_0x405b7a["innerHTML"] = ""),
    casasConfig[_0x3996de][_0x5e710d(0x110)][_0x5e710d(0x10f)]((_0x5a30f9) => {
      const _0x5f4d33 = _0x5e710d,
        _0x3bd41a = document[_0x5f4d33(0x159)]("button");
      (_0x3bd41a["className"] = "btn"),
        (_0x3bd41a[_0x5f4d33(0xbf)][_0x5f4d33(0x126)] = _0x5a30f9),
        (_0x3bd41a["textContent"] = _0x5a30f9),
        _0x405b7a[_0x5f4d33(0xe3)](_0x3bd41a);
    }),
    (_0x42bd91[_0x5e710d(0x152)]["display"] = _0x5e710d(0x145));
}
function getSelectedValue(_0x43597f) {
  const _0x4e110b = _0x423b82,
    _0xc22561 = document[_0x4e110b(0x16d)](_0x43597f),
    _0xd48d5c = _0xc22561["querySelector"](".btn.active");
  return _0xd48d5c ? _0xd48d5c[_0x4e110b(0xbf)][_0x4e110b(0x126)] : null;
}
function getSelectedText(_0xfa868f) {
  const _0x5508cc = _0x423b82,
    _0x42c442 = document["getElementById"](_0xfa868f),
    _0x44091c = _0x42c442[_0x5508cc(0x127)](_0x5508cc(0xdf));
  return _0x44091c ? _0x44091c[_0x5508cc(0x176)] : null;
}
function limparAnalise() {
  const _0x380d57 = _0x423b82;
  document[_0x380d57(0xdb)](_0x380d57(0xdf))[_0x380d57(0x10f)]((_0x15135f) =>
    _0x15135f[_0x380d57(0xf6)][_0x380d57(0xfb)](_0x380d57(0x180))
  ),
    (document[_0x380d57(0x16d)](_0x380d57(0xc5))["value"] = ""),
    (document[_0x380d57(0x16d)](_0x380d57(0x149))[_0x380d57(0x126)] = ""),
    (document[_0x380d57(0x16d)](_0x380d57(0x178))[_0x380d57(0x11b)] =
      "Nenhum\x20arquivo\x20selecionado"),
    (document[_0x380d57(0x16d)]("image-preview")[_0x380d57(0x152)][
      _0x380d57(0x108)
    ] = _0x380d57(0xfe)),
    (document[_0x380d57(0x16d)](_0x380d57(0x183))[_0x380d57(0x152)][
      _0x380d57(0x108)
    ] = "none"),
    (document[_0x380d57(0x16d)]("liga-section")["style"][_0x380d57(0x108)] =
      _0x380d57(0xfe));
}
function calcularRankingTimes(_0x49ce47, _0x1597a0) {
  const _0x35cc28 = _0x423b82,
    _0x54f690 = {};
  _0x49ce47[_0x35cc28(0x10f)]((_0x3e1292) => {
    const _0x3e713c = _0x35cc28,
      { time_a: _0x3a9175, time_b: _0x4f98c0, ft: _0x3ea5c9 } = _0x3e1292;
    if (!_0x3ea5c9 || !_0x3ea5c9[_0x3e713c(0x150)](_0x3e713c(0x125))) return;
    const [_0x508fb0, _0x469d18] =
        _0x3ea5c9[_0x3e713c(0x15a)]("\x20x\x20")[_0x3e713c(0x154)](Number),
      _0x14a2fa = _0x508fb0 + _0x469d18;
    [_0x3a9175, _0x4f98c0]["forEach"]((_0x15d0a0) => {
      !_0x54f690[_0x15d0a0] &&
        (_0x54f690[_0x15d0a0] = {
          name: _0x15d0a0,
          totalGames: 0x0,
          marketCount: 0x0,
        });
    }),
      _0x54f690[_0x3a9175][_0x3e713c(0x10c)]++,
      _0x54f690[_0x4f98c0][_0x3e713c(0x10c)]++;
    let _0x2ba336 = ![];
    switch (_0x1597a0) {
      case _0x3e713c(0x14d):
        _0x2ba336 = _0x508fb0 > 0x0 && _0x469d18 > 0x0;
        break;
      case "ambasNaoMarcam":
        _0x2ba336 = _0x508fb0 === 0x0 || _0x469d18 === 0x0;
        break;
      case _0x3e713c(0xbe):
        _0x2ba336 = _0x508fb0 === _0x469d18;
        break;
      case _0x3e713c(0xec):
        _0x2ba336 = _0x14a2fa > 0x1;
        break;
      case _0x3e713c(0xde):
        _0x2ba336 = _0x14a2fa < 0x2;
        break;
      case _0x3e713c(0x16a):
        _0x2ba336 = _0x14a2fa > 0x2;
        break;
      case "under2.5":
        _0x2ba336 = _0x14a2fa < 0x3;
        break;
      case _0x3e713c(0x13c):
        _0x2ba336 = _0x14a2fa > 0x3;
        break;
      case _0x3e713c(0x157):
        _0x2ba336 = _0x14a2fa < 0x4;
        break;
      case _0x3e713c(0x13d):
        _0x2ba336 = _0x14a2fa >= 0x5;
        break;
      case _0x3e713c(0xd6):
        _0x2ba336 = _0x14a2fa === 0x1;
        break;
      case _0x3e713c(0xc0):
        _0x2ba336 = _0x14a2fa === 0x2;
        break;
      case _0x3e713c(0x117):
        _0x2ba336 = _0x14a2fa === 0x3;
        break;
      case _0x3e713c(0x111):
        _0x2ba336 = _0x14a2fa === 0x4;
        break;
    }
    _0x2ba336 &&
      (_0x54f690[_0x3a9175][_0x3e713c(0xe6)]++,
      _0x54f690[_0x4f98c0][_0x3e713c(0xe6)]++);
    if (_0x1597a0 === _0x3e713c(0x129) && _0x508fb0 > _0x469d18)
      _0x54f690[_0x3a9175][_0x3e713c(0xe6)]++;
    if (_0x1597a0 === _0x3e713c(0x14c) && _0x469d18 > _0x508fb0)
      _0x54f690[_0x4f98c0][_0x3e713c(0xe6)]++;
  });
  const _0x3bb51d = Object[_0x35cc28(0x122)](_0x54f690)[_0x35cc28(0x154)](
    (_0x4b0b0e) => ({
      ..._0x4b0b0e,
      percentage:
        _0x4b0b0e["totalGames"] > 0x0
          ? ((_0x4b0b0e["marketCount"] / _0x4b0b0e[_0x35cc28(0x10c)]) * 0x64)[
              _0x35cc28(0x116)
            ](0x1)
          : _0x35cc28(0x101),
    })
  );
  return (
    _0x3bb51d[_0x35cc28(0x115)](
      (_0x24bc23, _0x24b75f) =>
        _0x24b75f[_0x35cc28(0xe6)] - _0x24bc23["marketCount"] ||
        parseFloat(_0x24b75f[_0x35cc28(0x17f)]) -
          parseFloat(_0x24bc23[_0x35cc28(0x17f)])
    ),
    _0x3bb51d
  );
}
async function buscarDadosAPI(_0x5120ae, _0x3ce7e7, _0x477f98) {
  const _0x52c9ef = _0x423b82,
    _0x44a5f3 = casasConfig[_0x5120ae];
  if (!_0x44a5f3)
    throw new Error(_0x52c9ef(0xda) + _0x5120ae + "\x20não\x20encontrada");
  const _0xb7e571 = {
    casa: _0x44a5f3[_0x52c9ef(0x181)],
    liga: _0x3ce7e7,
    totalJogos: 0x0,
    dadosCru: [],
  };
  try {
    const _0x41fd38 = encodeURIComponent(_0x3ce7e7),
      _0x63ad53 = "https://betstat.site";
    let _0x43504a, _0xdb2648;
    _0x44a5f3[_0x52c9ef(0xf7)]
      ? ((_0x43504a =
          _0x63ad53 +
          "/resultados/" +
          _0x44a5f3[_0x52c9ef(0xf7)] +
          "/" +
          _0x41fd38),
        (_0xdb2648 =
          _0x63ad53 +
          _0x52c9ef(0xcd) +
          _0x44a5f3[_0x52c9ef(0xf7)] +
          "/" +
          _0x41fd38))
      : ((_0x43504a = _0x63ad53 + _0x52c9ef(0xe8) + _0x41fd38),
        (_0xdb2648 = _0x63ad53 + _0x52c9ef(0xcd) + _0x41fd38));
    const [_0x1e6be5, _0x2093fd] = await Promise["all"]([
        fetch(_0x43504a)["then"]((_0x5c235d) => _0x5c235d[_0x52c9ef(0x103)]()),
        fetch(_0xdb2648)[_0x52c9ef(0x169)]((_0x24b9f4) =>
          _0x24b9f4[_0x52c9ef(0x103)]()
        ),
      ]),
      _0x5d37e6 = _0x1e6be5[_0x52c9ef(0x179)](-_0x477f98);
    for (const _0x5dd812 of _0x5d37e6) {
      const _0x1edae0 = (_0x5dd812["ft"] || "x")
          [_0x52c9ef(0x15a)]("x")
          [_0x52c9ef(0x154)]((_0x1d0ad9) =>
            parseInt(_0x1d0ad9[_0x52c9ef(0x141)](), 0xa)
          ),
        _0x5f06af = _0x1edae0[0x0],
        _0x839f3a = _0x1edae0[0x1];
      Number["isFinite"](_0x5f06af) &&
        Number[_0x52c9ef(0x17d)](_0x839f3a) &&
        _0xb7e571["dadosCru"][_0x52c9ef(0x134)]([
          _0x5f06af,
          _0x839f3a,
          _0x5f06af + _0x839f3a,
          (_0x5dd812["time_a"] || "")[_0x52c9ef(0x141)](),
          (_0x5dd812[_0x52c9ef(0x10e)] || "")[_0x52c9ef(0x141)](),
          _0x5dd812[_0x52c9ef(0x107)],
          _0x5dd812[_0x52c9ef(0x163)],
        ]);
    }
    return (
      (_0xb7e571[_0x52c9ef(0x130)] = _0x2093fd[_0x52c9ef(0x179)](0x0, 0x6)),
      (_0xb7e571[_0x52c9ef(0xc7)] =
        _0xb7e571[_0x52c9ef(0xea)][_0x52c9ef(0x12a)]),
      _0xb7e571
    );
  } catch (_0x4a656e) {
    console[_0x52c9ef(0xdc)](_0x52c9ef(0xf4), _0x4a656e);
    throw new Error(_0x52c9ef(0xcc) + _0x4a656e[_0x52c9ef(0xc8)]);
  }
}
const ANALYZE_WORKER_SRC = _0x423b82(0x153);
let ANALYZE_WORKER = null;
function getAnalyzeWorker() {
  const _0x3f37a5 = _0x423b82;
  if (!ANALYZE_WORKER) {
    const _0x4c8d1d = new Blob([ANALYZE_WORKER_SRC], {
      type: _0x3f37a5(0x16c),
    });
    ANALYZE_WORKER = new Worker(URL[_0x3f37a5(0x10d)](_0x4c8d1d));
  }
  return ANALYZE_WORKER;
}
function analyzeInWorker(_0x5e99cb, _0x31155c) {
  return new Promise((_0x3541bb, _0x55a128) => {
    const _0xe8d74e = _0x4c9a,
      _0x58efcc = getAnalyzeWorker(),
      _0xf0172d = Math[_0xe8d74e(0xc9)]()
        ["toString"](0x24)
        [_0xe8d74e(0x179)](0x2),
      _0x328bc5 = (_0x2ce87f) => {
        const _0x3a5b54 = _0xe8d74e,
          _0x33fb9e = _0x2ce87f[_0x3a5b54(0xf2)];
        if (!_0x33fb9e || _0x33fb9e["id"] !== _0xf0172d) return;
        _0x58efcc[_0x3a5b54(0xd0)]("message", _0x328bc5);
        if (_0x33fb9e["ok"]) _0x3541bb(_0x33fb9e["result"]);
        else _0x55a128(_0x33fb9e[_0x3a5b54(0xdc)] || _0x3a5b54(0x123));
      };
    _0x58efcc[_0xe8d74e(0x118)]("message", _0x328bc5),
      _0x58efcc[_0xe8d74e(0x12c)]({
        cmd: _0xe8d74e(0xe9),
        id: _0xf0172d,
        payload: { dados: _0x5e99cb, ..._0x31155c },
      });
  });
}
function _0x4c9a(_0x4fb042, _0x289772) {
  const _0x38e8b2 = _0x38e8();
  return (
    (_0x4c9a = function (_0x4c9a47, _0x5c5e24) {
      _0x4c9a47 = _0x4c9a47 - 0xba;
      let _0x26ec12 = _0x38e8b2[_0x4c9a47];
      return _0x26ec12;
    }),
    _0x4c9a(_0x4fb042, _0x289772)
  );
}
function mapMercado(_0x1125da) {
  const _0x578df3 = _0x423b82,
    _0x3cbef9 = {
      ambasMarcam: _0x578df3(0xe0),
      ambasNaoMarcam: _0x578df3(0x151),
      casaVence: "casaVence",
      foraVence: "foraVence",
      empate: "empate",
      "over1.5": _0x578df3(0xec),
      "over2.5": _0x578df3(0x16a),
      "over3.5": "over3.5",
      "under1.5": _0x578df3(0xde),
      "under2.5": _0x578df3(0x109),
      "under3.5": _0x578df3(0x157),
      exact1: _0x578df3(0x119),
      exact2: "doisGolsExatos",
      exact3: _0x578df3(0xc4),
      exact4: _0x578df3(0x10a),
      over5: "cincoOuMaisGols",
    };
  return _0x3cbef9[_0x1125da] || _0x1125da;
}
function checkMarket(_0x599b86, _0x16c264, _0x3fa67a, _0x43be0c) {
  const _0x2b54f6 = _0x423b82;
  switch (_0x599b86) {
    case _0x2b54f6(0xe0):
      return _0x16c264 > 0x0 && _0x3fa67a > 0x0 ? 0x1 : 0x0;
    case "ambasNao":
      return _0x16c264 === 0x0 || _0x3fa67a === 0x0 ? 0x1 : 0x0;
    case "casaVence":
      return _0x16c264 > _0x3fa67a ? 0x1 : 0x0;
    case _0x2b54f6(0x14c):
      return _0x3fa67a > _0x16c264 ? 0x1 : 0x0;
    case "empate":
      return _0x16c264 === _0x3fa67a ? 0x1 : 0x0;
    case _0x2b54f6(0xec):
      return _0x43be0c > 1.5 ? 0x1 : 0x0;
    case _0x2b54f6(0x16a):
      return _0x43be0c > 2.5 ? 0x1 : 0x0;
    case "over3.5":
      return _0x43be0c > 3.5 ? 0x1 : 0x0;
    case _0x2b54f6(0xde):
      return _0x43be0c < 1.5 ? 0x1 : 0x0;
    case _0x2b54f6(0x109):
      return _0x43be0c < 2.5 ? 0x1 : 0x0;
    case _0x2b54f6(0x157):
      return _0x43be0c < 3.5 ? 0x1 : 0x0;
    case "umGolExato":
      return _0x43be0c === 0x1 ? 0x1 : 0x0;
    case _0x2b54f6(0x148):
      return _0x43be0c === 0x2 ? 0x1 : 0x0;
    case _0x2b54f6(0xc4):
      return _0x43be0c === 0x3 ? 0x1 : 0x0;
    case _0x2b54f6(0x10a):
      return _0x43be0c === 0x4 ? 0x1 : 0x0;
    case _0x2b54f6(0x102):
      return _0x43be0c >= 0x5 ? 0x1 : 0x0;
    default:
      return 0x0;
  }
}
function calculateMarketAnalysis(
  _0x8bacf8,
  _0x47b1d8,
  _0x1b8114,
  _0x49d425,
  _0x4a86bd
) {
  const _0x355439 = _0x423b82,
    _0x21d188 = _0x8bacf8[_0x355439(0xea)]
      [_0x355439(0x154)]((_0x4d56d6) => [
        _0x4d56d6[0x5]["toString"]()[_0x355439(0xbc)](0x2, "0") +
          ":" +
          _0x4d56d6[0x6]["toString"]()[_0x355439(0xbc)](0x2, "0"),
        _0x4d56d6[0x0],
        _0x4d56d6[0x1],
        _0x4d56d6[0x3],
        _0x4d56d6[0x4],
        _0x4d56d6[0x2],
        _0x8bacf8[_0x355439(0x16b)][_0x355439(0x186)](),
      ])
      [_0x355439(0x179)](-_0x1b8114);
  if (_0x21d188["length"] === 0x0) return { currentPercentage: 0x0, top5: [] };
  const _0x3cc3f5 = _0x21d188[_0x355439(0x179)](-_0x49d425),
    _0x18db20 = _0x3cc3f5["reduce"](
      (_0x50f907, _0x1637f0) =>
        _0x50f907 +
        checkMarket(_0x47b1d8, _0x1637f0[0x1], _0x1637f0[0x2], _0x1637f0[0x5]),
      0x0
    ),
    _0x310108 = ((_0x18db20 / _0x49d425) * 0x64)[_0x355439(0x116)](0x0),
    _0x568c16 = {};
  _0x21d188[_0x355439(0x10f)]((_0x240a85, _0x453f7b) => {
    const _0x24fbd7 = _0x355439,
      [
        _0x142d16,
        _0x38e981,
        _0x1caf48,
        _0x3d27c0,
        _0x2bd91f,
        _0x578745,
        _0x7ee498,
      ] = _0x240a85;
    if (_0x453f7b >= _0x49d425 - 0x1) {
      const _0x42975b = _0x21d188[_0x24fbd7(0x179)](
          _0x453f7b - _0x49d425 + 0x1,
          _0x453f7b + 0x1
        )[_0x24fbd7(0xd8)](
          (_0x37c447, _0x20c33c) =>
            _0x37c447 +
            checkMarket(
              _0x47b1d8,
              _0x20c33c[0x1],
              _0x20c33c[0x2],
              _0x20c33c[0x5]
            ),
          0x0
        ),
        _0x5ad603 = Math["round"]((_0x42975b / _0x49d425) * 0x64);
      let _0x183734 = _0x24fbd7(0x120),
        _0x3f9390 = 0x0,
        _0xfe492e = 0x0;
      if (_0x453f7b + _0x4a86bd <= _0x21d188[_0x24fbd7(0x12a)]) {
        const _0x46cb2c = _0x21d188[_0x24fbd7(0x179)](
          _0x453f7b + 0x1,
          _0x453f7b + 0x1 + _0x4a86bd
        );
        (_0x3f9390 = _0x46cb2c[_0x24fbd7(0x139)](
          (_0x2aeeda) =>
            checkMarket(
              _0x47b1d8,
              _0x2aeeda[0x1],
              _0x2aeeda[0x2],
              _0x2aeeda[0x5]
            ) === 0x1
        )[_0x24fbd7(0x12a)]),
          (_0xfe492e = _0x4a86bd - _0x3f9390);
        const _0xae1b0e = _0x46cb2c[_0x24fbd7(0x164)](
          (_0x4944a9) =>
            checkMarket(
              _0x47b1d8,
              _0x4944a9[0x1],
              _0x4944a9[0x2],
              _0x4944a9[0x5]
            ) === 0x1
        );
        _0xae1b0e && (_0x183734 = _0x24fbd7(0x12f));
      }
      const _0x9a769c = _0x47b1d8 + "\x20" + _0x5ad603 + "%";
      !_0x568c16[_0x9a769c] &&
        (_0x568c16[_0x9a769c] = {
          occurrences: 0x0,
          greens: 0x0,
          reds: 0x0,
          totalGreens: _0x3f9390,
          totalReds: _0xfe492e,
        }),
        (_0x568c16[_0x9a769c]["occurrences"] += 0x1),
        _0x183734 === _0x24fbd7(0x12f)
          ? (_0x568c16[_0x9a769c][_0x24fbd7(0xce)] += 0x1)
          : (_0x568c16[_0x9a769c][_0x24fbd7(0xed)] += 0x1),
        (_0x568c16[_0x9a769c][_0x24fbd7(0xf0)] = _0x3f9390),
        (_0x568c16[_0x9a769c]["totalReds"] = _0xfe492e);
    }
  });
  const _0x12faa1 = Object[_0x355439(0x14a)](_0x568c16)
      [_0x355439(0x154)]((_0x513d54) => {
        const _0x3039f8 = _0x355439,
          _0x9aa73 = _0x568c16[_0x513d54],
          _0x48715d = ((_0x9aa73[_0x3039f8(0xce)] /
            _0x9aa73[_0x3039f8(0x146)]) *
            0x64)[_0x3039f8(0x116)](0x2);
        let _0x27c249 = "";
        const _0x47612d = parseFloat(_0x48715d);
        if (_0x47612d > 0x4b) _0x27c249 = _0x3039f8(0xf3);
        else {
          if (_0x47612d > 0x32) _0x27c249 = _0x3039f8(0x144);
          else
            _0x47612d > 0x19
              ? (_0x27c249 = _0x3039f8(0x135))
              : (_0x27c249 = _0x3039f8(0x121));
        }
        return {
          marketGroup: _0x513d54,
          marketPercentage: parseFloat(
            _0x513d54[_0x3039f8(0x15a)]("\x20")[0x1]
          ),
          occurrences: _0x9aa73[_0x3039f8(0x146)],
          greens: _0x9aa73["greens"],
          reds: _0x9aa73[_0x3039f8(0xed)],
          greenPercentage: _0x48715d,
          totalGreens: _0x9aa73[_0x3039f8(0xf0)],
          totalReds: _0x9aa73[_0x3039f8(0x171)],
          analysis: _0x27c249,
        };
      })
      ["sort"](
        (_0x3330cc, _0x25c505) =>
          _0x25c505[_0x355439(0x172)] - _0x3330cc[_0x355439(0x172)] ||
          _0x25c505[_0x355439(0xce)] - _0x3330cc[_0x355439(0xce)]
      )
      ["slice"](0x0, 0x64),
    _0x6d0823 = _0x12faa1[_0x355439(0x179)](0x0, 0x5);
  return { currentPercentage: _0x310108, top5: _0x6d0823 };
}
function criarPromptAnalise(_0x1ced20, _0x396919) {
  const _0x1bc0e8 = _0x423b82;
  return (
    "\x0aVocê\x20é\x20um\x20analista\x20especialista\x20em\x20futebol\x20virtual,\x20focado\x20em\x20interpretar\x20dados\x20pré-processados\x20para\x20identificar\x20oportunidades\x20de\x20investimento\x20de\x20alto\x20valor.\x0aDADOS\x20PARA\x20ANÁLISE:\x0a-\x20Casa:\x20" +
    _0x1ced20[_0x1bc0e8(0x158)] +
    "\x0a-\x20Liga:\x20" +
    _0x1ced20["liga"] +
    _0x1bc0e8(0x161) +
    _0x396919["mercado"] +
    _0x1bc0e8(0xd9) +
    _0x1ced20[_0x1bc0e8(0xc7)] +
    _0x1bc0e8(0x104) +
    _0x396919[_0x1bc0e8(0x15d)] +
    _0x1bc0e8(0x114) +
    (_0x396919[_0x1bc0e8(0xc5)] || _0x1bc0e8(0x184)) +
    "\x0a" +
    (_0x396919["imagem"]
      ? "-\x20Imagem\x20fornecida:\x20Uma\x20imagem\x20foi\x20enviada\x20para\x20análise\x20adicional."
      : "") +
    _0x1bc0e8(0x14e) +
    _0x396919[_0x1bc0e8(0xf1)] +
    _0x1bc0e8(0x13a) +
    JSON["stringify"](
      _0x1ced20[_0x1bc0e8(0xe2)]["slice"](0x0, 0xa),
      null,
      0x2
    ) +
    _0x1bc0e8(0x187) +
    _0x396919["mercado"] +
    _0x1bc0e8(0xd1) +
    JSON[_0x1bc0e8(0xc6)](_0x1ced20[_0x1bc0e8(0x132)], null, 0x2) +
    _0x1bc0e8(0x136) +
    JSON[_0x1bc0e8(0xc6)](_0x1ced20[_0x1bc0e8(0x130)], null, 0x2) +
    _0x1bc0e8(0xef) +
    _0x396919[_0x1bc0e8(0xf1)] +
    _0x1bc0e8(0x15f) +
    _0x1ced20["marketAnalysis"][_0x1bc0e8(0x173)] +
    "%\x0aTop\x205\x20Melhores\x20Porcentagens:\x0a" +
    JSON[_0x1bc0e8(0xc6)](
      _0x1ced20[_0x1bc0e8(0x17a)][_0x1bc0e8(0x137)],
      null,
      0x2
    ) +
    _0x1bc0e8(0xd2)
  );
}
async function analisarComGemini(_0x3b2ea6, _0x1eb6de) {
  const _0x49e1ce = _0x423b82,
    _0x1e3c49 = criarPromptAnalise(_0x3b2ea6, _0x1eb6de),
    _0x56d6d7 = await fetch(GEMINI_URL + _0x49e1ce(0xc1) + GEMINI_API_KEY, {
      method: "POST",
      headers: { "Content-Type": _0x49e1ce(0xc2) },
      body: JSON["stringify"]({
        contents: [{ parts: [{ text: _0x1e3c49 }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 0x28,
          topP: 0.95,
          maxOutputTokens: 0x800,
        },
      }),
    });
  if (!_0x56d6d7["ok"]) {
    const _0x209d52 = await _0x56d6d7[_0x49e1ce(0x103)]();
    console[_0x49e1ce(0xdc)](_0x49e1ce(0x11e), _0x209d52);
    throw new Error(_0x49e1ce(0xd3) + _0x56d6d7[_0x49e1ce(0xfd)]);
  }
  const _0xeb1372 = await _0x56d6d7[_0x49e1ce(0x103)]();
  return _0xeb1372["candidates"][0x0][_0x49e1ce(0x13e)][_0x49e1ce(0xeb)][0x0][
    "text"
  ];
}
async function gerarAnalise() {
  const _0xcd6148 = _0x423b82,
    _0x445aaf = 0x6,
    _0x4433bb = 0x3,
    _0x32556b = new Date(),
    _0x389cfc = _0x32556b["toISOString"]()[_0xcd6148(0x15a)]("T")[0x0];
  let _0x1086c1 =
    JSON[_0xcd6148(0x16e)](localStorage[_0xcd6148(0x13f)](_0xcd6148(0xf8))) ||
    {};
  _0x1086c1["date"] !== _0x389cfc &&
    (_0x1086c1 = { date: _0x389cfc, count: 0x0, lastAnalysis: null });
  if (_0x1086c1[_0xcd6148(0x13b)] >= _0x445aaf) {
    alert(_0xcd6148(0x12d));
    return;
  }
  if (_0x1086c1[_0xcd6148(0x174)]) {
    const _0x5a55dc = new Date(_0x1086c1[_0xcd6148(0x174)]),
      _0x2a045c = (_0x32556b - _0x5a55dc) / (0x3e8 * 0x3c);
    if (_0x2a045c < _0x4433bb) {
      const _0x2e279b = Math[_0xcd6148(0x112)](_0x4433bb - _0x2a045c);
      alert("Por\x20favor,\x20aguarde\x20" + _0x2e279b + _0xcd6148(0x166));
      return;
    }
  }
  const _0x2a1b68 = getSelectedValue("casas-group"),
    _0x322d35 = getSelectedValue(_0xcd6148(0x140)),
    _0x4ab3cc = getSelectedValue(_0xcd6148(0x165)),
    _0x25526b = getSelectedText(_0xcd6148(0x165)),
    _0xb210ce = parseInt(getSelectedValue("martingale-group") || "0", 0xa),
    _0x2ab880 = getSelectedText(_0xcd6148(0xcf)),
    _0x38c30c = getSelectedValue(_0xcd6148(0xe4)),
    _0x38076f = document[_0xcd6148(0x16d)]("observacao")[_0xcd6148(0x126)],
    _0x2293cc = document[_0xcd6148(0x16d)](_0xcd6148(0x149))[
      _0xcd6148(0x11f)
    ][0x0];
  if (!_0x2a1b68 || !_0x322d35 || !_0x4ab3cc || !_0x38c30c) {
    alert(_0xcd6148(0x182));
    return;
  }
  const _0x3fad4f = document[_0xcd6148(0x127)](_0xcd6148(0xe1)),
    _0x5355da = document["getElementById"]("result-container"),
    _0x3f9d2f = document[_0xcd6148(0x16d)](_0xcd6148(0x177)),
    _0x26c68e = document[_0xcd6148(0x16d)](_0xcd6148(0x14b));
  (_0x3fad4f["disabled"] = !![]),
    (_0x3fad4f[_0xcd6148(0x143)] = _0xcd6148(0x17b)),
    (_0x5355da[_0xcd6148(0x152)][_0xcd6148(0x108)] = _0xcd6148(0x145)),
    (_0x26c68e[_0xcd6148(0x143)] = "");
  try {
    _0x3f9d2f["innerHTML"] = _0xcd6148(0x12b) + _0x38c30c + _0xcd6148(0x124);
    const _0x48ca45 = await buscarDadosAPI(
      _0x2a1b68,
      _0x322d35,
      parseInt(_0x38c30c)
    );
    (_0x48ca45[_0xcd6148(0xe2)] = calcularRankingTimes(
      _0x48ca45[_0xcd6148(0xea)][_0xcd6148(0x154)]((_0x30c254) => ({
        time_a: _0x30c254[0x3],
        time_b: _0x30c254[0x4],
        ft: _0x30c254[0x0] + "\x20x\x20" + _0x30c254[0x1],
      })),
      _0x4ab3cc
    )),
      (_0x3f9d2f["innerHTML"] = _0xcd6148(0xe5));
    const _0x3fe322 = _0xb210ce + 0x1,
      { resultados: _0x37c538 } = await analyzeInWorker(_0x48ca45["dadosCru"], {
        tiros: _0x3fe322,
        market: _0x4ab3cc,
        combinado: !![],
      });
    _0x48ca45[_0xcd6148(0x132)] = _0x37c538;
    const _0x3c4702 = mapMercado(_0x4ab3cc),
      _0x133617 = _0x2a1b68 === "kiron" ? 0x1e : 0x14,
      _0x44f5bb = _0xb210ce + 0x1;
    (_0x48ca45[_0xcd6148(0x17a)] = calculateMarketAnalysis(
      _0x48ca45,
      _0x3c4702,
      _0x48ca45[_0xcd6148(0xc7)],
      _0x133617,
      _0x44f5bb
    )),
      (_0x3f9d2f["innerHTML"] = _0xcd6148(0xbd));
    const _0x293d3a = {
        mercado: _0x25526b,
        liga: _0x322d35,
        martingale: _0x2ab880 || _0xcd6148(0x15e),
        periodo: _0x38c30c + _0xcd6148(0x11a),
        observacao: _0x38076f,
        imagem: _0x2293cc ? !![] : ![],
      },
      _0x4abc45 = await analisarComGemini(_0x48ca45, _0x293d3a);
    (_0x3f9d2f[_0xcd6148(0x143)] =
      _0xcd6148(0xca) +
      casasConfig[_0x2a1b68]["name"] +
      "\x20(" +
      _0x322d35 +
      ")"),
      (_0x26c68e[_0xcd6148(0x11b)] = _0x4abc45),
      _0x1086c1[_0xcd6148(0x13b)]++,
      (_0x1086c1["lastAnalysis"] = _0x32556b[_0xcd6148(0xd5)]()),
      localStorage[_0xcd6148(0x105)](
        _0xcd6148(0xf8),
        JSON[_0xcd6148(0xc6)](_0x1086c1)
      );
  } catch (_0x4dcaff) {
    console[_0xcd6148(0xdc)](
      "Erro\x20no\x20processo\x20de\x20análise:",
      _0x4dcaff
    ),
      (_0x3f9d2f["innerHTML"] = "❌\x20Erro\x20na\x20Análise"),
      (_0x26c68e[_0xcd6148(0x143)] =
        _0xcd6148(0xbb) + _0x4dcaff[_0xcd6148(0xc8)] + _0xcd6148(0x16f));
  } finally {
    (_0x3fad4f[_0xcd6148(0x133)] = ![]),
      (_0x3fad4f[_0xcd6148(0x143)] = _0xcd6148(0xf9));
  }
}
document[_0x423b82(0x16d)](_0x423b82(0x149))[_0x423b82(0x118)](
  _0x423b82(0x100),
  function (_0x373b8b) {
    const _0x25d211 = _0x423b82,
      _0x253c3f = _0x373b8b[_0x25d211(0xfa)][_0x25d211(0x11f)][0x0],
      _0x42b7cd = document["getElementById"](_0x25d211(0xf5)),
      _0x364619 = document[_0x25d211(0x16d)](_0x25d211(0x178));
    if (_0x253c3f) {
      const _0x2a29ab = new FileReader();
      (_0x2a29ab[_0x25d211(0x167)] = function (_0x3dc2b5) {
        const _0x23bc3c = _0x25d211;
        (_0x42b7cd[_0x23bc3c(0x155)] =
          _0x3dc2b5[_0x23bc3c(0xfa)][_0x23bc3c(0xff)]),
          (_0x42b7cd[_0x23bc3c(0x152)]["display"] = "block");
      }),
        _0x2a29ab["readAsDataURL"](_0x253c3f),
        (_0x364619[_0x25d211(0x11b)] = _0x253c3f[_0x25d211(0x181)]);
    } else
      (_0x42b7cd[_0x25d211(0x152)]["display"] = "none"),
        (_0x364619["textContent"] = _0x25d211(0x142));
  }
);
