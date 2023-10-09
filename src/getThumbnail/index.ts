import axios from "axios";
import * as fs from "fs";

import { convertTextToBase64 } from "../utils/convertTextToBase64";

import { IGetThumbnail } from "../types";

const MAX_WIDTH = 240;
const MAX_HEIGHT = 240;

export const getThumbnailImage = async ({
  path,
  file,
  quality,
  oneTimeToken,
  endpoint,
  slug,
  sharp,
}: IGetThumbnail) => {
  return new Promise((resolve, reject) => {
    if (path) {
      sharp(path)
        .resize(MAX_WIDTH, MAX_HEIGHT)
        .webp({ quality: quality * 10 })
        .toBuffer((err, buffer) => {
          if (err) {
            reject(err);
          } else {
            const base64Image = `data:image/webp;base64,${buffer.toString(
              "base64"
            )}`;

            sendThumbnail({
              base64Image,
              oneTimeToken,
              endpoint,
              file,
              slug,
            }).then(() => {
              resolve(base64Image);
            });
          }
        });
    } else {
      const imageURL = URL.createObjectURL(file);
      const image = new Image();
      image.src = imageURL;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      image.onload = () => {
        const aspectRatio = image.width / image.height;

        let newWidth = MAX_WIDTH;
        let newHeight = MAX_HEIGHT;

        if (image.width > image.height) {
          newHeight = MAX_WIDTH / aspectRatio;
        } else {
          newWidth = MAX_HEIGHT * aspectRatio;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;

        ctx?.drawImage(image, 0, 0, newWidth, newHeight);

        const qualityReduction = quality / 10;

        const base64Image = canvas.toDataURL("image/webp", +qualityReduction);
        URL.revokeObjectURL(imageURL);
        sendThumbnail({ base64Image, oneTimeToken, endpoint, file, slug }).then(
          () => {
            resolve(base64Image);
          }
        );
      };
      image.onerror = (error) => {
        reject(error);
      };
    }
  });
};

export const getThumbnailVideo = async ({
  path,
  file,
  quality,
  oneTimeToken,
  endpoint,
  slug,
  ffmpegCommand,
  sharp,
}: IGetThumbnail) => {
  return new Promise((resolve, reject) => {
    if (path && ffmpegCommand) {
      const currentPath = process.cwd();

      ffmpegCommand
        .screenshot({
          count: 1,
          folder: `${currentPath}/src/`,
          filename: "video-thumbnail.jpeg",
          size: `${MAX_WIDTH}x${MAX_HEIGHT}`,
          timemarks: ["0.1"],
        })
        .on("end", async () => {
          const thumbnailPath = "./src/video-thumbnail.jpeg";
          const base64Image = await getThumbnailImage({
            file,
            path: thumbnailPath,
            quality,
            oneTimeToken,
            endpoint,
            slug,
            sharp,
          });
          fs.unlink(thumbnailPath, (err) => {
            err && console.error("Error deleting file:", err);
          });
          sendThumbnail({
            base64Image,
            oneTimeToken,
            endpoint,
            file,
            slug,
          }).then(() => {
            resolve(base64Image);
          });
        })
        .on("error", (err: any) => {
          console.error("Error generating thumbnail:", err);
          reject(`Error generating thumbnail: ${err}`);
        });
    } else {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const aspectRatio = video.videoWidth / video.videoHeight;

        let newWidth = MAX_WIDTH;
        let newHeight = MAX_HEIGHT;

        if (video.videoWidth > video.videoHeight) {
          newHeight = MAX_WIDTH / aspectRatio;
        } else {
          newWidth = MAX_HEIGHT * aspectRatio;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;

        video.currentTime = 0.1;

        video.onseeked = () => {
          ctx?.drawImage(video, 0, 0, newWidth, newHeight);

          const qualityReduction = quality / 10;

          const base64Image = canvas.toDataURL(
            "image/webp",
            +qualityReduction.toFixed(1)
          );
          sendThumbnail({
            base64Image,
            oneTimeToken,
            endpoint,
            file,
            slug,
          }).then(() => {
            resolve(base64Image);
          });
        };

        video.onerror = (error) => {
          reject(error);
        };
      };

      video.onerror = (error) => {
        reject(error);
      };
    }
  });
};

const sendThumbnail = async ({
  base64Image,
  oneTimeToken,
  endpoint,
  file,
  slug,
}) => {
  const fileName = convertTextToBase64(file.name);
  const instance = axios.create({
    headers: {
      "x-file-name": fileName,
      "Content-Type": "application/octet-stream",
      "one-time-token": oneTimeToken,
    },
  });
  if (base64Image) {
    await instance.post(`${endpoint}/chunked/thumb/${slug}`, base64Image);
  }
};
