export const getUserRSAKeys = async function (
  provider = null,
  signMessageCallback: (
    setErrors: any,
    currentProvider: any,
    withNonce: boolean,
    msg: null | string
  ) => any
) {
  console.log("gd-library ---> getUserRSAKeys");
  if (!provider) return "Provider is required";
  const msg =
    "Welcome to GhostDrive! \n\nPlease sign to start using this for encryption with Ghostdrive. \n" +
    "This will not trigger a blockchain transaction or cost any gas fees. \n\n" +
    "What's happening?\n" +
    "A public key will be registered with this address and \n" +
    "used only for data encryption.";

  const rnd = (await signMessageCallback(false, provider, false, msg))
    .signature;
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
