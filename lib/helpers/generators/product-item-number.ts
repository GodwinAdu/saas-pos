export function generateProductItemNumber(category: string, sequence: number, year = new Date().getFullYear()) {
    // Category code (first 2 letters of category, uppercase)
    const categoryCode = category.slice(0, 2).toUpperCase();

    // Year code (last 2 digits of the year)
    const yearCode = year.toString().slice(-2);

    // Sequence number (5 digits, zero-padded)
    const sequenceCode = sequence.toString().padStart(5, '0');

    // Random character (A-Z) for additional uniqueness
    const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));

    // Combine all parts
    const itemNumber = `${categoryCode}${yearCode}${sequenceCode}${randomChar}`;

    return itemNumber;
}

// Function to generate a batch of item numbers
//   function generateBatchItemNumbers(category, startSequence, count, year) {
//     const batch = [];
//     for (let i = 0; i < count; i++) {
//       batch.push(generateProductItemNumber(category, startSequence + i, year));
//     }
//     return batch;
//   }

