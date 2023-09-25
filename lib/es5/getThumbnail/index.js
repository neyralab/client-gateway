"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getThumbnailImage = void 0;
var fs = require("fs");
var MAX_WIDTH = 240;
var MAX_HEIGHT = 240;
var getThumbnailImage = function (_a) {
    var path = _a.path, file = _a.file, quality = _a.quality;
    return new Promise(function (resolve, reject) {
        if (path && !file) {
            var sharp = require("sharp");
            var inputStream = fs.createReadStream(path);
            inputStream
                .pipe(sharp()
                .resize(MAX_WIDTH, MAX_HEIGHT)
                .jpeg({ quality: quality * 10 }))
                .toBuffer(function (err, buffer) {
                if (err) {
                    reject(err);
                }
                else {
                    var base64Thumbnail = "data:image/webp;base64,".concat(buffer.toString("base64"));
                    resolve(base64Thumbnail);
                }
            });
        }
        else {
            var imageURL_1 = URL.createObjectURL(file);
            var image_1 = new Image();
            image_1.src = imageURL_1;
            var canvas_1 = document.createElement("canvas");
            var ctx_1 = canvas_1.getContext("2d");
            image_1.onload = function () {
                var aspectRatio = image_1.width / image_1.height;
                var newWidth = MAX_WIDTH;
                var newHeight = MAX_HEIGHT;
                if (image_1.width > image_1.height) {
                    newHeight = MAX_WIDTH / aspectRatio;
                }
                else {
                    newWidth = MAX_HEIGHT * aspectRatio;
                }
                canvas_1.width = newWidth;
                canvas_1.height = newHeight;
                ctx_1 === null || ctx_1 === void 0 ? void 0 : ctx_1.drawImage(image_1, 0, 0, newWidth, newHeight);
                var qualityReduction = quality / 10;
                var dataURL = canvas_1.toDataURL("image/jpeg", +qualityReduction);
                URL.revokeObjectURL(imageURL_1);
                resolve(dataURL);
            };
            image_1.onerror = function (error) {
                reject(error);
            };
        }
    });
};
exports.getThumbnailImage = getThumbnailImage;
