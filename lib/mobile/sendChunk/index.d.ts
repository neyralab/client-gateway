import { ISendChunk } from '../types/index.js';
export declare const sendChunk: ({ chunk, index, file, startTime, oneTimeToken, gateway, iv, clientsideKeySha3Hash, totalProgress, callback, handlers, controller, totalSize, }: ISendChunk) => Promise<any>;
