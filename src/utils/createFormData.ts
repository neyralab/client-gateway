import { convertBase64ToUint8Array } from './convertBase64ToUint8Array.js';
import { isMobile } from './isMobile.js';

export const createFormData = (
  chunk: ArrayBuffer | string,
  fileType: string,
  fileName: string
): FormData => {
  const formData = new FormData();
  let data = chunk;

  if (isMobile()) {
    formData.append('file', {
      uri: `data:${fileType};base64,${chunk}`,
      type: fileType,
      name: fileName,
    } as any);

    return formData;
  }

  if (typeof chunk === 'string') {
    data = convertBase64ToUint8Array(chunk);
  }

  const blob = new Blob([data], {
    type: fileType,
  });

  formData.append('file', blob, fileName);
  return formData;
};
