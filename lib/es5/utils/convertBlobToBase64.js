"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertBlobToBase64 = void 0;
var convertBlobToBase64 = function (blob) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onloadend = function () {
            var base64Data = reader.result;
            resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};
exports.convertBlobToBase64 = convertBlobToBase64;
