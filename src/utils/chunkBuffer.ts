export async function* chunkBuffer({
  arrayBuffer,
  uploadChunkSize,
}: {
  arrayBuffer: ArrayBuffer;
  uploadChunkSize: number;
}): AsyncGenerator<ArrayBuffer> {
  let start = 0;

  while (start < arrayBuffer.byteLength) {
    const end = Math.min(arrayBuffer.byteLength, start + uploadChunkSize);
    const chunk = arrayBuffer.slice(start, end);
    yield chunk;
    start = end;
  }
}
