const CHUNK_SIZE = 1024 * 1024;

export const chunkFile = ({ arrayBuffer }: { arrayBuffer: ArrayBuffer }) => {
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

export const chunkFileStream = async ({ stream }: { stream: any }) => {
  const { Readable } = require("stream");
  const smallerStreams: any = [];

  let currentOffset = 0;

  return new Promise((resolve, reject) => {
    stream.on("readable", async () => {
      const chunk = stream.read(CHUNK_SIZE);
      if (chunk) {
        currentOffset += chunk.length;
        const smallerReadable = new Readable();
        smallerReadable.push(chunk);
        smallerReadable.push(null);
        smallerStreams.push(smallerReadable);
      }
    });

    stream.on("end", () => {
      resolve(smallerStreams);
    });
    stream.on("error", (error: any) => {
      reject(error);
    });
  });
};
