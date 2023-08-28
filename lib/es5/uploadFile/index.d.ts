import { DispatchType, UpdateProgressCallback } from "../types";
export declare const uploadFile: (file: File | any, oneTimeToken: string, endpoint: string, dispatch: DispatchType, updateProgressCallback: UpdateProgressCallback) => Promise<any>;
