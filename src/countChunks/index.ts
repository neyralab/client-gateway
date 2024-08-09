import axios from "axios";

import { ERRORS, MAX_TRIES, MAX_TRIES_502 } from "../config.js";
import { getFibonacciNumber } from "../utils/getFibonacciNumber.js";
import { ICountChunks } from "../types/index.js";

export const countChunks = async ({
  endpoint,
  oneTimeToken,
  slug,
  signal,
  jwtOneTimeToken,
}: ICountChunks) => {
  let currentTry = 1;
  const instance = axios.create({
    headers: {
      "one-time-token": oneTimeToken,
      "X-Download-OTT-JWT": jwtOneTimeToken,
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
      const isOtherError = ERRORS.includes(error?.response?.status);

      if (
        currentTry >= (isOtherError ? MAX_TRIES_502 : MAX_TRIES) ||
        (!isNetworkError && !isOtherError)
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
