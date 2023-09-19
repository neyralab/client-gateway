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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
var config_1 = require("../config");
var sendChunk_1 = require("../sendChunk");
var chunkBuffer_1 = require("../utils/chunkBuffer");
var chunkStream_1 = require("../utils/chunkStream");
var hasWindow_1 = require("../utils/hasWindow");
var uploadFile = function (_a) {
    var file = _a.file, oneTimeToken = _a.oneTimeToken, endpoint = _a.endpoint, callback = _a.callback, handlers = _a.handlers;
    return __awaiter(void 0, void 0, void 0, function () {
        var startTime, totalProgress, result, stream, chunksLength, lastChunkSize, currentIndex, _b, _c, _d, chunk, e_1_1, arrayBuffer, chunks, _loop_1, _i, chunks_1, chunk, state_1;
        var _e, e_1, _f, _g;
        var _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    startTime = Date.now();
                    totalProgress = { number: 0 };
                    if (!((file === null || file === void 0 ? void 0 : file.isStream) && !(0, hasWindow_1.hasWindow)())) return [3 /*break*/, 14];
                    stream = file.stream();
                    chunksLength = Math.floor(file.size / config_1.CHUNK_SIZE);
                    lastChunkSize = file.size > config_1.CHUNK_SIZE
                        ? file.size - chunksLength * config_1.CHUNK_SIZE
                        : file.size;
                    currentIndex = 0;
                    _k.label = 1;
                case 1:
                    _k.trys.push([1, 7, 8, 13]);
                    _b = true, _c = __asyncValues((0, chunkStream_1.chunkStream)({ stream: stream, lastChunkSize: lastChunkSize }));
                    _k.label = 2;
                case 2: return [4 /*yield*/, _c.next()];
                case 3:
                    if (!(_d = _k.sent(), _e = _d.done, !_e)) return [3 /*break*/, 6];
                    _g = _d.value;
                    _b = false;
                    chunk = _g;
                    return [4 /*yield*/, (0, sendChunk_1.sendChunk)({
                            chunk: chunk,
                            index: currentIndex,
                            chunksLength: chunksLength,
                            file: file,
                            startTime: startTime,
                            oneTimeToken: oneTimeToken,
                            endpoint: endpoint,
                            totalProgress: totalProgress,
                            callback: callback,
                            handlers: handlers,
                        })];
                case 4:
                    result = _k.sent();
                    if (result === null || result === void 0 ? void 0 : result.failed) {
                        totalProgress.number = 0;
                        return [2 /*return*/];
                    }
                    if ((_j = (_h = result === null || result === void 0 ? void 0 : result.data) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.slug) {
                        totalProgress.number = 0;
                        return [2 /*return*/, result];
                    }
                    currentIndex++;
                    _k.label = 5;
                case 5:
                    _b = true;
                    return [3 /*break*/, 2];
                case 6: return [3 /*break*/, 13];
                case 7:
                    e_1_1 = _k.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 13];
                case 8:
                    _k.trys.push([8, , 11, 12]);
                    if (!(!_b && !_e && (_f = _c.return))) return [3 /*break*/, 10];
                    return [4 /*yield*/, _f.call(_c)];
                case 9:
                    _k.sent();
                    _k.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 12: return [7 /*endfinally*/];
                case 13: return [3 /*break*/, 20];
                case 14: return [4 /*yield*/, file.arrayBuffer()];
                case 15:
                    arrayBuffer = _k.sent();
                    chunks = (0, chunkBuffer_1.chunkBuffer)({ arrayBuffer: arrayBuffer });
                    _loop_1 = function (chunk) {
                        var currentIndex;
                        return __generator(this, function (_l) {
                            switch (_l.label) {
                                case 0:
                                    currentIndex = chunks.findIndex(function (el) { return el === chunk; });
                                    return [4 /*yield*/, (0, sendChunk_1.sendChunk)({
                                            chunk: chunk,
                                            index: currentIndex,
                                            chunksLength: chunks.length - 1,
                                            file: file,
                                            startTime: startTime,
                                            oneTimeToken: oneTimeToken,
                                            endpoint: endpoint,
                                            totalProgress: totalProgress,
                                            callback: callback,
                                            handlers: handlers,
                                        })];
                                case 1:
                                    result = _l.sent();
                                    if (result === null || result === void 0 ? void 0 : result.failed) {
                                        totalProgress.number = 0;
                                        return [2 /*return*/, { value: void 0 }];
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, chunks_1 = chunks;
                    _k.label = 16;
                case 16:
                    if (!(_i < chunks_1.length)) return [3 /*break*/, 19];
                    chunk = chunks_1[_i];
                    return [5 /*yield**/, _loop_1(chunk)];
                case 17:
                    state_1 = _k.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    _k.label = 18;
                case 18:
                    _i++;
                    return [3 /*break*/, 16];
                case 19:
                    totalProgress.number = 0;
                    return [2 /*return*/, result];
                case 20: return [2 /*return*/];
            }
        });
    });
};
exports.uploadFile = uploadFile;
