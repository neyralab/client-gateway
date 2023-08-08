"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertArrayBufferToBase64 = void 0;
var Base64 = require("base64-js");
var convertArrayBufferToBase64 = function (buffer) {
    var bytes = new Uint8Array(buffer);
    var base64 = Base64.fromByteArray(bytes);
    return base64;
};
exports.convertArrayBufferToBase64 = convertArrayBufferToBase64;
