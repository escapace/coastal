/**
 * A direct address table data structure providing O(1) lookup time for non-negative integer keys.
 * Uses an array for storage where keys serve as indices, enabling constant-time access.
 * The table is immutable after construction and creates sparse arrays when keys have gaps.
 *
 * @typeParam T - The type of values stored in the table
 */
export class DirectAddressTable<T> {
  private readonly valueArrays: Array<T | undefined>

  /**
   * Creates a new direct address table from parallel arrays of keys and values.
   * Space complexity is O(max_key) where max_key is the largest key value.
   *
   * @param keys - Array of non-negative integer keys
   * @param values - Array of values corresponding to each key. Keys without corresponding
   *                 values are assigned undefined.
   *
   * @throws RangeError When keys array is empty
   * @throws Error When keys contain negative numbers or non-integer values
   *
   * @remarks
   * - Duplicate keys: Last value overwrites previous values for the same key
   * - Memory usage scales with the largest key value, not the number of stored values
   * - Invalid keys are rejected during construction
   */
  constructor(keys: number[], values: T[]) {
    const highestKey = Math.ceil(Math.max(...keys))
    this.valueArrays = new Array<T | undefined>(highestKey + 1).fill(undefined)

    for (let index = 0; index < keys.length; index++) {
      const key = keys[index]
      const value = values[index]

      if (!Number.isInteger(key) || key < 0) {
        throw new Error(`Invalid key: ${key}. Keys must be non-negative integers`)
      }

      this.valueArrays[key] = value
    }
  }

  /**
   * Retrieves the value associated with the specified key in O(1) time.
   *
   * @param key - The numeric key to look up
   * @returns The value associated with the key, or undefined if the key doesn't exist
   *          or was never assigned a value
   *
   * @remarks
   * - Returns undefined for keys outside the initialized range
   * - No runtime validation is performed on the key parameter
   */
  get(key: number): T | undefined {
    return this.valueArrays[key]
  }
}
