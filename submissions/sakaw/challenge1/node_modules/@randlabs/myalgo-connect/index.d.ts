export type Address = string;
export type Base64 = string;
export type TxHash = string;

interface Txn {
	from: Address;
	fee: number;
	firstRound: number;
	lastRound: number;
	genesisID: string;
	genesisHash: Base64;
	note?: Uint8Array | Base64;
	reKeyTo?: Address;
	group?: Buffer | Base64;
	flatFee: boolean;
}

interface ConfigTxn extends Txn {
	type: "acfg";
	assetManager?: Address;
	assetReserve?: Address;
	assetFreeze?: Address;
	assetClawback?: Address;
}

interface TransferTxn extends Txn {
	to: Address;
	amount: number;
	closeRemainderTo?: Address;
}

export interface PaymentTxn extends TransferTxn {
	type: "pay";
}

export interface AssetTxn extends TransferTxn {
	type: "axfer";
	assetRevocationTarget?: Address;
	assetIndex: number;
}

export interface AssetConfigTxn extends ConfigTxn {
	assetIndex: number;
}

export interface AssetCreateTxn extends ConfigTxn {
	assetTotal?: number;
	assetDecimals?: number;
	assetDefaultFrozen?: boolean;
	assetName?: string;
	assetUnitName?: string;
	assetURL?: string;
	assetMetadataHash?: Uint8Array|Base64;
}

export interface DestroyAssetTxn extends ConfigTxn {
	assetIndex: number;
}

export interface FreezeAssetTxn extends Txn {
	type: "afrz";
	assetIndex: number;
	freezeAccount: Address;
	freezeState: boolean;
}

export interface KeyRegTxn extends Txn {
	type: "keyreg";
	voteKey?: Base64;
	selectionKey?: Base64;
	voteFirst: number;
	voteLast: number;
	voteKeyDilution?: number;
}

// eslint-disable-next-line no-shadow
export enum OnApplicationComplete {
	NoOpOC = 0,
	OptInOC = 1,
	CloseOutOC = 2,
	ClearStateOC = 3,
	UpdateApplicationOC = 4,
	DeleteApplicationOC = 5
}

export interface ApplicationTxn extends Txn {
	type: "appl";
	appArgs?: Uint8Array[] | Base64[];
	appAccounts?: Address[];
	appForeignApps?: number[];
	appForeignAssets?: number[];
}

export interface CreateApplTxn extends ApplicationTxn {
	appApprovalProgram: Uint8Array | Base64;
	appClearProgram: Uint8Array | Base64;
	appLocalInts: number;
	appLocalByteSlices: number;
	appGlobalInts: number;
	appGlobalByteSlices: number;
	appOnComplete?: OnApplicationComplete; // Default value is 0
	extraPages?: number;
}

export interface CallApplTxn extends ApplicationTxn {
	appIndex: number;
	appOnComplete: OnApplicationComplete.NoOpOC;
}

export interface OptInApplTxn extends ApplicationTxn {
	appIndex: number;
	appOnComplete: OnApplicationComplete.OptInOC;
}

export interface CloseOutApplTxn extends ApplicationTxn {
	appIndex: number;
	appOnComplete: OnApplicationComplete.CloseOutOC;
}

export interface ClearApplTxn extends ApplicationTxn {
	appIndex: number;
	appOnComplete: OnApplicationComplete.ClearStateOC;
}
export interface UpdateApplTxn extends ApplicationTxn {
	appIndex: number;
	appOnComplete: OnApplicationComplete.UpdateApplicationOC;
	appApprovalProgram: Uint8Array | Base64;
	appClearProgram: Uint8Array | Base64;
}

export interface DeleteApplTxn extends ApplicationTxn {
	appIndex: number;
	appOnComplete: OnApplicationComplete.DeleteApplicationOC;
}

export type ApplTxn = CreateApplTxn | CallApplTxn | OptInApplTxn | CloseOutApplTxn | ClearApplTxn | UpdateApplTxn;

export type EncodedTransaction = Base64 | Uint8Array;

export type AlgorandTxn = PaymentTxn | AssetTxn | AssetConfigTxn | AssetCreateTxn | DestroyAssetTxn | FreezeAssetTxn | KeyRegTxn | ApplTxn;

export type TxnStr = Base64;
export type SignedTxnStr = Base64;

export interface MultisigMetadata {
	// Multisig version
	version: number;

	// Multisig threshold value
	threshold: number;

	// Multisig Cosigners
	addrs: Address[];
}

export interface WalletTransaction {
	// Base64 encoding of the canonical msgpack encoding of a Transaction
	txn: TxnStr;

	// Optional authorized address used to sign the transaction when the account is rekeyed
	authAddr?: Address;

	// [Not Supported] Multisig metadata used to sign the transaction
	msig?: MultisigMetadata;

	// Optional list of addresses that must sign the transactions
	signers?: Address[];

	// Optional base64 encoding of the canonical msgpack encoding of a  SignedTxn corresponding to txn, when signers=[]
	stxn?: SignedTxnStr;

	// [Not Supported] Optional message explaining the reason of the transaction
	message?: string;

	// [Not Supported] Optional message explaining the reason of this group of transaction.
	// Field only allowed in the first transaction of a group
	groupMessage?: string;
}

export interface SignTxnsOpts {
	// [Not Supported] Optional message explaining the reason of the group of transactions
	message?: string;
}

export interface SignTxnsError extends Error {
	code: number;
	data?: any;
}

export interface SignedTx {
	// Transaction hash
	txID: TxHash;
	// Signed transaction
	blob: Uint8Array;
}

export interface Accounts {
	address: Address;
	name: string;
}

export interface Options {
	timeout?: number;
	bridgeUrl?: string;
	disableLedgerNano?: boolean;
}

export interface SignTransactionOptions {
	overrideSigner?: Address;
}

export interface ConnectionSettings {
	shouldSelectOneAccount?: boolean;
	openManager?: boolean;
}

export default class MyAlgoConnect {

	/**
	 * @param {Options} options Override default popup options.
	 */
	constructor(options?: Options);

	/**
	 * @async
	 * @description Receives user's accounts from MyAlgo.
	 * @param {ConnectionSettings} [settings] Connection settings
	 * @returns Returns an array of Algorand addresses.
	 */
	connect(settings?: ConnectionSettings): Promise<Accounts[]>;

	/**
	 * @async
	 * @description Sign an Algorand Transaction.
	 * @param transaction Expect a valid Algorand transaction
	 * @param signOptions Sign transactions options object.
	 * @returns Returns signed transaction
	 */
	signTransaction(transaction: AlgorandTxn | EncodedTransaction, signOptions?: SignTransactionOptions): Promise<SignedTx>;

	/**
	 * @async
	 * @description Sign an Algorand Transaction.
	 * @param transaction Expect a valid Algorand transaction array.
	 * @param signOptions Sign transactions options object.
	 * @returns Returns signed an array of signed transactions.
	 */
	signTransaction(transaction: (AlgorandTxn | EncodedTransaction)[], signOptions?: SignTransactionOptions): Promise<SignedTx[]>;

	/**
	 * @async
	 * @description Sign a set of transactions.
	 * @param txns A non-empty list of WalletTransaction objects.
	 * @param signOptions Sign transactions options object.
	 * @returns Returns an array of base64 encoding of the signed transaction, or null where the transaction was not to be signed
	 */
	signTxns(txns: WalletTransaction[], opts?: SignTxnsOpts): Promise<(SignedTxnStr | null)[]>;

	/**
	 * @async
	 * @description Sign a teal program
	 * @param logic Teal program
	 * @param address Signer Address
	 * @returns Returns signed teal
	 */
	signLogicSig(logic: Uint8Array | Base64, address: Address): Promise<Uint8Array>;

	/**
	 * @async
	 * @description Creates a signature the data that can later be verified by the contract through the ed25519verify opcode
	 * @param data Arbitrary data to sign
	 * @param contractAddress Contract address/TEAL program hash
	 * @param address Signer Address
	 * @returns Returns the data signature
	 */
	tealSign(data: Uint8Array | Base64, contractAddress: Address, address: Address): Promise<Uint8Array>;

	/**
	 * @async
	 * @description Sign an arbitrary array of bytes
	 * @param bytes Bytes to sign
	 * @param address Signer Address
	 * @returns Returns bytes signature
	 */
	signBytes(bytes: Uint8Array, address: Address): Promise<Uint8Array>;
}
