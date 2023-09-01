"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertBlobToBase64 = void 0;
var convertBlobToBase64 = function (blob) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onloadend = function () {
            var base64Data = reader.result;
            if (typeof base64Data === "string") {
                var dataURL = base64Data.replace(/^data:[^;]+/, "data:image/png");
                resolve(dataURL);
                resolve(base64Data);
            }
            else {
                reject(new Error("Failed to convert blob to base64"));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};
exports.convertBlobToBase64 = convertBlobToBase64;
