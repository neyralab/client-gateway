/// <reference types="node" />
import { CancelTokenSource } from "axios";
import * as fs from "fs";
export declare class LocalFile {
    name: string;
    type: string;
    folderId: string;
    size: number;
    uploadId: string;
    source?: CancelTokenSource;
    constructor(size: number, filename: string, mimeType: string, fileFolderId: string, source?: CancelTokenSource);
}
export declare class LocalFileStream extends LocalFile {
    stream: () => fs.ReadStream;
    isStream: boolean;
    constructor(size: number, filename: string, mimeType: string, fileFolderId: string, source?: CancelTokenSource);
}
export declare class LocalFileBuffer extends LocalFile {
    arrayBuffer?: () => Promise<ArrayBuffer>;
    controller?: () => Promise<ArrayBuffer>;
    constructor(size: number, filename: string, mimeType: string, fileFolderId: string, arrayBuffer: () => Promise<ArrayBuffer>, source?: CancelTokenSource);
}
