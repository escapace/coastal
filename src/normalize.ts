import { sum } from './sum'

/**
 * Normalizes an array of numbers so they sum to 1
 * @param values - Array of numbers to normalize
 * @returns Normalized array where all values sum to 1. Returns empty array for empty input.
 *   For arrays with zero sum, returns array containing Infinity or NaN values.
 */
export const normalize = (values: number[]): number[] => {
  const s = sum(values)

  return values.map((value) => value / s)
}
