import { ISendChunk } from "../types";
export declare const sendChunk: ({ chunk, index, file, startTime, oneTimeToken, endpoint, iv, clientsideKeySha3Hash, totalProgress, callback, handlers, controller, totalSize, }: ISendChunk) => Promise<any>;
