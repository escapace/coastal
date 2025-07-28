import { normalizeAngle } from './normalize-angle'

/**
 * Adjusts two angles to minimize interpolation distance (shortest arc)
 *
 * Mathematically proven to produce minimal interpolation distance with |adjusted_b - adjusted_a| ≤ 180°.
 * Properly manages wrap-around at 0°/360° boundary and handles 180° ambiguity with positive
 * direction tie-breaking rule for deterministic behavior. Essential for consistent interpolation
 * in graphics, robotics, and navigation systems.
 *
 * @param a - First angle in degrees
 * @param b - Second angle in degrees
 * @returns Tuple of adjusted angles that minimize interpolation distance
 */
export const adjustAngle = (a: number, b: number): [number, number] => {
  let a1 = normalizeAngle(a)
  let a2 = normalizeAngle(b)

  const angleDiff = a2 - a1

  if (angleDiff > 180) {
    a1 += 360
  } else if (angleDiff <= -180) {
    // Tie-breaking rule: for exactly 180° differences, choose positive direction
    a2 += 360
  }

  return [a1, a2]
}
