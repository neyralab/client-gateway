import { AxiosResponse } from "axios";
import { LocalFileStream, LocalFileBuffer } from "./File";

export type ImagePreviewEffect = (
  fileId: string,
  width: number,
  height: number,
  fit: string,
  cancelToken: AbortSignal | any,
  type: string | undefined
) => any;

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
  getOneTimeToken: GetOneTimeToken;
  getDownloadOTT: GetDownloadOTT;
  callback: Callback;
  handlers: any[];
  key: CryptoKey;
}
export interface ISendChunk {
  chunk: ArrayBuffer;
  index: number;
  file: LocalFileStream | LocalFileBuffer;
  startTime: any;
  oneTimeToken: string;
  endpoint: string;
  iv?: Uint8Array | null;
  clientsideKeySha3Hash?: string | null;
  totalProgress: { number: number };
  callback: Callback;
  handlers: any[];
  listUploadIdsOfCancelledFiles?: Set<string>;
  controller?: AbortController;
}

export interface IUploadFile {
  file: LocalFileStream | LocalFileBuffer;
  oneTimeToken: string;
  endpoint: string;
  callback: Callback;
  handlers: any[];
  key?: CryptoKey;
  crypto?: Crypto | undefined;
}

export interface ISwapChunk {
  file: File | any;
  endpoint: string;
  base64iv: string;
  clientsideKeySha3Hash: string;
  index: number;
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
  crypto?: Crypto | undefined;
}

export interface IDecryptChunk {
  chunk: ArrayBuffer;
  iv: string;
  key: any;
}

export interface IDownloadChunk {
  index: number;
  sha3_hash: string | null;
  oneTimeToken: string;
  signal: any;
  endpoint: string;
  file: File | any;
  startTime: any;
  totalProgress: { number: number };
  callback: Callback;
  handlers: any[];
}

export interface ICountChunks {
  endpoint: string;
  oneTimeToken: string;
  slug: string;
  signal: any;
}

export interface IGetThumbnail {
  path?: string;
  ffmpegCommand?: any;
  file?: File | any;
  quality: number;
  getOneTimeToken: GetOneTimeToken;
  slug: string;
}
