export const convertBlobToBase64 = (blob: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Data = reader.result;
      resolve(base64Data);
    };

    reader.onerror = reject;

    reader.readAsDataURL(blob);
  });
};
