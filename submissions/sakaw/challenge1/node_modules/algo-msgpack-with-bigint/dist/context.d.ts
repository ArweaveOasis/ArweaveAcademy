export declare type SplitTypes<T, U> = U extends T ? U : Exclude<T, U>;
export declare type SplitUndefined<T> = SplitTypes<T, undefined>;
export declare type ContextOf<ContextType> = ContextType extends undefined ? {} : {
    /**
     * Custom user-defined data, read/writable
     */
    context: ContextType;
};
