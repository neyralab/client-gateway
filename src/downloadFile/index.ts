import { downloadChunk, countChunks } from "../index";
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
    const encryptedChunk = await downloadChunk(
      index,
      null,
      slug,
      oneTimeToken,
      signal,
      endpoint
    );

    chunks.push(encryptedChunk);
  }

  const file = joinChunks(chunks);

  return file;
};
