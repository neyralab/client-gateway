import { LocalFileBuffer } from '../types/File/index.js';

export async function* readFileInChunks(
  file: LocalFileBuffer,
  chunkSize: number
): AsyncGenerator<ArrayBuffer> {
  const reader = file.stream().getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      let start = 0;
      let end = Math.min(value.length, chunkSize);

      while (start < value.length) {
        const slice = value.slice(start, end);
        yield slice.buffer.slice(
          slice.byteOffset,
          slice.byteOffset + slice.byteLength
        );

        start = end;
        end = Math.min(start + chunkSize, value.length);
      }
    }
  } catch (error) {
    console.error('Error reading file in chunks:', error);
    throw error;
  }
}
