"use strict";
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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunkFile = void 0;
var config_1 = require("../config");
var File_1 = require("../types/File");
var chunkBuffer_1 = require("./chunkBuffer");
function chunkFile(_a) {
    var file = _a.file;
    return __asyncGenerator(this, arguments, function chunkFile_1() {
        var stream, lastChunkSize, buffer, offset, _b, stream_1, stream_1_1, chunk, position, spaceLeft, chunkToCopy, e_1_1, arrayBuffer;
        var _c, e_1, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!(file instanceof File_1.LocalFileStream)) return [3 /*break*/, 20];
                    stream = file.stream();
                    lastChunkSize = file.size > config_1.CHUNK_SIZE
                        ? file.size - Math.floor(file.size / config_1.CHUNK_SIZE) * config_1.CHUNK_SIZE
                        : file.size;
                    buffer = Buffer.alloc(config_1.CHUNK_SIZE);
                    offset = 0;
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 10, 11, 16]);
                    _b = true, stream_1 = __asyncValues(stream);
                    _f.label = 2;
                case 2: return [4 /*yield*/, __await(stream_1.next())];
                case 3:
                    if (!(stream_1_1 = _f.sent(), _c = stream_1_1.done, !_c)) return [3 /*break*/, 9];
                    _e = stream_1_1.value;
                    _b = false;
                    chunk = _e;
                    position = 0;
                    if (lastChunkSize === chunk.length && lastChunkSize) {
                        buffer = Buffer.alloc(lastChunkSize);
                    }
                    _f.label = 4;
                case 4:
                    if (!(position < chunk.length)) return [3 /*break*/, 8];
                    spaceLeft = config_1.CHUNK_SIZE - offset;
                    chunkToCopy = Math.min(spaceLeft, chunk.length - position);
                    chunk.copy(buffer, offset, position, position + chunkToCopy);
                    position += chunkToCopy;
                    offset += chunkToCopy;
                    if (!(offset === config_1.CHUNK_SIZE)) return [3 /*break*/, 7];
                    return [4 /*yield*/, __await(buffer)];
                case 5: return [4 /*yield*/, _f.sent()];
                case 6:
                    _f.sent();
                    buffer = Buffer.alloc(config_1.CHUNK_SIZE);
                    offset = 0;
                    _f.label = 7;
                case 7: return [3 /*break*/, 4];
                case 8:
                    _b = true;
                    return [3 /*break*/, 2];
                case 9: return [3 /*break*/, 16];
                case 10:
                    e_1_1 = _f.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 16];
                case 11:
                    _f.trys.push([11, , 14, 15]);
                    if (!(!_b && !_c && (_d = stream_1.return))) return [3 /*break*/, 13];
                    return [4 /*yield*/, __await(_d.call(stream_1))];
                case 12:
                    _f.sent();
                    _f.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 15: return [7 /*endfinally*/];
                case 16:
                    if (!(offset > 0)) return [3 /*break*/, 19];
                    return [4 /*yield*/, __await(buffer.slice(0, offset))];
                case 17: return [4 /*yield*/, _f.sent()];
                case 18:
                    _f.sent();
                    _f.label = 19;
                case 19: return [3 /*break*/, 24];
                case 20: return [4 /*yield*/, __await(file.arrayBuffer())];
                case 21:
                    arrayBuffer = _f.sent();
                    return [5 /*yield**/, __values(__asyncDelegator(__asyncValues((0, chunkBuffer_1.chunkBuffer)({ arrayBuffer: arrayBuffer }))))];
                case 22: return [4 /*yield*/, __await.apply(void 0, [_f.sent()])];
                case 23:
                    _f.sent();
                    _f.label = 24;
                case 24: return [2 /*return*/];
            }
        });
    });
}
exports.chunkFile = chunkFile;
