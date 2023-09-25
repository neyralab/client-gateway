import * as fs from "fs";

const MAX_WIDTH = 240;
const MAX_HEIGHT = 240;

export const getThumbnailImage = ({
  path,
  file,
  quality,
}: {
  path?: string;
  file?: File | any;
  quality: number;
}) => {
  return new Promise((resolve, reject) => {
    if (path && !file) {
      const sharp = require("sharp");
      const inputStream = fs.createReadStream(path);

      inputStream
        .pipe(
          sharp()
            .resize(MAX_WIDTH, MAX_HEIGHT)
            .jpeg({ quality: quality * 10 })
        )
        .toBuffer((err, buffer) => {
          if (err) {
            reject(err);
          } else {
            const base64Thumbnail = `data:image/webp;base64,${buffer.toString(
              "base64"
            )}`;
            resolve(base64Thumbnail);
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

        const dataURL = canvas.toDataURL("image/jpeg", +qualityReduction);
        URL.revokeObjectURL(imageURL);

        resolve(dataURL);
      };
      image.onerror = (error) => {
        reject(error);
      };
    }
  });
};
