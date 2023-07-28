"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertBase64ToArrayBuffer = void 0;
var convertBase64ToArrayBuffer = function (base64) {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
};
exports.convertBase64ToArrayBuffer = convertBase64ToArrayBuffer;
