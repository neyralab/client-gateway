import { isBrowser } from './isBrowser.js';
import { isMobile } from './isMobile.js';

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

export const joinChunks = async (chunks: ArrayBuffer[], returnBuffer = false) => {
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
    const { Readable } = await import('stream');
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
