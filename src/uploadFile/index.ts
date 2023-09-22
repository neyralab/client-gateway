import { sendChunk } from "../sendChunk";
import { chunkFile } from "../utils/chunkFile";

import { IUploadFile } from "../types";

const fileControllers = {};
const cancelledFiles = new Set();

export const uploadFile = async ({
  file,
  oneTimeToken,
  endpoint,
  callback,
  handlers,
}: IUploadFile) => {
  const startTime = Date.now();
  const controller = new AbortController();
  let totalProgress = { number: 0 };

  let result: any;

  let currentIndex = 1;
  fileControllers[file.uploadId] = controller;

  if (cancelledFiles.has(file.uploadId)) {
    fileControllers[file.uploadId].abort();
    cancelledFiles.delete(file.uploadId);
  }
  for await (const chunk of chunkFile({ file })) {
    result = await sendChunk({
      chunk,
      index: currentIndex,
      file,
      startTime,
      oneTimeToken,
      endpoint,
      totalProgress,
      callback,
      handlers,
      controller,
    });

    if (result?.failed) {
      delete fileControllers[file.uploadId];
      totalProgress.number = 0;
      return;
    }
    if (result?.data?.data?.slug) {
      delete fileControllers[file.uploadId];
      totalProgress.number = 0;
      return result;
    }
    currentIndex++;
  }
};

export const cancelingUpload = (uploadId) => {
  if (fileControllers[uploadId]) {
    fileControllers[uploadId].abort();
  } else cancelledFiles.add(uploadId);
};
