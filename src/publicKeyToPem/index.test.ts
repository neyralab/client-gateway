import { publicKeyToPem } from "./index";

const publicKey = "test-public-key";

describe("publicKeyToPem function", () => {
  it("should convert public key to PEM format", () => {
    const mockPublicKeyToPem = jest.fn().mockReturnValue("mock-pem");
    //@ts-ignore
    window.forge = {
      pki: {
        publicKeyToPem: mockPublicKeyToPem,
      },
    };

    const result = publicKeyToPem(publicKey);

    expect(result).toBe("mock-pem");
    expect(mockPublicKeyToPem).toHaveBeenCalledWith(publicKey);
  });

  it("should handle missing forge or publicKeyToPem", () => {
    // @ts-ignore
    const originalForge = window.forge;
    // @ts-ignore
    const originalPublicKeyToPem = window.forge?.pki?.publicKeyToPem;
    //@ts-ignore
    window.forge = undefined;

    try {
      publicKeyToPem(publicKey);
    } catch (error) {
      expect(error.message).toBe(
        "TypeError: Cannot read properties of undefined (reading 'pki')"
      );
    }
    //@ts-ignore
    window.forge = originalForge;
    //@ts-ignore
    window.forge.pki.publicKeyToPem = originalPublicKeyToPem;
  });
});
