import axios from "axios";

import { MAX_TRIES, MAX_TRIES_502 } from "../config";
import { getFibonacciNumber } from "../utils/getFibonacciNumber";
import { ICountChunks } from "../types";

export const countChunks = async ({
  endpoint,
  oneTimeToken,
  slug,
  signal,
}: ICountChunks) => {
  let currentTry = 1;
  const instance = axios.create({
    headers: {
      "one-time-token": oneTimeToken,
      "X-Slug": slug,
    },
    signal,
  });
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
      const response = await instance.get(endpoint + "/chunked/chunkCount");
      if (currentTry > 1) {
        currentTry = 1;
      }
      return response;
    } catch (error: any) {
      const isNetworkError =
        error?.message?.includes("Network Error") ||
        error?.message?.includes("Failed to fetch");
      const is502or504Error =
        error?.response?.status === 502 || error?.response?.status === 504;

      if (
        currentTry >= (is502or504Error ? MAX_TRIES_502 : MAX_TRIES) ||
        (!isNetworkError && !is502or504Error)
      ) {
        currentTry = 1;
        return { failed: true };
      } else {
        currentTry++;
        return getChunkCount();
      }
    }
  };

  return await getChunkCount();
};
