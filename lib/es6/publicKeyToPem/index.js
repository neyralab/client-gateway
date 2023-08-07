export var publicKeyToPem = function (publicKey) {
    return window.forge.pki.publicKeyToPem(publicKey);
};
