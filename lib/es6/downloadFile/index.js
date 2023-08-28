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
import { downloadChunk, countChunks } from "../index";
import { hasWindow } from "../utils/hasWindow";
import { joinChunks } from "../utils/joinChunks";
export var downloadFile = function (currentFile, oneTimeToken, signal, endpoint) { return __awaiter(void 0, void 0, void 0, function () {
    var slug, chunkCountResponse, res, count, chunks, chunksStream, Readable, index, simpleChunk, file;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                slug = currentFile.slug;
                return [4 /*yield*/, countChunks(endpoint, oneTimeToken, slug, signal)];
            case 1:
                chunkCountResponse = _a.sent();
                if (!chunkCountResponse.ok) {
                    throw new Error("HTTP error! status:".concat(chunkCountResponse.status));
                }
                return [4 /*yield*/, chunkCountResponse.json()];
            case 2:
                res = _a.sent();
                count = res.count;
                chunks = [];
                chunksStream = null;
                if (!hasWindow()) {
                    Readable = require("stream").Readable;
                    chunksStream = new Readable({
                        read: function () { },
                    });
                }
                index = 0;
                _a.label = 3;
            case 3:
                if (!(index < count)) return [3 /*break*/, 6];
                return [4 /*yield*/, downloadChunk(index, null, slug, oneTimeToken, signal, endpoint)];
            case 4:
                simpleChunk = _a.sent();
                if (chunksStream) {
                    chunksStream.push(new Uint8Array(simpleChunk));
                }
                else {
                    chunks.push(simpleChunk);
                }
                _a.label = 5;
            case 5:
                index++;
                return [3 /*break*/, 3];
            case 6:
                if (chunksStream) {
                    chunksStream.push(null);
                    return [2 /*return*/, chunksStream];
                }
                else {
                    file = joinChunks(chunks);
                    return [2 /*return*/, file];
                }
                return [2 /*return*/];
        }
    });
}); };
