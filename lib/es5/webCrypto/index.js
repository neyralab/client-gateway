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
exports.WebCrypto = void 0;
var axios_1 = require("axios");
var forge = require("node-forge");
var Base64 = require("base64-js");
var index_1 = require("../index");
var getThumbnail_1 = require("../utils/getThumbnail");
var convertTextToBase64_1 = require("../utils/convertTextToBase64");
var convertBlobToBase64_1 = require("../utils/convertBlobToBase64");
var fetchBlobFromUrl_1 = require("../utils/fetchBlobFromUrl");
var getCrypto_1 = require("../utils/getCrypto");
var crypto = (0, getCrypto_1.getCrypto)();
var fileKey = forge.random.getBytesSync(32); // 32 bytes for AES-256
var md = forge.md.sha512.create();
md.update(fileKey);
var WebCrypto = /** @class */ (function () {
    function WebCrypto() {
        this.clientsideKeySha3Hash = md.digest().toHex();
        this.iv = crypto.getRandomValues(new Uint8Array(12));
    }
    WebCrypto.prototype.encodeFile = function (_a) {
        var _b, _c;
        var file = _a.file, oneTimeToken = _a.oneTimeToken, endpoint = _a.endpoint, getOneTimeToken = _a.getOneTimeToken, callback = _a.callback, handlers = _a.handlers, key = _a.key;
        return __awaiter(this, void 0, void 0, function () {
            var startTime, arrayBuffer, chunks, base64Image, result, totalProgress, _loop_1, this_1, _i, chunks_1, chunk, state_1, _d, thumbToken, thumbEndpoint, instance, e_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        startTime = Date.now();
                        return [4 /*yield*/, file.arrayBuffer()];
                    case 1:
                        arrayBuffer = _e.sent();
                        chunks = (0, index_1.chunkFile)({ arrayBuffer: arrayBuffer });
                        switch (true) {
                            case file.type.startsWith("image"):
                                (0, getThumbnail_1.getThumbnailImage)(file).then(function (result) {
                                    base64Image = result;
                                });
                                break;
                            case file.type.startsWith("video"):
                                (0, getThumbnail_1.getThumbnailVideo)(file).then(function (result) {
                                    base64Image = result;
                                });
                                break;
                        }
                        totalProgress = { number: 0 };
                        _loop_1 = function (chunk) {
                            var currentIndex, encryptedChunk;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        currentIndex = chunks.findIndex(function (el) { return el === chunk; });
                                        return [4 /*yield*/, (0, index_1.encryptChunk)({ chunk: chunk, iv: this_1.iv, key: key })];
                                    case 1:
                                        encryptedChunk = _f.sent();
                                        return [4 /*yield*/, (0, index_1.sendChunk)({
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
                                        result = _f.sent();
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
                        _e.label = 2;
                    case 2:
                        if (!(_i < chunks_1.length)) return [3 /*break*/, 5];
                        chunk = chunks_1[_i];
                        return [5 /*yield**/, _loop_1(chunk)];
                    case 3:
                        state_1 = _e.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _e.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        totalProgress.number = 0;
                        return [4 /*yield*/, getOneTimeToken({ filename: file.name, filesize: file.size })];
                    case 6:
                        _d = (_e.sent()).data, thumbToken = _d.user_token.token, thumbEndpoint = _d.endpoint;
                        instance = axios_1.default.create({
                            headers: {
                                "x-file-name": file.name,
                                "Content-Type": "application/octet-stream",
                                "one-time-token": thumbToken,
                            },
                        });
                        _e.label = 7;
                    case 7:
                        _e.trys.push([7, 10, , 11]);
                        if (!base64Image) return [3 /*break*/, 9];
                        return [4 /*yield*/, instance.post("".concat(thumbEndpoint, "/chunked/thumb/").concat((_c = (_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.slug), base64Image)];
                    case 8:
                        _e.sent();
                        _e.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        e_1 = _e.sent();
                        return [2 /*return*/, { failed: true }];
                    case 11: return [2 /*return*/, result];
                }
            });
        });
    };
    WebCrypto.prototype.encodeExistingFile = function (_a) {
        var file = _a.file, getImagePreviewEffect = _a.getImagePreviewEffect, getOneTimeToken = _a.getOneTimeToken, getDownloadOTT = _a.getDownloadOTT, callback = _a.callback, handlers = _a.handlers, key = _a.key;
        return __awaiter(this, void 0, void 0, function () {
            var controller, signal, _b, downloadToken, downloadEndpoint, fileBlob, arrayBuffer, chunks, fileSignal, thumbnail, hasThumbnail, _c, oneTimeToken, endpoint, startTime, base64iv, totalProgress, data, _loop_2, this_2, _i, chunks_2, chunk, e_2, responseFromIpfs, isCancelModalOpen, _d, thumbToken_1, thumbEndpoint_1, fileName_1, e_3;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        controller = new AbortController();
                        signal = controller.signal;
                        return [4 /*yield*/, getDownloadOTT([{ slug: file.slug }])];
                    case 1:
                        _b = (_e.sent()).data, downloadToken = _b.user_tokens.token, downloadEndpoint = _b.endpoint;
                        return [4 /*yield*/, (0, index_1.downloadFile)({
                                file: file,
                                oneTimeToken: downloadToken,
                                signal: signal,
                                endpoint: downloadEndpoint,
                                isEncrypted: false,
                            })];
                    case 2:
                        fileBlob = _e.sent();
                        return [4 /*yield*/, fileBlob.arrayBuffer()];
                    case 3:
                        arrayBuffer = _e.sent();
                        chunks = (0, index_1.chunkFile)({ arrayBuffer: arrayBuffer });
                        fileSignal = axios_1.default.CancelToken.source();
                        hasThumbnail = file.mime.startsWith("image") || file.mime.startsWith("video");
                        handlers.includes("onStart") &&
                            callback({
                                type: "onStart",
                                params: { file: file, size: arrayBuffer.byteLength },
                            });
                        if (!hasThumbnail) return [3 /*break*/, 5];
                        return [4 /*yield*/, getImagePreviewEffect(file.slug, 300, 164, "crop", fileSignal.token, file.mime)];
                    case 4:
                        thumbnail = _e.sent();
                        _e.label = 5;
                    case 5: return [4 /*yield*/, getOneTimeToken({ filename: file.name, filesize: file.size })];
                    case 6:
                        _c = (_e.sent()).data, oneTimeToken = _c.user_token.token, endpoint = _c.endpoint;
                        startTime = Date.now();
                        base64iv = Base64.fromByteArray(this.iv);
                        totalProgress = { number: 0 };
                        _e.label = 7;
                    case 7:
                        _e.trys.push([7, 12, , 13]);
                        _loop_2 = function (chunk) {
                            var currentIndex, encryptedChunk;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        currentIndex = chunks.findIndex(function (el) { return el === chunk; });
                                        return [4 /*yield*/, (0, index_1.encryptChunk)({ chunk: chunk, iv: this_2.iv, key: key })];
                                    case 1:
                                        encryptedChunk = _f.sent();
                                        return [4 /*yield*/, (0, index_1.swapChunk)({
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
                                        data = _f.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        _i = 0, chunks_2 = chunks;
                        _e.label = 8;
                    case 8:
                        if (!(_i < chunks_2.length)) return [3 /*break*/, 11];
                        chunk = chunks_2[_i];
                        return [5 /*yield**/, _loop_2(chunk)];
                    case 9:
                        _e.sent();
                        _e.label = 10;
                    case 10:
                        _i++;
                        return [3 /*break*/, 8];
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        e_2 = _e.sent();
                        handlers.includes("onError") &&
                            callback({ type: "onError", params: { slug: file.slug } });
                        return [2 /*return*/];
                    case 13:
                        responseFromIpfs = data.data;
                        if (!responseFromIpfs) return [3 /*break*/, 18];
                        isCancelModalOpen = document.body.querySelector(".download__modal__button__cancel");
                        handlers.includes("onSuccess") &&
                            callback({
                                type: "onSuccess",
                                params: { isCancelModalOpen: isCancelModalOpen, response: responseFromIpfs },
                            });
                        if (!hasThumbnail) return [3 /*break*/, 17];
                        _e.label = 14;
                    case 14:
                        _e.trys.push([14, 16, , 17]);
                        return [4 /*yield*/, getOneTimeToken({
                                filename: file.name,
                                filesize: file.size,
                            })];
                    case 15:
                        _d = (_e.sent()).data, thumbToken_1 = _d.user_token.token, thumbEndpoint_1 = _d.endpoint;
                        fileName_1 = (0, convertTextToBase64_1.convertTextToBase64)(file.name);
                        (0, fetchBlobFromUrl_1.fetchBlobFromUrl)(thumbnail)
                            .then(function (blob) {
                            return (0, convertBlobToBase64_1.convertBlobToBase64)(blob);
                        })
                            .then(function (base64Data) {
                            var _a;
                            axios_1.default
                                .create({
                                headers: {
                                    "x-file-name": fileName_1,
                                    "Content-Type": "application/octet-stream",
                                    "one-time-token": thumbToken_1,
                                },
                            })
                                .post("".concat(thumbEndpoint_1, "/chunked/thumb/").concat((_a = responseFromIpfs === null || responseFromIpfs === void 0 ? void 0 : responseFromIpfs.data) === null || _a === void 0 ? void 0 : _a.slug), base64Data);
                        })
                            .catch(function (e) {
                            console.error("ERROR", e);
                        });
                        return [3 /*break*/, 17];
                    case 16:
                        e_3 = _e.sent();
                        console.error("ERROR", e_3);
                        return [3 /*break*/, 17];
                    case 17: return [2 /*return*/, responseFromIpfs];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    return WebCrypto;
}());
exports.WebCrypto = WebCrypto;
