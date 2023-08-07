export const publicKeyToPem = (publicKey: any) => {
  return window.forge.pki.publicKeyToPem(publicKey);
};
