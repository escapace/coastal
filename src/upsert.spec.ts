/* eslint-disable unicorn/consistent-function-scoping */
import { describe, it, expect } from 'vitest'
import { upsert } from './upsert'

interface TestAction {
  id: string
  isAsync: boolean
  type: 'plugin' | 'source'
}

describe('upsert', () => {
  it('should append value to array when predicate does not match any existing item', () => {
    const array: TestAction[] = []
    const value: TestAction = { id: '1', isAsync: false, type: 'plugin' }
    const predicate = (action: TestAction) => action.type === 'source'

    upsert(array, value, predicate)

    expect(array).toHaveLength(1)
    expect(array[0]).toBe(value)
  })

  it('should replace existing item when predicate matches', () => {
    const existingAction: TestAction = { id: '1', isAsync: true, type: 'plugin' }
    const array: TestAction[] = [existingAction]
    const newValue: TestAction = { id: '2', isAsync: false, type: 'plugin' }
    const predicate = (action: TestAction) => action.type === 'plugin'

    upsert(array, newValue, predicate)

    expect(array).toHaveLength(1)
    expect(array[0]).toBe(newValue)
    expect(array[0]).not.toBe(existingAction)
  })

  it('should replace last matching item when multiple items match predicate', () => {
    const action1: TestAction = { id: '1', isAsync: true, type: 'plugin' }
    const action2: TestAction = { id: '2', isAsync: false, type: 'plugin' }
    const array: TestAction[] = [action1, action2]
    const newValue: TestAction = { id: '3', isAsync: true, type: 'plugin' }
    const predicate = (action: TestAction) => action.type === 'plugin'

    upsert(array, newValue, predicate)

    expect(array).toHaveLength(2)
    expect(array[0]).toBe(action1)
    expect(array[1]).toBe(newValue)
  })

  it('should append to end when predicate does not match any item in populated array', () => {
    const existingAction: TestAction = { id: '1', isAsync: false, type: 'plugin' }
    const array: TestAction[] = [existingAction]
    const newValue: TestAction = { id: '2', isAsync: true, type: 'source' }
    const predicate = (action: TestAction) => action.type === 'source' && !action.isAsync

    upsert(array, newValue, predicate)

    expect(array).toHaveLength(2)
    expect(array[0]).toBe(existingAction)
    expect(array[1]).toBe(newValue)
  })

  describe('generic functionality', () => {
    it('should work with string arrays', () => {
      const strings: string[] = ['hello', 'world']
      const newValue = 'typescript'
      const predicate = (item: string) => item.startsWith('w')

      upsert(strings, newValue, predicate)

      expect(strings).toHaveLength(2)
      expect(strings[0]).toBe('hello')
      expect(strings[1]).toBe('typescript')
    })

    it('should work with number arrays', () => {
      const numbers: number[] = [1, 2, 3]
      const newValue = 99
      const predicate = (item: number) => item > 5

      upsert(numbers, newValue, predicate)

      expect(numbers).toHaveLength(4)
      expect(numbers[3]).toBe(99)
    })

    it('should work with custom object arrays', () => {
      interface Product {
        id: number
        name: string
        price: number
      }

      const products: Product[] = [
        { id: 1, name: 'laptop', price: 1000 },
        { id: 2, name: 'mouse', price: 50 },
      ]
      const newValue: Product = { id: 2, name: 'wireless mouse', price: 75 }
      const predicate = (item: Product) => item.id === 2

      upsert(products, newValue, predicate)

      expect(products).toHaveLength(2)
      expect(products[1]).toBe(newValue)
      expect(products[1].name).toBe('wireless mouse')
      expect(products[1].price).toBe(75)
    })

    it('should work with boolean predicate logic', () => {
      interface User {
        active: boolean
        email: string
      }

      const users: User[] = [
        { active: true, email: 'alice@test.com' },
        { active: false, email: 'bob@test.com' },
      ]
      const newUser: User = { active: true, email: 'charlie@test.com' }
      const predicate = (user: User) => user.email === 'charlie@test.com'

      upsert(users, newUser, predicate)

      expect(users).toHaveLength(3)
      expect(users[2]).toBe(newUser)
    })
  })
})
