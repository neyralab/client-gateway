import axios from 'axios';
import { CarReader } from '@ipld/car';
import { downloadFile } from '../downloadFile/index.js';
import { DownloadOTT, LocalProvider, ProcessDownload } from './types.js';
import { getDecryptedKey, getEncryptedFileKey, getFileCids } from './api.js';
import { ALL_FILE_DOWNLOAD_MAX_SIZE, ONE_MB } from '../config.js';

export async function fileDownloadProcess(
  fileEntry: any,
  downloadOTT: DownloadOTT,
  onProgress: (data: {
    id: string;
    progress: string;
    timeLeft: string;
    downloadingPercent: string;
  }) => void,
  provider: unknown,
  localProvider: LocalProvider,
  decryptionUrl?: string
): Promise<ProcessDownload> {
  const isClientsideEncrypted: boolean = fileEntry?.is_clientside_encrypted;
  // const isPublic: boolean = fileEntry?.shares?.length
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

  if (fileEntry?.is_on_storage_provider && size >= ALL_FILE_DOWNLOAD_MAX_SIZE) {
    cidData = await getFileCids({ slug: fileEntry.slug });
  }
  let blob: Blob;

  if (isClientsideEncrypted) {
    let decryptedKey: string;

    if (decryptionUrl) {
      const parsedUrl = decryptionUrl.split('#');
      decryptedKey = parsedUrl.at(1);
    }

    if (!decryptedKey) {
      const localDecryptedKey = await localProvider.get(fileEntry.slug);
      if (localDecryptedKey) {
        decryptedKey = localDecryptedKey;
      }
    }
    if (!decryptedKey) {
      const encryptedKey = await getEncryptedFileKey(fileEntry.slug, provider);
      decryptedKey = await getDecryptedKey({ key: encryptedKey, provider });
    }
    const callback = ({ type, params }) => {
      if (type === 'onProgress') {
        onProgress(params);
      } else {
        console.error(`Handler "${type}" isn't provided`);
      }
    };
    blob = await downloadFile({
      file: fileEntry,
      oneTimeToken,
      endpoint: gateway.url,
      isEncrypted: fileEntry?.file?.is_clientside_encrypted,
      key: decryptedKey,
      callback,
      handlers: ['onProgress'],
      carReader: CarReader,
      uploadChunkSize:
        upload_chunk_size[fileEntry.slug] || gateway.upload_chunk_size,
      cidData,
      signal,
    }).catch(handleDownloadError);
  } else {
    blob = await downloadFile({
      file: fileEntry,
      oneTimeToken,
      endpoint: gateway.url,
      isEncrypted: false,
      carReader: CarReader,
      uploadChunkSize:
        upload_chunk_size[fileEntry.slug] || gateway.upload_chunk_size,
      cidData,
      signal,
    }).catch(handleDownloadError);
  }

  const url = URL.createObjectURL(blob);
  if (fileEntry?.extension === 'svg') {
    return { data: await blob.text(), error: null };
  }
  return { data: url, error: null };
}

function handleDownloadError(error) {
  let message = '';
  if (
    error?.message?.includes('HTTP') ||
    (error instanceof TypeError && error.message.includes('Failed to fetch'))
  ) {
    message = 'notification.failedToFetch';
  } else if (
    error instanceof DOMException ||
    error?.message === 'AES key data must be 128 or 256 bits' ||
    error?.message ===
      "Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded."
  ) {
    message = 'notification.invalidKey';
  } else {
    message = 'notification.somethingWrong';
  }
  return {
    error: message,
    data: null,
  };
}
