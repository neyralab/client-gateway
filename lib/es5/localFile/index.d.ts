/// <reference types="node" />
import * as fs from "fs";
export declare class LocalFile {
    stream: () => fs.ReadStream;
    isStream: boolean;
    name: string;
    type: string;
    folderId: string;
    size: number;
    uploadId: string;
    constructor(size: any, stream: any, filename: any, mimeType: any, fileFolderId: any);
}
