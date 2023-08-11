"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicKeyToPem = void 0;
var publicKeyToPem = function (publicKey) {
    try {
        return window.forge.pki.publicKeyToPem(publicKey);
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.publicKeyToPem = publicKeyToPem;
