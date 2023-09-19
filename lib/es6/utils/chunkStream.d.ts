/// <reference types="node" />
/// <reference types="node" />
import { Readable } from "stream";
export declare function chunkStream({ stream, lastChunkSize, }: {
    stream: Readable;
    lastChunkSize?: number;
}): AsyncGenerator<Buffer>;
