import { assert, describe, it } from 'vitest'
import { lerp } from './lerp'

describe('./src/lerp.spec.ts', () => {
  it('interpolates between two values', () => {
    assert.equal(lerp(0, 100, 0.5), 50)
    assert.equal(lerp(0, 100, 0), 0)
    assert.equal(lerp(0, 100, 1), 100)
  })

  it('handles extrapolation outside 0-1 range', () => {
    assert.equal(lerp(0, 100, 1.5), 150)
    assert.equal(lerp(0, 100, -0.5), -50)
  })

  it('handles negative values', () => {
    assert.equal(lerp(-10, 10, 0.5), 0)
    assert.equal(lerp(-5, -3, 0.5), -4)
  })

  it('handles decimal values', () => {
    assert.equal(lerp(0.1, 0.9, 0.5), 0.5)
  })
})
