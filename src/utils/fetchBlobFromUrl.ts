export const fetchBlobFromUrl = (blobUrl: any) => {
  return fetch(blobUrl)
    .then((response) => response.blob())
    .catch((error) => {
      throw new Error(error);
    });
};
