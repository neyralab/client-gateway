"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalFile = void 0;
var LocalFile = /** @class */ (function () {
    function LocalFile(size, stream, filename, mimeType, fileFolderId) {
        this.stream = function () { return stream; };
        this.isStream = true;
        this.name = filename;
        this.type = mimeType;
        this.folderId = fileFolderId;
        this.size = size;
        this.uploadId = "".concat(filename, "_").concat(size, "_").concat(fileFolderId);
    }
    return LocalFile;
}());
exports.LocalFile = LocalFile;
