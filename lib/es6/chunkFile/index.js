export var chunkFile = function (_a) {
    var arrayBuffer = _a.arrayBuffer;
    var chunkSize = 1024 * 1024; // 1MB
    var chunks = [];
    var start = 0;
    while (start < arrayBuffer.byteLength) {
        var end = Math.min(arrayBuffer.byteLength, start + chunkSize);
        var chunk = arrayBuffer.slice(start, end);
        chunks.push(chunk);
        start = end;
    }
    return chunks;
};
