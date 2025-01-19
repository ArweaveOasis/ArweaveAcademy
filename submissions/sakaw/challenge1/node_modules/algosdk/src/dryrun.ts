import AlgodClient from './client/v2/algod/algod';
import {
  AccountStateDelta,
  Application,
  ApplicationParams,
  ApplicationStateSchema,
  DryrunRequest,
  DryrunSource,
  EvalDeltaKeyValue,
  TealValue,
} from './client/v2/algod/models/types';
import { SignedTransaction } from './transaction';
import { TransactionType } from './types/transactions';
import { encodeAddress, getApplicationAddress } from './encoding/address';

const defaultAppId = 1380011588;
const defaultMaxWidth = 30;

// When writing the DryrunRequest object as msgpack the output needs to be the byte arrays not b64 string
interface AppParamsWithPrograms {
  ['approval-program']: string | Uint8Array;
  ['clear-state-program']: string | Uint8Array;
  ['creator']: string;
}

interface AppWithAppParams {
  ['params']: AppParamsWithPrograms;
}

function decodePrograms(ap: AppWithAppParams): AppWithAppParams {
  // eslint-disable-next-line no-param-reassign
  ap.params['approval-program'] = Buffer.from(
    ap.params['approval-program'].toString(),
    'base64'
  );
  // eslint-disable-next-line no-param-reassign
  ap.params['clear-state-program'] = Buffer.from(
    ap.params['clear-state-program'].toString(),
    'base64'
  );

  return ap;
}

/**
 * createDryrun takes an Algod Client (from algod.AlgodV2Client) and an array of Signed Transactions
 * from (transaction.SignedTransaction) and creates a DryrunRequest object with relevant balances
 * @param client - the AlgodClient to make requests against
 * @param txns - the array of SignedTransaction to use for generating the DryrunRequest object
 * @param protocolVersion - the string representing the protocol version to use
 * @param latestTimestamp - the timestamp
 * @returns the DryrunRequest object constructed from the SignedTransactions passed
 */
export async function createDryrun({
  client,
  txns,
  protocolVersion,
  latestTimestamp,
  round,
  sources,
}: {
  client: AlgodClient;
  txns: SignedTransaction[];
  protocolVersion?: string;
  latestTimestamp?: number | bigint;
  round?: number | bigint;
  sources?: DryrunSource[];
}): Promise<DryrunRequest> {
  const appInfos = [];
  const acctInfos = [];

  const apps: number[] = [];
  const assets: number[] = [];
  const accts: string[] = [];

  for (const t of txns) {
    if (t.txn.type === TransactionType.appl) {
      accts.push(encodeAddress(t.txn.from.publicKey));

      if (t.txn.appAccounts)
        accts.push(...t.txn.appAccounts.map((a) => encodeAddress(a.publicKey)));

      if (t.txn.appForeignApps) {
        apps.push(...t.txn.appForeignApps);
        accts.push(
          ...t.txn.appForeignApps.map((aidx) => getApplicationAddress(aidx))
        );
      }

      if (t.txn.appForeignAssets) assets.push(...t.txn.appForeignAssets);

      // Create application,
      if (t.txn.appIndex === undefined || t.txn.appIndex === 0) {
        appInfos.push(
          new Application(
            defaultAppId,
            new ApplicationParams({
              creator: encodeAddress(t.txn.from.publicKey),
              approvalProgram: t.txn.appApprovalProgram,
              clearStateProgram: t.txn.appClearProgram,
              localStateSchema: new ApplicationStateSchema(
                t.txn.appLocalInts,
                t.txn.appLocalByteSlices
              ),
              globalStateSchema: new ApplicationStateSchema(
                t.txn.appGlobalInts,
                t.txn.appGlobalByteSlices
              ),
            })
          )
        );
      } else {
        apps.push(t.txn.appIndex);
        accts.push(getApplicationAddress(t.txn.appIndex));
      }
    }
  }

  // Dedupe and add creator to accts array
  const assetPromises = [];
  for (const assetId of [...new Set(assets)]) {
    assetPromises.push(
      client
        .getAssetByID(assetId)
        .do()
        .then((assetInfo) => {
          accts.push(assetInfo.params.creator);
        })
    );
  }
  // Wait for assets to finish since we append to accts array
  await Promise.all(assetPromises);

  // Dedupe and get app info for all apps
  const appPromises = [];
  for (const appId of [...new Set(apps)]) {
    appPromises.push(
      client
        .getApplicationByID(appId)
        .do()
        .then((appInfo) => {
          const ai = decodePrograms(appInfo as AppWithAppParams);
          appInfos.push(ai);
          accts.push(ai.params.creator);
        })
    );
  }
  await Promise.all(appPromises);

  const acctPromises = [];
  for (const acct of [...new Set(accts)]) {
    acctPromises.push(
      client
        .accountInformation(acct)
        .do()
        .then((acctInfo) => {
          if ('created-apps' in acctInfo) {
            // eslint-disable-next-line no-param-reassign
            acctInfo['created-apps'] = acctInfo['created-apps'].map((app) =>
              decodePrograms(app)
            );
          }
          acctInfos.push(acctInfo);
        })
    );
  }
  await Promise.all(acctPromises);

  return new DryrunRequest({
    txns: txns.map((st) => ({ ...st, txn: st.txn.get_obj_for_encoding() })),
    accounts: acctInfos,
    apps: appInfos,
    latestTimestamp,
    round,
    protocolVersion,
    sources,
  });
}

interface StackValueResponse {
  type: number;
  bytes: string;
  uint: number;
}

class DryrunStackValue {
  type: number = 0;
  bytes: string = '';
  uint: number = 0;

  constructor(sv: StackValueResponse) {
    this.type = sv.type;
    this.bytes = sv.bytes;
    this.uint = sv.uint;
  }

  toString(): string {
    if (this.type === 1) {
      return `0x${Buffer.from(this.bytes, 'base64').toString('hex')}`;
    }
    return this.uint.toString();
  }
}

interface DryrunTraceLineResponse {
  error: string;
  line: number;
  pc: number;
  scratch: TealValue[];
  stack: StackValueResponse[];
}

class DryrunTraceLine {
  error: string = '';
  line: number = 0;
  pc: number = 0;
  scratch: TealValue[] = [];
  stack: DryrunStackValue[] = [];

  constructor(line: DryrunTraceLineResponse) {
    this.error = line.error === undefined ? '' : line.error;
    this.line = line.line;
    this.pc = line.pc;
    this.scratch = line.scratch;
    this.stack = line.stack.map(
      (sv: StackValueResponse) => new DryrunStackValue(sv)
    );
  }
}

class DryrunTrace {
  trace: DryrunTraceLine[] = [];
  constructor(t: DryrunTraceLineResponse[]) {
    if (t == null) return;
    this.trace = t.map((line) => new DryrunTraceLine(line));
  }
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

function truncate(str: string, maxValueWidth: number): string {
  if (str.length > maxValueWidth && maxValueWidth > 0) {
    return `${str.slice(0, maxValueWidth)}...`;
  }
  return str;
}

function scratchToString(
  prevScratch: TealValue[],
  currScratch: TealValue[]
): string {
  if (currScratch.length === 0) return '';

  let newScratchIdx = null;
  for (let idx = 0; idx < currScratch.length; idx++) {
    if (idx > prevScratch.length) {
      newScratchIdx = idx;
      continue;
    }

    if (JSON.stringify(prevScratch[idx]) !== JSON.stringify(currScratch[idx])) {
      newScratchIdx = idx;
    }
  }

  if (newScratchIdx == null) return '';

  const newScratch = currScratch[newScratchIdx];
  if (newScratch.bytes.length > 0) {
    return `${newScratchIdx} = 0x${Buffer.from(
      newScratch.bytes,
      'base64'
    ).toString('hex')}`;
  }
  return `${newScratchIdx} = ${newScratch.uint.toString()}`;
}

function stackToString(stack: DryrunStackValue[], reverse: boolean): string {
  const svs = reverse ? stack.reverse() : stack;
  return `[${svs
    .map((sv: DryrunStackValue) => {
      switch (sv.type) {
        case 1:
          return `0x${Buffer.from(sv.bytes, 'base64').toString('hex')}`;
        case 2:
          return `${sv.uint.toString()}`;
        default:
          return '';
      }
    })
    .join(', ')}]`;
}

class DryrunTransactionResult {
  disassembly: string[] = [];
  appCallMessages: string[] | undefined = [];
  localDeltas: AccountStateDelta[] | undefined = [];
  globalDelta: EvalDeltaKeyValue[] | undefined = [];
  cost: number | undefined = 0;
  logicSigMessages: string[] | undefined = [];
  logicSigDisassembly: string[] | undefined = [];
  logs: string[] | undefined = [];

  appCallTrace: DryrunTrace | undefined = undefined;
  logicSigTrace: DryrunTrace | undefined = undefined;

  required = ['disassembly'];
  optionals = [
    'app-call-messages',
    'local-deltas',
    'global-delta',
    'cost',
    'logic-sig-messages',
    'logic-sig-disassembly',
    'logs',
  ];

  traces = ['app-call-trace', 'logic-sig-trace'];

  constructor(dtr: DryrunTransactionResultResponse) {
    this.disassembly = dtr.disassembly;
    this.appCallMessages = dtr['app-call-messages'];
    this.localDeltas = dtr['local-deltas'];
    this.globalDelta = dtr['global-delta'];
    this.cost = dtr.cost;
    this.logicSigMessages = dtr['logic-sig-messages'];
    this.logicSigDisassembly = dtr['logic-sig-disassembly'];
    this.logs = dtr.logs;
    this.appCallTrace = new DryrunTrace(dtr['app-call-trace']);
    this.logicSigTrace = new DryrunTrace(dtr['logic-sig-trace']);
  }

  appCallRejected(): boolean {
    return (
      this.appCallMessages !== undefined &&
      this.appCallMessages.includes('REJECT')
    );
  }

  logicSigRejected(): boolean {
    return (
      this.logicSigMessages !== undefined &&
      this.logicSigMessages.includes('REJECT')
    );
  }

  static trace(
    drt: DryrunTrace,
    disassembly: string[],
    spc: StackPrinterConfig
  ): string {
    const maxWidth = spc.maxValueWidth || defaultMaxWidth;

    // Create the array of arrays, each sub array contains N columns
    const lines = [['pc#', 'ln#', 'source', 'scratch', 'stack']];
    for (let idx = 0; idx < drt.trace.length; idx++) {
      const { line, error, pc, scratch, stack } = drt.trace[idx];

      const currScratch = scratch !== undefined ? scratch : [];
      const prevScratch =
        idx > 0 && drt.trace[idx - 1].scratch !== undefined
          ? drt.trace[idx - 1].scratch
          : [];

      const src = error === '' ? disassembly[line] : `!! ${error} !!`;

      lines.push([
        pc.toString().padEnd(3, ' '),
        line.toString().padEnd(3, ' '),
        truncate(src, maxWidth),
        truncate(scratchToString(prevScratch, currScratch), maxWidth),
        truncate(stackToString(stack, spc.topOfStackFirst), maxWidth),
      ]);
    }

    // Get the max length for each column
    const maxLengths = lines.reduce((prev, curr) => {
      const newVal = new Array(lines[0].length).fill(0);
      for (let idx = 0; idx < prev.length; idx++) {
        newVal[idx] =
          curr[idx].length > prev[idx] ? curr[idx].length : prev[idx];
      }
      return newVal;
    }, new Array(lines[0].length).fill(0));

    return `${lines
      .map((line) =>
        line
          .map((v, idx) => v.padEnd(maxLengths[idx] + 1, ' '))
          .join('|')
          .trim()
      )
      .join('\n')}\n`;
  }

  appTrace(spc?: StackPrinterConfig): string {
    if (this.appCallTrace === undefined || !this.disassembly) return '';

    let conf = spc;
    if (spc === undefined)
      conf = {
        maxValueWidth: defaultMaxWidth,
        topOfStackFirst: false,
      } as StackPrinterConfig;

    return DryrunTransactionResult.trace(
      this.appCallTrace,
      this.disassembly,
      conf
    );
  }

  lsigTrace(spc?: StackPrinterConfig): string {
    if (
      this.logicSigTrace === undefined ||
      this.logicSigDisassembly === undefined
    )
      return '';

    let conf = spc;
    if (spc === undefined)
      conf = {
        maxValueWidth: defaultMaxWidth,
        topOfStackFirst: true,
      } as StackPrinterConfig;

    return DryrunTransactionResult.trace(
      this.logicSigTrace,
      this.logicSigDisassembly,
      conf
    );
  }
}

interface DryrunResultResponse {
  ['error']: string;
  ['protocol-version']: string;
  ['txns']: DryrunTransactionResultResponse[];
}

export class DryrunResult {
  error: string = '';
  protocolVersion: string = '';
  txns: DryrunTransactionResult[] = [];
  constructor(drrResp: DryrunResultResponse) {
    this.error = drrResp.error;
    this.protocolVersion = drrResp['protocol-version'];
    this.txns = drrResp.txns.map(
      (txn: DryrunTransactionResultResponse) => new DryrunTransactionResult(txn)
    );
  }
}
