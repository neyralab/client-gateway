export const getCountChunk = (
  size: number,
  chunkSize: number
): { count: number; end: number } => {
  const countChunk = Math.ceil(size / chunkSize);
  const end = size - (countChunk - 1) * chunkSize;
  return { count: countChunk, end };
};
