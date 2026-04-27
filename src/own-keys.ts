/**
 * Returns own property names followed by own property symbols in standard JavaScript order.
 *
 * @remarks
 * This function matches the ordering used by `Reflect.ownKeys()` for ordinary objects while
 * avoiding the slower generic helper on hot plain-object paths that already need a materialized
 * key array. For ordinary objects, keys are returned in this order:
 *
 * - Non-negative integer indexes in increasing numeric order (as strings)
 *
 * - Other string keys in the order of property creation
 *
 * - Symbol keys in the order of property creation
 *
 * The function includes both enumerable and non-enumerable properties. When the object has no
 * symbol keys, the function reuses the names array directly for improved performance.
 *
 * @param value - The target object from which to retrieve own property keys.
 * @returns Array of the object's own property keys, including both string and symbol keys. For
 * objects without symbol properties, returns the names array directly cast to PropertyKey array.
 * For objects with symbols, returns a new array containing names followed by symbols.
 */
export const ownKeys = (value: object): Array<number | string | symbol> => {
  const ownNames = Object.getOwnPropertyNames(value)
  const ownSymbols = Object.getOwnPropertySymbols(value)

  if (ownSymbols.length === 0) {
    return ownNames as PropertyKey[]
  }

  const keys = new Array<PropertyKey>(ownNames.length + ownSymbols.length)

  for (let index = 0; index < ownNames.length; index += 1) {
    keys[index] = ownNames[index]
  }

  for (let index = 0; index < ownSymbols.length; index += 1) {
    keys[ownNames.length + index] = ownSymbols[index]
  }

  return keys
}
