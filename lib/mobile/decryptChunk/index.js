import { __awaiter } from "tslib";
import { convertBase64ToArrayBuffer } from "../utils/convertBase64ToArrayBuffer.js";
import { getFibonacciNumber } from "../utils/getFibonacciNumber.js";
import { getCrypto } from "../utils/getCrypto.js";
import { MAX_DECRYPTION_TRIES } from "../config.js";
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
