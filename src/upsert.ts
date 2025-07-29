/**
 * Updates an existing array element or inserts a new one based on a predicate match.
 * Mutates the original array.
 *
 * @typeParam T - The type of elements in the array
 * @param array - The array to modify
 * @param value - The value to insert or use as replacement
 * @param predicate - Function that returns true for the element to replace
 */
export const upsert = <T>(array: T[], value: T, predicate: (item: T) => boolean) => {
  const index = array.findLastIndex(predicate)

  if (index === -1) {
    array.push(value)
  } else {
    array[index] = value
  }
}
