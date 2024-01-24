"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTextToBase64 = void 0;
var Base64 = require("base64-js");
var isBrowser_1 = require("./isBrowser");
var isMobile_1 = require("./isMobile");
var TextEncoder;
if ((0, isBrowser_1.isBrowser)() && typeof window.TextEncoder === "function") {
    TextEncoder = window.TextEncoder;
}
else {
    var util = require("util");
    TextEncoder = util.TextEncoder;
}
var convertTextToBase64 = function (text) {
    if ((0, isMobile_1.isMobile)()) {
        return Buffer.from(text).toString('base64');
    }
    else {
        var encoder = new TextEncoder();
        var data = encoder.encode(text);
        var binary = new Uint8Array(data.buffer);
        var base64 = Base64.fromByteArray(binary);
        return base64;
    }
};
exports.convertTextToBase64 = convertTextToBase64;
