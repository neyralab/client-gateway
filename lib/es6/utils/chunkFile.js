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
import { LocalFileReactNativeStream, LocalFileStream } from '../types/File';
import { chunkBase64 } from './chunkBase64';
import { chunkBuffer } from './chunkBuffer';
export function chunkFile({ file, uploadChunkSize, }) {
    return __asyncGenerator(this, arguments, function* chunkFile_1() {
        var _a, e_1, _b, _c;
        if (file instanceof LocalFileStream) {
            const stream = file.stream();
            const lastChunkSize = file.size > uploadChunkSize
                ? file.size - Math.floor(file.size / uploadChunkSize) * uploadChunkSize
                : file.size;
            let buffer = Buffer.alloc(uploadChunkSize);
            let offset = 0;
            try {
                for (var _d = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield __await(stream_1.next()), _a = stream_1_1.done, !_a; _d = true) {
                    _c = stream_1_1.value;
                    _d = false;
                    const chunk = _c;
                    let position = 0;
                    if (lastChunkSize === chunk.length && lastChunkSize) {
                        buffer = Buffer.alloc(lastChunkSize);
                    }
                    while (position < chunk.length) {
                        const spaceLeft = uploadChunkSize - offset;
                        const chunkToCopy = Math.min(spaceLeft, chunk.length - position);
                        chunk.copy(buffer, offset, position, position + chunkToCopy);
                        position += chunkToCopy;
                        offset += chunkToCopy;
                        if (offset === uploadChunkSize) {
                            yield yield __await(buffer);
                            buffer = Buffer.alloc(uploadChunkSize);
                            offset = 0;
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = stream_1.return)) yield __await(_b.call(stream_1));
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (offset > 0) {
                yield yield __await(buffer.slice(0, offset));
            }
        }
        else if (file instanceof LocalFileReactNativeStream) {
            yield __await(yield* __asyncDelegator(__asyncValues(chunkBase64(file.chunks))));
        }
        else {
            const arrayBuffer = yield __await(file.arrayBuffer());
            yield __await(yield* __asyncDelegator(__asyncValues(chunkBuffer({ arrayBuffer, uploadChunkSize }))));
        }
    });
}
