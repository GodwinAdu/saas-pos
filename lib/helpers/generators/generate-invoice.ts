export function generateInvoiceNumber(prefix = 'INV') {
    // Get current date components
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // Last two digits of the year
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month (01-12)
    
    // Generate a random number
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    // Get the current timestamp
    const timestamp = now.getTime().toString().slice(-5);
    
    // Combine all parts
    const invoiceNumber = `${prefix}-${year}${month}-${randomNum}-${timestamp}`;
    
    return invoiceNumber;
  }
  
