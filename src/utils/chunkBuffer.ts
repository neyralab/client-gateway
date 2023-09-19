import { CHUNK_SIZE } from "../config";

export const chunkBuffer = ({ arrayBuffer }: { arrayBuffer: ArrayBuffer }) => {
  const chunks = [];
  let start = 0;

  while (start < arrayBuffer.byteLength) {
    const end = Math.min(arrayBuffer.byteLength, start + CHUNK_SIZE);
    const chunk = arrayBuffer.slice(start, end);
    chunks.push(chunk);
    start = end;
  }

  return chunks;
};
