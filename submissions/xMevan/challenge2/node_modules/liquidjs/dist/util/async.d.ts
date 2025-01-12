export declare function toPromise<T>(val: Generator<unknown, T, unknown> | Promise<T> | T): Promise<T>;
export declare function toValueSync<T>(val: Generator<unknown, T, unknown> | T): T;
