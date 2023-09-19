import { CHUNK_SIZE } from "../config";

import { sendChunk } from "../sendChunk";

import { chunkBuffer } from "../utils/chunkBuffer";
import { chunkStream } from "../utils/chunkStream";
import { hasWindow } from "../utils/hasWindow";

import { IUploadFile } from "../types";

export const uploadFile = async ({
  file,
  oneTimeToken,
  endpoint,
  callback,
  handlers,
}: IUploadFile) => {
  const startTime = Date.now();
  let totalProgress = { number: 0 };

  let result: any;

  if (file?.isStream && !hasWindow()) {
    const stream = file.stream();
    const chunksLength = Math.floor(file.size / CHUNK_SIZE);
    const lastChunkSize =
      file.size > CHUNK_SIZE
        ? file.size - chunksLength * CHUNK_SIZE
        : file.size;

    let currentIndex = 0;

    for await (const chunk of chunkStream({ stream, lastChunkSize })) {
      result = await sendChunk({
        chunk,
        index: currentIndex,
        chunksLength,
        file,
        startTime,
        oneTimeToken,
        endpoint,
        totalProgress,
        callback,
        handlers,
      });
      if (result?.failed) {
        totalProgress.number = 0;
        return;
      }
      if (result?.data?.data?.slug) {
        totalProgress.number = 0;
        return result;
      }
      currentIndex++;
    }
  } else {
    const arrayBuffer = await file.arrayBuffer();
    const chunks = chunkBuffer({ arrayBuffer });

    for (const chunk of chunks) {
      const currentIndex = chunks.findIndex((el) => el === chunk);
      result = await sendChunk({
        chunk,
        index: currentIndex,
        chunksLength: chunks.length - 1,
        file,
        startTime,
        oneTimeToken,
        endpoint,
        totalProgress,
        callback,
        handlers,
      });
      if (result?.failed) {
        totalProgress.number = 0;
        return;
      }
    }
    totalProgress.number = 0;
    return result;
  }
};
