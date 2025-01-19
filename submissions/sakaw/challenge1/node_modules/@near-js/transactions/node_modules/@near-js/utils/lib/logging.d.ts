import { FinalExecutionOutcome } from '@near-js/types';
/**
 * Parse and print details from a query execution response
 * @param params
 * @param params.contractId ID of the account/contract which made the query
 * @param params.outcome the query execution response
 */
export declare function printTxOutcomeLogsAndFailures({ contractId, outcome, }: {
    contractId: string;
    outcome: FinalExecutionOutcome;
}): void;
/**
 * Format and print log output from a query execution response
 * @param params
 * @param params.contractId ID of the account/contract which made the query
 * @param params.logs log output from a query execution response
 * @param params.prefix string to append to the beginning of each log
 */
export declare function printTxOutcomeLogs({ contractId, logs, prefix, }: {
    contractId: string;
    logs: string[];
    prefix?: string;
}): void;
