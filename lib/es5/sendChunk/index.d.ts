export declare const sendChunk: (chunk: ArrayBuffer, currentIndex: number, chunkLength: number, file: any, startTime: any, oneTimeToken: string, endpoint: string, iv: Uint8Array | null, clientsideKeySha3Hash: string | null, dispatch: any, updateProgressCallback: (id: string, progress: string | number, timeLeft: number, dispatch: any) => void, getProgressFromLSCallback: () => string | null, setProgressToLSCallback: (progress: string) => void) => Promise<any>;
