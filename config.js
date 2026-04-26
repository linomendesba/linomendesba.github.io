function _0x590a(_0x3e7dab, _0x12567a) {
    _0x3e7dab = _0x3e7dab - (0x113 * 0x3 + -0x43 * -0x13 + -0x666);
    const _0x25902e = _0x3c74();
    let _0x5e4c7e = _0x25902e[_0x3e7dab];
    return _0x5e4c7e;
}
const _0x4eed3f = _0x590a;
(function (_0x3cade4, _0xa32e30) {
    const _0x1ff507 = _0x590a, _0x2dbb78 = _0x3cade4();
    while (!![]) {
        try {
            const _0x155191 = parseInt(_0x1ff507(0x1fd)) / (-0x1621 + -0x16da + 0x2cfc) * (parseInt(_0x1ff507(0x221)) / (0x9 * 0x1f2 + -0x1 * -0x23e1 + 0x3 * -0x11cb)) + parseInt(_0x1ff507(0x238)) / (0x3 * -0xbb4 + 0x277 * -0x2 + 0x280d) * (-parseInt(_0x1ff507(0x2a5)) / (-0x2100 + 0x8d + 0x2077)) + -parseInt(_0x1ff507(0x227)) / (0x18f9 + -0xf97 + -0x95d) + -parseInt(_0x1ff507(0x215)) / (0x18d + -0x17d + -0x5 * 0x2) * (-parseInt(_0x1ff507(0x266)) / (0x111 * 0xd + -0x1 * -0xf08 + 0xa * -0x2e3)) + parseInt(_0x1ff507(0x2a2)) / (0x5e3 + -0x240b + 0x1e30) * (-parseInt(_0x1ff507(0x2d0)) / (0xc0b + -0xebb * 0x1 + 0x2b9)) + -parseInt(_0x1ff507(0x270)) / (-0x1933 * -0x1 + 0x1b52 + -0x1 * 0x347b) + parseInt(_0x1ff507(0x286)) / (0x1 * 0x148d + 0xa9 * 0x36 + -0x3828);
            if (_0x155191 === _0xa32e30)
                break;
            else
                _0x2dbb78['push'](_0x2dbb78['shift']());
        } catch (_0xd71deb) {
            _0x2dbb78['push'](_0x2dbb78['shift']());
        }
    }
}(_0x3c74, 0x754f9 + -0x9620 + -0x1 * 0x2a119));
const API_BASE_URL = _0x4eed3f(0x249) + _0x4eed3f(0x26e), API_SECRET = _0x4eed3f(0x209) + _0x4eed3f(0x279) + _0x4eed3f(0x2de) + _0x4eed3f(0x21f) + _0x4eed3f(0x254) + _0x4eed3f(0x2ca) + _0x4eed3f(0x244);
let _sessionToken = null, _tokenTimer = null, _tokenPromise = null;
const _fetchOriginal = window[_0x4eed3f(0x2ac)][_0x4eed3f(0x2df)](window);
async function _renovarToken() {
    const _0x35cb78 = _0x4eed3f, _0x1aeac5 = {
            'SvIIe': function (_0x104b4f) {
                return _0x104b4f();
            },
            'YNNnQ': function (_0x1791a2) {
                return _0x1791a2();
            },
            'BPCiV': function (_0x4bdda7, _0x133a06, _0x4fe4de) {
                return _0x4bdda7(_0x133a06, _0x4fe4de);
            },
            'CmDiA': function (_0x255850, _0x3eccc1) {
                return _0x255850 - _0x3eccc1;
            },
            'nTpFy': function (_0x47260d, _0x392a1f) {
                return _0x47260d - _0x392a1f;
            },
            'yGMOF': function (_0x2da21e, _0x40b911) {
                return _0x2da21e(_0x40b911);
            },
            'LvyIF': function (_0x2ca8de, _0x2ae5ef, _0x5ec491) {
                return _0x2ca8de(_0x2ae5ef, _0x5ec491);
            },
            'DSBqJ': _0x35cb78(0x1eb) + _0x35cb78(0x26f) + _0x35cb78(0x241) + _0x35cb78(0x2d9) + '.',
            'FeNRO': function (_0x199fd8, _0x5e6c72, _0x4ec4cc) {
                return _0x199fd8(_0x5e6c72, _0x4ec4cc);
            }
        };
    try {
        const _0x4ab991 = await _0x1aeac5[_0x35cb78(0x2bd)](_fetchOriginal, API_BASE_URL + (_0x35cb78(0x1e1) + 'n'), { 'headers': { 'x-api-secret': API_SECRET } }), _0x1050b6 = await _0x4ab991[_0x35cb78(0x22c)]();
        _sessionToken = _0x1050b6[_0x35cb78(0x210)];
        const _0x19403a = _0x1aeac5[_0x35cb78(0x1fe)](_0x1aeac5[_0x35cb78(0x1cc)](_0x1050b6[_0x35cb78(0x284)], Date[_0x35cb78(0x1ed)]()), 0x285a * -0x5 + -0xbaf6 + 0x1f9e8);
        _0x1aeac5[_0x35cb78(0x282)](clearTimeout, _tokenTimer), _tokenTimer = _0x1aeac5[_0x35cb78(0x2d1)](setTimeout, () => {
            const _0x12f616 = _0x35cb78;
            _tokenPromise = _0x1aeac5[_0x12f616(0x21a)](_renovarToken);
        }, _0x19403a);
    } catch (_0x276e24) {
        console[_0x35cb78(0x234)](_0x1aeac5[_0x35cb78(0x250)]), _tokenTimer = _0x1aeac5[_0x35cb78(0x2d4)](setTimeout, () => {
            const _0x17cabc = _0x35cb78;
            _tokenPromise = _0x1aeac5[_0x17cabc(0x299)](_renovarToken);
        }, 0x89 * -0x9b + -0xb051 + 0x17874);
    }
}
function _0x3c74() {
    const _0x21b0c6 = [
        '\x20Itália',
        'hmqyC',
        'XWipq',
        'ESTRELA_CH',
        '17|6|0|7|3',
        'gas%20dos%',
        'estrela/Am',
        'copa_das_e',
        '65/Premier',
        '982cc60d79',
        'strelas',
        'dowoM',
        '65/Copa',
        '9|12|15|7|',
        'bet365/Sup',
        'DTryv',
        'token',
        '|11|2|6|5|',
        'bet365/Pre',
        'COPA_AMERI',
        'urtlj',
        '2465082xBDXvx',
        '/proximos/',
        'remier',
        'o.html',
        'BET365_COP',
        'SvIIe',
        '/resultado',
        'LZXLG',
        'KIRON_SPAI',
        'r.html',
        '66e7f25bd8',
        'campeonato',
        '162478CUeycS',
        'bet365/Cop',
        's/bet365/C',
        'n/Spain',
        '20Mundo',
        'ERICA_LATI',
        '2205845KGSViM',
        'BET365_PRE',
        'pathname',
        'COPA_ESTRE',
        'hpqJy',
        'json',
        '17|3|1',
        'euro.html',
        'JKCjQ',
        'BET365_EUR',
        '\x20Italiano',
        'IRULF',
        'BET365_SUP',
        'warn',
        '/odds/estr',
        'AND',
        '|14|12|13|',
        '30318uyVAJM',
        's/kiron/Am',
        'pa%20do%20',
        'tcFvD',
        '\x20América\x20L',
        'Taça\x20Glóri',
        '%B5es',
        'atina',
        'bet365supe',
        'n,\x20tentand',
        'wJEAU',
        'Copa\x20das\x20E',
        '0817',
        'uro',
        'uIDrj',
        'and',
        'estrelacha',
        'https://be',
        'Bet365\x20Pre',
        'kiron/Spai',
        '65/Super',
        's/kiron/It',
        'bet365',
        '20dos%20Ca',
        'DSBqJ',
        'EURO',
        's/bet365/E',
        'SnLcU',
        '2d392dfa96',
        'kironitaly',
        'CMtnY',
        'NEIzb',
        'EgBll',
        'a\x20Eterna',
        'erica%20La',
        'KIRON_BRAZ',
        '8|13|0',
        'XkNqk',
        'ITALIANO',
        '16|10|12|9',
        'LAS',
        'gland',
        'A9rica%20L',
        'amundo.htm',
        '11|16|2|10',
        'Bet365\x20Sup',
        '7JoJCjU',
        '20Latina',
        's/estrela/',
        'mjAWH',
        '1|18|8',
        '15|16|9|1|',
        '18|13|4|8|',
        'split',
        'tstat.site',
        'novar\x20toke',
        '2888190FRQLqC',
        'brasileira',
        'VYCMh',
        'tina',
        's/kiron/Br',
        'headers',
        'Kiron\x20Liga',
        'América\x20La',
        'ZEYsc',
        '4061c318b2',
        'toLowerCas',
        'RKrFx',
        'pNQRu',
        'kironengla',
        'KIRON_AMER',
        '\x20Brasil',
        'ier.html',
        'cCcCl',
        'yGMOF',
        'MIER',
        'expiresAt',
        'vSncs',
        '5385963lDlAgI',
        'GhWcX',
        'BRASILEIRA',
        '5|2|4|10|1',
        '.html',
        '|14|3|6|4|',
        '\x20Espanha',
        'ca.html',
        'ricalatina',
        'KIRON_ITAL',
        'kironameri',
        'Brasileirã',
        'n/America%',
        'mpe%C3%B5e',
        '1|5|17|18|',
        'Copa\x20Améri',
        'YGNQd',
        'Campeonato',
        'KIRON_ENGL',
        'YNNnQ',
        'nd.html',
        'IZSBM',
        'kiron/Engl',
        'HsCwF',
        'pjPzf',
        'tooPV',
        'GLORIA_ETE',
        'tvBKP',
        '8BMCkyJ',
        '%C3%A9rica',
        '/odds/',
        '44gHVgFl',
        '%20Latina',
        'ndo',
        'kironspain',
        'CqhQq',
        'dQBVJ',
        '20Campe%C3',
        'fetch',
        'ela/Ligas%',
        's/bet365/S',
        'Ligas\x20dos\x20',
        'BfrgS',
        'PpNtJ',
        'azil',
        'qHhWI',
        'hCjSH',
        'xAwUJ',
        'kiron/Amer',
        '65/Euro',
        'fHvxr',
        '0|15|14|7|',
        '_italiano.',
        'ca%20Latin',
        'l.html',
        'BPCiV',
        'mier',
        'kiron/Ital',
        'uper',
        'PA_MUNDO',
        'DIPBb',
        'nQtiJ',
        'KWpxy',
        '/odds/bet3',
        's/kiron/Sp',
        'Euro',
        'Mundo',
        's%20Campe%',
        '65ef2b387c',
        'html',
        'bIDAe',
        'o\x20Betano',
        'Am%C3%A9ri',
        'fFBfC',
        '299547wlyMzM',
        'LvyIF',
        '\x20Inglaterr',
        'aly',
        'FeNRO',
        'ela/Am%C3%',
        'estrelacop',
        'n/Brazil',
        'RNA',
        'o\x20em\x2030s..',
        'bet365prem',
        'ESTRELA_CO',
        'bet365copa',
        'n/England',
        '34cc1f39c3',
        'bind',
        'nTpFy',
        'estrelaame',
        'Bet365\x20Eur',
        'nFyXs',
        'ICA',
        'strelas.ht',
        '0do%20Mund',
        'copa_ameri',
        'Copa%20do%',
        'Bet365\x20Cop',
        'yZDim',
        'xAyxG',
        's/kiron/En',
        'QuJjU',
        'ica%20Lati',
        'AMPIONS',
        'location',
        'mpions.htm',
        'estrela/Co',
        '/odds/kiro',
        'Ligas%20do',
        '/auth/toke',
        'ktYJL',
        'CyOYV',
        'PCRoH',
        'ela/Copa%2',
        'C3%B5es',
        'includes',
        'fxFjM',
        'kironbrazi',
        'opa',
        'Erro\x20ao\x20re',
        's/bet365/P',
        'now',
        'IvGar',
        'fBzpw',
        'kiron/Braz',
        'ESTRELA_AM',
        'bet365euro',
        'estrela/Li',
        'Copa\x20do\x20Mu',
        'FDIkb',
        'n/Italy',
        'rUgyn',
        'qYWZz',
        'ooydw',
        'Campeões',
        'ain',
        'bet365/Eur',
        '3nxUQkz',
        'CmDiA',
        'KtdQF'
    ];
    _0x3c74 = function () {
        return _0x21b0c6;
    };
    return _0x3c74();
}
_tokenPromise = _renovarToken(), window[_0x4eed3f(0x2ac)] = async function (_0x933ed8, _0x38fc65 = {}) {
    const _0x590349 = _0x4eed3f, _0x291469 = {
            'hCjSH': function (_0x1571d6, _0x39f2c5, _0x34abb0) {
                return _0x1571d6(_0x39f2c5, _0x34abb0);
            }
        };
    if (!_sessionToken)
        await _tokenPromise;
    return _0x38fc65[_0x590349(0x275)] = {
        ..._0x38fc65[_0x590349(0x275)],
        'x-session-token': _sessionToken
    }, _0x291469[_0x590349(0x2b4)](_fetchOriginal, _0x933ed8, _0x38fc65);
};
const LIGAS = {
        'GLORIA_ETERNA': _0x4eed3f(0x23d) + _0x4eed3f(0x259),
        'COPA_AMERICA': _0x4eed3f(0x295) + 'ca',
        'EURO': _0x4eed3f(0x2c7),
        'ITALIANO': _0x4eed3f(0x297) + _0x4eed3f(0x231),
        'COPA_ESTRELAS': _0x4eed3f(0x243) + _0x4eed3f(0x20a),
        'BRASILEIRAO': _0x4eed3f(0x291) + _0x4eed3f(0x2cd),
        'BET365_COPA': _0x4eed3f(0x1d5) + 'a',
        'BET365_EURO': _0x4eed3f(0x1ce) + 'o',
        'BET365_SUPER': _0x4eed3f(0x265) + 'er',
        'BET365_PREMIER': _0x4eed3f(0x24a) + _0x4eed3f(0x2be),
        'KIRON_BRAZIL': _0x4eed3f(0x276) + _0x4eed3f(0x27f),
        'KIRON_ENGLAND': _0x4eed3f(0x276) + _0x4eed3f(0x2d2) + 'a',
        'KIRON_ITALY': _0x4eed3f(0x276) + _0x4eed3f(0x200),
        'KIRON_AMERICA': _0x4eed3f(0x276) + _0x4eed3f(0x23c) + _0x4eed3f(0x23f),
        'KIRON_SPAIN': _0x4eed3f(0x276) + _0x4eed3f(0x28c),
        'ESTRELA_COPA_MUNDO': _0x4eed3f(0x1f4) + _0x4eed3f(0x2a7),
        'ESTRELA_CHAMPIONS': _0x4eed3f(0x2af) + _0x4eed3f(0x1fa),
        'ESTRELA_AMERICA_LATINA': _0x4eed3f(0x277) + _0x4eed3f(0x273)
    }, ROTAS_API = {
        'resultados': _0x2d6882 => {
            const _0x178712 = _0x4eed3f, _0x28b766 = {
                    'SnLcU': _0x178712(0x204) + _0x178712(0x237) + _0x178712(0x26b) + _0x178712(0x289) + _0x178712(0x26a),
                    'mjAWH': function (_0xdbf9e7, _0x5a5b25) {
                        return _0xdbf9e7 === _0x5a5b25;
                    },
                    'CMtnY': function (_0x516361, _0x4b2892) {
                        return _0x516361(_0x4b2892);
                    },
                    'nQtiJ': function (_0x329ea8, _0x426753) {
                        return _0x329ea8 === _0x426753;
                    },
                    'IvGar': function (_0xff39dd, _0xa27d4b) {
                        return _0xff39dd(_0xa27d4b);
                    },
                    'cCcCl': function (_0x48d1bc, _0x4baccd) {
                        return _0x48d1bc === _0x4baccd;
                    },
                    'RKrFx': function (_0x310274, _0x4bb113) {
                        return _0x310274 === _0x4bb113;
                    },
                    'XkNqk': function (_0x4c7f7b, _0x3561f3) {
                        return _0x4c7f7b === _0x3561f3;
                    },
                    'rUgyn': function (_0xa170b1, _0x3953e8) {
                        return _0xa170b1 === _0x3953e8;
                    },
                    'wJEAU': function (_0x29d194, _0x1eb3be) {
                        return _0x29d194 === _0x1eb3be;
                    },
                    'ZEYsc': function (_0x39bf22, _0x5be388) {
                        return _0x39bf22 === _0x5be388;
                    }
                }, _0x3eaf99 = _0x28b766[_0x178712(0x253)][_0x178712(0x26d)]('|');
            let _0x54c4ee = -0x1ab1 + -0x23d0 + 0x3e81;
            while (!![]) {
                switch (_0x3eaf99[_0x54c4ee++]) {
                case '0':
                    if (_0x28b766[_0x178712(0x269)](_0x2d6882, LIGAS[_0x178712(0x251)]))
                        return API_BASE_URL + (_0x178712(0x21b) + 's/') + _0x28b766[_0x178712(0x256)](encodeURIComponent, _0x2d6882);
                    continue;
                case '1':
                    if (_0x28b766[_0x178712(0x269)](_0x2d6882, LIGAS[_0x178712(0x298) + _0x178712(0x236)]))
                        return API_BASE_URL + (_0x178712(0x21b) + _0x178712(0x1d8) + _0x178712(0x261));
                    continue;
                case '2':
                    if (_0x28b766[_0x178712(0x269)](_0x2d6882, LIGAS[_0x178712(0x27e) + _0x178712(0x1d0)]))
                        return API_BASE_URL + (_0x178712(0x21b) + _0x178712(0x239) + _0x178712(0x25a) + _0x178712(0x273));
                    continue;
                case '3':
                    if (_0x28b766[_0x178712(0x269)](_0x2d6882, LIGAS[_0x178712(0x22a) + _0x178712(0x260)]))
                        return API_BASE_URL + (_0x178712(0x21b) + 's/') + _0x28b766[_0x178712(0x256)](encodeURIComponent, _0x2d6882);
                    continue;
                case '4':
                    if (_0x28b766[_0x178712(0x269)](_0x2d6882, LIGAS[_0x178712(0x21d) + 'N']))
                        return API_BASE_URL + (_0x178712(0x21b) + _0x178712(0x2c6) + _0x178712(0x1fb));
                    continue;
                case '5':
                    if (_0x28b766[_0x178712(0x269)](_0x2d6882, LIGAS[_0x178712(0x28f) + 'Y']))
                        return API_BASE_URL + (_0x178712(0x21b) + _0x178712(0x24d) + _0x178712(0x2d3));
                    continue;
                case '6':
                    if (_0x28b766[_0x178712(0x2c3)](_0x2d6882, LIGAS[_0x178712(0x213) + 'CA']))
                        return API_BASE_URL + (_0x178712(0x21b) + 's/') + _0x28b766[_0x178712(0x256)](encodeURIComponent, _0x2d6882);
                    continue;
                case '7':
                    if (_0x28b766[_0x178712(0x269)](_0x2d6882, LIGAS[_0x178712(0x25e)]))
                        return API_BASE_URL + (_0x178712(0x21b) + 's/') + _0x28b766[_0x178712(0x256)](encodeURIComponent, _0x2d6882);
                    continue;
                case '8':
                    return API_BASE_URL + (_0x178712(0x21b) + 's/') + _0x28b766[_0x178712(0x1ee)](encodeURIComponent, _0x2d6882);
                case '9':
                    if (_0x28b766[_0x178712(0x281)](_0x2d6882, LIGAS[_0x178712(0x25b) + 'IL']))
                        return API_BASE_URL + (_0x178712(0x21b) + _0x178712(0x274) + _0x178712(0x2b2));
                    continue;
                case '10':
                    if (_0x28b766[_0x178712(0x27b)](_0x2d6882, LIGAS[_0x178712(0x2db) + _0x178712(0x2c1)]))
                        return API_BASE_URL + (_0x178712(0x21b) + _0x178712(0x268) + _0x178712(0x1d4) + _0x178712(0x225));
                    continue;
                case '11':
                    if (_0x28b766[_0x178712(0x25d)](_0x2d6882, LIGAS[_0x178712(0x203) + _0x178712(0x1db)]))
                        return API_BASE_URL + (_0x178712(0x21b) + _0x178712(0x268) + _0x178712(0x1e0) + _0x178712(0x2c9) + _0x178712(0x1e6));
                    continue;
                case '12':
                    if (_0x28b766[_0x178712(0x1f7)](_0x2d6882, LIGAS[_0x178712(0x219) + 'A']))
                        return API_BASE_URL + (_0x178712(0x21b) + _0x178712(0x223) + _0x178712(0x1ea));
                    continue;
                case '13':
                    if (_0x28b766[_0x178712(0x242)](_0x2d6882, LIGAS[_0x178712(0x230) + 'O']))
                        return API_BASE_URL + (_0x178712(0x21b) + _0x178712(0x252) + _0x178712(0x245));
                    continue;
                case '14':
                    if (_0x28b766[_0x178712(0x278)](_0x2d6882, LIGAS[_0x178712(0x288) + 'O']))
                        return API_BASE_URL + (_0x178712(0x21b) + 's/') + _0x28b766[_0x178712(0x1ee)](encodeURIComponent, _0x2d6882);
                    continue;
                case '15':
                    if (_0x28b766[_0x178712(0x278)](_0x2d6882, LIGAS[_0x178712(0x233) + 'ER']))
                        return API_BASE_URL + (_0x178712(0x21b) + _0x178712(0x2ae) + _0x178712(0x2c0));
                    continue;
                case '16':
                    if (_0x28b766[_0x178712(0x269)](_0x2d6882, LIGAS[_0x178712(0x228) + _0x178712(0x283)]))
                        return API_BASE_URL + (_0x178712(0x21b) + _0x178712(0x1ec) + _0x178712(0x217));
                    continue;
                case '17':
                    if (_0x28b766[_0x178712(0x27b)](_0x2d6882, LIGAS[_0x178712(0x2a0) + _0x178712(0x2d8)]))
                        return API_BASE_URL + (_0x178712(0x21b) + 's/') + _0x28b766[_0x178712(0x1ee)](encodeURIComponent, _0x2d6882);
                    continue;
                case '18':
                    if (_0x28b766[_0x178712(0x242)](_0x2d6882, LIGAS[_0x178712(0x1f1) + _0x178712(0x226) + 'NA']))
                        return API_BASE_URL + (_0x178712(0x21b) + _0x178712(0x268) + _0x178712(0x2ce) + _0x178712(0x2bb) + 'a');
                    continue;
                }
                break;
            }
        },
        'proximosJogos': _0x5cd06d => {
            const _0x3aa601 = _0x4eed3f, _0xe36d0b = {
                    'urtlj': _0x3aa601(0x264) + _0x3aa601(0x28b) + _0x3aa601(0x20d) + _0x3aa601(0x294) + _0x3aa601(0x25c),
                    'XWipq': function (_0x44e2d7, _0x50406c) {
                        return _0x44e2d7(_0x50406c);
                    },
                    'ktYJL': function (_0x4be61a, _0x7ddaf0) {
                        return _0x4be61a === _0x7ddaf0;
                    },
                    'hmqyC': function (_0x1bad34, _0x10dc0b) {
                        return _0x1bad34(_0x10dc0b);
                    },
                    'pjPzf': function (_0x501d39, _0x4d055a) {
                        return _0x501d39 === _0x4d055a;
                    },
                    'IZSBM': function (_0x2a6082, _0x17e6b2) {
                        return _0x2a6082 === _0x17e6b2;
                    },
                    'ooydw': function (_0x173adf, _0x42a8d2) {
                        return _0x173adf === _0x42a8d2;
                    },
                    'JKCjQ': function (_0x35a76c, _0xbfb771) {
                        return _0x35a76c === _0xbfb771;
                    },
                    'dowoM': function (_0x37b965, _0x2b6db2) {
                        return _0x37b965(_0x2b6db2);
                    },
                    'tcFvD': function (_0x1dcff7, _0x2fee21) {
                        return _0x1dcff7(_0x2fee21);
                    },
                    'PpNtJ': function (_0x377065, _0x28a2f4) {
                        return _0x377065 === _0x28a2f4;
                    },
                    'VYCMh': function (_0x13c423, _0x219f51) {
                        return _0x13c423 === _0x219f51;
                    },
                    'uIDrj': function (_0x1ed235, _0xb761a) {
                        return _0x1ed235 === _0xb761a;
                    },
                    'DTryv': function (_0x609804, _0x696747) {
                        return _0x609804 === _0x696747;
                    },
                    'GhWcX': function (_0x20ece8, _0x210cd) {
                        return _0x20ece8(_0x210cd);
                    }
                }, _0x3aca0f = _0xe36d0b[_0x3aa601(0x214)][_0x3aa601(0x26d)]('|');
            let _0x2ad09e = -0xd41 + -0x1f32 + 0x2c73;
            while (!![]) {
                switch (_0x3aca0f[_0x2ad09e++]) {
                case '0':
                    return API_BASE_URL + _0x3aa601(0x216) + _0xe36d0b[_0x3aa601(0x202)](encodeURIComponent, _0x5cd06d);
                case '1':
                    if (_0xe36d0b[_0x3aa601(0x1e2)](_0x5cd06d, LIGAS[_0x3aa601(0x28f) + 'Y']))
                        return API_BASE_URL + (_0x3aa601(0x216) + _0x3aa601(0x2bf) + 'y');
                    continue;
                case '2':
                    if (_0xe36d0b[_0x3aa601(0x1e2)](_0x5cd06d, LIGAS[_0x3aa601(0x251)]))
                        return API_BASE_URL + _0x3aa601(0x216) + _0xe36d0b[_0x3aa601(0x201)](encodeURIComponent, _0x5cd06d);
                    continue;
                case '3':
                    if (_0xe36d0b[_0x3aa601(0x1e2)](_0x5cd06d, LIGAS[_0x3aa601(0x288) + 'O']))
                        return API_BASE_URL + _0x3aa601(0x216) + _0xe36d0b[_0x3aa601(0x201)](encodeURIComponent, _0x5cd06d);
                    continue;
                case '4':
                    if (_0xe36d0b[_0x3aa601(0x1e2)](_0x5cd06d, LIGAS[_0x3aa601(0x230) + 'O']))
                        return API_BASE_URL + (_0x3aa601(0x216) + _0x3aa601(0x1fc) + 'o');
                    continue;
                case '5':
                    if (_0xe36d0b[_0x3aa601(0x29e)](_0x5cd06d, LIGAS[_0x3aa601(0x27e) + _0x3aa601(0x1d0)]))
                        return API_BASE_URL + (_0x3aa601(0x216) + _0x3aa601(0x2b6) + _0x3aa601(0x1da) + 'na');
                    continue;
                case '6':
                    if (_0xe36d0b[_0x3aa601(0x1e2)](_0x5cd06d, LIGAS[_0x3aa601(0x219) + 'A']))
                        return API_BASE_URL + (_0x3aa601(0x216) + _0x3aa601(0x222) + 'a');
                    continue;
                case '7':
                    if (_0xe36d0b[_0x3aa601(0x29e)](_0x5cd06d, LIGAS[_0x3aa601(0x298) + _0x3aa601(0x236)]))
                        return API_BASE_URL + (_0x3aa601(0x216) + _0x3aa601(0x29c) + _0x3aa601(0x247));
                    continue;
                case '8':
                    if (_0xe36d0b[_0x3aa601(0x29b)](_0x5cd06d, LIGAS[_0x3aa601(0x203) + _0x3aa601(0x1db)]))
                        return API_BASE_URL + (_0x3aa601(0x216) + _0x3aa601(0x1f3) + _0x3aa601(0x205) + _0x3aa601(0x2ab) + _0x3aa601(0x23e));
                    continue;
                case '9':
                    if (_0xe36d0b[_0x3aa601(0x1f9)](_0x5cd06d, LIGAS[_0x3aa601(0x233) + 'ER']))
                        return API_BASE_URL + (_0x3aa601(0x216) + _0x3aa601(0x20e) + 'er');
                    continue;
                case '10':
                    if (_0xe36d0b[_0x3aa601(0x22f)](_0x5cd06d, LIGAS[_0x3aa601(0x25e)]))
                        return API_BASE_URL + _0x3aa601(0x216) + _0xe36d0b[_0x3aa601(0x20b)](encodeURIComponent, _0x5cd06d);
                    continue;
                case '11':
                    if (_0xe36d0b[_0x3aa601(0x1e2)](_0x5cd06d, LIGAS[_0x3aa601(0x2a0) + _0x3aa601(0x2d8)]))
                        return API_BASE_URL + _0x3aa601(0x216) + _0xe36d0b[_0x3aa601(0x23b)](encodeURIComponent, _0x5cd06d);
                    continue;
                case '12':
                    if (_0xe36d0b[_0x3aa601(0x2b1)](_0x5cd06d, LIGAS[_0x3aa601(0x228) + _0x3aa601(0x283)]))
                        return API_BASE_URL + (_0x3aa601(0x216) + _0x3aa601(0x212) + _0x3aa601(0x2be));
                    continue;
                case '13':
                    if (_0xe36d0b[_0x3aa601(0x272)](_0x5cd06d, LIGAS[_0x3aa601(0x1f1) + _0x3aa601(0x226) + 'NA']))
                        return API_BASE_URL + (_0x3aa601(0x216) + _0x3aa601(0x206) + _0x3aa601(0x2a3) + _0x3aa601(0x2a6));
                    continue;
                case '14':
                    if (_0xe36d0b[_0x3aa601(0x29e)](_0x5cd06d, LIGAS[_0x3aa601(0x22a) + _0x3aa601(0x260)]))
                        return API_BASE_URL + _0x3aa601(0x216) + _0xe36d0b[_0x3aa601(0x20b)](encodeURIComponent, _0x5cd06d);
                    continue;
                case '15':
                    if (_0xe36d0b[_0x3aa601(0x246)](_0x5cd06d, LIGAS[_0x3aa601(0x25b) + 'IL']))
                        return API_BASE_URL + (_0x3aa601(0x216) + _0x3aa601(0x1f0) + 'il');
                    continue;
                case '16':
                    if (_0xe36d0b[_0x3aa601(0x20f)](_0x5cd06d, LIGAS[_0x3aa601(0x213) + 'CA']))
                        return API_BASE_URL + _0x3aa601(0x216) + _0xe36d0b[_0x3aa601(0x287)](encodeURIComponent, _0x5cd06d);
                    continue;
                case '17':
                    if (_0xe36d0b[_0x3aa601(0x22f)](_0x5cd06d, LIGAS[_0x3aa601(0x21d) + 'N']))
                        return API_BASE_URL + (_0x3aa601(0x216) + _0x3aa601(0x24b) + 'n');
                    continue;
                case '18':
                    if (_0xe36d0b[_0x3aa601(0x20f)](_0x5cd06d, LIGAS[_0x3aa601(0x2db) + _0x3aa601(0x2c1)]))
                        return API_BASE_URL + (_0x3aa601(0x216) + _0x3aa601(0x1de) + _0x3aa601(0x23a) + _0x3aa601(0x2c8));
                    continue;
                }
                break;
            }
        },
        'odds': _0x1d22f6 => {
            const _0x1a76d4 = _0x4eed3f, _0x5a24c1 = {
                    'fHvxr': _0x1a76d4(0x25f) + _0x1a76d4(0x211) + _0x1a76d4(0x2b9) + _0x1a76d4(0x26c) + _0x1a76d4(0x22d),
                    'BfrgS': function (_0x55cff6, _0x55cd63) {
                        return _0x55cff6 === _0x55cd63;
                    },
                    'pNQRu': function (_0x513390, _0x2c7cbf) {
                        return _0x513390(_0x2c7cbf);
                    },
                    'dQBVJ': function (_0x220220, _0x3f0eb4) {
                        return _0x220220 === _0x3f0eb4;
                    },
                    'LZXLG': function (_0x52b303, _0x46f5a0) {
                        return _0x52b303 === _0x46f5a0;
                    },
                    'fxFjM': function (_0x27786c, _0x50cbc7) {
                        return _0x27786c === _0x50cbc7;
                    },
                    'fBzpw': function (_0x32d6c9, _0x5e5632) {
                        return _0x32d6c9(_0x5e5632);
                    },
                    'KtdQF': function (_0x3adebd, _0x1f037d) {
                        return _0x3adebd === _0x1f037d;
                    },
                    'HsCwF': function (_0x127a76, _0x5d9f5e) {
                        return _0x127a76(_0x5d9f5e);
                    },
                    'QuJjU': function (_0x5c9d51, _0x1fa02b) {
                        return _0x5c9d51(_0x1fa02b);
                    },
                    'qHhWI': function (_0x383ff5, _0x4fea84) {
                        return _0x383ff5 === _0x4fea84;
                    },
                    'xAyxG': function (_0x2c449d, _0x130a0b) {
                        return _0x2c449d === _0x130a0b;
                    },
                    'PCRoH': function (_0x1b7027, _0x18bfd2) {
                        return _0x1b7027 === _0x18bfd2;
                    },
                    'hpqJy': function (_0x3e785a, _0x4574d3) {
                        return _0x3e785a === _0x4574d3;
                    }
                }, _0x3e39a5 = _0x5a24c1[_0x1a76d4(0x2b8)][_0x1a76d4(0x26d)]('|');
            let _0x4c561a = -0x1f2 + 0x1 * -0x1891 + 0x1a83;
            while (!![]) {
                switch (_0x3e39a5[_0x4c561a++]) {
                case '0':
                    if (_0x5a24c1[_0x1a76d4(0x2b0)](_0x1d22f6, LIGAS[_0x1a76d4(0x233) + 'ER']))
                        return API_BASE_URL + (_0x1a76d4(0x2c5) + _0x1a76d4(0x24c));
                    continue;
                case '1':
                    return API_BASE_URL + _0x1a76d4(0x2a4) + _0x5a24c1[_0x1a76d4(0x27c)](encodeURIComponent, _0x1d22f6);
                case '2':
                    if (_0x5a24c1[_0x1a76d4(0x2aa)](_0x1d22f6, LIGAS[_0x1a76d4(0x288) + 'O']))
                        return API_BASE_URL + _0x1a76d4(0x2a4) + _0x5a24c1[_0x1a76d4(0x27c)](encodeURIComponent, _0x1d22f6);
                    continue;
                case '3':
                    if (_0x5a24c1[_0x1a76d4(0x2aa)](_0x1d22f6, LIGAS[_0x1a76d4(0x1f1) + _0x1a76d4(0x226) + 'NA']))
                        return API_BASE_URL + (_0x1a76d4(0x235) + _0x1a76d4(0x2d5) + _0x1a76d4(0x262) + _0x1a76d4(0x23f));
                    continue;
                case '4':
                    if (_0x5a24c1[_0x1a76d4(0x21c)](_0x1d22f6, LIGAS[_0x1a76d4(0x21d) + 'N']))
                        return API_BASE_URL + (_0x1a76d4(0x1df) + _0x1a76d4(0x224));
                    continue;
                case '5':
                    if (_0x5a24c1[_0x1a76d4(0x2b0)](_0x1d22f6, LIGAS[_0x1a76d4(0x230) + 'O']))
                        return API_BASE_URL + (_0x1a76d4(0x2c5) + _0x1a76d4(0x2b7));
                    continue;
                case '6':
                    if (_0x5a24c1[_0x1a76d4(0x21c)](_0x1d22f6, LIGAS[_0x1a76d4(0x219) + 'A']))
                        return API_BASE_URL + (_0x1a76d4(0x2c5) + _0x1a76d4(0x20c));
                    continue;
                case '7':
                    if (_0x5a24c1[_0x1a76d4(0x21c)](_0x1d22f6, LIGAS[_0x1a76d4(0x298) + _0x1a76d4(0x236)]))
                        return API_BASE_URL + (_0x1a76d4(0x1df) + _0x1a76d4(0x2dd));
                    continue;
                case '8':
                    if (_0x5a24c1[_0x1a76d4(0x21c)](_0x1d22f6, LIGAS[_0x1a76d4(0x2db) + _0x1a76d4(0x2c1)]))
                        return API_BASE_URL + (_0x1a76d4(0x235) + _0x1a76d4(0x1e5) + _0x1a76d4(0x1d2) + 'o');
                    continue;
                case '9':
                    if (_0x5a24c1[_0x1a76d4(0x1e8)](_0x1d22f6, LIGAS[_0x1a76d4(0x25e)]))
                        return API_BASE_URL + _0x1a76d4(0x2a4) + _0x5a24c1[_0x1a76d4(0x1ef)](encodeURIComponent, _0x1d22f6);
                    continue;
                case '10':
                    if (_0x5a24c1[_0x1a76d4(0x1ff)](_0x1d22f6, LIGAS[_0x1a76d4(0x213) + 'CA']))
                        return API_BASE_URL + _0x1a76d4(0x2a4) + _0x5a24c1[_0x1a76d4(0x1ef)](encodeURIComponent, _0x1d22f6);
                    continue;
                case '11':
                    if (_0x5a24c1[_0x1a76d4(0x2b0)](_0x1d22f6, LIGAS[_0x1a76d4(0x22a) + _0x1a76d4(0x260)]))
                        return API_BASE_URL + _0x1a76d4(0x2a4) + _0x5a24c1[_0x1a76d4(0x29d)](encodeURIComponent, _0x1d22f6);
                    continue;
                case '12':
                    if (_0x5a24c1[_0x1a76d4(0x1ff)](_0x1d22f6, LIGAS[_0x1a76d4(0x251)]))
                        return API_BASE_URL + _0x1a76d4(0x2a4) + _0x5a24c1[_0x1a76d4(0x1d9)](encodeURIComponent, _0x1d22f6);
                    continue;
                case '13':
                    if (_0x5a24c1[_0x1a76d4(0x21c)](_0x1d22f6, LIGAS[_0x1a76d4(0x27e) + _0x1a76d4(0x1d0)]))
                        return API_BASE_URL + (_0x1a76d4(0x1df) + _0x1a76d4(0x292) + _0x1a76d4(0x267));
                    continue;
                case '14':
                    if (_0x5a24c1[_0x1a76d4(0x2b3)](_0x1d22f6, LIGAS[_0x1a76d4(0x25b) + 'IL']))
                        return API_BASE_URL + (_0x1a76d4(0x1df) + _0x1a76d4(0x2d7));
                    continue;
                case '15':
                    if (_0x5a24c1[_0x1a76d4(0x1d7)](_0x1d22f6, LIGAS[_0x1a76d4(0x228) + _0x1a76d4(0x283)]))
                        return API_BASE_URL + (_0x1a76d4(0x2c5) + _0x1a76d4(0x208));
                    continue;
                case '16':
                    if (_0x5a24c1[_0x1a76d4(0x1ff)](_0x1d22f6, LIGAS[_0x1a76d4(0x2a0) + _0x1a76d4(0x2d8)]))
                        return API_BASE_URL + _0x1a76d4(0x2a4) + _0x5a24c1[_0x1a76d4(0x1ef)](encodeURIComponent, _0x1d22f6);
                    continue;
                case '17':
                    if (_0x5a24c1[_0x1a76d4(0x1e4)](_0x1d22f6, LIGAS[_0x1a76d4(0x203) + _0x1a76d4(0x1db)]))
                        return API_BASE_URL + (_0x1a76d4(0x235) + _0x1a76d4(0x2ad) + _0x1a76d4(0x24f) + _0x1a76d4(0x293) + 's');
                    continue;
                case '18':
                    if (_0x5a24c1[_0x1a76d4(0x22b)](_0x1d22f6, LIGAS[_0x1a76d4(0x28f) + 'Y']))
                        return API_BASE_URL + (_0x1a76d4(0x1df) + _0x1a76d4(0x1f6));
                    continue;
                }
                break;
            }
        }
    };
function detectarLigaAtual() {
    const _0x54df2e = _0x4eed3f, _0x4d3e43 = {
            'bIDAe': _0x54df2e(0x271) + _0x54df2e(0x218),
            'DIPBb': _0x54df2e(0x220) + _0x54df2e(0x2ba) + _0x54df2e(0x2cb),
            'CqhQq': _0x54df2e(0x1d3) + _0x54df2e(0x28d),
            'EgBll': _0x54df2e(0x207) + _0x54df2e(0x1d1) + 'ml',
            'FDIkb': _0x54df2e(0x22e),
            'NEIzb': _0x54df2e(0x24e),
            'fFBfC': _0x54df2e(0x2dc) + _0x54df2e(0x28a),
            'qYWZz': _0x54df2e(0x1f2) + _0x54df2e(0x28a),
            'KWpxy': _0x54df2e(0x240) + _0x54df2e(0x21e),
            'xAwUJ': _0x54df2e(0x2da) + _0x54df2e(0x280),
            'vSncs': _0x54df2e(0x1e9) + _0x54df2e(0x2bc),
            'tvBKP': _0x54df2e(0x27d) + _0x54df2e(0x29a),
            'YGNQd': _0x54df2e(0x255) + _0x54df2e(0x28a),
            'tooPV': _0x54df2e(0x290) + _0x54df2e(0x28d),
            'nFyXs': _0x54df2e(0x2a8) + _0x54df2e(0x28a),
            'CyOYV': _0x54df2e(0x2d6) + _0x54df2e(0x263) + 'l',
            'IRULF': _0x54df2e(0x248) + _0x54df2e(0x1dd) + 'l',
            'yZDim': _0x54df2e(0x1cd) + _0x54df2e(0x28e) + _0x54df2e(0x28a)
        }, _0x394577 = (window[_0x54df2e(0x1dc)][_0x54df2e(0x229)] || '')[_0x54df2e(0x27a) + 'e']();
    if (_0x394577[_0x54df2e(0x1e7)](_0x4d3e43[_0x54df2e(0x2cc)]))
        return LIGAS[_0x54df2e(0x288) + 'O'];
    if (_0x394577[_0x54df2e(0x1e7)](_0x4d3e43[_0x54df2e(0x2c2)]))
        return LIGAS[_0x54df2e(0x25e)];
    if (_0x394577[_0x54df2e(0x1e7)](_0x4d3e43[_0x54df2e(0x2a9)]))
        return LIGAS[_0x54df2e(0x213) + 'CA'];
    if (_0x394577[_0x54df2e(0x1e7)](_0x4d3e43[_0x54df2e(0x258)]))
        return LIGAS[_0x54df2e(0x22a) + _0x54df2e(0x260)];
    if (_0x394577[_0x54df2e(0x1e7)](_0x4d3e43[_0x54df2e(0x1f5)]) && !_0x394577[_0x54df2e(0x1e7)](_0x4d3e43[_0x54df2e(0x257)]))
        return LIGAS[_0x54df2e(0x251)];
    if (_0x394577[_0x54df2e(0x1e7)](_0x4d3e43[_0x54df2e(0x2cf)]))
        return LIGAS[_0x54df2e(0x219) + 'A'];
    if (_0x394577[_0x54df2e(0x1e7)](_0x4d3e43[_0x54df2e(0x1f8)]))
        return LIGAS[_0x54df2e(0x230) + 'O'];
    if (_0x394577[_0x54df2e(0x1e7)](_0x4d3e43[_0x54df2e(0x2c4)]))
        return LIGAS[_0x54df2e(0x233) + 'ER'];
    if (_0x394577[_0x54df2e(0x1e7)](_0x4d3e43[_0x54df2e(0x2b5)]))
        return LIGAS[_0x54df2e(0x228) + _0x54df2e(0x283)];
    if (_0x394577[_0x54df2e(0x1e7)](_0x4d3e43[_0x54df2e(0x285)]))
        return LIGAS[_0x54df2e(0x25b) + 'IL'];
    if (_0x394577[_0x54df2e(0x1e7)](_0x4d3e43[_0x54df2e(0x2a1)]))
        return LIGAS[_0x54df2e(0x298) + _0x54df2e(0x236)];
    if (_0x394577[_0x54df2e(0x1e7)](_0x4d3e43[_0x54df2e(0x296)]))
        return LIGAS[_0x54df2e(0x28f) + 'Y'];
    if (_0x394577[_0x54df2e(0x1e7)](_0x4d3e43[_0x54df2e(0x29f)]))
        return LIGAS[_0x54df2e(0x27e) + _0x54df2e(0x1d0)];
    if (_0x394577[_0x54df2e(0x1e7)](_0x4d3e43[_0x54df2e(0x1cf)]))
        return LIGAS[_0x54df2e(0x21d) + 'N'];
    if (_0x394577[_0x54df2e(0x1e7)](_0x4d3e43[_0x54df2e(0x1e3)]))
        return LIGAS[_0x54df2e(0x2db) + _0x54df2e(0x2c1)];
    if (_0x394577[_0x54df2e(0x1e7)](_0x4d3e43[_0x54df2e(0x232)]))
        return LIGAS[_0x54df2e(0x203) + _0x54df2e(0x1db)];
    if (_0x394577[_0x54df2e(0x1e7)](_0x4d3e43[_0x54df2e(0x1d6)]))
        return LIGAS[_0x54df2e(0x1f1) + _0x54df2e(0x226) + 'NA'];
    return LIGAS[_0x54df2e(0x2a0) + _0x54df2e(0x2d8)];
}
const LIGA_ATUAL = detectarLigaAtual();