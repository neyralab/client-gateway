import * as forge from "node-forge";
export var publicKeyToPem = function (_a) {
    var publicKey = _a.publicKey;
    try {
        return forge.pki.publicKeyToPem(publicKey);
    }
    catch (error) {
        throw new Error(error);
    }
};
