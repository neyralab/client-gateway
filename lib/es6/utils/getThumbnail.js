var MAX_WIDTH = 240;
var MAX_HEIGHT = 240;
export var getReductionFactor = function (size) {
    var oneMB = 1000000;
    var fileMB = Math.ceil(size / oneMB);
    if (fileMB > 10) {
        return 0.1;
    }
    if (fileMB < 1) {
        return 0.9;
    }
    return 1 - fileMB * 0.1;
};
export var getThumbnailImage = function (file) {
    return new Promise(function (resolve, reject) {
        var imageURL = URL.createObjectURL(file);
        var image = new Image();
        image.src = imageURL;
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        image.onload = function () {
            var aspectRatio = image.width / image.height;
            var newWidth = MAX_WIDTH;
            var newHeight = MAX_HEIGHT;
            if (image.width > image.height) {
                newHeight = MAX_WIDTH / aspectRatio;
            }
            else {
                newWidth = MAX_HEIGHT * aspectRatio;
            }
            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(image, 0, 0, newWidth, newHeight);
            var qualityReduction = getReductionFactor(file.size);
            var dataURL = canvas.toDataURL('image/webp', +qualityReduction.toFixed(1));
            URL.revokeObjectURL(imageURL);
            resolve(dataURL);
        };
        image.onerror = function (error) {
            reject(error);
        };
    });
};
export var getThumbnailVideo = function (file) {
    return new Promise(function (resolve, reject) {
        var video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        video.onloadedmetadata = function () {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var aspectRatio = video.videoWidth / video.videoHeight;
            var newWidth = MAX_WIDTH;
            var newHeight = MAX_HEIGHT;
            if (video.videoWidth > video.videoHeight) {
                newHeight = MAX_WIDTH / aspectRatio;
            }
            else {
                newWidth = MAX_HEIGHT * aspectRatio;
            }
            canvas.width = newWidth;
            canvas.height = newHeight;
            video.currentTime = 0.1;
            video.onseeked = function () {
                ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(video, 0, 0, newWidth, newHeight);
                var qualityReduction = getReductionFactor(file.size);
                var dataURL = canvas.toDataURL('image/webp', +qualityReduction.toFixed(1));
                resolve(dataURL);
            };
            video.onerror = function (error) {
                reject(error);
            };
        };
        video.onerror = function (error) {
            reject(error);
        };
    });
};
