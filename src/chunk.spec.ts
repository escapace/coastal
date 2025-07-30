import { assert, describe, it, expect } from 'vitest'
import { chunk } from './chunk'

describe('chunk', () => {
  it('splits array into chunks of specified size', () => {
    assert.deepStrictEqual(chunk([1, 2, 3, 4, 5, 6], 3), [
      [1, 2, 3],
      [4, 5, 6],
    ])
    assert.deepStrictEqual(chunk([1, 2, 3, 4], 2), [
      [1, 2],
      [3, 4],
    ])
  })

  it('handles remainder elements in final chunk', () => {
    assert.deepStrictEqual(chunk([1, 2, 3, 4, 5], 3), [
      [1, 2, 3],
      [4, 5],
    ])
    assert.deepStrictEqual(chunk([1, 2, 3, 4, 5, 6, 7], 3), [[1, 2, 3], [4, 5, 6], [7]])
  })

  it('final chunk contains remaining elements when array cannot be split evenly', () => {
    // 10 elements, chunk size 3: should be [[1,2,3], [4,5,6], [7,8,9], [10]]
    assert.deepStrictEqual(chunk([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3), [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [10],
    ])

    // 7 elements, chunk size 4: should be [[1,2,3,4], [5,6,7]]
    assert.deepStrictEqual(chunk([1, 2, 3, 4, 5, 6, 7], 4), [
      [1, 2, 3, 4],
      [5, 6, 7],
    ])

    // 5 elements, chunk size 2: should be [[1,2], [3,4], [5]]
    assert.deepStrictEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]])
  })

  it('handles single element arrays', () => {
    assert.deepStrictEqual(chunk([1], 3), [[1]])
    assert.deepStrictEqual(chunk(['a'], 1), [['a']])
  })

  it('handles chunk size of 1', () => {
    assert.deepStrictEqual(chunk([1, 2, 3], 1), [[1], [2], [3]])
  })

  it('handles chunk size larger than array length', () => {
    assert.deepStrictEqual(chunk([1, 2], 5), [[1, 2]])
  })

  it('returns empty array for empty input', () => {
    assert.deepStrictEqual(chunk([], 3), [])
  })

  it('works with different data types', () => {
    assert.deepStrictEqual(chunk(['a', 'b', 'c', 'd'], 2), [
      ['a', 'b'],
      ['c', 'd'],
    ])
    assert.deepStrictEqual(chunk([true, false, true], 2), [[true, false], [true]])
  })

  it('throws error for zero chunk size', () => {
    expect(() => chunk([1, 2, 3], 0)).toThrow('Chunk size must be a positive integer')
  })

  it('throws error for negative chunk size', () => {
    expect(() => chunk([1, 2, 3], -1)).toThrow('Chunk size must be a positive integer')
    expect(() => chunk([1, 2, 3], -5)).toThrow('Chunk size must be a positive integer')
  })

  it('throws error for non-integer chunk size', () => {
    expect(() => chunk([1, 2, 3], 1.5)).toThrow('Chunk size must be a positive integer')
    expect(() => chunk([1, 2, 3], 2.7)).toThrow('Chunk size must be a positive integer')
  })

  it('throws error for Infinity chunk size', () => {
    expect(() => chunk([1, 2, 3], Infinity)).toThrow('Chunk size must be a positive integer')
  })

  it('throws error for NaN chunk size', () => {
    expect(() => chunk([1, 2, 3], NaN)).toThrow('Chunk size must be a positive integer')
  })
})
