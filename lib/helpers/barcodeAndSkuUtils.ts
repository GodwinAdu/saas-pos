


export const generateSku = (productName: string, category: string, productId: number): string => {
  const namePart = productName.slice(0, 3).toUpperCase();
  const categoryPart = category.slice(0, 3).toUpperCase();
  const uniquePart = productId.toString().slice(-4);
  return `${namePart}-${categoryPart}-${uniquePart}`;
};

