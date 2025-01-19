export declare class PositionalArgsError extends Error {
    constructor();
}
export declare class ArgumentTypeError extends Error {
    constructor(argName: string, argType: string, argValue: any);
}
export declare class TypedError extends Error {
    type: string;
    context?: ErrorContext;
    constructor(message?: string, type?: string, context?: ErrorContext);
}
export declare class ErrorContext {
    transactionHash?: string;
    constructor(transactionHash?: string);
}
