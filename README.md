# coastal

TypeScript utility library providing common functions.

## Installation

```bash
pnpm add coastal
```

## Usage

### clamp

Constrains a number to fall within specified bounds.

```typescript
import { clamp } from 'coastal'

clamp(15, 0, 10) // 10
clamp(-5, 0, 10) // 0
clamp(5, 0, 10) // 5
```

### findLastIndex

Finds the index of the last element in an array that satisfies a testing function.

```typescript
import { findLastIndex } from 'coastal'

const numbers = [1, 2, 3, 4, 3, 2, 1]
findLastIndex(numbers, (x) => x === 3) // 4
findLastIndex(numbers, (x) => x > 10) // -1
```

### remove

Removes elements from an array in-place where the predicate returns false.

```typescript
import { remove } from 'coastal'

const numbers = [1, 2, 3, 4, 5]
remove(numbers, (x) => x % 2 === 0) // keeps even numbers
console.log(numbers) // [2, 4]
```
