import axios from "axios";

import { MAX_TRIES } from "../config";
import { getFibonacciNumber } from "../utils/getFibonacciNumber";
import { ICountChunks } from "../types";

export const countChunks = async ({
  endpoint,
  oneTimeToken,
  slug,
  controller,
}: ICountChunks) => {
  let currentTry = 1;
  const instance = axios.create({
    headers: {
      "one-time-token": oneTimeToken,
      "X-Slug": slug,
    },
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
      const response = await instance.get(endpoint + "/chunked/chunkCount", {
        signal: controller.signal,
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
