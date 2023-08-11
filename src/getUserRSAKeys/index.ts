export const getUserRSAKeys = async function (signer: any) {
  const msg =
    "Welcome to GhostDrive! \n\nPlease sign to start using this for encryption with Ghostdrive. \n" +
    "This will not trigger a blockchain transaction or cost any gas fees. \n\n" +
    "What's happening?\n" +
    "A public key will be registered with this address and \n" +
    "used only for data encryption.";

  const rnd = await signer.signMessage(msg);
  const prng = window.forge.random.createInstance();

  prng.seedFileSync = function (needed: number) {
    let outputString = "";
    while (outputString.length < needed) {
      outputString += rnd;
    }
    return outputString.slice(0, needed);
  };

  return window.forge.pki.rsa.generateKeyPair(2048, { prng });
};
