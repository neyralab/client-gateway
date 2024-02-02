import { LocalFileReactNativeStream } from '../types/File/index.js';

export async function* chunkBase64(array: LocalFileReactNativeStream['chunks']) {
  for (const element of array) {
    yield element;
  }
}
