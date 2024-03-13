/// <reference types="node" resolution-mode="require"/>
import { LocalFileBuffer, LocalFileReactNativeStream, LocalFileStream } from '../types/File/index.js';
export declare function chunkFile({ file, uploadChunkSize, }: {
    file: LocalFileBuffer | LocalFileStream | LocalFileReactNativeStream | {
        size: number;
        arrayBuffer: () => Promise<ArrayBuffer>;
    };
    uploadChunkSize: number;
}): AsyncGenerator<Buffer | ArrayBuffer | string>;
