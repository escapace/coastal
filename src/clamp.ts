/**
 * Constrains a number to fall within specified bounds.
 *
 * Uses nested Math functions for optimal performance compared to conditional branches.
 *
 * @param value - The number to constrain
 * @param min - The lower bound (inclusive, must be ≤ max)
 * @param max - The upper bound (inclusive, must be ≥ min)
 * @returns The constrained number, or the appropriate bound if outside range
 * @throws Error when `min > max`
 */
export const clamp = (value: number, min: number, max: number): number => {
  if (min > max) {
    throw new Error('min must be less than or equal to max')
  }
  return Math.min(max, Math.max(min, value))
}
