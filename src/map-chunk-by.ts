/**
 * Maps over an array using dynamically-sized chunks, where each chunk size is determined
 * by examining the current element and its position. Similar to Array.map() but operates
 * on variable-length chunks of the array instead of individual elements.
 *
 * @typeParam T - The type of elements in the input array
 * @typeParam R - The type of elements in the returned array
 *
 * @param array - The input array to process
 * @param getChunkSize - Function that determines the size of the next chunk.
 *                       Receives the current element and its index, returns the number
 *                       of elements to include in this chunk. Must return a positive integer.
 * @param transform - Function that transforms each chunk and returns a result value.
 *                   Receives the chunk array and the starting index of the chunk.
 *
 * @returns Array of transformed results, where each element is the result of calling
 *          the transform function on a dynamically-sized chunk.
 * @throws Error when getChunkSize returns a value that is not a positive integer
 */
export function mapChunkBy<T, R>(
  array: T[],
  getChunkSize: (currentValue: T, index: number) => number,
  transform: (chunk: T[], startIndex: number) => R,
): R[] {
  const results: R[] = []
  let index = 0

  while (index < array.length) {
    const currentValue = array[index]
    const chunkSize = getChunkSize(currentValue, index)

    // Strict validation (consistent with chunk function)
    if (chunkSize <= 0 || !Number.isInteger(chunkSize)) {
      throw new Error(
        `Invalid chunk size ${chunkSize} at index ${index}. Chunk size must be a positive integer`,
      )
    }

    const remainingLength = array.length - index
    const actualChunkSize = Math.min(chunkSize, remainingLength)
    const chunk = array.slice(index, index + actualChunkSize)

    const result = transform(chunk, index)
    results.push(result)

    index += actualChunkSize
  }

  return results
}
