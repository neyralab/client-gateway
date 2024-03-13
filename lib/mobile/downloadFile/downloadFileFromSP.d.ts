import { IDownloadFileFromSP } from '../types/index.js';
export declare function downloadFileFromSP({ carReader, url, isEncrypted, uploadChunkSize, key, iv, file, level, }: IDownloadFileFromSP): Promise<void | Blob>;
