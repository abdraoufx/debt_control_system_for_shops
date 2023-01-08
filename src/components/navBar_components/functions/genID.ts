export const genID = (): string => {
  const dateStr = Date.now().toString(30);
  const random = Math.random().toString(30).substring(2, 8);

  return `${dateStr}-${random}`;
};
