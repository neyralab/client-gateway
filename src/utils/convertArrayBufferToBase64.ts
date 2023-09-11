import * as Base64 from 'base64-js';

export const convertArrayBufferToBase64 = (buffer: any) => {
  const bytes = new Uint8Array(buffer);
  const base64 = Base64.fromByteArray(bytes);
  return base64;
};
