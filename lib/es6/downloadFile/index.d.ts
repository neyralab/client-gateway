import { IDownloadFile } from "../types";
export declare const downloadFile: ({ file, oneTimeToken, endpoint, isEncrypted, key, callback, handlers, }: IDownloadFile) => Promise<any>;
export declare const cancelingDownload: (slug: any) => void;
