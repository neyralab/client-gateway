import { chunkFile, chunkFileStream } from "../chunkFile";
import { sendChunk } from "../sendChunk";

import { IUploadFile } from "../types";

export const uploadFile = async ({
  file,
  oneTimeToken,
  endpoint,
  callback,
  handlers,
  needStream,
}: IUploadFile) => {
  const startTime = Date.now();
  let totalProgress = { number: 0 };
  let chunks: any[] | any;
  let result: any;

  if (needStream) {
    const stream = await file.stream();
    chunks = await chunkFileStream({ stream });
  } else {
    const arrayBuffer = await file.arrayBuffer();
    chunks = chunkFile({ arrayBuffer });
  }

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
