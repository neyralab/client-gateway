import * as Base64 from "base64-js";
import {isBrowser} from "./isBrowser.js";
import {isMobile} from "./isMobile.js";
import * as util from "util";

let TextEncoder;

if (isBrowser() && typeof window.TextEncoder === "function") {
  TextEncoder = window.TextEncoder;
} else {
  TextEncoder = util.TextEncoder;
}

export const convertTextToBase64 = (text: string) => {
  if (isMobile()) {
    return Buffer.from(text).toString('base64');
  } else {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const binary = new Uint8Array(data.buffer);
    return Base64.fromByteArray(binary);
  }
};
