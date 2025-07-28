import { normalizeAngle } from './normalize-angle'

/**
 * Adjusts two angles to minimize interpolation distance
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
  } else if (angleDiff < -180) {
    a2 += 360
  }

  return [a1, a2]
}
