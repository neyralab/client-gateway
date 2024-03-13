/// <reference types="node" resolution-mode="require"/>
import * as fs from "fs";
declare class LocalFile {
    name: string;
    type: string;
    folderId: string;
    size: number;
    uploadId: string;
    constructor(size: number, filename: string, mimeType: string, fileFolderId: string, uploadId: string);
}
export declare class LocalFileStream extends LocalFile {
    stream: () => fs.ReadStream;
    constructor(size: number, filename: string, mimeType: string, fileFolderId: string, uploadId: string);
}
export declare class LocalFileBuffer extends LocalFile {
    arrayBuffer?: () => Promise<ArrayBuffer>;
    constructor(size: number, filename: string, mimeType: string, fileFolderId: string, uploadId: string, arrayBuffer: () => Promise<ArrayBuffer>);
}
export declare class LocalFileReactNativeStream extends LocalFile {
    chunks: ArrayBuffer[] | string[];
    convertedExtension?: string;
    convertedMime?: string;
    convertedSize?: number;
    constructor(size: number, filename: string, mimeType: string, fileFolderId: string, uploadId: string, chunks: ArrayBuffer[] | string[], convertedExtension?: string, convertedMime?: string, convertedSize?: number);
}
export {};
