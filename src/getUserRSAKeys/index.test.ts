import * as forge from "node-forge";

import { getUserRSAKeys } from "./index";

describe("Test getUserRSAKeys", () => {
  it("should generate RSA key pair", async () => {
    const mockSigner = {
      signMessage: jest.fn().mockResolvedValue("mockedSignature"),
    };

    const rsaGenerateKeyPairMock = jest.spyOn(forge.pki.rsa, "generateKeyPair");
    const expectedKeyPair = {
      publicKey: "mockedPublicKey",
      privateKey: "mockedPrivateKey",
    };
    // @ts-ignore
    rsaGenerateKeyPairMock.mockReturnValue(expectedKeyPair);

    const keyPair = await getUserRSAKeys({ signer: mockSigner });

    expect(keyPair).toEqual(expectedKeyPair);
    expect(mockSigner.signMessage).toHaveBeenCalledWith(
      expect.stringContaining("Welcome to GhostDrive")
    );

    rsaGenerateKeyPairMock.mockRestore();
  });
  it("should handle signer error", async () => {
    const mockSigner = {
      signMessage: jest.fn().mockRejectedValue(new Error("Signer error")),
    };

    await expect(getUserRSAKeys({ signer: mockSigner })).rejects.toThrow(
      "Signer error"
    );
  });
});
