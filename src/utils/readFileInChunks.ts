import { LocalFileBuffer } from '../types/File/index.js';

export async function* readFileInChunks(
  file: LocalFileBuffer,
  chunkSize: number
): AsyncGenerator<Uint8Array> {
  const reader = file.stream().getReader();
  let buffer = new Uint8Array();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const newSize = buffer.length + (value?.length || 0);
      const newBuffer = new Uint8Array(newSize);

      newBuffer.set(buffer);
      if (value) {
        newBuffer.set(value, buffer.length);
      }

      buffer = newBuffer;

      while (buffer.length >= chunkSize) {
        yield buffer.slice(0, chunkSize);
        buffer = buffer.slice(chunkSize);
      }
    }

    if (buffer.length > 0) {
      yield buffer;
    }
  } catch (error) {
    console.error('Error reading file in chunks:', error);
    throw error;
  }
}
