"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicKeyToPem = void 0;
var forge = require("node-forge");
var publicKeyToPem = function (_a) {
    var publicKey = _a.publicKey;
    try {
        return forge.pki.publicKeyToPem(publicKey);
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.publicKeyToPem = publicKeyToPem;
