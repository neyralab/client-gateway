import axios from "axios";
import {CarReader} from '@ipld/car';
import {DownloadOTT, ProcessDownload} from "./types.js";
import {downloadFile} from "../downloadFile/index.js";
import {ALL_FILE_DOWNLOAD_MAX_SIZE, ONE_MB} from "../config.js";
import {getDecryptedKey, getEncryptedFileKey, getFileCids} from "./api.js";

export async function fileDownloadProcess(
  fileEntry: any,
  downloadOTT: DownloadOTT,
  onProgress:(data: {
    id: string,
    progress: string,
    timeLeft: string,
    downloadingPercent: string,
  }) => void,
  provider: unknown
): Promise<ProcessDownload> {
  const isClientsideEncrypted: boolean = fileEntry?.is_clientside_encrypted;
  const isPublic: boolean = fileEntry?.shares?.length
  const signal = axios.CancelToken.source();
  const size = Number((fileEntry.size / ONE_MB).toFixed(1));
  let cidData;

  const {
    data: {
      user_tokens: { token: oneTimeToken },
      gateway,
      upload_chunk_size,
    },
  } = downloadOTT;

  if (fileEntry?.is_on_storage_provider && size >= ALL_FILE_DOWNLOAD_MAX_SIZE){
    cidData = await getFileCids({slug: fileEntry.slug})
  }
  let blob: Blob;

  if (isClientsideEncrypted) {
    if (!isPublic) {
      const key = await getEncryptedFileKey(fileEntry.slug, provider);
      if (key) {
        const callback = ({ type, params }) => {
          if (type === 'onProgress') {
            onProgress(params)
          } else {
            console.error(`Handler "${type}" isn't provided`);
          }
        };
        const decryptedKey = await getDecryptedKey({ key, provider });

         blob = await downloadFile({
          file: fileEntry,
          oneTimeToken,
          endpoint: gateway.url,
          isEncrypted: true,
          key: decryptedKey,
          callback,
          handlers: ['onProgress'],
          carReader: CarReader,
          uploadChunkSize:
            upload_chunk_size[fileEntry.slug] || gateway.upload_chunk_size,
          cidData,
          signal
        }).catch(handleDownloadError);
      } else {
        return { error: 'notification.switchAddress', data: null }
      }
    } else {
     return { error: 'notification.encryptedPublicFile' , data: null }
    }
  } else {
    blob = await downloadFile({
      file: fileEntry,
      oneTimeToken,
      endpoint: gateway.url,
      isEncrypted: false,
      carReader: CarReader,
      uploadChunkSize: upload_chunk_size[fileEntry.slug] || gateway.upload_chunk_size,
      cidData,
      signal
    }).catch(handleDownloadError);
  }

  const url = URL.createObjectURL(blob);
  if (fileEntry?.extension === 'svg') {
    return { data: await blob.text(), error: null}
  }
  return { data: url, error: null }
}

function handleDownloadError(error){
  let message = '';
  if (
    error?.message?.includes('HTTP') ||
    (error instanceof TypeError &&
      error.message.includes('Failed to fetch'))
  ) {
    message = ('notification.failedToFetch');
  } else if (
    error instanceof DOMException ||
    error?.message === 'AES key data must be 128 or 256 bits' ||
    error?.message ===
    "Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded."
  ) {
    message = ('notification.invalidKey');
  } else {
    message = ('notification.somethingWrong');
  }
  return {
    error: message,
    data: null
  }
}
