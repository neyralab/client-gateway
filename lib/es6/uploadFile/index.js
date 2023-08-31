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
import { chunkFile, chunkFileStream } from "../chunkFile";
import { sendChunk } from "../sendChunk";
export var uploadFile = function (_a) {
    var file = _a.file, oneTimeToken = _a.oneTimeToken, endpoint = _a.endpoint, callback = _a.callback, handlers = _a.handlers, needStream = _a.needStream;
    return __awaiter(void 0, void 0, void 0, function () {
        var startTime, totalProgress, chunks, result, stream, arrayBuffer, _loop_1, _i, chunks_1, chunk, state_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    startTime = Date.now();
                    totalProgress = { number: 0 };
                    if (!needStream) return [3 /*break*/, 3];
                    return [4 /*yield*/, file.stream()];
                case 1:
                    stream = _b.sent();
                    return [4 /*yield*/, chunkFileStream({ stream: stream })];
                case 2:
                    chunks = _b.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, file.arrayBuffer()];
                case 4:
                    arrayBuffer = _b.sent();
                    chunks = chunkFile({ arrayBuffer: arrayBuffer });
                    _b.label = 5;
                case 5:
                    _loop_1 = function (chunk) {
                        var currentIndex;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    currentIndex = chunks.findIndex(function (el) { return el === chunk; });
                                    return [4 /*yield*/, sendChunk({
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
                                    result = _c.sent();
                                    if (result === null || result === void 0 ? void 0 : result.failed) {
                                        totalProgress.number = 0;
                                        return [2 /*return*/, { value: void 0 }];
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, chunks_1 = chunks;
                    _b.label = 6;
                case 6:
                    if (!(_i < chunks_1.length)) return [3 /*break*/, 9];
                    chunk = chunks_1[_i];
                    return [5 /*yield**/, _loop_1(chunk)];
                case 7:
                    state_1 = _b.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    _b.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9:
                    totalProgress.number = 0;
                    return [2 /*return*/, result];
            }
        });
    });
};
