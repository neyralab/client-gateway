import { DispatchType } from "../types";
export declare const downloadFile: (currentFile: File | any, oneTimeToken: string, signal: AbortSignal, endpoint: string, encrypted: boolean, activationKey: string | null, dispatch: DispatchType | null, successfullyDecryptedCallback: (dispatch: DispatchType) => void) => Promise<any>;
