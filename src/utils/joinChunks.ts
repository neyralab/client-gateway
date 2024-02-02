import { isBrowser } from "./isBrowser.js";

export const joinChunks = (chunks: ArrayBuffer[]) => {
  if (isBrowser() && window.Blob) {
    return new Blob(chunks);
  } else if (
    typeof process !== "undefined" &&
    process.release.name === "node"
  ) {
    const { Readable } = require("stream");
    const readableStream = new Readable({
      read() {
        for (const chunk of chunks) {
          this.push(chunk);
        }
        this.push(null);
      },
    });

    return readableStream;
  } else {
    console.error("Environment not supported for creating data objects");
    return null;
  }
};
