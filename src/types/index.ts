import {
  LocalFileStream,
  LocalFileBuffer,
  LocalFileReactNativeStream,
} from './File/index.js';

export type ImagePreviewEffect = (
  fileId: string,
  width: number,
  height: number,
  fit: string,
  cancelToken: AbortSignal | any,
  type: string | undefined
) => any;

export type CallbackTypeNames =
  | 'onStart'
  | 'onSuccess'
  | 'onError'
  | 'onEncryptProgress'
  | 'onProgress';

export enum CidLevel {
  Root = 'root',
  Upload = 'upload',
  Interim = 'interim',
}

export type CidLevelType = CidLevel.Root | CidLevel.Upload | CidLevel.Interim;

export type Callback = ({
  type,
  params,
}: {
  type: CallbackTypeNames;
  params: any;
}) => void;

export type GatewayType = {
  url: string;
  upload_chunk_size: number;
  interim_chunk_size: number;
  id: number;
  type: string;
  same_ip_upload: boolean;
};

export interface ICidData {
  slug: string;
  cids: string[];
  level: CidLevelType;
  upload_chunk_size: number;
}

export interface IDownloadFile {
  file: File | any;
  oneTimeToken: string;
  jwtOneTimeToken: string;
  signal: any;
  endpoint: string;
  isEncrypted: boolean;
  key?: string | undefined;
  callback?: Callback;
  handlers?: any[];
  carReader?: any;
  uploadChunkSize?: number;
  cidData?: ICidData;
  writeStreamMobile?: (chunk: Uint8Array) => Promise<void>;
  headers?: { [key: string]: string };
}
export interface IEncodeExistingFile {
  file: File | any;
  oneTimeToken: string;
  jwtOneTimeToken: string;
  downloadJwtOTT: string;
  gateway: GatewayType;
  downloadToken: string;
  downloadEndpoint: string;
  callback: Callback;
  handlers: any[];
  key: CryptoKey;
  carReader: any;
}
export interface ISendChunk {
  chunk: ArrayBuffer | string;
  index: number;
  file: LocalFileStream | LocalFileBuffer | LocalFileReactNativeStream;
  startTime: any;
  oneTimeToken: string;
  jwtOneTimeToken: string;
  gateway: GatewayType;
  iv?: Uint8Array | null;
  clientsideKeySha3Hash?: string | null;
  totalProgress: { number: number };
  callback: Callback;
  handlers: any[];
  listUploadIdsOfCancelledFiles?: Set<string>;
  controller?: AbortController;
  totalSize?: number;
  is_telegram?: boolean;
  blobUtil?: any;
}

export interface IUploadFile {
  file: LocalFileStream | LocalFileBuffer | LocalFileReactNativeStream;
  oneTimeToken: string;
  jwtOneTimeToken: string;
  gateway: GatewayType;
  callback: Callback;
  handlers: any[];
  key?: CryptoKey;
  progress?: number;
  totalSize?: number;
  startedAt?: any;
  is_telegram?: boolean;
  blobUtil?: any;
}

export interface ISwapChunk {
  file: File | any;
  gateway: GatewayType;
  base64iv: string;
  clientsideKeySha3Hash: string;
  index: number;
  oneTimeToken: string;
  jwtOneTimeToken: string;
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
  key: any;
}

export interface IDownloadChunk {
  index: number | string;
  oneTimeToken: string;
  jwtOneTimeToken: string;
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
  jwtOneTimeToken: string;
  slug: string;
  signal: any;
}

export interface IGetThumbnail {
  path?: string;
  ffmpegCommand?: any;
  file?: File | any;
  quality: number;
  oneTimeToken: string;
  jwtOneTimeToken: string;
  endpoint: string;
  slug: string;
  sharp?: any;
  blobUtil?: any;
  platform?: Platform;
}

export type Platform = 'ios' | 'android';

export interface IGetThumbnailDocument {
  file: File | any;
  quality: number;
  oneTimeToken: string;
  jwtOneTimeToken: string;
  endpoint: string;
  slug: string;
  pdfjsLib: any;
  renderAsync: any;
  html2canvas: (
    element: HTMLElement,
    options?: object
  ) => Promise<HTMLCanvasElement>;
}

export interface IDownloadFileFromSP {
  carReader: any;
  url: string;
  isEncrypted: boolean;
  uploadChunkSize: number;
  key: string;
  iv: string;
  file: any;
  level: CidLevelType;
  headers?: { [key: string]: string };
}

export interface ISaveFileFromGenerator {
  generator: any;
  type: string;
  isEncrypted: boolean;
  uploadChunkSize: number;
  key: string;
  iv: string;
  level: CidLevelType;
}

export interface IMusicInfo {
  title: string | null;
  album: string | null;
  artist: string | null;
  year: number | null;
  duration: number;
  picture: string | null;
}
