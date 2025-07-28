/**
 * Linear interpolation between two values
 * @param v0 - Start value
 * @param v1 - End value
 * @param t - Interpolation factor (0 = v0, 1 = v1)
 * @returns Interpolated value
 */
export const lerp = (v0: number, v1: number, t: number): number => v0 * (1 - t) + v1 * t
