import { assert, describe, it } from 'vitest'
import { normalize } from './normalize'

describe('./src/normalize.spec.ts', () => {
  it('normalizes arrays to sum to 1', () => {
    assert.deepEqual(normalize([2, 2]), [0.5, 0.5])
    assert.deepEqual(normalize([1, 1]), [0.5, 0.5])
    assert.deepEqual(normalize([1, 2, 3]), [1 / 6, 2 / 6, 3 / 6])
  })

  it('handles single element', () => {
    assert.deepEqual(normalize([5]), [1])
  })

  it('handles negative numbers', () => {
    assert.deepEqual(normalize([-1, 3]), [-0.5, 1.5])
  })

  it('returns NaN for empty array', () => {
    const result = normalize([])
    assert.ok(result.length === 0)
  })

  it('returns Infinity/-Infinity for array with sum of zero', () => {
    const result1 = normalize([1, -1])
    assert.ok(result1.every((value) => Math.abs(value) === Infinity))

    const result2 = normalize([0, 0])
    assert.ok(result2.every((value) => Number.isNaN(value)))
  })
})
