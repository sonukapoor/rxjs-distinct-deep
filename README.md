# rxjs-distinct-deep

A custom RxJS operator that extends `distinctUntilChanged` with deep equality comparison, allowing you to detect changes in deeply nested objects or structures. This comparison is done **without any external libraries**, such as Lodash, using a custom recursive deep equality function.

⭐ If you find this helpful, please consider giving it a star on GitHub! Your support means a lot.

## Problem

In reactive programming, you often need to detect changes in the values emitted by an Observable. The default `distinctUntilChanged` operator in RxJS compares values using strict equality (`===`), which works fine for primitive types but fails for complex objects like arrays or objects with nested structures.

For example:

```typescript
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };

console.log(obj1 === obj2); // false (different references, even though values are the same)
```

Using the default `distinctUntilChanged` operator would not recognize `obj1` and `obj2` as equal because of reference comparison. This becomes a challenge when working with complex objects.

## Solution

`rxjs-distinct-deep` solves this problem by performing a **deep equality comparison** on objects, arrays, or any nested structures. It allows you to detect changes in deeply nested objects, without relying on external libraries like Lodash.

Simply replace `distinctUntilChanged` with `distinctUntilChangedDeep`, and you're all set for both primitive types and complex objects.

```typescript
import { distinctUntilChangedDeep } from "rxjs-distinct-deep";
import { of } from "rxjs";

const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };
const obj3 = { a: 1, b: { c: 3 } };

of(obj1, obj2, obj3).pipe(distinctUntilChangedDeep()).subscribe(console.log);
```

**Output**

```bash
{ a: 1, b: { c: 2 } };
{ a: 1, b: { c: 3 } };
```

### Features:

- **Deep Equality Comparison**: Compares nested structures, ensuring that the values are equal even if the references differ.
- **No External Dependencies**: This operator uses a custom implementation of deep equality, without relying on any external libraries like Lodash.
- **Easy to Use**: Simply replace `distinctUntilChanged` with `distinctUntilChangedDeep` in your RxJS pipelines.

## Installation

To install the package, use npm or yarn:

```bash
npm install rxjs-distinct-deep
```

Or:

```bash
yarn add rxjs-distinct-deep
```

## Usage

```typescript
import { of } from "rxjs";
import { distinctUntilChangedDeep } from "rxjs-distinct-deep";

const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };

of(obj1, obj2)
  .pipe(distinctUntilChangedDeep())
  .subscribe((value) => {
    console.log(value); // Emits obj1 only once
  });
```

### Custom Comparator

You can provide a custom comparator function if you'd like to adjust how equality is determined:

```typescript
import { distinctUntilChangedDeep } from "rxjs-distinct-deep";

const customComparator = (a: any, b: any) => a.a === b.a; // Compare only the 'a' property

of({ a: 1 }, { a: 1 }, { a: 2 })
  .pipe(distinctUntilChangedDeep(customComparator))
  .subscribe(console.log); // Will emit only the first and third values
```

## License

This package is licensed under the MIT License.
