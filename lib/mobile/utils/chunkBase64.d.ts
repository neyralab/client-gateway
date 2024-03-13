import { LocalFileReactNativeStream } from '../types/File/index.js';
export declare function chunkBase64(array: LocalFileReactNativeStream['chunks']): AsyncGenerator<string | ArrayBuffer, void, unknown>;
