import * as lib from 'ipfs-unixfs-exporter';

import { decryptChunk } from '../decryptChunk/index.js';

import { convertBase64ToArrayBuffer } from '../utils/convertBase64ToArrayBuffer.js';
import { joinChunks } from '../utils/joinChunks.js';
import { chunkFile } from '../utils/chunkFile.js';
import { IDownloadFileFromSP, ISaveFileFromGenerator } from '../types/index.js';

export async function downloadFileFromSP({
  carReader,
  url,
  isEncrypted,
  uploadChunkSize,
  key,
  iv,
  file,
  level,
  headers = {},
}: IDownloadFileFromSP) {
  return fetch(url, {
    headers: new Headers(headers),
  })
    .then(async (data) => await data.arrayBuffer())
    .then((blob) => {
      const uint8 = new Uint8Array(blob);
      return carReader.fromBytes(uint8);
    })
    .then(async (reader) => {
      const roots = await reader.getRoots();

      const entries = lib.recursive(roots[0], {
        async get(cid) {
          const block = await reader.get(cid);
          return block.bytes;
        },
      });
      let typesEntries = { count: {}, length: {} };
      let fileBlob: Uint8Array | null = null;
      for await (const entry of entries) {
        if (entry.type === 'file' || entry.type === 'raw') {
          const cont = entry.content();
          fileBlob = await saveFileFromGenerator({
            generator: cont,
            type: file.mime,
            isEncrypted,
            uploadChunkSize,
            key,
            iv,
            level,
          });
          typesEntries['count'][entry.type] =
            (typesEntries['count'][entry.type] || 0) + 1;
          typesEntries['length'][entry.type] =
            // @ts-ignore
            (typesEntries['length'][entry.type] || 0) + entry.length;
        } else if (entry.type === 'directory') {
          typesEntries['count'][entry.type] =
            (typesEntries['count'][entry.type] || 0) + 1;
        }
      }
      return fileBlob;
    })
    .catch((err) => {
      console.log({ dfsp: err.message, st: err.stack });
    });
}

async function saveFileFromGenerator({
  generator,
  type,
  isEncrypted,
  uploadChunkSize,
  key,
  iv,
  level,
}: ISaveFileFromGenerator): Promise<Uint8Array | null> {
  let concatenatedBuffer = new Uint8Array(0);

  for await (const buffer of generator) {
    const tmpArray = new Uint8Array(buffer);
    const newBuffer = new Uint8Array(
      concatenatedBuffer.length + tmpArray.length
    );
    newBuffer.set(concatenatedBuffer);
    newBuffer.set(tmpArray, concatenatedBuffer.length);
    concatenatedBuffer = newBuffer;
  }

  if (!isEncrypted) {
    return concatenatedBuffer;
  }

  const arr = concatenatedBuffer.buffer;
  const bufferKey = convertBase64ToArrayBuffer(key);

  if (isEncrypted && (level === 'root' || level === 'interim')) {
    const bufferKey = convertBase64ToArrayBuffer(key);
    const chunks = [];

    for await (const chunk of chunkFile({
      file: {
        size: arr.byteLength,
        arrayBuffer: async () => arr,
      },
      uploadChunkSize: uploadChunkSize + 16, // test if we need +16 bytes
    })) {
      const chunkArrayBuffer =
        typeof chunk === 'string' ? Buffer.from(chunk).buffer : chunk;
      const decryptedChunk = await decryptChunk({
        chunk: chunkArrayBuffer,
        iv,
        key: bufferKey,
      });
      chunks.push(decryptedChunk);
    }

    return joinChunks(chunks);
  }

  if (isEncrypted && level === 'upload') {
    const decryptedChunk = await decryptChunk({
      chunk: arr,
      iv,
      key: bufferKey,
    });

    return joinChunks([decryptedChunk]);
  }
}
