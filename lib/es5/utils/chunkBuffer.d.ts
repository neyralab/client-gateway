export declare function chunkBuffer({ arrayBuffer, uploadChunkSize, }: {
    arrayBuffer: ArrayBuffer;
    uploadChunkSize: number;
}): AsyncGenerator<ArrayBuffer>;
