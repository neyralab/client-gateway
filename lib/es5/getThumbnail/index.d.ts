import { IGetThumbnail } from "../types";
export declare const getThumbnailImage: ({ path, file, quality, oneTimeToken, endpoint, slug, sharp, }: IGetThumbnail) => Promise<unknown>;
export declare const getThumbnailVideo: ({ path, file, quality, oneTimeToken, endpoint, slug, ffmpegCommand, sharp, }: IGetThumbnail) => Promise<unknown>;
