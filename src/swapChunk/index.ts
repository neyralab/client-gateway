import axios from "axios";

export const swapChunk = async (
  file: any,
  endpoint: string,
  base64iv: string,
  clientsideKeySha3Hash: string,
  currentIndex: number,
  chunksLength: number,
  oneTimeToken: string,
  encryptedChunk: ArrayBuffer,
  arrayBuffer: ArrayBuffer,
  startTime: any,
  dispatch: any,
  updateProgressCallback: (
    id: string,
    progress: string | number,
    timeLeft: number,
    dispatch: any
  ) => void,
  getProgressFromLSCallback: () => string | null,
  setProgressToLSCallback: (progress: string) => void
) => {
  console.log("gd-library ---> swapChunk");
  const url = `${endpoint}/chunked/swap/${file.slug}`;
  const inst = axios.create({
    headers: {
      "x-iv": base64iv,
      "x-clientsideKeySha3Hash": clientsideKeySha3Hash,
      "x-last": `${currentIndex}/${chunksLength}`,
      "Content-Type": "application/octet-stream",
      "one-time-token": oneTimeToken,
    },
    onUploadProgress: (event) => {
      if (event.loaded === encryptedChunk.byteLength) {
        const prevProgress = getProgressFromLSCallback() || 0;
        const progress = +prevProgress + event.loaded;
        setProgressToLSCallback(progress.toString());
        const elapsedTime = Date.now() - startTime;
        const remainingBytes = arrayBuffer.byteLength - progress;
        const bytesPerMillisecond = progress / elapsedTime;
        const remainingTime = remainingBytes / bytesPerMillisecond;
        const timeLeft = Math.abs(Math.ceil(remainingTime / 1000));
        updateProgressCallback(file.upload_id, progress, timeLeft, dispatch);
      }
    },
    cancelToken: file.source?.token,
  });
  return await inst.post(url, encryptedChunk);
};
