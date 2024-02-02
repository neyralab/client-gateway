import { Crypto } from "@peculiar/webcrypto";
import { isBrowser } from "./isBrowser.js";

export const getCrypto = () => {
  if (!isBrowser()) {
    return new Crypto();
  } else if (!window.crypto?.subtle) {
    return new Crypto();
  } else {
    return window.crypto;
  }
};
