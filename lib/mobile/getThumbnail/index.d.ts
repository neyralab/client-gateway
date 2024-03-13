import { IGetThumbnail } from '../types/index.js';
export declare const getThumbnailImage: ({ path, file, quality, oneTimeToken, endpoint, slug, sharp, ffmpegCommand, blobUtil, }: IGetThumbnail) => Promise<unknown>;
export declare const getThumbnailVideo: ({ path, file, quality, oneTimeToken, endpoint, slug, ffmpegCommand, sharp, blobUtil, }: IGetThumbnail) => Promise<unknown>;
