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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import * as forge from "node-forge";
import * as Base64 from "base64-js";
import { downloadFile, encryptChunk, sendChunk, swapChunk } from "../index";
import { getCrypto } from "../utils/getCrypto";
import { chunkBuffer } from "../utils/chunkBuffer";
import { chunkFile } from "../utils/chunkFile";
import { CHUNK_SIZE } from "../config";
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
        var _b, e_1, _c, _d;
        var _e, _f;
        var file = _a.file, oneTimeToken = _a.oneTimeToken, endpoint = _a.endpoint, callback = _a.callback, handlers = _a.handlers, key = _a.key;
        return __awaiter(this, void 0, void 0, function () {
            var startTime, currentIndex, result, totalProgress, chunksLength, _g, _h, _j, chunk, encryptedChunk, e_1_1;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        startTime = Date.now();
                        currentIndex = 0;
                        totalProgress = { number: 0 };
                        chunksLength = Math.floor(file.size / CHUNK_SIZE);
                        _k.label = 1;
                    case 1:
                        _k.trys.push([1, 8, 9, 14]);
                        _g = true, _h = __asyncValues(chunkFile({ file: file }));
                        _k.label = 2;
                    case 2: return [4 /*yield*/, _h.next()];
                    case 3:
                        if (!(_j = _k.sent(), _b = _j.done, !_b)) return [3 /*break*/, 7];
                        _d = _j.value;
                        _g = false;
                        chunk = _d;
                        return [4 /*yield*/, encryptChunk({
                                chunk: chunk,
                                iv: this.iv,
                                key: key,
                            })];
                    case 4:
                        encryptedChunk = _k.sent();
                        return [4 /*yield*/, sendChunk({
                                chunk: encryptedChunk,
                                index: currentIndex,
                                file: file,
                                chunksLength: chunksLength,
                                startTime: startTime,
                                oneTimeToken: oneTimeToken,
                                endpoint: endpoint,
                                iv: this.iv,
                                clientsideKeySha3Hash: this.clientsideKeySha3Hash,
                                totalProgress: totalProgress,
                                callback: callback,
                                handlers: handlers,
                            })];
                    case 5:
                        result = _k.sent();
                        if (result === null || result === void 0 ? void 0 : result.failed) {
                            totalProgress.number = 0;
                            return [2 /*return*/];
                        }
                        if ((_f = (_e = result === null || result === void 0 ? void 0 : result.data) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.slug) {
                            totalProgress.number = 0;
                            return [2 /*return*/, result];
                        }
                        currentIndex++;
                        _k.label = 6;
                    case 6:
                        _g = true;
                        return [3 /*break*/, 2];
                    case 7: return [3 /*break*/, 14];
                    case 8:
                        e_1_1 = _k.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 14];
                    case 9:
                        _k.trys.push([9, , 12, 13]);
                        if (!(!_g && !_b && (_c = _h.return))) return [3 /*break*/, 11];
                        return [4 /*yield*/, _c.call(_h)];
                    case 10:
                        _k.sent();
                        _k.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 13: return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    WebCrypto.prototype.encodeExistingFile = function (_a) {
        var file = _a.file, getOneTimeToken = _a.getOneTimeToken, getDownloadOTT = _a.getDownloadOTT, callback = _a.callback, handlers = _a.handlers, key = _a.key;
        return __awaiter(this, void 0, void 0, function () {
            var controller, signal, _b, downloadToken, downloadEndpoint, fileBlob, arrayBuffer, chunks, _c, oneTimeToken, endpoint, startTime, base64iv, totalProgress, data, _loop_1, this_1, _i, chunks_1, chunk, e_2, responseFromIpfs, isCancelModalOpen;
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
                        chunks = chunkBuffer({ arrayBuffer: arrayBuffer });
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
                        _loop_1 = function (chunk) {
                            var currentIndex, encryptedChunk;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        currentIndex = chunks.findIndex(function (el) { return el === chunk; });
                                        return [4 /*yield*/, encryptChunk({ chunk: chunk, iv: this_1.iv, key: key })];
                                    case 1:
                                        encryptedChunk = _e.sent();
                                        return [4 /*yield*/, swapChunk({
                                                file: file,
                                                endpoint: endpoint,
                                                base64iv: base64iv,
                                                clientsideKeySha3Hash: this_1.clientsideKeySha3Hash,
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
                        this_1 = this;
                        _i = 0, chunks_1 = chunks;
                        _d.label = 6;
                    case 6:
                        if (!(_i < chunks_1.length)) return [3 /*break*/, 9];
                        chunk = chunks_1[_i];
                        return [5 /*yield**/, _loop_1(chunk)];
                    case 7:
                        _d.sent();
                        _d.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 6];
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        e_2 = _d.sent();
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
