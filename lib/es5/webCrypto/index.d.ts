import { Callback, DispatchType, GetDownloadOTT, GetKeysByWorkspace, GetOneTimeToken, ImagePreviewEffect, SaveEncryptedFileKeys, UpdateProgressCallback } from "../types";
export declare class WebCrypto {
    readonly clientsideKeySha3Hash: string;
    iv: Uint8Array;
    encodeFile(file: File | any, oneTimeToken: string, dispatch: DispatchType, endpoint: string, getKeysByWorkspace: GetKeysByWorkspace, updateProgressCallback: UpdateProgressCallback, saveEncryptedFileKeys: SaveEncryptedFileKeys, getOneTimeToken: GetOneTimeToken): Promise<any>;
    encodeExistingFile(file: File | any, getImagePreviewEffect: ImagePreviewEffect, getKeysByWorkspace: GetKeysByWorkspace, saveEncryptedFileKeys: SaveEncryptedFileKeys, getOneTimeToken: GetOneTimeToken, getDownloadOTT: GetDownloadOTT, callback: Callback): Promise<void>;
}
