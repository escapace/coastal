/**
 * Removes elements from an array in-place where the predicate returns false.
 * @param array - Array to mutate by removing elements
 * @param predicate - Function that returns true to keep an element, false to remove it
 * @returns void - The array is modified in-place
 * @typeParam T - Type of elements in the array
 */
export const remove = <T>(array: T[], predicate: (value: T) => boolean) => {
  for (let index = array.length - 1; index >= 0; index -= 1) {
    if (!predicate(array[index])) array.splice(index, 1)
  }
}
