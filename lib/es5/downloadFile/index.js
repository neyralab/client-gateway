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
exports.downloadFile = void 0;
var index_1 = require("../index");
var isBrowser_1 = require("../utils/isBrowser");
var joinChunks_1 = require("../utils/joinChunks");
var convertBase64ToArrayBuffer_1 = require("../utils/convertBase64ToArrayBuffer");
var config_1 = require("../config");
var downloadFileFromSP_1 = require("./downloadFileFromSP");
var downloadFile = function (_a) {
    var file = _a.file, oneTimeToken = _a.oneTimeToken, endpoint = _a.endpoint, isEncrypted = _a.isEncrypted, key = _a.key, callback = _a.callback, handlers = _a.handlers, signal = _a.signal, carReader = _a.carReader, uploadChunkSize = _a.uploadChunkSize, cidData = _a.cidData;
    return __awaiter(void 0, void 0, void 0, function () {
        var startTime, chunks, entry_clientside_key, slug, sha3, totalProgress, fileStream, size, fileBlob, cids, chunks_1, i, fileBlob, chunk, chunkCountResponse, count, Readable, index, chunk, downloadedChunk, bufferKey, file_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    startTime = Date.now();
                    chunks = [];
                    entry_clientside_key = file.entry_clientside_key, slug = file.slug;
                    sha3 = !isEncrypted
                        ? null
                        : (entry_clientside_key === null || entry_clientside_key === void 0 ? void 0 : entry_clientside_key.clientsideKeySha3Hash) ||
                            (entry_clientside_key === null || entry_clientside_key === void 0 ? void 0 : entry_clientside_key.sha3_hash);
                    totalProgress = { number: 0 };
                    fileStream = null;
                    if (!file.is_on_storage_provider) return [3 /*break*/, 9];
                    size = Number((file.size / config_1.ONE_MB).toFixed(1));
                    if (!(size < config_1.ALL_FILE_DOWNLOAD_MAX_SIZE)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, downloadFileFromSP_1.downloadFileFromSP)({
                            carReader: carReader,
                            url: "".concat(file.storage_provider.url, "/").concat(file.root_cid),
                            isEncrypted: isEncrypted,
                            uploadChunkSize: uploadChunkSize,
                            key: key,
                            iv: entry_clientside_key === null || entry_clientside_key === void 0 ? void 0 : entry_clientside_key.iv,
                            file: file,
                            level: 'root',
                        })];
                case 1:
                    fileBlob = _b.sent();
                    return [2 /*return*/, fileBlob];
                case 2:
                    if (!(size >= config_1.ALL_FILE_DOWNLOAD_MAX_SIZE)) return [3 /*break*/, 8];
                    cids = cidData.cids;
                    chunks_1 = [];
                    i = 0;
                    _b.label = 3;
                case 3:
                    if (!(i < cids.length)) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, downloadFileFromSP_1.downloadFileFromSP)({
                            carReader: carReader,
                            url: "".concat(file.storage_provider.url, "/").concat(cids[i]),
                            isEncrypted: isEncrypted,
                            uploadChunkSize: uploadChunkSize,
                            key: key,
                            iv: entry_clientside_key === null || entry_clientside_key === void 0 ? void 0 : entry_clientside_key.iv,
                            file: file,
                            level: cidData.level,
                        })];
                case 4:
                    fileBlob = _b.sent();
                    return [4 /*yield*/, fileBlob.arrayBuffer()];
                case 5:
                    chunk = _b.sent();
                    chunks_1.push(chunk);
                    _b.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 3];
                case 7: return [2 /*return*/, (0, joinChunks_1.joinChunks)(chunks_1)];
                case 8: return [3 /*break*/, 18];
                case 9: return [4 /*yield*/, (0, index_1.countChunks)({
                        endpoint: endpoint,
                        oneTimeToken: oneTimeToken,
                        slug: slug,
                        signal: signal,
                    })];
                case 10:
                    chunkCountResponse = _b.sent();
                    if (chunkCountResponse.status !== 200) {
                        throw new Error("HTTP error! status:".concat(chunkCountResponse.status));
                    }
                    count = chunkCountResponse.data.count;
                    if (!(0, isBrowser_1.isBrowser)()) {
                        Readable = require('stream').Readable;
                        fileStream = new Readable({
                            read: function () { },
                        });
                    }
                    index = 0;
                    _b.label = 11;
                case 11:
                    if (!(index < count)) return [3 /*break*/, 17];
                    chunk = void 0;
                    return [4 /*yield*/, (0, index_1.downloadChunk)({
                            index: index,
                            sha3_hash: sha3,
                            oneTimeToken: oneTimeToken,
                            signal: signal,
                            endpoint: endpoint,
                            file: file,
                            startTime: startTime,
                            totalProgress: totalProgress,
                            callback: callback,
                            handlers: handlers,
                        })];
                case 12:
                    downloadedChunk = _b.sent();
                    if (!!isEncrypted) return [3 /*break*/, 13];
                    chunk = downloadedChunk;
                    return [3 /*break*/, 15];
                case 13:
                    bufferKey = (0, convertBase64ToArrayBuffer_1.convertBase64ToArrayBuffer)(key);
                    return [4 /*yield*/, (0, index_1.decryptChunk)({
                            chunk: downloadedChunk,
                            iv: entry_clientside_key === null || entry_clientside_key === void 0 ? void 0 : entry_clientside_key.iv,
                            key: bufferKey,
                        })];
                case 14:
                    chunk = _b.sent();
                    if (chunk === null || chunk === void 0 ? void 0 : chunk.failed) {
                        return [2 /*return*/, { failed: true }];
                    }
                    if (index === 0 && chunk) {
                        (handlers === null || handlers === void 0 ? void 0 : handlers.includes('onSuccess')) &&
                            callback({
                                type: 'onSuccess',
                                params: {},
                            });
                    }
                    _b.label = 15;
                case 15:
                    if (fileStream) {
                        fileStream.push(new Uint8Array(chunk));
                    }
                    else {
                        chunks.push(chunk);
                    }
                    _b.label = 16;
                case 16:
                    index++;
                    return [3 /*break*/, 11];
                case 17:
                    if (fileStream) {
                        fileStream.push(null);
                        return [2 /*return*/, fileStream];
                    }
                    else {
                        file_1 = (0, joinChunks_1.joinChunks)(chunks);
                        return [2 /*return*/, file_1];
                    }
                    _b.label = 18;
                case 18: return [2 /*return*/];
            }
        });
    });
};
exports.downloadFile = downloadFile;
