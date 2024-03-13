import { __awaiter } from "tslib";
import axios from "axios";
import { ERRORS, FILE_ACTION_TYPES, MAX_TRIES, MAX_TRIES_502 } from "../config.js";
import { getFibonacciNumber } from "../utils/getFibonacciNumber.js";
export const downloadChunk = ({ index, sha3_hash, oneTimeToken, signal, endpoint, file, startTime, totalProgress, callback, handlers, }) => __awaiter(void 0, void 0, void 0, function* () {
    let currentTry = 1;
    const instance = axios.create({
        headers: {
            "x-action": FILE_ACTION_TYPES.DOWNLOAD.toString(),
            "x-chunk-index": `${index}`,
            "x-clientsideKeySha3Hash": sha3_hash || "",
            "one-time-token": oneTimeToken,
        },
        responseType: "arraybuffer",
        signal,
    });
    const download = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        yield new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, currentTry === 1 ? 0 : getFibonacciNumber(currentTry) * 1000);
        });
        try {
            const response = yield instance.get(endpoint + `/chunked/downloadChunk/${file === null || file === void 0 ? void 0 : file.slug}`);
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
                return download();
            }
        }
    });
    const response = yield download();
    if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const prevProgress = totalProgress.number || 0;
    const progress = +prevProgress + response.data.byteLength;
    totalProgress.number = progress;
    const elapsedTime = Date.now() - startTime;
    const remainingBytes = file.size - progress;
    const bytesPerMillisecond = progress / elapsedTime;
    const remainingTime = remainingBytes / bytesPerMillisecond;
    const timeLeft = Math.abs(Math.ceil(remainingTime / 1000));
    const downloadingPercent = Number((progress / file.size) * 100).toFixed();
    (handlers === null || handlers === void 0 ? void 0 : handlers.includes("onProgress")) &&
        callback({
            type: "onProgress",
            params: {
                id: file.slug,
                progress,
                timeLeft,
                downloadingPercent,
            },
        });
    return response.data;
});
