import { getUserRSAKeys } from "./index";

describe("getUserRSAKeys function", () => {
  it("should not generate RSA key pair without provider", async () => {
    const mockSignature = "mock-signature";
    const mockSignMessageCallback = jest
      .fn()
      .mockResolvedValue({ signature: mockSignature });
    // @ts-ignore
    window.forge = {
      random: {
        createInstance: jest.fn().mockReturnValue({
          seedFileSync: jest.fn(),
        }),
      },
      pki: {
        rsa: {
          generateKeyPair: jest.fn().mockReturnValue("mock-key-pair"),
        },
      },
    };

    const mockProvider = null;
    const result = await getUserRSAKeys(mockProvider, mockSignMessageCallback);

    expect(result).toBe("Provider is required");

    expect(mockSignMessageCallback).not.toHaveBeenCalled();
  });
});
