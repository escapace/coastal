/**
 * Mutates an array by removing all elements where the predicate returns true.
 * Elements are evaluated from right to left to maintain correct indices during removal.
 *
 * @param array - The array to modify in-place
 * @param predicate - Function invoked for each element. Return true to remove the element.
 * @typeParam T - The type of array elements
 */
export const remove = <T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean,
) => {
  for (let index = array.length - 1; index >= 0; index -= 1) {
    if (predicate(array[index], index, array)) array.splice(index, 1)
  }
}
