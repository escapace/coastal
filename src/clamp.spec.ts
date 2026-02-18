import { describe, it, expect } from 'vitest'
import { clamp } from './clamp'

describe('clamp', () => {
  it('should clamp value between min and max', () => {
    expect(clamp(5, 1, 10)).toBe(5)
    expect(clamp(-5, 1, 10)).toBe(1)
    expect(clamp(15, 1, 10)).toBe(10)
    expect(clamp(1, 1, 10)).toBe(1)
    expect(clamp(10, 1, 10)).toBe(10)
  })

  it('should handle equal min and max', () => {
    expect(clamp(5, 3, 3)).toBe(3)
    expect(clamp(1, 3, 3)).toBe(3)
    expect(clamp(3, 3, 3)).toBe(3)
  })

  it('should handle negative numbers', () => {
    expect(clamp(-5, -10, -1)).toBe(-5)
    expect(clamp(-15, -10, -1)).toBe(-10)
    expect(clamp(0, -10, -1)).toBe(-1)
  })

  it('should handle floating point numbers', () => {
    expect(clamp(1.5, 1.2, 1.8)).toBe(1.5)
    expect(clamp(1.1, 1.2, 1.8)).toBe(1.2)
    expect(clamp(1.9, 1.2, 1.8)).toBe(1.8)
    expect(clamp(0.3, -0.4, 0.4)).toBe(0.3)
    expect(clamp(-0.3, -0.4, 0.4)).toBe(-0.3)
    expect(clamp(1, -0.4, 0.4)).toBe(0.4)
    expect(clamp(-1, -0.4, 0.4)).toBe(-0.4)
  })

  it('should handle zero values', () => {
    expect(clamp(0, 0, 1)).toBe(0)
    expect(clamp(0, -1, 0)).toBe(0)
    expect(clamp(0, -1, 1)).toBe(0)
  })

  it('should handle Infinity', () => {
    expect(clamp(Infinity, 1, 10)).toBe(10)
    expect(clamp(-Infinity, 1, 10)).toBe(1)
    expect(clamp(5, -Infinity, Infinity)).toBe(5)
  })

  it('should handle NaN', () => {
    expect(clamp(NaN, 1, 10)).toBe(NaN)
    expect(clamp(5, NaN, 10)).toBe(NaN)
    expect(clamp(5, 1, NaN)).toBe(NaN)
  })

  it('should throw error when min > max', () => {
    expect(() => clamp(5, 10, 1)).toThrowError('min must be less than or equal to max')
    expect(() => clamp(0, 5, -5)).toThrowError('min must be less than or equal to max')
  })
})
