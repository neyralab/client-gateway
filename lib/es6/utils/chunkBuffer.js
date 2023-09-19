import { CHUNK_SIZE } from "../config";
export var chunkBuffer = function (_a) {
    var arrayBuffer = _a.arrayBuffer;
    var chunks = [];
    var start = 0;
    while (start < arrayBuffer.byteLength) {
        var end = Math.min(arrayBuffer.byteLength, start + CHUNK_SIZE);
        var chunk = arrayBuffer.slice(start, end);
        chunks.push(chunk);
        start = end;
    }
    return chunks;
};
