import { __awaiter } from "tslib";
import axios from "axios";
import { ERRORS, MAX_TRIES, MAX_TRIES_502 } from "../config.js";
import { getFibonacciNumber } from "../utils/getFibonacciNumber.js";
export const countChunks = ({ endpoint, oneTimeToken, slug, signal, }) => __awaiter(void 0, void 0, void 0, function* () {
    let currentTry = 1;
    const instance = axios.create({
        headers: {
            "one-time-token": oneTimeToken,
            "X-Slug": slug,
        },
        signal,
    });
    const getChunkCount = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        yield new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, currentTry === 1 ? 0 : getFibonacciNumber(currentTry) * 1000);
        });
        try {
            const response = yield instance.get(endpoint + "/chunked/chunkCount");
            if (currentTry > 1) {
                currentTry = 1;
            }
            return response;
        }
        catch (error) {
            const isNetworkError = ((_a = error === null || error === void 0 ? void 0 : error.message) === null || _a === void 0 ? void 0 : _a.includes("Network Error")) ||
                ((_b = error === null || error === void 0 ? void 0 : error.message) === null || _b === void 0 ? void 0 : _b.includes("Failed to fetch"));
            const isOtherError = ERRORS.includes((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.status);
            if (currentTry >= (isOtherError ? MAX_TRIES_502 : MAX_TRIES) ||
                (!isNetworkError && !isOtherError)) {
                currentTry = 1;
                return { failed: true };
            }
            else {
                currentTry++;
                return getChunkCount();
            }
        }
    });
    return yield getChunkCount();
});
