import { encryptChunk } from "./encryptChunk";
import { decryptChunk } from "./decryptChunk";
import { sendChunk } from "./sendChunk";
import { uploadFile, cancelingUpload } from "./uploadFile";
import { downloadChunk } from "./downloadChunk";
import { downloadFile } from "./downloadFile";
import { swapChunk } from "./swapChunk";
import { saveBlob } from "./saveBlob";
import { countChunks } from "./countChunks";
import { getUserRSAKeys } from "./getUserRSAKeys";
import { publicKeyToPem } from "./publicKeyToPem";
import { encodeExistingFile } from "./encodeExistingFile";
import { LocalFileStream, LocalFileBuffer, LocalFileReactNativeStream } from "./types/File";
import { getThumbnailImage, getThumbnailVideo } from "./getThumbnail";

export const pkg = {
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
  getThumbnailImage, getThumbnailVideo
}
