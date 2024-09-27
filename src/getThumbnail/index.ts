import axios from 'axios';
import * as fs from 'fs';

import { isIOS } from '../utils/isIOS.js';
import { isMobile } from '../utils/isMobile.js';
import { convertTextToBase64 } from '../utils/convertTextToBase64.js';
import { ERRORS, MAX_TRIES, MAX_TRIES_502 } from '../config.js';
import { getFibonacciNumber } from '../utils/getFibonacciNumber.js';
import isDataprepUrl from '../utils/isDataprepUrl.js';
import { createFormData } from '../utils/createFormData.js';

import { IGetThumbnail, IGetThumbnailDocument } from '../types/index.js';

const MAX_WIDTH = 480;
const MAX_HEIGHT = 480;

export const getThumbnailImage = async ({
  path,
  file,
  quality,
  oneTimeToken,
  jwtOneTimeToken,
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
        jwtOneTimeToken,
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
              jwtOneTimeToken,
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
        sendThumbnail({
          base64Image,
          oneTimeToken,
          endpoint,
          file,
          slug,
          jwtOneTimeToken,
        })
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
  jwtOneTimeToken,
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
        jwtOneTimeToken,
      })
        .then(resolve)
        .catch(reject);
    } else if (path && ffmpegCommand) {
      const currentPath = process.cwd();

      ffmpegCommand
        .screenshot({
          count: 1,
          folder: `${currentPath}/src/`,
          filename: 'video-thumbnail.jpeg',
          size: `${MAX_WIDTH}x${MAX_HEIGHT}`,
          timemarks: ['0.1'],
        })
        .on('end', async () => {
          const thumbnailPath = './src/video-thumbnail.jpeg';
          const base64Image = await getThumbnailImage({
            file,
            path: thumbnailPath,
            quality,
            oneTimeToken,
            endpoint,
            slug,
            sharp,
            jwtOneTimeToken,
          });
          fs.unlink(thumbnailPath, (err) => {
            err && console.error('Error deleting file:', err);
          });
          sendThumbnail({
            base64Image,
            oneTimeToken,
            endpoint,
            file,
            slug,
            jwtOneTimeToken,
          })
            .then(() => {
              resolve(base64Image);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .on('error', (err: any) => {
          console.error('Error generating thumbnail:', err);
          reject(`Error generating thumbnail: ${err}`);
        });
    } else {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);

      if (isIOS()) {
        video.load();
      }

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

        setTimeout(() => {
          video.currentTime = 0.1;
        }, 200);

        video.onseeked = () => {
          ctx?.drawImage(video, 0, 0, newWidth, newHeight);

          const qualityReduction = quality / 10;

          const base64Image = canvas.toDataURL(
            'image/webp',
            +qualityReduction.toFixed(1)
          );
          sendThumbnail({
            base64Image,
            oneTimeToken,
            endpoint,
            file,
            slug,
            jwtOneTimeToken,
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
  jwtOneTimeToken,
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
          base64Image: isDataprepUrl(endpoint)
            ? `data:image/webp;base64,${data}`
            : cachedUrl,
          oneTimeToken,
          endpoint,
          file,
          slug,
          jwtOneTimeToken,
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

const sendThumbnail = async ({
  base64Image,
  oneTimeToken,
  endpoint,
  file,
  slug,
  jwtOneTimeToken,
}) => {
  const fileName = convertTextToBase64(file.name);
  const isDataprep = isDataprepUrl(endpoint);
  let formData: FormData | null = null;

  if (!isDataprep) {
    if (isMobile()) {
      const fileNameFromUrl = base64Image.split('/').pop();
      const fileExtensionFromUrl = fileNameFromUrl.split('.').pop();
      formData = new FormData();
      formData.append('file', {
        uri: base64Image,
        type: 'image/' + fileExtensionFromUrl,
        name: fileNameFromUrl,
      } as any);
    } else {
      const base64Data = base64Image.split(',')[1];
      formData = createFormData(base64Data, 'image/webp', 'thumbnail.webp');
    }
  }

  const instance = axios.create({
    headers: {
      'x-file-name': fileName,
      'content-type': isDataprep
        ? 'application/octet-stream'
        : 'multipart/form-data',
      'one-time-token': oneTimeToken,
      'X-Upload-OTT-JWT': jwtOneTimeToken,
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
      await instance.post(
        `${endpoint}/chunked/thumb/${slug}`,
        isDataprep ? base64Image : formData
      );
    } catch (error: any) {
      const isNetworkError = error?.message?.includes('Network Error');
      const isOtherError = ERRORS.includes(error?.response?.status);

      if (
        currentTry >= (isOtherError ? MAX_TRIES_502 : MAX_TRIES) ||
        (!isNetworkError && !isOtherError)
      ) {
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

export const getThumbnailDocument = async ({
  file,
  quality,
  oneTimeToken,
  endpoint,
  slug,
  pdfjsLib,
  renderAsync,
  html2canvas,
  jwtOneTimeToken,
}: IGetThumbnailDocument) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const arrayBuffer = e.target.result as ArrayBuffer;
            const img = await getPreviewFromDocx({
              arrayBuffer,
              renderAsync,
              html2canvas,
            });

            await sendThumbnail({
              base64Image: img,
              oneTimeToken,
              endpoint,
              file,
              slug,
              jwtOneTimeToken,
            });
            resolve(img);
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (file.type === 'application/pdf') {
        const img = await getPreviewFromPdf({ file, pdfjsLib, quality });
        await sendThumbnail({
          base64Image: img,
          oneTimeToken,
          endpoint,
          file,
          slug,
          jwtOneTimeToken,
        });
        resolve(img);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const getPreviewFromPdf = async ({
  file,
  pdfjsLib,
  quality,
}: {
  file: File;
  pdfjsLib: any;
  quality: number;
}) => {
  try {
    const uri = URL.createObjectURL(file);
    const pdf = await pdfjsLib.getDocument({ url: uri }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      enableWebGL: false,
    };

    await page.render(renderContext).promise;
    const img = canvas.toDataURL('image/webp', quality / 10);

    return img;
  } catch (error) {
    throw error;
  }
};

const getPreviewFromDocx = async ({
  arrayBuffer,
  renderAsync,
  html2canvas,
}: {
  arrayBuffer: ArrayBuffer;
  renderAsync: any;
  html2canvas: (
    element: HTMLElement,
    options?: object
  ) => Promise<HTMLCanvasElement>;
}) => {
  const viewer = document.createElement('div');
  viewer.style.position = 'absolute';
  viewer.style.top = '-9999px';
  await renderAsync(arrayBuffer, viewer);
  document.body.appendChild(viewer);

  const wrapper = viewer.querySelector('.docx-wrapper') as HTMLElement;
  let targetElement = wrapper;
  if (wrapper) {
    wrapper.style.background = 'white';
    wrapper.style.padding = '0';
    const section = wrapper.querySelector('section');
    if (section) {
      section.style.padding = '96.4pt 56.7pt';
      section.style.marginBottom = '0';
      targetElement = section;
    }
  }

  const canvas = await html2canvas(targetElement, {
    backgroundColor: null,
    scale: 2,
  });
  let screenshotHeight = canvas.height;
  if (canvas.height > canvas.width * 1.3) {
    screenshotHeight = canvas.width * 1.3;
  }
  document.body.removeChild(viewer);
  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = canvas.width;
  croppedCanvas.height = screenshotHeight;
  const ctx = croppedCanvas.getContext('2d');

  ctx.drawImage(
    canvas,
    0,
    0,
    canvas.width,
    screenshotHeight,
    0,
    0,
    canvas.width,
    screenshotHeight
  );

  const img = croppedCanvas.toDataURL('image/webp', 0.1);

  return img;
};
