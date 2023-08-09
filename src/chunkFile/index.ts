export const chunkFile = (arrayBuffer: ArrayBuffer) => {
  const chunkSize = 1024 * 1024; // 1MB
  const chunks = [];
  let start = 0;

  while (start < arrayBuffer.byteLength) {
    const end = Math.min(arrayBuffer.byteLength, start + chunkSize);
    const chunk = arrayBuffer.slice(start, end);
    chunks.push(chunk);
    start = end;
  }

  return chunks;
};
