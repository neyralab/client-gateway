import { isMobile } from './isMobile.js';
import { ISendChunk } from '../types/index.js';

export const createFormData = (
  chunk: ISendChunk['chunk'],
  fileType: string,
  fileName: string
): FormData => {
  const formData = new FormData();

  if (isMobile()) {
    if (typeof chunk === 'string') {
      formData.append('file', {
        uri: `data:${fileType};base64,${chunk}`,
        type: fileType,
        name: fileName,
      } as any);
    } else if (chunk instanceof ArrayBuffer) {
      const uint8Array = new Uint8Array(chunk);
      const binaryString = Array.from(uint8Array)
        .map((byte) => String.fromCharCode(byte))
        .join('');
      const base64Data = btoa(binaryString);

      formData.append('file', {
        uri: `data:${fileType};base64,${base64Data}`,
        type: fileType,
        name: fileName,
      } as any);
    }
  } else {
    const blob = new Blob([chunk], {
      type: fileType,
    });
    formData.append('file', blob, fileName);
  }
  return formData;
};
