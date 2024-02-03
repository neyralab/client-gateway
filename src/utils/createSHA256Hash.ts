import * as forge from "node-forge";
// @ts-ignore
const nodeForge = forge.default !== undefined ? forge.default : forge;
export const createSHA256Hash = (buffer: ArrayBuffer) => {
  const dataString = Buffer.from(buffer).toString();

  const md = nodeForge.md.sha256.create();
  md.update(dataString);
  return md.digest().toHex();
};
