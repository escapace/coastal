/* eslint-disable unicorn/consistent-function-scoping */
import { describe, it, expect } from 'vitest'
import { remove } from './remove'

describe('remove', () => {
  it('should remove elements that match the predicate', () => {
    const array = [1, 2, 3, 4, 5]
    const predicate = (value: number) => value % 2 === 0

    remove(array, predicate)

    expect(array).toEqual([1, 3, 5])
  })

  it('should remove all elements when all match the predicate', () => {
    const array = [2, 4, 6, 8]
    const predicate = (value: number) => value % 2 === 0

    remove(array, predicate)

    expect(array).toEqual([])
  })

  it('should keep all elements when none match the predicate', () => {
    const array = [1, 3, 5, 7]
    const predicate = (value: number) => value % 2 === 0

    remove(array, predicate)

    expect(array).toEqual([1, 3, 5, 7])
  })

  it('should handle empty array', () => {
    const array: number[] = []
    const predicate = (value: number) => value > 0

    remove(array, predicate)

    expect(array).toEqual([])
  })

  it('should work with string arrays', () => {
    const array = ['apple', 'banana', 'cherry', 'date']
    const predicate = (value: string) => value.length > 5

    remove(array, predicate)

    expect(array).toEqual(['apple', 'date'])
  })

  it('should work with object arrays', () => {
    const array = [
      { age: 25, name: 'Alice' },
      { age: 17, name: 'Bob' },
      { age: 30, name: 'Charlie' },
    ]
    const predicate = (person: { age: number; name: string }) => person.age >= 18

    remove(array, predicate)

    expect(array).toEqual([{ age: 17, name: 'Bob' }])
  })

  it('should mutate the original array', () => {
    const originalArray = [1, 2, 3, 4, 5]
    const array = originalArray
    const predicate = (value: number) => value > 3

    remove(array, predicate)

    expect(originalArray).toEqual([1, 2, 3])
    expect(array).toBe(originalArray)
  })

  it('should pass index and array to predicate', () => {
    const array = [10, 20, 30, 40, 50]
    const predicateArguments: Array<{ index: number; value: number }> = []

    const predicate = (value: number, index: number, array_: number[]) => {
      predicateArguments.push({ index, value })
      expect(array_).toBe(array) // Verify the array reference is passed
      return index === 1 || index === 3
    }

    remove(array, predicate)

    expect(array).toEqual([10, 30, 50])
    expect(predicateArguments).toHaveLength(5)
    expect(predicateArguments[0]).toEqual({ index: 4, value: 50 })
    expect(predicateArguments[1]).toEqual({ index: 3, value: 40 })
    expect(predicateArguments[2]).toEqual({ index: 2, value: 30 })
    expect(predicateArguments[3]).toEqual({ index: 1, value: 20 })
    expect(predicateArguments[4]).toEqual({ index: 0, value: 10 })
  })

  it('should remove elements based on index', () => {
    const array = ['a', 'b', 'c', 'd', 'e']
    const predicate = (_value: string, index: number) => index % 2 === 0

    remove(array, predicate)

    expect(array).toEqual(['b', 'd'])
  })
})
