import { IDownloadFileFromSP } from '../types';
export declare function downloadFileFromSP({ carReader, url, isEncrypted, uploadChunkSize, key, iv, file, level, }: IDownloadFileFromSP): Promise<void | Blob>;
