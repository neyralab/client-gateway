import { MAX_TRIES } from "../config";
import { getFibonacciNumber } from "../utils/getFibonacciNumber";

export const countChunks = async (
  endpoint: string,
  oneTimeToken: string,
  slug: string,
  signal: AbortSignal
) => {
  let currentTry = 1;

  const getChunkCount: () => Promise<any> = async () => {
    await new Promise<void>((resolve) => {
      setTimeout(
        () => {
          resolve();
        },
        currentTry === 1 ? 0 : getFibonacciNumber(currentTry) * 1000
      );
    });

    try {
      const response = await fetch(endpoint + "/chunked/chunkCount", {
        method: "GET",
        headers: {
          "one-time-token": oneTimeToken,
          "X-Slug": slug,
        },
        signal: signal,
      });
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
        return getChunkCount();
      } else {
        currentTry = 1;
        return { failed: true };
      }
    }
  };

  return await getChunkCount();
};
