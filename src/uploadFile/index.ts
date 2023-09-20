import { CHUNK_SIZE } from "../config";

import { sendChunk } from "../sendChunk";
import { chunkFile } from "../utils/chunkFile";

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

  const chunksLength = Math.floor(file.size / CHUNK_SIZE);

  let currentIndex = 0;

  for await (const chunk of chunkFile({ file })) {
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
};
