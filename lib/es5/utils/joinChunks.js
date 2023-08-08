"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinChunks = void 0;
var joinChunks = function (chunks) {
    return new Blob(chunks);
};
exports.joinChunks = joinChunks;
