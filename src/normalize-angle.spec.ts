import { assert, describe, it } from 'vitest'
import { normalizeAngle } from './normalize-angle'

describe('./src/normalize-angle.spec.ts', () => {
  it('normalizes angles to 0-360 range', () => {
    assert.equal(normalizeAngle(360), 0)
    assert.equal(normalizeAngle(361), 1)
    assert.equal(normalizeAngle(-1), 359)
    assert.equal(normalizeAngle(0), 0)
    assert.equal(normalizeAngle(180), 180)
  })

  it('handles large positive angles', () => {
    assert.equal(normalizeAngle(720), 0)
    assert.equal(normalizeAngle(450), 90)
    assert.equal(normalizeAngle(1080), 0)
  })

  it('handles large negative angles', () => {
    assert.equal(normalizeAngle(-360), 0)
    assert.equal(normalizeAngle(-90), 270)
    assert.equal(normalizeAngle(-450), 270)
  })

  it('handles decimal angles', () => {
    assert.equal(normalizeAngle(360.5), 0.5)
    assert.equal(normalizeAngle(-0.5), 359.5)
  })
})
