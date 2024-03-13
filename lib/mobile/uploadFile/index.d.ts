import { IUploadFile } from '../types/index.js';
export declare const uploadFile: ({ file, oneTimeToken, gateway, callback, handlers, key, progress, totalSize, startedAt, }: IUploadFile) => Promise<any>;
export declare const cancelingUpload: (uploadId: any) => void;
