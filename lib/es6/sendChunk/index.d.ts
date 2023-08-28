import { DispatchType, UpdateProgressCallback } from "../types";
export declare const sendChunk: (chunk: ArrayBuffer, currentIndex: number, chunkLength: number, file: File | any, startTime: any, oneTimeToken: string, endpoint: string, iv: Uint8Array | null, clientsideKeySha3Hash: string | null, dispatch: DispatchType, totalProgress: {
    number: number;
}, updateProgressCallback: UpdateProgressCallback) => Promise<any>;
