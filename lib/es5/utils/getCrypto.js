"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCrypto = void 0;
var webcrypto_1 = require("@peculiar/webcrypto");
var hasWindow_1 = require("./hasWindow");
var getCrypto = function () {
    var _a;
    if (!(0, hasWindow_1.hasWindow)()) {
        return new webcrypto_1.Crypto();
    }
    else if (!((_a = window.crypto) === null || _a === void 0 ? void 0 : _a.subtle)) {
        return new webcrypto_1.Crypto();
    }
    else {
        return window.crypto;
    }
};
exports.getCrypto = getCrypto;
