import { __asyncDelegator, __asyncGenerator, __asyncValues, __await } from "tslib";
import { LocalFileReactNativeStream, LocalFileStream } from '../types/File/index.js';
import { chunkBase64 } from './chunkBase64.js';
import { chunkBuffer } from './chunkBuffer.js';
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
