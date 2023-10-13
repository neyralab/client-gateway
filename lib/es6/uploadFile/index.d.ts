import { IUploadFile } from "../types";
export declare const uploadFile: ({ file, oneTimeToken, endpoint, callback, handlers, key, }: IUploadFile, signal: AbortSignal) => Promise<any>;
export declare const cancelingUpload: (uploadId: any) => void;
