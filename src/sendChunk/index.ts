import axios from 'axios';
import * as Base64 from 'base64-js';

import { getFibonacciNumber } from '../utils/getFibonacciNumber.js';
import { convertTextToBase64 } from '../utils/convertTextToBase64.js';
import { isMobile } from '../utils/isMobile.js';
import { isBrowser } from '../utils/isBrowser.js';
import { createSHA256Hash } from '../utils/createSHA256Hash.js';
import { createFormData } from '../utils/createFormData.js';
import isDataprepUrl from '../utils/isDataprepUrl.js';

import { LocalFileReactNativeStream } from '../types/File/index.js';
import { ERRORS, MAX_TRIES, MAX_TRIES_502 } from '../config.js';

import { ISendChunk } from '../types/index.js';

export const sendChunk = async ({
  chunk,
  index,
  file,
  startTime,
  oneTimeToken,
  jwtOneTimeToken,
  gateway,
  iv,
  clientsideKeySha3Hash,
  totalProgress,
  callback,
  handlers,
  controller,
  totalSize,
  is_telegram,
  blobUtil,
}: ISendChunk) => {
  const base64iv = iv ? Base64.fromByteArray(iv) : null;
  const xHash = isMobile() ? 'null' : createSHA256Hash(chunk as ArrayBuffer);
  const fileName = convertTextToBase64(file.name);
  const fileSize =
    file instanceof LocalFileReactNativeStream
      ? file.convertedSize || file.size
      : file.size;
  const chunksLength = Math.ceil(fileSize / gateway.upload_chunk_size);
  let currentTry = 1;
  let cookieJar = [];
  const isDataprep = isDataprepUrl(gateway.url);
  let formData: FormData | null = null;
  const type = file?.type || 'application/octet-stream';

  const headers = {
    'content-type': isDataprep
      ? 'application/octet-stream'
      : 'multipart/form-data',
    'one-time-token': oneTimeToken,
    'X-Upload-OTT-JWT': jwtOneTimeToken,
    'x-file-name': fileName,
    'x-last': `${index}/${chunksLength}`,
    'X-folder': file.folderId || (isDataprep ? '' : 'null'),
    'x-mime': type,
    'X-Ai-Generated': false,
    'x-clientsideKeySha3Hash': clientsideKeySha3Hash
      ? clientsideKeySha3Hash
      : 'null',
    'x-hash': xHash,
    'x-size': file.size.toString(),
    'x-iv': iv ? base64iv : 'null',
  };

  if (!isDataprep && !blobUtil) {
    formData = createFormData(chunk, type, fileName);
  }

  const url = isDataprep
    ? `${gateway.url}/chunked/uploadChunk/${index}${is_telegram ? '?is_telegram=true' : ''}`
    : `${gateway.url}/upload/`;

  if (file instanceof LocalFileReactNativeStream) {
    headers['x-converted-size'] = file.convertedSize.toString();
    headers['x-converted-extension'] = file.convertedExtension;
    headers['x-converted-mime'] = file.convertedMime;
  }

  const uploadChunk: (chunk: ArrayBuffer | string) => Promise<any> = async (
    chunk: ArrayBuffer | string
  ) => {
    await new Promise<void>((resolve) => {
      setTimeout(
        () => {
          resolve();
        },
        currentTry === 1 ? 0 : getFibonacciNumber(currentTry) * 1000
      );
    });

    try {
      let response;
      if (isMobile() && !isDataprep && blobUtil) {
        response = await blobUtil.fetch(
          'POST',
          url,
          { ...headers, 'Transfer-Encoding': 'Chunked' },
          [
            {
              name: 'file',
              data: chunk,
              filename: file.name,
              type,
            },
          ]
        );
        if (response && response.info().status !== 200) {
          const error = new Error(`Upload failed: ${response.info().status}`);
          (error as any).response = { status: response.info().status };
          throw error;
        }
      } else {
        response = await axios.post(url, isDataprep ? chunk : formData, {
          headers,
          signal: controller.signal,
        });
      }
      if (currentTry > 1) {
        currentTry = 1;
      }
      const prevProgress = totalProgress.number || 0;
      const chunkLength =
        typeof chunk === 'string' ? (chunk.length * 3) / 4 : chunk.byteLength;
      const progress = +prevProgress + chunkLength;
      totalProgress.number = progress;
      const elapsedTime = Date.now() - startTime;
      const size = totalSize || file.size;
      const remainingBytes = size - progress;
      const bytesPerMillisecond = progress / elapsedTime;
      const remainingTime = remainingBytes / bytesPerMillisecond;
      const timeLeft = Math.abs(Math.ceil(remainingTime / 1000));
      handlers.includes('onProgress') &&
        callback({
          type: 'onProgress',
          params: { id: file.uploadId, progress, timeLeft },
        });

      return response;
    } catch (error: any) {
      const isNetworkError = error?.message?.includes('Network Error');
      const isOtherError = ERRORS.includes(error?.response?.status);

      if (
        currentTry >= (isOtherError ? MAX_TRIES_502 : MAX_TRIES) ||
        (!isNetworkError && !isOtherError)
      ) {
        currentTry = 1;
        return { failed: true, status: error?.response?.status };
      } else {
        currentTry++;
        return uploadChunk(chunk);
      }
    }
  };

  return await uploadChunk(chunk);
};
