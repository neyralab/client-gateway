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
            var startTime, currentIndex, result, totalProgress, _g, _h, _j, chunk, encryptedChunk, e_1_1;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        startTime = Date.now();
                        currentIndex = 1;
                        totalProgress = { number: 0 };
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
        var _b, e_2, _c, _d;
        var _e, _f;
        var file = _a.file, getOneTimeToken = _a.getOneTimeToken, getDownloadOTT = _a.getDownloadOTT, callback = _a.callback, handlers = _a.handlers, key = _a.key;
        return __awaiter(this, void 0, void 0, function () {
            var controller, signal, _g, downloadToken, downloadEndpoint, fileBlob, arrayBuffer, _h, oneTimeToken, endpoint, startTime, base64iv, totalProgress, result, currentIndex, _j, _k, _l, chunk, encryptedChunk, responseFromIpfs, isCancelModalOpen, e_2_1, e_3;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        controller = new AbortController();
                        signal = controller.signal;
                        return [4 /*yield*/, getDownloadOTT([{ slug: file.slug }])];
                    case 1:
                        _g = (_m.sent()).data, downloadToken = _g.user_tokens.token, downloadEndpoint = _g.endpoint;
                        return [4 /*yield*/, downloadFile({
                                file: file,
                                oneTimeToken: downloadToken,
                                signal: signal,
                                endpoint: downloadEndpoint,
                                isEncrypted: false,
                            })];
                    case 2:
                        fileBlob = _m.sent();
                        return [4 /*yield*/, fileBlob.arrayBuffer()];
                    case 3:
                        arrayBuffer = _m.sent();
                        handlers.includes("onStart") &&
                            callback({
                                type: "onStart",
                                params: { file: file, size: arrayBuffer.byteLength },
                            });
                        return [4 /*yield*/, getOneTimeToken({ filename: file.name, filesize: file.size })];
                    case 4:
                        _h = (_m.sent()).data, oneTimeToken = _h.user_token.token, endpoint = _h.endpoint;
                        startTime = Date.now();
                        base64iv = Base64.fromByteArray(this.iv);
                        totalProgress = { number: 0 };
                        currentIndex = 1;
                        _m.label = 5;
                    case 5:
                        _m.trys.push([5, 20, , 21]);
                        _m.label = 6;
                    case 6:
                        _m.trys.push([6, 13, 14, 19]);
                        _j = true, _k = __asyncValues(chunkBuffer({ arrayBuffer: arrayBuffer }));
                        _m.label = 7;
                    case 7: return [4 /*yield*/, _k.next()];
                    case 8:
                        if (!(_l = _m.sent(), _b = _l.done, !_b)) return [3 /*break*/, 12];
                        _d = _l.value;
                        _j = false;
                        chunk = _d;
                        return [4 /*yield*/, encryptChunk({ chunk: chunk, iv: this.iv, key: key })];
                    case 9:
                        encryptedChunk = _m.sent();
                        return [4 /*yield*/, swapChunk({
                                file: file,
                                endpoint: endpoint,
                                base64iv: base64iv,
                                clientsideKeySha3Hash: this.clientsideKeySha3Hash,
                                index: currentIndex,
                                oneTimeToken: oneTimeToken,
                                encryptedChunk: encryptedChunk,
                                fileSize: arrayBuffer.byteLength,
                                startTime: startTime,
                                totalProgress: totalProgress,
                                callback: callback,
                                handlers: handlers,
                            })];
                    case 10:
                        result = _m.sent();
                        if ((_f = (_e = result === null || result === void 0 ? void 0 : result.data) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.slug) {
                            totalProgress.number = 0;
                            responseFromIpfs = result.data;
                            if (responseFromIpfs) {
                                isCancelModalOpen = document.body.querySelector(".download__modal__button__cancel");
                                handlers.includes("onSuccess") &&
                                    callback({
                                        type: "onSuccess",
                                        params: { isCancelModalOpen: isCancelModalOpen, response: responseFromIpfs },
                                    });
                                return [2 /*return*/, responseFromIpfs];
                            }
                        }
                        currentIndex++;
                        _m.label = 11;
                    case 11:
                        _j = true;
                        return [3 /*break*/, 7];
                    case 12: return [3 /*break*/, 19];
                    case 13:
                        e_2_1 = _m.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 19];
                    case 14:
                        _m.trys.push([14, , 17, 18]);
                        if (!(!_j && !_b && (_c = _k.return))) return [3 /*break*/, 16];
                        return [4 /*yield*/, _c.call(_k)];
                    case 15:
                        _m.sent();
                        _m.label = 16;
                    case 16: return [3 /*break*/, 18];
                    case 17:
                        if (e_2) throw e_2.error;
                        return [7 /*endfinally*/];
                    case 18: return [7 /*endfinally*/];
                    case 19: return [3 /*break*/, 21];
                    case 20:
                        e_3 = _m.sent();
                        handlers.includes("onError") &&
                            callback({ type: "onError", params: { slug: file.slug } });
                        return [2 /*return*/];
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    return WebCrypto;
}());
export { WebCrypto };
