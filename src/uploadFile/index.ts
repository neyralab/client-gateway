import { chunkFile } from "../chunkFile";
import { sendChunk } from "../sendChunk";

import { IUploadFile } from "../types";

export const uploadFile = async ({
  file,
  oneTimeToken,
  endpoint,
  callback,
  handlers,
}: IUploadFile) => {
  const arrayBuffer = await file.arrayBuffer();
  const chunks = chunkFile({ arrayBuffer });
  const startTime = Date.now();
  let totalProgress = { number: 0 };
  let result;

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
};
