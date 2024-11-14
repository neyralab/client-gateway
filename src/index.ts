import { encryptChunk } from  "./encryptChunk/index.js";
import { decryptChunk } from  "./decryptChunk/index.js";
import { sendChunk } from  "./sendChunk/index.js";
import { uploadFile, cancelingUpload } from  "./uploadFile/index.js";
import { downloadChunk } from  "./downloadChunk/index.js";
import { downloadFile } from   "./downloadFile/index.js";
import { swapChunk } from   "./swapChunk/index.js";
import { saveBlob } from  "./saveBlob/index.js";
import { countChunks } from  "./countChunks/index.js";
import { getUserRSAKeys } from  "./getUserRSAKeys/index.js";
import { publicKeyToPem } from  "./publicKeyToPem/index.js";
import { encodeExistingFile } from  "./encodeExistingFile/index.js";
import { LocalFileStream, LocalFileBuffer, LocalFileReactNativeStream } from  "./types/File/index.js";
import { getThumbnailImage, getThumbnailVideo, getThumbnailDocument } from  "./getThumbnail/index.js";
import { getMusicInfo } from "./getMusicInfo/index.js";
import { fileDownloadProcess } from './process/index.js'
import { downloadFileFromSP } from "./downloadFile/downloadFileFromSP.js";
import { UUIDBase64Converter } from "./utils/UUIDBase64Converter.js";
import { correctIndex } from "./utils/correctIndex.js";
import { getCountChunk } from "./utils/getCountChunks.js";
import { convertBase64ToArrayBuffer } from "./utils/convertBase64ToArrayBuffer.js";
import { getCrypto } from "./utils/getCrypto.js";
import { getCidLevelByFileSize } from "./utils/getCidLevelByFileSize.js";

// Export types
export { CidLevel, CidLevelType } from './types';

export {
  encryptChunk,
  decryptChunk,
  sendChunk,
  uploadFile, cancelingUpload,
  downloadChunk,
  downloadFile,
  swapChunk,
  saveBlob,
  countChunks,
  getUserRSAKeys,
  publicKeyToPem,
  encodeExistingFile,
  LocalFileStream, LocalFileBuffer, LocalFileReactNativeStream,
  getThumbnailImage, getThumbnailVideo, getThumbnailDocument,
  getMusicInfo,
  fileDownloadProcess,
  downloadFileFromSP,
  UUIDBase64Converter,
  correctIndex,
  getCountChunk,
  convertBase64ToArrayBuffer,
  getCrypto,
  getCidLevelByFileSize
}
// let a = import('./lib/es6/index.js')
