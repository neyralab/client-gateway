import { downloadChunk, countChunks } from "../index";
import { hasWindow } from "../utils/hasWindow";
import { joinChunks } from "../utils/joinChunks";

export const downloadFile = async (
  currentFile: any,
  oneTimeToken: any,
  signal: AbortSignal,
  endpoint: string
) => {
  const { slug } = currentFile;

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

  const chunks = [];

  for (let index = 0; index < count; index++) {
    const simpleChunk = await downloadChunk(
      index,
      null,
      slug,
      oneTimeToken,
      signal,
      endpoint,
      false
    );

    chunks.push(simpleChunk);
  }

  if (hasWindow() && window.Blob) {
    const file = joinChunks(chunks);
    return file;
  } else {
    return chunks;
  }
};
