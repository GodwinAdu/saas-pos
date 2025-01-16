
export function generateInvoiceNumber() {
  const currentYear = new Date().getFullYear();
  const sequentialNumber = Math.floor(10000 + Math.random() * 90000); // 5-digit number
  const randomString = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 character alphanumeric string

  return `INV-${currentYear}-${sequentialNumber}-${randomString}`;
}