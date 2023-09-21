import { CHUNK_SIZE } from "../config";
import { LocalFileBuffer, LocalFileStream } from "../types/File";
import { chunkBuffer } from "./chunkBuffer";

export async function* chunkFile({
  file,
}: {
  file: LocalFileBuffer | LocalFileStream;
}): AsyncGenerator<Buffer | ArrayBuffer> {
  if (file instanceof LocalFileStream) {
    const stream = file.stream();
    const lastChunkSize =
      file.size > CHUNK_SIZE
        ? file.size - Math.floor(file.size / CHUNK_SIZE) * CHUNK_SIZE
        : file.size;

    let buffer: Buffer = Buffer.alloc(CHUNK_SIZE);
    let offset: number = 0;

    for await (const chunk of stream) {
      let position = 0;
      if (lastChunkSize === chunk.length && lastChunkSize) {
        buffer = Buffer.alloc(lastChunkSize);
      }
      while (position < chunk.length) {
        const spaceLeft = CHUNK_SIZE - offset;
        const chunkToCopy = Math.min(spaceLeft, chunk.length - position);

        chunk.copy(buffer, offset, position, position + chunkToCopy);

        position += chunkToCopy;
        offset += chunkToCopy;

        if (offset === CHUNK_SIZE) {
          yield buffer;
          buffer = Buffer.alloc(CHUNK_SIZE);
          offset = 0;
        }
      }
    }

    if (offset > 0) {
      yield buffer.slice(0, offset);
    }
  } else {
    const arrayBuffer = await file.arrayBuffer();
    yield* chunkBuffer({ arrayBuffer });
  }
}
