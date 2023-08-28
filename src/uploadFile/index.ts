import { chunkFile } from "../chunkFile";
import { sendChunk } from "../sendChunk";

import { DispatchType, UpdateProgressCallback } from "../types";

export const uploadFile = async (
  file: File | any,
  oneTimeToken: string,
  endpoint: string,
  dispatch: DispatchType,
  updateProgressCallback: UpdateProgressCallback
) => {
  const arrayBuffer = await file.arrayBuffer();
  const chunks = chunkFile(arrayBuffer);
  const startTime = Date.now();
  let totalProgress = { number: 0 };
  let result;

  for (const chunk of chunks) {
    const currentIndex = chunks.findIndex((el) => el === chunk);
    result = await sendChunk(
      chunk,
      currentIndex,
      chunks.length - 1,
      file,
      startTime,
      oneTimeToken,
      endpoint,
      null,
      null,
      dispatch,
      totalProgress,
      updateProgressCallback
    );
    if (result?.failed) {
      totalProgress.number = 0;
      return;
    }
  }
  totalProgress.number = 0;

  return result;
};
