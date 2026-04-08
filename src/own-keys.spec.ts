import { assert, describe, it } from 'vitest'
import { ownKeys } from './own-keys'

describe('./src/own-keys.ts', () => {
  it('returns own property names for object with no symbols', () => {
    const object = { a: 1, b: 2, c: 3 }
    const keys = ownKeys(object)

    assert.deepEqual(keys, ['a', 'b', 'c'])
  })

  it('returns property names followed by symbols in standard order', () => {
    const sym1 = Symbol('first')
    const sym2 = Symbol('second')
    const object = { a: 1, b: 2, [sym1]: 'symbol1', [sym2]: 'symbol2' }
    const keys = ownKeys(object)

    assert.deepEqual(keys, ['a', 'b', sym1, sym2])
  })

  it('handles empty object', () => {
    const keys = ownKeys({})

    assert.deepEqual(keys, [])
  })

  it('handles object with only symbols', () => {
    const sym1 = Symbol('only')
    const sym2 = Symbol('symbols')
    const object = { [sym1]: 1, [sym2]: 2 }
    const keys = ownKeys(object)

    assert.deepEqual(keys, [sym1, sym2])
  })

  it('includes non-enumerable properties', () => {
    const object = Object.defineProperty({ a: 1 }, 'hidden', {
      enumerable: false,
      value: 'secret',
    })
    const keys = ownKeys(object)

    assert.deepEqual(keys, ['a', 'hidden'])
  })

  it('matches Reflect.ownKeys order for ordinary objects', () => {
    const sym = Symbol('test')
    const object = { [sym]: 'symbol', x: 1, y: 2, z: 3 }
    const keys = ownKeys(object)
    const reflectKeys = Reflect.ownKeys(object)

    assert.deepEqual(keys, reflectKeys)
  })

  it('handles array objects', () => {
    const array = ['a', 'b', 'c']
    const keys = ownKeys(array)

    assert.deepEqual(keys, ['0', '1', '2', 'length'])
  })

  it('handles objects with integer-like keys', () => {
    const object = { 0: 'a', 1: 'b', 2: 'c', foo: 'bar' }
    const keys = ownKeys(object)

    assert.deepEqual(keys, ['0', '1', '2', 'foo'])
  })

  it('reuses the names array directly when no symbols present', () => {
    const object = { a: 1, b: 2 }
    const keys = ownKeys(object)

    // Verify it returns a valid PropertyKey array
    assert.isArray(keys)
    assert.equal(keys.length, 2)
  })

  it('creates new array when symbols are present', () => {
    const sym = Symbol('test')
    const object = { a: 1, [sym]: 2 }
    const keys = ownKeys(object)

    assert.isArray(keys)
    assert.equal(keys.length, 2)
    assert.equal(keys[0], 'a')
    assert.equal(keys[1], sym)
  })

  it('preserves property creation order for string keys', () => {
    const object: Record<string, number> = {}
    object.third = 3
    object.first = 1
    object.second = 2

    const keys = ownKeys(object)

    assert.deepEqual(keys, ['third', 'first', 'second'])
  })

  it('preserves symbol insertion order', () => {
    const sym1 = Symbol('1')
    const sym2 = Symbol('2')
    const sym3 = Symbol('3')
    const object = { [sym1]: 1, [sym2]: 2, [sym3]: 3 }
    const keys = ownKeys(object)

    assert.deepEqual(keys, [sym1, sym2, sym3])
  })
})
