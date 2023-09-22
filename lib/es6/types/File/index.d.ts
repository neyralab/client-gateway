/// <reference types="node" />
import * as fs from "fs";
declare class LocalFile {
    name: string;
    type: string;
    folderId: string;
    size: number;
    uploadId: string;
    constructor(size: number, filename: string, mimeType: string, fileFolderId: string);
}
export declare class LocalFileStream extends LocalFile {
    stream: () => fs.ReadStream;
    constructor(size: number, filename: string, mimeType: string, fileFolderId: string);
}
export declare class LocalFileBuffer extends LocalFile {
    arrayBuffer?: () => Promise<ArrayBuffer>;
    constructor(size: number, filename: string, mimeType: string, fileFolderId: string, arrayBuffer: () => Promise<ArrayBuffer>);
}
export {};
