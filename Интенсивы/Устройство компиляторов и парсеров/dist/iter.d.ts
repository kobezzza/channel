export declare function seq<T>(...iterable: Iterable<T>[]): IterableIterator<T>;
export declare function intoBufIter<T>(iterable: Iterable<T>, buffer: T[]): IterableIterator<T>;
export declare function intoIter<T>(iterable: Iterable<T>): IterableIterator<T>;
export declare function intoIterableIter<T>(iter: Iterator<T>): IterableIterator<T>;
