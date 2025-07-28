/**
 * Calculates the sum of all numbers in an array
 * @param values - Array of numbers to sum
 * @returns Sum of all values in the array
 */
export const sum = (values: number[]): number => values.reduce((a, b) => a + b, 0)
