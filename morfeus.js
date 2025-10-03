const _0x3ee2b2 = _0x3065;
(function (_0x37ff3a, _0x87bf3b) {
  const _0x3de7a3 = _0x3065,
    _0x1e37f3 = _0x37ff3a();
  while (!![]) {
    try {
      const _0xe39352 =
        -parseInt(_0x3de7a3(0x144)) / 0x1 +
        -parseInt(_0x3de7a3(0x11c)) / 0x2 +
        -parseInt(_0x3de7a3(0x1bb)) / 0x3 +
        (-parseInt(_0x3de7a3(0x192)) / 0x4) *
          (parseInt(_0x3de7a3(0x17c)) / 0x5) +
        parseInt(_0x3de7a3(0x16c)) / 0x6 +
        (-parseInt(_0x3de7a3(0x111)) / 0x7) *
          (parseInt(_0x3de7a3(0x198)) / 0x8) +
        (-parseInt(_0x3de7a3(0x153)) / 0x9) *
          (-parseInt(_0x3de7a3(0x171)) / 0xa);
      if (_0xe39352 === _0x87bf3b) break;
      else _0x1e37f3["push"](_0x1e37f3["shift"]());
    } catch (_0x3e1fcc) {
      _0x1e37f3["push"](_0x1e37f3["shift"]());
    }
  }
})(_0x5c09, 0x5acf6);
const GEMINI_API_KEY = _0x3ee2b2(0x178),
  GEMINI_URL = _0x3ee2b2(0x152),
  casasConfig = {
    betano: {
      name: _0x3ee2b2(0x187),
      ligas: [
        _0x3ee2b2(0x109),
        _0x3ee2b2(0x138),
        _0x3ee2b2(0x154),
        "Campeonato\x20Italiano",
        "Copa\x20das\x20Estrelas",
        "Brasileirão\x20Betano",
      ],
    },
    kiron: {
      name: _0x3ee2b2(0x1b3),
      ligas: [_0x3ee2b2(0x190), "Italy", _0x3ee2b2(0x189)],
      path: _0x3ee2b2(0x18e),
    },
    estrela: {
      name: _0x3ee2b2(0x19e),
      ligas: ["estrela"],
      path: _0x3ee2b2(0x115),
    },
    betsson: {
      name: _0x3ee2b2(0x14c),
      ligas: ["Espanha", "Inglaterra", _0x3ee2b2(0x157)],
      path: _0x3ee2b2(0x163),
    },
  };
function _0x3065(_0x3907db, _0x349a80) {
  const _0x5c0994 = _0x5c09();
  return (
    (_0x3065 = function (_0x30655e, _0x99c386) {
      _0x30655e = _0x30655e - 0x106;
      let _0x6ed28e = _0x5c0994[_0x30655e];
      return _0x6ed28e;
    }),
    _0x3065(_0x3907db, _0x349a80)
  );
}
document[_0x3ee2b2(0x1b5)](_0x3ee2b2(0x196))[_0x3ee2b2(0x1c0)]((_0x554da6) => {
  const _0x52d3ce = _0x3ee2b2;
  _0x554da6[_0x52d3ce(0x1a0)](_0x52d3ce(0x11a), (_0x703ee9) => {
    const _0x48e461 = _0x52d3ce;
    if (
      _0x703ee9[_0x48e461(0x167)]["classList"]["contains"](_0x48e461(0x176))
    ) {
      const _0x261b37 = _0x554da6["querySelector"](_0x48e461(0x13d));
      _0x261b37 &&
        _0x261b37[_0x48e461(0x123)][_0x48e461(0x1a2)](_0x48e461(0x197)),
        _0x703ee9[_0x48e461(0x167)][_0x48e461(0x123)][_0x48e461(0x129)](
          _0x48e461(0x197)
        ),
        _0x554da6["id"] === _0x48e461(0x18f) &&
          mostrarLigas(_0x703ee9[_0x48e461(0x167)][_0x48e461(0x11b)]["value"]);
    }
  });
});
function mostrarLigas(_0x401867) {
  const _0x3a85bb = _0x3ee2b2,
    _0x19b44c = document["getElementById"](_0x3a85bb(0x19a)),
    _0x21ff97 = document[_0x3a85bb(0x122)]("ligas-group");
  if (!casasConfig[_0x401867]) {
    _0x19b44c["style"]["display"] = _0x3a85bb(0x10a);
    return;
  }
  (_0x21ff97[_0x3a85bb(0x1ab)] = ""),
    casasConfig[_0x401867][_0x3a85bb(0x1a6)][_0x3a85bb(0x1c0)]((_0x3a732f) => {
      const _0x195b88 = _0x3a85bb,
        _0x36d443 = document[_0x195b88(0x16e)](_0x195b88(0x128));
      (_0x36d443[_0x195b88(0x116)] = "btn"),
        (_0x36d443[_0x195b88(0x11b)][_0x195b88(0x120)] = _0x3a732f),
        (_0x36d443["textContent"] = _0x3a732f),
        _0x21ff97[_0x195b88(0x169)](_0x36d443);
    }),
    (_0x19b44c[_0x3a85bb(0x150)][_0x3a85bb(0x1a8)] = _0x3a85bb(0x15d));
}
function getSelectedValue(_0x2b2991) {
  const _0x1c80af = _0x3ee2b2,
    _0x41f803 = document["getElementById"](_0x2b2991),
    _0x23c0eb = _0x41f803["querySelector"](_0x1c80af(0x13d));
  return _0x23c0eb ? _0x23c0eb[_0x1c80af(0x11b)][_0x1c80af(0x120)] : null;
}
function getSelectedText(_0x1480ea) {
  const _0x2b850d = _0x3ee2b2,
    _0x5eb75d = document["getElementById"](_0x1480ea),
    _0x1e5a56 = _0x5eb75d["querySelector"](_0x2b850d(0x13d));
  return _0x1e5a56 ? _0x1e5a56[_0x2b850d(0x181)] : null;
}
function limparAnalise() {
  const _0x1b2a4f = _0x3ee2b2;
  document[_0x1b2a4f(0x1b5)](".btn.active")[_0x1b2a4f(0x1c0)]((_0x1857df) =>
    _0x1857df[_0x1b2a4f(0x123)][_0x1b2a4f(0x1a2)](_0x1b2a4f(0x197))
  ),
    (document["getElementById"]("observacao")[_0x1b2a4f(0x120)] = ""),
    (document[_0x1b2a4f(0x122)]("image-upload")[_0x1b2a4f(0x120)] = ""),
    (document[_0x1b2a4f(0x122)](_0x1b2a4f(0x1ae))[_0x1b2a4f(0x10c)] =
      "Nenhum\x20arquivo\x20selecionado"),
    (document[_0x1b2a4f(0x122)](_0x1b2a4f(0x1ad))[_0x1b2a4f(0x150)][
      _0x1b2a4f(0x1a8)
    ] = _0x1b2a4f(0x10a)),
    (document[_0x1b2a4f(0x122)](_0x1b2a4f(0x18b))[_0x1b2a4f(0x150)][
      _0x1b2a4f(0x1a8)
    ] = _0x1b2a4f(0x10a)),
    (document[_0x1b2a4f(0x122)](_0x1b2a4f(0x19a))[_0x1b2a4f(0x150)][
      _0x1b2a4f(0x1a8)
    ] = _0x1b2a4f(0x10a));
}
function calcularRankingTimes(_0xe629c, _0x248bc8) {
  const _0x5a1e0f = _0x3ee2b2,
    _0x499760 = {};
  _0xe629c[_0x5a1e0f(0x1c0)]((_0x7c7119) => {
    const _0x363c12 = _0x5a1e0f,
      { time_a: _0x4ebe7d, time_b: _0x8a0692, ft: _0x4f07fd } = _0x7c7119;
    if (!_0x4f07fd || !_0x4f07fd[_0x363c12(0x1af)](_0x363c12(0x1b1))) return;
    const [_0x23eca7, _0x4c2d75] = _0x4f07fd[_0x363c12(0x175)](
        _0x363c12(0x1b1)
      )["map"](Number),
      _0x101ef8 = _0x23eca7 + _0x4c2d75;
    [_0x4ebe7d, _0x8a0692]["forEach"]((_0x196b15) => {
      !_0x499760[_0x196b15] &&
        (_0x499760[_0x196b15] = {
          name: _0x196b15,
          totalGames: 0x0,
          marketCount: 0x0,
        });
    }),
      _0x499760[_0x4ebe7d][_0x363c12(0x19c)]++,
      _0x499760[_0x8a0692]["totalGames"]++;
    let _0x391a49 = ![];
    switch (_0x248bc8) {
      case _0x363c12(0x107):
        _0x391a49 = _0x23eca7 > 0x0 && _0x4c2d75 > 0x0;
        break;
      case _0x363c12(0x18c):
        _0x391a49 = _0x23eca7 === 0x0 || _0x4c2d75 === 0x0;
        break;
      case "empate":
        _0x391a49 = _0x23eca7 === _0x4c2d75;
        break;
      case _0x363c12(0x1a5):
        _0x391a49 = _0x101ef8 > 0x1;
        break;
      case _0x363c12(0x194):
        _0x391a49 = _0x101ef8 < 0x2;
        break;
      case _0x363c12(0x147):
        _0x391a49 = _0x101ef8 > 0x2;
        break;
      case _0x363c12(0x133):
        _0x391a49 = _0x101ef8 < 0x3;
        break;
      case _0x363c12(0x1bd):
        _0x391a49 = _0x101ef8 > 0x3;
        break;
      case _0x363c12(0x13a):
        _0x391a49 = _0x101ef8 < 0x4;
        break;
      case _0x363c12(0x148):
        _0x391a49 = _0x101ef8 >= 0x5;
        break;
      case _0x363c12(0x12a):
        _0x391a49 = _0x101ef8 === 0x1;
        break;
      case _0x363c12(0x16d):
        _0x391a49 = _0x101ef8 === 0x2;
        break;
      case "exact3":
        _0x391a49 = _0x101ef8 === 0x3;
        break;
      case _0x363c12(0x14f):
        _0x391a49 = _0x101ef8 === 0x4;
        break;
    }
    _0x391a49 &&
      (_0x499760[_0x4ebe7d][_0x363c12(0x1ac)]++,
      _0x499760[_0x8a0692][_0x363c12(0x1ac)]++);
    if (_0x248bc8 === _0x363c12(0x155) && _0x23eca7 > _0x4c2d75)
      _0x499760[_0x4ebe7d][_0x363c12(0x1ac)]++;
    if (_0x248bc8 === _0x363c12(0x137) && _0x4c2d75 > _0x23eca7)
      _0x499760[_0x8a0692]["marketCount"]++;
  });
  const _0x546d1f = Object[_0x5a1e0f(0x17d)](_0x499760)[_0x5a1e0f(0x164)](
    (_0x5bddfc) => ({
      ..._0x5bddfc,
      percentage:
        _0x5bddfc[_0x5a1e0f(0x19c)] > 0x0
          ? ((_0x5bddfc["marketCount"] / _0x5bddfc[_0x5a1e0f(0x19c)]) * 0x64)[
              _0x5a1e0f(0x127)
            ](0x1)
          : _0x5a1e0f(0x114),
    })
  );
  return (
    _0x546d1f[_0x5a1e0f(0x110)](
      (_0x107c30, _0x407005) =>
        _0x407005[_0x5a1e0f(0x1ac)] - _0x107c30[_0x5a1e0f(0x1ac)] ||
        parseFloat(_0x407005[_0x5a1e0f(0x12d)]) -
          parseFloat(_0x107c30["percentage"])
    ),
    _0x546d1f
  );
}
async function buscarDadosAPI(_0x34030a, _0xc3a8dd, _0x1f8777) {
  const _0x5613cc = _0x3ee2b2,
    _0xd46fa7 = casasConfig[_0x34030a];
  if (!_0xd46fa7)
    throw new Error(_0x5613cc(0x10d) + _0x34030a + _0x5613cc(0x1b4));
  const _0x52607c = {
    casa: _0xd46fa7[_0x5613cc(0x188)],
    liga: _0xc3a8dd,
    totalJogos: 0x0,
    dadosCru: [],
  };
  try {
    const _0x2d7fd1 = encodeURIComponent(_0xc3a8dd),
      _0x14203e = _0x5613cc(0x1b7);
    let _0x2b3204, _0x29f85c;
    _0xd46fa7[_0x5613cc(0x14a)]
      ? ((_0x2b3204 =
          _0x14203e +
          "/resultados/" +
          _0xd46fa7[_0x5613cc(0x14a)] +
          "/" +
          _0x2d7fd1),
        (_0x29f85c =
          _0x14203e +
          _0x5613cc(0x1a4) +
          _0xd46fa7[_0x5613cc(0x14a)] +
          "/" +
          _0x2d7fd1))
      : ((_0x2b3204 = _0x14203e + "/resultados/" + _0x2d7fd1),
        (_0x29f85c = _0x14203e + _0x5613cc(0x1a4) + _0x2d7fd1));
    const [_0x4fdf37, _0x4a76a1] = await Promise[_0x5613cc(0x166)]([
        fetch(_0x2b3204)[_0x5613cc(0x1aa)]((_0x486395) =>
          _0x486395[_0x5613cc(0x173)]()
        ),
        fetch(_0x29f85c)["then"]((_0x400685) => _0x400685[_0x5613cc(0x173)]()),
      ]),
      _0x594c26 = _0x4fdf37[_0x5613cc(0x172)](-_0x1f8777);
    for (const _0x2453a4 of _0x594c26) {
      const _0xd09209 = (_0x2453a4["ft"] || "x")
          ["split"]("x")
          [_0x5613cc(0x164)]((_0x4378ef) => parseInt(_0x4378ef["trim"](), 0xa)),
        _0x491a65 = _0xd09209[0x0],
        _0x56ba5a = _0xd09209[0x1];
      Number[_0x5613cc(0x15a)](_0x491a65) &&
        Number["isFinite"](_0x56ba5a) &&
        _0x52607c[_0x5613cc(0x13b)][_0x5613cc(0x106)]([
          _0x491a65,
          _0x56ba5a,
          _0x491a65 + _0x56ba5a,
          (_0x2453a4[_0x5613cc(0x1a1)] || "")[_0x5613cc(0x10b)](),
          (_0x2453a4[_0x5613cc(0x156)] || "")["trim"](),
          _0x2453a4[_0x5613cc(0x160)],
          _0x2453a4[_0x5613cc(0x11e)],
        ]);
    }
    return (
      (_0x52607c[_0x5613cc(0x141)] = _0x4a76a1["slice"](0x0, 0x6)),
      (_0x52607c[_0x5613cc(0x121)] = _0x52607c[_0x5613cc(0x13b)]["length"]),
      _0x52607c
    );
  } catch (_0x57809d) {
    console[_0x5613cc(0x191)](_0x5613cc(0x18a), _0x57809d);
    throw new Error(_0x5613cc(0x117) + _0x57809d["message"]);
  }
}
const ANALYZE_WORKER_SRC = _0x3ee2b2(0x1bf);
let ANALYZE_WORKER = null;
function getAnalyzeWorker() {
  const _0x41acce = _0x3ee2b2;
  if (!ANALYZE_WORKER) {
    const _0x202cd7 = new Blob([ANALYZE_WORKER_SRC], {
      type: _0x41acce(0x134),
    });
    ANALYZE_WORKER = new Worker(URL["createObjectURL"](_0x202cd7));
  }
  return ANALYZE_WORKER;
}
function analyzeInWorker(_0x52199f, _0xdf90b4) {
  return new Promise((_0x1f94ad, _0x59f403) => {
    const _0x32845d = _0x3065,
      _0x1a2867 = getAnalyzeWorker(),
      _0x3996cf = Math["random"]()
        [_0x32845d(0x1b9)](0x24)
        [_0x32845d(0x172)](0x2),
      _0x2e417a = (_0x5a479d) => {
        const _0x21ab75 = _0x32845d,
          _0xb59f35 = _0x5a479d[_0x21ab75(0x12e)];
        if (!_0xb59f35 || _0xb59f35["id"] !== _0x3996cf) return;
        _0x1a2867[_0x21ab75(0x112)](_0x21ab75(0x17e), _0x2e417a);
        if (_0xb59f35["ok"]) _0x1f94ad(_0xb59f35[_0x21ab75(0x1b8)]);
        else _0x59f403(_0xb59f35[_0x21ab75(0x191)] || _0x21ab75(0x199));
      };
    _0x1a2867["addEventListener"](_0x32845d(0x17e), _0x2e417a),
      _0x1a2867[_0x32845d(0x145)]({
        cmd: _0x32845d(0x195),
        id: _0x3996cf,
        payload: { dados: _0x52199f, ..._0xdf90b4 },
      });
  });
}
function mapMercado(_0x35dedf) {
  const _0x5523e2 = _0x3ee2b2,
    _0x758389 = {
      ambasMarcam: "ambasSim",
      ambasNaoMarcam: "ambasNao",
      casaVence: _0x5523e2(0x155),
      foraVence: _0x5523e2(0x137),
      empate: _0x5523e2(0x1a3),
      "over1.5": _0x5523e2(0x1a5),
      "over2.5": "over2.5",
      "over3.5": "over3.5",
      "under1.5": "under1.5",
      "under2.5": _0x5523e2(0x133),
      "under3.5": _0x5523e2(0x13a),
      exact1: _0x5523e2(0x12f),
      exact2: "doisGolsExatos",
      exact3: "tresGolsExatos",
      exact4: _0x5523e2(0x1b6),
      over5: _0x5523e2(0x19b),
    };
  return _0x758389[_0x35dedf] || _0x35dedf;
}
function checkMarket(_0x1061d0, _0x4d0d1f, _0x471410, _0x12fcb2) {
  const _0xfbe54e = _0x3ee2b2;
  switch (_0x1061d0) {
    case _0xfbe54e(0x14e):
      return _0x4d0d1f > 0x0 && _0x471410 > 0x0 ? 0x1 : 0x0;
    case "ambasNao":
      return _0x4d0d1f === 0x0 || _0x471410 === 0x0 ? 0x1 : 0x0;
    case _0xfbe54e(0x155):
      return _0x4d0d1f > _0x471410 ? 0x1 : 0x0;
    case _0xfbe54e(0x137):
      return _0x471410 > _0x4d0d1f ? 0x1 : 0x0;
    case "empate":
      return _0x4d0d1f === _0x471410 ? 0x1 : 0x0;
    case "over1.5":
      return _0x12fcb2 > 1.5 ? 0x1 : 0x0;
    case "over2.5":
      return _0x12fcb2 > 2.5 ? 0x1 : 0x0;
    case _0xfbe54e(0x1bd):
      return _0x12fcb2 > 3.5 ? 0x1 : 0x0;
    case _0xfbe54e(0x194):
      return _0x12fcb2 < 1.5 ? 0x1 : 0x0;
    case _0xfbe54e(0x133):
      return _0x12fcb2 < 2.5 ? 0x1 : 0x0;
    case _0xfbe54e(0x13a):
      return _0x12fcb2 < 3.5 ? 0x1 : 0x0;
    case _0xfbe54e(0x12f):
      return _0x12fcb2 === 0x1 ? 0x1 : 0x0;
    case _0xfbe54e(0x124):
      return _0x12fcb2 === 0x2 ? 0x1 : 0x0;
    case "tresGolsExatos":
      return _0x12fcb2 === 0x3 ? 0x1 : 0x0;
    case _0xfbe54e(0x1b6):
      return _0x12fcb2 === 0x4 ? 0x1 : 0x0;
    case _0xfbe54e(0x19b):
      return _0x12fcb2 >= 0x5 ? 0x1 : 0x0;
    default:
      return 0x0;
  }
}
function calculateMarketAnalysis(
  _0x2cc80e,
  _0x5a4e93,
  _0x472716,
  _0x1e0f20,
  _0x5efe50
) {
  const _0x40d61c = _0x3ee2b2,
    _0x3e084c = _0x2cc80e[_0x40d61c(0x13b)]
      [_0x40d61c(0x164)]((_0x29c35f) => [
        _0x29c35f[0x5]["toString"]()[_0x40d61c(0x182)](0x2, "0") +
          ":" +
          _0x29c35f[0x6][_0x40d61c(0x1b9)]()["padStart"](0x2, "0"),
        _0x29c35f[0x0],
        _0x29c35f[0x1],
        _0x29c35f[0x3],
        _0x29c35f[0x4],
        _0x29c35f[0x2],
        _0x2cc80e[_0x40d61c(0x17b)]["toLowerCase"](),
      ])
      ["slice"](-_0x472716);
  if (_0x3e084c[_0x40d61c(0x132)] === 0x0)
    return { currentPercentage: 0x0, top5: [] };
  const _0x14cfde = _0x3e084c[_0x40d61c(0x172)](-_0x1e0f20),
    _0x16c003 = _0x14cfde[_0x40d61c(0x119)](
      (_0x24b152, _0x34f8ee) =>
        _0x24b152 +
        checkMarket(_0x5a4e93, _0x34f8ee[0x1], _0x34f8ee[0x2], _0x34f8ee[0x5]),
      0x0
    ),
    _0x416274 = ((_0x16c003 / _0x1e0f20) * 0x64)[_0x40d61c(0x127)](0x0),
    _0x1c141d = {};
  _0x3e084c[_0x40d61c(0x1c0)]((_0x4ae45a, _0x42fbe2) => {
    const _0xc4638b = _0x40d61c,
      [
        _0x5b7288,
        _0x5ccedb,
        _0x29e3bf,
        _0x1807a2,
        _0x168abf,
        _0x25debe,
        _0x4cb59a,
      ] = _0x4ae45a;
    if (_0x42fbe2 >= _0x1e0f20 - 0x1) {
      const _0x46f5af = _0x3e084c[_0xc4638b(0x172)](
          _0x42fbe2 - _0x1e0f20 + 0x1,
          _0x42fbe2 + 0x1
        )["reduce"](
          (_0x1d29da, _0x21d4f4) =>
            _0x1d29da +
            checkMarket(
              _0x5a4e93,
              _0x21d4f4[0x1],
              _0x21d4f4[0x2],
              _0x21d4f4[0x5]
            ),
          0x0
        ),
        _0x1ac7e8 = Math[_0xc4638b(0x13c)]((_0x46f5af / _0x1e0f20) * 0x64);
      let _0x586d8d = _0xc4638b(0x136),
        _0x128d4a = 0x0,
        _0x220b9c = 0x0;
      if (_0x42fbe2 + _0x5efe50 <= _0x3e084c[_0xc4638b(0x132)]) {
        const _0x3dbc92 = _0x3e084c["slice"](
          _0x42fbe2 + 0x1,
          _0x42fbe2 + 0x1 + _0x5efe50
        );
        (_0x128d4a = _0x3dbc92["filter"](
          (_0x5df60d) =>
            checkMarket(
              _0x5a4e93,
              _0x5df60d[0x1],
              _0x5df60d[0x2],
              _0x5df60d[0x5]
            ) === 0x1
        )["length"]),
          (_0x220b9c = _0x5efe50 - _0x128d4a);
        const _0x2bb5b8 = _0x3dbc92["some"](
          (_0x1265f3) =>
            checkMarket(
              _0x5a4e93,
              _0x1265f3[0x1],
              _0x1265f3[0x2],
              _0x1265f3[0x5]
            ) === 0x1
        );
        _0x2bb5b8 && (_0x586d8d = _0xc4638b(0x162));
      }
      const _0x3f5c56 = _0x5a4e93 + "\x20" + _0x1ac7e8 + "%";
      !_0x1c141d[_0x3f5c56] &&
        (_0x1c141d[_0x3f5c56] = {
          occurrences: 0x0,
          greens: 0x0,
          reds: 0x0,
          totalGreens: _0x128d4a,
          totalReds: _0x220b9c,
        }),
        (_0x1c141d[_0x3f5c56][_0xc4638b(0x140)] += 0x1),
        _0x586d8d === _0xc4638b(0x162)
          ? (_0x1c141d[_0x3f5c56][_0xc4638b(0x180)] += 0x1)
          : (_0x1c141d[_0x3f5c56][_0xc4638b(0x12c)] += 0x1),
        (_0x1c141d[_0x3f5c56][_0xc4638b(0x17a)] = _0x128d4a),
        (_0x1c141d[_0x3f5c56]["totalReds"] = _0x220b9c);
    }
  });
  const _0x38e93d = Object[_0x40d61c(0x1be)](_0x1c141d)
      ["map"]((_0x599d78) => {
        const _0x5f7c0c = _0x40d61c,
          _0x745def = _0x1c141d[_0x599d78],
          _0x57ba46 = ((_0x745def[_0x5f7c0c(0x180)] /
            _0x745def[_0x5f7c0c(0x140)]) *
            0x64)["toFixed"](0x2);
        let _0x3fab6b = "";
        const _0x597c0b = parseFloat(_0x57ba46);
        if (_0x597c0b > 0x4b) _0x3fab6b = _0x5f7c0c(0x11f);
        else {
          if (_0x597c0b > 0x32) _0x3fab6b = "Moderada\x20chance";
          else
            _0x597c0b > 0x19
              ? (_0x3fab6b = _0x5f7c0c(0x151))
              : (_0x3fab6b = "Alta\x20chance\x20de\x20falha");
        }
        return {
          marketGroup: _0x599d78,
          marketPercentage: parseFloat(_0x599d78["split"]("\x20")[0x1]),
          occurrences: _0x745def[_0x5f7c0c(0x140)],
          greens: _0x745def[_0x5f7c0c(0x180)],
          reds: _0x745def[_0x5f7c0c(0x12c)],
          greenPercentage: _0x57ba46,
          totalGreens: _0x745def[_0x5f7c0c(0x17a)],
          totalReds: _0x745def["totalReds"],
          analysis: _0x3fab6b,
        };
      })
      [_0x40d61c(0x110)](
        (_0x5af181, _0x3fa27e) =>
          _0x3fa27e["greenPercentage"] - _0x5af181[_0x40d61c(0x193)] ||
          _0x3fa27e[_0x40d61c(0x180)] - _0x5af181[_0x40d61c(0x180)]
      )
      ["slice"](0x0, 0x64),
    _0x332f78 = _0x38e93d[_0x40d61c(0x172)](0x0, 0x5);
  return { currentPercentage: _0x416274, top5: _0x332f78 };
}
function criarPromptAnalise(_0x1f6016, _0x5122c7) {
  const _0x1b1ff3 = _0x3ee2b2;
  return (
    _0x1b1ff3(0x161) +
    _0x1f6016[_0x1b1ff3(0x158)] +
    _0x1b1ff3(0x149) +
    _0x1f6016["liga"] +
    _0x1b1ff3(0x143) +
    _0x5122c7["mercado"] +
    "\x0a-\x20Total\x20de\x20jogos\x20analisados:\x20" +
    _0x1f6016["totalJogos"] +
    _0x1b1ff3(0x19f) +
    _0x5122c7[_0x1b1ff3(0x1a7)] +
    "\x0a-\x20Observações\x20do\x20Usuário:\x20" +
    (_0x5122c7[_0x1b1ff3(0x118)] || "Nenhuma") +
    "\x0a" +
    (_0x5122c7[_0x1b1ff3(0x10f)]
      ? "-\x20Imagem\x20fornecida:\x20Uma\x20imagem\x20foi\x20enviada\x20para\x20análise\x20adicional."
      : "") +
    _0x1b1ff3(0x1a9) +
    _0x5122c7["mercado"] +
    _0x1b1ff3(0x179) +
    JSON[_0x1b1ff3(0x19d)](
      _0x1f6016[_0x1b1ff3(0x177)][_0x1b1ff3(0x172)](0x0, 0xa),
      null,
      0x2
    ) +
    _0x1b1ff3(0x16b) +
    _0x5122c7[_0x1b1ff3(0x13e)] +
    _0x1b1ff3(0x126) +
    JSON[_0x1b1ff3(0x19d)](_0x1f6016["padroesEncontrados"], null, 0x2) +
    _0x1b1ff3(0x17f) +
    JSON[_0x1b1ff3(0x19d)](_0x1f6016[_0x1b1ff3(0x141)], null, 0x2) +
    _0x1b1ff3(0x15e) +
    _0x5122c7[_0x1b1ff3(0x13e)] +
    _0x1b1ff3(0x1ba) +
    _0x1f6016["marketAnalysis"]["currentPercentage"] +
    _0x1b1ff3(0x11d) +
    JSON[_0x1b1ff3(0x19d)](
      _0x1f6016["marketAnalysis"][_0x1b1ff3(0x13f)],
      null,
      0x2
    ) +
    _0x1b1ff3(0x142)
  );
}
async function analisarComGemini(_0x212aa8, _0x3ae79a) {
  const _0x1197c5 = _0x3ee2b2,
    _0x44485d = criarPromptAnalise(_0x212aa8, _0x3ae79a),
    _0xf31c63 = await fetch(GEMINI_URL + "?key=" + GEMINI_API_KEY, {
      method: "POST",
      headers: { "Content-Type": _0x1197c5(0x1b2) },
      body: JSON[_0x1197c5(0x19d)]({
        contents: [{ parts: [{ text: _0x44485d }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 0x28,
          topP: 0.95,
          maxOutputTokens: 0x800,
        },
      }),
    });
  if (!_0xf31c63["ok"]) {
    const _0x453ef4 = await _0xf31c63[_0x1197c5(0x173)]();
    console[_0x1197c5(0x191)](_0x1197c5(0x159), _0x453ef4);
    throw new Error(_0x1197c5(0x15c) + _0xf31c63["status"]);
  }
  const _0x209c3e = await _0xf31c63[_0x1197c5(0x173)]();
  return _0x209c3e[_0x1197c5(0x16a)][0x0]["content"][_0x1197c5(0x1bc)][0x0][
    "text"
  ];
}
function _0x5c09() {
  const _0x15f4e9 = [
    "Risco\x20elevado",
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    "20352663uREyIx",
    "Euro",
    "casaVence",
    "time_b",
    "Brasil",
    "casa",
    "Erro\x20na\x20API\x20Gemini:",
    "isFinite",
    "martingale-group",
    "Erro\x20na\x20API\x20do\x20Gemini:\x20",
    "block",
    "\x0a\x0a4.\x20ANÁLISE\x20DE\x20GRÁFICO\x20DE\x20MERCADO\x20PARA\x20O\x20MERCADO\x20\x22",
    "result-title",
    "hora",
    "\x0aVocê\x20é\x20um\x20analista\x20especialista\x20em\x20futebol\x20virtual,\x20focado\x20em\x20interpretar\x20dados\x20pré-processados\x20para\x20identificar\x20oportunidades\x20de\x20investimento\x20de\x20alto\x20valor.\x0a\x0aDADOS\x20PARA\x20ANÁLISE:\x0a-\x20Casa:\x20",
    "green",
    "betsson",
    "map",
    "<br><br>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<strong>Causas\x20possíveis:</strong>\x20Falha\x20na\x20API\x20BetStat,\x20erro\x20na\x20análise\x20de\x20padrões\x20ou\x20limite\x20da\x20API\x20Gemini\x20atingido.\x20Verifique\x20o\x20console\x20para\x20mais\x20detalhes.\x20Se\x20for\x20erro\x20404\x20na\x20Gemini,\x20obtenha\x20uma\x20nova\x20chave\x20API\x20em\x20https://aistudio.google.com/app/apikey\x20e\x20substitua\x20no\x20código.\x20Além\x20disso,\x20verifique\x20se\x20o\x20nome\x20do\x20modelo\x20está\x20correto\x20(ex:\x20gemini-2.5-flash).\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>",
    "all",
    "target",
    "mercados-group",
    "appendChild",
    "candidates",
    "\x0a\x0a2.\x20TOP\x2015\x20PADRÕES\x20ENCONTRADOS\x20PARA\x20O\x20MERCADO\x20\x22",
    "1716438zwmKwd",
    "exact2",
    "createElement",
    "disabled",
    "onload",
    "10JSaYqO",
    "slice",
    "json",
    "<div\x20class=\x22loading\x22><div\x20class=\x22spinner\x22></div>Gerando\x20análise\x20com\x20IA...</div>",
    "split",
    "btn",
    "ranking",
    "AIzaSyAwrtYzlQxzMfBHK3k6sw5qAWTS7jBSSNQ",
    "\x22\x20(Top\x2010):\x0a",
    "totalGreens",
    "liga",
    "3358965bvsvVR",
    "values",
    "message",
    "\x0a\x0a3.\x20PRÓXIMOS\x206\x20CONFRONTOS:\x0a",
    "greens",
    "innerText",
    "padStart",
    "Nenhum\x20arquivo\x20selecionado",
    "❌\x20Erro\x20na\x20Análise",
    "Nenhum",
    "change",
    "Betano",
    "name",
    "Spain",
    "Erro\x20ao\x20buscar\x20dados\x20da\x20API:",
    "result-container",
    "ambasNaoMarcam",
    "<div\x20class=\x22spinner\x22></div>\x20Processando...",
    "kiron",
    "casas-group",
    "England",
    "error",
    "4kmkWKX",
    "greenPercentage",
    "under1.5",
    "analyze",
    ".btn-grid",
    "active",
    "8BBDjHw",
    "Erro\x20no\x20worker\x20de\x20análise",
    "liga-section",
    "cincoOuMaisGols",
    "totalGames",
    "stringify",
    "Estrelabet",
    "\x0a-\x20Estratégia\x20Martingale:\x20",
    "addEventListener",
    "time_a",
    "remove",
    "empate",
    "/proximos/",
    "over1.5",
    "ligas",
    "martingale",
    "display",
    "\x0a\x0aINFORMAÇÕES\x20PRÉ-PROCESSADAS:\x0a\x0a1.\x20RANKING\x20DE\x20TIMES\x20PARA\x20O\x20MERCADO\x20\x22",
    "then",
    "innerHTML",
    "marketCount",
    "image-preview",
    "image-status",
    "includes",
    "image-upload",
    "\x20x\x20",
    "application/json",
    "Kiron",
    "\x20não\x20encontrada",
    "querySelectorAll",
    "quatroGolsExatos",
    "https://betstat.site",
    "result",
    "toString",
    "\x22:\x0aPorcentagem\x20Atual:\x20",
    "1556556kjGTvt",
    "parts",
    "over3.5",
    "keys",
    "\x0a\x20\x20\x20\x20\x20\x20\x20\x20self.onmessage\x20=\x20(e)\x20=>\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20p\x20=\x20e.data;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(!p\x20||\x20p.cmd\x20!==\x20\x27analyze\x27)\x20return;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20res\x20=\x20analyzeAll(p.payload);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20self.postMessage({\x20ok:\x20true,\x20id:\x20p.id,\x20result:\x20res\x20});\x0a\x20\x20\x20\x20\x20\x20\x20\x20};\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20enumerateCombos(tok){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(tok.length===1)\x20return\x20tok[0].map(t=>[t]);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(tok.length===2){\x20const\x20out=[];\x20for(const\x20a\x20of\x20tok[0])\x20for(const\x20b\x20of\x20tok[1])\x20out.push([a,b]);\x20return\x20out;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(tok.length===3){\x20const\x20out=[];\x20for(const\x20a\x20of\x20tok[0])\x20for(const\x20b\x20of\x20tok[1])\x20for(const\x20c\x20of\x20tok[2])\x20out.push([a,b,c]);\x20return\x20out;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20out=[],cur=[];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20(function\x20rec(i){\x20if(i===tok.length){\x20out.push(cur.slice());\x20return;\x20}\x20for(const\x20t\x20of\x20tok[i]){\x20cur.push(t);\x20rec(i+1);\x20cur.pop();\x20}\x20})(0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20out;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20getOffsetsByTipo(t){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(t===\x271\x27)\x20return\x20[0];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(t===\x272\x27)\x20return\x20[0,1];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(t===\x273\x27)\x20return\x20[0,1,2];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(t===\x271_pula_1\x27)\x20return\x20[0,2];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(t===\x271_pula_1_pula_1\x27)\x20return\x20[0,2,4];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20[0,1];\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20tokensDoJogo(a,b,total,mandante,visitante){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20t\x20=\x20new\x20Set();\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20t.add(`${a}-${b}`);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20t.add(a\x20>\x200\x20&&\x20b\x20>\x200\x20?\x20\x27ambasMarcam\x27\x20:\x20\x27ambasNaoMarcam\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20t.add(a\x20>\x20b\x20?\x20\x27casaVence\x27\x20:\x20(a\x20<\x20b\x20?\x20\x27foraVence\x27\x20:\x20\x27empate\x27));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20>=\x202)\x20t.add(\x27over1.5\x27);\x20if\x20(total\x20<\x202)\x20t.add(\x27under1.5\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20>=\x203)\x20t.add(\x27over2.5\x27);\x20if\x20(total\x20<\x203)\x20t.add(\x27under2.5\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20>=\x204)\x20t.add(\x27over3.5\x27);\x20if\x20(total\x20<\x204)\x20t.add(\x27under3.5\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20>=\x205)\x20t.add(\x27over5\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20===\x201)\x20t.add(\x27exact1\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20===\x202)\x20t.add(\x27exact2\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20===\x203)\x20t.add(\x27exact3\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(total\x20===\x204)\x20t.add(\x27exact4\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(mandante)\x20t.add(mandante.toLowerCase());\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(visitante)\x20t.add(visitante.toLowerCase());\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20Array.from(t);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20isGreenForMarket(m,a,b,total){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27ambasMarcam\x27)\x20return\x20a\x20>\x200\x20&&\x20b\x20>\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27ambasNaoMarcam\x27)\x20return\x20a\x20===\x200\x20||\x20b\x20===\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27casaVence\x27)\x20return\x20a\x20>\x20b;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27foraVence\x27)\x20return\x20a\x20<\x20b;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27empate\x27)\x20return\x20a\x20===\x20b;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27over1.5\x27)\x20return\x20total\x20>=\x202;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27under1.5\x27)\x20return\x20total\x20<\x202;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27over2.5\x27)\x20return\x20total\x20>=\x203;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27under2.5\x27)\x20return\x20total\x20<\x203;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27over3.5\x27)\x20return\x20total\x20>=\x204;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27under3.5\x27)\x20return\x20total\x20<\x204;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27over5\x27)\x20return\x20total\x20>=\x205;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27exact1\x27)\x20return\x20total\x20===\x201;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27exact2\x27)\x20return\x20total\x20===\x202;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27exact3\x27)\x20return\x20total\x20===\x203;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(m\x20===\x20\x27exact4\x27)\x20return\x20total\x20===\x204;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20false;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20analisarAutoPadroes(dados,tipo,tiros,market,inicio,fim){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20res=[];\x20const\x20offs=getOffsetsByTipo(tipo);\x20const\x20last=offs[offs.length-1];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(let\x20p=inicio;p<=fim;p++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20comb={};\x20const\x20need=(last+1)+p+tiros;\x20if(dados.length<need)\x20continue;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(let\x20i=0;i<=dados.length-need;i++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20tok=[];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(const\x20o\x20of\x20offs){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20[a,b,t,mandante,visitante]=dados[i+o];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20tok.push(tokensDoJogo(a,b,t,mandante,visitante));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20combos=enumerateCombos(tok);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20green=false;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20ini=i+last+1+p,\x20fimA=ini+tiros;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(let\x20j=ini;j<fimA&&j<dados.length;j++){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20[a,b,sum]=dados[j];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(isGreenForMarket(market,a,b,sum)){\x20green=true;\x20break;\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(const\x20seq\x20of\x20combos){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20key=seq.join(\x27\x20|\x20\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(!comb[key]){\x20comb[key]={ocorrencias:0,greens:0};\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20comb[key].ocorrencias++;\x20if(green)\x20comb[key].greens++;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(const\x20k\x20in\x20comb){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20st=comb[k];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if(st.ocorrencias>=3){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20res.push({\x20padrao:k,\x20pular_jogos:p,\x20ocorrencias:st.ocorrencias,\x20greens:st.greens,\x20percentual:((st.greens/st.ocorrencias)*100).toFixed(1)\x20});\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20res.sort((a,b)=>parseFloat(b.percentual)-parseFloat(a.percentual)||b.ocorrencias-a.ocorrencias);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20res.slice(0,15);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20function\x20analyzeAll(payload){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20{\x20dados,\x20tiros,\x20market,\x20combinado\x20}\x20=\x20payload;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20tipos\x20=\x20combinado\x20?\x20[\x272\x27,\x273\x27,\x271_pula_1\x27,\x271_pula_1_pula_1\x27]\x20:\x20[\x272\x27];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20todos=[];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20for(const\x20t\x20of\x20tipos){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20r\x20=\x20analisarAutoPadroes(dados,\x20t,\x20tiros,\x20market,\x201,\x2010);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20r.forEach(x=>x.tipo_padrao=t);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20todos\x20=\x20todos.concat(r);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20todos.sort((a,b)=>parseFloat(b.percentual)-parseFloat(a.percentual)||b.ocorrencias-a.ocorrencias);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20{\x20resultados:\x20todos.slice(0,15)\x20};\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20",
    "forEach",
    "push",
    "ambasMarcam",
    "\x20jogos...</div>",
    "Taça\x20Glória\x20Eterna",
    "none",
    "trim",
    "textContent",
    "Casa\x20",
    "periodo-group",
    "imagem",
    "sort",
    "1164940jHEAfl",
    "removeEventListener",
    "\x20jogos",
    "0.0",
    "estrela",
    "className",
    "Falha\x20ao\x20conectar\x20com\x20a\x20API:\x20",
    "observacao",
    "reduce",
    "click",
    "dataset",
    "973298KOWHCh",
    "%\x0aTop\x205\x20Melhores\x20Porcentagens:\x0a",
    "minuto",
    "Alta\x20chance\x20de\x20acerto",
    "value",
    "totalJogos",
    "getElementById",
    "classList",
    "doisGolsExatos",
    "padroesEncontrados",
    "\x22:\x0a",
    "toFixed",
    "button",
    "add",
    "exact1",
    "files",
    "reds",
    "percentage",
    "data",
    "umGolExato",
    "Gerar\x20Análise\x20IA",
    "Erro\x20no\x20processo\x20de\x20análise:",
    "length",
    "under2.5",
    "application/javascript",
    "querySelector",
    "red",
    "foraVence",
    "Copa\x20América",
    "ligas-group",
    "under3.5",
    "dadosCru",
    "round",
    ".btn.active",
    "mercado",
    "top5",
    "occurrences",
    "proximos",
    "\x0a\x0aINSTRUÇÕES\x20DE\x20ANÁLISE\x20(SUA\x20TAREFA):\x0a1.\x20\x20Sua\x20missão\x20é\x20conectar\x20as\x20informações\x20acima.\x20Não\x20processe\x20dados\x20brutos,\x20apenas\x20interprete\x20os\x20resultados\x20que\x20eu\x20forneci.\x0a2.\x20\x20Analise\x20os\x20\x22TOP\x2015\x20PADRÕES\x22.\x20Identifique\x20quais\x20têm\x20o\x20maior\x20percentual\x20de\x20acerto\x20(percentual)\x20e\x20um\x20número\x20sólido\x20de\x20ocorrências.\x20Padrões\x20com\x20100%\x20de\x20acerto\x20e\x20poucas\x20ocorrências\x20são\x20promissores,\x20mas\x20de\x20alto\x20risco.\x0a3.\x20\x20Observe\x20os\x20\x22PRÓXIMOS\x206\x20CONFRONTOS\x22.\x20Verifique\x20se\x20algum\x20desses\x20jogos\x20envolve\x20times\x20que\x20estão\x20bem\x20posicionados\x20no\x20\x22RANKING\x20DE\x20TIMES\x22.\x0a4.\x20\x20Cruze\x20as\x20informações:\x20A\x20oportunidade\x20de\x20maior\x20valor\x20acontece\x20quando\x20um\x20padrão\x20forte\x20aponta\x20para\x20um\x20dos\x20próximos\x20confrontos\x20E\x20esse\x20confronto\x20envolve\x20times\x20com\x20bom\x20desempenho\x20histórico\x20no\x20mercado.\x0a5.\x20\x20Se\x20uma\x20imagem\x20foi\x20fornecida,\x20considere\x20que\x20ela\x20pode\x20conter\x20informações\x20visuais\x20complementares\x20(como\x20estatísticas\x20ou\x20gráficos)\x20e\x20mencione\x20que\x20ela\x20foi\x20considerada\x20na\x20análise,\x20mas\x20não\x20tente\x20descrevê-la\x20diretamente.\x0a6.\x20\x20Baseado\x20nesta\x20síntese,\x20gere\x20a\x20sua\x20análise\x20no\x20formato\x20abaixo.\x20O\x20número\x20de\x20sugestões\x20de\x20horários\x20deve\x20seguir\x20a\x20estratégia\x20Martingale\x20(Nenhum\x20=\x201\x20jogo,\x201\x20Cobertura\x20=\x202\x20jogos,\x202\x20Coberturas\x20=\x203\x20jogos,\x203\x20Coberturas\x20=\x204\x20jogos).\x0a7.\x20\x20Se\x20nenhum\x20padrão\x20forte\x20se\x20alinhar\x20com\x20os\x20próximos\x20jogos\x20de\x20times\x20bem\x20ranqueados,\x20seja\x20honesto\x20e\x20informe\x20que\x20nenhuma\x20oportunidade\x20clara\x20foi\x20encontrada.\x0a8.\x20\x20Para\x20as\x20sugestões\x20de\x20horários:\x20Selecione\x20o\x20próximo\x20confronto\x20que\x20melhor\x20se\x20alinha\x20com\x20padrões\x20fortes\x20e\x20times\x20bem\x20ranqueados\x20como\x20o\x20principal.\x20Em\x20seguida,\x20adicione\x20as\x20coberturas\x20como\x20os\x20confrontos\x20sequenciais\x20seguintes.\x20Garanta\x20que\x20os\x20horários\x20estejam\x20em\x20sequência\x20cronológica\x20crescente,\x20sem\x20repetições,\x20e\x20baseados\x20exclusivamente\x20nos\x20horários\x20fornecidos\x20nos\x20próximos\x20confrontos.\x20Assuma\x20que\x20a\x20lista\x20de\x20próximos\x20está\x20ordenada\x20por\x20tempo,\x20e\x20selecione\x20apenas\x20horários\x20futuros\x20ou\x20os\x20mais\x20próximos.\x20O\x20primeiro\x20horário\x20é\x20o\x20principal\x20com\x20padrão\x20e\x20análise,\x20os\x20demais\x20são\x20coberturas.\x0a9.\x20\x20Inclua\x20uma\x20seção\x20independente\x20para\x20a\x20Análise\x20de\x20Gráfico\x20de\x20Mercado,\x20comentando\x20a\x20porcentagem\x20atual\x20e\x20destacando\x20as\x20top\x205\x20melhores\x20porcentagens,\x20considerando\x20o\x20Martingale\x20selecionado\x20para\x20a\x20verificação.\x0a\x0aFORMATO\x20DA\x20RESPOSTA\x20(Use\x20um\x20tom\x20natural\x20e\x20profissional,\x20evite\x20usar\x20negrito\x20com\x20asteriscos\x20**):\x0a\x0a🎯\x20ANÁLISE\x20ESTATÍSTICA\x0a[Comente\x20brevemente\x20sobre\x20o\x20desempenho\x20dos\x20times\x20no\x20ranking\x20e\x20a\x20força\x20geral\x20dos\x20padrões\x20encontrados.\x20Ex:\x20\x22Observa-se\x20que\x20os\x20times\x20X\x20e\x20Y\x20são\x20dominantes\x20neste\x20mercado.\x20Foram\x20encontrados\x20N\x20padrões\x20com\x20mais\x20de\x2080%\x20de\x20acerto,\x20indicando\x20consistência...\x22]\x0a\x0a📊\x20PADRÕES\x20RELEVANTES\x0a[Destaque\x202\x20ou\x203\x20dos\x20padrões\x20mais\x20promissores\x20da\x20lista,\x20explicando\x20por\x20que\x20são\x20relevantes.\x20Ex:\x20\x22O\x20padrão\x20\x27over2.5\x20|\x201-2\x27\x20se\x20destaca\x20com\x2085%\x20de\x20acerto\x20em\x2020\x20ocorrências,\x20mostrando\x20ser\x20um\x20gatilho\x20confiável...\x22]\x0a\x0a📈\x20ANÁLISE\x20DE\x20GRÁFICO\x20DE\x20MERCADO\x0a[Comente\x20sobre\x20a\x20porcentagem\x20atual\x20do\x20mercado\x20e\x20destaque\x20as\x20top\x205\x20melhores\x20porcentagens,\x20incluindo\x20greenPercentage,\x20occurrences,\x20etc.,\x20considerando\x20o\x20Martingale\x20selecionado\x20para\x20a\x20verificação\x20de\x20linhas.]\x0a\x0a⚡\x20PRÓXIMAS\x20OPORTUNIDADES\x0a[Baseado\x20na\x20sua\x20análise\x20combinada,\x20liste\x20as\x20entradas\x20recomendadas.\x20Se\x20nenhuma\x20for\x20encontrada,\x20justifique\x20o\x20motivo.\x0aFormato\x20se\x20encontrar:\x0aLiga:\x20[liga]\x0aMercado:\x20[mercado]\x0a⏰\x20Horários\x0a▸\x20[hora:minuto]\x20▸\x20[hora:minuto]\x20...\x20(número\x20baseado\x20na\x20Martingale,\x20em\x20sequência\x20sem\x20repetições)\x0aJustificativa:\x20[Breve\x20explicação\x20do\x20porquê\x20esta\x20é\x20uma\x20boa\x20entrada,\x20mencionando\x20o\x20padrão\x20e\x20os\x20times\x20envolvidos.\x20Note\x20que\x20o\x20primeiro\x20horário\x20é\x20o\x20principal\x20onde\x20padrões\x20foram\x20encontrados,\x20os\x20demais\x20são\x20coberturas\x20sequenciais.]\x0a\x0a🎲\x20ESTRATÉGIA\x20MARTINGALE\x0a[Avalie\x20a\x20segurança\x20da\x20estratégia\x20para\x20este\x20cenário.\x20Ex:\x20\x22Considerando\x20a\x20força\x20dos\x20padrões\x20encontrados,\x20a\x20estratégia\x20de\x20[N]\x20coberturas\x20parece\x20[segura/arriscada]...\x22]\x0a\x0a💡\x20RECOMENDAÇÃO\x20FINAL\x0a[Dê\x20uma\x20recomendação\x20final\x20clara\x20e\x20objetiva.\x20Ex:\x20\x22Recomendo\x20a\x20entrada\x20nos\x20horários\x20sugeridos\x20devido\x20à\x20forte\x20confluência\x20entre\x20o\x20padrão\x20X\x20e\x20o\x20confronto\x20envolvendo\x20o\x20time\x20Y,\x20que\x20possui\x20um\x20histórico\x20excelente\x20neste\x20mercado.\x22]\x0a",
    "\x0a-\x20Mercado:\x20",
    "331808MyzWQN",
    "postMessage",
    "<div\x20class=\x22loading\x22><div\x20class=\x22spinner\x22></div>Coletando\x20",
    "over2.5",
    "over5",
    "\x0a-\x20Liga:\x20",
    "path",
    "✓\x20Análise\x20Concluída\x20-\x20",
    "Betsson",
    "marketAnalysis",
    "ambasSim",
    "exact4",
    "style",
  ];
  _0x5c09 = function () {
    return _0x15f4e9;
  };
  return _0x5c09();
}
async function gerarAnalise() {
  const _0xb59fbd = _0x3ee2b2,
    _0x123d5d = getSelectedValue(_0xb59fbd(0x18f)),
    _0x18363c = getSelectedValue(_0xb59fbd(0x139)),
    _0x5512bc = getSelectedValue(_0xb59fbd(0x168)),
    _0x37d52e = getSelectedText("mercados-group"),
    _0x1d0a4e = parseInt(getSelectedValue(_0xb59fbd(0x15b)) || "0", 0xa),
    _0x4e3d30 = getSelectedText(_0xb59fbd(0x15b)),
    _0x4e4fb3 = getSelectedValue(_0xb59fbd(0x10e)),
    _0xc84bc7 = document[_0xb59fbd(0x122)](_0xb59fbd(0x118))[_0xb59fbd(0x120)],
    _0x33d3f9 = document["getElementById"](_0xb59fbd(0x1b0))[
      _0xb59fbd(0x12b)
    ][0x0];
  if (!_0x123d5d || !_0x18363c || !_0x5512bc || !_0x4e4fb3) {
    alert(
      "Por\x20favor,\x20selecione\x20Casa,\x20Liga,\x20Mercado\x20e\x20Período\x20de\x20Análise."
    );
    return;
  }
  const _0x4521ef = document[_0xb59fbd(0x135)](".btn-generate"),
    _0x3acb10 = document[_0xb59fbd(0x122)](_0xb59fbd(0x18b)),
    _0x222607 = document[_0xb59fbd(0x122)](_0xb59fbd(0x15f)),
    _0x446d35 = document[_0xb59fbd(0x122)]("result-content");
  (_0x4521ef[_0xb59fbd(0x16f)] = !![]),
    (_0x4521ef[_0xb59fbd(0x1ab)] = _0xb59fbd(0x18d)),
    (_0x3acb10[_0xb59fbd(0x150)][_0xb59fbd(0x1a8)] = "block"),
    (_0x446d35["innerHTML"] = "");
  try {
    _0x222607[_0xb59fbd(0x1ab)] =
      _0xb59fbd(0x146) + _0x4e4fb3 + _0xb59fbd(0x108);
    const _0x3bab09 = await buscarDadosAPI(
      _0x123d5d,
      _0x18363c,
      parseInt(_0x4e4fb3)
    );
    (_0x3bab09[_0xb59fbd(0x177)] = calcularRankingTimes(
      _0x3bab09[_0xb59fbd(0x13b)][_0xb59fbd(0x164)]((_0x253d05) => ({
        time_a: _0x253d05[0x3],
        time_b: _0x253d05[0x4],
        ft: _0x253d05[0x0] + _0xb59fbd(0x1b1) + _0x253d05[0x1],
      })),
      _0x5512bc
    )),
      (_0x222607["innerHTML"] =
        "<div\x20class=\x22loading\x22><div\x20class=\x22spinner\x22></div>Analisando\x20padrões...</div>");
    const _0x14ca0d = _0x1d0a4e + 0x1,
      { resultados: _0x37905a } = await analyzeInWorker(
        _0x3bab09[_0xb59fbd(0x13b)],
        { tiros: _0x14ca0d, market: _0x5512bc, combinado: !![] }
      );
    _0x3bab09[_0xb59fbd(0x125)] = _0x37905a;
    const _0x557989 = mapMercado(_0x5512bc),
      _0x351dd9 = _0x123d5d === _0xb59fbd(0x18e) ? 0x1e : 0x14,
      _0x5b0c5f = _0x1d0a4e + 0x1;
    (_0x3bab09[_0xb59fbd(0x14d)] = calculateMarketAnalysis(
      _0x3bab09,
      _0x557989,
      _0x3bab09[_0xb59fbd(0x121)],
      _0x351dd9,
      _0x5b0c5f
    )),
      (_0x222607[_0xb59fbd(0x1ab)] = _0xb59fbd(0x174));
    const _0x58ebad = {
        mercado: _0x37d52e,
        liga: _0x18363c,
        martingale: _0x4e3d30 || _0xb59fbd(0x185),
        periodo: _0x4e4fb3 + _0xb59fbd(0x113),
        observacao: _0xc84bc7,
        imagem: _0x33d3f9 ? !![] : ![],
      },
      _0x556e27 = await analisarComGemini(_0x3bab09, _0x58ebad);
    (_0x222607[_0xb59fbd(0x1ab)] =
      _0xb59fbd(0x14b) +
      casasConfig[_0x123d5d][_0xb59fbd(0x188)] +
      "\x20(" +
      _0x18363c +
      ")"),
      (_0x446d35["textContent"] = _0x556e27);
  } catch (_0x205b9c) {
    console[_0xb59fbd(0x191)](_0xb59fbd(0x131), _0x205b9c),
      (_0x222607[_0xb59fbd(0x1ab)] = _0xb59fbd(0x184)),
      (_0x446d35[_0xb59fbd(0x1ab)] =
        "<div\x20class=\x22error\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<strong>Erro:</strong>\x20" +
        _0x205b9c["message"] +
        _0xb59fbd(0x165));
  } finally {
    (_0x4521ef["disabled"] = ![]),
      (_0x4521ef[_0xb59fbd(0x1ab)] = _0xb59fbd(0x130));
  }
}
document[_0x3ee2b2(0x122)]("image-upload")[_0x3ee2b2(0x1a0)](
  _0x3ee2b2(0x186),
  function (_0x5f2c65) {
    const _0x579a14 = _0x3ee2b2,
      _0x52118e = _0x5f2c65[_0x579a14(0x167)][_0x579a14(0x12b)][0x0],
      _0x217250 = document["getElementById"](_0x579a14(0x1ad)),
      _0x39545c = document[_0x579a14(0x122)]("image-status");
    if (_0x52118e) {
      const _0x111eca = new FileReader();
      (_0x111eca[_0x579a14(0x170)] = function (_0x2dd515) {
        const _0x2d2e00 = _0x579a14;
        (_0x217250["src"] = _0x2dd515[_0x2d2e00(0x167)][_0x2d2e00(0x1b8)]),
          (_0x217250["style"]["display"] = _0x2d2e00(0x15d));
      }),
        _0x111eca["readAsDataURL"](_0x52118e),
        (_0x39545c["textContent"] = _0x52118e[_0x579a14(0x188)]);
    } else
      (_0x217250[_0x579a14(0x150)][_0x579a14(0x1a8)] = _0x579a14(0x10a)),
        (_0x39545c["textContent"] = _0x579a14(0x183));
  }
);
