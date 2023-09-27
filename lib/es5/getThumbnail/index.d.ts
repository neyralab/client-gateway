import { IGetThumbnail } from "../types";
export declare const getThumbnailImage: ({ path, file, quality, getOneTimeToken, slug, sharp, }: IGetThumbnail) => Promise<unknown>;
export declare const getThumbnailVideo: ({ path, file, quality, getOneTimeToken, slug, ffmpegCommand, sharp, }: IGetThumbnail) => Promise<unknown>;
