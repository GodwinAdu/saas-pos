import crypto from "crypto";

/**
 * Generates a unique username.
 * @param fullName - The full name of the user (e.g., "John Doe").
 * @returns A unique username string.
 */
export function generateUniqueUsername(fullName: string): string {
  // Normalize the name by removing extra spaces and converting to lowercase.
  const normalized = fullName.trim().toLowerCase();

  // Split the full name into parts.
  const nameParts = normalized.split(" ");
  const firstName = nameParts[0] || "user";
  const lastName = nameParts[1] || "";

  // Create a base username using the first and last name.
  const baseUsername = `${firstName}${lastName.charAt(0)}`;

  // Generate a unique suffix using a random value or timestamp.
  const uniqueSuffix = crypto.randomInt(1000, 9999); // Example: 4-digit random number.

  // Combine the base username with the unique suffix.
  return `${baseUsername}${uniqueSuffix}`;
}