var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { convertBase64ToArrayBuffer } from "../utils/convertBase64ToArrayBuffer";
import { getFibonacciNumber } from "../utils/getFibonacciNumber";
import { getCrypto } from "../utils/getCrypto";
import { MAX_DECRYPTION_TRIES } from "../config";
const crypto = getCrypto();
export const decryptChunk = ({ chunk, iv, key }) => __awaiter(void 0, void 0, void 0, function* () {
    const activationKey = yield crypto.subtle.importKey("raw", key, {
        name: "AES-GCM",
        length: 256,
    }, true, ["encrypt", "decrypt"]);
    const ivBufferSource = convertBase64ToArrayBuffer(iv);
    const normalizedIv = new Uint8Array(ivBufferSource);
    let currentTry = 1;
    const decrypt = () => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, currentTry === 1 ? 0 : getFibonacciNumber(currentTry) * 1000);
        });
        try {
            const response = yield crypto.subtle.decrypt({
                name: "AES-GCM",
                iv: normalizedIv,
            }, activationKey, chunk);
            if (currentTry > 1) {
                currentTry = 1;
            }
            return response;
        }
        catch (error) {
            if (currentTry >= MAX_DECRYPTION_TRIES) {
                currentTry = 1;
                return { failed: true };
            }
            currentTry++;
            return decrypt();
        }
    });
    return yield decrypt();
});
