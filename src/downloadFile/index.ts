import { downloadChunk, countChunks, decryptChunk } from "../index";

import { isBrowser } from "../utils/isBrowser";
import { joinChunks } from "../utils/joinChunks";

import { IDownloadFile } from "../types";
import { convertBase64ToArrayBuffer } from "../utils/convertBase64ToArrayBuffer";

const fileControllers = {};
const cancelledFiles = new Set();

export const downloadFile = async ({
  file,
  oneTimeToken,
  endpoint,
  isEncrypted,
  key,
  callback,
  handlers,
}: IDownloadFile) => {
  const startTime = Date.now();
  const controller = new AbortController();
  const chunks = [];
  let totalProgress = { number: 0 };
  let fileStream = null;

  const { entry_clientside_key, slug } = file;

  const sha3 = !isEncrypted
    ? null
    : entry_clientside_key?.clientsideKeySha3Hash ||
      entry_clientside_key?.sha3_hash;

  fileControllers[file.uploadId] = controller;

  if (cancelledFiles.has(file.uploadId)) {
    fileControllers[file.uploadId].abort();
    cancelledFiles.delete(file.uploadId);
  }

  const chunkCountResponse = await countChunks({
    endpoint,
    oneTimeToken,
    slug,
    controller,
  });

  if (chunkCountResponse.status !== 200) {
    throw new Error(`HTTP error! status:${chunkCountResponse.status}`);
  }

  const {
    data: { count },
  } = chunkCountResponse;

  if (!isBrowser()) {
    const { Readable } = require("stream");
    fileStream = new Readable({
      read() {},
    });
  }

  for (let index = 0; index < count; index++) {
    let chunk;
    const downloadedChunk = await downloadChunk({
      index,
      sha3_hash: sha3,
      oneTimeToken,
      controller,
      endpoint,
      file,
      startTime,
      totalProgress,
      callback,
      handlers,
    });

    if (!isEncrypted) {
      chunk = downloadedChunk;
    } else {
      const bufferKey = convertBase64ToArrayBuffer(key);

      chunk = await decryptChunk({
        chunk: downloadedChunk,
        iv: entry_clientside_key?.iv,
        key: bufferKey,
      });
      if (chunk?.failed) {
        return { failed: true };
      }
      if (index === 0 && chunk) {
        handlers?.includes("onSuccess") &&
          callback({
            type: "onSuccess",
            params: {},
          });
      }
    }
    if (fileStream) {
      fileStream.push(new Uint8Array(chunk));
    } else {
      chunks.push(chunk);
    }
  }

  if (fileStream) {
    fileStream.push(null);
    return fileStream;
  } else {
    const file = joinChunks(chunks);
    return file;
  }
};

export const cancelingDownload = (slug) => {
  if (fileControllers[slug]) {
    fileControllers[slug].abort();
  } else cancelledFiles.add(slug);
};
