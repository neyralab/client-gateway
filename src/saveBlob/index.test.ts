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
});
