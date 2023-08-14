import { Crypto } from "@peculiar/webcrypto";
import { hasWindow } from "./hasWindow";

export const getCrypto = () => {
  if (!hasWindow()) {
    return new Crypto();
  } else if (!window.crypto?.subtle) {
    return new Crypto();
  } else {
    return window.crypto;
  }
};
