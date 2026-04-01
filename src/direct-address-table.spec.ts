import { describe, it, expect } from 'vitest'
import { DirectAddressTable } from './direct-address-table'

describe('DirectAddressTable', () => {
  it('should store and retrieve values by numeric keys', () => {
    const keys = [0, 2, 5]
    const values = ['a', 'b', 'c']
    const map = new DirectAddressTable(keys, values)

    expect(map.get(0)).toBe('a')
    expect(map.get(2)).toBe('b')
    expect(map.get(5)).toBe('c')
  })

  it('should return undefined for non-existent keys', () => {
    const keys = [1, 3]
    const values = ['x', 'y']
    const map = new DirectAddressTable(keys, values)

    expect(map.get(0)).toBeUndefined()
    expect(map.get(2)).toBeUndefined()
    expect(map.get(4)).toBeUndefined()
  })

  it('should handle empty arrays', () => {
    expect(() => new DirectAddressTable([], [])).toThrow('Invalid array length')
  })

  it('should handle single key-value pair', () => {
    const map = new DirectAddressTable([10], ['value'])
    expect(map.get(10)).toBe('value')
    expect(map.get(9)).toBeUndefined()
  })

  it('should handle mismatched array lengths by processing all keys', () => {
    // When keys is longer, extra keys get undefined values
    const map1 = new DirectAddressTable([0, 1, 2], ['a', 'b'])
    expect(map1.get(0)).toBe('a')
    expect(map1.get(1)).toBe('b')
    expect(map1.get(2)).toBeUndefined()

    // When values is longer, extra values are ignored
    const map2 = new DirectAddressTable([0, 1], ['a', 'b', 'c'])
    expect(map2.get(0)).toBe('a')
    expect(map2.get(1)).toBe('b')
  })

  it('should throw error for negative keys', () => {
    expect(() => new DirectAddressTable([-1, 0], ['a', 'b'])).toThrow(
      'Invalid key: -1. Keys must be non-negative integers',
    )
    expect(() => new DirectAddressTable([0, -5, 2], ['a', 'b', 'c'])).toThrow(
      'Invalid key: -5. Keys must be non-negative integers',
    )
  })

  it('should throw error for non-integer keys', () => {
    expect(() => new DirectAddressTable([1.5], ['value'])).toThrow(
      'Invalid key: 1.5. Keys must be non-negative integers',
    )
    expect(() => new DirectAddressTable([0, 2.7], ['a', 'b'])).toThrow(
      'Invalid key: 2.7. Keys must be non-negative integers',
    )
  })

  it('should handle duplicate keys with last value winning', () => {
    const map = new DirectAddressTable([1, 2, 1, 2], ['first', 'second', 'third', 'fourth'])
    expect(map.get(1)).toBe('third')
    expect(map.get(2)).toBe('fourth')
  })

  it('should handle large keys by creating large sparse arrays', () => {
    const map = new DirectAddressTable([0, 1000], ['first', 'last'])
    expect(map.get(0)).toBe('first')
    expect(map.get(1000)).toBe('last')
    expect(map.get(500)).toBeUndefined() // sparse array behavior
  })
})
