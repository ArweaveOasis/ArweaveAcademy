export declare type ReadableStreamLike<T> = AsyncIterable<T> | ReadableStream<T>;
export declare function isAsyncIterable<T>(object: ReadableStreamLike<T>): object is AsyncIterable<T>;
export declare function asyncIterableFromStream<T>(stream: ReadableStream<T>): AsyncIterable<T>;
export declare function ensureAsyncIterabe<T>(streamLike: ReadableStreamLike<T>): AsyncIterable<T>;
