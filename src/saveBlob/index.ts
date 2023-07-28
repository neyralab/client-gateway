export const saveBlob = ({ name, blob }: { name: string; blob: Blob }) => {
  console.log("gd-library ---> saveBlob");
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();

  URL.revokeObjectURL(url);
};
