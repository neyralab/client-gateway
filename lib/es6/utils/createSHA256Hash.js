import * as forge from "node-forge";
export var createSHA256Hash = function (buffer) {
    var dataString = Buffer.from(buffer).toString();
    var md = forge.md.sha256.create();
    md.update(dataString);
    return md.digest().toHex();
};
