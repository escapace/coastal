import { adjustAngle } from './adjust-angle'
import { lerp } from './lerp'
import { normalizeAngle } from './normalize-angle'

/**
 * Linear interpolation between two angles, taking the shortest path
 * @param a - Start angle in degrees
 * @param b - End angle in degrees
 * @param t - Interpolation factor (0 = a, 1 = b)
 * @returns Interpolated angle normalized to [0, 360) range
 */
export const lerpAngle = (a: number, b: number, t: number): number =>
  normalizeAngle(lerp(...adjustAngle(a, b), t))
