import { Crypto } from "@peculiar/webcrypto";
export var getCrypto = function () {
    var _a;
    if (typeof window === undefined) {
        return new Crypto();
    }
    else if (!((_a = window.crypto) === null || _a === void 0 ? void 0 : _a.subtle)) {
        return new Crypto();
    }
    else {
        return window.crypto;
    }
};
