"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunkFile = void 0;
var chunkFile = function (arrayBuffer) {
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
exports.chunkFile = chunkFile;
