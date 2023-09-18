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
import * as forge from "node-forge";
import * as Base64 from "base64-js";
import { chunkFile, downloadFile, encryptChunk, sendChunk, swapChunk, } from "../index";
import { getCrypto } from "../utils/getCrypto";
var crypto = getCrypto();
var fileKey = forge.random.getBytesSync(32); // 32 bytes for AES-256
var md = forge.md.sha512.create();
md.update(fileKey);
var WebCrypto = /** @class */ (function () {
    function WebCrypto() {
        this.clientsideKeySha3Hash = md.digest().toHex();
        this.iv = crypto.getRandomValues(new Uint8Array(12));
    }
    WebCrypto.prototype.encodeFile = function (_a) {
        var file = _a.file, oneTimeToken = _a.oneTimeToken, endpoint = _a.endpoint, callback = _a.callback, handlers = _a.handlers, key = _a.key;
        return __awaiter(this, void 0, void 0, function () {
            var startTime, arrayBuffer, chunks, result, totalProgress, _loop_1, this_1, _i, chunks_1, chunk, state_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        startTime = Date.now();
                        return [4 /*yield*/, file.arrayBuffer()];
                    case 1:
                        arrayBuffer = _b.sent();
                        chunks = chunkFile({ arrayBuffer: arrayBuffer });
                        totalProgress = { number: 0 };
                        _loop_1 = function (chunk) {
                            var currentIndex, encryptedChunk;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        currentIndex = chunks.findIndex(function (el) { return el === chunk; });
                                        return [4 /*yield*/, encryptChunk({ chunk: chunk, iv: this_1.iv, key: key })];
                                    case 1:
                                        encryptedChunk = _c.sent();
                                        return [4 /*yield*/, sendChunk({
                                                chunk: encryptedChunk,
                                                index: currentIndex,
                                                chunksLength: chunks.length - 1,
                                                file: file,
                                                startTime: startTime,
                                                oneTimeToken: oneTimeToken,
                                                endpoint: endpoint,
                                                iv: this_1.iv,
                                                clientsideKeySha3Hash: this_1.clientsideKeySha3Hash,
                                                totalProgress: totalProgress,
                                                callback: callback,
                                                handlers: handlers,
                                            })];
                                    case 2:
                                        result = _c.sent();
                                        if (result === null || result === void 0 ? void 0 : result.failed) {
                                            totalProgress.number = 0;
                                            return [2 /*return*/, { value: void 0 }];
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, chunks_1 = chunks;
                        _b.label = 2;
                    case 2:
                        if (!(_i < chunks_1.length)) return [3 /*break*/, 5];
                        chunk = chunks_1[_i];
                        return [5 /*yield**/, _loop_1(chunk)];
                    case 3:
                        state_1 = _b.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        totalProgress.number = 0;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    WebCrypto.prototype.encodeExistingFile = function (_a) {
        var file = _a.file, getOneTimeToken = _a.getOneTimeToken, getDownloadOTT = _a.getDownloadOTT, callback = _a.callback, handlers = _a.handlers, key = _a.key;
        return __awaiter(this, void 0, void 0, function () {
            var controller, signal, _b, downloadToken, downloadEndpoint, fileBlob, arrayBuffer, chunks, fileSignal, _c, oneTimeToken, endpoint, startTime, base64iv, totalProgress, data, _loop_2, this_2, _i, chunks_2, chunk, e_1, responseFromIpfs, isCancelModalOpen;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        controller = new AbortController();
                        signal = controller.signal;
                        return [4 /*yield*/, getDownloadOTT([{ slug: file.slug }])];
                    case 1:
                        _b = (_d.sent()).data, downloadToken = _b.user_tokens.token, downloadEndpoint = _b.endpoint;
                        return [4 /*yield*/, downloadFile({
                                file: file,
                                oneTimeToken: downloadToken,
                                signal: signal,
                                endpoint: downloadEndpoint,
                                isEncrypted: false,
                            })];
                    case 2:
                        fileBlob = _d.sent();
                        return [4 /*yield*/, fileBlob.arrayBuffer()];
                    case 3:
                        arrayBuffer = _d.sent();
                        chunks = chunkFile({ arrayBuffer: arrayBuffer });
                        fileSignal = axios.CancelToken.source();
                        handlers.includes("onStart") &&
                            callback({
                                type: "onStart",
                                params: { file: file, size: arrayBuffer.byteLength },
                            });
                        return [4 /*yield*/, getOneTimeToken({ filename: file.name, filesize: file.size })];
                    case 4:
                        _c = (_d.sent()).data, oneTimeToken = _c.user_token.token, endpoint = _c.endpoint;
                        startTime = Date.now();
                        base64iv = Base64.fromByteArray(this.iv);
                        totalProgress = { number: 0 };
                        _d.label = 5;
                    case 5:
                        _d.trys.push([5, 10, , 11]);
                        _loop_2 = function (chunk) {
                            var currentIndex, encryptedChunk;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        currentIndex = chunks.findIndex(function (el) { return el === chunk; });
                                        return [4 /*yield*/, encryptChunk({ chunk: chunk, iv: this_2.iv, key: key })];
                                    case 1:
                                        encryptedChunk = _e.sent();
                                        return [4 /*yield*/, swapChunk({
                                                file: file,
                                                endpoint: endpoint,
                                                base64iv: base64iv,
                                                clientsideKeySha3Hash: this_2.clientsideKeySha3Hash,
                                                index: currentIndex,
                                                chunksLength: chunks.length - 1,
                                                oneTimeToken: oneTimeToken,
                                                encryptedChunk: encryptedChunk,
                                                fileSize: arrayBuffer.byteLength,
                                                startTime: startTime,
                                                totalProgress: totalProgress,
                                                callback: callback,
                                                handlers: handlers,
                                            })];
                                    case 2:
                                        data = _e.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        _i = 0, chunks_2 = chunks;
                        _d.label = 6;
                    case 6:
                        if (!(_i < chunks_2.length)) return [3 /*break*/, 9];
                        chunk = chunks_2[_i];
                        return [5 /*yield**/, _loop_2(chunk)];
                    case 7:
                        _d.sent();
                        _d.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 6];
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        e_1 = _d.sent();
                        handlers.includes("onError") &&
                            callback({ type: "onError", params: { slug: file.slug } });
                        return [2 /*return*/];
                    case 11:
                        responseFromIpfs = data.data;
                        if (responseFromIpfs) {
                            isCancelModalOpen = document.body.querySelector(".download__modal__button__cancel");
                            handlers.includes("onSuccess") &&
                                callback({
                                    type: "onSuccess",
                                    params: { isCancelModalOpen: isCancelModalOpen, response: responseFromIpfs },
                                });
                            return [2 /*return*/, responseFromIpfs];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return WebCrypto;
}());
export { WebCrypto };
