import { IEncodeExistingFile, IEncodeFile } from "../types";
export declare class WebCrypto {
    readonly clientsideKeySha3Hash: string;
    iv: Uint8Array;
    encodeFile({ file, oneTimeToken, endpoint, callback, handlers, key, crypto, }: IEncodeFile): Promise<any>;
    encodeExistingFile({ file, getOneTimeToken, getDownloadOTT, callback, handlers, key, }: IEncodeExistingFile): Promise<any>;
}
export declare const cancelingEncryptAndUpload: (uploadId: any) => void;
