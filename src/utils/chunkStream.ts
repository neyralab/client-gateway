import { Readable } from "stream";
import { CHUNK_SIZE } from "../config";

export async function* chunkStream({
  stream,
  lastChunkSize,
}: {
  stream: Readable;
  lastChunkSize?: number;
}): AsyncGenerator<Buffer> {
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
}
