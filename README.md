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

Normalizes an angle to the range [0, 360).

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

#### findLastIndex

Finds the index of the last element in an array that satisfies a testing function.

```typescript
import { findLastIndex } from 'coastal'

const numbers = [1, 2, 3, 4, 3, 2, 1]
findLastIndex(numbers, (x) => x === 3) // 4
findLastIndex(numbers, (x) => x > 10) // -1
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
