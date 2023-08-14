import { chunkFile } from "../chunkFile";
import { sendChunk } from "../sendChunk";

export const uploadFile = async (
  file: any,
  startTime: any,
  oneTimeToken: string,
  endpoint: string,
  dispatch: any,
  updateProgressCallback: (
    id: string,
    progress: string | number,
    timeLeft: number,
    dispatch: any
  ) => void,
  getProgressFromLSCallback: () => string | null,
  setProgressToLSCallback: (progress: string) => void,
  clearProgressCallback: () => void
) => {
  const arrayBuffer = await file.arrayBuffer();
  const chunks = chunkFile(arrayBuffer);

  let result;

  for (const chunk of chunks) {
    const currentIndex = chunks.findIndex((el) => el === chunk);
    result = await sendChunk(
      chunk,
      currentIndex,
      chunks.length - 1,
      file,
      startTime,
      oneTimeToken,
      endpoint,
      null,
      null,
      dispatch,
      updateProgressCallback,
      getProgressFromLSCallback,
      setProgressToLSCallback
    );
    if (result?.failed) {
      clearProgressCallback();
      return;
    }
  }
  clearProgressCallback();

  return result;
};
