import * as forge from "node-forge";

export const publicKeyToPem = ({ publicKey }: { publicKey: any }) => {
  try {
    return forge.pki.publicKeyToPem(publicKey);
  } catch (error) {
    throw new Error(error);
  }
};
