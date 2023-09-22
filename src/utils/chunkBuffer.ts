import { CHUNK_SIZE } from "../config";

export async function* chunkBuffer({
  arrayBuffer,
}: {
  arrayBuffer: ArrayBuffer;
}): AsyncGenerator<ArrayBuffer> {
  let start = 0;

  while (start < arrayBuffer.byteLength) {
    const end = Math.min(arrayBuffer.byteLength, start + CHUNK_SIZE);
    const chunk = arrayBuffer.slice(start, end);
    yield chunk;
    start = end;
  }
}
