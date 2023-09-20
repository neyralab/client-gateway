import { Crypto } from "@peculiar/webcrypto";
import { isBrowser } from "./isBrowser";

export const getCrypto = () => {
  if (!isBrowser()) {
    return new Crypto();
  } else if (!window.crypto?.subtle) {
    return new Crypto();
  } else {
    return window.crypto;
  }
};
