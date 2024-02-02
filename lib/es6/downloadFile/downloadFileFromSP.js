var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { recursive as exporter } from 'ipfs-unixfs-exporter';
import { decryptChunk } from '../decryptChunk';
import { convertBase64ToArrayBuffer } from '../utils/convertBase64ToArrayBuffer';
import { joinChunks } from '../utils/joinChunks';
import { chunkFile } from '../utils/chunkFile';
export function downloadFileFromSP({ carReader, url, isEncrypted, uploadChunkSize, key, iv, file, level, }) {
    return __awaiter(this, void 0, void 0, function* () {
        return fetch(url)
            .then((data) => __awaiter(this, void 0, void 0, function* () { return yield data.arrayBuffer(); }))
            .then((blob) => {
            const uint8 = new Uint8Array(blob);
            const reader = carReader.fromBytes(uint8);
            return reader;
        })
            .then((reader) => __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            const roots = yield reader.getRoots();
            const entries = exporter(roots[0], {
                get(cid) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const block = yield reader.get(cid);
                        return block.bytes;
                    });
                },
            });
            let typesEntries = { count: {}, length: {} };
            let fileBlob;
            try {
                for (var _d = true, entries_1 = __asyncValues(entries), entries_1_1; entries_1_1 = yield entries_1.next(), _a = entries_1_1.done, !_a; _d = true) {
                    _c = entries_1_1.value;
                    _d = false;
                    const entry = _c;
                    if (entry.type === 'file' || entry.type === 'raw') {
                        const cont = entry.content();
                        fileBlob = yield saveFileFromGenerator({
                            generator: cont,
                            type: file.mime,
                            isEncrypted,
                            uploadChunkSize,
                            key,
                            iv,
                            level,
                        });
                        typesEntries['count'][entry.type] =
                            (typesEntries['count'][entry.type] || 0) + 1;
                        typesEntries['length'][entry.type] =
                            // @ts-ignore
                            (typesEntries['length'][entry.type] || 0) + entry.length;
                    }
                    else if (entry.type === 'directory') {
                        typesEntries['count'][entry.type] =
                            (typesEntries['count'][entry.type] || 0) + 1;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = entries_1.return)) yield _b.call(entries_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return fileBlob;
        }))
            .catch(console.log);
    });
}
function saveFileFromGenerator({ generator, type, isEncrypted, uploadChunkSize, key, iv, level, }) {
    var _a, generator_1, generator_1_1;
    var _b, e_2, _c, _d, _e, e_3, _f, _g;
    return __awaiter(this, void 0, void 0, function* () {
        let prev = [];
        try {
            for (_a = true, generator_1 = __asyncValues(generator); generator_1_1 = yield generator_1.next(), _b = generator_1_1.done, !_b; _a = true) {
                _d = generator_1_1.value;
                _a = false;
                const chunk = _d;
                prev = [...prev, chunk];
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = generator_1.return)) yield _c.call(generator_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        const blob = new Blob(prev, { type });
        if (!isEncrypted) {
            return blob;
        }
        if (isEncrypted && (level === 'root' || level === 'interim')) {
            const bufferKey = convertBase64ToArrayBuffer(key);
            const chunks = [];
            try {
                for (var _h = true, _j = __asyncValues(chunkFile({
                    file: {
                        size: (yield blob.arrayBuffer()).byteLength,
                        arrayBuffer: () => __awaiter(this, void 0, void 0, function* () { return blob.arrayBuffer(); }),
                    },
                    uploadChunkSize: uploadChunkSize + 16, // test if we need +16 bytes
                })), _k; _k = yield _j.next(), _e = _k.done, !_e; _h = true) {
                    _g = _k.value;
                    _h = false;
                    const chunk = _g;
                    const chunkArrayBuffer = typeof chunk === 'string' ? Buffer.from(chunk).buffer : chunk;
                    const decryptedChunk = yield decryptChunk({
                        chunk: chunkArrayBuffer,
                        iv,
                        key: bufferKey,
                    });
                    chunks.push(decryptedChunk);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (!_h && !_e && (_f = _j.return)) yield _f.call(_j);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return joinChunks(chunks);
        }
        if (isEncrypted && level === 'upload') {
            const bufferKey = convertBase64ToArrayBuffer(key);
            const decryptedChunk = yield decryptChunk({
                chunk: yield blob.arrayBuffer(),
                iv,
                key: bufferKey,
            });
            return joinChunks([decryptedChunk]);
        }
    });
}
