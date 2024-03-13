import { IEncryptChunk } from "../types/index.js";
export declare const encryptChunk: ({ chunk, iv, key }: IEncryptChunk) => Promise<ArrayBuffer>;
