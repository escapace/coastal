import { assert, describe, it } from 'vitest'
import { sum } from './sum'

describe('./src/sum.ts', () => {
  it('sums array values correctly', () => {
    assert.equal(sum([1, 2, 3]), 6)
    assert.equal(sum([2, 2]), 4)
    assert.equal(sum([1, 1]), 2)
  })

  it('handles empty array', () => {
    assert.equal(sum([]), 0)
  })

  it('handles single element', () => {
    assert.equal(sum([5]), 5)
  })

  it('handles negative numbers', () => {
    assert.equal(sum([-1, 2, -3]), -2)
  })

  it('handles decimal numbers', () => {
    assert.approximately(sum([0.1, 0.2, 0.3]), 0.6, 0.000_001)
  })
})
