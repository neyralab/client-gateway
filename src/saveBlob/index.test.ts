import { saveBlob } from "./index";

const mockURL = "https://example.com/mock-url";
const mockCreateObjectURL = jest.fn().mockReturnValue(mockURL);
const mockRevokeObjectURL = jest.fn();

global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

document.createElement = jest.fn().mockReturnValue({
  href: "",
  download: "",
  click: jest.fn(),
});

describe("saveBlob", () => {
  beforeEach(() => {
    mockCreateObjectURL.mockClear();
    mockRevokeObjectURL.mockClear();
    // @ts-ignore
    document.createElement.mockClear();
  });

  it("should create a URL and trigger the download link", () => {
    const mockBlob = new Blob(["Test data"], { type: "text/plain" });
    const mockName = "test-file.txt";
    const createElementSpy = jest.spyOn(document, "createElement");

    saveBlob({ name: mockName, blob: mockBlob });

    expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob);
    expect(createElementSpy).toHaveBeenCalledWith("a");
    expect(createElementSpy).toHaveBeenCalledTimes(1);

    const link = createElementSpy.mock.results[0].value;
    expect(link.href).toBe(mockURL);
    expect(link.download).toBe(mockName);

    const clickSpy = jest.spyOn(link, "click");
    expect(clickSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalledTimes(1);

    expect(mockRevokeObjectURL).toHaveBeenCalledWith(mockURL);
  });

  it("should throw an error if creating object URL fails", () => {
    const mockBlob = new Blob(["Test data"], { type: "text/plain" });
    const mockName = "test-file.txt";

    mockCreateObjectURL.mockImplementation(() => {
      throw new Error("Failed to create object URL");
    });

    try {
      saveBlob({ name: mockName, blob: mockBlob });
    } catch (error) {
      expect(error.message).toBe("Failed to create object URL");
    }

    expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob);

    expect(document.createElement).not.toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();
  });
});
