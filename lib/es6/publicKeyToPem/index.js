import * as forge from "node-forge";
export var publicKeyToPem = function (publicKey) {
    try {
        return forge.pki.publicKeyToPem(publicKey);
    }
    catch (error) {
        throw new Error(error);
    }
};
