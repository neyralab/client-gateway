import { ISwapChunk } from "../types";
export declare const swapChunk: ({ file, endpoint, base64iv, clientsideKeySha3Hash, index, chunksLength, oneTimeToken, encryptedChunk, fileSize, startTime, totalProgress, callback, handlers, }: ISwapChunk) => Promise<import("axios").AxiosResponse<any, any>>;
