import { isBrowser } from './isBrowser.js';
import { isMobile } from './isMobile.js';
import { Readable } from 'stream';

const createUint8ArrayFromChunks = (chunks: ArrayBuffer[]) => {
  return new Uint8Array(
    chunks.reduce((acc: Uint8Array, buffer) => {
      const tmpArray = new Uint8Array(buffer);
      const newBuffer = new Uint8Array(acc.length + tmpArray.length);
      newBuffer.set(acc);
      newBuffer.set(tmpArray, acc.length);
      return newBuffer;
    }, new Uint8Array(0))
  );
};

export const joinChunks = (chunks: ArrayBuffer[], returnBuffer = false) => {
  if (isMobile()) {
    return createUint8ArrayFromChunks(chunks);
  } else if (isBrowser() && typeof window.Blob !== 'undefined') {
    if (returnBuffer) {
      return createUint8ArrayFromChunks(chunks);
    } else {
      return new Blob(chunks);
    }
  } else if (
    typeof process !== 'undefined' &&
    process.release.name === 'node'
  ) {
    return new Readable({
      read() {
        let pendingChunks = chunks.length;
        for (const chunk of chunks) {
          if (chunk instanceof Readable) {
            chunk.on('data', (data) => this.push(data));
            chunk.on('end', () => {
              pendingChunks--;
              if (pendingChunks === 0) {
                this.push(null);
              }
            });
          } else {
            this.push(Buffer.from(chunk));
            pendingChunks--;
          }
        }
        if (pendingChunks === 0) {
          this.push(null);
        }
      },
    });
  } else {
    console.error('Environment not supported for creating data objects');
    return null;
  }
};
