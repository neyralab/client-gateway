export var arrayBufferToStream = function (arrayBuffer) {
    if (typeof window !== "undefined" && typeof ReadableStream !== "undefined") {
        var uint8Array_1 = new Uint8Array(arrayBuffer);
        return new ReadableStream({
            start: function (controller) {
                var offset = 0;
                function push() {
                    var chunk = uint8Array_1.subarray(offset, offset + 1024);
                    offset += chunk.length;
                    if (chunk.length > 0) {
                        controller.enqueue(chunk);
                        push();
                    }
                    else {
                        controller.close();
                    }
                }
                push();
            },
        });
    }
    else if (typeof require !== "undefined") {
        var Readable = require("stream").Readable;
        return new Readable({
            read: function () {
                this.push(arrayBuffer);
                this.push(null);
            },
        });
    }
    else {
        throw new Error("Unsupported environment");
    }
};
