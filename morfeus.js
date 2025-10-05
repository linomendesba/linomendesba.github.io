const _0x458f03 = _0x10f8;
function _0x10f8(_0x59053d, _0x48e132) {
  const _0x5b3d16 = _0x5b3d();
  return (
    (_0x10f8 = function (_0x10f85b, _0x2ff30b) {
      _0x10f85b = _0x10f85b - 0x1af;
      let _0x2b73c9 = _0x5b3d16[_0x10f85b];
      return _0x2b73c9;
    }),
    _0x10f8(_0x59053d, _0x48e132)
  );
}
(function (_0x405b4e, _0x3672da) {
  const _0xa6d060 = _0x10f8,
    _0x8d4d31 = _0x405b4e();
  while (!![]) {
    try {
      const _0x428279 =
        -parseInt(_0xa6d060(0x236)) / 0x1 +
        (parseInt(_0xa6d060(0x240)) / 0x2) *
          (-parseInt(_0xa6d060(0x218)) / 0x3) +
        -parseInt(_0xa6d060(0x1b7)) / 0x4 +
        parseInt(_0xa6d060(0x252)) / 0x5 +
        parseInt(_0xa6d060(0x22d)) / 0x6 +
        (parseInt(_0xa6d060(0x1b5)) / 0x7) *
          (parseInt(_0xa6d060(0x22c)) / 0x8) +
        parseInt(_0xa6d060(0x253)) / 0x9;
      if (_0x428279 === _0x3672da) break;
      else _0x8d4d31["push"](_0x8d4d31["shift"]());
    } catch (_0x2f50db) {
      _0x8d4d31["push"](_0x8d4d31["shift"]());
    }
  }
})(_0x5b3d, 0x4a9bd);
const GROK_API_KEY = _0x458f03(0x1db),
  GROK_URL = _0x458f03(0x23a),
  casasConfig = {
    betano: {
      name: _0x458f03(0x228),
      ligas: [
        _0x458f03(0x231),
        _0x458f03(0x20b),
        _0x458f03(0x1b9),
        _0x458f03(0x1f2),
        "Copa\x20das\x20Estrelas",
        "Brasileirão\x20Betano",
      ],
    },
    kiron: {
      name: _0x458f03(0x1eb),
      ligas: [_0x458f03(0x1c2), _0x458f03(0x214), _0x458f03(0x21a)],
      path: _0x458f03(0x257),
    },
    estrela: { name: _0x458f03(0x226), ligas: ["estrela"], path: "estrela" },
    betsson: {
      name: "Betsson",
      ligas: ["Espanha", _0x458f03(0x1e6), "Brasil"],
      path: _0x458f03(0x24d),
    },
  };
document[_0x458f03(0x206)](_0x458f03(0x1bf))["forEach"]((_0xc6a004) => {
  const _0x523261 = _0x458f03;
  _0xc6a004[_0x523261(0x225)](_0x523261(0x246), (_0x5d024e) => {
    const _0x113dff = _0x523261;
    if (
      _0x5d024e[_0x113dff(0x223)][_0x113dff(0x232)]["contains"](
        _0x113dff(0x234)
      )
    ) {
      const _0x1d85e7 = _0xc6a004[_0x113dff(0x1c8)](_0x113dff(0x1e2));
      _0x1d85e7 &&
        _0x1d85e7[_0x113dff(0x232)][_0x113dff(0x23b)](_0x113dff(0x24a)),
        _0x5d024e[_0x113dff(0x223)][_0x113dff(0x232)]["add"](_0x113dff(0x24a)),
        _0xc6a004["id"] === _0x113dff(0x1f1) &&
          mostrarLigas(
            _0x5d024e[_0x113dff(0x223)][_0x113dff(0x204)][_0x113dff(0x1f7)]
          );
    }
  });
});
function mostrarLigas(_0x29b67c) {
  const _0x49509c = _0x458f03,
    _0xf808d7 = document[_0x49509c(0x1bc)]("liga-section"),
    _0x26fa62 = document[_0x49509c(0x1bc)](_0x49509c(0x23f));
  if (!casasConfig[_0x29b67c]) {
    _0xf808d7[_0x49509c(0x25c)][_0x49509c(0x200)] = _0x49509c(0x259);
    return;
  }
  (_0x26fa62[_0x49509c(0x22b)] = ""),
    casasConfig[_0x29b67c][_0x49509c(0x1ca)][_0x49509c(0x1dd)]((_0x58e6ea) => {
      const _0x51a835 = _0x49509c,
        _0x2994ec = document[_0x51a835(0x25e)](_0x51a835(0x1d5));
      (_0x2994ec[_0x51a835(0x205)] = "btn"),
        (_0x2994ec[_0x51a835(0x204)]["value"] = _0x58e6ea),
        (_0x2994ec[_0x51a835(0x21d)] = _0x58e6ea),
        _0x26fa62[_0x51a835(0x1d6)](_0x2994ec);
    }),
    (_0xf808d7[_0x49509c(0x25c)][_0x49509c(0x200)] = _0x49509c(0x1b6));
}
function getSelectedValue(_0x2a57ad) {
  const _0x29b8c6 = _0x458f03,
    _0x1aa804 = document[_0x29b8c6(0x1bc)](_0x2a57ad),
    _0x4ee871 = _0x1aa804[_0x29b8c6(0x1c8)](".btn.active");
  return _0x4ee871 ? _0x4ee871[_0x29b8c6(0x204)][_0x29b8c6(0x1f7)] : null;
}
function getSelectedText(_0x1ab452) {
  const _0x30385b = _0x458f03,
    _0x24e39f = document[_0x30385b(0x1bc)](_0x1ab452),
    _0x226893 = _0x24e39f["querySelector"](_0x30385b(0x1e2));
  return _0x226893 ? _0x226893[_0x30385b(0x1c9)] : null;
}
function limparAnalise() {
  const _0x35d72a = _0x458f03;
  document[_0x35d72a(0x206)](_0x35d72a(0x1e2))[_0x35d72a(0x1dd)]((_0x2df871) =>
    _0x2df871[_0x35d72a(0x232)]["remove"](_0x35d72a(0x24a))
  ),
    (document["getElementById"](_0x35d72a(0x1c7))[_0x35d72a(0x1f7)] = ""),
    (document[_0x35d72a(0x1bc)](_0x35d72a(0x1dc))[_0x35d72a(0x1f7)] = ""),
    (document[_0x35d72a(0x1bc)]("image-status")[_0x35d72a(0x21d)] =
      "Nenhum\x20arquivo\x20selecionado"),
    (document[_0x35d72a(0x1bc)]("image-preview")[_0x35d72a(0x25c)]["display"] =
      "none"),
    (document["getElementById"]("result-container")[_0x35d72a(0x25c)][
      _0x35d72a(0x200)
    ] = _0x35d72a(0x259)),
    (document[_0x35d72a(0x1bc)](_0x35d72a(0x1cc))[_0x35d72a(0x25c)][
      _0x35d72a(0x200)
    ] = _0x35d72a(0x259));
}
function calcularRankingTimes(_0x363d27, _0x3f538b) {
  const _0x335e34 = _0x458f03,
    _0x1cb16a = {};
  _0x363d27[_0x335e34(0x1dd)]((_0x4a9669) => {
    const _0x31da95 = _0x335e34,
      { time_a: _0x36ea31, time_b: _0x37f0cc, ft: _0x50908d } = _0x4a9669;
    if (!_0x50908d || !_0x50908d["includes"](_0x31da95(0x1af))) return;
    const [_0x59865c, _0x182b13] =
        _0x50908d[_0x31da95(0x247)]("\x20x\x20")["map"](Number),
      _0x25b221 = _0x59865c + _0x182b13;
    [_0x36ea31, _0x37f0cc]["forEach"]((_0x3db0e3) => {
      !_0x1cb16a[_0x3db0e3] &&
        (_0x1cb16a[_0x3db0e3] = {
          name: _0x3db0e3,
          totalGames: 0x0,
          marketCount: 0x0,
        });
    }),
      _0x1cb16a[_0x36ea31][_0x31da95(0x256)]++,
      _0x1cb16a[_0x37f0cc][_0x31da95(0x256)]++;
    let _0x45e36b = ![];
    switch (_0x3f538b) {
      case _0x31da95(0x1e7):
        _0x45e36b = _0x59865c > 0x0 && _0x182b13 > 0x0;
        break;
      case _0x31da95(0x1cf):
        _0x45e36b = _0x59865c === 0x0 || _0x182b13 === 0x0;
        break;
      case _0x31da95(0x1ea):
        _0x45e36b = _0x59865c === _0x182b13;
        break;
      case "over1.5":
        _0x45e36b = _0x25b221 > 0x1;
        break;
      case _0x31da95(0x1e0):
        _0x45e36b = _0x25b221 < 0x2;
        break;
      case _0x31da95(0x24f):
        _0x45e36b = _0x25b221 > 0x2;
        break;
      case "under2.5":
        _0x45e36b = _0x25b221 < 0x3;
        break;
      case _0x31da95(0x23e):
        _0x45e36b = _0x25b221 > 0x3;
        break;
      case _0x31da95(0x1ec):
        _0x45e36b = _0x25b221 < 0x4;
        break;
      case "over5":
        _0x45e36b = _0x25b221 >= 0x5;
        break;
      case "exact1":
        _0x45e36b = _0x25b221 === 0x1;
        break;
      case _0x31da95(0x1f9):
        _0x45e36b = _0x25b221 === 0x2;
        break;
      case _0x31da95(0x1c5):
        _0x45e36b = _0x25b221 === 0x3;
        break;
      case "exact4":
        _0x45e36b = _0x25b221 === 0x4;
        break;
    }
    _0x45e36b &&
      (_0x1cb16a[_0x36ea31][_0x31da95(0x1f4)]++,
      _0x1cb16a[_0x37f0cc][_0x31da95(0x1f4)]++);
    if (_0x3f538b === _0x31da95(0x1fc) && _0x59865c > _0x182b13)
      _0x1cb16a[_0x36ea31][_0x31da95(0x1f4)]++;
    if (_0x3f538b === _0x31da95(0x1d1) && _0x182b13 > _0x59865c)
      _0x1cb16a[_0x37f0cc][_0x31da95(0x1f4)]++;
  });
  const _0x1be8f2 = Object["values"](_0x1cb16a)[_0x335e34(0x229)](
    (_0x454f05) => ({
      ..._0x454f05,
      percentage:
        _0x454f05["totalGames"] > 0x0
          ? ((_0x454f05[_0x335e34(0x1f4)] / _0x454f05[_0x335e34(0x256)]) *
              0x64)[_0x335e34(0x1b2)](0x1)
          : _0x335e34(0x249),
    })
  );
  return (
    _0x1be8f2[_0x335e34(0x21c)](
      (_0x3701e0, _0x44962f) =>
        _0x44962f[_0x335e34(0x1f4)] - _0x3701e0[_0x335e34(0x1f4)] ||
        parseFloat(_0x44962f[_0x335e34(0x269)]) -
          parseFloat(_0x3701e0[_0x335e34(0x269)])
    ),
    _0x1be8f2
  );
}
async function buscarDadosAPI(_0x268b52, _0x3e832d, _0x155647) {
  const _0x3db321 = _0x458f03,
    _0x266974 = casasConfig[_0x268b52];
  if (!_0x266974) throw new Error("Casa\x20" + _0x268b52 + _0x3db321(0x1e1));
  const _0x3192de = {
    casa: _0x266974[_0x3db321(0x1e8)],
    liga: _0x3e832d,
    totalJogos: 0x0,
    dadosCru: [],
  };
  try {
    const _0xd65af2 = encodeURIComponent(_0x3e832d),
      _0x555d4b = "https://betstat.site";
    let _0x48c034, _0x17a01c;
    _0x266974["path"]
      ? ((_0x48c034 =
          _0x555d4b +
          "/resultados/" +
          _0x266974[_0x3db321(0x1da)] +
          "/" +
          _0xd65af2),
        (_0x17a01c =
          _0x555d4b +
          _0x3db321(0x1d3) +
          _0x266974[_0x3db321(0x1da)] +
          "/" +
          _0xd65af2))
      : ((_0x48c034 = _0x555d4b + _0x3db321(0x1ba) + _0xd65af2),
        (_0x17a01c = _0x555d4b + "/proximos/" + _0xd65af2));
    const [_0x4e685e, _0x2cdda8] = await Promise["all"]([
        fetch(_0x48c034)[_0x3db321(0x203)]((_0x2ba03d) =>
          _0x2ba03d[_0x3db321(0x1d2)]()
        ),
        fetch(_0x17a01c)[_0x3db321(0x203)]((_0x1614c8) =>
          _0x1614c8[_0x3db321(0x1d2)]()
        ),
      ]),
      _0x195fc1 = _0x4e685e["slice"](-_0x155647);
    for (const _0x12e919 of _0x195fc1) {
      const _0xb790d7 = (_0x12e919["ft"] || "x")
          [_0x3db321(0x247)]("x")
          [_0x3db321(0x229)]((_0x2dd327) =>
            parseInt(_0x2dd327[_0x3db321(0x1c1)](), 0xa)
          ),
        _0x4c6676 = _0xb790d7[0x0],
        _0x26e6ed = _0xb790d7[0x1];
      Number["isFinite"](_0x4c6676) &&
        Number[_0x3db321(0x1b3)](_0x26e6ed) &&
        _0x3192de["dadosCru"][_0x3db321(0x216)]([
          _0x4c6676,
          _0x26e6ed,
          _0x4c6676 + _0x26e6ed,
          (_0x12e919[_0x3db321(0x202)] || "")[_0x3db321(0x1c1)](),
          (_0x12e919[_0x3db321(0x241)] || "")[_0x3db321(0x1c1)](),
          _0x12e919[_0x3db321(0x201)],
          _0x12e919[_0x3db321(0x25a)],
        ]);
    }
    return (
      (_0x3192de[_0x3db321(0x220)] = _0x2cdda8[_0x3db321(0x1ef)](0x0, 0x6)),
      (_0x3192de[_0x3db321(0x24e)] = _0x3192de[_0x3db321(0x1de)]["length"]),
      _0x3192de
    );
  } catch (_0x3bff17) {
    console["error"](_0x3db321(0x1ff), _0x3bff17);
    throw new Error(_0x3db321(0x1bd) + _0x3bff17[_0x3db321(0x254)]);
  }
}
function _0x5b3d() {
  const _0x5d2fa7 = [
    "kiron",
    "under2.5",
    "none",
    "minuto",
    "Não\x20foi\x20possível\x20obter\x20uma\x20análise\x20da\x20API\x20Grok.",
    "style",
    "\x0a-\x20Estratégia\x20Martingale:\x20",
    "createElement",
    "\x22\x20(Top\x2010):\x0a",
    "analyze",
    "result-container",
    "tresGolsExatos",
    "mercados-group",
    "❌\x20Erro\x20na\x20Análise",
    "totalReds",
    "toString",
    "stringify",
    "<div\x20class=\x22error\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<strong>Erro:</strong>\x20",
    "percentage",
    "\x0a\x0a4.\x20ANÁLISE\x20DE\x20GRÁFICO\x20DE\x20MERCADO\x20PARA\x20O\x20MERCADO\x20\x22",
    "\x20x\x20",
    "onload",
    "toISOString",
    "toFixed",
    "isFinite",
    "\x0a-\x20Observações\x20do\x20Usuário:\x20",
    "23366CbFeRS",
    "block",
    "1317124MddrTf",
    "\x20jogos",
    "Euro",
    "/resultados/",
    "\x22:\x0aPorcentagem\x20Atual:\x20",
    "getElementById",
    "Falha\x20ao\x20conectar\x20com\x20a\x20API:\x20",
    "totalGreens",
    ".btn-grid",
    "Nenhum",
    "trim",
    "England",
    "over1.5",
    "change",
    "exact3",
    "removeEventListener",
    "observacao",
    "querySelector",
    "innerText",
    "ligas",
    "\x0a\x0aINFORMAÇÕES\x20PRÉ-PROCESSADAS:\x0a\x0a1.\x20RANKING\x20DE\x20TIMES\x20PARA\x20O\x20MERCADO\x20\x22",
    "liga-section",
    "random",
    "Bearer\x20",
    "ambasNaoMarcam",
    "status",
    "foraVence",
    "json",
    "/proximos/",
    "martingale-group",
    "button",
    "appendChild",
    "\x0a-\x20Liga:\x20",
    "Moderada\x20chance",
    "result-content",
    "path",
    "xai-WHZq0Bs8x5ln0j0JsA1rexI96NMGSL50Iu0roIClPq2Tv0FoYTEeb3CIRN9zKO0lrF932JS1T5A0LVfB",
    "image-upload",
    "forEach",
    "dadosCru",
    "files",
    "under1.5",
    "\x20não\x20encontrada",
    ".btn.active",
    "\x20análises\x20por\x20dia.\x20Por\x20favor,\x20tente\x20novamente\x20amanhã.",
    "occurrences",
    "periodo-group",
    "Inglaterra",
    "ambasMarcam",
    "name",
    "choices",
    "empate",
    "Kiron",
    "under3.5",
    "Você\x20atingiu\x20o\x20limite\x20de\x20",
    "statusText",
    "slice",
    "round",
    "casas-group",
    "Campeonato\x20Italiano",
    "ambasNao",
    "marketCount",
    "red",
    "ambasSim",
    "value",
    "liga",
    "exact2",
    "reds",
    "image-status",
    "casaVence",
    "marketAnalysis",
    "createObjectURL",
    "Erro\x20ao\x20buscar\x20dados\x20da\x20API:",
    "display",
    "hora",
    "time_a",
    "then",
    "dataset",
    "className",
    "querySelectorAll",
    "length",
    "Risco\x20elevado",
    "disabled",
    "content",
    "Copa\x20América",
    "application/javascript",
    "<div\x20class=\x22loading\x22><div\x20class=\x22spinner\x22></div>Gerando\x20análise\x20com\x20IA...</div>",
    "ranking",
    "some",
    "padStart",
    "Erro\x20no\x20processo\x20de\x20análise:",
    "result-title",
    "setItem",
    "Italy",
    "umGolExato",
    "push",
    "casa",
    "227877oITdqS",
    "Nenhuma",
    "Spain",
    "POST",
    "sort",
    "textContent",
    "Gerar\x20Análise\x20IA",
    "data",
    "proximos",
    "postMessage",
    "ultimoUsoData",
    "target",
    "cincoOuMaisGols",
    "addEventListener",
    "Estrelabet",
    "contagemUso",
    "Betano",
    "map",
    "\x20jogos...</div>",
    "innerHTML",
    "584dRckOb",
    "3246912fAANon",
    "Erro\x20no\x20worker\x20de\x20análise",
    "Erro\x20na\x20API\x20Grok:",
    "quatroGolsExatos",
    "Taça\x20Glória\x20Eterna",
    "classList",
    "<div\x20class=\x22loading\x22><div\x20class=\x22spinner\x22></div>Coletando\x20",
    "btn",
    "top5",
    "249440fIxbtv",
    "\x0aVocê\x20é\x20um\x20analista\x20especialista\x20em\x20futebol\x20virtual,\x20focado\x20em\x20interpretar\x20dados\x20pré-processados\x20para\x20identificar\x20oportunidades\x20de\x20investimento\x20de\x20alto\x20valor.\x0aDADOS\x20PARA\x20ANÁLISE:\x0a-\x20Casa:\x20",
    "\x0a-\x20Total\x20de\x20jogos\x20analisados:\x20",
    "Resposta\x20inesperada\x20da\x20API\x20Grok:",
    "https://api.x.ai/v1/chat/completions",
    "remove",
    "result",
    "green",
    "over3.5",
    "ligas-group",
    "12QyPEdm",
    "time_b",
    "src",
    "%\x0aTop\x205\x20Melhores\x20Porcentagens:\x0a",
    "Alta\x20chance\x20de\x20acerto",
    "mercado",
    "click",
    "split",
    "greens",
    "0.0",
    "active",
    "filter",
    "error",
    "betsson",
    "totalJogos",
    "over2.5",
    "<div\x20class=\x22spinner\x22></div>\x20Processando...",
    "readAsDataURL",
    "793720xKXtBU",
    "3568518mfzkMa",
    "message",
    "padroesEncontrados",
    "totalGames",
  ];
  _0x5b3d = function () {
    return _0x5d2fa7;
  };
  return _0x5b3d();
}
const ANALYZE_WORKER_SRC =
  "\x0aself.onmessage\x20=\x20(e)\x20=>\x20{\x0a\x20\x20\x20\x20const\x20p\x20=\x20e.data;\x0aif\x20(!p\x20||\x20p.cmd\x20!==\x20\x27analyze\x27)\x20return;\x0a\x20\x20\x20\x20const\x20res\x20=\x20analyzeAll(p.payload);\x0a\x20\x20\x20\x20self.postMessage({\x20ok:\x20true,\x20id:\x20p.id,\x20result:\x20res\x20});\x0a};\x0afunction\x20enumerateCombos(tok){\x0a\x20\x20\x20\x20if(tok.length===1)\x20return\x20tok[0].map(t=>[t]);\x0a\x20\x20\x20\x20if(tok.length===2){\x20const\x20out=[];\x0afor(const\x20a\x20of\x20tok[0])\x20for(const\x20b\x20of\x20tok[1])\x20out.push([a,b]);\x20return\x20out;\x0a}\x0a\x20\x20\x20\x20if(tok.length===3){\x20const\x20out=[];\x0afor(const\x20a\x20of\x20tok[0])\x20for(const\x20b\x20of\x20tok[1])\x20for(const\x20c\x20of\x20tok[2])\x20out.push([a,b,c]);\x20return\x20out;\x0a}\x0a\x20\x20\x20\x20const\x20out=[],cur=[];\x0a(function\x20rec(i){\x20if(i===tok.length){\x20out.push(cur.slice());\x20return;\x20}\x20for(const\x20t\x20of\x20tok[i]){\x20cur.push(t);\x20rec(i+1);\x20cur.pop();\x20}\x20})(0);\x0a\x20\x20\x20\x20return\x20out;\x0a}\x0afunction\x20getOffsetsByTipo(t){\x0a\x20\x20\x20\x20if(t===\x271\x27)\x20return\x20[0];\x0aif(t===\x272\x27)\x20return\x20[0,1];\x0a\x20\x20\x20\x20if(t===\x273\x27)\x20return\x20[0,1,2];\x0a\x20\x20\x20\x20if(t===\x271_pula_1\x27)\x20return\x20[0,2];\x0a\x20\x20\x20\x20if(t===\x271_pula_1_pula_1\x27)\x20return\x20[0,2,4];\x0a\x20\x20\x20\x20return\x20[0,1];\x0a}\x0afunction\x20tokensDoJogo(a,b,total,mandante,visitante){\x0a\x20\x20\x20\x20const\x20t\x20=\x20new\x20Set();\x0at.add(`${a}-${b}`);\x0a\x20\x20\x20\x20t.add(a\x20>\x200\x20&&\x20b\x20>\x200\x20?\x20\x27ambasMarcam\x27\x20:\x20\x27ambasNaoMarcam\x27);\x0at.add(a\x20>\x20b\x20?\x20\x27casaVence\x27\x20:\x20(a\x20<\x20b\x20?\x20\x27foraVence\x27\x20:\x20\x27empate\x27));\x0a\x20\x20\x20\x20if\x20(total\x20>=\x202)\x20t.add(\x27over1.5\x27);\x0aif\x20(total\x20<\x202)\x20t.add(\x27under1.5\x27);\x0a\x20\x20\x20\x20if\x20(total\x20>=\x203)\x20t.add(\x27over2.5\x27);\x20if\x20(total\x20<\x203)\x20t.add(\x27under2.5\x27);\x0a\x20\x20\x20\x20if\x20(total\x20>=\x204)\x20t.add(\x27over3.5\x27);\x0aif\x20(total\x20<\x204)\x20t.add(\x27under3.5\x27);\x0a\x20\x20\x20\x20if\x20(total\x20>=\x205)\x20t.add(\x27over5\x27);\x0a\x20\x20\x20\x20if\x20(total\x20===\x201)\x20t.add(\x27exact1\x27);\x0a\x20\x20\x20\x20if\x20(total\x20===\x202)\x20t.add(\x27exact2\x27);\x0aif\x20(total\x20===\x203)\x20t.add(\x27exact3\x27);\x0a\x20\x20\x20\x20if\x20(total\x20===\x204)\x20t.add(\x27exact4\x27);\x0a\x20\x20\x20\x20if\x20(mandante)\x20t.add(mandante.toLowerCase());\x0a\x20\x20\x20\x20if\x20(visitante)\x20t.add(visitante.toLowerCase());\x0a\x20\x20\x20\x20return\x20Array.from(t);\x0a}\x0afunction\x20isGreenForMarket(m,a,b,total){\x0a\x20\x20\x20\x20if\x20(m\x20===\x20\x27ambasMarcam\x27)\x20return\x20a\x20>\x200\x20&&\x20b\x20>\x200;\x0aif\x20(m\x20===\x20\x27ambasNaoMarcam\x27)\x20return\x20a\x20===\x200\x20||\x20b\x20===\x200;\x0a\x20\x20\x20\x20if\x20(m\x20===\x20\x27casaVence\x27)\x20return\x20a\x20>\x20b;\x0aif\x20(m\x20===\x20\x27foraVence\x27)\x20return\x20a\x20<\x20b;\x0a\x20\x20\x20\x20if\x20(m\x20===\x20\x27empate\x27)\x20return\x20a\x20===\x20b;\x0aif\x20(m\x20===\x20\x27over1.5\x27)\x20return\x20total\x20>=\x202;\x0a\x20\x20\x20\x20if\x20(m\x20===\x20\x27under1.5\x27)\x20return\x20total\x20<\x202;\x0aif\x20(m\x20===\x20\x27over2.5\x27)\x20return\x20total\x20>=\x203;\x0a\x20\x20\x20\x20if\x20(m\x20===\x20\x27under2.5\x27)\x20return\x20total\x20<\x203;\x0aif\x20(m\x20===\x20\x27over3.5\x27)\x20return\x20total\x20>=\x204;\x0a\x20\x20\x20\x20if\x20(m\x20===\x20\x27under3.5\x27)\x20return\x20total\x20<\x204;\x0aif\x20(m\x20===\x20\x27over5\x27)\x20return\x20total\x20>=\x205;\x0a\x20\x20\x20\x20if\x20(m\x20===\x20\x27exact1\x27)\x20return\x20total\x20===\x201;\x0aif\x20(m\x20===\x20\x27exact2\x27)\x20return\x20total\x20===\x202;\x0a\x20\x20\x20\x20if\x20(m\x20===\x20\x27exact3\x27)\x20return\x20total\x20===\x203;\x0aif\x20(m\x20===\x20\x27exact4\x27)\x20return\x20total\x20===\x204;\x0a\x20\x20\x20\x20return\x20false;\x0a}\x0afunction\x20analisarAutoPadroes(dados,tipo,tiros,market,inicio,fim){\x0a\x20\x20\x20\x20const\x20res=[];\x0aconst\x20offs=getOffsetsByTipo(tipo);\x20const\x20last=offs[offs.length-1];\x0a\x20\x20\x20\x20for(let\x20p=inicio;p<=fim;p++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20comb={};\x0aconst\x20need=(last+1)+p+tiros;\x20if(dados.length<need)\x20continue;\x0a\x20\x20\x20\x20\x20\x20\x20\x20for(let\x20i=0;i<=dados.length-need;i++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20tok=[];\x0afor(const\x20o\x20of\x20offs){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20[a,b,t,mandante,visitante]=dados[i+o];\x0atok.push(tokensDoJogo(a,b,t,mandante,visitante));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20combos=enumerateCombos(tok);\x0alet\x20green=false;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20ini=i+last+1+p,\x20fimA=ini+tiros;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(let\x20j=ini;j<fimA&&j<dados.length;j++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20[a,b,sum]=dados[j];\x0aif(isGreenForMarket(market,a,b,sum)){\x20green=true;\x20break;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(const\x20seq\x20of\x20combos){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20key=seq.join(\x27\x20|\x20\x27);\x0aif(!comb[key]){\x20comb[key]={ocorrencias:0,greens:0};\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20comb[key].ocorrencias++;\x0aif(green)\x20comb[key].greens++;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20for(const\x20k\x20in\x20comb){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20st=comb[k];\x0aif(st.ocorrencias>=3){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20res.push({\x20padrao:k,\x20pular_jogos:p,\x20ocorrencias:st.ocorrencias,\x20greens:st.greens,\x20percentual:((st.greens/st.ocorrencias)*100).toFixed(1)\x20});\x0a}\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20res.sort((a,b)=>parseFloat(b.percentual)-parseFloat(a.percentual)||b.ocorrencias-a.ocorrencias);\x0areturn\x20res.slice(0,15);\x0a}\x0afunction\x20analyzeAll(payload){\x0a\x20\x20\x20\x20const\x20{\x20dados,\x20tiros,\x20market,\x20combinado\x20}\x20=\x20payload;\x0aconst\x20tipos\x20=\x20combinado\x20?\x20[\x272\x27,\x273\x27,\x271_pula_1\x27,\x271_pula_1_pula_1\x27]\x20:\x20[\x272\x27];\x0a\x20\x20\x20\x20let\x20todos=[];\x0afor(const\x20t\x20of\x20tipos){\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20r\x20=\x20analisarAutoPadroes(dados,\x20t,\x20tiros,\x20market,\x201,\x2010);\x0ar.forEach(x=>x.tipo_padrao=t);\x0a\x20\x20\x20\x20\x20\x20\x20\x20todos\x20=\x20todos.concat(r);\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20todos.sort((a,b)=>parseFloat(b.percentual)-parseFloat(a.percentual)||b.ocorrencias-a.ocorrencias);\x0areturn\x20{\x20resultados:\x20todos.slice(0,15)\x20};\x0a}\x0a";
let ANALYZE_WORKER = null;
function getAnalyzeWorker() {
  const _0x4b7233 = _0x458f03;
  if (!ANALYZE_WORKER) {
    const _0x10e9e5 = new Blob([ANALYZE_WORKER_SRC], {
      type: _0x4b7233(0x20c),
    });
    ANALYZE_WORKER = new Worker(URL[_0x4b7233(0x1fe)](_0x10e9e5));
  }
  return ANALYZE_WORKER;
}
function analyzeInWorker(_0xb41267, _0x5b1d37) {
  return new Promise((_0xf15302, _0x16a757) => {
    const _0x46c5e3 = _0x10f8,
      _0x38d289 = getAnalyzeWorker(),
      _0x815a2c = Math[_0x46c5e3(0x1cd)]()
        [_0x46c5e3(0x266)](0x24)
        ["slice"](0x2),
      _0x5387d9 = (_0x3c2935) => {
        const _0x688982 = _0x46c5e3,
          _0x18dd81 = _0x3c2935[_0x688982(0x21f)];
        if (!_0x18dd81 || _0x18dd81["id"] !== _0x815a2c) return;
        _0x38d289[_0x688982(0x1c6)](_0x688982(0x254), _0x5387d9);
        if (_0x18dd81["ok"]) _0xf15302(_0x18dd81[_0x688982(0x23c)]);
        else _0x16a757(_0x18dd81["error"] || _0x688982(0x22e));
      };
    _0x38d289[_0x46c5e3(0x225)]("message", _0x5387d9),
      _0x38d289[_0x46c5e3(0x221)]({
        cmd: _0x46c5e3(0x260),
        id: _0x815a2c,
        payload: { dados: _0xb41267, ..._0x5b1d37 },
      });
  });
}
function mapMercado(_0x146565) {
  const _0x422434 = _0x458f03,
    _0x52d0d1 = {
      ambasMarcam: _0x422434(0x1f6),
      ambasNaoMarcam: _0x422434(0x1f3),
      casaVence: _0x422434(0x1fc),
      foraVence: _0x422434(0x1d1),
      empate: "empate",
      "over1.5": _0x422434(0x1c3),
      "over2.5": "over2.5",
      "over3.5": _0x422434(0x23e),
      "under1.5": _0x422434(0x1e0),
      "under2.5": _0x422434(0x258),
      "under3.5": _0x422434(0x1ec),
      exact1: _0x422434(0x215),
      exact2: "doisGolsExatos",
      exact3: _0x422434(0x262),
      exact4: _0x422434(0x230),
      over5: _0x422434(0x224),
    };
  return _0x52d0d1[_0x146565] || _0x146565;
}
function checkMarket(_0x4e7ea4, _0x325428, _0x411f81, _0x404c00) {
  const _0x535c3f = _0x458f03;
  switch (_0x4e7ea4) {
    case _0x535c3f(0x1f6):
      return _0x325428 > 0x0 && _0x411f81 > 0x0 ? 0x1 : 0x0;
    case _0x535c3f(0x1f3):
      return _0x325428 === 0x0 || _0x411f81 === 0x0 ? 0x1 : 0x0;
    case _0x535c3f(0x1fc):
      return _0x325428 > _0x411f81 ? 0x1 : 0x0;
    case _0x535c3f(0x1d1):
      return _0x411f81 > _0x325428 ? 0x1 : 0x0;
    case "empate":
      return _0x325428 === _0x411f81 ? 0x1 : 0x0;
    case "over1.5":
      return _0x404c00 > 1.5 ? 0x1 : 0x0;
    case _0x535c3f(0x24f):
      return _0x404c00 > 2.5 ? 0x1 : 0x0;
    case "over3.5":
      return _0x404c00 > 3.5 ? 0x1 : 0x0;
    case _0x535c3f(0x1e0):
      return _0x404c00 < 1.5 ? 0x1 : 0x0;
    case "under2.5":
      return _0x404c00 < 2.5 ? 0x1 : 0x0;
    case "under3.5":
      return _0x404c00 < 3.5 ? 0x1 : 0x0;
    case "umGolExato":
      return _0x404c00 === 0x1 ? 0x1 : 0x0;
    case "doisGolsExatos":
      return _0x404c00 === 0x2 ? 0x1 : 0x0;
    case _0x535c3f(0x262):
      return _0x404c00 === 0x3 ? 0x1 : 0x0;
    case _0x535c3f(0x230):
      return _0x404c00 === 0x4 ? 0x1 : 0x0;
    case _0x535c3f(0x224):
      return _0x404c00 >= 0x5 ? 0x1 : 0x0;
    default:
      return 0x0;
  }
}
function calculateMarketAnalysis(
  _0xcd84ca,
  _0x2a204f,
  _0x5eb545,
  _0x201109,
  _0x2ba1e3
) {
  const _0x17ec22 = _0x458f03,
    _0x588d4b = _0xcd84ca[_0x17ec22(0x1de)]
      [_0x17ec22(0x229)]((_0x445452) => [
        _0x445452[0x5][_0x17ec22(0x266)]()[_0x17ec22(0x210)](0x2, "0") +
          ":" +
          _0x445452[0x6]["toString"]()[_0x17ec22(0x210)](0x2, "0"),
        _0x445452[0x0],
        _0x445452[0x1],
        _0x445452[0x3],
        _0x445452[0x4],
        _0x445452[0x2],
        _0xcd84ca[_0x17ec22(0x1f8)]["toLowerCase"](),
      ])
      [_0x17ec22(0x1ef)](-_0x5eb545);
  if (_0x588d4b[_0x17ec22(0x207)] === 0x0)
    return { currentPercentage: 0x0, top5: [] };
  const _0x4ddf6c = _0x588d4b[_0x17ec22(0x1ef)](-_0x201109),
    _0x705eff = _0x4ddf6c["reduce"](
      (_0x121fbe, _0x52ce2a) =>
        _0x121fbe +
        checkMarket(_0x2a204f, _0x52ce2a[0x1], _0x52ce2a[0x2], _0x52ce2a[0x5]),
      0x0
    ),
    _0x52d2c8 = ((_0x705eff / _0x201109) * 0x64)["toFixed"](0x0),
    _0x8c73d5 = {};
  _0x588d4b["forEach"]((_0x55e877, _0x491cc3) => {
    const _0x1547e9 = _0x17ec22,
      [
        _0x389931,
        _0x1a66eb,
        _0x156cbb,
        _0x5e0d5c,
        _0x3bd0a1,
        _0x26bbcc,
        _0x3fa4a8,
      ] = _0x55e877;
    if (_0x491cc3 >= _0x201109 - 0x1) {
      const _0x34d8b0 = _0x588d4b[_0x1547e9(0x1ef)](
          _0x491cc3 - _0x201109 + 0x1,
          _0x491cc3 + 0x1
        )["reduce"](
          (_0x278db8, _0x34e2d9) =>
            _0x278db8 +
            checkMarket(
              _0x2a204f,
              _0x34e2d9[0x1],
              _0x34e2d9[0x2],
              _0x34e2d9[0x5]
            ),
          0x0
        ),
        _0x3055ca = Math[_0x1547e9(0x1f0)]((_0x34d8b0 / _0x201109) * 0x64);
      let _0x1e8da2 = _0x1547e9(0x1f5),
        _0x29a36b = 0x0,
        _0x43d427 = 0x0;
      if (_0x491cc3 + _0x2ba1e3 <= _0x588d4b["length"]) {
        const _0x412cdb = _0x588d4b[_0x1547e9(0x1ef)](
          _0x491cc3 + 0x1,
          _0x491cc3 + 0x1 + _0x2ba1e3
        );
        (_0x29a36b = _0x412cdb[_0x1547e9(0x24b)](
          (_0x5c3eec) =>
            checkMarket(
              _0x2a204f,
              _0x5c3eec[0x1],
              _0x5c3eec[0x2],
              _0x5c3eec[0x5]
            ) === 0x1
        )[_0x1547e9(0x207)]),
          (_0x43d427 = _0x2ba1e3 - _0x29a36b);
        const _0x14d40a = _0x412cdb[_0x1547e9(0x20f)](
          (_0x41dfa1) =>
            checkMarket(
              _0x2a204f,
              _0x41dfa1[0x1],
              _0x41dfa1[0x2],
              _0x41dfa1[0x5]
            ) === 0x1
        );
        _0x14d40a && (_0x1e8da2 = "green");
      }
      const _0x1c4cd8 = _0x2a204f + "\x20" + _0x3055ca + "%";
      !_0x8c73d5[_0x1c4cd8] &&
        (_0x8c73d5[_0x1c4cd8] = {
          occurrences: 0x0,
          greens: 0x0,
          reds: 0x0,
          totalGreens: _0x29a36b,
          totalReds: _0x43d427,
        }),
        (_0x8c73d5[_0x1c4cd8][_0x1547e9(0x1e4)] += 0x1),
        _0x1e8da2 === _0x1547e9(0x23d)
          ? (_0x8c73d5[_0x1c4cd8][_0x1547e9(0x248)] += 0x1)
          : (_0x8c73d5[_0x1c4cd8][_0x1547e9(0x1fa)] += 0x1),
        (_0x8c73d5[_0x1c4cd8][_0x1547e9(0x1be)] = _0x29a36b),
        (_0x8c73d5[_0x1c4cd8][_0x1547e9(0x265)] = _0x43d427);
    }
  });
  const _0x1e4661 = Object["keys"](_0x8c73d5)
      ["map"]((_0x37842c) => {
        const _0x1d9982 = _0x17ec22,
          _0x3ec807 = _0x8c73d5[_0x37842c],
          _0x547f62 = ((_0x3ec807["greens"] / _0x3ec807[_0x1d9982(0x1e4)]) *
            0x64)[_0x1d9982(0x1b2)](0x2);
        let _0xa4e49b = "";
        const _0x1d945d = parseFloat(_0x547f62);
        if (_0x1d945d > 0x4b) _0xa4e49b = _0x1d9982(0x244);
        else {
          if (_0x1d945d > 0x32) _0xa4e49b = _0x1d9982(0x1d8);
          else
            _0x1d945d > 0x19
              ? (_0xa4e49b = _0x1d9982(0x208))
              : (_0xa4e49b = "Alta\x20chance\x20de\x20falha");
        }
        return {
          marketGroup: _0x37842c,
          marketPercentage: parseFloat(_0x37842c["split"]("\x20")[0x1]),
          occurrences: _0x3ec807[_0x1d9982(0x1e4)],
          greens: _0x3ec807["greens"],
          reds: _0x3ec807[_0x1d9982(0x1fa)],
          greenPercentage: _0x547f62,
          totalGreens: _0x3ec807[_0x1d9982(0x1be)],
          totalReds: _0x3ec807["totalReds"],
          analysis: _0xa4e49b,
        };
      })
      ["sort"](
        (_0x193d6b, _0x1854bd) =>
          _0x1854bd["greenPercentage"] - _0x193d6b["greenPercentage"] ||
          _0x1854bd[_0x17ec22(0x248)] - _0x193d6b[_0x17ec22(0x248)]
      )
      [_0x17ec22(0x1ef)](0x0, 0x64),
    _0x4e8c80 = _0x1e4661[_0x17ec22(0x1ef)](0x0, 0x5);
  return { currentPercentage: _0x52d2c8, top5: _0x4e8c80 };
}
function criarPromptAnalise(_0xe03775, _0x53c996) {
  const _0x4918df = _0x458f03;
  return (
    _0x4918df(0x237) +
    _0xe03775[_0x4918df(0x217)] +
    _0x4918df(0x1d7) +
    _0xe03775["liga"] +
    "\x0a-\x20Mercado:\x20" +
    _0x53c996[_0x4918df(0x245)] +
    _0x4918df(0x238) +
    _0xe03775[_0x4918df(0x24e)] +
    _0x4918df(0x25d) +
    _0x53c996["martingale"] +
    _0x4918df(0x1b4) +
    (_0x53c996["observacao"] || _0x4918df(0x219)) +
    "\x0a" +
    (_0x53c996["imagem"]
      ? "-\x20Imagem\x20fornecida:\x20Uma\x20imagem\x20foi\x20enviada\x20para\x20análise\x20adicional."
      : "") +
    _0x4918df(0x1cb) +
    _0x53c996["mercado"] +
    _0x4918df(0x25f) +
    JSON[_0x4918df(0x267)](
      _0xe03775[_0x4918df(0x20e)][_0x4918df(0x1ef)](0x0, 0xa),
      null,
      0x2
    ) +
    "\x0a\x0a2.\x20TOP\x2015\x20PADRÕES\x20ENCONTRADOS\x20PARA\x20O\x20MERCADO\x20\x22" +
    _0x53c996["mercado"] +
    "\x22:\x0a" +
    JSON[_0x4918df(0x267)](_0xe03775[_0x4918df(0x255)], null, 0x2) +
    "\x0a\x0a3.\x20PRÓXIMOS\x206\x20CONFRONTOS:\x0a" +
    JSON[_0x4918df(0x267)](_0xe03775[_0x4918df(0x220)], null, 0x2) +
    _0x4918df(0x26a) +
    _0x53c996["mercado"] +
    _0x4918df(0x1bb) +
    _0xe03775[_0x4918df(0x1fd)]["currentPercentage"] +
    _0x4918df(0x243) +
    JSON[_0x4918df(0x267)](
      _0xe03775["marketAnalysis"][_0x4918df(0x235)],
      null,
      0x2
    ) +
    "\x0a\x0aINSTRUÇÕES\x20DE\x20ANÁLISE\x20(SUA\x20TAREFA):\x0a1.\x20\x20Sua\x20missão\x20é\x20conectar\x20as\x20informações\x20acima.\x0aNão\x20processe\x20dados\x20brutos,\x20apenas\x20interprete\x20os\x20resultados\x20que\x20eu\x20forneci.\x0a2.\x20\x20Analise\x20os\x20\x22TOP\x2015\x20PADRÕES\x22.\x0aIdentifique\x20quais\x20têm\x20o\x20maior\x20percentual\x20de\x20acerto\x20(percentual)\x20e\x20um\x20número\x20sólido\x20de\x20ocorrências.\x0aPadrões\x20com\x20100%\x20de\x20acerto\x20e\x20poucas\x20ocorrências\x20são\x20promissores,\x20mas\x20de\x20alto\x20risco.\x0a3.\x20\x20Observe\x20os\x20\x22PRÓXIMOS\x206\x20CONFRONTOS\x22.\x20Verifique\x20se\x20algum\x20desses\x20jogos\x20envolve\x20times\x20que\x20estão\x20bem\x20posicionados\x20no\x20\x22RANKING\x20DE\x20TIMES\x22.\x0a4.\x20\x20Cruze\x20as\x20informações:\x20A\x20oportunidade\x20de\x20maior\x20valor\x20acontece\x20quando\x20um\x20padrão\x20forte\x20aponta\x20para\x20um\x20dos\x20próximos\x20confrontos\x20E\x20esse\x20confronto\x20envolve\x20times\x20com\x20bom\x20desempenho\x20histórico\x20no\x20mercado.\x0a5.\x20\x20Se\x20uma\x20imagem\x20foi\x20fornecida,\x20considere\x20que\x20ela\x20pode\x20conter\x20informações\x20visuais\x20complementares\x20(como\x20estatísticas\x20ou\x20gráficos)\x20e\x20mencione\x20que\x20ela\x20foi\x20considerada\x20na\x20análise,\x20mas\x20não\x20tente\x20descrevê-la\x20diretamente.\x0a6.\x20\x20Baseado\x20nesta\x20síntese,\x20gere\x20a\x20sua\x20análise\x20no\x20formato\x20abaixo.\x0aO\x20número\x20de\x20sugestões\x20de\x20horários\x20deve\x20seguir\x20a\x20estratégia\x20Martingale\x20(Nenhum\x20=\x201\x20jogo,\x201\x20Cobertura\x20=\x202\x20jogos,\x202\x20Coberturas\x20=\x203\x20jogos,\x203\x20Coberturas\x20=\x204\x20jogos).\x0a7.\x20\x20Se\x20nenhum\x20padrão\x20forte\x20se\x20alinhar\x20com\x20os\x20próximos\x20jogos\x20de\x20times\x20bem\x20ranqueados,\x20seja\x20honesto\x20e\x20informe\x20que\x20nenhuma\x20oportunidade\x20clara\x20foi\x20encontrada.\x0a8.\x20\x20Para\x20as\x20sugestões\x20de\x20horários:\x20Selecione\x20o\x20próximo\x20confronto\x20que\x20melhor\x20se\x20alinha\x20com\x20padrões\x20fortes\x20e\x20times\x20bem\x20ranqueados\x20como\x20o\x20principal.\x0aEm\x20seguida,\x20adicione\x20as\x20coberturas\x20como\x20os\x20confrontos\x20sequenciais\x20seguintes.\x0aGaranta\x20que\x20os\x20horários\x20estejam\x20em\x20sequência\x20cronológica\x20crescente,\x20sem\x20repetições,\x20e\x20baseados\x20exclusivamente\x20nos\x20horários\x20fornecidos\x20nos\x20próximos\x20confrontos.\x0aAssuma\x20que\x20a\x20lista\x20de\x20próximos\x20está\x20ordenada\x20por\x20tempo,\x20e\x20selecione\x20apenas\x20horários\x20futuros\x20ou\x20os\x20mais\x20próximos.\x0aO\x20primeiro\x20horário\x20é\x20o\x20principal\x20com\x20padrão\x20e\x20análise,\x20os\x20demais\x20são\x20coberturas.\x0a9.\x20\x20Inclua\x20uma\x20seção\x20independente\x20para\x20a\x20Análise\x20de\x20Gráfico\x20de\x20Mercado,\x20comentando\x20a\x20porcentagem\x20atual\x20e\x20destacando\x20as\x20top\x205\x20melhores\x20porcentagens,\x20considerando\x20o\x20Martingale\x20selecionado\x20para\x20a\x20verificação.\x0aFORMATO\x20DA\x20RESPOSTA\x20(Use\x20um\x20tom\x20natural\x20e\x20profissional,\x20evite\x20usar\x20negrito\x20com\x20asteriscos\x20**):\x0a\x0a🎯\x20ANÁLISE\x20ESTATÍSTICA\x0a[Comente\x20brevemente\x20sobre\x20o\x20desempenho\x20dos\x20times\x20no\x20ranking\x20e\x20a\x20força\x20geral\x20dos\x20padrões\x20encontrados.\x0aEx:\x20\x22Observa-se\x20que\x20os\x20times\x20X\x20e\x20Y\x20são\x20dominantes\x20neste\x20mercado.\x20Foram\x20encontrados\x20N\x20padrões\x20com\x20mais\x20de\x2080%\x20de\x20acerto,\x20indicando\x20consistência...\x22]\x0a\x0a📊\x20PADRÕES\x20RELEVANTES\x0a[Destaque\x202\x20ou\x203\x20dos\x20padrões\x20mais\x20promissores\x20da\x20lista,\x20explicando\x20por\x20que\x20são\x20relevantes.\x0aEx:\x20\x22O\x20padrão\x20\x27over2.5\x20|\x201-2\x27\x20se\x20destaca\x20com\x2085%\x20de\x20acerto\x20em\x2020\x20ocorrências,\x20mostrando\x20ser\x20um\x20gatilho\x20confiável...\x22]\x0a\x0a📈\x20ANÁLISE\x20DE\x20GRÁFICO\x20DE\x20MERCADO\x0a[Comente\x20sobre\x20a\x20porcentagem\x20atual\x20do\x20mercado\x20e\x20destaque\x20as\x20top\x205\x20melhores\x20porcentagens,\x20incluindo\x20greenPercentage,\x20occurrences,\x20etc.,\x20considerando\x20o\x20Martingale\x20selecionado\x20para\x20a\x20verificação\x20de\x20linhas.]\x0a\x0a⚡\x20PRÓXIMAS\x20OPORTUNIDADES\x0a[Baseado\x20na\x20sua\x20análise\x20combinada,\x20liste\x20as\x20entradas\x20recomendadas.\x0aSe\x20nenhuma\x20for\x20encontrada,\x20justifique\x20o\x20motivo.\x0aFormato\x20se\x20encontrar:\x0aLiga:\x20[liga]\x0aMercado:\x20[mercado]\x0a⏰\x20Horários\x0a▸\x20[hora:minuto]\x20▸\x20[hora:minuto]\x20...\x20(número\x20baseado\x20na\x20Martingale,\x20em\x20sequência\x20sem\x20repetições)\x0aJustificativa:\x20[Breve\x20explicação\x20do\x20porquê\x20esta\x20é\x20uma\x20boa\x20entrada,\x20mencionando\x20o\x20padrão\x20e\x20os\x20times\x20envolvidos.\x0aNote\x20que\x20o\x20primeiro\x20horário\x20é\x20o\x20principal\x20onde\x20padrões\x20foram\x20encontrados,\x20os\x20demais\x20são\x20coberturas\x20sequenciais.]\x0a\x0a🎲\x20ESTRATÉGIA\x20MARTINGALE\x0a[Avalie\x20a\x20segurança\x20da\x20estratégia\x20para\x20este\x20cenário.\x0aEx:\x20\x22Considerando\x20a\x20força\x20dos\x20padrões\x20encontrados,\x20a\x20estratégia\x20de\x20[N]\x20coberturas\x20parece\x20[segura/arriscada]...\x22]\x0a\x0a💡\x20RECOMENDAÇÃO\x20FINAL\x0a[Dê\x20uma\x20recomendação\x20final\x20clara\x20e\x20objetiva.\x0aEx:\x20\x22Recomendo\x20a\x20entrada\x20nos\x20horários\x20sugeridos\x20devido\x20à\x20forte\x20confluência\x20entre\x20o\x20padrão\x20X\x20e\x20o\x20confronto\x20envolvendo\x20o\x20time\x20Y,\x20que\x20possui\x20um\x20histórico\x20excelente\x20neste\x20mercado.\x22]\x0a"
  );
}
async function analisarComGrok(_0x1f3f4b, _0x5ec0ce) {
  const _0x26114f = _0x458f03,
    _0x2e0536 = criarPromptAnalise(_0x1f3f4b, _0x5ec0ce),
    _0x333a01 = await fetch(GROK_URL, {
      method: _0x26114f(0x21b),
      headers: {
        "Content-Type": "application/json",
        Authorization: _0x26114f(0x1ce) + GROK_API_KEY,
      },
      body: JSON[_0x26114f(0x267)]({
        messages: [{ role: "user", content: _0x2e0536 }],
        model: "grok-4-latest",
        temperature: 0.7,
        max_tokens: 0x800,
        top_p: 0.95,
        stream: ![],
      }),
    });
  if (!_0x333a01["ok"]) {
    const _0x5a42b6 = await _0x333a01[_0x26114f(0x1d2)]();
    console["error"](_0x26114f(0x22f), _0x5a42b6);
    throw new Error(
      "Erro\x20na\x20API\x20do\x20Grok:\x20" +
        _0x333a01[_0x26114f(0x1d0)] +
        "\x20" +
        _0x333a01[_0x26114f(0x1ee)]
    );
  }
  const _0xaf73af = await _0x333a01[_0x26114f(0x1d2)]();
  if (
    _0xaf73af[_0x26114f(0x1e9)] &&
    _0xaf73af[_0x26114f(0x1e9)][_0x26114f(0x207)] > 0x0 &&
    _0xaf73af[_0x26114f(0x1e9)][0x0][_0x26114f(0x254)]
  )
    return _0xaf73af[_0x26114f(0x1e9)][0x0][_0x26114f(0x254)][_0x26114f(0x20a)];
  else {
    console[_0x26114f(0x24c)](_0x26114f(0x239), _0xaf73af);
    throw new Error(_0x26114f(0x25b));
  }
}
const LIMITE_DIARIO = 0x6;
function verificarLimiteDeUso() {
  const _0x42d18c = _0x458f03,
    _0x3b0a24 = new Date()[_0x42d18c(0x1b1)]()[_0x42d18c(0x1ef)](0x0, 0xa),
    _0x5272db = localStorage["getItem"](_0x42d18c(0x222));
  let _0x207f40 = parseInt(
    localStorage["getItem"](_0x42d18c(0x227)) || "0",
    0xa
  );
  _0x5272db !== _0x3b0a24 &&
    ((_0x207f40 = 0x0),
    localStorage[_0x42d18c(0x213)](_0x42d18c(0x222), _0x3b0a24),
    localStorage[_0x42d18c(0x213)](
      _0x42d18c(0x227),
      _0x207f40[_0x42d18c(0x266)]()
    ));
  if (_0x207f40 >= LIMITE_DIARIO)
    return alert(_0x42d18c(0x1ed) + LIMITE_DIARIO + _0x42d18c(0x1e3)), ![];
  return !![];
}
function incrementarContadorDeUso() {
  const _0x7ae85f = _0x458f03;
  let _0x5b13ae = parseInt(
    localStorage["getItem"](_0x7ae85f(0x227)) || "0",
    0xa
  );
  _0x5b13ae++,
    localStorage[_0x7ae85f(0x213)](
      _0x7ae85f(0x227),
      _0x5b13ae[_0x7ae85f(0x266)]()
    );
}
async function gerarAnalise() {
  const _0x5a583f = _0x458f03;
  if (!verificarLimiteDeUso()) return;
  const _0x5e7cc5 = getSelectedValue(_0x5a583f(0x1f1)),
    _0x4cf2f7 = getSelectedValue(_0x5a583f(0x23f)),
    _0x51b8d0 = getSelectedValue(_0x5a583f(0x263)),
    _0x4fb758 = getSelectedText("mercados-group"),
    _0x3c13da = parseInt(getSelectedValue(_0x5a583f(0x1d4)) || "0", 0xa),
    _0x7b81d8 = getSelectedText("martingale-group"),
    _0x4650c4 = getSelectedValue(_0x5a583f(0x1e5)),
    _0x340603 = document[_0x5a583f(0x1bc)](_0x5a583f(0x1c7))["value"],
    _0x27309e = document[_0x5a583f(0x1bc)]("image-upload")["files"][0x0];
  if (!_0x5e7cc5 || !_0x4cf2f7 || !_0x51b8d0 || !_0x4650c4) {
    alert(
      "Por\x20favor,\x20selecione\x20Casa,\x20Liga,\x20Mercado\x20e\x20Período\x20de\x20Análise."
    );
    return;
  }
  const _0x1f0ca9 = document[_0x5a583f(0x1c8)](".btn-generate"),
    _0x3c277a = document["getElementById"](_0x5a583f(0x261)),
    _0x2e1afc = document[_0x5a583f(0x1bc)](_0x5a583f(0x212)),
    _0xb02f33 = document[_0x5a583f(0x1bc)](_0x5a583f(0x1d9));
  (_0x1f0ca9[_0x5a583f(0x209)] = !![]),
    (_0x1f0ca9[_0x5a583f(0x22b)] = _0x5a583f(0x250)),
    (_0x3c277a[_0x5a583f(0x25c)][_0x5a583f(0x200)] = _0x5a583f(0x1b6)),
    (_0xb02f33[_0x5a583f(0x22b)] = "");
  try {
    _0x2e1afc[_0x5a583f(0x22b)] =
      _0x5a583f(0x233) + _0x4650c4 + _0x5a583f(0x22a);
    const _0x5c8f38 = await buscarDadosAPI(
      _0x5e7cc5,
      _0x4cf2f7,
      parseInt(_0x4650c4)
    );
    (_0x5c8f38[_0x5a583f(0x20e)] = calcularRankingTimes(
      _0x5c8f38["dadosCru"][_0x5a583f(0x229)]((_0x156417) => ({
        time_a: _0x156417[0x3],
        time_b: _0x156417[0x4],
        ft: _0x156417[0x0] + _0x5a583f(0x1af) + _0x156417[0x1],
      })),
      _0x51b8d0
    )),
      (_0x2e1afc[_0x5a583f(0x22b)] =
        "<div\x20class=\x22loading\x22><div\x20class=\x22spinner\x22></div>Analisando\x20padrões...</div>");
    const _0x5a02fe = _0x3c13da + 0x1,
      { resultados: _0x216c50 } = await analyzeInWorker(
        _0x5c8f38[_0x5a583f(0x1de)],
        { tiros: _0x5a02fe, market: _0x51b8d0, combinado: !![] }
      );
    _0x5c8f38[_0x5a583f(0x255)] = _0x216c50;
    const _0x30859a = mapMercado(_0x51b8d0),
      _0x359f78 = _0x5e7cc5 === _0x5a583f(0x257) ? 0x1e : 0x14,
      _0x1d28be = _0x3c13da + 0x1;
    (_0x5c8f38[_0x5a583f(0x1fd)] = calculateMarketAnalysis(
      _0x5c8f38,
      _0x30859a,
      _0x5c8f38[_0x5a583f(0x24e)],
      _0x359f78,
      _0x1d28be
    )),
      (_0x2e1afc[_0x5a583f(0x22b)] = _0x5a583f(0x20d));
    const _0x42fc8f = {
        mercado: _0x4fb758,
        liga: _0x4cf2f7,
        martingale: _0x7b81d8 || _0x5a583f(0x1c0),
        periodo: _0x4650c4 + _0x5a583f(0x1b8),
        observacao: _0x340603,
        imagem: _0x27309e ? !![] : ![],
      },
      _0x1bb13b = await analisarComGrok(_0x5c8f38, _0x42fc8f);
    (_0x2e1afc[_0x5a583f(0x22b)] =
      "✓\x20Análise\x20Concluída\x20-\x20" +
      casasConfig[_0x5e7cc5][_0x5a583f(0x1e8)] +
      "\x20(" +
      _0x4cf2f7 +
      ")"),
      (_0xb02f33["textContent"] = _0x1bb13b),
      incrementarContadorDeUso();
  } catch (_0x10d82a) {
    console["error"](_0x5a583f(0x211), _0x10d82a),
      (_0x2e1afc[_0x5a583f(0x22b)] = _0x5a583f(0x264)),
      (_0xb02f33["innerHTML"] =
        _0x5a583f(0x268) +
        _0x10d82a["message"] +
        "<br><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<strong>Causas\x20possíveis:</strong>\x20Falha\x20na\x20operação.\x0aAtualize\x20a\x20página\x20e\x20tente\x20outra\x20vez\x20mais\x20tarde.\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>");
  } finally {
    (_0x1f0ca9[_0x5a583f(0x209)] = ![]),
      (_0x1f0ca9[_0x5a583f(0x22b)] = _0x5a583f(0x21e));
  }
}
document[_0x458f03(0x1bc)](_0x458f03(0x1dc))[_0x458f03(0x225)](
  _0x458f03(0x1c4),
  function (_0x4b6029) {
    const _0x8c6edd = _0x458f03,
      _0x3aef7b = _0x4b6029["target"][_0x8c6edd(0x1df)][0x0],
      _0x3b9d96 = document[_0x8c6edd(0x1bc)]("image-preview"),
      _0x46e5d3 = document["getElementById"](_0x8c6edd(0x1fb));
    if (_0x3aef7b) {
      const _0x26934d = new FileReader();
      (_0x26934d[_0x8c6edd(0x1b0)] = function (_0x41c9fc) {
        const _0x207797 = _0x8c6edd;
        (_0x3b9d96[_0x207797(0x242)] = _0x41c9fc[_0x207797(0x223)]["result"]),
          (_0x3b9d96["style"][_0x207797(0x200)] = _0x207797(0x1b6));
      }),
        _0x26934d[_0x8c6edd(0x251)](_0x3aef7b),
        (_0x46e5d3["textContent"] = _0x3aef7b[_0x8c6edd(0x1e8)]);
    } else
      (_0x3b9d96[_0x8c6edd(0x25c)][_0x8c6edd(0x200)] = _0x8c6edd(0x259)),
        (_0x46e5d3[_0x8c6edd(0x21d)] = "Nenhum\x20arquivo\x20selecionado");
  }
);
