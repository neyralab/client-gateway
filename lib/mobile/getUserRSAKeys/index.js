import { __awaiter } from "tslib";
import * as forge from "node-forge";
// @ts-ignore
const nodeForge = forge.default !== undefined ? forge.default : forge;
export const getUserRSAKeys = function ({ signer }) {
    return __awaiter(this, void 0, void 0, function* () {
        const msg = "Welcome to Neyra Network! \n\nPlease sign to start using this for encryption with Neyra. \n" +
            "This will not trigger a blockchain transaction or cost any gas fees. \n\n" +
            "What's happening?\n" +
            "A public key will be registered with this address and \n" +
            "used only for data encryption.";
        const rnd = yield signer.signMessage(msg);
        const prng = nodeForge.random.createInstance();
        prng.seedFileSync = function (needed) {
            let outputString = "";
            while (outputString.length < needed) {
                outputString += rnd;
            }
            return outputString.slice(0, needed);
        };
        return nodeForge.pki.rsa.generateKeyPair({ bits: 2048, prng });
    });
};
