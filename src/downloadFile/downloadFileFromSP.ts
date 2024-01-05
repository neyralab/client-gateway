import { recursive as exporter } from 'ipfs-unixfs-exporter';

import { decryptChunk } from '../decryptChunk';

import { convertBase64ToArrayBuffer } from '../utils/convertBase64ToArrayBuffer';
import { joinChunks } from '../utils/joinChunks';
import { chunkFile } from '../utils/chunkFile';
import { IDownloadFileFromSP, ISaveFileFromGenerator } from '../types';

export async function downloadFileFromSP({
  carReader,
  url,
  isEncrypted,
  uploadChunkSize,
  key,
  iv,
  file,
  level,
}: IDownloadFileFromSP) {
  return fetch(url)
    .then(async (data) => await data.arrayBuffer())
    .then((blob) => {
      const uint8 = new Uint8Array(blob);
      const reader = carReader.fromBytes(uint8);
      return reader;
    })
    .then(async (reader) => {
      const roots = await reader.getRoots();

      const entries = exporter(roots[0], {
        async get(cid) {
          const block = await reader.get(cid);
          return block.bytes;
        },
      });
      let typesEntries = { count: {}, length: {} };
      let fileBlob: Blob;
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
    .catch(console.log);
}

async function saveFileFromGenerator({
  generator,
  type,
  isEncrypted,
  uploadChunkSize,
  key,
  iv,
  level,
}: ISaveFileFromGenerator) {
  let prev = [];

  for await (const chunk of generator) {
    prev = [...prev, chunk];
  }

  const blob = new Blob(prev, { type });

  if (!isEncrypted) {
    return blob;
  }

  if (isEncrypted && (level === 'root' || level === 'interim')) {
    const bufferKey = convertBase64ToArrayBuffer(key);
    const chunks = [];

    for await (const chunk of chunkFile({
      file: {
        size: (await blob.arrayBuffer()).byteLength,
        arrayBuffer: async () => blob.arrayBuffer(),
      },
      uploadChunkSize: uploadChunkSize + 16, // test if we need +16 bytes
    })) {
      const decryptedChunk = await decryptChunk({
        chunk,
        iv,
        key: bufferKey,
      });
      chunks.push(decryptedChunk);
    }

    return joinChunks(chunks);
  }

  if (isEncrypted && level === 'upload') {
    const bufferKey = convertBase64ToArrayBuffer(key);

    const decryptedChunk = await decryptChunk({
      chunk: await blob.arrayBuffer(),
      iv,
      key: bufferKey,
    });

    return joinChunks([decryptedChunk]);
  }
}
