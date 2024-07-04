import { IMusicInfo } from '../types/index.js';

export const getMusicInfo = async (
  file: File,
  musicMetadata: any
): Promise<IMusicInfo | null> => {
  try {
    const metadata = await musicMetadata.parseBlob(file);
    const common = metadata.common;
    const info: IMusicInfo = {
      title: common.title || null,
      album: common.album || null,
      artist: common.artist || null,
      year: common.year || null,
      duration: metadata.format.duration || 0,
      picture: null,
    };

    if (common.picture && common.picture.length > 0) {
      const coverArt = common.picture[0];
      const blob = new Blob([coverArt.data], { type: coverArt.format });
      try {
        const base64data = await getBase64FromBlob(blob);
        info.picture = base64data;
      } catch {}
    }
    return info;
  } catch {
    return null;
  }
};

const getBase64FromBlob = async (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
