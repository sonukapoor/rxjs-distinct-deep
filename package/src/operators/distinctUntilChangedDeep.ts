import { Observable, OperatorFunction } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

function deepEqual<T>(a: T, b: T): boolean {
  if (a === b) {
    return true;
  }

  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null
  ) {
    return false;
  }

  const keysA = Object.keys(a) as Array<keyof T>;
  const keysB = Object.keys(b) as Array<keyof T>;

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    // Recursively compare values
    if (!keysB.includes(key as keyof T) || !deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

export function distinctUntilChangedDeep<T>(
  comparator: (a: T, b: T) => boolean = deepEqual
): OperatorFunction<T, T> {
  return (source: Observable<T>) =>
    source.pipe(distinctUntilChanged((prev, curr) => comparator(prev, curr)));
}
