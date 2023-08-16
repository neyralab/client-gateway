"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinChunks = void 0;
var hasWindow_1 = require("./hasWindow");
var joinChunks = function (chunks) {
    if ((0, hasWindow_1.hasWindow)() && window.Blob) {
        return new Blob(chunks);
    }
    else if (typeof process !== "undefined" &&
        process.release.name === "node") {
        var Readable = require("stream").Readable;
        var readableStream = new Readable({
            read: function () {
                for (var _i = 0, chunks_1 = chunks; _i < chunks_1.length; _i++) {
                    var chunk = chunks_1[_i];
                    this.push(chunk);
                }
                this.push(null);
            },
        });
        return readableStream;
    }
    else {
        console.error("Environment not supported for creating data objects");
        return null;
    }
};
exports.joinChunks = joinChunks;
