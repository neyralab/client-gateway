"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSHA256Hash = void 0;
var forge = require("node-forge");
var createSHA256Hash = function (buffer) {
    var dataString = Buffer.from(buffer).toString();
    var md = forge.md.sha256.create();
    md.update(dataString);
    return md.digest().toHex();
};
exports.createSHA256Hash = createSHA256Hash;
