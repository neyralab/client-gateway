import { chunkFile } from "./index";

describe("chunkFile", () => {
  it("should split the arrayBuffer into chunks of 1MB or less", () => {
    const totalSize = 5 * 1024 * 1024; // 5MB
    const arrayBuffer = new ArrayBuffer(totalSize);
    const chunks: { byteLength: number }[] = chunkFile(arrayBuffer);

    expect(Array.isArray(chunks)).toBe(true);

    for (let i = 0; i < chunks.length - 1; i++) {
      expect(chunks[i].byteLength).toBe(1024 * 1024);
    }

    const lastChunkSize = totalSize - 1024 * 1024 * (chunks.length - 1);
    expect(chunks[chunks.length - 1].byteLength).toBe(lastChunkSize);
  });

  it("should return a single chunk if the arrayBuffer size is less than 1MB", () => {
    const arrayBuffer = new ArrayBuffer(500 * 1024);
    const chunks: { byteLength: number }[] = chunkFile(arrayBuffer);

    expect(Array.isArray(chunks)).toBe(true);
    expect(chunks.length).toBe(1);
    expect(chunks[0].byteLength).toBe(500 * 1024);
  });

  it("should return an empty array if the input arrayBuffer is empty", () => {
    const arrayBuffer = new ArrayBuffer(0);
    const chunks = chunkFile(arrayBuffer);

    expect(Array.isArray(chunks)).toBe(true);
    expect(chunks.length).toBe(0);
  });
});
