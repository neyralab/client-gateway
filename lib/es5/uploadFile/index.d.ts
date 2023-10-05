import { IUploadFile } from "../types";
export declare const uploadFile: ({ file, oneTimeToken, endpoint, callback, handlers, key, progress, totalSize, startedAt, }: IUploadFile) => Promise<any>;
export declare const cancelingUpload: (uploadId: any) => void;
