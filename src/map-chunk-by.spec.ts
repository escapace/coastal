import { describe, it, expect } from 'vitest'
import { mapChunkBy } from './map-chunk-by'

describe('mapChunkBy', () => {
  it('should handle empty array', () => {
    const result = mapChunkBy(
      [],
      () => 1,
      (chunk) => chunk.length,
    )

    expect(result).toEqual([])
  })

  it('should handle single element array', () => {
    const result = mapChunkBy(
      [42],
      () => 1,
      (chunk, index) => ({ chunk, index }),
    )

    expect(result).toEqual([{ chunk: [42], index: 0 }])
  })

  it('should process array with fixed chunk size', () => {
    const numbers = [1, 2, 3, 4, 5, 6]

    const result = mapChunkBy(
      numbers,
      () => 2, // Always take 2 elements
      (chunk, index) => ({ index, sum: chunk.reduce((a, b) => a + b, 0) }),
    )

    expect(result).toEqual([
      { index: 0, sum: 3 }, // [1, 2]
      { index: 2, sum: 7 }, // [3, 4]
      { index: 4, sum: 11 }, // [5, 6]
    ])
  })

  it('should handle dynamic chunk sizes based on current value', () => {
    const words = ['hi', 'hello', 'a', 'world', 'test']

    const result = mapChunkBy(
      words,
      (currentWord) => (currentWord.length > 3 ? 2 : 1), // Long words take 2, short take 1
      (chunk, index) => ({ startIndex: index, text: chunk.join(' ') }),
    )

    expect(result).toEqual([
      { startIndex: 0, text: 'hi' },
      { startIndex: 1, text: 'hello a' }, // 'hello' is long, takes 2
      { startIndex: 3, text: 'world test' }, // 'world' is long, takes 2
    ])
  })

  it('should handle chunk size based on index position', () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8]

    const result = mapChunkBy(
      numbers,
      (_, index) => (index === 0 ? 3 : 2), // First chunk takes 3, others take 2
      (chunk) => chunk.reduce((a, b) => a + b, 0),
    )

    expect(result).toEqual([
      6, // [1, 2, 3]
      9, // [4, 5]
      13, // [6, 7]
      8, // [8]
    ])
  })

  it('should handle chunk size that exceeds remaining array length', () => {
    const numbers = [1, 2, 3]

    const result = mapChunkBy(
      numbers,
      () => 10, // Request more than available
      (chunk, index) => ({ chunk: [...chunk], index }),
    )

    expect(result).toEqual([
      { chunk: [1, 2, 3], index: 0 }, // Takes all remaining elements
    ])
  })

  it('should throw error for negative chunk size', () => {
    expect(() => {
      mapChunkBy(
        [1, 2, 3, 4],
        () => -5,
        (chunk) => chunk[0],
      )
    }).toThrowError('Invalid chunk size -5 at index 0. Chunk size must be a positive integer')
  })

  it('should throw error for zero chunk size', () => {
    expect(() => {
      mapChunkBy(
        [1, 2, 3],
        () => 0,
        (chunk) => chunk.length,
      )
    }).toThrowError('Invalid chunk size 0 at index 0. Chunk size must be a positive integer')
  })

  it('should process text with sentence-like chunking', () => {
    const words = ['Hello', 'world!', 'How', 'are', 'you?', 'Fine.']

    const result = mapChunkBy(
      words,
      (_, index) => {
        // Take words until punctuation or max 3 words
        let count = 1
        for (let index_ = index; index_ < Math.min(index + 3, words.length); index_++) {
          if (
            words[index_].includes('!') ||
            words[index_].includes('?') ||
            words[index_].includes('.')
          ) {
            return index_ - index + 1
          }
          if (index_ > index) count++
        }
        return count
      },
      (chunk) => chunk.join(' '),
    )

    expect(result).toEqual([
      'Hello world!', // Stops at punctuation
      'How are you?', // Stops at punctuation
      'Fine.', // Single word with punctuation
    ])
  })

  it('should pass correct start indices to transform', () => {
    const numbers = [1, 2, 3, 4, 5]
    const indices: number[] = []

    mapChunkBy(
      numbers,
      () => 2,
      (chunk, startIndex) => {
        indices.push(startIndex)
        return chunk.length
      },
    )

    expect(indices).toEqual([0, 2, 4])
  })

  it('should handle complex objects', () => {
    interface Item {
      category: string
      id: number
      value: number
    }

    const items: Item[] = [
      { category: 'A', id: 1, value: 10 },
      { category: 'A', id: 2, value: 20 },
      { category: 'B', id: 3, value: 30 },
      { category: 'B', id: 4, value: 40 },
      { category: 'C', id: 5, value: 50 },
    ]

    const result = mapChunkBy(
      items,
      (currentItem, index) => {
        // Group items of same category
        let count = 1
        for (let index_ = index + 1; index_ < items.length; index_++) {
          if (items[index_].category === currentItem.category) {
            count++
          } else {
            break
          }
        }
        return count
      },
      (chunk) => ({
        category: chunk[0].category,
        itemCount: chunk.length,
        totalValue: chunk.reduce((sum, item) => sum + item.value, 0),
      }),
    )

    expect(result).toEqual([
      { category: 'A', itemCount: 2, totalValue: 30 },
      { category: 'B', itemCount: 2, totalValue: 70 },
      { category: 'C', itemCount: 1, totalValue: 50 },
    ])
  })

  it('should handle transform function throwing errors', () => {
    expect(() => {
      mapChunkBy(
        [1, 2, 3],
        () => 2,
        () => {
          throw new Error('transform error')
        },
      )
    }).toThrowError('transform error')
  })

  it('should handle chunk size function throwing errors', () => {
    expect(() => {
      mapChunkBy(
        [1, 2, 3],
        () => {
          throw new Error('size error')
        },
        (chunk) => chunk,
      )
    }).toThrowError('size error')
  })

  it('should throw error for floating point chunk sizes', () => {
    expect(() => {
      mapChunkBy(
        [1, 2, 3, 4, 5],
        () => 2.7,
        (chunk) => chunk.length,
      )
    }).toThrowError('Invalid chunk size 2.7 at index 0. Chunk size must be a positive integer')
  })

  it('should throw error for NaN chunk size', () => {
    expect(() => {
      mapChunkBy(
        [1, 2, 3],
        () => NaN,
        (chunk) => chunk.length,
      )
    }).toThrowError('Invalid chunk size NaN at index 0. Chunk size must be a positive integer')
  })

  it('should throw error for Infinity chunk size', () => {
    expect(() => {
      mapChunkBy(
        [1, 2, 3],
        () => Infinity,
        (chunk) => chunk.length,
      )
    }).toThrowError('Invalid chunk size Infinity at index 0. Chunk size must be a positive integer')
  })

  it('should handle transform returning undefined', () => {
    const result = mapChunkBy(
      [1, 2],
      () => 1,
      () => undefined,
    )
    expect(result).toEqual([undefined, undefined])
  })

  it('should handle transform returning null', () => {
    const result = mapChunkBy(
      [1, 2],
      () => 1,
      () => null,
    )
    expect(result).toEqual([null, null])
  })

  it('should not modify the source array', () => {
    const source = [1, 2, 3, 4]
    const originalSource = [...source]

    mapChunkBy(
      source,
      () => 2,
      (chunk) => chunk.length,
    )

    expect(source).toEqual(originalSource)
  })
})
