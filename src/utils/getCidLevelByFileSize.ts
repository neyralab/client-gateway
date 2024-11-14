import { ALL_FILE_DOWNLOAD_MAX_SIZE, ONE_MB } from '../config';
import { IFile } from '../process/types';
import { CidLevel } from '../types';

export const getCidLevelByFileSize = (file: IFile) => {
  const fileSize = file.converted_size ?? file.size;
  const size = Number((fileSize / ONE_MB).toFixed(1));

  if (size < ALL_FILE_DOWNLOAD_MAX_SIZE) {
    return CidLevel.Root;
  } else {
    return CidLevel.Interim;
  }
};
