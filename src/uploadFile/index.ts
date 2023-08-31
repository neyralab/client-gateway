import { chunkFile, chunkFileStream } from "../chunkFile";
import { sendChunk } from "../sendChunk";

import { IUploadFile } from "../types";
import { streamToBuffer } from "../utils/streamToBuffer";

export const uploadFile = async ({
  file,
  oneTimeToken,
  endpoint,
  callback,
  handlers,
  needStream,
  stream,
}: IUploadFile) => {
  const startTime = Date.now();
  let totalProgress = { number: 0 };
  let chunks: any[] | any;
  let result: any;

  if (needStream) {
    // need it in the future
    // const stream = await file.stream();
    // chunks = await chunkFileStream({ stream });
    const arrayBuffer: any = await streamToBuffer({ stream });
    chunks = chunkFile({ arrayBuffer });
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
