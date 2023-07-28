import * as Base64 from "base64-js";
export var convertTextToBase64 = function (text) {
    var encoder = new TextEncoder();
    var data = encoder.encode(text);
    var binary = new Uint8Array(data.buffer);
    var base64 = Base64.fromByteArray(binary);
    return base64;
};
