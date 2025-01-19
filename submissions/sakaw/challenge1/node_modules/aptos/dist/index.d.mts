import nacl from 'tweetnacl';
import EventEmitter from 'eventemitter3';

declare const APTOS_COIN = "0x1::aptos_coin::AptosCoin";

type Seq<T> = T[];
type Uint8 = number;
type Uint16 = number;
type Uint32 = number;
type Uint64 = bigint;
type Uint128 = bigint;
type Uint256 = bigint;
type AnyNumber = bigint | number;
type Bytes = Uint8Array;

declare class Serializer {
    private buffer;
    private offset;
    constructor();
    private ensureBufferWillHandleSize;
    protected serialize(values: Bytes): void;
    private serializeWithFunction;
    /**
     * Serializes a string. UTF8 string is supported. Serializes the string's bytes length "l" first,
     * and then serializes "l" bytes of the string content.
     *
     * BCS layout for "string": string_length | string_content. string_length is the bytes length of
     * the string that is uleb128 encoded. string_length is a u32 integer.
     *
     * @example
     * ```ts
     * const serializer = new Serializer();
     * serializer.serializeStr("çå∞≠¢õß∂ƒ∫");
     * assert(serializer.getBytes() === new Uint8Array([24, 0xc3, 0xa7, 0xc3, 0xa5, 0xe2, 0x88, 0x9e,
     * 0xe2, 0x89, 0xa0, 0xc2, 0xa2, 0xc3, 0xb5, 0xc3, 0x9f, 0xe2, 0x88, 0x82, 0xc6, 0x92, 0xe2, 0x88, 0xab]));
     * ```
     */
    serializeStr(value: string): void;
    /**
     * Serializes an array of bytes.
     *
     * BCS layout for "bytes": bytes_length | bytes. bytes_length is the length of the bytes array that is
     * uleb128 encoded. bytes_length is a u32 integer.
     */
    serializeBytes(value: Bytes): void;
    /**
     * Serializes an array of bytes with known length. Therefore length doesn't need to be
     * serialized to help deserialization.  When deserializing, the number of
     * bytes to deserialize needs to be passed in.
     */
    serializeFixedBytes(value: Bytes): void;
    /**
     * Serializes a boolean value.
     *
     * BCS layout for "boolean": One byte. "0x01" for True and "0x00" for False.
     */
    serializeBool(value: boolean): void;
    /**
     * Serializes a uint8 number.
     *
     * BCS layout for "uint8": One byte. Binary format in little-endian representation.
     */
    serializeU8(value: Uint8): void;
    /**
     * Serializes a uint16 number.
     *
     * BCS layout for "uint16": Two bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const serializer = new Serializer();
     * serializer.serializeU16(4660);
     * assert(serializer.getBytes() === new Uint8Array([0x34, 0x12]));
     * ```
     */
    serializeU16(value: Uint16): void;
    /**
     * Serializes a uint32 number.
     *
     * BCS layout for "uint32": Four bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const serializer = new Serializer();
     * serializer.serializeU32(305419896);
     * assert(serializer.getBytes() === new Uint8Array([0x78, 0x56, 0x34, 0x12]));
     * ```
     */
    serializeU32(value: Uint32): void;
    /**
     * Serializes a uint64 number.
     *
     * BCS layout for "uint64": Eight bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const serializer = new Serializer();
     * serializer.serializeU64(1311768467750121216);
     * assert(serializer.getBytes() === new Uint8Array([0x00, 0xEF, 0xCD, 0xAB, 0x78, 0x56, 0x34, 0x12]));
     * ```
     */
    serializeU64(value: AnyNumber): void;
    /**
     * Serializes a uint128 number.
     *
     * BCS layout for "uint128": Sixteen bytes. Binary format in little-endian representation.
     */
    serializeU128(value: AnyNumber): void;
    /**
     * Serializes a uint256 number.
     *
     * BCS layout for "uint256": Sixteen bytes. Binary format in little-endian representation.
     */
    serializeU256(value: AnyNumber): void;
    /**
     * Serializes a uint32 number with uleb128.
     *
     * BCS use uleb128 encoding in two cases: (1) lengths of variable-length sequences and (2) tags of enum values
     */
    serializeU32AsUleb128(val: Uint32): void;
    /**
     * Returns the buffered bytes
     */
    getBytes(): Bytes;
}

declare class Deserializer {
    private buffer;
    private offset;
    constructor(data: Bytes);
    private read;
    /**
     * Deserializes a string. UTF8 string is supported. Reads the string's bytes length "l" first,
     * and then reads "l" bytes of content. Decodes the byte array into a string.
     *
     * BCS layout for "string": string_length | string_content. string_length is the bytes length of
     * the string that is uleb128 encoded. string_length is a u32 integer.
     *
     * @example
     * ```ts
     * const deserializer = new Deserializer(new Uint8Array([24, 0xc3, 0xa7, 0xc3, 0xa5, 0xe2, 0x88, 0x9e,
     * 0xe2, 0x89, 0xa0, 0xc2, 0xa2, 0xc3, 0xb5, 0xc3, 0x9f, 0xe2, 0x88, 0x82, 0xc6, 0x92, 0xe2, 0x88, 0xab]));
     * assert(deserializer.deserializeStr() === "çå∞≠¢õß∂ƒ∫");
     * ```
     */
    deserializeStr(): string;
    /**
     * Deserializes an array of bytes.
     *
     * BCS layout for "bytes": bytes_length | bytes. bytes_length is the length of the bytes array that is
     * uleb128 encoded. bytes_length is a u32 integer.
     */
    deserializeBytes(): Bytes;
    /**
     * Deserializes an array of bytes. The number of bytes to read is already known.
     *
     */
    deserializeFixedBytes(len: number): Bytes;
    /**
     * Deserializes a boolean value.
     *
     * BCS layout for "boolean": One byte. "0x01" for True and "0x00" for False.
     */
    deserializeBool(): boolean;
    /**
     * Deserializes a uint8 number.
     *
     * BCS layout for "uint8": One byte. Binary format in little-endian representation.
     */
    deserializeU8(): Uint8;
    /**
     * Deserializes a uint16 number.
     *
     * BCS layout for "uint16": Two bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const deserializer = new Deserializer(new Uint8Array([0x34, 0x12]));
     * assert(deserializer.deserializeU16() === 4660);
     * ```
     */
    deserializeU16(): Uint16;
    /**
     * Deserializes a uint32 number.
     *
     * BCS layout for "uint32": Four bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const deserializer = new Deserializer(new Uint8Array([0x78, 0x56, 0x34, 0x12]));
     * assert(deserializer.deserializeU32() === 305419896);
     * ```
     */
    deserializeU32(): Uint32;
    /**
     * Deserializes a uint64 number.
     *
     * BCS layout for "uint64": Eight bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const deserializer = new Deserializer(new Uint8Array([0x00, 0xEF, 0xCD, 0xAB, 0x78, 0x56, 0x34, 0x12]));
     * assert(deserializer.deserializeU64() === 1311768467750121216);
     * ```
     */
    deserializeU64(): Uint64;
    /**
     * Deserializes a uint128 number.
     *
     * BCS layout for "uint128": Sixteen bytes. Binary format in little-endian representation.
     */
    deserializeU128(): Uint128;
    /**
     * Deserializes a uint256 number.
     *
     * BCS layout for "uint256": Thirty-two bytes. Binary format in little-endian representation.
     */
    deserializeU256(): Uint256;
    /**
     * Deserializes a uleb128 encoded uint32 number.
     *
     * BCS use uleb128 encoding in two cases: (1) lengths of variable-length sequences and (2) tags of enum values
     */
    deserializeUleb128AsU32(): Uint32;
}

interface Serializable {
    serialize(serializer: Serializer): void;
}
/**
 * Serializes a vector values that are "Serializable".
 */
declare function serializeVector<T extends Serializable>(value: Seq<T>, serializer: Serializer): void;
/**
 * Serializes a vector with specified item serialization function.
 * Very dynamic function and bypasses static typechecking.
 */
declare function serializeVectorWithFunc(value: any[], func: string): Bytes;
/**
 * Deserializes a vector of values.
 */
declare function deserializeVector(deserializer: Deserializer, cls: any): any[];
declare function bcsToBytes<T extends Serializable>(value: T): Bytes;
declare function bcsSerializeUint64(value: AnyNumber): Bytes;
declare function bcsSerializeU8(value: Uint8): Bytes;
declare function bcsSerializeU16(value: Uint16): Bytes;
declare function bcsSerializeU32(value: Uint32): Bytes;
declare function bcsSerializeU128(value: AnyNumber): Bytes;
declare function bcsSerializeU256(value: AnyNumber): Bytes;
declare function bcsSerializeBool(value: boolean): Bytes;
declare function bcsSerializeStr(value: string): Bytes;
declare function bcsSerializeBytes(value: Bytes): Bytes;
declare function bcsSerializeFixedBytes(value: Bytes): Bytes;

type index$2_AnyNumber = AnyNumber;
type index$2_Bytes = Bytes;
type index$2_Deserializer = Deserializer;
declare const index$2_Deserializer: typeof Deserializer;
type index$2_Seq<T> = Seq<T>;
type index$2_Serializer = Serializer;
declare const index$2_Serializer: typeof Serializer;
type index$2_Uint128 = Uint128;
type index$2_Uint16 = Uint16;
type index$2_Uint256 = Uint256;
type index$2_Uint32 = Uint32;
type index$2_Uint64 = Uint64;
type index$2_Uint8 = Uint8;
declare const index$2_bcsSerializeBool: typeof bcsSerializeBool;
declare const index$2_bcsSerializeBytes: typeof bcsSerializeBytes;
declare const index$2_bcsSerializeFixedBytes: typeof bcsSerializeFixedBytes;
declare const index$2_bcsSerializeStr: typeof bcsSerializeStr;
declare const index$2_bcsSerializeU128: typeof bcsSerializeU128;
declare const index$2_bcsSerializeU16: typeof bcsSerializeU16;
declare const index$2_bcsSerializeU256: typeof bcsSerializeU256;
declare const index$2_bcsSerializeU32: typeof bcsSerializeU32;
declare const index$2_bcsSerializeU8: typeof bcsSerializeU8;
declare const index$2_bcsSerializeUint64: typeof bcsSerializeUint64;
declare const index$2_bcsToBytes: typeof bcsToBytes;
declare const index$2_deserializeVector: typeof deserializeVector;
declare const index$2_serializeVector: typeof serializeVector;
declare const index$2_serializeVectorWithFunc: typeof serializeVectorWithFunc;
declare namespace index$2 {
  export { type index$2_AnyNumber as AnyNumber, type index$2_Bytes as Bytes, index$2_Deserializer as Deserializer, type index$2_Seq as Seq, index$2_Serializer as Serializer, type index$2_Uint128 as Uint128, type index$2_Uint16 as Uint16, type index$2_Uint256 as Uint256, type index$2_Uint32 as Uint32, type index$2_Uint64 as Uint64, type index$2_Uint8 as Uint8, index$2_bcsSerializeBool as bcsSerializeBool, index$2_bcsSerializeBytes as bcsSerializeBytes, index$2_bcsSerializeFixedBytes as bcsSerializeFixedBytes, index$2_bcsSerializeStr as bcsSerializeStr, index$2_bcsSerializeU128 as bcsSerializeU128, index$2_bcsSerializeU16 as bcsSerializeU16, index$2_bcsSerializeU256 as bcsSerializeU256, index$2_bcsSerializeU32 as bcsSerializeU32, index$2_bcsSerializeU8 as bcsSerializeU8, index$2_bcsSerializeUint64 as bcsSerializeUint64, index$2_bcsToBytes as bcsToBytes, index$2_deserializeVector as deserializeVector, index$2_serializeVector as serializeVector, index$2_serializeVectorWithFunc as serializeVectorWithFunc };
}

/**
 * A configuration object we can pass with the request to the server.
 *
 * @param TOKEN - an auth token to send with the request
 * @param HEADERS - extra headers we want to send with the request
 * @param WITH_CREDENTIALS - whether to carry cookies. By default, it is set to true and cookies will be sent
 */
type ClientConfig = {
    TOKEN?: string;
    HEADERS?: Record<string, string | number | boolean>;
    WITH_CREDENTIALS?: boolean;
};
/**
 * The API request type
 *
 * @param url - the url to make the request to, i.e https://fullnode.aptoslabs.devnet.com/v1
 * @param method - the request method "GET" | "POST"
 * @param endpoint (optional) - the endpoint to make the request to, i.e transactions
 * @param body (optional) - the body of the request
 * @param contentType (optional) - the content type to set the `content-type` header to,
 * by default is set to `application/json`
 * @param params (optional) - query params to add to the request
 * @param originMethod (optional) - the local method the request came from
 * @param overrides (optional) - a `ClientConfig` object type to override request data
 */
type AptosRequest = {
    url: string;
    method: "GET" | "POST";
    endpoint?: string;
    body?: any;
    contentType?: string;
    params?: Record<string, string | AnyNumber | boolean | undefined>;
    originMethod?: string;
    overrides?: ClientConfig;
};
/**
 * The API response type
 *
 * @param status - the response status. i.e 200
 * @param statusText - the response message
 * @param data the response data
 * @param url the url the request was made to
 * @param headers the response headers
 * @param config (optional) - the request object
 * @param request (optional) - the request object
 */
interface AptosResponse<Req, Res> {
    status: number;
    statusText: string;
    data: Res;
    url: string;
    headers: any;
    config?: any;
    request?: Req;
}
/**
 * The type returned from an API error
 *
 * @param name - the error name "AptosApiError"
 * @param url the url the request was made to
 * @param status - the response status. i.e 400
 * @param statusText - the response message
 * @param data the response data
 * @param request - the AptosRequest
 */
declare class AptosApiError extends Error {
    readonly url: string;
    readonly status: number;
    readonly statusText: string;
    readonly data: any;
    readonly request: AptosRequest;
    constructor(request: AptosRequest, response: AptosResponse<any, any>, message: string);
}

/**
 * The main function to use when doing an API request.
 *
 * @param options AptosRequest
 * @returns the response or AptosApiError
 */
declare function aptosRequest<Req, Res>(options: AptosRequest): Promise<AptosResponse<Req, Res>>;

type GetRequestOptions = Omit<AptosRequest, "body" | "method">;
/**
 * Main function to do a Get request
 *
 * @param options GetRequestOptions
 * @returns
 */
declare function get<Req, Res>(options: GetRequestOptions): Promise<AptosResponse<Req, Res>>;

type PostRequestOptions = Omit<AptosRequest, "method">;
/**
 * Main function to do a Post request
 *
 * @param options PostRequestOptions
 * @returns
 */
declare function post<Req, Res>(options: PostRequestOptions): Promise<AptosResponse<Req, Res>>;

declare const NetworkToIndexerAPI: Record<string, string>;
declare const NetworkToNodeAPI: Record<string, string>;
declare const NodeAPIToNetwork: Record<string, string>;
declare enum Network {
    MAINNET = "mainnet",
    TESTNET = "testnet",
    DEVNET = "devnet",
    LOCAL = "local"
}
interface CustomEndpoints {
    fullnodeUrl: string;
    indexerUrl?: string;
}

/**
 * All bytes (Vec<u8>) data is represented as hex-encoded string prefixed with `0x` and fulfilled with
 * two hex digits per byte.
 *
 * Unlike the `Address` type, HexEncodedBytes will not trim any zeros.
 *
 */
type HexEncodedBytes = string;

/**
 * A string containing a 64-bit unsigned integer.
 *
 * We represent u64 values as a string to ensure compatibility with languages such
 * as JavaScript that do not parse u64s in JSON natively.
 *
 */
type U64$1 = string;

/**
 * Account data
 *
 * A simplified version of the onchain Account resource
 */
type AccountData = {
    sequence_number: U64$1;
    authentication_key: HexEncodedBytes;
};

/**
 * A single Ed25519 signature
 */
type Ed25519Signature$1 = {
    public_key: HexEncodedBytes;
    signature: HexEncodedBytes;
};

type AccountSignature_Ed25519Signature = ({
    type: string;
} & Ed25519Signature$1);

/**
 * A Ed25519 multi-sig signature
 *
 * This allows k-of-n signing for a transaction
 */
type MultiEd25519Signature$1 = {
    /**
     * The public keys for the Ed25519 signature
     */
    public_keys: Array<HexEncodedBytes>;
    /**
     * Signature associated with the public keys in the same order
     */
    signatures: Array<HexEncodedBytes>;
    /**
     * The number of signatures required for a successful transaction
     */
    threshold: number;
    bitmap: HexEncodedBytes;
};

type AccountSignature_MultiEd25519Signature = ({
    type: string;
} & MultiEd25519Signature$1);

type Signature_string_HexEncodedBytes_ = ({
    type: string;
} & HexEncodedBytes);

type Signature = Signature_string_HexEncodedBytes_;

type IndexedSignature = {
    index: number;
    signature: Signature;
};

type PublicKey_string_HexEncodedBytes_ = ({
    type: string;
} & HexEncodedBytes);

type PublicKey = PublicKey_string_HexEncodedBytes_;

/**
 * A multi key signature
 */
type MultiKeySignature = {
    public_keys: Array<PublicKey>;
    signatures: Array<IndexedSignature>;
    signatures_required: number;
};

type AccountSignature_MultiKeySignature = ({
    type: string;
} & MultiKeySignature);

/**
 * A single key signature
 */
type SingleKeySignature = {
    public_key: PublicKey;
    signature: Signature;
};

type AccountSignature_SingleKeySignature = ({
    type: string;
} & SingleKeySignature);

/**
 * Account signature scheme
 *
 * The account signature scheme allows you to have two types of accounts:
 *
 * 1. A single Ed25519 key account, one private key
 * 2. A k-of-n multi-Ed25519 key account, multiple private keys, such that k-of-n must sign a transaction.
 * 3. A single Secp256k1Ecdsa key account, one private key
 */
type AccountSignature = (AccountSignature_Ed25519Signature | AccountSignature_MultiEd25519Signature | AccountSignature_SingleKeySignature | AccountSignature_MultiKeySignature);

/**
 * A hex encoded 32 byte Aptos account address.
 *
 * This is represented in a string as a 64 character hex string, sometimes
 * shortened by stripping leading 0s, and adding a 0x.
 *
 * For example, address 0x0000000000000000000000000000000000000000000000000000000000000001 is represented as 0x1.
 *
 */
type Address = string;

/**
 * These codes provide more granular error information beyond just the HTTP
 * status code of the response.
 */
declare enum AptosErrorCode {
    ACCOUNT_NOT_FOUND = "account_not_found",
    RESOURCE_NOT_FOUND = "resource_not_found",
    MODULE_NOT_FOUND = "module_not_found",
    STRUCT_FIELD_NOT_FOUND = "struct_field_not_found",
    VERSION_NOT_FOUND = "version_not_found",
    TRANSACTION_NOT_FOUND = "transaction_not_found",
    TABLE_ITEM_NOT_FOUND = "table_item_not_found",
    BLOCK_NOT_FOUND = "block_not_found",
    STATE_VALUE_NOT_FOUND = "state_value_not_found",
    VERSION_PRUNED = "version_pruned",
    BLOCK_PRUNED = "block_pruned",
    INVALID_INPUT = "invalid_input",
    INVALID_TRANSACTION_UPDATE = "invalid_transaction_update",
    SEQUENCE_NUMBER_TOO_OLD = "sequence_number_too_old",
    VM_ERROR = "vm_error",
    HEALTH_CHECK_FAILED = "health_check_failed",
    MEMPOOL_IS_FULL = "mempool_is_full",
    INTERNAL_ERROR = "internal_error",
    WEB_FRAMEWORK_ERROR = "web_framework_error",
    BCS_NOT_SUPPORTED = "bcs_not_supported",
    API_DISABLED = "api_disabled"
}

/**
 * This is the generic struct we use for all API errors, it contains a string
 * message and an Aptos API specific error code.
 */
type AptosError = {
    /**
     * A message describing the error
     */
    message: string;
    error_code: AptosErrorCode;
    /**
     * A code providing VM error details when submitting transactions to the VM
     */
    vm_error_code?: number;
};

type HashValue = string;

type EventGuid = {
    creation_number: U64$1;
    account_address: Address;
};

/**
 * String representation of an on-chain Move type tag that is exposed in transaction payload.
 * Values:
 * - bool
 * - u8
 * - u16
 * - u32
 * - u64
 * - u128
 * - u256
 * - address
 * - signer
 * - vector: `vector<{non-reference MoveTypeId}>`
 * - struct: `{address}::{module_name}::{struct_name}::<{generic types}>`
 *
 * Vector type value examples:
 * - `vector<u8>`
 * - `vector<vector<u64>>`
 * - `vector<0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>>`
 *
 * Struct type value examples:
 * - `0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>
 * - `0x1::account::Account`
 *
 * Note:
 * 1. Empty chars should be ignored when comparing 2 struct tag ids.
 * 2. When used in an URL path, should be encoded by url-encoding (AKA percent-encoding).
 *
 */
type MoveType = string;

/**
 * An event from a transaction
 */
type Event = {
    guid: EventGuid;
    sequence_number: U64$1;
    type: MoveType;
    /**
     * The JSON representation of the event
     */
    data: any;
};

/**
 * Move module id is a string representation of Move module.
 *
 * Format: `{address}::{module name}`
 *
 * `address` should be hex-encoded 32 byte account address that is prefixed with `0x`.
 *
 * Module name is case-sensitive.
 *
 */
type MoveModuleId = string;

/**
 * Delete a module
 */
type DeleteModule = {
    address: Address;
    /**
     * State key hash
     */
    state_key_hash: string;
    module: MoveModuleId;
};

type WriteSetChange_DeleteModule = ({
    type: string;
} & DeleteModule);

/**
 * String representation of a MoveStructTag (on-chain Move struct type). This exists so you
 * can specify MoveStructTags as path / query parameters, e.g. for get_events_by_event_handle.
 *
 * It is a combination of:
 * 1. `move_module_address`, `module_name` and `struct_name`, all joined by `::`
 * 2. `struct generic type parameters` joined by `, `
 *
 * Examples:
 * * `0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>`
 * * `0x1::account::Account`
 *
 * Note:
 * 1. Empty chars should be ignored when comparing 2 struct tag ids.
 * 2. When used in an URL path, should be encoded by url-encoding (AKA percent-encoding).
 *
 * See [doc](https://aptos.dev/concepts/accounts) for more details.
 *
 */
type MoveStructTag = string;

/**
 * Delete a resource
 */
type DeleteResource = {
    address: Address;
    /**
     * State key hash
     */
    state_key_hash: string;
    resource: MoveStructTag;
};

type WriteSetChange_DeleteResource = ({
    type: string;
} & DeleteResource);

/**
 * Deleted table data
 */
type DeletedTableData = {
    /**
     * Deleted key
     */
    key: any;
    /**
     * Deleted key type
     */
    key_type: string;
};

/**
 * Delete a table item
 */
type DeleteTableItem = {
    state_key_hash: string;
    handle: HexEncodedBytes;
    key: HexEncodedBytes;
    data?: DeletedTableData;
};

type WriteSetChange_DeleteTableItem = ({
    type: string;
} & DeleteTableItem);

type IdentifierWrapper = string;

type MoveAbility = string;

/**
 * Move function generic type param
 */
type MoveFunctionGenericTypeParam = {
    /**
     * Move abilities tied to the generic type param and associated with the function that uses it
     */
    constraints: Array<MoveAbility>;
};

/**
 * Move function visibility
 */
declare enum MoveFunctionVisibility {
    PRIVATE = "private",
    PUBLIC = "public",
    FRIEND = "friend"
}

/**
 * Move function
 */
type MoveFunction = {
    name: IdentifierWrapper;
    visibility: MoveFunctionVisibility;
    /**
     * Whether the function can be called as an entry function directly in a transaction
     */
    is_entry: boolean;
    /**
     * Whether the function is a view function or not
     */
    is_view: boolean;
    /**
     * Generic type params associated with the Move function
     */
    generic_type_params: Array<MoveFunctionGenericTypeParam>;
    /**
     * Parameters associated with the move function
     */
    params: Array<MoveType>;
    /**
     * Return type of the function
     */
    return: Array<MoveType>;
};

/**
 * Move struct field
 */
type MoveStructField = {
    name: IdentifierWrapper;
    type: MoveType;
};

/**
 * Move generic type param
 */
type MoveStructGenericTypeParam = {
    /**
     * Move abilities tied to the generic type param and associated with the type that uses it
     */
    constraints: Array<MoveAbility>;
};

/**
 * A move struct
 */
type MoveStruct = {
    name: IdentifierWrapper;
    /**
     * Whether the struct is a native struct of Move
     */
    is_native: boolean;
    /**
     * Abilities associated with the struct
     */
    abilities: Array<MoveAbility>;
    /**
     * Generic types associated with the struct
     */
    generic_type_params: Array<MoveStructGenericTypeParam>;
    /**
     * Fields associated with the struct
     */
    fields: Array<MoveStructField>;
};

/**
 * A Move module
 */
type MoveModule = {
    address: Address;
    name: IdentifierWrapper;
    /**
     * Friends of the module
     */
    friends: Array<MoveModuleId>;
    /**
     * Public functions of the module
     */
    exposed_functions: Array<MoveFunction>;
    /**
     * Structs of the module
     */
    structs: Array<MoveStruct>;
};

/**
 * Move module bytecode along with it's ABI
 */
type MoveModuleBytecode = {
    bytecode: HexEncodedBytes;
    abi?: MoveModule;
};

/**
 * Write a new module or update an existing one
 */
type WriteModule = {
    address: Address;
    /**
     * State key hash
     */
    state_key_hash: string;
    data: MoveModuleBytecode;
};

type WriteSetChange_WriteModule = ({
    type: string;
} & WriteModule);

/**
 * This is a JSON representation of some data within an account resource. More specifically,
 * it is a map of strings to arbitrary JSON values / objects, where the keys are top level
 * fields within the given resource.
 *
 * To clarify, you might query for 0x1::account::Account and see the example data.
 *
 * Move `bool` type value is serialized into `boolean`.
 *
 * Move `u8`, `u16` and `u32` type value is serialized into `integer`.
 *
 * Move `u64`, `u128` and `u256` type value is serialized into `string`.
 *
 * Move `address` type value (32 byte Aptos account address) is serialized into a HexEncodedBytes string.
 * For example:
 * - `0x1`
 * - `0x1668f6be25668c1a17cd8caf6b8d2f25`
 *
 * Move `vector` type value is serialized into `array`, except `vector<u8>` which is serialized into a
 * HexEncodedBytes string with `0x` prefix.
 * For example:
 * - `vector<u64>{255, 255}` => `["255", "255"]`
 * - `vector<u8>{255, 255}` => `0xffff`
 *
 * Move `struct` type value is serialized into `object` that looks like this (except some Move stdlib types, see the following section):
 * ```json
 * {
     * field1_name: field1_value,
     * field2_name: field2_value,
     * ......
     * }
     * ```
     *
     * For example:
     * `{ "created": "0xa550c18", "role_id": "0" }`
     *
     * **Special serialization for Move stdlib types**:
     * - [0x1::string::String](https://github.com/aptos-labs/aptos-core/blob/main/language/move-stdlib/docs/ascii.md)
     * is serialized into `string`. For example, struct value `0x1::string::String{bytes: b"Hello World!"}`
     * is serialized as `"Hello World!"` in JSON.
     *
     */
type MoveStructValue = {};

/**
 * A parsed Move resource
 */
type MoveResource = {
    type: MoveStructTag;
    data: MoveStructValue;
};

/**
 * Write a resource or update an existing one
 */
type WriteResource = {
    address: Address;
    /**
     * State key hash
     */
    state_key_hash: string;
    data: MoveResource;
};

type WriteSetChange_WriteResource = ({
    type: string;
} & WriteResource);

/**
 * Decoded table data
 */
type DecodedTableData = {
    /**
     * Key of table in JSON
     */
    key: any;
    /**
     * Type of key
     */
    key_type: string;
    /**
     * Value of table in JSON
     */
    value: any;
    /**
     * Type of value
     */
    value_type: string;
};

/**
 * Change set to write a table item
 */
type WriteTableItem = {
    state_key_hash: string;
    handle: HexEncodedBytes;
    key: HexEncodedBytes;
    value: HexEncodedBytes;
    data?: DecodedTableData;
};

type WriteSetChange_WriteTableItem = ({
    type: string;
} & WriteTableItem);

/**
 * A final state change of a transaction on a resource or module
 */
type WriteSetChange = (WriteSetChange_DeleteModule | WriteSetChange_DeleteResource | WriteSetChange_DeleteTableItem | WriteSetChange_WriteModule | WriteSetChange_WriteResource | WriteSetChange_WriteTableItem);

/**
 * A block metadata transaction
 *
 * This signifies the beginning of a block, and contains information
 * about the specific block
 */
type BlockMetadataTransaction = {
    version: U64$1;
    hash: HashValue;
    state_change_hash: HashValue;
    event_root_hash: HashValue;
    state_checkpoint_hash?: HashValue;
    gas_used: U64$1;
    /**
     * Whether the transaction was successful
     */
    success: boolean;
    /**
     * The VM status of the transaction, can tell useful information in a failure
     */
    vm_status: string;
    accumulator_root_hash: HashValue;
    /**
     * Final state of resources changed by the transaction
     */
    changes: Array<WriteSetChange>;
    id: HashValue;
    epoch: U64$1;
    round: U64$1;
    /**
     * The events emitted at the block creation
     */
    events: Array<Event>;
    /**
     * Previous block votes
     */
    previous_block_votes_bitvec: Array<number>;
    proposer: Address;
    /**
     * The indices of the proposers who failed to propose
     */
    failed_proposer_indices: Array<number>;
    timestamp: U64$1;
};

type Transaction_BlockMetadataTransaction = ({
    type: string;
} & BlockMetadataTransaction);

type DirectWriteSet = {
    changes: Array<WriteSetChange>;
    events: Array<Event>;
};

type WriteSet_DirectWriteSet = ({
    type: string;
} & DirectWriteSet);

/**
 * Move script bytecode
 */
type MoveScriptBytecode = {
    bytecode: HexEncodedBytes;
    abi?: MoveFunction;
};

/**
 * Payload which runs a script that can run multiple functions
 */
type ScriptPayload = {
    code: MoveScriptBytecode;
    /**
     * Type arguments of the function
     */
    type_arguments: Array<MoveType>;
    /**
     * Arguments of the function
     */
    arguments: Array<any>;
};

type ScriptWriteSet = {
    execute_as: Address;
    script: ScriptPayload;
};

type WriteSet_ScriptWriteSet = ({
    type: string;
} & ScriptWriteSet);

/**
 * The associated writeset with a payload
 */
type WriteSet$1 = (WriteSet_ScriptWriteSet | WriteSet_DirectWriteSet);

/**
 * A writeset payload, used only for genesis
 */
type WriteSetPayload = {
    write_set: WriteSet$1;
};

type GenesisPayload_WriteSetPayload = ({
    type: string;
} & WriteSetPayload);

/**
 * The writeset payload of the Genesis transaction
 */
type GenesisPayload = GenesisPayload_WriteSetPayload;

/**
 * The genesis transaction
 *
 * This only occurs at the genesis transaction (version 0)
 */
type GenesisTransaction = {
    version: U64$1;
    hash: HashValue;
    state_change_hash: HashValue;
    event_root_hash: HashValue;
    state_checkpoint_hash?: HashValue;
    gas_used: U64$1;
    /**
     * Whether the transaction was successful
     */
    success: boolean;
    /**
     * The VM status of the transaction, can tell useful information in a failure
     */
    vm_status: string;
    accumulator_root_hash: HashValue;
    /**
     * Final state of resources changed by the transaction
     */
    changes: Array<WriteSetChange>;
    payload: GenesisPayload;
    /**
     * Events emitted during genesis
     */
    events: Array<Event>;
};

type Transaction_GenesisTransaction = ({
    type: string;
} & GenesisTransaction);

/**
 * Entry function id is string representation of a entry function defined on-chain.
 *
 * Format: `{address}::{module name}::{function name}`
 *
 * Both `module name` and `function name` are case-sensitive.
 *
 */
type EntryFunctionId = string;

/**
 * Payload which runs a single entry function
 */
type EntryFunctionPayload = {
    function: EntryFunctionId;
    /**
     * Type arguments of the function
     */
    type_arguments: Array<MoveType>;
    /**
     * Arguments of the function
     */
    arguments: Array<any>;
};

type TransactionPayload_EntryFunctionPayload = ({
    type: string;
} & EntryFunctionPayload);

type ModuleBundlePayload = {
    modules: Array<MoveModuleBytecode>;
};

type TransactionPayload_ModuleBundlePayload = ({
    type: string;
} & ModuleBundlePayload);

type MultisigTransactionPayload = EntryFunctionPayload;

/**
 * A multisig transaction that allows an owner of a multisig account to execute a pre-approved
 * transaction as the multisig account.
 */
type MultisigPayload = {
    multisig_address: Address;
    transaction_payload?: MultisigTransactionPayload;
};

type TransactionPayload_MultisigPayload = ({
    type: string;
} & MultisigPayload);

type TransactionPayload_ScriptPayload = ({
    type: string;
} & ScriptPayload);

/**
 * An enum of the possible transaction payloads
 */
type TransactionPayload$1 = (TransactionPayload_EntryFunctionPayload | TransactionPayload_ScriptPayload | TransactionPayload_ModuleBundlePayload | TransactionPayload_MultisigPayload);

type TransactionSignature_AccountSignature = ({
    type: string;
} & AccountSignature);

type TransactionSignature_Ed25519Signature = ({
    type: string;
} & Ed25519Signature$1);

/**
 * Fee payer signature for fee payer transactions
 *
 * This allows you to have transactions across multiple accounts and with a fee payer
 */
type FeePayerSignature = {
    sender: AccountSignature;
    /**
     * The other involved parties' addresses
     */
    secondary_signer_addresses: Array<Address>;
    /**
     * The associated signatures, in the same order as the secondary addresses
     */
    secondary_signers: Array<AccountSignature>;
    fee_payer_address: Address;
    fee_payer_signer: AccountSignature;
};

type TransactionSignature_FeePayerSignature = ({
    type: string;
} & FeePayerSignature);

/**
 * Multi agent signature for multi agent transactions
 *
 * This allows you to have transactions across multiple accounts
 */
type MultiAgentSignature = {
    sender: AccountSignature;
    /**
     * The other involved parties' addresses
     */
    secondary_signer_addresses: Array<Address>;
    /**
     * The associated signatures, in the same order as the secondary addresses
     */
    secondary_signers: Array<AccountSignature>;
};

type TransactionSignature_MultiAgentSignature = ({
    type: string;
} & MultiAgentSignature);

type TransactionSignature_MultiEd25519Signature = ({
    type: string;
} & MultiEd25519Signature$1);

/**
 * An enum representing the different transaction signatures available
 */
type TransactionSignature = (TransactionSignature_Ed25519Signature | TransactionSignature_MultiEd25519Signature | TransactionSignature_MultiAgentSignature | TransactionSignature_FeePayerSignature | TransactionSignature_AccountSignature);

/**
 * A transaction waiting in mempool
 */
type PendingTransaction = {
    hash: HashValue;
    sender: Address;
    sequence_number: U64$1;
    max_gas_amount: U64$1;
    gas_unit_price: U64$1;
    expiration_timestamp_secs: U64$1;
    payload: TransactionPayload$1;
    signature?: TransactionSignature;
};

type Transaction_PendingTransaction = ({
    type: string;
} & PendingTransaction);

/**
 * A state checkpoint transaction
 */
type StateCheckpointTransaction = {
    version: U64$1;
    hash: HashValue;
    state_change_hash: HashValue;
    event_root_hash: HashValue;
    state_checkpoint_hash?: HashValue;
    gas_used: U64$1;
    /**
     * Whether the transaction was successful
     */
    success: boolean;
    /**
     * The VM status of the transaction, can tell useful information in a failure
     */
    vm_status: string;
    accumulator_root_hash: HashValue;
    /**
     * Final state of resources changed by the transaction
     */
    changes: Array<WriteSetChange>;
    timestamp: U64$1;
};

type Transaction_StateCheckpointTransaction = ({
    type: string;
} & StateCheckpointTransaction);

/**
 * A transaction submitted by a user to change the state of the blockchain
 */
type UserTransaction$1 = {
    version: U64$1;
    hash: HashValue;
    state_change_hash: HashValue;
    event_root_hash: HashValue;
    state_checkpoint_hash?: HashValue;
    gas_used: U64$1;
    /**
     * Whether the transaction was successful
     */
    success: boolean;
    /**
     * The VM status of the transaction, can tell useful information in a failure
     */
    vm_status: string;
    accumulator_root_hash: HashValue;
    /**
     * Final state of resources changed by the transaction
     */
    changes: Array<WriteSetChange>;
    sender: Address;
    sequence_number: U64$1;
    max_gas_amount: U64$1;
    gas_unit_price: U64$1;
    expiration_timestamp_secs: U64$1;
    payload: TransactionPayload$1;
    signature?: TransactionSignature;
    /**
     * Events generated by the transaction
     */
    events: Array<Event>;
    timestamp: U64$1;
};

type Transaction_UserTransaction = ({
    type: string;
} & UserTransaction$1);

/**
 * Enum of the different types of transactions in Aptos
 */
type Transaction$1 = (Transaction_PendingTransaction | Transaction_UserTransaction | Transaction_GenesisTransaction | Transaction_BlockMetadataTransaction | Transaction_StateCheckpointTransaction);

/**
 * A Block with or without transactions
 *
 * This contains the information about a transactions along with
 * associated transactions if requested
 */
type Block = {
    block_height: U64$1;
    block_hash: HashValue;
    block_timestamp: U64$1;
    first_version: U64$1;
    last_version: U64$1;
    /**
     * The transactions in the block in sequential order
     */
    transactions?: Array<Transaction$1>;
};

/**
 * Request to encode a submission
 */
type EncodeSubmissionRequest = {
    sender: Address;
    sequence_number: U64$1;
    max_gas_amount: U64$1;
    gas_unit_price: U64$1;
    expiration_timestamp_secs: U64$1;
    payload: TransactionPayload$1;
    /**
     * Secondary signer accounts of the request for Multi-agent
     */
    secondary_signers?: Array<Address>;
};

/**
 * Struct holding the outputs of the estimate gas API
 */
type GasEstimation = {
    /**
     * The deprioritized estimate for the gas unit price
     */
    deprioritized_gas_estimate?: number;
    /**
     * The current estimate for the gas unit price
     */
    gas_estimate: number;
    /**
     * The prioritized estimate for the gas unit price
     */
    prioritized_gas_estimate?: number;
};

/**
 * Representation of a successful healthcheck
 */
type HealthCheckSuccess = {
    message: string;
};

declare enum RoleType {
    VALIDATOR = "validator",
    FULL_NODE = "full_node"
}

/**
 * The struct holding all data returned to the client by the
 * index endpoint (i.e., GET "/").  Only for responding in JSON
 */
type IndexResponse = {
    /**
     * Chain ID of the current chain
     */
    chain_id: number;
    epoch: U64$1;
    ledger_version: U64$1;
    oldest_ledger_version: U64$1;
    ledger_timestamp: U64$1;
    node_role: RoleType;
    oldest_block_height: U64$1;
    block_height: U64$1;
    /**
     * Git hash of the build of the API endpoint.  Can be used to determine the exact
     * software version used by the API endpoint.
     */
    git_hash?: string;
};

/**
 * A string containing a 128-bit unsigned integer.
 *
 * We represent u128 values as a string to ensure compatibility with languages such
 * as JavaScript that do not parse u128s in JSON natively.
 *
 */
type U128 = string;

/**
 * A string containing a 256-bit unsigned integer.
 *
 * We represent u256 values as a string to ensure compatibility with languages such
 * as JavaScript that do not parse u256s in JSON natively.
 *
 */
type U256 = string;

/**
 * An enum of the possible Move value types
 */
type MoveValue = (number | U64$1 | U128 | U256 | boolean | Address | Array<MoveValue> | HexEncodedBytes | MoveStructValue | string);

/**
 * Table Item request for the GetTableItemRaw API
 */
type RawTableItemRequest = {
    key: HexEncodedBytes;
};

/**
 * Representation of a StateKey as a hex string. This is used for cursor based pagination.
 *
 */
type StateKeyWrapper = string;

/**
 * A request to submit a transaction
 *
 * This requires a transaction and a signature of it
 */
type SubmitTransactionRequest = {
    sender: Address;
    sequence_number: U64$1;
    max_gas_amount: U64$1;
    gas_unit_price: U64$1;
    expiration_timestamp_secs: U64$1;
    payload: TransactionPayload$1;
    signature: TransactionSignature;
};

/**
 * Table Item request for the GetTableItem API
 */
type TableItemRequest = {
    key_type: MoveType;
    value_type: MoveType;
    /**
     * The value of the table item's key
     */
    key: any;
};

/**
 * Information telling which batch submission transactions failed
 */
type TransactionsBatchSingleSubmissionFailure = {
    error: AptosError;
    /**
     * The index of which transaction failed, same as submission order
     */
    transaction_index: number;
};

/**
 * Batch transaction submission result
 *
 * Tells which transactions failed
 */
type TransactionsBatchSubmissionResult = {
    /**
     * Summary of the failed transactions
     */
    transaction_failures: Array<TransactionsBatchSingleSubmissionFailure>;
};

/**
 * An event from a transaction with a version
 */
type VersionedEvent = {
    version: U64$1;
    guid: EventGuid;
    sequence_number: U64$1;
    type: MoveType;
    /**
     * The JSON representation of the event
     */
    data: any;
};

/**
 * View request for the Move View Function API
 */
type ViewRequest = {
    function: EntryFunctionId;
    /**
     * Type arguments of the function
     */
    type_arguments: Array<MoveType>;
    /**
     * Arguments of the function
     */
    arguments: Array<any>;
};

type index$1_AccountData = AccountData;
type index$1_AccountSignature = AccountSignature;
type index$1_AccountSignature_Ed25519Signature = AccountSignature_Ed25519Signature;
type index$1_AccountSignature_MultiEd25519Signature = AccountSignature_MultiEd25519Signature;
type index$1_AccountSignature_MultiKeySignature = AccountSignature_MultiKeySignature;
type index$1_AccountSignature_SingleKeySignature = AccountSignature_SingleKeySignature;
type index$1_Address = Address;
type index$1_AptosError = AptosError;
type index$1_AptosErrorCode = AptosErrorCode;
declare const index$1_AptosErrorCode: typeof AptosErrorCode;
type index$1_Block = Block;
type index$1_BlockMetadataTransaction = BlockMetadataTransaction;
type index$1_DecodedTableData = DecodedTableData;
type index$1_DeleteModule = DeleteModule;
type index$1_DeleteResource = DeleteResource;
type index$1_DeleteTableItem = DeleteTableItem;
type index$1_DeletedTableData = DeletedTableData;
type index$1_DirectWriteSet = DirectWriteSet;
type index$1_EncodeSubmissionRequest = EncodeSubmissionRequest;
type index$1_EntryFunctionId = EntryFunctionId;
type index$1_EntryFunctionPayload = EntryFunctionPayload;
type index$1_Event = Event;
type index$1_EventGuid = EventGuid;
type index$1_FeePayerSignature = FeePayerSignature;
type index$1_GasEstimation = GasEstimation;
type index$1_GenesisPayload = GenesisPayload;
type index$1_GenesisPayload_WriteSetPayload = GenesisPayload_WriteSetPayload;
type index$1_GenesisTransaction = GenesisTransaction;
type index$1_HashValue = HashValue;
type index$1_HealthCheckSuccess = HealthCheckSuccess;
type index$1_HexEncodedBytes = HexEncodedBytes;
type index$1_IdentifierWrapper = IdentifierWrapper;
type index$1_IndexResponse = IndexResponse;
type index$1_IndexedSignature = IndexedSignature;
type index$1_ModuleBundlePayload = ModuleBundlePayload;
type index$1_MoveAbility = MoveAbility;
type index$1_MoveFunction = MoveFunction;
type index$1_MoveFunctionGenericTypeParam = MoveFunctionGenericTypeParam;
type index$1_MoveFunctionVisibility = MoveFunctionVisibility;
declare const index$1_MoveFunctionVisibility: typeof MoveFunctionVisibility;
type index$1_MoveModule = MoveModule;
type index$1_MoveModuleBytecode = MoveModuleBytecode;
type index$1_MoveModuleId = MoveModuleId;
type index$1_MoveResource = MoveResource;
type index$1_MoveScriptBytecode = MoveScriptBytecode;
type index$1_MoveStruct = MoveStruct;
type index$1_MoveStructField = MoveStructField;
type index$1_MoveStructGenericTypeParam = MoveStructGenericTypeParam;
type index$1_MoveStructTag = MoveStructTag;
type index$1_MoveStructValue = MoveStructValue;
type index$1_MoveType = MoveType;
type index$1_MoveValue = MoveValue;
type index$1_MultiAgentSignature = MultiAgentSignature;
type index$1_MultiKeySignature = MultiKeySignature;
type index$1_MultisigPayload = MultisigPayload;
type index$1_MultisigTransactionPayload = MultisigTransactionPayload;
type index$1_PendingTransaction = PendingTransaction;
type index$1_PublicKey = PublicKey;
type index$1_PublicKey_string_HexEncodedBytes_ = PublicKey_string_HexEncodedBytes_;
type index$1_RawTableItemRequest = RawTableItemRequest;
type index$1_RoleType = RoleType;
declare const index$1_RoleType: typeof RoleType;
type index$1_ScriptPayload = ScriptPayload;
type index$1_ScriptWriteSet = ScriptWriteSet;
type index$1_Signature = Signature;
type index$1_Signature_string_HexEncodedBytes_ = Signature_string_HexEncodedBytes_;
type index$1_SingleKeySignature = SingleKeySignature;
type index$1_StateCheckpointTransaction = StateCheckpointTransaction;
type index$1_StateKeyWrapper = StateKeyWrapper;
type index$1_SubmitTransactionRequest = SubmitTransactionRequest;
type index$1_TableItemRequest = TableItemRequest;
type index$1_TransactionPayload_EntryFunctionPayload = TransactionPayload_EntryFunctionPayload;
type index$1_TransactionPayload_ModuleBundlePayload = TransactionPayload_ModuleBundlePayload;
type index$1_TransactionPayload_MultisigPayload = TransactionPayload_MultisigPayload;
type index$1_TransactionPayload_ScriptPayload = TransactionPayload_ScriptPayload;
type index$1_TransactionSignature = TransactionSignature;
type index$1_TransactionSignature_AccountSignature = TransactionSignature_AccountSignature;
type index$1_TransactionSignature_Ed25519Signature = TransactionSignature_Ed25519Signature;
type index$1_TransactionSignature_FeePayerSignature = TransactionSignature_FeePayerSignature;
type index$1_TransactionSignature_MultiAgentSignature = TransactionSignature_MultiAgentSignature;
type index$1_TransactionSignature_MultiEd25519Signature = TransactionSignature_MultiEd25519Signature;
type index$1_Transaction_BlockMetadataTransaction = Transaction_BlockMetadataTransaction;
type index$1_Transaction_GenesisTransaction = Transaction_GenesisTransaction;
type index$1_Transaction_PendingTransaction = Transaction_PendingTransaction;
type index$1_Transaction_StateCheckpointTransaction = Transaction_StateCheckpointTransaction;
type index$1_Transaction_UserTransaction = Transaction_UserTransaction;
type index$1_TransactionsBatchSingleSubmissionFailure = TransactionsBatchSingleSubmissionFailure;
type index$1_TransactionsBatchSubmissionResult = TransactionsBatchSubmissionResult;
type index$1_U128 = U128;
type index$1_U256 = U256;
type index$1_VersionedEvent = VersionedEvent;
type index$1_ViewRequest = ViewRequest;
type index$1_WriteModule = WriteModule;
type index$1_WriteResource = WriteResource;
type index$1_WriteSetChange = WriteSetChange;
type index$1_WriteSetChange_DeleteModule = WriteSetChange_DeleteModule;
type index$1_WriteSetChange_DeleteResource = WriteSetChange_DeleteResource;
type index$1_WriteSetChange_DeleteTableItem = WriteSetChange_DeleteTableItem;
type index$1_WriteSetChange_WriteModule = WriteSetChange_WriteModule;
type index$1_WriteSetChange_WriteResource = WriteSetChange_WriteResource;
type index$1_WriteSetChange_WriteTableItem = WriteSetChange_WriteTableItem;
type index$1_WriteSetPayload = WriteSetPayload;
type index$1_WriteSet_DirectWriteSet = WriteSet_DirectWriteSet;
type index$1_WriteSet_ScriptWriteSet = WriteSet_ScriptWriteSet;
type index$1_WriteTableItem = WriteTableItem;
declare namespace index$1 {
  export { type index$1_AccountData as AccountData, type index$1_AccountSignature as AccountSignature, type index$1_AccountSignature_Ed25519Signature as AccountSignature_Ed25519Signature, type index$1_AccountSignature_MultiEd25519Signature as AccountSignature_MultiEd25519Signature, type index$1_AccountSignature_MultiKeySignature as AccountSignature_MultiKeySignature, type index$1_AccountSignature_SingleKeySignature as AccountSignature_SingleKeySignature, type index$1_Address as Address, type index$1_AptosError as AptosError, index$1_AptosErrorCode as AptosErrorCode, type index$1_Block as Block, type index$1_BlockMetadataTransaction as BlockMetadataTransaction, type index$1_DecodedTableData as DecodedTableData, type index$1_DeleteModule as DeleteModule, type index$1_DeleteResource as DeleteResource, type index$1_DeleteTableItem as DeleteTableItem, type index$1_DeletedTableData as DeletedTableData, type index$1_DirectWriteSet as DirectWriteSet, type Ed25519Signature$1 as Ed25519Signature, type index$1_EncodeSubmissionRequest as EncodeSubmissionRequest, type index$1_EntryFunctionId as EntryFunctionId, type index$1_EntryFunctionPayload as EntryFunctionPayload, type index$1_Event as Event, type index$1_EventGuid as EventGuid, type index$1_FeePayerSignature as FeePayerSignature, type index$1_GasEstimation as GasEstimation, type index$1_GenesisPayload as GenesisPayload, type index$1_GenesisPayload_WriteSetPayload as GenesisPayload_WriteSetPayload, type index$1_GenesisTransaction as GenesisTransaction, type index$1_HashValue as HashValue, type index$1_HealthCheckSuccess as HealthCheckSuccess, type index$1_HexEncodedBytes as HexEncodedBytes, type index$1_IdentifierWrapper as IdentifierWrapper, type index$1_IndexResponse as IndexResponse, type index$1_IndexedSignature as IndexedSignature, type index$1_ModuleBundlePayload as ModuleBundlePayload, type index$1_MoveAbility as MoveAbility, type index$1_MoveFunction as MoveFunction, type index$1_MoveFunctionGenericTypeParam as MoveFunctionGenericTypeParam, index$1_MoveFunctionVisibility as MoveFunctionVisibility, type index$1_MoveModule as MoveModule, type index$1_MoveModuleBytecode as MoveModuleBytecode, type index$1_MoveModuleId as MoveModuleId, type index$1_MoveResource as MoveResource, type index$1_MoveScriptBytecode as MoveScriptBytecode, type index$1_MoveStruct as MoveStruct, type index$1_MoveStructField as MoveStructField, type index$1_MoveStructGenericTypeParam as MoveStructGenericTypeParam, type index$1_MoveStructTag as MoveStructTag, type index$1_MoveStructValue as MoveStructValue, type index$1_MoveType as MoveType, type index$1_MoveValue as MoveValue, type index$1_MultiAgentSignature as MultiAgentSignature, type MultiEd25519Signature$1 as MultiEd25519Signature, type index$1_MultiKeySignature as MultiKeySignature, type index$1_MultisigPayload as MultisigPayload, type index$1_MultisigTransactionPayload as MultisigTransactionPayload, type index$1_PendingTransaction as PendingTransaction, type index$1_PublicKey as PublicKey, type index$1_PublicKey_string_HexEncodedBytes_ as PublicKey_string_HexEncodedBytes_, type index$1_RawTableItemRequest as RawTableItemRequest, index$1_RoleType as RoleType, type index$1_ScriptPayload as ScriptPayload, type index$1_ScriptWriteSet as ScriptWriteSet, type index$1_Signature as Signature, type index$1_Signature_string_HexEncodedBytes_ as Signature_string_HexEncodedBytes_, type index$1_SingleKeySignature as SingleKeySignature, type index$1_StateCheckpointTransaction as StateCheckpointTransaction, type index$1_StateKeyWrapper as StateKeyWrapper, type index$1_SubmitTransactionRequest as SubmitTransactionRequest, type index$1_TableItemRequest as TableItemRequest, type Transaction$1 as Transaction, type TransactionPayload$1 as TransactionPayload, type index$1_TransactionPayload_EntryFunctionPayload as TransactionPayload_EntryFunctionPayload, type index$1_TransactionPayload_ModuleBundlePayload as TransactionPayload_ModuleBundlePayload, type index$1_TransactionPayload_MultisigPayload as TransactionPayload_MultisigPayload, type index$1_TransactionPayload_ScriptPayload as TransactionPayload_ScriptPayload, type index$1_TransactionSignature as TransactionSignature, type index$1_TransactionSignature_AccountSignature as TransactionSignature_AccountSignature, type index$1_TransactionSignature_Ed25519Signature as TransactionSignature_Ed25519Signature, type index$1_TransactionSignature_FeePayerSignature as TransactionSignature_FeePayerSignature, type index$1_TransactionSignature_MultiAgentSignature as TransactionSignature_MultiAgentSignature, type index$1_TransactionSignature_MultiEd25519Signature as TransactionSignature_MultiEd25519Signature, type index$1_Transaction_BlockMetadataTransaction as Transaction_BlockMetadataTransaction, type index$1_Transaction_GenesisTransaction as Transaction_GenesisTransaction, type index$1_Transaction_PendingTransaction as Transaction_PendingTransaction, type index$1_Transaction_StateCheckpointTransaction as Transaction_StateCheckpointTransaction, type index$1_Transaction_UserTransaction as Transaction_UserTransaction, type index$1_TransactionsBatchSingleSubmissionFailure as TransactionsBatchSingleSubmissionFailure, type index$1_TransactionsBatchSubmissionResult as TransactionsBatchSubmissionResult, type index$1_U128 as U128, type index$1_U256 as U256, type U64$1 as U64, type UserTransaction$1 as UserTransaction, type index$1_VersionedEvent as VersionedEvent, type index$1_ViewRequest as ViewRequest, type index$1_WriteModule as WriteModule, type index$1_WriteResource as WriteResource, type WriteSet$1 as WriteSet, type index$1_WriteSetChange as WriteSetChange, type index$1_WriteSetChange_DeleteModule as WriteSetChange_DeleteModule, type index$1_WriteSetChange_DeleteResource as WriteSetChange_DeleteResource, type index$1_WriteSetChange_DeleteTableItem as WriteSetChange_DeleteTableItem, type index$1_WriteSetChange_WriteModule as WriteSetChange_WriteModule, type index$1_WriteSetChange_WriteResource as WriteSetChange_WriteResource, type index$1_WriteSetChange_WriteTableItem as WriteSetChange_WriteTableItem, type index$1_WriteSetPayload as WriteSetPayload, type index$1_WriteSet_DirectWriteSet as WriteSet_DirectWriteSet, type index$1_WriteSet_ScriptWriteSet as WriteSet_ScriptWriteSet, type index$1_WriteTableItem as WriteTableItem };
}

type MaybeHexString = HexString | string | HexEncodedBytes;
/**
 * A util class for working with hex strings.
 * Hex strings are strings that are prefixed with `0x`
 */
declare class HexString {
    private readonly hexString;
    /**
     * Creates new hex string from Buffer
     * @param buffer A buffer to convert
     * @returns New HexString
     */
    static fromBuffer(buffer: Uint8Array): HexString;
    /**
     * Creates new hex string from Uint8Array
     * @param arr Uint8Array to convert
     * @returns New HexString
     */
    static fromUint8Array(arr: Uint8Array): HexString;
    /**
     * Ensures `hexString` is instance of `HexString` class
     * @param hexString String to check
     * @returns New HexString if `hexString` is regular string or `hexString` if it is HexString instance
     * @example
     * ```
     *  const regularString = "string";
     *  const hexString = new HexString("string"); // "0xstring"
     *  HexString.ensure(regularString); // "0xstring"
     *  HexString.ensure(hexString); // "0xstring"
     * ```
     */
    static ensure(hexString: MaybeHexString): HexString;
    /**
     * Creates new HexString instance from regular string. If specified string already starts with "0x" prefix,
     * it will not add another one
     * @param hexString String to convert
     * @example
     * ```
     *  const string = "string";
     *  new HexString(string); // "0xstring"
     * ```
     */
    constructor(hexString: string | HexEncodedBytes);
    /**
     * Getter for inner hexString
     * @returns Inner hex string
     */
    hex(): string;
    /**
     * Getter for inner hexString without prefix
     * @returns Inner hex string without prefix
     * @example
     * ```
     *  const hexString = new HexString("string"); // "0xstring"
     *  hexString.noPrefix(); // "string"
     * ```
     */
    noPrefix(): string;
    /**
     * Overrides default `toString` method
     * @returns Inner hex string
     */
    toString(): string;
    /**
     * Trimmes extra zeroes in the begining of a string
     * @returns Inner hexString without leading zeroes
     * @example
     * ```
     *  new HexString("0x000000string").toShortString(); // result = "0xstring"
     * ```
     */
    toShortString(): string;
    /**
     * Converts hex string to a Uint8Array
     * @returns Uint8Array from inner hexString without prefix
     */
    toUint8Array(): Uint8Array;
}

interface AptosAccountObject {
    address?: HexEncodedBytes;
    publicKeyHex?: HexEncodedBytes;
    privateKeyHex: HexEncodedBytes;
}
/**
 * Class for creating and managing Aptos account
 */
declare class AptosAccount {
    /**
     * A private key and public key, associated with the given account
     */
    readonly signingKey: nacl.SignKeyPair;
    /**
     * Address associated with the given account
     */
    private readonly accountAddress;
    static fromAptosAccountObject(obj: AptosAccountObject): AptosAccount;
    /**
     * Check's if the derive path is valid
     */
    static isValidPath(path: string): boolean;
    /**
     * Creates new account with bip44 path and mnemonics,
     * @param path. (e.g. m/44'/637'/0'/0'/0')
     * Detailed description: {@link https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki}
     * @param mnemonics.
     * @returns AptosAccount
     */
    static fromDerivePath(path: string, mnemonics: string): AptosAccount;
    /**
     * Creates new account instance. Constructor allows passing in an address,
     * to handle account key rotation, where auth_key != public_key
     * @param privateKeyBytes  Private key from which account key pair will be generated.
     * If not specified, new key pair is going to be created.
     * @param address Account address (e.g. 0xe8012714cd17606cee7188a2a365eef3fe760be598750678c8c5954eb548a591).
     * If not specified, a new one will be generated from public key
     */
    constructor(privateKeyBytes?: Uint8Array | undefined, address?: MaybeHexString);
    /**
     * This is the key by which Aptos account is referenced.
     * It is the 32-byte of the SHA-3 256 cryptographic hash
     * of the public key(s) concatenated with a signature scheme identifier byte
     * @returns Address associated with the given account
     */
    address(): HexString;
    /**
     * This key enables account owners to rotate their private key(s)
     * associated with the account without changing the address that hosts their account.
     * See here for more info: {@link https://aptos.dev/concepts/accounts#single-signer-authentication}
     * @returns Authentication key for the associated account
     */
    authKey(): HexString;
    /**
     * Takes source address and seeds and returns the resource account address
     * @param sourceAddress Address used to derive the resource account
     * @param seed The seed bytes
     * @returns The resource account address
     */
    static getResourceAccountAddress(sourceAddress: MaybeHexString, seed: Uint8Array): HexString;
    /**
     * Takes creator address and collection name and returns the collection id hash.
     * Collection id hash are generated as sha256 hash of (`creator_address::collection_name`)
     *
     * @param creatorAddress Collection creator address
     * @param collectionName The collection name
     * @returns The collection id hash
     */
    static getCollectionID(creatorAddress: MaybeHexString, collectionName: string): HexString;
    /**
     * This key is generated with Ed25519 scheme.
     * Public key is used to check a signature of transaction, signed by given account
     * @returns The public key for the associated account
     */
    pubKey(): HexString;
    /**
     * Signs specified `buffer` with account's private key
     * @param buffer A buffer to sign
     * @returns A signature HexString
     */
    signBuffer(buffer: Uint8Array): HexString;
    /**
     * Signs specified `hexString` with account's private key
     * @param hexString A regular string or HexString to sign
     * @returns A signature HexString
     */
    signHexString(hexString: MaybeHexString): HexString;
    /**
     * Verifies the signature of the message with the public key of the account
     * @param message a signed message
     * @param signature the signature of the message
     */
    verifySignature(message: MaybeHexString, signature: MaybeHexString): boolean;
    /**
     * Derives account address, public key and private key
     * @returns AptosAccountObject instance.
     * @example An example of the returned AptosAccountObject object
     * ```
     * {
     *    address: "0xe8012714cd17606cee7188a2a365eef3fe760be598750678c8c5954eb548a591",
     *    publicKeyHex: "0xf56d8524faf79fbc0f48c13aeed3b0ce5dd376b4db93b8130a107c0a5e04ba04",
     *    privateKeyHex: `0x009c9f7c992a06cfafe916f125d8adb7a395fca243e264a8e56a4b3e6accf940
     *      d2b11e9ece3049ce60e3c7b4a1c58aebfa9298e29a30a58a67f1998646135204`
     * }
     * ```
     */
    toPrivateKeyObject(): AptosAccountObject;
}
declare function getAddressFromAccountOrAddress(accountOrAddress: AptosAccount | MaybeHexString): HexString;

type Maybe<T> = T | null;
type InputMaybe<T> = Maybe<T>;
type Exact<T extends {
    [key: string]: unknown;
}> = {
    [K in keyof T]: T[K];
};
type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
type MakeEmpty<T extends {
    [key: string]: unknown;
}, K extends keyof T> = {
    [_ in K]?: never;
};
type Incremental<T> = T | {
    [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
};
/** All built-in and custom scalars, mapped to their actual values */
type Scalars = {
    ID: {
        input: string;
        output: string;
    };
    String: {
        input: string;
        output: string;
    };
    Boolean: {
        input: boolean;
        output: boolean;
    };
    Int: {
        input: number;
        output: number;
    };
    Float: {
        input: number;
        output: number;
    };
    bigint: {
        input: any;
        output: any;
    };
    jsonb: {
        input: any;
        output: any;
    };
    numeric: {
        input: any;
        output: any;
    };
    timestamp: {
        input: any;
        output: any;
    };
    timestamptz: {
        input: any;
        output: any;
    };
};
/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
type Boolean_Comparison_Exp = {
    _eq?: InputMaybe<Scalars['Boolean']['input']>;
    _gt?: InputMaybe<Scalars['Boolean']['input']>;
    _gte?: InputMaybe<Scalars['Boolean']['input']>;
    _in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
    _is_null?: InputMaybe<Scalars['Boolean']['input']>;
    _lt?: InputMaybe<Scalars['Boolean']['input']>;
    _lte?: InputMaybe<Scalars['Boolean']['input']>;
    _neq?: InputMaybe<Scalars['Boolean']['input']>;
    _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};
/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
type Int_Comparison_Exp = {
    _eq?: InputMaybe<Scalars['Int']['input']>;
    _gt?: InputMaybe<Scalars['Int']['input']>;
    _gte?: InputMaybe<Scalars['Int']['input']>;
    _in?: InputMaybe<Array<Scalars['Int']['input']>>;
    _is_null?: InputMaybe<Scalars['Boolean']['input']>;
    _lt?: InputMaybe<Scalars['Int']['input']>;
    _lte?: InputMaybe<Scalars['Int']['input']>;
    _neq?: InputMaybe<Scalars['Int']['input']>;
    _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};
/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
type String_Comparison_Exp = {
    _eq?: InputMaybe<Scalars['String']['input']>;
    _gt?: InputMaybe<Scalars['String']['input']>;
    _gte?: InputMaybe<Scalars['String']['input']>;
    /** does the column match the given case-insensitive pattern */
    _ilike?: InputMaybe<Scalars['String']['input']>;
    _in?: InputMaybe<Array<Scalars['String']['input']>>;
    /** does the column match the given POSIX regular expression, case insensitive */
    _iregex?: InputMaybe<Scalars['String']['input']>;
    _is_null?: InputMaybe<Scalars['Boolean']['input']>;
    /** does the column match the given pattern */
    _like?: InputMaybe<Scalars['String']['input']>;
    _lt?: InputMaybe<Scalars['String']['input']>;
    _lte?: InputMaybe<Scalars['String']['input']>;
    _neq?: InputMaybe<Scalars['String']['input']>;
    /** does the column NOT match the given case-insensitive pattern */
    _nilike?: InputMaybe<Scalars['String']['input']>;
    _nin?: InputMaybe<Array<Scalars['String']['input']>>;
    /** does the column NOT match the given POSIX regular expression, case insensitive */
    _niregex?: InputMaybe<Scalars['String']['input']>;
    /** does the column NOT match the given pattern */
    _nlike?: InputMaybe<Scalars['String']['input']>;
    /** does the column NOT match the given POSIX regular expression, case sensitive */
    _nregex?: InputMaybe<Scalars['String']['input']>;
    /** does the column NOT match the given SQL regular expression */
    _nsimilar?: InputMaybe<Scalars['String']['input']>;
    /** does the column match the given POSIX regular expression, case sensitive */
    _regex?: InputMaybe<Scalars['String']['input']>;
    /** does the column match the given SQL regular expression */
    _similar?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "account_transactions" */
type Account_Transactions = {
    __typename?: 'account_transactions';
    account_address: Scalars['String']['output'];
    /** An array relationship */
    coin_activities: Array<Coin_Activities>;
    /** An aggregate relationship */
    coin_activities_aggregate: Coin_Activities_Aggregate;
    /** An array relationship */
    delegated_staking_activities: Array<Delegated_Staking_Activities>;
    /** An array relationship */
    fungible_asset_activities: Array<Fungible_Asset_Activities>;
    /** An array relationship */
    token_activities: Array<Token_Activities>;
    /** An aggregate relationship */
    token_activities_aggregate: Token_Activities_Aggregate;
    /** An array relationship */
    token_activities_v2: Array<Token_Activities_V2>;
    /** An aggregate relationship */
    token_activities_v2_aggregate: Token_Activities_V2_Aggregate;
    transaction_version: Scalars['bigint']['output'];
};
/** columns and relationships of "account_transactions" */
type Account_TransactionsCoin_ActivitiesArgs = {
    distinct_on?: InputMaybe<Array<Coin_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Coin_Activities_Order_By>>;
    where?: InputMaybe<Coin_Activities_Bool_Exp>;
};
/** columns and relationships of "account_transactions" */
type Account_TransactionsCoin_Activities_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Coin_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Coin_Activities_Order_By>>;
    where?: InputMaybe<Coin_Activities_Bool_Exp>;
};
/** columns and relationships of "account_transactions" */
type Account_TransactionsDelegated_Staking_ActivitiesArgs = {
    distinct_on?: InputMaybe<Array<Delegated_Staking_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Delegated_Staking_Activities_Order_By>>;
    where?: InputMaybe<Delegated_Staking_Activities_Bool_Exp>;
};
/** columns and relationships of "account_transactions" */
type Account_TransactionsFungible_Asset_ActivitiesArgs = {
    distinct_on?: InputMaybe<Array<Fungible_Asset_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Fungible_Asset_Activities_Order_By>>;
    where?: InputMaybe<Fungible_Asset_Activities_Bool_Exp>;
};
/** columns and relationships of "account_transactions" */
type Account_TransactionsToken_ActivitiesArgs = {
    distinct_on?: InputMaybe<Array<Token_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Activities_Order_By>>;
    where?: InputMaybe<Token_Activities_Bool_Exp>;
};
/** columns and relationships of "account_transactions" */
type Account_TransactionsToken_Activities_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Token_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Activities_Order_By>>;
    where?: InputMaybe<Token_Activities_Bool_Exp>;
};
/** columns and relationships of "account_transactions" */
type Account_TransactionsToken_Activities_V2Args = {
    distinct_on?: InputMaybe<Array<Token_Activities_V2_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Activities_V2_Order_By>>;
    where?: InputMaybe<Token_Activities_V2_Bool_Exp>;
};
/** columns and relationships of "account_transactions" */
type Account_TransactionsToken_Activities_V2_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Token_Activities_V2_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Activities_V2_Order_By>>;
    where?: InputMaybe<Token_Activities_V2_Bool_Exp>;
};
/** aggregated selection of "account_transactions" */
type Account_Transactions_Aggregate = {
    __typename?: 'account_transactions_aggregate';
    aggregate?: Maybe<Account_Transactions_Aggregate_Fields>;
    nodes: Array<Account_Transactions>;
};
/** aggregate fields of "account_transactions" */
type Account_Transactions_Aggregate_Fields = {
    __typename?: 'account_transactions_aggregate_fields';
    avg?: Maybe<Account_Transactions_Avg_Fields>;
    count: Scalars['Int']['output'];
    max?: Maybe<Account_Transactions_Max_Fields>;
    min?: Maybe<Account_Transactions_Min_Fields>;
    stddev?: Maybe<Account_Transactions_Stddev_Fields>;
    stddev_pop?: Maybe<Account_Transactions_Stddev_Pop_Fields>;
    stddev_samp?: Maybe<Account_Transactions_Stddev_Samp_Fields>;
    sum?: Maybe<Account_Transactions_Sum_Fields>;
    var_pop?: Maybe<Account_Transactions_Var_Pop_Fields>;
    var_samp?: Maybe<Account_Transactions_Var_Samp_Fields>;
    variance?: Maybe<Account_Transactions_Variance_Fields>;
};
/** aggregate fields of "account_transactions" */
type Account_Transactions_Aggregate_FieldsCountArgs = {
    columns?: InputMaybe<Array<Account_Transactions_Select_Column>>;
    distinct?: InputMaybe<Scalars['Boolean']['input']>;
};
/** aggregate avg on columns */
type Account_Transactions_Avg_Fields = {
    __typename?: 'account_transactions_avg_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** Boolean expression to filter rows from the table "account_transactions". All fields are combined with a logical 'AND'. */
type Account_Transactions_Bool_Exp = {
    _and?: InputMaybe<Array<Account_Transactions_Bool_Exp>>;
    _not?: InputMaybe<Account_Transactions_Bool_Exp>;
    _or?: InputMaybe<Array<Account_Transactions_Bool_Exp>>;
    account_address?: InputMaybe<String_Comparison_Exp>;
    coin_activities?: InputMaybe<Coin_Activities_Bool_Exp>;
    delegated_staking_activities?: InputMaybe<Delegated_Staking_Activities_Bool_Exp>;
    fungible_asset_activities?: InputMaybe<Fungible_Asset_Activities_Bool_Exp>;
    token_activities?: InputMaybe<Token_Activities_Bool_Exp>;
    token_activities_v2?: InputMaybe<Token_Activities_V2_Bool_Exp>;
    transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
};
/** aggregate max on columns */
type Account_Transactions_Max_Fields = {
    __typename?: 'account_transactions_max_fields';
    account_address?: Maybe<Scalars['String']['output']>;
    transaction_version?: Maybe<Scalars['bigint']['output']>;
};
/** aggregate min on columns */
type Account_Transactions_Min_Fields = {
    __typename?: 'account_transactions_min_fields';
    account_address?: Maybe<Scalars['String']['output']>;
    transaction_version?: Maybe<Scalars['bigint']['output']>;
};
/** Ordering options when selecting data from "account_transactions". */
type Account_Transactions_Order_By = {
    account_address?: InputMaybe<Order_By>;
    coin_activities_aggregate?: InputMaybe<Coin_Activities_Aggregate_Order_By>;
    delegated_staking_activities_aggregate?: InputMaybe<Delegated_Staking_Activities_Aggregate_Order_By>;
    fungible_asset_activities_aggregate?: InputMaybe<Fungible_Asset_Activities_Aggregate_Order_By>;
    token_activities_aggregate?: InputMaybe<Token_Activities_Aggregate_Order_By>;
    token_activities_v2_aggregate?: InputMaybe<Token_Activities_V2_Aggregate_Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** select columns of table "account_transactions" */
declare enum Account_Transactions_Select_Column {
    /** column name */
    AccountAddress = "account_address",
    /** column name */
    TransactionVersion = "transaction_version"
}
/** aggregate stddev on columns */
type Account_Transactions_Stddev_Fields = {
    __typename?: 'account_transactions_stddev_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate stddev_pop on columns */
type Account_Transactions_Stddev_Pop_Fields = {
    __typename?: 'account_transactions_stddev_pop_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate stddev_samp on columns */
type Account_Transactions_Stddev_Samp_Fields = {
    __typename?: 'account_transactions_stddev_samp_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** Streaming cursor of the table "account_transactions" */
type Account_Transactions_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Account_Transactions_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Account_Transactions_Stream_Cursor_Value_Input = {
    account_address?: InputMaybe<Scalars['String']['input']>;
    transaction_version?: InputMaybe<Scalars['bigint']['input']>;
};
/** aggregate sum on columns */
type Account_Transactions_Sum_Fields = {
    __typename?: 'account_transactions_sum_fields';
    transaction_version?: Maybe<Scalars['bigint']['output']>;
};
/** aggregate var_pop on columns */
type Account_Transactions_Var_Pop_Fields = {
    __typename?: 'account_transactions_var_pop_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate var_samp on columns */
type Account_Transactions_Var_Samp_Fields = {
    __typename?: 'account_transactions_var_samp_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate variance on columns */
type Account_Transactions_Variance_Fields = {
    __typename?: 'account_transactions_variance_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** columns and relationships of "address_events_summary" */
type Address_Events_Summary = {
    __typename?: 'address_events_summary';
    account_address?: Maybe<Scalars['String']['output']>;
    /** An object relationship */
    block_metadata?: Maybe<Block_Metadata_Transactions>;
    min_block_height?: Maybe<Scalars['bigint']['output']>;
    num_distinct_versions?: Maybe<Scalars['bigint']['output']>;
};
/** Boolean expression to filter rows from the table "address_events_summary". All fields are combined with a logical 'AND'. */
type Address_Events_Summary_Bool_Exp = {
    _and?: InputMaybe<Array<Address_Events_Summary_Bool_Exp>>;
    _not?: InputMaybe<Address_Events_Summary_Bool_Exp>;
    _or?: InputMaybe<Array<Address_Events_Summary_Bool_Exp>>;
    account_address?: InputMaybe<String_Comparison_Exp>;
    block_metadata?: InputMaybe<Block_Metadata_Transactions_Bool_Exp>;
    min_block_height?: InputMaybe<Bigint_Comparison_Exp>;
    num_distinct_versions?: InputMaybe<Bigint_Comparison_Exp>;
};
/** Ordering options when selecting data from "address_events_summary". */
type Address_Events_Summary_Order_By = {
    account_address?: InputMaybe<Order_By>;
    block_metadata?: InputMaybe<Block_Metadata_Transactions_Order_By>;
    min_block_height?: InputMaybe<Order_By>;
    num_distinct_versions?: InputMaybe<Order_By>;
};
/** select columns of table "address_events_summary" */
declare enum Address_Events_Summary_Select_Column {
    /** column name */
    AccountAddress = "account_address",
    /** column name */
    MinBlockHeight = "min_block_height",
    /** column name */
    NumDistinctVersions = "num_distinct_versions"
}
/** Streaming cursor of the table "address_events_summary" */
type Address_Events_Summary_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Address_Events_Summary_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Address_Events_Summary_Stream_Cursor_Value_Input = {
    account_address?: InputMaybe<Scalars['String']['input']>;
    min_block_height?: InputMaybe<Scalars['bigint']['input']>;
    num_distinct_versions?: InputMaybe<Scalars['bigint']['input']>;
};
/** columns and relationships of "address_version_from_events" */
type Address_Version_From_Events = {
    __typename?: 'address_version_from_events';
    account_address?: Maybe<Scalars['String']['output']>;
    /** An array relationship */
    coin_activities: Array<Coin_Activities>;
    /** An aggregate relationship */
    coin_activities_aggregate: Coin_Activities_Aggregate;
    /** An array relationship */
    delegated_staking_activities: Array<Delegated_Staking_Activities>;
    /** An array relationship */
    token_activities: Array<Token_Activities>;
    /** An aggregate relationship */
    token_activities_aggregate: Token_Activities_Aggregate;
    /** An array relationship */
    token_activities_v2: Array<Token_Activities_V2>;
    /** An aggregate relationship */
    token_activities_v2_aggregate: Token_Activities_V2_Aggregate;
    transaction_version?: Maybe<Scalars['bigint']['output']>;
};
/** columns and relationships of "address_version_from_events" */
type Address_Version_From_EventsCoin_ActivitiesArgs = {
    distinct_on?: InputMaybe<Array<Coin_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Coin_Activities_Order_By>>;
    where?: InputMaybe<Coin_Activities_Bool_Exp>;
};
/** columns and relationships of "address_version_from_events" */
type Address_Version_From_EventsCoin_Activities_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Coin_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Coin_Activities_Order_By>>;
    where?: InputMaybe<Coin_Activities_Bool_Exp>;
};
/** columns and relationships of "address_version_from_events" */
type Address_Version_From_EventsDelegated_Staking_ActivitiesArgs = {
    distinct_on?: InputMaybe<Array<Delegated_Staking_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Delegated_Staking_Activities_Order_By>>;
    where?: InputMaybe<Delegated_Staking_Activities_Bool_Exp>;
};
/** columns and relationships of "address_version_from_events" */
type Address_Version_From_EventsToken_ActivitiesArgs = {
    distinct_on?: InputMaybe<Array<Token_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Activities_Order_By>>;
    where?: InputMaybe<Token_Activities_Bool_Exp>;
};
/** columns and relationships of "address_version_from_events" */
type Address_Version_From_EventsToken_Activities_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Token_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Activities_Order_By>>;
    where?: InputMaybe<Token_Activities_Bool_Exp>;
};
/** columns and relationships of "address_version_from_events" */
type Address_Version_From_EventsToken_Activities_V2Args = {
    distinct_on?: InputMaybe<Array<Token_Activities_V2_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Activities_V2_Order_By>>;
    where?: InputMaybe<Token_Activities_V2_Bool_Exp>;
};
/** columns and relationships of "address_version_from_events" */
type Address_Version_From_EventsToken_Activities_V2_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Token_Activities_V2_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Activities_V2_Order_By>>;
    where?: InputMaybe<Token_Activities_V2_Bool_Exp>;
};
/** aggregated selection of "address_version_from_events" */
type Address_Version_From_Events_Aggregate = {
    __typename?: 'address_version_from_events_aggregate';
    aggregate?: Maybe<Address_Version_From_Events_Aggregate_Fields>;
    nodes: Array<Address_Version_From_Events>;
};
/** aggregate fields of "address_version_from_events" */
type Address_Version_From_Events_Aggregate_Fields = {
    __typename?: 'address_version_from_events_aggregate_fields';
    avg?: Maybe<Address_Version_From_Events_Avg_Fields>;
    count: Scalars['Int']['output'];
    max?: Maybe<Address_Version_From_Events_Max_Fields>;
    min?: Maybe<Address_Version_From_Events_Min_Fields>;
    stddev?: Maybe<Address_Version_From_Events_Stddev_Fields>;
    stddev_pop?: Maybe<Address_Version_From_Events_Stddev_Pop_Fields>;
    stddev_samp?: Maybe<Address_Version_From_Events_Stddev_Samp_Fields>;
    sum?: Maybe<Address_Version_From_Events_Sum_Fields>;
    var_pop?: Maybe<Address_Version_From_Events_Var_Pop_Fields>;
    var_samp?: Maybe<Address_Version_From_Events_Var_Samp_Fields>;
    variance?: Maybe<Address_Version_From_Events_Variance_Fields>;
};
/** aggregate fields of "address_version_from_events" */
type Address_Version_From_Events_Aggregate_FieldsCountArgs = {
    columns?: InputMaybe<Array<Address_Version_From_Events_Select_Column>>;
    distinct?: InputMaybe<Scalars['Boolean']['input']>;
};
/** aggregate avg on columns */
type Address_Version_From_Events_Avg_Fields = {
    __typename?: 'address_version_from_events_avg_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** Boolean expression to filter rows from the table "address_version_from_events". All fields are combined with a logical 'AND'. */
type Address_Version_From_Events_Bool_Exp = {
    _and?: InputMaybe<Array<Address_Version_From_Events_Bool_Exp>>;
    _not?: InputMaybe<Address_Version_From_Events_Bool_Exp>;
    _or?: InputMaybe<Array<Address_Version_From_Events_Bool_Exp>>;
    account_address?: InputMaybe<String_Comparison_Exp>;
    coin_activities?: InputMaybe<Coin_Activities_Bool_Exp>;
    delegated_staking_activities?: InputMaybe<Delegated_Staking_Activities_Bool_Exp>;
    token_activities?: InputMaybe<Token_Activities_Bool_Exp>;
    token_activities_v2?: InputMaybe<Token_Activities_V2_Bool_Exp>;
    transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
};
/** aggregate max on columns */
type Address_Version_From_Events_Max_Fields = {
    __typename?: 'address_version_from_events_max_fields';
    account_address?: Maybe<Scalars['String']['output']>;
    transaction_version?: Maybe<Scalars['bigint']['output']>;
};
/** aggregate min on columns */
type Address_Version_From_Events_Min_Fields = {
    __typename?: 'address_version_from_events_min_fields';
    account_address?: Maybe<Scalars['String']['output']>;
    transaction_version?: Maybe<Scalars['bigint']['output']>;
};
/** Ordering options when selecting data from "address_version_from_events". */
type Address_Version_From_Events_Order_By = {
    account_address?: InputMaybe<Order_By>;
    coin_activities_aggregate?: InputMaybe<Coin_Activities_Aggregate_Order_By>;
    delegated_staking_activities_aggregate?: InputMaybe<Delegated_Staking_Activities_Aggregate_Order_By>;
    token_activities_aggregate?: InputMaybe<Token_Activities_Aggregate_Order_By>;
    token_activities_v2_aggregate?: InputMaybe<Token_Activities_V2_Aggregate_Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** select columns of table "address_version_from_events" */
declare enum Address_Version_From_Events_Select_Column {
    /** column name */
    AccountAddress = "account_address",
    /** column name */
    TransactionVersion = "transaction_version"
}
/** aggregate stddev on columns */
type Address_Version_From_Events_Stddev_Fields = {
    __typename?: 'address_version_from_events_stddev_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate stddev_pop on columns */
type Address_Version_From_Events_Stddev_Pop_Fields = {
    __typename?: 'address_version_from_events_stddev_pop_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate stddev_samp on columns */
type Address_Version_From_Events_Stddev_Samp_Fields = {
    __typename?: 'address_version_from_events_stddev_samp_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** Streaming cursor of the table "address_version_from_events" */
type Address_Version_From_Events_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Address_Version_From_Events_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Address_Version_From_Events_Stream_Cursor_Value_Input = {
    account_address?: InputMaybe<Scalars['String']['input']>;
    transaction_version?: InputMaybe<Scalars['bigint']['input']>;
};
/** aggregate sum on columns */
type Address_Version_From_Events_Sum_Fields = {
    __typename?: 'address_version_from_events_sum_fields';
    transaction_version?: Maybe<Scalars['bigint']['output']>;
};
/** aggregate var_pop on columns */
type Address_Version_From_Events_Var_Pop_Fields = {
    __typename?: 'address_version_from_events_var_pop_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate var_samp on columns */
type Address_Version_From_Events_Var_Samp_Fields = {
    __typename?: 'address_version_from_events_var_samp_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate variance on columns */
type Address_Version_From_Events_Variance_Fields = {
    __typename?: 'address_version_from_events_variance_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** columns and relationships of "address_version_from_move_resources" */
type Address_Version_From_Move_Resources = {
    __typename?: 'address_version_from_move_resources';
    address?: Maybe<Scalars['String']['output']>;
    /** An array relationship */
    coin_activities: Array<Coin_Activities>;
    /** An aggregate relationship */
    coin_activities_aggregate: Coin_Activities_Aggregate;
    /** An array relationship */
    delegated_staking_activities: Array<Delegated_Staking_Activities>;
    /** An array relationship */
    token_activities: Array<Token_Activities>;
    /** An aggregate relationship */
    token_activities_aggregate: Token_Activities_Aggregate;
    /** An array relationship */
    token_activities_v2: Array<Token_Activities_V2>;
    /** An aggregate relationship */
    token_activities_v2_aggregate: Token_Activities_V2_Aggregate;
    transaction_version?: Maybe<Scalars['bigint']['output']>;
};
/** columns and relationships of "address_version_from_move_resources" */
type Address_Version_From_Move_ResourcesCoin_ActivitiesArgs = {
    distinct_on?: InputMaybe<Array<Coin_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Coin_Activities_Order_By>>;
    where?: InputMaybe<Coin_Activities_Bool_Exp>;
};
/** columns and relationships of "address_version_from_move_resources" */
type Address_Version_From_Move_ResourcesCoin_Activities_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Coin_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Coin_Activities_Order_By>>;
    where?: InputMaybe<Coin_Activities_Bool_Exp>;
};
/** columns and relationships of "address_version_from_move_resources" */
type Address_Version_From_Move_ResourcesDelegated_Staking_ActivitiesArgs = {
    distinct_on?: InputMaybe<Array<Delegated_Staking_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Delegated_Staking_Activities_Order_By>>;
    where?: InputMaybe<Delegated_Staking_Activities_Bool_Exp>;
};
/** columns and relationships of "address_version_from_move_resources" */
type Address_Version_From_Move_ResourcesToken_ActivitiesArgs = {
    distinct_on?: InputMaybe<Array<Token_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Activities_Order_By>>;
    where?: InputMaybe<Token_Activities_Bool_Exp>;
};
/** columns and relationships of "address_version_from_move_resources" */
type Address_Version_From_Move_ResourcesToken_Activities_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Token_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Activities_Order_By>>;
    where?: InputMaybe<Token_Activities_Bool_Exp>;
};
/** columns and relationships of "address_version_from_move_resources" */
type Address_Version_From_Move_ResourcesToken_Activities_V2Args = {
    distinct_on?: InputMaybe<Array<Token_Activities_V2_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Activities_V2_Order_By>>;
    where?: InputMaybe<Token_Activities_V2_Bool_Exp>;
};
/** columns and relationships of "address_version_from_move_resources" */
type Address_Version_From_Move_ResourcesToken_Activities_V2_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Token_Activities_V2_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Activities_V2_Order_By>>;
    where?: InputMaybe<Token_Activities_V2_Bool_Exp>;
};
/** aggregated selection of "address_version_from_move_resources" */
type Address_Version_From_Move_Resources_Aggregate = {
    __typename?: 'address_version_from_move_resources_aggregate';
    aggregate?: Maybe<Address_Version_From_Move_Resources_Aggregate_Fields>;
    nodes: Array<Address_Version_From_Move_Resources>;
};
/** aggregate fields of "address_version_from_move_resources" */
type Address_Version_From_Move_Resources_Aggregate_Fields = {
    __typename?: 'address_version_from_move_resources_aggregate_fields';
    avg?: Maybe<Address_Version_From_Move_Resources_Avg_Fields>;
    count: Scalars['Int']['output'];
    max?: Maybe<Address_Version_From_Move_Resources_Max_Fields>;
    min?: Maybe<Address_Version_From_Move_Resources_Min_Fields>;
    stddev?: Maybe<Address_Version_From_Move_Resources_Stddev_Fields>;
    stddev_pop?: Maybe<Address_Version_From_Move_Resources_Stddev_Pop_Fields>;
    stddev_samp?: Maybe<Address_Version_From_Move_Resources_Stddev_Samp_Fields>;
    sum?: Maybe<Address_Version_From_Move_Resources_Sum_Fields>;
    var_pop?: Maybe<Address_Version_From_Move_Resources_Var_Pop_Fields>;
    var_samp?: Maybe<Address_Version_From_Move_Resources_Var_Samp_Fields>;
    variance?: Maybe<Address_Version_From_Move_Resources_Variance_Fields>;
};
/** aggregate fields of "address_version_from_move_resources" */
type Address_Version_From_Move_Resources_Aggregate_FieldsCountArgs = {
    columns?: InputMaybe<Array<Address_Version_From_Move_Resources_Select_Column>>;
    distinct?: InputMaybe<Scalars['Boolean']['input']>;
};
/** aggregate avg on columns */
type Address_Version_From_Move_Resources_Avg_Fields = {
    __typename?: 'address_version_from_move_resources_avg_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** Boolean expression to filter rows from the table "address_version_from_move_resources". All fields are combined with a logical 'AND'. */
type Address_Version_From_Move_Resources_Bool_Exp = {
    _and?: InputMaybe<Array<Address_Version_From_Move_Resources_Bool_Exp>>;
    _not?: InputMaybe<Address_Version_From_Move_Resources_Bool_Exp>;
    _or?: InputMaybe<Array<Address_Version_From_Move_Resources_Bool_Exp>>;
    address?: InputMaybe<String_Comparison_Exp>;
    coin_activities?: InputMaybe<Coin_Activities_Bool_Exp>;
    delegated_staking_activities?: InputMaybe<Delegated_Staking_Activities_Bool_Exp>;
    token_activities?: InputMaybe<Token_Activities_Bool_Exp>;
    token_activities_v2?: InputMaybe<Token_Activities_V2_Bool_Exp>;
    transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
};
/** aggregate max on columns */
type Address_Version_From_Move_Resources_Max_Fields = {
    __typename?: 'address_version_from_move_resources_max_fields';
    address?: Maybe<Scalars['String']['output']>;
    transaction_version?: Maybe<Scalars['bigint']['output']>;
};
/** aggregate min on columns */
type Address_Version_From_Move_Resources_Min_Fields = {
    __typename?: 'address_version_from_move_resources_min_fields';
    address?: Maybe<Scalars['String']['output']>;
    transaction_version?: Maybe<Scalars['bigint']['output']>;
};
/** Ordering options when selecting data from "address_version_from_move_resources". */
type Address_Version_From_Move_Resources_Order_By = {
    address?: InputMaybe<Order_By>;
    coin_activities_aggregate?: InputMaybe<Coin_Activities_Aggregate_Order_By>;
    delegated_staking_activities_aggregate?: InputMaybe<Delegated_Staking_Activities_Aggregate_Order_By>;
    token_activities_aggregate?: InputMaybe<Token_Activities_Aggregate_Order_By>;
    token_activities_v2_aggregate?: InputMaybe<Token_Activities_V2_Aggregate_Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** select columns of table "address_version_from_move_resources" */
declare enum Address_Version_From_Move_Resources_Select_Column {
    /** column name */
    Address = "address",
    /** column name */
    TransactionVersion = "transaction_version"
}
/** aggregate stddev on columns */
type Address_Version_From_Move_Resources_Stddev_Fields = {
    __typename?: 'address_version_from_move_resources_stddev_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate stddev_pop on columns */
type Address_Version_From_Move_Resources_Stddev_Pop_Fields = {
    __typename?: 'address_version_from_move_resources_stddev_pop_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate stddev_samp on columns */
type Address_Version_From_Move_Resources_Stddev_Samp_Fields = {
    __typename?: 'address_version_from_move_resources_stddev_samp_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** Streaming cursor of the table "address_version_from_move_resources" */
type Address_Version_From_Move_Resources_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Address_Version_From_Move_Resources_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Address_Version_From_Move_Resources_Stream_Cursor_Value_Input = {
    address?: InputMaybe<Scalars['String']['input']>;
    transaction_version?: InputMaybe<Scalars['bigint']['input']>;
};
/** aggregate sum on columns */
type Address_Version_From_Move_Resources_Sum_Fields = {
    __typename?: 'address_version_from_move_resources_sum_fields';
    transaction_version?: Maybe<Scalars['bigint']['output']>;
};
/** aggregate var_pop on columns */
type Address_Version_From_Move_Resources_Var_Pop_Fields = {
    __typename?: 'address_version_from_move_resources_var_pop_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate var_samp on columns */
type Address_Version_From_Move_Resources_Var_Samp_Fields = {
    __typename?: 'address_version_from_move_resources_var_samp_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate variance on columns */
type Address_Version_From_Move_Resources_Variance_Fields = {
    __typename?: 'address_version_from_move_resources_variance_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
type Bigint_Comparison_Exp = {
    _eq?: InputMaybe<Scalars['bigint']['input']>;
    _gt?: InputMaybe<Scalars['bigint']['input']>;
    _gte?: InputMaybe<Scalars['bigint']['input']>;
    _in?: InputMaybe<Array<Scalars['bigint']['input']>>;
    _is_null?: InputMaybe<Scalars['Boolean']['input']>;
    _lt?: InputMaybe<Scalars['bigint']['input']>;
    _lte?: InputMaybe<Scalars['bigint']['input']>;
    _neq?: InputMaybe<Scalars['bigint']['input']>;
    _nin?: InputMaybe<Array<Scalars['bigint']['input']>>;
};
/** columns and relationships of "block_metadata_transactions" */
type Block_Metadata_Transactions = {
    __typename?: 'block_metadata_transactions';
    block_height: Scalars['bigint']['output'];
    epoch: Scalars['bigint']['output'];
    failed_proposer_indices: Scalars['jsonb']['output'];
    id: Scalars['String']['output'];
    previous_block_votes_bitvec: Scalars['jsonb']['output'];
    proposer: Scalars['String']['output'];
    round: Scalars['bigint']['output'];
    timestamp: Scalars['timestamp']['output'];
    version: Scalars['bigint']['output'];
};
/** columns and relationships of "block_metadata_transactions" */
type Block_Metadata_TransactionsFailed_Proposer_IndicesArgs = {
    path?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "block_metadata_transactions" */
type Block_Metadata_TransactionsPrevious_Block_Votes_BitvecArgs = {
    path?: InputMaybe<Scalars['String']['input']>;
};
/** Boolean expression to filter rows from the table "block_metadata_transactions". All fields are combined with a logical 'AND'. */
type Block_Metadata_Transactions_Bool_Exp = {
    _and?: InputMaybe<Array<Block_Metadata_Transactions_Bool_Exp>>;
    _not?: InputMaybe<Block_Metadata_Transactions_Bool_Exp>;
    _or?: InputMaybe<Array<Block_Metadata_Transactions_Bool_Exp>>;
    block_height?: InputMaybe<Bigint_Comparison_Exp>;
    epoch?: InputMaybe<Bigint_Comparison_Exp>;
    failed_proposer_indices?: InputMaybe<Jsonb_Comparison_Exp>;
    id?: InputMaybe<String_Comparison_Exp>;
    previous_block_votes_bitvec?: InputMaybe<Jsonb_Comparison_Exp>;
    proposer?: InputMaybe<String_Comparison_Exp>;
    round?: InputMaybe<Bigint_Comparison_Exp>;
    timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    version?: InputMaybe<Bigint_Comparison_Exp>;
};
/** Ordering options when selecting data from "block_metadata_transactions". */
type Block_Metadata_Transactions_Order_By = {
    block_height?: InputMaybe<Order_By>;
    epoch?: InputMaybe<Order_By>;
    failed_proposer_indices?: InputMaybe<Order_By>;
    id?: InputMaybe<Order_By>;
    previous_block_votes_bitvec?: InputMaybe<Order_By>;
    proposer?: InputMaybe<Order_By>;
    round?: InputMaybe<Order_By>;
    timestamp?: InputMaybe<Order_By>;
    version?: InputMaybe<Order_By>;
};
/** select columns of table "block_metadata_transactions" */
declare enum Block_Metadata_Transactions_Select_Column {
    /** column name */
    BlockHeight = "block_height",
    /** column name */
    Epoch = "epoch",
    /** column name */
    FailedProposerIndices = "failed_proposer_indices",
    /** column name */
    Id = "id",
    /** column name */
    PreviousBlockVotesBitvec = "previous_block_votes_bitvec",
    /** column name */
    Proposer = "proposer",
    /** column name */
    Round = "round",
    /** column name */
    Timestamp = "timestamp",
    /** column name */
    Version = "version"
}
/** Streaming cursor of the table "block_metadata_transactions" */
type Block_Metadata_Transactions_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Block_Metadata_Transactions_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Block_Metadata_Transactions_Stream_Cursor_Value_Input = {
    block_height?: InputMaybe<Scalars['bigint']['input']>;
    epoch?: InputMaybe<Scalars['bigint']['input']>;
    failed_proposer_indices?: InputMaybe<Scalars['jsonb']['input']>;
    id?: InputMaybe<Scalars['String']['input']>;
    previous_block_votes_bitvec?: InputMaybe<Scalars['jsonb']['input']>;
    proposer?: InputMaybe<Scalars['String']['input']>;
    round?: InputMaybe<Scalars['bigint']['input']>;
    timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    version?: InputMaybe<Scalars['bigint']['input']>;
};
/** columns and relationships of "coin_activities" */
type Coin_Activities = {
    __typename?: 'coin_activities';
    activity_type: Scalars['String']['output'];
    amount: Scalars['numeric']['output'];
    /** An array relationship */
    aptos_names: Array<Current_Aptos_Names>;
    /** An aggregate relationship */
    aptos_names_aggregate: Current_Aptos_Names_Aggregate;
    block_height: Scalars['bigint']['output'];
    /** An object relationship */
    coin_info?: Maybe<Coin_Infos>;
    coin_type: Scalars['String']['output'];
    entry_function_id_str?: Maybe<Scalars['String']['output']>;
    event_account_address: Scalars['String']['output'];
    event_creation_number: Scalars['bigint']['output'];
    event_index?: Maybe<Scalars['bigint']['output']>;
    event_sequence_number: Scalars['bigint']['output'];
    is_gas_fee: Scalars['Boolean']['output'];
    is_transaction_success: Scalars['Boolean']['output'];
    owner_address: Scalars['String']['output'];
    storage_refund_amount: Scalars['numeric']['output'];
    transaction_timestamp: Scalars['timestamp']['output'];
    transaction_version: Scalars['bigint']['output'];
};
/** columns and relationships of "coin_activities" */
type Coin_ActivitiesAptos_NamesArgs = {
    distinct_on?: InputMaybe<Array<Current_Aptos_Names_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Aptos_Names_Order_By>>;
    where?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
};
/** columns and relationships of "coin_activities" */
type Coin_ActivitiesAptos_Names_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Current_Aptos_Names_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Aptos_Names_Order_By>>;
    where?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
};
/** aggregated selection of "coin_activities" */
type Coin_Activities_Aggregate = {
    __typename?: 'coin_activities_aggregate';
    aggregate?: Maybe<Coin_Activities_Aggregate_Fields>;
    nodes: Array<Coin_Activities>;
};
/** aggregate fields of "coin_activities" */
type Coin_Activities_Aggregate_Fields = {
    __typename?: 'coin_activities_aggregate_fields';
    avg?: Maybe<Coin_Activities_Avg_Fields>;
    count: Scalars['Int']['output'];
    max?: Maybe<Coin_Activities_Max_Fields>;
    min?: Maybe<Coin_Activities_Min_Fields>;
    stddev?: Maybe<Coin_Activities_Stddev_Fields>;
    stddev_pop?: Maybe<Coin_Activities_Stddev_Pop_Fields>;
    stddev_samp?: Maybe<Coin_Activities_Stddev_Samp_Fields>;
    sum?: Maybe<Coin_Activities_Sum_Fields>;
    var_pop?: Maybe<Coin_Activities_Var_Pop_Fields>;
    var_samp?: Maybe<Coin_Activities_Var_Samp_Fields>;
    variance?: Maybe<Coin_Activities_Variance_Fields>;
};
/** aggregate fields of "coin_activities" */
type Coin_Activities_Aggregate_FieldsCountArgs = {
    columns?: InputMaybe<Array<Coin_Activities_Select_Column>>;
    distinct?: InputMaybe<Scalars['Boolean']['input']>;
};
/** order by aggregate values of table "coin_activities" */
type Coin_Activities_Aggregate_Order_By = {
    avg?: InputMaybe<Coin_Activities_Avg_Order_By>;
    count?: InputMaybe<Order_By>;
    max?: InputMaybe<Coin_Activities_Max_Order_By>;
    min?: InputMaybe<Coin_Activities_Min_Order_By>;
    stddev?: InputMaybe<Coin_Activities_Stddev_Order_By>;
    stddev_pop?: InputMaybe<Coin_Activities_Stddev_Pop_Order_By>;
    stddev_samp?: InputMaybe<Coin_Activities_Stddev_Samp_Order_By>;
    sum?: InputMaybe<Coin_Activities_Sum_Order_By>;
    var_pop?: InputMaybe<Coin_Activities_Var_Pop_Order_By>;
    var_samp?: InputMaybe<Coin_Activities_Var_Samp_Order_By>;
    variance?: InputMaybe<Coin_Activities_Variance_Order_By>;
};
/** aggregate avg on columns */
type Coin_Activities_Avg_Fields = {
    __typename?: 'coin_activities_avg_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    block_height?: Maybe<Scalars['Float']['output']>;
    event_creation_number?: Maybe<Scalars['Float']['output']>;
    event_index?: Maybe<Scalars['Float']['output']>;
    event_sequence_number?: Maybe<Scalars['Float']['output']>;
    storage_refund_amount?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by avg() on columns of table "coin_activities" */
type Coin_Activities_Avg_Order_By = {
    amount?: InputMaybe<Order_By>;
    block_height?: InputMaybe<Order_By>;
    event_creation_number?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_sequence_number?: InputMaybe<Order_By>;
    storage_refund_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** Boolean expression to filter rows from the table "coin_activities". All fields are combined with a logical 'AND'. */
type Coin_Activities_Bool_Exp = {
    _and?: InputMaybe<Array<Coin_Activities_Bool_Exp>>;
    _not?: InputMaybe<Coin_Activities_Bool_Exp>;
    _or?: InputMaybe<Array<Coin_Activities_Bool_Exp>>;
    activity_type?: InputMaybe<String_Comparison_Exp>;
    amount?: InputMaybe<Numeric_Comparison_Exp>;
    aptos_names?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
    block_height?: InputMaybe<Bigint_Comparison_Exp>;
    coin_info?: InputMaybe<Coin_Infos_Bool_Exp>;
    coin_type?: InputMaybe<String_Comparison_Exp>;
    entry_function_id_str?: InputMaybe<String_Comparison_Exp>;
    event_account_address?: InputMaybe<String_Comparison_Exp>;
    event_creation_number?: InputMaybe<Bigint_Comparison_Exp>;
    event_index?: InputMaybe<Bigint_Comparison_Exp>;
    event_sequence_number?: InputMaybe<Bigint_Comparison_Exp>;
    is_gas_fee?: InputMaybe<Boolean_Comparison_Exp>;
    is_transaction_success?: InputMaybe<Boolean_Comparison_Exp>;
    owner_address?: InputMaybe<String_Comparison_Exp>;
    storage_refund_amount?: InputMaybe<Numeric_Comparison_Exp>;
    transaction_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
};
/** aggregate max on columns */
type Coin_Activities_Max_Fields = {
    __typename?: 'coin_activities_max_fields';
    activity_type?: Maybe<Scalars['String']['output']>;
    amount?: Maybe<Scalars['numeric']['output']>;
    block_height?: Maybe<Scalars['bigint']['output']>;
    coin_type?: Maybe<Scalars['String']['output']>;
    entry_function_id_str?: Maybe<Scalars['String']['output']>;
    event_account_address?: Maybe<Scalars['String']['output']>;
    event_creation_number?: Maybe<Scalars['bigint']['output']>;
    event_index?: Maybe<Scalars['bigint']['output']>;
    event_sequence_number?: Maybe<Scalars['bigint']['output']>;
    owner_address?: Maybe<Scalars['String']['output']>;
    storage_refund_amount?: Maybe<Scalars['numeric']['output']>;
    transaction_timestamp?: Maybe<Scalars['timestamp']['output']>;
    transaction_version?: Maybe<Scalars['bigint']['output']>;
};
/** order by max() on columns of table "coin_activities" */
type Coin_Activities_Max_Order_By = {
    activity_type?: InputMaybe<Order_By>;
    amount?: InputMaybe<Order_By>;
    block_height?: InputMaybe<Order_By>;
    coin_type?: InputMaybe<Order_By>;
    entry_function_id_str?: InputMaybe<Order_By>;
    event_account_address?: InputMaybe<Order_By>;
    event_creation_number?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_sequence_number?: InputMaybe<Order_By>;
    owner_address?: InputMaybe<Order_By>;
    storage_refund_amount?: InputMaybe<Order_By>;
    transaction_timestamp?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** aggregate min on columns */
type Coin_Activities_Min_Fields = {
    __typename?: 'coin_activities_min_fields';
    activity_type?: Maybe<Scalars['String']['output']>;
    amount?: Maybe<Scalars['numeric']['output']>;
    block_height?: Maybe<Scalars['bigint']['output']>;
    coin_type?: Maybe<Scalars['String']['output']>;
    entry_function_id_str?: Maybe<Scalars['String']['output']>;
    event_account_address?: Maybe<Scalars['String']['output']>;
    event_creation_number?: Maybe<Scalars['bigint']['output']>;
    event_index?: Maybe<Scalars['bigint']['output']>;
    event_sequence_number?: Maybe<Scalars['bigint']['output']>;
    owner_address?: Maybe<Scalars['String']['output']>;
    storage_refund_amount?: Maybe<Scalars['numeric']['output']>;
    transaction_timestamp?: Maybe<Scalars['timestamp']['output']>;
    transaction_version?: Maybe<Scalars['bigint']['output']>;
};
/** order by min() on columns of table "coin_activities" */
type Coin_Activities_Min_Order_By = {
    activity_type?: InputMaybe<Order_By>;
    amount?: InputMaybe<Order_By>;
    block_height?: InputMaybe<Order_By>;
    coin_type?: InputMaybe<Order_By>;
    entry_function_id_str?: InputMaybe<Order_By>;
    event_account_address?: InputMaybe<Order_By>;
    event_creation_number?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_sequence_number?: InputMaybe<Order_By>;
    owner_address?: InputMaybe<Order_By>;
    storage_refund_amount?: InputMaybe<Order_By>;
    transaction_timestamp?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** Ordering options when selecting data from "coin_activities". */
type Coin_Activities_Order_By = {
    activity_type?: InputMaybe<Order_By>;
    amount?: InputMaybe<Order_By>;
    aptos_names_aggregate?: InputMaybe<Current_Aptos_Names_Aggregate_Order_By>;
    block_height?: InputMaybe<Order_By>;
    coin_info?: InputMaybe<Coin_Infos_Order_By>;
    coin_type?: InputMaybe<Order_By>;
    entry_function_id_str?: InputMaybe<Order_By>;
    event_account_address?: InputMaybe<Order_By>;
    event_creation_number?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_sequence_number?: InputMaybe<Order_By>;
    is_gas_fee?: InputMaybe<Order_By>;
    is_transaction_success?: InputMaybe<Order_By>;
    owner_address?: InputMaybe<Order_By>;
    storage_refund_amount?: InputMaybe<Order_By>;
    transaction_timestamp?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** select columns of table "coin_activities" */
declare enum Coin_Activities_Select_Column {
    /** column name */
    ActivityType = "activity_type",
    /** column name */
    Amount = "amount",
    /** column name */
    BlockHeight = "block_height",
    /** column name */
    CoinType = "coin_type",
    /** column name */
    EntryFunctionIdStr = "entry_function_id_str",
    /** column name */
    EventAccountAddress = "event_account_address",
    /** column name */
    EventCreationNumber = "event_creation_number",
    /** column name */
    EventIndex = "event_index",
    /** column name */
    EventSequenceNumber = "event_sequence_number",
    /** column name */
    IsGasFee = "is_gas_fee",
    /** column name */
    IsTransactionSuccess = "is_transaction_success",
    /** column name */
    OwnerAddress = "owner_address",
    /** column name */
    StorageRefundAmount = "storage_refund_amount",
    /** column name */
    TransactionTimestamp = "transaction_timestamp",
    /** column name */
    TransactionVersion = "transaction_version"
}
/** aggregate stddev on columns */
type Coin_Activities_Stddev_Fields = {
    __typename?: 'coin_activities_stddev_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    block_height?: Maybe<Scalars['Float']['output']>;
    event_creation_number?: Maybe<Scalars['Float']['output']>;
    event_index?: Maybe<Scalars['Float']['output']>;
    event_sequence_number?: Maybe<Scalars['Float']['output']>;
    storage_refund_amount?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by stddev() on columns of table "coin_activities" */
type Coin_Activities_Stddev_Order_By = {
    amount?: InputMaybe<Order_By>;
    block_height?: InputMaybe<Order_By>;
    event_creation_number?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_sequence_number?: InputMaybe<Order_By>;
    storage_refund_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** aggregate stddev_pop on columns */
type Coin_Activities_Stddev_Pop_Fields = {
    __typename?: 'coin_activities_stddev_pop_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    block_height?: Maybe<Scalars['Float']['output']>;
    event_creation_number?: Maybe<Scalars['Float']['output']>;
    event_index?: Maybe<Scalars['Float']['output']>;
    event_sequence_number?: Maybe<Scalars['Float']['output']>;
    storage_refund_amount?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by stddev_pop() on columns of table "coin_activities" */
type Coin_Activities_Stddev_Pop_Order_By = {
    amount?: InputMaybe<Order_By>;
    block_height?: InputMaybe<Order_By>;
    event_creation_number?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_sequence_number?: InputMaybe<Order_By>;
    storage_refund_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** aggregate stddev_samp on columns */
type Coin_Activities_Stddev_Samp_Fields = {
    __typename?: 'coin_activities_stddev_samp_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    block_height?: Maybe<Scalars['Float']['output']>;
    event_creation_number?: Maybe<Scalars['Float']['output']>;
    event_index?: Maybe<Scalars['Float']['output']>;
    event_sequence_number?: Maybe<Scalars['Float']['output']>;
    storage_refund_amount?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by stddev_samp() on columns of table "coin_activities" */
type Coin_Activities_Stddev_Samp_Order_By = {
    amount?: InputMaybe<Order_By>;
    block_height?: InputMaybe<Order_By>;
    event_creation_number?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_sequence_number?: InputMaybe<Order_By>;
    storage_refund_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** Streaming cursor of the table "coin_activities" */
type Coin_Activities_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Coin_Activities_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Coin_Activities_Stream_Cursor_Value_Input = {
    activity_type?: InputMaybe<Scalars['String']['input']>;
    amount?: InputMaybe<Scalars['numeric']['input']>;
    block_height?: InputMaybe<Scalars['bigint']['input']>;
    coin_type?: InputMaybe<Scalars['String']['input']>;
    entry_function_id_str?: InputMaybe<Scalars['String']['input']>;
    event_account_address?: InputMaybe<Scalars['String']['input']>;
    event_creation_number?: InputMaybe<Scalars['bigint']['input']>;
    event_index?: InputMaybe<Scalars['bigint']['input']>;
    event_sequence_number?: InputMaybe<Scalars['bigint']['input']>;
    is_gas_fee?: InputMaybe<Scalars['Boolean']['input']>;
    is_transaction_success?: InputMaybe<Scalars['Boolean']['input']>;
    owner_address?: InputMaybe<Scalars['String']['input']>;
    storage_refund_amount?: InputMaybe<Scalars['numeric']['input']>;
    transaction_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    transaction_version?: InputMaybe<Scalars['bigint']['input']>;
};
/** aggregate sum on columns */
type Coin_Activities_Sum_Fields = {
    __typename?: 'coin_activities_sum_fields';
    amount?: Maybe<Scalars['numeric']['output']>;
    block_height?: Maybe<Scalars['bigint']['output']>;
    event_creation_number?: Maybe<Scalars['bigint']['output']>;
    event_index?: Maybe<Scalars['bigint']['output']>;
    event_sequence_number?: Maybe<Scalars['bigint']['output']>;
    storage_refund_amount?: Maybe<Scalars['numeric']['output']>;
    transaction_version?: Maybe<Scalars['bigint']['output']>;
};
/** order by sum() on columns of table "coin_activities" */
type Coin_Activities_Sum_Order_By = {
    amount?: InputMaybe<Order_By>;
    block_height?: InputMaybe<Order_By>;
    event_creation_number?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_sequence_number?: InputMaybe<Order_By>;
    storage_refund_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** aggregate var_pop on columns */
type Coin_Activities_Var_Pop_Fields = {
    __typename?: 'coin_activities_var_pop_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    block_height?: Maybe<Scalars['Float']['output']>;
    event_creation_number?: Maybe<Scalars['Float']['output']>;
    event_index?: Maybe<Scalars['Float']['output']>;
    event_sequence_number?: Maybe<Scalars['Float']['output']>;
    storage_refund_amount?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by var_pop() on columns of table "coin_activities" */
type Coin_Activities_Var_Pop_Order_By = {
    amount?: InputMaybe<Order_By>;
    block_height?: InputMaybe<Order_By>;
    event_creation_number?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_sequence_number?: InputMaybe<Order_By>;
    storage_refund_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** aggregate var_samp on columns */
type Coin_Activities_Var_Samp_Fields = {
    __typename?: 'coin_activities_var_samp_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    block_height?: Maybe<Scalars['Float']['output']>;
    event_creation_number?: Maybe<Scalars['Float']['output']>;
    event_index?: Maybe<Scalars['Float']['output']>;
    event_sequence_number?: Maybe<Scalars['Float']['output']>;
    storage_refund_amount?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by var_samp() on columns of table "coin_activities" */
type Coin_Activities_Var_Samp_Order_By = {
    amount?: InputMaybe<Order_By>;
    block_height?: InputMaybe<Order_By>;
    event_creation_number?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_sequence_number?: InputMaybe<Order_By>;
    storage_refund_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** aggregate variance on columns */
type Coin_Activities_Variance_Fields = {
    __typename?: 'coin_activities_variance_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    block_height?: Maybe<Scalars['Float']['output']>;
    event_creation_number?: Maybe<Scalars['Float']['output']>;
    event_index?: Maybe<Scalars['Float']['output']>;
    event_sequence_number?: Maybe<Scalars['Float']['output']>;
    storage_refund_amount?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by variance() on columns of table "coin_activities" */
type Coin_Activities_Variance_Order_By = {
    amount?: InputMaybe<Order_By>;
    block_height?: InputMaybe<Order_By>;
    event_creation_number?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_sequence_number?: InputMaybe<Order_By>;
    storage_refund_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** columns and relationships of "coin_balances" */
type Coin_Balances = {
    __typename?: 'coin_balances';
    amount: Scalars['numeric']['output'];
    coin_type: Scalars['String']['output'];
    coin_type_hash: Scalars['String']['output'];
    owner_address: Scalars['String']['output'];
    transaction_timestamp: Scalars['timestamp']['output'];
    transaction_version: Scalars['bigint']['output'];
};
/** Boolean expression to filter rows from the table "coin_balances". All fields are combined with a logical 'AND'. */
type Coin_Balances_Bool_Exp = {
    _and?: InputMaybe<Array<Coin_Balances_Bool_Exp>>;
    _not?: InputMaybe<Coin_Balances_Bool_Exp>;
    _or?: InputMaybe<Array<Coin_Balances_Bool_Exp>>;
    amount?: InputMaybe<Numeric_Comparison_Exp>;
    coin_type?: InputMaybe<String_Comparison_Exp>;
    coin_type_hash?: InputMaybe<String_Comparison_Exp>;
    owner_address?: InputMaybe<String_Comparison_Exp>;
    transaction_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
};
/** Ordering options when selecting data from "coin_balances". */
type Coin_Balances_Order_By = {
    amount?: InputMaybe<Order_By>;
    coin_type?: InputMaybe<Order_By>;
    coin_type_hash?: InputMaybe<Order_By>;
    owner_address?: InputMaybe<Order_By>;
    transaction_timestamp?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** select columns of table "coin_balances" */
declare enum Coin_Balances_Select_Column {
    /** column name */
    Amount = "amount",
    /** column name */
    CoinType = "coin_type",
    /** column name */
    CoinTypeHash = "coin_type_hash",
    /** column name */
    OwnerAddress = "owner_address",
    /** column name */
    TransactionTimestamp = "transaction_timestamp",
    /** column name */
    TransactionVersion = "transaction_version"
}
/** Streaming cursor of the table "coin_balances" */
type Coin_Balances_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Coin_Balances_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Coin_Balances_Stream_Cursor_Value_Input = {
    amount?: InputMaybe<Scalars['numeric']['input']>;
    coin_type?: InputMaybe<Scalars['String']['input']>;
    coin_type_hash?: InputMaybe<Scalars['String']['input']>;
    owner_address?: InputMaybe<Scalars['String']['input']>;
    transaction_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    transaction_version?: InputMaybe<Scalars['bigint']['input']>;
};
/** columns and relationships of "coin_infos" */
type Coin_Infos = {
    __typename?: 'coin_infos';
    coin_type: Scalars['String']['output'];
    coin_type_hash: Scalars['String']['output'];
    creator_address: Scalars['String']['output'];
    decimals: Scalars['Int']['output'];
    name: Scalars['String']['output'];
    supply_aggregator_table_handle?: Maybe<Scalars['String']['output']>;
    supply_aggregator_table_key?: Maybe<Scalars['String']['output']>;
    symbol: Scalars['String']['output'];
    transaction_created_timestamp: Scalars['timestamp']['output'];
    transaction_version_created: Scalars['bigint']['output'];
};
/** Boolean expression to filter rows from the table "coin_infos". All fields are combined with a logical 'AND'. */
type Coin_Infos_Bool_Exp = {
    _and?: InputMaybe<Array<Coin_Infos_Bool_Exp>>;
    _not?: InputMaybe<Coin_Infos_Bool_Exp>;
    _or?: InputMaybe<Array<Coin_Infos_Bool_Exp>>;
    coin_type?: InputMaybe<String_Comparison_Exp>;
    coin_type_hash?: InputMaybe<String_Comparison_Exp>;
    creator_address?: InputMaybe<String_Comparison_Exp>;
    decimals?: InputMaybe<Int_Comparison_Exp>;
    name?: InputMaybe<String_Comparison_Exp>;
    supply_aggregator_table_handle?: InputMaybe<String_Comparison_Exp>;
    supply_aggregator_table_key?: InputMaybe<String_Comparison_Exp>;
    symbol?: InputMaybe<String_Comparison_Exp>;
    transaction_created_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    transaction_version_created?: InputMaybe<Bigint_Comparison_Exp>;
};
/** Ordering options when selecting data from "coin_infos". */
type Coin_Infos_Order_By = {
    coin_type?: InputMaybe<Order_By>;
    coin_type_hash?: InputMaybe<Order_By>;
    creator_address?: InputMaybe<Order_By>;
    decimals?: InputMaybe<Order_By>;
    name?: InputMaybe<Order_By>;
    supply_aggregator_table_handle?: InputMaybe<Order_By>;
    supply_aggregator_table_key?: InputMaybe<Order_By>;
    symbol?: InputMaybe<Order_By>;
    transaction_created_timestamp?: InputMaybe<Order_By>;
    transaction_version_created?: InputMaybe<Order_By>;
};
/** select columns of table "coin_infos" */
declare enum Coin_Infos_Select_Column {
    /** column name */
    CoinType = "coin_type",
    /** column name */
    CoinTypeHash = "coin_type_hash",
    /** column name */
    CreatorAddress = "creator_address",
    /** column name */
    Decimals = "decimals",
    /** column name */
    Name = "name",
    /** column name */
    SupplyAggregatorTableHandle = "supply_aggregator_table_handle",
    /** column name */
    SupplyAggregatorTableKey = "supply_aggregator_table_key",
    /** column name */
    Symbol = "symbol",
    /** column name */
    TransactionCreatedTimestamp = "transaction_created_timestamp",
    /** column name */
    TransactionVersionCreated = "transaction_version_created"
}
/** Streaming cursor of the table "coin_infos" */
type Coin_Infos_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Coin_Infos_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Coin_Infos_Stream_Cursor_Value_Input = {
    coin_type?: InputMaybe<Scalars['String']['input']>;
    coin_type_hash?: InputMaybe<Scalars['String']['input']>;
    creator_address?: InputMaybe<Scalars['String']['input']>;
    decimals?: InputMaybe<Scalars['Int']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
    supply_aggregator_table_handle?: InputMaybe<Scalars['String']['input']>;
    supply_aggregator_table_key?: InputMaybe<Scalars['String']['input']>;
    symbol?: InputMaybe<Scalars['String']['input']>;
    transaction_created_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    transaction_version_created?: InputMaybe<Scalars['bigint']['input']>;
};
/** columns and relationships of "coin_supply" */
type Coin_Supply = {
    __typename?: 'coin_supply';
    coin_type: Scalars['String']['output'];
    coin_type_hash: Scalars['String']['output'];
    supply: Scalars['numeric']['output'];
    transaction_epoch: Scalars['bigint']['output'];
    transaction_timestamp: Scalars['timestamp']['output'];
    transaction_version: Scalars['bigint']['output'];
};
/** Boolean expression to filter rows from the table "coin_supply". All fields are combined with a logical 'AND'. */
type Coin_Supply_Bool_Exp = {
    _and?: InputMaybe<Array<Coin_Supply_Bool_Exp>>;
    _not?: InputMaybe<Coin_Supply_Bool_Exp>;
    _or?: InputMaybe<Array<Coin_Supply_Bool_Exp>>;
    coin_type?: InputMaybe<String_Comparison_Exp>;
    coin_type_hash?: InputMaybe<String_Comparison_Exp>;
    supply?: InputMaybe<Numeric_Comparison_Exp>;
    transaction_epoch?: InputMaybe<Bigint_Comparison_Exp>;
    transaction_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
};
/** Ordering options when selecting data from "coin_supply". */
type Coin_Supply_Order_By = {
    coin_type?: InputMaybe<Order_By>;
    coin_type_hash?: InputMaybe<Order_By>;
    supply?: InputMaybe<Order_By>;
    transaction_epoch?: InputMaybe<Order_By>;
    transaction_timestamp?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** select columns of table "coin_supply" */
declare enum Coin_Supply_Select_Column {
    /** column name */
    CoinType = "coin_type",
    /** column name */
    CoinTypeHash = "coin_type_hash",
    /** column name */
    Supply = "supply",
    /** column name */
    TransactionEpoch = "transaction_epoch",
    /** column name */
    TransactionTimestamp = "transaction_timestamp",
    /** column name */
    TransactionVersion = "transaction_version"
}
/** Streaming cursor of the table "coin_supply" */
type Coin_Supply_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Coin_Supply_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Coin_Supply_Stream_Cursor_Value_Input = {
    coin_type?: InputMaybe<Scalars['String']['input']>;
    coin_type_hash?: InputMaybe<Scalars['String']['input']>;
    supply?: InputMaybe<Scalars['numeric']['input']>;
    transaction_epoch?: InputMaybe<Scalars['bigint']['input']>;
    transaction_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    transaction_version?: InputMaybe<Scalars['bigint']['input']>;
};
/** columns and relationships of "collection_datas" */
type Collection_Datas = {
    __typename?: 'collection_datas';
    collection_data_id_hash: Scalars['String']['output'];
    collection_name: Scalars['String']['output'];
    creator_address: Scalars['String']['output'];
    description: Scalars['String']['output'];
    description_mutable: Scalars['Boolean']['output'];
    maximum: Scalars['numeric']['output'];
    maximum_mutable: Scalars['Boolean']['output'];
    metadata_uri: Scalars['String']['output'];
    supply: Scalars['numeric']['output'];
    table_handle: Scalars['String']['output'];
    transaction_timestamp: Scalars['timestamp']['output'];
    transaction_version: Scalars['bigint']['output'];
    uri_mutable: Scalars['Boolean']['output'];
};
/** Boolean expression to filter rows from the table "collection_datas". All fields are combined with a logical 'AND'. */
type Collection_Datas_Bool_Exp = {
    _and?: InputMaybe<Array<Collection_Datas_Bool_Exp>>;
    _not?: InputMaybe<Collection_Datas_Bool_Exp>;
    _or?: InputMaybe<Array<Collection_Datas_Bool_Exp>>;
    collection_data_id_hash?: InputMaybe<String_Comparison_Exp>;
    collection_name?: InputMaybe<String_Comparison_Exp>;
    creator_address?: InputMaybe<String_Comparison_Exp>;
    description?: InputMaybe<String_Comparison_Exp>;
    description_mutable?: InputMaybe<Boolean_Comparison_Exp>;
    maximum?: InputMaybe<Numeric_Comparison_Exp>;
    maximum_mutable?: InputMaybe<Boolean_Comparison_Exp>;
    metadata_uri?: InputMaybe<String_Comparison_Exp>;
    supply?: InputMaybe<Numeric_Comparison_Exp>;
    table_handle?: InputMaybe<String_Comparison_Exp>;
    transaction_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    uri_mutable?: InputMaybe<Boolean_Comparison_Exp>;
};
/** Ordering options when selecting data from "collection_datas". */
type Collection_Datas_Order_By = {
    collection_data_id_hash?: InputMaybe<Order_By>;
    collection_name?: InputMaybe<Order_By>;
    creator_address?: InputMaybe<Order_By>;
    description?: InputMaybe<Order_By>;
    description_mutable?: InputMaybe<Order_By>;
    maximum?: InputMaybe<Order_By>;
    maximum_mutable?: InputMaybe<Order_By>;
    metadata_uri?: InputMaybe<Order_By>;
    supply?: InputMaybe<Order_By>;
    table_handle?: InputMaybe<Order_By>;
    transaction_timestamp?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
    uri_mutable?: InputMaybe<Order_By>;
};
/** select columns of table "collection_datas" */
declare enum Collection_Datas_Select_Column {
    /** column name */
    CollectionDataIdHash = "collection_data_id_hash",
    /** column name */
    CollectionName = "collection_name",
    /** column name */
    CreatorAddress = "creator_address",
    /** column name */
    Description = "description",
    /** column name */
    DescriptionMutable = "description_mutable",
    /** column name */
    Maximum = "maximum",
    /** column name */
    MaximumMutable = "maximum_mutable",
    /** column name */
    MetadataUri = "metadata_uri",
    /** column name */
    Supply = "supply",
    /** column name */
    TableHandle = "table_handle",
    /** column name */
    TransactionTimestamp = "transaction_timestamp",
    /** column name */
    TransactionVersion = "transaction_version",
    /** column name */
    UriMutable = "uri_mutable"
}
/** Streaming cursor of the table "collection_datas" */
type Collection_Datas_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Collection_Datas_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Collection_Datas_Stream_Cursor_Value_Input = {
    collection_data_id_hash?: InputMaybe<Scalars['String']['input']>;
    collection_name?: InputMaybe<Scalars['String']['input']>;
    creator_address?: InputMaybe<Scalars['String']['input']>;
    description?: InputMaybe<Scalars['String']['input']>;
    description_mutable?: InputMaybe<Scalars['Boolean']['input']>;
    maximum?: InputMaybe<Scalars['numeric']['input']>;
    maximum_mutable?: InputMaybe<Scalars['Boolean']['input']>;
    metadata_uri?: InputMaybe<Scalars['String']['input']>;
    supply?: InputMaybe<Scalars['numeric']['input']>;
    table_handle?: InputMaybe<Scalars['String']['input']>;
    transaction_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    uri_mutable?: InputMaybe<Scalars['Boolean']['input']>;
};
/** columns and relationships of "current_ans_lookup" */
type Current_Ans_Lookup = {
    __typename?: 'current_ans_lookup';
    /** An array relationship */
    all_token_ownerships: Array<Current_Token_Ownerships>;
    /** An aggregate relationship */
    all_token_ownerships_aggregate: Current_Token_Ownerships_Aggregate;
    domain: Scalars['String']['output'];
    expiration_timestamp: Scalars['timestamp']['output'];
    is_deleted: Scalars['Boolean']['output'];
    last_transaction_version: Scalars['bigint']['output'];
    registered_address?: Maybe<Scalars['String']['output']>;
    subdomain: Scalars['String']['output'];
    token_name: Scalars['String']['output'];
};
/** columns and relationships of "current_ans_lookup" */
type Current_Ans_LookupAll_Token_OwnershipsArgs = {
    distinct_on?: InputMaybe<Array<Current_Token_Ownerships_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Token_Ownerships_Order_By>>;
    where?: InputMaybe<Current_Token_Ownerships_Bool_Exp>;
};
/** columns and relationships of "current_ans_lookup" */
type Current_Ans_LookupAll_Token_Ownerships_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Current_Token_Ownerships_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Token_Ownerships_Order_By>>;
    where?: InputMaybe<Current_Token_Ownerships_Bool_Exp>;
};
/** Boolean expression to filter rows from the table "current_ans_lookup". All fields are combined with a logical 'AND'. */
type Current_Ans_Lookup_Bool_Exp = {
    _and?: InputMaybe<Array<Current_Ans_Lookup_Bool_Exp>>;
    _not?: InputMaybe<Current_Ans_Lookup_Bool_Exp>;
    _or?: InputMaybe<Array<Current_Ans_Lookup_Bool_Exp>>;
    all_token_ownerships?: InputMaybe<Current_Token_Ownerships_Bool_Exp>;
    domain?: InputMaybe<String_Comparison_Exp>;
    expiration_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    is_deleted?: InputMaybe<Boolean_Comparison_Exp>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    registered_address?: InputMaybe<String_Comparison_Exp>;
    subdomain?: InputMaybe<String_Comparison_Exp>;
    token_name?: InputMaybe<String_Comparison_Exp>;
};
/** Ordering options when selecting data from "current_ans_lookup". */
type Current_Ans_Lookup_Order_By = {
    all_token_ownerships_aggregate?: InputMaybe<Current_Token_Ownerships_Aggregate_Order_By>;
    domain?: InputMaybe<Order_By>;
    expiration_timestamp?: InputMaybe<Order_By>;
    is_deleted?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    registered_address?: InputMaybe<Order_By>;
    subdomain?: InputMaybe<Order_By>;
    token_name?: InputMaybe<Order_By>;
};
/** select columns of table "current_ans_lookup" */
declare enum Current_Ans_Lookup_Select_Column {
    /** column name */
    Domain = "domain",
    /** column name */
    ExpirationTimestamp = "expiration_timestamp",
    /** column name */
    IsDeleted = "is_deleted",
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    RegisteredAddress = "registered_address",
    /** column name */
    Subdomain = "subdomain",
    /** column name */
    TokenName = "token_name"
}
/** Streaming cursor of the table "current_ans_lookup" */
type Current_Ans_Lookup_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Current_Ans_Lookup_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Current_Ans_Lookup_Stream_Cursor_Value_Input = {
    domain?: InputMaybe<Scalars['String']['input']>;
    expiration_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    is_deleted?: InputMaybe<Scalars['Boolean']['input']>;
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    registered_address?: InputMaybe<Scalars['String']['input']>;
    subdomain?: InputMaybe<Scalars['String']['input']>;
    token_name?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "current_ans_lookup_v2" */
type Current_Ans_Lookup_V2 = {
    __typename?: 'current_ans_lookup_v2';
    domain: Scalars['String']['output'];
    expiration_timestamp: Scalars['timestamp']['output'];
    is_deleted: Scalars['Boolean']['output'];
    last_transaction_version: Scalars['bigint']['output'];
    registered_address?: Maybe<Scalars['String']['output']>;
    subdomain: Scalars['String']['output'];
    token_name?: Maybe<Scalars['String']['output']>;
    token_standard: Scalars['String']['output'];
};
/** Boolean expression to filter rows from the table "current_ans_lookup_v2". All fields are combined with a logical 'AND'. */
type Current_Ans_Lookup_V2_Bool_Exp = {
    _and?: InputMaybe<Array<Current_Ans_Lookup_V2_Bool_Exp>>;
    _not?: InputMaybe<Current_Ans_Lookup_V2_Bool_Exp>;
    _or?: InputMaybe<Array<Current_Ans_Lookup_V2_Bool_Exp>>;
    domain?: InputMaybe<String_Comparison_Exp>;
    expiration_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    is_deleted?: InputMaybe<Boolean_Comparison_Exp>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    registered_address?: InputMaybe<String_Comparison_Exp>;
    subdomain?: InputMaybe<String_Comparison_Exp>;
    token_name?: InputMaybe<String_Comparison_Exp>;
    token_standard?: InputMaybe<String_Comparison_Exp>;
};
/** Ordering options when selecting data from "current_ans_lookup_v2". */
type Current_Ans_Lookup_V2_Order_By = {
    domain?: InputMaybe<Order_By>;
    expiration_timestamp?: InputMaybe<Order_By>;
    is_deleted?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    registered_address?: InputMaybe<Order_By>;
    subdomain?: InputMaybe<Order_By>;
    token_name?: InputMaybe<Order_By>;
    token_standard?: InputMaybe<Order_By>;
};
/** select columns of table "current_ans_lookup_v2" */
declare enum Current_Ans_Lookup_V2_Select_Column {
    /** column name */
    Domain = "domain",
    /** column name */
    ExpirationTimestamp = "expiration_timestamp",
    /** column name */
    IsDeleted = "is_deleted",
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    RegisteredAddress = "registered_address",
    /** column name */
    Subdomain = "subdomain",
    /** column name */
    TokenName = "token_name",
    /** column name */
    TokenStandard = "token_standard"
}
/** Streaming cursor of the table "current_ans_lookup_v2" */
type Current_Ans_Lookup_V2_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Current_Ans_Lookup_V2_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Current_Ans_Lookup_V2_Stream_Cursor_Value_Input = {
    domain?: InputMaybe<Scalars['String']['input']>;
    expiration_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    is_deleted?: InputMaybe<Scalars['Boolean']['input']>;
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    registered_address?: InputMaybe<Scalars['String']['input']>;
    subdomain?: InputMaybe<Scalars['String']['input']>;
    token_name?: InputMaybe<Scalars['String']['input']>;
    token_standard?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "current_aptos_names" */
type Current_Aptos_Names = {
    __typename?: 'current_aptos_names';
    domain?: Maybe<Scalars['String']['output']>;
    domain_with_suffix?: Maybe<Scalars['String']['output']>;
    expiration_timestamp?: Maybe<Scalars['timestamp']['output']>;
    is_active?: Maybe<Scalars['Boolean']['output']>;
    /** An object relationship */
    is_domain_owner?: Maybe<Current_Aptos_Names>;
    is_primary?: Maybe<Scalars['Boolean']['output']>;
    last_transaction_version?: Maybe<Scalars['bigint']['output']>;
    owner_address?: Maybe<Scalars['String']['output']>;
    registered_address?: Maybe<Scalars['String']['output']>;
    subdomain?: Maybe<Scalars['String']['output']>;
    token_name?: Maybe<Scalars['String']['output']>;
    token_standard?: Maybe<Scalars['String']['output']>;
};
/** aggregated selection of "current_aptos_names" */
type Current_Aptos_Names_Aggregate = {
    __typename?: 'current_aptos_names_aggregate';
    aggregate?: Maybe<Current_Aptos_Names_Aggregate_Fields>;
    nodes: Array<Current_Aptos_Names>;
};
/** aggregate fields of "current_aptos_names" */
type Current_Aptos_Names_Aggregate_Fields = {
    __typename?: 'current_aptos_names_aggregate_fields';
    avg?: Maybe<Current_Aptos_Names_Avg_Fields>;
    count: Scalars['Int']['output'];
    max?: Maybe<Current_Aptos_Names_Max_Fields>;
    min?: Maybe<Current_Aptos_Names_Min_Fields>;
    stddev?: Maybe<Current_Aptos_Names_Stddev_Fields>;
    stddev_pop?: Maybe<Current_Aptos_Names_Stddev_Pop_Fields>;
    stddev_samp?: Maybe<Current_Aptos_Names_Stddev_Samp_Fields>;
    sum?: Maybe<Current_Aptos_Names_Sum_Fields>;
    var_pop?: Maybe<Current_Aptos_Names_Var_Pop_Fields>;
    var_samp?: Maybe<Current_Aptos_Names_Var_Samp_Fields>;
    variance?: Maybe<Current_Aptos_Names_Variance_Fields>;
};
/** aggregate fields of "current_aptos_names" */
type Current_Aptos_Names_Aggregate_FieldsCountArgs = {
    columns?: InputMaybe<Array<Current_Aptos_Names_Select_Column>>;
    distinct?: InputMaybe<Scalars['Boolean']['input']>;
};
/** order by aggregate values of table "current_aptos_names" */
type Current_Aptos_Names_Aggregate_Order_By = {
    avg?: InputMaybe<Current_Aptos_Names_Avg_Order_By>;
    count?: InputMaybe<Order_By>;
    max?: InputMaybe<Current_Aptos_Names_Max_Order_By>;
    min?: InputMaybe<Current_Aptos_Names_Min_Order_By>;
    stddev?: InputMaybe<Current_Aptos_Names_Stddev_Order_By>;
    stddev_pop?: InputMaybe<Current_Aptos_Names_Stddev_Pop_Order_By>;
    stddev_samp?: InputMaybe<Current_Aptos_Names_Stddev_Samp_Order_By>;
    sum?: InputMaybe<Current_Aptos_Names_Sum_Order_By>;
    var_pop?: InputMaybe<Current_Aptos_Names_Var_Pop_Order_By>;
    var_samp?: InputMaybe<Current_Aptos_Names_Var_Samp_Order_By>;
    variance?: InputMaybe<Current_Aptos_Names_Variance_Order_By>;
};
/** aggregate avg on columns */
type Current_Aptos_Names_Avg_Fields = {
    __typename?: 'current_aptos_names_avg_fields';
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by avg() on columns of table "current_aptos_names" */
type Current_Aptos_Names_Avg_Order_By = {
    last_transaction_version?: InputMaybe<Order_By>;
};
/** Boolean expression to filter rows from the table "current_aptos_names". All fields are combined with a logical 'AND'. */
type Current_Aptos_Names_Bool_Exp = {
    _and?: InputMaybe<Array<Current_Aptos_Names_Bool_Exp>>;
    _not?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
    _or?: InputMaybe<Array<Current_Aptos_Names_Bool_Exp>>;
    domain?: InputMaybe<String_Comparison_Exp>;
    domain_with_suffix?: InputMaybe<String_Comparison_Exp>;
    expiration_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    is_active?: InputMaybe<Boolean_Comparison_Exp>;
    is_domain_owner?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
    is_primary?: InputMaybe<Boolean_Comparison_Exp>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    owner_address?: InputMaybe<String_Comparison_Exp>;
    registered_address?: InputMaybe<String_Comparison_Exp>;
    subdomain?: InputMaybe<String_Comparison_Exp>;
    token_name?: InputMaybe<String_Comparison_Exp>;
    token_standard?: InputMaybe<String_Comparison_Exp>;
};
/** aggregate max on columns */
type Current_Aptos_Names_Max_Fields = {
    __typename?: 'current_aptos_names_max_fields';
    domain?: Maybe<Scalars['String']['output']>;
    domain_with_suffix?: Maybe<Scalars['String']['output']>;
    expiration_timestamp?: Maybe<Scalars['timestamp']['output']>;
    last_transaction_version?: Maybe<Scalars['bigint']['output']>;
    owner_address?: Maybe<Scalars['String']['output']>;
    registered_address?: Maybe<Scalars['String']['output']>;
    subdomain?: Maybe<Scalars['String']['output']>;
    token_name?: Maybe<Scalars['String']['output']>;
    token_standard?: Maybe<Scalars['String']['output']>;
};
/** order by max() on columns of table "current_aptos_names" */
type Current_Aptos_Names_Max_Order_By = {
    domain?: InputMaybe<Order_By>;
    domain_with_suffix?: InputMaybe<Order_By>;
    expiration_timestamp?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    owner_address?: InputMaybe<Order_By>;
    registered_address?: InputMaybe<Order_By>;
    subdomain?: InputMaybe<Order_By>;
    token_name?: InputMaybe<Order_By>;
    token_standard?: InputMaybe<Order_By>;
};
/** aggregate min on columns */
type Current_Aptos_Names_Min_Fields = {
    __typename?: 'current_aptos_names_min_fields';
    domain?: Maybe<Scalars['String']['output']>;
    domain_with_suffix?: Maybe<Scalars['String']['output']>;
    expiration_timestamp?: Maybe<Scalars['timestamp']['output']>;
    last_transaction_version?: Maybe<Scalars['bigint']['output']>;
    owner_address?: Maybe<Scalars['String']['output']>;
    registered_address?: Maybe<Scalars['String']['output']>;
    subdomain?: Maybe<Scalars['String']['output']>;
    token_name?: Maybe<Scalars['String']['output']>;
    token_standard?: Maybe<Scalars['String']['output']>;
};
/** order by min() on columns of table "current_aptos_names" */
type Current_Aptos_Names_Min_Order_By = {
    domain?: InputMaybe<Order_By>;
    domain_with_suffix?: InputMaybe<Order_By>;
    expiration_timestamp?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    owner_address?: InputMaybe<Order_By>;
    registered_address?: InputMaybe<Order_By>;
    subdomain?: InputMaybe<Order_By>;
    token_name?: InputMaybe<Order_By>;
    token_standard?: InputMaybe<Order_By>;
};
/** Ordering options when selecting data from "current_aptos_names". */
type Current_Aptos_Names_Order_By = {
    domain?: InputMaybe<Order_By>;
    domain_with_suffix?: InputMaybe<Order_By>;
    expiration_timestamp?: InputMaybe<Order_By>;
    is_active?: InputMaybe<Order_By>;
    is_domain_owner?: InputMaybe<Current_Aptos_Names_Order_By>;
    is_primary?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    owner_address?: InputMaybe<Order_By>;
    registered_address?: InputMaybe<Order_By>;
    subdomain?: InputMaybe<Order_By>;
    token_name?: InputMaybe<Order_By>;
    token_standard?: InputMaybe<Order_By>;
};
/** select columns of table "current_aptos_names" */
declare enum Current_Aptos_Names_Select_Column {
    /** column name */
    Domain = "domain",
    /** column name */
    DomainWithSuffix = "domain_with_suffix",
    /** column name */
    ExpirationTimestamp = "expiration_timestamp",
    /** column name */
    IsActive = "is_active",
    /** column name */
    IsPrimary = "is_primary",
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    OwnerAddress = "owner_address",
    /** column name */
    RegisteredAddress = "registered_address",
    /** column name */
    Subdomain = "subdomain",
    /** column name */
    TokenName = "token_name",
    /** column name */
    TokenStandard = "token_standard"
}
/** aggregate stddev on columns */
type Current_Aptos_Names_Stddev_Fields = {
    __typename?: 'current_aptos_names_stddev_fields';
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by stddev() on columns of table "current_aptos_names" */
type Current_Aptos_Names_Stddev_Order_By = {
    last_transaction_version?: InputMaybe<Order_By>;
};
/** aggregate stddev_pop on columns */
type Current_Aptos_Names_Stddev_Pop_Fields = {
    __typename?: 'current_aptos_names_stddev_pop_fields';
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by stddev_pop() on columns of table "current_aptos_names" */
type Current_Aptos_Names_Stddev_Pop_Order_By = {
    last_transaction_version?: InputMaybe<Order_By>;
};
/** aggregate stddev_samp on columns */
type Current_Aptos_Names_Stddev_Samp_Fields = {
    __typename?: 'current_aptos_names_stddev_samp_fields';
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by stddev_samp() on columns of table "current_aptos_names" */
type Current_Aptos_Names_Stddev_Samp_Order_By = {
    last_transaction_version?: InputMaybe<Order_By>;
};
/** Streaming cursor of the table "current_aptos_names" */
type Current_Aptos_Names_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Current_Aptos_Names_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Current_Aptos_Names_Stream_Cursor_Value_Input = {
    domain?: InputMaybe<Scalars['String']['input']>;
    domain_with_suffix?: InputMaybe<Scalars['String']['input']>;
    expiration_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    is_active?: InputMaybe<Scalars['Boolean']['input']>;
    is_primary?: InputMaybe<Scalars['Boolean']['input']>;
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    owner_address?: InputMaybe<Scalars['String']['input']>;
    registered_address?: InputMaybe<Scalars['String']['input']>;
    subdomain?: InputMaybe<Scalars['String']['input']>;
    token_name?: InputMaybe<Scalars['String']['input']>;
    token_standard?: InputMaybe<Scalars['String']['input']>;
};
/** aggregate sum on columns */
type Current_Aptos_Names_Sum_Fields = {
    __typename?: 'current_aptos_names_sum_fields';
    last_transaction_version?: Maybe<Scalars['bigint']['output']>;
};
/** order by sum() on columns of table "current_aptos_names" */
type Current_Aptos_Names_Sum_Order_By = {
    last_transaction_version?: InputMaybe<Order_By>;
};
/** aggregate var_pop on columns */
type Current_Aptos_Names_Var_Pop_Fields = {
    __typename?: 'current_aptos_names_var_pop_fields';
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by var_pop() on columns of table "current_aptos_names" */
type Current_Aptos_Names_Var_Pop_Order_By = {
    last_transaction_version?: InputMaybe<Order_By>;
};
/** aggregate var_samp on columns */
type Current_Aptos_Names_Var_Samp_Fields = {
    __typename?: 'current_aptos_names_var_samp_fields';
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by var_samp() on columns of table "current_aptos_names" */
type Current_Aptos_Names_Var_Samp_Order_By = {
    last_transaction_version?: InputMaybe<Order_By>;
};
/** aggregate variance on columns */
type Current_Aptos_Names_Variance_Fields = {
    __typename?: 'current_aptos_names_variance_fields';
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by variance() on columns of table "current_aptos_names" */
type Current_Aptos_Names_Variance_Order_By = {
    last_transaction_version?: InputMaybe<Order_By>;
};
/** columns and relationships of "current_coin_balances" */
type Current_Coin_Balances = {
    __typename?: 'current_coin_balances';
    amount: Scalars['numeric']['output'];
    /** An object relationship */
    coin_info?: Maybe<Coin_Infos>;
    coin_type: Scalars['String']['output'];
    coin_type_hash: Scalars['String']['output'];
    last_transaction_timestamp: Scalars['timestamp']['output'];
    last_transaction_version: Scalars['bigint']['output'];
    owner_address: Scalars['String']['output'];
};
/** Boolean expression to filter rows from the table "current_coin_balances". All fields are combined with a logical 'AND'. */
type Current_Coin_Balances_Bool_Exp = {
    _and?: InputMaybe<Array<Current_Coin_Balances_Bool_Exp>>;
    _not?: InputMaybe<Current_Coin_Balances_Bool_Exp>;
    _or?: InputMaybe<Array<Current_Coin_Balances_Bool_Exp>>;
    amount?: InputMaybe<Numeric_Comparison_Exp>;
    coin_info?: InputMaybe<Coin_Infos_Bool_Exp>;
    coin_type?: InputMaybe<String_Comparison_Exp>;
    coin_type_hash?: InputMaybe<String_Comparison_Exp>;
    last_transaction_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    owner_address?: InputMaybe<String_Comparison_Exp>;
};
/** Ordering options when selecting data from "current_coin_balances". */
type Current_Coin_Balances_Order_By = {
    amount?: InputMaybe<Order_By>;
    coin_info?: InputMaybe<Coin_Infos_Order_By>;
    coin_type?: InputMaybe<Order_By>;
    coin_type_hash?: InputMaybe<Order_By>;
    last_transaction_timestamp?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    owner_address?: InputMaybe<Order_By>;
};
/** select columns of table "current_coin_balances" */
declare enum Current_Coin_Balances_Select_Column {
    /** column name */
    Amount = "amount",
    /** column name */
    CoinType = "coin_type",
    /** column name */
    CoinTypeHash = "coin_type_hash",
    /** column name */
    LastTransactionTimestamp = "last_transaction_timestamp",
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    OwnerAddress = "owner_address"
}
/** Streaming cursor of the table "current_coin_balances" */
type Current_Coin_Balances_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Current_Coin_Balances_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Current_Coin_Balances_Stream_Cursor_Value_Input = {
    amount?: InputMaybe<Scalars['numeric']['input']>;
    coin_type?: InputMaybe<Scalars['String']['input']>;
    coin_type_hash?: InputMaybe<Scalars['String']['input']>;
    last_transaction_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    owner_address?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "current_collection_datas" */
type Current_Collection_Datas = {
    __typename?: 'current_collection_datas';
    collection_data_id_hash: Scalars['String']['output'];
    collection_name: Scalars['String']['output'];
    creator_address: Scalars['String']['output'];
    description: Scalars['String']['output'];
    description_mutable: Scalars['Boolean']['output'];
    last_transaction_timestamp: Scalars['timestamp']['output'];
    last_transaction_version: Scalars['bigint']['output'];
    maximum: Scalars['numeric']['output'];
    maximum_mutable: Scalars['Boolean']['output'];
    metadata_uri: Scalars['String']['output'];
    supply: Scalars['numeric']['output'];
    table_handle: Scalars['String']['output'];
    uri_mutable: Scalars['Boolean']['output'];
};
/** Boolean expression to filter rows from the table "current_collection_datas". All fields are combined with a logical 'AND'. */
type Current_Collection_Datas_Bool_Exp = {
    _and?: InputMaybe<Array<Current_Collection_Datas_Bool_Exp>>;
    _not?: InputMaybe<Current_Collection_Datas_Bool_Exp>;
    _or?: InputMaybe<Array<Current_Collection_Datas_Bool_Exp>>;
    collection_data_id_hash?: InputMaybe<String_Comparison_Exp>;
    collection_name?: InputMaybe<String_Comparison_Exp>;
    creator_address?: InputMaybe<String_Comparison_Exp>;
    description?: InputMaybe<String_Comparison_Exp>;
    description_mutable?: InputMaybe<Boolean_Comparison_Exp>;
    last_transaction_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    maximum?: InputMaybe<Numeric_Comparison_Exp>;
    maximum_mutable?: InputMaybe<Boolean_Comparison_Exp>;
    metadata_uri?: InputMaybe<String_Comparison_Exp>;
    supply?: InputMaybe<Numeric_Comparison_Exp>;
    table_handle?: InputMaybe<String_Comparison_Exp>;
    uri_mutable?: InputMaybe<Boolean_Comparison_Exp>;
};
/** Ordering options when selecting data from "current_collection_datas". */
type Current_Collection_Datas_Order_By = {
    collection_data_id_hash?: InputMaybe<Order_By>;
    collection_name?: InputMaybe<Order_By>;
    creator_address?: InputMaybe<Order_By>;
    description?: InputMaybe<Order_By>;
    description_mutable?: InputMaybe<Order_By>;
    last_transaction_timestamp?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    maximum?: InputMaybe<Order_By>;
    maximum_mutable?: InputMaybe<Order_By>;
    metadata_uri?: InputMaybe<Order_By>;
    supply?: InputMaybe<Order_By>;
    table_handle?: InputMaybe<Order_By>;
    uri_mutable?: InputMaybe<Order_By>;
};
/** select columns of table "current_collection_datas" */
declare enum Current_Collection_Datas_Select_Column {
    /** column name */
    CollectionDataIdHash = "collection_data_id_hash",
    /** column name */
    CollectionName = "collection_name",
    /** column name */
    CreatorAddress = "creator_address",
    /** column name */
    Description = "description",
    /** column name */
    DescriptionMutable = "description_mutable",
    /** column name */
    LastTransactionTimestamp = "last_transaction_timestamp",
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    Maximum = "maximum",
    /** column name */
    MaximumMutable = "maximum_mutable",
    /** column name */
    MetadataUri = "metadata_uri",
    /** column name */
    Supply = "supply",
    /** column name */
    TableHandle = "table_handle",
    /** column name */
    UriMutable = "uri_mutable"
}
/** Streaming cursor of the table "current_collection_datas" */
type Current_Collection_Datas_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Current_Collection_Datas_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Current_Collection_Datas_Stream_Cursor_Value_Input = {
    collection_data_id_hash?: InputMaybe<Scalars['String']['input']>;
    collection_name?: InputMaybe<Scalars['String']['input']>;
    creator_address?: InputMaybe<Scalars['String']['input']>;
    description?: InputMaybe<Scalars['String']['input']>;
    description_mutable?: InputMaybe<Scalars['Boolean']['input']>;
    last_transaction_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    maximum?: InputMaybe<Scalars['numeric']['input']>;
    maximum_mutable?: InputMaybe<Scalars['Boolean']['input']>;
    metadata_uri?: InputMaybe<Scalars['String']['input']>;
    supply?: InputMaybe<Scalars['numeric']['input']>;
    table_handle?: InputMaybe<Scalars['String']['input']>;
    uri_mutable?: InputMaybe<Scalars['Boolean']['input']>;
};
/** columns and relationships of "current_collection_ownership_v2_view" */
type Current_Collection_Ownership_V2_View = {
    __typename?: 'current_collection_ownership_v2_view';
    collection_id?: Maybe<Scalars['String']['output']>;
    collection_name?: Maybe<Scalars['String']['output']>;
    collection_uri?: Maybe<Scalars['String']['output']>;
    creator_address?: Maybe<Scalars['String']['output']>;
    /** An object relationship */
    current_collection?: Maybe<Current_Collections_V2>;
    distinct_tokens?: Maybe<Scalars['bigint']['output']>;
    last_transaction_version?: Maybe<Scalars['bigint']['output']>;
    owner_address?: Maybe<Scalars['String']['output']>;
    single_token_uri?: Maybe<Scalars['String']['output']>;
};
/** aggregated selection of "current_collection_ownership_v2_view" */
type Current_Collection_Ownership_V2_View_Aggregate = {
    __typename?: 'current_collection_ownership_v2_view_aggregate';
    aggregate?: Maybe<Current_Collection_Ownership_V2_View_Aggregate_Fields>;
    nodes: Array<Current_Collection_Ownership_V2_View>;
};
/** aggregate fields of "current_collection_ownership_v2_view" */
type Current_Collection_Ownership_V2_View_Aggregate_Fields = {
    __typename?: 'current_collection_ownership_v2_view_aggregate_fields';
    avg?: Maybe<Current_Collection_Ownership_V2_View_Avg_Fields>;
    count: Scalars['Int']['output'];
    max?: Maybe<Current_Collection_Ownership_V2_View_Max_Fields>;
    min?: Maybe<Current_Collection_Ownership_V2_View_Min_Fields>;
    stddev?: Maybe<Current_Collection_Ownership_V2_View_Stddev_Fields>;
    stddev_pop?: Maybe<Current_Collection_Ownership_V2_View_Stddev_Pop_Fields>;
    stddev_samp?: Maybe<Current_Collection_Ownership_V2_View_Stddev_Samp_Fields>;
    sum?: Maybe<Current_Collection_Ownership_V2_View_Sum_Fields>;
    var_pop?: Maybe<Current_Collection_Ownership_V2_View_Var_Pop_Fields>;
    var_samp?: Maybe<Current_Collection_Ownership_V2_View_Var_Samp_Fields>;
    variance?: Maybe<Current_Collection_Ownership_V2_View_Variance_Fields>;
};
/** aggregate fields of "current_collection_ownership_v2_view" */
type Current_Collection_Ownership_V2_View_Aggregate_FieldsCountArgs = {
    columns?: InputMaybe<Array<Current_Collection_Ownership_V2_View_Select_Column>>;
    distinct?: InputMaybe<Scalars['Boolean']['input']>;
};
/** aggregate avg on columns */
type Current_Collection_Ownership_V2_View_Avg_Fields = {
    __typename?: 'current_collection_ownership_v2_view_avg_fields';
    distinct_tokens?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** Boolean expression to filter rows from the table "current_collection_ownership_v2_view". All fields are combined with a logical 'AND'. */
type Current_Collection_Ownership_V2_View_Bool_Exp = {
    _and?: InputMaybe<Array<Current_Collection_Ownership_V2_View_Bool_Exp>>;
    _not?: InputMaybe<Current_Collection_Ownership_V2_View_Bool_Exp>;
    _or?: InputMaybe<Array<Current_Collection_Ownership_V2_View_Bool_Exp>>;
    collection_id?: InputMaybe<String_Comparison_Exp>;
    collection_name?: InputMaybe<String_Comparison_Exp>;
    collection_uri?: InputMaybe<String_Comparison_Exp>;
    creator_address?: InputMaybe<String_Comparison_Exp>;
    current_collection?: InputMaybe<Current_Collections_V2_Bool_Exp>;
    distinct_tokens?: InputMaybe<Bigint_Comparison_Exp>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    owner_address?: InputMaybe<String_Comparison_Exp>;
    single_token_uri?: InputMaybe<String_Comparison_Exp>;
};
/** aggregate max on columns */
type Current_Collection_Ownership_V2_View_Max_Fields = {
    __typename?: 'current_collection_ownership_v2_view_max_fields';
    collection_id?: Maybe<Scalars['String']['output']>;
    collection_name?: Maybe<Scalars['String']['output']>;
    collection_uri?: Maybe<Scalars['String']['output']>;
    creator_address?: Maybe<Scalars['String']['output']>;
    distinct_tokens?: Maybe<Scalars['bigint']['output']>;
    last_transaction_version?: Maybe<Scalars['bigint']['output']>;
    owner_address?: Maybe<Scalars['String']['output']>;
    single_token_uri?: Maybe<Scalars['String']['output']>;
};
/** aggregate min on columns */
type Current_Collection_Ownership_V2_View_Min_Fields = {
    __typename?: 'current_collection_ownership_v2_view_min_fields';
    collection_id?: Maybe<Scalars['String']['output']>;
    collection_name?: Maybe<Scalars['String']['output']>;
    collection_uri?: Maybe<Scalars['String']['output']>;
    creator_address?: Maybe<Scalars['String']['output']>;
    distinct_tokens?: Maybe<Scalars['bigint']['output']>;
    last_transaction_version?: Maybe<Scalars['bigint']['output']>;
    owner_address?: Maybe<Scalars['String']['output']>;
    single_token_uri?: Maybe<Scalars['String']['output']>;
};
/** Ordering options when selecting data from "current_collection_ownership_v2_view". */
type Current_Collection_Ownership_V2_View_Order_By = {
    collection_id?: InputMaybe<Order_By>;
    collection_name?: InputMaybe<Order_By>;
    collection_uri?: InputMaybe<Order_By>;
    creator_address?: InputMaybe<Order_By>;
    current_collection?: InputMaybe<Current_Collections_V2_Order_By>;
    distinct_tokens?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    owner_address?: InputMaybe<Order_By>;
    single_token_uri?: InputMaybe<Order_By>;
};
/** select columns of table "current_collection_ownership_v2_view" */
declare enum Current_Collection_Ownership_V2_View_Select_Column {
    /** column name */
    CollectionId = "collection_id",
    /** column name */
    CollectionName = "collection_name",
    /** column name */
    CollectionUri = "collection_uri",
    /** column name */
    CreatorAddress = "creator_address",
    /** column name */
    DistinctTokens = "distinct_tokens",
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    OwnerAddress = "owner_address",
    /** column name */
    SingleTokenUri = "single_token_uri"
}
/** aggregate stddev on columns */
type Current_Collection_Ownership_V2_View_Stddev_Fields = {
    __typename?: 'current_collection_ownership_v2_view_stddev_fields';
    distinct_tokens?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate stddev_pop on columns */
type Current_Collection_Ownership_V2_View_Stddev_Pop_Fields = {
    __typename?: 'current_collection_ownership_v2_view_stddev_pop_fields';
    distinct_tokens?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate stddev_samp on columns */
type Current_Collection_Ownership_V2_View_Stddev_Samp_Fields = {
    __typename?: 'current_collection_ownership_v2_view_stddev_samp_fields';
    distinct_tokens?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** Streaming cursor of the table "current_collection_ownership_v2_view" */
type Current_Collection_Ownership_V2_View_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Current_Collection_Ownership_V2_View_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Current_Collection_Ownership_V2_View_Stream_Cursor_Value_Input = {
    collection_id?: InputMaybe<Scalars['String']['input']>;
    collection_name?: InputMaybe<Scalars['String']['input']>;
    collection_uri?: InputMaybe<Scalars['String']['input']>;
    creator_address?: InputMaybe<Scalars['String']['input']>;
    distinct_tokens?: InputMaybe<Scalars['bigint']['input']>;
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    owner_address?: InputMaybe<Scalars['String']['input']>;
    single_token_uri?: InputMaybe<Scalars['String']['input']>;
};
/** aggregate sum on columns */
type Current_Collection_Ownership_V2_View_Sum_Fields = {
    __typename?: 'current_collection_ownership_v2_view_sum_fields';
    distinct_tokens?: Maybe<Scalars['bigint']['output']>;
    last_transaction_version?: Maybe<Scalars['bigint']['output']>;
};
/** aggregate var_pop on columns */
type Current_Collection_Ownership_V2_View_Var_Pop_Fields = {
    __typename?: 'current_collection_ownership_v2_view_var_pop_fields';
    distinct_tokens?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate var_samp on columns */
type Current_Collection_Ownership_V2_View_Var_Samp_Fields = {
    __typename?: 'current_collection_ownership_v2_view_var_samp_fields';
    distinct_tokens?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate variance on columns */
type Current_Collection_Ownership_V2_View_Variance_Fields = {
    __typename?: 'current_collection_ownership_v2_view_variance_fields';
    distinct_tokens?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** columns and relationships of "current_collections_v2" */
type Current_Collections_V2 = {
    __typename?: 'current_collections_v2';
    /** An object relationship */
    cdn_asset_uris?: Maybe<Nft_Metadata_Crawler_Parsed_Asset_Uris>;
    collection_id: Scalars['String']['output'];
    collection_name: Scalars['String']['output'];
    creator_address: Scalars['String']['output'];
    current_supply: Scalars['numeric']['output'];
    description: Scalars['String']['output'];
    last_transaction_timestamp: Scalars['timestamp']['output'];
    last_transaction_version: Scalars['bigint']['output'];
    max_supply?: Maybe<Scalars['numeric']['output']>;
    mutable_description?: Maybe<Scalars['Boolean']['output']>;
    mutable_uri?: Maybe<Scalars['Boolean']['output']>;
    table_handle_v1?: Maybe<Scalars['String']['output']>;
    token_standard: Scalars['String']['output'];
    total_minted_v2?: Maybe<Scalars['numeric']['output']>;
    uri: Scalars['String']['output'];
};
/** Boolean expression to filter rows from the table "current_collections_v2". All fields are combined with a logical 'AND'. */
type Current_Collections_V2_Bool_Exp = {
    _and?: InputMaybe<Array<Current_Collections_V2_Bool_Exp>>;
    _not?: InputMaybe<Current_Collections_V2_Bool_Exp>;
    _or?: InputMaybe<Array<Current_Collections_V2_Bool_Exp>>;
    cdn_asset_uris?: InputMaybe<Nft_Metadata_Crawler_Parsed_Asset_Uris_Bool_Exp>;
    collection_id?: InputMaybe<String_Comparison_Exp>;
    collection_name?: InputMaybe<String_Comparison_Exp>;
    creator_address?: InputMaybe<String_Comparison_Exp>;
    current_supply?: InputMaybe<Numeric_Comparison_Exp>;
    description?: InputMaybe<String_Comparison_Exp>;
    last_transaction_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    max_supply?: InputMaybe<Numeric_Comparison_Exp>;
    mutable_description?: InputMaybe<Boolean_Comparison_Exp>;
    mutable_uri?: InputMaybe<Boolean_Comparison_Exp>;
    table_handle_v1?: InputMaybe<String_Comparison_Exp>;
    token_standard?: InputMaybe<String_Comparison_Exp>;
    total_minted_v2?: InputMaybe<Numeric_Comparison_Exp>;
    uri?: InputMaybe<String_Comparison_Exp>;
};
/** Ordering options when selecting data from "current_collections_v2". */
type Current_Collections_V2_Order_By = {
    cdn_asset_uris?: InputMaybe<Nft_Metadata_Crawler_Parsed_Asset_Uris_Order_By>;
    collection_id?: InputMaybe<Order_By>;
    collection_name?: InputMaybe<Order_By>;
    creator_address?: InputMaybe<Order_By>;
    current_supply?: InputMaybe<Order_By>;
    description?: InputMaybe<Order_By>;
    last_transaction_timestamp?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    max_supply?: InputMaybe<Order_By>;
    mutable_description?: InputMaybe<Order_By>;
    mutable_uri?: InputMaybe<Order_By>;
    table_handle_v1?: InputMaybe<Order_By>;
    token_standard?: InputMaybe<Order_By>;
    total_minted_v2?: InputMaybe<Order_By>;
    uri?: InputMaybe<Order_By>;
};
/** select columns of table "current_collections_v2" */
declare enum Current_Collections_V2_Select_Column {
    /** column name */
    CollectionId = "collection_id",
    /** column name */
    CollectionName = "collection_name",
    /** column name */
    CreatorAddress = "creator_address",
    /** column name */
    CurrentSupply = "current_supply",
    /** column name */
    Description = "description",
    /** column name */
    LastTransactionTimestamp = "last_transaction_timestamp",
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    MaxSupply = "max_supply",
    /** column name */
    MutableDescription = "mutable_description",
    /** column name */
    MutableUri = "mutable_uri",
    /** column name */
    TableHandleV1 = "table_handle_v1",
    /** column name */
    TokenStandard = "token_standard",
    /** column name */
    TotalMintedV2 = "total_minted_v2",
    /** column name */
    Uri = "uri"
}
/** Streaming cursor of the table "current_collections_v2" */
type Current_Collections_V2_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Current_Collections_V2_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Current_Collections_V2_Stream_Cursor_Value_Input = {
    collection_id?: InputMaybe<Scalars['String']['input']>;
    collection_name?: InputMaybe<Scalars['String']['input']>;
    creator_address?: InputMaybe<Scalars['String']['input']>;
    current_supply?: InputMaybe<Scalars['numeric']['input']>;
    description?: InputMaybe<Scalars['String']['input']>;
    last_transaction_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    max_supply?: InputMaybe<Scalars['numeric']['input']>;
    mutable_description?: InputMaybe<Scalars['Boolean']['input']>;
    mutable_uri?: InputMaybe<Scalars['Boolean']['input']>;
    table_handle_v1?: InputMaybe<Scalars['String']['input']>;
    token_standard?: InputMaybe<Scalars['String']['input']>;
    total_minted_v2?: InputMaybe<Scalars['numeric']['input']>;
    uri?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "current_delegated_staking_pool_balances" */
type Current_Delegated_Staking_Pool_Balances = {
    __typename?: 'current_delegated_staking_pool_balances';
    active_table_handle: Scalars['String']['output'];
    inactive_table_handle: Scalars['String']['output'];
    last_transaction_version: Scalars['bigint']['output'];
    operator_commission_percentage: Scalars['numeric']['output'];
    staking_pool_address: Scalars['String']['output'];
    total_coins: Scalars['numeric']['output'];
    total_shares: Scalars['numeric']['output'];
};
/** Boolean expression to filter rows from the table "current_delegated_staking_pool_balances". All fields are combined with a logical 'AND'. */
type Current_Delegated_Staking_Pool_Balances_Bool_Exp = {
    _and?: InputMaybe<Array<Current_Delegated_Staking_Pool_Balances_Bool_Exp>>;
    _not?: InputMaybe<Current_Delegated_Staking_Pool_Balances_Bool_Exp>;
    _or?: InputMaybe<Array<Current_Delegated_Staking_Pool_Balances_Bool_Exp>>;
    active_table_handle?: InputMaybe<String_Comparison_Exp>;
    inactive_table_handle?: InputMaybe<String_Comparison_Exp>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    operator_commission_percentage?: InputMaybe<Numeric_Comparison_Exp>;
    staking_pool_address?: InputMaybe<String_Comparison_Exp>;
    total_coins?: InputMaybe<Numeric_Comparison_Exp>;
    total_shares?: InputMaybe<Numeric_Comparison_Exp>;
};
/** Ordering options when selecting data from "current_delegated_staking_pool_balances". */
type Current_Delegated_Staking_Pool_Balances_Order_By = {
    active_table_handle?: InputMaybe<Order_By>;
    inactive_table_handle?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    operator_commission_percentage?: InputMaybe<Order_By>;
    staking_pool_address?: InputMaybe<Order_By>;
    total_coins?: InputMaybe<Order_By>;
    total_shares?: InputMaybe<Order_By>;
};
/** select columns of table "current_delegated_staking_pool_balances" */
declare enum Current_Delegated_Staking_Pool_Balances_Select_Column {
    /** column name */
    ActiveTableHandle = "active_table_handle",
    /** column name */
    InactiveTableHandle = "inactive_table_handle",
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    OperatorCommissionPercentage = "operator_commission_percentage",
    /** column name */
    StakingPoolAddress = "staking_pool_address",
    /** column name */
    TotalCoins = "total_coins",
    /** column name */
    TotalShares = "total_shares"
}
/** Streaming cursor of the table "current_delegated_staking_pool_balances" */
type Current_Delegated_Staking_Pool_Balances_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Current_Delegated_Staking_Pool_Balances_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Current_Delegated_Staking_Pool_Balances_Stream_Cursor_Value_Input = {
    active_table_handle?: InputMaybe<Scalars['String']['input']>;
    inactive_table_handle?: InputMaybe<Scalars['String']['input']>;
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    operator_commission_percentage?: InputMaybe<Scalars['numeric']['input']>;
    staking_pool_address?: InputMaybe<Scalars['String']['input']>;
    total_coins?: InputMaybe<Scalars['numeric']['input']>;
    total_shares?: InputMaybe<Scalars['numeric']['input']>;
};
/** columns and relationships of "current_delegated_voter" */
type Current_Delegated_Voter = {
    __typename?: 'current_delegated_voter';
    delegation_pool_address: Scalars['String']['output'];
    delegator_address: Scalars['String']['output'];
    last_transaction_timestamp: Scalars['timestamp']['output'];
    last_transaction_version: Scalars['bigint']['output'];
    pending_voter?: Maybe<Scalars['String']['output']>;
    table_handle?: Maybe<Scalars['String']['output']>;
    voter?: Maybe<Scalars['String']['output']>;
};
/** Boolean expression to filter rows from the table "current_delegated_voter". All fields are combined with a logical 'AND'. */
type Current_Delegated_Voter_Bool_Exp = {
    _and?: InputMaybe<Array<Current_Delegated_Voter_Bool_Exp>>;
    _not?: InputMaybe<Current_Delegated_Voter_Bool_Exp>;
    _or?: InputMaybe<Array<Current_Delegated_Voter_Bool_Exp>>;
    delegation_pool_address?: InputMaybe<String_Comparison_Exp>;
    delegator_address?: InputMaybe<String_Comparison_Exp>;
    last_transaction_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    pending_voter?: InputMaybe<String_Comparison_Exp>;
    table_handle?: InputMaybe<String_Comparison_Exp>;
    voter?: InputMaybe<String_Comparison_Exp>;
};
/** Ordering options when selecting data from "current_delegated_voter". */
type Current_Delegated_Voter_Order_By = {
    delegation_pool_address?: InputMaybe<Order_By>;
    delegator_address?: InputMaybe<Order_By>;
    last_transaction_timestamp?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    pending_voter?: InputMaybe<Order_By>;
    table_handle?: InputMaybe<Order_By>;
    voter?: InputMaybe<Order_By>;
};
/** select columns of table "current_delegated_voter" */
declare enum Current_Delegated_Voter_Select_Column {
    /** column name */
    DelegationPoolAddress = "delegation_pool_address",
    /** column name */
    DelegatorAddress = "delegator_address",
    /** column name */
    LastTransactionTimestamp = "last_transaction_timestamp",
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    PendingVoter = "pending_voter",
    /** column name */
    TableHandle = "table_handle",
    /** column name */
    Voter = "voter"
}
/** Streaming cursor of the table "current_delegated_voter" */
type Current_Delegated_Voter_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Current_Delegated_Voter_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Current_Delegated_Voter_Stream_Cursor_Value_Input = {
    delegation_pool_address?: InputMaybe<Scalars['String']['input']>;
    delegator_address?: InputMaybe<Scalars['String']['input']>;
    last_transaction_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    pending_voter?: InputMaybe<Scalars['String']['input']>;
    table_handle?: InputMaybe<Scalars['String']['input']>;
    voter?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "current_delegator_balances" */
type Current_Delegator_Balances = {
    __typename?: 'current_delegator_balances';
    /** An object relationship */
    current_pool_balance?: Maybe<Current_Delegated_Staking_Pool_Balances>;
    delegator_address: Scalars['String']['output'];
    last_transaction_version: Scalars['bigint']['output'];
    parent_table_handle: Scalars['String']['output'];
    pool_address: Scalars['String']['output'];
    pool_type: Scalars['String']['output'];
    shares: Scalars['numeric']['output'];
    /** An object relationship */
    staking_pool_metadata?: Maybe<Current_Staking_Pool_Voter>;
    table_handle: Scalars['String']['output'];
};
/** Boolean expression to filter rows from the table "current_delegator_balances". All fields are combined with a logical 'AND'. */
type Current_Delegator_Balances_Bool_Exp = {
    _and?: InputMaybe<Array<Current_Delegator_Balances_Bool_Exp>>;
    _not?: InputMaybe<Current_Delegator_Balances_Bool_Exp>;
    _or?: InputMaybe<Array<Current_Delegator_Balances_Bool_Exp>>;
    current_pool_balance?: InputMaybe<Current_Delegated_Staking_Pool_Balances_Bool_Exp>;
    delegator_address?: InputMaybe<String_Comparison_Exp>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    parent_table_handle?: InputMaybe<String_Comparison_Exp>;
    pool_address?: InputMaybe<String_Comparison_Exp>;
    pool_type?: InputMaybe<String_Comparison_Exp>;
    shares?: InputMaybe<Numeric_Comparison_Exp>;
    staking_pool_metadata?: InputMaybe<Current_Staking_Pool_Voter_Bool_Exp>;
    table_handle?: InputMaybe<String_Comparison_Exp>;
};
/** Ordering options when selecting data from "current_delegator_balances". */
type Current_Delegator_Balances_Order_By = {
    current_pool_balance?: InputMaybe<Current_Delegated_Staking_Pool_Balances_Order_By>;
    delegator_address?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    parent_table_handle?: InputMaybe<Order_By>;
    pool_address?: InputMaybe<Order_By>;
    pool_type?: InputMaybe<Order_By>;
    shares?: InputMaybe<Order_By>;
    staking_pool_metadata?: InputMaybe<Current_Staking_Pool_Voter_Order_By>;
    table_handle?: InputMaybe<Order_By>;
};
/** select columns of table "current_delegator_balances" */
declare enum Current_Delegator_Balances_Select_Column {
    /** column name */
    DelegatorAddress = "delegator_address",
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    ParentTableHandle = "parent_table_handle",
    /** column name */
    PoolAddress = "pool_address",
    /** column name */
    PoolType = "pool_type",
    /** column name */
    Shares = "shares",
    /** column name */
    TableHandle = "table_handle"
}
/** Streaming cursor of the table "current_delegator_balances" */
type Current_Delegator_Balances_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Current_Delegator_Balances_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Current_Delegator_Balances_Stream_Cursor_Value_Input = {
    delegator_address?: InputMaybe<Scalars['String']['input']>;
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    parent_table_handle?: InputMaybe<Scalars['String']['input']>;
    pool_address?: InputMaybe<Scalars['String']['input']>;
    pool_type?: InputMaybe<Scalars['String']['input']>;
    shares?: InputMaybe<Scalars['numeric']['input']>;
    table_handle?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "current_fungible_asset_balances" */
type Current_Fungible_Asset_Balances = {
    __typename?: 'current_fungible_asset_balances';
    amount: Scalars['numeric']['output'];
    asset_type: Scalars['String']['output'];
    is_frozen: Scalars['Boolean']['output'];
    is_primary: Scalars['Boolean']['output'];
    last_transaction_timestamp: Scalars['timestamp']['output'];
    last_transaction_version: Scalars['bigint']['output'];
    /** An object relationship */
    metadata?: Maybe<Fungible_Asset_Metadata>;
    owner_address: Scalars['String']['output'];
    storage_id: Scalars['String']['output'];
    token_standard: Scalars['String']['output'];
};
/** aggregated selection of "current_fungible_asset_balances" */
type Current_Fungible_Asset_Balances_Aggregate = {
    __typename?: 'current_fungible_asset_balances_aggregate';
    aggregate?: Maybe<Current_Fungible_Asset_Balances_Aggregate_Fields>;
    nodes: Array<Current_Fungible_Asset_Balances>;
};
/** aggregate fields of "current_fungible_asset_balances" */
type Current_Fungible_Asset_Balances_Aggregate_Fields = {
    __typename?: 'current_fungible_asset_balances_aggregate_fields';
    avg?: Maybe<Current_Fungible_Asset_Balances_Avg_Fields>;
    count: Scalars['Int']['output'];
    max?: Maybe<Current_Fungible_Asset_Balances_Max_Fields>;
    min?: Maybe<Current_Fungible_Asset_Balances_Min_Fields>;
    stddev?: Maybe<Current_Fungible_Asset_Balances_Stddev_Fields>;
    stddev_pop?: Maybe<Current_Fungible_Asset_Balances_Stddev_Pop_Fields>;
    stddev_samp?: Maybe<Current_Fungible_Asset_Balances_Stddev_Samp_Fields>;
    sum?: Maybe<Current_Fungible_Asset_Balances_Sum_Fields>;
    var_pop?: Maybe<Current_Fungible_Asset_Balances_Var_Pop_Fields>;
    var_samp?: Maybe<Current_Fungible_Asset_Balances_Var_Samp_Fields>;
    variance?: Maybe<Current_Fungible_Asset_Balances_Variance_Fields>;
};
/** aggregate fields of "current_fungible_asset_balances" */
type Current_Fungible_Asset_Balances_Aggregate_FieldsCountArgs = {
    columns?: InputMaybe<Array<Current_Fungible_Asset_Balances_Select_Column>>;
    distinct?: InputMaybe<Scalars['Boolean']['input']>;
};
/** aggregate avg on columns */
type Current_Fungible_Asset_Balances_Avg_Fields = {
    __typename?: 'current_fungible_asset_balances_avg_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** Boolean expression to filter rows from the table "current_fungible_asset_balances". All fields are combined with a logical 'AND'. */
type Current_Fungible_Asset_Balances_Bool_Exp = {
    _and?: InputMaybe<Array<Current_Fungible_Asset_Balances_Bool_Exp>>;
    _not?: InputMaybe<Current_Fungible_Asset_Balances_Bool_Exp>;
    _or?: InputMaybe<Array<Current_Fungible_Asset_Balances_Bool_Exp>>;
    amount?: InputMaybe<Numeric_Comparison_Exp>;
    asset_type?: InputMaybe<String_Comparison_Exp>;
    is_frozen?: InputMaybe<Boolean_Comparison_Exp>;
    is_primary?: InputMaybe<Boolean_Comparison_Exp>;
    last_transaction_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    metadata?: InputMaybe<Fungible_Asset_Metadata_Bool_Exp>;
    owner_address?: InputMaybe<String_Comparison_Exp>;
    storage_id?: InputMaybe<String_Comparison_Exp>;
    token_standard?: InputMaybe<String_Comparison_Exp>;
};
/** aggregate max on columns */
type Current_Fungible_Asset_Balances_Max_Fields = {
    __typename?: 'current_fungible_asset_balances_max_fields';
    amount?: Maybe<Scalars['numeric']['output']>;
    asset_type?: Maybe<Scalars['String']['output']>;
    last_transaction_timestamp?: Maybe<Scalars['timestamp']['output']>;
    last_transaction_version?: Maybe<Scalars['bigint']['output']>;
    owner_address?: Maybe<Scalars['String']['output']>;
    storage_id?: Maybe<Scalars['String']['output']>;
    token_standard?: Maybe<Scalars['String']['output']>;
};
/** aggregate min on columns */
type Current_Fungible_Asset_Balances_Min_Fields = {
    __typename?: 'current_fungible_asset_balances_min_fields';
    amount?: Maybe<Scalars['numeric']['output']>;
    asset_type?: Maybe<Scalars['String']['output']>;
    last_transaction_timestamp?: Maybe<Scalars['timestamp']['output']>;
    last_transaction_version?: Maybe<Scalars['bigint']['output']>;
    owner_address?: Maybe<Scalars['String']['output']>;
    storage_id?: Maybe<Scalars['String']['output']>;
    token_standard?: Maybe<Scalars['String']['output']>;
};
/** Ordering options when selecting data from "current_fungible_asset_balances". */
type Current_Fungible_Asset_Balances_Order_By = {
    amount?: InputMaybe<Order_By>;
    asset_type?: InputMaybe<Order_By>;
    is_frozen?: InputMaybe<Order_By>;
    is_primary?: InputMaybe<Order_By>;
    last_transaction_timestamp?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    metadata?: InputMaybe<Fungible_Asset_Metadata_Order_By>;
    owner_address?: InputMaybe<Order_By>;
    storage_id?: InputMaybe<Order_By>;
    token_standard?: InputMaybe<Order_By>;
};
/** select columns of table "current_fungible_asset_balances" */
declare enum Current_Fungible_Asset_Balances_Select_Column {
    /** column name */
    Amount = "amount",
    /** column name */
    AssetType = "asset_type",
    /** column name */
    IsFrozen = "is_frozen",
    /** column name */
    IsPrimary = "is_primary",
    /** column name */
    LastTransactionTimestamp = "last_transaction_timestamp",
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    OwnerAddress = "owner_address",
    /** column name */
    StorageId = "storage_id",
    /** column name */
    TokenStandard = "token_standard"
}
/** aggregate stddev on columns */
type Current_Fungible_Asset_Balances_Stddev_Fields = {
    __typename?: 'current_fungible_asset_balances_stddev_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate stddev_pop on columns */
type Current_Fungible_Asset_Balances_Stddev_Pop_Fields = {
    __typename?: 'current_fungible_asset_balances_stddev_pop_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate stddev_samp on columns */
type Current_Fungible_Asset_Balances_Stddev_Samp_Fields = {
    __typename?: 'current_fungible_asset_balances_stddev_samp_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** Streaming cursor of the table "current_fungible_asset_balances" */
type Current_Fungible_Asset_Balances_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Current_Fungible_Asset_Balances_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Current_Fungible_Asset_Balances_Stream_Cursor_Value_Input = {
    amount?: InputMaybe<Scalars['numeric']['input']>;
    asset_type?: InputMaybe<Scalars['String']['input']>;
    is_frozen?: InputMaybe<Scalars['Boolean']['input']>;
    is_primary?: InputMaybe<Scalars['Boolean']['input']>;
    last_transaction_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    owner_address?: InputMaybe<Scalars['String']['input']>;
    storage_id?: InputMaybe<Scalars['String']['input']>;
    token_standard?: InputMaybe<Scalars['String']['input']>;
};
/** aggregate sum on columns */
type Current_Fungible_Asset_Balances_Sum_Fields = {
    __typename?: 'current_fungible_asset_balances_sum_fields';
    amount?: Maybe<Scalars['numeric']['output']>;
    last_transaction_version?: Maybe<Scalars['bigint']['output']>;
};
/** aggregate var_pop on columns */
type Current_Fungible_Asset_Balances_Var_Pop_Fields = {
    __typename?: 'current_fungible_asset_balances_var_pop_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate var_samp on columns */
type Current_Fungible_Asset_Balances_Var_Samp_Fields = {
    __typename?: 'current_fungible_asset_balances_var_samp_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate variance on columns */
type Current_Fungible_Asset_Balances_Variance_Fields = {
    __typename?: 'current_fungible_asset_balances_variance_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** columns and relationships of "current_objects" */
type Current_Objects = {
    __typename?: 'current_objects';
    allow_ungated_transfer: Scalars['Boolean']['output'];
    is_deleted: Scalars['Boolean']['output'];
    last_guid_creation_num: Scalars['numeric']['output'];
    last_transaction_version: Scalars['bigint']['output'];
    object_address: Scalars['String']['output'];
    owner_address: Scalars['String']['output'];
    state_key_hash: Scalars['String']['output'];
};
/** Boolean expression to filter rows from the table "current_objects". All fields are combined with a logical 'AND'. */
type Current_Objects_Bool_Exp = {
    _and?: InputMaybe<Array<Current_Objects_Bool_Exp>>;
    _not?: InputMaybe<Current_Objects_Bool_Exp>;
    _or?: InputMaybe<Array<Current_Objects_Bool_Exp>>;
    allow_ungated_transfer?: InputMaybe<Boolean_Comparison_Exp>;
    is_deleted?: InputMaybe<Boolean_Comparison_Exp>;
    last_guid_creation_num?: InputMaybe<Numeric_Comparison_Exp>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    object_address?: InputMaybe<String_Comparison_Exp>;
    owner_address?: InputMaybe<String_Comparison_Exp>;
    state_key_hash?: InputMaybe<String_Comparison_Exp>;
};
/** Ordering options when selecting data from "current_objects". */
type Current_Objects_Order_By = {
    allow_ungated_transfer?: InputMaybe<Order_By>;
    is_deleted?: InputMaybe<Order_By>;
    last_guid_creation_num?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    object_address?: InputMaybe<Order_By>;
    owner_address?: InputMaybe<Order_By>;
    state_key_hash?: InputMaybe<Order_By>;
};
/** select columns of table "current_objects" */
declare enum Current_Objects_Select_Column {
    /** column name */
    AllowUngatedTransfer = "allow_ungated_transfer",
    /** column name */
    IsDeleted = "is_deleted",
    /** column name */
    LastGuidCreationNum = "last_guid_creation_num",
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    ObjectAddress = "object_address",
    /** column name */
    OwnerAddress = "owner_address",
    /** column name */
    StateKeyHash = "state_key_hash"
}
/** Streaming cursor of the table "current_objects" */
type Current_Objects_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Current_Objects_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Current_Objects_Stream_Cursor_Value_Input = {
    allow_ungated_transfer?: InputMaybe<Scalars['Boolean']['input']>;
    is_deleted?: InputMaybe<Scalars['Boolean']['input']>;
    last_guid_creation_num?: InputMaybe<Scalars['numeric']['input']>;
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    object_address?: InputMaybe<Scalars['String']['input']>;
    owner_address?: InputMaybe<Scalars['String']['input']>;
    state_key_hash?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "current_staking_pool_voter" */
type Current_Staking_Pool_Voter = {
    __typename?: 'current_staking_pool_voter';
    last_transaction_version: Scalars['bigint']['output'];
    operator_address: Scalars['String']['output'];
    /** An array relationship */
    operator_aptos_name: Array<Current_Aptos_Names>;
    /** An aggregate relationship */
    operator_aptos_name_aggregate: Current_Aptos_Names_Aggregate;
    staking_pool_address: Scalars['String']['output'];
    voter_address: Scalars['String']['output'];
};
/** columns and relationships of "current_staking_pool_voter" */
type Current_Staking_Pool_VoterOperator_Aptos_NameArgs = {
    distinct_on?: InputMaybe<Array<Current_Aptos_Names_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Aptos_Names_Order_By>>;
    where?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
};
/** columns and relationships of "current_staking_pool_voter" */
type Current_Staking_Pool_VoterOperator_Aptos_Name_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Current_Aptos_Names_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Aptos_Names_Order_By>>;
    where?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
};
/** Boolean expression to filter rows from the table "current_staking_pool_voter". All fields are combined with a logical 'AND'. */
type Current_Staking_Pool_Voter_Bool_Exp = {
    _and?: InputMaybe<Array<Current_Staking_Pool_Voter_Bool_Exp>>;
    _not?: InputMaybe<Current_Staking_Pool_Voter_Bool_Exp>;
    _or?: InputMaybe<Array<Current_Staking_Pool_Voter_Bool_Exp>>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    operator_address?: InputMaybe<String_Comparison_Exp>;
    operator_aptos_name?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
    staking_pool_address?: InputMaybe<String_Comparison_Exp>;
    voter_address?: InputMaybe<String_Comparison_Exp>;
};
/** Ordering options when selecting data from "current_staking_pool_voter". */
type Current_Staking_Pool_Voter_Order_By = {
    last_transaction_version?: InputMaybe<Order_By>;
    operator_address?: InputMaybe<Order_By>;
    operator_aptos_name_aggregate?: InputMaybe<Current_Aptos_Names_Aggregate_Order_By>;
    staking_pool_address?: InputMaybe<Order_By>;
    voter_address?: InputMaybe<Order_By>;
};
/** select columns of table "current_staking_pool_voter" */
declare enum Current_Staking_Pool_Voter_Select_Column {
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    OperatorAddress = "operator_address",
    /** column name */
    StakingPoolAddress = "staking_pool_address",
    /** column name */
    VoterAddress = "voter_address"
}
/** Streaming cursor of the table "current_staking_pool_voter" */
type Current_Staking_Pool_Voter_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Current_Staking_Pool_Voter_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Current_Staking_Pool_Voter_Stream_Cursor_Value_Input = {
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    operator_address?: InputMaybe<Scalars['String']['input']>;
    staking_pool_address?: InputMaybe<Scalars['String']['input']>;
    voter_address?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "current_table_items" */
type Current_Table_Items = {
    __typename?: 'current_table_items';
    decoded_key: Scalars['jsonb']['output'];
    decoded_value?: Maybe<Scalars['jsonb']['output']>;
    is_deleted: Scalars['Boolean']['output'];
    key: Scalars['String']['output'];
    key_hash: Scalars['String']['output'];
    last_transaction_version: Scalars['bigint']['output'];
    table_handle: Scalars['String']['output'];
};
/** columns and relationships of "current_table_items" */
type Current_Table_ItemsDecoded_KeyArgs = {
    path?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "current_table_items" */
type Current_Table_ItemsDecoded_ValueArgs = {
    path?: InputMaybe<Scalars['String']['input']>;
};
/** Boolean expression to filter rows from the table "current_table_items". All fields are combined with a logical 'AND'. */
type Current_Table_Items_Bool_Exp = {
    _and?: InputMaybe<Array<Current_Table_Items_Bool_Exp>>;
    _not?: InputMaybe<Current_Table_Items_Bool_Exp>;
    _or?: InputMaybe<Array<Current_Table_Items_Bool_Exp>>;
    decoded_key?: InputMaybe<Jsonb_Comparison_Exp>;
    decoded_value?: InputMaybe<Jsonb_Comparison_Exp>;
    is_deleted?: InputMaybe<Boolean_Comparison_Exp>;
    key?: InputMaybe<String_Comparison_Exp>;
    key_hash?: InputMaybe<String_Comparison_Exp>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    table_handle?: InputMaybe<String_Comparison_Exp>;
};
/** Ordering options when selecting data from "current_table_items". */
type Current_Table_Items_Order_By = {
    decoded_key?: InputMaybe<Order_By>;
    decoded_value?: InputMaybe<Order_By>;
    is_deleted?: InputMaybe<Order_By>;
    key?: InputMaybe<Order_By>;
    key_hash?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    table_handle?: InputMaybe<Order_By>;
};
/** select columns of table "current_table_items" */
declare enum Current_Table_Items_Select_Column {
    /** column name */
    DecodedKey = "decoded_key",
    /** column name */
    DecodedValue = "decoded_value",
    /** column name */
    IsDeleted = "is_deleted",
    /** column name */
    Key = "key",
    /** column name */
    KeyHash = "key_hash",
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    TableHandle = "table_handle"
}
/** Streaming cursor of the table "current_table_items" */
type Current_Table_Items_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Current_Table_Items_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Current_Table_Items_Stream_Cursor_Value_Input = {
    decoded_key?: InputMaybe<Scalars['jsonb']['input']>;
    decoded_value?: InputMaybe<Scalars['jsonb']['input']>;
    is_deleted?: InputMaybe<Scalars['Boolean']['input']>;
    key?: InputMaybe<Scalars['String']['input']>;
    key_hash?: InputMaybe<Scalars['String']['input']>;
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    table_handle?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "current_token_datas" */
type Current_Token_Datas = {
    __typename?: 'current_token_datas';
    collection_data_id_hash: Scalars['String']['output'];
    collection_name: Scalars['String']['output'];
    creator_address: Scalars['String']['output'];
    /** An object relationship */
    current_collection_data?: Maybe<Current_Collection_Datas>;
    default_properties: Scalars['jsonb']['output'];
    description: Scalars['String']['output'];
    description_mutable: Scalars['Boolean']['output'];
    largest_property_version: Scalars['numeric']['output'];
    last_transaction_timestamp: Scalars['timestamp']['output'];
    last_transaction_version: Scalars['bigint']['output'];
    maximum: Scalars['numeric']['output'];
    maximum_mutable: Scalars['Boolean']['output'];
    metadata_uri: Scalars['String']['output'];
    name: Scalars['String']['output'];
    payee_address: Scalars['String']['output'];
    properties_mutable: Scalars['Boolean']['output'];
    royalty_mutable: Scalars['Boolean']['output'];
    royalty_points_denominator: Scalars['numeric']['output'];
    royalty_points_numerator: Scalars['numeric']['output'];
    supply: Scalars['numeric']['output'];
    token_data_id_hash: Scalars['String']['output'];
    uri_mutable: Scalars['Boolean']['output'];
};
/** columns and relationships of "current_token_datas" */
type Current_Token_DatasDefault_PropertiesArgs = {
    path?: InputMaybe<Scalars['String']['input']>;
};
/** Boolean expression to filter rows from the table "current_token_datas". All fields are combined with a logical 'AND'. */
type Current_Token_Datas_Bool_Exp = {
    _and?: InputMaybe<Array<Current_Token_Datas_Bool_Exp>>;
    _not?: InputMaybe<Current_Token_Datas_Bool_Exp>;
    _or?: InputMaybe<Array<Current_Token_Datas_Bool_Exp>>;
    collection_data_id_hash?: InputMaybe<String_Comparison_Exp>;
    collection_name?: InputMaybe<String_Comparison_Exp>;
    creator_address?: InputMaybe<String_Comparison_Exp>;
    current_collection_data?: InputMaybe<Current_Collection_Datas_Bool_Exp>;
    default_properties?: InputMaybe<Jsonb_Comparison_Exp>;
    description?: InputMaybe<String_Comparison_Exp>;
    description_mutable?: InputMaybe<Boolean_Comparison_Exp>;
    largest_property_version?: InputMaybe<Numeric_Comparison_Exp>;
    last_transaction_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    maximum?: InputMaybe<Numeric_Comparison_Exp>;
    maximum_mutable?: InputMaybe<Boolean_Comparison_Exp>;
    metadata_uri?: InputMaybe<String_Comparison_Exp>;
    name?: InputMaybe<String_Comparison_Exp>;
    payee_address?: InputMaybe<String_Comparison_Exp>;
    properties_mutable?: InputMaybe<Boolean_Comparison_Exp>;
    royalty_mutable?: InputMaybe<Boolean_Comparison_Exp>;
    royalty_points_denominator?: InputMaybe<Numeric_Comparison_Exp>;
    royalty_points_numerator?: InputMaybe<Numeric_Comparison_Exp>;
    supply?: InputMaybe<Numeric_Comparison_Exp>;
    token_data_id_hash?: InputMaybe<String_Comparison_Exp>;
    uri_mutable?: InputMaybe<Boolean_Comparison_Exp>;
};
/** Ordering options when selecting data from "current_token_datas". */
type Current_Token_Datas_Order_By = {
    collection_data_id_hash?: InputMaybe<Order_By>;
    collection_name?: InputMaybe<Order_By>;
    creator_address?: InputMaybe<Order_By>;
    current_collection_data?: InputMaybe<Current_Collection_Datas_Order_By>;
    default_properties?: InputMaybe<Order_By>;
    description?: InputMaybe<Order_By>;
    description_mutable?: InputMaybe<Order_By>;
    largest_property_version?: InputMaybe<Order_By>;
    last_transaction_timestamp?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    maximum?: InputMaybe<Order_By>;
    maximum_mutable?: InputMaybe<Order_By>;
    metadata_uri?: InputMaybe<Order_By>;
    name?: InputMaybe<Order_By>;
    payee_address?: InputMaybe<Order_By>;
    properties_mutable?: InputMaybe<Order_By>;
    royalty_mutable?: InputMaybe<Order_By>;
    royalty_points_denominator?: InputMaybe<Order_By>;
    royalty_points_numerator?: InputMaybe<Order_By>;
    supply?: InputMaybe<Order_By>;
    token_data_id_hash?: InputMaybe<Order_By>;
    uri_mutable?: InputMaybe<Order_By>;
};
/** select columns of table "current_token_datas" */
declare enum Current_Token_Datas_Select_Column {
    /** column name */
    CollectionDataIdHash = "collection_data_id_hash",
    /** column name */
    CollectionName = "collection_name",
    /** column name */
    CreatorAddress = "creator_address",
    /** column name */
    DefaultProperties = "default_properties",
    /** column name */
    Description = "description",
    /** column name */
    DescriptionMutable = "description_mutable",
    /** column name */
    LargestPropertyVersion = "largest_property_version",
    /** column name */
    LastTransactionTimestamp = "last_transaction_timestamp",
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    Maximum = "maximum",
    /** column name */
    MaximumMutable = "maximum_mutable",
    /** column name */
    MetadataUri = "metadata_uri",
    /** column name */
    Name = "name",
    /** column name */
    PayeeAddress = "payee_address",
    /** column name */
    PropertiesMutable = "properties_mutable",
    /** column name */
    RoyaltyMutable = "royalty_mutable",
    /** column name */
    RoyaltyPointsDenominator = "royalty_points_denominator",
    /** column name */
    RoyaltyPointsNumerator = "royalty_points_numerator",
    /** column name */
    Supply = "supply",
    /** column name */
    TokenDataIdHash = "token_data_id_hash",
    /** column name */
    UriMutable = "uri_mutable"
}
/** Streaming cursor of the table "current_token_datas" */
type Current_Token_Datas_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Current_Token_Datas_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Current_Token_Datas_Stream_Cursor_Value_Input = {
    collection_data_id_hash?: InputMaybe<Scalars['String']['input']>;
    collection_name?: InputMaybe<Scalars['String']['input']>;
    creator_address?: InputMaybe<Scalars['String']['input']>;
    default_properties?: InputMaybe<Scalars['jsonb']['input']>;
    description?: InputMaybe<Scalars['String']['input']>;
    description_mutable?: InputMaybe<Scalars['Boolean']['input']>;
    largest_property_version?: InputMaybe<Scalars['numeric']['input']>;
    last_transaction_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    maximum?: InputMaybe<Scalars['numeric']['input']>;
    maximum_mutable?: InputMaybe<Scalars['Boolean']['input']>;
    metadata_uri?: InputMaybe<Scalars['String']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
    payee_address?: InputMaybe<Scalars['String']['input']>;
    properties_mutable?: InputMaybe<Scalars['Boolean']['input']>;
    royalty_mutable?: InputMaybe<Scalars['Boolean']['input']>;
    royalty_points_denominator?: InputMaybe<Scalars['numeric']['input']>;
    royalty_points_numerator?: InputMaybe<Scalars['numeric']['input']>;
    supply?: InputMaybe<Scalars['numeric']['input']>;
    token_data_id_hash?: InputMaybe<Scalars['String']['input']>;
    uri_mutable?: InputMaybe<Scalars['Boolean']['input']>;
};
/** columns and relationships of "current_token_datas_v2" */
type Current_Token_Datas_V2 = {
    __typename?: 'current_token_datas_v2';
    /** An object relationship */
    aptos_name?: Maybe<Current_Aptos_Names>;
    /** An object relationship */
    cdn_asset_uris?: Maybe<Nft_Metadata_Crawler_Parsed_Asset_Uris>;
    collection_id: Scalars['String']['output'];
    /** An object relationship */
    current_collection?: Maybe<Current_Collections_V2>;
    /** An object relationship */
    current_token_ownership?: Maybe<Current_Token_Ownerships_V2>;
    description: Scalars['String']['output'];
    is_fungible_v2?: Maybe<Scalars['Boolean']['output']>;
    largest_property_version_v1?: Maybe<Scalars['numeric']['output']>;
    last_transaction_timestamp: Scalars['timestamp']['output'];
    last_transaction_version: Scalars['bigint']['output'];
    maximum?: Maybe<Scalars['numeric']['output']>;
    supply: Scalars['numeric']['output'];
    token_data_id: Scalars['String']['output'];
    token_name: Scalars['String']['output'];
    token_properties: Scalars['jsonb']['output'];
    token_standard: Scalars['String']['output'];
    token_uri: Scalars['String']['output'];
};
/** columns and relationships of "current_token_datas_v2" */
type Current_Token_Datas_V2Token_PropertiesArgs = {
    path?: InputMaybe<Scalars['String']['input']>;
};
/** Boolean expression to filter rows from the table "current_token_datas_v2". All fields are combined with a logical 'AND'. */
type Current_Token_Datas_V2_Bool_Exp = {
    _and?: InputMaybe<Array<Current_Token_Datas_V2_Bool_Exp>>;
    _not?: InputMaybe<Current_Token_Datas_V2_Bool_Exp>;
    _or?: InputMaybe<Array<Current_Token_Datas_V2_Bool_Exp>>;
    aptos_name?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
    cdn_asset_uris?: InputMaybe<Nft_Metadata_Crawler_Parsed_Asset_Uris_Bool_Exp>;
    collection_id?: InputMaybe<String_Comparison_Exp>;
    current_collection?: InputMaybe<Current_Collections_V2_Bool_Exp>;
    current_token_ownership?: InputMaybe<Current_Token_Ownerships_V2_Bool_Exp>;
    description?: InputMaybe<String_Comparison_Exp>;
    is_fungible_v2?: InputMaybe<Boolean_Comparison_Exp>;
    largest_property_version_v1?: InputMaybe<Numeric_Comparison_Exp>;
    last_transaction_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    maximum?: InputMaybe<Numeric_Comparison_Exp>;
    supply?: InputMaybe<Numeric_Comparison_Exp>;
    token_data_id?: InputMaybe<String_Comparison_Exp>;
    token_name?: InputMaybe<String_Comparison_Exp>;
    token_properties?: InputMaybe<Jsonb_Comparison_Exp>;
    token_standard?: InputMaybe<String_Comparison_Exp>;
    token_uri?: InputMaybe<String_Comparison_Exp>;
};
/** Ordering options when selecting data from "current_token_datas_v2". */
type Current_Token_Datas_V2_Order_By = {
    aptos_name?: InputMaybe<Current_Aptos_Names_Order_By>;
    cdn_asset_uris?: InputMaybe<Nft_Metadata_Crawler_Parsed_Asset_Uris_Order_By>;
    collection_id?: InputMaybe<Order_By>;
    current_collection?: InputMaybe<Current_Collections_V2_Order_By>;
    current_token_ownership?: InputMaybe<Current_Token_Ownerships_V2_Order_By>;
    description?: InputMaybe<Order_By>;
    is_fungible_v2?: InputMaybe<Order_By>;
    largest_property_version_v1?: InputMaybe<Order_By>;
    last_transaction_timestamp?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    maximum?: InputMaybe<Order_By>;
    supply?: InputMaybe<Order_By>;
    token_data_id?: InputMaybe<Order_By>;
    token_name?: InputMaybe<Order_By>;
    token_properties?: InputMaybe<Order_By>;
    token_standard?: InputMaybe<Order_By>;
    token_uri?: InputMaybe<Order_By>;
};
/** select columns of table "current_token_datas_v2" */
declare enum Current_Token_Datas_V2_Select_Column {
    /** column name */
    CollectionId = "collection_id",
    /** column name */
    Description = "description",
    /** column name */
    IsFungibleV2 = "is_fungible_v2",
    /** column name */
    LargestPropertyVersionV1 = "largest_property_version_v1",
    /** column name */
    LastTransactionTimestamp = "last_transaction_timestamp",
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    Maximum = "maximum",
    /** column name */
    Supply = "supply",
    /** column name */
    TokenDataId = "token_data_id",
    /** column name */
    TokenName = "token_name",
    /** column name */
    TokenProperties = "token_properties",
    /** column name */
    TokenStandard = "token_standard",
    /** column name */
    TokenUri = "token_uri"
}
/** Streaming cursor of the table "current_token_datas_v2" */
type Current_Token_Datas_V2_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Current_Token_Datas_V2_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Current_Token_Datas_V2_Stream_Cursor_Value_Input = {
    collection_id?: InputMaybe<Scalars['String']['input']>;
    description?: InputMaybe<Scalars['String']['input']>;
    is_fungible_v2?: InputMaybe<Scalars['Boolean']['input']>;
    largest_property_version_v1?: InputMaybe<Scalars['numeric']['input']>;
    last_transaction_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    maximum?: InputMaybe<Scalars['numeric']['input']>;
    supply?: InputMaybe<Scalars['numeric']['input']>;
    token_data_id?: InputMaybe<Scalars['String']['input']>;
    token_name?: InputMaybe<Scalars['String']['input']>;
    token_properties?: InputMaybe<Scalars['jsonb']['input']>;
    token_standard?: InputMaybe<Scalars['String']['input']>;
    token_uri?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "current_token_ownerships" */
type Current_Token_Ownerships = {
    __typename?: 'current_token_ownerships';
    amount: Scalars['numeric']['output'];
    /** An object relationship */
    aptos_name?: Maybe<Current_Aptos_Names>;
    collection_data_id_hash: Scalars['String']['output'];
    collection_name: Scalars['String']['output'];
    creator_address: Scalars['String']['output'];
    /** An object relationship */
    current_collection_data?: Maybe<Current_Collection_Datas>;
    /** An object relationship */
    current_token_data?: Maybe<Current_Token_Datas>;
    last_transaction_timestamp: Scalars['timestamp']['output'];
    last_transaction_version: Scalars['bigint']['output'];
    name: Scalars['String']['output'];
    owner_address: Scalars['String']['output'];
    property_version: Scalars['numeric']['output'];
    table_type: Scalars['String']['output'];
    token_data_id_hash: Scalars['String']['output'];
    token_properties: Scalars['jsonb']['output'];
};
/** columns and relationships of "current_token_ownerships" */
type Current_Token_OwnershipsToken_PropertiesArgs = {
    path?: InputMaybe<Scalars['String']['input']>;
};
/** aggregated selection of "current_token_ownerships" */
type Current_Token_Ownerships_Aggregate = {
    __typename?: 'current_token_ownerships_aggregate';
    aggregate?: Maybe<Current_Token_Ownerships_Aggregate_Fields>;
    nodes: Array<Current_Token_Ownerships>;
};
/** aggregate fields of "current_token_ownerships" */
type Current_Token_Ownerships_Aggregate_Fields = {
    __typename?: 'current_token_ownerships_aggregate_fields';
    avg?: Maybe<Current_Token_Ownerships_Avg_Fields>;
    count: Scalars['Int']['output'];
    max?: Maybe<Current_Token_Ownerships_Max_Fields>;
    min?: Maybe<Current_Token_Ownerships_Min_Fields>;
    stddev?: Maybe<Current_Token_Ownerships_Stddev_Fields>;
    stddev_pop?: Maybe<Current_Token_Ownerships_Stddev_Pop_Fields>;
    stddev_samp?: Maybe<Current_Token_Ownerships_Stddev_Samp_Fields>;
    sum?: Maybe<Current_Token_Ownerships_Sum_Fields>;
    var_pop?: Maybe<Current_Token_Ownerships_Var_Pop_Fields>;
    var_samp?: Maybe<Current_Token_Ownerships_Var_Samp_Fields>;
    variance?: Maybe<Current_Token_Ownerships_Variance_Fields>;
};
/** aggregate fields of "current_token_ownerships" */
type Current_Token_Ownerships_Aggregate_FieldsCountArgs = {
    columns?: InputMaybe<Array<Current_Token_Ownerships_Select_Column>>;
    distinct?: InputMaybe<Scalars['Boolean']['input']>;
};
/** order by aggregate values of table "current_token_ownerships" */
type Current_Token_Ownerships_Aggregate_Order_By = {
    avg?: InputMaybe<Current_Token_Ownerships_Avg_Order_By>;
    count?: InputMaybe<Order_By>;
    max?: InputMaybe<Current_Token_Ownerships_Max_Order_By>;
    min?: InputMaybe<Current_Token_Ownerships_Min_Order_By>;
    stddev?: InputMaybe<Current_Token_Ownerships_Stddev_Order_By>;
    stddev_pop?: InputMaybe<Current_Token_Ownerships_Stddev_Pop_Order_By>;
    stddev_samp?: InputMaybe<Current_Token_Ownerships_Stddev_Samp_Order_By>;
    sum?: InputMaybe<Current_Token_Ownerships_Sum_Order_By>;
    var_pop?: InputMaybe<Current_Token_Ownerships_Var_Pop_Order_By>;
    var_samp?: InputMaybe<Current_Token_Ownerships_Var_Samp_Order_By>;
    variance?: InputMaybe<Current_Token_Ownerships_Variance_Order_By>;
};
/** aggregate avg on columns */
type Current_Token_Ownerships_Avg_Fields = {
    __typename?: 'current_token_ownerships_avg_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
    property_version?: Maybe<Scalars['Float']['output']>;
};
/** order by avg() on columns of table "current_token_ownerships" */
type Current_Token_Ownerships_Avg_Order_By = {
    amount?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
};
/** Boolean expression to filter rows from the table "current_token_ownerships". All fields are combined with a logical 'AND'. */
type Current_Token_Ownerships_Bool_Exp = {
    _and?: InputMaybe<Array<Current_Token_Ownerships_Bool_Exp>>;
    _not?: InputMaybe<Current_Token_Ownerships_Bool_Exp>;
    _or?: InputMaybe<Array<Current_Token_Ownerships_Bool_Exp>>;
    amount?: InputMaybe<Numeric_Comparison_Exp>;
    aptos_name?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
    collection_data_id_hash?: InputMaybe<String_Comparison_Exp>;
    collection_name?: InputMaybe<String_Comparison_Exp>;
    creator_address?: InputMaybe<String_Comparison_Exp>;
    current_collection_data?: InputMaybe<Current_Collection_Datas_Bool_Exp>;
    current_token_data?: InputMaybe<Current_Token_Datas_Bool_Exp>;
    last_transaction_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    name?: InputMaybe<String_Comparison_Exp>;
    owner_address?: InputMaybe<String_Comparison_Exp>;
    property_version?: InputMaybe<Numeric_Comparison_Exp>;
    table_type?: InputMaybe<String_Comparison_Exp>;
    token_data_id_hash?: InputMaybe<String_Comparison_Exp>;
    token_properties?: InputMaybe<Jsonb_Comparison_Exp>;
};
/** aggregate max on columns */
type Current_Token_Ownerships_Max_Fields = {
    __typename?: 'current_token_ownerships_max_fields';
    amount?: Maybe<Scalars['numeric']['output']>;
    collection_data_id_hash?: Maybe<Scalars['String']['output']>;
    collection_name?: Maybe<Scalars['String']['output']>;
    creator_address?: Maybe<Scalars['String']['output']>;
    last_transaction_timestamp?: Maybe<Scalars['timestamp']['output']>;
    last_transaction_version?: Maybe<Scalars['bigint']['output']>;
    name?: Maybe<Scalars['String']['output']>;
    owner_address?: Maybe<Scalars['String']['output']>;
    property_version?: Maybe<Scalars['numeric']['output']>;
    table_type?: Maybe<Scalars['String']['output']>;
    token_data_id_hash?: Maybe<Scalars['String']['output']>;
};
/** order by max() on columns of table "current_token_ownerships" */
type Current_Token_Ownerships_Max_Order_By = {
    amount?: InputMaybe<Order_By>;
    collection_data_id_hash?: InputMaybe<Order_By>;
    collection_name?: InputMaybe<Order_By>;
    creator_address?: InputMaybe<Order_By>;
    last_transaction_timestamp?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    name?: InputMaybe<Order_By>;
    owner_address?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
    table_type?: InputMaybe<Order_By>;
    token_data_id_hash?: InputMaybe<Order_By>;
};
/** aggregate min on columns */
type Current_Token_Ownerships_Min_Fields = {
    __typename?: 'current_token_ownerships_min_fields';
    amount?: Maybe<Scalars['numeric']['output']>;
    collection_data_id_hash?: Maybe<Scalars['String']['output']>;
    collection_name?: Maybe<Scalars['String']['output']>;
    creator_address?: Maybe<Scalars['String']['output']>;
    last_transaction_timestamp?: Maybe<Scalars['timestamp']['output']>;
    last_transaction_version?: Maybe<Scalars['bigint']['output']>;
    name?: Maybe<Scalars['String']['output']>;
    owner_address?: Maybe<Scalars['String']['output']>;
    property_version?: Maybe<Scalars['numeric']['output']>;
    table_type?: Maybe<Scalars['String']['output']>;
    token_data_id_hash?: Maybe<Scalars['String']['output']>;
};
/** order by min() on columns of table "current_token_ownerships" */
type Current_Token_Ownerships_Min_Order_By = {
    amount?: InputMaybe<Order_By>;
    collection_data_id_hash?: InputMaybe<Order_By>;
    collection_name?: InputMaybe<Order_By>;
    creator_address?: InputMaybe<Order_By>;
    last_transaction_timestamp?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    name?: InputMaybe<Order_By>;
    owner_address?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
    table_type?: InputMaybe<Order_By>;
    token_data_id_hash?: InputMaybe<Order_By>;
};
/** Ordering options when selecting data from "current_token_ownerships". */
type Current_Token_Ownerships_Order_By = {
    amount?: InputMaybe<Order_By>;
    aptos_name?: InputMaybe<Current_Aptos_Names_Order_By>;
    collection_data_id_hash?: InputMaybe<Order_By>;
    collection_name?: InputMaybe<Order_By>;
    creator_address?: InputMaybe<Order_By>;
    current_collection_data?: InputMaybe<Current_Collection_Datas_Order_By>;
    current_token_data?: InputMaybe<Current_Token_Datas_Order_By>;
    last_transaction_timestamp?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    name?: InputMaybe<Order_By>;
    owner_address?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
    table_type?: InputMaybe<Order_By>;
    token_data_id_hash?: InputMaybe<Order_By>;
    token_properties?: InputMaybe<Order_By>;
};
/** select columns of table "current_token_ownerships" */
declare enum Current_Token_Ownerships_Select_Column {
    /** column name */
    Amount = "amount",
    /** column name */
    CollectionDataIdHash = "collection_data_id_hash",
    /** column name */
    CollectionName = "collection_name",
    /** column name */
    CreatorAddress = "creator_address",
    /** column name */
    LastTransactionTimestamp = "last_transaction_timestamp",
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    Name = "name",
    /** column name */
    OwnerAddress = "owner_address",
    /** column name */
    PropertyVersion = "property_version",
    /** column name */
    TableType = "table_type",
    /** column name */
    TokenDataIdHash = "token_data_id_hash",
    /** column name */
    TokenProperties = "token_properties"
}
/** aggregate stddev on columns */
type Current_Token_Ownerships_Stddev_Fields = {
    __typename?: 'current_token_ownerships_stddev_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
    property_version?: Maybe<Scalars['Float']['output']>;
};
/** order by stddev() on columns of table "current_token_ownerships" */
type Current_Token_Ownerships_Stddev_Order_By = {
    amount?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
};
/** aggregate stddev_pop on columns */
type Current_Token_Ownerships_Stddev_Pop_Fields = {
    __typename?: 'current_token_ownerships_stddev_pop_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
    property_version?: Maybe<Scalars['Float']['output']>;
};
/** order by stddev_pop() on columns of table "current_token_ownerships" */
type Current_Token_Ownerships_Stddev_Pop_Order_By = {
    amount?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
};
/** aggregate stddev_samp on columns */
type Current_Token_Ownerships_Stddev_Samp_Fields = {
    __typename?: 'current_token_ownerships_stddev_samp_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
    property_version?: Maybe<Scalars['Float']['output']>;
};
/** order by stddev_samp() on columns of table "current_token_ownerships" */
type Current_Token_Ownerships_Stddev_Samp_Order_By = {
    amount?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
};
/** Streaming cursor of the table "current_token_ownerships" */
type Current_Token_Ownerships_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Current_Token_Ownerships_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Current_Token_Ownerships_Stream_Cursor_Value_Input = {
    amount?: InputMaybe<Scalars['numeric']['input']>;
    collection_data_id_hash?: InputMaybe<Scalars['String']['input']>;
    collection_name?: InputMaybe<Scalars['String']['input']>;
    creator_address?: InputMaybe<Scalars['String']['input']>;
    last_transaction_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
    owner_address?: InputMaybe<Scalars['String']['input']>;
    property_version?: InputMaybe<Scalars['numeric']['input']>;
    table_type?: InputMaybe<Scalars['String']['input']>;
    token_data_id_hash?: InputMaybe<Scalars['String']['input']>;
    token_properties?: InputMaybe<Scalars['jsonb']['input']>;
};
/** aggregate sum on columns */
type Current_Token_Ownerships_Sum_Fields = {
    __typename?: 'current_token_ownerships_sum_fields';
    amount?: Maybe<Scalars['numeric']['output']>;
    last_transaction_version?: Maybe<Scalars['bigint']['output']>;
    property_version?: Maybe<Scalars['numeric']['output']>;
};
/** order by sum() on columns of table "current_token_ownerships" */
type Current_Token_Ownerships_Sum_Order_By = {
    amount?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
};
/** columns and relationships of "current_token_ownerships_v2" */
type Current_Token_Ownerships_V2 = {
    __typename?: 'current_token_ownerships_v2';
    amount: Scalars['numeric']['output'];
    /** An array relationship */
    composed_nfts: Array<Current_Token_Ownerships_V2>;
    /** An aggregate relationship */
    composed_nfts_aggregate: Current_Token_Ownerships_V2_Aggregate;
    /** An object relationship */
    current_token_data?: Maybe<Current_Token_Datas_V2>;
    is_fungible_v2?: Maybe<Scalars['Boolean']['output']>;
    is_soulbound_v2?: Maybe<Scalars['Boolean']['output']>;
    last_transaction_timestamp: Scalars['timestamp']['output'];
    last_transaction_version: Scalars['bigint']['output'];
    owner_address: Scalars['String']['output'];
    property_version_v1: Scalars['numeric']['output'];
    storage_id: Scalars['String']['output'];
    table_type_v1?: Maybe<Scalars['String']['output']>;
    token_data_id: Scalars['String']['output'];
    token_properties_mutated_v1?: Maybe<Scalars['jsonb']['output']>;
    token_standard: Scalars['String']['output'];
};
/** columns and relationships of "current_token_ownerships_v2" */
type Current_Token_Ownerships_V2Composed_NftsArgs = {
    distinct_on?: InputMaybe<Array<Current_Token_Ownerships_V2_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Token_Ownerships_V2_Order_By>>;
    where?: InputMaybe<Current_Token_Ownerships_V2_Bool_Exp>;
};
/** columns and relationships of "current_token_ownerships_v2" */
type Current_Token_Ownerships_V2Composed_Nfts_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Current_Token_Ownerships_V2_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Token_Ownerships_V2_Order_By>>;
    where?: InputMaybe<Current_Token_Ownerships_V2_Bool_Exp>;
};
/** columns and relationships of "current_token_ownerships_v2" */
type Current_Token_Ownerships_V2Token_Properties_Mutated_V1Args = {
    path?: InputMaybe<Scalars['String']['input']>;
};
/** aggregated selection of "current_token_ownerships_v2" */
type Current_Token_Ownerships_V2_Aggregate = {
    __typename?: 'current_token_ownerships_v2_aggregate';
    aggregate?: Maybe<Current_Token_Ownerships_V2_Aggregate_Fields>;
    nodes: Array<Current_Token_Ownerships_V2>;
};
/** aggregate fields of "current_token_ownerships_v2" */
type Current_Token_Ownerships_V2_Aggregate_Fields = {
    __typename?: 'current_token_ownerships_v2_aggregate_fields';
    avg?: Maybe<Current_Token_Ownerships_V2_Avg_Fields>;
    count: Scalars['Int']['output'];
    max?: Maybe<Current_Token_Ownerships_V2_Max_Fields>;
    min?: Maybe<Current_Token_Ownerships_V2_Min_Fields>;
    stddev?: Maybe<Current_Token_Ownerships_V2_Stddev_Fields>;
    stddev_pop?: Maybe<Current_Token_Ownerships_V2_Stddev_Pop_Fields>;
    stddev_samp?: Maybe<Current_Token_Ownerships_V2_Stddev_Samp_Fields>;
    sum?: Maybe<Current_Token_Ownerships_V2_Sum_Fields>;
    var_pop?: Maybe<Current_Token_Ownerships_V2_Var_Pop_Fields>;
    var_samp?: Maybe<Current_Token_Ownerships_V2_Var_Samp_Fields>;
    variance?: Maybe<Current_Token_Ownerships_V2_Variance_Fields>;
};
/** aggregate fields of "current_token_ownerships_v2" */
type Current_Token_Ownerships_V2_Aggregate_FieldsCountArgs = {
    columns?: InputMaybe<Array<Current_Token_Ownerships_V2_Select_Column>>;
    distinct?: InputMaybe<Scalars['Boolean']['input']>;
};
/** order by aggregate values of table "current_token_ownerships_v2" */
type Current_Token_Ownerships_V2_Aggregate_Order_By = {
    avg?: InputMaybe<Current_Token_Ownerships_V2_Avg_Order_By>;
    count?: InputMaybe<Order_By>;
    max?: InputMaybe<Current_Token_Ownerships_V2_Max_Order_By>;
    min?: InputMaybe<Current_Token_Ownerships_V2_Min_Order_By>;
    stddev?: InputMaybe<Current_Token_Ownerships_V2_Stddev_Order_By>;
    stddev_pop?: InputMaybe<Current_Token_Ownerships_V2_Stddev_Pop_Order_By>;
    stddev_samp?: InputMaybe<Current_Token_Ownerships_V2_Stddev_Samp_Order_By>;
    sum?: InputMaybe<Current_Token_Ownerships_V2_Sum_Order_By>;
    var_pop?: InputMaybe<Current_Token_Ownerships_V2_Var_Pop_Order_By>;
    var_samp?: InputMaybe<Current_Token_Ownerships_V2_Var_Samp_Order_By>;
    variance?: InputMaybe<Current_Token_Ownerships_V2_Variance_Order_By>;
};
/** aggregate avg on columns */
type Current_Token_Ownerships_V2_Avg_Fields = {
    __typename?: 'current_token_ownerships_v2_avg_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
    property_version_v1?: Maybe<Scalars['Float']['output']>;
};
/** order by avg() on columns of table "current_token_ownerships_v2" */
type Current_Token_Ownerships_V2_Avg_Order_By = {
    amount?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    property_version_v1?: InputMaybe<Order_By>;
};
/** Boolean expression to filter rows from the table "current_token_ownerships_v2". All fields are combined with a logical 'AND'. */
type Current_Token_Ownerships_V2_Bool_Exp = {
    _and?: InputMaybe<Array<Current_Token_Ownerships_V2_Bool_Exp>>;
    _not?: InputMaybe<Current_Token_Ownerships_V2_Bool_Exp>;
    _or?: InputMaybe<Array<Current_Token_Ownerships_V2_Bool_Exp>>;
    amount?: InputMaybe<Numeric_Comparison_Exp>;
    composed_nfts?: InputMaybe<Current_Token_Ownerships_V2_Bool_Exp>;
    current_token_data?: InputMaybe<Current_Token_Datas_V2_Bool_Exp>;
    is_fungible_v2?: InputMaybe<Boolean_Comparison_Exp>;
    is_soulbound_v2?: InputMaybe<Boolean_Comparison_Exp>;
    last_transaction_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    owner_address?: InputMaybe<String_Comparison_Exp>;
    property_version_v1?: InputMaybe<Numeric_Comparison_Exp>;
    storage_id?: InputMaybe<String_Comparison_Exp>;
    table_type_v1?: InputMaybe<String_Comparison_Exp>;
    token_data_id?: InputMaybe<String_Comparison_Exp>;
    token_properties_mutated_v1?: InputMaybe<Jsonb_Comparison_Exp>;
    token_standard?: InputMaybe<String_Comparison_Exp>;
};
/** aggregate max on columns */
type Current_Token_Ownerships_V2_Max_Fields = {
    __typename?: 'current_token_ownerships_v2_max_fields';
    amount?: Maybe<Scalars['numeric']['output']>;
    last_transaction_timestamp?: Maybe<Scalars['timestamp']['output']>;
    last_transaction_version?: Maybe<Scalars['bigint']['output']>;
    owner_address?: Maybe<Scalars['String']['output']>;
    property_version_v1?: Maybe<Scalars['numeric']['output']>;
    storage_id?: Maybe<Scalars['String']['output']>;
    table_type_v1?: Maybe<Scalars['String']['output']>;
    token_data_id?: Maybe<Scalars['String']['output']>;
    token_standard?: Maybe<Scalars['String']['output']>;
};
/** order by max() on columns of table "current_token_ownerships_v2" */
type Current_Token_Ownerships_V2_Max_Order_By = {
    amount?: InputMaybe<Order_By>;
    last_transaction_timestamp?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    owner_address?: InputMaybe<Order_By>;
    property_version_v1?: InputMaybe<Order_By>;
    storage_id?: InputMaybe<Order_By>;
    table_type_v1?: InputMaybe<Order_By>;
    token_data_id?: InputMaybe<Order_By>;
    token_standard?: InputMaybe<Order_By>;
};
/** aggregate min on columns */
type Current_Token_Ownerships_V2_Min_Fields = {
    __typename?: 'current_token_ownerships_v2_min_fields';
    amount?: Maybe<Scalars['numeric']['output']>;
    last_transaction_timestamp?: Maybe<Scalars['timestamp']['output']>;
    last_transaction_version?: Maybe<Scalars['bigint']['output']>;
    owner_address?: Maybe<Scalars['String']['output']>;
    property_version_v1?: Maybe<Scalars['numeric']['output']>;
    storage_id?: Maybe<Scalars['String']['output']>;
    table_type_v1?: Maybe<Scalars['String']['output']>;
    token_data_id?: Maybe<Scalars['String']['output']>;
    token_standard?: Maybe<Scalars['String']['output']>;
};
/** order by min() on columns of table "current_token_ownerships_v2" */
type Current_Token_Ownerships_V2_Min_Order_By = {
    amount?: InputMaybe<Order_By>;
    last_transaction_timestamp?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    owner_address?: InputMaybe<Order_By>;
    property_version_v1?: InputMaybe<Order_By>;
    storage_id?: InputMaybe<Order_By>;
    table_type_v1?: InputMaybe<Order_By>;
    token_data_id?: InputMaybe<Order_By>;
    token_standard?: InputMaybe<Order_By>;
};
/** Ordering options when selecting data from "current_token_ownerships_v2". */
type Current_Token_Ownerships_V2_Order_By = {
    amount?: InputMaybe<Order_By>;
    composed_nfts_aggregate?: InputMaybe<Current_Token_Ownerships_V2_Aggregate_Order_By>;
    current_token_data?: InputMaybe<Current_Token_Datas_V2_Order_By>;
    is_fungible_v2?: InputMaybe<Order_By>;
    is_soulbound_v2?: InputMaybe<Order_By>;
    last_transaction_timestamp?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    owner_address?: InputMaybe<Order_By>;
    property_version_v1?: InputMaybe<Order_By>;
    storage_id?: InputMaybe<Order_By>;
    table_type_v1?: InputMaybe<Order_By>;
    token_data_id?: InputMaybe<Order_By>;
    token_properties_mutated_v1?: InputMaybe<Order_By>;
    token_standard?: InputMaybe<Order_By>;
};
/** select columns of table "current_token_ownerships_v2" */
declare enum Current_Token_Ownerships_V2_Select_Column {
    /** column name */
    Amount = "amount",
    /** column name */
    IsFungibleV2 = "is_fungible_v2",
    /** column name */
    IsSoulboundV2 = "is_soulbound_v2",
    /** column name */
    LastTransactionTimestamp = "last_transaction_timestamp",
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    OwnerAddress = "owner_address",
    /** column name */
    PropertyVersionV1 = "property_version_v1",
    /** column name */
    StorageId = "storage_id",
    /** column name */
    TableTypeV1 = "table_type_v1",
    /** column name */
    TokenDataId = "token_data_id",
    /** column name */
    TokenPropertiesMutatedV1 = "token_properties_mutated_v1",
    /** column name */
    TokenStandard = "token_standard"
}
/** aggregate stddev on columns */
type Current_Token_Ownerships_V2_Stddev_Fields = {
    __typename?: 'current_token_ownerships_v2_stddev_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
    property_version_v1?: Maybe<Scalars['Float']['output']>;
};
/** order by stddev() on columns of table "current_token_ownerships_v2" */
type Current_Token_Ownerships_V2_Stddev_Order_By = {
    amount?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    property_version_v1?: InputMaybe<Order_By>;
};
/** aggregate stddev_pop on columns */
type Current_Token_Ownerships_V2_Stddev_Pop_Fields = {
    __typename?: 'current_token_ownerships_v2_stddev_pop_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
    property_version_v1?: Maybe<Scalars['Float']['output']>;
};
/** order by stddev_pop() on columns of table "current_token_ownerships_v2" */
type Current_Token_Ownerships_V2_Stddev_Pop_Order_By = {
    amount?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    property_version_v1?: InputMaybe<Order_By>;
};
/** aggregate stddev_samp on columns */
type Current_Token_Ownerships_V2_Stddev_Samp_Fields = {
    __typename?: 'current_token_ownerships_v2_stddev_samp_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
    property_version_v1?: Maybe<Scalars['Float']['output']>;
};
/** order by stddev_samp() on columns of table "current_token_ownerships_v2" */
type Current_Token_Ownerships_V2_Stddev_Samp_Order_By = {
    amount?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    property_version_v1?: InputMaybe<Order_By>;
};
/** Streaming cursor of the table "current_token_ownerships_v2" */
type Current_Token_Ownerships_V2_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Current_Token_Ownerships_V2_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Current_Token_Ownerships_V2_Stream_Cursor_Value_Input = {
    amount?: InputMaybe<Scalars['numeric']['input']>;
    is_fungible_v2?: InputMaybe<Scalars['Boolean']['input']>;
    is_soulbound_v2?: InputMaybe<Scalars['Boolean']['input']>;
    last_transaction_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    owner_address?: InputMaybe<Scalars['String']['input']>;
    property_version_v1?: InputMaybe<Scalars['numeric']['input']>;
    storage_id?: InputMaybe<Scalars['String']['input']>;
    table_type_v1?: InputMaybe<Scalars['String']['input']>;
    token_data_id?: InputMaybe<Scalars['String']['input']>;
    token_properties_mutated_v1?: InputMaybe<Scalars['jsonb']['input']>;
    token_standard?: InputMaybe<Scalars['String']['input']>;
};
/** aggregate sum on columns */
type Current_Token_Ownerships_V2_Sum_Fields = {
    __typename?: 'current_token_ownerships_v2_sum_fields';
    amount?: Maybe<Scalars['numeric']['output']>;
    last_transaction_version?: Maybe<Scalars['bigint']['output']>;
    property_version_v1?: Maybe<Scalars['numeric']['output']>;
};
/** order by sum() on columns of table "current_token_ownerships_v2" */
type Current_Token_Ownerships_V2_Sum_Order_By = {
    amount?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    property_version_v1?: InputMaybe<Order_By>;
};
/** aggregate var_pop on columns */
type Current_Token_Ownerships_V2_Var_Pop_Fields = {
    __typename?: 'current_token_ownerships_v2_var_pop_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
    property_version_v1?: Maybe<Scalars['Float']['output']>;
};
/** order by var_pop() on columns of table "current_token_ownerships_v2" */
type Current_Token_Ownerships_V2_Var_Pop_Order_By = {
    amount?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    property_version_v1?: InputMaybe<Order_By>;
};
/** aggregate var_samp on columns */
type Current_Token_Ownerships_V2_Var_Samp_Fields = {
    __typename?: 'current_token_ownerships_v2_var_samp_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
    property_version_v1?: Maybe<Scalars['Float']['output']>;
};
/** order by var_samp() on columns of table "current_token_ownerships_v2" */
type Current_Token_Ownerships_V2_Var_Samp_Order_By = {
    amount?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    property_version_v1?: InputMaybe<Order_By>;
};
/** aggregate variance on columns */
type Current_Token_Ownerships_V2_Variance_Fields = {
    __typename?: 'current_token_ownerships_v2_variance_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
    property_version_v1?: Maybe<Scalars['Float']['output']>;
};
/** order by variance() on columns of table "current_token_ownerships_v2" */
type Current_Token_Ownerships_V2_Variance_Order_By = {
    amount?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    property_version_v1?: InputMaybe<Order_By>;
};
/** aggregate var_pop on columns */
type Current_Token_Ownerships_Var_Pop_Fields = {
    __typename?: 'current_token_ownerships_var_pop_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
    property_version?: Maybe<Scalars['Float']['output']>;
};
/** order by var_pop() on columns of table "current_token_ownerships" */
type Current_Token_Ownerships_Var_Pop_Order_By = {
    amount?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
};
/** aggregate var_samp on columns */
type Current_Token_Ownerships_Var_Samp_Fields = {
    __typename?: 'current_token_ownerships_var_samp_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
    property_version?: Maybe<Scalars['Float']['output']>;
};
/** order by var_samp() on columns of table "current_token_ownerships" */
type Current_Token_Ownerships_Var_Samp_Order_By = {
    amount?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
};
/** aggregate variance on columns */
type Current_Token_Ownerships_Variance_Fields = {
    __typename?: 'current_token_ownerships_variance_fields';
    amount?: Maybe<Scalars['Float']['output']>;
    last_transaction_version?: Maybe<Scalars['Float']['output']>;
    property_version?: Maybe<Scalars['Float']['output']>;
};
/** order by variance() on columns of table "current_token_ownerships" */
type Current_Token_Ownerships_Variance_Order_By = {
    amount?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
};
/** columns and relationships of "current_token_pending_claims" */
type Current_Token_Pending_Claims = {
    __typename?: 'current_token_pending_claims';
    amount: Scalars['numeric']['output'];
    collection_data_id_hash: Scalars['String']['output'];
    collection_id: Scalars['String']['output'];
    collection_name: Scalars['String']['output'];
    creator_address: Scalars['String']['output'];
    /** An object relationship */
    current_collection_data?: Maybe<Current_Collection_Datas>;
    /** An object relationship */
    current_collection_v2?: Maybe<Current_Collections_V2>;
    /** An object relationship */
    current_token_data?: Maybe<Current_Token_Datas>;
    /** An object relationship */
    current_token_data_v2?: Maybe<Current_Token_Datas_V2>;
    from_address: Scalars['String']['output'];
    last_transaction_timestamp: Scalars['timestamp']['output'];
    last_transaction_version: Scalars['bigint']['output'];
    name: Scalars['String']['output'];
    property_version: Scalars['numeric']['output'];
    table_handle: Scalars['String']['output'];
    to_address: Scalars['String']['output'];
    /** An object relationship */
    token?: Maybe<Tokens>;
    token_data_id: Scalars['String']['output'];
    token_data_id_hash: Scalars['String']['output'];
};
/** Boolean expression to filter rows from the table "current_token_pending_claims". All fields are combined with a logical 'AND'. */
type Current_Token_Pending_Claims_Bool_Exp = {
    _and?: InputMaybe<Array<Current_Token_Pending_Claims_Bool_Exp>>;
    _not?: InputMaybe<Current_Token_Pending_Claims_Bool_Exp>;
    _or?: InputMaybe<Array<Current_Token_Pending_Claims_Bool_Exp>>;
    amount?: InputMaybe<Numeric_Comparison_Exp>;
    collection_data_id_hash?: InputMaybe<String_Comparison_Exp>;
    collection_id?: InputMaybe<String_Comparison_Exp>;
    collection_name?: InputMaybe<String_Comparison_Exp>;
    creator_address?: InputMaybe<String_Comparison_Exp>;
    current_collection_data?: InputMaybe<Current_Collection_Datas_Bool_Exp>;
    current_collection_v2?: InputMaybe<Current_Collections_V2_Bool_Exp>;
    current_token_data?: InputMaybe<Current_Token_Datas_Bool_Exp>;
    current_token_data_v2?: InputMaybe<Current_Token_Datas_V2_Bool_Exp>;
    from_address?: InputMaybe<String_Comparison_Exp>;
    last_transaction_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    name?: InputMaybe<String_Comparison_Exp>;
    property_version?: InputMaybe<Numeric_Comparison_Exp>;
    table_handle?: InputMaybe<String_Comparison_Exp>;
    to_address?: InputMaybe<String_Comparison_Exp>;
    token?: InputMaybe<Tokens_Bool_Exp>;
    token_data_id?: InputMaybe<String_Comparison_Exp>;
    token_data_id_hash?: InputMaybe<String_Comparison_Exp>;
};
/** Ordering options when selecting data from "current_token_pending_claims". */
type Current_Token_Pending_Claims_Order_By = {
    amount?: InputMaybe<Order_By>;
    collection_data_id_hash?: InputMaybe<Order_By>;
    collection_id?: InputMaybe<Order_By>;
    collection_name?: InputMaybe<Order_By>;
    creator_address?: InputMaybe<Order_By>;
    current_collection_data?: InputMaybe<Current_Collection_Datas_Order_By>;
    current_collection_v2?: InputMaybe<Current_Collections_V2_Order_By>;
    current_token_data?: InputMaybe<Current_Token_Datas_Order_By>;
    current_token_data_v2?: InputMaybe<Current_Token_Datas_V2_Order_By>;
    from_address?: InputMaybe<Order_By>;
    last_transaction_timestamp?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    name?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
    table_handle?: InputMaybe<Order_By>;
    to_address?: InputMaybe<Order_By>;
    token?: InputMaybe<Tokens_Order_By>;
    token_data_id?: InputMaybe<Order_By>;
    token_data_id_hash?: InputMaybe<Order_By>;
};
/** select columns of table "current_token_pending_claims" */
declare enum Current_Token_Pending_Claims_Select_Column {
    /** column name */
    Amount = "amount",
    /** column name */
    CollectionDataIdHash = "collection_data_id_hash",
    /** column name */
    CollectionId = "collection_id",
    /** column name */
    CollectionName = "collection_name",
    /** column name */
    CreatorAddress = "creator_address",
    /** column name */
    FromAddress = "from_address",
    /** column name */
    LastTransactionTimestamp = "last_transaction_timestamp",
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    Name = "name",
    /** column name */
    PropertyVersion = "property_version",
    /** column name */
    TableHandle = "table_handle",
    /** column name */
    ToAddress = "to_address",
    /** column name */
    TokenDataId = "token_data_id",
    /** column name */
    TokenDataIdHash = "token_data_id_hash"
}
/** Streaming cursor of the table "current_token_pending_claims" */
type Current_Token_Pending_Claims_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Current_Token_Pending_Claims_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Current_Token_Pending_Claims_Stream_Cursor_Value_Input = {
    amount?: InputMaybe<Scalars['numeric']['input']>;
    collection_data_id_hash?: InputMaybe<Scalars['String']['input']>;
    collection_id?: InputMaybe<Scalars['String']['input']>;
    collection_name?: InputMaybe<Scalars['String']['input']>;
    creator_address?: InputMaybe<Scalars['String']['input']>;
    from_address?: InputMaybe<Scalars['String']['input']>;
    last_transaction_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
    property_version?: InputMaybe<Scalars['numeric']['input']>;
    table_handle?: InputMaybe<Scalars['String']['input']>;
    to_address?: InputMaybe<Scalars['String']['input']>;
    token_data_id?: InputMaybe<Scalars['String']['input']>;
    token_data_id_hash?: InputMaybe<Scalars['String']['input']>;
};
/** ordering argument of a cursor */
declare enum Cursor_Ordering {
    /** ascending ordering of the cursor */
    Asc = "ASC",
    /** descending ordering of the cursor */
    Desc = "DESC"
}
/** columns and relationships of "delegated_staking_activities" */
type Delegated_Staking_Activities = {
    __typename?: 'delegated_staking_activities';
    amount: Scalars['numeric']['output'];
    delegator_address: Scalars['String']['output'];
    event_index: Scalars['bigint']['output'];
    event_type: Scalars['String']['output'];
    pool_address: Scalars['String']['output'];
    transaction_version: Scalars['bigint']['output'];
};
/** order by aggregate values of table "delegated_staking_activities" */
type Delegated_Staking_Activities_Aggregate_Order_By = {
    avg?: InputMaybe<Delegated_Staking_Activities_Avg_Order_By>;
    count?: InputMaybe<Order_By>;
    max?: InputMaybe<Delegated_Staking_Activities_Max_Order_By>;
    min?: InputMaybe<Delegated_Staking_Activities_Min_Order_By>;
    stddev?: InputMaybe<Delegated_Staking_Activities_Stddev_Order_By>;
    stddev_pop?: InputMaybe<Delegated_Staking_Activities_Stddev_Pop_Order_By>;
    stddev_samp?: InputMaybe<Delegated_Staking_Activities_Stddev_Samp_Order_By>;
    sum?: InputMaybe<Delegated_Staking_Activities_Sum_Order_By>;
    var_pop?: InputMaybe<Delegated_Staking_Activities_Var_Pop_Order_By>;
    var_samp?: InputMaybe<Delegated_Staking_Activities_Var_Samp_Order_By>;
    variance?: InputMaybe<Delegated_Staking_Activities_Variance_Order_By>;
};
/** order by avg() on columns of table "delegated_staking_activities" */
type Delegated_Staking_Activities_Avg_Order_By = {
    amount?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** Boolean expression to filter rows from the table "delegated_staking_activities". All fields are combined with a logical 'AND'. */
type Delegated_Staking_Activities_Bool_Exp = {
    _and?: InputMaybe<Array<Delegated_Staking_Activities_Bool_Exp>>;
    _not?: InputMaybe<Delegated_Staking_Activities_Bool_Exp>;
    _or?: InputMaybe<Array<Delegated_Staking_Activities_Bool_Exp>>;
    amount?: InputMaybe<Numeric_Comparison_Exp>;
    delegator_address?: InputMaybe<String_Comparison_Exp>;
    event_index?: InputMaybe<Bigint_Comparison_Exp>;
    event_type?: InputMaybe<String_Comparison_Exp>;
    pool_address?: InputMaybe<String_Comparison_Exp>;
    transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
};
/** order by max() on columns of table "delegated_staking_activities" */
type Delegated_Staking_Activities_Max_Order_By = {
    amount?: InputMaybe<Order_By>;
    delegator_address?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_type?: InputMaybe<Order_By>;
    pool_address?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** order by min() on columns of table "delegated_staking_activities" */
type Delegated_Staking_Activities_Min_Order_By = {
    amount?: InputMaybe<Order_By>;
    delegator_address?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_type?: InputMaybe<Order_By>;
    pool_address?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** Ordering options when selecting data from "delegated_staking_activities". */
type Delegated_Staking_Activities_Order_By = {
    amount?: InputMaybe<Order_By>;
    delegator_address?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_type?: InputMaybe<Order_By>;
    pool_address?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** select columns of table "delegated_staking_activities" */
declare enum Delegated_Staking_Activities_Select_Column {
    /** column name */
    Amount = "amount",
    /** column name */
    DelegatorAddress = "delegator_address",
    /** column name */
    EventIndex = "event_index",
    /** column name */
    EventType = "event_type",
    /** column name */
    PoolAddress = "pool_address",
    /** column name */
    TransactionVersion = "transaction_version"
}
/** order by stddev() on columns of table "delegated_staking_activities" */
type Delegated_Staking_Activities_Stddev_Order_By = {
    amount?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** order by stddev_pop() on columns of table "delegated_staking_activities" */
type Delegated_Staking_Activities_Stddev_Pop_Order_By = {
    amount?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** order by stddev_samp() on columns of table "delegated_staking_activities" */
type Delegated_Staking_Activities_Stddev_Samp_Order_By = {
    amount?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** Streaming cursor of the table "delegated_staking_activities" */
type Delegated_Staking_Activities_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Delegated_Staking_Activities_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Delegated_Staking_Activities_Stream_Cursor_Value_Input = {
    amount?: InputMaybe<Scalars['numeric']['input']>;
    delegator_address?: InputMaybe<Scalars['String']['input']>;
    event_index?: InputMaybe<Scalars['bigint']['input']>;
    event_type?: InputMaybe<Scalars['String']['input']>;
    pool_address?: InputMaybe<Scalars['String']['input']>;
    transaction_version?: InputMaybe<Scalars['bigint']['input']>;
};
/** order by sum() on columns of table "delegated_staking_activities" */
type Delegated_Staking_Activities_Sum_Order_By = {
    amount?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** order by var_pop() on columns of table "delegated_staking_activities" */
type Delegated_Staking_Activities_Var_Pop_Order_By = {
    amount?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** order by var_samp() on columns of table "delegated_staking_activities" */
type Delegated_Staking_Activities_Var_Samp_Order_By = {
    amount?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** order by variance() on columns of table "delegated_staking_activities" */
type Delegated_Staking_Activities_Variance_Order_By = {
    amount?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** columns and relationships of "delegated_staking_pools" */
type Delegated_Staking_Pools = {
    __typename?: 'delegated_staking_pools';
    /** An object relationship */
    current_staking_pool?: Maybe<Current_Staking_Pool_Voter>;
    first_transaction_version: Scalars['bigint']['output'];
    staking_pool_address: Scalars['String']['output'];
};
/** Boolean expression to filter rows from the table "delegated_staking_pools". All fields are combined with a logical 'AND'. */
type Delegated_Staking_Pools_Bool_Exp = {
    _and?: InputMaybe<Array<Delegated_Staking_Pools_Bool_Exp>>;
    _not?: InputMaybe<Delegated_Staking_Pools_Bool_Exp>;
    _or?: InputMaybe<Array<Delegated_Staking_Pools_Bool_Exp>>;
    current_staking_pool?: InputMaybe<Current_Staking_Pool_Voter_Bool_Exp>;
    first_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    staking_pool_address?: InputMaybe<String_Comparison_Exp>;
};
/** Ordering options when selecting data from "delegated_staking_pools". */
type Delegated_Staking_Pools_Order_By = {
    current_staking_pool?: InputMaybe<Current_Staking_Pool_Voter_Order_By>;
    first_transaction_version?: InputMaybe<Order_By>;
    staking_pool_address?: InputMaybe<Order_By>;
};
/** select columns of table "delegated_staking_pools" */
declare enum Delegated_Staking_Pools_Select_Column {
    /** column name */
    FirstTransactionVersion = "first_transaction_version",
    /** column name */
    StakingPoolAddress = "staking_pool_address"
}
/** Streaming cursor of the table "delegated_staking_pools" */
type Delegated_Staking_Pools_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Delegated_Staking_Pools_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Delegated_Staking_Pools_Stream_Cursor_Value_Input = {
    first_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    staking_pool_address?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "delegator_distinct_pool" */
type Delegator_Distinct_Pool = {
    __typename?: 'delegator_distinct_pool';
    /** An object relationship */
    current_pool_balance?: Maybe<Current_Delegated_Staking_Pool_Balances>;
    delegator_address?: Maybe<Scalars['String']['output']>;
    pool_address?: Maybe<Scalars['String']['output']>;
    /** An object relationship */
    staking_pool_metadata?: Maybe<Current_Staking_Pool_Voter>;
};
/** aggregated selection of "delegator_distinct_pool" */
type Delegator_Distinct_Pool_Aggregate = {
    __typename?: 'delegator_distinct_pool_aggregate';
    aggregate?: Maybe<Delegator_Distinct_Pool_Aggregate_Fields>;
    nodes: Array<Delegator_Distinct_Pool>;
};
/** aggregate fields of "delegator_distinct_pool" */
type Delegator_Distinct_Pool_Aggregate_Fields = {
    __typename?: 'delegator_distinct_pool_aggregate_fields';
    count: Scalars['Int']['output'];
    max?: Maybe<Delegator_Distinct_Pool_Max_Fields>;
    min?: Maybe<Delegator_Distinct_Pool_Min_Fields>;
};
/** aggregate fields of "delegator_distinct_pool" */
type Delegator_Distinct_Pool_Aggregate_FieldsCountArgs = {
    columns?: InputMaybe<Array<Delegator_Distinct_Pool_Select_Column>>;
    distinct?: InputMaybe<Scalars['Boolean']['input']>;
};
/** Boolean expression to filter rows from the table "delegator_distinct_pool". All fields are combined with a logical 'AND'. */
type Delegator_Distinct_Pool_Bool_Exp = {
    _and?: InputMaybe<Array<Delegator_Distinct_Pool_Bool_Exp>>;
    _not?: InputMaybe<Delegator_Distinct_Pool_Bool_Exp>;
    _or?: InputMaybe<Array<Delegator_Distinct_Pool_Bool_Exp>>;
    current_pool_balance?: InputMaybe<Current_Delegated_Staking_Pool_Balances_Bool_Exp>;
    delegator_address?: InputMaybe<String_Comparison_Exp>;
    pool_address?: InputMaybe<String_Comparison_Exp>;
    staking_pool_metadata?: InputMaybe<Current_Staking_Pool_Voter_Bool_Exp>;
};
/** aggregate max on columns */
type Delegator_Distinct_Pool_Max_Fields = {
    __typename?: 'delegator_distinct_pool_max_fields';
    delegator_address?: Maybe<Scalars['String']['output']>;
    pool_address?: Maybe<Scalars['String']['output']>;
};
/** aggregate min on columns */
type Delegator_Distinct_Pool_Min_Fields = {
    __typename?: 'delegator_distinct_pool_min_fields';
    delegator_address?: Maybe<Scalars['String']['output']>;
    pool_address?: Maybe<Scalars['String']['output']>;
};
/** Ordering options when selecting data from "delegator_distinct_pool". */
type Delegator_Distinct_Pool_Order_By = {
    current_pool_balance?: InputMaybe<Current_Delegated_Staking_Pool_Balances_Order_By>;
    delegator_address?: InputMaybe<Order_By>;
    pool_address?: InputMaybe<Order_By>;
    staking_pool_metadata?: InputMaybe<Current_Staking_Pool_Voter_Order_By>;
};
/** select columns of table "delegator_distinct_pool" */
declare enum Delegator_Distinct_Pool_Select_Column {
    /** column name */
    DelegatorAddress = "delegator_address",
    /** column name */
    PoolAddress = "pool_address"
}
/** Streaming cursor of the table "delegator_distinct_pool" */
type Delegator_Distinct_Pool_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Delegator_Distinct_Pool_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Delegator_Distinct_Pool_Stream_Cursor_Value_Input = {
    delegator_address?: InputMaybe<Scalars['String']['input']>;
    pool_address?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "events" */
type Events = {
    __typename?: 'events';
    account_address: Scalars['String']['output'];
    creation_number: Scalars['bigint']['output'];
    data: Scalars['jsonb']['output'];
    event_index: Scalars['bigint']['output'];
    indexed_type: Scalars['String']['output'];
    sequence_number: Scalars['bigint']['output'];
    transaction_block_height: Scalars['bigint']['output'];
    transaction_version: Scalars['bigint']['output'];
    type: Scalars['String']['output'];
};
/** columns and relationships of "events" */
type EventsDataArgs = {
    path?: InputMaybe<Scalars['String']['input']>;
};
/** Boolean expression to filter rows from the table "events". All fields are combined with a logical 'AND'. */
type Events_Bool_Exp = {
    _and?: InputMaybe<Array<Events_Bool_Exp>>;
    _not?: InputMaybe<Events_Bool_Exp>;
    _or?: InputMaybe<Array<Events_Bool_Exp>>;
    account_address?: InputMaybe<String_Comparison_Exp>;
    creation_number?: InputMaybe<Bigint_Comparison_Exp>;
    data?: InputMaybe<Jsonb_Comparison_Exp>;
    event_index?: InputMaybe<Bigint_Comparison_Exp>;
    indexed_type?: InputMaybe<String_Comparison_Exp>;
    sequence_number?: InputMaybe<Bigint_Comparison_Exp>;
    transaction_block_height?: InputMaybe<Bigint_Comparison_Exp>;
    transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    type?: InputMaybe<String_Comparison_Exp>;
};
/** Ordering options when selecting data from "events". */
type Events_Order_By = {
    account_address?: InputMaybe<Order_By>;
    creation_number?: InputMaybe<Order_By>;
    data?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    indexed_type?: InputMaybe<Order_By>;
    sequence_number?: InputMaybe<Order_By>;
    transaction_block_height?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
    type?: InputMaybe<Order_By>;
};
/** select columns of table "events" */
declare enum Events_Select_Column {
    /** column name */
    AccountAddress = "account_address",
    /** column name */
    CreationNumber = "creation_number",
    /** column name */
    Data = "data",
    /** column name */
    EventIndex = "event_index",
    /** column name */
    IndexedType = "indexed_type",
    /** column name */
    SequenceNumber = "sequence_number",
    /** column name */
    TransactionBlockHeight = "transaction_block_height",
    /** column name */
    TransactionVersion = "transaction_version",
    /** column name */
    Type = "type"
}
/** Streaming cursor of the table "events" */
type Events_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Events_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Events_Stream_Cursor_Value_Input = {
    account_address?: InputMaybe<Scalars['String']['input']>;
    creation_number?: InputMaybe<Scalars['bigint']['input']>;
    data?: InputMaybe<Scalars['jsonb']['input']>;
    event_index?: InputMaybe<Scalars['bigint']['input']>;
    indexed_type?: InputMaybe<Scalars['String']['input']>;
    sequence_number?: InputMaybe<Scalars['bigint']['input']>;
    transaction_block_height?: InputMaybe<Scalars['bigint']['input']>;
    transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    type?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "fungible_asset_activities" */
type Fungible_Asset_Activities = {
    __typename?: 'fungible_asset_activities';
    amount?: Maybe<Scalars['numeric']['output']>;
    asset_type: Scalars['String']['output'];
    block_height: Scalars['bigint']['output'];
    entry_function_id_str?: Maybe<Scalars['String']['output']>;
    event_index: Scalars['bigint']['output'];
    gas_fee_payer_address?: Maybe<Scalars['String']['output']>;
    is_frozen?: Maybe<Scalars['Boolean']['output']>;
    is_gas_fee: Scalars['Boolean']['output'];
    is_transaction_success: Scalars['Boolean']['output'];
    /** An object relationship */
    metadata?: Maybe<Fungible_Asset_Metadata>;
    owner_address: Scalars['String']['output'];
    /** An array relationship */
    owner_aptos_names: Array<Current_Aptos_Names>;
    /** An aggregate relationship */
    owner_aptos_names_aggregate: Current_Aptos_Names_Aggregate;
    storage_id: Scalars['String']['output'];
    storage_refund_amount: Scalars['numeric']['output'];
    token_standard: Scalars['String']['output'];
    transaction_timestamp: Scalars['timestamp']['output'];
    transaction_version: Scalars['bigint']['output'];
    type: Scalars['String']['output'];
};
/** columns and relationships of "fungible_asset_activities" */
type Fungible_Asset_ActivitiesOwner_Aptos_NamesArgs = {
    distinct_on?: InputMaybe<Array<Current_Aptos_Names_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Aptos_Names_Order_By>>;
    where?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
};
/** columns and relationships of "fungible_asset_activities" */
type Fungible_Asset_ActivitiesOwner_Aptos_Names_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Current_Aptos_Names_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Aptos_Names_Order_By>>;
    where?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
};
/** order by aggregate values of table "fungible_asset_activities" */
type Fungible_Asset_Activities_Aggregate_Order_By = {
    avg?: InputMaybe<Fungible_Asset_Activities_Avg_Order_By>;
    count?: InputMaybe<Order_By>;
    max?: InputMaybe<Fungible_Asset_Activities_Max_Order_By>;
    min?: InputMaybe<Fungible_Asset_Activities_Min_Order_By>;
    stddev?: InputMaybe<Fungible_Asset_Activities_Stddev_Order_By>;
    stddev_pop?: InputMaybe<Fungible_Asset_Activities_Stddev_Pop_Order_By>;
    stddev_samp?: InputMaybe<Fungible_Asset_Activities_Stddev_Samp_Order_By>;
    sum?: InputMaybe<Fungible_Asset_Activities_Sum_Order_By>;
    var_pop?: InputMaybe<Fungible_Asset_Activities_Var_Pop_Order_By>;
    var_samp?: InputMaybe<Fungible_Asset_Activities_Var_Samp_Order_By>;
    variance?: InputMaybe<Fungible_Asset_Activities_Variance_Order_By>;
};
/** order by avg() on columns of table "fungible_asset_activities" */
type Fungible_Asset_Activities_Avg_Order_By = {
    amount?: InputMaybe<Order_By>;
    block_height?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    storage_refund_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** Boolean expression to filter rows from the table "fungible_asset_activities". All fields are combined with a logical 'AND'. */
type Fungible_Asset_Activities_Bool_Exp = {
    _and?: InputMaybe<Array<Fungible_Asset_Activities_Bool_Exp>>;
    _not?: InputMaybe<Fungible_Asset_Activities_Bool_Exp>;
    _or?: InputMaybe<Array<Fungible_Asset_Activities_Bool_Exp>>;
    amount?: InputMaybe<Numeric_Comparison_Exp>;
    asset_type?: InputMaybe<String_Comparison_Exp>;
    block_height?: InputMaybe<Bigint_Comparison_Exp>;
    entry_function_id_str?: InputMaybe<String_Comparison_Exp>;
    event_index?: InputMaybe<Bigint_Comparison_Exp>;
    gas_fee_payer_address?: InputMaybe<String_Comparison_Exp>;
    is_frozen?: InputMaybe<Boolean_Comparison_Exp>;
    is_gas_fee?: InputMaybe<Boolean_Comparison_Exp>;
    is_transaction_success?: InputMaybe<Boolean_Comparison_Exp>;
    metadata?: InputMaybe<Fungible_Asset_Metadata_Bool_Exp>;
    owner_address?: InputMaybe<String_Comparison_Exp>;
    owner_aptos_names?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
    storage_id?: InputMaybe<String_Comparison_Exp>;
    storage_refund_amount?: InputMaybe<Numeric_Comparison_Exp>;
    token_standard?: InputMaybe<String_Comparison_Exp>;
    transaction_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    type?: InputMaybe<String_Comparison_Exp>;
};
/** order by max() on columns of table "fungible_asset_activities" */
type Fungible_Asset_Activities_Max_Order_By = {
    amount?: InputMaybe<Order_By>;
    asset_type?: InputMaybe<Order_By>;
    block_height?: InputMaybe<Order_By>;
    entry_function_id_str?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    gas_fee_payer_address?: InputMaybe<Order_By>;
    owner_address?: InputMaybe<Order_By>;
    storage_id?: InputMaybe<Order_By>;
    storage_refund_amount?: InputMaybe<Order_By>;
    token_standard?: InputMaybe<Order_By>;
    transaction_timestamp?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
    type?: InputMaybe<Order_By>;
};
/** order by min() on columns of table "fungible_asset_activities" */
type Fungible_Asset_Activities_Min_Order_By = {
    amount?: InputMaybe<Order_By>;
    asset_type?: InputMaybe<Order_By>;
    block_height?: InputMaybe<Order_By>;
    entry_function_id_str?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    gas_fee_payer_address?: InputMaybe<Order_By>;
    owner_address?: InputMaybe<Order_By>;
    storage_id?: InputMaybe<Order_By>;
    storage_refund_amount?: InputMaybe<Order_By>;
    token_standard?: InputMaybe<Order_By>;
    transaction_timestamp?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
    type?: InputMaybe<Order_By>;
};
/** Ordering options when selecting data from "fungible_asset_activities". */
type Fungible_Asset_Activities_Order_By = {
    amount?: InputMaybe<Order_By>;
    asset_type?: InputMaybe<Order_By>;
    block_height?: InputMaybe<Order_By>;
    entry_function_id_str?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    gas_fee_payer_address?: InputMaybe<Order_By>;
    is_frozen?: InputMaybe<Order_By>;
    is_gas_fee?: InputMaybe<Order_By>;
    is_transaction_success?: InputMaybe<Order_By>;
    metadata?: InputMaybe<Fungible_Asset_Metadata_Order_By>;
    owner_address?: InputMaybe<Order_By>;
    owner_aptos_names_aggregate?: InputMaybe<Current_Aptos_Names_Aggregate_Order_By>;
    storage_id?: InputMaybe<Order_By>;
    storage_refund_amount?: InputMaybe<Order_By>;
    token_standard?: InputMaybe<Order_By>;
    transaction_timestamp?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
    type?: InputMaybe<Order_By>;
};
/** select columns of table "fungible_asset_activities" */
declare enum Fungible_Asset_Activities_Select_Column {
    /** column name */
    Amount = "amount",
    /** column name */
    AssetType = "asset_type",
    /** column name */
    BlockHeight = "block_height",
    /** column name */
    EntryFunctionIdStr = "entry_function_id_str",
    /** column name */
    EventIndex = "event_index",
    /** column name */
    GasFeePayerAddress = "gas_fee_payer_address",
    /** column name */
    IsFrozen = "is_frozen",
    /** column name */
    IsGasFee = "is_gas_fee",
    /** column name */
    IsTransactionSuccess = "is_transaction_success",
    /** column name */
    OwnerAddress = "owner_address",
    /** column name */
    StorageId = "storage_id",
    /** column name */
    StorageRefundAmount = "storage_refund_amount",
    /** column name */
    TokenStandard = "token_standard",
    /** column name */
    TransactionTimestamp = "transaction_timestamp",
    /** column name */
    TransactionVersion = "transaction_version",
    /** column name */
    Type = "type"
}
/** order by stddev() on columns of table "fungible_asset_activities" */
type Fungible_Asset_Activities_Stddev_Order_By = {
    amount?: InputMaybe<Order_By>;
    block_height?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    storage_refund_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** order by stddev_pop() on columns of table "fungible_asset_activities" */
type Fungible_Asset_Activities_Stddev_Pop_Order_By = {
    amount?: InputMaybe<Order_By>;
    block_height?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    storage_refund_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** order by stddev_samp() on columns of table "fungible_asset_activities" */
type Fungible_Asset_Activities_Stddev_Samp_Order_By = {
    amount?: InputMaybe<Order_By>;
    block_height?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    storage_refund_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** Streaming cursor of the table "fungible_asset_activities" */
type Fungible_Asset_Activities_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Fungible_Asset_Activities_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Fungible_Asset_Activities_Stream_Cursor_Value_Input = {
    amount?: InputMaybe<Scalars['numeric']['input']>;
    asset_type?: InputMaybe<Scalars['String']['input']>;
    block_height?: InputMaybe<Scalars['bigint']['input']>;
    entry_function_id_str?: InputMaybe<Scalars['String']['input']>;
    event_index?: InputMaybe<Scalars['bigint']['input']>;
    gas_fee_payer_address?: InputMaybe<Scalars['String']['input']>;
    is_frozen?: InputMaybe<Scalars['Boolean']['input']>;
    is_gas_fee?: InputMaybe<Scalars['Boolean']['input']>;
    is_transaction_success?: InputMaybe<Scalars['Boolean']['input']>;
    owner_address?: InputMaybe<Scalars['String']['input']>;
    storage_id?: InputMaybe<Scalars['String']['input']>;
    storage_refund_amount?: InputMaybe<Scalars['numeric']['input']>;
    token_standard?: InputMaybe<Scalars['String']['input']>;
    transaction_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    type?: InputMaybe<Scalars['String']['input']>;
};
/** order by sum() on columns of table "fungible_asset_activities" */
type Fungible_Asset_Activities_Sum_Order_By = {
    amount?: InputMaybe<Order_By>;
    block_height?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    storage_refund_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** order by var_pop() on columns of table "fungible_asset_activities" */
type Fungible_Asset_Activities_Var_Pop_Order_By = {
    amount?: InputMaybe<Order_By>;
    block_height?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    storage_refund_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** order by var_samp() on columns of table "fungible_asset_activities" */
type Fungible_Asset_Activities_Var_Samp_Order_By = {
    amount?: InputMaybe<Order_By>;
    block_height?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    storage_refund_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** order by variance() on columns of table "fungible_asset_activities" */
type Fungible_Asset_Activities_Variance_Order_By = {
    amount?: InputMaybe<Order_By>;
    block_height?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    storage_refund_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** columns and relationships of "fungible_asset_metadata" */
type Fungible_Asset_Metadata = {
    __typename?: 'fungible_asset_metadata';
    asset_type: Scalars['String']['output'];
    creator_address: Scalars['String']['output'];
    decimals: Scalars['Int']['output'];
    icon_uri?: Maybe<Scalars['String']['output']>;
    last_transaction_timestamp: Scalars['timestamp']['output'];
    last_transaction_version: Scalars['bigint']['output'];
    name: Scalars['String']['output'];
    project_uri?: Maybe<Scalars['String']['output']>;
    supply_aggregator_table_handle_v1?: Maybe<Scalars['String']['output']>;
    supply_aggregator_table_key_v1?: Maybe<Scalars['String']['output']>;
    symbol: Scalars['String']['output'];
    token_standard: Scalars['String']['output'];
};
/** Boolean expression to filter rows from the table "fungible_asset_metadata". All fields are combined with a logical 'AND'. */
type Fungible_Asset_Metadata_Bool_Exp = {
    _and?: InputMaybe<Array<Fungible_Asset_Metadata_Bool_Exp>>;
    _not?: InputMaybe<Fungible_Asset_Metadata_Bool_Exp>;
    _or?: InputMaybe<Array<Fungible_Asset_Metadata_Bool_Exp>>;
    asset_type?: InputMaybe<String_Comparison_Exp>;
    creator_address?: InputMaybe<String_Comparison_Exp>;
    decimals?: InputMaybe<Int_Comparison_Exp>;
    icon_uri?: InputMaybe<String_Comparison_Exp>;
    last_transaction_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    name?: InputMaybe<String_Comparison_Exp>;
    project_uri?: InputMaybe<String_Comparison_Exp>;
    supply_aggregator_table_handle_v1?: InputMaybe<String_Comparison_Exp>;
    supply_aggregator_table_key_v1?: InputMaybe<String_Comparison_Exp>;
    symbol?: InputMaybe<String_Comparison_Exp>;
    token_standard?: InputMaybe<String_Comparison_Exp>;
};
/** Ordering options when selecting data from "fungible_asset_metadata". */
type Fungible_Asset_Metadata_Order_By = {
    asset_type?: InputMaybe<Order_By>;
    creator_address?: InputMaybe<Order_By>;
    decimals?: InputMaybe<Order_By>;
    icon_uri?: InputMaybe<Order_By>;
    last_transaction_timestamp?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    name?: InputMaybe<Order_By>;
    project_uri?: InputMaybe<Order_By>;
    supply_aggregator_table_handle_v1?: InputMaybe<Order_By>;
    supply_aggregator_table_key_v1?: InputMaybe<Order_By>;
    symbol?: InputMaybe<Order_By>;
    token_standard?: InputMaybe<Order_By>;
};
/** select columns of table "fungible_asset_metadata" */
declare enum Fungible_Asset_Metadata_Select_Column {
    /** column name */
    AssetType = "asset_type",
    /** column name */
    CreatorAddress = "creator_address",
    /** column name */
    Decimals = "decimals",
    /** column name */
    IconUri = "icon_uri",
    /** column name */
    LastTransactionTimestamp = "last_transaction_timestamp",
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    Name = "name",
    /** column name */
    ProjectUri = "project_uri",
    /** column name */
    SupplyAggregatorTableHandleV1 = "supply_aggregator_table_handle_v1",
    /** column name */
    SupplyAggregatorTableKeyV1 = "supply_aggregator_table_key_v1",
    /** column name */
    Symbol = "symbol",
    /** column name */
    TokenStandard = "token_standard"
}
/** Streaming cursor of the table "fungible_asset_metadata" */
type Fungible_Asset_Metadata_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Fungible_Asset_Metadata_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Fungible_Asset_Metadata_Stream_Cursor_Value_Input = {
    asset_type?: InputMaybe<Scalars['String']['input']>;
    creator_address?: InputMaybe<Scalars['String']['input']>;
    decimals?: InputMaybe<Scalars['Int']['input']>;
    icon_uri?: InputMaybe<Scalars['String']['input']>;
    last_transaction_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
    project_uri?: InputMaybe<Scalars['String']['input']>;
    supply_aggregator_table_handle_v1?: InputMaybe<Scalars['String']['input']>;
    supply_aggregator_table_key_v1?: InputMaybe<Scalars['String']['input']>;
    symbol?: InputMaybe<Scalars['String']['input']>;
    token_standard?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "indexer_status" */
type Indexer_Status = {
    __typename?: 'indexer_status';
    db: Scalars['String']['output'];
    is_indexer_up: Scalars['Boolean']['output'];
};
/** Boolean expression to filter rows from the table "indexer_status". All fields are combined with a logical 'AND'. */
type Indexer_Status_Bool_Exp = {
    _and?: InputMaybe<Array<Indexer_Status_Bool_Exp>>;
    _not?: InputMaybe<Indexer_Status_Bool_Exp>;
    _or?: InputMaybe<Array<Indexer_Status_Bool_Exp>>;
    db?: InputMaybe<String_Comparison_Exp>;
    is_indexer_up?: InputMaybe<Boolean_Comparison_Exp>;
};
/** Ordering options when selecting data from "indexer_status". */
type Indexer_Status_Order_By = {
    db?: InputMaybe<Order_By>;
    is_indexer_up?: InputMaybe<Order_By>;
};
/** select columns of table "indexer_status" */
declare enum Indexer_Status_Select_Column {
    /** column name */
    Db = "db",
    /** column name */
    IsIndexerUp = "is_indexer_up"
}
/** Streaming cursor of the table "indexer_status" */
type Indexer_Status_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Indexer_Status_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Indexer_Status_Stream_Cursor_Value_Input = {
    db?: InputMaybe<Scalars['String']['input']>;
    is_indexer_up?: InputMaybe<Scalars['Boolean']['input']>;
};
type Jsonb_Cast_Exp = {
    String?: InputMaybe<String_Comparison_Exp>;
};
/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
type Jsonb_Comparison_Exp = {
    _cast?: InputMaybe<Jsonb_Cast_Exp>;
    /** is the column contained in the given json value */
    _contained_in?: InputMaybe<Scalars['jsonb']['input']>;
    /** does the column contain the given json value at the top level */
    _contains?: InputMaybe<Scalars['jsonb']['input']>;
    _eq?: InputMaybe<Scalars['jsonb']['input']>;
    _gt?: InputMaybe<Scalars['jsonb']['input']>;
    _gte?: InputMaybe<Scalars['jsonb']['input']>;
    /** does the string exist as a top-level key in the column */
    _has_key?: InputMaybe<Scalars['String']['input']>;
    /** do all of these strings exist as top-level keys in the column */
    _has_keys_all?: InputMaybe<Array<Scalars['String']['input']>>;
    /** do any of these strings exist as top-level keys in the column */
    _has_keys_any?: InputMaybe<Array<Scalars['String']['input']>>;
    _in?: InputMaybe<Array<Scalars['jsonb']['input']>>;
    _is_null?: InputMaybe<Scalars['Boolean']['input']>;
    _lt?: InputMaybe<Scalars['jsonb']['input']>;
    _lte?: InputMaybe<Scalars['jsonb']['input']>;
    _neq?: InputMaybe<Scalars['jsonb']['input']>;
    _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>;
};
/** columns and relationships of "ledger_infos" */
type Ledger_Infos = {
    __typename?: 'ledger_infos';
    chain_id: Scalars['bigint']['output'];
};
/** Boolean expression to filter rows from the table "ledger_infos". All fields are combined with a logical 'AND'. */
type Ledger_Infos_Bool_Exp = {
    _and?: InputMaybe<Array<Ledger_Infos_Bool_Exp>>;
    _not?: InputMaybe<Ledger_Infos_Bool_Exp>;
    _or?: InputMaybe<Array<Ledger_Infos_Bool_Exp>>;
    chain_id?: InputMaybe<Bigint_Comparison_Exp>;
};
/** Ordering options when selecting data from "ledger_infos". */
type Ledger_Infos_Order_By = {
    chain_id?: InputMaybe<Order_By>;
};
/** select columns of table "ledger_infos" */
declare enum Ledger_Infos_Select_Column {
    /** column name */
    ChainId = "chain_id"
}
/** Streaming cursor of the table "ledger_infos" */
type Ledger_Infos_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Ledger_Infos_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Ledger_Infos_Stream_Cursor_Value_Input = {
    chain_id?: InputMaybe<Scalars['bigint']['input']>;
};
/** columns and relationships of "move_resources" */
type Move_Resources = {
    __typename?: 'move_resources';
    address: Scalars['String']['output'];
    transaction_version: Scalars['bigint']['output'];
};
/** aggregated selection of "move_resources" */
type Move_Resources_Aggregate = {
    __typename?: 'move_resources_aggregate';
    aggregate?: Maybe<Move_Resources_Aggregate_Fields>;
    nodes: Array<Move_Resources>;
};
/** aggregate fields of "move_resources" */
type Move_Resources_Aggregate_Fields = {
    __typename?: 'move_resources_aggregate_fields';
    avg?: Maybe<Move_Resources_Avg_Fields>;
    count: Scalars['Int']['output'];
    max?: Maybe<Move_Resources_Max_Fields>;
    min?: Maybe<Move_Resources_Min_Fields>;
    stddev?: Maybe<Move_Resources_Stddev_Fields>;
    stddev_pop?: Maybe<Move_Resources_Stddev_Pop_Fields>;
    stddev_samp?: Maybe<Move_Resources_Stddev_Samp_Fields>;
    sum?: Maybe<Move_Resources_Sum_Fields>;
    var_pop?: Maybe<Move_Resources_Var_Pop_Fields>;
    var_samp?: Maybe<Move_Resources_Var_Samp_Fields>;
    variance?: Maybe<Move_Resources_Variance_Fields>;
};
/** aggregate fields of "move_resources" */
type Move_Resources_Aggregate_FieldsCountArgs = {
    columns?: InputMaybe<Array<Move_Resources_Select_Column>>;
    distinct?: InputMaybe<Scalars['Boolean']['input']>;
};
/** aggregate avg on columns */
type Move_Resources_Avg_Fields = {
    __typename?: 'move_resources_avg_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** Boolean expression to filter rows from the table "move_resources". All fields are combined with a logical 'AND'. */
type Move_Resources_Bool_Exp = {
    _and?: InputMaybe<Array<Move_Resources_Bool_Exp>>;
    _not?: InputMaybe<Move_Resources_Bool_Exp>;
    _or?: InputMaybe<Array<Move_Resources_Bool_Exp>>;
    address?: InputMaybe<String_Comparison_Exp>;
    transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
};
/** aggregate max on columns */
type Move_Resources_Max_Fields = {
    __typename?: 'move_resources_max_fields';
    address?: Maybe<Scalars['String']['output']>;
    transaction_version?: Maybe<Scalars['bigint']['output']>;
};
/** aggregate min on columns */
type Move_Resources_Min_Fields = {
    __typename?: 'move_resources_min_fields';
    address?: Maybe<Scalars['String']['output']>;
    transaction_version?: Maybe<Scalars['bigint']['output']>;
};
/** Ordering options when selecting data from "move_resources". */
type Move_Resources_Order_By = {
    address?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** select columns of table "move_resources" */
declare enum Move_Resources_Select_Column {
    /** column name */
    Address = "address",
    /** column name */
    TransactionVersion = "transaction_version"
}
/** aggregate stddev on columns */
type Move_Resources_Stddev_Fields = {
    __typename?: 'move_resources_stddev_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate stddev_pop on columns */
type Move_Resources_Stddev_Pop_Fields = {
    __typename?: 'move_resources_stddev_pop_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate stddev_samp on columns */
type Move_Resources_Stddev_Samp_Fields = {
    __typename?: 'move_resources_stddev_samp_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** Streaming cursor of the table "move_resources" */
type Move_Resources_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Move_Resources_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Move_Resources_Stream_Cursor_Value_Input = {
    address?: InputMaybe<Scalars['String']['input']>;
    transaction_version?: InputMaybe<Scalars['bigint']['input']>;
};
/** aggregate sum on columns */
type Move_Resources_Sum_Fields = {
    __typename?: 'move_resources_sum_fields';
    transaction_version?: Maybe<Scalars['bigint']['output']>;
};
/** aggregate var_pop on columns */
type Move_Resources_Var_Pop_Fields = {
    __typename?: 'move_resources_var_pop_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate var_samp on columns */
type Move_Resources_Var_Samp_Fields = {
    __typename?: 'move_resources_var_samp_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate variance on columns */
type Move_Resources_Variance_Fields = {
    __typename?: 'move_resources_variance_fields';
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** columns and relationships of "nft_marketplace_v2.current_nft_marketplace_auctions" */
type Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions = {
    __typename?: 'nft_marketplace_v2_current_nft_marketplace_auctions';
    buy_it_now_price?: Maybe<Scalars['numeric']['output']>;
    coin_type?: Maybe<Scalars['String']['output']>;
    collection_id: Scalars['String']['output'];
    contract_address: Scalars['String']['output'];
    current_bid_price?: Maybe<Scalars['numeric']['output']>;
    current_bidder?: Maybe<Scalars['String']['output']>;
    /** An object relationship */
    current_token_data?: Maybe<Current_Token_Datas_V2>;
    entry_function_id_str: Scalars['String']['output'];
    expiration_time: Scalars['numeric']['output'];
    fee_schedule_id: Scalars['String']['output'];
    is_deleted: Scalars['Boolean']['output'];
    last_transaction_timestamp: Scalars['timestamptz']['output'];
    last_transaction_version: Scalars['bigint']['output'];
    listing_id: Scalars['String']['output'];
    marketplace: Scalars['String']['output'];
    seller: Scalars['String']['output'];
    starting_bid_price: Scalars['numeric']['output'];
    token_amount: Scalars['numeric']['output'];
    token_data_id: Scalars['String']['output'];
    token_standard: Scalars['String']['output'];
};
/** Boolean expression to filter rows from the table "nft_marketplace_v2.current_nft_marketplace_auctions". All fields are combined with a logical 'AND'. */
type Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Bool_Exp = {
    _and?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Bool_Exp>>;
    _not?: InputMaybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Bool_Exp>;
    _or?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Bool_Exp>>;
    buy_it_now_price?: InputMaybe<Numeric_Comparison_Exp>;
    coin_type?: InputMaybe<String_Comparison_Exp>;
    collection_id?: InputMaybe<String_Comparison_Exp>;
    contract_address?: InputMaybe<String_Comparison_Exp>;
    current_bid_price?: InputMaybe<Numeric_Comparison_Exp>;
    current_bidder?: InputMaybe<String_Comparison_Exp>;
    current_token_data?: InputMaybe<Current_Token_Datas_V2_Bool_Exp>;
    entry_function_id_str?: InputMaybe<String_Comparison_Exp>;
    expiration_time?: InputMaybe<Numeric_Comparison_Exp>;
    fee_schedule_id?: InputMaybe<String_Comparison_Exp>;
    is_deleted?: InputMaybe<Boolean_Comparison_Exp>;
    last_transaction_timestamp?: InputMaybe<Timestamptz_Comparison_Exp>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    listing_id?: InputMaybe<String_Comparison_Exp>;
    marketplace?: InputMaybe<String_Comparison_Exp>;
    seller?: InputMaybe<String_Comparison_Exp>;
    starting_bid_price?: InputMaybe<Numeric_Comparison_Exp>;
    token_amount?: InputMaybe<Numeric_Comparison_Exp>;
    token_data_id?: InputMaybe<String_Comparison_Exp>;
    token_standard?: InputMaybe<String_Comparison_Exp>;
};
/** Ordering options when selecting data from "nft_marketplace_v2.current_nft_marketplace_auctions". */
type Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Order_By = {
    buy_it_now_price?: InputMaybe<Order_By>;
    coin_type?: InputMaybe<Order_By>;
    collection_id?: InputMaybe<Order_By>;
    contract_address?: InputMaybe<Order_By>;
    current_bid_price?: InputMaybe<Order_By>;
    current_bidder?: InputMaybe<Order_By>;
    current_token_data?: InputMaybe<Current_Token_Datas_V2_Order_By>;
    entry_function_id_str?: InputMaybe<Order_By>;
    expiration_time?: InputMaybe<Order_By>;
    fee_schedule_id?: InputMaybe<Order_By>;
    is_deleted?: InputMaybe<Order_By>;
    last_transaction_timestamp?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    listing_id?: InputMaybe<Order_By>;
    marketplace?: InputMaybe<Order_By>;
    seller?: InputMaybe<Order_By>;
    starting_bid_price?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    token_data_id?: InputMaybe<Order_By>;
    token_standard?: InputMaybe<Order_By>;
};
/** select columns of table "nft_marketplace_v2.current_nft_marketplace_auctions" */
declare enum Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column {
    /** column name */
    BuyItNowPrice = "buy_it_now_price",
    /** column name */
    CoinType = "coin_type",
    /** column name */
    CollectionId = "collection_id",
    /** column name */
    ContractAddress = "contract_address",
    /** column name */
    CurrentBidPrice = "current_bid_price",
    /** column name */
    CurrentBidder = "current_bidder",
    /** column name */
    EntryFunctionIdStr = "entry_function_id_str",
    /** column name */
    ExpirationTime = "expiration_time",
    /** column name */
    FeeScheduleId = "fee_schedule_id",
    /** column name */
    IsDeleted = "is_deleted",
    /** column name */
    LastTransactionTimestamp = "last_transaction_timestamp",
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    ListingId = "listing_id",
    /** column name */
    Marketplace = "marketplace",
    /** column name */
    Seller = "seller",
    /** column name */
    StartingBidPrice = "starting_bid_price",
    /** column name */
    TokenAmount = "token_amount",
    /** column name */
    TokenDataId = "token_data_id",
    /** column name */
    TokenStandard = "token_standard"
}
/** Streaming cursor of the table "nft_marketplace_v2_current_nft_marketplace_auctions" */
type Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Stream_Cursor_Value_Input = {
    buy_it_now_price?: InputMaybe<Scalars['numeric']['input']>;
    coin_type?: InputMaybe<Scalars['String']['input']>;
    collection_id?: InputMaybe<Scalars['String']['input']>;
    contract_address?: InputMaybe<Scalars['String']['input']>;
    current_bid_price?: InputMaybe<Scalars['numeric']['input']>;
    current_bidder?: InputMaybe<Scalars['String']['input']>;
    entry_function_id_str?: InputMaybe<Scalars['String']['input']>;
    expiration_time?: InputMaybe<Scalars['numeric']['input']>;
    fee_schedule_id?: InputMaybe<Scalars['String']['input']>;
    is_deleted?: InputMaybe<Scalars['Boolean']['input']>;
    last_transaction_timestamp?: InputMaybe<Scalars['timestamptz']['input']>;
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    listing_id?: InputMaybe<Scalars['String']['input']>;
    marketplace?: InputMaybe<Scalars['String']['input']>;
    seller?: InputMaybe<Scalars['String']['input']>;
    starting_bid_price?: InputMaybe<Scalars['numeric']['input']>;
    token_amount?: InputMaybe<Scalars['numeric']['input']>;
    token_data_id?: InputMaybe<Scalars['String']['input']>;
    token_standard?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "nft_marketplace_v2.current_nft_marketplace_collection_offers" */
type Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers = {
    __typename?: 'nft_marketplace_v2_current_nft_marketplace_collection_offers';
    buyer: Scalars['String']['output'];
    coin_type?: Maybe<Scalars['String']['output']>;
    collection_id: Scalars['String']['output'];
    collection_offer_id: Scalars['String']['output'];
    contract_address: Scalars['String']['output'];
    /** An object relationship */
    current_collection_v2?: Maybe<Current_Collections_V2>;
    entry_function_id_str: Scalars['String']['output'];
    expiration_time: Scalars['numeric']['output'];
    fee_schedule_id: Scalars['String']['output'];
    is_deleted: Scalars['Boolean']['output'];
    item_price: Scalars['numeric']['output'];
    last_transaction_timestamp: Scalars['timestamptz']['output'];
    last_transaction_version: Scalars['bigint']['output'];
    marketplace: Scalars['String']['output'];
    remaining_token_amount: Scalars['numeric']['output'];
    token_standard: Scalars['String']['output'];
};
/** Boolean expression to filter rows from the table "nft_marketplace_v2.current_nft_marketplace_collection_offers". All fields are combined with a logical 'AND'. */
type Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Bool_Exp = {
    _and?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Bool_Exp>>;
    _not?: InputMaybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Bool_Exp>;
    _or?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Bool_Exp>>;
    buyer?: InputMaybe<String_Comparison_Exp>;
    coin_type?: InputMaybe<String_Comparison_Exp>;
    collection_id?: InputMaybe<String_Comparison_Exp>;
    collection_offer_id?: InputMaybe<String_Comparison_Exp>;
    contract_address?: InputMaybe<String_Comparison_Exp>;
    current_collection_v2?: InputMaybe<Current_Collections_V2_Bool_Exp>;
    entry_function_id_str?: InputMaybe<String_Comparison_Exp>;
    expiration_time?: InputMaybe<Numeric_Comparison_Exp>;
    fee_schedule_id?: InputMaybe<String_Comparison_Exp>;
    is_deleted?: InputMaybe<Boolean_Comparison_Exp>;
    item_price?: InputMaybe<Numeric_Comparison_Exp>;
    last_transaction_timestamp?: InputMaybe<Timestamptz_Comparison_Exp>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    marketplace?: InputMaybe<String_Comparison_Exp>;
    remaining_token_amount?: InputMaybe<Numeric_Comparison_Exp>;
    token_standard?: InputMaybe<String_Comparison_Exp>;
};
/** Ordering options when selecting data from "nft_marketplace_v2.current_nft_marketplace_collection_offers". */
type Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Order_By = {
    buyer?: InputMaybe<Order_By>;
    coin_type?: InputMaybe<Order_By>;
    collection_id?: InputMaybe<Order_By>;
    collection_offer_id?: InputMaybe<Order_By>;
    contract_address?: InputMaybe<Order_By>;
    current_collection_v2?: InputMaybe<Current_Collections_V2_Order_By>;
    entry_function_id_str?: InputMaybe<Order_By>;
    expiration_time?: InputMaybe<Order_By>;
    fee_schedule_id?: InputMaybe<Order_By>;
    is_deleted?: InputMaybe<Order_By>;
    item_price?: InputMaybe<Order_By>;
    last_transaction_timestamp?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    marketplace?: InputMaybe<Order_By>;
    remaining_token_amount?: InputMaybe<Order_By>;
    token_standard?: InputMaybe<Order_By>;
};
/** select columns of table "nft_marketplace_v2.current_nft_marketplace_collection_offers" */
declare enum Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column {
    /** column name */
    Buyer = "buyer",
    /** column name */
    CoinType = "coin_type",
    /** column name */
    CollectionId = "collection_id",
    /** column name */
    CollectionOfferId = "collection_offer_id",
    /** column name */
    ContractAddress = "contract_address",
    /** column name */
    EntryFunctionIdStr = "entry_function_id_str",
    /** column name */
    ExpirationTime = "expiration_time",
    /** column name */
    FeeScheduleId = "fee_schedule_id",
    /** column name */
    IsDeleted = "is_deleted",
    /** column name */
    ItemPrice = "item_price",
    /** column name */
    LastTransactionTimestamp = "last_transaction_timestamp",
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    Marketplace = "marketplace",
    /** column name */
    RemainingTokenAmount = "remaining_token_amount",
    /** column name */
    TokenStandard = "token_standard"
}
/** Streaming cursor of the table "nft_marketplace_v2_current_nft_marketplace_collection_offers" */
type Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Stream_Cursor_Value_Input = {
    buyer?: InputMaybe<Scalars['String']['input']>;
    coin_type?: InputMaybe<Scalars['String']['input']>;
    collection_id?: InputMaybe<Scalars['String']['input']>;
    collection_offer_id?: InputMaybe<Scalars['String']['input']>;
    contract_address?: InputMaybe<Scalars['String']['input']>;
    entry_function_id_str?: InputMaybe<Scalars['String']['input']>;
    expiration_time?: InputMaybe<Scalars['numeric']['input']>;
    fee_schedule_id?: InputMaybe<Scalars['String']['input']>;
    is_deleted?: InputMaybe<Scalars['Boolean']['input']>;
    item_price?: InputMaybe<Scalars['numeric']['input']>;
    last_transaction_timestamp?: InputMaybe<Scalars['timestamptz']['input']>;
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    marketplace?: InputMaybe<Scalars['String']['input']>;
    remaining_token_amount?: InputMaybe<Scalars['numeric']['input']>;
    token_standard?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "nft_marketplace_v2.current_nft_marketplace_listings" */
type Nft_Marketplace_V2_Current_Nft_Marketplace_Listings = {
    __typename?: 'nft_marketplace_v2_current_nft_marketplace_listings';
    coin_type?: Maybe<Scalars['String']['output']>;
    collection_id: Scalars['String']['output'];
    contract_address: Scalars['String']['output'];
    /** An object relationship */
    current_token_data?: Maybe<Current_Token_Datas_V2>;
    entry_function_id_str: Scalars['String']['output'];
    fee_schedule_id: Scalars['String']['output'];
    is_deleted: Scalars['Boolean']['output'];
    last_transaction_timestamp: Scalars['timestamptz']['output'];
    last_transaction_version: Scalars['bigint']['output'];
    listing_id: Scalars['String']['output'];
    marketplace: Scalars['String']['output'];
    price: Scalars['numeric']['output'];
    seller: Scalars['String']['output'];
    token_amount: Scalars['numeric']['output'];
    token_data_id: Scalars['String']['output'];
    token_standard: Scalars['String']['output'];
};
/** Boolean expression to filter rows from the table "nft_marketplace_v2.current_nft_marketplace_listings". All fields are combined with a logical 'AND'. */
type Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Bool_Exp = {
    _and?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Bool_Exp>>;
    _not?: InputMaybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Bool_Exp>;
    _or?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Bool_Exp>>;
    coin_type?: InputMaybe<String_Comparison_Exp>;
    collection_id?: InputMaybe<String_Comparison_Exp>;
    contract_address?: InputMaybe<String_Comparison_Exp>;
    current_token_data?: InputMaybe<Current_Token_Datas_V2_Bool_Exp>;
    entry_function_id_str?: InputMaybe<String_Comparison_Exp>;
    fee_schedule_id?: InputMaybe<String_Comparison_Exp>;
    is_deleted?: InputMaybe<Boolean_Comparison_Exp>;
    last_transaction_timestamp?: InputMaybe<Timestamptz_Comparison_Exp>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    listing_id?: InputMaybe<String_Comparison_Exp>;
    marketplace?: InputMaybe<String_Comparison_Exp>;
    price?: InputMaybe<Numeric_Comparison_Exp>;
    seller?: InputMaybe<String_Comparison_Exp>;
    token_amount?: InputMaybe<Numeric_Comparison_Exp>;
    token_data_id?: InputMaybe<String_Comparison_Exp>;
    token_standard?: InputMaybe<String_Comparison_Exp>;
};
/** Ordering options when selecting data from "nft_marketplace_v2.current_nft_marketplace_listings". */
type Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Order_By = {
    coin_type?: InputMaybe<Order_By>;
    collection_id?: InputMaybe<Order_By>;
    contract_address?: InputMaybe<Order_By>;
    current_token_data?: InputMaybe<Current_Token_Datas_V2_Order_By>;
    entry_function_id_str?: InputMaybe<Order_By>;
    fee_schedule_id?: InputMaybe<Order_By>;
    is_deleted?: InputMaybe<Order_By>;
    last_transaction_timestamp?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    listing_id?: InputMaybe<Order_By>;
    marketplace?: InputMaybe<Order_By>;
    price?: InputMaybe<Order_By>;
    seller?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    token_data_id?: InputMaybe<Order_By>;
    token_standard?: InputMaybe<Order_By>;
};
/** select columns of table "nft_marketplace_v2.current_nft_marketplace_listings" */
declare enum Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column {
    /** column name */
    CoinType = "coin_type",
    /** column name */
    CollectionId = "collection_id",
    /** column name */
    ContractAddress = "contract_address",
    /** column name */
    EntryFunctionIdStr = "entry_function_id_str",
    /** column name */
    FeeScheduleId = "fee_schedule_id",
    /** column name */
    IsDeleted = "is_deleted",
    /** column name */
    LastTransactionTimestamp = "last_transaction_timestamp",
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    ListingId = "listing_id",
    /** column name */
    Marketplace = "marketplace",
    /** column name */
    Price = "price",
    /** column name */
    Seller = "seller",
    /** column name */
    TokenAmount = "token_amount",
    /** column name */
    TokenDataId = "token_data_id",
    /** column name */
    TokenStandard = "token_standard"
}
/** Streaming cursor of the table "nft_marketplace_v2_current_nft_marketplace_listings" */
type Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Stream_Cursor_Value_Input = {
    coin_type?: InputMaybe<Scalars['String']['input']>;
    collection_id?: InputMaybe<Scalars['String']['input']>;
    contract_address?: InputMaybe<Scalars['String']['input']>;
    entry_function_id_str?: InputMaybe<Scalars['String']['input']>;
    fee_schedule_id?: InputMaybe<Scalars['String']['input']>;
    is_deleted?: InputMaybe<Scalars['Boolean']['input']>;
    last_transaction_timestamp?: InputMaybe<Scalars['timestamptz']['input']>;
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    listing_id?: InputMaybe<Scalars['String']['input']>;
    marketplace?: InputMaybe<Scalars['String']['input']>;
    price?: InputMaybe<Scalars['numeric']['input']>;
    seller?: InputMaybe<Scalars['String']['input']>;
    token_amount?: InputMaybe<Scalars['numeric']['input']>;
    token_data_id?: InputMaybe<Scalars['String']['input']>;
    token_standard?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "nft_marketplace_v2.current_nft_marketplace_token_offers" */
type Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers = {
    __typename?: 'nft_marketplace_v2_current_nft_marketplace_token_offers';
    buyer: Scalars['String']['output'];
    coin_type?: Maybe<Scalars['String']['output']>;
    collection_id: Scalars['String']['output'];
    contract_address: Scalars['String']['output'];
    /** An object relationship */
    current_token_data?: Maybe<Current_Token_Datas_V2>;
    entry_function_id_str: Scalars['String']['output'];
    expiration_time: Scalars['numeric']['output'];
    fee_schedule_id: Scalars['String']['output'];
    is_deleted: Scalars['Boolean']['output'];
    last_transaction_timestamp: Scalars['timestamptz']['output'];
    last_transaction_version: Scalars['bigint']['output'];
    marketplace: Scalars['String']['output'];
    offer_id: Scalars['String']['output'];
    price: Scalars['numeric']['output'];
    token_amount: Scalars['numeric']['output'];
    token_data_id: Scalars['String']['output'];
    token_standard: Scalars['String']['output'];
};
/** Boolean expression to filter rows from the table "nft_marketplace_v2.current_nft_marketplace_token_offers". All fields are combined with a logical 'AND'. */
type Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Bool_Exp = {
    _and?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Bool_Exp>>;
    _not?: InputMaybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Bool_Exp>;
    _or?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Bool_Exp>>;
    buyer?: InputMaybe<String_Comparison_Exp>;
    coin_type?: InputMaybe<String_Comparison_Exp>;
    collection_id?: InputMaybe<String_Comparison_Exp>;
    contract_address?: InputMaybe<String_Comparison_Exp>;
    current_token_data?: InputMaybe<Current_Token_Datas_V2_Bool_Exp>;
    entry_function_id_str?: InputMaybe<String_Comparison_Exp>;
    expiration_time?: InputMaybe<Numeric_Comparison_Exp>;
    fee_schedule_id?: InputMaybe<String_Comparison_Exp>;
    is_deleted?: InputMaybe<Boolean_Comparison_Exp>;
    last_transaction_timestamp?: InputMaybe<Timestamptz_Comparison_Exp>;
    last_transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    marketplace?: InputMaybe<String_Comparison_Exp>;
    offer_id?: InputMaybe<String_Comparison_Exp>;
    price?: InputMaybe<Numeric_Comparison_Exp>;
    token_amount?: InputMaybe<Numeric_Comparison_Exp>;
    token_data_id?: InputMaybe<String_Comparison_Exp>;
    token_standard?: InputMaybe<String_Comparison_Exp>;
};
/** Ordering options when selecting data from "nft_marketplace_v2.current_nft_marketplace_token_offers". */
type Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Order_By = {
    buyer?: InputMaybe<Order_By>;
    coin_type?: InputMaybe<Order_By>;
    collection_id?: InputMaybe<Order_By>;
    contract_address?: InputMaybe<Order_By>;
    current_token_data?: InputMaybe<Current_Token_Datas_V2_Order_By>;
    entry_function_id_str?: InputMaybe<Order_By>;
    expiration_time?: InputMaybe<Order_By>;
    fee_schedule_id?: InputMaybe<Order_By>;
    is_deleted?: InputMaybe<Order_By>;
    last_transaction_timestamp?: InputMaybe<Order_By>;
    last_transaction_version?: InputMaybe<Order_By>;
    marketplace?: InputMaybe<Order_By>;
    offer_id?: InputMaybe<Order_By>;
    price?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    token_data_id?: InputMaybe<Order_By>;
    token_standard?: InputMaybe<Order_By>;
};
/** select columns of table "nft_marketplace_v2.current_nft_marketplace_token_offers" */
declare enum Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column {
    /** column name */
    Buyer = "buyer",
    /** column name */
    CoinType = "coin_type",
    /** column name */
    CollectionId = "collection_id",
    /** column name */
    ContractAddress = "contract_address",
    /** column name */
    EntryFunctionIdStr = "entry_function_id_str",
    /** column name */
    ExpirationTime = "expiration_time",
    /** column name */
    FeeScheduleId = "fee_schedule_id",
    /** column name */
    IsDeleted = "is_deleted",
    /** column name */
    LastTransactionTimestamp = "last_transaction_timestamp",
    /** column name */
    LastTransactionVersion = "last_transaction_version",
    /** column name */
    Marketplace = "marketplace",
    /** column name */
    OfferId = "offer_id",
    /** column name */
    Price = "price",
    /** column name */
    TokenAmount = "token_amount",
    /** column name */
    TokenDataId = "token_data_id",
    /** column name */
    TokenStandard = "token_standard"
}
/** Streaming cursor of the table "nft_marketplace_v2_current_nft_marketplace_token_offers" */
type Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Stream_Cursor_Value_Input = {
    buyer?: InputMaybe<Scalars['String']['input']>;
    coin_type?: InputMaybe<Scalars['String']['input']>;
    collection_id?: InputMaybe<Scalars['String']['input']>;
    contract_address?: InputMaybe<Scalars['String']['input']>;
    entry_function_id_str?: InputMaybe<Scalars['String']['input']>;
    expiration_time?: InputMaybe<Scalars['numeric']['input']>;
    fee_schedule_id?: InputMaybe<Scalars['String']['input']>;
    is_deleted?: InputMaybe<Scalars['Boolean']['input']>;
    last_transaction_timestamp?: InputMaybe<Scalars['timestamptz']['input']>;
    last_transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    marketplace?: InputMaybe<Scalars['String']['input']>;
    offer_id?: InputMaybe<Scalars['String']['input']>;
    price?: InputMaybe<Scalars['numeric']['input']>;
    token_amount?: InputMaybe<Scalars['numeric']['input']>;
    token_data_id?: InputMaybe<Scalars['String']['input']>;
    token_standard?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "nft_marketplace_v2.nft_marketplace_activities" */
type Nft_Marketplace_V2_Nft_Marketplace_Activities = {
    __typename?: 'nft_marketplace_v2_nft_marketplace_activities';
    buyer?: Maybe<Scalars['String']['output']>;
    coin_type?: Maybe<Scalars['String']['output']>;
    collection_id: Scalars['String']['output'];
    collection_name: Scalars['String']['output'];
    contract_address: Scalars['String']['output'];
    creator_address: Scalars['String']['output'];
    /** An object relationship */
    current_token_data?: Maybe<Current_Token_Datas_V2>;
    entry_function_id_str: Scalars['String']['output'];
    event_index: Scalars['bigint']['output'];
    event_type: Scalars['String']['output'];
    fee_schedule_id: Scalars['String']['output'];
    marketplace: Scalars['String']['output'];
    offer_or_listing_id: Scalars['String']['output'];
    price: Scalars['numeric']['output'];
    property_version?: Maybe<Scalars['String']['output']>;
    seller?: Maybe<Scalars['String']['output']>;
    token_amount: Scalars['numeric']['output'];
    token_data_id?: Maybe<Scalars['String']['output']>;
    token_name?: Maybe<Scalars['String']['output']>;
    token_standard: Scalars['String']['output'];
    transaction_timestamp: Scalars['timestamptz']['output'];
    transaction_version: Scalars['bigint']['output'];
};
/** Boolean expression to filter rows from the table "nft_marketplace_v2.nft_marketplace_activities". All fields are combined with a logical 'AND'. */
type Nft_Marketplace_V2_Nft_Marketplace_Activities_Bool_Exp = {
    _and?: InputMaybe<Array<Nft_Marketplace_V2_Nft_Marketplace_Activities_Bool_Exp>>;
    _not?: InputMaybe<Nft_Marketplace_V2_Nft_Marketplace_Activities_Bool_Exp>;
    _or?: InputMaybe<Array<Nft_Marketplace_V2_Nft_Marketplace_Activities_Bool_Exp>>;
    buyer?: InputMaybe<String_Comparison_Exp>;
    coin_type?: InputMaybe<String_Comparison_Exp>;
    collection_id?: InputMaybe<String_Comparison_Exp>;
    collection_name?: InputMaybe<String_Comparison_Exp>;
    contract_address?: InputMaybe<String_Comparison_Exp>;
    creator_address?: InputMaybe<String_Comparison_Exp>;
    current_token_data?: InputMaybe<Current_Token_Datas_V2_Bool_Exp>;
    entry_function_id_str?: InputMaybe<String_Comparison_Exp>;
    event_index?: InputMaybe<Bigint_Comparison_Exp>;
    event_type?: InputMaybe<String_Comparison_Exp>;
    fee_schedule_id?: InputMaybe<String_Comparison_Exp>;
    marketplace?: InputMaybe<String_Comparison_Exp>;
    offer_or_listing_id?: InputMaybe<String_Comparison_Exp>;
    price?: InputMaybe<Numeric_Comparison_Exp>;
    property_version?: InputMaybe<String_Comparison_Exp>;
    seller?: InputMaybe<String_Comparison_Exp>;
    token_amount?: InputMaybe<Numeric_Comparison_Exp>;
    token_data_id?: InputMaybe<String_Comparison_Exp>;
    token_name?: InputMaybe<String_Comparison_Exp>;
    token_standard?: InputMaybe<String_Comparison_Exp>;
    transaction_timestamp?: InputMaybe<Timestamptz_Comparison_Exp>;
    transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
};
/** Ordering options when selecting data from "nft_marketplace_v2.nft_marketplace_activities". */
type Nft_Marketplace_V2_Nft_Marketplace_Activities_Order_By = {
    buyer?: InputMaybe<Order_By>;
    coin_type?: InputMaybe<Order_By>;
    collection_id?: InputMaybe<Order_By>;
    collection_name?: InputMaybe<Order_By>;
    contract_address?: InputMaybe<Order_By>;
    creator_address?: InputMaybe<Order_By>;
    current_token_data?: InputMaybe<Current_Token_Datas_V2_Order_By>;
    entry_function_id_str?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_type?: InputMaybe<Order_By>;
    fee_schedule_id?: InputMaybe<Order_By>;
    marketplace?: InputMaybe<Order_By>;
    offer_or_listing_id?: InputMaybe<Order_By>;
    price?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
    seller?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    token_data_id?: InputMaybe<Order_By>;
    token_name?: InputMaybe<Order_By>;
    token_standard?: InputMaybe<Order_By>;
    transaction_timestamp?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** select columns of table "nft_marketplace_v2.nft_marketplace_activities" */
declare enum Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column {
    /** column name */
    Buyer = "buyer",
    /** column name */
    CoinType = "coin_type",
    /** column name */
    CollectionId = "collection_id",
    /** column name */
    CollectionName = "collection_name",
    /** column name */
    ContractAddress = "contract_address",
    /** column name */
    CreatorAddress = "creator_address",
    /** column name */
    EntryFunctionIdStr = "entry_function_id_str",
    /** column name */
    EventIndex = "event_index",
    /** column name */
    EventType = "event_type",
    /** column name */
    FeeScheduleId = "fee_schedule_id",
    /** column name */
    Marketplace = "marketplace",
    /** column name */
    OfferOrListingId = "offer_or_listing_id",
    /** column name */
    Price = "price",
    /** column name */
    PropertyVersion = "property_version",
    /** column name */
    Seller = "seller",
    /** column name */
    TokenAmount = "token_amount",
    /** column name */
    TokenDataId = "token_data_id",
    /** column name */
    TokenName = "token_name",
    /** column name */
    TokenStandard = "token_standard",
    /** column name */
    TransactionTimestamp = "transaction_timestamp",
    /** column name */
    TransactionVersion = "transaction_version"
}
/** Streaming cursor of the table "nft_marketplace_v2_nft_marketplace_activities" */
type Nft_Marketplace_V2_Nft_Marketplace_Activities_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Nft_Marketplace_V2_Nft_Marketplace_Activities_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Nft_Marketplace_V2_Nft_Marketplace_Activities_Stream_Cursor_Value_Input = {
    buyer?: InputMaybe<Scalars['String']['input']>;
    coin_type?: InputMaybe<Scalars['String']['input']>;
    collection_id?: InputMaybe<Scalars['String']['input']>;
    collection_name?: InputMaybe<Scalars['String']['input']>;
    contract_address?: InputMaybe<Scalars['String']['input']>;
    creator_address?: InputMaybe<Scalars['String']['input']>;
    entry_function_id_str?: InputMaybe<Scalars['String']['input']>;
    event_index?: InputMaybe<Scalars['bigint']['input']>;
    event_type?: InputMaybe<Scalars['String']['input']>;
    fee_schedule_id?: InputMaybe<Scalars['String']['input']>;
    marketplace?: InputMaybe<Scalars['String']['input']>;
    offer_or_listing_id?: InputMaybe<Scalars['String']['input']>;
    price?: InputMaybe<Scalars['numeric']['input']>;
    property_version?: InputMaybe<Scalars['String']['input']>;
    seller?: InputMaybe<Scalars['String']['input']>;
    token_amount?: InputMaybe<Scalars['numeric']['input']>;
    token_data_id?: InputMaybe<Scalars['String']['input']>;
    token_name?: InputMaybe<Scalars['String']['input']>;
    token_standard?: InputMaybe<Scalars['String']['input']>;
    transaction_timestamp?: InputMaybe<Scalars['timestamptz']['input']>;
    transaction_version?: InputMaybe<Scalars['bigint']['input']>;
};
/** columns and relationships of "nft_metadata_crawler.parsed_asset_uris" */
type Nft_Metadata_Crawler_Parsed_Asset_Uris = {
    __typename?: 'nft_metadata_crawler_parsed_asset_uris';
    animation_optimizer_retry_count: Scalars['Int']['output'];
    asset_uri: Scalars['String']['output'];
    cdn_animation_uri?: Maybe<Scalars['String']['output']>;
    cdn_image_uri?: Maybe<Scalars['String']['output']>;
    cdn_json_uri?: Maybe<Scalars['String']['output']>;
    image_optimizer_retry_count: Scalars['Int']['output'];
    json_parser_retry_count: Scalars['Int']['output'];
    raw_animation_uri?: Maybe<Scalars['String']['output']>;
    raw_image_uri?: Maybe<Scalars['String']['output']>;
};
/** Boolean expression to filter rows from the table "nft_metadata_crawler.parsed_asset_uris". All fields are combined with a logical 'AND'. */
type Nft_Metadata_Crawler_Parsed_Asset_Uris_Bool_Exp = {
    _and?: InputMaybe<Array<Nft_Metadata_Crawler_Parsed_Asset_Uris_Bool_Exp>>;
    _not?: InputMaybe<Nft_Metadata_Crawler_Parsed_Asset_Uris_Bool_Exp>;
    _or?: InputMaybe<Array<Nft_Metadata_Crawler_Parsed_Asset_Uris_Bool_Exp>>;
    animation_optimizer_retry_count?: InputMaybe<Int_Comparison_Exp>;
    asset_uri?: InputMaybe<String_Comparison_Exp>;
    cdn_animation_uri?: InputMaybe<String_Comparison_Exp>;
    cdn_image_uri?: InputMaybe<String_Comparison_Exp>;
    cdn_json_uri?: InputMaybe<String_Comparison_Exp>;
    image_optimizer_retry_count?: InputMaybe<Int_Comparison_Exp>;
    json_parser_retry_count?: InputMaybe<Int_Comparison_Exp>;
    raw_animation_uri?: InputMaybe<String_Comparison_Exp>;
    raw_image_uri?: InputMaybe<String_Comparison_Exp>;
};
/** Ordering options when selecting data from "nft_metadata_crawler.parsed_asset_uris". */
type Nft_Metadata_Crawler_Parsed_Asset_Uris_Order_By = {
    animation_optimizer_retry_count?: InputMaybe<Order_By>;
    asset_uri?: InputMaybe<Order_By>;
    cdn_animation_uri?: InputMaybe<Order_By>;
    cdn_image_uri?: InputMaybe<Order_By>;
    cdn_json_uri?: InputMaybe<Order_By>;
    image_optimizer_retry_count?: InputMaybe<Order_By>;
    json_parser_retry_count?: InputMaybe<Order_By>;
    raw_animation_uri?: InputMaybe<Order_By>;
    raw_image_uri?: InputMaybe<Order_By>;
};
/** select columns of table "nft_metadata_crawler.parsed_asset_uris" */
declare enum Nft_Metadata_Crawler_Parsed_Asset_Uris_Select_Column {
    /** column name */
    AnimationOptimizerRetryCount = "animation_optimizer_retry_count",
    /** column name */
    AssetUri = "asset_uri",
    /** column name */
    CdnAnimationUri = "cdn_animation_uri",
    /** column name */
    CdnImageUri = "cdn_image_uri",
    /** column name */
    CdnJsonUri = "cdn_json_uri",
    /** column name */
    ImageOptimizerRetryCount = "image_optimizer_retry_count",
    /** column name */
    JsonParserRetryCount = "json_parser_retry_count",
    /** column name */
    RawAnimationUri = "raw_animation_uri",
    /** column name */
    RawImageUri = "raw_image_uri"
}
/** Streaming cursor of the table "nft_metadata_crawler_parsed_asset_uris" */
type Nft_Metadata_Crawler_Parsed_Asset_Uris_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Nft_Metadata_Crawler_Parsed_Asset_Uris_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Nft_Metadata_Crawler_Parsed_Asset_Uris_Stream_Cursor_Value_Input = {
    animation_optimizer_retry_count?: InputMaybe<Scalars['Int']['input']>;
    asset_uri?: InputMaybe<Scalars['String']['input']>;
    cdn_animation_uri?: InputMaybe<Scalars['String']['input']>;
    cdn_image_uri?: InputMaybe<Scalars['String']['input']>;
    cdn_json_uri?: InputMaybe<Scalars['String']['input']>;
    image_optimizer_retry_count?: InputMaybe<Scalars['Int']['input']>;
    json_parser_retry_count?: InputMaybe<Scalars['Int']['input']>;
    raw_animation_uri?: InputMaybe<Scalars['String']['input']>;
    raw_image_uri?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "num_active_delegator_per_pool" */
type Num_Active_Delegator_Per_Pool = {
    __typename?: 'num_active_delegator_per_pool';
    num_active_delegator?: Maybe<Scalars['bigint']['output']>;
    pool_address?: Maybe<Scalars['String']['output']>;
};
/** Boolean expression to filter rows from the table "num_active_delegator_per_pool". All fields are combined with a logical 'AND'. */
type Num_Active_Delegator_Per_Pool_Bool_Exp = {
    _and?: InputMaybe<Array<Num_Active_Delegator_Per_Pool_Bool_Exp>>;
    _not?: InputMaybe<Num_Active_Delegator_Per_Pool_Bool_Exp>;
    _or?: InputMaybe<Array<Num_Active_Delegator_Per_Pool_Bool_Exp>>;
    num_active_delegator?: InputMaybe<Bigint_Comparison_Exp>;
    pool_address?: InputMaybe<String_Comparison_Exp>;
};
/** Ordering options when selecting data from "num_active_delegator_per_pool". */
type Num_Active_Delegator_Per_Pool_Order_By = {
    num_active_delegator?: InputMaybe<Order_By>;
    pool_address?: InputMaybe<Order_By>;
};
/** select columns of table "num_active_delegator_per_pool" */
declare enum Num_Active_Delegator_Per_Pool_Select_Column {
    /** column name */
    NumActiveDelegator = "num_active_delegator",
    /** column name */
    PoolAddress = "pool_address"
}
/** Streaming cursor of the table "num_active_delegator_per_pool" */
type Num_Active_Delegator_Per_Pool_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Num_Active_Delegator_Per_Pool_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Num_Active_Delegator_Per_Pool_Stream_Cursor_Value_Input = {
    num_active_delegator?: InputMaybe<Scalars['bigint']['input']>;
    pool_address?: InputMaybe<Scalars['String']['input']>;
};
/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
type Numeric_Comparison_Exp = {
    _eq?: InputMaybe<Scalars['numeric']['input']>;
    _gt?: InputMaybe<Scalars['numeric']['input']>;
    _gte?: InputMaybe<Scalars['numeric']['input']>;
    _in?: InputMaybe<Array<Scalars['numeric']['input']>>;
    _is_null?: InputMaybe<Scalars['Boolean']['input']>;
    _lt?: InputMaybe<Scalars['numeric']['input']>;
    _lte?: InputMaybe<Scalars['numeric']['input']>;
    _neq?: InputMaybe<Scalars['numeric']['input']>;
    _nin?: InputMaybe<Array<Scalars['numeric']['input']>>;
};
/** column ordering options */
declare enum Order_By {
    /** in ascending order, nulls last */
    Asc = "asc",
    /** in ascending order, nulls first */
    AscNullsFirst = "asc_nulls_first",
    /** in ascending order, nulls last */
    AscNullsLast = "asc_nulls_last",
    /** in descending order, nulls first */
    Desc = "desc",
    /** in descending order, nulls first */
    DescNullsFirst = "desc_nulls_first",
    /** in descending order, nulls last */
    DescNullsLast = "desc_nulls_last"
}
/** columns and relationships of "processor_status" */
type Processor_Status = {
    __typename?: 'processor_status';
    last_success_version: Scalars['bigint']['output'];
    last_updated: Scalars['timestamp']['output'];
    processor: Scalars['String']['output'];
};
/** Boolean expression to filter rows from the table "processor_status". All fields are combined with a logical 'AND'. */
type Processor_Status_Bool_Exp = {
    _and?: InputMaybe<Array<Processor_Status_Bool_Exp>>;
    _not?: InputMaybe<Processor_Status_Bool_Exp>;
    _or?: InputMaybe<Array<Processor_Status_Bool_Exp>>;
    last_success_version?: InputMaybe<Bigint_Comparison_Exp>;
    last_updated?: InputMaybe<Timestamp_Comparison_Exp>;
    processor?: InputMaybe<String_Comparison_Exp>;
};
/** Ordering options when selecting data from "processor_status". */
type Processor_Status_Order_By = {
    last_success_version?: InputMaybe<Order_By>;
    last_updated?: InputMaybe<Order_By>;
    processor?: InputMaybe<Order_By>;
};
/** select columns of table "processor_status" */
declare enum Processor_Status_Select_Column {
    /** column name */
    LastSuccessVersion = "last_success_version",
    /** column name */
    LastUpdated = "last_updated",
    /** column name */
    Processor = "processor"
}
/** Streaming cursor of the table "processor_status" */
type Processor_Status_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Processor_Status_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Processor_Status_Stream_Cursor_Value_Input = {
    last_success_version?: InputMaybe<Scalars['bigint']['input']>;
    last_updated?: InputMaybe<Scalars['timestamp']['input']>;
    processor?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "proposal_votes" */
type Proposal_Votes = {
    __typename?: 'proposal_votes';
    num_votes: Scalars['numeric']['output'];
    proposal_id: Scalars['bigint']['output'];
    should_pass: Scalars['Boolean']['output'];
    staking_pool_address: Scalars['String']['output'];
    transaction_timestamp: Scalars['timestamp']['output'];
    transaction_version: Scalars['bigint']['output'];
    voter_address: Scalars['String']['output'];
};
/** aggregated selection of "proposal_votes" */
type Proposal_Votes_Aggregate = {
    __typename?: 'proposal_votes_aggregate';
    aggregate?: Maybe<Proposal_Votes_Aggregate_Fields>;
    nodes: Array<Proposal_Votes>;
};
/** aggregate fields of "proposal_votes" */
type Proposal_Votes_Aggregate_Fields = {
    __typename?: 'proposal_votes_aggregate_fields';
    avg?: Maybe<Proposal_Votes_Avg_Fields>;
    count: Scalars['Int']['output'];
    max?: Maybe<Proposal_Votes_Max_Fields>;
    min?: Maybe<Proposal_Votes_Min_Fields>;
    stddev?: Maybe<Proposal_Votes_Stddev_Fields>;
    stddev_pop?: Maybe<Proposal_Votes_Stddev_Pop_Fields>;
    stddev_samp?: Maybe<Proposal_Votes_Stddev_Samp_Fields>;
    sum?: Maybe<Proposal_Votes_Sum_Fields>;
    var_pop?: Maybe<Proposal_Votes_Var_Pop_Fields>;
    var_samp?: Maybe<Proposal_Votes_Var_Samp_Fields>;
    variance?: Maybe<Proposal_Votes_Variance_Fields>;
};
/** aggregate fields of "proposal_votes" */
type Proposal_Votes_Aggregate_FieldsCountArgs = {
    columns?: InputMaybe<Array<Proposal_Votes_Select_Column>>;
    distinct?: InputMaybe<Scalars['Boolean']['input']>;
};
/** aggregate avg on columns */
type Proposal_Votes_Avg_Fields = {
    __typename?: 'proposal_votes_avg_fields';
    num_votes?: Maybe<Scalars['Float']['output']>;
    proposal_id?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** Boolean expression to filter rows from the table "proposal_votes". All fields are combined with a logical 'AND'. */
type Proposal_Votes_Bool_Exp = {
    _and?: InputMaybe<Array<Proposal_Votes_Bool_Exp>>;
    _not?: InputMaybe<Proposal_Votes_Bool_Exp>;
    _or?: InputMaybe<Array<Proposal_Votes_Bool_Exp>>;
    num_votes?: InputMaybe<Numeric_Comparison_Exp>;
    proposal_id?: InputMaybe<Bigint_Comparison_Exp>;
    should_pass?: InputMaybe<Boolean_Comparison_Exp>;
    staking_pool_address?: InputMaybe<String_Comparison_Exp>;
    transaction_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    voter_address?: InputMaybe<String_Comparison_Exp>;
};
/** aggregate max on columns */
type Proposal_Votes_Max_Fields = {
    __typename?: 'proposal_votes_max_fields';
    num_votes?: Maybe<Scalars['numeric']['output']>;
    proposal_id?: Maybe<Scalars['bigint']['output']>;
    staking_pool_address?: Maybe<Scalars['String']['output']>;
    transaction_timestamp?: Maybe<Scalars['timestamp']['output']>;
    transaction_version?: Maybe<Scalars['bigint']['output']>;
    voter_address?: Maybe<Scalars['String']['output']>;
};
/** aggregate min on columns */
type Proposal_Votes_Min_Fields = {
    __typename?: 'proposal_votes_min_fields';
    num_votes?: Maybe<Scalars['numeric']['output']>;
    proposal_id?: Maybe<Scalars['bigint']['output']>;
    staking_pool_address?: Maybe<Scalars['String']['output']>;
    transaction_timestamp?: Maybe<Scalars['timestamp']['output']>;
    transaction_version?: Maybe<Scalars['bigint']['output']>;
    voter_address?: Maybe<Scalars['String']['output']>;
};
/** Ordering options when selecting data from "proposal_votes". */
type Proposal_Votes_Order_By = {
    num_votes?: InputMaybe<Order_By>;
    proposal_id?: InputMaybe<Order_By>;
    should_pass?: InputMaybe<Order_By>;
    staking_pool_address?: InputMaybe<Order_By>;
    transaction_timestamp?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
    voter_address?: InputMaybe<Order_By>;
};
/** select columns of table "proposal_votes" */
declare enum Proposal_Votes_Select_Column {
    /** column name */
    NumVotes = "num_votes",
    /** column name */
    ProposalId = "proposal_id",
    /** column name */
    ShouldPass = "should_pass",
    /** column name */
    StakingPoolAddress = "staking_pool_address",
    /** column name */
    TransactionTimestamp = "transaction_timestamp",
    /** column name */
    TransactionVersion = "transaction_version",
    /** column name */
    VoterAddress = "voter_address"
}
/** aggregate stddev on columns */
type Proposal_Votes_Stddev_Fields = {
    __typename?: 'proposal_votes_stddev_fields';
    num_votes?: Maybe<Scalars['Float']['output']>;
    proposal_id?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate stddev_pop on columns */
type Proposal_Votes_Stddev_Pop_Fields = {
    __typename?: 'proposal_votes_stddev_pop_fields';
    num_votes?: Maybe<Scalars['Float']['output']>;
    proposal_id?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate stddev_samp on columns */
type Proposal_Votes_Stddev_Samp_Fields = {
    __typename?: 'proposal_votes_stddev_samp_fields';
    num_votes?: Maybe<Scalars['Float']['output']>;
    proposal_id?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** Streaming cursor of the table "proposal_votes" */
type Proposal_Votes_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Proposal_Votes_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Proposal_Votes_Stream_Cursor_Value_Input = {
    num_votes?: InputMaybe<Scalars['numeric']['input']>;
    proposal_id?: InputMaybe<Scalars['bigint']['input']>;
    should_pass?: InputMaybe<Scalars['Boolean']['input']>;
    staking_pool_address?: InputMaybe<Scalars['String']['input']>;
    transaction_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    voter_address?: InputMaybe<Scalars['String']['input']>;
};
/** aggregate sum on columns */
type Proposal_Votes_Sum_Fields = {
    __typename?: 'proposal_votes_sum_fields';
    num_votes?: Maybe<Scalars['numeric']['output']>;
    proposal_id?: Maybe<Scalars['bigint']['output']>;
    transaction_version?: Maybe<Scalars['bigint']['output']>;
};
/** aggregate var_pop on columns */
type Proposal_Votes_Var_Pop_Fields = {
    __typename?: 'proposal_votes_var_pop_fields';
    num_votes?: Maybe<Scalars['Float']['output']>;
    proposal_id?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate var_samp on columns */
type Proposal_Votes_Var_Samp_Fields = {
    __typename?: 'proposal_votes_var_samp_fields';
    num_votes?: Maybe<Scalars['Float']['output']>;
    proposal_id?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** aggregate variance on columns */
type Proposal_Votes_Variance_Fields = {
    __typename?: 'proposal_votes_variance_fields';
    num_votes?: Maybe<Scalars['Float']['output']>;
    proposal_id?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
type Query_Root = {
    __typename?: 'query_root';
    /** fetch data from the table: "account_transactions" */
    account_transactions: Array<Account_Transactions>;
    /** fetch aggregated fields from the table: "account_transactions" */
    account_transactions_aggregate: Account_Transactions_Aggregate;
    /** fetch data from the table: "account_transactions" using primary key columns */
    account_transactions_by_pk?: Maybe<Account_Transactions>;
    /** fetch data from the table: "address_events_summary" */
    address_events_summary: Array<Address_Events_Summary>;
    /** fetch data from the table: "address_version_from_events" */
    address_version_from_events: Array<Address_Version_From_Events>;
    /** fetch aggregated fields from the table: "address_version_from_events" */
    address_version_from_events_aggregate: Address_Version_From_Events_Aggregate;
    /** fetch data from the table: "address_version_from_move_resources" */
    address_version_from_move_resources: Array<Address_Version_From_Move_Resources>;
    /** fetch aggregated fields from the table: "address_version_from_move_resources" */
    address_version_from_move_resources_aggregate: Address_Version_From_Move_Resources_Aggregate;
    /** fetch data from the table: "block_metadata_transactions" */
    block_metadata_transactions: Array<Block_Metadata_Transactions>;
    /** fetch data from the table: "block_metadata_transactions" using primary key columns */
    block_metadata_transactions_by_pk?: Maybe<Block_Metadata_Transactions>;
    /** An array relationship */
    coin_activities: Array<Coin_Activities>;
    /** An aggregate relationship */
    coin_activities_aggregate: Coin_Activities_Aggregate;
    /** fetch data from the table: "coin_activities" using primary key columns */
    coin_activities_by_pk?: Maybe<Coin_Activities>;
    /** fetch data from the table: "coin_balances" */
    coin_balances: Array<Coin_Balances>;
    /** fetch data from the table: "coin_balances" using primary key columns */
    coin_balances_by_pk?: Maybe<Coin_Balances>;
    /** fetch data from the table: "coin_infos" */
    coin_infos: Array<Coin_Infos>;
    /** fetch data from the table: "coin_infos" using primary key columns */
    coin_infos_by_pk?: Maybe<Coin_Infos>;
    /** fetch data from the table: "coin_supply" */
    coin_supply: Array<Coin_Supply>;
    /** fetch data from the table: "coin_supply" using primary key columns */
    coin_supply_by_pk?: Maybe<Coin_Supply>;
    /** fetch data from the table: "collection_datas" */
    collection_datas: Array<Collection_Datas>;
    /** fetch data from the table: "collection_datas" using primary key columns */
    collection_datas_by_pk?: Maybe<Collection_Datas>;
    /** fetch data from the table: "current_ans_lookup" */
    current_ans_lookup: Array<Current_Ans_Lookup>;
    /** fetch data from the table: "current_ans_lookup" using primary key columns */
    current_ans_lookup_by_pk?: Maybe<Current_Ans_Lookup>;
    /** fetch data from the table: "current_ans_lookup_v2" */
    current_ans_lookup_v2: Array<Current_Ans_Lookup_V2>;
    /** fetch data from the table: "current_ans_lookup_v2" using primary key columns */
    current_ans_lookup_v2_by_pk?: Maybe<Current_Ans_Lookup_V2>;
    /** fetch data from the table: "current_aptos_names" */
    current_aptos_names: Array<Current_Aptos_Names>;
    /** fetch aggregated fields from the table: "current_aptos_names" */
    current_aptos_names_aggregate: Current_Aptos_Names_Aggregate;
    /** fetch data from the table: "current_coin_balances" */
    current_coin_balances: Array<Current_Coin_Balances>;
    /** fetch data from the table: "current_coin_balances" using primary key columns */
    current_coin_balances_by_pk?: Maybe<Current_Coin_Balances>;
    /** fetch data from the table: "current_collection_datas" */
    current_collection_datas: Array<Current_Collection_Datas>;
    /** fetch data from the table: "current_collection_datas" using primary key columns */
    current_collection_datas_by_pk?: Maybe<Current_Collection_Datas>;
    /** fetch data from the table: "current_collection_ownership_v2_view" */
    current_collection_ownership_v2_view: Array<Current_Collection_Ownership_V2_View>;
    /** fetch aggregated fields from the table: "current_collection_ownership_v2_view" */
    current_collection_ownership_v2_view_aggregate: Current_Collection_Ownership_V2_View_Aggregate;
    /** fetch data from the table: "current_collections_v2" */
    current_collections_v2: Array<Current_Collections_V2>;
    /** fetch data from the table: "current_collections_v2" using primary key columns */
    current_collections_v2_by_pk?: Maybe<Current_Collections_V2>;
    /** fetch data from the table: "current_delegated_staking_pool_balances" */
    current_delegated_staking_pool_balances: Array<Current_Delegated_Staking_Pool_Balances>;
    /** fetch data from the table: "current_delegated_staking_pool_balances" using primary key columns */
    current_delegated_staking_pool_balances_by_pk?: Maybe<Current_Delegated_Staking_Pool_Balances>;
    /** fetch data from the table: "current_delegated_voter" */
    current_delegated_voter: Array<Current_Delegated_Voter>;
    /** fetch data from the table: "current_delegated_voter" using primary key columns */
    current_delegated_voter_by_pk?: Maybe<Current_Delegated_Voter>;
    /** fetch data from the table: "current_delegator_balances" */
    current_delegator_balances: Array<Current_Delegator_Balances>;
    /** fetch data from the table: "current_delegator_balances" using primary key columns */
    current_delegator_balances_by_pk?: Maybe<Current_Delegator_Balances>;
    /** fetch data from the table: "current_fungible_asset_balances" */
    current_fungible_asset_balances: Array<Current_Fungible_Asset_Balances>;
    /** fetch aggregated fields from the table: "current_fungible_asset_balances" */
    current_fungible_asset_balances_aggregate: Current_Fungible_Asset_Balances_Aggregate;
    /** fetch data from the table: "current_fungible_asset_balances" using primary key columns */
    current_fungible_asset_balances_by_pk?: Maybe<Current_Fungible_Asset_Balances>;
    /** fetch data from the table: "current_objects" */
    current_objects: Array<Current_Objects>;
    /** fetch data from the table: "current_objects" using primary key columns */
    current_objects_by_pk?: Maybe<Current_Objects>;
    /** fetch data from the table: "current_staking_pool_voter" */
    current_staking_pool_voter: Array<Current_Staking_Pool_Voter>;
    /** fetch data from the table: "current_staking_pool_voter" using primary key columns */
    current_staking_pool_voter_by_pk?: Maybe<Current_Staking_Pool_Voter>;
    /** fetch data from the table: "current_table_items" */
    current_table_items: Array<Current_Table_Items>;
    /** fetch data from the table: "current_table_items" using primary key columns */
    current_table_items_by_pk?: Maybe<Current_Table_Items>;
    /** fetch data from the table: "current_token_datas" */
    current_token_datas: Array<Current_Token_Datas>;
    /** fetch data from the table: "current_token_datas" using primary key columns */
    current_token_datas_by_pk?: Maybe<Current_Token_Datas>;
    /** fetch data from the table: "current_token_datas_v2" */
    current_token_datas_v2: Array<Current_Token_Datas_V2>;
    /** fetch data from the table: "current_token_datas_v2" using primary key columns */
    current_token_datas_v2_by_pk?: Maybe<Current_Token_Datas_V2>;
    /** fetch data from the table: "current_token_ownerships" */
    current_token_ownerships: Array<Current_Token_Ownerships>;
    /** fetch aggregated fields from the table: "current_token_ownerships" */
    current_token_ownerships_aggregate: Current_Token_Ownerships_Aggregate;
    /** fetch data from the table: "current_token_ownerships" using primary key columns */
    current_token_ownerships_by_pk?: Maybe<Current_Token_Ownerships>;
    /** fetch data from the table: "current_token_ownerships_v2" */
    current_token_ownerships_v2: Array<Current_Token_Ownerships_V2>;
    /** fetch aggregated fields from the table: "current_token_ownerships_v2" */
    current_token_ownerships_v2_aggregate: Current_Token_Ownerships_V2_Aggregate;
    /** fetch data from the table: "current_token_ownerships_v2" using primary key columns */
    current_token_ownerships_v2_by_pk?: Maybe<Current_Token_Ownerships_V2>;
    /** fetch data from the table: "current_token_pending_claims" */
    current_token_pending_claims: Array<Current_Token_Pending_Claims>;
    /** fetch data from the table: "current_token_pending_claims" using primary key columns */
    current_token_pending_claims_by_pk?: Maybe<Current_Token_Pending_Claims>;
    /** An array relationship */
    delegated_staking_activities: Array<Delegated_Staking_Activities>;
    /** fetch data from the table: "delegated_staking_activities" using primary key columns */
    delegated_staking_activities_by_pk?: Maybe<Delegated_Staking_Activities>;
    /** fetch data from the table: "delegated_staking_pools" */
    delegated_staking_pools: Array<Delegated_Staking_Pools>;
    /** fetch data from the table: "delegated_staking_pools" using primary key columns */
    delegated_staking_pools_by_pk?: Maybe<Delegated_Staking_Pools>;
    /** fetch data from the table: "delegator_distinct_pool" */
    delegator_distinct_pool: Array<Delegator_Distinct_Pool>;
    /** fetch aggregated fields from the table: "delegator_distinct_pool" */
    delegator_distinct_pool_aggregate: Delegator_Distinct_Pool_Aggregate;
    /** fetch data from the table: "events" */
    events: Array<Events>;
    /** fetch data from the table: "events" using primary key columns */
    events_by_pk?: Maybe<Events>;
    /** An array relationship */
    fungible_asset_activities: Array<Fungible_Asset_Activities>;
    /** fetch data from the table: "fungible_asset_activities" using primary key columns */
    fungible_asset_activities_by_pk?: Maybe<Fungible_Asset_Activities>;
    /** fetch data from the table: "fungible_asset_metadata" */
    fungible_asset_metadata: Array<Fungible_Asset_Metadata>;
    /** fetch data from the table: "fungible_asset_metadata" using primary key columns */
    fungible_asset_metadata_by_pk?: Maybe<Fungible_Asset_Metadata>;
    /** fetch data from the table: "indexer_status" */
    indexer_status: Array<Indexer_Status>;
    /** fetch data from the table: "indexer_status" using primary key columns */
    indexer_status_by_pk?: Maybe<Indexer_Status>;
    /** fetch data from the table: "ledger_infos" */
    ledger_infos: Array<Ledger_Infos>;
    /** fetch data from the table: "ledger_infos" using primary key columns */
    ledger_infos_by_pk?: Maybe<Ledger_Infos>;
    /** fetch data from the table: "move_resources" */
    move_resources: Array<Move_Resources>;
    /** fetch aggregated fields from the table: "move_resources" */
    move_resources_aggregate: Move_Resources_Aggregate;
    /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_auctions" */
    nft_marketplace_v2_current_nft_marketplace_auctions: Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions>;
    /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_auctions" using primary key columns */
    nft_marketplace_v2_current_nft_marketplace_auctions_by_pk?: Maybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions>;
    /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_collection_offers" */
    nft_marketplace_v2_current_nft_marketplace_collection_offers: Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers>;
    /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_collection_offers" using primary key columns */
    nft_marketplace_v2_current_nft_marketplace_collection_offers_by_pk?: Maybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers>;
    /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_listings" */
    nft_marketplace_v2_current_nft_marketplace_listings: Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Listings>;
    /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_listings" using primary key columns */
    nft_marketplace_v2_current_nft_marketplace_listings_by_pk?: Maybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Listings>;
    /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_token_offers" */
    nft_marketplace_v2_current_nft_marketplace_token_offers: Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers>;
    /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_token_offers" using primary key columns */
    nft_marketplace_v2_current_nft_marketplace_token_offers_by_pk?: Maybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers>;
    /** fetch data from the table: "nft_marketplace_v2.nft_marketplace_activities" */
    nft_marketplace_v2_nft_marketplace_activities: Array<Nft_Marketplace_V2_Nft_Marketplace_Activities>;
    /** fetch data from the table: "nft_marketplace_v2.nft_marketplace_activities" using primary key columns */
    nft_marketplace_v2_nft_marketplace_activities_by_pk?: Maybe<Nft_Marketplace_V2_Nft_Marketplace_Activities>;
    /** fetch data from the table: "nft_metadata_crawler.parsed_asset_uris" */
    nft_metadata_crawler_parsed_asset_uris: Array<Nft_Metadata_Crawler_Parsed_Asset_Uris>;
    /** fetch data from the table: "nft_metadata_crawler.parsed_asset_uris" using primary key columns */
    nft_metadata_crawler_parsed_asset_uris_by_pk?: Maybe<Nft_Metadata_Crawler_Parsed_Asset_Uris>;
    /** fetch data from the table: "num_active_delegator_per_pool" */
    num_active_delegator_per_pool: Array<Num_Active_Delegator_Per_Pool>;
    /** fetch data from the table: "processor_status" */
    processor_status: Array<Processor_Status>;
    /** fetch data from the table: "processor_status" using primary key columns */
    processor_status_by_pk?: Maybe<Processor_Status>;
    /** fetch data from the table: "proposal_votes" */
    proposal_votes: Array<Proposal_Votes>;
    /** fetch aggregated fields from the table: "proposal_votes" */
    proposal_votes_aggregate: Proposal_Votes_Aggregate;
    /** fetch data from the table: "proposal_votes" using primary key columns */
    proposal_votes_by_pk?: Maybe<Proposal_Votes>;
    /** fetch data from the table: "table_items" */
    table_items: Array<Table_Items>;
    /** fetch data from the table: "table_items" using primary key columns */
    table_items_by_pk?: Maybe<Table_Items>;
    /** fetch data from the table: "table_metadatas" */
    table_metadatas: Array<Table_Metadatas>;
    /** fetch data from the table: "table_metadatas" using primary key columns */
    table_metadatas_by_pk?: Maybe<Table_Metadatas>;
    /** An array relationship */
    token_activities: Array<Token_Activities>;
    /** An aggregate relationship */
    token_activities_aggregate: Token_Activities_Aggregate;
    /** fetch data from the table: "token_activities" using primary key columns */
    token_activities_by_pk?: Maybe<Token_Activities>;
    /** An array relationship */
    token_activities_v2: Array<Token_Activities_V2>;
    /** An aggregate relationship */
    token_activities_v2_aggregate: Token_Activities_V2_Aggregate;
    /** fetch data from the table: "token_activities_v2" using primary key columns */
    token_activities_v2_by_pk?: Maybe<Token_Activities_V2>;
    /** fetch data from the table: "token_datas" */
    token_datas: Array<Token_Datas>;
    /** fetch data from the table: "token_datas" using primary key columns */
    token_datas_by_pk?: Maybe<Token_Datas>;
    /** fetch data from the table: "token_ownerships" */
    token_ownerships: Array<Token_Ownerships>;
    /** fetch data from the table: "token_ownerships" using primary key columns */
    token_ownerships_by_pk?: Maybe<Token_Ownerships>;
    /** fetch data from the table: "tokens" */
    tokens: Array<Tokens>;
    /** fetch data from the table: "tokens" using primary key columns */
    tokens_by_pk?: Maybe<Tokens>;
    /** fetch data from the table: "user_transactions" */
    user_transactions: Array<User_Transactions>;
    /** fetch data from the table: "user_transactions" using primary key columns */
    user_transactions_by_pk?: Maybe<User_Transactions>;
};
type Query_RootAccount_TransactionsArgs = {
    distinct_on?: InputMaybe<Array<Account_Transactions_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Account_Transactions_Order_By>>;
    where?: InputMaybe<Account_Transactions_Bool_Exp>;
};
type Query_RootAccount_Transactions_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Account_Transactions_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Account_Transactions_Order_By>>;
    where?: InputMaybe<Account_Transactions_Bool_Exp>;
};
type Query_RootAccount_Transactions_By_PkArgs = {
    account_address: Scalars['String']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Query_RootAddress_Events_SummaryArgs = {
    distinct_on?: InputMaybe<Array<Address_Events_Summary_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Address_Events_Summary_Order_By>>;
    where?: InputMaybe<Address_Events_Summary_Bool_Exp>;
};
type Query_RootAddress_Version_From_EventsArgs = {
    distinct_on?: InputMaybe<Array<Address_Version_From_Events_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Address_Version_From_Events_Order_By>>;
    where?: InputMaybe<Address_Version_From_Events_Bool_Exp>;
};
type Query_RootAddress_Version_From_Events_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Address_Version_From_Events_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Address_Version_From_Events_Order_By>>;
    where?: InputMaybe<Address_Version_From_Events_Bool_Exp>;
};
type Query_RootAddress_Version_From_Move_ResourcesArgs = {
    distinct_on?: InputMaybe<Array<Address_Version_From_Move_Resources_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Address_Version_From_Move_Resources_Order_By>>;
    where?: InputMaybe<Address_Version_From_Move_Resources_Bool_Exp>;
};
type Query_RootAddress_Version_From_Move_Resources_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Address_Version_From_Move_Resources_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Address_Version_From_Move_Resources_Order_By>>;
    where?: InputMaybe<Address_Version_From_Move_Resources_Bool_Exp>;
};
type Query_RootBlock_Metadata_TransactionsArgs = {
    distinct_on?: InputMaybe<Array<Block_Metadata_Transactions_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Block_Metadata_Transactions_Order_By>>;
    where?: InputMaybe<Block_Metadata_Transactions_Bool_Exp>;
};
type Query_RootBlock_Metadata_Transactions_By_PkArgs = {
    version: Scalars['bigint']['input'];
};
type Query_RootCoin_ActivitiesArgs = {
    distinct_on?: InputMaybe<Array<Coin_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Coin_Activities_Order_By>>;
    where?: InputMaybe<Coin_Activities_Bool_Exp>;
};
type Query_RootCoin_Activities_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Coin_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Coin_Activities_Order_By>>;
    where?: InputMaybe<Coin_Activities_Bool_Exp>;
};
type Query_RootCoin_Activities_By_PkArgs = {
    event_account_address: Scalars['String']['input'];
    event_creation_number: Scalars['bigint']['input'];
    event_sequence_number: Scalars['bigint']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Query_RootCoin_BalancesArgs = {
    distinct_on?: InputMaybe<Array<Coin_Balances_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Coin_Balances_Order_By>>;
    where?: InputMaybe<Coin_Balances_Bool_Exp>;
};
type Query_RootCoin_Balances_By_PkArgs = {
    coin_type_hash: Scalars['String']['input'];
    owner_address: Scalars['String']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Query_RootCoin_InfosArgs = {
    distinct_on?: InputMaybe<Array<Coin_Infos_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Coin_Infos_Order_By>>;
    where?: InputMaybe<Coin_Infos_Bool_Exp>;
};
type Query_RootCoin_Infos_By_PkArgs = {
    coin_type_hash: Scalars['String']['input'];
};
type Query_RootCoin_SupplyArgs = {
    distinct_on?: InputMaybe<Array<Coin_Supply_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Coin_Supply_Order_By>>;
    where?: InputMaybe<Coin_Supply_Bool_Exp>;
};
type Query_RootCoin_Supply_By_PkArgs = {
    coin_type_hash: Scalars['String']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Query_RootCollection_DatasArgs = {
    distinct_on?: InputMaybe<Array<Collection_Datas_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Collection_Datas_Order_By>>;
    where?: InputMaybe<Collection_Datas_Bool_Exp>;
};
type Query_RootCollection_Datas_By_PkArgs = {
    collection_data_id_hash: Scalars['String']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Query_RootCurrent_Ans_LookupArgs = {
    distinct_on?: InputMaybe<Array<Current_Ans_Lookup_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Ans_Lookup_Order_By>>;
    where?: InputMaybe<Current_Ans_Lookup_Bool_Exp>;
};
type Query_RootCurrent_Ans_Lookup_By_PkArgs = {
    domain: Scalars['String']['input'];
    subdomain: Scalars['String']['input'];
};
type Query_RootCurrent_Ans_Lookup_V2Args = {
    distinct_on?: InputMaybe<Array<Current_Ans_Lookup_V2_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Ans_Lookup_V2_Order_By>>;
    where?: InputMaybe<Current_Ans_Lookup_V2_Bool_Exp>;
};
type Query_RootCurrent_Ans_Lookup_V2_By_PkArgs = {
    domain: Scalars['String']['input'];
    subdomain: Scalars['String']['input'];
    token_standard: Scalars['String']['input'];
};
type Query_RootCurrent_Aptos_NamesArgs = {
    distinct_on?: InputMaybe<Array<Current_Aptos_Names_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Aptos_Names_Order_By>>;
    where?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
};
type Query_RootCurrent_Aptos_Names_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Current_Aptos_Names_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Aptos_Names_Order_By>>;
    where?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
};
type Query_RootCurrent_Coin_BalancesArgs = {
    distinct_on?: InputMaybe<Array<Current_Coin_Balances_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Coin_Balances_Order_By>>;
    where?: InputMaybe<Current_Coin_Balances_Bool_Exp>;
};
type Query_RootCurrent_Coin_Balances_By_PkArgs = {
    coin_type_hash: Scalars['String']['input'];
    owner_address: Scalars['String']['input'];
};
type Query_RootCurrent_Collection_DatasArgs = {
    distinct_on?: InputMaybe<Array<Current_Collection_Datas_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Collection_Datas_Order_By>>;
    where?: InputMaybe<Current_Collection_Datas_Bool_Exp>;
};
type Query_RootCurrent_Collection_Datas_By_PkArgs = {
    collection_data_id_hash: Scalars['String']['input'];
};
type Query_RootCurrent_Collection_Ownership_V2_ViewArgs = {
    distinct_on?: InputMaybe<Array<Current_Collection_Ownership_V2_View_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Collection_Ownership_V2_View_Order_By>>;
    where?: InputMaybe<Current_Collection_Ownership_V2_View_Bool_Exp>;
};
type Query_RootCurrent_Collection_Ownership_V2_View_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Current_Collection_Ownership_V2_View_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Collection_Ownership_V2_View_Order_By>>;
    where?: InputMaybe<Current_Collection_Ownership_V2_View_Bool_Exp>;
};
type Query_RootCurrent_Collections_V2Args = {
    distinct_on?: InputMaybe<Array<Current_Collections_V2_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Collections_V2_Order_By>>;
    where?: InputMaybe<Current_Collections_V2_Bool_Exp>;
};
type Query_RootCurrent_Collections_V2_By_PkArgs = {
    collection_id: Scalars['String']['input'];
};
type Query_RootCurrent_Delegated_Staking_Pool_BalancesArgs = {
    distinct_on?: InputMaybe<Array<Current_Delegated_Staking_Pool_Balances_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Delegated_Staking_Pool_Balances_Order_By>>;
    where?: InputMaybe<Current_Delegated_Staking_Pool_Balances_Bool_Exp>;
};
type Query_RootCurrent_Delegated_Staking_Pool_Balances_By_PkArgs = {
    staking_pool_address: Scalars['String']['input'];
};
type Query_RootCurrent_Delegated_VoterArgs = {
    distinct_on?: InputMaybe<Array<Current_Delegated_Voter_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Delegated_Voter_Order_By>>;
    where?: InputMaybe<Current_Delegated_Voter_Bool_Exp>;
};
type Query_RootCurrent_Delegated_Voter_By_PkArgs = {
    delegation_pool_address: Scalars['String']['input'];
    delegator_address: Scalars['String']['input'];
};
type Query_RootCurrent_Delegator_BalancesArgs = {
    distinct_on?: InputMaybe<Array<Current_Delegator_Balances_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Delegator_Balances_Order_By>>;
    where?: InputMaybe<Current_Delegator_Balances_Bool_Exp>;
};
type Query_RootCurrent_Delegator_Balances_By_PkArgs = {
    delegator_address: Scalars['String']['input'];
    pool_address: Scalars['String']['input'];
    pool_type: Scalars['String']['input'];
    table_handle: Scalars['String']['input'];
};
type Query_RootCurrent_Fungible_Asset_BalancesArgs = {
    distinct_on?: InputMaybe<Array<Current_Fungible_Asset_Balances_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Fungible_Asset_Balances_Order_By>>;
    where?: InputMaybe<Current_Fungible_Asset_Balances_Bool_Exp>;
};
type Query_RootCurrent_Fungible_Asset_Balances_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Current_Fungible_Asset_Balances_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Fungible_Asset_Balances_Order_By>>;
    where?: InputMaybe<Current_Fungible_Asset_Balances_Bool_Exp>;
};
type Query_RootCurrent_Fungible_Asset_Balances_By_PkArgs = {
    storage_id: Scalars['String']['input'];
};
type Query_RootCurrent_ObjectsArgs = {
    distinct_on?: InputMaybe<Array<Current_Objects_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Objects_Order_By>>;
    where?: InputMaybe<Current_Objects_Bool_Exp>;
};
type Query_RootCurrent_Objects_By_PkArgs = {
    object_address: Scalars['String']['input'];
};
type Query_RootCurrent_Staking_Pool_VoterArgs = {
    distinct_on?: InputMaybe<Array<Current_Staking_Pool_Voter_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Staking_Pool_Voter_Order_By>>;
    where?: InputMaybe<Current_Staking_Pool_Voter_Bool_Exp>;
};
type Query_RootCurrent_Staking_Pool_Voter_By_PkArgs = {
    staking_pool_address: Scalars['String']['input'];
};
type Query_RootCurrent_Table_ItemsArgs = {
    distinct_on?: InputMaybe<Array<Current_Table_Items_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Table_Items_Order_By>>;
    where?: InputMaybe<Current_Table_Items_Bool_Exp>;
};
type Query_RootCurrent_Table_Items_By_PkArgs = {
    key_hash: Scalars['String']['input'];
    table_handle: Scalars['String']['input'];
};
type Query_RootCurrent_Token_DatasArgs = {
    distinct_on?: InputMaybe<Array<Current_Token_Datas_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Token_Datas_Order_By>>;
    where?: InputMaybe<Current_Token_Datas_Bool_Exp>;
};
type Query_RootCurrent_Token_Datas_By_PkArgs = {
    token_data_id_hash: Scalars['String']['input'];
};
type Query_RootCurrent_Token_Datas_V2Args = {
    distinct_on?: InputMaybe<Array<Current_Token_Datas_V2_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Token_Datas_V2_Order_By>>;
    where?: InputMaybe<Current_Token_Datas_V2_Bool_Exp>;
};
type Query_RootCurrent_Token_Datas_V2_By_PkArgs = {
    token_data_id: Scalars['String']['input'];
};
type Query_RootCurrent_Token_OwnershipsArgs = {
    distinct_on?: InputMaybe<Array<Current_Token_Ownerships_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Token_Ownerships_Order_By>>;
    where?: InputMaybe<Current_Token_Ownerships_Bool_Exp>;
};
type Query_RootCurrent_Token_Ownerships_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Current_Token_Ownerships_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Token_Ownerships_Order_By>>;
    where?: InputMaybe<Current_Token_Ownerships_Bool_Exp>;
};
type Query_RootCurrent_Token_Ownerships_By_PkArgs = {
    owner_address: Scalars['String']['input'];
    property_version: Scalars['numeric']['input'];
    token_data_id_hash: Scalars['String']['input'];
};
type Query_RootCurrent_Token_Ownerships_V2Args = {
    distinct_on?: InputMaybe<Array<Current_Token_Ownerships_V2_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Token_Ownerships_V2_Order_By>>;
    where?: InputMaybe<Current_Token_Ownerships_V2_Bool_Exp>;
};
type Query_RootCurrent_Token_Ownerships_V2_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Current_Token_Ownerships_V2_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Token_Ownerships_V2_Order_By>>;
    where?: InputMaybe<Current_Token_Ownerships_V2_Bool_Exp>;
};
type Query_RootCurrent_Token_Ownerships_V2_By_PkArgs = {
    owner_address: Scalars['String']['input'];
    property_version_v1: Scalars['numeric']['input'];
    storage_id: Scalars['String']['input'];
    token_data_id: Scalars['String']['input'];
};
type Query_RootCurrent_Token_Pending_ClaimsArgs = {
    distinct_on?: InputMaybe<Array<Current_Token_Pending_Claims_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Token_Pending_Claims_Order_By>>;
    where?: InputMaybe<Current_Token_Pending_Claims_Bool_Exp>;
};
type Query_RootCurrent_Token_Pending_Claims_By_PkArgs = {
    from_address: Scalars['String']['input'];
    property_version: Scalars['numeric']['input'];
    to_address: Scalars['String']['input'];
    token_data_id_hash: Scalars['String']['input'];
};
type Query_RootDelegated_Staking_ActivitiesArgs = {
    distinct_on?: InputMaybe<Array<Delegated_Staking_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Delegated_Staking_Activities_Order_By>>;
    where?: InputMaybe<Delegated_Staking_Activities_Bool_Exp>;
};
type Query_RootDelegated_Staking_Activities_By_PkArgs = {
    event_index: Scalars['bigint']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Query_RootDelegated_Staking_PoolsArgs = {
    distinct_on?: InputMaybe<Array<Delegated_Staking_Pools_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Delegated_Staking_Pools_Order_By>>;
    where?: InputMaybe<Delegated_Staking_Pools_Bool_Exp>;
};
type Query_RootDelegated_Staking_Pools_By_PkArgs = {
    staking_pool_address: Scalars['String']['input'];
};
type Query_RootDelegator_Distinct_PoolArgs = {
    distinct_on?: InputMaybe<Array<Delegator_Distinct_Pool_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Delegator_Distinct_Pool_Order_By>>;
    where?: InputMaybe<Delegator_Distinct_Pool_Bool_Exp>;
};
type Query_RootDelegator_Distinct_Pool_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Delegator_Distinct_Pool_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Delegator_Distinct_Pool_Order_By>>;
    where?: InputMaybe<Delegator_Distinct_Pool_Bool_Exp>;
};
type Query_RootEventsArgs = {
    distinct_on?: InputMaybe<Array<Events_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Events_Order_By>>;
    where?: InputMaybe<Events_Bool_Exp>;
};
type Query_RootEvents_By_PkArgs = {
    event_index: Scalars['bigint']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Query_RootFungible_Asset_ActivitiesArgs = {
    distinct_on?: InputMaybe<Array<Fungible_Asset_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Fungible_Asset_Activities_Order_By>>;
    where?: InputMaybe<Fungible_Asset_Activities_Bool_Exp>;
};
type Query_RootFungible_Asset_Activities_By_PkArgs = {
    event_index: Scalars['bigint']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Query_RootFungible_Asset_MetadataArgs = {
    distinct_on?: InputMaybe<Array<Fungible_Asset_Metadata_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Fungible_Asset_Metadata_Order_By>>;
    where?: InputMaybe<Fungible_Asset_Metadata_Bool_Exp>;
};
type Query_RootFungible_Asset_Metadata_By_PkArgs = {
    asset_type: Scalars['String']['input'];
};
type Query_RootIndexer_StatusArgs = {
    distinct_on?: InputMaybe<Array<Indexer_Status_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Indexer_Status_Order_By>>;
    where?: InputMaybe<Indexer_Status_Bool_Exp>;
};
type Query_RootIndexer_Status_By_PkArgs = {
    db: Scalars['String']['input'];
};
type Query_RootLedger_InfosArgs = {
    distinct_on?: InputMaybe<Array<Ledger_Infos_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Ledger_Infos_Order_By>>;
    where?: InputMaybe<Ledger_Infos_Bool_Exp>;
};
type Query_RootLedger_Infos_By_PkArgs = {
    chain_id: Scalars['bigint']['input'];
};
type Query_RootMove_ResourcesArgs = {
    distinct_on?: InputMaybe<Array<Move_Resources_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Move_Resources_Order_By>>;
    where?: InputMaybe<Move_Resources_Bool_Exp>;
};
type Query_RootMove_Resources_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Move_Resources_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Move_Resources_Order_By>>;
    where?: InputMaybe<Move_Resources_Bool_Exp>;
};
type Query_RootNft_Marketplace_V2_Current_Nft_Marketplace_AuctionsArgs = {
    distinct_on?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Order_By>>;
    where?: InputMaybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Bool_Exp>;
};
type Query_RootNft_Marketplace_V2_Current_Nft_Marketplace_Auctions_By_PkArgs = {
    listing_id: Scalars['String']['input'];
    token_data_id: Scalars['String']['input'];
};
type Query_RootNft_Marketplace_V2_Current_Nft_Marketplace_Collection_OffersArgs = {
    distinct_on?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Order_By>>;
    where?: InputMaybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Bool_Exp>;
};
type Query_RootNft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_By_PkArgs = {
    collection_id: Scalars['String']['input'];
    collection_offer_id: Scalars['String']['input'];
};
type Query_RootNft_Marketplace_V2_Current_Nft_Marketplace_ListingsArgs = {
    distinct_on?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Order_By>>;
    where?: InputMaybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Bool_Exp>;
};
type Query_RootNft_Marketplace_V2_Current_Nft_Marketplace_Listings_By_PkArgs = {
    listing_id: Scalars['String']['input'];
    token_data_id: Scalars['String']['input'];
};
type Query_RootNft_Marketplace_V2_Current_Nft_Marketplace_Token_OffersArgs = {
    distinct_on?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Order_By>>;
    where?: InputMaybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Bool_Exp>;
};
type Query_RootNft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_By_PkArgs = {
    offer_id: Scalars['String']['input'];
    token_data_id: Scalars['String']['input'];
};
type Query_RootNft_Marketplace_V2_Nft_Marketplace_ActivitiesArgs = {
    distinct_on?: InputMaybe<Array<Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Nft_Marketplace_V2_Nft_Marketplace_Activities_Order_By>>;
    where?: InputMaybe<Nft_Marketplace_V2_Nft_Marketplace_Activities_Bool_Exp>;
};
type Query_RootNft_Marketplace_V2_Nft_Marketplace_Activities_By_PkArgs = {
    event_index: Scalars['bigint']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Query_RootNft_Metadata_Crawler_Parsed_Asset_UrisArgs = {
    distinct_on?: InputMaybe<Array<Nft_Metadata_Crawler_Parsed_Asset_Uris_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Nft_Metadata_Crawler_Parsed_Asset_Uris_Order_By>>;
    where?: InputMaybe<Nft_Metadata_Crawler_Parsed_Asset_Uris_Bool_Exp>;
};
type Query_RootNft_Metadata_Crawler_Parsed_Asset_Uris_By_PkArgs = {
    asset_uri: Scalars['String']['input'];
};
type Query_RootNum_Active_Delegator_Per_PoolArgs = {
    distinct_on?: InputMaybe<Array<Num_Active_Delegator_Per_Pool_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Num_Active_Delegator_Per_Pool_Order_By>>;
    where?: InputMaybe<Num_Active_Delegator_Per_Pool_Bool_Exp>;
};
type Query_RootProcessor_StatusArgs = {
    distinct_on?: InputMaybe<Array<Processor_Status_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Processor_Status_Order_By>>;
    where?: InputMaybe<Processor_Status_Bool_Exp>;
};
type Query_RootProcessor_Status_By_PkArgs = {
    processor: Scalars['String']['input'];
};
type Query_RootProposal_VotesArgs = {
    distinct_on?: InputMaybe<Array<Proposal_Votes_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Proposal_Votes_Order_By>>;
    where?: InputMaybe<Proposal_Votes_Bool_Exp>;
};
type Query_RootProposal_Votes_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Proposal_Votes_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Proposal_Votes_Order_By>>;
    where?: InputMaybe<Proposal_Votes_Bool_Exp>;
};
type Query_RootProposal_Votes_By_PkArgs = {
    proposal_id: Scalars['bigint']['input'];
    transaction_version: Scalars['bigint']['input'];
    voter_address: Scalars['String']['input'];
};
type Query_RootTable_ItemsArgs = {
    distinct_on?: InputMaybe<Array<Table_Items_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Table_Items_Order_By>>;
    where?: InputMaybe<Table_Items_Bool_Exp>;
};
type Query_RootTable_Items_By_PkArgs = {
    transaction_version: Scalars['bigint']['input'];
    write_set_change_index: Scalars['bigint']['input'];
};
type Query_RootTable_MetadatasArgs = {
    distinct_on?: InputMaybe<Array<Table_Metadatas_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Table_Metadatas_Order_By>>;
    where?: InputMaybe<Table_Metadatas_Bool_Exp>;
};
type Query_RootTable_Metadatas_By_PkArgs = {
    handle: Scalars['String']['input'];
};
type Query_RootToken_ActivitiesArgs = {
    distinct_on?: InputMaybe<Array<Token_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Activities_Order_By>>;
    where?: InputMaybe<Token_Activities_Bool_Exp>;
};
type Query_RootToken_Activities_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Token_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Activities_Order_By>>;
    where?: InputMaybe<Token_Activities_Bool_Exp>;
};
type Query_RootToken_Activities_By_PkArgs = {
    event_account_address: Scalars['String']['input'];
    event_creation_number: Scalars['bigint']['input'];
    event_sequence_number: Scalars['bigint']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Query_RootToken_Activities_V2Args = {
    distinct_on?: InputMaybe<Array<Token_Activities_V2_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Activities_V2_Order_By>>;
    where?: InputMaybe<Token_Activities_V2_Bool_Exp>;
};
type Query_RootToken_Activities_V2_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Token_Activities_V2_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Activities_V2_Order_By>>;
    where?: InputMaybe<Token_Activities_V2_Bool_Exp>;
};
type Query_RootToken_Activities_V2_By_PkArgs = {
    event_index: Scalars['bigint']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Query_RootToken_DatasArgs = {
    distinct_on?: InputMaybe<Array<Token_Datas_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Datas_Order_By>>;
    where?: InputMaybe<Token_Datas_Bool_Exp>;
};
type Query_RootToken_Datas_By_PkArgs = {
    token_data_id_hash: Scalars['String']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Query_RootToken_OwnershipsArgs = {
    distinct_on?: InputMaybe<Array<Token_Ownerships_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Ownerships_Order_By>>;
    where?: InputMaybe<Token_Ownerships_Bool_Exp>;
};
type Query_RootToken_Ownerships_By_PkArgs = {
    property_version: Scalars['numeric']['input'];
    table_handle: Scalars['String']['input'];
    token_data_id_hash: Scalars['String']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Query_RootTokensArgs = {
    distinct_on?: InputMaybe<Array<Tokens_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Tokens_Order_By>>;
    where?: InputMaybe<Tokens_Bool_Exp>;
};
type Query_RootTokens_By_PkArgs = {
    property_version: Scalars['numeric']['input'];
    token_data_id_hash: Scalars['String']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Query_RootUser_TransactionsArgs = {
    distinct_on?: InputMaybe<Array<User_Transactions_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<User_Transactions_Order_By>>;
    where?: InputMaybe<User_Transactions_Bool_Exp>;
};
type Query_RootUser_Transactions_By_PkArgs = {
    version: Scalars['bigint']['input'];
};
type Subscription_Root = {
    __typename?: 'subscription_root';
    /** fetch data from the table: "account_transactions" */
    account_transactions: Array<Account_Transactions>;
    /** fetch aggregated fields from the table: "account_transactions" */
    account_transactions_aggregate: Account_Transactions_Aggregate;
    /** fetch data from the table: "account_transactions" using primary key columns */
    account_transactions_by_pk?: Maybe<Account_Transactions>;
    /** fetch data from the table in a streaming manner : "account_transactions" */
    account_transactions_stream: Array<Account_Transactions>;
    /** fetch data from the table: "address_events_summary" */
    address_events_summary: Array<Address_Events_Summary>;
    /** fetch data from the table in a streaming manner : "address_events_summary" */
    address_events_summary_stream: Array<Address_Events_Summary>;
    /** fetch data from the table: "address_version_from_events" */
    address_version_from_events: Array<Address_Version_From_Events>;
    /** fetch aggregated fields from the table: "address_version_from_events" */
    address_version_from_events_aggregate: Address_Version_From_Events_Aggregate;
    /** fetch data from the table in a streaming manner : "address_version_from_events" */
    address_version_from_events_stream: Array<Address_Version_From_Events>;
    /** fetch data from the table: "address_version_from_move_resources" */
    address_version_from_move_resources: Array<Address_Version_From_Move_Resources>;
    /** fetch aggregated fields from the table: "address_version_from_move_resources" */
    address_version_from_move_resources_aggregate: Address_Version_From_Move_Resources_Aggregate;
    /** fetch data from the table in a streaming manner : "address_version_from_move_resources" */
    address_version_from_move_resources_stream: Array<Address_Version_From_Move_Resources>;
    /** fetch data from the table: "block_metadata_transactions" */
    block_metadata_transactions: Array<Block_Metadata_Transactions>;
    /** fetch data from the table: "block_metadata_transactions" using primary key columns */
    block_metadata_transactions_by_pk?: Maybe<Block_Metadata_Transactions>;
    /** fetch data from the table in a streaming manner : "block_metadata_transactions" */
    block_metadata_transactions_stream: Array<Block_Metadata_Transactions>;
    /** An array relationship */
    coin_activities: Array<Coin_Activities>;
    /** An aggregate relationship */
    coin_activities_aggregate: Coin_Activities_Aggregate;
    /** fetch data from the table: "coin_activities" using primary key columns */
    coin_activities_by_pk?: Maybe<Coin_Activities>;
    /** fetch data from the table in a streaming manner : "coin_activities" */
    coin_activities_stream: Array<Coin_Activities>;
    /** fetch data from the table: "coin_balances" */
    coin_balances: Array<Coin_Balances>;
    /** fetch data from the table: "coin_balances" using primary key columns */
    coin_balances_by_pk?: Maybe<Coin_Balances>;
    /** fetch data from the table in a streaming manner : "coin_balances" */
    coin_balances_stream: Array<Coin_Balances>;
    /** fetch data from the table: "coin_infos" */
    coin_infos: Array<Coin_Infos>;
    /** fetch data from the table: "coin_infos" using primary key columns */
    coin_infos_by_pk?: Maybe<Coin_Infos>;
    /** fetch data from the table in a streaming manner : "coin_infos" */
    coin_infos_stream: Array<Coin_Infos>;
    /** fetch data from the table: "coin_supply" */
    coin_supply: Array<Coin_Supply>;
    /** fetch data from the table: "coin_supply" using primary key columns */
    coin_supply_by_pk?: Maybe<Coin_Supply>;
    /** fetch data from the table in a streaming manner : "coin_supply" */
    coin_supply_stream: Array<Coin_Supply>;
    /** fetch data from the table: "collection_datas" */
    collection_datas: Array<Collection_Datas>;
    /** fetch data from the table: "collection_datas" using primary key columns */
    collection_datas_by_pk?: Maybe<Collection_Datas>;
    /** fetch data from the table in a streaming manner : "collection_datas" */
    collection_datas_stream: Array<Collection_Datas>;
    /** fetch data from the table: "current_ans_lookup" */
    current_ans_lookup: Array<Current_Ans_Lookup>;
    /** fetch data from the table: "current_ans_lookup" using primary key columns */
    current_ans_lookup_by_pk?: Maybe<Current_Ans_Lookup>;
    /** fetch data from the table in a streaming manner : "current_ans_lookup" */
    current_ans_lookup_stream: Array<Current_Ans_Lookup>;
    /** fetch data from the table: "current_ans_lookup_v2" */
    current_ans_lookup_v2: Array<Current_Ans_Lookup_V2>;
    /** fetch data from the table: "current_ans_lookup_v2" using primary key columns */
    current_ans_lookup_v2_by_pk?: Maybe<Current_Ans_Lookup_V2>;
    /** fetch data from the table in a streaming manner : "current_ans_lookup_v2" */
    current_ans_lookup_v2_stream: Array<Current_Ans_Lookup_V2>;
    /** fetch data from the table: "current_aptos_names" */
    current_aptos_names: Array<Current_Aptos_Names>;
    /** fetch aggregated fields from the table: "current_aptos_names" */
    current_aptos_names_aggregate: Current_Aptos_Names_Aggregate;
    /** fetch data from the table in a streaming manner : "current_aptos_names" */
    current_aptos_names_stream: Array<Current_Aptos_Names>;
    /** fetch data from the table: "current_coin_balances" */
    current_coin_balances: Array<Current_Coin_Balances>;
    /** fetch data from the table: "current_coin_balances" using primary key columns */
    current_coin_balances_by_pk?: Maybe<Current_Coin_Balances>;
    /** fetch data from the table in a streaming manner : "current_coin_balances" */
    current_coin_balances_stream: Array<Current_Coin_Balances>;
    /** fetch data from the table: "current_collection_datas" */
    current_collection_datas: Array<Current_Collection_Datas>;
    /** fetch data from the table: "current_collection_datas" using primary key columns */
    current_collection_datas_by_pk?: Maybe<Current_Collection_Datas>;
    /** fetch data from the table in a streaming manner : "current_collection_datas" */
    current_collection_datas_stream: Array<Current_Collection_Datas>;
    /** fetch data from the table: "current_collection_ownership_v2_view" */
    current_collection_ownership_v2_view: Array<Current_Collection_Ownership_V2_View>;
    /** fetch aggregated fields from the table: "current_collection_ownership_v2_view" */
    current_collection_ownership_v2_view_aggregate: Current_Collection_Ownership_V2_View_Aggregate;
    /** fetch data from the table in a streaming manner : "current_collection_ownership_v2_view" */
    current_collection_ownership_v2_view_stream: Array<Current_Collection_Ownership_V2_View>;
    /** fetch data from the table: "current_collections_v2" */
    current_collections_v2: Array<Current_Collections_V2>;
    /** fetch data from the table: "current_collections_v2" using primary key columns */
    current_collections_v2_by_pk?: Maybe<Current_Collections_V2>;
    /** fetch data from the table in a streaming manner : "current_collections_v2" */
    current_collections_v2_stream: Array<Current_Collections_V2>;
    /** fetch data from the table: "current_delegated_staking_pool_balances" */
    current_delegated_staking_pool_balances: Array<Current_Delegated_Staking_Pool_Balances>;
    /** fetch data from the table: "current_delegated_staking_pool_balances" using primary key columns */
    current_delegated_staking_pool_balances_by_pk?: Maybe<Current_Delegated_Staking_Pool_Balances>;
    /** fetch data from the table in a streaming manner : "current_delegated_staking_pool_balances" */
    current_delegated_staking_pool_balances_stream: Array<Current_Delegated_Staking_Pool_Balances>;
    /** fetch data from the table: "current_delegated_voter" */
    current_delegated_voter: Array<Current_Delegated_Voter>;
    /** fetch data from the table: "current_delegated_voter" using primary key columns */
    current_delegated_voter_by_pk?: Maybe<Current_Delegated_Voter>;
    /** fetch data from the table in a streaming manner : "current_delegated_voter" */
    current_delegated_voter_stream: Array<Current_Delegated_Voter>;
    /** fetch data from the table: "current_delegator_balances" */
    current_delegator_balances: Array<Current_Delegator_Balances>;
    /** fetch data from the table: "current_delegator_balances" using primary key columns */
    current_delegator_balances_by_pk?: Maybe<Current_Delegator_Balances>;
    /** fetch data from the table in a streaming manner : "current_delegator_balances" */
    current_delegator_balances_stream: Array<Current_Delegator_Balances>;
    /** fetch data from the table: "current_fungible_asset_balances" */
    current_fungible_asset_balances: Array<Current_Fungible_Asset_Balances>;
    /** fetch aggregated fields from the table: "current_fungible_asset_balances" */
    current_fungible_asset_balances_aggregate: Current_Fungible_Asset_Balances_Aggregate;
    /** fetch data from the table: "current_fungible_asset_balances" using primary key columns */
    current_fungible_asset_balances_by_pk?: Maybe<Current_Fungible_Asset_Balances>;
    /** fetch data from the table in a streaming manner : "current_fungible_asset_balances" */
    current_fungible_asset_balances_stream: Array<Current_Fungible_Asset_Balances>;
    /** fetch data from the table: "current_objects" */
    current_objects: Array<Current_Objects>;
    /** fetch data from the table: "current_objects" using primary key columns */
    current_objects_by_pk?: Maybe<Current_Objects>;
    /** fetch data from the table in a streaming manner : "current_objects" */
    current_objects_stream: Array<Current_Objects>;
    /** fetch data from the table: "current_staking_pool_voter" */
    current_staking_pool_voter: Array<Current_Staking_Pool_Voter>;
    /** fetch data from the table: "current_staking_pool_voter" using primary key columns */
    current_staking_pool_voter_by_pk?: Maybe<Current_Staking_Pool_Voter>;
    /** fetch data from the table in a streaming manner : "current_staking_pool_voter" */
    current_staking_pool_voter_stream: Array<Current_Staking_Pool_Voter>;
    /** fetch data from the table: "current_table_items" */
    current_table_items: Array<Current_Table_Items>;
    /** fetch data from the table: "current_table_items" using primary key columns */
    current_table_items_by_pk?: Maybe<Current_Table_Items>;
    /** fetch data from the table in a streaming manner : "current_table_items" */
    current_table_items_stream: Array<Current_Table_Items>;
    /** fetch data from the table: "current_token_datas" */
    current_token_datas: Array<Current_Token_Datas>;
    /** fetch data from the table: "current_token_datas" using primary key columns */
    current_token_datas_by_pk?: Maybe<Current_Token_Datas>;
    /** fetch data from the table in a streaming manner : "current_token_datas" */
    current_token_datas_stream: Array<Current_Token_Datas>;
    /** fetch data from the table: "current_token_datas_v2" */
    current_token_datas_v2: Array<Current_Token_Datas_V2>;
    /** fetch data from the table: "current_token_datas_v2" using primary key columns */
    current_token_datas_v2_by_pk?: Maybe<Current_Token_Datas_V2>;
    /** fetch data from the table in a streaming manner : "current_token_datas_v2" */
    current_token_datas_v2_stream: Array<Current_Token_Datas_V2>;
    /** fetch data from the table: "current_token_ownerships" */
    current_token_ownerships: Array<Current_Token_Ownerships>;
    /** fetch aggregated fields from the table: "current_token_ownerships" */
    current_token_ownerships_aggregate: Current_Token_Ownerships_Aggregate;
    /** fetch data from the table: "current_token_ownerships" using primary key columns */
    current_token_ownerships_by_pk?: Maybe<Current_Token_Ownerships>;
    /** fetch data from the table in a streaming manner : "current_token_ownerships" */
    current_token_ownerships_stream: Array<Current_Token_Ownerships>;
    /** fetch data from the table: "current_token_ownerships_v2" */
    current_token_ownerships_v2: Array<Current_Token_Ownerships_V2>;
    /** fetch aggregated fields from the table: "current_token_ownerships_v2" */
    current_token_ownerships_v2_aggregate: Current_Token_Ownerships_V2_Aggregate;
    /** fetch data from the table: "current_token_ownerships_v2" using primary key columns */
    current_token_ownerships_v2_by_pk?: Maybe<Current_Token_Ownerships_V2>;
    /** fetch data from the table in a streaming manner : "current_token_ownerships_v2" */
    current_token_ownerships_v2_stream: Array<Current_Token_Ownerships_V2>;
    /** fetch data from the table: "current_token_pending_claims" */
    current_token_pending_claims: Array<Current_Token_Pending_Claims>;
    /** fetch data from the table: "current_token_pending_claims" using primary key columns */
    current_token_pending_claims_by_pk?: Maybe<Current_Token_Pending_Claims>;
    /** fetch data from the table in a streaming manner : "current_token_pending_claims" */
    current_token_pending_claims_stream: Array<Current_Token_Pending_Claims>;
    /** An array relationship */
    delegated_staking_activities: Array<Delegated_Staking_Activities>;
    /** fetch data from the table: "delegated_staking_activities" using primary key columns */
    delegated_staking_activities_by_pk?: Maybe<Delegated_Staking_Activities>;
    /** fetch data from the table in a streaming manner : "delegated_staking_activities" */
    delegated_staking_activities_stream: Array<Delegated_Staking_Activities>;
    /** fetch data from the table: "delegated_staking_pools" */
    delegated_staking_pools: Array<Delegated_Staking_Pools>;
    /** fetch data from the table: "delegated_staking_pools" using primary key columns */
    delegated_staking_pools_by_pk?: Maybe<Delegated_Staking_Pools>;
    /** fetch data from the table in a streaming manner : "delegated_staking_pools" */
    delegated_staking_pools_stream: Array<Delegated_Staking_Pools>;
    /** fetch data from the table: "delegator_distinct_pool" */
    delegator_distinct_pool: Array<Delegator_Distinct_Pool>;
    /** fetch aggregated fields from the table: "delegator_distinct_pool" */
    delegator_distinct_pool_aggregate: Delegator_Distinct_Pool_Aggregate;
    /** fetch data from the table in a streaming manner : "delegator_distinct_pool" */
    delegator_distinct_pool_stream: Array<Delegator_Distinct_Pool>;
    /** fetch data from the table: "events" */
    events: Array<Events>;
    /** fetch data from the table: "events" using primary key columns */
    events_by_pk?: Maybe<Events>;
    /** fetch data from the table in a streaming manner : "events" */
    events_stream: Array<Events>;
    /** An array relationship */
    fungible_asset_activities: Array<Fungible_Asset_Activities>;
    /** fetch data from the table: "fungible_asset_activities" using primary key columns */
    fungible_asset_activities_by_pk?: Maybe<Fungible_Asset_Activities>;
    /** fetch data from the table in a streaming manner : "fungible_asset_activities" */
    fungible_asset_activities_stream: Array<Fungible_Asset_Activities>;
    /** fetch data from the table: "fungible_asset_metadata" */
    fungible_asset_metadata: Array<Fungible_Asset_Metadata>;
    /** fetch data from the table: "fungible_asset_metadata" using primary key columns */
    fungible_asset_metadata_by_pk?: Maybe<Fungible_Asset_Metadata>;
    /** fetch data from the table in a streaming manner : "fungible_asset_metadata" */
    fungible_asset_metadata_stream: Array<Fungible_Asset_Metadata>;
    /** fetch data from the table: "indexer_status" */
    indexer_status: Array<Indexer_Status>;
    /** fetch data from the table: "indexer_status" using primary key columns */
    indexer_status_by_pk?: Maybe<Indexer_Status>;
    /** fetch data from the table in a streaming manner : "indexer_status" */
    indexer_status_stream: Array<Indexer_Status>;
    /** fetch data from the table: "ledger_infos" */
    ledger_infos: Array<Ledger_Infos>;
    /** fetch data from the table: "ledger_infos" using primary key columns */
    ledger_infos_by_pk?: Maybe<Ledger_Infos>;
    /** fetch data from the table in a streaming manner : "ledger_infos" */
    ledger_infos_stream: Array<Ledger_Infos>;
    /** fetch data from the table: "move_resources" */
    move_resources: Array<Move_Resources>;
    /** fetch aggregated fields from the table: "move_resources" */
    move_resources_aggregate: Move_Resources_Aggregate;
    /** fetch data from the table in a streaming manner : "move_resources" */
    move_resources_stream: Array<Move_Resources>;
    /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_auctions" */
    nft_marketplace_v2_current_nft_marketplace_auctions: Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions>;
    /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_auctions" using primary key columns */
    nft_marketplace_v2_current_nft_marketplace_auctions_by_pk?: Maybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions>;
    /** fetch data from the table in a streaming manner : "nft_marketplace_v2.current_nft_marketplace_auctions" */
    nft_marketplace_v2_current_nft_marketplace_auctions_stream: Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions>;
    /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_collection_offers" */
    nft_marketplace_v2_current_nft_marketplace_collection_offers: Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers>;
    /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_collection_offers" using primary key columns */
    nft_marketplace_v2_current_nft_marketplace_collection_offers_by_pk?: Maybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers>;
    /** fetch data from the table in a streaming manner : "nft_marketplace_v2.current_nft_marketplace_collection_offers" */
    nft_marketplace_v2_current_nft_marketplace_collection_offers_stream: Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers>;
    /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_listings" */
    nft_marketplace_v2_current_nft_marketplace_listings: Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Listings>;
    /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_listings" using primary key columns */
    nft_marketplace_v2_current_nft_marketplace_listings_by_pk?: Maybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Listings>;
    /** fetch data from the table in a streaming manner : "nft_marketplace_v2.current_nft_marketplace_listings" */
    nft_marketplace_v2_current_nft_marketplace_listings_stream: Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Listings>;
    /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_token_offers" */
    nft_marketplace_v2_current_nft_marketplace_token_offers: Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers>;
    /** fetch data from the table: "nft_marketplace_v2.current_nft_marketplace_token_offers" using primary key columns */
    nft_marketplace_v2_current_nft_marketplace_token_offers_by_pk?: Maybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers>;
    /** fetch data from the table in a streaming manner : "nft_marketplace_v2.current_nft_marketplace_token_offers" */
    nft_marketplace_v2_current_nft_marketplace_token_offers_stream: Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers>;
    /** fetch data from the table: "nft_marketplace_v2.nft_marketplace_activities" */
    nft_marketplace_v2_nft_marketplace_activities: Array<Nft_Marketplace_V2_Nft_Marketplace_Activities>;
    /** fetch data from the table: "nft_marketplace_v2.nft_marketplace_activities" using primary key columns */
    nft_marketplace_v2_nft_marketplace_activities_by_pk?: Maybe<Nft_Marketplace_V2_Nft_Marketplace_Activities>;
    /** fetch data from the table in a streaming manner : "nft_marketplace_v2.nft_marketplace_activities" */
    nft_marketplace_v2_nft_marketplace_activities_stream: Array<Nft_Marketplace_V2_Nft_Marketplace_Activities>;
    /** fetch data from the table: "nft_metadata_crawler.parsed_asset_uris" */
    nft_metadata_crawler_parsed_asset_uris: Array<Nft_Metadata_Crawler_Parsed_Asset_Uris>;
    /** fetch data from the table: "nft_metadata_crawler.parsed_asset_uris" using primary key columns */
    nft_metadata_crawler_parsed_asset_uris_by_pk?: Maybe<Nft_Metadata_Crawler_Parsed_Asset_Uris>;
    /** fetch data from the table in a streaming manner : "nft_metadata_crawler.parsed_asset_uris" */
    nft_metadata_crawler_parsed_asset_uris_stream: Array<Nft_Metadata_Crawler_Parsed_Asset_Uris>;
    /** fetch data from the table: "num_active_delegator_per_pool" */
    num_active_delegator_per_pool: Array<Num_Active_Delegator_Per_Pool>;
    /** fetch data from the table in a streaming manner : "num_active_delegator_per_pool" */
    num_active_delegator_per_pool_stream: Array<Num_Active_Delegator_Per_Pool>;
    /** fetch data from the table: "processor_status" */
    processor_status: Array<Processor_Status>;
    /** fetch data from the table: "processor_status" using primary key columns */
    processor_status_by_pk?: Maybe<Processor_Status>;
    /** fetch data from the table in a streaming manner : "processor_status" */
    processor_status_stream: Array<Processor_Status>;
    /** fetch data from the table: "proposal_votes" */
    proposal_votes: Array<Proposal_Votes>;
    /** fetch aggregated fields from the table: "proposal_votes" */
    proposal_votes_aggregate: Proposal_Votes_Aggregate;
    /** fetch data from the table: "proposal_votes" using primary key columns */
    proposal_votes_by_pk?: Maybe<Proposal_Votes>;
    /** fetch data from the table in a streaming manner : "proposal_votes" */
    proposal_votes_stream: Array<Proposal_Votes>;
    /** fetch data from the table: "table_items" */
    table_items: Array<Table_Items>;
    /** fetch data from the table: "table_items" using primary key columns */
    table_items_by_pk?: Maybe<Table_Items>;
    /** fetch data from the table in a streaming manner : "table_items" */
    table_items_stream: Array<Table_Items>;
    /** fetch data from the table: "table_metadatas" */
    table_metadatas: Array<Table_Metadatas>;
    /** fetch data from the table: "table_metadatas" using primary key columns */
    table_metadatas_by_pk?: Maybe<Table_Metadatas>;
    /** fetch data from the table in a streaming manner : "table_metadatas" */
    table_metadatas_stream: Array<Table_Metadatas>;
    /** An array relationship */
    token_activities: Array<Token_Activities>;
    /** An aggregate relationship */
    token_activities_aggregate: Token_Activities_Aggregate;
    /** fetch data from the table: "token_activities" using primary key columns */
    token_activities_by_pk?: Maybe<Token_Activities>;
    /** fetch data from the table in a streaming manner : "token_activities" */
    token_activities_stream: Array<Token_Activities>;
    /** An array relationship */
    token_activities_v2: Array<Token_Activities_V2>;
    /** An aggregate relationship */
    token_activities_v2_aggregate: Token_Activities_V2_Aggregate;
    /** fetch data from the table: "token_activities_v2" using primary key columns */
    token_activities_v2_by_pk?: Maybe<Token_Activities_V2>;
    /** fetch data from the table in a streaming manner : "token_activities_v2" */
    token_activities_v2_stream: Array<Token_Activities_V2>;
    /** fetch data from the table: "token_datas" */
    token_datas: Array<Token_Datas>;
    /** fetch data from the table: "token_datas" using primary key columns */
    token_datas_by_pk?: Maybe<Token_Datas>;
    /** fetch data from the table in a streaming manner : "token_datas" */
    token_datas_stream: Array<Token_Datas>;
    /** fetch data from the table: "token_ownerships" */
    token_ownerships: Array<Token_Ownerships>;
    /** fetch data from the table: "token_ownerships" using primary key columns */
    token_ownerships_by_pk?: Maybe<Token_Ownerships>;
    /** fetch data from the table in a streaming manner : "token_ownerships" */
    token_ownerships_stream: Array<Token_Ownerships>;
    /** fetch data from the table: "tokens" */
    tokens: Array<Tokens>;
    /** fetch data from the table: "tokens" using primary key columns */
    tokens_by_pk?: Maybe<Tokens>;
    /** fetch data from the table in a streaming manner : "tokens" */
    tokens_stream: Array<Tokens>;
    /** fetch data from the table: "user_transactions" */
    user_transactions: Array<User_Transactions>;
    /** fetch data from the table: "user_transactions" using primary key columns */
    user_transactions_by_pk?: Maybe<User_Transactions>;
    /** fetch data from the table in a streaming manner : "user_transactions" */
    user_transactions_stream: Array<User_Transactions>;
};
type Subscription_RootAccount_TransactionsArgs = {
    distinct_on?: InputMaybe<Array<Account_Transactions_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Account_Transactions_Order_By>>;
    where?: InputMaybe<Account_Transactions_Bool_Exp>;
};
type Subscription_RootAccount_Transactions_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Account_Transactions_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Account_Transactions_Order_By>>;
    where?: InputMaybe<Account_Transactions_Bool_Exp>;
};
type Subscription_RootAccount_Transactions_By_PkArgs = {
    account_address: Scalars['String']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Subscription_RootAccount_Transactions_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Account_Transactions_Stream_Cursor_Input>>;
    where?: InputMaybe<Account_Transactions_Bool_Exp>;
};
type Subscription_RootAddress_Events_SummaryArgs = {
    distinct_on?: InputMaybe<Array<Address_Events_Summary_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Address_Events_Summary_Order_By>>;
    where?: InputMaybe<Address_Events_Summary_Bool_Exp>;
};
type Subscription_RootAddress_Events_Summary_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Address_Events_Summary_Stream_Cursor_Input>>;
    where?: InputMaybe<Address_Events_Summary_Bool_Exp>;
};
type Subscription_RootAddress_Version_From_EventsArgs = {
    distinct_on?: InputMaybe<Array<Address_Version_From_Events_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Address_Version_From_Events_Order_By>>;
    where?: InputMaybe<Address_Version_From_Events_Bool_Exp>;
};
type Subscription_RootAddress_Version_From_Events_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Address_Version_From_Events_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Address_Version_From_Events_Order_By>>;
    where?: InputMaybe<Address_Version_From_Events_Bool_Exp>;
};
type Subscription_RootAddress_Version_From_Events_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Address_Version_From_Events_Stream_Cursor_Input>>;
    where?: InputMaybe<Address_Version_From_Events_Bool_Exp>;
};
type Subscription_RootAddress_Version_From_Move_ResourcesArgs = {
    distinct_on?: InputMaybe<Array<Address_Version_From_Move_Resources_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Address_Version_From_Move_Resources_Order_By>>;
    where?: InputMaybe<Address_Version_From_Move_Resources_Bool_Exp>;
};
type Subscription_RootAddress_Version_From_Move_Resources_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Address_Version_From_Move_Resources_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Address_Version_From_Move_Resources_Order_By>>;
    where?: InputMaybe<Address_Version_From_Move_Resources_Bool_Exp>;
};
type Subscription_RootAddress_Version_From_Move_Resources_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Address_Version_From_Move_Resources_Stream_Cursor_Input>>;
    where?: InputMaybe<Address_Version_From_Move_Resources_Bool_Exp>;
};
type Subscription_RootBlock_Metadata_TransactionsArgs = {
    distinct_on?: InputMaybe<Array<Block_Metadata_Transactions_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Block_Metadata_Transactions_Order_By>>;
    where?: InputMaybe<Block_Metadata_Transactions_Bool_Exp>;
};
type Subscription_RootBlock_Metadata_Transactions_By_PkArgs = {
    version: Scalars['bigint']['input'];
};
type Subscription_RootBlock_Metadata_Transactions_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Block_Metadata_Transactions_Stream_Cursor_Input>>;
    where?: InputMaybe<Block_Metadata_Transactions_Bool_Exp>;
};
type Subscription_RootCoin_ActivitiesArgs = {
    distinct_on?: InputMaybe<Array<Coin_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Coin_Activities_Order_By>>;
    where?: InputMaybe<Coin_Activities_Bool_Exp>;
};
type Subscription_RootCoin_Activities_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Coin_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Coin_Activities_Order_By>>;
    where?: InputMaybe<Coin_Activities_Bool_Exp>;
};
type Subscription_RootCoin_Activities_By_PkArgs = {
    event_account_address: Scalars['String']['input'];
    event_creation_number: Scalars['bigint']['input'];
    event_sequence_number: Scalars['bigint']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Subscription_RootCoin_Activities_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Coin_Activities_Stream_Cursor_Input>>;
    where?: InputMaybe<Coin_Activities_Bool_Exp>;
};
type Subscription_RootCoin_BalancesArgs = {
    distinct_on?: InputMaybe<Array<Coin_Balances_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Coin_Balances_Order_By>>;
    where?: InputMaybe<Coin_Balances_Bool_Exp>;
};
type Subscription_RootCoin_Balances_By_PkArgs = {
    coin_type_hash: Scalars['String']['input'];
    owner_address: Scalars['String']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Subscription_RootCoin_Balances_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Coin_Balances_Stream_Cursor_Input>>;
    where?: InputMaybe<Coin_Balances_Bool_Exp>;
};
type Subscription_RootCoin_InfosArgs = {
    distinct_on?: InputMaybe<Array<Coin_Infos_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Coin_Infos_Order_By>>;
    where?: InputMaybe<Coin_Infos_Bool_Exp>;
};
type Subscription_RootCoin_Infos_By_PkArgs = {
    coin_type_hash: Scalars['String']['input'];
};
type Subscription_RootCoin_Infos_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Coin_Infos_Stream_Cursor_Input>>;
    where?: InputMaybe<Coin_Infos_Bool_Exp>;
};
type Subscription_RootCoin_SupplyArgs = {
    distinct_on?: InputMaybe<Array<Coin_Supply_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Coin_Supply_Order_By>>;
    where?: InputMaybe<Coin_Supply_Bool_Exp>;
};
type Subscription_RootCoin_Supply_By_PkArgs = {
    coin_type_hash: Scalars['String']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Subscription_RootCoin_Supply_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Coin_Supply_Stream_Cursor_Input>>;
    where?: InputMaybe<Coin_Supply_Bool_Exp>;
};
type Subscription_RootCollection_DatasArgs = {
    distinct_on?: InputMaybe<Array<Collection_Datas_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Collection_Datas_Order_By>>;
    where?: InputMaybe<Collection_Datas_Bool_Exp>;
};
type Subscription_RootCollection_Datas_By_PkArgs = {
    collection_data_id_hash: Scalars['String']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Subscription_RootCollection_Datas_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Collection_Datas_Stream_Cursor_Input>>;
    where?: InputMaybe<Collection_Datas_Bool_Exp>;
};
type Subscription_RootCurrent_Ans_LookupArgs = {
    distinct_on?: InputMaybe<Array<Current_Ans_Lookup_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Ans_Lookup_Order_By>>;
    where?: InputMaybe<Current_Ans_Lookup_Bool_Exp>;
};
type Subscription_RootCurrent_Ans_Lookup_By_PkArgs = {
    domain: Scalars['String']['input'];
    subdomain: Scalars['String']['input'];
};
type Subscription_RootCurrent_Ans_Lookup_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Current_Ans_Lookup_Stream_Cursor_Input>>;
    where?: InputMaybe<Current_Ans_Lookup_Bool_Exp>;
};
type Subscription_RootCurrent_Ans_Lookup_V2Args = {
    distinct_on?: InputMaybe<Array<Current_Ans_Lookup_V2_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Ans_Lookup_V2_Order_By>>;
    where?: InputMaybe<Current_Ans_Lookup_V2_Bool_Exp>;
};
type Subscription_RootCurrent_Ans_Lookup_V2_By_PkArgs = {
    domain: Scalars['String']['input'];
    subdomain: Scalars['String']['input'];
    token_standard: Scalars['String']['input'];
};
type Subscription_RootCurrent_Ans_Lookup_V2_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Current_Ans_Lookup_V2_Stream_Cursor_Input>>;
    where?: InputMaybe<Current_Ans_Lookup_V2_Bool_Exp>;
};
type Subscription_RootCurrent_Aptos_NamesArgs = {
    distinct_on?: InputMaybe<Array<Current_Aptos_Names_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Aptos_Names_Order_By>>;
    where?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
};
type Subscription_RootCurrent_Aptos_Names_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Current_Aptos_Names_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Aptos_Names_Order_By>>;
    where?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
};
type Subscription_RootCurrent_Aptos_Names_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Current_Aptos_Names_Stream_Cursor_Input>>;
    where?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
};
type Subscription_RootCurrent_Coin_BalancesArgs = {
    distinct_on?: InputMaybe<Array<Current_Coin_Balances_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Coin_Balances_Order_By>>;
    where?: InputMaybe<Current_Coin_Balances_Bool_Exp>;
};
type Subscription_RootCurrent_Coin_Balances_By_PkArgs = {
    coin_type_hash: Scalars['String']['input'];
    owner_address: Scalars['String']['input'];
};
type Subscription_RootCurrent_Coin_Balances_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Current_Coin_Balances_Stream_Cursor_Input>>;
    where?: InputMaybe<Current_Coin_Balances_Bool_Exp>;
};
type Subscription_RootCurrent_Collection_DatasArgs = {
    distinct_on?: InputMaybe<Array<Current_Collection_Datas_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Collection_Datas_Order_By>>;
    where?: InputMaybe<Current_Collection_Datas_Bool_Exp>;
};
type Subscription_RootCurrent_Collection_Datas_By_PkArgs = {
    collection_data_id_hash: Scalars['String']['input'];
};
type Subscription_RootCurrent_Collection_Datas_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Current_Collection_Datas_Stream_Cursor_Input>>;
    where?: InputMaybe<Current_Collection_Datas_Bool_Exp>;
};
type Subscription_RootCurrent_Collection_Ownership_V2_ViewArgs = {
    distinct_on?: InputMaybe<Array<Current_Collection_Ownership_V2_View_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Collection_Ownership_V2_View_Order_By>>;
    where?: InputMaybe<Current_Collection_Ownership_V2_View_Bool_Exp>;
};
type Subscription_RootCurrent_Collection_Ownership_V2_View_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Current_Collection_Ownership_V2_View_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Collection_Ownership_V2_View_Order_By>>;
    where?: InputMaybe<Current_Collection_Ownership_V2_View_Bool_Exp>;
};
type Subscription_RootCurrent_Collection_Ownership_V2_View_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Current_Collection_Ownership_V2_View_Stream_Cursor_Input>>;
    where?: InputMaybe<Current_Collection_Ownership_V2_View_Bool_Exp>;
};
type Subscription_RootCurrent_Collections_V2Args = {
    distinct_on?: InputMaybe<Array<Current_Collections_V2_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Collections_V2_Order_By>>;
    where?: InputMaybe<Current_Collections_V2_Bool_Exp>;
};
type Subscription_RootCurrent_Collections_V2_By_PkArgs = {
    collection_id: Scalars['String']['input'];
};
type Subscription_RootCurrent_Collections_V2_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Current_Collections_V2_Stream_Cursor_Input>>;
    where?: InputMaybe<Current_Collections_V2_Bool_Exp>;
};
type Subscription_RootCurrent_Delegated_Staking_Pool_BalancesArgs = {
    distinct_on?: InputMaybe<Array<Current_Delegated_Staking_Pool_Balances_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Delegated_Staking_Pool_Balances_Order_By>>;
    where?: InputMaybe<Current_Delegated_Staking_Pool_Balances_Bool_Exp>;
};
type Subscription_RootCurrent_Delegated_Staking_Pool_Balances_By_PkArgs = {
    staking_pool_address: Scalars['String']['input'];
};
type Subscription_RootCurrent_Delegated_Staking_Pool_Balances_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Current_Delegated_Staking_Pool_Balances_Stream_Cursor_Input>>;
    where?: InputMaybe<Current_Delegated_Staking_Pool_Balances_Bool_Exp>;
};
type Subscription_RootCurrent_Delegated_VoterArgs = {
    distinct_on?: InputMaybe<Array<Current_Delegated_Voter_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Delegated_Voter_Order_By>>;
    where?: InputMaybe<Current_Delegated_Voter_Bool_Exp>;
};
type Subscription_RootCurrent_Delegated_Voter_By_PkArgs = {
    delegation_pool_address: Scalars['String']['input'];
    delegator_address: Scalars['String']['input'];
};
type Subscription_RootCurrent_Delegated_Voter_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Current_Delegated_Voter_Stream_Cursor_Input>>;
    where?: InputMaybe<Current_Delegated_Voter_Bool_Exp>;
};
type Subscription_RootCurrent_Delegator_BalancesArgs = {
    distinct_on?: InputMaybe<Array<Current_Delegator_Balances_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Delegator_Balances_Order_By>>;
    where?: InputMaybe<Current_Delegator_Balances_Bool_Exp>;
};
type Subscription_RootCurrent_Delegator_Balances_By_PkArgs = {
    delegator_address: Scalars['String']['input'];
    pool_address: Scalars['String']['input'];
    pool_type: Scalars['String']['input'];
    table_handle: Scalars['String']['input'];
};
type Subscription_RootCurrent_Delegator_Balances_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Current_Delegator_Balances_Stream_Cursor_Input>>;
    where?: InputMaybe<Current_Delegator_Balances_Bool_Exp>;
};
type Subscription_RootCurrent_Fungible_Asset_BalancesArgs = {
    distinct_on?: InputMaybe<Array<Current_Fungible_Asset_Balances_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Fungible_Asset_Balances_Order_By>>;
    where?: InputMaybe<Current_Fungible_Asset_Balances_Bool_Exp>;
};
type Subscription_RootCurrent_Fungible_Asset_Balances_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Current_Fungible_Asset_Balances_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Fungible_Asset_Balances_Order_By>>;
    where?: InputMaybe<Current_Fungible_Asset_Balances_Bool_Exp>;
};
type Subscription_RootCurrent_Fungible_Asset_Balances_By_PkArgs = {
    storage_id: Scalars['String']['input'];
};
type Subscription_RootCurrent_Fungible_Asset_Balances_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Current_Fungible_Asset_Balances_Stream_Cursor_Input>>;
    where?: InputMaybe<Current_Fungible_Asset_Balances_Bool_Exp>;
};
type Subscription_RootCurrent_ObjectsArgs = {
    distinct_on?: InputMaybe<Array<Current_Objects_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Objects_Order_By>>;
    where?: InputMaybe<Current_Objects_Bool_Exp>;
};
type Subscription_RootCurrent_Objects_By_PkArgs = {
    object_address: Scalars['String']['input'];
};
type Subscription_RootCurrent_Objects_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Current_Objects_Stream_Cursor_Input>>;
    where?: InputMaybe<Current_Objects_Bool_Exp>;
};
type Subscription_RootCurrent_Staking_Pool_VoterArgs = {
    distinct_on?: InputMaybe<Array<Current_Staking_Pool_Voter_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Staking_Pool_Voter_Order_By>>;
    where?: InputMaybe<Current_Staking_Pool_Voter_Bool_Exp>;
};
type Subscription_RootCurrent_Staking_Pool_Voter_By_PkArgs = {
    staking_pool_address: Scalars['String']['input'];
};
type Subscription_RootCurrent_Staking_Pool_Voter_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Current_Staking_Pool_Voter_Stream_Cursor_Input>>;
    where?: InputMaybe<Current_Staking_Pool_Voter_Bool_Exp>;
};
type Subscription_RootCurrent_Table_ItemsArgs = {
    distinct_on?: InputMaybe<Array<Current_Table_Items_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Table_Items_Order_By>>;
    where?: InputMaybe<Current_Table_Items_Bool_Exp>;
};
type Subscription_RootCurrent_Table_Items_By_PkArgs = {
    key_hash: Scalars['String']['input'];
    table_handle: Scalars['String']['input'];
};
type Subscription_RootCurrent_Table_Items_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Current_Table_Items_Stream_Cursor_Input>>;
    where?: InputMaybe<Current_Table_Items_Bool_Exp>;
};
type Subscription_RootCurrent_Token_DatasArgs = {
    distinct_on?: InputMaybe<Array<Current_Token_Datas_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Token_Datas_Order_By>>;
    where?: InputMaybe<Current_Token_Datas_Bool_Exp>;
};
type Subscription_RootCurrent_Token_Datas_By_PkArgs = {
    token_data_id_hash: Scalars['String']['input'];
};
type Subscription_RootCurrent_Token_Datas_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Current_Token_Datas_Stream_Cursor_Input>>;
    where?: InputMaybe<Current_Token_Datas_Bool_Exp>;
};
type Subscription_RootCurrent_Token_Datas_V2Args = {
    distinct_on?: InputMaybe<Array<Current_Token_Datas_V2_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Token_Datas_V2_Order_By>>;
    where?: InputMaybe<Current_Token_Datas_V2_Bool_Exp>;
};
type Subscription_RootCurrent_Token_Datas_V2_By_PkArgs = {
    token_data_id: Scalars['String']['input'];
};
type Subscription_RootCurrent_Token_Datas_V2_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Current_Token_Datas_V2_Stream_Cursor_Input>>;
    where?: InputMaybe<Current_Token_Datas_V2_Bool_Exp>;
};
type Subscription_RootCurrent_Token_OwnershipsArgs = {
    distinct_on?: InputMaybe<Array<Current_Token_Ownerships_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Token_Ownerships_Order_By>>;
    where?: InputMaybe<Current_Token_Ownerships_Bool_Exp>;
};
type Subscription_RootCurrent_Token_Ownerships_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Current_Token_Ownerships_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Token_Ownerships_Order_By>>;
    where?: InputMaybe<Current_Token_Ownerships_Bool_Exp>;
};
type Subscription_RootCurrent_Token_Ownerships_By_PkArgs = {
    owner_address: Scalars['String']['input'];
    property_version: Scalars['numeric']['input'];
    token_data_id_hash: Scalars['String']['input'];
};
type Subscription_RootCurrent_Token_Ownerships_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Current_Token_Ownerships_Stream_Cursor_Input>>;
    where?: InputMaybe<Current_Token_Ownerships_Bool_Exp>;
};
type Subscription_RootCurrent_Token_Ownerships_V2Args = {
    distinct_on?: InputMaybe<Array<Current_Token_Ownerships_V2_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Token_Ownerships_V2_Order_By>>;
    where?: InputMaybe<Current_Token_Ownerships_V2_Bool_Exp>;
};
type Subscription_RootCurrent_Token_Ownerships_V2_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Current_Token_Ownerships_V2_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Token_Ownerships_V2_Order_By>>;
    where?: InputMaybe<Current_Token_Ownerships_V2_Bool_Exp>;
};
type Subscription_RootCurrent_Token_Ownerships_V2_By_PkArgs = {
    owner_address: Scalars['String']['input'];
    property_version_v1: Scalars['numeric']['input'];
    storage_id: Scalars['String']['input'];
    token_data_id: Scalars['String']['input'];
};
type Subscription_RootCurrent_Token_Ownerships_V2_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Current_Token_Ownerships_V2_Stream_Cursor_Input>>;
    where?: InputMaybe<Current_Token_Ownerships_V2_Bool_Exp>;
};
type Subscription_RootCurrent_Token_Pending_ClaimsArgs = {
    distinct_on?: InputMaybe<Array<Current_Token_Pending_Claims_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Token_Pending_Claims_Order_By>>;
    where?: InputMaybe<Current_Token_Pending_Claims_Bool_Exp>;
};
type Subscription_RootCurrent_Token_Pending_Claims_By_PkArgs = {
    from_address: Scalars['String']['input'];
    property_version: Scalars['numeric']['input'];
    to_address: Scalars['String']['input'];
    token_data_id_hash: Scalars['String']['input'];
};
type Subscription_RootCurrent_Token_Pending_Claims_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Current_Token_Pending_Claims_Stream_Cursor_Input>>;
    where?: InputMaybe<Current_Token_Pending_Claims_Bool_Exp>;
};
type Subscription_RootDelegated_Staking_ActivitiesArgs = {
    distinct_on?: InputMaybe<Array<Delegated_Staking_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Delegated_Staking_Activities_Order_By>>;
    where?: InputMaybe<Delegated_Staking_Activities_Bool_Exp>;
};
type Subscription_RootDelegated_Staking_Activities_By_PkArgs = {
    event_index: Scalars['bigint']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Subscription_RootDelegated_Staking_Activities_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Delegated_Staking_Activities_Stream_Cursor_Input>>;
    where?: InputMaybe<Delegated_Staking_Activities_Bool_Exp>;
};
type Subscription_RootDelegated_Staking_PoolsArgs = {
    distinct_on?: InputMaybe<Array<Delegated_Staking_Pools_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Delegated_Staking_Pools_Order_By>>;
    where?: InputMaybe<Delegated_Staking_Pools_Bool_Exp>;
};
type Subscription_RootDelegated_Staking_Pools_By_PkArgs = {
    staking_pool_address: Scalars['String']['input'];
};
type Subscription_RootDelegated_Staking_Pools_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Delegated_Staking_Pools_Stream_Cursor_Input>>;
    where?: InputMaybe<Delegated_Staking_Pools_Bool_Exp>;
};
type Subscription_RootDelegator_Distinct_PoolArgs = {
    distinct_on?: InputMaybe<Array<Delegator_Distinct_Pool_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Delegator_Distinct_Pool_Order_By>>;
    where?: InputMaybe<Delegator_Distinct_Pool_Bool_Exp>;
};
type Subscription_RootDelegator_Distinct_Pool_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Delegator_Distinct_Pool_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Delegator_Distinct_Pool_Order_By>>;
    where?: InputMaybe<Delegator_Distinct_Pool_Bool_Exp>;
};
type Subscription_RootDelegator_Distinct_Pool_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Delegator_Distinct_Pool_Stream_Cursor_Input>>;
    where?: InputMaybe<Delegator_Distinct_Pool_Bool_Exp>;
};
type Subscription_RootEventsArgs = {
    distinct_on?: InputMaybe<Array<Events_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Events_Order_By>>;
    where?: InputMaybe<Events_Bool_Exp>;
};
type Subscription_RootEvents_By_PkArgs = {
    event_index: Scalars['bigint']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Subscription_RootEvents_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Events_Stream_Cursor_Input>>;
    where?: InputMaybe<Events_Bool_Exp>;
};
type Subscription_RootFungible_Asset_ActivitiesArgs = {
    distinct_on?: InputMaybe<Array<Fungible_Asset_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Fungible_Asset_Activities_Order_By>>;
    where?: InputMaybe<Fungible_Asset_Activities_Bool_Exp>;
};
type Subscription_RootFungible_Asset_Activities_By_PkArgs = {
    event_index: Scalars['bigint']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Subscription_RootFungible_Asset_Activities_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Fungible_Asset_Activities_Stream_Cursor_Input>>;
    where?: InputMaybe<Fungible_Asset_Activities_Bool_Exp>;
};
type Subscription_RootFungible_Asset_MetadataArgs = {
    distinct_on?: InputMaybe<Array<Fungible_Asset_Metadata_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Fungible_Asset_Metadata_Order_By>>;
    where?: InputMaybe<Fungible_Asset_Metadata_Bool_Exp>;
};
type Subscription_RootFungible_Asset_Metadata_By_PkArgs = {
    asset_type: Scalars['String']['input'];
};
type Subscription_RootFungible_Asset_Metadata_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Fungible_Asset_Metadata_Stream_Cursor_Input>>;
    where?: InputMaybe<Fungible_Asset_Metadata_Bool_Exp>;
};
type Subscription_RootIndexer_StatusArgs = {
    distinct_on?: InputMaybe<Array<Indexer_Status_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Indexer_Status_Order_By>>;
    where?: InputMaybe<Indexer_Status_Bool_Exp>;
};
type Subscription_RootIndexer_Status_By_PkArgs = {
    db: Scalars['String']['input'];
};
type Subscription_RootIndexer_Status_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Indexer_Status_Stream_Cursor_Input>>;
    where?: InputMaybe<Indexer_Status_Bool_Exp>;
};
type Subscription_RootLedger_InfosArgs = {
    distinct_on?: InputMaybe<Array<Ledger_Infos_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Ledger_Infos_Order_By>>;
    where?: InputMaybe<Ledger_Infos_Bool_Exp>;
};
type Subscription_RootLedger_Infos_By_PkArgs = {
    chain_id: Scalars['bigint']['input'];
};
type Subscription_RootLedger_Infos_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Ledger_Infos_Stream_Cursor_Input>>;
    where?: InputMaybe<Ledger_Infos_Bool_Exp>;
};
type Subscription_RootMove_ResourcesArgs = {
    distinct_on?: InputMaybe<Array<Move_Resources_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Move_Resources_Order_By>>;
    where?: InputMaybe<Move_Resources_Bool_Exp>;
};
type Subscription_RootMove_Resources_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Move_Resources_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Move_Resources_Order_By>>;
    where?: InputMaybe<Move_Resources_Bool_Exp>;
};
type Subscription_RootMove_Resources_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Move_Resources_Stream_Cursor_Input>>;
    where?: InputMaybe<Move_Resources_Bool_Exp>;
};
type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_AuctionsArgs = {
    distinct_on?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Order_By>>;
    where?: InputMaybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Bool_Exp>;
};
type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_Auctions_By_PkArgs = {
    listing_id: Scalars['String']['input'];
    token_data_id: Scalars['String']['input'];
};
type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_Auctions_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Stream_Cursor_Input>>;
    where?: InputMaybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Bool_Exp>;
};
type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_Collection_OffersArgs = {
    distinct_on?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Order_By>>;
    where?: InputMaybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Bool_Exp>;
};
type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_By_PkArgs = {
    collection_id: Scalars['String']['input'];
    collection_offer_id: Scalars['String']['input'];
};
type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Stream_Cursor_Input>>;
    where?: InputMaybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Bool_Exp>;
};
type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_ListingsArgs = {
    distinct_on?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Order_By>>;
    where?: InputMaybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Bool_Exp>;
};
type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_Listings_By_PkArgs = {
    listing_id: Scalars['String']['input'];
    token_data_id: Scalars['String']['input'];
};
type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_Listings_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Stream_Cursor_Input>>;
    where?: InputMaybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Bool_Exp>;
};
type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_Token_OffersArgs = {
    distinct_on?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Order_By>>;
    where?: InputMaybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Bool_Exp>;
};
type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_By_PkArgs = {
    offer_id: Scalars['String']['input'];
    token_data_id: Scalars['String']['input'];
};
type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Stream_Cursor_Input>>;
    where?: InputMaybe<Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Bool_Exp>;
};
type Subscription_RootNft_Marketplace_V2_Nft_Marketplace_ActivitiesArgs = {
    distinct_on?: InputMaybe<Array<Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Nft_Marketplace_V2_Nft_Marketplace_Activities_Order_By>>;
    where?: InputMaybe<Nft_Marketplace_V2_Nft_Marketplace_Activities_Bool_Exp>;
};
type Subscription_RootNft_Marketplace_V2_Nft_Marketplace_Activities_By_PkArgs = {
    event_index: Scalars['bigint']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Subscription_RootNft_Marketplace_V2_Nft_Marketplace_Activities_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Nft_Marketplace_V2_Nft_Marketplace_Activities_Stream_Cursor_Input>>;
    where?: InputMaybe<Nft_Marketplace_V2_Nft_Marketplace_Activities_Bool_Exp>;
};
type Subscription_RootNft_Metadata_Crawler_Parsed_Asset_UrisArgs = {
    distinct_on?: InputMaybe<Array<Nft_Metadata_Crawler_Parsed_Asset_Uris_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Nft_Metadata_Crawler_Parsed_Asset_Uris_Order_By>>;
    where?: InputMaybe<Nft_Metadata_Crawler_Parsed_Asset_Uris_Bool_Exp>;
};
type Subscription_RootNft_Metadata_Crawler_Parsed_Asset_Uris_By_PkArgs = {
    asset_uri: Scalars['String']['input'];
};
type Subscription_RootNft_Metadata_Crawler_Parsed_Asset_Uris_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Nft_Metadata_Crawler_Parsed_Asset_Uris_Stream_Cursor_Input>>;
    where?: InputMaybe<Nft_Metadata_Crawler_Parsed_Asset_Uris_Bool_Exp>;
};
type Subscription_RootNum_Active_Delegator_Per_PoolArgs = {
    distinct_on?: InputMaybe<Array<Num_Active_Delegator_Per_Pool_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Num_Active_Delegator_Per_Pool_Order_By>>;
    where?: InputMaybe<Num_Active_Delegator_Per_Pool_Bool_Exp>;
};
type Subscription_RootNum_Active_Delegator_Per_Pool_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Num_Active_Delegator_Per_Pool_Stream_Cursor_Input>>;
    where?: InputMaybe<Num_Active_Delegator_Per_Pool_Bool_Exp>;
};
type Subscription_RootProcessor_StatusArgs = {
    distinct_on?: InputMaybe<Array<Processor_Status_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Processor_Status_Order_By>>;
    where?: InputMaybe<Processor_Status_Bool_Exp>;
};
type Subscription_RootProcessor_Status_By_PkArgs = {
    processor: Scalars['String']['input'];
};
type Subscription_RootProcessor_Status_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Processor_Status_Stream_Cursor_Input>>;
    where?: InputMaybe<Processor_Status_Bool_Exp>;
};
type Subscription_RootProposal_VotesArgs = {
    distinct_on?: InputMaybe<Array<Proposal_Votes_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Proposal_Votes_Order_By>>;
    where?: InputMaybe<Proposal_Votes_Bool_Exp>;
};
type Subscription_RootProposal_Votes_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Proposal_Votes_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Proposal_Votes_Order_By>>;
    where?: InputMaybe<Proposal_Votes_Bool_Exp>;
};
type Subscription_RootProposal_Votes_By_PkArgs = {
    proposal_id: Scalars['bigint']['input'];
    transaction_version: Scalars['bigint']['input'];
    voter_address: Scalars['String']['input'];
};
type Subscription_RootProposal_Votes_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Proposal_Votes_Stream_Cursor_Input>>;
    where?: InputMaybe<Proposal_Votes_Bool_Exp>;
};
type Subscription_RootTable_ItemsArgs = {
    distinct_on?: InputMaybe<Array<Table_Items_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Table_Items_Order_By>>;
    where?: InputMaybe<Table_Items_Bool_Exp>;
};
type Subscription_RootTable_Items_By_PkArgs = {
    transaction_version: Scalars['bigint']['input'];
    write_set_change_index: Scalars['bigint']['input'];
};
type Subscription_RootTable_Items_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Table_Items_Stream_Cursor_Input>>;
    where?: InputMaybe<Table_Items_Bool_Exp>;
};
type Subscription_RootTable_MetadatasArgs = {
    distinct_on?: InputMaybe<Array<Table_Metadatas_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Table_Metadatas_Order_By>>;
    where?: InputMaybe<Table_Metadatas_Bool_Exp>;
};
type Subscription_RootTable_Metadatas_By_PkArgs = {
    handle: Scalars['String']['input'];
};
type Subscription_RootTable_Metadatas_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Table_Metadatas_Stream_Cursor_Input>>;
    where?: InputMaybe<Table_Metadatas_Bool_Exp>;
};
type Subscription_RootToken_ActivitiesArgs = {
    distinct_on?: InputMaybe<Array<Token_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Activities_Order_By>>;
    where?: InputMaybe<Token_Activities_Bool_Exp>;
};
type Subscription_RootToken_Activities_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Token_Activities_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Activities_Order_By>>;
    where?: InputMaybe<Token_Activities_Bool_Exp>;
};
type Subscription_RootToken_Activities_By_PkArgs = {
    event_account_address: Scalars['String']['input'];
    event_creation_number: Scalars['bigint']['input'];
    event_sequence_number: Scalars['bigint']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Subscription_RootToken_Activities_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Token_Activities_Stream_Cursor_Input>>;
    where?: InputMaybe<Token_Activities_Bool_Exp>;
};
type Subscription_RootToken_Activities_V2Args = {
    distinct_on?: InputMaybe<Array<Token_Activities_V2_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Activities_V2_Order_By>>;
    where?: InputMaybe<Token_Activities_V2_Bool_Exp>;
};
type Subscription_RootToken_Activities_V2_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Token_Activities_V2_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Activities_V2_Order_By>>;
    where?: InputMaybe<Token_Activities_V2_Bool_Exp>;
};
type Subscription_RootToken_Activities_V2_By_PkArgs = {
    event_index: Scalars['bigint']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Subscription_RootToken_Activities_V2_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Token_Activities_V2_Stream_Cursor_Input>>;
    where?: InputMaybe<Token_Activities_V2_Bool_Exp>;
};
type Subscription_RootToken_DatasArgs = {
    distinct_on?: InputMaybe<Array<Token_Datas_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Datas_Order_By>>;
    where?: InputMaybe<Token_Datas_Bool_Exp>;
};
type Subscription_RootToken_Datas_By_PkArgs = {
    token_data_id_hash: Scalars['String']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Subscription_RootToken_Datas_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Token_Datas_Stream_Cursor_Input>>;
    where?: InputMaybe<Token_Datas_Bool_Exp>;
};
type Subscription_RootToken_OwnershipsArgs = {
    distinct_on?: InputMaybe<Array<Token_Ownerships_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Token_Ownerships_Order_By>>;
    where?: InputMaybe<Token_Ownerships_Bool_Exp>;
};
type Subscription_RootToken_Ownerships_By_PkArgs = {
    property_version: Scalars['numeric']['input'];
    table_handle: Scalars['String']['input'];
    token_data_id_hash: Scalars['String']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Subscription_RootToken_Ownerships_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Token_Ownerships_Stream_Cursor_Input>>;
    where?: InputMaybe<Token_Ownerships_Bool_Exp>;
};
type Subscription_RootTokensArgs = {
    distinct_on?: InputMaybe<Array<Tokens_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Tokens_Order_By>>;
    where?: InputMaybe<Tokens_Bool_Exp>;
};
type Subscription_RootTokens_By_PkArgs = {
    property_version: Scalars['numeric']['input'];
    token_data_id_hash: Scalars['String']['input'];
    transaction_version: Scalars['bigint']['input'];
};
type Subscription_RootTokens_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<Tokens_Stream_Cursor_Input>>;
    where?: InputMaybe<Tokens_Bool_Exp>;
};
type Subscription_RootUser_TransactionsArgs = {
    distinct_on?: InputMaybe<Array<User_Transactions_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<User_Transactions_Order_By>>;
    where?: InputMaybe<User_Transactions_Bool_Exp>;
};
type Subscription_RootUser_Transactions_By_PkArgs = {
    version: Scalars['bigint']['input'];
};
type Subscription_RootUser_Transactions_StreamArgs = {
    batch_size: Scalars['Int']['input'];
    cursor: Array<InputMaybe<User_Transactions_Stream_Cursor_Input>>;
    where?: InputMaybe<User_Transactions_Bool_Exp>;
};
/** columns and relationships of "table_items" */
type Table_Items = {
    __typename?: 'table_items';
    decoded_key: Scalars['jsonb']['output'];
    decoded_value?: Maybe<Scalars['jsonb']['output']>;
    key: Scalars['String']['output'];
    table_handle: Scalars['String']['output'];
    transaction_version: Scalars['bigint']['output'];
    write_set_change_index: Scalars['bigint']['output'];
};
/** columns and relationships of "table_items" */
type Table_ItemsDecoded_KeyArgs = {
    path?: InputMaybe<Scalars['String']['input']>;
};
/** columns and relationships of "table_items" */
type Table_ItemsDecoded_ValueArgs = {
    path?: InputMaybe<Scalars['String']['input']>;
};
/** Boolean expression to filter rows from the table "table_items". All fields are combined with a logical 'AND'. */
type Table_Items_Bool_Exp = {
    _and?: InputMaybe<Array<Table_Items_Bool_Exp>>;
    _not?: InputMaybe<Table_Items_Bool_Exp>;
    _or?: InputMaybe<Array<Table_Items_Bool_Exp>>;
    decoded_key?: InputMaybe<Jsonb_Comparison_Exp>;
    decoded_value?: InputMaybe<Jsonb_Comparison_Exp>;
    key?: InputMaybe<String_Comparison_Exp>;
    table_handle?: InputMaybe<String_Comparison_Exp>;
    transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    write_set_change_index?: InputMaybe<Bigint_Comparison_Exp>;
};
/** Ordering options when selecting data from "table_items". */
type Table_Items_Order_By = {
    decoded_key?: InputMaybe<Order_By>;
    decoded_value?: InputMaybe<Order_By>;
    key?: InputMaybe<Order_By>;
    table_handle?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
    write_set_change_index?: InputMaybe<Order_By>;
};
/** select columns of table "table_items" */
declare enum Table_Items_Select_Column {
    /** column name */
    DecodedKey = "decoded_key",
    /** column name */
    DecodedValue = "decoded_value",
    /** column name */
    Key = "key",
    /** column name */
    TableHandle = "table_handle",
    /** column name */
    TransactionVersion = "transaction_version",
    /** column name */
    WriteSetChangeIndex = "write_set_change_index"
}
/** Streaming cursor of the table "table_items" */
type Table_Items_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Table_Items_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Table_Items_Stream_Cursor_Value_Input = {
    decoded_key?: InputMaybe<Scalars['jsonb']['input']>;
    decoded_value?: InputMaybe<Scalars['jsonb']['input']>;
    key?: InputMaybe<Scalars['String']['input']>;
    table_handle?: InputMaybe<Scalars['String']['input']>;
    transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    write_set_change_index?: InputMaybe<Scalars['bigint']['input']>;
};
/** columns and relationships of "table_metadatas" */
type Table_Metadatas = {
    __typename?: 'table_metadatas';
    handle: Scalars['String']['output'];
    key_type: Scalars['String']['output'];
    value_type: Scalars['String']['output'];
};
/** Boolean expression to filter rows from the table "table_metadatas". All fields are combined with a logical 'AND'. */
type Table_Metadatas_Bool_Exp = {
    _and?: InputMaybe<Array<Table_Metadatas_Bool_Exp>>;
    _not?: InputMaybe<Table_Metadatas_Bool_Exp>;
    _or?: InputMaybe<Array<Table_Metadatas_Bool_Exp>>;
    handle?: InputMaybe<String_Comparison_Exp>;
    key_type?: InputMaybe<String_Comparison_Exp>;
    value_type?: InputMaybe<String_Comparison_Exp>;
};
/** Ordering options when selecting data from "table_metadatas". */
type Table_Metadatas_Order_By = {
    handle?: InputMaybe<Order_By>;
    key_type?: InputMaybe<Order_By>;
    value_type?: InputMaybe<Order_By>;
};
/** select columns of table "table_metadatas" */
declare enum Table_Metadatas_Select_Column {
    /** column name */
    Handle = "handle",
    /** column name */
    KeyType = "key_type",
    /** column name */
    ValueType = "value_type"
}
/** Streaming cursor of the table "table_metadatas" */
type Table_Metadatas_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Table_Metadatas_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Table_Metadatas_Stream_Cursor_Value_Input = {
    handle?: InputMaybe<Scalars['String']['input']>;
    key_type?: InputMaybe<Scalars['String']['input']>;
    value_type?: InputMaybe<Scalars['String']['input']>;
};
/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
type Timestamp_Comparison_Exp = {
    _eq?: InputMaybe<Scalars['timestamp']['input']>;
    _gt?: InputMaybe<Scalars['timestamp']['input']>;
    _gte?: InputMaybe<Scalars['timestamp']['input']>;
    _in?: InputMaybe<Array<Scalars['timestamp']['input']>>;
    _is_null?: InputMaybe<Scalars['Boolean']['input']>;
    _lt?: InputMaybe<Scalars['timestamp']['input']>;
    _lte?: InputMaybe<Scalars['timestamp']['input']>;
    _neq?: InputMaybe<Scalars['timestamp']['input']>;
    _nin?: InputMaybe<Array<Scalars['timestamp']['input']>>;
};
/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
type Timestamptz_Comparison_Exp = {
    _eq?: InputMaybe<Scalars['timestamptz']['input']>;
    _gt?: InputMaybe<Scalars['timestamptz']['input']>;
    _gte?: InputMaybe<Scalars['timestamptz']['input']>;
    _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
    _is_null?: InputMaybe<Scalars['Boolean']['input']>;
    _lt?: InputMaybe<Scalars['timestamptz']['input']>;
    _lte?: InputMaybe<Scalars['timestamptz']['input']>;
    _neq?: InputMaybe<Scalars['timestamptz']['input']>;
    _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
};
/** columns and relationships of "token_activities" */
type Token_Activities = {
    __typename?: 'token_activities';
    /** An array relationship */
    aptos_names_owner: Array<Current_Aptos_Names>;
    /** An aggregate relationship */
    aptos_names_owner_aggregate: Current_Aptos_Names_Aggregate;
    /** An array relationship */
    aptos_names_to: Array<Current_Aptos_Names>;
    /** An aggregate relationship */
    aptos_names_to_aggregate: Current_Aptos_Names_Aggregate;
    coin_amount?: Maybe<Scalars['numeric']['output']>;
    coin_type?: Maybe<Scalars['String']['output']>;
    collection_data_id_hash: Scalars['String']['output'];
    collection_name: Scalars['String']['output'];
    creator_address: Scalars['String']['output'];
    /** An object relationship */
    current_token_data?: Maybe<Current_Token_Datas>;
    event_account_address: Scalars['String']['output'];
    event_creation_number: Scalars['bigint']['output'];
    event_index?: Maybe<Scalars['bigint']['output']>;
    event_sequence_number: Scalars['bigint']['output'];
    from_address?: Maybe<Scalars['String']['output']>;
    name: Scalars['String']['output'];
    property_version: Scalars['numeric']['output'];
    to_address?: Maybe<Scalars['String']['output']>;
    token_amount: Scalars['numeric']['output'];
    token_data_id_hash: Scalars['String']['output'];
    transaction_timestamp: Scalars['timestamp']['output'];
    transaction_version: Scalars['bigint']['output'];
    transfer_type: Scalars['String']['output'];
};
/** columns and relationships of "token_activities" */
type Token_ActivitiesAptos_Names_OwnerArgs = {
    distinct_on?: InputMaybe<Array<Current_Aptos_Names_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Aptos_Names_Order_By>>;
    where?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
};
/** columns and relationships of "token_activities" */
type Token_ActivitiesAptos_Names_Owner_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Current_Aptos_Names_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Aptos_Names_Order_By>>;
    where?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
};
/** columns and relationships of "token_activities" */
type Token_ActivitiesAptos_Names_ToArgs = {
    distinct_on?: InputMaybe<Array<Current_Aptos_Names_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Aptos_Names_Order_By>>;
    where?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
};
/** columns and relationships of "token_activities" */
type Token_ActivitiesAptos_Names_To_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Current_Aptos_Names_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Aptos_Names_Order_By>>;
    where?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
};
/** aggregated selection of "token_activities" */
type Token_Activities_Aggregate = {
    __typename?: 'token_activities_aggregate';
    aggregate?: Maybe<Token_Activities_Aggregate_Fields>;
    nodes: Array<Token_Activities>;
};
/** aggregate fields of "token_activities" */
type Token_Activities_Aggregate_Fields = {
    __typename?: 'token_activities_aggregate_fields';
    avg?: Maybe<Token_Activities_Avg_Fields>;
    count: Scalars['Int']['output'];
    max?: Maybe<Token_Activities_Max_Fields>;
    min?: Maybe<Token_Activities_Min_Fields>;
    stddev?: Maybe<Token_Activities_Stddev_Fields>;
    stddev_pop?: Maybe<Token_Activities_Stddev_Pop_Fields>;
    stddev_samp?: Maybe<Token_Activities_Stddev_Samp_Fields>;
    sum?: Maybe<Token_Activities_Sum_Fields>;
    var_pop?: Maybe<Token_Activities_Var_Pop_Fields>;
    var_samp?: Maybe<Token_Activities_Var_Samp_Fields>;
    variance?: Maybe<Token_Activities_Variance_Fields>;
};
/** aggregate fields of "token_activities" */
type Token_Activities_Aggregate_FieldsCountArgs = {
    columns?: InputMaybe<Array<Token_Activities_Select_Column>>;
    distinct?: InputMaybe<Scalars['Boolean']['input']>;
};
/** order by aggregate values of table "token_activities" */
type Token_Activities_Aggregate_Order_By = {
    avg?: InputMaybe<Token_Activities_Avg_Order_By>;
    count?: InputMaybe<Order_By>;
    max?: InputMaybe<Token_Activities_Max_Order_By>;
    min?: InputMaybe<Token_Activities_Min_Order_By>;
    stddev?: InputMaybe<Token_Activities_Stddev_Order_By>;
    stddev_pop?: InputMaybe<Token_Activities_Stddev_Pop_Order_By>;
    stddev_samp?: InputMaybe<Token_Activities_Stddev_Samp_Order_By>;
    sum?: InputMaybe<Token_Activities_Sum_Order_By>;
    var_pop?: InputMaybe<Token_Activities_Var_Pop_Order_By>;
    var_samp?: InputMaybe<Token_Activities_Var_Samp_Order_By>;
    variance?: InputMaybe<Token_Activities_Variance_Order_By>;
};
/** aggregate avg on columns */
type Token_Activities_Avg_Fields = {
    __typename?: 'token_activities_avg_fields';
    coin_amount?: Maybe<Scalars['Float']['output']>;
    event_creation_number?: Maybe<Scalars['Float']['output']>;
    event_index?: Maybe<Scalars['Float']['output']>;
    event_sequence_number?: Maybe<Scalars['Float']['output']>;
    property_version?: Maybe<Scalars['Float']['output']>;
    token_amount?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by avg() on columns of table "token_activities" */
type Token_Activities_Avg_Order_By = {
    coin_amount?: InputMaybe<Order_By>;
    event_creation_number?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_sequence_number?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** Boolean expression to filter rows from the table "token_activities". All fields are combined with a logical 'AND'. */
type Token_Activities_Bool_Exp = {
    _and?: InputMaybe<Array<Token_Activities_Bool_Exp>>;
    _not?: InputMaybe<Token_Activities_Bool_Exp>;
    _or?: InputMaybe<Array<Token_Activities_Bool_Exp>>;
    aptos_names_owner?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
    aptos_names_to?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
    coin_amount?: InputMaybe<Numeric_Comparison_Exp>;
    coin_type?: InputMaybe<String_Comparison_Exp>;
    collection_data_id_hash?: InputMaybe<String_Comparison_Exp>;
    collection_name?: InputMaybe<String_Comparison_Exp>;
    creator_address?: InputMaybe<String_Comparison_Exp>;
    current_token_data?: InputMaybe<Current_Token_Datas_Bool_Exp>;
    event_account_address?: InputMaybe<String_Comparison_Exp>;
    event_creation_number?: InputMaybe<Bigint_Comparison_Exp>;
    event_index?: InputMaybe<Bigint_Comparison_Exp>;
    event_sequence_number?: InputMaybe<Bigint_Comparison_Exp>;
    from_address?: InputMaybe<String_Comparison_Exp>;
    name?: InputMaybe<String_Comparison_Exp>;
    property_version?: InputMaybe<Numeric_Comparison_Exp>;
    to_address?: InputMaybe<String_Comparison_Exp>;
    token_amount?: InputMaybe<Numeric_Comparison_Exp>;
    token_data_id_hash?: InputMaybe<String_Comparison_Exp>;
    transaction_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    transfer_type?: InputMaybe<String_Comparison_Exp>;
};
/** aggregate max on columns */
type Token_Activities_Max_Fields = {
    __typename?: 'token_activities_max_fields';
    coin_amount?: Maybe<Scalars['numeric']['output']>;
    coin_type?: Maybe<Scalars['String']['output']>;
    collection_data_id_hash?: Maybe<Scalars['String']['output']>;
    collection_name?: Maybe<Scalars['String']['output']>;
    creator_address?: Maybe<Scalars['String']['output']>;
    event_account_address?: Maybe<Scalars['String']['output']>;
    event_creation_number?: Maybe<Scalars['bigint']['output']>;
    event_index?: Maybe<Scalars['bigint']['output']>;
    event_sequence_number?: Maybe<Scalars['bigint']['output']>;
    from_address?: Maybe<Scalars['String']['output']>;
    name?: Maybe<Scalars['String']['output']>;
    property_version?: Maybe<Scalars['numeric']['output']>;
    to_address?: Maybe<Scalars['String']['output']>;
    token_amount?: Maybe<Scalars['numeric']['output']>;
    token_data_id_hash?: Maybe<Scalars['String']['output']>;
    transaction_timestamp?: Maybe<Scalars['timestamp']['output']>;
    transaction_version?: Maybe<Scalars['bigint']['output']>;
    transfer_type?: Maybe<Scalars['String']['output']>;
};
/** order by max() on columns of table "token_activities" */
type Token_Activities_Max_Order_By = {
    coin_amount?: InputMaybe<Order_By>;
    coin_type?: InputMaybe<Order_By>;
    collection_data_id_hash?: InputMaybe<Order_By>;
    collection_name?: InputMaybe<Order_By>;
    creator_address?: InputMaybe<Order_By>;
    event_account_address?: InputMaybe<Order_By>;
    event_creation_number?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_sequence_number?: InputMaybe<Order_By>;
    from_address?: InputMaybe<Order_By>;
    name?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
    to_address?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    token_data_id_hash?: InputMaybe<Order_By>;
    transaction_timestamp?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
    transfer_type?: InputMaybe<Order_By>;
};
/** aggregate min on columns */
type Token_Activities_Min_Fields = {
    __typename?: 'token_activities_min_fields';
    coin_amount?: Maybe<Scalars['numeric']['output']>;
    coin_type?: Maybe<Scalars['String']['output']>;
    collection_data_id_hash?: Maybe<Scalars['String']['output']>;
    collection_name?: Maybe<Scalars['String']['output']>;
    creator_address?: Maybe<Scalars['String']['output']>;
    event_account_address?: Maybe<Scalars['String']['output']>;
    event_creation_number?: Maybe<Scalars['bigint']['output']>;
    event_index?: Maybe<Scalars['bigint']['output']>;
    event_sequence_number?: Maybe<Scalars['bigint']['output']>;
    from_address?: Maybe<Scalars['String']['output']>;
    name?: Maybe<Scalars['String']['output']>;
    property_version?: Maybe<Scalars['numeric']['output']>;
    to_address?: Maybe<Scalars['String']['output']>;
    token_amount?: Maybe<Scalars['numeric']['output']>;
    token_data_id_hash?: Maybe<Scalars['String']['output']>;
    transaction_timestamp?: Maybe<Scalars['timestamp']['output']>;
    transaction_version?: Maybe<Scalars['bigint']['output']>;
    transfer_type?: Maybe<Scalars['String']['output']>;
};
/** order by min() on columns of table "token_activities" */
type Token_Activities_Min_Order_By = {
    coin_amount?: InputMaybe<Order_By>;
    coin_type?: InputMaybe<Order_By>;
    collection_data_id_hash?: InputMaybe<Order_By>;
    collection_name?: InputMaybe<Order_By>;
    creator_address?: InputMaybe<Order_By>;
    event_account_address?: InputMaybe<Order_By>;
    event_creation_number?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_sequence_number?: InputMaybe<Order_By>;
    from_address?: InputMaybe<Order_By>;
    name?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
    to_address?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    token_data_id_hash?: InputMaybe<Order_By>;
    transaction_timestamp?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
    transfer_type?: InputMaybe<Order_By>;
};
/** Ordering options when selecting data from "token_activities". */
type Token_Activities_Order_By = {
    aptos_names_owner_aggregate?: InputMaybe<Current_Aptos_Names_Aggregate_Order_By>;
    aptos_names_to_aggregate?: InputMaybe<Current_Aptos_Names_Aggregate_Order_By>;
    coin_amount?: InputMaybe<Order_By>;
    coin_type?: InputMaybe<Order_By>;
    collection_data_id_hash?: InputMaybe<Order_By>;
    collection_name?: InputMaybe<Order_By>;
    creator_address?: InputMaybe<Order_By>;
    current_token_data?: InputMaybe<Current_Token_Datas_Order_By>;
    event_account_address?: InputMaybe<Order_By>;
    event_creation_number?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_sequence_number?: InputMaybe<Order_By>;
    from_address?: InputMaybe<Order_By>;
    name?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
    to_address?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    token_data_id_hash?: InputMaybe<Order_By>;
    transaction_timestamp?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
    transfer_type?: InputMaybe<Order_By>;
};
/** select columns of table "token_activities" */
declare enum Token_Activities_Select_Column {
    /** column name */
    CoinAmount = "coin_amount",
    /** column name */
    CoinType = "coin_type",
    /** column name */
    CollectionDataIdHash = "collection_data_id_hash",
    /** column name */
    CollectionName = "collection_name",
    /** column name */
    CreatorAddress = "creator_address",
    /** column name */
    EventAccountAddress = "event_account_address",
    /** column name */
    EventCreationNumber = "event_creation_number",
    /** column name */
    EventIndex = "event_index",
    /** column name */
    EventSequenceNumber = "event_sequence_number",
    /** column name */
    FromAddress = "from_address",
    /** column name */
    Name = "name",
    /** column name */
    PropertyVersion = "property_version",
    /** column name */
    ToAddress = "to_address",
    /** column name */
    TokenAmount = "token_amount",
    /** column name */
    TokenDataIdHash = "token_data_id_hash",
    /** column name */
    TransactionTimestamp = "transaction_timestamp",
    /** column name */
    TransactionVersion = "transaction_version",
    /** column name */
    TransferType = "transfer_type"
}
/** aggregate stddev on columns */
type Token_Activities_Stddev_Fields = {
    __typename?: 'token_activities_stddev_fields';
    coin_amount?: Maybe<Scalars['Float']['output']>;
    event_creation_number?: Maybe<Scalars['Float']['output']>;
    event_index?: Maybe<Scalars['Float']['output']>;
    event_sequence_number?: Maybe<Scalars['Float']['output']>;
    property_version?: Maybe<Scalars['Float']['output']>;
    token_amount?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by stddev() on columns of table "token_activities" */
type Token_Activities_Stddev_Order_By = {
    coin_amount?: InputMaybe<Order_By>;
    event_creation_number?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_sequence_number?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** aggregate stddev_pop on columns */
type Token_Activities_Stddev_Pop_Fields = {
    __typename?: 'token_activities_stddev_pop_fields';
    coin_amount?: Maybe<Scalars['Float']['output']>;
    event_creation_number?: Maybe<Scalars['Float']['output']>;
    event_index?: Maybe<Scalars['Float']['output']>;
    event_sequence_number?: Maybe<Scalars['Float']['output']>;
    property_version?: Maybe<Scalars['Float']['output']>;
    token_amount?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by stddev_pop() on columns of table "token_activities" */
type Token_Activities_Stddev_Pop_Order_By = {
    coin_amount?: InputMaybe<Order_By>;
    event_creation_number?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_sequence_number?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** aggregate stddev_samp on columns */
type Token_Activities_Stddev_Samp_Fields = {
    __typename?: 'token_activities_stddev_samp_fields';
    coin_amount?: Maybe<Scalars['Float']['output']>;
    event_creation_number?: Maybe<Scalars['Float']['output']>;
    event_index?: Maybe<Scalars['Float']['output']>;
    event_sequence_number?: Maybe<Scalars['Float']['output']>;
    property_version?: Maybe<Scalars['Float']['output']>;
    token_amount?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by stddev_samp() on columns of table "token_activities" */
type Token_Activities_Stddev_Samp_Order_By = {
    coin_amount?: InputMaybe<Order_By>;
    event_creation_number?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_sequence_number?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** Streaming cursor of the table "token_activities" */
type Token_Activities_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Token_Activities_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Token_Activities_Stream_Cursor_Value_Input = {
    coin_amount?: InputMaybe<Scalars['numeric']['input']>;
    coin_type?: InputMaybe<Scalars['String']['input']>;
    collection_data_id_hash?: InputMaybe<Scalars['String']['input']>;
    collection_name?: InputMaybe<Scalars['String']['input']>;
    creator_address?: InputMaybe<Scalars['String']['input']>;
    event_account_address?: InputMaybe<Scalars['String']['input']>;
    event_creation_number?: InputMaybe<Scalars['bigint']['input']>;
    event_index?: InputMaybe<Scalars['bigint']['input']>;
    event_sequence_number?: InputMaybe<Scalars['bigint']['input']>;
    from_address?: InputMaybe<Scalars['String']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
    property_version?: InputMaybe<Scalars['numeric']['input']>;
    to_address?: InputMaybe<Scalars['String']['input']>;
    token_amount?: InputMaybe<Scalars['numeric']['input']>;
    token_data_id_hash?: InputMaybe<Scalars['String']['input']>;
    transaction_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    transfer_type?: InputMaybe<Scalars['String']['input']>;
};
/** aggregate sum on columns */
type Token_Activities_Sum_Fields = {
    __typename?: 'token_activities_sum_fields';
    coin_amount?: Maybe<Scalars['numeric']['output']>;
    event_creation_number?: Maybe<Scalars['bigint']['output']>;
    event_index?: Maybe<Scalars['bigint']['output']>;
    event_sequence_number?: Maybe<Scalars['bigint']['output']>;
    property_version?: Maybe<Scalars['numeric']['output']>;
    token_amount?: Maybe<Scalars['numeric']['output']>;
    transaction_version?: Maybe<Scalars['bigint']['output']>;
};
/** order by sum() on columns of table "token_activities" */
type Token_Activities_Sum_Order_By = {
    coin_amount?: InputMaybe<Order_By>;
    event_creation_number?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_sequence_number?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** columns and relationships of "token_activities_v2" */
type Token_Activities_V2 = {
    __typename?: 'token_activities_v2';
    after_value?: Maybe<Scalars['String']['output']>;
    /** An array relationship */
    aptos_names_from: Array<Current_Aptos_Names>;
    /** An aggregate relationship */
    aptos_names_from_aggregate: Current_Aptos_Names_Aggregate;
    /** An array relationship */
    aptos_names_to: Array<Current_Aptos_Names>;
    /** An aggregate relationship */
    aptos_names_to_aggregate: Current_Aptos_Names_Aggregate;
    before_value?: Maybe<Scalars['String']['output']>;
    /** An object relationship */
    current_token_data?: Maybe<Current_Token_Datas_V2>;
    entry_function_id_str?: Maybe<Scalars['String']['output']>;
    event_account_address: Scalars['String']['output'];
    event_index: Scalars['bigint']['output'];
    from_address?: Maybe<Scalars['String']['output']>;
    is_fungible_v2?: Maybe<Scalars['Boolean']['output']>;
    property_version_v1: Scalars['numeric']['output'];
    to_address?: Maybe<Scalars['String']['output']>;
    token_amount: Scalars['numeric']['output'];
    token_data_id: Scalars['String']['output'];
    token_standard: Scalars['String']['output'];
    transaction_timestamp: Scalars['timestamp']['output'];
    transaction_version: Scalars['bigint']['output'];
    type: Scalars['String']['output'];
};
/** columns and relationships of "token_activities_v2" */
type Token_Activities_V2Aptos_Names_FromArgs = {
    distinct_on?: InputMaybe<Array<Current_Aptos_Names_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Aptos_Names_Order_By>>;
    where?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
};
/** columns and relationships of "token_activities_v2" */
type Token_Activities_V2Aptos_Names_From_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Current_Aptos_Names_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Aptos_Names_Order_By>>;
    where?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
};
/** columns and relationships of "token_activities_v2" */
type Token_Activities_V2Aptos_Names_ToArgs = {
    distinct_on?: InputMaybe<Array<Current_Aptos_Names_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Aptos_Names_Order_By>>;
    where?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
};
/** columns and relationships of "token_activities_v2" */
type Token_Activities_V2Aptos_Names_To_AggregateArgs = {
    distinct_on?: InputMaybe<Array<Current_Aptos_Names_Select_Column>>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Current_Aptos_Names_Order_By>>;
    where?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
};
/** aggregated selection of "token_activities_v2" */
type Token_Activities_V2_Aggregate = {
    __typename?: 'token_activities_v2_aggregate';
    aggregate?: Maybe<Token_Activities_V2_Aggregate_Fields>;
    nodes: Array<Token_Activities_V2>;
};
/** aggregate fields of "token_activities_v2" */
type Token_Activities_V2_Aggregate_Fields = {
    __typename?: 'token_activities_v2_aggregate_fields';
    avg?: Maybe<Token_Activities_V2_Avg_Fields>;
    count: Scalars['Int']['output'];
    max?: Maybe<Token_Activities_V2_Max_Fields>;
    min?: Maybe<Token_Activities_V2_Min_Fields>;
    stddev?: Maybe<Token_Activities_V2_Stddev_Fields>;
    stddev_pop?: Maybe<Token_Activities_V2_Stddev_Pop_Fields>;
    stddev_samp?: Maybe<Token_Activities_V2_Stddev_Samp_Fields>;
    sum?: Maybe<Token_Activities_V2_Sum_Fields>;
    var_pop?: Maybe<Token_Activities_V2_Var_Pop_Fields>;
    var_samp?: Maybe<Token_Activities_V2_Var_Samp_Fields>;
    variance?: Maybe<Token_Activities_V2_Variance_Fields>;
};
/** aggregate fields of "token_activities_v2" */
type Token_Activities_V2_Aggregate_FieldsCountArgs = {
    columns?: InputMaybe<Array<Token_Activities_V2_Select_Column>>;
    distinct?: InputMaybe<Scalars['Boolean']['input']>;
};
/** order by aggregate values of table "token_activities_v2" */
type Token_Activities_V2_Aggregate_Order_By = {
    avg?: InputMaybe<Token_Activities_V2_Avg_Order_By>;
    count?: InputMaybe<Order_By>;
    max?: InputMaybe<Token_Activities_V2_Max_Order_By>;
    min?: InputMaybe<Token_Activities_V2_Min_Order_By>;
    stddev?: InputMaybe<Token_Activities_V2_Stddev_Order_By>;
    stddev_pop?: InputMaybe<Token_Activities_V2_Stddev_Pop_Order_By>;
    stddev_samp?: InputMaybe<Token_Activities_V2_Stddev_Samp_Order_By>;
    sum?: InputMaybe<Token_Activities_V2_Sum_Order_By>;
    var_pop?: InputMaybe<Token_Activities_V2_Var_Pop_Order_By>;
    var_samp?: InputMaybe<Token_Activities_V2_Var_Samp_Order_By>;
    variance?: InputMaybe<Token_Activities_V2_Variance_Order_By>;
};
/** aggregate avg on columns */
type Token_Activities_V2_Avg_Fields = {
    __typename?: 'token_activities_v2_avg_fields';
    event_index?: Maybe<Scalars['Float']['output']>;
    property_version_v1?: Maybe<Scalars['Float']['output']>;
    token_amount?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by avg() on columns of table "token_activities_v2" */
type Token_Activities_V2_Avg_Order_By = {
    event_index?: InputMaybe<Order_By>;
    property_version_v1?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** Boolean expression to filter rows from the table "token_activities_v2". All fields are combined with a logical 'AND'. */
type Token_Activities_V2_Bool_Exp = {
    _and?: InputMaybe<Array<Token_Activities_V2_Bool_Exp>>;
    _not?: InputMaybe<Token_Activities_V2_Bool_Exp>;
    _or?: InputMaybe<Array<Token_Activities_V2_Bool_Exp>>;
    after_value?: InputMaybe<String_Comparison_Exp>;
    aptos_names_from?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
    aptos_names_to?: InputMaybe<Current_Aptos_Names_Bool_Exp>;
    before_value?: InputMaybe<String_Comparison_Exp>;
    current_token_data?: InputMaybe<Current_Token_Datas_V2_Bool_Exp>;
    entry_function_id_str?: InputMaybe<String_Comparison_Exp>;
    event_account_address?: InputMaybe<String_Comparison_Exp>;
    event_index?: InputMaybe<Bigint_Comparison_Exp>;
    from_address?: InputMaybe<String_Comparison_Exp>;
    is_fungible_v2?: InputMaybe<Boolean_Comparison_Exp>;
    property_version_v1?: InputMaybe<Numeric_Comparison_Exp>;
    to_address?: InputMaybe<String_Comparison_Exp>;
    token_amount?: InputMaybe<Numeric_Comparison_Exp>;
    token_data_id?: InputMaybe<String_Comparison_Exp>;
    token_standard?: InputMaybe<String_Comparison_Exp>;
    transaction_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    type?: InputMaybe<String_Comparison_Exp>;
};
/** aggregate max on columns */
type Token_Activities_V2_Max_Fields = {
    __typename?: 'token_activities_v2_max_fields';
    after_value?: Maybe<Scalars['String']['output']>;
    before_value?: Maybe<Scalars['String']['output']>;
    entry_function_id_str?: Maybe<Scalars['String']['output']>;
    event_account_address?: Maybe<Scalars['String']['output']>;
    event_index?: Maybe<Scalars['bigint']['output']>;
    from_address?: Maybe<Scalars['String']['output']>;
    property_version_v1?: Maybe<Scalars['numeric']['output']>;
    to_address?: Maybe<Scalars['String']['output']>;
    token_amount?: Maybe<Scalars['numeric']['output']>;
    token_data_id?: Maybe<Scalars['String']['output']>;
    token_standard?: Maybe<Scalars['String']['output']>;
    transaction_timestamp?: Maybe<Scalars['timestamp']['output']>;
    transaction_version?: Maybe<Scalars['bigint']['output']>;
    type?: Maybe<Scalars['String']['output']>;
};
/** order by max() on columns of table "token_activities_v2" */
type Token_Activities_V2_Max_Order_By = {
    after_value?: InputMaybe<Order_By>;
    before_value?: InputMaybe<Order_By>;
    entry_function_id_str?: InputMaybe<Order_By>;
    event_account_address?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    from_address?: InputMaybe<Order_By>;
    property_version_v1?: InputMaybe<Order_By>;
    to_address?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    token_data_id?: InputMaybe<Order_By>;
    token_standard?: InputMaybe<Order_By>;
    transaction_timestamp?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
    type?: InputMaybe<Order_By>;
};
/** aggregate min on columns */
type Token_Activities_V2_Min_Fields = {
    __typename?: 'token_activities_v2_min_fields';
    after_value?: Maybe<Scalars['String']['output']>;
    before_value?: Maybe<Scalars['String']['output']>;
    entry_function_id_str?: Maybe<Scalars['String']['output']>;
    event_account_address?: Maybe<Scalars['String']['output']>;
    event_index?: Maybe<Scalars['bigint']['output']>;
    from_address?: Maybe<Scalars['String']['output']>;
    property_version_v1?: Maybe<Scalars['numeric']['output']>;
    to_address?: Maybe<Scalars['String']['output']>;
    token_amount?: Maybe<Scalars['numeric']['output']>;
    token_data_id?: Maybe<Scalars['String']['output']>;
    token_standard?: Maybe<Scalars['String']['output']>;
    transaction_timestamp?: Maybe<Scalars['timestamp']['output']>;
    transaction_version?: Maybe<Scalars['bigint']['output']>;
    type?: Maybe<Scalars['String']['output']>;
};
/** order by min() on columns of table "token_activities_v2" */
type Token_Activities_V2_Min_Order_By = {
    after_value?: InputMaybe<Order_By>;
    before_value?: InputMaybe<Order_By>;
    entry_function_id_str?: InputMaybe<Order_By>;
    event_account_address?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    from_address?: InputMaybe<Order_By>;
    property_version_v1?: InputMaybe<Order_By>;
    to_address?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    token_data_id?: InputMaybe<Order_By>;
    token_standard?: InputMaybe<Order_By>;
    transaction_timestamp?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
    type?: InputMaybe<Order_By>;
};
/** Ordering options when selecting data from "token_activities_v2". */
type Token_Activities_V2_Order_By = {
    after_value?: InputMaybe<Order_By>;
    aptos_names_from_aggregate?: InputMaybe<Current_Aptos_Names_Aggregate_Order_By>;
    aptos_names_to_aggregate?: InputMaybe<Current_Aptos_Names_Aggregate_Order_By>;
    before_value?: InputMaybe<Order_By>;
    current_token_data?: InputMaybe<Current_Token_Datas_V2_Order_By>;
    entry_function_id_str?: InputMaybe<Order_By>;
    event_account_address?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    from_address?: InputMaybe<Order_By>;
    is_fungible_v2?: InputMaybe<Order_By>;
    property_version_v1?: InputMaybe<Order_By>;
    to_address?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    token_data_id?: InputMaybe<Order_By>;
    token_standard?: InputMaybe<Order_By>;
    transaction_timestamp?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
    type?: InputMaybe<Order_By>;
};
/** select columns of table "token_activities_v2" */
declare enum Token_Activities_V2_Select_Column {
    /** column name */
    AfterValue = "after_value",
    /** column name */
    BeforeValue = "before_value",
    /** column name */
    EntryFunctionIdStr = "entry_function_id_str",
    /** column name */
    EventAccountAddress = "event_account_address",
    /** column name */
    EventIndex = "event_index",
    /** column name */
    FromAddress = "from_address",
    /** column name */
    IsFungibleV2 = "is_fungible_v2",
    /** column name */
    PropertyVersionV1 = "property_version_v1",
    /** column name */
    ToAddress = "to_address",
    /** column name */
    TokenAmount = "token_amount",
    /** column name */
    TokenDataId = "token_data_id",
    /** column name */
    TokenStandard = "token_standard",
    /** column name */
    TransactionTimestamp = "transaction_timestamp",
    /** column name */
    TransactionVersion = "transaction_version",
    /** column name */
    Type = "type"
}
/** aggregate stddev on columns */
type Token_Activities_V2_Stddev_Fields = {
    __typename?: 'token_activities_v2_stddev_fields';
    event_index?: Maybe<Scalars['Float']['output']>;
    property_version_v1?: Maybe<Scalars['Float']['output']>;
    token_amount?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by stddev() on columns of table "token_activities_v2" */
type Token_Activities_V2_Stddev_Order_By = {
    event_index?: InputMaybe<Order_By>;
    property_version_v1?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** aggregate stddev_pop on columns */
type Token_Activities_V2_Stddev_Pop_Fields = {
    __typename?: 'token_activities_v2_stddev_pop_fields';
    event_index?: Maybe<Scalars['Float']['output']>;
    property_version_v1?: Maybe<Scalars['Float']['output']>;
    token_amount?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by stddev_pop() on columns of table "token_activities_v2" */
type Token_Activities_V2_Stddev_Pop_Order_By = {
    event_index?: InputMaybe<Order_By>;
    property_version_v1?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** aggregate stddev_samp on columns */
type Token_Activities_V2_Stddev_Samp_Fields = {
    __typename?: 'token_activities_v2_stddev_samp_fields';
    event_index?: Maybe<Scalars['Float']['output']>;
    property_version_v1?: Maybe<Scalars['Float']['output']>;
    token_amount?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by stddev_samp() on columns of table "token_activities_v2" */
type Token_Activities_V2_Stddev_Samp_Order_By = {
    event_index?: InputMaybe<Order_By>;
    property_version_v1?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** Streaming cursor of the table "token_activities_v2" */
type Token_Activities_V2_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Token_Activities_V2_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Token_Activities_V2_Stream_Cursor_Value_Input = {
    after_value?: InputMaybe<Scalars['String']['input']>;
    before_value?: InputMaybe<Scalars['String']['input']>;
    entry_function_id_str?: InputMaybe<Scalars['String']['input']>;
    event_account_address?: InputMaybe<Scalars['String']['input']>;
    event_index?: InputMaybe<Scalars['bigint']['input']>;
    from_address?: InputMaybe<Scalars['String']['input']>;
    is_fungible_v2?: InputMaybe<Scalars['Boolean']['input']>;
    property_version_v1?: InputMaybe<Scalars['numeric']['input']>;
    to_address?: InputMaybe<Scalars['String']['input']>;
    token_amount?: InputMaybe<Scalars['numeric']['input']>;
    token_data_id?: InputMaybe<Scalars['String']['input']>;
    token_standard?: InputMaybe<Scalars['String']['input']>;
    transaction_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    type?: InputMaybe<Scalars['String']['input']>;
};
/** aggregate sum on columns */
type Token_Activities_V2_Sum_Fields = {
    __typename?: 'token_activities_v2_sum_fields';
    event_index?: Maybe<Scalars['bigint']['output']>;
    property_version_v1?: Maybe<Scalars['numeric']['output']>;
    token_amount?: Maybe<Scalars['numeric']['output']>;
    transaction_version?: Maybe<Scalars['bigint']['output']>;
};
/** order by sum() on columns of table "token_activities_v2" */
type Token_Activities_V2_Sum_Order_By = {
    event_index?: InputMaybe<Order_By>;
    property_version_v1?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** aggregate var_pop on columns */
type Token_Activities_V2_Var_Pop_Fields = {
    __typename?: 'token_activities_v2_var_pop_fields';
    event_index?: Maybe<Scalars['Float']['output']>;
    property_version_v1?: Maybe<Scalars['Float']['output']>;
    token_amount?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by var_pop() on columns of table "token_activities_v2" */
type Token_Activities_V2_Var_Pop_Order_By = {
    event_index?: InputMaybe<Order_By>;
    property_version_v1?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** aggregate var_samp on columns */
type Token_Activities_V2_Var_Samp_Fields = {
    __typename?: 'token_activities_v2_var_samp_fields';
    event_index?: Maybe<Scalars['Float']['output']>;
    property_version_v1?: Maybe<Scalars['Float']['output']>;
    token_amount?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by var_samp() on columns of table "token_activities_v2" */
type Token_Activities_V2_Var_Samp_Order_By = {
    event_index?: InputMaybe<Order_By>;
    property_version_v1?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** aggregate variance on columns */
type Token_Activities_V2_Variance_Fields = {
    __typename?: 'token_activities_v2_variance_fields';
    event_index?: Maybe<Scalars['Float']['output']>;
    property_version_v1?: Maybe<Scalars['Float']['output']>;
    token_amount?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by variance() on columns of table "token_activities_v2" */
type Token_Activities_V2_Variance_Order_By = {
    event_index?: InputMaybe<Order_By>;
    property_version_v1?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** aggregate var_pop on columns */
type Token_Activities_Var_Pop_Fields = {
    __typename?: 'token_activities_var_pop_fields';
    coin_amount?: Maybe<Scalars['Float']['output']>;
    event_creation_number?: Maybe<Scalars['Float']['output']>;
    event_index?: Maybe<Scalars['Float']['output']>;
    event_sequence_number?: Maybe<Scalars['Float']['output']>;
    property_version?: Maybe<Scalars['Float']['output']>;
    token_amount?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by var_pop() on columns of table "token_activities" */
type Token_Activities_Var_Pop_Order_By = {
    coin_amount?: InputMaybe<Order_By>;
    event_creation_number?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_sequence_number?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** aggregate var_samp on columns */
type Token_Activities_Var_Samp_Fields = {
    __typename?: 'token_activities_var_samp_fields';
    coin_amount?: Maybe<Scalars['Float']['output']>;
    event_creation_number?: Maybe<Scalars['Float']['output']>;
    event_index?: Maybe<Scalars['Float']['output']>;
    event_sequence_number?: Maybe<Scalars['Float']['output']>;
    property_version?: Maybe<Scalars['Float']['output']>;
    token_amount?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by var_samp() on columns of table "token_activities" */
type Token_Activities_Var_Samp_Order_By = {
    coin_amount?: InputMaybe<Order_By>;
    event_creation_number?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_sequence_number?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** aggregate variance on columns */
type Token_Activities_Variance_Fields = {
    __typename?: 'token_activities_variance_fields';
    coin_amount?: Maybe<Scalars['Float']['output']>;
    event_creation_number?: Maybe<Scalars['Float']['output']>;
    event_index?: Maybe<Scalars['Float']['output']>;
    event_sequence_number?: Maybe<Scalars['Float']['output']>;
    property_version?: Maybe<Scalars['Float']['output']>;
    token_amount?: Maybe<Scalars['Float']['output']>;
    transaction_version?: Maybe<Scalars['Float']['output']>;
};
/** order by variance() on columns of table "token_activities" */
type Token_Activities_Variance_Order_By = {
    coin_amount?: InputMaybe<Order_By>;
    event_creation_number?: InputMaybe<Order_By>;
    event_index?: InputMaybe<Order_By>;
    event_sequence_number?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
    token_amount?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** columns and relationships of "token_datas" */
type Token_Datas = {
    __typename?: 'token_datas';
    collection_data_id_hash: Scalars['String']['output'];
    collection_name: Scalars['String']['output'];
    creator_address: Scalars['String']['output'];
    default_properties: Scalars['jsonb']['output'];
    description: Scalars['String']['output'];
    description_mutable: Scalars['Boolean']['output'];
    largest_property_version: Scalars['numeric']['output'];
    maximum: Scalars['numeric']['output'];
    maximum_mutable: Scalars['Boolean']['output'];
    metadata_uri: Scalars['String']['output'];
    name: Scalars['String']['output'];
    payee_address: Scalars['String']['output'];
    properties_mutable: Scalars['Boolean']['output'];
    royalty_mutable: Scalars['Boolean']['output'];
    royalty_points_denominator: Scalars['numeric']['output'];
    royalty_points_numerator: Scalars['numeric']['output'];
    supply: Scalars['numeric']['output'];
    token_data_id_hash: Scalars['String']['output'];
    transaction_timestamp: Scalars['timestamp']['output'];
    transaction_version: Scalars['bigint']['output'];
    uri_mutable: Scalars['Boolean']['output'];
};
/** columns and relationships of "token_datas" */
type Token_DatasDefault_PropertiesArgs = {
    path?: InputMaybe<Scalars['String']['input']>;
};
/** Boolean expression to filter rows from the table "token_datas". All fields are combined with a logical 'AND'. */
type Token_Datas_Bool_Exp = {
    _and?: InputMaybe<Array<Token_Datas_Bool_Exp>>;
    _not?: InputMaybe<Token_Datas_Bool_Exp>;
    _or?: InputMaybe<Array<Token_Datas_Bool_Exp>>;
    collection_data_id_hash?: InputMaybe<String_Comparison_Exp>;
    collection_name?: InputMaybe<String_Comparison_Exp>;
    creator_address?: InputMaybe<String_Comparison_Exp>;
    default_properties?: InputMaybe<Jsonb_Comparison_Exp>;
    description?: InputMaybe<String_Comparison_Exp>;
    description_mutable?: InputMaybe<Boolean_Comparison_Exp>;
    largest_property_version?: InputMaybe<Numeric_Comparison_Exp>;
    maximum?: InputMaybe<Numeric_Comparison_Exp>;
    maximum_mutable?: InputMaybe<Boolean_Comparison_Exp>;
    metadata_uri?: InputMaybe<String_Comparison_Exp>;
    name?: InputMaybe<String_Comparison_Exp>;
    payee_address?: InputMaybe<String_Comparison_Exp>;
    properties_mutable?: InputMaybe<Boolean_Comparison_Exp>;
    royalty_mutable?: InputMaybe<Boolean_Comparison_Exp>;
    royalty_points_denominator?: InputMaybe<Numeric_Comparison_Exp>;
    royalty_points_numerator?: InputMaybe<Numeric_Comparison_Exp>;
    supply?: InputMaybe<Numeric_Comparison_Exp>;
    token_data_id_hash?: InputMaybe<String_Comparison_Exp>;
    transaction_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
    uri_mutable?: InputMaybe<Boolean_Comparison_Exp>;
};
/** Ordering options when selecting data from "token_datas". */
type Token_Datas_Order_By = {
    collection_data_id_hash?: InputMaybe<Order_By>;
    collection_name?: InputMaybe<Order_By>;
    creator_address?: InputMaybe<Order_By>;
    default_properties?: InputMaybe<Order_By>;
    description?: InputMaybe<Order_By>;
    description_mutable?: InputMaybe<Order_By>;
    largest_property_version?: InputMaybe<Order_By>;
    maximum?: InputMaybe<Order_By>;
    maximum_mutable?: InputMaybe<Order_By>;
    metadata_uri?: InputMaybe<Order_By>;
    name?: InputMaybe<Order_By>;
    payee_address?: InputMaybe<Order_By>;
    properties_mutable?: InputMaybe<Order_By>;
    royalty_mutable?: InputMaybe<Order_By>;
    royalty_points_denominator?: InputMaybe<Order_By>;
    royalty_points_numerator?: InputMaybe<Order_By>;
    supply?: InputMaybe<Order_By>;
    token_data_id_hash?: InputMaybe<Order_By>;
    transaction_timestamp?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
    uri_mutable?: InputMaybe<Order_By>;
};
/** select columns of table "token_datas" */
declare enum Token_Datas_Select_Column {
    /** column name */
    CollectionDataIdHash = "collection_data_id_hash",
    /** column name */
    CollectionName = "collection_name",
    /** column name */
    CreatorAddress = "creator_address",
    /** column name */
    DefaultProperties = "default_properties",
    /** column name */
    Description = "description",
    /** column name */
    DescriptionMutable = "description_mutable",
    /** column name */
    LargestPropertyVersion = "largest_property_version",
    /** column name */
    Maximum = "maximum",
    /** column name */
    MaximumMutable = "maximum_mutable",
    /** column name */
    MetadataUri = "metadata_uri",
    /** column name */
    Name = "name",
    /** column name */
    PayeeAddress = "payee_address",
    /** column name */
    PropertiesMutable = "properties_mutable",
    /** column name */
    RoyaltyMutable = "royalty_mutable",
    /** column name */
    RoyaltyPointsDenominator = "royalty_points_denominator",
    /** column name */
    RoyaltyPointsNumerator = "royalty_points_numerator",
    /** column name */
    Supply = "supply",
    /** column name */
    TokenDataIdHash = "token_data_id_hash",
    /** column name */
    TransactionTimestamp = "transaction_timestamp",
    /** column name */
    TransactionVersion = "transaction_version",
    /** column name */
    UriMutable = "uri_mutable"
}
/** Streaming cursor of the table "token_datas" */
type Token_Datas_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Token_Datas_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Token_Datas_Stream_Cursor_Value_Input = {
    collection_data_id_hash?: InputMaybe<Scalars['String']['input']>;
    collection_name?: InputMaybe<Scalars['String']['input']>;
    creator_address?: InputMaybe<Scalars['String']['input']>;
    default_properties?: InputMaybe<Scalars['jsonb']['input']>;
    description?: InputMaybe<Scalars['String']['input']>;
    description_mutable?: InputMaybe<Scalars['Boolean']['input']>;
    largest_property_version?: InputMaybe<Scalars['numeric']['input']>;
    maximum?: InputMaybe<Scalars['numeric']['input']>;
    maximum_mutable?: InputMaybe<Scalars['Boolean']['input']>;
    metadata_uri?: InputMaybe<Scalars['String']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
    payee_address?: InputMaybe<Scalars['String']['input']>;
    properties_mutable?: InputMaybe<Scalars['Boolean']['input']>;
    royalty_mutable?: InputMaybe<Scalars['Boolean']['input']>;
    royalty_points_denominator?: InputMaybe<Scalars['numeric']['input']>;
    royalty_points_numerator?: InputMaybe<Scalars['numeric']['input']>;
    supply?: InputMaybe<Scalars['numeric']['input']>;
    token_data_id_hash?: InputMaybe<Scalars['String']['input']>;
    transaction_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    transaction_version?: InputMaybe<Scalars['bigint']['input']>;
    uri_mutable?: InputMaybe<Scalars['Boolean']['input']>;
};
/** columns and relationships of "token_ownerships" */
type Token_Ownerships = {
    __typename?: 'token_ownerships';
    amount: Scalars['numeric']['output'];
    collection_data_id_hash: Scalars['String']['output'];
    collection_name: Scalars['String']['output'];
    creator_address: Scalars['String']['output'];
    name: Scalars['String']['output'];
    owner_address?: Maybe<Scalars['String']['output']>;
    property_version: Scalars['numeric']['output'];
    table_handle: Scalars['String']['output'];
    table_type?: Maybe<Scalars['String']['output']>;
    token_data_id_hash: Scalars['String']['output'];
    transaction_timestamp: Scalars['timestamp']['output'];
    transaction_version: Scalars['bigint']['output'];
};
/** Boolean expression to filter rows from the table "token_ownerships". All fields are combined with a logical 'AND'. */
type Token_Ownerships_Bool_Exp = {
    _and?: InputMaybe<Array<Token_Ownerships_Bool_Exp>>;
    _not?: InputMaybe<Token_Ownerships_Bool_Exp>;
    _or?: InputMaybe<Array<Token_Ownerships_Bool_Exp>>;
    amount?: InputMaybe<Numeric_Comparison_Exp>;
    collection_data_id_hash?: InputMaybe<String_Comparison_Exp>;
    collection_name?: InputMaybe<String_Comparison_Exp>;
    creator_address?: InputMaybe<String_Comparison_Exp>;
    name?: InputMaybe<String_Comparison_Exp>;
    owner_address?: InputMaybe<String_Comparison_Exp>;
    property_version?: InputMaybe<Numeric_Comparison_Exp>;
    table_handle?: InputMaybe<String_Comparison_Exp>;
    table_type?: InputMaybe<String_Comparison_Exp>;
    token_data_id_hash?: InputMaybe<String_Comparison_Exp>;
    transaction_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
};
/** Ordering options when selecting data from "token_ownerships". */
type Token_Ownerships_Order_By = {
    amount?: InputMaybe<Order_By>;
    collection_data_id_hash?: InputMaybe<Order_By>;
    collection_name?: InputMaybe<Order_By>;
    creator_address?: InputMaybe<Order_By>;
    name?: InputMaybe<Order_By>;
    owner_address?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
    table_handle?: InputMaybe<Order_By>;
    table_type?: InputMaybe<Order_By>;
    token_data_id_hash?: InputMaybe<Order_By>;
    transaction_timestamp?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** select columns of table "token_ownerships" */
declare enum Token_Ownerships_Select_Column {
    /** column name */
    Amount = "amount",
    /** column name */
    CollectionDataIdHash = "collection_data_id_hash",
    /** column name */
    CollectionName = "collection_name",
    /** column name */
    CreatorAddress = "creator_address",
    /** column name */
    Name = "name",
    /** column name */
    OwnerAddress = "owner_address",
    /** column name */
    PropertyVersion = "property_version",
    /** column name */
    TableHandle = "table_handle",
    /** column name */
    TableType = "table_type",
    /** column name */
    TokenDataIdHash = "token_data_id_hash",
    /** column name */
    TransactionTimestamp = "transaction_timestamp",
    /** column name */
    TransactionVersion = "transaction_version"
}
/** Streaming cursor of the table "token_ownerships" */
type Token_Ownerships_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Token_Ownerships_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Token_Ownerships_Stream_Cursor_Value_Input = {
    amount?: InputMaybe<Scalars['numeric']['input']>;
    collection_data_id_hash?: InputMaybe<Scalars['String']['input']>;
    collection_name?: InputMaybe<Scalars['String']['input']>;
    creator_address?: InputMaybe<Scalars['String']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
    owner_address?: InputMaybe<Scalars['String']['input']>;
    property_version?: InputMaybe<Scalars['numeric']['input']>;
    table_handle?: InputMaybe<Scalars['String']['input']>;
    table_type?: InputMaybe<Scalars['String']['input']>;
    token_data_id_hash?: InputMaybe<Scalars['String']['input']>;
    transaction_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    transaction_version?: InputMaybe<Scalars['bigint']['input']>;
};
/** columns and relationships of "tokens" */
type Tokens = {
    __typename?: 'tokens';
    collection_data_id_hash: Scalars['String']['output'];
    collection_name: Scalars['String']['output'];
    creator_address: Scalars['String']['output'];
    name: Scalars['String']['output'];
    property_version: Scalars['numeric']['output'];
    token_data_id_hash: Scalars['String']['output'];
    token_properties: Scalars['jsonb']['output'];
    transaction_timestamp: Scalars['timestamp']['output'];
    transaction_version: Scalars['bigint']['output'];
};
/** columns and relationships of "tokens" */
type TokensToken_PropertiesArgs = {
    path?: InputMaybe<Scalars['String']['input']>;
};
/** Boolean expression to filter rows from the table "tokens". All fields are combined with a logical 'AND'. */
type Tokens_Bool_Exp = {
    _and?: InputMaybe<Array<Tokens_Bool_Exp>>;
    _not?: InputMaybe<Tokens_Bool_Exp>;
    _or?: InputMaybe<Array<Tokens_Bool_Exp>>;
    collection_data_id_hash?: InputMaybe<String_Comparison_Exp>;
    collection_name?: InputMaybe<String_Comparison_Exp>;
    creator_address?: InputMaybe<String_Comparison_Exp>;
    name?: InputMaybe<String_Comparison_Exp>;
    property_version?: InputMaybe<Numeric_Comparison_Exp>;
    token_data_id_hash?: InputMaybe<String_Comparison_Exp>;
    token_properties?: InputMaybe<Jsonb_Comparison_Exp>;
    transaction_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    transaction_version?: InputMaybe<Bigint_Comparison_Exp>;
};
/** Ordering options when selecting data from "tokens". */
type Tokens_Order_By = {
    collection_data_id_hash?: InputMaybe<Order_By>;
    collection_name?: InputMaybe<Order_By>;
    creator_address?: InputMaybe<Order_By>;
    name?: InputMaybe<Order_By>;
    property_version?: InputMaybe<Order_By>;
    token_data_id_hash?: InputMaybe<Order_By>;
    token_properties?: InputMaybe<Order_By>;
    transaction_timestamp?: InputMaybe<Order_By>;
    transaction_version?: InputMaybe<Order_By>;
};
/** select columns of table "tokens" */
declare enum Tokens_Select_Column {
    /** column name */
    CollectionDataIdHash = "collection_data_id_hash",
    /** column name */
    CollectionName = "collection_name",
    /** column name */
    CreatorAddress = "creator_address",
    /** column name */
    Name = "name",
    /** column name */
    PropertyVersion = "property_version",
    /** column name */
    TokenDataIdHash = "token_data_id_hash",
    /** column name */
    TokenProperties = "token_properties",
    /** column name */
    TransactionTimestamp = "transaction_timestamp",
    /** column name */
    TransactionVersion = "transaction_version"
}
/** Streaming cursor of the table "tokens" */
type Tokens_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: Tokens_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type Tokens_Stream_Cursor_Value_Input = {
    collection_data_id_hash?: InputMaybe<Scalars['String']['input']>;
    collection_name?: InputMaybe<Scalars['String']['input']>;
    creator_address?: InputMaybe<Scalars['String']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
    property_version?: InputMaybe<Scalars['numeric']['input']>;
    token_data_id_hash?: InputMaybe<Scalars['String']['input']>;
    token_properties?: InputMaybe<Scalars['jsonb']['input']>;
    transaction_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    transaction_version?: InputMaybe<Scalars['bigint']['input']>;
};
/** columns and relationships of "user_transactions" */
type User_Transactions = {
    __typename?: 'user_transactions';
    block_height: Scalars['bigint']['output'];
    entry_function_id_str: Scalars['String']['output'];
    epoch: Scalars['bigint']['output'];
    expiration_timestamp_secs: Scalars['timestamp']['output'];
    gas_unit_price: Scalars['numeric']['output'];
    max_gas_amount: Scalars['numeric']['output'];
    parent_signature_type: Scalars['String']['output'];
    sender: Scalars['String']['output'];
    sequence_number: Scalars['bigint']['output'];
    timestamp: Scalars['timestamp']['output'];
    version: Scalars['bigint']['output'];
};
/** Boolean expression to filter rows from the table "user_transactions". All fields are combined with a logical 'AND'. */
type User_Transactions_Bool_Exp = {
    _and?: InputMaybe<Array<User_Transactions_Bool_Exp>>;
    _not?: InputMaybe<User_Transactions_Bool_Exp>;
    _or?: InputMaybe<Array<User_Transactions_Bool_Exp>>;
    block_height?: InputMaybe<Bigint_Comparison_Exp>;
    entry_function_id_str?: InputMaybe<String_Comparison_Exp>;
    epoch?: InputMaybe<Bigint_Comparison_Exp>;
    expiration_timestamp_secs?: InputMaybe<Timestamp_Comparison_Exp>;
    gas_unit_price?: InputMaybe<Numeric_Comparison_Exp>;
    max_gas_amount?: InputMaybe<Numeric_Comparison_Exp>;
    parent_signature_type?: InputMaybe<String_Comparison_Exp>;
    sender?: InputMaybe<String_Comparison_Exp>;
    sequence_number?: InputMaybe<Bigint_Comparison_Exp>;
    timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
    version?: InputMaybe<Bigint_Comparison_Exp>;
};
/** Ordering options when selecting data from "user_transactions". */
type User_Transactions_Order_By = {
    block_height?: InputMaybe<Order_By>;
    entry_function_id_str?: InputMaybe<Order_By>;
    epoch?: InputMaybe<Order_By>;
    expiration_timestamp_secs?: InputMaybe<Order_By>;
    gas_unit_price?: InputMaybe<Order_By>;
    max_gas_amount?: InputMaybe<Order_By>;
    parent_signature_type?: InputMaybe<Order_By>;
    sender?: InputMaybe<Order_By>;
    sequence_number?: InputMaybe<Order_By>;
    timestamp?: InputMaybe<Order_By>;
    version?: InputMaybe<Order_By>;
};
/** select columns of table "user_transactions" */
declare enum User_Transactions_Select_Column {
    /** column name */
    BlockHeight = "block_height",
    /** column name */
    EntryFunctionIdStr = "entry_function_id_str",
    /** column name */
    Epoch = "epoch",
    /** column name */
    ExpirationTimestampSecs = "expiration_timestamp_secs",
    /** column name */
    GasUnitPrice = "gas_unit_price",
    /** column name */
    MaxGasAmount = "max_gas_amount",
    /** column name */
    ParentSignatureType = "parent_signature_type",
    /** column name */
    Sender = "sender",
    /** column name */
    SequenceNumber = "sequence_number",
    /** column name */
    Timestamp = "timestamp",
    /** column name */
    Version = "version"
}
/** Streaming cursor of the table "user_transactions" */
type User_Transactions_Stream_Cursor_Input = {
    /** Stream column input with initial value */
    initial_value: User_Transactions_Stream_Cursor_Value_Input;
    /** cursor ordering */
    ordering?: InputMaybe<Cursor_Ordering>;
};
/** Initial value of the column from where the streaming should start */
type User_Transactions_Stream_Cursor_Value_Input = {
    block_height?: InputMaybe<Scalars['bigint']['input']>;
    entry_function_id_str?: InputMaybe<Scalars['String']['input']>;
    epoch?: InputMaybe<Scalars['bigint']['input']>;
    expiration_timestamp_secs?: InputMaybe<Scalars['timestamp']['input']>;
    gas_unit_price?: InputMaybe<Scalars['numeric']['input']>;
    max_gas_amount?: InputMaybe<Scalars['numeric']['input']>;
    parent_signature_type?: InputMaybe<Scalars['String']['input']>;
    sender?: InputMaybe<Scalars['String']['input']>;
    sequence_number?: InputMaybe<Scalars['bigint']['input']>;
    timestamp?: InputMaybe<Scalars['timestamp']['input']>;
    version?: InputMaybe<Scalars['bigint']['input']>;
};

type GetAccountCoinsDataCountQuery = {
    __typename?: 'query_root';
    current_fungible_asset_balances_aggregate: {
        __typename?: 'current_fungible_asset_balances_aggregate';
        aggregate?: {
            __typename?: 'current_fungible_asset_balances_aggregate_fields';
            count: number;
        } | null;
    };
};
type GetAccountCoinsDataQuery = {
    __typename?: 'query_root';
    current_fungible_asset_balances: Array<{
        __typename?: 'current_fungible_asset_balances';
        amount: any;
        asset_type: string;
        is_frozen: boolean;
        is_primary: boolean;
        last_transaction_timestamp: any;
        last_transaction_version: any;
        owner_address: string;
        storage_id: string;
        token_standard: string;
        metadata?: {
            __typename?: 'fungible_asset_metadata';
            token_standard: string;
            symbol: string;
            supply_aggregator_table_key_v1?: string | null;
            supply_aggregator_table_handle_v1?: string | null;
            project_uri?: string | null;
            name: string;
            last_transaction_version: any;
            last_transaction_timestamp: any;
            icon_uri?: string | null;
            decimals: number;
            creator_address: string;
            asset_type: string;
        } | null;
    }>;
};
type GetAccountCurrentTokensQuery = {
    __typename?: 'query_root';
    current_token_ownerships: Array<{
        __typename?: 'current_token_ownerships';
        amount: any;
        last_transaction_version: any;
        property_version: any;
        current_token_data?: {
            __typename?: 'current_token_datas';
            creator_address: string;
            collection_name: string;
            description: string;
            metadata_uri: string;
            name: string;
            token_data_id_hash: string;
            collection_data_id_hash: string;
        } | null;
        current_collection_data?: {
            __typename?: 'current_collection_datas';
            metadata_uri: string;
            supply: any;
            description: string;
            collection_name: string;
            collection_data_id_hash: string;
            table_handle: string;
            creator_address: string;
        } | null;
    }>;
};
type GetAccountTokensCountQuery = {
    __typename?: 'query_root';
    current_token_ownerships_v2_aggregate: {
        __typename?: 'current_token_ownerships_v2_aggregate';
        aggregate?: {
            __typename?: 'current_token_ownerships_v2_aggregate_fields';
            count: number;
        } | null;
    };
};
type GetAccountTransactionsCountQuery = {
    __typename?: 'query_root';
    account_transactions_aggregate: {
        __typename?: 'account_transactions_aggregate';
        aggregate?: {
            __typename?: 'account_transactions_aggregate_fields';
            count: number;
        } | null;
    };
};
type GetAccountTransactionsDataQuery = {
    __typename?: 'query_root';
    account_transactions: Array<{
        __typename?: 'account_transactions';
        transaction_version: any;
        account_address: string;
        token_activities_v2: Array<{
            __typename?: 'token_activities_v2';
            after_value?: string | null;
            before_value?: string | null;
            entry_function_id_str?: string | null;
            event_account_address: string;
            event_index: any;
            from_address?: string | null;
            is_fungible_v2?: boolean | null;
            property_version_v1: any;
            to_address?: string | null;
            token_amount: any;
            token_data_id: string;
            token_standard: string;
            transaction_timestamp: any;
            transaction_version: any;
            type: string;
        }>;
    }>;
};
type GetCollectionDataQuery = {
    __typename?: 'query_root';
    current_collections_v2: Array<{
        __typename?: 'current_collections_v2';
        collection_id: string;
        collection_name: string;
        creator_address: string;
        current_supply: any;
        description: string;
        last_transaction_timestamp: any;
        last_transaction_version: any;
        max_supply?: any | null;
        mutable_description?: boolean | null;
        mutable_uri?: boolean | null;
        table_handle_v1?: string | null;
        token_standard: string;
        total_minted_v2?: any | null;
        uri: string;
    }>;
};
type GetCollectionsWithOwnedTokensQuery = {
    __typename?: 'query_root';
    current_collection_ownership_v2_view: Array<{
        __typename?: 'current_collection_ownership_v2_view';
        collection_id?: string | null;
        collection_name?: string | null;
        collection_uri?: string | null;
        creator_address?: string | null;
        distinct_tokens?: any | null;
        last_transaction_version?: any | null;
        owner_address?: string | null;
        single_token_uri?: string | null;
        current_collection?: {
            __typename?: 'current_collections_v2';
            collection_id: string;
            collection_name: string;
            creator_address: string;
            current_supply: any;
            description: string;
            last_transaction_timestamp: any;
            last_transaction_version: any;
            mutable_description?: boolean | null;
            max_supply?: any | null;
            mutable_uri?: boolean | null;
            table_handle_v1?: string | null;
            token_standard: string;
            total_minted_v2?: any | null;
            uri: string;
        } | null;
    }>;
};
type GetCurrentObjectsQuery = {
    __typename?: 'query_root';
    current_objects: Array<{
        __typename?: 'current_objects';
        allow_ungated_transfer: boolean;
        state_key_hash: string;
        owner_address: string;
        object_address: string;
        last_transaction_version: any;
        last_guid_creation_num: any;
        is_deleted: boolean;
    }>;
};
type GetDelegatedStakingActivitiesQuery = {
    __typename?: 'query_root';
    delegated_staking_activities: Array<{
        __typename?: 'delegated_staking_activities';
        amount: any;
        delegator_address: string;
        event_index: any;
        event_type: string;
        pool_address: string;
        transaction_version: any;
    }>;
};
type GetIndexerLedgerInfoQuery = {
    __typename?: 'query_root';
    ledger_infos: Array<{
        __typename?: 'ledger_infos';
        chain_id: any;
    }>;
};
type GetNumberOfDelegatorsQuery = {
    __typename?: 'query_root';
    num_active_delegator_per_pool: Array<{
        __typename?: 'num_active_delegator_per_pool';
        num_active_delegator?: any | null;
        pool_address?: string | null;
    }>;
};
type GetOwnedTokensQuery = {
    __typename?: 'query_root';
    current_token_ownerships_v2: Array<{
        __typename?: 'current_token_ownerships_v2';
        token_standard: string;
        token_properties_mutated_v1?: any | null;
        token_data_id: string;
        table_type_v1?: string | null;
        storage_id: string;
        property_version_v1: any;
        owner_address: string;
        last_transaction_version: any;
        last_transaction_timestamp: any;
        is_soulbound_v2?: boolean | null;
        is_fungible_v2?: boolean | null;
        amount: any;
        current_token_data?: {
            __typename?: 'current_token_datas_v2';
            collection_id: string;
            description: string;
            is_fungible_v2?: boolean | null;
            largest_property_version_v1?: any | null;
            last_transaction_timestamp: any;
            last_transaction_version: any;
            maximum?: any | null;
            supply: any;
            token_data_id: string;
            token_name: string;
            token_properties: any;
            token_standard: string;
            token_uri: string;
            current_collection?: {
                __typename?: 'current_collections_v2';
                collection_id: string;
                collection_name: string;
                creator_address: string;
                current_supply: any;
                description: string;
                last_transaction_timestamp: any;
                last_transaction_version: any;
                max_supply?: any | null;
                mutable_description?: boolean | null;
                mutable_uri?: boolean | null;
                table_handle_v1?: string | null;
                token_standard: string;
                total_minted_v2?: any | null;
                uri: string;
            } | null;
        } | null;
    }>;
};
type GetOwnedTokensByTokenDataQuery = {
    __typename?: 'query_root';
    current_token_ownerships_v2: Array<{
        __typename?: 'current_token_ownerships_v2';
        token_standard: string;
        token_properties_mutated_v1?: any | null;
        token_data_id: string;
        table_type_v1?: string | null;
        storage_id: string;
        property_version_v1: any;
        owner_address: string;
        last_transaction_version: any;
        last_transaction_timestamp: any;
        is_soulbound_v2?: boolean | null;
        is_fungible_v2?: boolean | null;
        amount: any;
        current_token_data?: {
            __typename?: 'current_token_datas_v2';
            collection_id: string;
            description: string;
            is_fungible_v2?: boolean | null;
            largest_property_version_v1?: any | null;
            last_transaction_timestamp: any;
            last_transaction_version: any;
            maximum?: any | null;
            supply: any;
            token_data_id: string;
            token_name: string;
            token_properties: any;
            token_standard: string;
            token_uri: string;
            current_collection?: {
                __typename?: 'current_collections_v2';
                collection_id: string;
                collection_name: string;
                creator_address: string;
                current_supply: any;
                description: string;
                last_transaction_timestamp: any;
                last_transaction_version: any;
                max_supply?: any | null;
                mutable_description?: boolean | null;
                mutable_uri?: boolean | null;
                table_handle_v1?: string | null;
                token_standard: string;
                total_minted_v2?: any | null;
                uri: string;
            } | null;
        } | null;
    }>;
};
type GetTokenActivitiesQuery = {
    __typename?: 'query_root';
    token_activities_v2: Array<{
        __typename?: 'token_activities_v2';
        after_value?: string | null;
        before_value?: string | null;
        entry_function_id_str?: string | null;
        event_account_address: string;
        event_index: any;
        from_address?: string | null;
        is_fungible_v2?: boolean | null;
        property_version_v1: any;
        to_address?: string | null;
        token_amount: any;
        token_data_id: string;
        token_standard: string;
        transaction_timestamp: any;
        transaction_version: any;
        type: string;
    }>;
};
type GetTokenActivitiesCountQuery = {
    __typename?: 'query_root';
    token_activities_v2_aggregate: {
        __typename?: 'token_activities_v2_aggregate';
        aggregate?: {
            __typename?: 'token_activities_v2_aggregate_fields';
            count: number;
        } | null;
    };
};
type GetTokenCurrentOwnerDataQuery = {
    __typename?: 'query_root';
    current_token_ownerships_v2: Array<{
        __typename?: 'current_token_ownerships_v2';
        token_standard: string;
        token_properties_mutated_v1?: any | null;
        token_data_id: string;
        table_type_v1?: string | null;
        storage_id: string;
        property_version_v1: any;
        owner_address: string;
        last_transaction_version: any;
        last_transaction_timestamp: any;
        is_soulbound_v2?: boolean | null;
        is_fungible_v2?: boolean | null;
        amount: any;
        current_token_data?: {
            __typename?: 'current_token_datas_v2';
            collection_id: string;
            description: string;
            is_fungible_v2?: boolean | null;
            largest_property_version_v1?: any | null;
            last_transaction_timestamp: any;
            last_transaction_version: any;
            maximum?: any | null;
            supply: any;
            token_data_id: string;
            token_name: string;
            token_properties: any;
            token_standard: string;
            token_uri: string;
            current_collection?: {
                __typename?: 'current_collections_v2';
                collection_id: string;
                collection_name: string;
                creator_address: string;
                current_supply: any;
                description: string;
                last_transaction_timestamp: any;
                last_transaction_version: any;
                max_supply?: any | null;
                mutable_description?: boolean | null;
                mutable_uri?: boolean | null;
                table_handle_v1?: string | null;
                token_standard: string;
                total_minted_v2?: any | null;
                uri: string;
            } | null;
        } | null;
    }>;
};
type GetTokenDataQuery = {
    __typename?: 'query_root';
    current_token_datas_v2: Array<{
        __typename?: 'current_token_datas_v2';
        collection_id: string;
        description: string;
        is_fungible_v2?: boolean | null;
        largest_property_version_v1?: any | null;
        last_transaction_timestamp: any;
        last_transaction_version: any;
        maximum?: any | null;
        supply: any;
        token_data_id: string;
        token_name: string;
        token_properties: any;
        token_standard: string;
        token_uri: string;
        current_collection?: {
            __typename?: 'current_collections_v2';
            collection_id: string;
            collection_name: string;
            creator_address: string;
            current_supply: any;
            description: string;
            last_transaction_timestamp: any;
            last_transaction_version: any;
            max_supply?: any | null;
            mutable_description?: boolean | null;
            mutable_uri?: boolean | null;
            table_handle_v1?: string | null;
            token_standard: string;
            total_minted_v2?: any | null;
            uri: string;
        } | null;
    }>;
};
type GetTokenOwnedFromCollectionQuery = {
    __typename?: 'query_root';
    current_token_ownerships_v2: Array<{
        __typename?: 'current_token_ownerships_v2';
        token_standard: string;
        token_properties_mutated_v1?: any | null;
        token_data_id: string;
        table_type_v1?: string | null;
        storage_id: string;
        property_version_v1: any;
        owner_address: string;
        last_transaction_version: any;
        last_transaction_timestamp: any;
        is_soulbound_v2?: boolean | null;
        is_fungible_v2?: boolean | null;
        amount: any;
        current_token_data?: {
            __typename?: 'current_token_datas_v2';
            collection_id: string;
            description: string;
            is_fungible_v2?: boolean | null;
            largest_property_version_v1?: any | null;
            last_transaction_timestamp: any;
            last_transaction_version: any;
            maximum?: any | null;
            supply: any;
            token_data_id: string;
            token_name: string;
            token_properties: any;
            token_standard: string;
            token_uri: string;
            current_collection?: {
                __typename?: 'current_collections_v2';
                collection_id: string;
                collection_name: string;
                creator_address: string;
                current_supply: any;
                description: string;
                last_transaction_timestamp: any;
                last_transaction_version: any;
                max_supply?: any | null;
                mutable_description?: boolean | null;
                mutable_uri?: boolean | null;
                table_handle_v1?: string | null;
                token_standard: string;
                total_minted_v2?: any | null;
                uri: string;
            } | null;
        } | null;
    }>;
};
type GetTokenOwnersDataQuery = {
    __typename?: 'query_root';
    current_token_ownerships_v2: Array<{
        __typename?: 'current_token_ownerships_v2';
        token_standard: string;
        token_properties_mutated_v1?: any | null;
        token_data_id: string;
        table_type_v1?: string | null;
        storage_id: string;
        property_version_v1: any;
        owner_address: string;
        last_transaction_version: any;
        last_transaction_timestamp: any;
        is_soulbound_v2?: boolean | null;
        is_fungible_v2?: boolean | null;
        amount: any;
        current_token_data?: {
            __typename?: 'current_token_datas_v2';
            collection_id: string;
            description: string;
            is_fungible_v2?: boolean | null;
            largest_property_version_v1?: any | null;
            last_transaction_timestamp: any;
            last_transaction_version: any;
            maximum?: any | null;
            supply: any;
            token_data_id: string;
            token_name: string;
            token_properties: any;
            token_standard: string;
            token_uri: string;
            current_collection?: {
                __typename?: 'current_collections_v2';
                collection_id: string;
                collection_name: string;
                creator_address: string;
                current_supply: any;
                description: string;
                last_transaction_timestamp: any;
                last_transaction_version: any;
                max_supply?: any | null;
                mutable_description?: boolean | null;
                mutable_uri?: boolean | null;
                table_handle_v1?: string | null;
                token_standard: string;
                total_minted_v2?: any | null;
                uri: string;
            } | null;
        } | null;
    }>;
};
type GetTopUserTransactionsQuery = {
    __typename?: 'query_root';
    user_transactions: Array<{
        __typename?: 'user_transactions';
        version: any;
    }>;
};
type GetUserTransactionsQuery = {
    __typename?: 'query_root';
    user_transactions: Array<{
        __typename?: 'user_transactions';
        version: any;
    }>;
};

/**
 * Controls the number of results that are returned and the starting position of those results.
 * limit specifies the maximum number of items or records to return in a query result.
 * offset parameter specifies the starting position of the query result within the set of data.
 * For example, if you want to retrieve records 11-20,
 * you would set the offset parameter to 10 (i.e., the index of the first record to retrieve is 10)
 * and the limit parameter to 10 (i.e., the number of records to retrieve is 10))
 */
interface IndexerPaginationArgs {
    offset?: AnyNumber;
    limit?: number;
}
/**
 * Holds a generic type that being passed by each function and holds an
 * array of properties we can sort the query by
 */
type IndexerSortBy<T> = IndexerSortingOptions<T>;
type IndexerSortingOptions<T> = {
    [K in keyof T]?: T[K] extends InputMaybe<infer U> ? IndexerSortingOptions<U> | U | IndexerOrderBy : T[K] | IndexerOrderBy;
};
type IndexerOrderBy = "asc" | "desc";
/**
 * Refers to the token standard we want to query for
 */
type TokenStandard = "v1" | "v2";
/**
 * The graphql query type to pass into the `queryIndexer` function
 */
type GraphqlQuery = {
    query: string;
    variables?: {};
};
/**
 * Provides methods for retrieving data from Aptos Indexer.
 * For more detailed Queries specification see
 * {@link https://cloud.hasura.io/public/graphiql?endpoint=https://indexer.mainnet.aptoslabs.com/v1/graphql}
 *
 * Some methods support optional extra arguments, such as - TokenStandard, IndexerSortBy, IndexerPaginationArgs
 *
 * @param TokenStandard is of type `v1` or `v2` and it refers to the token standard we want to query for.
 * @example An example of how to pass a specific token standard
 * ```
 * {
 *    tokenStandard:"v2"
 * }
 * ```
 *
 * @param IndexerSortBy has a generic type that being passed by each function and holds an
 * array of properties we can sort the query by
 * @example An example of how to sort by a specific field
 * ```
 * {
 *  orderBy: [{ token_standard: "desc" }]
 * }
 * ```
 *
 * @param IndexerPaginationArgs Controls the number of results that are returned and the starting position
 * of those results.
 * limit specifies the maximum number of items or records to return in a query result.
 * offset parameter specifies the starting position of the query result within the set of data.
 * For example, if you want to retrieve records 11-20,
 * you would set the offset parameter to 10 (i.e., the index of the first record to retrieve is 10)
 * and the limit parameter to 10 (i.e., the number of records to retrieve is 10))
 *
 * @example An example of how to set the `limit` and `offset`
 * ```
 * {
 *  { offset: 2, limit: 4 }
 * }
 * ```
 */
declare class IndexerClient {
    readonly endpoint: string;
    readonly config: ClientConfig | undefined;
    /**
     * @param endpoint URL of the Aptos Indexer API endpoint.
     */
    constructor(endpoint: string, config?: ClientConfig);
    /**
     * Indexer only accepts address in the long format, i.e a 66 chars long -> 0x<64 chars>
     * This method makes sure address is 66 chars long.
     * @param address
     */
    static validateAddress(address: string): void;
    /**
     * Makes axios client call to fetch data from Aptos Indexer.
     *
     * @param graphqlQuery A GraphQL query to pass in the `data` axios call.
     */
    queryIndexer<T>(graphqlQuery: GraphqlQuery): Promise<T>;
    /**
     * Queries Indexer Ledger Info
     *
     * @returns GetLedgerInfoQuery response type
     */
    getIndexerLedgerInfo(): Promise<GetIndexerLedgerInfoQuery>;
    /**
     * @deprecated please use `getOwnedTokens` query
     *
     * Queries an Aptos account's NFTs by owner address
     *
     * @param ownerAddress Hex-encoded 32 byte Aptos account address
     * @returns GetAccountCurrentTokensQuery response type
     */
    getAccountNFTs(ownerAddress: MaybeHexString, options?: IndexerPaginationArgs): Promise<GetAccountCurrentTokensQuery>;
    /**
     * Queries a token activities by token address (v2) or token data id (v1)
     *
     * @param idHash token address (v2) or token data id (v1)
     * @returns GetTokenActivitiesQuery response type
     */
    getTokenActivities(token: MaybeHexString, extraArgs?: {
        tokenStandard?: TokenStandard;
        options?: IndexerPaginationArgs;
        orderBy?: IndexerSortBy<Token_Activities_V2_Order_By>[];
    }): Promise<GetTokenActivitiesQuery>;
    /**
     * Gets the count of token's activities by token address (v2) or token data id (v1)
     *
     * @param token token address (v2) or token data id (v1)
     * @returns GetTokenActivitiesCountQuery response type
     */
    getTokenActivitiesCount(token: string): Promise<GetTokenActivitiesCountQuery>;
    /**
     * Gets the count of tokens owned by an account
     *
     * @param ownerAddress Owner address
     * @returns AccountTokensCountQuery response type
     */
    getAccountTokensCount(ownerAddress: MaybeHexString, extraArgs?: {
        tokenStandard?: TokenStandard;
        options?: IndexerPaginationArgs;
    }): Promise<GetAccountTokensCountQuery>;
    /**
     * Queries token data by token address (v2) or token data id (v1)
     *
     * @param token token address (v2) or token data id (v1)
     * @returns GetTokenDataQuery response type
     */
    getTokenData(token: string, extraArgs?: {
        tokenStandard?: TokenStandard;
        options?: IndexerPaginationArgs;
        orderBy?: IndexerSortBy<Current_Token_Datas_V2_Order_By>[];
    }): Promise<GetTokenDataQuery>;
    /**
     * Queries token owners data by token address (v2) or token data id (v1).
     * This query returns historical owners data.
     *
     * To fetch token v2 standard, pass in the optional `tokenStandard` parameter and
     * dont pass `propertyVersion` parameter (as propertyVersion only compatible with v1 standard)
     *
     * @param token token address (v2) or token data id (v1)
     * @param propertyVersion Property version (optional) - only compatible with token v1 standard
     * @returns GetTokenOwnersDataQuery response type
     */
    getTokenOwnersData(token: string, propertyVersion?: number, extraArgs?: {
        tokenStandard?: TokenStandard;
        options?: IndexerPaginationArgs;
        orderBy?: IndexerSortBy<Current_Token_Ownerships_V2_Order_By>[];
    }): Promise<GetTokenOwnersDataQuery>;
    /**
     * Queries current token owner data by token address (v2) or token data id (v1).
     * This query returns the current token owner data.
     *
     * To fetch token v2 standard, pass in the optional `tokenStandard` parameter and
     * dont pass `propertyVersion` parameter (as propertyVersion only compatible with v1 standard)
     *
     * @param token token address (v2) or token data id (v1)
     * @param propertyVersion Property version (optional) - only compatible with token v1 standard
     * @returns GetTokenCurrentOwnerDataQuery response type
     */
    getTokenCurrentOwnerData(token: string, propertyVersion?: number, extraArgs?: {
        tokenStandard?: TokenStandard;
        options?: IndexerPaginationArgs;
        orderBy?: IndexerSortBy<Current_Token_Ownerships_V2_Order_By>[];
    }): Promise<GetTokenCurrentOwnerDataQuery>;
    /**
     * Queries account's current owned tokens.
     * This query returns all tokens (v1 and v2 standards) an account owns, including NFTs, fungible, soulbound, etc.
     * If you want to get only the token from a specific standrd, you can pass an optional tokenStandard param
     *
     * @param ownerAddress The token owner address we want to get the tokens for
     * @returns GetOwnedTokensQuery response type
     */
    getOwnedTokens(ownerAddress: MaybeHexString, extraArgs?: {
        tokenStandard?: TokenStandard;
        options?: IndexerPaginationArgs;
        orderBy?: IndexerSortBy<Current_Token_Ownerships_V2_Order_By>[];
    }): Promise<GetOwnedTokensQuery>;
    /**
     * Queries account's current owned tokens by token address (v2) or token data id (v1).
     *
     * @param token token address (v2) or token data id (v1)
     * @returns GetOwnedTokensByTokenDataQuery response type
     */
    getOwnedTokensByTokenData(token: MaybeHexString, extraArgs?: {
        tokenStandard?: TokenStandard;
        options?: IndexerPaginationArgs;
        orderBy?: IndexerSortBy<Current_Token_Ownerships_V2_Order_By>[];
    }): Promise<GetOwnedTokensByTokenDataQuery>;
    /**
     * Queries all tokens of a specific collection that an account owns by the collection address
     *
     * @param ownerAddress owner address that owns the tokens
     * @param collectionAddress the collection address
     * @returns GetTokenOwnedFromCollectionQuery response type
     */
    getTokenOwnedFromCollectionAddress(ownerAddress: MaybeHexString, collectionAddress: string, extraArgs?: {
        tokenStandard?: TokenStandard;
        options?: IndexerPaginationArgs;
        orderBy?: IndexerSortBy<Current_Token_Ownerships_V2_Order_By>[];
    }): Promise<GetTokenOwnedFromCollectionQuery>;
    /**
     * Queries all tokens of a specific collection that an account owns by the collection name and collection
     * creator address
     *
     * @param ownerAddress owner address that owns the tokens
     * @param collectionName the collection name
     * @param creatorAddress the collection creator address
     * @returns GetTokenOwnedFromCollectionQuery response type
     */
    getTokenOwnedFromCollectionNameAndCreatorAddress(ownerAddress: MaybeHexString, collectionName: string, creatorAddress: MaybeHexString, extraArgs?: {
        tokenStandard?: TokenStandard;
        options?: IndexerPaginationArgs;
    }): Promise<GetTokenOwnedFromCollectionQuery>;
    /**
     * Queries data of a specific collection by the collection creator address and the collection name.
     *
     * if, for some reason, a creator account has 2 collections with the same name in v1 and v2,
     * can pass an optional `tokenStandard` parameter to query a specific standard
     *
     * @param creatorAddress the collection creator address
     * @param collectionName the collection name
     * @returns GetCollectionDataQuery response type
     */
    getCollectionData(creatorAddress: MaybeHexString, collectionName: string, extraArgs?: {
        tokenStandard?: TokenStandard;
        options?: IndexerPaginationArgs;
        orderBy?: IndexerSortBy<Current_Collections_V2_Order_By>[];
    }): Promise<GetCollectionDataQuery>;
    /**
     * Queries a collection address.
     *
     * @param creatorAddress the collection creator address
     * @param collectionName the collection name
     * @returns the collection address
     */
    getCollectionAddress(creatorAddress: MaybeHexString, collectionName: string, extraArgs?: {
        tokenStandard?: TokenStandard;
        orderBy?: IndexerSortBy<Current_Collections_V2_Order_By>[];
    }): Promise<string>;
    /**
     * Queries for all collections that an account has tokens for.
     *
     * @param ownerAddress the account address that owns the tokens
     * @returns GetCollectionsWithOwnedTokensQuery response type
     */
    getCollectionsWithOwnedTokens(ownerAddress: MaybeHexString, extraArgs?: {
        tokenStandard?: TokenStandard;
        options?: IndexerPaginationArgs;
        orderBy?: IndexerSortBy<Current_Collection_Ownership_V2_View_Order_By>[];
    }): Promise<GetCollectionsWithOwnedTokensQuery>;
    /**
     * Gets the count of transactions submitted by an account
     *
     * @param address Account address
     * @returns GetAccountTransactionsCountQuery response type
     */
    getAccountTransactionsCount(accountAddress: MaybeHexString): Promise<GetAccountTransactionsCountQuery>;
    /**
     * Queries an account transactions data
     *
     * @param address Account address
     * @returns GetAccountTransactionsDataQuery response type
     */
    getAccountTransactionsData(accountAddress: MaybeHexString, extraArgs?: {
        options?: IndexerPaginationArgs;
        orderBy?: IndexerSortBy<Account_Transactions_Order_By>[];
    }): Promise<GetAccountTransactionsDataQuery>;
    /**
     * Queries top user transactions
     *
     * @param limit
     * @returns GetTopUserTransactionsQuery response type
     */
    getTopUserTransactions(limit: number): Promise<GetTopUserTransactionsQuery>;
    /**
     * Queries top user transactions
     *
     * @param startVersion optional - can be set to tell indexer what version to start from
     * @returns GetUserTransactionsQuery response type
     */
    getUserTransactions(extraArgs?: {
        startVersion?: number;
        options?: IndexerPaginationArgs;
        orderBy?: IndexerSortBy<User_Transactions_Order_By>[];
    }): Promise<GetUserTransactionsQuery>;
    /**
     * Queries delegated staking activities
     *
     * @param delegatorAddress Delegator address
     * @param poolAddress Pool address
     * @returns GetDelegatedStakingActivitiesQuery response type
     */
    getDelegatedStakingActivities(delegatorAddress: MaybeHexString, poolAddress: MaybeHexString): Promise<GetDelegatedStakingActivitiesQuery>;
    /**
     * Queries current number of delegators in a pool
     *
     * @returns GetNumberOfDelegatorsQuery response type
     */
    getNumberOfDelegators(poolAddress: MaybeHexString): Promise<GetNumberOfDelegatorsQuery>;
    /**
     * Queries an account coin data
     *
     * @param ownerAddress Owner address
     * @returns GetAccountCoinsDataQuery response type
     */
    getAccountCoinsData(ownerAddress: MaybeHexString, extraArgs?: {
        options?: IndexerPaginationArgs;
        orderBy?: IndexerSortBy<Current_Fungible_Asset_Balances_Order_By>[];
    }): Promise<GetAccountCoinsDataQuery>;
    /**
     * Queries an account coin data count
     *
     * @param ownerAddress Owner address
     * @returns GetAccountCoinsDataCountQuery response type
     */
    getAccountCoinsDataCount(ownerAddress: MaybeHexString): Promise<GetAccountCoinsDataCountQuery>;
    /**
     * Queries an account owned objects
     *
     * @param ownerAddress Owner address
     * @returns GetCurrentObjectsQuery response type
     */
    getAccountOwnedObjects(ownerAddress: MaybeHexString, extraArgs?: {
        options?: IndexerPaginationArgs;
        orderBy?: IndexerSortBy<Current_Objects_Order_By>[];
    }): Promise<GetCurrentObjectsQuery>;
}

/**
 * Exported as TransactionBuilderTypes.AccountAddress
 */
declare class AccountAddress {
    static readonly LENGTH: number;
    readonly address: Bytes;
    static CORE_CODE_ADDRESS: AccountAddress;
    constructor(address: Bytes);
    /**
     * Creates AccountAddress from a hex string.
     * @param addr Hex string can be with a prefix or without a prefix,
     *   e.g. '0x1aa' or '1aa'. Hex string will be left padded with 0s if too short.
     */
    static fromHex(addr: MaybeHexString): AccountAddress;
    /**
     * Checks if the string is a valid AccountAddress
     * @param addr Hex string can be with a prefix or without a prefix,
     *   e.g. '0x1aa' or '1aa'. Hex string will be left padded with 0s if too short.
     */
    static isValid(addr: MaybeHexString): boolean;
    /**
     * Return a hex string from account Address.
     */
    toHexString(): MaybeHexString;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): AccountAddress;
    /**
     * Standardizes an address to the format "0x" followed by 64 lowercase hexadecimal digits.
     */
    static standardizeAddress(address: string): string;
}

declare class Ed25519PublicKey {
    static readonly LENGTH: number;
    readonly value: Bytes;
    constructor(value: Bytes);
    toBytes(): Bytes;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Ed25519PublicKey;
}
declare class Ed25519Signature {
    readonly value: Bytes;
    static readonly LENGTH = 64;
    constructor(value: Bytes);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Ed25519Signature;
}

declare class MultiEd25519PublicKey {
    readonly public_keys: Seq<Ed25519PublicKey>;
    readonly threshold: Uint8;
    /**
     * Public key for a K-of-N multisig transaction. A K-of-N multisig transaction means that for such a
     * transaction to be executed, at least K out of the N authorized signers have signed the transaction
     * and passed the check conducted by the chain.
     *
     * @see {@link
     * https://aptos.dev/guides/creating-a-signed-transaction#multisignature-transactions | Creating a Signed Transaction}
     *
     * @param public_keys A list of public keys
     * @param threshold At least "threshold" signatures must be valid
     */
    constructor(public_keys: Seq<Ed25519PublicKey>, threshold: Uint8);
    /**
     * Converts a MultiEd25519PublicKey into bytes with: bytes = p1_bytes | ... | pn_bytes | threshold
     */
    toBytes(): Bytes;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): MultiEd25519PublicKey;
}
declare class MultiEd25519Signature {
    readonly signatures: Seq<Ed25519Signature>;
    readonly bitmap: Uint8Array;
    static BITMAP_LEN: Uint8;
    /**
     * Signature for a K-of-N multisig transaction.
     *
     * @see {@link
     * https://aptos.dev/guides/creating-a-signed-transaction#multisignature-transactions | Creating a Signed Transaction}
     *
     * @param signatures A list of ed25519 signatures
     * @param bitmap 4 bytes, at most 32 signatures are supported. If Nth bit value is `1`, the Nth
     * signature should be provided in `signatures`. Bits are read from left to right
     */
    constructor(signatures: Seq<Ed25519Signature>, bitmap: Uint8Array);
    /**
     * Converts a MultiEd25519Signature into bytes with `bytes = s1_bytes | ... | sn_bytes | bitmap`
     */
    toBytes(): Bytes;
    /**
     * Helper method to create a bitmap out of the specified bit positions
     * @param bits The bitmap positions that should be set. A position starts at index 0.
     * Valid position should range between 0 and 31.
     * @example
     * Here's an example of valid `bits`
     * ```
     * [0, 2, 31]
     * ```
     * `[0, 2, 31]` means the 1st, 3rd and 32nd bits should be set in the bitmap.
     * The result bitmap should be 0b1010000000000000000000000000001
     *
     * @returns bitmap that is 32bit long
     */
    static createBitmap(bits: Seq<Uint8>): Uint8Array;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): MultiEd25519Signature;
}

declare abstract class TransactionAuthenticator {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): TransactionAuthenticator;
}
declare class TransactionAuthenticatorEd25519 extends TransactionAuthenticator {
    readonly public_key: Ed25519PublicKey;
    readonly signature: Ed25519Signature;
    /**
     * An authenticator for single signature.
     *
     * @param public_key Client's public key.
     * @param signature Signature of a raw transaction.
     * @see {@link https://aptos.dev/guides/creating-a-signed-transaction/ | Creating a Signed Transaction}
     * for details about generating a signature.
     */
    constructor(public_key: Ed25519PublicKey, signature: Ed25519Signature);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionAuthenticatorEd25519;
}
declare class TransactionAuthenticatorMultiEd25519 extends TransactionAuthenticator {
    readonly public_key: MultiEd25519PublicKey;
    readonly signature: MultiEd25519Signature;
    /**
     * An authenticator for multiple signatures.
     *
     * @param public_key
     * @param signature
     *
     */
    constructor(public_key: MultiEd25519PublicKey, signature: MultiEd25519Signature);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionAuthenticatorMultiEd25519;
}
declare class TransactionAuthenticatorMultiAgent extends TransactionAuthenticator {
    readonly sender: AccountAuthenticator;
    readonly secondary_signer_addresses: Seq<AccountAddress>;
    readonly secondary_signers: Seq<AccountAuthenticator>;
    constructor(sender: AccountAuthenticator, secondary_signer_addresses: Seq<AccountAddress>, secondary_signers: Seq<AccountAuthenticator>);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionAuthenticatorMultiAgent;
}
declare class TransactionAuthenticatorFeePayer extends TransactionAuthenticator {
    readonly sender: AccountAuthenticator;
    readonly secondary_signer_addresses: Seq<AccountAddress>;
    readonly secondary_signers: Seq<AccountAuthenticator>;
    readonly fee_payer: {
        address: AccountAddress;
        authenticator: AccountAuthenticator;
    };
    constructor(sender: AccountAuthenticator, secondary_signer_addresses: Seq<AccountAddress>, secondary_signers: Seq<AccountAuthenticator>, fee_payer: {
        address: AccountAddress;
        authenticator: AccountAuthenticator;
    });
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionAuthenticatorMultiAgent;
}
declare abstract class AccountAuthenticator {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): AccountAuthenticator;
}
declare class AccountAuthenticatorEd25519 extends AccountAuthenticator {
    readonly public_key: Ed25519PublicKey;
    readonly signature: Ed25519Signature;
    constructor(public_key: Ed25519PublicKey, signature: Ed25519Signature);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): AccountAuthenticatorEd25519;
}
declare class AccountAuthenticatorMultiEd25519 extends AccountAuthenticator {
    readonly public_key: MultiEd25519PublicKey;
    readonly signature: MultiEd25519Signature;
    constructor(public_key: MultiEd25519PublicKey, signature: MultiEd25519Signature);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): AccountAuthenticatorMultiEd25519;
}

declare class Identifier {
    value: string;
    constructor(value: string);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Identifier;
}

declare abstract class TypeTag {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): TypeTag;
}
declare class TypeTagBool extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagBool;
}
declare class TypeTagU8 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU8;
}
declare class TypeTagU16 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU16;
}
declare class TypeTagU32 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU32;
}
declare class TypeTagU64 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU64;
}
declare class TypeTagU128 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU128;
}
declare class TypeTagU256 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU256;
}
declare class TypeTagAddress extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagAddress;
}
declare class TypeTagSigner extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagSigner;
}
declare class TypeTagVector extends TypeTag {
    readonly value: TypeTag;
    constructor(value: TypeTag);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TypeTagVector;
}
declare class TypeTagStruct extends TypeTag {
    readonly value: StructTag;
    constructor(value: StructTag);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TypeTagStruct;
    isStringTypeTag(): boolean;
}
declare class StructTag {
    readonly address: AccountAddress;
    readonly module_name: Identifier;
    readonly name: Identifier;
    readonly type_args: Seq<TypeTag>;
    constructor(address: AccountAddress, module_name: Identifier, name: Identifier, type_args: Seq<TypeTag>);
    /**
     * Converts a string literal to a StructTag
     * @param structTag String literal in format "AcountAddress::module_name::ResourceName",
     *   e.g. "0x1::aptos_coin::AptosCoin"
     * @returns
     */
    static fromString(structTag: string): StructTag;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): StructTag;
}
declare const stringStructTag: StructTag;
declare function optionStructTag(typeArg: TypeTag): StructTag;
declare function objectStructTag(typeArg: TypeTag): StructTag;
/**
 * Parser to parse a type tag string
 */
declare class TypeTagParser {
    private readonly tokens;
    private readonly typeTags;
    constructor(tagStr: string, typeTags?: string[]);
    private consume;
    /**
     * Consumes all of an unused generic field, mostly applicable to object
     *
     * Note: This is recursive.  it can be problematic if there's bad input
     * @private
     */
    private consumeWholeGeneric;
    private parseCommaList;
    parseTypeTag(): TypeTag;
}
declare class TypeTagParserError extends Error {
    constructor(message: string);
}

declare class RawTransaction {
    readonly sender: AccountAddress;
    readonly sequence_number: Uint64;
    readonly payload: TransactionPayload;
    readonly max_gas_amount: Uint64;
    readonly gas_unit_price: Uint64;
    readonly expiration_timestamp_secs: Uint64;
    readonly chain_id: ChainId;
    /**
     * RawTransactions contain the metadata and payloads that can be submitted to Aptos chain for execution.
     * RawTransactions must be signed before Aptos chain can execute them.
     *
     * @param sender Account address of the sender.
     * @param sequence_number Sequence number of this transaction. This must match the sequence number stored in
     *   the sender's account at the time the transaction executes.
     * @param payload Instructions for the Aptos Blockchain, including publishing a module,
     *   execute a entry function or execute a script payload.
     * @param max_gas_amount Maximum total gas to spend for this transaction. The account must have more
     *   than this gas or the transaction will be discarded during validation.
     * @param gas_unit_price Price to be paid per gas unit.
     * @param expiration_timestamp_secs The blockchain timestamp at which the blockchain would discard this transaction.
     * @param chain_id The chain ID of the blockchain that this transaction is intended to be run on.
     */
    constructor(sender: AccountAddress, sequence_number: Uint64, payload: TransactionPayload, max_gas_amount: Uint64, gas_unit_price: Uint64, expiration_timestamp_secs: Uint64, chain_id: ChainId);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): RawTransaction;
}
declare class Script {
    readonly code: Bytes;
    readonly ty_args: Seq<TypeTag>;
    readonly args: Seq<TransactionArgument>;
    /**
     * Scripts contain the Move bytecodes payload that can be submitted to Aptos chain for execution.
     * @param code Move bytecode
     * @param ty_args Type arguments that bytecode requires.
     *
     * @example
     * A coin transfer function has one type argument "CoinType".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     * @param args Arugments to bytecode function.
     *
     * @example
     * A coin transfer function has three arugments "from", "to" and "amount".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     */
    constructor(code: Bytes, ty_args: Seq<TypeTag>, args: Seq<TransactionArgument>);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Script;
}
declare class EntryFunction {
    readonly module_name: ModuleId;
    readonly function_name: Identifier;
    readonly ty_args: Seq<TypeTag>;
    readonly args: Seq<Bytes>;
    /**
     * Contains the payload to run a function within a module.
     * @param module_name Fully qualified module name. ModuleId consists of account address and module name.
     * @param function_name The function to run.
     * @param ty_args Type arguments that move function requires.
     *
     * @example
     * A coin transfer function has one type argument "CoinType".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     * @param args Arugments to the move function.
     *
     * @example
     * A coin transfer function has three arugments "from", "to" and "amount".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     */
    constructor(module_name: ModuleId, function_name: Identifier, ty_args: Seq<TypeTag>, args: Seq<Bytes>);
    /**
     *
     * @param module Fully qualified module name in format "AccountAddress::module_name" e.g. "0x1::coin"
     * @param func Function name
     * @param ty_args Type arguments that move function requires.
     *
     * @example
     * A coin transfer function has one type argument "CoinType".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     * @param args Arugments to the move function.
     *
     * @example
     * A coin transfer function has three arugments "from", "to" and "amount".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     * @returns
     */
    static natural(module: string, func: string, ty_args: Seq<TypeTag>, args: Seq<Bytes>): EntryFunction;
    /**
     * `natual` is deprecated, please use `natural`
     *
     * @deprecated.
     */
    static natual(module: string, func: string, ty_args: Seq<TypeTag>, args: Seq<Bytes>): EntryFunction;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): EntryFunction;
}
declare class MultiSigTransactionPayload {
    readonly transaction_payload: EntryFunction;
    /**
     * Contains the payload to run a multisig account transaction.
     * @param transaction_payload The payload of the multisig transaction. This can only be EntryFunction for now but
     * Script might be supported in the future.
     */
    constructor(transaction_payload: EntryFunction);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): MultiSigTransactionPayload;
}
declare class MultiSig {
    readonly multisig_address: AccountAddress;
    readonly transaction_payload?: MultiSigTransactionPayload | undefined;
    /**
     * Contains the payload to run a multisig account transaction.
     * @param multisig_address The multisig account address the transaction will be executed as.
     * @param transaction_payload The payload of the multisig transaction. This is optional when executing a multisig
     *  transaction whose payload is already stored on chain.
     */
    constructor(multisig_address: AccountAddress, transaction_payload?: MultiSigTransactionPayload | undefined);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): MultiSig;
}
declare class Module {
    readonly code: Bytes;
    /**
     * Contains the bytecode of a Move module that can be published to the Aptos chain.
     * @param code Move bytecode of a module.
     */
    constructor(code: Bytes);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Module;
}
declare class ModuleId {
    readonly address: AccountAddress;
    readonly name: Identifier;
    /**
     * Full name of a module.
     * @param address The account address.
     * @param name The name of the module under the account at "address".
     */
    constructor(address: AccountAddress, name: Identifier);
    /**
     * Converts a string literal to a ModuleId
     * @param moduleId String literal in format "AccountAddress::module_name", e.g. "0x1::coin"
     * @returns
     */
    static fromStr(moduleId: string): ModuleId;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): ModuleId;
}
declare class ChangeSet {
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): ChangeSet;
}
declare class WriteSet {
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): WriteSet;
}
declare class SignedTransaction {
    readonly raw_txn: RawTransaction;
    readonly authenticator: TransactionAuthenticator;
    /**
     * A SignedTransaction consists of a raw transaction and an authenticator. The authenticator
     * contains a client's public key and the signature of the raw transaction.
     *
     * @see {@link https://aptos.dev/guides/creating-a-signed-transaction/ | Creating a Signed Transaction}
     *
     * @param raw_txn
     * @param authenticator Contains a client's public key and the signature of the raw transaction.
     *   Authenticator has 3 flavors: single signature, multi-signature and multi-agent.
     *   @see authenticator.ts for details.
     */
    constructor(raw_txn: RawTransaction, authenticator: TransactionAuthenticator);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): SignedTransaction;
}
declare abstract class RawTransactionWithData {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): RawTransactionWithData;
}
declare class MultiAgentRawTransaction extends RawTransactionWithData {
    readonly raw_txn: RawTransaction;
    readonly secondary_signer_addresses: Seq<AccountAddress>;
    constructor(raw_txn: RawTransaction, secondary_signer_addresses: Seq<AccountAddress>);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): MultiAgentRawTransaction;
}
declare class FeePayerRawTransaction extends RawTransactionWithData {
    readonly raw_txn: RawTransaction;
    readonly secondary_signer_addresses: Seq<AccountAddress>;
    readonly fee_payer_address: AccountAddress;
    constructor(raw_txn: RawTransaction, secondary_signer_addresses: Seq<AccountAddress>, fee_payer_address: AccountAddress);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): FeePayerRawTransaction;
}
declare abstract class TransactionPayload {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): TransactionPayload;
}
declare class TransactionPayloadScript extends TransactionPayload {
    readonly value: Script;
    constructor(value: Script);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionPayloadScript;
}
declare class TransactionPayloadEntryFunction extends TransactionPayload {
    readonly value: EntryFunction;
    constructor(value: EntryFunction);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionPayloadEntryFunction;
}
declare class TransactionPayloadMultisig extends TransactionPayload {
    readonly value: MultiSig;
    constructor(value: MultiSig);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionPayloadMultisig;
}
declare class ChainId {
    readonly value: Uint8;
    constructor(value: Uint8);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): ChainId;
}
declare abstract class TransactionArgument {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): TransactionArgument;
}
declare class TransactionArgumentU8 extends TransactionArgument {
    readonly value: Uint8;
    constructor(value: Uint8);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU8;
}
declare class TransactionArgumentU16 extends TransactionArgument {
    readonly value: Uint16;
    constructor(value: Uint16);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU16;
}
declare class TransactionArgumentU32 extends TransactionArgument {
    readonly value: Uint16;
    constructor(value: Uint16);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU32;
}
declare class TransactionArgumentU64 extends TransactionArgument {
    readonly value: Uint64;
    constructor(value: Uint64);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU64;
}
declare class TransactionArgumentU128 extends TransactionArgument {
    readonly value: Uint128;
    constructor(value: Uint128);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU128;
}
declare class TransactionArgumentU256 extends TransactionArgument {
    readonly value: Uint256;
    constructor(value: Uint256);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU256;
}
declare class TransactionArgumentAddress extends TransactionArgument {
    readonly value: AccountAddress;
    constructor(value: AccountAddress);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentAddress;
}
declare class TransactionArgumentU8Vector extends TransactionArgument {
    readonly value: Bytes;
    constructor(value: Bytes);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU8Vector;
}
declare class TransactionArgumentBool extends TransactionArgument {
    readonly value: boolean;
    constructor(value: boolean);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentBool;
}
declare abstract class Transaction {
    abstract serialize(serializer: Serializer): void;
    abstract hash(): Bytes;
    getHashSalt(): Bytes;
    static deserialize(deserializer: Deserializer): Transaction;
}
declare class UserTransaction extends Transaction {
    readonly value: SignedTransaction;
    constructor(value: SignedTransaction);
    hash(): Bytes;
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): UserTransaction;
}

declare class TypeArgumentABI {
    readonly name: string;
    /**
     * Constructs a TypeArgumentABI instance.
     * @param name
     */
    constructor(name: string);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): TypeArgumentABI;
}
declare class ArgumentABI {
    readonly name: string;
    readonly type_tag: TypeTag;
    /**
     * Constructs an ArgumentABI instance.
     * @param name
     * @param type_tag
     */
    constructor(name: string, type_tag: TypeTag);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): ArgumentABI;
}
declare abstract class ScriptABI {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): ScriptABI;
}
declare class TransactionScriptABI extends ScriptABI {
    readonly name: string;
    readonly doc: string;
    readonly code: Bytes;
    readonly ty_args: Seq<TypeArgumentABI>;
    readonly args: Seq<ArgumentABI>;
    /**
     * Constructs a TransactionScriptABI instance.
     * @param name Entry function name
     * @param doc
     * @param code
     * @param ty_args
     * @param args
     */
    constructor(name: string, doc: string, code: Bytes, ty_args: Seq<TypeArgumentABI>, args: Seq<ArgumentABI>);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionScriptABI;
}
declare class EntryFunctionABI extends ScriptABI {
    readonly name: string;
    readonly module_name: ModuleId;
    readonly doc: string;
    readonly ty_args: Seq<TypeArgumentABI>;
    readonly args: Seq<ArgumentABI>;
    /**
     * Constructs a EntryFunctionABI instance
     * @param name
     * @param module_name Fully qualified module id
     * @param doc
     * @param ty_args
     * @param args
     */
    constructor(name: string, module_name: ModuleId, doc: string, ty_args: Seq<TypeArgumentABI>, args: Seq<ArgumentABI>);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): EntryFunctionABI;
}

/**
 * Each account stores an authentication key. Authentication key enables account owners to rotate
 * their private key(s) associated with the account without changing the address that hosts their account.
 * @see {@link * https://aptos.dev/concepts/accounts | Account Basics}
 *
 * Account addresses can be derived from AuthenticationKey
 */
declare class AuthenticationKey {
    static readonly LENGTH: number;
    static readonly MULTI_ED25519_SCHEME: number;
    static readonly ED25519_SCHEME: number;
    static readonly DERIVE_RESOURCE_ACCOUNT_SCHEME: number;
    readonly bytes: Bytes;
    constructor(bytes: Bytes);
    /**
     * Converts a K-of-N MultiEd25519PublicKey to AuthenticationKey with:
     * `auth_key = sha3-256(p_1 | … | p_n | K | 0x01)`. `K` represents the K-of-N required for
     * authenticating the transaction. `0x01` is the 1-byte scheme for multisig.
     */
    static fromMultiEd25519PublicKey(publicKey: MultiEd25519PublicKey): AuthenticationKey;
    static fromEd25519PublicKey(publicKey: Ed25519PublicKey): AuthenticationKey;
    /**
     * Derives an account address from AuthenticationKey. Since current AccountAddress is 32 bytes,
     * AuthenticationKey bytes are directly translated to AccountAddress.
     */
    derivedAddress(): HexString;
}

declare class RotationProofChallenge {
    readonly accountAddress: AccountAddress;
    readonly moduleName: string;
    readonly structName: string;
    readonly sequenceNumber: AnyNumber;
    readonly originator: AccountAddress;
    readonly currentAuthKey: AccountAddress;
    readonly newPublicKey: Uint8Array;
    constructor(accountAddress: AccountAddress, moduleName: string, structName: string, sequenceNumber: AnyNumber, originator: AccountAddress, currentAuthKey: AccountAddress, newPublicKey: Uint8Array);
    serialize(serializer: Serializer): void;
}

type SigningMessage = Uint8Array;

type index_AccountAddress = AccountAddress;
declare const index_AccountAddress: typeof AccountAddress;
type index_AccountAuthenticator = AccountAuthenticator;
declare const index_AccountAuthenticator: typeof AccountAuthenticator;
type index_AccountAuthenticatorEd25519 = AccountAuthenticatorEd25519;
declare const index_AccountAuthenticatorEd25519: typeof AccountAuthenticatorEd25519;
type index_AccountAuthenticatorMultiEd25519 = AccountAuthenticatorMultiEd25519;
declare const index_AccountAuthenticatorMultiEd25519: typeof AccountAuthenticatorMultiEd25519;
type index_ArgumentABI = ArgumentABI;
declare const index_ArgumentABI: typeof ArgumentABI;
type index_AuthenticationKey = AuthenticationKey;
declare const index_AuthenticationKey: typeof AuthenticationKey;
type index_ChainId = ChainId;
declare const index_ChainId: typeof ChainId;
type index_ChangeSet = ChangeSet;
declare const index_ChangeSet: typeof ChangeSet;
type index_Ed25519PublicKey = Ed25519PublicKey;
declare const index_Ed25519PublicKey: typeof Ed25519PublicKey;
type index_Ed25519Signature = Ed25519Signature;
declare const index_Ed25519Signature: typeof Ed25519Signature;
type index_EntryFunction = EntryFunction;
declare const index_EntryFunction: typeof EntryFunction;
type index_EntryFunctionABI = EntryFunctionABI;
declare const index_EntryFunctionABI: typeof EntryFunctionABI;
type index_FeePayerRawTransaction = FeePayerRawTransaction;
declare const index_FeePayerRawTransaction: typeof FeePayerRawTransaction;
type index_Identifier = Identifier;
declare const index_Identifier: typeof Identifier;
type index_Module = Module;
declare const index_Module: typeof Module;
type index_ModuleId = ModuleId;
declare const index_ModuleId: typeof ModuleId;
type index_MultiAgentRawTransaction = MultiAgentRawTransaction;
declare const index_MultiAgentRawTransaction: typeof MultiAgentRawTransaction;
type index_MultiEd25519PublicKey = MultiEd25519PublicKey;
declare const index_MultiEd25519PublicKey: typeof MultiEd25519PublicKey;
type index_MultiEd25519Signature = MultiEd25519Signature;
declare const index_MultiEd25519Signature: typeof MultiEd25519Signature;
type index_MultiSig = MultiSig;
declare const index_MultiSig: typeof MultiSig;
type index_MultiSigTransactionPayload = MultiSigTransactionPayload;
declare const index_MultiSigTransactionPayload: typeof MultiSigTransactionPayload;
type index_RawTransaction = RawTransaction;
declare const index_RawTransaction: typeof RawTransaction;
type index_RawTransactionWithData = RawTransactionWithData;
declare const index_RawTransactionWithData: typeof RawTransactionWithData;
type index_RotationProofChallenge = RotationProofChallenge;
declare const index_RotationProofChallenge: typeof RotationProofChallenge;
type index_Script = Script;
declare const index_Script: typeof Script;
type index_ScriptABI = ScriptABI;
declare const index_ScriptABI: typeof ScriptABI;
type index_SignedTransaction = SignedTransaction;
declare const index_SignedTransaction: typeof SignedTransaction;
type index_SigningMessage = SigningMessage;
type index_StructTag = StructTag;
declare const index_StructTag: typeof StructTag;
type index_Transaction = Transaction;
declare const index_Transaction: typeof Transaction;
type index_TransactionArgument = TransactionArgument;
declare const index_TransactionArgument: typeof TransactionArgument;
type index_TransactionArgumentAddress = TransactionArgumentAddress;
declare const index_TransactionArgumentAddress: typeof TransactionArgumentAddress;
type index_TransactionArgumentBool = TransactionArgumentBool;
declare const index_TransactionArgumentBool: typeof TransactionArgumentBool;
type index_TransactionArgumentU128 = TransactionArgumentU128;
declare const index_TransactionArgumentU128: typeof TransactionArgumentU128;
type index_TransactionArgumentU16 = TransactionArgumentU16;
declare const index_TransactionArgumentU16: typeof TransactionArgumentU16;
type index_TransactionArgumentU256 = TransactionArgumentU256;
declare const index_TransactionArgumentU256: typeof TransactionArgumentU256;
type index_TransactionArgumentU32 = TransactionArgumentU32;
declare const index_TransactionArgumentU32: typeof TransactionArgumentU32;
type index_TransactionArgumentU64 = TransactionArgumentU64;
declare const index_TransactionArgumentU64: typeof TransactionArgumentU64;
type index_TransactionArgumentU8 = TransactionArgumentU8;
declare const index_TransactionArgumentU8: typeof TransactionArgumentU8;
type index_TransactionArgumentU8Vector = TransactionArgumentU8Vector;
declare const index_TransactionArgumentU8Vector: typeof TransactionArgumentU8Vector;
type index_TransactionAuthenticator = TransactionAuthenticator;
declare const index_TransactionAuthenticator: typeof TransactionAuthenticator;
type index_TransactionAuthenticatorEd25519 = TransactionAuthenticatorEd25519;
declare const index_TransactionAuthenticatorEd25519: typeof TransactionAuthenticatorEd25519;
type index_TransactionAuthenticatorFeePayer = TransactionAuthenticatorFeePayer;
declare const index_TransactionAuthenticatorFeePayer: typeof TransactionAuthenticatorFeePayer;
type index_TransactionAuthenticatorMultiAgent = TransactionAuthenticatorMultiAgent;
declare const index_TransactionAuthenticatorMultiAgent: typeof TransactionAuthenticatorMultiAgent;
type index_TransactionAuthenticatorMultiEd25519 = TransactionAuthenticatorMultiEd25519;
declare const index_TransactionAuthenticatorMultiEd25519: typeof TransactionAuthenticatorMultiEd25519;
type index_TransactionPayload = TransactionPayload;
declare const index_TransactionPayload: typeof TransactionPayload;
type index_TransactionPayloadEntryFunction = TransactionPayloadEntryFunction;
declare const index_TransactionPayloadEntryFunction: typeof TransactionPayloadEntryFunction;
type index_TransactionPayloadMultisig = TransactionPayloadMultisig;
declare const index_TransactionPayloadMultisig: typeof TransactionPayloadMultisig;
type index_TransactionPayloadScript = TransactionPayloadScript;
declare const index_TransactionPayloadScript: typeof TransactionPayloadScript;
type index_TransactionScriptABI = TransactionScriptABI;
declare const index_TransactionScriptABI: typeof TransactionScriptABI;
type index_TypeArgumentABI = TypeArgumentABI;
declare const index_TypeArgumentABI: typeof TypeArgumentABI;
type index_TypeTag = TypeTag;
declare const index_TypeTag: typeof TypeTag;
type index_TypeTagAddress = TypeTagAddress;
declare const index_TypeTagAddress: typeof TypeTagAddress;
type index_TypeTagBool = TypeTagBool;
declare const index_TypeTagBool: typeof TypeTagBool;
type index_TypeTagParser = TypeTagParser;
declare const index_TypeTagParser: typeof TypeTagParser;
type index_TypeTagParserError = TypeTagParserError;
declare const index_TypeTagParserError: typeof TypeTagParserError;
type index_TypeTagSigner = TypeTagSigner;
declare const index_TypeTagSigner: typeof TypeTagSigner;
type index_TypeTagStruct = TypeTagStruct;
declare const index_TypeTagStruct: typeof TypeTagStruct;
type index_TypeTagU128 = TypeTagU128;
declare const index_TypeTagU128: typeof TypeTagU128;
type index_TypeTagU16 = TypeTagU16;
declare const index_TypeTagU16: typeof TypeTagU16;
type index_TypeTagU256 = TypeTagU256;
declare const index_TypeTagU256: typeof TypeTagU256;
type index_TypeTagU32 = TypeTagU32;
declare const index_TypeTagU32: typeof TypeTagU32;
type index_TypeTagU64 = TypeTagU64;
declare const index_TypeTagU64: typeof TypeTagU64;
type index_TypeTagU8 = TypeTagU8;
declare const index_TypeTagU8: typeof TypeTagU8;
type index_TypeTagVector = TypeTagVector;
declare const index_TypeTagVector: typeof TypeTagVector;
type index_UserTransaction = UserTransaction;
declare const index_UserTransaction: typeof UserTransaction;
type index_WriteSet = WriteSet;
declare const index_WriteSet: typeof WriteSet;
declare const index_objectStructTag: typeof objectStructTag;
declare const index_optionStructTag: typeof optionStructTag;
declare const index_stringStructTag: typeof stringStructTag;
declare namespace index {
  export { index_AccountAddress as AccountAddress, index_AccountAuthenticator as AccountAuthenticator, index_AccountAuthenticatorEd25519 as AccountAuthenticatorEd25519, index_AccountAuthenticatorMultiEd25519 as AccountAuthenticatorMultiEd25519, index_ArgumentABI as ArgumentABI, index_AuthenticationKey as AuthenticationKey, index_ChainId as ChainId, index_ChangeSet as ChangeSet, index_Ed25519PublicKey as Ed25519PublicKey, index_Ed25519Signature as Ed25519Signature, index_EntryFunction as EntryFunction, index_EntryFunctionABI as EntryFunctionABI, index_FeePayerRawTransaction as FeePayerRawTransaction, index_Identifier as Identifier, index_Module as Module, index_ModuleId as ModuleId, index_MultiAgentRawTransaction as MultiAgentRawTransaction, index_MultiEd25519PublicKey as MultiEd25519PublicKey, index_MultiEd25519Signature as MultiEd25519Signature, index_MultiSig as MultiSig, index_MultiSigTransactionPayload as MultiSigTransactionPayload, index_RawTransaction as RawTransaction, index_RawTransactionWithData as RawTransactionWithData, index_RotationProofChallenge as RotationProofChallenge, index_Script as Script, index_ScriptABI as ScriptABI, index_SignedTransaction as SignedTransaction, type index_SigningMessage as SigningMessage, index_StructTag as StructTag, index_Transaction as Transaction, index_TransactionArgument as TransactionArgument, index_TransactionArgumentAddress as TransactionArgumentAddress, index_TransactionArgumentBool as TransactionArgumentBool, index_TransactionArgumentU128 as TransactionArgumentU128, index_TransactionArgumentU16 as TransactionArgumentU16, index_TransactionArgumentU256 as TransactionArgumentU256, index_TransactionArgumentU32 as TransactionArgumentU32, index_TransactionArgumentU64 as TransactionArgumentU64, index_TransactionArgumentU8 as TransactionArgumentU8, index_TransactionArgumentU8Vector as TransactionArgumentU8Vector, index_TransactionAuthenticator as TransactionAuthenticator, index_TransactionAuthenticatorEd25519 as TransactionAuthenticatorEd25519, index_TransactionAuthenticatorFeePayer as TransactionAuthenticatorFeePayer, index_TransactionAuthenticatorMultiAgent as TransactionAuthenticatorMultiAgent, index_TransactionAuthenticatorMultiEd25519 as TransactionAuthenticatorMultiEd25519, index_TransactionPayload as TransactionPayload, index_TransactionPayloadEntryFunction as TransactionPayloadEntryFunction, index_TransactionPayloadMultisig as TransactionPayloadMultisig, index_TransactionPayloadScript as TransactionPayloadScript, index_TransactionScriptABI as TransactionScriptABI, index_TypeArgumentABI as TypeArgumentABI, index_TypeTag as TypeTag, index_TypeTagAddress as TypeTagAddress, index_TypeTagBool as TypeTagBool, index_TypeTagParser as TypeTagParser, index_TypeTagParserError as TypeTagParserError, index_TypeTagSigner as TypeTagSigner, index_TypeTagStruct as TypeTagStruct, index_TypeTagU128 as TypeTagU128, index_TypeTagU16 as TypeTagU16, index_TypeTagU256 as TypeTagU256, index_TypeTagU32 as TypeTagU32, index_TypeTagU64 as TypeTagU64, index_TypeTagU8 as TypeTagU8, index_TypeTagVector as TypeTagVector, index_UserTransaction as UserTransaction, index_WriteSet as WriteSet, index_objectStructTag as objectStructTag, index_optionStructTag as optionStructTag, index_stringStructTag as stringStructTag };
}

type AnyRawTransaction = RawTransaction | MultiAgentRawTransaction | FeePayerRawTransaction;
/**
 * Function that takes in a Signing Message (serialized raw transaction)
 *  and returns a signature
 */
type SigningFn = (txn: SigningMessage) => Ed25519Signature | MultiEd25519Signature;
declare class TransactionBuilder<F extends SigningFn> {
    readonly rawTxnBuilder?: TransactionBuilderABI | undefined;
    protected readonly signingFunction: F;
    constructor(signingFunction: F, rawTxnBuilder?: TransactionBuilderABI | undefined);
    /**
     * Builds a RawTransaction. Relays the call to TransactionBuilderABI.build
     * @param func
     * @param ty_tags
     * @param args
     */
    build(func: string, ty_tags: string[], args: any[]): RawTransaction;
    /** Generates a Signing Message out of a raw transaction. */
    static getSigningMessage(rawTxn: AnyRawTransaction): SigningMessage;
}
/**
 * Provides signing method for signing a raw transaction with single public key.
 */
declare class TransactionBuilderEd25519 extends TransactionBuilder<SigningFn> {
    private readonly publicKey;
    constructor(signingFunction: SigningFn, publicKey: Uint8Array, rawTxnBuilder?: TransactionBuilderABI);
    rawToSigned(rawTxn: RawTransaction): SignedTransaction;
    /** Signs a raw transaction and returns a bcs serialized transaction. */
    sign(rawTxn: RawTransaction): Bytes;
}
/**
 * Provides signing method for signing a raw transaction with multisig public key.
 */
declare class TransactionBuilderMultiEd25519 extends TransactionBuilder<SigningFn> {
    private readonly publicKey;
    constructor(signingFunction: SigningFn, publicKey: MultiEd25519PublicKey);
    rawToSigned(rawTxn: RawTransaction): SignedTransaction;
    /** Signs a raw transaction and returns a bcs serialized transaction. */
    sign(rawTxn: RawTransaction): Bytes;
}
/**
 * Config for creating raw transactions.
 */
interface ABIBuilderConfig {
    sender: MaybeHexString | AccountAddress;
    sequenceNumber: Uint64 | string;
    gasUnitPrice: Uint64 | string;
    maxGasAmount?: Uint64 | string;
    expSecFromNow?: number | string;
    chainId: Uint8 | string;
}
/**
 * Builds raw transactions based on ABI
 */
declare class TransactionBuilderABI {
    private readonly abiMap;
    private readonly builderConfig;
    /**
     * Constructs a TransactionBuilderABI instance
     * @param abis List of binary ABIs.
     * @param builderConfig Configs for creating a raw transaction.
     */
    constructor(abis: Bytes[], builderConfig?: ABIBuilderConfig);
    private static toBCSArgs;
    private static toTransactionArguments;
    setSequenceNumber(seqNumber: Uint64 | string): void;
    /**
     * Builds a TransactionPayload. For dApps, chain ID and account sequence numbers are only known to the wallet.
     * Instead of building a RawTransaction (requires chainID and sequenceNumber), dApps can build a TransactionPayload
     * and pass the payload to the wallet for signing and sending.
     * @param func Fully qualified func names, e.g. 0x1::aptos_account::transfer
     * @param ty_tags TypeTag strings
     * @param args Function arguments
     * @returns TransactionPayload
     */
    buildTransactionPayload(func: string, ty_tags: string[], args: any[]): TransactionPayload;
    /**
     * Builds a RawTransaction
     * @param func Fully qualified func names, e.g. 0x1::aptos_account::transfer
     * @param ty_tags TypeTag strings.
     * @example Below are valid value examples
     * ```
     * // Structs are in format `AccountAddress::ModuleName::StructName`
     * 0x1::aptos_coin::AptosCoin
     * // Vectors are in format `vector<other_tag_string>`
     * vector<0x1::aptos_coin::AptosCoin>
     * bool
     * u8
     * u16
     * u32
     * u64
     * u128
     * u256
     * address
     * ```
     * @param args Function arguments
     * @returns RawTransaction
     */
    build(func: string, ty_tags: string[], args: any[]): RawTransaction;
}
type RemoteABIBuilderConfig = Partial<Omit<ABIBuilderConfig, "sender">> & {
    sender: MaybeHexString | AccountAddress;
};
interface AptosClientInterface {
    getAccountModules: (accountAddress: MaybeHexString) => Promise<MoveModuleBytecode[]>;
    getAccount: (accountAddress: MaybeHexString) => Promise<AccountData>;
    getChainId: () => Promise<number>;
    estimateGasPrice: () => Promise<GasEstimation>;
}
/**
 * This transaction builder downloads JSON ABIs from the fullnodes.
 * It then translates the JSON ABIs to the format that is accepted by TransactionBuilderABI
 */
declare class TransactionBuilderRemoteABI {
    private readonly aptosClient;
    private readonly builderConfig;
    constructor(aptosClient: AptosClientInterface, builderConfig: RemoteABIBuilderConfig);
    fetchABI(addr: string): Promise<Map<string, MoveFunction & {
        fullName: string;
    }>>;
    /**
     * Builds a raw transaction. Only support script function a.k.a entry function payloads
     *
     * @param func fully qualified function name in format <address>::<module>::<function>, e.g. 0x1::coin::transfer
     * @param ty_tags
     * @param args
     * @returns RawTransaction
     */
    build(func: EntryFunctionId, ty_tags: MoveType[], args: any[]): Promise<RawTransaction>;
}

declare function ensureBoolean(val: boolean | string): boolean;
declare function ensureNumber(val: number | string): number;
declare function ensureBigInt(val: number | bigint | string): bigint;
declare function serializeArg(argVal: any, argType: TypeTag, serializer: Serializer): void;
declare function argToTransactionArgument(argVal: any, argType: TypeTag): TransactionArgument;

interface OptionalTransactionArgs {
    maxGasAmount?: Uint64;
    gasUnitPrice?: Uint64;
    expireTimestamp?: Uint64;
    providedSequenceNumber?: string | bigint;
}
interface PaginationArgs {
    start?: AnyNumber;
    limit?: number;
}
/**
 * Provides methods for retrieving data from Aptos node.
 * For more detailed API specification see {@link https://fullnode.devnet.aptoslabs.com/v1/spec}
 */
declare class AptosClient {
    readonly nodeUrl: string;
    readonly config: ClientConfig | undefined;
    /**
     * Build a client configured to connect to an Aptos node at the given URL.
     *
     * Note: If you forget to append `/v1` to the URL, the client constructor
     * will automatically append it. If you don't want this URL processing to
     * take place, set doNotFixNodeUrl to true.
     *
     * @param nodeUrl URL of the Aptos Node API endpoint.
     * @param config Additional configuration options for the generated Axios client.
     */
    constructor(nodeUrl: string, config?: ClientConfig, doNotFixNodeUrl?: boolean);
    /**
     * Queries an Aptos account by address
     * @param accountAddress Hex-encoded 32 byte Aptos account address
     * @returns Core account resource, used for identifying account and transaction execution
     * @example An example of the returned account
     * ```
     * {
     *    sequence_number: "1",
     *    authentication_key: "0x5307b5f4bc67829097a8ba9b43dba3b88261eeccd1f709d9bde240fc100fbb69"
     * }
     * ```
     */
    getAccount(accountAddress: MaybeHexString): Promise<AccountData>;
    /**
     * Queries transactions sent by given account
     * @param accountAddress Hex-encoded 32 byte Aptos account address
     * @param query Optional pagination object
     * @param query.start The sequence number of the start transaction of the page. Default is 0.
     * @param query.limit The max number of transactions should be returned for the page. Default is 25.
     * @returns An array of on-chain transactions, sent by account
     */
    getAccountTransactions(accountAddress: MaybeHexString, query?: PaginationArgs): Promise<Transaction$1[]>;
    /**
     * Queries modules associated with given account
     *
     * Note: In order to get all account modules, this function may call the API
     * multiple times as it paginates.
     *
     * @param accountAddress Hex-encoded 32 byte Aptos account address
     * @param query.ledgerVersion Specifies ledger version of transactions. By default latest version will be used
     * @returns Account modules array for a specific ledger version.
     * Module is represented by MoveModule interface. It contains module `bytecode` and `abi`,
     * which is JSON representation of a module. Account modules are cached by account address for 10 minutes
     * to prevent unnecessary API calls when fetching the same account modules
     */
    getAccountModules(accountAddress: MaybeHexString, query?: {
        ledgerVersion?: AnyNumber;
    }): Promise<MoveModuleBytecode[]>;
    /**
     * Queries module associated with given account by module name
     *
     * Note: In order to get all account resources, this function may call the API
     * multiple times as it paginates.
     *
     * @param accountAddress Hex-encoded 32 byte Aptos account address
     * @param moduleName The name of the module
     * @param query.ledgerVersion Specifies ledger version of transactions. By default latest version will be used
     * @returns Specified module.
     * Module is represented by MoveModule interface. It contains module `bytecode` and `abi`,
     * which JSON representation of a module
     */
    getAccountModule(accountAddress: MaybeHexString, moduleName: string, query?: {
        ledgerVersion?: AnyNumber;
    }): Promise<MoveModuleBytecode>;
    /**
     * Queries all resources associated with given account
     * @param accountAddress Hex-encoded 32 byte Aptos account address
     * @param query.ledgerVersion Specifies ledger version of transactions. By default latest version will be used
     * @returns Account resources for a specific ledger version
     */
    getAccountResources(accountAddress: MaybeHexString, query?: {
        ledgerVersion?: AnyNumber;
    }): Promise<MoveResource[]>;
    /**
     * Queries resource associated with given account by resource type
     * @param accountAddress Hex-encoded 32 byte Aptos account address
     * @param resourceType String representation of an on-chain Move struct type
     * @param query.ledgerVersion Specifies ledger version of transactions. By default latest version will be used
     * @returns Account resource of specified type and ledger version
     * @example An example of an account resource
     * ```
     * {
     *    type: "0x1::aptos_coin::AptosCoin",
     *    data: { value: 6 }
     * }
     * ```
     */
    getAccountResource(accountAddress: MaybeHexString, resourceType: MoveStructTag, query?: {
        ledgerVersion?: AnyNumber;
    }): Promise<MoveResource>;
    /** Generates a signed transaction that can be submitted to the chain for execution. */
    static generateBCSTransaction(accountFrom: AptosAccount, rawTxn: RawTransaction): Uint8Array;
    /**
     * Note: Unless you have a specific reason for using this, it'll probably be simpler
     * to use `simulateTransaction`.
     *
     * Generates a BCS transaction that can be submitted to the chain for simulation.
     *
     * @param accountFrom The account that will be used to send the transaction
     * for simulation.
     * @param rawTxn The raw transaction to be simulated, likely created by calling
     * the `generateTransaction` function.
     * @returns The BCS encoded signed transaction, which you should then pass into
     * the `submitBCSSimulation` function.
     */
    static generateBCSSimulation(accountFrom: AptosAccount, rawTxn: RawTransaction): Uint8Array;
    /** Generates an entry function transaction request that can be submitted to produce a raw transaction that
     * can be signed, which upon being signed can be submitted to the blockchain
     * This function fetches the remote ABI and uses it to serialized the data, therefore
     * users don't need to handle serialization by themselves.
     * @param sender Hex-encoded 32 byte Aptos account address of transaction sender
     * @param payload Entry function transaction payload type
     * @param options Options allow to overwrite default transaction options.
     * @returns A raw transaction object
     */
    generateTransaction(sender: MaybeHexString, payload: EntryFunctionPayload, options?: Partial<SubmitTransactionRequest>): Promise<RawTransaction>;
    /**
     * Generates a fee payer transaction that can be signed and submitted to chain
     *
     * @param sender the sender's account address
     * @param payload the transaction payload
     * @param fee_payer the fee payer account
     * @param secondarySignerAccounts an optional array of the secondary signers accounts
     * @returns a fee payer raw transaction that can be signed and submitted to chain
     */
    generateFeePayerTransaction(sender: MaybeHexString, payload: EntryFunctionPayload, feePayer: MaybeHexString, secondarySignerAccounts?: Array<MaybeHexString>, options?: Partial<SubmitTransactionRequest>): Promise<FeePayerRawTransaction>;
    /**
     * Submits fee payer transaction to chain
     *
     * @param feePayerTransaction the raw transaction to be submitted, of type FeePayerRawTransaction
     * @param senderAuthenticator the sender account authenticator (can get from signMultiTransaction() method)
     * @param feePayerAuthenticator the feepayer account authenticator (can get from signMultiTransaction() method)
     * @param signersAuthenticators an optional array of the signer account authenticators
     * @returns The pending transaction
     */
    submitFeePayerTransaction(feePayerTransaction: FeePayerRawTransaction, senderAuthenticator: AccountAuthenticatorEd25519, feePayerAuthenticator: AccountAuthenticatorEd25519, additionalSignersAuthenticators?: Array<AccountAuthenticatorEd25519>): Promise<PendingTransaction>;
    /**
     * Signs a multi transaction type (multi agent / fee payer) and returns the
     * signer authenticator to be used to submit the transaction.
     *
     * @param signer the account to sign on the transaction
     * @param rawTxn a MultiAgentRawTransaction or FeePayerRawTransaction
     * @returns signer authenticator
     */
    signMultiTransaction(signer: AptosAccount, rawTxn: MultiAgentRawTransaction | FeePayerRawTransaction): Promise<AccountAuthenticatorEd25519>;
    /** Converts a transaction request produced by `generateTransaction` into a properly
     * signed transaction, which can then be submitted to the blockchain
     * @param accountFrom AptosAccount of transaction sender
     * @param rawTransaction A raw transaction generated by `generateTransaction` method
     * @returns A transaction, signed with sender account
     */
    signTransaction(accountFrom: AptosAccount, rawTransaction: RawTransaction): Promise<Uint8Array>;
    /**
     * Event types are globally identifiable by an account `address` and
     * monotonically increasing `creation_number`, one per event type emitted
     * to the given account. This API returns events corresponding to that
     * that event type.
     * @param address Hex-encoded 32 byte Aptos account, with or without a `0x` prefix,
     * for which events are queried. This refers to the account that events were emitted
     * to, not the account hosting the move module that emits that event type.
     * @param creationNumber Creation number corresponding to the event type.
     * @returns Array of events assotiated with the given account and creation number.
     */
    getEventsByCreationNumber(address: MaybeHexString, creationNumber: AnyNumber | string, query?: PaginationArgs): Promise<Event[]>;
    /**
     * This API uses the given account `address`, `eventHandle`, and `fieldName`
     * to build a key that can globally identify an event types. It then uses this
     * key to return events emitted to the given account matching that event type.
     * @param address Hex-encoded 32 byte Aptos account, with or without a `0x` prefix,
     * for which events are queried. This refers to the account that events were emitted
     * to, not the account hosting the move module that emits that event type.
     * @param eventHandleStruct String representation of an on-chain Move struct type.
     * (e.g. `0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>`)
     * @param fieldName The field name of the EventHandle in the struct
     * @param query Optional query object
     * @param query.start The start sequence number in the EVENT STREAM, defaulting to the latest event.
     * The events are returned in the reverse order of sequence number
     * @param query.limit The number of events to be returned. The default is 25.
     * @returns Array of events
     */
    getEventsByEventHandle(address: MaybeHexString, eventHandleStruct: MoveStructTag, fieldName: string, query?: PaginationArgs): Promise<Event[]>;
    /**
     * Submits a signed transaction to the transaction endpoint.
     * @param signedTxn A transaction, signed by `signTransaction` method
     * @returns Transaction that is accepted and submitted to mempool
     */
    submitTransaction(signedTxn: Uint8Array): Promise<PendingTransaction>;
    /**
     * Generates and submits a transaction to the transaction simulation
     * endpoint. For this we generate a transaction with a fake signature.
     *
     * @param accountOrPubkey The sender or sender's public key. When private key is available, `AptosAccount` instance
     * can be used to send the transaction for simulation. If private key is not available, sender's public key can be
     * used to send the transaction for simulation.
     * @param rawTransaction The raw transaction to be simulated, likely created
     * by calling the `generateTransaction` function.
     * @param query.estimateGasUnitPrice If set to true, the gas unit price in the
     * transaction will be ignored and the estimated value will be used.
     * @param query.estimateMaxGasAmount If set to true, the max gas value in the
     * transaction will be ignored and the maximum possible gas will be used.
     * @param query.estimatePrioritizedGasUnitPrice If set to true, the transaction will use a higher price than the
     * original estimate.
     * @returns The BCS encoded signed transaction, which you should then provide
     *
     */
    simulateTransaction(accountOrPubkey: AptosAccount | Ed25519PublicKey | MultiEd25519PublicKey, rawTransaction: RawTransaction, query?: {
        estimateGasUnitPrice?: boolean;
        estimateMaxGasAmount?: boolean;
        estimatePrioritizedGasUnitPrice: boolean;
    }): Promise<UserTransaction$1[]>;
    /**
     * Submits a signed transaction to the endpoint that takes BCS payload
     *
     * @param signedTxn A BCS transaction representation
     * @returns Transaction that is accepted and submitted to mempool
     */
    submitSignedBCSTransaction(signedTxn: Uint8Array): Promise<PendingTransaction>;
    /**
     * Submits the BCS serialization of a signed transaction to the simulation endpoint.
     *
     * @param bcsBody The output of `generateBCSSimulation`.
     * @param query?.estimateGasUnitPrice If set to true, the gas unit price in the
     * transaction will be ignored and the estimated value will be used.
     * @param query?.estimateMaxGasAmount If set to true, the max gas value in the
     * transaction will be ignored and the maximum possible gas will be used.
     * @param query?.estimatePrioritizedGasUnitPrice If set to true, the transaction will use a higher price than the
     * original estimate.
     * @returns Simulation result in the form of UserTransaction.
     */
    submitBCSSimulation(bcsBody: Uint8Array, query?: {
        estimateGasUnitPrice?: boolean;
        estimateMaxGasAmount?: boolean;
        estimatePrioritizedGasUnitPrice?: boolean;
    }): Promise<UserTransaction$1[]>;
    /**
     * Queries on-chain transactions. This function will not return pending
     * transactions. For that, use `getTransactionsByHash`.
     *
     * @param query Optional pagination object
     * @param query.start The start transaction version of the page. Default is the latest ledger version
     * @param query.limit The max number of transactions should be returned for the page. Default is 25
     * @returns Array of on-chain transactions
     */
    getTransactions(query?: PaginationArgs): Promise<Transaction$1[]>;
    /**
     * @param txnHash - Transaction hash should be hex-encoded bytes string with 0x prefix.
     * @returns Transaction from mempool (pending) or on-chain (committed) transaction
     */
    getTransactionByHash(txnHash: string): Promise<Transaction$1>;
    /**
     * @param txnVersion - Transaction version is an uint64 number.
     * @returns On-chain transaction. Only on-chain transactions have versions, so this
     * function cannot be used to query pending transactions.
     */
    getTransactionByVersion(txnVersion: AnyNumber): Promise<Transaction$1>;
    /**
     * Defines if specified transaction is currently in pending state
     * @param txnHash A hash of transaction
     *
     * To create a transaction hash:
     *
     * 1. Create hash message bytes: "Aptos::Transaction" bytes + BCS bytes of Transaction.
     * 2. Apply hash algorithm SHA3-256 to the hash message bytes.
     * 3. Hex-encode the hash bytes with 0x prefix.
     *
     * @returns `true` if transaction is in pending state and `false` otherwise
     */
    transactionPending(txnHash: string): Promise<boolean>;
    /**
     * Wait for a transaction to move past pending state.
     *
     * There are 4 possible outcomes:
     * 1. Transaction is processed and successfully committed to the blockchain.
     * 2. Transaction is rejected for some reason, and is therefore not committed
     *    to the blockchain.
     * 3. Transaction is committed but execution failed, meaning no changes were
     *    written to the blockchain state.
     * 4. Transaction is not processed within the specified timeout.
     *
     * In case 1, this function resolves with the transaction response returned
     * by the API.
     *
     * In case 2, the function will throw an ApiError, likely with an HTTP status
     * code indicating some problem with the request (e.g. 400).
     *
     * In case 3, if `checkSuccess` is false (the default), this function returns
     * the transaction response just like in case 1, in which the `success` field
     * will be false. If `checkSuccess` is true, it will instead throw a
     * FailedTransactionError.
     *
     * In case 4, this function throws a WaitForTransactionError.
     *
     * @param txnHash The hash of a transaction previously submitted to the blockchain.
     * @param extraArgs.timeoutSecs Timeout in seconds. Defaults to 20 seconds.
     * @param extraArgs.checkSuccess See above. Defaults to false.
     * @returns See above.
     *
     * @example
     * ```
     * const rawTransaction = await this.generateRawTransaction(sender.address(), payload, extraArgs);
     * const bcsTxn = AptosClient.generateBCSTransaction(sender, rawTransaction);
     * const pendingTransaction = await this.submitSignedBCSTransaction(bcsTxn);
     * const transasction = await this.aptosClient.waitForTransactionWithResult(pendingTransaction.hash);
     * ```
     */
    waitForTransactionWithResult(txnHash: string, extraArgs?: {
        timeoutSecs?: number;
        checkSuccess?: boolean;
    }): Promise<Transaction$1>;
    /**
     * This function works the same as `waitForTransactionWithResult` except it
     * doesn't return the transaction in those cases, it returns nothing. For
     * more information, see the documentation for `waitForTransactionWithResult`.
     */
    waitForTransaction(txnHash: string, extraArgs?: {
        timeoutSecs?: number;
        checkSuccess?: boolean;
    }): Promise<void>;
    /**
     * Queries the latest ledger information
     * @returns Latest ledger information
     * @example Example of returned data
     * ```
     * {
     *   chain_id: 15,
     *   epoch: 6,
     *   ledgerVersion: "2235883",
     *   ledger_timestamp:"1654580922321826"
     * }
     * ```
     */
    getLedgerInfo(): Promise<IndexResponse>;
    /**
     * @returns Current chain id
     */
    getChainId(): Promise<number>;
    /**
     * Gets a table item for a table identified by the handle and the key for the item.
     * Key and value types need to be passed in to help with key serialization and value deserialization.
     * @param handle A pointer to where that table is stored
     * @param data Object, that describes table item
     * @param data.key_type Move type of table key (e.g. `vector<u8>`)
     * @param data.value_type Move type of table value (e.g. `u64`)
     * @param data.key Value of table key
     * @returns Table item value rendered in JSON
     */
    getTableItem(handle: string, data: TableItemRequest, query?: {
        ledgerVersion?: AnyNumber;
    }): Promise<any>;
    /**
     * Generates a raw transaction out of a transaction payload
     * @param accountFrom
     * @param payload
     * @param extraArgs
     * @returns A raw transaction object
     */
    generateRawTransaction(accountFrom: HexString, payload: TransactionPayload, extraArgs?: OptionalTransactionArgs): Promise<RawTransaction>;
    /**
     * Helper for generating, signing, and submitting a transaction.
     *
     * @param sender AptosAccount of transaction sender.
     * @param payload Transaction payload.
     * @param extraArgs Extra args for building the transaction payload.
     * @returns The transaction response from the API.
     */
    generateSignSubmitTransaction(sender: AptosAccount, payload: TransactionPayload, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Helper for signing and submitting a transaction.
     *
     * @param sender AptosAccount of transaction sender.
     * @param transaction A generated Raw transaction payload.
     * @returns The transaction response from the API.
     */
    signAndSubmitTransaction(sender: AptosAccount, transaction: RawTransaction): Promise<string>;
    /**
     * Publishes a move package. `packageMetadata` and `modules` can be generated with command
     * `aptos move compile --save-metadata [ --included-artifacts=<...> ]`.
     * @param sender
     * @param packageMetadata package metadata bytes
     * @param modules bytecodes of modules
     * @param extraArgs
     * @returns Transaction hash
     */
    publishPackage(sender: AptosAccount, packageMetadata: Bytes, modules: Seq<Module>, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Publishes a move packages by creating a resource account.
     * The package cannot be upgraded since it is deployed by resource account
     * `packageMetadata` and `modules` can be generated with command
     * `aptos move compile --save-metadata [ --included-artifacts=<...> ]`.
     * @param sender
     * @param seed seeds for creation of resource address
     * @param packageMetadata package metadata bytes
     * @param modules bytecodes of modules
     * @param extraArgs
     * @returns Transaction hash
     */
    createResourceAccountAndPublishPackage(sender: AptosAccount, seed: Bytes, packageMetadata: Bytes, modules: Seq<Module>, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Helper for generating, submitting, and waiting for a transaction, and then
     * checking whether it was committed successfully. Under the hood this is just
     * `generateSignSubmitTransaction` and then `waitForTransactionWithResult`, see
     * those for information about the return / error semantics of this function.
     */
    generateSignSubmitWaitForTransaction(sender: AptosAccount, payload: TransactionPayload, extraArgs?: OptionalTransactionArgs & {
        checkSuccess?: boolean;
        timeoutSecs?: number;
    }): Promise<Transaction$1>;
    estimateGasPrice(): Promise<GasEstimation>;
    estimateMaxGasAmount(forAccount: MaybeHexString): Promise<Uint64>;
    /**
     * Rotate an account's auth key. After rotation, only the new private key can be used to sign txns for
     * the account.
     * WARNING: You must create a new instance of AptosAccount after using this function.
     * @param forAccount Account of which the auth key will be rotated
     * @param toPrivateKeyBytes New private key
     * @param extraArgs Extra args for building the transaction payload.
     * @returns PendingTransaction
     */
    rotateAuthKeyEd25519(forAccount: AptosAccount, toPrivateKeyBytes: Uint8Array, extraArgs?: OptionalTransactionArgs): Promise<PendingTransaction>;
    /**
     * Lookup the original address by the current derived address
     * @param addressOrAuthKey
     * @returns original address
     */
    lookupOriginalAddress(addressOrAuthKey: MaybeHexString): Promise<HexString>;
    /**
     * Get block by height
     *
     * @param blockHeight Block height to lookup.  Starts at 0
     * @param withTransactions If set to true, include all transactions in the block
     *
     * @returns Block
     */
    getBlockByHeight(blockHeight: number, withTransactions?: boolean): Promise<Block>;
    /**
     * Get block by block transaction version
     *
     * @param version Ledger version to lookup block information for
     * @param withTransactions If set to true, include all transactions in the block
     *
     * @returns Block
     */
    getBlockByVersion(version: number, withTransactions?: boolean): Promise<Block>;
    /**
     * Call for a move view function
     *
     * @param payload Transaction payload
     * @param version (optional) Ledger version to lookup block information for
     *
     * @returns MoveValue[]
     */
    view(payload: ViewRequest, ledger_version?: string): Promise<MoveValue[]>;
    clearCache(tags: string[]): void;
}
/**
 * This error is used by `waitForTransactionWithResult` when waiting for a
 * transaction times out.
 */
declare class WaitForTransactionError extends Error {
    readonly lastSubmittedTransaction: Transaction$1 | undefined;
    constructor(message: string, lastSubmittedTransaction: Transaction$1 | undefined);
}
/**
 * This error is used by `waitForTransactionWithResult` if `checkSuccess` is true.
 * See that function for more information.
 */
declare class FailedTransactionError extends Error {
    readonly transaction: Transaction$1;
    constructor(message: string, transaction: Transaction$1);
}
declare class ApiError extends Error {
    readonly status: number;
    readonly message: string;
    readonly errorCode?: string | undefined;
    readonly vmErrorCode?: string | undefined;
    constructor(status: number, message: string, errorCode?: string | undefined, vmErrorCode?: string | undefined);
}

type NetworkWithCustom = Network | "CUSTOM";
/**
 * Builds a Provider class with an aptos client configured to connect to an Aptos node
 * and indexer client configured to connect to Aptos Indexer.
 *
 * It creates AptosClient and IndexerClient instances based on the network or custom endpoints provided.
 *
 * This class holds both AptosClient and IndexerClient classes's methods and properties so we
 * can instantiate the Provider class and use it to query full node and/or Indexer.
 *
 * NOTE: Indexer client can be undefined/not set when we use Network.LOCAL (since Indexer
 * does not support local environment) or when we use a CUSTOM network to support applications
 * that only use custom fullnode and not Indexer
 *
 * @example An example of how to use this class with a live network
 * ```
 * const provider = new Provider(Network.DEVNET)
 * const account = await provider.getAccount("0x123");
 * const accountTokens = await provider.getOwnedTokens("0x123");
 * ```
 *
 * @example An example of how to use this class with a local network. Indexer
 * doesn't support local network.
 * ```
 * const provider = new Provider(Network.LOCAL)
 * const account = await provider.getAccount("0x123");
 * ```
 *
 * @example An example of how to use this class with a custom network.
 * ```
 * const provider = new Provider({fullnodeUrl:"my-fullnode-url",indexerUrl:"my-indexer-url"})
 * const account = await provider.getAccount("0x123");
 * const accountTokens = await provider.getOwnedTokens("0x123");
 * ```
 *
 * @param network enum of type Network - MAINNET | TESTNET | DEVNET | LOCAL or custom endpoints of type CustomEndpoints
 * @param config optional ClientConfig config arg - additional configuration we can pass with the request to the server.
 */
declare class Provider {
    aptosClient: AptosClient;
    indexerClient?: IndexerClient;
    network: NetworkWithCustom;
    constructor(network: Network | CustomEndpoints, config?: ClientConfig, doNotFixNodeUrl?: boolean);
}
interface Provider extends AptosClient, IndexerClient {
}

declare class PropertyValue {
    type: string;
    value: any;
    constructor(type: string, value: string);
}
declare class PropertyMap {
    data: {
        [key: string]: PropertyValue;
    };
    constructor();
    setProperty(key: string, value: PropertyValue): void;
}
declare function getPropertyType(typ: string): TypeTag;
declare function getPropertyValueRaw(values: Array<string>, types: Array<string>): Array<Bytes>;
declare function getSinglePropertyValueRaw(value: string, type: string): Uint8Array;
declare function deserializePropertyMap(rawPropertyMap: any): PropertyMap;
declare function deserializeValueBasedOnTypeTag(tag: TypeTag, val: string): string;

declare class TokenData {
    /** Unique name within this creator's account for this Token's collection */
    collection: string;
    /** Description of Token */
    description: string;
    /** Name of Token */
    name: string;
    /** Optional maximum number of this Token */
    maximum?: number;
    /** Total number of this type of Token */
    supply: number;
    /** URL for additional information / media */
    uri: string;
    /** default properties of token data */
    default_properties: PropertyMap;
    /** mutability config of tokendata fields */
    mutability_config: boolean[];
    constructor(collection: string, description: string, name: string, maximum: number, supply: number, uri: string, default_properties: any, mutability_config: boolean[]);
}
interface TokenDataId {
    /** Token creator address */
    creator: string;
    /** Unique name within this creator's account for this Token's collection */
    collection: string;
    /** Name of Token */
    name: string;
}
interface TokenId {
    token_data_id: TokenDataId;
    /** version number of the property map */
    property_version: string;
}
/** server will return string for u64 */
type U64 = string;
declare class Token {
    id: TokenId;
    /** server will return string for u64 */
    amount: U64;
    /** the property map of the token */
    token_properties: PropertyMap;
    constructor(id: TokenId, amount: U64, token_properties: any);
}

type token_types_PropertyMap = PropertyMap;
declare const token_types_PropertyMap: typeof PropertyMap;
type token_types_PropertyValue = PropertyValue;
declare const token_types_PropertyValue: typeof PropertyValue;
type token_types_Token = Token;
declare const token_types_Token: typeof Token;
type token_types_TokenData = TokenData;
declare const token_types_TokenData: typeof TokenData;
type token_types_TokenDataId = TokenDataId;
type token_types_TokenId = TokenId;
declare namespace token_types {
  export { token_types_PropertyMap as PropertyMap, token_types_PropertyValue as PropertyValue, token_types_Token as Token, token_types_TokenData as TokenData, type token_types_TokenDataId as TokenDataId, type token_types_TokenId as TokenId };
}

/**
 * Class for creating, minting and managing minting NFT collections and tokens
 */
declare class TokenClient {
    aptosClient: AptosClient;
    /**
     * Creates new TokenClient instance
     *
     * @param aptosClient AptosClient instance
     */
    constructor(aptosClient: AptosClient);
    /**
     * Creates a new NFT collection within the specified account
     *
     * @param account AptosAccount where collection will be created
     * @param name Collection name
     * @param description Collection description
     * @param uri URL to additional info about collection
     * @param maxAmount Maximum number of `token_data` allowed within this collection
     * @returns The hash of the transaction submitted to the API
     */
    createCollection(account: AptosAccount, name: string, description: string, uri: string, maxAmount?: AnyNumber, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Creates a new NFT within the specified account
     *
     * @param account AptosAccount where token will be created
     * @param collectionName Name of collection, that token belongs to
     * @param name Token name
     * @param description Token description
     * @param supply Token supply
     * @param uri URL to additional info about token
     * @param max The maxium of tokens can be minted from this token
     * @param royalty_payee_address the address to receive the royalty, the address can be a shared account address.
     * @param royalty_points_denominator the denominator for calculating royalty
     * @param royalty_points_numerator the numerator for calculating royalty
     * @param property_keys the property keys for storing on-chain properties
     * @param property_values the property values to be stored on-chain
     * @param property_types the type of property values
     * @returns The hash of the transaction submitted to the API
     */
    createToken(account: AptosAccount, collectionName: string, name: string, description: string, supply: number, uri: string, max?: AnyNumber, royalty_payee_address?: MaybeHexString, royalty_points_denominator?: number, royalty_points_numerator?: number, property_keys?: Array<string>, property_values?: Array<string>, property_types?: Array<string>, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Creates a new NFT within the specified account
     *
     * @param account AptosAccount where token will be created
     * @param collectionName Name of collection, that token belongs to
     * @param name Token name
     * @param description Token description
     * @param supply Token supply
     * @param uri URL to additional info about token
     * @param max The maxium of tokens can be minted from this token
     * @param royalty_payee_address the address to receive the royalty, the address can be a shared account address.
     * @param royalty_points_denominator the denominator for calculating royalty
     * @param royalty_points_numerator the numerator for calculating royalty
     * @param property_keys the property keys for storing on-chain properties
     * @param property_values the property values to be stored on-chain
     * @param property_types the type of property values
     * @param mutability_config configs which field is mutable
     * @returns The hash of the transaction submitted to the API
     */
    createTokenWithMutabilityConfig(account: AptosAccount, collectionName: string, name: string, description: string, supply: AnyNumber, uri: string, max?: AnyNumber, royalty_payee_address?: MaybeHexString, royalty_points_denominator?: AnyNumber, royalty_points_numerator?: AnyNumber, property_keys?: Array<string>, property_values?: Array<Bytes>, property_types?: Array<string>, mutability_config?: Array<boolean>, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Transfers specified amount of tokens from account to receiver
     *
     * @param account AptosAccount where token from which tokens will be transfered
     * @param receiver  Hex-encoded 32 byte Aptos account address to which tokens will be transfered
     * @param creator Hex-encoded 32 byte Aptos account address to which created tokens
     * @param collectionName Name of collection where token is stored
     * @param name Token name
     * @param amount Amount of tokens which will be transfered
     * @param property_version the version of token PropertyMap with a default value 0.
     * @returns The hash of the transaction submitted to the API
     */
    offerToken(account: AptosAccount, receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, amount: number, property_version?: number, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Claims a token on specified account
     *
     * @param account AptosAccount which will claim token
     * @param sender Hex-encoded 32 byte Aptos account address which holds a token
     * @param creator Hex-encoded 32 byte Aptos account address which created a token
     * @param collectionName Name of collection where token is stored
     * @param name Token name
     * @param property_version the version of token PropertyMap with a default value 0.
     * @returns The hash of the transaction submitted to the API
     */
    claimToken(account: AptosAccount, sender: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, property_version?: number, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Removes a token from pending claims list
     *
     * @param account AptosAccount which will remove token from pending list
     * @param receiver Hex-encoded 32 byte Aptos account address which had to claim token
     * @param creator Hex-encoded 32 byte Aptos account address which created a token
     * @param collectionName Name of collection where token is strored
     * @param name Token name
     * @param property_version the version of token PropertyMap with a default value 0.
     * @returns The hash of the transaction submitted to the API
     */
    cancelTokenOffer(account: AptosAccount, receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, property_version?: number, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Directly transfer the specified amount of tokens from account to receiver
     * using a single multi signature transaction.
     *
     * @param sender AptosAccount where token from which tokens will be transferred
     * @param receiver Hex-encoded 32 byte Aptos account address to which tokens will be transferred
     * @param creator Hex-encoded 32 byte Aptos account address to which created tokens
     * @param collectionName Name of collection where token is stored
     * @param name Token name
     * @param amount Amount of tokens which will be transferred
     * @param property_version the version of token PropertyMap with a default value 0.
     * @returns The hash of the transaction submitted to the API
     */
    directTransferToken(sender: AptosAccount, receiver: AptosAccount, creator: MaybeHexString, collectionName: string, name: string, amount: AnyNumber, propertyVersion?: AnyNumber, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Directly transfer the specified amount of tokens from account to receiver
     * using a single multi signature transaction.
     *
     * @param sender AptosAccount where token from which tokens will be transferred
     * @param receiver Hex-encoded 32 byte Aptos account address to which tokens will be transferred
     * @param creator Hex-encoded 32 byte Aptos account address to which created tokens
     * @param collectionName Name of collection where token is stored
     * @param name Token name
     * @param amount Amount of tokens which will be transferred
     * @param fee_payer AptosAccount which will pay fee for transaction
     * @param property_version the version of token PropertyMap with a default value 0.
     * @returns The hash of the transaction submitted to the API
     */
    directTransferTokenWithFeePayer(sender: AptosAccount, receiver: AptosAccount, creator: MaybeHexString, collectionName: string, name: string, amount: AnyNumber, fee_payer: AptosAccount, propertyVersion?: AnyNumber, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * User opt-in or out direct transfer through a boolean flag
     *
     * @param sender AptosAccount where the token will be transferred
     * @param optIn boolean value indicates user want to opt-in or out of direct transfer
     * @returns The hash of the transaction submitted to the API
     */
    optInTokenTransfer(sender: AptosAccount, optIn: boolean, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Directly transfer token to a receiver. The receiver should have opted in to direct transfer
     *
     * @param sender AptosAccount where the token will be transferred
     * @param creator  address of the token creator
     * @param collectionName Name of collection where token is stored
     * @param name Token name
     * @param property_version the version of token PropertyMap
     * @param amount Amount of tokens which will be transfered
     * @returns The hash of the transaction submitted to the API
     */
    transferWithOptIn(sender: AptosAccount, creator: MaybeHexString, collectionName: string, tokenName: string, propertyVersion: AnyNumber, receiver: MaybeHexString, amount: AnyNumber, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * BurnToken by Creator
     *
     * @param creator creator of the token
     * @param ownerAddress address of the token owner
     * @param collectionName Name of collection where token is stored
     * @param name Token name
     * @param amount Amount of tokens which will be transfered
     * @param property_version the version of token PropertyMap
     * @returns The hash of the transaction submitted to the API
     */
    burnByCreator(creator: AptosAccount, ownerAddress: MaybeHexString, collection: String, name: String, PropertyVersion: AnyNumber, amount: AnyNumber, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * BurnToken by Owner
     *
     * @param owner creator of the token
     * @param creatorAddress address of the token creator
     * @param collectionName Name of collection where token is stored
     * @param name Token name
     * @param amount Amount of tokens which will be transfered
     * @param property_version the version of token PropertyMap
     * @returns The hash of the transaction submitted to the API
     */
    burnByOwner(owner: AptosAccount, creatorAddress: MaybeHexString, collection: String, name: String, PropertyVersion: AnyNumber, amount: AnyNumber, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * creator mutates the properties of the tokens
     *
     * @param account AptosAccount who modifies the token properties
     * @param tokenOwner the address of account owning the token
     * @param creator the creator of the token
     * @param collection_name the name of the token collection
     * @param tokenName the name of created token
     * @param propertyVersion the property_version of the token to be modified
     * @param amount the number of tokens to be modified
     *
     * @returns The hash of the transaction submitted to the API
     */
    mutateTokenProperties(account: AptosAccount, tokenOwner: HexString, creator: HexString, collection_name: string, tokenName: string, propertyVersion: AnyNumber, amount: AnyNumber, keys: Array<string>, values: Array<Bytes>, types: Array<string>, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Queries collection data
     * @param creator Hex-encoded 32 byte Aptos account address which created a collection
     * @param collectionName Collection name
     * @returns Collection data in below format
     * ```
     *  Collection {
     *    // Describes the collection
     *    description: string,
     *    // Unique name within this creators account for this collection
     *    name: string,
     *    // URL for additional information/media
     *    uri: string,
     *    // Total number of distinct Tokens tracked by the collection
     *    count: number,
     *    // Optional maximum number of tokens allowed within this collections
     *    maximum: number
     *  }
     * ```
     */
    getCollectionData(creator: MaybeHexString, collectionName: string): Promise<any>;
    /**
     * Queries token data from collection
     *
     * @param creator Hex-encoded 32 byte Aptos account address which created a token
     * @param collectionName Name of collection, which holds a token
     * @param tokenName Token name
     * @returns Token data in below format
     * ```
     * TokenData {
     *     // Unique name within this creators account for this Token's collection
     *     collection: string;
     *     // Describes this Token
     *     description: string;
     *     // The name of this Token
     *     name: string;
     *     // Optional maximum number of this type of Token.
     *     maximum: number;
     *     // Total number of this type of Token
     *     supply: number;
     *     /// URL for additional information / media
     *     uri: string;
     *   }
     * ```
     */
    getTokenData(creator: MaybeHexString, collectionName: string, tokenName: string): Promise<TokenData>;
    /**
     * Queries token balance for the token creator
     */
    getToken(creator: MaybeHexString, collectionName: string, tokenName: string, property_version?: string): Promise<Token>;
    /**
     * Queries token balance for a token account
     * @param account Hex-encoded 32 byte Aptos account address which created a token
     * @param tokenId token id
     *
     * TODO: Update this:
     * @example
     * ```
     * {
     *   creator: '0x1',
     *   collection: 'Some collection',
     *   name: 'Awesome token'
     * }
     * ```
     * @returns Token object in below format
     * ```
     * Token {
     *   id: TokenId;
     *   value: number;
     * }
     * ```
     */
    getTokenForAccount(account: MaybeHexString, tokenId: TokenId): Promise<Token>;
}

interface CreateCollectionOptions {
    royaltyNumerator?: number;
    royaltyDenominator?: number;
    mutableDescription?: boolean;
    mutableRoyalty?: boolean;
    mutableURI?: boolean;
    mutableTokenDescription?: boolean;
    mutableTokenName?: boolean;
    mutableTokenProperties?: boolean;
    mutableTokenURI?: boolean;
    tokensBurnableByCreator?: boolean;
    tokensFreezableByCreator?: boolean;
}
declare const PropertyTypeMap: {
    BOOLEAN: string;
    U8: string;
    U16: string;
    U32: string;
    U64: string;
    U128: string;
    U256: string;
    ADDRESS: string;
    VECTOR: string;
    STRING: string;
};
type PropertyType = keyof typeof PropertyTypeMap;
type FungibleTokenParameters = {
    owner: AptosAccount;
    tokenAddress: MaybeHexString;
    recipient: MaybeHexString;
    amount: number | bigint;
    extraArgs?: OptionalTransactionArgs;
};
type NonFungibleTokenParameters = {
    owner: AptosAccount;
    tokenAddress: MaybeHexString;
    recipient: MaybeHexString;
    tokenType?: string;
    extraArgs?: OptionalTransactionArgs;
};
/**
 * Class for managing aptos_token
 */
declare class AptosToken {
    readonly provider: Provider;
    private readonly tokenType;
    /**
     * Creates new AptosToken instance
     *
     * @param provider Provider instance
     */
    constructor(provider: Provider);
    private submitTransaction;
    /**
     * Creates a new collection within the specified account
     *
     * @param creator AptosAccount where collection will be created
     * @param description Collection description
     * @param name Collection name
     * @param uri URL to additional info about collection
     * @param options CreateCollectionOptions type. By default all values set to `true` or `0`
     * @returns The hash of the transaction submitted to the API
     */
    createCollection(creator: AptosAccount, description: string, name: string, uri: string, maxSupply?: AnyNumber, options?: CreateCollectionOptions, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Mint a new token within the specified account
     *
     * @param account AptosAccount where token will be created
     * @param collection Name of collection, that token belongs to
     * @param description Token description
     * @param name Token name
     * @param uri URL to additional info about token
     * @param propertyKeys the property keys for storing on-chain properties
     * @param propertyTypes the type of property values
     * @param propertyValues the property values to be stored on-chain
     * @returns The hash of the transaction submitted to the API
     */
    mint(account: AptosAccount, collection: string, description: string, name: string, uri: string, propertyKeys?: Array<string>, propertyTypes?: Array<string>, propertyValues?: Array<string>, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Mint a soul bound token into a recipient's account
     *
     * @param account AptosAccount that mints the token
     * @param collection Name of collection, that token belongs to
     * @param description Token description
     * @param name Token name
     * @param uri URL to additional info about token
     * @param recipient AptosAccount where token will be created
     * @param propertyKeys the property keys for storing on-chain properties
     * @param propertyTypes the type of property values
     * @param propertyValues the property values to be stored on-chain
     * @returns The hash of the transaction submitted to the API
     */
    mintSoulBound(account: AptosAccount, collection: string, description: string, name: string, uri: string, recipient: AptosAccount, propertyKeys?: Array<string>, propertyTypes?: Array<string>, propertyValues?: Array<string>, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Burn a token by its creator
     * @param creator Creator account
     * @param token Token address
     * @returns The hash of the transaction submitted to the API
     */
    burnToken(creator: AptosAccount, token: MaybeHexString, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Freeze token transfer ability
     * @param creator Creator account
     * @param token Token address
     * @returns The hash of the transaction submitted to the API
     */
    freezeTokenTransafer(creator: AptosAccount, token: MaybeHexString, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Unfreeze token transfer ability
     * @param creator Creator account
     * @param token Token address
     * @returns The hash of the transaction submitted to the API
     */
    unfreezeTokenTransafer(creator: AptosAccount, token: MaybeHexString, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Set token description
     * @param creator Creator account
     * @param token Token address
     * @param description Token description
     * @returns The hash of the transaction submitted to the API
     */
    setTokenDescription(creator: AptosAccount, token: MaybeHexString, description: string, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Set token name
     * @param creator Creator account
     * @param token Token address
     * @param name Token name
     * @returns The hash of the transaction submitted to the API
     */
    setTokenName(creator: AptosAccount, token: MaybeHexString, name: string, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Set token URI
     * @param creator Creator account
     * @param token Token address
     * @param uri Token uri
     * @returns The hash of the transaction submitted to the API
     */
    setTokenURI(creator: AptosAccount, token: MaybeHexString, uri: string, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Add token property
     * @param creator Creator account
     * @param token Token address
     * @param key the property key for storing on-chain property
     * @param type the type of property value
     * @param value the property value to be stored on-chain
     * @returns The hash of the transaction submitted to the API
     */
    addTokenProperty(creator: AptosAccount, token: MaybeHexString, propertyKey: string, propertyType: PropertyType, propertyValue: string, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Remove token property
     * @param creator Creator account
     * @param token Token address
     * @param key the property key stored on-chain
     * @returns The hash of the transaction submitted to the API
     */
    removeTokenProperty(creator: AptosAccount, token: MaybeHexString, propertyKey: string, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Update token property
     * @param creator Creator account
     * @param token Token address
     * @param key the property key stored on-chain
     * @param type the property typed stored on-chain
     * @param value the property value to be stored on-chain
     * @returns The hash of the transaction submitted to the API
     */
    updateTokenProperty(creator: AptosAccount, token: MaybeHexString, propertyKey: string, propertyType: PropertyType, propertyValue: string, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
    addTypedProperty(creator: AptosAccount, token: MaybeHexString, propertyKey: string, propertyType: PropertyType, propertyValue: string, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
    updateTypedProperty(creator: AptosAccount, token: MaybeHexString, propertyKey: string, propertyType: PropertyType, propertyValue: string, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Transfer a non fungible token ownership.
     * We can transfer a token only when the token is not frozen (i.e. owner transfer is not disabled such as for soul bound tokens)
     * @param owner The account of the current token owner
     * @param token Token address
     * @param recipient Recipient address
     * @returns The hash of the transaction submitted to the API
     */
    transferTokenOwnership(owner: AptosAccount, token: MaybeHexString, recipient: MaybeHexString, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Transfer a token. This function supports transfer non-fungible token and fungible token.
     *
     * To set the token type, set isFungibleToken param to true or false.
     * If isFungibleToken param is not set, the function would query Indexer
     * for the token data and check whether it is a non-fungible or a fungible token.
     *
     * Note: this function supports only token v2 standard (it does not support the token v1 standard)
     *
     * @param data NonFungibleTokenParameters | FungibleTokenParameters type
     * @param isFungibleToken (optional) The token type, non-fungible or fungible token.
     * @returns The hash of the transaction submitted to the API
     */
    transfer(data: NonFungibleTokenParameters | FungibleTokenParameters, isFungibleToken?: boolean | null): Promise<string>;
    /**
     * Burn an object by the object owner
     * @param owner The object owner account
     * @param objectId The object address
     * @optional objectType. The object type, default to "0x1::object::ObjectCore"
     * @returns The hash of the transaction submitted to the API
     */
    burnObject(owner: AptosAccount, objectId: MaybeHexString, objectType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
}

declare const TRANSFER_COINS = "0x1::aptos_account::transfer_coins";
declare const COIN_TRANSFER = "0x1::coin::transfer";
/**
 * Class for working with the coin module, such as transferring coins and
 * checking balances.
 */
declare class CoinClient {
    aptosClient: AptosClient;
    /**
     * Creates new CoinClient instance
     * @param aptosClient AptosClient instance
     */
    constructor(aptosClient: AptosClient);
    /**
     * Generate, sign, and submit a transaction to the Aptos blockchain API to
     * transfer coins from one account to another. By default it transfers
     * 0x1::aptos_coin::AptosCoin, but you can specify a different coin type
     * with the `coinType` argument.
     *
     * You may set `createReceiverIfMissing` to true if you want to create the
     * receiver account if it does not exist on chain yet. If you do not set
     * this to true, the transaction will fail if the receiver account does not
     * exist on-chain.
     *
     * The TS SDK supports fungible assets operations. If you want to use CoinClient
     * with this feature, set the `coinType` to be the fungible asset metadata address.
     * This option uses the `FungibleAssetClient` class and queries the
     * fungible asset primary store.
     *
     * @param from Account sending the coins
     * @param to Account to receive the coins
     * @param amount Number of coins to transfer
     * @param extraArgs Extra args for building the transaction or configuring how
     * the client should submit and wait for the transaction
     * @returns The hash of the transaction submitted to the API
     */
    transfer(from: AptosAccount, to: AptosAccount | MaybeHexString, amount: number | bigint, extraArgs?: OptionalTransactionArgs & {
        coinType?: string | MaybeHexString;
        createReceiverIfMissing?: boolean;
    }): Promise<string>;
    /**
     * Get the balance of the account. By default it checks the balance of
     * 0x1::aptos_coin::AptosCoin, but you can specify a different coin type.
     *
     * to use a different type, set the `coinType` to be the fungible asset type.
     *
     * The TS SDK supports fungible assets operations. If you want to use CoinClient
     * with this feature, set the `coinType` to be the fungible asset metadata address.
     * This option uses the FungibleAssetClient class and queries the
     * fungible asset primary store.
     *
     * @param account Account that you want to get the balance of.
     * @param extraArgs Extra args for checking the balance.
     * @returns Promise that resolves to the balance as a bigint.
     */
    checkBalance(account: AptosAccount | MaybeHexString, extraArgs?: {
        coinType?: string | MaybeHexString;
    }): Promise<bigint>;
}

/** Faucet creates and funds accounts. This is a thin wrapper around that. */

/**
 * Class for requsting tokens from faucet
 */
declare class FaucetClient extends AptosClient {
    readonly faucetUrl: string;
    readonly config: ClientConfig | undefined;
    /**
     * Establishes a connection to Aptos node
     * @param nodeUrl A url of the Aptos Node API endpoint
     * @param faucetUrl A faucet url
     * @param config An optional config for inner axios instance
     * Detailed config description: {@link https://github.com/axios/axios#request-config}
     */
    constructor(nodeUrl: string, faucetUrl: string, config?: ClientConfig);
    /**
     * This creates an account if it does not exist and mints the specified amount of
     * coins into that account
     * @param address Hex-encoded 16 bytes Aptos account address wich mints tokens
     * @param amount Amount of tokens to mint
     * @param timeoutSecs
     * @returns Hashes of submitted transactions
     */
    fundAccount(address: MaybeHexString, amount: number, timeoutSecs?: number): Promise<string[]>;
}

declare const ansContractsMap: Record<string, string>;
declare const nameComponentPattern: RegExp;
declare const namePattern: RegExp;
type ReverseLookupRegistryV1 = {
    registry: {
        handle: string;
    };
};
type NameRegistryV1 = {
    registry: {
        handle: string;
    };
};
type AnsRegistry = {
    expirationTimestampSeconds: number;
    target: string | null;
};
declare class AnsClient {
    contractAddress: string;
    provider: Provider;
    /**
     * Creates new AnsClient instance
     * @param provider Provider instance
     * @param contractAddress An optional contract address.
     * If there is no contract address matching to the provided network
     * then the AnsClient class expects a contract address -
     * this is to support both mainnet/testnet networks and local development.
     */
    constructor(provider: Provider, contractAddress?: string);
    /**
     * Returns the primary name for the given account address
     * @param address An account address
     * @returns Account's primary name | null if there is no primary name defined
     */
    getPrimaryNameByAddress(address: string): Promise<string | null>;
    /**
     * Returns the target account address for the given name
     * @param name ANS name
     * @returns Account address | null
     */
    getAddressByName(name: string): Promise<string | null>;
    /**
     * Mint a new Aptos name
     *
     * @param account AptosAccount where collection will be created
     * @param domainName Aptos domain name to mint
     * @param years year duration of the domain name
     * @returns The hash of the pending transaction submitted to the API
     */
    mintAptosName(account: AptosAccount, domainName: string, years?: number, extraArgs?: OptionalTransactionArgs): Promise<HashValue>;
    /**
     * Mint a new Aptos Subdomain
     *
     * @param account AptosAccount the owner of the domain name
     * @param subdomainName subdomain name to mint
     * @param domainName Aptos domain name to mint under
     * @param expirationTimestampSeconds must be set between the domains expiration and the current time
     * @returns The hash of the pending transaction submitted to the API
     */
    mintAptosSubdomain(account: AptosAccount, subdomainName: string, domainName: string, expirationTimestampSeconds?: number, extraArgs?: OptionalTransactionArgs): Promise<HashValue>;
    /**
     * @param account AptosAccount the owner of the domain name
     * @param subdomainName subdomain name to mint
     * @param domainName Aptos domain name to mint
     * @param target the target address for the subdomain
     * @returns The hash of the pending transaction submitted to the API
     */
    setSubdomainAddress(account: AptosAccount, subdomainName: string, domainName: string, target: string, extraArgs?: OptionalTransactionArgs): Promise<HashValue>;
    /**
     * Initialize reverse lookup for contract owner
     *
     * @param owner the `aptos_names` AptosAccount
     * @returns The hash of the pending transaction submitted to the API
     */
    initReverseLookupRegistry(owner: AptosAccount, extraArgs?: OptionalTransactionArgs): Promise<HashValue>;
    /**
     * Returns the AnsRegistry for the given domain name
     * @param domain domain name
     * @example
     * if name is `aptos.apt`
     * domain = aptos
     *
     * @returns AnsRegistry | null
     */
    private getRegistrationForDomainName;
    /**
     * Returns the AnsRegistry for the given subdomain_name
     * @param domain domain name
     * @param subdomain subdomain name
     * @example
     * if name is `dev.aptos.apt`
     * domain = aptos
     * subdomain = dev
     *
     * @returns AnsRegistry | null
     */
    private getRegistrationForSubdomainName;
}

declare class FungibleAssetClient {
    provider: Provider;
    readonly assetType: string;
    /**
     * Creates new FungibleAssetClient instance
     *
     * @param provider Provider instance
     */
    constructor(provider: Provider);
    /**
     *  Transfer `amount` of fungible asset from sender's primary store to recipient's primary store.
     *
     * Use this method to transfer any fungible asset including fungible token.
     *
     * @param sender The sender account
     * @param fungibleAssetMetadataAddress The fungible asset address.
     * For example if you’re transferring USDT this would be the USDT address
     * @param recipient Recipient address
     * @param amount Number of assets to transfer
     * @returns The hash of the transaction submitted to the API
     */
    transfer(sender: AptosAccount, fungibleAssetMetadataAddress: MaybeHexString, recipient: MaybeHexString, amount: number | bigint, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Get the balance of a fungible asset from the account's primary fungible store.
     *
     * @param account Account that you want to get the balance of.
     * @param fungibleAssetMetadataAddress The fungible asset address you want to check the balance of
     * @returns Promise that resolves to the balance
     */
    getPrimaryBalance(account: MaybeHexString, fungibleAssetMetadataAddress: MaybeHexString): Promise<bigint>;
    /**
     *
     * Generate a transfer transaction that can be used to sign and submit to transfer an asset amount
     * from the sender primary fungible store to the recipient primary fungible store.
     *
     * This method can be used if you want/need to get the raw transaction so you can
     * first simulate the transaction and then sign and submit it.
     *
     * @param sender The sender account
     * @param fungibleAssetMetadataAddress The fungible asset address.
     * For example if you’re transferring USDT this would be the USDT address
     * @param recipient Recipient address
     * @param amount Number of assets to transfer
     * @returns Raw Transaction
     */
    generateTransfer(sender: AptosAccount, fungibleAssetMetadataAddress: MaybeHexString, recipient: MaybeHexString, amount: AnyNumber, extraArgs?: OptionalTransactionArgs): Promise<RawTransaction>;
}

/**
 * A wrapper that handles and manages an account sequence number.
 *
 * Submit up to `maximumInFlight` transactions per account in parallel with a timeout of `sleepTime`
 * If local assumes `maximumInFlight` are in flight, determine the actual committed state from the network
 * If there are less than `maximumInFlight` due to some being committed, adjust the window
 * If `maximumInFlight` are in flight, wait `sleepTime` seconds before re-evaluating
 * If ever waiting more than `maxWaitTime` restart the sequence number to the current on-chain state
 *
 * Assumptions:
 * Accounts are expected to be managed by a single AccountSequenceNumber and not used otherwise.
 * They are initialized to the current on-chain state, so if there are already transactions in
 * flight, they may take some time to reset.
 * Accounts are automatically initialized if not explicitly
 *
 * Notes:
 * This is co-routine safe, that is many async tasks can be reading from this concurrently.
 * The state of an account cannot be used across multiple AccountSequenceNumber services.
 * The synchronize method will create a barrier that prevents additional nextSequenceNumber
 * calls until it is complete.
 * This only manages the distribution of sequence numbers it does not help handle transaction
 * failures.
 * If a transaction fails, you should call synchronize and wait for timeouts.
 */

declare class AccountSequenceNumber {
    readonly provider: Provider;
    readonly account: AptosAccount;
    lastUncommintedNumber: bigint | null;
    currentNumber: bigint | null;
    /**
     * We want to guarantee that we preserve ordering of workers to requests.
     *
     * `lock` is used to try to prevent multiple coroutines from accessing a shared resource at the same time,
     * which can result in race conditions and data inconsistency.
     * This code actually doesn't do it though, since we aren't giving out a slot, it is still somewhat a race condition.
     *
     * The ideal solution is likely that each thread grabs the next number from a incremental integer.
     * When they complete, they increment that number and that entity is able to enter the `lock`.
     * That would guarantee ordering.
     */
    lock: boolean;
    maxWaitTime: number;
    maximumInFlight: number;
    sleepTime: number;
    constructor(provider: Provider, account: AptosAccount, maxWaitTime: number, maximumInFlight: number, sleepTime: number);
    /**
     * Returns the next available sequence number for this account
     *
     * @returns next available sequence number
     */
    nextSequenceNumber(): Promise<bigint | null>;
    /**
     * Initializes this account with the sequence number on chain
     */
    initialize(): Promise<void>;
    /**
     * Updates this account sequence number with the one on-chain
     *
     * @returns on-chain sequence number for this account
     */
    update(): Promise<bigint>;
    /**
     * Synchronizes local sequence number with the seqeunce number on chain for this account.
     *
     * Poll the network until all submitted transactions have either been committed or until
     * the maximum wait time has elapsed
     */
    synchronize(): Promise<void>;
}

/**
 * The AsyncQueue class is an async-aware data structure that provides a queue-like
 * behavior for managing asynchronous tasks or operations.
 * It allows to enqueue items and dequeue them asynchronously.
 * This is not thread-safe but it is async concurrency safe and
 * it does not guarantee ordering for those that call into and await on enqueue.
 */
declare class AsyncQueue<T> {
    readonly queue: T[];
    private pendingDequeue;
    private cancelled;
    /**
     * The enqueue method adds an item to the queue. If there are pending dequeued promises,
     * in the pendingDequeue, it resolves the oldest promise with the enqueued item immediately.
     * Otherwise, it adds the item to the queue.
     *
     * @param item T
     */
    enqueue(item: T): void;
    /**
     * The dequeue method returns a promise that resolves to the next item in the queue.
     * If the queue is not empty, it resolves the promise immediately with the next item.
     * Otherwise, it creates a new promise. The promise's resolve function is stored
     * in the pendingDequeue with a unique counter value as the key.
     * The newly created promise is then returned, and it will be resolved later when an item is enqueued.
     *
     * @returns Promise<T>
     */
    dequeue(): Promise<T>;
    /**
     * The isEmpty method returns whether the queue is empty or not.
     *
     * @returns boolean
     */
    isEmpty(): boolean;
    /**
     * The cancel method cancels all pending promises in the queue.
     * It rejects the promises with a AsyncQueueCancelledError error,
     * ensuring that any awaiting code can handle the cancellation appropriately.
     */
    cancel(): void;
    /**
     * The isCancelled method returns whether the queue is cancelled or not.
     *
     * @returns boolean
     */
    isCancelled(): boolean;
    /**
     * The pendingDequeueLength method returns the length of the pendingDequeue.
     *
     * @returns number
     */
    pendingDequeueLength(): number;
}

/**
 * TransactionWorker provides a simple framework for receiving payloads to be processed.
 *
 * Once one `start()` the process and pushes a new transaction, the worker acquires
 * the current account's next sequence number (by using the AccountSequenceNumber class),
 * generates a signed transaction and pushes an async submission process into the `outstandingTransactions` queue.
 * At the same time, the worker processes transactions by reading the `outstandingTransactions` queue
 * and submits the next transaction to chain, it
 * 1) waits for resolution of the submission process or get pre-execution validation error
 * and 2) waits for the resolution of the execution process or get an execution error.
 * The worker fires events for any submission and/or execution success and/or failure.
 */

declare enum TransactionWorkerEvents {
    TransactionSent = "transactionSent",
    TransactionSendFailed = "transactionsendFailed",
    TransactionExecuted = "transactionExecuted",
    TransactionExecutionFailed = "transactionexecutionFailed"
}
declare class TransactionWorker extends EventEmitter<TransactionWorkerEvents> {
    readonly provider: Provider;
    readonly account: AptosAccount;
    readonly accountSequnceNumber: AccountSequenceNumber;
    readonly taskQueue: AsyncQueue<() => Promise<void>>;
    started: boolean;
    /**
     * transactions payloads waiting to be generated and signed
     *
     * TODO support entry function payload from ABI builder
     */
    transactionsQueue: AsyncQueue<TransactionPayload>;
    /**
     * signed transactions waiting to be submitted
     */
    outstandingTransactions: AsyncQueue<[Promise<PendingTransaction>, bigint]>;
    /**
     * transactions that have been submitted to chain
     */
    sentTransactions: Array<[string, bigint, any]>;
    /**
     * transactions that have been committed to chain
     */
    executedTransactions: Array<[string, bigint, any]>;
    /**
     * Provides a simple framework for receiving payloads to be processed.
     *
     * @param provider - a client provider
     * @param sender - a sender as AptosAccount
     * @param maxWaitTime - the max wait time to wait before resyncing the sequence number
     * to the current on-chain state, default to 30
     * @param maximumInFlight - submit up to `maximumInFlight` transactions per account.
     * Mempool limits the number of transactions per account to 100, hence why we default to 100.
     * @param sleepTime - If `maximumInFlight` are in flight, wait `sleepTime` seconds before re-evaluating, default to 10
     */
    constructor(provider: Provider, account: AptosAccount, maxWaitTime?: number, maximumInFlight?: number, sleepTime?: number);
    /**
     * Gets the current account sequence number,
     * generates the transaction with the account sequence number,
     * adds the transaction to the outstanding transaction queue
     * to be processed later.
     */
    submitNextTransaction(): Promise<void>;
    /**
     * Reads the outstanding transaction queue and submits the transaction to chain.
     *
     * If the transaction has fulfilled, it pushes the transaction to the processed
     * transactions queue and fires a transactionsFulfilled event.
     *
     * If the transaction has failed, it pushes the transaction to the processed
     * transactions queue with the failure reason and fires a transactionsFailed event.
     */
    processTransactions(): Promise<void>;
    /**
     * Once transaction has been sent to chain, we check for its execution status.
     * @param sentTransaction transactions that were sent to chain and are now waiting to be executed
     * @param sequenceNumber the account's sequence number that was sent with the transaction
     */
    checkTransaction(sentTransaction: PromiseFulfilledResult<PendingTransaction>, sequenceNumber: bigint): Promise<void>;
    /**
     * Push transaction to the transactions queue
     * @param payload Transaction payload
     */
    push(payload: TransactionPayload): Promise<void>;
    /**
     * Generates a signed transaction that can be submitted to chain
     * @param account an Aptos account
     * @param sequenceNumber a sequence number the transaction will be generated with
     * @returns
     */
    generateNextTransaction(account: AptosAccount, sequenceNumber: bigint): Promise<Uint8Array | undefined>;
    /**
     * Starts transaction submission and transaction processing.
     */
    run(): Promise<void>;
    /**
     * Starts the transaction management process.
     */
    start(): void;
    /**
     * Stops the the transaction management process.
     */
    stop(): void;
}

type Keys = {
    key: Uint8Array;
    chainCode: Uint8Array;
};
declare const getMasterKeyFromSeed: (seed: string) => Keys;
declare const CKDPriv: ({ key, chainCode }: Keys, index: number) => Keys;
declare const getPublicKey: (privateKey: Uint8Array, withZeroByte?: boolean) => Uint8Array;
declare const isValidPath: (path: string) => boolean;
declare const derivePath: (path: string, seed: string, offset?: number) => Keys;

export { type ABIBuilderConfig, APTOS_COIN, AccountSequenceNumber, type Account_Transactions, type Account_TransactionsCoin_ActivitiesArgs, type Account_TransactionsCoin_Activities_AggregateArgs, type Account_TransactionsDelegated_Staking_ActivitiesArgs, type Account_TransactionsFungible_Asset_ActivitiesArgs, type Account_TransactionsToken_ActivitiesArgs, type Account_TransactionsToken_Activities_AggregateArgs, type Account_TransactionsToken_Activities_V2Args, type Account_TransactionsToken_Activities_V2_AggregateArgs, type Account_Transactions_Aggregate, type Account_Transactions_Aggregate_Fields, type Account_Transactions_Aggregate_FieldsCountArgs, type Account_Transactions_Avg_Fields, type Account_Transactions_Bool_Exp, type Account_Transactions_Max_Fields, type Account_Transactions_Min_Fields, type Account_Transactions_Order_By, Account_Transactions_Select_Column, type Account_Transactions_Stddev_Fields, type Account_Transactions_Stddev_Pop_Fields, type Account_Transactions_Stddev_Samp_Fields, type Account_Transactions_Stream_Cursor_Input, type Account_Transactions_Stream_Cursor_Value_Input, type Account_Transactions_Sum_Fields, type Account_Transactions_Var_Pop_Fields, type Account_Transactions_Var_Samp_Fields, type Account_Transactions_Variance_Fields, type Address_Events_Summary, type Address_Events_Summary_Bool_Exp, type Address_Events_Summary_Order_By, Address_Events_Summary_Select_Column, type Address_Events_Summary_Stream_Cursor_Input, type Address_Events_Summary_Stream_Cursor_Value_Input, type Address_Version_From_Events, type Address_Version_From_EventsCoin_ActivitiesArgs, type Address_Version_From_EventsCoin_Activities_AggregateArgs, type Address_Version_From_EventsDelegated_Staking_ActivitiesArgs, type Address_Version_From_EventsToken_ActivitiesArgs, type Address_Version_From_EventsToken_Activities_AggregateArgs, type Address_Version_From_EventsToken_Activities_V2Args, type Address_Version_From_EventsToken_Activities_V2_AggregateArgs, type Address_Version_From_Events_Aggregate, type Address_Version_From_Events_Aggregate_Fields, type Address_Version_From_Events_Aggregate_FieldsCountArgs, type Address_Version_From_Events_Avg_Fields, type Address_Version_From_Events_Bool_Exp, type Address_Version_From_Events_Max_Fields, type Address_Version_From_Events_Min_Fields, type Address_Version_From_Events_Order_By, Address_Version_From_Events_Select_Column, type Address_Version_From_Events_Stddev_Fields, type Address_Version_From_Events_Stddev_Pop_Fields, type Address_Version_From_Events_Stddev_Samp_Fields, type Address_Version_From_Events_Stream_Cursor_Input, type Address_Version_From_Events_Stream_Cursor_Value_Input, type Address_Version_From_Events_Sum_Fields, type Address_Version_From_Events_Var_Pop_Fields, type Address_Version_From_Events_Var_Samp_Fields, type Address_Version_From_Events_Variance_Fields, type Address_Version_From_Move_Resources, type Address_Version_From_Move_ResourcesCoin_ActivitiesArgs, type Address_Version_From_Move_ResourcesCoin_Activities_AggregateArgs, type Address_Version_From_Move_ResourcesDelegated_Staking_ActivitiesArgs, type Address_Version_From_Move_ResourcesToken_ActivitiesArgs, type Address_Version_From_Move_ResourcesToken_Activities_AggregateArgs, type Address_Version_From_Move_ResourcesToken_Activities_V2Args, type Address_Version_From_Move_ResourcesToken_Activities_V2_AggregateArgs, type Address_Version_From_Move_Resources_Aggregate, type Address_Version_From_Move_Resources_Aggregate_Fields, type Address_Version_From_Move_Resources_Aggregate_FieldsCountArgs, type Address_Version_From_Move_Resources_Avg_Fields, type Address_Version_From_Move_Resources_Bool_Exp, type Address_Version_From_Move_Resources_Max_Fields, type Address_Version_From_Move_Resources_Min_Fields, type Address_Version_From_Move_Resources_Order_By, Address_Version_From_Move_Resources_Select_Column, type Address_Version_From_Move_Resources_Stddev_Fields, type Address_Version_From_Move_Resources_Stddev_Pop_Fields, type Address_Version_From_Move_Resources_Stddev_Samp_Fields, type Address_Version_From_Move_Resources_Stream_Cursor_Input, type Address_Version_From_Move_Resources_Stream_Cursor_Value_Input, type Address_Version_From_Move_Resources_Sum_Fields, type Address_Version_From_Move_Resources_Var_Pop_Fields, type Address_Version_From_Move_Resources_Var_Samp_Fields, type Address_Version_From_Move_Resources_Variance_Fields, AnsClient, type AnsRegistry, type AnyRawTransaction, ApiError, AptosAccount, type AptosAccountObject, AptosApiError, AptosClient, type AptosClientInterface, type AptosRequest, type AptosResponse, AptosToken, index$2 as BCS, type Bigint_Comparison_Exp, type Block_Metadata_Transactions, type Block_Metadata_TransactionsFailed_Proposer_IndicesArgs, type Block_Metadata_TransactionsPrevious_Block_Votes_BitvecArgs, type Block_Metadata_Transactions_Bool_Exp, type Block_Metadata_Transactions_Order_By, Block_Metadata_Transactions_Select_Column, type Block_Metadata_Transactions_Stream_Cursor_Input, type Block_Metadata_Transactions_Stream_Cursor_Value_Input, type Boolean_Comparison_Exp, CKDPriv, COIN_TRANSFER, type ClientConfig, CoinClient, type Coin_Activities, type Coin_ActivitiesAptos_NamesArgs, type Coin_ActivitiesAptos_Names_AggregateArgs, type Coin_Activities_Aggregate, type Coin_Activities_Aggregate_Fields, type Coin_Activities_Aggregate_FieldsCountArgs, type Coin_Activities_Aggregate_Order_By, type Coin_Activities_Avg_Fields, type Coin_Activities_Avg_Order_By, type Coin_Activities_Bool_Exp, type Coin_Activities_Max_Fields, type Coin_Activities_Max_Order_By, type Coin_Activities_Min_Fields, type Coin_Activities_Min_Order_By, type Coin_Activities_Order_By, Coin_Activities_Select_Column, type Coin_Activities_Stddev_Fields, type Coin_Activities_Stddev_Order_By, type Coin_Activities_Stddev_Pop_Fields, type Coin_Activities_Stddev_Pop_Order_By, type Coin_Activities_Stddev_Samp_Fields, type Coin_Activities_Stddev_Samp_Order_By, type Coin_Activities_Stream_Cursor_Input, type Coin_Activities_Stream_Cursor_Value_Input, type Coin_Activities_Sum_Fields, type Coin_Activities_Sum_Order_By, type Coin_Activities_Var_Pop_Fields, type Coin_Activities_Var_Pop_Order_By, type Coin_Activities_Var_Samp_Fields, type Coin_Activities_Var_Samp_Order_By, type Coin_Activities_Variance_Fields, type Coin_Activities_Variance_Order_By, type Coin_Balances, type Coin_Balances_Bool_Exp, type Coin_Balances_Order_By, Coin_Balances_Select_Column, type Coin_Balances_Stream_Cursor_Input, type Coin_Balances_Stream_Cursor_Value_Input, type Coin_Infos, type Coin_Infos_Bool_Exp, type Coin_Infos_Order_By, Coin_Infos_Select_Column, type Coin_Infos_Stream_Cursor_Input, type Coin_Infos_Stream_Cursor_Value_Input, type Coin_Supply, type Coin_Supply_Bool_Exp, type Coin_Supply_Order_By, Coin_Supply_Select_Column, type Coin_Supply_Stream_Cursor_Input, type Coin_Supply_Stream_Cursor_Value_Input, type Collection_Datas, type Collection_Datas_Bool_Exp, type Collection_Datas_Order_By, Collection_Datas_Select_Column, type Collection_Datas_Stream_Cursor_Input, type Collection_Datas_Stream_Cursor_Value_Input, type CreateCollectionOptions, type Current_Ans_Lookup, type Current_Ans_LookupAll_Token_OwnershipsArgs, type Current_Ans_LookupAll_Token_Ownerships_AggregateArgs, type Current_Ans_Lookup_Bool_Exp, type Current_Ans_Lookup_Order_By, Current_Ans_Lookup_Select_Column, type Current_Ans_Lookup_Stream_Cursor_Input, type Current_Ans_Lookup_Stream_Cursor_Value_Input, type Current_Ans_Lookup_V2, type Current_Ans_Lookup_V2_Bool_Exp, type Current_Ans_Lookup_V2_Order_By, Current_Ans_Lookup_V2_Select_Column, type Current_Ans_Lookup_V2_Stream_Cursor_Input, type Current_Ans_Lookup_V2_Stream_Cursor_Value_Input, type Current_Aptos_Names, type Current_Aptos_Names_Aggregate, type Current_Aptos_Names_Aggregate_Fields, type Current_Aptos_Names_Aggregate_FieldsCountArgs, type Current_Aptos_Names_Aggregate_Order_By, type Current_Aptos_Names_Avg_Fields, type Current_Aptos_Names_Avg_Order_By, type Current_Aptos_Names_Bool_Exp, type Current_Aptos_Names_Max_Fields, type Current_Aptos_Names_Max_Order_By, type Current_Aptos_Names_Min_Fields, type Current_Aptos_Names_Min_Order_By, type Current_Aptos_Names_Order_By, Current_Aptos_Names_Select_Column, type Current_Aptos_Names_Stddev_Fields, type Current_Aptos_Names_Stddev_Order_By, type Current_Aptos_Names_Stddev_Pop_Fields, type Current_Aptos_Names_Stddev_Pop_Order_By, type Current_Aptos_Names_Stddev_Samp_Fields, type Current_Aptos_Names_Stddev_Samp_Order_By, type Current_Aptos_Names_Stream_Cursor_Input, type Current_Aptos_Names_Stream_Cursor_Value_Input, type Current_Aptos_Names_Sum_Fields, type Current_Aptos_Names_Sum_Order_By, type Current_Aptos_Names_Var_Pop_Fields, type Current_Aptos_Names_Var_Pop_Order_By, type Current_Aptos_Names_Var_Samp_Fields, type Current_Aptos_Names_Var_Samp_Order_By, type Current_Aptos_Names_Variance_Fields, type Current_Aptos_Names_Variance_Order_By, type Current_Coin_Balances, type Current_Coin_Balances_Bool_Exp, type Current_Coin_Balances_Order_By, Current_Coin_Balances_Select_Column, type Current_Coin_Balances_Stream_Cursor_Input, type Current_Coin_Balances_Stream_Cursor_Value_Input, type Current_Collection_Datas, type Current_Collection_Datas_Bool_Exp, type Current_Collection_Datas_Order_By, Current_Collection_Datas_Select_Column, type Current_Collection_Datas_Stream_Cursor_Input, type Current_Collection_Datas_Stream_Cursor_Value_Input, type Current_Collection_Ownership_V2_View, type Current_Collection_Ownership_V2_View_Aggregate, type Current_Collection_Ownership_V2_View_Aggregate_Fields, type Current_Collection_Ownership_V2_View_Aggregate_FieldsCountArgs, type Current_Collection_Ownership_V2_View_Avg_Fields, type Current_Collection_Ownership_V2_View_Bool_Exp, type Current_Collection_Ownership_V2_View_Max_Fields, type Current_Collection_Ownership_V2_View_Min_Fields, type Current_Collection_Ownership_V2_View_Order_By, Current_Collection_Ownership_V2_View_Select_Column, type Current_Collection_Ownership_V2_View_Stddev_Fields, type Current_Collection_Ownership_V2_View_Stddev_Pop_Fields, type Current_Collection_Ownership_V2_View_Stddev_Samp_Fields, type Current_Collection_Ownership_V2_View_Stream_Cursor_Input, type Current_Collection_Ownership_V2_View_Stream_Cursor_Value_Input, type Current_Collection_Ownership_V2_View_Sum_Fields, type Current_Collection_Ownership_V2_View_Var_Pop_Fields, type Current_Collection_Ownership_V2_View_Var_Samp_Fields, type Current_Collection_Ownership_V2_View_Variance_Fields, type Current_Collections_V2, type Current_Collections_V2_Bool_Exp, type Current_Collections_V2_Order_By, Current_Collections_V2_Select_Column, type Current_Collections_V2_Stream_Cursor_Input, type Current_Collections_V2_Stream_Cursor_Value_Input, type Current_Delegated_Staking_Pool_Balances, type Current_Delegated_Staking_Pool_Balances_Bool_Exp, type Current_Delegated_Staking_Pool_Balances_Order_By, Current_Delegated_Staking_Pool_Balances_Select_Column, type Current_Delegated_Staking_Pool_Balances_Stream_Cursor_Input, type Current_Delegated_Staking_Pool_Balances_Stream_Cursor_Value_Input, type Current_Delegated_Voter, type Current_Delegated_Voter_Bool_Exp, type Current_Delegated_Voter_Order_By, Current_Delegated_Voter_Select_Column, type Current_Delegated_Voter_Stream_Cursor_Input, type Current_Delegated_Voter_Stream_Cursor_Value_Input, type Current_Delegator_Balances, type Current_Delegator_Balances_Bool_Exp, type Current_Delegator_Balances_Order_By, Current_Delegator_Balances_Select_Column, type Current_Delegator_Balances_Stream_Cursor_Input, type Current_Delegator_Balances_Stream_Cursor_Value_Input, type Current_Fungible_Asset_Balances, type Current_Fungible_Asset_Balances_Aggregate, type Current_Fungible_Asset_Balances_Aggregate_Fields, type Current_Fungible_Asset_Balances_Aggregate_FieldsCountArgs, type Current_Fungible_Asset_Balances_Avg_Fields, type Current_Fungible_Asset_Balances_Bool_Exp, type Current_Fungible_Asset_Balances_Max_Fields, type Current_Fungible_Asset_Balances_Min_Fields, type Current_Fungible_Asset_Balances_Order_By, Current_Fungible_Asset_Balances_Select_Column, type Current_Fungible_Asset_Balances_Stddev_Fields, type Current_Fungible_Asset_Balances_Stddev_Pop_Fields, type Current_Fungible_Asset_Balances_Stddev_Samp_Fields, type Current_Fungible_Asset_Balances_Stream_Cursor_Input, type Current_Fungible_Asset_Balances_Stream_Cursor_Value_Input, type Current_Fungible_Asset_Balances_Sum_Fields, type Current_Fungible_Asset_Balances_Var_Pop_Fields, type Current_Fungible_Asset_Balances_Var_Samp_Fields, type Current_Fungible_Asset_Balances_Variance_Fields, type Current_Objects, type Current_Objects_Bool_Exp, type Current_Objects_Order_By, Current_Objects_Select_Column, type Current_Objects_Stream_Cursor_Input, type Current_Objects_Stream_Cursor_Value_Input, type Current_Staking_Pool_Voter, type Current_Staking_Pool_VoterOperator_Aptos_NameArgs, type Current_Staking_Pool_VoterOperator_Aptos_Name_AggregateArgs, type Current_Staking_Pool_Voter_Bool_Exp, type Current_Staking_Pool_Voter_Order_By, Current_Staking_Pool_Voter_Select_Column, type Current_Staking_Pool_Voter_Stream_Cursor_Input, type Current_Staking_Pool_Voter_Stream_Cursor_Value_Input, type Current_Table_Items, type Current_Table_ItemsDecoded_KeyArgs, type Current_Table_ItemsDecoded_ValueArgs, type Current_Table_Items_Bool_Exp, type Current_Table_Items_Order_By, Current_Table_Items_Select_Column, type Current_Table_Items_Stream_Cursor_Input, type Current_Table_Items_Stream_Cursor_Value_Input, type Current_Token_Datas, type Current_Token_DatasDefault_PropertiesArgs, type Current_Token_Datas_Bool_Exp, type Current_Token_Datas_Order_By, Current_Token_Datas_Select_Column, type Current_Token_Datas_Stream_Cursor_Input, type Current_Token_Datas_Stream_Cursor_Value_Input, type Current_Token_Datas_V2, type Current_Token_Datas_V2Token_PropertiesArgs, type Current_Token_Datas_V2_Bool_Exp, type Current_Token_Datas_V2_Order_By, Current_Token_Datas_V2_Select_Column, type Current_Token_Datas_V2_Stream_Cursor_Input, type Current_Token_Datas_V2_Stream_Cursor_Value_Input, type Current_Token_Ownerships, type Current_Token_OwnershipsToken_PropertiesArgs, type Current_Token_Ownerships_Aggregate, type Current_Token_Ownerships_Aggregate_Fields, type Current_Token_Ownerships_Aggregate_FieldsCountArgs, type Current_Token_Ownerships_Aggregate_Order_By, type Current_Token_Ownerships_Avg_Fields, type Current_Token_Ownerships_Avg_Order_By, type Current_Token_Ownerships_Bool_Exp, type Current_Token_Ownerships_Max_Fields, type Current_Token_Ownerships_Max_Order_By, type Current_Token_Ownerships_Min_Fields, type Current_Token_Ownerships_Min_Order_By, type Current_Token_Ownerships_Order_By, Current_Token_Ownerships_Select_Column, type Current_Token_Ownerships_Stddev_Fields, type Current_Token_Ownerships_Stddev_Order_By, type Current_Token_Ownerships_Stddev_Pop_Fields, type Current_Token_Ownerships_Stddev_Pop_Order_By, type Current_Token_Ownerships_Stddev_Samp_Fields, type Current_Token_Ownerships_Stddev_Samp_Order_By, type Current_Token_Ownerships_Stream_Cursor_Input, type Current_Token_Ownerships_Stream_Cursor_Value_Input, type Current_Token_Ownerships_Sum_Fields, type Current_Token_Ownerships_Sum_Order_By, type Current_Token_Ownerships_V2, type Current_Token_Ownerships_V2Composed_NftsArgs, type Current_Token_Ownerships_V2Composed_Nfts_AggregateArgs, type Current_Token_Ownerships_V2Token_Properties_Mutated_V1Args, type Current_Token_Ownerships_V2_Aggregate, type Current_Token_Ownerships_V2_Aggregate_Fields, type Current_Token_Ownerships_V2_Aggregate_FieldsCountArgs, type Current_Token_Ownerships_V2_Aggregate_Order_By, type Current_Token_Ownerships_V2_Avg_Fields, type Current_Token_Ownerships_V2_Avg_Order_By, type Current_Token_Ownerships_V2_Bool_Exp, type Current_Token_Ownerships_V2_Max_Fields, type Current_Token_Ownerships_V2_Max_Order_By, type Current_Token_Ownerships_V2_Min_Fields, type Current_Token_Ownerships_V2_Min_Order_By, type Current_Token_Ownerships_V2_Order_By, Current_Token_Ownerships_V2_Select_Column, type Current_Token_Ownerships_V2_Stddev_Fields, type Current_Token_Ownerships_V2_Stddev_Order_By, type Current_Token_Ownerships_V2_Stddev_Pop_Fields, type Current_Token_Ownerships_V2_Stddev_Pop_Order_By, type Current_Token_Ownerships_V2_Stddev_Samp_Fields, type Current_Token_Ownerships_V2_Stddev_Samp_Order_By, type Current_Token_Ownerships_V2_Stream_Cursor_Input, type Current_Token_Ownerships_V2_Stream_Cursor_Value_Input, type Current_Token_Ownerships_V2_Sum_Fields, type Current_Token_Ownerships_V2_Sum_Order_By, type Current_Token_Ownerships_V2_Var_Pop_Fields, type Current_Token_Ownerships_V2_Var_Pop_Order_By, type Current_Token_Ownerships_V2_Var_Samp_Fields, type Current_Token_Ownerships_V2_Var_Samp_Order_By, type Current_Token_Ownerships_V2_Variance_Fields, type Current_Token_Ownerships_V2_Variance_Order_By, type Current_Token_Ownerships_Var_Pop_Fields, type Current_Token_Ownerships_Var_Pop_Order_By, type Current_Token_Ownerships_Var_Samp_Fields, type Current_Token_Ownerships_Var_Samp_Order_By, type Current_Token_Ownerships_Variance_Fields, type Current_Token_Ownerships_Variance_Order_By, type Current_Token_Pending_Claims, type Current_Token_Pending_Claims_Bool_Exp, type Current_Token_Pending_Claims_Order_By, Current_Token_Pending_Claims_Select_Column, type Current_Token_Pending_Claims_Stream_Cursor_Input, type Current_Token_Pending_Claims_Stream_Cursor_Value_Input, Cursor_Ordering, type CustomEndpoints, type Delegated_Staking_Activities, type Delegated_Staking_Activities_Aggregate_Order_By, type Delegated_Staking_Activities_Avg_Order_By, type Delegated_Staking_Activities_Bool_Exp, type Delegated_Staking_Activities_Max_Order_By, type Delegated_Staking_Activities_Min_Order_By, type Delegated_Staking_Activities_Order_By, Delegated_Staking_Activities_Select_Column, type Delegated_Staking_Activities_Stddev_Order_By, type Delegated_Staking_Activities_Stddev_Pop_Order_By, type Delegated_Staking_Activities_Stddev_Samp_Order_By, type Delegated_Staking_Activities_Stream_Cursor_Input, type Delegated_Staking_Activities_Stream_Cursor_Value_Input, type Delegated_Staking_Activities_Sum_Order_By, type Delegated_Staking_Activities_Var_Pop_Order_By, type Delegated_Staking_Activities_Var_Samp_Order_By, type Delegated_Staking_Activities_Variance_Order_By, type Delegated_Staking_Pools, type Delegated_Staking_Pools_Bool_Exp, type Delegated_Staking_Pools_Order_By, Delegated_Staking_Pools_Select_Column, type Delegated_Staking_Pools_Stream_Cursor_Input, type Delegated_Staking_Pools_Stream_Cursor_Value_Input, type Delegator_Distinct_Pool, type Delegator_Distinct_Pool_Aggregate, type Delegator_Distinct_Pool_Aggregate_Fields, type Delegator_Distinct_Pool_Aggregate_FieldsCountArgs, type Delegator_Distinct_Pool_Bool_Exp, type Delegator_Distinct_Pool_Max_Fields, type Delegator_Distinct_Pool_Min_Fields, type Delegator_Distinct_Pool_Order_By, Delegator_Distinct_Pool_Select_Column, type Delegator_Distinct_Pool_Stream_Cursor_Input, type Delegator_Distinct_Pool_Stream_Cursor_Value_Input, type Events, type EventsDataArgs, type Events_Bool_Exp, type Events_Order_By, Events_Select_Column, type Events_Stream_Cursor_Input, type Events_Stream_Cursor_Value_Input, type Exact, FailedTransactionError, FaucetClient, FungibleAssetClient, type FungibleTokenParameters, type Fungible_Asset_Activities, type Fungible_Asset_ActivitiesOwner_Aptos_NamesArgs, type Fungible_Asset_ActivitiesOwner_Aptos_Names_AggregateArgs, type Fungible_Asset_Activities_Aggregate_Order_By, type Fungible_Asset_Activities_Avg_Order_By, type Fungible_Asset_Activities_Bool_Exp, type Fungible_Asset_Activities_Max_Order_By, type Fungible_Asset_Activities_Min_Order_By, type Fungible_Asset_Activities_Order_By, Fungible_Asset_Activities_Select_Column, type Fungible_Asset_Activities_Stddev_Order_By, type Fungible_Asset_Activities_Stddev_Pop_Order_By, type Fungible_Asset_Activities_Stddev_Samp_Order_By, type Fungible_Asset_Activities_Stream_Cursor_Input, type Fungible_Asset_Activities_Stream_Cursor_Value_Input, type Fungible_Asset_Activities_Sum_Order_By, type Fungible_Asset_Activities_Var_Pop_Order_By, type Fungible_Asset_Activities_Var_Samp_Order_By, type Fungible_Asset_Activities_Variance_Order_By, type Fungible_Asset_Metadata, type Fungible_Asset_Metadata_Bool_Exp, type Fungible_Asset_Metadata_Order_By, Fungible_Asset_Metadata_Select_Column, type Fungible_Asset_Metadata_Stream_Cursor_Input, type Fungible_Asset_Metadata_Stream_Cursor_Value_Input, type GetRequestOptions, type GraphqlQuery, HexString, type Incremental, IndexerClient, type IndexerOrderBy, type IndexerPaginationArgs, type IndexerSortBy, type IndexerSortingOptions, type Indexer_Status, type Indexer_Status_Bool_Exp, type Indexer_Status_Order_By, Indexer_Status_Select_Column, type Indexer_Status_Stream_Cursor_Input, type Indexer_Status_Stream_Cursor_Value_Input, type InputMaybe, type Int_Comparison_Exp, type Jsonb_Cast_Exp, type Jsonb_Comparison_Exp, type Keys, type Ledger_Infos, type Ledger_Infos_Bool_Exp, type Ledger_Infos_Order_By, Ledger_Infos_Select_Column, type Ledger_Infos_Stream_Cursor_Input, type Ledger_Infos_Stream_Cursor_Value_Input, type MakeEmpty, type MakeMaybe, type MakeOptional, type Maybe, type MaybeHexString, type Move_Resources, type Move_Resources_Aggregate, type Move_Resources_Aggregate_Fields, type Move_Resources_Aggregate_FieldsCountArgs, type Move_Resources_Avg_Fields, type Move_Resources_Bool_Exp, type Move_Resources_Max_Fields, type Move_Resources_Min_Fields, type Move_Resources_Order_By, Move_Resources_Select_Column, type Move_Resources_Stddev_Fields, type Move_Resources_Stddev_Pop_Fields, type Move_Resources_Stddev_Samp_Fields, type Move_Resources_Stream_Cursor_Input, type Move_Resources_Stream_Cursor_Value_Input, type Move_Resources_Sum_Fields, type Move_Resources_Var_Pop_Fields, type Move_Resources_Var_Samp_Fields, type Move_Resources_Variance_Fields, type NameRegistryV1, Network, NetworkToIndexerAPI, NetworkToNodeAPI, type Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions, type Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Bool_Exp, type Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Order_By, Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column, type Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Stream_Cursor_Input, type Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Stream_Cursor_Value_Input, type Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers, type Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Bool_Exp, type Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Order_By, Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column, type Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Stream_Cursor_Input, type Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Stream_Cursor_Value_Input, type Nft_Marketplace_V2_Current_Nft_Marketplace_Listings, type Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Bool_Exp, type Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Order_By, Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column, type Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Stream_Cursor_Input, type Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Stream_Cursor_Value_Input, type Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers, type Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Bool_Exp, type Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Order_By, Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column, type Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Stream_Cursor_Input, type Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Stream_Cursor_Value_Input, type Nft_Marketplace_V2_Nft_Marketplace_Activities, type Nft_Marketplace_V2_Nft_Marketplace_Activities_Bool_Exp, type Nft_Marketplace_V2_Nft_Marketplace_Activities_Order_By, Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column, type Nft_Marketplace_V2_Nft_Marketplace_Activities_Stream_Cursor_Input, type Nft_Marketplace_V2_Nft_Marketplace_Activities_Stream_Cursor_Value_Input, type Nft_Metadata_Crawler_Parsed_Asset_Uris, type Nft_Metadata_Crawler_Parsed_Asset_Uris_Bool_Exp, type Nft_Metadata_Crawler_Parsed_Asset_Uris_Order_By, Nft_Metadata_Crawler_Parsed_Asset_Uris_Select_Column, type Nft_Metadata_Crawler_Parsed_Asset_Uris_Stream_Cursor_Input, type Nft_Metadata_Crawler_Parsed_Asset_Uris_Stream_Cursor_Value_Input, NodeAPIToNetwork, type NonFungibleTokenParameters, type Num_Active_Delegator_Per_Pool, type Num_Active_Delegator_Per_Pool_Bool_Exp, type Num_Active_Delegator_Per_Pool_Order_By, Num_Active_Delegator_Per_Pool_Select_Column, type Num_Active_Delegator_Per_Pool_Stream_Cursor_Input, type Num_Active_Delegator_Per_Pool_Stream_Cursor_Value_Input, type Numeric_Comparison_Exp, type OptionalTransactionArgs, Order_By, type PaginationArgs, type PostRequestOptions, type Processor_Status, type Processor_Status_Bool_Exp, type Processor_Status_Order_By, Processor_Status_Select_Column, type Processor_Status_Stream_Cursor_Input, type Processor_Status_Stream_Cursor_Value_Input, PropertyMap, type PropertyType, PropertyValue, type Proposal_Votes, type Proposal_Votes_Aggregate, type Proposal_Votes_Aggregate_Fields, type Proposal_Votes_Aggregate_FieldsCountArgs, type Proposal_Votes_Avg_Fields, type Proposal_Votes_Bool_Exp, type Proposal_Votes_Max_Fields, type Proposal_Votes_Min_Fields, type Proposal_Votes_Order_By, Proposal_Votes_Select_Column, type Proposal_Votes_Stddev_Fields, type Proposal_Votes_Stddev_Pop_Fields, type Proposal_Votes_Stddev_Samp_Fields, type Proposal_Votes_Stream_Cursor_Input, type Proposal_Votes_Stream_Cursor_Value_Input, type Proposal_Votes_Sum_Fields, type Proposal_Votes_Var_Pop_Fields, type Proposal_Votes_Var_Samp_Fields, type Proposal_Votes_Variance_Fields, Provider, type Query_Root, type Query_RootAccount_TransactionsArgs, type Query_RootAccount_Transactions_AggregateArgs, type Query_RootAccount_Transactions_By_PkArgs, type Query_RootAddress_Events_SummaryArgs, type Query_RootAddress_Version_From_EventsArgs, type Query_RootAddress_Version_From_Events_AggregateArgs, type Query_RootAddress_Version_From_Move_ResourcesArgs, type Query_RootAddress_Version_From_Move_Resources_AggregateArgs, type Query_RootBlock_Metadata_TransactionsArgs, type Query_RootBlock_Metadata_Transactions_By_PkArgs, type Query_RootCoin_ActivitiesArgs, type Query_RootCoin_Activities_AggregateArgs, type Query_RootCoin_Activities_By_PkArgs, type Query_RootCoin_BalancesArgs, type Query_RootCoin_Balances_By_PkArgs, type Query_RootCoin_InfosArgs, type Query_RootCoin_Infos_By_PkArgs, type Query_RootCoin_SupplyArgs, type Query_RootCoin_Supply_By_PkArgs, type Query_RootCollection_DatasArgs, type Query_RootCollection_Datas_By_PkArgs, type Query_RootCurrent_Ans_LookupArgs, type Query_RootCurrent_Ans_Lookup_By_PkArgs, type Query_RootCurrent_Ans_Lookup_V2Args, type Query_RootCurrent_Ans_Lookup_V2_By_PkArgs, type Query_RootCurrent_Aptos_NamesArgs, type Query_RootCurrent_Aptos_Names_AggregateArgs, type Query_RootCurrent_Coin_BalancesArgs, type Query_RootCurrent_Coin_Balances_By_PkArgs, type Query_RootCurrent_Collection_DatasArgs, type Query_RootCurrent_Collection_Datas_By_PkArgs, type Query_RootCurrent_Collection_Ownership_V2_ViewArgs, type Query_RootCurrent_Collection_Ownership_V2_View_AggregateArgs, type Query_RootCurrent_Collections_V2Args, type Query_RootCurrent_Collections_V2_By_PkArgs, type Query_RootCurrent_Delegated_Staking_Pool_BalancesArgs, type Query_RootCurrent_Delegated_Staking_Pool_Balances_By_PkArgs, type Query_RootCurrent_Delegated_VoterArgs, type Query_RootCurrent_Delegated_Voter_By_PkArgs, type Query_RootCurrent_Delegator_BalancesArgs, type Query_RootCurrent_Delegator_Balances_By_PkArgs, type Query_RootCurrent_Fungible_Asset_BalancesArgs, type Query_RootCurrent_Fungible_Asset_Balances_AggregateArgs, type Query_RootCurrent_Fungible_Asset_Balances_By_PkArgs, type Query_RootCurrent_ObjectsArgs, type Query_RootCurrent_Objects_By_PkArgs, type Query_RootCurrent_Staking_Pool_VoterArgs, type Query_RootCurrent_Staking_Pool_Voter_By_PkArgs, type Query_RootCurrent_Table_ItemsArgs, type Query_RootCurrent_Table_Items_By_PkArgs, type Query_RootCurrent_Token_DatasArgs, type Query_RootCurrent_Token_Datas_By_PkArgs, type Query_RootCurrent_Token_Datas_V2Args, type Query_RootCurrent_Token_Datas_V2_By_PkArgs, type Query_RootCurrent_Token_OwnershipsArgs, type Query_RootCurrent_Token_Ownerships_AggregateArgs, type Query_RootCurrent_Token_Ownerships_By_PkArgs, type Query_RootCurrent_Token_Ownerships_V2Args, type Query_RootCurrent_Token_Ownerships_V2_AggregateArgs, type Query_RootCurrent_Token_Ownerships_V2_By_PkArgs, type Query_RootCurrent_Token_Pending_ClaimsArgs, type Query_RootCurrent_Token_Pending_Claims_By_PkArgs, type Query_RootDelegated_Staking_ActivitiesArgs, type Query_RootDelegated_Staking_Activities_By_PkArgs, type Query_RootDelegated_Staking_PoolsArgs, type Query_RootDelegated_Staking_Pools_By_PkArgs, type Query_RootDelegator_Distinct_PoolArgs, type Query_RootDelegator_Distinct_Pool_AggregateArgs, type Query_RootEventsArgs, type Query_RootEvents_By_PkArgs, type Query_RootFungible_Asset_ActivitiesArgs, type Query_RootFungible_Asset_Activities_By_PkArgs, type Query_RootFungible_Asset_MetadataArgs, type Query_RootFungible_Asset_Metadata_By_PkArgs, type Query_RootIndexer_StatusArgs, type Query_RootIndexer_Status_By_PkArgs, type Query_RootLedger_InfosArgs, type Query_RootLedger_Infos_By_PkArgs, type Query_RootMove_ResourcesArgs, type Query_RootMove_Resources_AggregateArgs, type Query_RootNft_Marketplace_V2_Current_Nft_Marketplace_AuctionsArgs, type Query_RootNft_Marketplace_V2_Current_Nft_Marketplace_Auctions_By_PkArgs, type Query_RootNft_Marketplace_V2_Current_Nft_Marketplace_Collection_OffersArgs, type Query_RootNft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_By_PkArgs, type Query_RootNft_Marketplace_V2_Current_Nft_Marketplace_ListingsArgs, type Query_RootNft_Marketplace_V2_Current_Nft_Marketplace_Listings_By_PkArgs, type Query_RootNft_Marketplace_V2_Current_Nft_Marketplace_Token_OffersArgs, type Query_RootNft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_By_PkArgs, type Query_RootNft_Marketplace_V2_Nft_Marketplace_ActivitiesArgs, type Query_RootNft_Marketplace_V2_Nft_Marketplace_Activities_By_PkArgs, type Query_RootNft_Metadata_Crawler_Parsed_Asset_UrisArgs, type Query_RootNft_Metadata_Crawler_Parsed_Asset_Uris_By_PkArgs, type Query_RootNum_Active_Delegator_Per_PoolArgs, type Query_RootProcessor_StatusArgs, type Query_RootProcessor_Status_By_PkArgs, type Query_RootProposal_VotesArgs, type Query_RootProposal_Votes_AggregateArgs, type Query_RootProposal_Votes_By_PkArgs, type Query_RootTable_ItemsArgs, type Query_RootTable_Items_By_PkArgs, type Query_RootTable_MetadatasArgs, type Query_RootTable_Metadatas_By_PkArgs, type Query_RootToken_ActivitiesArgs, type Query_RootToken_Activities_AggregateArgs, type Query_RootToken_Activities_By_PkArgs, type Query_RootToken_Activities_V2Args, type Query_RootToken_Activities_V2_AggregateArgs, type Query_RootToken_Activities_V2_By_PkArgs, type Query_RootToken_DatasArgs, type Query_RootToken_Datas_By_PkArgs, type Query_RootToken_OwnershipsArgs, type Query_RootToken_Ownerships_By_PkArgs, type Query_RootTokensArgs, type Query_RootTokens_By_PkArgs, type Query_RootUser_TransactionsArgs, type Query_RootUser_Transactions_By_PkArgs, type RemoteABIBuilderConfig, type ReverseLookupRegistryV1, type Scalars, type SigningFn, type String_Comparison_Exp, type Subscription_Root, type Subscription_RootAccount_TransactionsArgs, type Subscription_RootAccount_Transactions_AggregateArgs, type Subscription_RootAccount_Transactions_By_PkArgs, type Subscription_RootAccount_Transactions_StreamArgs, type Subscription_RootAddress_Events_SummaryArgs, type Subscription_RootAddress_Events_Summary_StreamArgs, type Subscription_RootAddress_Version_From_EventsArgs, type Subscription_RootAddress_Version_From_Events_AggregateArgs, type Subscription_RootAddress_Version_From_Events_StreamArgs, type Subscription_RootAddress_Version_From_Move_ResourcesArgs, type Subscription_RootAddress_Version_From_Move_Resources_AggregateArgs, type Subscription_RootAddress_Version_From_Move_Resources_StreamArgs, type Subscription_RootBlock_Metadata_TransactionsArgs, type Subscription_RootBlock_Metadata_Transactions_By_PkArgs, type Subscription_RootBlock_Metadata_Transactions_StreamArgs, type Subscription_RootCoin_ActivitiesArgs, type Subscription_RootCoin_Activities_AggregateArgs, type Subscription_RootCoin_Activities_By_PkArgs, type Subscription_RootCoin_Activities_StreamArgs, type Subscription_RootCoin_BalancesArgs, type Subscription_RootCoin_Balances_By_PkArgs, type Subscription_RootCoin_Balances_StreamArgs, type Subscription_RootCoin_InfosArgs, type Subscription_RootCoin_Infos_By_PkArgs, type Subscription_RootCoin_Infos_StreamArgs, type Subscription_RootCoin_SupplyArgs, type Subscription_RootCoin_Supply_By_PkArgs, type Subscription_RootCoin_Supply_StreamArgs, type Subscription_RootCollection_DatasArgs, type Subscription_RootCollection_Datas_By_PkArgs, type Subscription_RootCollection_Datas_StreamArgs, type Subscription_RootCurrent_Ans_LookupArgs, type Subscription_RootCurrent_Ans_Lookup_By_PkArgs, type Subscription_RootCurrent_Ans_Lookup_StreamArgs, type Subscription_RootCurrent_Ans_Lookup_V2Args, type Subscription_RootCurrent_Ans_Lookup_V2_By_PkArgs, type Subscription_RootCurrent_Ans_Lookup_V2_StreamArgs, type Subscription_RootCurrent_Aptos_NamesArgs, type Subscription_RootCurrent_Aptos_Names_AggregateArgs, type Subscription_RootCurrent_Aptos_Names_StreamArgs, type Subscription_RootCurrent_Coin_BalancesArgs, type Subscription_RootCurrent_Coin_Balances_By_PkArgs, type Subscription_RootCurrent_Coin_Balances_StreamArgs, type Subscription_RootCurrent_Collection_DatasArgs, type Subscription_RootCurrent_Collection_Datas_By_PkArgs, type Subscription_RootCurrent_Collection_Datas_StreamArgs, type Subscription_RootCurrent_Collection_Ownership_V2_ViewArgs, type Subscription_RootCurrent_Collection_Ownership_V2_View_AggregateArgs, type Subscription_RootCurrent_Collection_Ownership_V2_View_StreamArgs, type Subscription_RootCurrent_Collections_V2Args, type Subscription_RootCurrent_Collections_V2_By_PkArgs, type Subscription_RootCurrent_Collections_V2_StreamArgs, type Subscription_RootCurrent_Delegated_Staking_Pool_BalancesArgs, type Subscription_RootCurrent_Delegated_Staking_Pool_Balances_By_PkArgs, type Subscription_RootCurrent_Delegated_Staking_Pool_Balances_StreamArgs, type Subscription_RootCurrent_Delegated_VoterArgs, type Subscription_RootCurrent_Delegated_Voter_By_PkArgs, type Subscription_RootCurrent_Delegated_Voter_StreamArgs, type Subscription_RootCurrent_Delegator_BalancesArgs, type Subscription_RootCurrent_Delegator_Balances_By_PkArgs, type Subscription_RootCurrent_Delegator_Balances_StreamArgs, type Subscription_RootCurrent_Fungible_Asset_BalancesArgs, type Subscription_RootCurrent_Fungible_Asset_Balances_AggregateArgs, type Subscription_RootCurrent_Fungible_Asset_Balances_By_PkArgs, type Subscription_RootCurrent_Fungible_Asset_Balances_StreamArgs, type Subscription_RootCurrent_ObjectsArgs, type Subscription_RootCurrent_Objects_By_PkArgs, type Subscription_RootCurrent_Objects_StreamArgs, type Subscription_RootCurrent_Staking_Pool_VoterArgs, type Subscription_RootCurrent_Staking_Pool_Voter_By_PkArgs, type Subscription_RootCurrent_Staking_Pool_Voter_StreamArgs, type Subscription_RootCurrent_Table_ItemsArgs, type Subscription_RootCurrent_Table_Items_By_PkArgs, type Subscription_RootCurrent_Table_Items_StreamArgs, type Subscription_RootCurrent_Token_DatasArgs, type Subscription_RootCurrent_Token_Datas_By_PkArgs, type Subscription_RootCurrent_Token_Datas_StreamArgs, type Subscription_RootCurrent_Token_Datas_V2Args, type Subscription_RootCurrent_Token_Datas_V2_By_PkArgs, type Subscription_RootCurrent_Token_Datas_V2_StreamArgs, type Subscription_RootCurrent_Token_OwnershipsArgs, type Subscription_RootCurrent_Token_Ownerships_AggregateArgs, type Subscription_RootCurrent_Token_Ownerships_By_PkArgs, type Subscription_RootCurrent_Token_Ownerships_StreamArgs, type Subscription_RootCurrent_Token_Ownerships_V2Args, type Subscription_RootCurrent_Token_Ownerships_V2_AggregateArgs, type Subscription_RootCurrent_Token_Ownerships_V2_By_PkArgs, type Subscription_RootCurrent_Token_Ownerships_V2_StreamArgs, type Subscription_RootCurrent_Token_Pending_ClaimsArgs, type Subscription_RootCurrent_Token_Pending_Claims_By_PkArgs, type Subscription_RootCurrent_Token_Pending_Claims_StreamArgs, type Subscription_RootDelegated_Staking_ActivitiesArgs, type Subscription_RootDelegated_Staking_Activities_By_PkArgs, type Subscription_RootDelegated_Staking_Activities_StreamArgs, type Subscription_RootDelegated_Staking_PoolsArgs, type Subscription_RootDelegated_Staking_Pools_By_PkArgs, type Subscription_RootDelegated_Staking_Pools_StreamArgs, type Subscription_RootDelegator_Distinct_PoolArgs, type Subscription_RootDelegator_Distinct_Pool_AggregateArgs, type Subscription_RootDelegator_Distinct_Pool_StreamArgs, type Subscription_RootEventsArgs, type Subscription_RootEvents_By_PkArgs, type Subscription_RootEvents_StreamArgs, type Subscription_RootFungible_Asset_ActivitiesArgs, type Subscription_RootFungible_Asset_Activities_By_PkArgs, type Subscription_RootFungible_Asset_Activities_StreamArgs, type Subscription_RootFungible_Asset_MetadataArgs, type Subscription_RootFungible_Asset_Metadata_By_PkArgs, type Subscription_RootFungible_Asset_Metadata_StreamArgs, type Subscription_RootIndexer_StatusArgs, type Subscription_RootIndexer_Status_By_PkArgs, type Subscription_RootIndexer_Status_StreamArgs, type Subscription_RootLedger_InfosArgs, type Subscription_RootLedger_Infos_By_PkArgs, type Subscription_RootLedger_Infos_StreamArgs, type Subscription_RootMove_ResourcesArgs, type Subscription_RootMove_Resources_AggregateArgs, type Subscription_RootMove_Resources_StreamArgs, type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_AuctionsArgs, type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_Auctions_By_PkArgs, type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_Auctions_StreamArgs, type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_Collection_OffersArgs, type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_By_PkArgs, type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_StreamArgs, type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_ListingsArgs, type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_Listings_By_PkArgs, type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_Listings_StreamArgs, type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_Token_OffersArgs, type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_By_PkArgs, type Subscription_RootNft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_StreamArgs, type Subscription_RootNft_Marketplace_V2_Nft_Marketplace_ActivitiesArgs, type Subscription_RootNft_Marketplace_V2_Nft_Marketplace_Activities_By_PkArgs, type Subscription_RootNft_Marketplace_V2_Nft_Marketplace_Activities_StreamArgs, type Subscription_RootNft_Metadata_Crawler_Parsed_Asset_UrisArgs, type Subscription_RootNft_Metadata_Crawler_Parsed_Asset_Uris_By_PkArgs, type Subscription_RootNft_Metadata_Crawler_Parsed_Asset_Uris_StreamArgs, type Subscription_RootNum_Active_Delegator_Per_PoolArgs, type Subscription_RootNum_Active_Delegator_Per_Pool_StreamArgs, type Subscription_RootProcessor_StatusArgs, type Subscription_RootProcessor_Status_By_PkArgs, type Subscription_RootProcessor_Status_StreamArgs, type Subscription_RootProposal_VotesArgs, type Subscription_RootProposal_Votes_AggregateArgs, type Subscription_RootProposal_Votes_By_PkArgs, type Subscription_RootProposal_Votes_StreamArgs, type Subscription_RootTable_ItemsArgs, type Subscription_RootTable_Items_By_PkArgs, type Subscription_RootTable_Items_StreamArgs, type Subscription_RootTable_MetadatasArgs, type Subscription_RootTable_Metadatas_By_PkArgs, type Subscription_RootTable_Metadatas_StreamArgs, type Subscription_RootToken_ActivitiesArgs, type Subscription_RootToken_Activities_AggregateArgs, type Subscription_RootToken_Activities_By_PkArgs, type Subscription_RootToken_Activities_StreamArgs, type Subscription_RootToken_Activities_V2Args, type Subscription_RootToken_Activities_V2_AggregateArgs, type Subscription_RootToken_Activities_V2_By_PkArgs, type Subscription_RootToken_Activities_V2_StreamArgs, type Subscription_RootToken_DatasArgs, type Subscription_RootToken_Datas_By_PkArgs, type Subscription_RootToken_Datas_StreamArgs, type Subscription_RootToken_OwnershipsArgs, type Subscription_RootToken_Ownerships_By_PkArgs, type Subscription_RootToken_Ownerships_StreamArgs, type Subscription_RootTokensArgs, type Subscription_RootTokens_By_PkArgs, type Subscription_RootTokens_StreamArgs, type Subscription_RootUser_TransactionsArgs, type Subscription_RootUser_Transactions_By_PkArgs, type Subscription_RootUser_Transactions_StreamArgs, TRANSFER_COINS, type Table_Items, type Table_ItemsDecoded_KeyArgs, type Table_ItemsDecoded_ValueArgs, type Table_Items_Bool_Exp, type Table_Items_Order_By, Table_Items_Select_Column, type Table_Items_Stream_Cursor_Input, type Table_Items_Stream_Cursor_Value_Input, type Table_Metadatas, type Table_Metadatas_Bool_Exp, type Table_Metadatas_Order_By, Table_Metadatas_Select_Column, type Table_Metadatas_Stream_Cursor_Input, type Table_Metadatas_Stream_Cursor_Value_Input, type Timestamp_Comparison_Exp, type Timestamptz_Comparison_Exp, TokenClient, type TokenStandard, token_types as TokenTypes, type Token_Activities, type Token_ActivitiesAptos_Names_OwnerArgs, type Token_ActivitiesAptos_Names_Owner_AggregateArgs, type Token_ActivitiesAptos_Names_ToArgs, type Token_ActivitiesAptos_Names_To_AggregateArgs, type Token_Activities_Aggregate, type Token_Activities_Aggregate_Fields, type Token_Activities_Aggregate_FieldsCountArgs, type Token_Activities_Aggregate_Order_By, type Token_Activities_Avg_Fields, type Token_Activities_Avg_Order_By, type Token_Activities_Bool_Exp, type Token_Activities_Max_Fields, type Token_Activities_Max_Order_By, type Token_Activities_Min_Fields, type Token_Activities_Min_Order_By, type Token_Activities_Order_By, Token_Activities_Select_Column, type Token_Activities_Stddev_Fields, type Token_Activities_Stddev_Order_By, type Token_Activities_Stddev_Pop_Fields, type Token_Activities_Stddev_Pop_Order_By, type Token_Activities_Stddev_Samp_Fields, type Token_Activities_Stddev_Samp_Order_By, type Token_Activities_Stream_Cursor_Input, type Token_Activities_Stream_Cursor_Value_Input, type Token_Activities_Sum_Fields, type Token_Activities_Sum_Order_By, type Token_Activities_V2, type Token_Activities_V2Aptos_Names_FromArgs, type Token_Activities_V2Aptos_Names_From_AggregateArgs, type Token_Activities_V2Aptos_Names_ToArgs, type Token_Activities_V2Aptos_Names_To_AggregateArgs, type Token_Activities_V2_Aggregate, type Token_Activities_V2_Aggregate_Fields, type Token_Activities_V2_Aggregate_FieldsCountArgs, type Token_Activities_V2_Aggregate_Order_By, type Token_Activities_V2_Avg_Fields, type Token_Activities_V2_Avg_Order_By, type Token_Activities_V2_Bool_Exp, type Token_Activities_V2_Max_Fields, type Token_Activities_V2_Max_Order_By, type Token_Activities_V2_Min_Fields, type Token_Activities_V2_Min_Order_By, type Token_Activities_V2_Order_By, Token_Activities_V2_Select_Column, type Token_Activities_V2_Stddev_Fields, type Token_Activities_V2_Stddev_Order_By, type Token_Activities_V2_Stddev_Pop_Fields, type Token_Activities_V2_Stddev_Pop_Order_By, type Token_Activities_V2_Stddev_Samp_Fields, type Token_Activities_V2_Stddev_Samp_Order_By, type Token_Activities_V2_Stream_Cursor_Input, type Token_Activities_V2_Stream_Cursor_Value_Input, type Token_Activities_V2_Sum_Fields, type Token_Activities_V2_Sum_Order_By, type Token_Activities_V2_Var_Pop_Fields, type Token_Activities_V2_Var_Pop_Order_By, type Token_Activities_V2_Var_Samp_Fields, type Token_Activities_V2_Var_Samp_Order_By, type Token_Activities_V2_Variance_Fields, type Token_Activities_V2_Variance_Order_By, type Token_Activities_Var_Pop_Fields, type Token_Activities_Var_Pop_Order_By, type Token_Activities_Var_Samp_Fields, type Token_Activities_Var_Samp_Order_By, type Token_Activities_Variance_Fields, type Token_Activities_Variance_Order_By, type Token_Datas, type Token_DatasDefault_PropertiesArgs, type Token_Datas_Bool_Exp, type Token_Datas_Order_By, Token_Datas_Select_Column, type Token_Datas_Stream_Cursor_Input, type Token_Datas_Stream_Cursor_Value_Input, type Token_Ownerships, type Token_Ownerships_Bool_Exp, type Token_Ownerships_Order_By, Token_Ownerships_Select_Column, type Token_Ownerships_Stream_Cursor_Input, type Token_Ownerships_Stream_Cursor_Value_Input, type Tokens, type TokensToken_PropertiesArgs, type Tokens_Bool_Exp, type Tokens_Order_By, Tokens_Select_Column, type Tokens_Stream_Cursor_Input, type Tokens_Stream_Cursor_Value_Input, TransactionBuilder, TransactionBuilderABI, TransactionBuilderEd25519, TransactionBuilderMultiEd25519, TransactionBuilderRemoteABI, TransactionWorker, TransactionWorkerEvents, index as TxnBuilderTypes, TypeTagParser, index$1 as Types, type User_Transactions, type User_Transactions_Bool_Exp, type User_Transactions_Order_By, User_Transactions_Select_Column, type User_Transactions_Stream_Cursor_Input, type User_Transactions_Stream_Cursor_Value_Input, WaitForTransactionError, ansContractsMap, aptosRequest, argToTransactionArgument, derivePath, deserializePropertyMap, deserializeValueBasedOnTypeTag, ensureBigInt, ensureBoolean, ensureNumber, get, getAddressFromAccountOrAddress, getMasterKeyFromSeed, getPropertyType, getPropertyValueRaw, getPublicKey, getSinglePropertyValueRaw, isValidPath, nameComponentPattern, namePattern, post, serializeArg };
