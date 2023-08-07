"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.sendChunk = void 0;
var axios_1 = require("axios");
var Base64 = require("base64-js");
var getFibonacciNumber_1 = require("../utils/getFibonacciNumber");
var convertTextToBase64_1 = require("../utils/convertTextToBase64");
var config_1 = require("../config");
var sendChunk = function (chunk, currentIndex, chunkLength, file, startTime, oneTimeToken, endpoint, iv, clientsideKeySha3Hash, dispatch, updateProgressCallback, getProgressFromLSCallback, setProgressToLSCallback) { return __awaiter(void 0, void 0, void 0, function () {
    var base64iv, fileName, currentTry, headers, inst, uploadChunk;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("gd-library ---> sendChunk");
                base64iv = iv ? Base64.fromByteArray(iv) : null;
                fileName = (0, convertTextToBase64_1.convertTextToBase64)(file.name);
                currentTry = 1;
                headers = iv
                    ? {
                        "x-clientsideKeySha3Hash": clientsideKeySha3Hash,
                        "x-iv": base64iv,
                    }
                    : { "x-clientsideKeySha3Hash": "null", "x-iv": "null" };
                inst = axios_1.default.create({
                    headers: __assign({ "content-type": "application/octet-stream", "one-time-token": oneTimeToken, "x-file-name": fileName, "x-last": "".concat(currentIndex, "/").concat(chunkLength), "x-chunk-index": "".concat(currentIndex), "X-folder": file.folderId || "", "x-mime": file === null || file === void 0 ? void 0 : file.type, "X-Ai-Generated": false }, headers),
                    onUploadProgress: function (event) {
                        if (event.loaded === chunk.byteLength) {
                            var prevProgress = getProgressFromLSCallback() || 0;
                            var progress = +prevProgress + event.loaded;
                            setProgressToLSCallback(progress.toString());
                            var elapsedTime = Date.now() - startTime;
                            var remainingBytes = file.size - progress;
                            var bytesPerMillisecond = progress / elapsedTime;
                            var remainingTime = remainingBytes / bytesPerMillisecond;
                            var timeLeft = Math.abs(Math.ceil(remainingTime / 1000));
                            updateProgressCallback(file.upload_id, progress, timeLeft, dispatch);
                        }
                    },
                    // cancelToken: file.source?.token, // TODO figure out why it arguing
                });
                uploadChunk = function (chunk) { return __awaiter(void 0, void 0, void 0, function () {
                    var response, error_1;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, new Promise(function (resolve) {
                                    setTimeout(function () {
                                        resolve();
                                    }, currentTry === 1 ? 0 : (0, getFibonacciNumber_1.getFibonacciNumber)(currentTry) * 1000);
                                })];
                            case 1:
                                _b.sent();
                                _b.label = 2;
                            case 2:
                                _b.trys.push([2, 4, , 5]);
                                return [4 /*yield*/, inst.post("".concat(endpoint, "/chunked/uploadChunk"), chunk)];
                            case 3:
                                response = _b.sent();
                                if (currentTry > 1) {
                                    currentTry = 1;
                                }
                                return [2 /*return*/, response];
                            case 4:
                                error_1 = _b.sent();
                                console.log("gd-library ---> sendChunk error", error_1);
                                if (currentTry >= config_1.MAX_TRIES ||
                                    !((_a = error_1 === null || error_1 === void 0 ? void 0 : error_1.message) === null || _a === void 0 ? void 0 : _a.includes("Network Error"))) {
                                    currentTry = 1;
                                    return [2 /*return*/, { failed: true }];
                                }
                                else {
                                    currentTry++;
                                    return [2 /*return*/, uploadChunk(chunk)];
                                }
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, uploadChunk(chunk)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.sendChunk = sendChunk;
