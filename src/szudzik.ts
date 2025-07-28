/**
 * Szudzik pairing function - maps two non-negative integers to a unique non-negative integer
 * @param x - First integer (intended for non-negative integers)
 * @param y - Second integer (intended for non-negative integers)
 * @returns Unique integer representing the pair. For negative or non-integer inputs,
 *   produces deterministic results but not guaranteed to be unique or reversible.
 */
export const szudzik = (x: number, y: number): number => (x >= y ? x * x + x + y : y * y + x)
