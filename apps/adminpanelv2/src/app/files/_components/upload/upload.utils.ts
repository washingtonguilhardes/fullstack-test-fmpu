export const truncateName = (name: string) => {
  const parts = name.split('.');
  const filename = parts.slice(0, -1).join('.');
  const extension = parts.slice(-1)[0];
  return `${filename.slice(0, 10)}...${extension}`;
};
