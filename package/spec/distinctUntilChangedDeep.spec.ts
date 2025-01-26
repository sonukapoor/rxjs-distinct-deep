import { of, Subject } from "rxjs";
import { distinctUntilChangedDeep } from "../src/operators/distinctUntilChangedDeep";

describe("distinctUntilChangedDeep", () => {
  it("should emit all values for primitives when distinct values are provided", (done) => {
    const subject = new Subject<number>();
    const results: number[] = [];

    subject.pipe(distinctUntilChangedDeep()).subscribe({
      next: (value) => results.push(value),
      complete: () => {
        expect(results).toEqual([1, 2, 3]);
        done();
      },
    });

    subject.next(1);
    subject.next(2);
    subject.next(3);
    subject.complete();
  });

  it("should emit only distinct values for deep objects", (done) => {
    const subject = new Subject<{ [key: string]: any }>();
    const results: { [key: string]: any }[] = [];

    subject.pipe(distinctUntilChangedDeep()).subscribe({
      next: (value) => results.push(value),
      complete: () => {
        expect(results).toEqual([{ a: 1 }, { a: 2 }]);
        done();
      },
    });

    subject.next({ a: 1 });
    subject.next({ a: 1 }); // Duplicate
    subject.next({ a: 2 });
    subject.complete();
  });

  it("should respect custom comparator", (done) => {
    const subject = new Subject<number>();
    const results: number[] = [];

    const comparator = (a: number, b: number) => {
      return Math.abs(a) === Math.abs(b);
    };

    subject.pipe(distinctUntilChangedDeep(comparator)).subscribe({
      next: (value) => results.push(value),
      complete: () => {
        expect(results).toEqual([1, 2]);
        done();
      },
    });

    subject.next(1);
    subject.next(-1); // Same absolute value, custom comparator should allow it
    subject.next(2);
    subject.next(-2);
    subject.complete();
  });

  it("should not emit duplicate references for objects", (done) => {
    const subject = new Subject<{ a: number }>();
    const results: { a: number }[] = [];

    const obj = { a: 1 };

    subject.pipe(distinctUntilChangedDeep()).subscribe({
      next: (value) => results.push(value),
      complete: () => {
        expect(results).toEqual([obj]);
        done();
      },
    });

    subject.next(obj);
    subject.next(obj); // Same reference, should not emit
    subject.complete();
  });

  it("should handle empty streams without error", (done) => {
    const subject = new Subject<number>();
    const results: number[] = [];

    subject.pipe(distinctUntilChangedDeep()).subscribe({
      next: (value) => results.push(value),
      complete: () => {
        expect(results).toEqual([]);
        done();
      },
    });

    subject.complete();
  });

  it("should emit values when objects have different numbers of keys", (done) => {
    const source$ = of({ a: 1, b: 2 }, { a: 1 }); // Objects with differing lengths
    const expected = [{ a: 1, b: 2 }, { a: 1 }]; // Both should be emitted

    const result: Array<Record<string, unknown>> = [];

    source$.pipe(distinctUntilChangedDeep()).subscribe({
      next: (value) => result.push(value),
      complete: () => {
        expect(result).toEqual(expected);
        done();
      },
    });
  });
});
