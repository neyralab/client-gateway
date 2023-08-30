import * as forge from "node-forge";

export const getUserRSAKeys = async function ({ signer }: { signer: any }) {
  const msg =
    "Welcome to GhostDrive! \n\nPlease sign to start using this for encryption with Ghostdrive. \n" +
    "This will not trigger a blockchain transaction or cost any gas fees. \n\n" +
    "What's happening?\n" +
    "A public key will be registered with this address and \n" +
    "used only for data encryption.";

  const rnd = await signer.signMessage(msg);
  const prng = forge.random.createInstance();

  prng.seedFileSync = function (needed: number) {
    let outputString = "";
    while (outputString.length < needed) {
      outputString += rnd;
    }
    return outputString.slice(0, needed);
  };

  return forge.pki.rsa.generateKeyPair({ bits: 2048, prng });
};
