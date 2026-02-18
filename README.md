# coastal

TypeScript utility library providing common mathematical and array manipulation functions.

## Installation

```bash
pnpm add coastal
```

## Usage

### Mathematical Functions

#### adjustAngle

Adjusts two angles to minimize interpolation distance.

```typescript
import { adjustAngle } from 'coastal'

adjustAngle(350, 10) // [350, 10] - no adjustment needed
adjustAngle(10, 350) // [370, 350] - adjusts first angle
```

#### lerp

Linear interpolation between two values.

```typescript
import { lerp } from 'coastal'

lerp(0, 100, 0.5) // 50
lerp(0, 100, 0.25) // 25
lerp(-10, 10, 0.5) // 0
```

#### lerpAngle

Linear interpolation between two angles, taking the shortest path.

```typescript
import { lerpAngle } from 'coastal'

lerpAngle(350, 10, 0.5) // 0 - takes shortest path across 0°
lerpAngle(90, 270, 0.5) // 180
```

#### lerpArray

Linear interpolation between two arrays element-wise.

```typescript
import { lerpArray } from 'coastal'

lerpArray([0, 0], [2, 4], 0.5) // [1, 2]
lerpArray([1, 2, 3], [4, 5], 0.5) // [2.5, 3.5] - uses minimum length
lerpArray([], [1, 2], 0.5) // [] - empty array when either input is empty
```

**Edge cases:**

- Empty arrays: Returns empty array when either input array is empty
- Different lengths: Uses minimum length of the two input arrays

#### normalize

Normalizes an array of numbers so they sum to 1.

```typescript
import { normalize } from 'coastal'

normalize([2, 2]) // [0.5, 0.5]
normalize([1, 2, 3]) // [0.16667, 0.33333, 0.5]
normalize([]) // [] - empty array
normalize([1, -1]) // [Infinity, -Infinity] - zero sum case
```

**Edge cases:**

- Empty array: Returns empty array
- Zero sum: Returns array with Infinity/-Infinity values (division by zero)
- All zeros: Returns array with NaN values

#### normalizeAngle

Normalizes an angle to the range \[0, 360).

```typescript
import { normalizeAngle } from 'coastal'

normalizeAngle(450) // 90
normalizeAngle(-90) // 270
normalizeAngle(360) // 0
```

#### sum

Calculates the sum of all numbers in an array.

```typescript
import { sum } from 'coastal'

sum([1, 2, 3, 4]) // 10
sum([]) // 0
```

#### szudzik

Szudzik pairing function - maps two non-negative integers to a unique non-negative integer.

```typescript
import { szudzik } from 'coastal'

szudzik(1, 1) // 3
szudzik(5, 3) // 33
szudzik(-1, 0) // -1 - deterministic but not bijective for negative inputs
szudzik(1.5, 0) // 3.75 - deterministic but not bijective for non-integers
```

**Edge cases:**

- Negative inputs: Produces deterministic results but pairing is not guaranteed to be unique or reversible
- Non-integer inputs: Produces deterministic results but pairing is not guaranteed to be unique or reversible
- Intended use: Non-negative integers for mathematically correct bijective pairing

### Array Functions

#### clamp

Constrains a number to fall within specified bounds.

```typescript
import { clamp } from 'coastal'

clamp(15, 0, 10) // 10
clamp(-5, 0, 10) // 0
clamp(5, 0, 10) // 5
```

#### remove

Removes elements from an array in-place where the predicate returns true.

```typescript
import { remove } from 'coastal'

const numbers = [1, 2, 3, 4, 5]
remove(numbers, (x) => x % 2 === 0) // removes even numbers
console.log(numbers) // [1, 3, 5]

// Predicate receives value, index, and array
const items = ['a', 'b', 'c', 'd']
remove(items, (value, index) => index % 2 === 0) // removes elements at even indices
console.log(items) // ['b', 'd']
```

#### upsert

Updates an existing array element or inserts a new one based on a predicate match.

```typescript
import { upsert } from 'coastal'

// Insert when no match found
const users = [{ id: 1, name: 'Alice' }]
upsert(users, { id: 2, name: 'Bob' }, (user) => user.id === 2)
console.log(users) // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]

// Update when match found
const products = [{ id: 1, price: 100 }]
upsert(products, { id: 1, price: 150 }, (product) => product.id === 1)
console.log(products) // [{ id: 1, price: 150 }]

// Works with primitives
const numbers = [1, 2, 3]
upsert(numbers, 99, (n) => n > 5) // no match, appends
console.log(numbers) // [1, 2, 3, 99]

const tags = ['urgent', 'bug']
upsert(tags, 'fixed', (tag) => tag === 'bug') // match found, replaces
console.log(tags) // ['urgent', 'fixed']
```

**Behavior:**

- Inserts at end of array when predicate finds no match
- Replaces first matching element when predicate finds a match
- Mutates the original array

#### mapChunkBy

Maps over an array using dynamically-sized chunks, where each chunk size is determined by examining the current element and its position. Similar to `Array.map()` but operates on variable-length chunks instead of individual elements.

```typescript
import { mapChunkBy } from 'coastal'

// Fixed chunk size
const numbers = [1, 2, 3, 4, 5, 6]
mapChunkBy(
  numbers,
  () => 2,
  (chunk, index) => ({ index, sum: chunk.reduce((a, b) => a + b, 0) }),
)
// [{ index: 0, sum: 3 }, { index: 2, sum: 7 }, { index: 4, sum: 11 }]

// Dynamic sizing based on content
const words = ['hi', 'hello', 'a', 'world', 'test']
mapChunkBy(
  words,
  (word) => (word.length > 3 ? 2 : 1),
  (chunk, index) => ({ startIndex: index, text: chunk.join(' ') }),
)
// [{ startIndex: 0, text: 'hi' }, { startIndex: 1, text: 'hello a' }, { startIndex: 3, text: 'world test' }]

// Text processing with sentence detection
const words = ['Hello', 'world!', 'How', 'are', 'you?', 'Fine.']
mapChunkBy(
  words,
  (_, index) => {
    // Take words until punctuation or max 3 words
    let count = 1
    for (let i = index; i < Math.min(index + 3, words.length); i++) {
      if (words[i].includes('!') || words[i].includes('?') || words[i].includes('.')) {
        return i - index + 1
      }
      if (i > index) count++
    }
    return count
  },
  (chunk) => chunk.join(' '),
)
// ['Hello world!', 'How are you?', 'Fine.']
```

**Edge cases:**

- Empty array: Returns empty array
- Chunk size exceeds remaining elements: Uses all remaining elements
- Invalid chunk size: Throws Error for non-positive integers, decimals, NaN, or Infinity
- Source array is not modified

### Data Structures

#### DirectAddressTable

A direct address table providing O(1) lookup time for non-negative integer keys. The table is immutable after construction.

```typescript
import { DirectAddressTable } from 'coastal'

// Basic usage
const table = new DirectAddressTable([0, 2, 5], ['a', 'b', 'c'])
table.get(0) // 'a'
table.get(1) // undefined
table.get(2) // 'b'
table.get(5) // 'c'

// Duplicate keys - last value wins
const table2 = new DirectAddressTable([1, 2, 1], ['first', 'second', 'third'])
table2.get(1) // 'third'

// Invalid keys throw errors during construction
try {
  new DirectAddressTable([-1, 0], ['a', 'b']) // throws Error
} catch (e) {
  console.log(e.message) // "Invalid key: -1. Keys must be non-negative integers"
}

try {
  new DirectAddressTable([1.5, 2], ['a', 'b']) // throws Error
} catch (e) {
  console.log(e.message) // "Invalid key: 1.5. Keys must be non-negative integers"
}
```

**Performance characteristics:**

- Time complexity: O(1) lookup
- Space complexity: O(max_key) where max_key is the largest key value
- Memory usage scales with the largest key, not the number of stored values

**Edge cases:**

- Empty key arrays: Throws RangeError
- Mismatched array lengths: Keys without corresponding values are assigned undefined
- Invalid keys: Throws Error for negative numbers or non-integers
- Large key values: Uses memory proportional to the largest key value
- Duplicate keys: Last value overwrites previous values

# API

## function adjustAngle [↗](src/adjust-angle.ts#L15-L29 'adjustAngle')

Adjusts two angles to minimize interpolation distance (shortest arc)

Mathematically proven to produce minimal interpolation distance with |adjusted_b - adjusted_a| ≤ 180°. Properly manages wrap-around at 0°/360° boundary and handles 180° ambiguity with positive direction tie-breaking rule for deterministic behavior. Essential for consistent interpolation in graphics, robotics, and navigation systems.

```typescript
adjustAngle: (a: number, b: number) => [number, number]
```

### Parameters

| Parameter | Type              | Description             |
| --------- | ----------------- | ----------------------- |
| `a`       | <pre>number</pre> | First angle in degrees  |
| `b`       | <pre>number</pre> | Second angle in degrees |

### Returns

Tuple of adjusted angles that minimize interpolation distance

## function clamp [↗](src/clamp.ts#L12-L17 'clamp')

Constrains a number to fall within specified bounds.

Uses nested Math functions for optimal performance compared to conditional branches.

```typescript
clamp: (value: number, min: number, max: number) => number
```

### Parameters

| Parameter | Type              | Description                                |
| --------- | ----------------- | ------------------------------------------ |
| `value`   | <pre>number</pre> | The number to constrain                    |
| `min`     | <pre>number</pre> | The lower bound (inclusive, must be ≤ max) |
| `max`     | <pre>number</pre> | The upper bound (inclusive, must be ≥ min) |

### Returns

The constrained number, or the appropriate bound if outside range

### Throws

Error when `min > max`

## function lerp [↗](src/lerp.ts#L8 'lerp')

Linear interpolation between two values

```typescript
lerp: (v0: number, v1: number, t: number) => number
```

### Parameters

| Parameter | Type              | Description                           |
| --------- | ----------------- | ------------------------------------- |
| `v0`      | <pre>number</pre> | Start value                           |
| `v1`      | <pre>number</pre> | End value                             |
| `t`       | <pre>number</pre> | Interpolation factor (0 = v0, 1 = v1) |

### Returns

Interpolated value

## function lerpAngle [↗](src/lerp-angle.ts#L19-L20 'lerpAngle')

Linear interpolation between two angles using shortest path

Uses shortest path interpolation via adjustAngle to ensure optimal angular transitions. Satisfies symmetry property: lerpAngle(a,b,t) = lerpAngle(b,a,1-t). Consistent 180° tie-breaking ensures predictable results and handles all edge cases including floating-point precision boundaries. Suitable for production use in graphics, robotics, and navigation systems.

```typescript
lerpAngle: (a: number, b: number, t: number) => number
```

### Parameters

| Parameter | Type              | Description                         |
| --------- | ----------------- | ----------------------------------- |
| `a`       | <pre>number</pre> | Start angle in degrees              |
| `b`       | <pre>number</pre> | End angle in degrees                |
| `t`       | <pre>number</pre> | Interpolation factor (0 = a, 1 = b) |

### Returns

Interpolated angle normalized to \[0, 360) range

## function lerpArray [↗](src/lerp-array.ts#L11-L18 'lerpArray')

Linear interpolation between two arrays element-wise

```typescript
lerpArray: (a: number[], b: number[], t: number) => number[]
```

### Parameters

| Parameter | Type                 | Description                                              |
| --------- | -------------------- | -------------------------------------------------------- |
| `a`       | <pre>number\[]</pre> | First array                                              |
| `b`       | <pre>number\[]</pre> | Second array                                             |
| `t`       | <pre>number</pre>    | Interpolation factor (0 = first array, 1 = second array) |

### Returns

New array with interpolated values. Length equals minimum of input array lengths. Returns empty array when either input array is empty.

## function mapChunkBy [↗](src/map-chunk-by.ts#L20-L50 'mapChunkBy')

Maps over an array using dynamically-sized chunks, where each chunk size is determined by examining the current element and its position. Similar to Array.map() but operates on variable-length chunks of the array instead of individual elements.

```typescript
export declare function mapChunkBy<T, R>(
  array: T[],
  getChunkSize: (currentValue: T, index: number) => number,
  transform: (chunk: T[], startIndex: number) => R,
): R[]
```

### Type Parameters

| Parameter | Description                                |
| --------- | ------------------------------------------ |
| `T`       | The type of elements in the input array    |
| `R`       | The type of elements in the returned array |

### Parameters

| Parameter      | Type                                                  | Description                                                                                                                                                                               |
| -------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `array`        | <pre>T\[]</pre>                                       | The input array to process                                                                                                                                                                |
| `getChunkSize` | <pre>(currentValue: T, index: number) => number</pre> | Function that determines the size of the next chunk. Receives the current element and its index, returns the number of elements to include in this chunk. Must return a positive integer. |
| `transform`    | <pre>(chunk: T\[], startIndex: number) => R</pre>     | Function that transforms each chunk and returns a result value. Receives the chunk array and the starting index of the chunk.                                                             |

### Returns

Array of transformed results, where each element is the result of calling the transform function on a dynamically-sized chunk.

### Throws

Error when getChunkSize returns a value that is not a positive integer

## function normalize [↗](src/normalize.ts#L9-L13 'normalize')

Normalizes an array of numbers so they sum to 1

```typescript
normalize: (values: number[]) => number[]
```

### Parameters

| Parameter | Type                 | Description                   |
| --------- | -------------------- | ----------------------------- |
| `values`  | <pre>number\[]</pre> | Array of numbers to normalize |

### Returns

Normalized array where all values sum to 1. Returns empty array for empty input. For arrays with zero sum, returns array containing Infinity or NaN values.

## function normalizeAngle [↗](src/normalize-angle.ts#L6 'normalizeAngle')

Normalizes an angle to the range \[0, 360)

```typescript
normalizeAngle: (angle: number) => number
```

### Parameters

| Parameter | Type              | Description      |
| --------- | ----------------- | ---------------- |
| `angle`   | <pre>number</pre> | Angle in degrees |

### Returns

Normalized angle between 0 and 360 degrees

## function remove [↗](src/remove.ts#L9-L16 'remove')

Mutates an array by removing all elements where the predicate returns true. Elements are evaluated from right to left to maintain correct indices during removal.

```typescript
remove: <T>(array: T[], predicate: (value: T, index: number, array: T[]) => boolean) => void
```

### Type Parameters

| Parameter | Description                |
| --------- | -------------------------- |
| `T`       | The type of array elements |

### Parameters

| Parameter   | Type                                                         | Description                                                           |
| ----------- | ------------------------------------------------------------ | --------------------------------------------------------------------- |
| `array`     | <pre>T\[]</pre>                                              | The array to modify in-place                                          |
| `predicate` | <pre>(value: T, index: number, array: T\[]) => boolean</pre> | Function invoked for each element. Return true to remove the element. |

## function sum [↗](src/sum.ts#L6 'sum')

Calculates the sum of all numbers in an array

```typescript
sum: (values: number[]) => number
```

### Parameters

| Parameter | Type                 | Description             |
| --------- | -------------------- | ----------------------- |
| `values`  | <pre>number\[]</pre> | Array of numbers to sum |

### Returns

Sum of all values in the array

## function szudzik [↗](src/szudzik.ts#L8 'szudzik')

Szudzik pairing function - maps two non-negative integers to a unique non-negative integer

```typescript
szudzik: (x: number, y: number) => number
```

### Parameters

| Parameter | Type              | Description                                         |
| --------- | ----------------- | --------------------------------------------------- |
| `x`       | <pre>number</pre> | First integer (intended for non-negative integers)  |
| `y`       | <pre>number</pre> | Second integer (intended for non-negative integers) |

### Returns

Unique integer representing the pair. For negative or non-integer inputs, produces deterministic results but not guaranteed to be unique or reversible.

## function upsert [↗](src/upsert.ts#L10-L18 'upsert')

Updates an existing array element or inserts a new one based on a predicate match. Mutates the original array.

```typescript
upsert: <T>(array: T[], value: T, predicate: (item: T) => boolean) => void
```

### Type Parameters

| Parameter | Description                       |
| --------- | --------------------------------- |
| `T`       | The type of elements in the array |

### Parameters

| Parameter   | Type                            | Description                                           |
| ----------- | ------------------------------- | ----------------------------------------------------- |
| `array`     | <pre>T\[]</pre>                 | The array to modify                                   |
| `value`     | <pre>T</pre>                    | The value to insert or use as replacement             |
| `predicate` | <pre>(item: T) => boolean</pre> | Function that returns true for the element to replace |

## class DirectAddressTable [↗](src/direct-address-table.ts#L8-L57 'DirectAddressTable')

A direct address table data structure providing O(1) lookup time for non-negative integer keys. Uses an array for storage where keys serve as indices, enabling constant-time access. The table is immutable after construction and creates sparse arrays when keys have gaps.

```typescript
export declare class DirectAddressTable<T>
```

### Type Parameters

| Parameter | Description                            |
| --------- | -------------------------------------- |
| `T`       | The type of values stored in the table |

### new DirectAddressTable

Creates a new direct address table from parallel arrays of keys and values. Space complexity is O(max_key) where max_key is the largest key value.

```typescript
constructor(keys: number[], values: T[]);
```

#### Parameters

| Parameter | Type                 | Description                                                                                          |
| --------- | -------------------- | ---------------------------------------------------------------------------------------------------- |
| `keys`    | <pre>number\[]</pre> | Array of non-negative integer keys                                                                   |
| `values`  | <pre>T\[]</pre>      | Array of values corresponding to each key. Keys without corresponding values are assigned undefined. |

#### Throws

1. RangeError When keys array is empty
2. Error When keys contain negative numbers or non-integer values

#### Remarks

- Duplicate keys: Last value overwrites previous values for the same key - Memory usage scales with the largest key value, not the number of stored values - Invalid keys are rejected during construction

### DirectAddressTable.get

Retrieves the value associated with the specified key in O(1) time.

```typescript
get(key: number): T | undefined;
```

#### Parameters

| Parameter | Type              | Description                |
| --------- | ----------------- | -------------------------- |
| `key`     | <pre>number</pre> | The numeric key to look up |

#### Returns

The value associated with the key, or undefined if the key doesn't exist or was never assigned a value

#### Remarks

- Returns undefined for keys outside the initialized range - No runtime validation is performed on the key parameter
