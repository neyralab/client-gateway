/// <reference types="node" />
import { LocalFileBuffer, LocalFileStream } from "../types/File";
export declare function chunkFile({ file, }: {
    file: LocalFileBuffer | LocalFileStream;
}): AsyncGenerator<Buffer | ArrayBuffer>;
