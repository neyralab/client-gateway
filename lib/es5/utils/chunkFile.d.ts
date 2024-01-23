/// <reference types="node" />
import { LocalFileBuffer, LocalFileReactNativeStream, LocalFileStream } from '../types/File';
export declare function chunkFile({ file, uploadChunkSize, }: {
    file: LocalFileBuffer | LocalFileStream | LocalFileReactNativeStream | {
        size: number;
        arrayBuffer: () => Promise<ArrayBuffer>;
    };
    uploadChunkSize: number;
}): AsyncGenerator<Buffer | ArrayBuffer | string>;
