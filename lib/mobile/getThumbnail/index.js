import { __awaiter } from "tslib";
import axios from 'axios';
import * as fs from 'fs';
import { isMobile } from '../utils/isMobile.js';
import { convertTextToBase64 } from '../utils/convertTextToBase64.js';
const MAX_WIDTH = 480;
const MAX_HEIGHT = 480;
export const getThumbnailImage = ({ path, file, quality, oneTimeToken, endpoint, slug, sharp, ffmpegCommand, blobUtil, }) => __awaiter(void 0, void 0, void 0, function* () {
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
        }
        else if (path) {
            sharp(path)
                .resize(MAX_WIDTH, MAX_HEIGHT)
                .webp({ quality: quality * 10 })
                .toBuffer((err, buffer) => {
                if (err) {
                    reject(err);
                }
                else {
                    const base64Image = `data:image/webp;base64,${buffer.toString('base64')}`;
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
        }
        else {
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
                }
                else {
                    newWidth = MAX_HEIGHT * aspectRatio;
                }
                canvas.width = newWidth;
                canvas.height = newHeight;
                ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(image, 0, 0, newWidth, newHeight);
                const qualityReduction = quality / 10;
                const base64Image = canvas.toDataURL('image/webp', +qualityReduction);
                URL.revokeObjectURL(imageURL);
                sendThumbnail({ base64Image, oneTimeToken, endpoint, file, slug }).then(() => {
                    resolve(base64Image);
                });
            };
            image.onerror = (error) => {
                reject(error);
            };
        }
    });
});
export const getThumbnailVideo = ({ path, file, quality, oneTimeToken, endpoint, slug, ffmpegCommand, sharp, blobUtil, }) => __awaiter(void 0, void 0, void 0, function* () {
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
        }
        else if (path && ffmpegCommand) {
            const currentPath = process.cwd();
            ffmpegCommand
                .screenshot({
                count: 1,
                folder: `${currentPath}/src/`,
                filename: 'video-thumbnail.jpeg',
                size: `${MAX_WIDTH}x${MAX_HEIGHT}`,
                timemarks: ['0.1'],
            })
                .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
                const thumbnailPath = './src/video-thumbnail.jpeg';
                const base64Image = yield getThumbnailImage({
                    file,
                    path: thumbnailPath,
                    quality,
                    oneTimeToken,
                    endpoint,
                    slug,
                    sharp,
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
                }).then(() => {
                    resolve(base64Image);
                });
            }))
                .on('error', (err) => {
                console.error('Error generating thumbnail:', err);
                reject(`Error generating thumbnail: ${err}`);
            });
        }
        else {
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
                }
                else {
                    newWidth = MAX_HEIGHT * aspectRatio;
                }
                canvas.width = newWidth;
                canvas.height = newHeight;
                video.currentTime = 0.1;
                video.onseeked = () => {
                    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(video, 0, 0, newWidth, newHeight);
                    const qualityReduction = quality / 10;
                    const base64Image = canvas.toDataURL('image/webp', +qualityReduction.toFixed(1));
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
});
const getThumbnailMobile = ({ path, file, quality, oneTimeToken, endpoint, slug, ffmpegCommand, blobUtil, type, }) => __awaiter(void 0, void 0, void 0, function* () {
    if (ffmpegCommand && blobUtil) {
        const cachedUrl = `${blobUtil.fs.dirs.CacheDir}/thumb_${slug}.jpg`;
        if (cachedUrl) {
            try {
                const command = type === 'image'
                    ? `-i "${path}" -vf scale=${MAX_WIDTH}:${MAX_HEIGHT}:force_original_aspect_ratio=decrease -q:v ${100 - quality * 10} ${cachedUrl}`
                    : `-i "${path}" -ss 00:00:01 -vframes 1 -qscale:v ${100 - quality * 10} ${cachedUrl}`;
                yield ffmpegCommand.execute(command);
                const data = yield blobUtil.fs.readFile(cachedUrl, 'base64');
                yield sendThumbnail({
                    base64Image: `data:image/webp;base64,${data}`,
                    oneTimeToken,
                    endpoint,
                    file,
                    slug,
                });
                return data;
            }
            catch (error) {
                throw error;
            }
        }
        else {
            throw new Error('Error in creating a cache URL');
        }
    }
    else {
        throw new Error('Error - ffmpegCommand and blobUtil are required');
    }
});
const sendThumbnail = ({ base64Image, oneTimeToken, endpoint, file, slug, }) => __awaiter(void 0, void 0, void 0, function* () {
    const fileName = convertTextToBase64(file.name);
    const instance = axios.create({
        headers: {
            'x-file-name': fileName,
            'Content-Type': 'application/octet-stream',
            'one-time-token': oneTimeToken,
        },
    });
    if (base64Image) {
        yield instance.post(`${endpoint}/chunked/thumb/${slug}`, base64Image);
    }
});
