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

  describe('180-degree ambiguity resolution', () => {
    it('consistently chooses positive direction for exactly 180° differences', () => {
      // Test various 180° pairs - all should use positive direction tie-breaking
      assert.deepStrictEqual(adjustAngle(0, 180), [0, 180])
      assert.deepStrictEqual(adjustAngle(45, 225), [45, 225])
      assert.deepStrictEqual(adjustAngle(90, 270), [90, 270])
      assert.deepStrictEqual(adjustAngle(135, 315), [135, 315])
    })

    it('handles exactly -180° differences with tie-breaking', () => {
      // When angleDiff = -180, should adjust second angle up by 360
      assert.deepStrictEqual(adjustAngle(180, 0), [180, 360])
      assert.deepStrictEqual(adjustAngle(225, 45), [225, 405])
      assert.deepStrictEqual(adjustAngle(270, 90), [270, 450])
      assert.deepStrictEqual(adjustAngle(315, 135), [315, 495])
    })

    it('does not affect near-180° differences', () => {
      // Just under 180° should go short way (no adjustment)
      assert.approximately(adjustAngle(0, 179.9)[1], 179.9, 1e-10)
      // Just over 180° should trigger normal adjustment
      const result = adjustAngle(0, 180.1)
      assert.equal(result[0], 360)
      assert.approximately(result[1], 180.1, 1e-10)

      // Just under -180° should trigger normal adjustment
      const result2 = adjustAngle(180.1, 0)
      assert.approximately(result2[0], 180.1, 1e-10)
      assert.equal(result2[1], 360)
      // Just over -180° should go short way (no adjustment)
      const result3 = adjustAngle(179.9, 0)
      assert.approximately(result3[0], 179.9, 1e-10)
      assert.equal(result3[1], 0)
    })
  })

  describe('mathematical properties', () => {
    it('maintains minimal distance property', () => {
      const testCases = [
        [10, 20],
        [350, 10],
        [180, 0],
        [270, 90],
        [45, 225],
      ]

      testCases.forEach(([a, b]) => {
        const [adjA, adjB] = adjustAngle(a, b)
        const distance = Math.abs(adjB - adjA)

        // Distance should never exceed 180° (or be very close due to tie-breaking)
        assert.ok(distance <= 180.0001, `Distance ${distance} exceeds 180° for angles ${a}, ${b}`)
      })
    })

    it('preserves original angle relationships after normalization', () => {
      const testCases = [
        [720, 810],
        [-360, -270],
        [450, 540],
      ]

      testCases.forEach(([a, b]) => {
        const [adjA, adjB] = adjustAngle(a, b)
        const normA = ((a % 360) + 360) % 360
        const normB = ((b % 360) + 360) % 360

        // Check that the adjustment maintains the same relative positioning
        const originalDiff = Math.abs(normB - normA)
        const adjustedDiff = Math.abs(adjB - adjA)

        // Should be the same or the complement (360 - original)
        const expectedDiff = originalDiff <= 180 ? originalDiff : 360 - originalDiff
        assert.approximately(adjustedDiff, expectedDiff, 1e-10)
      })
    })
  })
})
