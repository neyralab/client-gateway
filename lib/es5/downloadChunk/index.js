"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadChunk = void 0;
var axios_1 = require("axios");
var config_1 = require("../config");
var getFibonacciNumber_1 = require("../utils/getFibonacciNumber");
var downloadChunk = function (_a) {
    var index = _a.index, sha3_hash = _a.sha3_hash, oneTimeToken = _a.oneTimeToken, signal = _a.signal, endpoint = _a.endpoint, file = _a.file, startTime = _a.startTime, totalProgress = _a.totalProgress, callback = _a.callback, handlers = _a.handlers;
    return __awaiter(void 0, void 0, void 0, function () {
        var currentTry, instance, download, response, prevProgress, progress, elapsedTime, remainingBytes, bytesPerMillisecond, remainingTime, timeLeft, downloadingPercent;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    currentTry = 1;
                    instance = axios_1.default.create({
                        headers: {
                            "x-action": config_1.FILE_ACTION_TYPES.DOWNLOAD.toString(),
                            "x-chunk-index": "".concat(index),
                            "x-clientsideKeySha3Hash": sha3_hash || "",
                            "one-time-token": oneTimeToken,
                        },
                        responseType: "arraybuffer",
                        signal: signal,
                    });
                    download = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var response_1, error_1, isNetworkError, is502Error;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, new Promise(function (resolve) {
                                        setTimeout(function () {
                                            resolve();
                                        }, currentTry === 1 ? 0 : (0, getFibonacciNumber_1.getFibonacciNumber)(currentTry) * 1000);
                                    })];
                                case 1:
                                    _d.sent();
                                    _d.label = 2;
                                case 2:
                                    _d.trys.push([2, 4, , 5]);
                                    return [4 /*yield*/, instance.get(endpoint + "/chunked/downloadChunk/".concat(file === null || file === void 0 ? void 0 : file.slug))];
                                case 3:
                                    response_1 = _d.sent();
                                    if (currentTry > 1) {
                                        currentTry = 1;
                                    }
                                    return [2 /*return*/, response_1];
                                case 4:
                                    error_1 = _d.sent();
                                    isNetworkError = ((_a = error_1 === null || error_1 === void 0 ? void 0 : error_1.message) === null || _a === void 0 ? void 0 : _a.includes("Network Error")) ||
                                        ((_b = error_1 === null || error_1 === void 0 ? void 0 : error_1.message) === null || _b === void 0 ? void 0 : _b.includes("Failed to fetch"));
                                    is502Error = ((_c = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _c === void 0 ? void 0 : _c.status) === 502;
                                    if (currentTry >= (is502Error ? config_1.MAX_TRIES_502 : config_1.MAX_TRIES) ||
                                        (!isNetworkError && !is502Error)) {
                                        currentTry = 1;
                                        return [2 /*return*/, { failed: true }];
                                    }
                                    else {
                                        currentTry++;
                                        return [2 /*return*/, download()];
                                    }
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, download()];
                case 1:
                    response = _b.sent();
                    if (response.status !== 200) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    prevProgress = totalProgress.number || 0;
                    progress = +prevProgress + response.data.byteLength;
                    totalProgress.number = progress;
                    elapsedTime = Date.now() - startTime;
                    remainingBytes = file.size - progress;
                    bytesPerMillisecond = progress / elapsedTime;
                    remainingTime = remainingBytes / bytesPerMillisecond;
                    timeLeft = Math.abs(Math.ceil(remainingTime / 1000));
                    downloadingPercent = Number((progress / file.size) * 100).toFixed();
                    (handlers === null || handlers === void 0 ? void 0 : handlers.includes("onProgress")) &&
                        callback({
                            type: "onProgress",
                            params: {
                                id: file.slug,
                                progress: progress,
                                timeLeft: timeLeft,
                                downloadingPercent: downloadingPercent,
                            },
                        });
                    return [2 /*return*/, response.data];
            }
        });
    });
};
exports.downloadChunk = downloadChunk;
