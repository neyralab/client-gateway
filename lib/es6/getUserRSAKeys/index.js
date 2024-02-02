var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as forge from "node-forge";
export const getUserRSAKeys = function ({ signer }) {
    return __awaiter(this, void 0, void 0, function* () {
        const msg = "Welcome to GhostDrive! \n\nPlease sign to start using this for encryption with Ghostdrive. \n" +
            "This will not trigger a blockchain transaction or cost any gas fees. \n\n" +
            "What's happening?\n" +
            "A public key will be registered with this address and \n" +
            "used only for data encryption.";
        const rnd = yield signer.signMessage(msg);
        const prng = forge.random.createInstance();
        prng.seedFileSync = function (needed) {
            let outputString = "";
            while (outputString.length < needed) {
                outputString += rnd;
            }
            return outputString.slice(0, needed);
        };
        return forge.pki.rsa.generateKeyPair({ bits: 2048, prng });
    });
};
