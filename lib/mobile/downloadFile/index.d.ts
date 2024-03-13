import { IDownloadFile } from '../types/index.js';
export declare const downloadFile: ({ file, oneTimeToken, endpoint, isEncrypted, key, callback, handlers, signal, carReader, uploadChunkSize, cidData, writeStreamMobile, }: IDownloadFile) => Promise<any>;
