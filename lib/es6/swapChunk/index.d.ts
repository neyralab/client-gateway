import { Callback } from "../types";
export declare const swapChunk: (file: File | any, endpoint: string, base64iv: string, clientsideKeySha3Hash: string, currentIndex: number, chunksLength: number, oneTimeToken: string, encryptedChunk: ArrayBuffer, arrayBuffer: ArrayBuffer, startTime: any, totalProgress: {
    number: number;
}, callback: Callback) => Promise<import("axios").AxiosResponse<any, any>>;
