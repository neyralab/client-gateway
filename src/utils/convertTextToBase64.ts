import * as Base64 from "base64-js";
import { TextEncoder } from "util";

export const convertTextToBase64 = (text: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const binary = new Uint8Array(data.buffer);
  const base64 = Base64.fromByteArray(binary);
  return base64;
};
