/**
 * Finds the index of the last element in an array that satisfies the provided testing function.
 * Searches from the end of the array towards the beginning.
 * @param array - The array to search
 * @param predicate - Function to test each element
 * @returns The index of the last matching element, or -1 if no match is found
 */
export function findLastIndex<T>(
  array: T[],
  predicate: (value: T, index: number, object: T[]) => boolean,
): number {
  let l = array.length
  // eslint-disable-next-line typescript/strict-boolean-expressions
  while (l--) {
    if (predicate(array[l], l, array)) return l
  }
  return -1
}
