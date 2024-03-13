import { __awaiter } from "tslib";
import { getCrypto } from "../utils/getCrypto.js";
const crypto = getCrypto();
export const encryptChunk = ({ chunk, iv, key }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, chunk);
});
