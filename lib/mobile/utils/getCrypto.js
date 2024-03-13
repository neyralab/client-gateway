import { Crypto } from "@peculiar/webcrypto";
import { isBrowser } from "./isBrowser.js";
export const getCrypto = () => {
    var _a;
    if (!isBrowser()) {
        return new Crypto();
    }
    else if (!((_a = window.crypto) === null || _a === void 0 ? void 0 : _a.subtle)) {
        return new Crypto();
    }
    else {
        return window.crypto;
    }
};
