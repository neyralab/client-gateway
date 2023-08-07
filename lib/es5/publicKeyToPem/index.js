"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicKeyToPem = void 0;
var publicKeyToPem = function (publicKey) {
    return window.forge.pki.publicKeyToPem(publicKey);
};
exports.publicKeyToPem = publicKeyToPem;
