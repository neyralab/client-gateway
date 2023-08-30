import { FILE_ACTION_TYPES, MAX_TRIES } from "../config";
import { IDownloadChunk } from "../types";
import { getFibonacciNumber } from "../utils/getFibonacciNumber";

export const downloadChunk = async ({
  index,
  sha3_hash,
  slug,
  oneTimeToken,
  signal,
  endpoint,
}: IDownloadChunk) => {
  let currentTry = 1;
  const download: () => Promise<any> = async () => {
    await new Promise<void>((resolve) => {
      setTimeout(
        () => {
          resolve();
        },
        currentTry === 1 ? 0 : getFibonacciNumber(currentTry) * 1000
      );
    });

    try {
      const response = await fetch(
        endpoint + `/chunked/downloadChunk/${slug}`,
        {
          method: "GET",
          headers: {
            "x-action": FILE_ACTION_TYPES.DOWNLOAD.toString(),
            "x-chunk-index": `${index}`,
            "x-clientsideKeySha3Hash": sha3_hash || "",
            "one-time-token": oneTimeToken,
          },
          signal: signal,
        }
      );
      if (currentTry > 1) {
        currentTry = 1;
      }
      return response;
    } catch (error: any) {
      if (
        error?.message?.includes("Network Error") ||
        error?.message?.includes("Failed to fetch")
      ) {
        if (currentTry >= MAX_TRIES) {
          currentTry = 1;
          return { failed: true };
        }
        currentTry++;
        return download();
      } else {
        currentTry = 1;
        return { failed: true };
      }
    }
  };

  const response = await download();

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
};
