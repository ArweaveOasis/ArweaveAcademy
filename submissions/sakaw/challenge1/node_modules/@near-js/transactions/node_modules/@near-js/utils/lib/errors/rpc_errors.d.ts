import { TypedError } from '@near-js/types';
export declare class ServerError extends TypedError {
}
declare class ServerTransactionError extends ServerError {
    transaction_outcome: any;
}
export declare function parseRpcError(errorObj: Record<string, any>): ServerError;
export declare function parseResultError(result: any): ServerTransactionError;
export declare function formatError(errorClassName: string, errorData: any): string;
export declare function getErrorTypeFromErrorMessage(errorMessage: any, errorType: any): any;
export {};
