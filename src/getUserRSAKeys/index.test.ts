import { getUserRSAKeys } from "./index";

describe("getUserRSAKeys", () => {
  it("should generate RSA keys successfully", async () => {
    const mockSigner = {
      signMessage: jest.fn().mockResolvedValue("mockSignature"),
    };
    const mockPublicKeyToPem = jest.fn().mockReturnValue("mock-pem");
    //@ts-ignore
    global.window = Object.create(window);
    //@ts-ignore
    window.forge = {
      pki: {
        publicKeyToPem: mockPublicKeyToPem,
        rsa: {
          generateKeyPair: jest.fn(() => ({
            privateKey: "mockPrivateKey",
            publicKey: "mockPublicKey",
          })),
        },
      },
      random: {
        createInstance: jest.fn(() => ({
          seedFileSync: jest.fn((needed) => "mockSeed".repeat(needed)),
        })),
      },
    };
    const rsaKeys = await getUserRSAKeys(mockSigner);

    expect(mockSigner.signMessage).toHaveBeenCalled();
    expect(rsaKeys.privateKey).toBeDefined();
    expect(rsaKeys.publicKey).toBeDefined();
  });

  it("should handle signer error", async () => {
    const mockSigner = {
      signMessage: jest.fn().mockRejectedValue(new Error("Signer error")),
    };
    await expect(getUserRSAKeys(mockSigner)).rejects.toThrow("Signer error");
  });
});
