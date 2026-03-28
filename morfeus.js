const _0x865f24 = _0x51d1;
(function (_0x3ec9eb, _0x43f9ca) {
  const _0x903b7e = _0x51d1,
    _0x2e49d6 = _0x3ec9eb();
  while (!![]) {
    try {
      const _0x40575a =
        -parseInt(_0x903b7e(0x248)) / 0x1 +
        parseInt(_0x903b7e(0x1f8)) / 0x2 +
        (parseInt(_0x903b7e(0x264)) / 0x3) *
          (-parseInt(_0x903b7e(0x1e3)) / 0x4) +
        parseInt(_0x903b7e(0x27c)) / 0x5 +
        (parseInt(_0x903b7e(0x21c)) / 0x6) *
          (-parseInt(_0x903b7e(0x1d2)) / 0x7) +
        -parseInt(_0x903b7e(0x244)) / 0x8 +
        parseInt(_0x903b7e(0x225)) / 0x9;
      if (_0x40575a === _0x43f9ca) break;
      else _0x2e49d6["push"](_0x2e49d6["shift"]());
    } catch (_0x536d40) {
      _0x2e49d6["push"](_0x2e49d6["shift"]());
    }
  }
})(_0x30e8, 0x22f46);
const GEMINI_API_KEY = _0x865f24(0x20f),
  GEMINI_URL = _0x865f24(0x23e),
  casasConfig = {
    betano: {
      name: "Betano",
      ligas: [
        _0x865f24(0x228),
        _0x865f24(0x235),
        "Euro",
        "Campeonato\x20Italiano",
        _0x865f24(0x260),
        "Brasileirão\x20Betano",
      ],
    },
    kiron: {
      name: _0x865f24(0x252),
      ligas: [_0x865f24(0x1f7), _0x865f24(0x27f), _0x865f24(0x1d5)],
      path: _0x865f24(0x253),
    },
    estrela: { name: _0x865f24(0x221), ligas: ["estrela"], path: "estrela" },
    betsson: {
      name: _0x865f24(0x275),
      ligas: [_0x865f24(0x1cf), "Inglaterra", _0x865f24(0x1e0)],
      path: _0x865f24(0x27a),
    },
  };
document[_0x865f24(0x25a)](_0x865f24(0x216))[_0x865f24(0x25c)]((_0x35df3a) => {
  const _0x32c8e7 = _0x865f24;
  _0x35df3a["addEventListener"](_0x32c8e7(0x281), (_0x174918) => {
    const _0x1d9aff = _0x32c8e7;
    if (
      _0x174918[_0x1d9aff(0x258)][_0x1d9aff(0x1da)][_0x1d9aff(0x224)](
        _0x1d9aff(0x217)
      )
    ) {
      const _0x4be03a = _0x35df3a[_0x1d9aff(0x25e)](".btn.active");
      _0x4be03a && _0x4be03a[_0x1d9aff(0x1da)]["remove"](_0x1d9aff(0x222)),
        _0x174918[_0x1d9aff(0x258)][_0x1d9aff(0x1da)][_0x1d9aff(0x259)](
          _0x1d9aff(0x222)
        ),
        _0x35df3a["id"] === _0x1d9aff(0x277) &&
          mostrarLigas(_0x174918["target"]["dataset"][_0x1d9aff(0x245)]);
    }
  });
});
function mostrarLigas(_0x55e9a5) {
  const _0x21975a = _0x865f24,
    _0x293c34 = document[_0x21975a(0x267)](_0x21975a(0x20d)),
    _0x51e120 = document[_0x21975a(0x267)](_0x21975a(0x1f9));
  if (!casasConfig[_0x55e9a5]) {
    _0x293c34[_0x21975a(0x1ff)]["display"] = _0x21975a(0x22e);
    return;
  }
  (_0x51e120[_0x21975a(0x285)] = ""),
    casasConfig[_0x55e9a5]["ligas"]["forEach"]((_0x2eaa4d) => {
      const _0x12b4dd = _0x21975a,
        _0x48e8ae = document[_0x12b4dd(0x23d)](_0x12b4dd(0x203));
      (_0x48e8ae[_0x12b4dd(0x1d3)] = _0x12b4dd(0x217)),
        (_0x48e8ae[_0x12b4dd(0x1eb)][_0x12b4dd(0x245)] = _0x2eaa4d),
        (_0x48e8ae[_0x12b4dd(0x227)] = _0x2eaa4d),
        _0x51e120[_0x12b4dd(0x200)](_0x48e8ae);
    }),
    (_0x293c34[_0x21975a(0x1ff)][_0x21975a(0x1de)] = "block");
}
function getSelectedValue(_0x29f17d) {
  const _0x33a2a7 = _0x865f24,
    _0x56019d = document[_0x33a2a7(0x267)](_0x29f17d),
    _0x15db77 = _0x56019d[_0x33a2a7(0x25e)](_0x33a2a7(0x232));
  return _0x15db77 ? _0x15db77["dataset"][_0x33a2a7(0x245)] : null;
}
function getSelectedText(_0x19199e) {
  const _0x228155 = _0x865f24,
    _0x12f99e = document[_0x228155(0x267)](_0x19199e),
    _0x3f7738 = _0x12f99e[_0x228155(0x25e)](_0x228155(0x232));
  return _0x3f7738 ? _0x3f7738[_0x228155(0x23f)] : null;
}
function limparAnalise() {
  const _0x199d92 = _0x865f24;
  document[_0x199d92(0x25a)](".btn.active")[_0x199d92(0x25c)]((_0x442153) =>
    _0x442153[_0x199d92(0x1da)]["remove"](_0x199d92(0x222))
  ),
    (document[_0x199d92(0x267)](_0x199d92(0x1fb))["value"] = ""),
    (document[_0x199d92(0x267)]("image-upload")["value"] = ""),
    (document["getElementById"](_0x199d92(0x1c9))[_0x199d92(0x227)] =
      _0x199d92(0x24f)),
    (document[_0x199d92(0x267)](_0x199d92(0x205))[_0x199d92(0x1ff)][
      _0x199d92(0x1de)
    ] = _0x199d92(0x22e)),
    (document[_0x199d92(0x267)]("result-container")[_0x199d92(0x1ff)][
      _0x199d92(0x1de)
    ] = _0x199d92(0x22e)),
    (document["getElementById"](_0x199d92(0x20d))["style"][_0x199d92(0x1de)] =
      _0x199d92(0x22e));
}
function calcularRankingTimes(_0x737759, _0x9be227) {
  const _0x486315 = _0x865f24,
    _0x4a6259 = {};
  _0x737759[_0x486315(0x25c)]((_0x201e1f) => {
    const _0x339287 = _0x486315,
      { time_a: _0x7dc7cd, time_b: _0x4bf4cf, ft: _0x5ee7f4 } = _0x201e1f;
    if (!_0x5ee7f4 || !_0x5ee7f4[_0x339287(0x1e1)](_0x339287(0x210))) return;
    const [_0x1f67e6, _0x30cf67] = _0x5ee7f4[_0x339287(0x286)](
        _0x339287(0x210)
      )["map"](Number),
      _0x238d38 = _0x1f67e6 + _0x30cf67;
    [_0x7dc7cd, _0x4bf4cf]["forEach"]((_0x583100) => {
      !_0x4a6259[_0x583100] &&
        (_0x4a6259[_0x583100] = {
          name: _0x583100,
          totalGames: 0x0,
          marketCount: 0x0,
        });
    }),
      _0x4a6259[_0x7dc7cd][_0x339287(0x202)]++,
      _0x4a6259[_0x4bf4cf][_0x339287(0x202)]++;
    let _0x4a0423 = ![];
    switch (_0x9be227) {
      case _0x339287(0x20b):
        _0x4a0423 = _0x1f67e6 > 0x0 && _0x30cf67 > 0x0;
        break;
      case _0x339287(0x1f0):
        _0x4a0423 = _0x1f67e6 === 0x0 || _0x30cf67 === 0x0;
        break;
      case _0x339287(0x1f6):
        _0x4a0423 = _0x1f67e6 === _0x30cf67;
        break;
      case "over1.5":
        _0x4a0423 = _0x238d38 > 0x1;
        break;
      case _0x339287(0x1f5):
        _0x4a0423 = _0x238d38 < 0x2;
        break;
      case "over2.5":
        _0x4a0423 = _0x238d38 > 0x2;
        break;
      case _0x339287(0x213):
        _0x4a0423 = _0x238d38 < 0x3;
        break;
      case _0x339287(0x23a):
        _0x4a0423 = _0x238d38 > 0x3;
        break;
      case _0x339287(0x215):
        _0x4a0423 = _0x238d38 < 0x4;
        break;
      case "over5":
        _0x4a0423 = _0x238d38 >= 0x5;
        break;
      case _0x339287(0x27e):
        _0x4a0423 = _0x238d38 === 0x1;
        break;
      case _0x339287(0x268):
        _0x4a0423 = _0x238d38 === 0x2;
        break;
      case _0x339287(0x233):
        _0x4a0423 = _0x238d38 === 0x3;
        break;
      case _0x339287(0x211):
        _0x4a0423 = _0x238d38 === 0x4;
        break;
    }
    _0x4a0423 &&
      (_0x4a6259[_0x7dc7cd][_0x339287(0x284)]++,
      _0x4a6259[_0x4bf4cf][_0x339287(0x284)]++);
    if (_0x9be227 === _0x339287(0x278) && _0x1f67e6 > _0x30cf67)
      _0x4a6259[_0x7dc7cd][_0x339287(0x284)]++;
    if (_0x9be227 === "foraVence" && _0x30cf67 > _0x1f67e6)
      _0x4a6259[_0x4bf4cf]["marketCount"]++;
  });
  const _0x1cb2e5 = Object["values"](_0x4a6259)[_0x486315(0x1dc)](
    (_0xadfb83) => ({
      ..._0xadfb83,
      percentage:
        _0xadfb83[_0x486315(0x202)] > 0x0
          ? ((_0xadfb83[_0x486315(0x284)] / _0xadfb83[_0x486315(0x202)]) *
              0x64)[_0x486315(0x256)](0x1)
          : _0x486315(0x1fd),
    })
  );
  return (
    _0x1cb2e5[_0x486315(0x27b)](
      (_0x5245f7, _0x27e956) =>
        _0x27e956["marketCount"] - _0x5245f7[_0x486315(0x284)] ||
        parseFloat(_0x27e956[_0x486315(0x266)]) -
          parseFloat(_0x5245f7["percentage"])
    ),
    _0x1cb2e5
  );
}
function _0x51d1(_0x3548f6, _0x2ea5b2) {
  const _0x30e8c8 = _0x30e8();
  return (
    (_0x51d1 = function (_0x51d131, _0x4d5bd0) {
      _0x51d131 = _0x51d131 - 0x1c7;
      let _0x3dbf19 = _0x30e8c8[_0x51d131];
      return _0x3dbf19;
    }),
    _0x51d1(_0x3548f6, _0x2ea5b2)
  );
}
async function buscarDadosAPI(_0x4fa875, _0x3703fc, _0x5d701d) {
  const _0x577d6f = _0x865f24,
    _0x3a68de = casasConfig[_0x4fa875];
  if (!_0x3a68de)
    throw new Error("Casa\x20" + _0x4fa875 + "\x20não\x20encontrada");
  const _0x267bd4 = {
    casa: _0x3a68de[_0x577d6f(0x21d)],
    liga: _0x3703fc,
    totalJogos: 0x0,
    dadosCru: [],
  };
  try {
    const _0x101142 = encodeURIComponent(_0x3703fc),
      _0x1e4d7a = _0x577d6f(0x214);
    let _0x4de333, _0x220c2f;
    _0x3a68de[_0x577d6f(0x1c8)]
      ? ((_0x4de333 =
          _0x1e4d7a +
          "/resultados/" +
          _0x3a68de[_0x577d6f(0x1c8)] +
          "/" +
          _0x101142),
        (_0x220c2f =
          _0x1e4d7a +
          _0x577d6f(0x282) +
          _0x3a68de[_0x577d6f(0x1c8)] +
          "/" +
          _0x101142))
      : ((_0x4de333 = _0x1e4d7a + "/resultados/" + _0x101142),
        (_0x220c2f = _0x1e4d7a + _0x577d6f(0x282) + _0x101142));
    const [_0x18cb98, _0x4f102c] = await Promise[_0x577d6f(0x240)]([
        fetch(_0x4de333)[_0x577d6f(0x1ec)]((_0xa0fd4c) => _0xa0fd4c["json"]()),
        fetch(_0x220c2f)[_0x577d6f(0x1ec)]((_0x35a573) =>
          _0x35a573[_0x577d6f(0x1d0)]()
        ),
      ]),
      _0x15755f = _0x18cb98[_0x577d6f(0x24c)](-_0x5d701d);
    for (const _0x5896eb of _0x15755f) {
      const _0xf99e5c = (_0x5896eb["ft"] || "x")
          [_0x577d6f(0x286)]("x")
          ["map"]((_0x3a3e09) => parseInt(_0x3a3e09[_0x577d6f(0x265)](), 0xa)),
        _0x375643 = _0xf99e5c[0x0],
        _0x5bee1c = _0xf99e5c[0x1];
      Number[_0x577d6f(0x261)](_0x375643) &&
        Number[_0x577d6f(0x261)](_0x5bee1c) &&
        _0x267bd4[_0x577d6f(0x280)][_0x577d6f(0x1e6)]([
          _0x375643,
          _0x5bee1c,
          _0x375643 + _0x5bee1c,
          (_0x5896eb["time_a"] || "")["trim"](),
          (_0x5896eb[_0x577d6f(0x1e7)] || "")[_0x577d6f(0x265)](),
          _0x5896eb[_0x577d6f(0x21e)],
          _0x5896eb["minuto"],
        ]);
    }
    return (
      (_0x267bd4[_0x577d6f(0x231)] = _0x4f102c[_0x577d6f(0x24c)](0x0, 0x6)),
      (_0x267bd4[_0x577d6f(0x229)] = _0x267bd4[_0x577d6f(0x280)]["length"]),
      _0x267bd4
    );
  } catch (_0xde9a19) {
    console[_0x577d6f(0x262)](_0x577d6f(0x272), _0xde9a19);
    throw new Error(
      "Falha\x20ao\x20conectar\x20com\x20a\x20API:\x20" + _0xde9a19["message"]
    );
  }
}
const ANALYZE_WORKER_SRC = _0x865f24(0x20e);
let ANALYZE_WORKER = null;
function getAnalyzeWorker() {
  const _0x5f125e = _0x865f24;
  if (!ANALYZE_WORKER) {
    const _0x983447 = new Blob([ANALYZE_WORKER_SRC], {
      type: "application/javascript",
    });
    ANALYZE_WORKER = new Worker(URL[_0x5f125e(0x237)](_0x983447));
  }
  return ANALYZE_WORKER;
}
function _0x30e8() {
  const _0x3e965f = [
    "under1.5",
    "empate",
    "England",
    "363032sJAgmf",
    "ligas-group",
    "\x20jogos",
    "observacao",
    "change",
    "0.0",
    "marketAnalysis",
    "style",
    "appendChild",
    "<div\x20class=\x22loading\x22><div\x20class=\x22spinner\x22></div>Gerando\x20análise\x20com\x20IA...</div>",
    "totalGames",
    "button",
    "data",
    "image-preview",
    "analysisUsage",
    "padroesEncontrados",
    "\x0a-\x20Total\x20de\x20jogos\x20analisados:\x20",
    "Alta\x20chance\x20de\x20falha",
    "analyze",
    "ambasMarcam",
    "result",
    "liga-section",
    "\x0a\x20\x20\x20\x20\x20\x20\x20\x20self.onmessage\x20=\x20(e)\x20=>\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20p\x20=\x20e.data;\x0aif\x20(!p\x20||\x20p.cmd\x20!==\x20\x27analyze\x27)\x20return;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20res\x20=\x20analyzeAll(p.payload);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20self.postMessage({\x20ok:\x20true,\x20id:\x20p.id,\x20result:\x20res\x20});\x0a\x20\x20\x20\x20\x20\x20\x20\x20};\x0afunction\x20enumerateCombos(tok){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(tok.length===1)\x20return\x20tok[0].map(t=>[t]);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(tok.length===2){\x20const\x20out=[];\x0afor(const\x20a\x20of\x20tok[0])\x20for(const\x20b\x20of\x20tok[1])\x20out.push([a,b]);\x20return\x20out;\x0a}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(tok.length===3){\x20const\x20out=[];\x0afor(const\x20a\x20of\x20tok[0])\x20for(const\x20b\x20of\x20tok[1])\x20for(const\x20c\x20of\x20tok[2])\x20out.push([a,b,c]);\x20return\x20out;\x0a}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20out=[],cur=[];\x0a(function\x20rec(i){\x20if(i===tok.length){\x20out.push(cur.slice());\x20return;\x20}\x20for(const\x20t\x20of\x20tok[i]){\x20cur.push(t);\x20rec(i+1);\x20cur.pop();\x20}\x20})(0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20out;\x0a}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20getOffsetsByTipo(t){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(t===\x271\x27)\x20return\x20[0];\x0aif(t===\x272\x27)\x20return\x20[0,1];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(t===\x273\x27)\x20return\x20[0,1,2];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(t===\x271_pula_1\x27)\x20return\x20[0,2];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(t===\x271_pula_1_pula_1\x27)\x20return\x20[0,2,4];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20[0,1];\x0a}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20tokensDoJogo(a,b,total,mandante,visitante){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20t\x20=\x20new\x20Set();\x0at.add(`${a}-${b}`);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20t.add(a\x20>\x200\x20&&\x20b\x20>\x200\x20?\x20\x27ambasMarcam\x27\x20:\x20\x27ambasNaoMarcam\x27);\x0at.add(a\x20>\x20b\x20?\x20\x27casaVence\x27\x20:\x20(a\x20<\x20b\x20?\x20\x27foraVence\x27\x20:\x20\x27empate\x27));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20>=\x202)\x20t.add(\x27over1.5\x27);\x0aif\x20(total\x20<\x202)\x20t.add(\x27under1.5\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20>=\x203)\x20t.add(\x27over2.5\x27);\x20if\x20(total\x20<\x203)\x20t.add(\x27under2.5\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20>=\x204)\x20t.add(\x27over3.5\x27);\x0aif\x20(total\x20<\x204)\x20t.add(\x27under3.5\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20>=\x205)\x20t.add(\x27over5\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20===\x201)\x20t.add(\x27exact1\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20===\x202)\x20t.add(\x27exact2\x27);\x0aif\x20(total\x20===\x203)\x20t.add(\x27exact3\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20===\x204)\x20t.add(\x27exact4\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(mandante)\x20t.add(mandante.toLowerCase());\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(visitante)\x20t.add(visitante.toLowerCase());\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20Array.from(t);\x0a}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20isGreenForMarket(m,a,b,total){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27ambasMarcam\x27)\x20return\x20a\x20>\x200\x20&&\x20b\x20>\x200;\x0aif\x20(m\x20===\x20\x27ambasNaoMarcam\x27)\x20return\x20a\x20===\x200\x20||\x20b\x20===\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27casaVence\x27)\x20return\x20a\x20>\x20b;\x0aif\x20(m\x20===\x20\x27foraVence\x27)\x20return\x20a\x20<\x20b;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27empate\x27)\x20return\x20a\x20===\x20b;\x0aif\x20(m\x20===\x20\x27over1.5\x27)\x20return\x20total\x20>=\x202;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27under1.5\x27)\x20return\x20total\x20<\x202;\x0aif\x20(m\x20===\x20\x27over2.5\x27)\x20return\x20total\x20>=\x203;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27under2.5\x27)\x20return\x20total\x20<\x203;\x0aif\x20(m\x20===\x20\x27over3.5\x27)\x20return\x20total\x20>=\x204;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27under3.5\x27)\x20return\x20total\x20<\x204;\x0aif\x20(m\x20===\x20\x27over5\x27)\x20return\x20total\x20>=\x205;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27exact1\x27)\x20return\x20total\x20===\x201;\x0aif\x20(m\x20===\x20\x27exact2\x27)\x20return\x20total\x20===\x202;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27exact3\x27)\x20return\x20total\x20===\x203;\x0aif\x20(m\x20===\x20\x27exact4\x27)\x20return\x20total\x20===\x204;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20false;\x0a}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20analisarAutoPadroes(dados,tipo,tiros,market,inicio,fim){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20res=[];\x0aconst\x20offs=getOffsetsByTipo(tipo);\x20const\x20last=offs[offs.length-1];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(let\x20p=inicio;p<=fim;p++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20comb={};\x0aconst\x20need=(last+1)+p+tiros;\x20if(dados.length<need)\x20continue;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(let\x20i=0;i<=dados.length-need;i++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20tok=[];\x0afor(const\x20o\x20of\x20offs){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20[a,b,t,mandante,visitante]=dados[i+o];\x0atok.push(tokensDoJogo(a,b,t,mandante,visitante));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20combos=enumerateCombos(tok);\x0alet\x20green=false;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20ini=i+last+1+p,\x20fimA=ini+tiros;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(let\x20j=ini;j<fimA&&j<dados.length;j++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20[a,b,sum]=dados[j];\x0aif(isGreenForMarket(market,a,b,sum)){\x20green=true;\x20break;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(const\x20seq\x20of\x20combos){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20key=seq.join(\x27\x20|\x20\x27);\x0aif(!comb[key]){\x20comb[key]={ocorrencias:0,greens:0};\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20comb[key].ocorrencias++;\x0aif(green)\x20comb[key].greens++;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(const\x20k\x20in\x20comb){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20st=comb[k];\x0aif(st.ocorrencias>=3){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20res.push({\x20padrao:k,\x20pular_jogos:p,\x20ocorrencias:st.ocorrencias,\x20greens:st.greens,\x20percentual:((st.greens/st.ocorrencias)*100).toFixed(1)\x20});\x0a}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20res.sort((a,b)=>parseFloat(b.percentual)-parseFloat(a.percentual)||b.ocorrencias-a.ocorrencias);\x0areturn\x20res.slice(0,15);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20analyzeAll(payload){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20{\x20dados,\x20tiros,\x20market,\x20combinado\x20}\x20=\x20payload;\x0aconst\x20tipos\x20=\x20combinado\x20?\x20[\x272\x27,\x273\x27,\x271_pula_1\x27,\x271_pula_1_pula_1\x27]\x20:\x20[\x272\x27];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20todos=[];\x0afor(const\x20t\x20of\x20tipos){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20r\x20=\x20analisarAutoPadroes(dados,\x20t,\x20tiros,\x20market,\x201,\x2010);\x0ar.forEach(x=>x.tipo_padrao=t);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20todos\x20=\x20todos.concat(r);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20todos.sort((a,b)=>parseFloat(b.percentual)-parseFloat(a.percentual)||b.ocorrencias-a.ocorrencias);\x0areturn\x20{\x20resultados:\x20todos.slice(0,15)\x20};\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20",
    "AIzaSyBrq5Ahf5VPvvQJf5fxoK_3gDyuTG-_Eyc",
    "\x20x\x20",
    "exact4",
    "addEventListener",
    "under2.5",
    "https://betstat.site",
    "under3.5",
    ".btn-grid",
    "btn",
    "liga",
    "top5",
    "\x0a\x0aINFORMAÇÕES\x20PRÉ-PROCESSADAS:\x0a\x0a1.\x20RANKING\x20DE\x20TIMES\x20PARA\x20O\x20MERCADO\x20\x22",
    "keys",
    "252CfUIYt",
    "name",
    "hora",
    "ceil",
    "umGolExato",
    "Estrelabet",
    "active",
    "\x22:\x0a",
    "contains",
    "3751236fIHfwZ",
    "\x0a-\x20Estratégia\x20Martingale:\x20",
    "textContent",
    "Taça\x20Glória\x20Eterna",
    "totalJogos",
    "mercados-group",
    "totalReds",
    "<br><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<strong>Causas\x20possíveis:</strong>\x20Falha\x20na\x20operação.\x0aAtualize\x20a\x20página\x20e\x20tente\x20outra\x20vez\x20mais\x20tarde.\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>",
    "stringify",
    "none",
    "round",
    "-\x20Imagem\x20fornecida:\x20Uma\x20imagem\x20foi\x20enviada\x20para\x20análise\x20adicional.",
    "proximos",
    ".btn.active",
    "exact3",
    "status",
    "Copa\x20América",
    "files",
    "createObjectURL",
    "over1.5",
    "cincoOuMaisGols",
    "over3.5",
    "Erro\x20na\x20API\x20do\x20Gemini:\x20",
    "❌\x20Erro\x20na\x20Análise",
    "createElement",
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    "innerText",
    "all",
    "POST",
    "onload",
    "random",
    "1192648OZQBwu",
    "value",
    "\x0a\x0aINSTRUÇÕES\x20DE\x20ANÁLISE\x20(SUA\x20TAREFA):\x0a1.\x20\x20Sua\x20missão\x20é\x20conectar\x20as\x20informações\x20acima.\x0aNão\x20processe\x20dados\x20brutos,\x20apenas\x20interprete\x20os\x20resultados\x20que\x20eu\x20forneci.\x0a2.\x20\x20Analise\x20os\x20\x22TOP\x2015\x20PADRÕES\x22.\x0aIdentifique\x20quais\x20têm\x20o\x20maior\x20percentual\x20de\x20acerto\x20(percentual)\x20e\x20um\x20número\x20sólido\x20de\x20ocorrências.\x0aPadrões\x20com\x20100%\x20de\x20acerto\x20e\x20poucas\x20ocorrências\x20são\x20promissores,\x20mas\x20de\x20alto\x20risco.\x0a3.\x20\x20Observe\x20os\x20\x22PRÓXIMOS\x206\x20CONFRONTOS\x22.\x20Verifique\x20se\x20algum\x20desses\x20jogos\x20envolve\x20times\x20que\x20estão\x20bem\x20posicionados\x20no\x20\x22RANKING\x20DE\x20TIMES\x22.\x0a4.\x20\x20Cruze\x20as\x20informações:\x20A\x20oportunidade\x20de\x20maior\x20valor\x20acontece\x20quando\x20um\x20padrão\x20forte\x20aponta\x20para\x20um\x20dos\x20próximos\x20confrontos\x20E\x20esse\x20confronto\x20envolve\x20times\x20com\x20bom\x20desempenho\x20histórico\x20no\x20mercado.\x0a5.\x20\x20Se\x20uma\x20imagem\x20foi\x20fornecida,\x20considere\x20que\x20ela\x20pode\x20conter\x20informações\x20visuais\x20complementares\x20(como\x20estatísticas\x20ou\x20gráficos)\x20e\x20mencione\x20que\x20ela\x20foi\x20considerada\x20na\x20análise,\x20mas\x20não\x20tente\x20descrevê-la\x20diretamente.\x0a6.\x20\x20Baseado\x20nesta\x20síntese,\x20gere\x20a\x20sua\x20análise\x20no\x20formato\x20abaixo.\x0aO\x20número\x20de\x20sugestões\x20de\x20horários\x20deve\x20seguir\x20a\x20estratégia\x20Martingale\x20(Nenhum\x20=\x201\x20jogo,\x201\x20Cobertura\x20=\x202\x20jogos,\x202\x20Coberturas\x20=\x203\x20jogos,\x203\x20Coberturas\x20=\x204\x20jogos).\x0a7.\x20\x20Se\x20nenhum\x20padrão\x20forte\x20se\x20alinhar\x20com\x20os\x20próximos\x20jogos\x20de\x20times\x20bem\x20ranqueados,\x20seja\x20honesto\x20e\x20informe\x20que\x20nenhuma\x20oportunidade\x20clara\x20foi\x20encontrada.\x0a8.\x20\x20Para\x20as\x20sugestões\x20de\x20horários:\x20Selecione\x20o\x20próximo\x20confronto\x20que\x20melhor\x20se\x20alinha\x20com\x20padrões\x20fortes\x20e\x20times\x20bem\x20ranqueados\x20como\x20o\x20principal.\x0aEm\x20seguida,\x20adicione\x20as\x20coberturas\x20como\x20os\x20confrontos\x20sequenciais\x20seguintes.\x0aGaranta\x20que\x20os\x20horários\x20estejam\x20em\x20sequência\x20cronológica\x20crescente,\x20sem\x20repetições,\x20e\x20baseados\x20exclusivamente\x20nos\x20horários\x20fornecidos\x20nos\x20próximos\x20confrontos.\x0aAssuma\x20que\x20a\x20lista\x20de\x20próximos\x20está\x20ordenada\x20por\x20tempo,\x20e\x20selecione\x20apenas\x20horários\x20futuros\x20ou\x20os\x20mais\x20próximos.\x0aO\x20primeiro\x20horário\x20é\x20o\x20principal\x20com\x20padrão\x20e\x20análise,\x20os\x20demais\x20são\x20coberturas.\x0a9.\x20\x20Inclua\x20uma\x20seção\x20independente\x20para\x20a\x20Análise\x20de\x20Gráfico\x20de\x20Mercado,\x20comentando\x20a\x20porcentagem\x20atual\x20e\x20destacando\x20as\x20top\x205\x20melhores\x20porcentagens,\x20considerando\x20o\x20Martingale\x20selecionado\x20para\x20a\x20verificação.\x0aFORMATO\x20DA\x20RESPOSTA\x20(Use\x20um\x20tom\x20natural\x20e\x20profissional,\x20evite\x20usar\x20negrito\x20com\x20asteriscos\x20**):\x0a\x0a🎯\x20ANÁLISE\x20ESTATÍSTICA\x0a[Comente\x20brevemente\x20sobre\x20o\x20desempenho\x20dos\x20times\x20no\x20ranking\x20e\x20a\x20força\x20geral\x20dos\x20padrões\x20encontrados.\x0aEx:\x20\x22Observa-se\x20que\x20os\x20times\x20X\x20e\x20Y\x20são\x20dominantes\x20neste\x20mercado.\x20Foram\x20encontrados\x20N\x20padrões\x20com\x20mais\x20de\x2080%\x20de\x20acerto,\x20indicando\x20consistência...\x22]\x0a\x0a📊\x20PADRÕES\x20RELEVANTES\x0a[Destaque\x202\x20ou\x203\x20dos\x20padrões\x20mais\x20promissores\x20da\x20lista,\x20explicando\x20por\x20que\x20são\x20relevantes.\x0aEx:\x20\x22O\x20padrão\x20\x27over2.5\x20|\x201-2\x27\x20se\x20destaca\x20com\x2085%\x20de\x20acerto\x20em\x2020\x20ocorrências,\x20mostrando\x20ser\x20um\x20gatilho\x20confiável...\x22]\x0a\x0a📈\x20ANÁLISE\x20DE\x20GRÁFICO\x20DE\x20MERCADO\x0a[Comente\x20sobre\x20a\x20porcentagem\x20atual\x20do\x20mercado\x20e\x20destaque\x20as\x20top\x205\x20melhores\x20porcentagens,\x20incluindo\x20greenPercentage,\x20occurrences,\x20etc.,\x20considerando\x20o\x20Martingale\x20selecionado\x20para\x20a\x20verificação\x20de\x20linhas.]\x0a\x0a⚡\x20PRÓXIMAS\x20OPORTUNIDADES\x0a[Baseado\x20na\x20sua\x20análise\x20combinada,\x20liste\x20as\x20entradas\x20recomendadas.\x0aSe\x20nenhuma\x20for\x20encontrada,\x20justifique\x20o\x20motivo.\x0aFormato\x20se\x20encontrar:\x0aLiga:\x20[liga]\x0aMercado:\x20[mercado]\x0a⏰\x20Horários\x0a▸\x20[hora:minuto]\x20▸\x20[hora:minuto]\x20...\x20(número\x20baseado\x20na\x20Martingale,\x20em\x20sequência\x20sem\x20repetições)\x0aJustificativa:\x20[Breve\x20explicação\x20do\x20porquê\x20esta\x20é\x20uma\x20boa\x20entrada,\x20mencionando\x20o\x20padrão\x20e\x20os\x20times\x20envolvidos.\x0aNote\x20que\x20o\x20primeiro\x20horário\x20é\x20o\x20principal\x20onde\x20padrões\x20foram\x20encontrados,\x20os\x20demais\x20são\x20coberturas\x20sequenciais.]\x0a\x0a🎲\x20ESTRATÉGIA\x20MARTINGALE\x0a[Avalie\x20a\x20segurança\x20da\x20estratégia\x20para\x20este\x20cenário.\x0aEx:\x20\x22Considerando\x20a\x20força\x20dos\x20padrões\x20encontrados,\x20a\x20estratégia\x20de\x20[N]\x20coberturas\x20parece\x20[segura/arriscada]...\x22]\x0a\x0a💡\x20RECOMENDAÇÃO\x20FINAL\x0a[Dê\x20uma\x20recomendação\x20final\x20clara\x20e\x20objetiva.\x0aEx:\x20\x22Recomendo\x20a\x20entrada\x20nos\x20horários\x20sugeridos\x20devido\x20à\x20forte\x20confluência\x20entre\x20o\x20padrão\x20X\x20e\x20o\x20confronto\x20envolvendo\x20o\x20time\x20Y,\x20que\x20possui\x20um\x20histórico\x20excelente\x20neste\x20mercado.\x22]\x0a",
    "Erro\x20no\x20processo\x20de\x20análise:",
    "144812PMcYSx",
    ".btn-generate",
    "foraVence",
    "<div\x20class=\x22error\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<strong>Erro:</strong>\x20",
    "slice",
    "block",
    "\x20jogos...</div>",
    "Nenhum\x20arquivo\x20selecionado",
    "\x0a-\x20Observações\x20do\x20Usuário:\x20",
    "removeEventListener",
    "Kiron",
    "kiron",
    "reduce",
    "toLowerCase",
    "toFixed",
    "martingale-group",
    "target",
    "add",
    "querySelectorAll",
    "Gerar\x20Análise\x20IA",
    "forEach",
    "readAsDataURL",
    "querySelector",
    "mercado",
    "Copa\x20das\x20Estrelas",
    "isFinite",
    "error",
    "\x0a-\x20Liga:\x20",
    "16446BxsPGi",
    "trim",
    "percentage",
    "getElementById",
    "exact2",
    "ambasSim",
    "tresGolsExatos",
    "Alta\x20chance\x20de\x20acerto",
    "quatroGolsExatos",
    "some",
    "\x0a\x0a2.\x20TOP\x2015\x20PADRÕES\x20ENCONTRADOS\x20PARA\x20O\x20MERCADO\x20\x22",
    "toString",
    "filter",
    "count",
    "Erro\x20ao\x20buscar\x20dados\x20da\x20API:",
    "casa",
    "greens",
    "Betsson",
    "Moderada\x20chance",
    "casas-group",
    "casaVence",
    "reds",
    "betsson",
    "sort",
    "159595GFKdHc",
    "<div\x20class=\x22loading\x22><div\x20class=\x22spinner\x22></div>Coletando\x20",
    "exact1",
    "Italy",
    "dadosCru",
    "click",
    "/proximos/",
    "<div\x20class=\x22spinner\x22></div>\x20Processando...",
    "marketCount",
    "innerHTML",
    "split",
    "ambasNao",
    "path",
    "image-status",
    "Você\x20atingiu\x20o\x20limite\x20de\x206\x20análises\x20por\x20dia.\x20Por\x20favor,\x20volte\x20amanhã.",
    "doisGolsExatos",
    "result-content",
    "Nenhuma",
    "lastAnalysis",
    "Espanha",
    "json",
    "Erro\x20na\x20API\x20Gemini:",
    "217DcOpUO",
    "className",
    "result-title",
    "Spain",
    "padStart",
    "\x0a\x0a4.\x20ANÁLISE\x20DE\x20GRÁFICO\x20DE\x20MERCADO\x20PARA\x20O\x20MERCADO\x20\x22",
    "\x0a\x0a3.\x20PRÓXIMOS\x206\x20CONFRONTOS:\x0a",
    "Nenhum",
    "classList",
    "src",
    "map",
    "?key=",
    "display",
    "image-upload",
    "Brasil",
    "includes",
    "green",
    "140bQoYUA",
    "✓\x20Análise\x20Concluída\x20-\x20",
    "occurrences",
    "push",
    "time_b",
    "date",
    "disabled",
    "Por\x20favor,\x20aguarde\x20",
    "dataset",
    "then",
    "<div\x20class=\x22loading\x22><div\x20class=\x22spinner\x22></div>Analisando\x20padrões...</div>",
    "content",
    "parts",
    "ambasNaoMarcam",
    "ranking",
    "Por\x20favor,\x20selecione\x20Casa,\x20Liga,\x20Mercado\x20e\x20Período\x20de\x20Análise.",
    "getItem",
    "message",
  ];
  _0x30e8 = function () {
    return _0x3e965f;
  };
  return _0x30e8();
}
function analyzeInWorker(_0x8283a1, _0x539b16) {
  return new Promise((_0x5933bd, _0x11b44) => {
    const _0x47e520 = _0x51d1,
      _0x3002de = getAnalyzeWorker(),
      _0x5da50b = Math[_0x47e520(0x243)]()["toString"](0x24)["slice"](0x2),
      _0x5d2f86 = (_0x4837b1) => {
        const _0x4e97e6 = _0x47e520,
          _0x587eff = _0x4837b1[_0x4e97e6(0x204)];
        if (!_0x587eff || _0x587eff["id"] !== _0x5da50b) return;
        _0x3002de[_0x4e97e6(0x251)](_0x4e97e6(0x1f4), _0x5d2f86);
        if (_0x587eff["ok"]) _0x5933bd(_0x587eff[_0x4e97e6(0x20c)]);
        else
          _0x11b44(
            _0x587eff[_0x4e97e6(0x262)] ||
              "Erro\x20no\x20worker\x20de\x20análise"
          );
      };
    _0x3002de["addEventListener"](_0x47e520(0x1f4), _0x5d2f86),
      _0x3002de["postMessage"]({
        cmd: _0x47e520(0x20a),
        id: _0x5da50b,
        payload: { dados: _0x8283a1, ..._0x539b16 },
      });
  });
}
function mapMercado(_0x2de239) {
  const _0x18b40a = _0x865f24,
    _0x5a4ccc = {
      ambasMarcam: "ambasSim",
      ambasNaoMarcam: _0x18b40a(0x1c7),
      casaVence: _0x18b40a(0x278),
      foraVence: _0x18b40a(0x24a),
      empate: "empate",
      "over1.5": _0x18b40a(0x238),
      "over2.5": "over2.5",
      "over3.5": _0x18b40a(0x23a),
      "under1.5": _0x18b40a(0x1f5),
      "under2.5": "under2.5",
      "under3.5": "under3.5",
      exact1: _0x18b40a(0x220),
      exact2: _0x18b40a(0x1cb),
      exact3: _0x18b40a(0x26a),
      exact4: _0x18b40a(0x26c),
      over5: _0x18b40a(0x239),
    };
  return _0x5a4ccc[_0x2de239] || _0x2de239;
}
function checkMarket(_0x139d39, _0x206e2f, _0x3b9e51, _0x595451) {
  const _0x2f0b78 = _0x865f24;
  switch (_0x139d39) {
    case _0x2f0b78(0x269):
      return _0x206e2f > 0x0 && _0x3b9e51 > 0x0 ? 0x1 : 0x0;
    case _0x2f0b78(0x1c7):
      return _0x206e2f === 0x0 || _0x3b9e51 === 0x0 ? 0x1 : 0x0;
    case _0x2f0b78(0x278):
      return _0x206e2f > _0x3b9e51 ? 0x1 : 0x0;
    case "foraVence":
      return _0x3b9e51 > _0x206e2f ? 0x1 : 0x0;
    case _0x2f0b78(0x1f6):
      return _0x206e2f === _0x3b9e51 ? 0x1 : 0x0;
    case _0x2f0b78(0x238):
      return _0x595451 > 1.5 ? 0x1 : 0x0;
    case "over2.5":
      return _0x595451 > 2.5 ? 0x1 : 0x0;
    case "over3.5":
      return _0x595451 > 3.5 ? 0x1 : 0x0;
    case "under1.5":
      return _0x595451 < 1.5 ? 0x1 : 0x0;
    case _0x2f0b78(0x213):
      return _0x595451 < 2.5 ? 0x1 : 0x0;
    case _0x2f0b78(0x215):
      return _0x595451 < 3.5 ? 0x1 : 0x0;
    case _0x2f0b78(0x220):
      return _0x595451 === 0x1 ? 0x1 : 0x0;
    case "doisGolsExatos":
      return _0x595451 === 0x2 ? 0x1 : 0x0;
    case _0x2f0b78(0x26a):
      return _0x595451 === 0x3 ? 0x1 : 0x0;
    case _0x2f0b78(0x26c):
      return _0x595451 === 0x4 ? 0x1 : 0x0;
    case "cincoOuMaisGols":
      return _0x595451 >= 0x5 ? 0x1 : 0x0;
    default:
      return 0x0;
  }
}
function calculateMarketAnalysis(
  _0x149865,
  _0x545e79,
  _0x2e71f5,
  _0x51665e,
  _0x753551
) {
  const _0x12eedd = _0x865f24,
    _0x1ee02b = _0x149865[_0x12eedd(0x280)]
      ["map"]((_0x18bbdb) => [
        _0x18bbdb[0x5][_0x12eedd(0x26f)]()[_0x12eedd(0x1d6)](0x2, "0") +
          ":" +
          _0x18bbdb[0x6]["toString"]()[_0x12eedd(0x1d6)](0x2, "0"),
        _0x18bbdb[0x0],
        _0x18bbdb[0x1],
        _0x18bbdb[0x3],
        _0x18bbdb[0x4],
        _0x18bbdb[0x2],
        _0x149865["liga"][_0x12eedd(0x255)](),
      ])
      [_0x12eedd(0x24c)](-_0x2e71f5);
  if (_0x1ee02b["length"] === 0x0) return { currentPercentage: 0x0, top5: [] };
  const _0x11fdf1 = _0x1ee02b[_0x12eedd(0x24c)](-_0x51665e),
    _0x475b14 = _0x11fdf1[_0x12eedd(0x254)](
      (_0x136936, _0x4a3f15) =>
        _0x136936 +
        checkMarket(_0x545e79, _0x4a3f15[0x1], _0x4a3f15[0x2], _0x4a3f15[0x5]),
      0x0
    ),
    _0x5d23a1 = ((_0x475b14 / _0x51665e) * 0x64)[_0x12eedd(0x256)](0x0),
    _0x854b3b = {};
  _0x1ee02b[_0x12eedd(0x25c)]((_0x1d305a, _0x158fc8) => {
    const _0x2cb5ef = _0x12eedd,
      [
        _0x1a5108,
        _0x3abfc6,
        _0x128cce,
        _0x19eda0,
        _0x4fe659,
        _0x1fbab1,
        _0x542cbf,
      ] = _0x1d305a;
    if (_0x158fc8 >= _0x51665e - 0x1) {
      const _0x4bd4db = _0x1ee02b[_0x2cb5ef(0x24c)](
          _0x158fc8 - _0x51665e + 0x1,
          _0x158fc8 + 0x1
        )[_0x2cb5ef(0x254)](
          (_0x250ee5, _0x5dc0ed) =>
            _0x250ee5 +
            checkMarket(
              _0x545e79,
              _0x5dc0ed[0x1],
              _0x5dc0ed[0x2],
              _0x5dc0ed[0x5]
            ),
          0x0
        ),
        _0x3652df = Math[_0x2cb5ef(0x22f)]((_0x4bd4db / _0x51665e) * 0x64);
      let _0x3291d7 = "red",
        _0x1622ee = 0x0,
        _0x558de0 = 0x0;
      if (_0x158fc8 + _0x753551 <= _0x1ee02b["length"]) {
        const _0x25a2db = _0x1ee02b["slice"](
          _0x158fc8 + 0x1,
          _0x158fc8 + 0x1 + _0x753551
        );
        (_0x1622ee = _0x25a2db[_0x2cb5ef(0x270)](
          (_0x18f35b) =>
            checkMarket(
              _0x545e79,
              _0x18f35b[0x1],
              _0x18f35b[0x2],
              _0x18f35b[0x5]
            ) === 0x1
        )["length"]),
          (_0x558de0 = _0x753551 - _0x1622ee);
        const _0x1b8caa = _0x25a2db[_0x2cb5ef(0x26d)](
          (_0x5d2c1) =>
            checkMarket(
              _0x545e79,
              _0x5d2c1[0x1],
              _0x5d2c1[0x2],
              _0x5d2c1[0x5]
            ) === 0x1
        );
        _0x1b8caa && (_0x3291d7 = _0x2cb5ef(0x1e2));
      }
      const _0x531b7b = _0x545e79 + "\x20" + _0x3652df + "%";
      !_0x854b3b[_0x531b7b] &&
        (_0x854b3b[_0x531b7b] = {
          occurrences: 0x0,
          greens: 0x0,
          reds: 0x0,
          totalGreens: _0x1622ee,
          totalReds: _0x558de0,
        }),
        (_0x854b3b[_0x531b7b][_0x2cb5ef(0x1e5)] += 0x1),
        _0x3291d7 === _0x2cb5ef(0x1e2)
          ? (_0x854b3b[_0x531b7b][_0x2cb5ef(0x274)] += 0x1)
          : (_0x854b3b[_0x531b7b]["reds"] += 0x1),
        (_0x854b3b[_0x531b7b]["totalGreens"] = _0x1622ee),
        (_0x854b3b[_0x531b7b][_0x2cb5ef(0x22b)] = _0x558de0);
    }
  });
  const _0x2e2de3 = Object[_0x12eedd(0x21b)](_0x854b3b)
      [_0x12eedd(0x1dc)]((_0x245314) => {
        const _0x3a78d9 = _0x12eedd,
          _0x4e4088 = _0x854b3b[_0x245314],
          _0x3dd90d = ((_0x4e4088[_0x3a78d9(0x274)] /
            _0x4e4088[_0x3a78d9(0x1e5)]) *
            0x64)[_0x3a78d9(0x256)](0x2);
        let _0xad10bf = "";
        const _0x4ef25a = parseFloat(_0x3dd90d);
        if (_0x4ef25a > 0x4b) _0xad10bf = _0x3a78d9(0x26b);
        else {
          if (_0x4ef25a > 0x32) _0xad10bf = _0x3a78d9(0x276);
          else
            _0x4ef25a > 0x19
              ? (_0xad10bf = "Risco\x20elevado")
              : (_0xad10bf = _0x3a78d9(0x209));
        }
        return {
          marketGroup: _0x245314,
          marketPercentage: parseFloat(_0x245314["split"]("\x20")[0x1]),
          occurrences: _0x4e4088[_0x3a78d9(0x1e5)],
          greens: _0x4e4088[_0x3a78d9(0x274)],
          reds: _0x4e4088[_0x3a78d9(0x279)],
          greenPercentage: _0x3dd90d,
          totalGreens: _0x4e4088["totalGreens"],
          totalReds: _0x4e4088[_0x3a78d9(0x22b)],
          analysis: _0xad10bf,
        };
      })
      [_0x12eedd(0x27b)](
        (_0x172a2c, _0x906f5f) =>
          _0x906f5f["greenPercentage"] - _0x172a2c["greenPercentage"] ||
          _0x906f5f[_0x12eedd(0x274)] - _0x172a2c[_0x12eedd(0x274)]
      )
      [_0x12eedd(0x24c)](0x0, 0x64),
    _0x3353b7 = _0x2e2de3["slice"](0x0, 0x5);
  return { currentPercentage: _0x5d23a1, top5: _0x3353b7 };
}
function criarPromptAnalise(_0x2e6711, _0x2ed5b2) {
  const _0x556ca2 = _0x865f24;
  return (
    "\x0aVocê\x20é\x20um\x20analista\x20especialista\x20em\x20futebol\x20virtual,\x20focado\x20em\x20interpretar\x20dados\x20pré-processados\x20para\x20identificar\x20oportunidades\x20de\x20investimento\x20de\x20alto\x20valor.\x0aDADOS\x20PARA\x20ANÁLISE:\x0a-\x20Casa:\x20" +
    _0x2e6711[_0x556ca2(0x273)] +
    _0x556ca2(0x263) +
    _0x2e6711[_0x556ca2(0x218)] +
    "\x0a-\x20Mercado:\x20" +
    _0x2ed5b2[_0x556ca2(0x25f)] +
    _0x556ca2(0x208) +
    _0x2e6711[_0x556ca2(0x229)] +
    _0x556ca2(0x226) +
    _0x2ed5b2["martingale"] +
    _0x556ca2(0x250) +
    (_0x2ed5b2[_0x556ca2(0x1fb)] || _0x556ca2(0x1cd)) +
    "\x0a" +
    (_0x2ed5b2["imagem"] ? _0x556ca2(0x230) : "") +
    _0x556ca2(0x21a) +
    _0x2ed5b2[_0x556ca2(0x25f)] +
    "\x22\x20(Top\x2010):\x0a" +
    JSON[_0x556ca2(0x22d)](
      _0x2e6711["ranking"][_0x556ca2(0x24c)](0x0, 0xa),
      null,
      0x2
    ) +
    _0x556ca2(0x26e) +
    _0x2ed5b2[_0x556ca2(0x25f)] +
    _0x556ca2(0x223) +
    JSON[_0x556ca2(0x22d)](_0x2e6711[_0x556ca2(0x207)], null, 0x2) +
    _0x556ca2(0x1d8) +
    JSON[_0x556ca2(0x22d)](_0x2e6711[_0x556ca2(0x231)], null, 0x2) +
    _0x556ca2(0x1d7) +
    _0x2ed5b2["mercado"] +
    "\x22:\x0aPorcentagem\x20Atual:\x20" +
    _0x2e6711["marketAnalysis"]["currentPercentage"] +
    "%\x0aTop\x205\x20Melhores\x20Porcentagens:\x0a" +
    JSON[_0x556ca2(0x22d)](
      _0x2e6711[_0x556ca2(0x1fe)][_0x556ca2(0x219)],
      null,
      0x2
    ) +
    _0x556ca2(0x246)
  );
}
async function analisarComGemini(_0x2e563d, _0x1ff0bc) {
  const _0x4af99b = _0x865f24,
    _0x5e44f0 = criarPromptAnalise(_0x2e563d, _0x1ff0bc),
    _0x437b2e = await fetch(GEMINI_URL + _0x4af99b(0x1dd) + GEMINI_API_KEY, {
      method: _0x4af99b(0x241),
      headers: { "Content-Type": "application/json" },
      body: JSON[_0x4af99b(0x22d)]({
        contents: [{ parts: [{ text: _0x5e44f0 }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 0x28,
          topP: 0.95,
          maxOutputTokens: 0x800,
        },
      }),
    });
  if (!_0x437b2e["ok"]) {
    const _0x263dd0 = await _0x437b2e[_0x4af99b(0x1d0)]();
    console[_0x4af99b(0x262)](_0x4af99b(0x1d1), _0x263dd0);
    throw new Error(_0x4af99b(0x23b) + _0x437b2e[_0x4af99b(0x234)]);
  }
  const _0x4738cc = await _0x437b2e[_0x4af99b(0x1d0)]();
  return _0x4738cc["candidates"][0x0][_0x4af99b(0x1ee)][_0x4af99b(0x1ef)][0x0][
    "text"
  ];
}
async function gerarAnalise() {
  const _0x393218 = _0x865f24,
    _0x4b3cfe = 0x6,
    _0x4f2c6d = 0x3,
    _0x94b3ad = new Date(),
    _0x38cf3b = _0x94b3ad["toISOString"]()["split"]("T")[0x0];
  let _0x32d6c7 =
    JSON["parse"](localStorage[_0x393218(0x1f3)](_0x393218(0x206))) || {};
  _0x32d6c7[_0x393218(0x1e8)] !== _0x38cf3b &&
    (_0x32d6c7 = { date: _0x38cf3b, count: 0x0, lastAnalysis: null });
  if (_0x32d6c7[_0x393218(0x271)] >= _0x4b3cfe) {
    alert(_0x393218(0x1ca));
    return;
  }
  if (_0x32d6c7[_0x393218(0x1ce)]) {
    const _0x25c7b0 = new Date(_0x32d6c7[_0x393218(0x1ce)]),
      _0x145087 = (_0x94b3ad - _0x25c7b0) / (0x3e8 * 0x3c);
    if (_0x145087 < _0x4f2c6d) {
      const _0x5167c1 = Math[_0x393218(0x21f)](_0x4f2c6d - _0x145087);
      alert(
        _0x393218(0x1ea) +
          _0x5167c1 +
          "\x20minuto(s)\x20antes\x20de\x20gerar\x20uma\x20nova\x20análise."
      );
      return;
    }
  }
  const _0x127eb6 = getSelectedValue(_0x393218(0x277)),
    _0x1ec7d9 = getSelectedValue(_0x393218(0x1f9)),
    _0xe8f20f = getSelectedValue(_0x393218(0x22a)),
    _0x3e8078 = getSelectedText(_0x393218(0x22a)),
    _0x7ba5fe = parseInt(getSelectedValue(_0x393218(0x257)) || "0", 0xa),
    _0x5c2887 = getSelectedText(_0x393218(0x257)),
    _0x43f222 = getSelectedValue("periodo-group"),
    _0xecf544 = document[_0x393218(0x267)](_0x393218(0x1fb))[_0x393218(0x245)],
    _0x5c9c77 = document[_0x393218(0x267)](_0x393218(0x1df))[
      _0x393218(0x236)
    ][0x0];
  if (!_0x127eb6 || !_0x1ec7d9 || !_0xe8f20f || !_0x43f222) {
    alert(_0x393218(0x1f2));
    return;
  }
  const _0x21f3c7 = document[_0x393218(0x25e)](_0x393218(0x249)),
    _0x4b3e47 = document[_0x393218(0x267)]("result-container"),
    _0x2c0c56 = document[_0x393218(0x267)](_0x393218(0x1d4)),
    _0x597d86 = document["getElementById"](_0x393218(0x1cc));
  (_0x21f3c7["disabled"] = !![]),
    (_0x21f3c7["innerHTML"] = _0x393218(0x283)),
    (_0x4b3e47[_0x393218(0x1ff)][_0x393218(0x1de)] = _0x393218(0x24d)),
    (_0x597d86[_0x393218(0x285)] = "");
  try {
    _0x2c0c56[_0x393218(0x285)] =
      _0x393218(0x27d) + _0x43f222 + _0x393218(0x24e);
    const _0x55a231 = await buscarDadosAPI(
      _0x127eb6,
      _0x1ec7d9,
      parseInt(_0x43f222)
    );
    (_0x55a231[_0x393218(0x1f1)] = calcularRankingTimes(
      _0x55a231[_0x393218(0x280)][_0x393218(0x1dc)]((_0x4e6a78) => ({
        time_a: _0x4e6a78[0x3],
        time_b: _0x4e6a78[0x4],
        ft: _0x4e6a78[0x0] + "\x20x\x20" + _0x4e6a78[0x1],
      })),
      _0xe8f20f
    )),
      (_0x2c0c56[_0x393218(0x285)] = _0x393218(0x1ed));
    const _0x47d8da = _0x7ba5fe + 0x1,
      { resultados: _0x4d2769 } = await analyzeInWorker(
        _0x55a231[_0x393218(0x280)],
        { tiros: _0x47d8da, market: _0xe8f20f, combinado: !![] }
      );
    _0x55a231[_0x393218(0x207)] = _0x4d2769;
    const _0x47b8ad = mapMercado(_0xe8f20f),
      _0x56ab5a = _0x127eb6 === _0x393218(0x253) ? 0x1e : 0x14,
      _0x2784b7 = _0x7ba5fe + 0x1;
    (_0x55a231[_0x393218(0x1fe)] = calculateMarketAnalysis(
      _0x55a231,
      _0x47b8ad,
      _0x55a231[_0x393218(0x229)],
      _0x56ab5a,
      _0x2784b7
    )),
      (_0x2c0c56[_0x393218(0x285)] = _0x393218(0x201));
    const _0x2cf45c = {
        mercado: _0x3e8078,
        liga: _0x1ec7d9,
        martingale: _0x5c2887 || _0x393218(0x1d9),
        periodo: _0x43f222 + _0x393218(0x1fa),
        observacao: _0xecf544,
        imagem: _0x5c9c77 ? !![] : ![],
      },
      _0x2b5c46 = await analisarComGemini(_0x55a231, _0x2cf45c);
    (_0x2c0c56["innerHTML"] =
      _0x393218(0x1e4) +
      casasConfig[_0x127eb6][_0x393218(0x21d)] +
      "\x20(" +
      _0x1ec7d9 +
      ")"),
      (_0x597d86[_0x393218(0x227)] = _0x2b5c46),
      _0x32d6c7[_0x393218(0x271)]++,
      (_0x32d6c7[_0x393218(0x1ce)] = _0x94b3ad["toISOString"]()),
      localStorage["setItem"](
        _0x393218(0x206),
        JSON[_0x393218(0x22d)](_0x32d6c7)
      );
  } catch (_0x7a9eac) {
    console[_0x393218(0x262)](_0x393218(0x247), _0x7a9eac),
      (_0x2c0c56[_0x393218(0x285)] = _0x393218(0x23c)),
      (_0x597d86[_0x393218(0x285)] =
        _0x393218(0x24b) + _0x7a9eac["message"] + _0x393218(0x22c));
  } finally {
    (_0x21f3c7[_0x393218(0x1e9)] = ![]),
      (_0x21f3c7[_0x393218(0x285)] = _0x393218(0x25b));
  }
}
document[_0x865f24(0x267)](_0x865f24(0x1df))[_0x865f24(0x212)](
  _0x865f24(0x1fc),
  function (_0x5193f7) {
    const _0x22e37a = _0x865f24,
      _0x52e2b3 = _0x5193f7["target"][_0x22e37a(0x236)][0x0],
      _0xbf1842 = document["getElementById"](_0x22e37a(0x205)),
      _0x3f9a9e = document["getElementById"](_0x22e37a(0x1c9));
    if (_0x52e2b3) {
      const _0x35e692 = new FileReader();
      (_0x35e692[_0x22e37a(0x242)] = function (_0xd1813d) {
        const _0x13329a = _0x22e37a;
        (_0xbf1842[_0x13329a(0x1db)] = _0xd1813d["target"][_0x13329a(0x20c)]),
          (_0xbf1842[_0x13329a(0x1ff)]["display"] = "block");
      }),
        _0x35e692[_0x22e37a(0x25d)](_0x52e2b3),
        (_0x3f9a9e[_0x22e37a(0x227)] = _0x52e2b3[_0x22e37a(0x21d)]);
    } else
      (_0xbf1842[_0x22e37a(0x1ff)][_0x22e37a(0x1de)] = _0x22e37a(0x22e)),
        (_0x3f9a9e["textContent"] = _0x22e37a(0x24f));
  }
);
