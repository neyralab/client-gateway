/// <reference types="node" />
import { LocalFileBuffer, LocalFileStream } from '../types/File';
export declare function chunkFile({ file, uploadChunkSize, }: {
    file: LocalFileBuffer | LocalFileStream | {
        size: number;
        arrayBuffer: () => Promise<ArrayBuffer>;
    };
    uploadChunkSize: number;
}): AsyncGenerator<Buffer | ArrayBuffer>;
