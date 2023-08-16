export const arrayBufferToStream = (arrayBuffer: ArrayBuffer) => {
  if (typeof window !== "undefined" && typeof ReadableStream !== "undefined") {
    const uint8Array = new Uint8Array(arrayBuffer);

    return new ReadableStream({
      start(controller) {
        let offset = 0;

        function push() {
          const chunk = uint8Array.subarray(offset, offset + 1024);
          offset += chunk.length;

          if (chunk.length > 0) {
            controller.enqueue(chunk);
            push();
          } else {
            controller.close();
          }
        }
        push();
      },
    });
  } else if (typeof require !== "undefined") {
    const { Readable } = require("stream");

    return new Readable({
      read() {
        this.push(arrayBuffer);
        this.push(null);
      },
    });
  } else {
    throw new Error("Unsupported environment");
  }
};
