import { assert, describe, it } from 'vitest'
import { adjustAngle } from './adjust-angle'

describe('./src/adjust-angle.spec.ts', () => {
  it('adjusts angles for minimal interpolation distance', () => {
    assert.deepStrictEqual(adjustAngle(10, 20), [10, 20])
    assert.deepStrictEqual(adjustAngle(40, 380), [40, 20])
    assert.deepStrictEqual(adjustAngle(320, 80), [320, 440])
    assert.deepStrictEqual(adjustAngle(320, 440), [320, 440])
  })

  it('handles wrap-around cases', () => {
    assert.deepStrictEqual(adjustAngle(350, 10), [350, 370])
    assert.deepStrictEqual(adjustAngle(10, 350), [370, 350])
  })

  it('handles negative angles', () => {
    assert.deepStrictEqual(adjustAngle(-10, 10), [350, 370])
    assert.deepStrictEqual(adjustAngle(10, -10), [370, 350])
  })

  it('handles large angle differences', () => {
    assert.deepStrictEqual(adjustAngle(0, 180), [0, 180])
    assert.deepStrictEqual(adjustAngle(0, 270), [360, 270])
  })
})
