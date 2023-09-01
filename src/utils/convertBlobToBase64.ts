export const convertBlobToBase64 = (blob: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Data = reader.result;
      if (typeof base64Data === "string") {
        const dataURL = base64Data.replace(/^data:[^;]+/, "data:image/png");
        resolve(dataURL);
        resolve(base64Data);
      } else {
        reject(new Error("Failed to convert blob to base64"));
      }
    };

    reader.onerror = reject;

    reader.readAsDataURL(blob);
  });
};
