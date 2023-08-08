const MAX_WIDTH = 240;
const MAX_HEIGHT = 240;

export const getReductionFactor = (size: number) => {
  const oneMB = 1000000;
  const fileMB = Math.ceil(size / oneMB);

  if (fileMB > 10) {
    return 0.1;
  }
  if (fileMB < 1) {
    return 0.9;
  }
  return 1 - fileMB * 0.1;
};

export const getThumbnailImage = (file: any) => {
  return new Promise((resolve, reject) => {
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

      const qualityReduction = getReductionFactor(file.size);

      const dataURL = canvas.toDataURL(
        'image/webp',
        +qualityReduction.toFixed(1)
      );
      URL.revokeObjectURL(imageURL);

      resolve(dataURL);
    };
    image.onerror = (error) => {
      reject(error);
    };
  });
};

export const getThumbnailVideo = (file: any) => {
  return new Promise((resolve, reject) => {
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

        const qualityReduction = getReductionFactor(file.size);

        const dataURL = canvas.toDataURL(
          'image/webp',
          +qualityReduction.toFixed(1)
        );
        resolve(dataURL);
      };

      video.onerror = (error) => {
        reject(error);
      };
    };

    video.onerror = (error) => {
      reject(error);
    };
  });
};
