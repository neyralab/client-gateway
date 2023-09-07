import { IEncodeExistingFile, IEncodeFile } from "../types";
export declare class WebCrypto {
    readonly clientsideKeySha3Hash: string;
    iv: Uint8Array;
    encodeFile({ file, oneTimeToken, endpoint, getOneTimeToken, callback, handlers, key, }: IEncodeFile): Promise<any>;
    encodeExistingFile({ file, getImagePreviewEffect, getOneTimeToken, getDownloadOTT, callback, handlers, key, }: IEncodeExistingFile): Promise<any>;
}
