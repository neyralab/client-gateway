import { isBrowser } from './isBrowser.js';
import { isMobile } from './isMobile.js';

export const joinChunks = (chunks: ArrayBuffer[]) => {
  if (isMobile()) {
    return new Uint8Array(
      chunks.reduce((acc: Uint8Array, buffer) => {
        const tmpArray = new Uint8Array(buffer);
        const newBuffer = new Uint8Array(acc.length + tmpArray.length);
        newBuffer.set(acc);
        newBuffer.set(tmpArray, acc.length);
        return newBuffer;
      }, new Uint8Array(0))
    );
  } else if (isBrowser() && typeof window.Blob !== 'undefined') {
    return new Blob(chunks);
  } else if (
    typeof process !== 'undefined' &&
    process.release.name === 'node'
  ) {
    const { Readable } = require('stream');
    return new Readable({
      read() {
        for (const chunk of chunks) {
          this.push(chunk);
        }
        this.push(null);
      },
    });
  } else {
    console.error('Environment not supported for creating data objects');
    return null;
  }
};
