const _0x1a9a2b = _0x1cc8;
(function (_0x4cff72, _0x201989) {
    const _0x2d9833 = _0x1cc8, _0x258091 = _0x4cff72();
    while (!![]) {
        try {
            const _0x2736f1 = -parseInt(_0x2d9833(0x130)) / (-0x17fd + 0x1f2f + -0x731 * 0x1) + parseInt(_0x2d9833(0x170)) / (-0xb05 + -0x2552 + 0x3059 * 0x1) * (parseInt(_0x2d9833(0x172)) / (0x14cd + 0x2437 + -0x3901 * 0x1)) + -parseInt(_0x2d9833(0x165)) / (-0x99b * 0x3 + -0x1e29 + -0x1 * -0x3afe) * (parseInt(_0x2d9833(0x154)) / (0x9b7 * 0x1 + -0x24ac + 0x1afa)) + -parseInt(_0x2d9833(0x185)) / (-0x3 * -0x3b + 0x362 + 0x40d * -0x1) + parseInt(_0x2d9833(0x14d)) / (0x12 * 0x1c9 + 0x22d2 + -0x42ed) + -parseInt(_0x2d9833(0x150)) / (0x829 * -0x4 + -0x3 * 0x89f + 0x3a89) * (-parseInt(_0x2d9833(0x187)) / (0x1bff + 0x1880 + -0x9e * 0x55)) + parseInt(_0x2d9833(0x168)) / (0x1795 * -0x1 + 0xa * 0x15d + 0x9fd);
            if (_0x2736f1 === _0x201989)
                break;
            else
                _0x258091['push'](_0x258091['shift']());
        } catch (_0x37b00f) {
            _0x258091['push'](_0x258091['shift']());
        }
    }
}(_0x1802, -0x138415 * -0x1 + 0x13 * -0x7952 + 0x25fb9));
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import {
    getAuth,
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    onSnapshot
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
function _0x1cc8(_0x257436, _0x119865) {
    _0x257436 = _0x257436 - (0x1c5f + -0x195c + -0x1e3);
    const _0x4de0a5 = _0x1802();
    let _0x296a8a = _0x4de0a5[_0x257436];
    return _0x296a8a;
}
const firebaseConfig = {
        'apiKey': _0x1a9a2b(0x15e) + _0x1a9a2b(0x176) + _0x1a9a2b(0x167) + _0x1a9a2b(0x178),
        'authDomain': _0x1a9a2b(0x163) + _0x1a9a2b(0x17a) + _0x1a9a2b(0x13b) + 'om',
        'projectId': _0x1a9a2b(0x163) + _0x1a9a2b(0x12f),
        'storageBucket': _0x1a9a2b(0x163) + _0x1a9a2b(0x17a) + _0x1a9a2b(0x13a) + _0x1a9a2b(0x122),
        'messagingSenderId': _0x1a9a2b(0x16e) + '29',
        'appId': _0x1a9a2b(0x16b) + _0x1a9a2b(0x18c) + _0x1a9a2b(0x14a) + _0x1a9a2b(0x171) + '4',
        'measurementId': _0x1a9a2b(0x17d) + 'HQ'
    }, app = initializeApp(firebaseConfig), auth = getAuth(app), db = getFirestore(app);
let isRedirecting = ![];
function getDeviceId() {
    const _0x44ccdc = _0x1a9a2b, _0x2a9204 = {
            'cqSVF': _0x44ccdc(0x175),
            'fQipm': function (_0x5d8c06, _0x4e61e1) {
                return _0x5d8c06 + _0x4e61e1;
            },
            'KsCbC': function (_0x5a2097, _0xb6ba2d) {
                return _0x5a2097 + _0xb6ba2d;
            },
            'VTbNI': _0x44ccdc(0x140)
        };
    let _0xfedbf3 = localStorage[_0x44ccdc(0x142)](_0x2a9204[_0x44ccdc(0x143)]);
    return !_0xfedbf3 && (_0xfedbf3 = _0x2a9204[_0x44ccdc(0x158)](_0x2a9204[_0x44ccdc(0x138)](_0x2a9204[_0x44ccdc(0x158)](_0x2a9204[_0x44ccdc(0x180)], Date[_0x44ccdc(0x186)]()), '_'), Math[_0x44ccdc(0x133)]()[_0x44ccdc(0x16a)](-0x3 * -0x1d3 + 0xd6 * 0x8 + -0x1 * 0xc05)[_0x44ccdc(0x157)](0x877 + -0x22d6 + 0x1 * 0x1a61, -0x1529 + -0xa7f + 0x1fb7)), localStorage[_0x44ccdc(0x120)](_0x2a9204[_0x44ccdc(0x143)], _0xfedbf3)), _0xfedbf3;
}
async function registerCurrentDevice(_0x526e7d) {
    const _0x294196 = _0x1a9a2b, _0x1a26fa = {
            'IaxlJ': function (_0x237bc5, _0x1c4c41, _0x326cef, _0x155489) {
                return _0x237bc5(_0x1c4c41, _0x326cef, _0x155489);
            },
            'MFlui': _0x294196(0x131),
            'tDpLl': function (_0x5747c8) {
                return _0x5747c8();
            },
            'QGSSn': function (_0x2d5d0d, _0xf50640, _0x5319c4, _0x513429) {
                return _0x2d5d0d(_0xf50640, _0x5319c4, _0x513429);
            },
            'fjMdC': _0x294196(0x16f) + _0x294196(0x123) + _0x294196(0x135)
        };
    if (!_0x526e7d)
        return ![];
    const _0x187be0 = _0x1a26fa[_0x294196(0x191)](doc, db, _0x1a26fa[_0x294196(0x137)], _0x526e7d[_0x294196(0x153)]), _0x2bf7db = _0x1a26fa[_0x294196(0x15a)](getDeviceId);
    try {
        return await _0x1a26fa[_0x294196(0x18d)](setDoc, _0x187be0, {
            'deviceId': _0x2bf7db,
            'lastLogin': new Date()[_0x294196(0x181) + 'g'](),
            'lastLoginTime': Date[_0x294196(0x186)]()
        }, { 'merge': !![] }), !![];
    } catch (_0x139124) {
        return console[_0x294196(0x14c)](_0x1a26fa[_0x294196(0x12b)], _0x139124), ![];
    }
}
function setupDeviceMonitor(_0x400a95) {
    const _0x2d2c22 = _0x1a9a2b, _0x291fe3 = {
            'bxlhB': function (_0x372be5, _0x3d4029, _0x4d0444) {
                return _0x372be5(_0x3d4029, _0x4d0444);
            },
            'ZDsEe': _0x2d2c22(0x193),
            'jMudd': function (_0x573f8f, _0x22ae74) {
                return _0x573f8f !== _0x22ae74;
            },
            'PgJPJ': _0x2d2c22(0x155) + _0x2d2c22(0x161) + _0x2d2c22(0x15c) + _0x2d2c22(0x149) + _0x2d2c22(0x148) + _0x2d2c22(0x128),
            'NURiM': _0x2d2c22(0x175),
            'WLQyJ': function (_0x6e71d4, _0x6ef984) {
                return _0x6e71d4(_0x6ef984);
            },
            'bUDJs': function (_0x5736b8, _0x5c38ca, _0x499d78, _0x5d7312) {
                return _0x5736b8(_0x5c38ca, _0x499d78, _0x5d7312);
            },
            'wIbsn': _0x2d2c22(0x131),
            'OvPdh': function (_0x5cc50b) {
                return _0x5cc50b();
            },
            'RQqdp': function (_0x9c9db1, _0x5ef5a3, _0x335939) {
                return _0x9c9db1(_0x5ef5a3, _0x335939);
            }
        };
    if (!_0x400a95)
        return;
    const _0x503a34 = _0x291fe3[_0x2d2c22(0x14b)](doc, db, _0x291fe3[_0x2d2c22(0x192)], _0x400a95[_0x2d2c22(0x153)]), _0x20dc16 = _0x291fe3[_0x2d2c22(0x136)](getDeviceId);
    return _0x291fe3[_0x2d2c22(0x127)](onSnapshot, _0x503a34, _0x2f78c6 => {
        const _0x72f2ee = _0x2d2c22, _0x1b5313 = { 'HfstM': _0x291fe3[_0x72f2ee(0x16d)] };
        if (isRedirecting)
            return;
        if (_0x2f78c6[_0x72f2ee(0x13c)]()) {
            const _0x45f5ec = _0x2f78c6[_0x72f2ee(0x179)]();
            _0x45f5ec[_0x72f2ee(0x175)] && _0x291fe3[_0x72f2ee(0x190)](_0x45f5ec[_0x72f2ee(0x175)], _0x20dc16) && (console[_0x72f2ee(0x17e)](_0x291fe3[_0x72f2ee(0x15f)]), isRedirecting = !![], localStorage[_0x72f2ee(0x195)](_0x291fe3[_0x72f2ee(0x134)]), _0x291fe3[_0x72f2ee(0x166)](signOut, auth)[_0x72f2ee(0x17b)](() => {
                const _0x2f44bd = _0x72f2ee;
                _0x291fe3[_0x2f44bd(0x141)](setTimeout, () => {
                    const _0x29c6e2 = _0x2f44bd;
                    window[_0x29c6e2(0x162)][_0x29c6e2(0x139)] = _0x1b5313[_0x29c6e2(0x13f)];
                }, -0xc06 * -0x1 + 0x1604 + 0x3b * -0x92);
            }));
        }
    });
}
let unsubscribeDeviceMonitor = null;
onAuthStateChanged(auth, async _0x35fb72 => {
    const _0x211ad2 = _0x1a9a2b, _0x507388 = {
            'FqLsy': _0x211ad2(0x13e) + _0x211ad2(0x15d),
            'HHiGk': function (_0x16bccb, _0x8db504) {
                return _0x16bccb(_0x8db504);
            },
            'JUxNU': function (_0x240968, _0xd9c2ca) {
                return _0x240968(_0xd9c2ca);
            },
            'qrNav': _0x211ad2(0x146) + _0x211ad2(0x159),
            'pFWTD': function (_0x47f05f) {
                return _0x47f05f();
            },
            'YmyBg': _0x211ad2(0x193),
            'dqpAN': _0x211ad2(0x132),
            'vipiN': _0x211ad2(0x174) + _0x211ad2(0x12a) + _0x211ad2(0x12e) + 'o:',
            'Tomji': _0x211ad2(0x12d),
            'ibvEJ': _0x211ad2(0x125)
        }, _0x30dc9b = _0x507388[_0x211ad2(0x121)][_0x211ad2(0x126)]('|');
    let _0x48c5a5 = 0x3 * -0x794 + -0x90 + -0x11c * -0x15;
    while (!![]) {
        switch (_0x30dc9b[_0x48c5a5++]) {
        case '0':
            unsubscribeDeviceMonitor = _0x507388[_0x211ad2(0x17f)](setupDeviceMonitor, _0x35fb72);
            continue;
        case '1':
            await _0x507388[_0x211ad2(0x177)](registerCurrentDevice, _0x35fb72);
            continue;
        case '2':
            console[_0x211ad2(0x17e)](_0x507388[_0x211ad2(0x17c)], _0x35fb72[_0x211ad2(0x153)]);
            continue;
        case '3':
            unsubscribeDeviceMonitor && (_0x507388[_0x211ad2(0x15b)](unsubscribeDeviceMonitor), unsubscribeDeviceMonitor = null);
            continue;
        case '4':
            window[_0x211ad2(0x162)][_0x211ad2(0x139)][_0x211ad2(0x14f)](_0x507388[_0x211ad2(0x124)]) && (window[_0x211ad2(0x162)][_0x211ad2(0x139)] = _0x507388[_0x211ad2(0x12c)]);
            continue;
        case '5':
            console[_0x211ad2(0x17e)](_0x507388[_0x211ad2(0x18b)], _0x35fb72 ? _0x507388[_0x211ad2(0x14e)] : _0x507388[_0x211ad2(0x129)]);
            continue;
        case '6':
            if (!_0x35fb72) {
                !isRedirecting && !window[_0x211ad2(0x162)][_0x211ad2(0x139)][_0x211ad2(0x14f)](_0x507388[_0x211ad2(0x124)]) && (window[_0x211ad2(0x162)][_0x211ad2(0x139)] = _0x507388[_0x211ad2(0x124)]);
                return;
            }
            continue;
        }
        break;
    }
}), window[_0x1a9a2b(0x18f)] = async function (_0x27c263, _0x517fdf) {
    const _0x138c6d = _0x1a9a2b, _0x333561 = {
            'kSXOc': function (_0x13cfbe, _0x32548c, _0x4639b4, _0x52b08d) {
                return _0x13cfbe(_0x32548c, _0x4639b4, _0x52b08d);
            },
            'ZVsDf': _0x138c6d(0x189) + _0x138c6d(0x169),
            'qckpt': function (_0x30a498, _0x13cf33) {
                return _0x30a498(_0x13cf33);
            },
            'xsXYx': function (_0x16eef1, _0x4a27ed) {
                return _0x16eef1 + _0x4a27ed;
            },
            'qUoGn': _0x138c6d(0x151) + _0x138c6d(0x147) + '\x20'
        };
    try {
        isRedirecting = ![];
        const _0x3e1e9d = await _0x333561[_0x138c6d(0x156)](signInWithEmailAndPassword, auth, _0x27c263, _0x517fdf);
        return _0x3e1e9d[_0x138c6d(0x145)];
    } catch (_0x2222a2) {
        console[_0x138c6d(0x14c)](_0x333561[_0x138c6d(0x184)], _0x2222a2), _0x333561[_0x138c6d(0x160)](alert, _0x333561[_0x138c6d(0x144)](_0x333561[_0x138c6d(0x188)], _0x2222a2[_0x138c6d(0x164)]));
        throw _0x2222a2;
    }
}, window[_0x1a9a2b(0x196)] = function () {
    const _0x181623 = _0x1a9a2b, _0x45e58f = {
            'MFJdd': _0x181623(0x193),
            'pdaRt': function (_0x137737, _0x217b73, _0x19fffe) {
                return _0x137737(_0x217b73, _0x19fffe);
            },
            'lFnJR': _0x181623(0x182) + _0x181623(0x194),
            'JyPsi': _0x181623(0x175),
            'IurRF': function (_0x127de7, _0x6799d6) {
                return _0x127de7(_0x6799d6);
            }
        };
    isRedirecting = !![], localStorage[_0x181623(0x195)](_0x45e58f[_0x181623(0x173)]), _0x45e58f[_0x181623(0x18a)](signOut, auth)[_0x181623(0x17b)](() => {
        const _0x425c56 = _0x181623;
        _0x45e58f[_0x425c56(0x18e)](setTimeout, () => {
            const _0xfdede5 = _0x425c56;
            window[_0xfdede5(0x162)][_0xfdede5(0x139)] = _0x45e58f[_0xfdede5(0x13d)];
        }, -0x11a4 + -0x6f * 0x3d + 0x2c7b);
    })[_0x181623(0x152)](_0x55bf9b => {
        const _0x2d384b = _0x181623, _0x1e86df = { 'olnjE': _0x45e58f[_0x2d384b(0x13d)] };
        console[_0x2d384b(0x14c)](_0x45e58f[_0x2d384b(0x16c)], _0x55bf9b), _0x45e58f[_0x2d384b(0x18e)](setTimeout, () => {
            const _0x4c7f34 = _0x2d384b;
            window[_0x4c7f34(0x162)][_0x4c7f34(0x139)] = _0x1e86df[_0x4c7f34(0x183)];
        }, -0x679 + -0x473 * -0x5 + -0xf62);
    });
};
function _0x1802() {
    const _0x5af417 = [
        'ositivo.\x20R',
        'c5c2b1ba66',
        'bUDJs',
        'error',
        '9651677bzuZRf',
        'Tomji',
        'includes',
        '124680rksNUE',
        'Erro\x20ao\x20fa',
        'catch',
        'uid',
        '25blmwLl',
        'Detectada\x20',
        'kSXOc',
        'substring',
        'fQipm',
        'tenticado:',
        'tDpLl',
        'pFWTD',
        'outro\x20disp',
        '0|4',
        'AIzaSyDmLG',
        'PgJPJ',
        'qckpt',
        'sessão\x20em\x20',
        'location',
        'linoautent',
        'message',
        '1104140luFnYd',
        'WLQyJ',
        '0b-zlZepXj',
        '24641250sknuRd',
        'gin:',
        'toString',
        '1:94605764',
        'lFnJR',
        'ZDsEe',
        '9460576488',
        'Erro\x20ao\x20re',
        '908884drbjqO',
        'e651f9d75d',
        '3QqkFiW',
        'JyPsi',
        'Estado\x20de\x20',
        'deviceId',
        'MBnUa2YOdP',
        'JUxNU',
        'm-zlV477A',
        'data',
        'icador.fir',
        'then',
        'qrNav',
        'G-4WT805FF',
        'log',
        'HHiGk',
        'VTbNI',
        'toISOStrin',
        'Erro\x20ao\x20sa',
        'olnjE',
        'ZVsDf',
        '5426292uIUoGo',
        'now',
        '153xVWNsu',
        'qUoGn',
        'Erro\x20no\x20lo',
        'IurRF',
        'vipiN',
        '8829:web:a',
        'QGSSn',
        'pdaRt',
        'login',
        'jMudd',
        'IaxlJ',
        'wIbsn',
        'auth.html',
        'ir:',
        'removeItem',
        'logout',
        'setItem',
        'FqLsy',
        'ge.app',
        'gistrar\x20di',
        'YmyBg',
        'Deslogado',
        'split',
        'RQqdp',
        'logout.',
        'ibvEJ',
        'autenticaç',
        'fjMdC',
        'dqpAN',
        'Logado',
        'ão\x20alterad',
        'icador',
        '1433294crKKdV',
        'users',
        '/home.html',
        'random',
        'NURiM',
        'spositivo:',
        'OvPdh',
        'MFlui',
        'KsCbC',
        'href',
        'ebasestora',
        'ebaseapp.c',
        'exists',
        'MFJdd',
        '5|3|6|2|1|',
        'HfstM',
        'device_',
        'bxlhB',
        'getItem',
        'cqSVF',
        'xsXYx',
        'user',
        'Usuário\x20au',
        'zer\x20login:',
        'ealizando\x20'
    ];
    _0x1802 = function () {
        return _0x5af417;
    };
    return _0x1802();
}