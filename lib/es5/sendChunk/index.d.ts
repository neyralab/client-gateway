import { ISendChunk } from "../types";
export declare const sendChunk: ({ chunk, index, chunksLength, file, startTime, oneTimeToken, endpoint, iv, clientsideKeySha3Hash, totalProgress, callback, handlers, }: ISendChunk) => Promise<any>;
