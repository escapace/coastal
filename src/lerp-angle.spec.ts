import { assert, describe, it } from 'vitest'
import { lerpAngle } from './lerp-angle'

describe('./src/lerp-angle.spec.ts', () => {
  describe('basic interpolation', () => {
    it('interpolates between two angles in the same quadrant', () => {
      assert.deepStrictEqual(lerpAngle(10, 20, 0.5), 15)
      assert.deepStrictEqual(lerpAngle(90, 120, 0.5), 105)
      assert.deepStrictEqual(lerpAngle(200, 250, 0.5), 225)
    })

    it('takes the shortest path between angles', () => {
      assert.deepStrictEqual(lerpAngle(350, 10, 0.5), 0)
      assert.deepStrictEqual(lerpAngle(10, 350, 0.5), 0)
      assert.deepStrictEqual(lerpAngle(320, 80, 0.5), 20)
      assert.deepStrictEqual(lerpAngle(80, 320, 0.5), 20)
    })
  })

  describe('t parameter behavior', () => {
    it('returns first angle when t=0', () => {
      assert.deepStrictEqual(lerpAngle(45, 135, 0), 45)
      assert.deepStrictEqual(lerpAngle(350, 10, 0), 350)
      assert.deepStrictEqual(lerpAngle(440, 320, 0), 80) // 440 normalized to 80
    })

    it('returns second angle when t=1', () => {
      assert.deepStrictEqual(lerpAngle(45, 135, 1), 135)
      assert.deepStrictEqual(lerpAngle(350, 10, 1), 10)
      assert.deepStrictEqual(lerpAngle(320, 80, 1), 80)
      assert.deepStrictEqual(lerpAngle(440, 320, 1), 320)
    })

    it('handles t values outside 0-1 range', () => {
      assert.deepStrictEqual(lerpAngle(0, 90, -0.5), 315) // extrapolates backward
      assert.deepStrictEqual(lerpAngle(0, 90, 1.5), 135) // extrapolates forward
      assert.deepStrictEqual(lerpAngle(350, 10, -0.5), 340)
      assert.deepStrictEqual(lerpAngle(350, 10, 1.5), 20)
    })
  })

  describe('angle normalization', () => {
    it('handles angles greater than 360', () => {
      assert.deepStrictEqual(lerpAngle(40, 380, 0.5), 30) // 380 = 20, shortest path is 40->20
      assert.deepStrictEqual(lerpAngle(450, 540, 0.5), 135) // 450=90, 540=180
      assert.deepStrictEqual(lerpAngle(720, 810, 0.5), 45) // 720=0, 810=90
    })

    it('handles negative angles', () => {
      assert.deepStrictEqual(lerpAngle(-45, 45, 0.5), 0)
      assert.deepStrictEqual(lerpAngle(-90, -45, 0.5), 292.5) // -90=270, -45=315
      assert.deepStrictEqual(lerpAngle(-180, 180, 0.5), 180) // both normalize to 180
    })

    it('handles mix of positive and negative angles', () => {
      assert.deepStrictEqual(lerpAngle(-10, 10, 0.5), 0)
      assert.deepStrictEqual(lerpAngle(350, -10, 0.5), 350) // -10 = 350, same angle
      assert.deepStrictEqual(lerpAngle(-170, 170, 0.5), 180)
    })
  })

  describe('wrap-around cases', () => {
    it('handles crossing 0/360 boundary', () => {
      assert.deepStrictEqual(lerpAngle(350, 10, 0.5), 0)
      assert.deepStrictEqual(lerpAngle(359, 1, 0.5), 0)
      assert.deepStrictEqual(lerpAngle(355, 5, 0.25), 357.5)
      assert.deepStrictEqual(lerpAngle(355, 5, 0.75), 2.5)
    })

    it('handles crossing 180 boundary', () => {
      assert.deepStrictEqual(lerpAngle(170, 190, 0.5), 180)
      assert.deepStrictEqual(lerpAngle(175, 185, 0.25), 177.5)
      assert.deepStrictEqual(lerpAngle(175, 185, 0.75), 182.5)
    })
  })

  describe('edge cases', () => {
    it('handles identical angles', () => {
      assert.deepStrictEqual(lerpAngle(45, 45, 0.5), 45)
      assert.deepStrictEqual(lerpAngle(0, 0, 0.7), 0)
      assert.deepStrictEqual(lerpAngle(360, 0, 0.3), 0) // 360 normalizes to 0
    })

    it('handles 180-degree differences', () => {
      assert.deepStrictEqual(lerpAngle(0, 180, 0.5), 90) // 180 degree difference, goes the long way
      assert.deepStrictEqual(lerpAngle(90, 270, 0.5), 180) // 90 to 270 = 180 degree difference, goes long way
      assert.deepStrictEqual(lerpAngle(45, 225, 0.5), 135) // 180 degree difference, goes long way
    })

    it('normalizes output to 0-360 range', () => {
      const result1 = lerpAngle(350, 370, 0.5) // 370 = 10
      assert.ok(result1 >= 0 && result1 < 360)

      const result2 = lerpAngle(-45, -90, 0.5)
      assert.ok(result2 >= 0 && result2 < 360)
    })
  })

  describe('precision', () => {
    it('maintains precision for fractional results', () => {
      assert.deepStrictEqual(lerpAngle(0, 90, 1 / 3), 30)
      assert.deepStrictEqual(lerpAngle(0, 360, 1 / 6), 0) // 360 normalizes to 0, so no movement
      assert.deepStrictEqual(lerpAngle(350, 10, 1 / 4), 355)
    })
  })

  describe('mathematical properties', () => {
    it('satisfies symmetry property: lerpAngle(a,b,t) = lerpAngle(b,a,1-t)', () => {
      const testCases = [
        [350, 10, 0.3],
        [45, 135, 0.7],
        [200, 340, 0.25],
        [0, 270, 0.8],
      ]

      testCases.forEach(([a, b, t]) => {
        const forward = lerpAngle(a, b, t)
        const reverse = lerpAngle(b, a, 1 - t)
        assert.approximately(forward, reverse, 1e-10, `Failed for angles ${a}, ${b} with t=${t}`)
      })
    })

    it('handles 180-degree ambiguity consistently', () => {
      // Test consistency across different 180° pairs - all should use positive direction
      const pairs180 = [
        [0, 180],
        [30, 210],
        [60, 240],
        [90, 270],
      ]
      const results = pairs180.map(([a, b]) => lerpAngle(a, b, 0.5))

      // All 180° differences should result in angles that are consistent with positive direction
      assert.deepStrictEqual(results, [90, 120, 150, 180])
    })

    it('maintains direction consistency for exactly 180°', () => {
      // All exactly 180° differences should use same tie-breaking rule (positive direction)
      const cases = [
        [0, 180],
        [45, 225],
        [90, 270],
        [135, 315],
      ]
      const directions = cases.map(([a, b]) => {
        const early = lerpAngle(a, b, 0.1)
        const late = lerpAngle(a, b, 0.9)
        return early < late ? 'positive' : 'negative'
      })

      // All should be 'positive' due to our tie-breaking rule
      assert.ok(
        directions.every((d) => d === 'positive'),
        `Inconsistent directions: ${directions.join(' ')}`,
      )
    })
  })

  describe('floating-point precision edge cases', () => {
    it('handles very small angle differences', () => {
      assert.approximately(lerpAngle(0, 1e-10, 0.5), 5e-11, 1e-12)
      assert.approximately(lerpAngle(359.999_999_9, 0.000_000_1, 0.5), 0, 1e-6)
    })

    it('handles near-180-degree differences', () => {
      // Just under 180° should go short way
      assert.approximately(lerpAngle(0, 179.999_999_9, 0.5), 89.999_999_95, 1e-6)
      // Just over 180° should go long way (with adjustment)
      assert.approximately(lerpAngle(0, 180.000_000_1, 0.5), 270.000_000_05, 1e-6)
    })

    it('handles floating-point precision at boundaries', () => {
      // Test angles very close to 0/360 boundary
      assert.approximately(lerpAngle(359.999_999_9, 0.000_000_1, 0.5), 0, 1e-6)
      assert.approximately(lerpAngle(0.000_000_1, 359.999_999_9, 0.5), 0, 1e-6)
    })
  })

  describe('large angle handling', () => {
    it('handles multiple full rotations correctly', () => {
      assert.deepStrictEqual(lerpAngle(720, 810, 0.5), 45) // 720°=0°, 810°=90°
      assert.deepStrictEqual(lerpAngle(-720, -630, 0.5), 45) // -720°=0°, -630°=90°
      assert.deepStrictEqual(lerpAngle(1080, 1170, 0.5), 45) // 1080°=0°, 1170°=90°
    })

    it('maintains shortest path with large angles', () => {
      // Even with large multiples, should still take shortest path
      assert.deepStrictEqual(lerpAngle(710, 800, 0.5), 35) // 710°=350°, 800°=80°, shortest path
      assert.deepStrictEqual(lerpAngle(-10, 80, 0.5), 35) // -10°=350°, shortest path to 80°
    })
  })
})
