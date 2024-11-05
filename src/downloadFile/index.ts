import { decryptChunk, downloadChunk } from '../index.js';

import { isMobile } from '../utils/isMobile.js';
import { isBrowser } from '../utils/isBrowser.js';
import { joinChunks } from '../utils/joinChunks.js';
import { getCountChunk } from '../utils/getCountChunks.js';
import { convertBase64ToArrayBuffer } from '../utils/convertBase64ToArrayBuffer.js';
import isDataprepUrl from '../utils/isDataprepUrl.js';
import { correctIndex } from '../utils/correctIndex.js';

import { IDownloadFile } from '../types/index.js';
import { ALL_FILE_DOWNLOAD_MAX_SIZE, ONE_MB } from '../config.js';

import { downloadFileFromSP } from './downloadFileFromSP.js';
import { Readable } from 'stream';

export const downloadFile = async ({
  file,
  oneTimeToken,
  endpoint,
  isEncrypted,
  key,
  callback,
  handlers,
  signal,
  carReader,
  uploadChunkSize,
  cidData,
  writeStreamMobile,
  headers,
  jwtOneTimeToken,
}: IDownloadFile) => {
  const startTime = Date.now();
  const chunks = [];
  const { entry_clientside_key } = file;

  let totalProgress = { number: 0 };
  let fileStream = null;

  if (file.is_on_storage_provider) {
    const size = Number((file.size / ONE_MB).toFixed(1));

    if (size < ALL_FILE_DOWNLOAD_MAX_SIZE) {
      const fileBlob = await downloadFileFromSP({
        carReader,
        url: `${file.storage_provider.url}/${file.root_cid}`,
        isEncrypted,
        uploadChunkSize,
        key,
        iv: entry_clientside_key?.iv,
        file,
        level: 'root',
        headers,
      });
      if (!isMobile()) {
        return fileBlob;
      } else {
        fileBlob && (await writeStreamMobile?.(fileBlob as Uint8Array));
      }
    }

    if (size >= ALL_FILE_DOWNLOAD_MAX_SIZE) {
      const cids = cidData.cids;
      const chunks = [];

      for (let i = 0; i < cids.length; i++) {
        const fileBlob = await downloadFileFromSP({
          carReader,
          url: `${file.storage_provider.url}/${cids[i]}`,
          isEncrypted,
          uploadChunkSize,
          key,
          iv: entry_clientside_key?.iv,
          file,
          level: cidData.level,
          headers,
        });

        if (isMobile()) {
          fileBlob && (await writeStreamMobile?.(fileBlob as Uint8Array));
        } else {
          if (fileBlob) {
            if (fileBlob instanceof Buffer) {
              chunks.push(fileBlob.buffer);
            }
            if (fileBlob instanceof Readable) {
              chunks.push(fileBlob);
            }
          }
        }
      }
      if (!isMobile()) {
        return joinChunks(chunks);
      }
    }
  } else {
    const fileSize = file.converted_size ?? file.size;
    const { count } = getCountChunk(fileSize, uploadChunkSize);

    if (!isBrowser() && !isMobile()) {
      // const { Readable } = require('stream');
      fileStream = new Readable({
        read() {},
      });
    }

    for (let index = 0; index < count; index++) {
      let chunk;
      const chunkIndex = isDataprepUrl(endpoint)
        ? index
        : correctIndex(index + 1, count.toString());

      const downloadedChunk = await downloadChunk({
        index: chunkIndex,
        oneTimeToken,
        signal,
        endpoint,
        file,
        startTime,
        totalProgress,
        callback,
        handlers,
        jwtOneTimeToken,
      });

      if (!isEncrypted) {
        chunk = downloadedChunk;
      } else {
        const bufferKey = convertBase64ToArrayBuffer(key);

        chunk = await decryptChunk({
          chunk: downloadedChunk,
          iv: entry_clientside_key?.iv,
          key: bufferKey,
        });
        if (chunk?.failed) {
          return { failed: true };
        }
        if (index === 0 && chunk) {
          handlers?.includes('onSuccess') &&
            callback?.({
              type: 'onSuccess',
              params: {},
            });
        }
      }
      if (fileStream) {
        fileStream.push(new Uint8Array(chunk));
      } else if (isMobile()) {
        await writeStreamMobile(chunk);
      } else {
        chunks.push(chunk);
      }
    }

    if (fileStream) {
      fileStream.push(null);
      return fileStream;
    } else if (isMobile()) {
      return { failed: false };
    } else {
      return joinChunks(chunks);
    }
  }
};
