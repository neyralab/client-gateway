"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTextToBase64 = void 0;
var Base64 = require("base64-js");
var TextEncoder;
if (typeof window !== "undefined" && typeof window.TextEncoder === "function") {
    TextEncoder = window.TextEncoder;
}
else {
    var util = require("util");
    TextEncoder = util.TextEncoder;
}
var convertTextToBase64 = function (text) {
    var encoder = new TextEncoder();
    var data = encoder.encode(text);
    var binary = new Uint8Array(data.buffer);
    var base64 = Base64.fromByteArray(binary);
    return base64;
};
exports.convertTextToBase64 = convertTextToBase64;
