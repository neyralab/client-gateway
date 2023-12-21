import { recursive as exporter } from 'ipfs-unixfs-exporter';

export async function loadFileFromSP({ carReader, type, url }) {
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
          fileBlob = await saveFileFromGenerator({ generator: cont, type });
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

async function saveFileFromGenerator({ generator, type }) {
  let prev = [];
  for await (const chunk of generator) {
    prev = [...prev, chunk];
  }
  const blob = new Blob(prev, { type });
  return blob;
}
