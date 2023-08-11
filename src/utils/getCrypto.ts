import { Crypto } from "@peculiar/webcrypto";

export const getCrypto = () => {
  if (typeof window === undefined) {
    return new Crypto();
  } else if (!window.crypto?.subtle) {
    return new Crypto();
  } else {
    return window.crypto;
  }
};
