import { publicKeyToPem } from "./index";

describe("publicKeyToPem function", () => {
  it("should convert public key to PEM format", () => {
    const mockPublicKeyToPem = jest.fn().mockReturnValue("mock-pem");
    //@ts-ignore
    window.forge = {
      pki: {
        publicKeyToPem: mockPublicKeyToPem,
      },
    };

    const publicKey = "test-public-key";
    const result = publicKeyToPem(publicKey);

    expect(result).toBe("mock-pem");
    expect(mockPublicKeyToPem).toHaveBeenCalledWith(publicKey);
  });
});
