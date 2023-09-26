import { IEncryptChunk } from "../types";
export declare const encryptChunk: ({ chunk, iv, key, crypto, }: IEncryptChunk) => Promise<ArrayBuffer>;
