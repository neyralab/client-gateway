import { ISwapChunk } from '../types/index.js';
export declare const swapChunk: ({ file, gateway, base64iv, clientsideKeySha3Hash, index, oneTimeToken, encryptedChunk, fileSize, startTime, totalProgress, callback, handlers, }: ISwapChunk) => Promise<import("axios").AxiosResponse<any, any>>;
