var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import { ERRORS, MAX_TRIES, MAX_TRIES_502 } from "../config";
import { getFibonacciNumber } from "../utils/getFibonacciNumber";
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
