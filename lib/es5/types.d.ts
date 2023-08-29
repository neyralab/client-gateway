import { AxiosResponse } from "axios";
export type DispatchType = any;
export type ImagePreviewEffect = (fileId: string, width: number, height: number, fit: string, cancelToken: AbortSignal | any, type: string | undefined) => any;
export type GetKeysByWorkspace = () => AxiosResponse;
export type UpdateProgressCallback = ({ id, progress, timeLeft, dispatch, }: {
    id: string;
    progress: string | number;
    timeLeft: number;
    dispatch: DispatchType;
}) => void;
export type SaveEncryptedFileKeys = (body: any) => AxiosResponse;
export type GetOneTimeToken = (params: {
    filename: string;
    filesize: string | number;
}) => AxiosResponse;
export type GetDownloadOTT = (params: [{
    slug: string;
}]) => AxiosResponse;
export type CallbackTypeNames = "onStart" | "onSuccess" | "onError" | "onProgress";
export type Callback = ({ type, params, }: {
    type: CallbackTypeNames;
    params: any;
}) => void;
