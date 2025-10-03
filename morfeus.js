const _0x2fd3f4 = _0xc052;
(function (_0x156708, _0x51b6a7) {
  const _0x44fa29 = _0xc052,
    _0x5c4efa = _0x156708();
  while (!![]) {
    try {
      const _0x2d7a11 =
        parseInt(_0x44fa29(0x26d)) / 0x1 +
        (-parseInt(_0x44fa29(0x263)) / 0x2) *
          (-parseInt(_0x44fa29(0x1df)) / 0x3) +
        -parseInt(_0x44fa29(0x1bf)) / 0x4 +
        parseInt(_0x44fa29(0x20f)) / 0x5 +
        -parseInt(_0x44fa29(0x1cc)) / 0x6 +
        (parseInt(_0x44fa29(0x21f)) / 0x7) *
          (-parseInt(_0x44fa29(0x251)) / 0x8) +
        (-parseInt(_0x44fa29(0x24d)) / 0x9) *
          (-parseInt(_0x44fa29(0x25a)) / 0xa);
      if (_0x2d7a11 === _0x51b6a7) break;
      else _0x5c4efa["push"](_0x5c4efa["shift"]());
    } catch (_0x1dfbe7) {
      _0x5c4efa["push"](_0x5c4efa["shift"]());
    }
  }
})(_0x23d7, 0x95429);
const GEMINI_API_KEY = "AIzaSyAwrtYzlQxzMfBHK3k6sw5qAWTS7jBSSNQ",
  GEMINI_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
  casasConfig = {
    betano: {
      name: "Betano",
      ligas: [
        _0x2fd3f4(0x1f8),
        _0x2fd3f4(0x1f4),
        _0x2fd3f4(0x243),
        _0x2fd3f4(0x240),
        _0x2fd3f4(0x1fa),
        _0x2fd3f4(0x203),
      ],
    },
    kiron: {
      name: _0x2fd3f4(0x1e6),
      ligas: [_0x2fd3f4(0x1c9), _0x2fd3f4(0x1eb), _0x2fd3f4(0x23c)],
      path: "kiron",
    },
    estrela: { name: "Estrelabet", ligas: ["estrela"], path: _0x2fd3f4(0x273) },
    betsson: {
      name: _0x2fd3f4(0x1c6),
      ligas: [_0x2fd3f4(0x1ee), _0x2fd3f4(0x211), _0x2fd3f4(0x1d2)],
      path: "betsson",
    },
  };
document["querySelectorAll"](_0x2fd3f4(0x246))[_0x2fd3f4(0x1cb)](
  (_0x3ad282) => {
    const _0x241461 = _0x2fd3f4;
    _0x3ad282[_0x241461(0x23a)](_0x241461(0x1e2), (_0x9aac6) => {
      const _0x4cc104 = _0x241461;
      if (
        _0x9aac6["target"][_0x4cc104(0x277)][_0x4cc104(0x209)](_0x4cc104(0x1b7))
      ) {
        const _0x435542 = _0x3ad282[_0x4cc104(0x1f6)](_0x4cc104(0x1c2));
        _0x435542 &&
          _0x435542[_0x4cc104(0x277)][_0x4cc104(0x1ff)](_0x4cc104(0x21c)),
          _0x9aac6[_0x4cc104(0x1ef)]["classList"]["add"](_0x4cc104(0x21c)),
          _0x3ad282["id"] === _0x4cc104(0x271) &&
            mostrarLigas(_0x9aac6[_0x4cc104(0x1ef)][_0x4cc104(0x22b)]["value"]);
      }
    });
  }
);
function mostrarLigas(_0x57123d) {
  const _0x229a33 = _0x2fd3f4,
    _0x3caa89 = document[_0x229a33(0x276)]("liga-section"),
    _0x217b62 = document["getElementById"](_0x229a33(0x262));
  if (!casasConfig[_0x57123d]) {
    _0x3caa89[_0x229a33(0x1da)][_0x229a33(0x275)] = _0x229a33(0x26a);
    return;
  }
  (_0x217b62["innerHTML"] = ""),
    casasConfig[_0x57123d][_0x229a33(0x252)][_0x229a33(0x1cb)]((_0x13efed) => {
      const _0x5e827e = _0x229a33,
        _0x53403f = document[_0x5e827e(0x20d)]("button");
      (_0x53403f[_0x5e827e(0x269)] = _0x5e827e(0x1b7)),
        (_0x53403f[_0x5e827e(0x22b)][_0x5e827e(0x218)] = _0x13efed),
        (_0x53403f[_0x5e827e(0x20e)] = _0x13efed),
        _0x217b62[_0x5e827e(0x1cd)](_0x53403f);
    }),
    (_0x3caa89[_0x229a33(0x1da)][_0x229a33(0x275)] = _0x229a33(0x1b8));
}
function getSelectedValue(_0x495a63) {
  const _0x289e93 = _0x2fd3f4,
    _0x388180 = document[_0x289e93(0x276)](_0x495a63),
    _0x2971ae = _0x388180[_0x289e93(0x1f6)](_0x289e93(0x1c2));
  return _0x2971ae ? _0x2971ae[_0x289e93(0x22b)]["value"] : null;
}
function getSelectedText(_0x5494c9) {
  const _0x341f50 = _0x2fd3f4,
    _0x166a5a = document[_0x341f50(0x276)](_0x5494c9),
    _0x5c863c = _0x166a5a[_0x341f50(0x1f6)](_0x341f50(0x1c2));
  return _0x5c863c ? _0x5c863c[_0x341f50(0x21a)] : null;
}
function limparAnalise() {
  const _0x306bdb = _0x2fd3f4;
  document[_0x306bdb(0x1cf)](_0x306bdb(0x1c2))["forEach"]((_0x27f796) =>
    _0x27f796[_0x306bdb(0x277)]["remove"](_0x306bdb(0x21c))
  ),
    (document["getElementById"](_0x306bdb(0x1f5))[_0x306bdb(0x218)] = ""),
    (document[_0x306bdb(0x276)](_0x306bdb(0x1dd))[_0x306bdb(0x218)] = ""),
    (document[_0x306bdb(0x276)](_0x306bdb(0x20c))[_0x306bdb(0x20e)] =
      _0x306bdb(0x221)),
    (document[_0x306bdb(0x276)](_0x306bdb(0x247))["style"]["display"] = "none"),
    (document[_0x306bdb(0x276)](_0x306bdb(0x1b9))[_0x306bdb(0x1da)][
      _0x306bdb(0x275)
    ] = _0x306bdb(0x26a)),
    (document[_0x306bdb(0x276)]("liga-section")[_0x306bdb(0x1da)]["display"] =
      _0x306bdb(0x26a));
}
function calcularRankingTimes(_0x7c2379, _0x222430) {
  const _0x44ae3d = _0x2fd3f4,
    _0x39c507 = {};
  _0x7c2379[_0x44ae3d(0x1cb)]((_0x4dceb8) => {
    const _0x42ad9a = _0x44ae3d,
      { time_a: _0x365d33, time_b: _0x4e543b, ft: _0x5edafb } = _0x4dceb8;
    if (!_0x5edafb || !_0x5edafb[_0x42ad9a(0x249)](_0x42ad9a(0x213))) return;
    const [_0x135c93, _0x50f183] = _0x5edafb[_0x42ad9a(0x26e)](
        _0x42ad9a(0x213)
      )[_0x42ad9a(0x1c0)](Number),
      _0x3feabb = _0x135c93 + _0x50f183;
    [_0x365d33, _0x4e543b]["forEach"]((_0x5c5aa5) => {
      !_0x39c507[_0x5c5aa5] &&
        (_0x39c507[_0x5c5aa5] = {
          name: _0x5c5aa5,
          totalGames: 0x0,
          marketCount: 0x0,
        });
    }),
      _0x39c507[_0x365d33][_0x42ad9a(0x265)]++,
      _0x39c507[_0x4e543b][_0x42ad9a(0x265)]++;
    let _0x70951c = ![];
    switch (_0x222430) {
      case _0x42ad9a(0x23b):
        _0x70951c = _0x135c93 > 0x0 && _0x50f183 > 0x0;
        break;
      case _0x42ad9a(0x208):
        _0x70951c = _0x135c93 === 0x0 || _0x50f183 === 0x0;
        break;
      case _0x42ad9a(0x23f):
        _0x70951c = _0x135c93 === _0x50f183;
        break;
      case "over1.5":
        _0x70951c = _0x3feabb > 0x1;
        break;
      case _0x42ad9a(0x214):
        _0x70951c = _0x3feabb < 0x2;
        break;
      case "over2.5":
        _0x70951c = _0x3feabb > 0x2;
        break;
      case _0x42ad9a(0x215):
        _0x70951c = _0x3feabb < 0x3;
        break;
      case _0x42ad9a(0x200):
        _0x70951c = _0x3feabb > 0x3;
        break;
      case _0x42ad9a(0x250):
        _0x70951c = _0x3feabb < 0x4;
        break;
      case "over5":
        _0x70951c = _0x3feabb >= 0x5;
        break;
      case _0x42ad9a(0x25d):
        _0x70951c = _0x3feabb === 0x1;
        break;
      case _0x42ad9a(0x1e1):
        _0x70951c = _0x3feabb === 0x2;
        break;
      case "exact3":
        _0x70951c = _0x3feabb === 0x3;
        break;
      case _0x42ad9a(0x21e):
        _0x70951c = _0x3feabb === 0x4;
        break;
    }
    _0x70951c &&
      (_0x39c507[_0x365d33]["marketCount"]++,
      _0x39c507[_0x4e543b]["marketCount"]++);
    if (_0x222430 === "casaVence" && _0x135c93 > _0x50f183)
      _0x39c507[_0x365d33]["marketCount"]++;
    if (_0x222430 === _0x42ad9a(0x1d4) && _0x50f183 > _0x135c93)
      _0x39c507[_0x4e543b]["marketCount"]++;
  });
  const _0x1626ca = Object[_0x44ae3d(0x258)](_0x39c507)[_0x44ae3d(0x1c0)](
    (_0x1e5cd2) => ({
      ..._0x1e5cd2,
      percentage:
        _0x1e5cd2[_0x44ae3d(0x265)] > 0x0
          ? ((_0x1e5cd2[_0x44ae3d(0x219)] / _0x1e5cd2[_0x44ae3d(0x265)]) *
              0x64)[_0x44ae3d(0x21d)](0x1)
          : _0x44ae3d(0x1e0),
    })
  );
  return (
    _0x1626ca[_0x44ae3d(0x25f)](
      (_0x524009, _0x23de6d) =>
        _0x23de6d[_0x44ae3d(0x219)] - _0x524009[_0x44ae3d(0x219)] ||
        parseFloat(_0x23de6d[_0x44ae3d(0x228)]) -
          parseFloat(_0x524009[_0x44ae3d(0x228)])
    ),
    _0x1626ca
  );
}
async function buscarDadosAPI(_0x5b376f, _0x36dbe6, _0x1038ec) {
  const _0x4692eb = _0x2fd3f4,
    _0x5404dd = casasConfig[_0x5b376f];
  if (!_0x5404dd)
    throw new Error(_0x4692eb(0x268) + _0x5b376f + _0x4692eb(0x1c1));
  const _0x4746d8 = {
    casa: _0x5404dd[_0x4692eb(0x1f3)],
    liga: _0x36dbe6,
    totalJogos: 0x0,
    dadosCru: [],
  };
  try {
    const _0x3f9391 = encodeURIComponent(_0x36dbe6),
      _0x53403e = _0x4692eb(0x1d3);
    let _0x105a12, _0x12ce31;
    _0x5404dd[_0x4692eb(0x22e)]
      ? ((_0x105a12 =
          _0x53403e +
          _0x4692eb(0x1bc) +
          _0x5404dd[_0x4692eb(0x22e)] +
          "/" +
          _0x3f9391),
        (_0x12ce31 =
          _0x53403e +
          _0x4692eb(0x1e4) +
          _0x5404dd[_0x4692eb(0x22e)] +
          "/" +
          _0x3f9391))
      : ((_0x105a12 = _0x53403e + _0x4692eb(0x1bc) + _0x3f9391),
        (_0x12ce31 = _0x53403e + _0x4692eb(0x1e4) + _0x3f9391));
    const [_0x5186b5, _0x4810d6] = await Promise[_0x4692eb(0x25c)]([
        fetch(_0x105a12)[_0x4692eb(0x234)]((_0x3edd2a) => _0x3edd2a["json"]()),
        fetch(_0x12ce31)["then"]((_0x478bc6) => _0x478bc6[_0x4692eb(0x20a)]()),
      ]),
      _0x1ffd61 = _0x5186b5["slice"](-_0x1038ec);
    for (const _0xf3aecc of _0x1ffd61) {
      const _0x3be7ed = (_0xf3aecc["ft"] || "x")
          [_0x4692eb(0x26e)]("x")
          [_0x4692eb(0x1c0)]((_0x193010) =>
            parseInt(_0x193010[_0x4692eb(0x244)](), 0xa)
          ),
        _0x5a2103 = _0x3be7ed[0x0],
        _0x39f419 = _0x3be7ed[0x1];
      Number["isFinite"](_0x5a2103) &&
        Number[_0x4692eb(0x22c)](_0x39f419) &&
        _0x4746d8[_0x4692eb(0x1d8)]["push"]([
          _0x5a2103,
          _0x39f419,
          _0x5a2103 + _0x39f419,
          (_0xf3aecc[_0x4692eb(0x24c)] || "")[_0x4692eb(0x244)](),
          (_0xf3aecc[_0x4692eb(0x1fb)] || "")["trim"](),
          _0xf3aecc[_0x4692eb(0x241)],
          _0xf3aecc[_0x4692eb(0x1d1)],
        ]);
    }
    return (
      (_0x4746d8[_0x4692eb(0x264)] = _0x4810d6[_0x4692eb(0x1f1)](0x0, 0x6)),
      (_0x4746d8["totalJogos"] = _0x4746d8[_0x4692eb(0x1d8)][_0x4692eb(0x22f)]),
      _0x4746d8
    );
  } catch (_0x46c156) {
    console[_0x4692eb(0x226)](
      "Erro\x20ao\x20buscar\x20dados\x20da\x20API:",
      _0x46c156
    );
    throw new Error(_0x4692eb(0x1de) + _0x46c156["message"]);
  }
}
const ANALYZE_WORKER_SRC = _0x2fd3f4(0x207);
let ANALYZE_WORKER = null;
function getAnalyzeWorker() {
  const _0x524640 = _0x2fd3f4;
  if (!ANALYZE_WORKER) {
    const _0x10516c = new Blob([ANALYZE_WORKER_SRC], {
      type: "application/javascript",
    });
    ANALYZE_WORKER = new Worker(URL[_0x524640(0x233)](_0x10516c));
  }
  return ANALYZE_WORKER;
}
function analyzeInWorker(_0x2b4745, _0x149996) {
  return new Promise((_0x3f2dd7, _0x4ba04b) => {
    const _0x5cf8b3 = _0xc052,
      _0x4227d3 = getAnalyzeWorker(),
      _0x1fd3ac = Math[_0x5cf8b3(0x212)]()
        [_0x5cf8b3(0x26f)](0x24)
        ["slice"](0x2),
      _0x1c00df = (_0x53f068) => {
        const _0x5e45a0 = _0x5cf8b3,
          _0x1e325b = _0x53f068["data"];
        if (!_0x1e325b || _0x1e325b["id"] !== _0x1fd3ac) return;
        _0x4227d3[_0x5e45a0(0x261)](_0x5e45a0(0x216), _0x1c00df);
        if (_0x1e325b["ok"]) _0x3f2dd7(_0x1e325b[_0x5e45a0(0x237)]);
        else _0x4ba04b(_0x1e325b[_0x5e45a0(0x226)] || _0x5e45a0(0x1f0));
      };
    _0x4227d3[_0x5cf8b3(0x23a)](_0x5cf8b3(0x216), _0x1c00df),
      _0x4227d3[_0x5cf8b3(0x20b)]({
        cmd: _0x5cf8b3(0x22a),
        id: _0x1fd3ac,
        payload: { dados: _0x2b4745, ..._0x149996 },
      });
  });
}
function mapMercado(_0x3284da) {
  const _0x1d9c3e = _0x2fd3f4,
    _0x186ab2 = {
      ambasMarcam: _0x1d9c3e(0x253),
      ambasNaoMarcam: _0x1d9c3e(0x25b),
      casaVence: _0x1d9c3e(0x22d),
      foraVence: _0x1d9c3e(0x1d4),
      empate: _0x1d9c3e(0x23f),
      "over1.5": _0x1d9c3e(0x24e),
      "over2.5": "over2.5",
      "over3.5": "over3.5",
      "under1.5": _0x1d9c3e(0x214),
      "under2.5": _0x1d9c3e(0x215),
      "under3.5": "under3.5",
      exact1: _0x1d9c3e(0x222),
      exact2: _0x1d9c3e(0x1f2),
      exact3: "tresGolsExatos",
      exact4: "quatroGolsExatos",
      over5: _0x1d9c3e(0x210),
    };
  return _0x186ab2[_0x3284da] || _0x3284da;
}
function checkMarket(_0x153384, _0x390c5a, _0x3593df, _0x542e6c) {
  const _0x469498 = _0x2fd3f4;
  switch (_0x153384) {
    case _0x469498(0x253):
      return _0x390c5a > 0x0 && _0x3593df > 0x0 ? 0x1 : 0x0;
    case _0x469498(0x25b):
      return _0x390c5a === 0x0 || _0x3593df === 0x0 ? 0x1 : 0x0;
    case _0x469498(0x22d):
      return _0x390c5a > _0x3593df ? 0x1 : 0x0;
    case _0x469498(0x1d4):
      return _0x3593df > _0x390c5a ? 0x1 : 0x0;
    case _0x469498(0x23f):
      return _0x390c5a === _0x3593df ? 0x1 : 0x0;
    case "over1.5":
      return _0x542e6c > 1.5 ? 0x1 : 0x0;
    case _0x469498(0x1fe):
      return _0x542e6c > 2.5 ? 0x1 : 0x0;
    case _0x469498(0x200):
      return _0x542e6c > 3.5 ? 0x1 : 0x0;
    case _0x469498(0x214):
      return _0x542e6c < 1.5 ? 0x1 : 0x0;
    case _0x469498(0x215):
      return _0x542e6c < 2.5 ? 0x1 : 0x0;
    case _0x469498(0x250):
      return _0x542e6c < 3.5 ? 0x1 : 0x0;
    case _0x469498(0x222):
      return _0x542e6c === 0x1 ? 0x1 : 0x0;
    case _0x469498(0x1f2):
      return _0x542e6c === 0x2 ? 0x1 : 0x0;
    case _0x469498(0x248):
      return _0x542e6c === 0x3 ? 0x1 : 0x0;
    case _0x469498(0x270):
      return _0x542e6c === 0x4 ? 0x1 : 0x0;
    case _0x469498(0x210):
      return _0x542e6c >= 0x5 ? 0x1 : 0x0;
    default:
      return 0x0;
  }
}
function _0xc052(_0x58749d, _0x45770a) {
  const _0x23d7a9 = _0x23d7();
  return (
    (_0xc052 = function (_0xc052c, _0x63ae12) {
      _0xc052c = _0xc052c - 0x1b7;
      let _0x5a3390 = _0x23d7a9[_0xc052c];
      return _0x5a3390;
    }),
    _0xc052(_0x58749d, _0x45770a)
  );
}
function calculateMarketAnalysis(
  _0x3d7c12,
  _0x2fdf87,
  _0x1eb513,
  _0x3cb553,
  _0x11da68
) {
  const _0x52f5bb = _0x2fd3f4,
    _0xc7015f = _0x3d7c12["dadosCru"]
      ["map"]((_0x843ac8) => [
        _0x843ac8[0x5][_0x52f5bb(0x26f)]()["padStart"](0x2, "0") +
          ":" +
          _0x843ac8[0x6][_0x52f5bb(0x26f)]()[_0x52f5bb(0x227)](0x2, "0"),
        _0x843ac8[0x0],
        _0x843ac8[0x1],
        _0x843ac8[0x3],
        _0x843ac8[0x4],
        _0x843ac8[0x2],
        _0x3d7c12[_0x52f5bb(0x255)]["toLowerCase"](),
      ])
      [_0x52f5bb(0x1f1)](-_0x1eb513);
  if (_0xc7015f[_0x52f5bb(0x22f)] === 0x0)
    return { currentPercentage: 0x0, top5: [] };
  const _0x33d919 = _0xc7015f[_0x52f5bb(0x1f1)](-_0x3cb553),
    _0x4d31b8 = _0x33d919[_0x52f5bb(0x220)](
      (_0x401d0a, _0x4655f1) =>
        _0x401d0a +
        checkMarket(_0x2fdf87, _0x4655f1[0x1], _0x4655f1[0x2], _0x4655f1[0x5]),
      0x0
    ),
    _0x3233f5 = ((_0x4d31b8 / _0x3cb553) * 0x64)[_0x52f5bb(0x21d)](0x0),
    _0x30d894 = {};
  _0xc7015f[_0x52f5bb(0x1cb)]((_0x55c4bc, _0x284533) => {
    const _0x252262 = _0x52f5bb,
      [
        _0x1fc405,
        _0x3de045,
        _0x4fd679,
        _0x59f617,
        _0x4fb467,
        _0x3d7ee9,
        _0xa20379,
      ] = _0x55c4bc;
    if (_0x284533 >= _0x3cb553 - 0x1) {
      const _0x3b35cd = _0xc7015f[_0x252262(0x1f1)](
          _0x284533 - _0x3cb553 + 0x1,
          _0x284533 + 0x1
        )[_0x252262(0x220)](
          (_0xeb6ed1, _0x1ce29e) =>
            _0xeb6ed1 +
            checkMarket(
              _0x2fdf87,
              _0x1ce29e[0x1],
              _0x1ce29e[0x2],
              _0x1ce29e[0x5]
            ),
          0x0
        ),
        _0xaafd75 = Math["round"]((_0x3b35cd / _0x3cb553) * 0x64);
      let _0x47c473 = _0x252262(0x239),
        _0x2c3c63 = 0x0,
        _0xd23a42 = 0x0;
      if (_0x284533 + _0x11da68 <= _0xc7015f[_0x252262(0x22f)]) {
        const _0xd5a60f = _0xc7015f[_0x252262(0x1f1)](
          _0x284533 + 0x1,
          _0x284533 + 0x1 + _0x11da68
        );
        (_0x2c3c63 = _0xd5a60f[_0x252262(0x24a)](
          (_0x2b6762) =>
            checkMarket(
              _0x2fdf87,
              _0x2b6762[0x1],
              _0x2b6762[0x2],
              _0x2b6762[0x5]
            ) === 0x1
        )["length"]),
          (_0xd23a42 = _0x11da68 - _0x2c3c63);
        const _0x3c1e4a = _0xd5a60f["some"](
          (_0x5054e1) =>
            checkMarket(
              _0x2fdf87,
              _0x5054e1[0x1],
              _0x5054e1[0x2],
              _0x5054e1[0x5]
            ) === 0x1
        );
        _0x3c1e4a && (_0x47c473 = _0x252262(0x1f9));
      }
      const _0x54268e = _0x2fdf87 + "\x20" + _0xaafd75 + "%";
      !_0x30d894[_0x54268e] &&
        (_0x30d894[_0x54268e] = {
          occurrences: 0x0,
          greens: 0x0,
          reds: 0x0,
          totalGreens: _0x2c3c63,
          totalReds: _0xd23a42,
        }),
        (_0x30d894[_0x54268e]["occurrences"] += 0x1),
        _0x47c473 === "green"
          ? (_0x30d894[_0x54268e][_0x252262(0x267)] += 0x1)
          : (_0x30d894[_0x54268e]["reds"] += 0x1),
        (_0x30d894[_0x54268e][_0x252262(0x274)] = _0x2c3c63),
        (_0x30d894[_0x54268e]["totalReds"] = _0xd23a42);
    }
  });
  const _0x4ac3c0 = Object[_0x52f5bb(0x260)](_0x30d894)
      [_0x52f5bb(0x1c0)]((_0x3b1a23) => {
        const _0x515d99 = _0x52f5bb,
          _0x33aa09 = _0x30d894[_0x3b1a23],
          _0x58f054 = ((_0x33aa09[_0x515d99(0x267)] /
            _0x33aa09["occurrences"]) *
            0x64)["toFixed"](0x2);
        let _0x399863 = "";
        const _0x107957 = parseFloat(_0x58f054);
        if (_0x107957 > 0x4b) _0x399863 = _0x515d99(0x1e9);
        else {
          if (_0x107957 > 0x32) _0x399863 = "Moderada\x20chance";
          else
            _0x107957 > 0x19
              ? (_0x399863 = _0x515d99(0x1fc))
              : (_0x399863 = _0x515d99(0x229));
        }
        return {
          marketGroup: _0x3b1a23,
          marketPercentage: parseFloat(
            _0x3b1a23[_0x515d99(0x26e)]("\x20")[0x1]
          ),
          occurrences: _0x33aa09[_0x515d99(0x1ed)],
          greens: _0x33aa09[_0x515d99(0x267)],
          reds: _0x33aa09[_0x515d99(0x1e8)],
          greenPercentage: _0x58f054,
          totalGreens: _0x33aa09[_0x515d99(0x274)],
          totalReds: _0x33aa09[_0x515d99(0x272)],
          analysis: _0x399863,
        };
      })
      [_0x52f5bb(0x25f)](
        (_0x234026, _0x4e6864) =>
          _0x4e6864[_0x52f5bb(0x1ca)] - _0x234026[_0x52f5bb(0x1ca)] ||
          _0x4e6864[_0x52f5bb(0x267)] - _0x234026[_0x52f5bb(0x267)]
      )
      [_0x52f5bb(0x1f1)](0x0, 0x64),
    _0x229ccf = _0x4ac3c0[_0x52f5bb(0x1f1)](0x0, 0x5);
  return { currentPercentage: _0x3233f5, top5: _0x229ccf };
}
function criarPromptAnalise(_0x24d6a3, _0x53b650) {
  const _0x59d1e3 = _0x2fd3f4;
  return (
    "\x0aVocê\x20é\x20um\x20analista\x20especialista\x20em\x20futebol\x20virtual,\x20focado\x20em\x20interpretar\x20dados\x20pré-processados\x20para\x20identificar\x20oportunidades\x20de\x20investimento\x20de\x20alto\x20valor.\x0a\x0aDADOS\x20PARA\x20ANÁLISE:\x0a-\x20Casa:\x20" +
    _0x24d6a3[_0x59d1e3(0x1bb)] +
    _0x59d1e3(0x1fd) +
    _0x24d6a3[_0x59d1e3(0x255)] +
    _0x59d1e3(0x266) +
    _0x53b650[_0x59d1e3(0x254)] +
    _0x59d1e3(0x1c5) +
    _0x24d6a3[_0x59d1e3(0x201)] +
    _0x59d1e3(0x1d5) +
    _0x53b650[_0x59d1e3(0x236)] +
    _0x59d1e3(0x21b) +
    (_0x53b650[_0x59d1e3(0x1f5)] || _0x59d1e3(0x1bd)) +
    "\x0a" +
    (_0x53b650["imagem"] ? _0x59d1e3(0x242) : "") +
    _0x59d1e3(0x1d0) +
    _0x53b650[_0x59d1e3(0x254)] +
    _0x59d1e3(0x204) +
    JSON[_0x59d1e3(0x223)](
      _0x24d6a3[_0x59d1e3(0x1e5)][_0x59d1e3(0x1f1)](0x0, 0xa),
      null,
      0x2
    ) +
    "\x0a\x0a2.\x20TOP\x2015\x20PADRÕES\x20ENCONTRADOS\x20PARA\x20O\x20MERCADO\x20\x22" +
    _0x53b650[_0x59d1e3(0x254)] +
    _0x59d1e3(0x238) +
    JSON[_0x59d1e3(0x223)](_0x24d6a3[_0x59d1e3(0x26b)], null, 0x2) +
    _0x59d1e3(0x259) +
    JSON[_0x59d1e3(0x223)](_0x24d6a3[_0x59d1e3(0x264)], null, 0x2) +
    _0x59d1e3(0x23e) +
    _0x53b650[_0x59d1e3(0x254)] +
    _0x59d1e3(0x1c3) +
    _0x24d6a3["marketAnalysis"][_0x59d1e3(0x232)] +
    _0x59d1e3(0x225) +
    JSON[_0x59d1e3(0x223)](
      _0x24d6a3["marketAnalysis"][_0x59d1e3(0x1ec)],
      null,
      0x2
    ) +
    "\x0a\x0aINSTRUÇÕES\x20DE\x20ANÁLISE\x20(SUA\x20TAREFA):\x0a1.\x20\x20Sua\x20missão\x20é\x20conectar\x20as\x20informações\x20acima.\x20Não\x20processe\x20dados\x20brutos,\x20apenas\x20interprete\x20os\x20resultados\x20que\x20eu\x20forneci.\x0a2.\x20\x20Analise\x20os\x20\x22TOP\x2015\x20PADRÕES\x22.\x20Identifique\x20quais\x20têm\x20o\x20maior\x20percentual\x20de\x20acerto\x20(percentual)\x20e\x20um\x20número\x20sólido\x20de\x20ocorrências.\x20Padrões\x20com\x20100%\x20de\x20acerto\x20e\x20poucas\x20ocorrências\x20são\x20promissores,\x20mas\x20de\x20alto\x20risco.\x0a3.\x20\x20Observe\x20os\x20\x22PRÓXIMOS\x206\x20CONFRONTOS\x22.\x20Verifique\x20se\x20algum\x20desses\x20jogos\x20envolve\x20times\x20que\x20estão\x20bem\x20posicionados\x20no\x20\x22RANKING\x20DE\x20TIMES\x22.\x0a4.\x20\x20Cruze\x20as\x20informações:\x20A\x20oportunidade\x20de\x20maior\x20valor\x20acontece\x20quando\x20um\x20padrão\x20forte\x20aponta\x20para\x20um\x20dos\x20próximos\x20confrontos\x20E\x20esse\x20confronto\x20envolve\x20times\x20com\x20bom\x20desempenho\x20histórico\x20no\x20mercado.\x0a5.\x20\x20Se\x20uma\x20imagem\x20foi\x20fornecida,\x20considere\x20que\x20ela\x20pode\x20conter\x20informações\x20visuais\x20complementares\x20(como\x20estatísticas\x20ou\x20gráficos)\x20e\x20mencione\x20que\x20ela\x20foi\x20considerada\x20na\x20análise,\x20mas\x20não\x20tente\x20descrevê-la\x20diretamente.\x0a6.\x20\x20Baseado\x20nesta\x20síntese,\x20gere\x20a\x20sua\x20análise\x20no\x20formato\x20abaixo.\x20O\x20número\x20de\x20sugestões\x20de\x20horários\x20deve\x20seguir\x20a\x20estratégia\x20Martingale\x20(Nenhum\x20=\x201\x20jogo,\x201\x20Cobertura\x20=\x202\x20jogos,\x202\x20Coberturas\x20=\x203\x20jogos,\x203\x20Coberturas\x20=\x204\x20jogos).\x0a7.\x20\x20Se\x20nenhum\x20padrão\x20forte\x20se\x20alinhar\x20com\x20os\x20próximos\x20jogos\x20de\x20times\x20bem\x20ranqueados,\x20seja\x20honesto\x20e\x20informe\x20que\x20nenhuma\x20oportunidade\x20clara\x20foi\x20encontrada.\x0a8.\x20\x20Para\x20as\x20sugestões\x20de\x20horários:\x20Selecione\x20o\x20próximo\x20confronto\x20que\x20melhor\x20se\x20alinha\x20com\x20padrões\x20fortes\x20e\x20times\x20bem\x20ranqueados\x20como\x20o\x20principal.\x20Em\x20seguida,\x20adicione\x20as\x20coberturas\x20como\x20os\x20confrontos\x20sequenciais\x20seguintes.\x20Garanta\x20que\x20os\x20horários\x20estejam\x20em\x20sequência\x20cronológica\x20crescente,\x20sem\x20repetições,\x20e\x20baseados\x20exclusivamente\x20nos\x20horários\x20fornecidos\x20nos\x20próximos\x20confrontos.\x20Assuma\x20que\x20a\x20lista\x20de\x20próximos\x20está\x20ordenada\x20por\x20tempo,\x20e\x20selecione\x20apenas\x20horários\x20futuros\x20ou\x20os\x20mais\x20próximos.\x20O\x20primeiro\x20horário\x20é\x20o\x20principal\x20com\x20padrão\x20e\x20análise,\x20os\x20demais\x20são\x20coberturas.\x0a9.\x20\x20Inclua\x20uma\x20seção\x20independente\x20para\x20a\x20Análise\x20de\x20Gráfico\x20de\x20Mercado,\x20comentando\x20a\x20porcentagem\x20atual\x20e\x20destacando\x20as\x20top\x205\x20melhores\x20porcentagens,\x20considerando\x20o\x20Martingale\x20selecionado\x20para\x20a\x20verificação.\x0a\x0aFORMATO\x20DA\x20RESPOSTA\x20(Use\x20um\x20tom\x20natural\x20e\x20profissional,\x20evite\x20usar\x20negrito\x20com\x20asteriscos\x20**):\x0a\x0a🎯\x20ANÁLISE\x20ESTATÍSTICA\x0a[Comente\x20brevemente\x20sobre\x20o\x20desempenho\x20dos\x20times\x20no\x20ranking\x20e\x20a\x20força\x20geral\x20dos\x20padrões\x20encontrados.\x20Ex:\x20\x22Observa-se\x20que\x20os\x20times\x20X\x20e\x20Y\x20são\x20dominantes\x20neste\x20mercado.\x20Foram\x20encontrados\x20N\x20padrões\x20com\x20mais\x20de\x2080%\x20de\x20acerto,\x20indicando\x20consistência...\x22]\x0a\x0a📊\x20PADRÕES\x20RELEVANTES\x0a[Destaque\x202\x20ou\x203\x20dos\x20padrões\x20mais\x20promissores\x20da\x20lista,\x20explicando\x20por\x20que\x20são\x20relevantes.\x20Ex:\x20\x22O\x20padrão\x20\x27over2.5\x20|\x201-2\x27\x20se\x20destaca\x20com\x2085%\x20de\x20acerto\x20em\x2020\x20ocorrências,\x20mostrando\x20ser\x20um\x20gatilho\x20confiável...\x22]\x0a\x0a📈\x20ANÁLISE\x20DE\x20GRÁFICO\x20DE\x20MERCADO\x0a[Comente\x20sobre\x20a\x20porcentagem\x20atual\x20do\x20mercado\x20e\x20destaque\x20as\x20top\x205\x20melhores\x20porcentagens,\x20incluindo\x20greenPercentage,\x20occurrences,\x20etc.,\x20considerando\x20o\x20Martingale\x20selecionado\x20para\x20a\x20verificação\x20de\x20linhas.]\x0a\x0a⚡\x20PRÓXIMAS\x20OPORTUNIDADES\x0a[Baseado\x20na\x20sua\x20análise\x20combinada,\x20liste\x20as\x20entradas\x20recomendadas.\x20Se\x20nenhuma\x20for\x20encontrada,\x20justifique\x20o\x20motivo.\x0aFormato\x20se\x20encontrar:\x0aLiga:\x20[liga]\x0aMercado:\x20[mercado]\x0a⏰\x20Horários\x0a▸\x20[hora:minuto]\x20▸\x20[hora:minuto]\x20...\x20(número\x20baseado\x20na\x20Martingale,\x20em\x20sequência\x20sem\x20repetições)\x0aJustificativa:\x20[Breve\x20explicação\x20do\x20porquê\x20esta\x20é\x20uma\x20boa\x20entrada,\x20mencionando\x20o\x20padrão\x20e\x20os\x20times\x20envolvidos.\x20Note\x20que\x20o\x20primeiro\x20horário\x20é\x20o\x20principal\x20onde\x20padrões\x20foram\x20encontrados,\x20os\x20demais\x20são\x20coberturas\x20sequenciais.]\x0a\x0a🎲\x20ESTRATÉGIA\x20MARTINGALE\x0a[Avalie\x20a\x20segurança\x20da\x20estratégia\x20para\x20este\x20cenário.\x20Ex:\x20\x22Considerando\x20a\x20força\x20dos\x20padrões\x20encontrados,\x20a\x20estratégia\x20de\x20[N]\x20coberturas\x20parece\x20[segura/arriscada]...\x22]\x0a\x0a💡\x20RECOMENDAÇÃO\x20FINAL\x0a[Dê\x20uma\x20recomendação\x20final\x20clara\x20e\x20objetiva.\x20Ex:\x20\x22Recomendo\x20a\x20entrada\x20nos\x20horários\x20sugeridos\x20devido\x20à\x20forte\x20confluência\x20entre\x20o\x20padrão\x20X\x20e\x20o\x20confronto\x20envolvendo\x20o\x20time\x20Y,\x20que\x20possui\x20um\x20histórico\x20excelente\x20neste\x20mercado.\x22]\x0a"
  );
}
async function analisarComGemini(_0xc13697, _0x5dd128) {
  const _0x5c432a = _0x2fd3f4,
    _0x2eda18 = criarPromptAnalise(_0xc13697, _0x5dd128),
    _0x10c82b = await fetch(GEMINI_URL + "?key=" + GEMINI_API_KEY, {
      method: "POST",
      headers: { "Content-Type": _0x5c432a(0x23d) },
      body: JSON[_0x5c432a(0x223)]({
        contents: [{ parts: [{ text: _0x2eda18 }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 0x28,
          topP: 0.95,
          maxOutputTokens: 0x800,
        },
      }),
    });
  if (!_0x10c82b["ok"]) {
    const _0x78ffa = await _0x10c82b[_0x5c432a(0x20a)]();
    console[_0x5c432a(0x226)](_0x5c432a(0x1c7), _0x78ffa);
    throw new Error(_0x5c432a(0x1e3) + _0x10c82b["status"]);
  }
  const _0x349bb9 = await _0x10c82b[_0x5c432a(0x20a)]();
  return _0x349bb9[_0x5c432a(0x202)][0x0][_0x5c432a(0x278)][
    _0x5c432a(0x24f)
  ][0x0][_0x5c432a(0x1d6)];
}
async function gerarAnalise() {
  const _0x13b206 = _0x2fd3f4,
    _0x37c0ae = getSelectedValue(_0x13b206(0x271)),
    _0x2517d4 = getSelectedValue(_0x13b206(0x262)),
    _0x33a2b1 = getSelectedValue(_0x13b206(0x1ba)),
    _0x27cd04 = getSelectedText(_0x13b206(0x1ba)),
    _0x2b17e4 = parseInt(getSelectedValue("martingale-group") || "0", 0xa),
    _0x227762 = getSelectedText(_0x13b206(0x206)),
    _0x14a607 = getSelectedValue(_0x13b206(0x245)),
    _0x2948da = document[_0x13b206(0x276)](_0x13b206(0x1f5))[_0x13b206(0x218)],
    _0x127a15 = document[_0x13b206(0x276)](_0x13b206(0x1dd))[
      _0x13b206(0x256)
    ][0x0];
  if (!_0x37c0ae || !_0x2517d4 || !_0x33a2b1 || !_0x14a607) {
    alert(_0x13b206(0x217));
    return;
  }
  const _0x236788 = document[_0x13b206(0x1f6)](_0x13b206(0x1ce)),
    _0x37515d = document[_0x13b206(0x276)](_0x13b206(0x1b9)),
    _0x1b6aac = document[_0x13b206(0x276)](_0x13b206(0x26c)),
    _0x1c014e = document["getElementById"](_0x13b206(0x235));
  (_0x236788[_0x13b206(0x1db)] = !![]),
    (_0x236788[_0x13b206(0x1ea)] = _0x13b206(0x1c4)),
    (_0x37515d["style"][_0x13b206(0x275)] = _0x13b206(0x1b8)),
    (_0x1c014e[_0x13b206(0x1ea)] = "");
  try {
    _0x1b6aac[_0x13b206(0x1ea)] =
      _0x13b206(0x1e7) + _0x14a607 + _0x13b206(0x1d7);
    const _0x5b0b96 = await buscarDadosAPI(
      _0x37c0ae,
      _0x2517d4,
      parseInt(_0x14a607)
    );
    (_0x5b0b96[_0x13b206(0x1e5)] = calcularRankingTimes(
      _0x5b0b96[_0x13b206(0x1d8)][_0x13b206(0x1c0)]((_0x5dbddc) => ({
        time_a: _0x5dbddc[0x3],
        time_b: _0x5dbddc[0x4],
        ft: _0x5dbddc[0x0] + _0x13b206(0x213) + _0x5dbddc[0x1],
      })),
      _0x33a2b1
    )),
      (_0x1b6aac[_0x13b206(0x1ea)] = _0x13b206(0x1c8));
    const _0x2ee8c5 = _0x2b17e4 + 0x1,
      { resultados: _0x4c5562 } = await analyzeInWorker(_0x5b0b96["dadosCru"], {
        tiros: _0x2ee8c5,
        market: _0x33a2b1,
        combinado: !![],
      });
    _0x5b0b96[_0x13b206(0x26b)] = _0x4c5562;
    const _0x8fa45a = mapMercado(_0x33a2b1),
      _0x3b513c = _0x37c0ae === _0x13b206(0x1be) ? 0x1e : 0x14,
      _0x2d3d57 = _0x2b17e4 + 0x1;
    (_0x5b0b96[_0x13b206(0x24b)] = calculateMarketAnalysis(
      _0x5b0b96,
      _0x8fa45a,
      _0x5b0b96[_0x13b206(0x201)],
      _0x3b513c,
      _0x2d3d57
    )),
      (_0x1b6aac["innerHTML"] =
        "<div\x20class=\x22loading\x22><div\x20class=\x22spinner\x22></div>Gerando\x20análise\x20com\x20IA...</div>");
    const _0xb121b6 = {
        mercado: _0x27cd04,
        liga: _0x2517d4,
        martingale: _0x227762 || _0x13b206(0x224),
        periodo: _0x14a607 + _0x13b206(0x205),
        observacao: _0x2948da,
        imagem: _0x127a15 ? !![] : ![],
      },
      _0x343fa0 = await analisarComGemini(_0x5b0b96, _0xb121b6);
    (_0x1b6aac[_0x13b206(0x1ea)] =
      _0x13b206(0x1dc) +
      casasConfig[_0x37c0ae][_0x13b206(0x1f3)] +
      "\x20(" +
      _0x2517d4 +
      ")"),
      (_0x1c014e[_0x13b206(0x20e)] = _0x343fa0);
  } catch (_0x2a5b19) {
    console[_0x13b206(0x226)](
      "Erro\x20no\x20processo\x20de\x20análise:",
      _0x2a5b19
    ),
      (_0x1b6aac[_0x13b206(0x1ea)] = _0x13b206(0x230)),
      (_0x1c014e[_0x13b206(0x1ea)] =
        _0x13b206(0x257) + _0x2a5b19["message"] + _0x13b206(0x1d9));
  } finally {
    (_0x236788[_0x13b206(0x1db)] = ![]),
      (_0x236788["innerHTML"] = _0x13b206(0x25e));
  }
}
function _0x23d7() {
  const _0x1ba3f1 = [
    "\x0a\x20\x20\x20\x20\x20\x20\x20\x20self.onmessage\x20=\x20(e)\x20=>\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20p\x20=\x20e.data;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(!p\x20||\x20p.cmd\x20!==\x20\x27analyze\x27)\x20return;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20res\x20=\x20analyzeAll(p.payload);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20self.postMessage({\x20ok:\x20true,\x20id:\x20p.id,\x20result:\x20res\x20});\x0a\x20\x20\x20\x20\x20\x20\x20\x20};\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20enumerateCombos(tok){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(tok.length===1)\x20return\x20tok[0].map(t=>[t]);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(tok.length===2){\x20const\x20out=[];\x20for(const\x20a\x20of\x20tok[0])\x20for(const\x20b\x20of\x20tok[1])\x20out.push([a,b]);\x20return\x20out;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(tok.length===3){\x20const\x20out=[];\x20for(const\x20a\x20of\x20tok[0])\x20for(const\x20b\x20of\x20tok[1])\x20for(const\x20c\x20of\x20tok[2])\x20out.push([a,b,c]);\x20return\x20out;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20out=[],cur=[];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20(function\x20rec(i){\x20if(i===tok.length){\x20out.push(cur.slice());\x20return;\x20}\x20for(const\x20t\x20of\x20tok[i]){\x20cur.push(t);\x20rec(i+1);\x20cur.pop();\x20}\x20})(0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20out;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20getOffsetsByTipo(t){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(t===\x271\x27)\x20return\x20[0];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(t===\x272\x27)\x20return\x20[0,1];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(t===\x273\x27)\x20return\x20[0,1,2];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(t===\x271_pula_1\x27)\x20return\x20[0,2];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(t===\x271_pula_1_pula_1\x27)\x20return\x20[0,2,4];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20[0,1];\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20tokensDoJogo(a,b,total,mandante,visitante){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20t\x20=\x20new\x20Set();\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20t.add(`${a}-${b}`);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20t.add(a\x20>\x200\x20&&\x20b\x20>\x200\x20?\x20\x27ambasMarcam\x27\x20:\x20\x27ambasNaoMarcam\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20t.add(a\x20>\x20b\x20?\x20\x27casaVence\x27\x20:\x20(a\x20<\x20b\x20?\x20\x27foraVence\x27\x20:\x20\x27empate\x27));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20>=\x202)\x20t.add(\x27over1.5\x27);\x20if\x20(total\x20<\x202)\x20t.add(\x27under1.5\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20>=\x203)\x20t.add(\x27over2.5\x27);\x20if\x20(total\x20<\x203)\x20t.add(\x27under2.5\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20>=\x204)\x20t.add(\x27over3.5\x27);\x20if\x20(total\x20<\x204)\x20t.add(\x27under3.5\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20>=\x205)\x20t.add(\x27over5\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20===\x201)\x20t.add(\x27exact1\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20===\x202)\x20t.add(\x27exact2\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20===\x203)\x20t.add(\x27exact3\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20===\x204)\x20t.add(\x27exact4\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(mandante)\x20t.add(mandante.toLowerCase());\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(visitante)\x20t.add(visitante.toLowerCase());\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20Array.from(t);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20isGreenForMarket(m,a,b,total){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27ambasMarcam\x27)\x20return\x20a\x20>\x200\x20&&\x20b\x20>\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27ambasNaoMarcam\x27)\x20return\x20a\x20===\x200\x20||\x20b\x20===\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27casaVence\x27)\x20return\x20a\x20>\x20b;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27foraVence\x27)\x20return\x20a\x20<\x20b;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27empate\x27)\x20return\x20a\x20===\x20b;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27over1.5\x27)\x20return\x20total\x20>=\x202;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27under1.5\x27)\x20return\x20total\x20<\x202;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27over2.5\x27)\x20return\x20total\x20>=\x203;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27under2.5\x27)\x20return\x20total\x20<\x203;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27over3.5\x27)\x20return\x20total\x20>=\x204;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27under3.5\x27)\x20return\x20total\x20<\x204;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27over5\x27)\x20return\x20total\x20>=\x205;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27exact1\x27)\x20return\x20total\x20===\x201;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27exact2\x27)\x20return\x20total\x20===\x202;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27exact3\x27)\x20return\x20total\x20===\x203;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27exact4\x27)\x20return\x20total\x20===\x204;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20false;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20analisarAutoPadroes(dados,tipo,tiros,market,inicio,fim){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20res=[];\x20const\x20offs=getOffsetsByTipo(tipo);\x20const\x20last=offs[offs.length-1];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(let\x20p=inicio;p<=fim;p++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20comb={};\x20const\x20need=(last+1)+p+tiros;\x20if(dados.length<need)\x20continue;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(let\x20i=0;i<=dados.length-need;i++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20tok=[];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(const\x20o\x20of\x20offs){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20[a,b,t,mandante,visitante]=dados[i+o];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20tok.push(tokensDoJogo(a,b,t,mandante,visitante));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20combos=enumerateCombos(tok);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20green=false;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20ini=i+last+1+p,\x20fimA=ini+tiros;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(let\x20j=ini;j<fimA&&j<dados.length;j++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20[a,b,sum]=dados[j];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(isGreenForMarket(market,a,b,sum)){\x20green=true;\x20break;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(const\x20seq\x20of\x20combos){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20key=seq.join(\x27\x20|\x20\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(!comb[key]){\x20comb[key]={ocorrencias:0,greens:0};\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20comb[key].ocorrencias++;\x20if(green)\x20comb[key].greens++;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(const\x20k\x20in\x20comb){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20st=comb[k];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(st.ocorrencias>=3){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20res.push({\x20padrao:k,\x20pular_jogos:p,\x20ocorrencias:st.ocorrencias,\x20greens:st.greens,\x20percentual:((st.greens/st.ocorrencias)*100).toFixed(1)\x20});\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20res.sort((a,b)=>parseFloat(b.percentual)-parseFloat(a.percentual)||b.ocorrencias-a.ocorrencias);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20res.slice(0,15);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20analyzeAll(payload){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20{\x20dados,\x20tiros,\x20market,\x20combinado\x20}\x20=\x20payload;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20tipos\x20=\x20combinado\x20?\x20[\x272\x27,\x273\x27,\x271_pula_1\x27,\x271_pula_1_pula_1\x27]\x20:\x20[\x272\x27];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20todos=[];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(const\x20t\x20of\x20tipos){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20r\x20=\x20analisarAutoPadroes(dados,\x20t,\x20tiros,\x20market,\x201,\x2010);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20r.forEach(x=>x.tipo_padrao=t);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20todos\x20=\x20todos.concat(r);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20todos.sort((a,b)=>parseFloat(b.percentual)-parseFloat(a.percentual)||b.ocorrencias-a.ocorrencias);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20{\x20resultados:\x20todos.slice(0,15)\x20};\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20",
    "ambasNaoMarcam",
    "contains",
    "json",
    "postMessage",
    "image-status",
    "createElement",
    "textContent",
    "4583140QZmvcb",
    "cincoOuMaisGols",
    "Inglaterra",
    "random",
    "\x20x\x20",
    "under1.5",
    "under2.5",
    "message",
    "Por\x20favor,\x20selecione\x20Casa,\x20Liga,\x20Mercado\x20e\x20Período\x20de\x20Análise.",
    "value",
    "marketCount",
    "innerText",
    "\x0a-\x20Observações\x20do\x20Usuário:\x20",
    "active",
    "toFixed",
    "exact4",
    "7SrpPmU",
    "reduce",
    "Nenhum\x20arquivo\x20selecionado",
    "umGolExato",
    "stringify",
    "Nenhum",
    "%\x0aTop\x205\x20Melhores\x20Porcentagens:\x0a",
    "error",
    "padStart",
    "percentage",
    "Alta\x20chance\x20de\x20falha",
    "analyze",
    "dataset",
    "isFinite",
    "casaVence",
    "path",
    "length",
    "❌\x20Erro\x20na\x20Análise",
    "change",
    "currentPercentage",
    "createObjectURL",
    "then",
    "result-content",
    "martingale",
    "result",
    "\x22:\x0a",
    "red",
    "addEventListener",
    "ambasMarcam",
    "Spain",
    "application/json",
    "\x0a\x0a4.\x20ANÁLISE\x20DE\x20GRÁFICO\x20DE\x20MERCADO\x20PARA\x20O\x20MERCADO\x20\x22",
    "empate",
    "Campeonato\x20Italiano",
    "hora",
    "-\x20Imagem\x20fornecida:\x20Uma\x20imagem\x20foi\x20enviada\x20para\x20análise\x20adicional.",
    "Euro",
    "trim",
    "periodo-group",
    ".btn-grid",
    "image-preview",
    "tresGolsExatos",
    "includes",
    "filter",
    "marketAnalysis",
    "time_a",
    "1485OMGTaI",
    "over1.5",
    "parts",
    "under3.5",
    "7184296omXuFZ",
    "ligas",
    "ambasSim",
    "mercado",
    "liga",
    "files",
    "<div\x20class=\x22error\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<strong>Erro:</strong>\x20",
    "values",
    "\x0a\x0a3.\x20PRÓXIMOS\x206\x20CONFRONTOS:\x0a",
    "59880XhyPbB",
    "ambasNao",
    "all",
    "exact1",
    "Gerar\x20Análise\x20IA",
    "sort",
    "keys",
    "removeEventListener",
    "ligas-group",
    "1074EMYYOi",
    "proximos",
    "totalGames",
    "\x0a-\x20Mercado:\x20",
    "greens",
    "Casa\x20",
    "className",
    "none",
    "padroesEncontrados",
    "result-title",
    "422382twnkqd",
    "split",
    "toString",
    "quatroGolsExatos",
    "casas-group",
    "totalReds",
    "estrela",
    "totalGreens",
    "display",
    "getElementById",
    "classList",
    "content",
    "btn",
    "block",
    "result-container",
    "mercados-group",
    "casa",
    "/resultados/",
    "Nenhuma",
    "kiron",
    "4206676vPGglS",
    "map",
    "\x20não\x20encontrada",
    ".btn.active",
    "\x22:\x0aPorcentagem\x20Atual:\x20",
    "<div\x20class=\x22spinner\x22></div>\x20Processando...",
    "\x0a-\x20Total\x20de\x20jogos\x20analisados:\x20",
    "Betsson",
    "Erro\x20na\x20API\x20Gemini:",
    "<div\x20class=\x22loading\x22><div\x20class=\x22spinner\x22></div>Analisando\x20padrões...</div>",
    "England",
    "greenPercentage",
    "forEach",
    "5803344XEywJG",
    "appendChild",
    ".btn-generate",
    "querySelectorAll",
    "\x0a\x0aINFORMAÇÕES\x20PRÉ-PROCESSADAS:\x0a\x0a1.\x20RANKING\x20DE\x20TIMES\x20PARA\x20O\x20MERCADO\x20\x22",
    "minuto",
    "Brasil",
    "https://betstat.site",
    "foraVence",
    "\x0a-\x20Estratégia\x20Martingale:\x20",
    "text",
    "\x20jogos...</div>",
    "dadosCru",
    "<br><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<strong>Causas\x20possíveis:</strong>\x20Falha\x20na\x20operação.\x20Atualize\x20a\x20página\x20e\x20tente\x20outra\x20vez\x20mais\x20tarde.\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>",
    "style",
    "disabled",
    "✓\x20Análise\x20Concluída\x20-\x20",
    "image-upload",
    "Falha\x20ao\x20conectar\x20com\x20a\x20API:\x20",
    "6711pLPkvP",
    "0.0",
    "exact2",
    "click",
    "Erro\x20na\x20API\x20do\x20Gemini:\x20",
    "/proximos/",
    "ranking",
    "Kiron",
    "<div\x20class=\x22loading\x22><div\x20class=\x22spinner\x22></div>Coletando\x20",
    "reds",
    "Alta\x20chance\x20de\x20acerto",
    "innerHTML",
    "Italy",
    "top5",
    "occurrences",
    "Espanha",
    "target",
    "Erro\x20no\x20worker\x20de\x20análise",
    "slice",
    "doisGolsExatos",
    "name",
    "Copa\x20América",
    "observacao",
    "querySelector",
    "onload",
    "Taça\x20Glória\x20Eterna",
    "green",
    "Copa\x20das\x20Estrelas",
    "time_b",
    "Risco\x20elevado",
    "\x0a-\x20Liga:\x20",
    "over2.5",
    "remove",
    "over3.5",
    "totalJogos",
    "candidates",
    "Brasileirão\x20Betano",
    "\x22\x20(Top\x2010):\x0a",
    "\x20jogos",
    "martingale-group",
  ];
  _0x23d7 = function () {
    return _0x1ba3f1;
  };
  return _0x23d7();
}
document[_0x2fd3f4(0x276)](_0x2fd3f4(0x1dd))[_0x2fd3f4(0x23a)](
  _0x2fd3f4(0x231),
  function (_0x1503a2) {
    const _0x1aabcb = _0x2fd3f4,
      _0x521723 = _0x1503a2[_0x1aabcb(0x1ef)][_0x1aabcb(0x256)][0x0],
      _0x4608fe = document[_0x1aabcb(0x276)](_0x1aabcb(0x247)),
      _0x2090b7 = document[_0x1aabcb(0x276)](_0x1aabcb(0x20c));
    if (_0x521723) {
      const _0x5c1930 = new FileReader();
      (_0x5c1930[_0x1aabcb(0x1f7)] = function (_0x4fa8a1) {
        const _0x159948 = _0x1aabcb;
        (_0x4608fe["src"] = _0x4fa8a1["target"][_0x159948(0x237)]),
          (_0x4608fe[_0x159948(0x1da)][_0x159948(0x275)] = _0x159948(0x1b8));
      }),
        _0x5c1930["readAsDataURL"](_0x521723),
        (_0x2090b7[_0x1aabcb(0x20e)] = _0x521723["name"]);
    } else
      (_0x4608fe[_0x1aabcb(0x1da)][_0x1aabcb(0x275)] = _0x1aabcb(0x26a)),
        (_0x2090b7[_0x1aabcb(0x20e)] = "Nenhum\x20arquivo\x20selecionado");
  }
);
