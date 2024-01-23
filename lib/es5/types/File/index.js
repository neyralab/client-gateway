"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalFileReactNativeStream = exports.LocalFileBuffer = exports.LocalFileStream = void 0;
var fs = require("fs");
var path = require("path");
var LocalFile = /** @class */ (function () {
    function LocalFile(size, filename, mimeType, fileFolderId, uploadId) {
        this.name = filename;
        this.type = mimeType;
        this.folderId = fileFolderId;
        this.size = size;
        this.uploadId = uploadId;
    }
    return LocalFile;
}());
var LocalFileStream = /** @class */ (function (_super) {
    __extends(LocalFileStream, _super);
    function LocalFileStream(size, filename, mimeType, fileFolderId, uploadId) {
        var _this = _super.call(this, size, filename, mimeType, fileFolderId, uploadId) || this;
        _this.stream = function () { return fs.createReadStream(filename); };
        _this.name = path.basename(filename);
        return _this;
    }
    return LocalFileStream;
}(LocalFile));
exports.LocalFileStream = LocalFileStream;
var LocalFileBuffer = /** @class */ (function (_super) {
    __extends(LocalFileBuffer, _super);
    function LocalFileBuffer(size, filename, mimeType, fileFolderId, uploadId, arrayBuffer) {
        var _this = _super.call(this, size, filename, mimeType, fileFolderId, uploadId) || this;
        _this.arrayBuffer = arrayBuffer;
        return _this;
    }
    return LocalFileBuffer;
}(LocalFile));
exports.LocalFileBuffer = LocalFileBuffer;
var LocalFileReactNativeStream = /** @class */ (function (_super) {
    __extends(LocalFileReactNativeStream, _super);
    function LocalFileReactNativeStream(size, filename, mimeType, fileFolderId, uploadId, chunks, convertedExtension, convertedMime, convertedSize) {
        var _this = _super.call(this, size, filename, mimeType, fileFolderId, uploadId) || this;
        _this.chunks = chunks;
        _this.convertedExtension = convertedExtension;
        _this.convertedMime = convertedMime;
        _this.convertedSize = convertedSize;
        return _this;
    }
    return LocalFileReactNativeStream;
}(LocalFile));
exports.LocalFileReactNativeStream = LocalFileReactNativeStream;
