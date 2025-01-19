import AlgodClient from './client/v2/algod/algod';
import { AccountStateDelta, DryrunRequest, DryrunSource, EvalDeltaKeyValue, TealValue } from './client/v2/algod/models/types';
import { SignedTransaction } from './transaction';
/**
 * createDryrun takes an Algod Client (from algod.AlgodV2Client) and an array of Signed Transactions
 * from (transaction.SignedTransaction) and creates a DryrunRequest object with relevant balances
 * @param client - the AlgodClient to make requests against
 * @param txns - the array of SignedTransaction to use for generating the DryrunRequest object
 * @param protocolVersion - the string representing the protocol version to use
 * @param latestTimestamp - the timestamp
 * @returns the DryrunRequest object constructed from the SignedTransactions passed
 */
export declare function createDryrun({ client, txns, protocolVersion, latestTimestamp, round, sources, }: {
    client: AlgodClient;
    txns: SignedTransaction[];
    protocolVersion?: string;
    latestTimestamp?: number | bigint;
    round?: number | bigint;
    sources?: DryrunSource[];
}): Promise<DryrunRequest>;
interface StackValueResponse {
    type: number;
    bytes: string;
    uint: number;
}
declare class DryrunStackValue {
    type: number;
    bytes: string;
    uint: number;
    constructor(sv: StackValueResponse);
    toString(): string;
}
interface DryrunTraceLineResponse {
    error: string;
    line: number;
    pc: number;
    scratch: TealValue[];
    stack: StackValueResponse[];
}
declare class DryrunTraceLine {
    error: string;
    line: number;
    pc: number;
    scratch: TealValue[];
    stack: DryrunStackValue[];
    constructor(line: DryrunTraceLineResponse);
}
declare class DryrunTrace {
    trace: DryrunTraceLine[];
    constructor(t: DryrunTraceLineResponse[]);
}
interface DryrunTransactionResultResponse {
    disassembly: string[];
    appCallMessages: string[] | undefined;
    localDeltas: AccountStateDelta[] | undefined;
    globalDelta: EvalDeltaKeyValue[] | undefined;
    cost: number | undefined;
    logicSigMessages: string[] | undefined;
    logicSigDisassembly: string[] | undefined;
    logs: string[] | undefined;
    appCallTrace: DryrunTrace | undefined;
    logicSigTrace: DryrunTrace | undefined;
}
interface StackPrinterConfig {
    maxValueWidth: number | undefined;
    topOfStackFirst: boolean | undefined;
}
declare class DryrunTransactionResult {
    disassembly: string[];
    appCallMessages: string[] | undefined;
    localDeltas: AccountStateDelta[] | undefined;
    globalDelta: EvalDeltaKeyValue[] | undefined;
    cost: number | undefined;
    logicSigMessages: string[] | undefined;
    logicSigDisassembly: string[] | undefined;
    logs: string[] | undefined;
    appCallTrace: DryrunTrace | undefined;
    logicSigTrace: DryrunTrace | undefined;
    required: string[];
    optionals: string[];
    traces: string[];
    constructor(dtr: DryrunTransactionResultResponse);
    appCallRejected(): boolean;
    logicSigRejected(): boolean;
    static trace(drt: DryrunTrace, disassembly: string[], spc: StackPrinterConfig): string;
    appTrace(spc?: StackPrinterConfig): string;
    lsigTrace(spc?: StackPrinterConfig): string;
}
interface DryrunResultResponse {
    ['error']: string;
    ['protocol-version']: string;
    ['txns']: DryrunTransactionResultResponse[];
}
export declare class DryrunResult {
    error: string;
    protocolVersion: string;
    txns: DryrunTransactionResult[];
    constructor(drrResp: DryrunResultResponse);
}
export {};
