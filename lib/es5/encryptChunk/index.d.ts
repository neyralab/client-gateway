import { IEncryptChunk } from "../types";
export declare const encryptChunk: ({ chunk, iv, key }: IEncryptChunk) => Promise<ArrayBuffer>;
