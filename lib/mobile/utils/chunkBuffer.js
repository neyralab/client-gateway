import { __asyncGenerator, __await } from "tslib";
export function chunkBuffer({ arrayBuffer, uploadChunkSize, }) {
    return __asyncGenerator(this, arguments, function* chunkBuffer_1() {
        let start = 0;
        while (start < arrayBuffer.byteLength) {
            const end = Math.min(arrayBuffer.byteLength, start + uploadChunkSize);
            const chunk = arrayBuffer.slice(start, end);
            yield yield __await(chunk);
            start = end;
        }
    });
}
