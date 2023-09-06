import { IEncodeExistingFile, IEncodeFile } from "../types";
export declare class WebCrypto {
    readonly clientsideKeySha3Hash: string;
    iv: Uint8Array;
    encodeFile({ file, oneTimeToken, endpoint, getKeysByWorkspace, saveEncryptedFileKeys, getOneTimeToken, callback, handlers, keypair, }: IEncodeFile): Promise<any>;
    encodeExistingFile({ file, getImagePreviewEffect, getKeysByWorkspace, saveEncryptedFileKeys, getOneTimeToken, getDownloadOTT, callback, handlers, keypair, }: IEncodeExistingFile): Promise<void>;
}
