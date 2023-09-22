var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import axios from "axios";
import * as Base64 from "base64-js";
import * as setCookieParser from "set-cookie-parser";
import { getFibonacciNumber } from "../utils/getFibonacciNumber";
import { convertTextToBase64 } from "../utils/convertTextToBase64";
import { postWithCookies } from "../utils/makeRequestWithCookies";
import { isBrowser } from "../utils/isBrowser";
import { CHUNK_SIZE, MAX_TRIES } from "../config";
export var sendChunk = function (_a) {
    var chunk = _a.chunk, index = _a.index, file = _a.file, startTime = _a.startTime, oneTimeToken = _a.oneTimeToken, endpoint = _a.endpoint, iv = _a.iv, clientsideKeySha3Hash = _a.clientsideKeySha3Hash, totalProgress = _a.totalProgress, callback = _a.callback, handlers = _a.handlers, controller = _a.controller;
    return __awaiter(void 0, void 0, void 0, function () {
        var base64iv, fileName, chunksLength, currentTry, cookieJar, headers, uploadChunk;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    base64iv = iv ? Base64.fromByteArray(iv) : null;
                    fileName = convertTextToBase64(file.name);
                    chunksLength = Math.ceil(file.size / CHUNK_SIZE);
                    currentTry = 1;
                    cookieJar = [];
                    headers = {
                        "content-type": "application/octet-stream",
                        "one-time-token": oneTimeToken,
                        "x-file-name": fileName,
                        "x-last": "".concat(index, "/").concat(chunksLength),
                        "x-chunk-index": "".concat(index),
                        "X-folder": file.folderId || "",
                        "x-mime": file === null || file === void 0 ? void 0 : file.type,
                        "X-Ai-Generated": false,
                        "x-clientsideKeySha3Hash": iv ? clientsideKeySha3Hash : "null",
                        "x-iv": iv ? base64iv : "null",
                    };
                    uploadChunk = function (chunk) { return __awaiter(void 0, void 0, void 0, function () {
                        var response, prevProgress, progress, elapsedTime, remainingBytes, bytesPerMillisecond, remainingTime, timeLeft, error_1;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, new Promise(function (resolve) {
                                        setTimeout(function () {
                                            resolve();
                                        }, currentTry === 1 ? 0 : getFibonacciNumber(currentTry) * 1000);
                                    })];
                                case 1:
                                    _b.sent();
                                    _b.label = 2;
                                case 2:
                                    _b.trys.push([2, 6, , 7]);
                                    response = void 0;
                                    if (!!isBrowser()) return [3 /*break*/, 3];
                                    response = axios
                                        .get("".concat(endpoint), {
                                        headers: {
                                            "content-type": "application/octet-stream",
                                            "one-time-token": oneTimeToken,
                                        },
                                    })
                                        .then(function (response) {
                                        if (response.headers["set-cookie"]) {
                                            var parsed = setCookieParser.parse(response.headers["set-cookie"]);
                                            for (var _i = 0, parsed_1 = parsed; _i < parsed_1.length; _i++) {
                                                var cookieObject = parsed_1[_i];
                                                var cookieString = "".concat(cookieObject.name, "=").concat(cookieObject.value);
                                                cookieJar.push(cookieString);
                                            }
                                        }
                                    })
                                        .then(function () {
                                        return postWithCookies("".concat(endpoint, "/chunked/uploadChunk"), headers, cookieJar, controller ? controller.signal : undefined, chunk);
                                    })
                                        .catch(function (error) {
                                        console.log("Error:", error);
                                    });
                                    return [3 /*break*/, 5];
                                case 3: return [4 /*yield*/, axios.post("".concat(endpoint, "/chunked/uploadChunk"), chunk, {
                                        headers: headers,
                                        signal: controller.signal,
                                    })];
                                case 4:
                                    response = _b.sent();
                                    _b.label = 5;
                                case 5:
                                    if (currentTry > 1) {
                                        currentTry = 1;
                                    }
                                    prevProgress = totalProgress.number || 0;
                                    progress = +prevProgress + chunk.byteLength;
                                    totalProgress.number = progress;
                                    elapsedTime = Date.now() - startTime;
                                    remainingBytes = file.size - progress;
                                    bytesPerMillisecond = progress / elapsedTime;
                                    remainingTime = remainingBytes / bytesPerMillisecond;
                                    timeLeft = Math.abs(Math.ceil(remainingTime / 1000));
                                    handlers.includes("onProgress") &&
                                        callback({
                                            type: "onProgress",
                                            params: { id: file.uploadId, progress: progress, timeLeft: timeLeft },
                                        });
                                    return [2 /*return*/, response];
                                case 6:
                                    error_1 = _b.sent();
                                    console.error("ERROR", error_1);
                                    if (currentTry >= MAX_TRIES ||
                                        !((_a = error_1 === null || error_1 === void 0 ? void 0 : error_1.message) === null || _a === void 0 ? void 0 : _a.includes("Network Error"))) {
                                        currentTry = 1;
                                        return [2 /*return*/, { failed: true }];
                                    }
                                    else {
                                        currentTry++;
                                        return [2 /*return*/, uploadChunk(chunk)];
                                    }
                                    return [3 /*break*/, 7];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, uploadChunk(chunk)];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
};
