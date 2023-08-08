import * as Base64 from 'base64-js';
export var convertArrayBufferToBase64 = function (buffer) {
    var bytes = new Uint8Array(buffer);
    var base64 = Base64.fromByteArray(bytes);
    return base64;
};
