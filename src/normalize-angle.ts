/**
 * Normalizes an angle to the range [0, 360)
 * @param angle - Angle in degrees
 * @returns Normalized angle between 0 and 360 degrees
 */
export const normalizeAngle = (angle: number): number => ((angle % 360) + 360) % 360
