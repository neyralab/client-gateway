import * as forge from "node-forge";

import { publicKeyToPem } from "./index";

describe("publicKeyToPem", () => {
  let publicKeyToPemMock;

  beforeEach(() => {
    publicKeyToPemMock = jest.spyOn(forge.pki, "publicKeyToPem");
  });

  afterEach(() => {
    publicKeyToPemMock.mockRestore();
  });

  it("should convert a public key to PEM", () => {
    const publicKey = "publicKey";

    publicKeyToPemMock.mockReturnValue("Mocked PEM");

    const result = publicKeyToPem({ publicKey });
    expect(result).toBe("Mocked PEM");

    expect(publicKeyToPemMock).toHaveBeenCalledWith(publicKey);
  });

  it("should throw an error when publicKeyToPem fails", () => {
    const publicKey = "publicKey";

    publicKeyToPemMock.mockImplementation(() => {
      throw new Error("Mocked Error");
    });

    expect(() => publicKeyToPem({ publicKey })).toThrow(Error);
  });
});
