import { LocalFileBuffer, LocalFileReactNativeStream } from '../types/File/index.js';
import { chunkBase64 } from './chunkBase64.js';
import { chunkBuffer } from './chunkBuffer.js';
import { readFileInChunks } from './readFileInChunks.js';

const MAX_SAFE_CHUNK_SIZE = 2 * 1024 * 1024 * 1024;

export async function* chunkFile({
  file,
  uploadChunkSize,
}: {
  file:
    | LocalFileBuffer
    // | LocalFileStream
    | LocalFileReactNativeStream
    | { size: number; arrayBuffer: () => Promise<ArrayBuffer> };
  uploadChunkSize: number;
}): AsyncGenerator<Buffer | ArrayBuffer | string> {
  // if (file instanceof LocalFileStream) {
  //   const stream = file.stream();
  //   const lastChunkSize =
  //     file.size > uploadChunkSize
  //       ? file.size - Math.floor(file.size / uploadChunkSize) * uploadChunkSize
  //       : file.size;

  //   let buffer: Buffer = Buffer.alloc(uploadChunkSize);
  //   let offset: number = 0;

  //   for await (const chunk of stream) {
  //     let position = 0;
  //     if (lastChunkSize === chunk.length && lastChunkSize) {
  //       buffer = Buffer.alloc(lastChunkSize);
  //     }
  //     while (position < chunk.length) {
  //       const spaceLeft = uploadChunkSize - offset;
  //       const chunkToCopy = Math.min(spaceLeft, chunk.length - position);

  //       chunk.copy(buffer, offset, position, position + chunkToCopy);

  //       position += chunkToCopy;
  //       offset += chunkToCopy;

  //       if (offset === uploadChunkSize) {
  //         yield buffer;
  //         buffer = Buffer.alloc(uploadChunkSize);
  //         offset = 0;
  //       }
  //     }
  //   }

  //   if (offset > 0) {
  //     yield buffer.slice(0, offset);
  //   }
  // } else
  if (file instanceof LocalFileReactNativeStream) {
    yield* chunkBase64(file.chunks);
  } else {
    if (
      file.size > MAX_SAFE_CHUNK_SIZE &&
      'stream' in file &&
      typeof file.stream === 'function'
    ) {
      const chunks = readFileInChunks(file as LocalFileBuffer, uploadChunkSize);
      yield* chunks;
    } else {
      const arrayBuffer = await file.arrayBuffer();
      yield* chunkBuffer({ arrayBuffer, uploadChunkSize });
    }
  }
}
