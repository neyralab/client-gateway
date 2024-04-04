import axios from 'axios';

import {
  ERRORS,
  FILE_ACTION_TYPES,
  MAX_TRIES,
  MAX_TRIES_502,
} from '../config.js';
import { IDownloadChunk } from '../types/index.js';
import { getFibonacciNumber } from '../utils/getFibonacciNumber.js';

export const downloadChunk = async ({
  index,
  oneTimeToken,
  signal,
  endpoint,
  file,
  startTime,
  totalProgress,
  callback,
  handlers,
}: IDownloadChunk) => {
  let currentTry = 1;
  const instance = axios.create({
    headers: {
      'x-action': FILE_ACTION_TYPES.DOWNLOAD.toString(),
      'x-chunk-index': `${index}`,
      'one-time-token': oneTimeToken,
    },
    responseType: 'arraybuffer',
    signal,
  });

  const download: () => Promise<any> = async () => {
    await new Promise<void>((resolve) => {
      setTimeout(
        () => {
          resolve();
        },
        currentTry === 1 ? 0 : getFibonacciNumber(currentTry) * 1000
      );
    });

    try {
      const response = await instance.get(
        endpoint + `/chunked/downloadChunk/${file?.slug}`
      );

      if (currentTry > 1) {
        currentTry = 1;
      }
      return response;
    } catch (error: any) {
      const isNetworkError =
        error?.message?.includes('Network Error') ||
        error?.message?.includes('Failed to fetch');
      const isOtherError = ERRORS.includes(error?.response?.status);

      if (
        currentTry >= (isOtherError ? MAX_TRIES_502 : MAX_TRIES) ||
        (!isNetworkError && !isOtherError)
      ) {
        currentTry = 1;
        return { failed: true };
      } else {
        currentTry++;
        return download();
      }
    }
  };

  const response = await download();

  if (response.status !== 200) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const prevProgress = totalProgress.number || 0;
  const progress = +prevProgress + response.data.byteLength;
  totalProgress.number = progress;
  const elapsedTime = Date.now() - startTime;
  const remainingBytes = file.size - progress;
  const bytesPerMillisecond = progress / elapsedTime;
  const remainingTime = remainingBytes / bytesPerMillisecond;
  const timeLeft = Math.abs(Math.ceil(remainingTime / 1000));
  const downloadingPercent = Number((progress / file.size) * 100).toFixed();

  handlers?.includes('onProgress') &&
    callback({
      type: 'onProgress',
      params: {
        id: file.slug,
        progress,
        timeLeft,
        downloadingPercent,
      },
    });

  return response.data;
};
