import { lerp } from './lerp'

/**
 * Linear interpolation between two arrays element-wise
 * @param a - First array
 * @param b - Second array
 * @param t - Interpolation factor (0 = first array, 1 = second array)
 * @returns New array with interpolated values. Length equals minimum of input array lengths.
 *   Returns empty array when either input array is empty.
 */
export const lerpArray = (a: number[], b: number[], t: number): number[] => {
  const length = Math.min(a.length, b.length)
  const out: number[] = new Array<number>(length)

  for (let index = 0; index < length; index++) out[index] = lerp(a[index], b[index], t)

  return out
}
