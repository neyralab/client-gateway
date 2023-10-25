import axios from "axios";

import { getThumbnailImage, getThumbnailVideo } from "./index";

const fs = require("fs");

jest.mock("axios");
jest.mock("fs");

const quality = 3;
const oneTimeToken = "mockOneTimeToken";
const endpoint = "https://example.com/api";
const slug = "mockSlug";

describe("Test getThumbnailImage", () => {
  beforeEach(() => {
    // @ts-ignore
    global.URL.createObjectURL = undefined;
    // @ts-ignore
    global.URL.revokeObjectURL = undefined;
  });
  it("should return a base64 encoded thumbnail image for a file path", async () => {
    const path = "/path/to/image.jpg";

    const file = { name: "fileName" };
    const sharp = jest.fn((path) => {
      return {
        resize: jest.fn(() => {
          return {
            webp: jest.fn(() => {
              return {
                toBuffer: jest.fn((callback) => {
                  callback(null, Buffer.from("mocked-base64-image"));
                }),
              };
            }),
          };
        }),
      };
    });
    // @ts-ignore
    axios.create.mockImplementation(() => ({
      post: jest.fn(() => Promise.resolve()),
    }));

    const base64Image = await getThumbnailImage({
      path,
      file,
      quality,
      oneTimeToken,
      endpoint,
      slug,
      sharp,
    });

    expect(base64Image).toContain("data:image/webp;base64,");
  });

  it("should return a base64 encoded thumbnail image for a file object", async () => {
    global.URL.createObjectURL = jest.fn(
      () => "blob:http://example.com/mock/image/png"
    );
    global.URL.revokeObjectURL = jest.fn();
    const file = new File(["binary data"], "image.jpg");

    global.HTMLCanvasElement.prototype.toDataURL = jest.fn(
      () => "data:image/webp;base64,"
    );
    // @ts-ignore
    global.HTMLCanvasElement.prototype.getContext = () => {
      return {
        drawImage: jest.fn(),
      };
    };
    //@ts-ignore
    global.Image = class {
      constructor() {
        setTimeout(() => {
          //@ts-ignore
          this.onload();
        }, 100);
      }
    };

    const base64Image = await getThumbnailImage({
      file,
      quality,
      oneTimeToken,
      endpoint,
      slug,
    });

    expect(base64Image).toContain("data:image/webp;base64,");
  });

  it("should reject if the file path is invalid", async () => {
    const path = "/invalid/path/to/image.jpg";

    await expect(
      getThumbnailImage({ path, quality, oneTimeToken, endpoint, slug })
    ).rejects.toThrow();
  });

  it("should reject if the file object is invalid", async () => {
    const file = new File([new ArrayBuffer(16)], "image.jpg");

    await expect(
      getThumbnailImage({ file, quality, oneTimeToken, endpoint, slug })
    ).rejects.toThrow();
  });

  it("should reject if the sendThumbnail function fails ('path' without 'sharp')", async () => {
    const path = "/path/to/image.jpg";

    //@ts-ignore
    axios.post.mockRejectedValue(new Error("Error"));

    await expect(
      getThumbnailImage({ path, quality, oneTimeToken, endpoint, slug })
    ).rejects.toThrow("sharp is not a function");
  });
});

describe("Test getThumbnailVideo", () => {
  beforeEach(() => {
    // @ts-ignore
    global.URL.createObjectURL = undefined;
  });

  it("should return a base64 encoded thumbnail image for a video path", async () => {
    const file = new File(["binary data"], "video.pm4");
    const path = "/path/to/video.mp4";

    const unlinkMock = jest.fn((path, callback) => {
      callback(null);
    });

    fs.unlink.mockImplementation(unlinkMock);

    const screenshotMock = jest.fn().mockReturnThis();
    const endMock = jest.fn().mockImplementationOnce((event, callback) => {
      if (event === "end") {
        callback();
        return { on: jest.fn() };
      }
    });
    const ffmpegCommandMock = {
      screenshot: jest.fn(),
      on: jest.fn(),
    };
    ffmpegCommandMock.screenshot.mockReturnValue({
      screenshot: screenshotMock,
      on: endMock,
    });

    const sharp = jest.fn((path) => {
      return {
        resize: jest.fn(() => {
          return {
            webp: jest.fn(() => {
              return {
                toBuffer: jest.fn((callback) => {
                  callback(null, Buffer.from("mocked-base64-image"));
                }),
              };
            }),
          };
        }),
      };
    });
    // @ts-ignore
    axios.create.mockImplementation(() => ({
      post: jest.fn(() => Promise.resolve()),
    }));

    const base64Image = await getThumbnailVideo({
      file,
      path,
      quality,
      oneTimeToken,
      endpoint,
      slug,
      ffmpegCommand: ffmpegCommandMock,
      sharp,
    });

    expect(base64Image).toContain("data:image/webp;base64,");
  });

  it("should reject if the video ffmpegCommand & sharp is undefined", async () => {
    const path = "/invalid/path/to/video.mp4";

    await expect(
      getThumbnailVideo({ path, quality, oneTimeToken, endpoint, slug })
    ).rejects.toThrow();
  });

  it("should reject if the video file object is invalid", async () => {
    const file = {};

    await expect(
      getThumbnailVideo({ file, quality, oneTimeToken, endpoint, slug })
    ).rejects.toThrow();
  });
});
