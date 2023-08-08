import { AxiosResponse } from "axios";
export declare class WebCrypto {
    readonly clientsideKeySha3Hash: string;
    iv: Uint8Array;
    encodeFile(file: File | any, oneTimeToken: any, dispatch: any, startTime: Date, endpoint: string, getKeysByWorkspace: () => any, updateProgressCallback: (id: string, progress: string | number, timeLeft: number, dispatch: any) => void, getProgressFromLSCallback: () => string | null, setProgressToLSCallback: (progress: string) => void, saveEncryptedFileKeys: (body: any) => AxiosResponse, getOneTimeToken: ({ filename, filesize, }: {
        filename: string;
        filesize: string | number;
    }) => AxiosResponse): Promise<any>;
    downloadFile(currentFile: any, oneTimeToken: any, activationKey: string, signal: AbortSignal, endpoint: string): Promise<Blob>;
    encodeExistingFile(file: File | any, dispatch: any, getFileContent: any, firstEncodeExistingCallback: any, secondEncodeExistingCallback: any, thirdEncodeExistingCallback: any, getImagePreviewEffect: any, getKeysByWorkspace: () => AxiosResponse, updateProgressCallback: (id: string, progress: string | number, timeLeft: number, dispatch: any) => void, getProgressFromLSCallback: () => string | null, setProgressToLSCallback: (progress: string) => void, saveEncryptedFileKeys: (body: any) => AxiosResponse, getOneTimeToken: ({ filename, filesize, }: {
        filename: string;
        filesize: string | number;
    }) => AxiosResponse): Promise<void>;
}
