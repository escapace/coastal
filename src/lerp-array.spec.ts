import { assert, describe, it } from 'vitest'
import { lerpArray } from './lerp-array'

describe('./src/lerp-array.spec.ts', () => {
  it('interpolates arrays element-wise', () => {
    assert.deepEqual(lerpArray([0, 0], [2, 4], 0.5), [1, 2])
    assert.deepEqual(lerpArray([1, 2], [3, 6], 0), [1, 2])
    assert.deepEqual(lerpArray([1, 2], [3, 6], 1), [3, 6])
  })

  it('handles different array lengths by using minimum', () => {
    assert.deepEqual(lerpArray([1, 2, 3], [4, 5], 0.5), [2.5, 3.5])
    assert.deepEqual(lerpArray([1, 2], [4, 5, 6], 0.5), [2.5, 3.5])
    assert.deepEqual(lerpArray([0, -1, 5], [1, 1], 0.5), [0.5, 0])
  })

  it('handles single element arrays', () => {
    assert.deepEqual(lerpArray([1], [3], 0.5), [2])
  })

  it('handles empty arrays', () => {
    const result1 = lerpArray([], [1, 2], 0.5)
    assert.deepEqual(result1, [])

    const result2 = lerpArray([1, 2], [], 0.5)
    assert.deepEqual(result2, [])
  })

  it('handles negative numbers', () => {
    assert.deepEqual(lerpArray([-1, -2], [1, 2], 0.5), [0, 0])
    assert.deepEqual(lerpArray([0, -1], [1, 1], 0.5), [0.5, 0])
  })
})
