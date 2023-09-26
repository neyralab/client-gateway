import { IGetThumbnail } from "../types";
export declare const getThumbnailImage: ({ path, file, quality, getOneTimeToken, slug, }: IGetThumbnail) => Promise<unknown>;
export declare const getThumbnailVideo: ({ path, file, quality, getOneTimeToken, slug, ffmpegCommand, }: IGetThumbnail) => Promise<unknown>;
