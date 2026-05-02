const _0x383314 = _0x3796;
(function (_0x495451, _0x35b447) {
    const _0x581882 = _0x3796, _0x44524c = _0x495451();
    while (!![]) {
        try {
            const _0x5b9429 = parseInt(_0x581882(0x99)) / (-0x1 * -0x1d7c + 0x1d0e + -0x3a89) + parseInt(_0x581882(0x80)) / (-0x21 * -0x16 + 0x14c8 + 0x5e7 * -0x4) + -parseInt(_0x581882(0x71)) / (0x3cb * 0x1 + 0x116 * 0x11 + -0x163e) * (parseInt(_0x581882(0x90)) / (-0x56 * -0x59 + 0x1195 * -0x1 + -0xc4d)) + -parseInt(_0x581882(0x95)) / (-0x697 + 0x1b15 + -0x1479) * (parseInt(_0x581882(0x77)) / (0x169f * 0x1 + -0x1208 + -0x491)) + parseInt(_0x581882(0x98)) / (0xeba + 0x1ec + -0x109f) * (-parseInt(_0x581882(0xbe)) / (-0x988 * -0x2 + -0xff1 + 0x317 * -0x1)) + -parseInt(_0x581882(0x66)) / (0x2 * 0x70f + 0x1 * 0x195e + -0x2773) + parseInt(_0x581882(0xbd)) / (0x1daf + -0x26c4 + 0x91f);
            if (_0x5b9429 === _0x35b447)
                break;
            else
                _0x44524c['push'](_0x44524c['shift']());
        } catch (_0xf6c1ef) {
            _0x44524c['push'](_0x44524c['shift']());
        }
    }
}(_0x3ce8, -0x3d * 0x34ce + -0x16e224 + 0x2f6e88));
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
function _0x3796(_0x1349f4, _0x3f7d44) {
    _0x1349f4 = _0x1349f4 - (0x1 * -0x1109 + -0x15 * -0x151 + 0xa36 * -0x1);
    const _0x212632 = _0x3ce8();
    let _0x1800ea = _0x212632[_0x1349f4];
    return _0x1800ea;
}
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
    onSnapshot
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
const firebaseConfig = {
        'apiKey': _0x383314(0x68) + _0x383314(0x8f) + _0x383314(0xc0) + _0x383314(0x9d),
        'authDomain': _0x383314(0x7b) + _0x383314(0x9e) + _0x383314(0x6e) + 'om',
        'projectId': _0x383314(0x7b) + _0x383314(0xc4),
        'storageBucket': _0x383314(0x7b) + _0x383314(0x9e) + _0x383314(0xa2) + _0x383314(0xca),
        'messagingSenderId': _0x383314(0x6b) + '29',
        'appId': _0x383314(0xb6) + _0x383314(0x84) + _0x383314(0xb1) + _0x383314(0xbf) + '4',
        'measurementId': _0x383314(0xaa) + 'HQ'
    }, app = initializeApp(firebaseConfig), auth = getAuth(app), db = getFirestore(app);
let isRedirecting = ![];
function getDeviceId() {
    const _0x133892 = _0x383314, _0x541cc0 = {
            'ePWRg': _0x133892(0xa4),
            'bAfyU': function (_0x2d0070, _0x14f1aa) {
                return _0x2d0070 + _0x14f1aa;
            },
            'XPbpg': function (_0xcd4dba, _0x33f900) {
                return _0xcd4dba + _0x33f900;
            },
            'YKQHj': _0x133892(0x96)
        };
    let _0x5ebe13 = localStorage[_0x133892(0x9c)](_0x541cc0[_0x133892(0x70)]);
    return !_0x5ebe13 && (_0x5ebe13 = _0x541cc0[_0x133892(0xac)](_0x541cc0[_0x133892(0xac)](_0x541cc0[_0x133892(0x93)](_0x541cc0[_0x133892(0xc1)], Date[_0x133892(0x79)]()), '_'), Math[_0x133892(0xb3)]()[_0x133892(0x9f)](-0x4 * -0x65c + -0x5 * 0x3ac + -0x6f0)[_0x133892(0xb5)](0x62 * -0x7 + -0x6c5 + 0x9 * 0x10d, 0x27 * -0x76 + 0x8b * 0x1 + 0x117e)), localStorage[_0x133892(0x9a)](_0x541cc0[_0x133892(0x70)], _0x5ebe13)), _0x5ebe13;
}
async function registerCurrentDevice(_0x31d5b5) {
    const _0x5e02a2 = _0x383314, _0x44e9b1 = {
            'UUmId': function (_0x2bd6d7, _0x571307, _0x18648e, _0x569867) {
                return _0x2bd6d7(_0x571307, _0x18648e, _0x569867);
            },
            'FpecX': _0x5e02a2(0xa0),
            'YJzcC': function (_0x1258d3) {
                return _0x1258d3();
            },
            'WdpMY': _0x5e02a2(0x7c) + _0x5e02a2(0xc6) + _0x5e02a2(0x87)
        };
    if (!_0x31d5b5)
        return ![];
    const _0x41a5fe = _0x44e9b1[_0x5e02a2(0x8d)](doc, db, _0x44e9b1[_0x5e02a2(0x75)], _0x31d5b5[_0x5e02a2(0xcb)]), _0x36f8d0 = _0x44e9b1[_0x5e02a2(0x6f)](getDeviceId);
    try {
        return await _0x44e9b1[_0x5e02a2(0x8d)](setDoc, _0x41a5fe, {
            'deviceId': _0x36f8d0,
            'lastLogin': new Date()[_0x5e02a2(0x82) + 'g'](),
            'lastLoginTime': Date[_0x5e02a2(0x79)]()
        }, { 'merge': !![] }), !![];
    } catch (_0x157634) {
        return console[_0x5e02a2(0x97)](_0x44e9b1[_0x5e02a2(0x81)], _0x157634), ![];
    }
}
function setupDeviceMonitor(_0x3dd51f) {
    const _0x2ed74d = _0x383314, _0x3c67c3 = {
            'qFmfw': function (_0x4ef039, _0x353e5a, _0x3c3d97) {
                return _0x4ef039(_0x353e5a, _0x3c3d97);
            },
            'gqSih': _0x2ed74d(0x73),
            'tSvlD': function (_0x18a8b7, _0x56e805) {
                return _0x18a8b7 !== _0x56e805;
            },
            'hbEEv': _0x2ed74d(0x72) + _0x2ed74d(0x89) + _0x2ed74d(0x86) + _0x2ed74d(0x88),
            'FWqEy': _0x2ed74d(0xa4),
            'Ppqvs': function (_0x5daf93, _0x546581) {
                return _0x5daf93(_0x546581);
            },
            'fDiGm': function (_0x11f889, _0x133bb5, _0x44b4f8, _0x544d2a) {
                return _0x11f889(_0x133bb5, _0x44b4f8, _0x544d2a);
            },
            'qONuF': _0x2ed74d(0xa0),
            'oulnW': function (_0x31a38b) {
                return _0x31a38b();
            }
        };
    if (!_0x3dd51f)
        return;
    const _0x55736d = _0x3c67c3[_0x2ed74d(0xbb)](doc, db, _0x3c67c3[_0x2ed74d(0xa7)], _0x3dd51f[_0x2ed74d(0xcb)]), _0xf226b7 = _0x3c67c3[_0x2ed74d(0xba)](getDeviceId);
    return _0x3c67c3[_0x2ed74d(0x8b)](onSnapshot, _0x55736d, _0x5ae701 => {
        const _0x36e838 = _0x2ed74d, _0x2cf5b5 = { 'AqvBr': _0x3c67c3[_0x36e838(0x91)] };
        if (isRedirecting)
            return;
        if (_0x5ae701[_0x36e838(0x8e)]()) {
            const _0x1e4988 = _0x5ae701[_0x36e838(0xa1)]();
            _0x1e4988[_0x36e838(0xa4)] && _0x3c67c3[_0x36e838(0xb0)](_0x1e4988[_0x36e838(0xa4)], _0xf226b7) && (console[_0x36e838(0xc2)](_0x3c67c3[_0x36e838(0xc7)]), isRedirecting = !![], localStorage[_0x36e838(0x6c)](_0x3c67c3[_0x36e838(0xa9)]), _0x3c67c3[_0x36e838(0xc8)](signOut, auth)[_0x36e838(0xbc)](() => {
                const _0xd46c90 = _0x36e838;
                _0x3c67c3[_0xd46c90(0x8b)](setTimeout, () => {
                    const _0x30ac13 = _0xd46c90;
                    window[_0x30ac13(0xc9)][_0x30ac13(0xb2)] = _0x2cf5b5[_0x30ac13(0x6d)];
                }, 0x257e + -0x2 * -0xd3 + -0x26c0);
            }));
        }
    });
}
function _0x3ce8() {
    const _0x3fbfeb = [
        'location',
        'ge.app',
        'uid',
        'VFToF',
        'WEYhp',
        '7246377uVUNqx',
        'mdQLE',
        'AIzaSyDmLG',
        'zHVoE',
        'includes',
        '9460576488',
        'removeItem',
        'AqvBr',
        'ebaseapp.c',
        'YJzcC',
        'ePWRg',
        '513381dyEAhS',
        'Sessão\x20em\x20',
        'auth.html',
        'split',
        'FpecX',
        'UwrYy',
        '252PKmWvC',
        'gin:',
        'now',
        'yydMT',
        'linoautent',
        'Erro\x20ao\x20re',
        'utUfU',
        'Logado',
        'RAaTI',
        '2558120ASbQhP',
        'WdpMY',
        'toISOStrin',
        'logout',
        '8829:web:a',
        'dgxTz',
        'ositivo.\x20L',
        'spositivo:',
        'ogout.',
        'outro\x20disp',
        'MMDBI',
        'qFmfw',
        'Erro\x20no\x20lo',
        'UUmId',
        'exists',
        'MBnUa2YOdP',
        '20lUMTso',
        'gqSih',
        'gWqrn',
        'XPbpg',
        'catch',
        '27045JunCUw',
        'device_',
        'error',
        '63jtfYBe',
        '124774hYhCKu',
        'setItem',
        'Deslogado',
        'getItem',
        'm-zlV477A',
        'icador.fir',
        'toString',
        'users',
        'data',
        'ebasestora',
        '5|2|0|1|3|',
        'deviceId',
        'message',
        'nrloX',
        'qONuF',
        'zer\x20login:',
        'FWqEy',
        'G-4WT805FF',
        'user',
        'bAfyU',
        'ViJMR',
        '/home.html',
        'login',
        'tSvlD',
        'c5c2b1ba66',
        'href',
        'random',
        'XKisM',
        'substring',
        '1:94605764',
        'Auth:',
        'IQQIX',
        'rBLcc',
        'oulnW',
        'fDiGm',
        'then',
        '16074490NrRxot',
        '301432gxWlBy',
        'e651f9d75d',
        '0b-zlZepXj',
        'YKQHj',
        'log',
        'Erro\x20ao\x20fa',
        'icador',
        'vPfQy',
        'gistrar\x20di',
        'hbEEv',
        'Ppqvs'
    ];
    _0x3ce8 = function () {
        return _0x3fbfeb;
    };
    return _0x3ce8();
}
let unsubscribeDeviceMonitor = null;
onAuthStateChanged(auth, async _0xa0945b => {
    const _0x12811b = _0x383314, _0x5472e2 = {
            'MMDBI': _0x12811b(0xa3) + '4',
            'dgxTz': _0x12811b(0x73),
            'RAaTI': function (_0x48c345, _0x383628) {
                return _0x48c345(_0x383628);
            },
            'UwrYy': function (_0x4b65d8) {
                return _0x4b65d8();
            },
            'rBLcc': function (_0xae0ca3, _0x5cf671) {
                return _0xae0ca3(_0x5cf671);
            },
            'ViJMR': _0x12811b(0xae),
            'vPfQy': _0x12811b(0xb7),
            'IQQIX': _0x12811b(0x7e),
            'nrloX': _0x12811b(0x9b)
        }, _0x5e8bce = _0x5472e2[_0x12811b(0x8a)][_0x12811b(0x74)]('|');
    let _0x5014e8 = 0xb67 + -0x3 * 0x349 + -0x2 * 0xc6;
    while (!![]) {
        switch (_0x5e8bce[_0x5014e8++]) {
        case '0':
            if (!_0xa0945b) {
                !isRedirecting && !window[_0x12811b(0xc9)][_0x12811b(0xb2)][_0x12811b(0x6a)](_0x5472e2[_0x12811b(0x85)]) && (window[_0x12811b(0xc9)][_0x12811b(0xb2)] = _0x5472e2[_0x12811b(0x85)]);
                return;
            }
            continue;
        case '1':
            await _0x5472e2[_0x12811b(0x7f)](registerCurrentDevice, _0xa0945b);
            continue;
        case '2':
            unsubscribeDeviceMonitor && (_0x5472e2[_0x12811b(0x76)](unsubscribeDeviceMonitor), unsubscribeDeviceMonitor = null);
            continue;
        case '3':
            unsubscribeDeviceMonitor = _0x5472e2[_0x12811b(0xb9)](setupDeviceMonitor, _0xa0945b);
            continue;
        case '4':
            window[_0x12811b(0xc9)][_0x12811b(0xb2)][_0x12811b(0x6a)](_0x5472e2[_0x12811b(0x85)]) && (window[_0x12811b(0xc9)][_0x12811b(0xb2)] = _0x5472e2[_0x12811b(0xad)]);
            continue;
        case '5':
            console[_0x12811b(0xc2)](_0x5472e2[_0x12811b(0xc5)], _0xa0945b ? _0x5472e2[_0x12811b(0xb8)] : _0x5472e2[_0x12811b(0xa6)]);
            continue;
        }
        break;
    }
}), window[_0x383314(0xaf)] = async function (_0x49353e, _0x11af2e) {
    const _0x2b6bb6 = _0x383314, _0x118811 = {
            'VFToF': function (_0x4fcf66, _0x2933ac, _0xed85b, _0x4d6f02) {
                return _0x4fcf66(_0x2933ac, _0xed85b, _0x4d6f02);
            },
            'utUfU': _0x2b6bb6(0x8c) + _0x2b6bb6(0x78),
            'mdQLE': function (_0x3dbe0e, _0x191a88) {
                return _0x3dbe0e(_0x191a88);
            },
            'yydMT': function (_0x4d52a2, _0x4cc9a2) {
                return _0x4d52a2 + _0x4cc9a2;
            },
            'zHVoE': _0x2b6bb6(0xc3) + _0x2b6bb6(0xa8) + '\x20'
        };
    try {
        isRedirecting = ![];
        const _0x36f317 = await _0x118811[_0x2b6bb6(0xcc)](signInWithEmailAndPassword, auth, _0x49353e, _0x11af2e);
        return _0x36f317[_0x2b6bb6(0xab)];
    } catch (_0x440070) {
        console[_0x2b6bb6(0x97)](_0x118811[_0x2b6bb6(0x7d)], _0x440070), _0x118811[_0x2b6bb6(0x67)](alert, _0x118811[_0x2b6bb6(0x7a)](_0x118811[_0x2b6bb6(0x69)], _0x440070[_0x2b6bb6(0xa5)]));
        throw _0x440070;
    }
}, window[_0x383314(0x83)] = function () {
    const _0x134a15 = _0x383314, _0x3454c9 = {
            'XKisM': _0x134a15(0x73),
            'WEYhp': _0x134a15(0xa4),
            'gWqrn': function (_0x2a9134, _0x10ad22) {
                return _0x2a9134(_0x10ad22);
            }
        };
    isRedirecting = !![], localStorage[_0x134a15(0x6c)](_0x3454c9[_0x134a15(0xcd)]), _0x3454c9[_0x134a15(0x92)](signOut, auth)[_0x134a15(0xbc)](() => setTimeout(() => {
        const _0x5e5679 = _0x134a15;
        window[_0x5e5679(0xc9)][_0x5e5679(0xb2)] = _0x3454c9[_0x5e5679(0xb4)];
    }, 0x2 * 0x12f3 + 0xc18 + -0x7 * 0x716))[_0x134a15(0x94)](() => setTimeout(() => {
        const _0x26cfb4 = _0x134a15;
        window[_0x26cfb4(0xc9)][_0x26cfb4(0xb2)] = _0x3454c9[_0x26cfb4(0xb4)];
    }, 0x4 * -0x84e + -0x2478 + 0x4614));
};