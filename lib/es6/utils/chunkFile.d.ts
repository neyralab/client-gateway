/// <reference types="node" />
import { LocalFileBuffer, LocalFileStream } from '../types/File';
export declare function chunkFile({ file, uploadChunkSize, }: {
    file: LocalFileBuffer | LocalFileStream;
    uploadChunkSize: number;
}): AsyncGenerator<Buffer | ArrayBuffer>;
