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
var joinChunks_1 = require("../utils/joinChunks");
var getThumbnail_1 = require("../utils/getThumbnail");
var convertArrayBufferToBase64_1 = require("../utils/convertArrayBufferToBase64");
var convertTextToBase64_1 = require("../utils/convertTextToBase64");
var convertBlobToBase64_1 = require("../utils/convertBlobToBase64");
var fetchBlobFromUrl_1 = require("../utils/fetchBlobFromUrl");
var getCrypto_1 = require("../utils/getCrypto");
var hasWindow_1 = require("../utils/hasWindow");
var crypto = (0, getCrypto_1.getCrypto)();
crypto.subtle
    .generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"])
    .then(function (k) {
    if ((0, hasWindow_1.hasWindow)()) {
        window.key = k;
    }
    else {
        global.key = k;
    }
});
var fileKey = forge.random.getBytesSync(32); // 32 bytes for AES-256
var md = forge.md.sha512.create();
md.update(fileKey);
var WebCrypto = /** @class */ (function () {
    function WebCrypto() {
        this.clientsideKeySha3Hash = md.digest().toHex();
        this.iv = crypto.getRandomValues(new Uint8Array(12));
    }
    WebCrypto.prototype.encodeFile = function (file, oneTimeToken, dispatch, startTime, endpoint, getKeysByWorkspace, updateProgressCallback, getProgressFromLSCallback, setProgressToLSCallback, saveEncryptedFileKeys, getOneTimeToken) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var arrayBuffer, chunks, base64Image, result, keys, key, _loop_1, this_1, _i, chunks_1, chunk, state_1, buffer, keyBase64, encryptedKeys, _e, thumbToken, thumbEndpoint, instance, e_1;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, file.arrayBuffer()];
                    case 1:
                        arrayBuffer = _f.sent();
                        chunks = (0, index_1.chunkFile)(arrayBuffer);
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
                        return [4 /*yield*/, getKeysByWorkspace()];
                    case 2:
                        keys = (_f.sent()).data.keys;
                        key = (0, hasWindow_1.hasWindow)() ? window.key : global.key;
                        _loop_1 = function (chunk) {
                            var currentIndex, encryptedChunk;
                            return __generator(this, function (_g) {
                                switch (_g.label) {
                                    case 0:
                                        currentIndex = chunks.findIndex(function (el) { return el === chunk; });
                                        return [4 /*yield*/, (0, index_1.encryptChunk)(chunk, this_1.iv, key)];
                                    case 1:
                                        encryptedChunk = _g.sent();
                                        return [4 /*yield*/, (0, index_1.sendChunk)(encryptedChunk, currentIndex, chunks.length - 1, file, startTime, oneTimeToken, endpoint, this_1.iv, this_1.clientsideKeySha3Hash, dispatch, updateProgressCallback, getProgressFromLSCallback, setProgressToLSCallback)];
                                    case 2:
                                        result = _g.sent();
                                        if (result === null || result === void 0 ? void 0 : result.failed) {
                                            localStorage.removeItem("progress");
                                            return [2 /*return*/, { value: void 0 }];
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, chunks_1 = chunks;
                        _f.label = 3;
                    case 3:
                        if (!(_i < chunks_1.length)) return [3 /*break*/, 6];
                        chunk = chunks_1[_i];
                        return [5 /*yield**/, _loop_1(chunk)];
                    case 4:
                        state_1 = _f.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _f.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [4 /*yield*/, crypto.subtle.exportKey("raw", (0, hasWindow_1.hasWindow)() ? window.key : global.key)];
                    case 7:
                        buffer = _f.sent();
                        keyBase64 = (0, convertArrayBufferToBase64_1.convertArrayBufferToBase64)(buffer);
                        encryptedKeys = keys.map(function (el) {
                            return { publicKey: el, encryptedFileKey: keyBase64 };
                        });
                        saveEncryptedFileKeys({
                            slug: (_b = (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.slug,
                            encryptedKeys: encryptedKeys,
                        });
                        localStorage.removeItem("progress");
                        return [4 /*yield*/, getOneTimeToken({ filename: file.name, filesize: file.size })];
                    case 8:
                        _e = (_f.sent()).data, thumbToken = _e.user_token.token, thumbEndpoint = _e.endpoint;
                        instance = axios_1.default.create({
                            headers: {
                                "x-file-name": file.name,
                                "Content-Type": "application/octet-stream",
                                "one-time-token": thumbToken,
                            },
                        });
                        _f.label = 9;
                    case 9:
                        _f.trys.push([9, 12, , 13]);
                        if (!base64Image) return [3 /*break*/, 11];
                        return [4 /*yield*/, instance.post("".concat(thumbEndpoint, "/chunked/thumb/").concat((_d = (_c = result === null || result === void 0 ? void 0 : result.data) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.slug), base64Image)];
                    case 10:
                        _f.sent();
                        _f.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        e_1 = _f.sent();
                        return [2 /*return*/, { failed: true }];
                    case 13: return [2 /*return*/, result];
                }
            });
        });
    };
    WebCrypto.prototype.downloadFile = function (currentFile, oneTimeToken, activationKey, signal, endpoint) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, sha3_hash, iv, clientsideKeySha3Hash, slug, chunkCountResponse, res, count, chunks, index, encryptedChunk, decryptedChunk, file;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = currentFile.entry_clientside_key, sha3_hash = _a.sha3_hash, iv = _a.iv, clientsideKeySha3Hash = _a.clientsideKeySha3Hash, slug = currentFile.slug;
                        return [4 /*yield*/, (0, index_1.countChunks)(endpoint, oneTimeToken, slug, signal)];
                    case 1:
                        chunkCountResponse = _b.sent();
                        if (!chunkCountResponse.ok) {
                            throw new Error("HTTP error! status:".concat(chunkCountResponse.status));
                        }
                        return [4 /*yield*/, chunkCountResponse.json()];
                    case 2:
                        res = _b.sent();
                        count = res.count;
                        chunks = [];
                        index = 0;
                        _b.label = 3;
                    case 3:
                        if (!(index < count)) return [3 /*break*/, 7];
                        return [4 /*yield*/, (0, index_1.downloadChunk)(index, clientsideKeySha3Hash || sha3_hash, slug, oneTimeToken, signal, endpoint, true)];
                    case 4:
                        encryptedChunk = _b.sent();
                        return [4 /*yield*/, (0, index_1.decryptChunk)(encryptedChunk, iv, activationKey)];
                    case 5:
                        decryptedChunk = _b.sent();
                        chunks.push(decryptedChunk);
                        _b.label = 6;
                    case 6:
                        index++;
                        return [3 /*break*/, 3];
                    case 7:
                        file = (0, joinChunks_1.joinChunks)(chunks);
                        return [2 /*return*/, file];
                }
            });
        });
    };
    WebCrypto.prototype.encodeExistingFile = function (file, dispatch, getFileContent, firstEncodeExistingCallback, secondEncodeExistingCallback, thirdEncodeExistingCallback, getImagePreviewEffect, getKeysByWorkspace, updateProgressCallback, getProgressFromLSCallback, setProgressToLSCallback, saveEncryptedFileKeys, getOneTimeToken) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var fileBlob, arrayBuffer, chunks, fileSignal, thumbnail, hasThumbnail, _b, oneTimeToken, endpoint, keys, startTime, base64iv, key, data, _loop_2, this_2, _i, chunks_2, chunk, e_2, responseFromIpfs, buffer, text_1, encryptedKeys, isCancelModalOpen, _c, thumbToken_1, thumbEndpoint_1, fileName_1, e_3;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, getFileContent(file.slug, null, true)];
                    case 1:
                        fileBlob = _d.sent();
                        return [4 /*yield*/, fileBlob.arrayBuffer()];
                    case 2:
                        arrayBuffer = _d.sent();
                        chunks = (0, index_1.chunkFile)(arrayBuffer);
                        fileSignal = axios_1.default.CancelToken.source();
                        hasThumbnail = file.mime.startsWith("image") || file.mime.startsWith("video");
                        firstEncodeExistingCallback(file, arrayBuffer, dispatch);
                        if (!hasThumbnail) return [3 /*break*/, 4];
                        return [4 /*yield*/, getImagePreviewEffect(file.slug, 300, 164, "crop", fileSignal.token, file.mime)];
                    case 3:
                        thumbnail = _d.sent();
                        _d.label = 4;
                    case 4: return [4 /*yield*/, getOneTimeToken({ filename: file.name, filesize: file.size })];
                    case 5:
                        _b = (_d.sent()).data, oneTimeToken = _b.user_token.token, endpoint = _b.endpoint;
                        return [4 /*yield*/, getKeysByWorkspace()];
                    case 6:
                        keys = (_d.sent()).data.keys;
                        startTime = Date.now();
                        base64iv = Base64.fromByteArray(this.iv);
                        key = (0, hasWindow_1.hasWindow)() ? window.key : global.key;
                        _d.label = 7;
                    case 7:
                        _d.trys.push([7, 12, , 13]);
                        _loop_2 = function (chunk) {
                            var currentIndex, encryptedChunk;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        currentIndex = chunks.findIndex(function (el) { return el === chunk; });
                                        return [4 /*yield*/, (0, index_1.encryptChunk)(chunk, this_2.iv, key)];
                                    case 1:
                                        encryptedChunk = _e.sent();
                                        return [4 /*yield*/, (0, index_1.swapChunk)(file, endpoint, base64iv, this_2.clientsideKeySha3Hash, currentIndex, chunks.length - 1, oneTimeToken, encryptedChunk, arrayBuffer, startTime, dispatch, updateProgressCallback, getProgressFromLSCallback, setProgressToLSCallback)];
                                    case 2:
                                        data = _e.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        _i = 0, chunks_2 = chunks;
                        _d.label = 8;
                    case 8:
                        if (!(_i < chunks_2.length)) return [3 /*break*/, 11];
                        chunk = chunks_2[_i];
                        return [5 /*yield**/, _loop_2(chunk)];
                    case 9:
                        _d.sent();
                        _d.label = 10;
                    case 10:
                        _i++;
                        return [3 /*break*/, 8];
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        e_2 = _d.sent();
                        secondEncodeExistingCallback(file.slug, dispatch);
                        return [2 /*return*/];
                    case 13:
                        responseFromIpfs = data.data;
                        if (!responseFromIpfs) return [3 /*break*/, 18];
                        return [4 /*yield*/, crypto.subtle.exportKey("raw", (0, hasWindow_1.hasWindow)() ? window.key : global.key)];
                    case 14:
                        buffer = _d.sent();
                        text_1 = (0, convertArrayBufferToBase64_1.convertArrayBufferToBase64)(buffer);
                        encryptedKeys = keys.map(function (el) {
                            return { publicKey: el, encryptedFileKey: text_1 };
                        });
                        saveEncryptedFileKeys({
                            slug: (_a = responseFromIpfs === null || responseFromIpfs === void 0 ? void 0 : responseFromIpfs.data) === null || _a === void 0 ? void 0 : _a.slug,
                            encryptedKeys: encryptedKeys,
                        });
                        localStorage.removeItem("progress");
                        isCancelModalOpen = document.body.querySelector(".download__modal__button__cancel");
                        thirdEncodeExistingCallback(isCancelModalOpen, responseFromIpfs, dispatch);
                        if (!hasThumbnail) return [3 /*break*/, 18];
                        _d.label = 15;
                    case 15:
                        _d.trys.push([15, 17, , 18]);
                        return [4 /*yield*/, getOneTimeToken({
                                filename: file.name,
                                filesize: file.size,
                            })];
                    case 16:
                        _c = (_d.sent()).data, thumbToken_1 = _c.user_token.token, thumbEndpoint_1 = _c.endpoint;
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
                        return [3 /*break*/, 18];
                    case 17:
                        e_3 = _d.sent();
                        console.error("ERROR", e_3);
                        return [3 /*break*/, 18];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    return WebCrypto;
}());
exports.WebCrypto = WebCrypto;
