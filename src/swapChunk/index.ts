import axios from "axios";

import { ISwapChunk } from "../types";
import { CHUNK_SIZE } from "../config";

export const swapChunk = async ({
  file,
  endpoint,
  base64iv,
  clientsideKeySha3Hash,
  index,
  oneTimeToken,
  encryptedChunk,
  fileSize,
  startTime,
  totalProgress,
  callback,
  handlers,
}: ISwapChunk) => {
  const chunksLength = Math.ceil(file.size / CHUNK_SIZE);
  const url = `${endpoint}/chunked/swap/${file.slug}`;
  const inst = axios.create({
    headers: {
      "x-iv": base64iv,
      "x-clientsideKeySha3Hash": clientsideKeySha3Hash,
      "x-last": `${index}/${chunksLength}`,
      "Content-Type": "application/octet-stream",
      "one-time-token": oneTimeToken,
    },
    onUploadProgress: (event) => {
      if (event.loaded === encryptedChunk.byteLength) {
        const prevProgress = totalProgress.number || 0;
        const progress = +prevProgress + event.loaded;
        totalProgress.number = progress;
        const elapsedTime = Date.now() - startTime;
        const remainingBytes = fileSize - progress;
        const bytesPerMillisecond = progress / elapsedTime;
        const remainingTime = remainingBytes / bytesPerMillisecond;
        const timeLeft = Math.abs(Math.ceil(remainingTime / 1000));
        handlers.includes("onProgress") &&
          callback({
            type: "onProgress",
            params: { id: file.uploadId, progress, timeLeft },
          });
      }
    },
    cancelToken: file.source?.token,
  });
  return await inst.post(url, encryptedChunk);
};
