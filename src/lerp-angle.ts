import { adjustAngle } from './adjust-angle'
import { lerp } from './lerp'
import { normalizeAngle } from './normalize-angle'

/**
 * Linear interpolation between two angles using shortest path
 *
 * Uses shortest path interpolation via adjustAngle to ensure optimal angular transitions.
 * Satisfies symmetry property: lerpAngle(a,b,t) = lerpAngle(b,a,1-t). Consistent 180°
 * tie-breaking ensures predictable results and handles all edge cases including
 * floating-point precision boundaries. Suitable for production use in graphics,
 * robotics, and navigation systems.
 *
 * @param a - Start angle in degrees
 * @param b - End angle in degrees
 * @param t - Interpolation factor (0 = a, 1 = b)
 * @returns Interpolated angle normalized to [0, 360) range
 */
export const lerpAngle = (a: number, b: number, t: number): number =>
  normalizeAngle(lerp(...adjustAngle(a, b), t))
