import { IDownloadFile } from '../types';
export declare const downloadFile: ({ file, oneTimeToken, endpoint, isEncrypted, key, callback, handlers, signal, carReader, uploadChunkSize, cidData, }: IDownloadFile) => Promise<any>;
