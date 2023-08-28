import { CatchErrorCallback, DispatchType, EncryptExistingFileCallback, FileContentGetter, GetKeysByWorkspace, GetOneTimeToken, ImagePreviewEffect, SaveEncryptedFileKeys, UpdateFilePropertyCallback, UpdateProgressCallback } from "../types";
export declare class WebCrypto {
    readonly clientsideKeySha3Hash: string;
    iv: Uint8Array;
    encodeFile(file: File | any, oneTimeToken: string, dispatch: DispatchType, endpoint: string, getKeysByWorkspace: GetKeysByWorkspace, updateProgressCallback: UpdateProgressCallback, saveEncryptedFileKeys: SaveEncryptedFileKeys, getOneTimeToken: GetOneTimeToken): Promise<any>;
    downloadFile(currentFile: File | any, oneTimeToken: string, activationKey: string, signal: AbortSignal, endpoint: string): Promise<any>;
    encodeExistingFile(file: File | any, dispatch: DispatchType, getFileContent: FileContentGetter, encryptExistingFileCallback: EncryptExistingFileCallback, catchErrorCallback: CatchErrorCallback, updateFilePropertyCallback: UpdateFilePropertyCallback, getImagePreviewEffect: ImagePreviewEffect, getKeysByWorkspace: GetKeysByWorkspace, updateProgressCallback: UpdateProgressCallback, saveEncryptedFileKeys: SaveEncryptedFileKeys, getOneTimeToken: GetOneTimeToken): Promise<void>;
}
