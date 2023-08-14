import * as Base64 from "base64-js";
import { hasWindow } from "./hasWindow";
var TextEncoder;
if (hasWindow() && typeof window.TextEncoder === "function") {
    TextEncoder = window.TextEncoder;
}
else {
    var util = require("util");
    TextEncoder = util.TextEncoder;
}
export var convertTextToBase64 = function (text) {
    var encoder = new TextEncoder();
    var data = encoder.encode(text);
    var binary = new Uint8Array(data.buffer);
    var base64 = Base64.fromByteArray(binary);
    return base64;
};
