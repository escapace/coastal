import { assert, describe, it } from 'vitest'
import { szudzik } from './szudzik'

describe('./src/szudzik.spec.ts', () => {
  it('computes pairing function correctly', () => {
    assert.equal(szudzik(0, 0), 0)
    assert.equal(szudzik(1, 0), 2)
    assert.equal(szudzik(0, 1), 1)
    assert.equal(szudzik(1, 1), 3)
    assert.equal(szudzik(2, 1), 7)
    assert.equal(szudzik(1, 2), 5)
  })

  it('handles larger numbers', () => {
    assert.equal(szudzik(5, 3), 33)
    assert.equal(szudzik(3, 5), 28)
  })

  it('handles edge cases with invalid inputs', () => {
    // Negative inputs - undefined behavior, tests current implementation
    assert.equal(szudzik(-1, 0), -1)
    assert.equal(szudzik(0, -1), -1)

    // Non-integer inputs - undefined behavior, tests current implementation
    assert.equal(szudzik(1.5, 0), 3.75)
    assert.approximately(szudzik(0, 2.7), 7.29, 0.000_001)
  })
})
