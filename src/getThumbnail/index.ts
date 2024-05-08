import axios from 'axios';
// import * as fs from 'fs';

import { isMobile } from '../utils/isMobile.js';
import { convertTextToBase64 } from '../utils/convertTextToBase64.js';
import { ERRORS, MAX_TRIES, MAX_TRIES_502 } from '../config.js';
import { getFibonacciNumber } from '../utils/getFibonacciNumber.js';

import { IGetThumbnail } from '../types/index.js';

const MAX_WIDTH = 480;
const MAX_HEIGHT = 480;

export const getThumbnailImage = async ({
  path,
  file,
  quality,
  oneTimeToken,
  endpoint,
  slug,
  sharp,
  ffmpegCommand,
  blobUtil,
}: IGetThumbnail) => {
  return new Promise((resolve, reject) => {
    if (isMobile()) {
      getThumbnailMobile({
        path,
        file,
        quality,
        oneTimeToken,
        endpoint,
        slug,
        sharp,
        ffmpegCommand,
        blobUtil,
        type: 'image',
      })
        .then(resolve)
        .catch(reject);
    } else if (path) {
      sharp(path)
        .resize(MAX_WIDTH, MAX_HEIGHT)
        .webp({ quality: quality * 10 })
        .toBuffer((err, buffer) => {
          if (err) {
            reject(err);
          } else {
            const base64Image = `data:image/webp;base64,${buffer.toString('base64')}`;

            sendThumbnail({
              base64Image,
              oneTimeToken,
              endpoint,
              file,
              slug,
            })
              .then(() => {
                resolve(base64Image);
              })
              .catch((error) => {
                reject(error);
              });
          }
        });
    } else {
      const imageURL = URL.createObjectURL(file);
      const image = new Image();
      image.src = imageURL;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

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

        const base64Image = canvas.toDataURL('image/webp', +qualityReduction);
        URL.revokeObjectURL(imageURL);
        sendThumbnail({ base64Image, oneTimeToken, endpoint, file, slug })
          .then(() => {
            resolve(base64Image);
          })
          .catch((error) => {
            reject(error);
          });
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
  blobUtil,
}: IGetThumbnail) => {
  return new Promise((resolve, reject) => {
    if (isMobile()) {
      getThumbnailMobile({
        path,
        file,
        quality,
        oneTimeToken,
        endpoint,
        slug,
        sharp,
        ffmpegCommand,
        blobUtil,
        type: 'video',
      })
        .then(resolve)
        .catch(reject);
    // } else if (path && ffmpegCommand) {
    //   const currentPath = process.cwd();

    //   ffmpegCommand
    //     .screenshot({
    //       count: 1,
    //       folder: `${currentPath}/src/`,
    //       filename: 'video-thumbnail.jpeg',
    //       size: `${MAX_WIDTH}x${MAX_HEIGHT}`,
    //       timemarks: ['0.1'],
    //     })
    //     .on('end', async () => {
    //       const thumbnailPath = './src/video-thumbnail.jpeg';
    //       const base64Image = await getThumbnailImage({
    //         file,
    //         path: thumbnailPath,
    //         quality,
    //         oneTimeToken,
    //         endpoint,
    //         slug,
    //         sharp,
    //       });
    //       fs.unlink(thumbnailPath, (err) => {
    //         err && console.error('Error deleting file:', err);
    //       });
    //       sendThumbnail({
    //         base64Image,
    //         oneTimeToken,
    //         endpoint,
    //         file,
    //         slug,
    //       })
    //         .then(() => {
    //           resolve(base64Image);
    //         })
    //         .catch((error) => {
    //           reject(error);
    //         });
    //     })
    //     .on('error', (err: any) => {
    //       console.error('Error generating thumbnail:', err);
    //       reject(`Error generating thumbnail: ${err}`);
    //     });
    } else {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

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

          const base64Image = canvas.toDataURL('image/webp', +qualityReduction.toFixed(1));
          sendThumbnail({
            base64Image,
            oneTimeToken,
            endpoint,
            file,
            slug,
          })
            .then(() => {
              resolve(base64Image);
            })
            .catch((error) => {
              reject(error);
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

const getThumbnailMobile = async ({
  path,
  file,
  quality,
  oneTimeToken,
  endpoint,
  slug,
  ffmpegCommand,
  blobUtil,
  type,
}: IGetThumbnail & { type: 'image' | 'video' }) => {
  if (ffmpegCommand && blobUtil) {
    const cachedUrl = `${blobUtil.fs.dirs.CacheDir}/thumb_${slug}.jpg`;
    if (cachedUrl) {
      try {
        const command =
          type === 'image'
            ? `-i "${path}" -vf scale=${MAX_WIDTH}:${MAX_HEIGHT}:force_original_aspect_ratio=decrease -q:v ${
                100 - quality * 10
              } ${cachedUrl}`
            : `-i "${path}" -ss 00:00:01 -vframes 1 -qscale:v ${100 - quality * 10} ${cachedUrl}`;

        await ffmpegCommand.execute(command);

        const data = await blobUtil.fs.readFile(cachedUrl, 'base64');
        await sendThumbnail({
          base64Image: `data:image/webp;base64,${data}`,
          oneTimeToken,
          endpoint,
          file,
          slug,
        });
        return data;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Error in creating a cache URL');
    }
  } else {
    throw new Error('Error - ffmpegCommand and blobUtil are required');
  }
};

const sendThumbnail = async ({ base64Image, oneTimeToken, endpoint, file, slug }) => {
  const fileName = convertTextToBase64(file.name);
  const instance = axios.create({
    headers: {
      'x-file-name': fileName,
      'Content-Type': 'application/octet-stream',
      'one-time-token': oneTimeToken,
    },
  });
  let currentTry = 1;

  const uploadThumbnail: () => Promise<void> = async () => {
    await new Promise<void>((resolve) => {
      setTimeout(
        () => {
          resolve();
        },
        currentTry === 1 ? 0 : getFibonacciNumber(currentTry) * 1000
      );
    });

    try {
      await instance.post(`${endpoint}/chunked/thumb/${slug}`, base64Image);
    } catch (error: any) {
      const isNetworkError = error?.message?.includes('Network Error');
      const isOtherError = ERRORS.includes(error?.response?.status);

      if (currentTry >= (isOtherError ? MAX_TRIES_502 : MAX_TRIES) || (!isNetworkError && !isOtherError)) {
        currentTry = 1;
        throw error;
      } else {
        currentTry++;
        return uploadThumbnail();
      }
    }
  };
  if (base64Image) {
    return await uploadThumbnail();
  }
};
