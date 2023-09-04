import { AxiosResponse } from "axios";

export type ImagePreviewEffect = (
  fileId: string,
  width: number,
  height: number,
  fit: string,
  cancelToken: AbortSignal | any,
  type: string | undefined
) => any;

export type GetKeysByWorkspace = () => AxiosResponse;

export type SaveEncryptedFileKeys = (body: any) => AxiosResponse;

export type GetOneTimeToken = (params: {
  filename: string;
  filesize: string | number;
}) => AxiosResponse;

export type GetDownloadOTT = (params: [{ slug: string }]) => AxiosResponse;

export type CallbackTypeNames =
  | "onStart"
  | "onSuccess"
  | "onError"
  | "onProgress";

export type Callback = ({
  type,
  params,
}: {
  type: CallbackTypeNames;
  params: any;
}) => void;

export interface IDownloadFile {
  file: File | any;
  oneTimeToken: string;
  signal: any;
  endpoint: string;
  isEncrypted: boolean;
  key?: string | undefined;
  callback?: Callback;
  handlers?: any[];
}
export interface IEncodeExistingFile {
  file: File | any;
  getImagePreviewEffect: ImagePreviewEffect;
  getKeysByWorkspace: GetKeysByWorkspace;
  saveEncryptedFileKeys: SaveEncryptedFileKeys;
  getOneTimeToken: GetOneTimeToken;
  getDownloadOTT: GetDownloadOTT;
  callback: Callback;
  handlers: any[];
}
export interface IEncodeFile {
  file: File | any;
  oneTimeToken: string;
  endpoint: string;
  getKeysByWorkspace: GetKeysByWorkspace;
  saveEncryptedFileKeys: SaveEncryptedFileKeys;
  getOneTimeToken: GetOneTimeToken;
  callback: Callback;
  handlers: any[];
}
export interface ISendChunk {
  chunk: ArrayBuffer;
  index: number;
  chunksLength: number;
  file: File | any;
  startTime: any;
  oneTimeToken: string;
  endpoint: string;
  iv?: Uint8Array | null;
  clientsideKeySha3Hash?: string | null;
  totalProgress: { number: number };
  callback: Callback;
  handlers: any[];
}

export interface IUploadFile {
  file: File | any;
  oneTimeToken: string;
  endpoint: string;
  callback: Callback;
  handlers: any[];
  needStream?: boolean;
  stream?: any;
}

export interface ISwapChunk {
  file: File | any;
  endpoint: string;
  base64iv: string;
  clientsideKeySha3Hash: string;
  index: number;
  chunksLength: number;
  oneTimeToken: string;
  encryptedChunk: ArrayBuffer;
  fileSize: number;
  startTime: any;
  totalProgress: { number: number };
  callback: Callback;
  handlers: any[];
}

export interface IEncryptChunk {
  chunk: ArrayBuffer;
  iv: Uint8Array;
  key: CryptoKey;
}

export interface IDecryptChunk {
  chunk: ArrayBuffer;
  iv: string;
  key: string;
}

export interface IDownloadChunk {
  index: number;
  sha3_hash: string | null;
  slug: string;
  oneTimeToken: string;
  signal: any;
  endpoint: string;
}

export interface ICountChunks {
  endpoint: string;
  oneTimeToken: string;
  slug: string;
  signal: any;
}
