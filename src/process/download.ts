import { CarReader } from '@ipld/car';
import { downloadFile } from '../downloadFile/index.js';
import { IFile, LocalProvider, ProcessDownload, Callbacks } from './types.js';
import { Api, getDecryptedKey } from './api.js';
import { ALL_FILE_DOWNLOAD_MAX_SIZE, ONE_MB } from '../config.js';
import { IDownloadFile } from '../types/index.js';

export async function fileDownloadProcess(
  data: {
    fileEntry: IFile;
    xToken: string;
    serverUrl: string;
    localProvider: LocalProvider;
    provider: any;
    callbacks?: Callbacks;
    decryptionUrl?: string;
    keys?: { privateKeyPem: string };
  } & Pick<IDownloadFile, 'writeStreamMobile' | 'headers'>
): Promise<ProcessDownload> {
  const {
    fileEntry,
    xToken,
    callbacks,
    provider,
    localProvider,
    decryptionUrl,
    writeStreamMobile,
    keys,
    serverUrl,
    headers,
  } = data;
  const api = new Api(serverUrl, xToken);
  const isClientsideEncrypted: boolean = !!fileEntry?.is_clientside_encrypted;
  const controller = new AbortController();
  const signal = controller.signal;
  const size = Number((fileEntry.size / ONE_MB).toFixed(1));
  let cidData;

  const {
    data: {
      user_tokens: { token: oneTimeToken },
      gateway,
      upload_chunk_size,
    },
  } = await api.getDownloadOTT([{ slug: fileEntry.slug }]);

  if (fileEntry?.is_on_storage_provider && size >= ALL_FILE_DOWNLOAD_MAX_SIZE) {
    cidData = await api.getFileCids({ slug: fileEntry.slug });
  }
  let blob: Blob;

  const callback = ({ type, params }) => {
    if (type === 'onProgress') {
      callbacks?.onProgress(params);
    } else {
      console.error(`Handler "${type}" isn't provided`);
    }
  };

  if (isClientsideEncrypted) {
    let decryptedKey: string | undefined;
    const [userPublicAddress] = await provider?.provider?.request({
      method: 'eth_requestAccounts',
    });

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
      const encryptedKey = await api.getEncryptedFileKey(
        fileEntry.slug,
        userPublicAddress
      );

      try {
        decryptedKey = await getDecryptedKey({
          key: encryptedKey!,
          publicAddress: userPublicAddress,
          provider,
          keys,
        });
      } catch (e) {
        console.log('before prompt', { e });
        try {
          const unEncryptedFileKey = await api.getUnEncryptedFileKey(
            fileEntry.slug
          );
          if (unEncryptedFileKey) {
            decryptedKey = unEncryptedFileKey;
          } else {
            decryptedKey = await callbacks?.onPrompt();
          }
        } catch (err) {
          decryptedKey = undefined;
        }
      }
    }
    if (!decryptedKey) {
      return { data: null, error: 'All of the decrypted keys are wrong' };
    }
    await localProvider.set(fileEntry.slug, decryptedKey);
    console.log('before downloadFile() run');
    blob = await downloadFile({
      file: fileEntry,
      oneTimeToken,
      endpoint: gateway.url,
      isEncrypted: isClientsideEncrypted,
      key: decryptedKey,
      callback,
      handlers: ['onProgress'],
      carReader: CarReader,
      uploadChunkSize:
        upload_chunk_size[fileEntry.slug] || gateway.upload_chunk_size,
      cidData,
      signal,
      writeStreamMobile,
      headers,
    }).catch(handleDownloadError);
    console.log('after downloadFile() run');
  } else {
    blob = await downloadFile({
      file: fileEntry,
      oneTimeToken,
      endpoint: gateway.url,
      isEncrypted: false,
      callback,
      handlers: ['onProgress'],
      carReader: CarReader,
      uploadChunkSize:
        upload_chunk_size[fileEntry.slug] || gateway.upload_chunk_size,
      cidData,
      signal,
      writeStreamMobile,
      headers,
    }).catch(handleDownloadError);
  }

  if (blob instanceof Blob) {
    return { data: blob, error: null };
    // const url = URL.createObjectURL(blob);
    // if (fileEntry?.extension === 'svg') {
    //   return { data: await blob.text(), error: null };
    // }
    // return { data: url, error: null };
  } else {
    return blob as ProcessDownload;
  }
}

function handleDownloadError(error) {
  console.log({ handleDownloadError: error.message, a: error.stack });

  let message = '';
  if (
    error?.message?.includes('HTTP') ||
    (error instanceof TypeError && error.message.includes('Failed to fetch'))
  ) {
    message = 'notification.failedToFetch';
  } else if (
    // error instanceof DOMException ||
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
