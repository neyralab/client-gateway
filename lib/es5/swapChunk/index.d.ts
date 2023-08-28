import { DispatchType, UpdateProgressCallback } from "../types";
export declare const swapChunk: (file: File | any, endpoint: string, base64iv: string, clientsideKeySha3Hash: string, currentIndex: number, chunksLength: number, oneTimeToken: string, encryptedChunk: ArrayBuffer, arrayBuffer: ArrayBuffer, startTime: any, dispatch: DispatchType, totalProgress: {
    number: number;
}, updateProgressCallback: UpdateProgressCallback) => Promise<import("axios").AxiosResponse<any, any>>;
