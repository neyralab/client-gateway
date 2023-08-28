import { AxiosResponse } from "axios";
export type DispatchType = any;
export type FileContentGetter = (fileId: string, cancelToken: any, useBlob: boolean) => Blob;
export type EncryptExistingFileCallback = (file: File | any, arrayBuffer: ArrayBuffer, dispatch: DispatchType) => void;
export type CatchErrorCallback = (fileId: string, dispatch: DispatchType) => void;
export type UpdateFilePropertyCallback = (isCancelModalOpen: any, responseFromIpfs: any, dispatch: DispatchType) => void;
export type ImagePreviewEffect = (fileId: string, width: number, height: number, fit: string, cancelToken: AbortSignal | any, type: string | undefined) => any;
export type GetKeysByWorkspace = () => AxiosResponse;
export type UpdateProgressCallback = (id: string, progress: string | number, timeLeft: number, dispatch: DispatchType) => void;
export type SaveEncryptedFileKeys = (body: any) => AxiosResponse;
export type GetOneTimeToken = (params: {
    filename: string;
    filesize: string | number;
}) => AxiosResponse;
