


export const generateSku = (productName: string, category: string, productId: number): string => {
  const namePart = productName.slice(0, 3).toUpperCase();
  const categoryPart = category.slice(0, 3).toUpperCase();
  const uniquePart = productId.toString().slice(-4);
  return `${namePart}-${categoryPart}-${uniquePart}`;
};

// Function to generate a product SKU
export function generateProductSKU(category:string, brand:string, itemNumber:number, variant = '') {
  // Uppercase and take first 3 letters of category and brand
  const catCode = category.toUpperCase().slice(0, 3);
  const brandCode = brand.toUpperCase().slice(0, 3);
  
  // Pad item number to 4 digits
  const itemCode = itemNumber.toString().padStart(4, '0');
  
  // Add variant if provided (e.g., color, size)
  const variantCode = variant ? `-${variant.toUpperCase()}` : '';
  
  // Combine all parts
  return `${catCode}-${brandCode}-${itemCode}${variantCode}`;
}

// Function to generate a product barcode (EAN-13 format)
export function generateProductBarcode() {
  // EAN-13 starts with a country code (2-3 digits)
  const countryCode = '750'; // Example: 750 for Mexico

  // Generate 9 random digits for the product code
  let productCode = '';
  for (let i = 0; i < 9; i++) {
    productCode += Math.floor(Math.random() * 10);
  }

  // Combine country code and product code
  let barcode = countryCode + productCode;

  // Calculate the check digit
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(barcode[i]) * (i % 2 === 0 ? 1 : 3);
  }
  const checkDigit = (10 - (sum % 10)) % 10;

  // Add the check digit to complete the barcode
  barcode += checkDigit;

  return barcode;
}
