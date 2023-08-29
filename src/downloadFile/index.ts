import { downloadChunk, countChunks, decryptChunk } from "../index";

import { hasWindow } from "../utils/hasWindow";
import { joinChunks } from "../utils/joinChunks";

import { DispatchType } from "../types";

export const downloadFile = async (
  currentFile: File | any,
  oneTimeToken: string,
  signal: AbortSignal,
  endpoint: string,
  encrypted: boolean,
  activationKey: string | null,
  dispatch: DispatchType | null,
  successfullyDecryptedCallback: ((dispatch: DispatchType) => void) | null
) => {
  const chunks = [];
  let fileStream = null;

  const { entry_clientside_key, slug } = currentFile;

  const sha3 = !encrypted
    ? null
    : entry_clientside_key?.clientsideKeySha3Hash ||
      entry_clientside_key?.sha3_hash;

  const chunkCountResponse = await countChunks(
    endpoint,
    oneTimeToken,
    slug,
    signal
  );

  if (!chunkCountResponse.ok) {
    throw new Error(`HTTP error! status:${chunkCountResponse.status}`);
  }

  const res = await chunkCountResponse.json();

  const { count } = res;

  if (!hasWindow()) {
    const { Readable } = require("stream");
    fileStream = new Readable({
      read() {},
    });
  }

  for (let index = 0; index < count; index++) {
    let chunk;
    const downloadedChunk = await downloadChunk(
      index,
      sha3,
      slug,
      oneTimeToken,
      signal,
      endpoint
    );

    if (!encrypted) {
      chunk = downloadedChunk;
    } else {
      chunk = await decryptChunk(
        downloadedChunk,
        entry_clientside_key?.iv,
        activationKey
      );
      if (chunk?.failed) {
        return { failed: true };
      }
      if (index === 0 && chunk) {
        successfullyDecryptedCallback(dispatch);
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
