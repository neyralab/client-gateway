"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunkBuffer = void 0;
var config_1 = require("../config");
var chunkBuffer = function (_a) {
    var arrayBuffer = _a.arrayBuffer;
    var chunks = [];
    var start = 0;
    while (start < arrayBuffer.byteLength) {
        var end = Math.min(arrayBuffer.byteLength, start + config_1.CHUNK_SIZE);
        var chunk = arrayBuffer.slice(start, end);
        chunks.push(chunk);
        start = end;
    }
    return chunks;
};
exports.chunkBuffer = chunkBuffer;
