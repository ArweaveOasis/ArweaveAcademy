import { ExtensionCodecType } from "./ExtensionCodec";
import { ContextOf, SplitUndefined } from "./context";
export declare type EncodeOptions<ContextType = undefined> = Partial<Readonly<{
    extensionCodec: ExtensionCodecType<ContextType>;
    maxDepth: number;
    initialBufferSize: number;
    sortKeys: boolean;
    /**
     * If `true`, non-integer numbers are encoded in float32, not in float64 (the default).
     *
     * Only use it if precisions don't matter.
     */
    forceFloat32: boolean;
    /**
     * If `true`, an object property with `undefined` value are ignored.
     * e.g. `{ foo: undefined }` will be encoded as `{}`, as `JSON.stringify()` does.
     *
     * The default is `false`. Note that it needs more time to encode.
     */
    ignoreUndefined: boolean;
    /**
     * If `true`, integer numbers are encoded as floating point,
     * with the `forceFloat32` option taken into account.
     *
     * The default is `false`.
     */
    forceIntegerToFloat: boolean;
}>> & ContextOf<ContextType>;
/**
 * It encodes `value` in the MessagePack format and
 * returns a byte buffer.
 *
 * The returned buffer is a slice of a larger `ArrayBuffer`, so you have to use its `#byteOffset` and `#byteLength` in order to convert it to another typed arrays including NodeJS `Buffer`.
 */
export declare function encode<ContextType>(value: unknown, options?: EncodeOptions<SplitUndefined<ContextType>>): Uint8Array;
