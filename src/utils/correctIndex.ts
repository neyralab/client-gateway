export const correctIndex = (index: number, total: string) => {
  return `${String(index).padStart(Number(total.length), '0')}`;
};
