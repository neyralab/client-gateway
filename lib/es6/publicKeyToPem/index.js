export var publicKeyToPem = function (publicKey) {
    try {
        return window.forge.pki.publicKeyToPem(publicKey);
    }
    catch (error) {
        throw new Error(error);
    }
};
