export const joinChunks = (chunks: ArrayBuffer[]) => {
  return new Blob(chunks);
};
