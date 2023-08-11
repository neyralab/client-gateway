export const publicKeyToPem = (publicKey: any) => {
  try {
    return window.forge.pki.publicKeyToPem(publicKey);
  } catch (error) {
    throw new Error(error);
  }
};
