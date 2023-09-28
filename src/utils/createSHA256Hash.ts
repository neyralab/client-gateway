import * as forge from "node-forge";

export const createSHA256Hash = (buffer: ArrayBuffer) => {
  const dataString = Buffer.from(buffer).toString();

  const md = forge.md.sha256.create();
  md.update(dataString);
  return md.digest().toHex();
};
