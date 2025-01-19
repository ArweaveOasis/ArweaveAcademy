import { DecodeOptions } from "./decode";
import { ReadableStreamLike } from "./utils/stream";
import { SplitUndefined } from "./context";
export declare function decodeAsync<ContextType>(streamLike: ReadableStreamLike<ArrayLike<number>>, options?: DecodeOptions<SplitUndefined<ContextType>>): Promise<unknown>;
export declare function decodeArrayStream<ContextType>(streamLike: ReadableStreamLike<ArrayLike<number>>, options?: DecodeOptions<SplitUndefined<ContextType>>): AsyncGenerator<unknown, void, unknown>;
export declare function decodeStream<ContextType>(streamLike: ReadableStreamLike<ArrayLike<number>>, options?: DecodeOptions<SplitUndefined<ContextType>>): AsyncGenerator<unknown, void, unknown>;
