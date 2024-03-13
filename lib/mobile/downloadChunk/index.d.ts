import { IDownloadChunk } from "../types/index.js";
export declare const downloadChunk: ({ index, sha3_hash, oneTimeToken, signal, endpoint, file, startTime, totalProgress, callback, handlers, }: IDownloadChunk) => Promise<any>;
