var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};

// src/account/aptos_account.ts
import nacl2 from "tweetnacl";
import * as bip39 from "@scure/bip39";
import { bytesToHex as bytesToHex2 } from "@noble/hashes/utils";
import { sha256 } from "@noble/hashes/sha256";
import { sha3_256 as sha3Hash3 } from "@noble/hashes/sha3";

// src/utils/hd-key.ts
import nacl from "tweetnacl";
import { hmac } from "@noble/hashes/hmac";
import { sha512 } from "@noble/hashes/sha512";
import { hexToBytes } from "@noble/hashes/utils";
var pathRegex = /^m(\/[0-9]+')+$/;
var replaceDerive = (val) => val.replace("'", "");
var HMAC_KEY = "ed25519 seed";
var HARDENED_OFFSET = 2147483648;
var getMasterKeyFromSeed = (seed) => {
  const h = hmac.create(sha512, HMAC_KEY);
  const I = h.update(hexToBytes(seed)).digest();
  const IL = I.slice(0, 32);
  const IR = I.slice(32);
  return {
    key: IL,
    chainCode: IR
  };
};
var CKDPriv = ({ key, chainCode }, index) => {
  const buffer = new ArrayBuffer(4);
  new DataView(buffer).setUint32(0, index);
  const indexBytes = new Uint8Array(buffer);
  const zero = new Uint8Array([0]);
  const data = new Uint8Array([...zero, ...key, ...indexBytes]);
  const I = hmac.create(sha512, chainCode).update(data).digest();
  const IL = I.slice(0, 32);
  const IR = I.slice(32);
  return {
    key: IL,
    chainCode: IR
  };
};
var getPublicKey = (privateKey, withZeroByte = true) => {
  const keyPair = nacl.sign.keyPair.fromSeed(privateKey);
  const signPk = keyPair.secretKey.subarray(32);
  const zero = new Uint8Array([0]);
  return withZeroByte ? new Uint8Array([...zero, ...signPk]) : signPk;
};
var isValidPath = (path) => {
  if (!pathRegex.test(path)) {
    return false;
  }
  return !path.split("/").slice(1).map(replaceDerive).some(Number.isNaN);
};
var derivePath = (path, seed, offset = HARDENED_OFFSET) => {
  if (!isValidPath(path)) {
    throw new Error("Invalid derivation path");
  }
  const { key, chainCode } = getMasterKeyFromSeed(seed);
  const segments = path.split("/").slice(1).map(replaceDerive).map((el) => parseInt(el, 10));
  return segments.reduce((parentKeys, segment) => CKDPriv(parentKeys, segment + offset), { key, chainCode });
};

// src/version.ts
var VERSION = "1.21.0";

// src/utils/misc.ts
async function sleep(timeMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeMs);
  });
}
var DEFAULT_VERSION_PATH_BASE = "/v1";
function fixNodeUrl(nodeUrl) {
  let out = `${nodeUrl}`;
  if (out.endsWith("/")) {
    out = out.substring(0, out.length - 1);
  }
  if (!out.endsWith(DEFAULT_VERSION_PATH_BASE)) {
    out = `${out}${DEFAULT_VERSION_PATH_BASE}`;
  }
  return out;
}
var DEFAULT_MAX_GAS_AMOUNT = 2e5;
var DEFAULT_TXN_EXP_SEC_FROM_NOW = 20;
var DEFAULT_TXN_TIMEOUT_SEC = 20;
var APTOS_COIN = "0x1::aptos_coin::AptosCoin";
var CUSTOM_REQUEST_HEADER = { "x-aptos-client": `aptos-ts-sdk/${VERSION}` };

// src/utils/memoize-decorator.ts
function Memoize(args) {
  let hashFunction;
  let ttlMs;
  let tags;
  if (typeof args === "object") {
    hashFunction = args.hashFunction;
    ttlMs = args.ttlMs;
    tags = args.tags;
  } else {
    hashFunction = args;
  }
  return (target, propertyKey, descriptor) => {
    if (descriptor.value != null) {
      descriptor.value = getNewFunction(descriptor.value, hashFunction, ttlMs, tags);
    } else if (descriptor.get != null) {
      descriptor.get = getNewFunction(descriptor.get, hashFunction, ttlMs, tags);
    } else {
      throw new Error("Only put a Memoize() decorator on a method or get accessor.");
    }
  };
}
function MemoizeExpiring(ttlMs, hashFunction) {
  return Memoize({
    ttlMs,
    hashFunction
  });
}
var clearCacheTagsMap = /* @__PURE__ */ new Map();
function clear(tags) {
  const cleared = /* @__PURE__ */ new Set();
  for (const tag of tags) {
    const maps = clearCacheTagsMap.get(tag);
    if (maps) {
      for (const mp of maps) {
        if (!cleared.has(mp)) {
          mp.clear();
          cleared.add(mp);
        }
      }
    }
  }
  return cleared.size;
}
function getNewFunction(originalMethod, hashFunction, ttlMs = 0, tags) {
  const propMapName = Symbol("__memoized_map__");
  return function(...args) {
    let returnedValue;
    const that = this;
    if (!that.hasOwnProperty(propMapName)) {
      Object.defineProperty(that, propMapName, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: /* @__PURE__ */ new Map()
      });
    }
    const myMap = that[propMapName];
    if (Array.isArray(tags)) {
      for (const tag of tags) {
        if (clearCacheTagsMap.has(tag)) {
          clearCacheTagsMap.get(tag).push(myMap);
        } else {
          clearCacheTagsMap.set(tag, [myMap]);
        }
      }
    }
    if (hashFunction || args.length > 0 || ttlMs > 0) {
      let hashKey;
      if (hashFunction === true) {
        hashKey = args.map((a) => a.toString()).join("!");
      } else if (hashFunction) {
        hashKey = hashFunction.apply(that, args);
      } else {
        hashKey = args[0];
      }
      const timestampKey = `${hashKey}__timestamp`;
      let isExpired = false;
      if (ttlMs > 0) {
        if (!myMap.has(timestampKey)) {
          isExpired = true;
        } else {
          const timestamp = myMap.get(timestampKey);
          isExpired = Date.now() - timestamp > ttlMs;
        }
      }
      if (myMap.has(hashKey) && !isExpired) {
        returnedValue = myMap.get(hashKey);
      } else {
        returnedValue = originalMethod.apply(that, args);
        myMap.set(hashKey, returnedValue);
        if (ttlMs > 0) {
          myMap.set(timestampKey, Date.now());
        }
      }
    } else {
      const hashKey = that;
      if (myMap.has(hashKey)) {
        returnedValue = myMap.get(hashKey);
      } else {
        returnedValue = originalMethod.apply(that, args);
        myMap.set(hashKey, returnedValue);
      }
    }
    return returnedValue;
  };
}

// src/client/core.ts
import aptosClient from "@aptos-labs/aptos-client";

// src/client/types.ts
var AptosApiError = class extends Error {
  constructor(request2, response, message) {
    super(message);
    this.name = "AptosApiError";
    this.url = response.url;
    this.status = response.status;
    this.statusText = response.statusText;
    this.data = response.data;
    this.request = request2;
  }
};

// src/client/core.ts
var errors = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  429: "Too Many Requests",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable"
};
async function request(url, method, body, contentType, params, overrides) {
  const headers = {
    ...overrides == null ? void 0 : overrides.HEADERS,
    "x-aptos-client": `aptos-ts-sdk/${VERSION}`,
    "content-type": contentType != null ? contentType : "application/json"
  };
  if (overrides == null ? void 0 : overrides.TOKEN) {
    headers.Authorization = `Bearer ${overrides == null ? void 0 : overrides.TOKEN}`;
  }
  const response = await aptosClient({ url, method, body, params, headers, overrides });
  return response;
}
async function aptosRequest(options) {
  const { url, endpoint, method, body, contentType, params, overrides } = options;
  const fullEndpoint = `${url}/${endpoint != null ? endpoint : ""}`;
  const response = await request(fullEndpoint, method, body, contentType, params, overrides);
  const result = {
    status: response.status,
    statusText: response.statusText,
    data: response.data,
    headers: response.headers,
    config: response.config,
    url: fullEndpoint
  };
  if (result.status >= 200 && result.status < 300) {
    return result;
  }
  const errorMessage = errors[result.status];
  throw new AptosApiError(options, result, errorMessage != null ? errorMessage : "Generic Error");
}

// src/client/get.ts
async function get(options) {
  const response = await aptosRequest({ ...options, method: "GET" });
  return response;
}

// src/client/post.ts
async function post(options) {
  const response = await aptosRequest({ ...options, method: "POST" });
  return response;
}

// src/utils/pagination_helpers.ts
async function paginateWithCursor(options) {
  const out = [];
  let cursor;
  const requestParams = options.params;
  while (true) {
    requestParams.start = cursor;
    const response = await get({
      url: options.url,
      endpoint: options.endpoint,
      params: requestParams,
      originMethod: options.originMethod,
      overrides: options.overrides
    });
    cursor = response.headers["x-aptos-cursor"];
    delete response.headers;
    out.push(...response.data);
    if (cursor === null || cursor === void 0) {
      break;
    }
  }
  return out;
}

// src/utils/api-endpoints.ts
var NetworkToIndexerAPI = {
  mainnet: "https://indexer.mainnet.aptoslabs.com/v1/graphql",
  testnet: "https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql",
  devnet: "https://indexer-devnet.staging.gcp.aptosdev.com/v1/graphql",
  local: "http://127.0.0.1:8090/v1/graphql"
};
var NetworkToNodeAPI = {
  mainnet: "https://fullnode.mainnet.aptoslabs.com/v1",
  testnet: "https://fullnode.testnet.aptoslabs.com/v1",
  devnet: "https://fullnode.devnet.aptoslabs.com/v1",
  local: "http://127.0.0.1:8080/v1"
};
var NodeAPIToNetwork = {
  "https://fullnode.mainnet.aptoslabs.com/v1": "mainnet",
  "https://fullnode.testnet.aptoslabs.com/v1": "testnet",
  "https://fullnode.devnet.aptoslabs.com/v1": "devnet",
  "http://127.0.0.1:8080/v1": "local"
};
var Network = /* @__PURE__ */ ((Network3) => {
  Network3["MAINNET"] = "mainnet";
  Network3["TESTNET"] = "testnet";
  Network3["DEVNET"] = "devnet";
  Network3["LOCAL"] = "local";
  return Network3;
})(Network || {});

// src/utils/hex_string.ts
import { bytesToHex, hexToBytes as hexToBytes2 } from "@noble/hashes/utils";
var HexString = class _HexString {
  /**
   * Creates new hex string from Buffer
   * @param buffer A buffer to convert
   * @returns New HexString
   */
  static fromBuffer(buffer) {
    return _HexString.fromUint8Array(buffer);
  }
  /**
   * Creates new hex string from Uint8Array
   * @param arr Uint8Array to convert
   * @returns New HexString
   */
  static fromUint8Array(arr) {
    return new _HexString(bytesToHex(arr));
  }
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
  static ensure(hexString) {
    if (typeof hexString === "string") {
      return new _HexString(hexString);
    }
    return hexString;
  }
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
  constructor(hexString) {
    if (hexString.startsWith("0x")) {
      this.hexString = hexString;
    } else {
      this.hexString = `0x${hexString}`;
    }
  }
  /**
   * Getter for inner hexString
   * @returns Inner hex string
   */
  hex() {
    return this.hexString;
  }
  /**
   * Getter for inner hexString without prefix
   * @returns Inner hex string without prefix
   * @example
   * ```
   *  const hexString = new HexString("string"); // "0xstring"
   *  hexString.noPrefix(); // "string"
   * ```
   */
  noPrefix() {
    return this.hexString.slice(2);
  }
  /**
   * Overrides default `toString` method
   * @returns Inner hex string
   */
  toString() {
    return this.hex();
  }
  /**
   * Trimmes extra zeroes in the begining of a string
   * @returns Inner hexString without leading zeroes
   * @example
   * ```
   *  new HexString("0x000000string").toShortString(); // result = "0xstring"
   * ```
   */
  toShortString() {
    const trimmed = this.hexString.replace(/^0x0*/, "");
    return `0x${trimmed}`;
  }
  /**
   * Converts hex string to a Uint8Array
   * @returns Uint8Array from inner hexString without prefix
   */
  toUint8Array() {
    return Uint8Array.from(hexToBytes2(this.noPrefix()));
  }
};

// src/aptos_types/index.ts
var aptos_types_exports = {};
__export(aptos_types_exports, {
  AccountAddress: () => AccountAddress,
  AccountAuthenticator: () => AccountAuthenticator,
  AccountAuthenticatorEd25519: () => AccountAuthenticatorEd25519,
  AccountAuthenticatorMultiEd25519: () => AccountAuthenticatorMultiEd25519,
  ArgumentABI: () => ArgumentABI,
  AuthenticationKey: () => AuthenticationKey,
  ChainId: () => ChainId,
  ChangeSet: () => ChangeSet,
  Ed25519PublicKey: () => Ed25519PublicKey,
  Ed25519Signature: () => Ed25519Signature,
  EntryFunction: () => EntryFunction,
  EntryFunctionABI: () => EntryFunctionABI,
  FeePayerRawTransaction: () => FeePayerRawTransaction,
  Identifier: () => Identifier,
  Module: () => Module,
  ModuleId: () => ModuleId,
  MultiAgentRawTransaction: () => MultiAgentRawTransaction,
  MultiEd25519PublicKey: () => MultiEd25519PublicKey,
  MultiEd25519Signature: () => MultiEd25519Signature,
  MultiSig: () => MultiSig,
  MultiSigTransactionPayload: () => MultiSigTransactionPayload,
  RawTransaction: () => RawTransaction,
  RawTransactionWithData: () => RawTransactionWithData,
  RotationProofChallenge: () => RotationProofChallenge,
  Script: () => Script,
  ScriptABI: () => ScriptABI,
  SignedTransaction: () => SignedTransaction,
  StructTag: () => StructTag,
  Transaction: () => Transaction,
  TransactionArgument: () => TransactionArgument,
  TransactionArgumentAddress: () => TransactionArgumentAddress,
  TransactionArgumentBool: () => TransactionArgumentBool,
  TransactionArgumentU128: () => TransactionArgumentU128,
  TransactionArgumentU16: () => TransactionArgumentU16,
  TransactionArgumentU256: () => TransactionArgumentU256,
  TransactionArgumentU32: () => TransactionArgumentU32,
  TransactionArgumentU64: () => TransactionArgumentU64,
  TransactionArgumentU8: () => TransactionArgumentU8,
  TransactionArgumentU8Vector: () => TransactionArgumentU8Vector,
  TransactionAuthenticator: () => TransactionAuthenticator,
  TransactionAuthenticatorEd25519: () => TransactionAuthenticatorEd25519,
  TransactionAuthenticatorFeePayer: () => TransactionAuthenticatorFeePayer,
  TransactionAuthenticatorMultiAgent: () => TransactionAuthenticatorMultiAgent,
  TransactionAuthenticatorMultiEd25519: () => TransactionAuthenticatorMultiEd25519,
  TransactionPayload: () => TransactionPayload,
  TransactionPayloadEntryFunction: () => TransactionPayloadEntryFunction,
  TransactionPayloadMultisig: () => TransactionPayloadMultisig,
  TransactionPayloadScript: () => TransactionPayloadScript,
  TransactionScriptABI: () => TransactionScriptABI,
  TypeArgumentABI: () => TypeArgumentABI,
  TypeTag: () => TypeTag,
  TypeTagAddress: () => TypeTagAddress,
  TypeTagBool: () => TypeTagBool,
  TypeTagParser: () => TypeTagParser,
  TypeTagParserError: () => TypeTagParserError,
  TypeTagSigner: () => TypeTagSigner,
  TypeTagStruct: () => TypeTagStruct,
  TypeTagU128: () => TypeTagU128,
  TypeTagU16: () => TypeTagU16,
  TypeTagU256: () => TypeTagU256,
  TypeTagU32: () => TypeTagU32,
  TypeTagU64: () => TypeTagU64,
  TypeTagU8: () => TypeTagU8,
  TypeTagVector: () => TypeTagVector,
  UserTransaction: () => UserTransaction,
  WriteSet: () => WriteSet,
  objectStructTag: () => objectStructTag,
  optionStructTag: () => optionStructTag,
  stringStructTag: () => stringStructTag
});

// src/bcs/index.ts
var bcs_exports = {};
__export(bcs_exports, {
  Deserializer: () => Deserializer,
  Serializer: () => Serializer,
  bcsSerializeBool: () => bcsSerializeBool,
  bcsSerializeBytes: () => bcsSerializeBytes,
  bcsSerializeFixedBytes: () => bcsSerializeFixedBytes,
  bcsSerializeStr: () => bcsSerializeStr,
  bcsSerializeU128: () => bcsSerializeU128,
  bcsSerializeU16: () => bcsSerializeU16,
  bcsSerializeU256: () => bcsSerializeU256,
  bcsSerializeU32: () => bcsSerializeU32,
  bcsSerializeU8: () => bcsSerializeU8,
  bcsSerializeUint64: () => bcsSerializeUint64,
  bcsToBytes: () => bcsToBytes,
  deserializeVector: () => deserializeVector,
  serializeVector: () => serializeVector,
  serializeVectorWithFunc: () => serializeVectorWithFunc
});

// src/bcs/consts.ts
var MAX_U8_NUMBER = 2 ** 8 - 1;
var MAX_U16_NUMBER = 2 ** 16 - 1;
var MAX_U32_NUMBER = 2 ** 32 - 1;
var MAX_U64_BIG_INT = BigInt(2 ** 64) - BigInt(1);
var MAX_U128_BIG_INT = BigInt(2 ** 128) - BigInt(1);
var MAX_U256_BIG_INT = BigInt(2 ** 256) - BigInt(1);

// src/bcs/serializer.ts
var Serializer = class {
  constructor() {
    this.buffer = new ArrayBuffer(64);
    this.offset = 0;
  }
  ensureBufferWillHandleSize(bytes) {
    while (this.buffer.byteLength < this.offset + bytes) {
      const newBuffer = new ArrayBuffer(this.buffer.byteLength * 2);
      new Uint8Array(newBuffer).set(new Uint8Array(this.buffer));
      this.buffer = newBuffer;
    }
  }
  serialize(values) {
    this.ensureBufferWillHandleSize(values.length);
    new Uint8Array(this.buffer, this.offset).set(values);
    this.offset += values.length;
  }
  serializeWithFunction(fn, bytesLength, value) {
    this.ensureBufferWillHandleSize(bytesLength);
    const dv = new DataView(this.buffer, this.offset);
    fn.apply(dv, [0, value, true]);
    this.offset += bytesLength;
  }
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
  serializeStr(value) {
    const textEncoder = new TextEncoder();
    this.serializeBytes(textEncoder.encode(value));
  }
  /**
   * Serializes an array of bytes.
   *
   * BCS layout for "bytes": bytes_length | bytes. bytes_length is the length of the bytes array that is
   * uleb128 encoded. bytes_length is a u32 integer.
   */
  serializeBytes(value) {
    this.serializeU32AsUleb128(value.length);
    this.serialize(value);
  }
  /**
   * Serializes an array of bytes with known length. Therefore length doesn't need to be
   * serialized to help deserialization.  When deserializing, the number of
   * bytes to deserialize needs to be passed in.
   */
  serializeFixedBytes(value) {
    this.serialize(value);
  }
  /**
   * Serializes a boolean value.
   *
   * BCS layout for "boolean": One byte. "0x01" for True and "0x00" for False.
   */
  serializeBool(value) {
    if (typeof value !== "boolean") {
      throw new Error("Value needs to be a boolean");
    }
    const byteValue = value ? 1 : 0;
    this.serialize(new Uint8Array([byteValue]));
  }
  serializeU8(value) {
    this.serialize(new Uint8Array([value]));
  }
  serializeU16(value) {
    this.serializeWithFunction(DataView.prototype.setUint16, 2, value);
  }
  serializeU32(value) {
    this.serializeWithFunction(DataView.prototype.setUint32, 4, value);
  }
  serializeU64(value) {
    const low = BigInt(value.toString()) & BigInt(MAX_U32_NUMBER);
    const high = BigInt(value.toString()) >> BigInt(32);
    this.serializeU32(Number(low));
    this.serializeU32(Number(high));
  }
  serializeU128(value) {
    const low = BigInt(value.toString()) & MAX_U64_BIG_INT;
    const high = BigInt(value.toString()) >> BigInt(64);
    this.serializeU64(low);
    this.serializeU64(high);
  }
  serializeU256(value) {
    const low = BigInt(value.toString()) & MAX_U128_BIG_INT;
    const high = BigInt(value.toString()) >> BigInt(128);
    this.serializeU128(low);
    this.serializeU128(high);
  }
  serializeU32AsUleb128(val) {
    let value = val;
    const valueArray = [];
    while (value >>> 7 !== 0) {
      valueArray.push(value & 127 | 128);
      value >>>= 7;
    }
    valueArray.push(value);
    this.serialize(new Uint8Array(valueArray));
  }
  /**
   * Returns the buffered bytes
   */
  getBytes() {
    return new Uint8Array(this.buffer).slice(0, this.offset);
  }
};
__decorateClass([
  checkNumberRange(0, MAX_U8_NUMBER)
], Serializer.prototype, "serializeU8", 1);
__decorateClass([
  checkNumberRange(0, MAX_U16_NUMBER)
], Serializer.prototype, "serializeU16", 1);
__decorateClass([
  checkNumberRange(0, MAX_U32_NUMBER)
], Serializer.prototype, "serializeU32", 1);
__decorateClass([
  checkNumberRange(BigInt(0), MAX_U64_BIG_INT)
], Serializer.prototype, "serializeU64", 1);
__decorateClass([
  checkNumberRange(BigInt(0), MAX_U128_BIG_INT)
], Serializer.prototype, "serializeU128", 1);
__decorateClass([
  checkNumberRange(BigInt(0), MAX_U256_BIG_INT)
], Serializer.prototype, "serializeU256", 1);
__decorateClass([
  checkNumberRange(0, MAX_U32_NUMBER)
], Serializer.prototype, "serializeU32AsUleb128", 1);
function checkNumberRange(minValue, maxValue, message) {
  return (target, propertyKey, descriptor) => {
    const childFunction = descriptor.value;
    descriptor.value = function deco(value) {
      const valueBigInt = BigInt(value.toString());
      if (valueBigInt > BigInt(maxValue.toString()) || valueBigInt < BigInt(minValue.toString())) {
        throw new Error(message || "Value is out of range");
      }
      childFunction.apply(this, [value]);
    };
    return descriptor;
  };
}

// src/bcs/deserializer.ts
var Deserializer = class {
  constructor(data) {
    this.buffer = new ArrayBuffer(data.length);
    new Uint8Array(this.buffer).set(data, 0);
    this.offset = 0;
  }
  read(length) {
    if (this.offset + length > this.buffer.byteLength) {
      throw new Error("Reached to the end of buffer");
    }
    const bytes = this.buffer.slice(this.offset, this.offset + length);
    this.offset += length;
    return bytes;
  }
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
  deserializeStr() {
    const value = this.deserializeBytes();
    const textDecoder = new TextDecoder();
    return textDecoder.decode(value);
  }
  /**
   * Deserializes an array of bytes.
   *
   * BCS layout for "bytes": bytes_length | bytes. bytes_length is the length of the bytes array that is
   * uleb128 encoded. bytes_length is a u32 integer.
   */
  deserializeBytes() {
    const len = this.deserializeUleb128AsU32();
    return new Uint8Array(this.read(len));
  }
  /**
   * Deserializes an array of bytes. The number of bytes to read is already known.
   *
   */
  deserializeFixedBytes(len) {
    return new Uint8Array(this.read(len));
  }
  /**
   * Deserializes a boolean value.
   *
   * BCS layout for "boolean": One byte. "0x01" for True and "0x00" for False.
   */
  deserializeBool() {
    const bool = new Uint8Array(this.read(1))[0];
    if (bool !== 1 && bool !== 0) {
      throw new Error("Invalid boolean value");
    }
    return bool === 1;
  }
  /**
   * Deserializes a uint8 number.
   *
   * BCS layout for "uint8": One byte. Binary format in little-endian representation.
   */
  deserializeU8() {
    return new DataView(this.read(1)).getUint8(0);
  }
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
  deserializeU16() {
    return new DataView(this.read(2)).getUint16(0, true);
  }
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
  deserializeU32() {
    return new DataView(this.read(4)).getUint32(0, true);
  }
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
  deserializeU64() {
    const low = this.deserializeU32();
    const high = this.deserializeU32();
    return BigInt(BigInt(high) << BigInt(32) | BigInt(low));
  }
  /**
   * Deserializes a uint128 number.
   *
   * BCS layout for "uint128": Sixteen bytes. Binary format in little-endian representation.
   */
  deserializeU128() {
    const low = this.deserializeU64();
    const high = this.deserializeU64();
    return BigInt(high << BigInt(64) | low);
  }
  /**
   * Deserializes a uint256 number.
   *
   * BCS layout for "uint256": Thirty-two bytes. Binary format in little-endian representation.
   */
  deserializeU256() {
    const low = this.deserializeU128();
    const high = this.deserializeU128();
    return BigInt(high << BigInt(128) | low);
  }
  /**
   * Deserializes a uleb128 encoded uint32 number.
   *
   * BCS use uleb128 encoding in two cases: (1) lengths of variable-length sequences and (2) tags of enum values
   */
  deserializeUleb128AsU32() {
    let value = BigInt(0);
    let shift = 0;
    while (value < MAX_U32_NUMBER) {
      const byte = this.deserializeU8();
      value |= BigInt(byte & 127) << BigInt(shift);
      if ((byte & 128) === 0) {
        break;
      }
      shift += 7;
    }
    if (value > MAX_U32_NUMBER) {
      throw new Error("Overflow while parsing uleb128-encoded uint32 value");
    }
    return Number(value);
  }
};

// src/bcs/helper.ts
function serializeVector(value, serializer) {
  serializer.serializeU32AsUleb128(value.length);
  value.forEach((item) => {
    item.serialize(serializer);
  });
}
function serializeVectorWithFunc(value, func) {
  const serializer = new Serializer();
  serializer.serializeU32AsUleb128(value.length);
  const f = serializer[func];
  value.forEach((item) => {
    f.call(serializer, item);
  });
  return serializer.getBytes();
}
function deserializeVector(deserializer, cls) {
  const length = deserializer.deserializeUleb128AsU32();
  const list = [];
  for (let i = 0; i < length; i += 1) {
    list.push(cls.deserialize(deserializer));
  }
  return list;
}
function bcsToBytes(value) {
  const serializer = new Serializer();
  value.serialize(serializer);
  return serializer.getBytes();
}
function bcsSerializeUint64(value) {
  const serializer = new Serializer();
  serializer.serializeU64(value);
  return serializer.getBytes();
}
function bcsSerializeU8(value) {
  const serializer = new Serializer();
  serializer.serializeU8(value);
  return serializer.getBytes();
}
function bcsSerializeU16(value) {
  const serializer = new Serializer();
  serializer.serializeU16(value);
  return serializer.getBytes();
}
function bcsSerializeU32(value) {
  const serializer = new Serializer();
  serializer.serializeU32(value);
  return serializer.getBytes();
}
function bcsSerializeU128(value) {
  const serializer = new Serializer();
  serializer.serializeU128(value);
  return serializer.getBytes();
}
function bcsSerializeU256(value) {
  const serializer = new Serializer();
  serializer.serializeU256(value);
  return serializer.getBytes();
}
function bcsSerializeBool(value) {
  const serializer = new Serializer();
  serializer.serializeBool(value);
  return serializer.getBytes();
}
function bcsSerializeStr(value) {
  const serializer = new Serializer();
  serializer.serializeStr(value);
  return serializer.getBytes();
}
function bcsSerializeBytes(value) {
  const serializer = new Serializer();
  serializer.serializeBytes(value);
  return serializer.getBytes();
}
function bcsSerializeFixedBytes(value) {
  const serializer = new Serializer();
  serializer.serializeFixedBytes(value);
  return serializer.getBytes();
}

// src/aptos_types/transaction.ts
import { sha3_256 as sha3Hash } from "@noble/hashes/sha3";

// src/aptos_types/account_address.ts
var _AccountAddress = class _AccountAddress {
  constructor(address) {
    if (address.length !== _AccountAddress.LENGTH) {
      throw new Error("Expected address of length 32");
    }
    this.address = address;
  }
  /**
   * Creates AccountAddress from a hex string.
   * @param addr Hex string can be with a prefix or without a prefix,
   *   e.g. '0x1aa' or '1aa'. Hex string will be left padded with 0s if too short.
   */
  static fromHex(addr) {
    let address = HexString.ensure(addr);
    if (address.noPrefix().length % 2 !== 0) {
      address = new HexString(`0${address.noPrefix()}`);
    }
    const addressBytes = address.toUint8Array();
    if (addressBytes.length > _AccountAddress.LENGTH) {
      throw new Error("Hex string is too long. Address's length is 32 bytes.");
    } else if (addressBytes.length === _AccountAddress.LENGTH) {
      return new _AccountAddress(addressBytes);
    }
    const res = new Uint8Array(_AccountAddress.LENGTH);
    res.set(addressBytes, _AccountAddress.LENGTH - addressBytes.length);
    return new _AccountAddress(res);
  }
  /**
   * Checks if the string is a valid AccountAddress
   * @param addr Hex string can be with a prefix or without a prefix,
   *   e.g. '0x1aa' or '1aa'. Hex string will be left padded with 0s if too short.
   */
  static isValid(addr) {
    if (addr === "") {
      return false;
    }
    let address = HexString.ensure(addr);
    if (address.noPrefix().length % 2 !== 0) {
      address = new HexString(`0${address.noPrefix()}`);
    }
    const addressBytes = address.toUint8Array();
    return addressBytes.length <= _AccountAddress.LENGTH;
  }
  /**
   * Return a hex string from account Address.
   */
  toHexString() {
    return HexString.fromUint8Array(this.address).hex();
  }
  serialize(serializer) {
    serializer.serializeFixedBytes(this.address);
  }
  static deserialize(deserializer) {
    return new _AccountAddress(deserializer.deserializeFixedBytes(_AccountAddress.LENGTH));
  }
  /**
   * Standardizes an address to the format "0x" followed by 64 lowercase hexadecimal digits.
   */
  static standardizeAddress(address) {
    const lowercaseAddress = address.toLowerCase();
    const addressWithoutPrefix = lowercaseAddress.startsWith("0x") ? lowercaseAddress.slice(2) : lowercaseAddress;
    const addressWithPadding = addressWithoutPrefix.padStart(64, "0");
    return `0x${addressWithPadding}`;
  }
};
_AccountAddress.LENGTH = 32;
_AccountAddress.CORE_CODE_ADDRESS = _AccountAddress.fromHex("0x1");
var AccountAddress = _AccountAddress;

// src/aptos_types/ed25519.ts
var _Ed25519PublicKey = class _Ed25519PublicKey {
  constructor(value) {
    if (value.length !== _Ed25519PublicKey.LENGTH) {
      throw new Error(`Ed25519PublicKey length should be ${_Ed25519PublicKey.LENGTH}`);
    }
    this.value = value;
  }
  toBytes() {
    return this.value;
  }
  serialize(serializer) {
    serializer.serializeBytes(this.value);
  }
  static deserialize(deserializer) {
    const value = deserializer.deserializeBytes();
    return new _Ed25519PublicKey(value);
  }
};
_Ed25519PublicKey.LENGTH = 32;
var Ed25519PublicKey = _Ed25519PublicKey;
var _Ed25519Signature = class _Ed25519Signature {
  constructor(value) {
    this.value = value;
    if (value.length !== _Ed25519Signature.LENGTH) {
      throw new Error(`Ed25519Signature length should be ${_Ed25519Signature.LENGTH}`);
    }
  }
  serialize(serializer) {
    serializer.serializeBytes(this.value);
  }
  static deserialize(deserializer) {
    const value = deserializer.deserializeBytes();
    return new _Ed25519Signature(value);
  }
};
_Ed25519Signature.LENGTH = 64;
var Ed25519Signature = _Ed25519Signature;

// src/aptos_types/multi_ed25519.ts
var MAX_SIGNATURES_SUPPORTED = 32;
var MultiEd25519PublicKey = class _MultiEd25519PublicKey {
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
  constructor(public_keys, threshold) {
    this.public_keys = public_keys;
    this.threshold = threshold;
    if (threshold > MAX_SIGNATURES_SUPPORTED) {
      throw new Error(`"threshold" cannot be larger than ${MAX_SIGNATURES_SUPPORTED}`);
    }
  }
  /**
   * Converts a MultiEd25519PublicKey into bytes with: bytes = p1_bytes | ... | pn_bytes | threshold
   */
  toBytes() {
    const bytes = new Uint8Array(this.public_keys.length * Ed25519PublicKey.LENGTH + 1);
    this.public_keys.forEach((k, i) => {
      bytes.set(k.value, i * Ed25519PublicKey.LENGTH);
    });
    bytes[this.public_keys.length * Ed25519PublicKey.LENGTH] = this.threshold;
    return bytes;
  }
  serialize(serializer) {
    serializer.serializeBytes(this.toBytes());
  }
  static deserialize(deserializer) {
    const bytes = deserializer.deserializeBytes();
    const threshold = bytes[bytes.length - 1];
    const keys = [];
    for (let i = 0; i < bytes.length - 1; i += Ed25519PublicKey.LENGTH) {
      const begin = i;
      keys.push(new Ed25519PublicKey(bytes.subarray(begin, begin + Ed25519PublicKey.LENGTH)));
    }
    return new _MultiEd25519PublicKey(keys, threshold);
  }
};
var _MultiEd25519Signature = class _MultiEd25519Signature {
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
  constructor(signatures, bitmap) {
    this.signatures = signatures;
    this.bitmap = bitmap;
    if (bitmap.length !== _MultiEd25519Signature.BITMAP_LEN) {
      throw new Error(`"bitmap" length should be ${_MultiEd25519Signature.BITMAP_LEN}`);
    }
  }
  /**
   * Converts a MultiEd25519Signature into bytes with `bytes = s1_bytes | ... | sn_bytes | bitmap`
   */
  toBytes() {
    const bytes = new Uint8Array(this.signatures.length * Ed25519Signature.LENGTH + _MultiEd25519Signature.BITMAP_LEN);
    this.signatures.forEach((k, i) => {
      bytes.set(k.value, i * Ed25519Signature.LENGTH);
    });
    bytes.set(this.bitmap, this.signatures.length * Ed25519Signature.LENGTH);
    return bytes;
  }
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
  static createBitmap(bits) {
    const firstBitInByte = 128;
    const bitmap = new Uint8Array([0, 0, 0, 0]);
    const dupCheckSet = /* @__PURE__ */ new Set();
    bits.forEach((bit) => {
      if (bit >= MAX_SIGNATURES_SUPPORTED) {
        throw new Error(`Invalid bit value ${bit}.`);
      }
      if (dupCheckSet.has(bit)) {
        throw new Error("Duplicated bits detected.");
      }
      dupCheckSet.add(bit);
      const byteOffset = Math.floor(bit / 8);
      let byte = bitmap[byteOffset];
      byte |= firstBitInByte >> bit % 8;
      bitmap[byteOffset] = byte;
    });
    return bitmap;
  }
  serialize(serializer) {
    serializer.serializeBytes(this.toBytes());
  }
  static deserialize(deserializer) {
    const bytes = deserializer.deserializeBytes();
    const bitmap = bytes.subarray(bytes.length - 4);
    const sigs = [];
    for (let i = 0; i < bytes.length - bitmap.length; i += Ed25519Signature.LENGTH) {
      const begin = i;
      sigs.push(new Ed25519Signature(bytes.subarray(begin, begin + Ed25519Signature.LENGTH)));
    }
    return new _MultiEd25519Signature(sigs, bitmap);
  }
};
_MultiEd25519Signature.BITMAP_LEN = 4;
var MultiEd25519Signature = _MultiEd25519Signature;

// src/aptos_types/authenticator.ts
var TransactionAuthenticator = class {
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0:
        return TransactionAuthenticatorEd25519.load(deserializer);
      case 1:
        return TransactionAuthenticatorMultiEd25519.load(deserializer);
      case 2:
        return TransactionAuthenticatorMultiAgent.load(deserializer);
      case 3:
        return TransactionAuthenticatorFeePayer.load(deserializer);
      default:
        throw new Error(`Unknown variant index for TransactionAuthenticator: ${index}`);
    }
  }
};
var TransactionAuthenticatorEd25519 = class _TransactionAuthenticatorEd25519 extends TransactionAuthenticator {
  /**
   * An authenticator for single signature.
   *
   * @param public_key Client's public key.
   * @param signature Signature of a raw transaction.
   * @see {@link https://aptos.dev/guides/creating-a-signed-transaction/ | Creating a Signed Transaction}
   * for details about generating a signature.
   */
  constructor(public_key, signature) {
    super();
    this.public_key = public_key;
    this.signature = signature;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0);
    this.public_key.serialize(serializer);
    this.signature.serialize(serializer);
  }
  static load(deserializer) {
    const public_key = Ed25519PublicKey.deserialize(deserializer);
    const signature = Ed25519Signature.deserialize(deserializer);
    return new _TransactionAuthenticatorEd25519(public_key, signature);
  }
};
var TransactionAuthenticatorMultiEd25519 = class _TransactionAuthenticatorMultiEd25519 extends TransactionAuthenticator {
  /**
   * An authenticator for multiple signatures.
   *
   * @param public_key
   * @param signature
   *
   */
  constructor(public_key, signature) {
    super();
    this.public_key = public_key;
    this.signature = signature;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(1);
    this.public_key.serialize(serializer);
    this.signature.serialize(serializer);
  }
  static load(deserializer) {
    const public_key = MultiEd25519PublicKey.deserialize(deserializer);
    const signature = MultiEd25519Signature.deserialize(deserializer);
    return new _TransactionAuthenticatorMultiEd25519(public_key, signature);
  }
};
var TransactionAuthenticatorMultiAgent = class _TransactionAuthenticatorMultiAgent extends TransactionAuthenticator {
  constructor(sender, secondary_signer_addresses, secondary_signers) {
    super();
    this.sender = sender;
    this.secondary_signer_addresses = secondary_signer_addresses;
    this.secondary_signers = secondary_signers;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(2);
    this.sender.serialize(serializer);
    serializeVector(this.secondary_signer_addresses, serializer);
    serializeVector(this.secondary_signers, serializer);
  }
  static load(deserializer) {
    const sender = AccountAuthenticator.deserialize(deserializer);
    const secondary_signer_addresses = deserializeVector(deserializer, AccountAddress);
    const secondary_signers = deserializeVector(deserializer, AccountAuthenticator);
    return new _TransactionAuthenticatorMultiAgent(sender, secondary_signer_addresses, secondary_signers);
  }
};
var TransactionAuthenticatorFeePayer = class _TransactionAuthenticatorFeePayer extends TransactionAuthenticator {
  constructor(sender, secondary_signer_addresses, secondary_signers, fee_payer) {
    super();
    this.sender = sender;
    this.secondary_signer_addresses = secondary_signer_addresses;
    this.secondary_signers = secondary_signers;
    this.fee_payer = fee_payer;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(3);
    this.sender.serialize(serializer);
    serializeVector(this.secondary_signer_addresses, serializer);
    serializeVector(this.secondary_signers, serializer);
    this.fee_payer.address.serialize(serializer);
    this.fee_payer.authenticator.serialize(serializer);
  }
  static load(deserializer) {
    const sender = AccountAuthenticator.deserialize(deserializer);
    const secondary_signer_addresses = deserializeVector(deserializer, AccountAddress);
    const secondary_signers = deserializeVector(deserializer, AccountAuthenticator);
    const address = AccountAddress.deserialize(deserializer);
    const authenticator = AccountAuthenticator.deserialize(deserializer);
    const fee_payer = { address, authenticator };
    return new _TransactionAuthenticatorFeePayer(sender, secondary_signer_addresses, secondary_signers, fee_payer);
  }
};
var AccountAuthenticator = class {
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0:
        return AccountAuthenticatorEd25519.load(deserializer);
      case 1:
        return AccountAuthenticatorMultiEd25519.load(deserializer);
      default:
        throw new Error(`Unknown variant index for AccountAuthenticator: ${index}`);
    }
  }
};
var AccountAuthenticatorEd25519 = class _AccountAuthenticatorEd25519 extends AccountAuthenticator {
  constructor(public_key, signature) {
    super();
    this.public_key = public_key;
    this.signature = signature;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0);
    this.public_key.serialize(serializer);
    this.signature.serialize(serializer);
  }
  static load(deserializer) {
    const public_key = Ed25519PublicKey.deserialize(deserializer);
    const signature = Ed25519Signature.deserialize(deserializer);
    return new _AccountAuthenticatorEd25519(public_key, signature);
  }
};
var AccountAuthenticatorMultiEd25519 = class _AccountAuthenticatorMultiEd25519 extends AccountAuthenticator {
  constructor(public_key, signature) {
    super();
    this.public_key = public_key;
    this.signature = signature;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(1);
    this.public_key.serialize(serializer);
    this.signature.serialize(serializer);
  }
  static load(deserializer) {
    const public_key = MultiEd25519PublicKey.deserialize(deserializer);
    const signature = MultiEd25519Signature.deserialize(deserializer);
    return new _AccountAuthenticatorMultiEd25519(public_key, signature);
  }
};

// src/aptos_types/identifier.ts
var Identifier = class _Identifier {
  constructor(value) {
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeStr(this.value);
  }
  static deserialize(deserializer) {
    const value = deserializer.deserializeStr();
    return new _Identifier(value);
  }
};

// src/aptos_types/type_tag.ts
var TypeTag = class {
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0:
        return TypeTagBool.load(deserializer);
      case 1:
        return TypeTagU8.load(deserializer);
      case 2:
        return TypeTagU64.load(deserializer);
      case 3:
        return TypeTagU128.load(deserializer);
      case 4:
        return TypeTagAddress.load(deserializer);
      case 5:
        return TypeTagSigner.load(deserializer);
      case 6:
        return TypeTagVector.load(deserializer);
      case 7:
        return TypeTagStruct.load(deserializer);
      case 8:
        return TypeTagU16.load(deserializer);
      case 9:
        return TypeTagU32.load(deserializer);
      case 10:
        return TypeTagU256.load(deserializer);
      default:
        throw new Error(`Unknown variant index for TypeTag: ${index}`);
    }
  }
};
var TypeTagBool = class _TypeTagBool extends TypeTag {
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0);
  }
  static load(_deserializer) {
    return new _TypeTagBool();
  }
};
var TypeTagU8 = class _TypeTagU8 extends TypeTag {
  serialize(serializer) {
    serializer.serializeU32AsUleb128(1);
  }
  static load(_deserializer) {
    return new _TypeTagU8();
  }
};
var TypeTagU16 = class _TypeTagU16 extends TypeTag {
  serialize(serializer) {
    serializer.serializeU32AsUleb128(8);
  }
  static load(_deserializer) {
    return new _TypeTagU16();
  }
};
var TypeTagU32 = class _TypeTagU32 extends TypeTag {
  serialize(serializer) {
    serializer.serializeU32AsUleb128(9);
  }
  static load(_deserializer) {
    return new _TypeTagU32();
  }
};
var TypeTagU64 = class _TypeTagU64 extends TypeTag {
  serialize(serializer) {
    serializer.serializeU32AsUleb128(2);
  }
  static load(_deserializer) {
    return new _TypeTagU64();
  }
};
var TypeTagU128 = class _TypeTagU128 extends TypeTag {
  serialize(serializer) {
    serializer.serializeU32AsUleb128(3);
  }
  static load(_deserializer) {
    return new _TypeTagU128();
  }
};
var TypeTagU256 = class _TypeTagU256 extends TypeTag {
  serialize(serializer) {
    serializer.serializeU32AsUleb128(10);
  }
  static load(_deserializer) {
    return new _TypeTagU256();
  }
};
var TypeTagAddress = class _TypeTagAddress extends TypeTag {
  serialize(serializer) {
    serializer.serializeU32AsUleb128(4);
  }
  static load(_deserializer) {
    return new _TypeTagAddress();
  }
};
var TypeTagSigner = class _TypeTagSigner extends TypeTag {
  serialize(serializer) {
    serializer.serializeU32AsUleb128(5);
  }
  static load(_deserializer) {
    return new _TypeTagSigner();
  }
};
var TypeTagVector = class _TypeTagVector extends TypeTag {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(6);
    this.value.serialize(serializer);
  }
  static load(deserializer) {
    const value = TypeTag.deserialize(deserializer);
    return new _TypeTagVector(value);
  }
};
var TypeTagStruct = class _TypeTagStruct extends TypeTag {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(7);
    this.value.serialize(serializer);
  }
  static load(deserializer) {
    const value = StructTag.deserialize(deserializer);
    return new _TypeTagStruct(value);
  }
  isStringTypeTag() {
    if (this.value.module_name.value === "string" && this.value.name.value === "String" && this.value.address.toHexString() === AccountAddress.CORE_CODE_ADDRESS.toHexString()) {
      return true;
    }
    return false;
  }
};
var StructTag = class _StructTag {
  constructor(address, module_name, name, type_args) {
    this.address = address;
    this.module_name = module_name;
    this.name = name;
    this.type_args = type_args;
  }
  /**
   * Converts a string literal to a StructTag
   * @param structTag String literal in format "AcountAddress::module_name::ResourceName",
   *   e.g. "0x1::aptos_coin::AptosCoin"
   * @returns
   */
  static fromString(structTag) {
    const typeTagStruct = new TypeTagParser(structTag).parseTypeTag();
    return new _StructTag(
      typeTagStruct.value.address,
      typeTagStruct.value.module_name,
      typeTagStruct.value.name,
      typeTagStruct.value.type_args
    );
  }
  serialize(serializer) {
    this.address.serialize(serializer);
    this.module_name.serialize(serializer);
    this.name.serialize(serializer);
    serializeVector(this.type_args, serializer);
  }
  static deserialize(deserializer) {
    const address = AccountAddress.deserialize(deserializer);
    const moduleName = Identifier.deserialize(deserializer);
    const name = Identifier.deserialize(deserializer);
    const typeArgs = deserializeVector(deserializer, TypeTag);
    return new _StructTag(address, moduleName, name, typeArgs);
  }
};
var stringStructTag = new StructTag(
  AccountAddress.fromHex("0x1"),
  new Identifier("string"),
  new Identifier("String"),
  []
);
function optionStructTag(typeArg) {
  return new StructTag(AccountAddress.fromHex("0x1"), new Identifier("option"), new Identifier("Option"), [typeArg]);
}
function objectStructTag(typeArg) {
  return new StructTag(AccountAddress.fromHex("0x1"), new Identifier("object"), new Identifier("Object"), [typeArg]);
}
function bail(message) {
  throw new TypeTagParserError(message);
}
function isWhiteSpace(c) {
  if (c.match(/\s/)) {
    return true;
  }
  return false;
}
function isValidAlphabetic(c) {
  if (c.match(/[_A-Za-z0-9]/g)) {
    return true;
  }
  return false;
}
function isGeneric(c) {
  if (c.match(/T\d+/g)) {
    return true;
  }
  return false;
}
function nextToken(tagStr, pos) {
  const c = tagStr[pos];
  if (c === ":") {
    if (tagStr.slice(pos, pos + 2) === "::") {
      return [["COLON", "::"], 2];
    }
    bail("Unrecognized token.");
  } else if (c === "<") {
    return [["LT", "<"], 1];
  } else if (c === ">") {
    return [["GT", ">"], 1];
  } else if (c === ",") {
    return [["COMMA", ","], 1];
  } else if (isWhiteSpace(c)) {
    let res = "";
    for (let i = pos; i < tagStr.length; i += 1) {
      const char = tagStr[i];
      if (isWhiteSpace(char)) {
        res = `${res}${char}`;
      } else {
        break;
      }
    }
    return [["SPACE", res], res.length];
  } else if (isValidAlphabetic(c)) {
    let res = "";
    for (let i = pos; i < tagStr.length; i += 1) {
      const char = tagStr[i];
      if (isValidAlphabetic(char)) {
        res = `${res}${char}`;
      } else {
        break;
      }
    }
    if (isGeneric(res)) {
      return [["GENERIC", res], res.length];
    }
    return [["IDENT", res], res.length];
  }
  throw new Error("Unrecognized token.");
}
function tokenize(tagStr) {
  let pos = 0;
  const tokens = [];
  while (pos < tagStr.length) {
    const [token, size] = nextToken(tagStr, pos);
    if (token[0] !== "SPACE") {
      tokens.push(token);
    }
    pos += size;
  }
  return tokens;
}
var TypeTagParser = class _TypeTagParser {
  constructor(tagStr, typeTags) {
    this.typeTags = [];
    this.tokens = tokenize(tagStr);
    this.typeTags = typeTags || [];
  }
  consume(targetToken) {
    const token = this.tokens.shift();
    if (!token || token[1] !== targetToken) {
      bail("Invalid type tag.");
    }
  }
  /**
   * Consumes all of an unused generic field, mostly applicable to object
   *
   * Note: This is recursive.  it can be problematic if there's bad input
   * @private
   */
  consumeWholeGeneric() {
    this.consume("<");
    while (this.tokens[0][1] !== ">") {
      if (this.tokens[0][1] === "<") {
        this.consumeWholeGeneric();
      } else {
        this.tokens.shift();
      }
    }
    this.consume(">");
  }
  parseCommaList(endToken, allowTraillingComma) {
    const res = [];
    if (this.tokens.length <= 0) {
      bail("Invalid type tag.");
    }
    while (this.tokens[0][1] !== endToken) {
      res.push(this.parseTypeTag());
      if (this.tokens.length > 0 && this.tokens[0][1] === endToken) {
        break;
      }
      this.consume(",");
      if (this.tokens.length > 0 && this.tokens[0][1] === endToken && allowTraillingComma) {
        break;
      }
      if (this.tokens.length <= 0) {
        bail("Invalid type tag.");
      }
    }
    return res;
  }
  parseTypeTag() {
    if (this.tokens.length === 0) {
      bail("Invalid type tag.");
    }
    const [tokenTy, tokenVal] = this.tokens.shift();
    if (tokenVal === "u8") {
      return new TypeTagU8();
    }
    if (tokenVal === "u16") {
      return new TypeTagU16();
    }
    if (tokenVal === "u32") {
      return new TypeTagU32();
    }
    if (tokenVal === "u64") {
      return new TypeTagU64();
    }
    if (tokenVal === "u128") {
      return new TypeTagU128();
    }
    if (tokenVal === "u256") {
      return new TypeTagU256();
    }
    if (tokenVal === "bool") {
      return new TypeTagBool();
    }
    if (tokenVal === "address") {
      return new TypeTagAddress();
    }
    if (tokenVal === "vector") {
      this.consume("<");
      const res = this.parseTypeTag();
      this.consume(">");
      return new TypeTagVector(res);
    }
    if (tokenVal === "string") {
      return new TypeTagStruct(stringStructTag);
    }
    if (tokenTy === "IDENT" && (tokenVal.startsWith("0x") || tokenVal.startsWith("0X"))) {
      const address = AccountAddress.fromHex(tokenVal);
      this.consume("::");
      const [moduleTokenTy, module] = this.tokens.shift();
      if (moduleTokenTy !== "IDENT") {
        bail("Invalid type tag.");
      }
      this.consume("::");
      const [nameTokenTy, name] = this.tokens.shift();
      if (nameTokenTy !== "IDENT") {
        bail("Invalid type tag.");
      }
      if (AccountAddress.CORE_CODE_ADDRESS.toHexString() === address.toHexString() && module === "object" && name === "Object") {
        this.consumeWholeGeneric();
        return new TypeTagAddress();
      }
      let tyTags = [];
      if (this.tokens.length > 0 && this.tokens[0][1] === "<") {
        this.consume("<");
        tyTags = this.parseCommaList(">", true);
        this.consume(">");
      }
      const structTag = new StructTag(address, new Identifier(module), new Identifier(name), tyTags);
      return new TypeTagStruct(structTag);
    }
    if (tokenTy === "GENERIC") {
      if (this.typeTags.length === 0) {
        bail("Can't convert generic type since no typeTags were specified.");
      }
      const idx = parseInt(tokenVal.substring(1), 10);
      return new _TypeTagParser(this.typeTags[idx]).parseTypeTag();
    }
    throw new Error("Invalid type tag.");
  }
};
var TypeTagParserError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "TypeTagParserError";
  }
};

// src/aptos_types/transaction.ts
var RawTransaction = class _RawTransaction {
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
  constructor(sender, sequence_number, payload, max_gas_amount, gas_unit_price, expiration_timestamp_secs, chain_id) {
    this.sender = sender;
    this.sequence_number = sequence_number;
    this.payload = payload;
    this.max_gas_amount = max_gas_amount;
    this.gas_unit_price = gas_unit_price;
    this.expiration_timestamp_secs = expiration_timestamp_secs;
    this.chain_id = chain_id;
  }
  serialize(serializer) {
    this.sender.serialize(serializer);
    serializer.serializeU64(this.sequence_number);
    this.payload.serialize(serializer);
    serializer.serializeU64(this.max_gas_amount);
    serializer.serializeU64(this.gas_unit_price);
    serializer.serializeU64(this.expiration_timestamp_secs);
    this.chain_id.serialize(serializer);
  }
  static deserialize(deserializer) {
    const sender = AccountAddress.deserialize(deserializer);
    const sequence_number = deserializer.deserializeU64();
    const payload = TransactionPayload.deserialize(deserializer);
    const max_gas_amount = deserializer.deserializeU64();
    const gas_unit_price = deserializer.deserializeU64();
    const expiration_timestamp_secs = deserializer.deserializeU64();
    const chain_id = ChainId.deserialize(deserializer);
    return new _RawTransaction(
      sender,
      sequence_number,
      payload,
      max_gas_amount,
      gas_unit_price,
      expiration_timestamp_secs,
      chain_id
    );
  }
};
var Script = class _Script {
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
  constructor(code, ty_args, args) {
    this.code = code;
    this.ty_args = ty_args;
    this.args = args;
  }
  serialize(serializer) {
    serializer.serializeBytes(this.code);
    serializeVector(this.ty_args, serializer);
    serializeVector(this.args, serializer);
  }
  static deserialize(deserializer) {
    const code = deserializer.deserializeBytes();
    const ty_args = deserializeVector(deserializer, TypeTag);
    const args = deserializeVector(deserializer, TransactionArgument);
    return new _Script(code, ty_args, args);
  }
};
var EntryFunction = class _EntryFunction {
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
  constructor(module_name, function_name, ty_args, args) {
    this.module_name = module_name;
    this.function_name = function_name;
    this.ty_args = ty_args;
    this.args = args;
  }
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
  static natural(module, func, ty_args, args) {
    return new _EntryFunction(ModuleId.fromStr(module), new Identifier(func), ty_args, args);
  }
  /**
   * `natual` is deprecated, please use `natural`
   *
   * @deprecated.
   */
  static natual(module, func, ty_args, args) {
    return _EntryFunction.natural(module, func, ty_args, args);
  }
  serialize(serializer) {
    this.module_name.serialize(serializer);
    this.function_name.serialize(serializer);
    serializeVector(this.ty_args, serializer);
    serializer.serializeU32AsUleb128(this.args.length);
    this.args.forEach((item) => {
      serializer.serializeBytes(item);
    });
  }
  static deserialize(deserializer) {
    const module_name = ModuleId.deserialize(deserializer);
    const function_name = Identifier.deserialize(deserializer);
    const ty_args = deserializeVector(deserializer, TypeTag);
    const length = deserializer.deserializeUleb128AsU32();
    const list = [];
    for (let i = 0; i < length; i += 1) {
      list.push(deserializer.deserializeBytes());
    }
    const args = list;
    return new _EntryFunction(module_name, function_name, ty_args, args);
  }
};
var MultiSigTransactionPayload = class _MultiSigTransactionPayload {
  /**
   * Contains the payload to run a multisig account transaction.
   * @param transaction_payload The payload of the multisig transaction. This can only be EntryFunction for now but
   * Script might be supported in the future.
   */
  constructor(transaction_payload) {
    this.transaction_payload = transaction_payload;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0);
    this.transaction_payload.serialize(serializer);
  }
  static deserialize(deserializer) {
    deserializer.deserializeUleb128AsU32();
    return new _MultiSigTransactionPayload(EntryFunction.deserialize(deserializer));
  }
};
var MultiSig = class _MultiSig {
  /**
   * Contains the payload to run a multisig account transaction.
   * @param multisig_address The multisig account address the transaction will be executed as.
   * @param transaction_payload The payload of the multisig transaction. This is optional when executing a multisig
   *  transaction whose payload is already stored on chain.
   */
  constructor(multisig_address, transaction_payload) {
    this.multisig_address = multisig_address;
    this.transaction_payload = transaction_payload;
  }
  serialize(serializer) {
    this.multisig_address.serialize(serializer);
    if (this.transaction_payload === void 0) {
      serializer.serializeBool(false);
    } else {
      serializer.serializeBool(true);
      this.transaction_payload.serialize(serializer);
    }
  }
  static deserialize(deserializer) {
    const multisig_address = AccountAddress.deserialize(deserializer);
    const payloadPresent = deserializer.deserializeBool();
    let transaction_payload;
    if (payloadPresent) {
      transaction_payload = MultiSigTransactionPayload.deserialize(deserializer);
    }
    return new _MultiSig(multisig_address, transaction_payload);
  }
};
var Module = class _Module {
  /**
   * Contains the bytecode of a Move module that can be published to the Aptos chain.
   * @param code Move bytecode of a module.
   */
  constructor(code) {
    this.code = code;
  }
  serialize(serializer) {
    serializer.serializeBytes(this.code);
  }
  static deserialize(deserializer) {
    const code = deserializer.deserializeBytes();
    return new _Module(code);
  }
};
var ModuleId = class _ModuleId {
  /**
   * Full name of a module.
   * @param address The account address.
   * @param name The name of the module under the account at "address".
   */
  constructor(address, name) {
    this.address = address;
    this.name = name;
  }
  /**
   * Converts a string literal to a ModuleId
   * @param moduleId String literal in format "AccountAddress::module_name", e.g. "0x1::coin"
   * @returns
   */
  static fromStr(moduleId) {
    const parts = moduleId.split("::");
    if (parts.length !== 2) {
      throw new Error("Invalid module id.");
    }
    return new _ModuleId(AccountAddress.fromHex(new HexString(parts[0])), new Identifier(parts[1]));
  }
  serialize(serializer) {
    this.address.serialize(serializer);
    this.name.serialize(serializer);
  }
  static deserialize(deserializer) {
    const address = AccountAddress.deserialize(deserializer);
    const name = Identifier.deserialize(deserializer);
    return new _ModuleId(address, name);
  }
};
var ChangeSet = class {
  serialize(serializer) {
    throw new Error("Not implemented.");
  }
  static deserialize(deserializer) {
    throw new Error("Not implemented.");
  }
};
var WriteSet = class {
  serialize(serializer) {
    throw new Error("Not implmented.");
  }
  static deserialize(deserializer) {
    throw new Error("Not implmented.");
  }
};
var SignedTransaction = class _SignedTransaction {
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
  constructor(raw_txn, authenticator) {
    this.raw_txn = raw_txn;
    this.authenticator = authenticator;
  }
  serialize(serializer) {
    this.raw_txn.serialize(serializer);
    this.authenticator.serialize(serializer);
  }
  static deserialize(deserializer) {
    const raw_txn = RawTransaction.deserialize(deserializer);
    const authenticator = TransactionAuthenticator.deserialize(deserializer);
    return new _SignedTransaction(raw_txn, authenticator);
  }
};
var RawTransactionWithData = class {
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0:
        return MultiAgentRawTransaction.load(deserializer);
      case 1:
        return FeePayerRawTransaction.load(deserializer);
      default:
        throw new Error(`Unknown variant index for RawTransactionWithData: ${index}`);
    }
  }
};
var MultiAgentRawTransaction = class _MultiAgentRawTransaction extends RawTransactionWithData {
  constructor(raw_txn, secondary_signer_addresses) {
    super();
    this.raw_txn = raw_txn;
    this.secondary_signer_addresses = secondary_signer_addresses;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0);
    this.raw_txn.serialize(serializer);
    serializeVector(this.secondary_signer_addresses, serializer);
  }
  static load(deserializer) {
    const rawTxn = RawTransaction.deserialize(deserializer);
    const secondarySignerAddresses = deserializeVector(deserializer, AccountAddress);
    return new _MultiAgentRawTransaction(rawTxn, secondarySignerAddresses);
  }
};
var FeePayerRawTransaction = class _FeePayerRawTransaction extends RawTransactionWithData {
  constructor(raw_txn, secondary_signer_addresses, fee_payer_address) {
    super();
    this.raw_txn = raw_txn;
    this.secondary_signer_addresses = secondary_signer_addresses;
    this.fee_payer_address = fee_payer_address;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(1);
    this.raw_txn.serialize(serializer);
    serializeVector(this.secondary_signer_addresses, serializer);
    this.fee_payer_address.serialize(serializer);
  }
  static load(deserializer) {
    const rawTxn = RawTransaction.deserialize(deserializer);
    const secondarySignerAddresses = deserializeVector(deserializer, AccountAddress);
    const feePayerAddress = AccountAddress.deserialize(deserializer);
    return new _FeePayerRawTransaction(rawTxn, secondarySignerAddresses, feePayerAddress);
  }
};
var TransactionPayload = class {
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0:
        return TransactionPayloadScript.load(deserializer);
      case 2:
        return TransactionPayloadEntryFunction.load(deserializer);
      case 3:
        return TransactionPayloadMultisig.load(deserializer);
      default:
        throw new Error(`Unknown variant index for TransactionPayload: ${index}`);
    }
  }
};
var TransactionPayloadScript = class _TransactionPayloadScript extends TransactionPayload {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0);
    this.value.serialize(serializer);
  }
  static load(deserializer) {
    const value = Script.deserialize(deserializer);
    return new _TransactionPayloadScript(value);
  }
};
var TransactionPayloadEntryFunction = class _TransactionPayloadEntryFunction extends TransactionPayload {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(2);
    this.value.serialize(serializer);
  }
  static load(deserializer) {
    const value = EntryFunction.deserialize(deserializer);
    return new _TransactionPayloadEntryFunction(value);
  }
};
var TransactionPayloadMultisig = class _TransactionPayloadMultisig extends TransactionPayload {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(3);
    this.value.serialize(serializer);
  }
  static load(deserializer) {
    const value = MultiSig.deserialize(deserializer);
    return new _TransactionPayloadMultisig(value);
  }
};
var ChainId = class _ChainId {
  constructor(value) {
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU8(this.value);
  }
  static deserialize(deserializer) {
    const value = deserializer.deserializeU8();
    return new _ChainId(value);
  }
};
var TransactionArgument = class {
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0:
        return TransactionArgumentU8.load(deserializer);
      case 1:
        return TransactionArgumentU64.load(deserializer);
      case 2:
        return TransactionArgumentU128.load(deserializer);
      case 3:
        return TransactionArgumentAddress.load(deserializer);
      case 4:
        return TransactionArgumentU8Vector.load(deserializer);
      case 5:
        return TransactionArgumentBool.load(deserializer);
      case 6:
        return TransactionArgumentU16.load(deserializer);
      case 7:
        return TransactionArgumentU32.load(deserializer);
      case 8:
        return TransactionArgumentU256.load(deserializer);
      default:
        throw new Error(`Unknown variant index for TransactionArgument: ${index}`);
    }
  }
};
var TransactionArgumentU8 = class _TransactionArgumentU8 extends TransactionArgument {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0);
    serializer.serializeU8(this.value);
  }
  static load(deserializer) {
    const value = deserializer.deserializeU8();
    return new _TransactionArgumentU8(value);
  }
};
var TransactionArgumentU16 = class _TransactionArgumentU16 extends TransactionArgument {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(6);
    serializer.serializeU16(this.value);
  }
  static load(deserializer) {
    const value = deserializer.deserializeU16();
    return new _TransactionArgumentU16(value);
  }
};
var TransactionArgumentU32 = class _TransactionArgumentU32 extends TransactionArgument {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(7);
    serializer.serializeU32(this.value);
  }
  static load(deserializer) {
    const value = deserializer.deserializeU32();
    return new _TransactionArgumentU32(value);
  }
};
var TransactionArgumentU64 = class _TransactionArgumentU64 extends TransactionArgument {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(1);
    serializer.serializeU64(this.value);
  }
  static load(deserializer) {
    const value = deserializer.deserializeU64();
    return new _TransactionArgumentU64(value);
  }
};
var TransactionArgumentU128 = class _TransactionArgumentU128 extends TransactionArgument {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(2);
    serializer.serializeU128(this.value);
  }
  static load(deserializer) {
    const value = deserializer.deserializeU128();
    return new _TransactionArgumentU128(value);
  }
};
var TransactionArgumentU256 = class _TransactionArgumentU256 extends TransactionArgument {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(8);
    serializer.serializeU256(this.value);
  }
  static load(deserializer) {
    const value = deserializer.deserializeU256();
    return new _TransactionArgumentU256(value);
  }
};
var TransactionArgumentAddress = class _TransactionArgumentAddress extends TransactionArgument {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(3);
    this.value.serialize(serializer);
  }
  static load(deserializer) {
    const value = AccountAddress.deserialize(deserializer);
    return new _TransactionArgumentAddress(value);
  }
};
var TransactionArgumentU8Vector = class _TransactionArgumentU8Vector extends TransactionArgument {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(4);
    serializer.serializeBytes(this.value);
  }
  static load(deserializer) {
    const value = deserializer.deserializeBytes();
    return new _TransactionArgumentU8Vector(value);
  }
};
var TransactionArgumentBool = class _TransactionArgumentBool extends TransactionArgument {
  constructor(value) {
    super();
    this.value = value;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(5);
    serializer.serializeBool(this.value);
  }
  static load(deserializer) {
    const value = deserializer.deserializeBool();
    return new _TransactionArgumentBool(value);
  }
};
var Transaction = class {
  getHashSalt() {
    const hash = sha3Hash.create();
    hash.update("APTOS::Transaction");
    return hash.digest();
  }
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0:
        return UserTransaction.load(deserializer);
      default:
        throw new Error(`Unknown variant index for Transaction: ${index}`);
    }
  }
};
var UserTransaction = class _UserTransaction extends Transaction {
  constructor(value) {
    super();
    this.value = value;
  }
  hash() {
    const hash = sha3Hash.create();
    hash.update(this.getHashSalt());
    hash.update(bcsToBytes(this));
    return hash.digest();
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0);
    this.value.serialize(serializer);
  }
  static load(deserializer) {
    return new _UserTransaction(SignedTransaction.deserialize(deserializer));
  }
};

// src/aptos_types/abi.ts
var TypeArgumentABI = class _TypeArgumentABI {
  /**
   * Constructs a TypeArgumentABI instance.
   * @param name
   */
  constructor(name) {
    this.name = name;
  }
  serialize(serializer) {
    serializer.serializeStr(this.name);
  }
  static deserialize(deserializer) {
    const name = deserializer.deserializeStr();
    return new _TypeArgumentABI(name);
  }
};
var ArgumentABI = class _ArgumentABI {
  /**
   * Constructs an ArgumentABI instance.
   * @param name
   * @param type_tag
   */
  constructor(name, type_tag) {
    this.name = name;
    this.type_tag = type_tag;
  }
  serialize(serializer) {
    serializer.serializeStr(this.name);
    this.type_tag.serialize(serializer);
  }
  static deserialize(deserializer) {
    const name = deserializer.deserializeStr();
    const typeTag = TypeTag.deserialize(deserializer);
    return new _ArgumentABI(name, typeTag);
  }
};
var ScriptABI = class {
  static deserialize(deserializer) {
    const index = deserializer.deserializeUleb128AsU32();
    switch (index) {
      case 0:
        return TransactionScriptABI.load(deserializer);
      case 1:
        return EntryFunctionABI.load(deserializer);
      default:
        throw new Error(`Unknown variant index for TransactionPayload: ${index}`);
    }
  }
};
var TransactionScriptABI = class _TransactionScriptABI extends ScriptABI {
  /**
   * Constructs a TransactionScriptABI instance.
   * @param name Entry function name
   * @param doc
   * @param code
   * @param ty_args
   * @param args
   */
  constructor(name, doc, code, ty_args, args) {
    super();
    this.name = name;
    this.doc = doc;
    this.code = code;
    this.ty_args = ty_args;
    this.args = args;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(0);
    serializer.serializeStr(this.name);
    serializer.serializeStr(this.doc);
    serializer.serializeBytes(this.code);
    serializeVector(this.ty_args, serializer);
    serializeVector(this.args, serializer);
  }
  static load(deserializer) {
    const name = deserializer.deserializeStr();
    const doc = deserializer.deserializeStr();
    const code = deserializer.deserializeBytes();
    const tyArgs = deserializeVector(deserializer, TypeArgumentABI);
    const args = deserializeVector(deserializer, ArgumentABI);
    return new _TransactionScriptABI(name, doc, code, tyArgs, args);
  }
};
var EntryFunctionABI = class _EntryFunctionABI extends ScriptABI {
  /**
   * Constructs a EntryFunctionABI instance
   * @param name
   * @param module_name Fully qualified module id
   * @param doc
   * @param ty_args
   * @param args
   */
  constructor(name, module_name, doc, ty_args, args) {
    super();
    this.name = name;
    this.module_name = module_name;
    this.doc = doc;
    this.ty_args = ty_args;
    this.args = args;
  }
  serialize(serializer) {
    serializer.serializeU32AsUleb128(1);
    serializer.serializeStr(this.name);
    this.module_name.serialize(serializer);
    serializer.serializeStr(this.doc);
    serializeVector(this.ty_args, serializer);
    serializeVector(this.args, serializer);
  }
  static load(deserializer) {
    const name = deserializer.deserializeStr();
    const moduleName = ModuleId.deserialize(deserializer);
    const doc = deserializer.deserializeStr();
    const tyArgs = deserializeVector(deserializer, TypeArgumentABI);
    const args = deserializeVector(deserializer, ArgumentABI);
    return new _EntryFunctionABI(name, moduleName, doc, tyArgs, args);
  }
};

// src/aptos_types/authentication_key.ts
import { sha3_256 as sha3Hash2 } from "@noble/hashes/sha3";
var _AuthenticationKey = class _AuthenticationKey {
  constructor(bytes) {
    if (bytes.length !== _AuthenticationKey.LENGTH) {
      throw new Error("Expected a byte array of length 32");
    }
    this.bytes = bytes;
  }
  /**
   * Converts a K-of-N MultiEd25519PublicKey to AuthenticationKey with:
   * `auth_key = sha3-256(p_1 | … | p_n | K | 0x01)`. `K` represents the K-of-N required for
   * authenticating the transaction. `0x01` is the 1-byte scheme for multisig.
   */
  static fromMultiEd25519PublicKey(publicKey) {
    const pubKeyBytes = publicKey.toBytes();
    const bytes = new Uint8Array(pubKeyBytes.length + 1);
    bytes.set(pubKeyBytes);
    bytes.set([_AuthenticationKey.MULTI_ED25519_SCHEME], pubKeyBytes.length);
    const hash = sha3Hash2.create();
    hash.update(bytes);
    return new _AuthenticationKey(hash.digest());
  }
  static fromEd25519PublicKey(publicKey) {
    const pubKeyBytes = publicKey.value;
    const bytes = new Uint8Array(pubKeyBytes.length + 1);
    bytes.set(pubKeyBytes);
    bytes.set([_AuthenticationKey.ED25519_SCHEME], pubKeyBytes.length);
    const hash = sha3Hash2.create();
    hash.update(bytes);
    return new _AuthenticationKey(hash.digest());
  }
  /**
   * Derives an account address from AuthenticationKey. Since current AccountAddress is 32 bytes,
   * AuthenticationKey bytes are directly translated to AccountAddress.
   */
  derivedAddress() {
    return HexString.fromUint8Array(this.bytes);
  }
};
_AuthenticationKey.LENGTH = 32;
_AuthenticationKey.MULTI_ED25519_SCHEME = 1;
_AuthenticationKey.ED25519_SCHEME = 0;
_AuthenticationKey.DERIVE_RESOURCE_ACCOUNT_SCHEME = 255;
var AuthenticationKey = _AuthenticationKey;

// src/aptos_types/rotation_proof_challenge.ts
var RotationProofChallenge = class {
  constructor(accountAddress, moduleName, structName, sequenceNumber, originator, currentAuthKey, newPublicKey) {
    this.accountAddress = accountAddress;
    this.moduleName = moduleName;
    this.structName = structName;
    this.sequenceNumber = sequenceNumber;
    this.originator = originator;
    this.currentAuthKey = currentAuthKey;
    this.newPublicKey = newPublicKey;
  }
  serialize(serializer) {
    this.accountAddress.serialize(serializer);
    serializer.serializeStr(this.moduleName);
    serializer.serializeStr(this.structName);
    serializer.serializeU64(this.sequenceNumber);
    this.originator.serialize(serializer);
    this.currentAuthKey.serialize(serializer);
    serializer.serializeBytes(this.newPublicKey);
  }
};

// src/account/aptos_account.ts
var _AptosAccount = class _AptosAccount {
  static fromAptosAccountObject(obj) {
    return new _AptosAccount(HexString.ensure(obj.privateKeyHex).toUint8Array(), obj.address);
  }
  /**
   * Check's if the derive path is valid
   */
  static isValidPath(path) {
    return /^m\/44'\/637'\/[0-9]+'\/[0-9]+'\/[0-9]+'+$/.test(path);
  }
  /**
   * Creates new account with bip44 path and mnemonics,
   * @param path. (e.g. m/44'/637'/0'/0'/0')
   * Detailed description: {@link https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki}
   * @param mnemonics.
   * @returns AptosAccount
   */
  static fromDerivePath(path, mnemonics) {
    if (!_AptosAccount.isValidPath(path)) {
      throw new Error("Invalid derivation path");
    }
    const normalizeMnemonics = mnemonics.trim().split(/\s+/).map((part) => part.toLowerCase()).join(" ");
    const { key } = derivePath(path, bytesToHex2(bip39.mnemonicToSeedSync(normalizeMnemonics)));
    return new _AptosAccount(key);
  }
  /**
   * Creates new account instance. Constructor allows passing in an address,
   * to handle account key rotation, where auth_key != public_key
   * @param privateKeyBytes  Private key from which account key pair will be generated.
   * If not specified, new key pair is going to be created.
   * @param address Account address (e.g. 0xe8012714cd17606cee7188a2a365eef3fe760be598750678c8c5954eb548a591).
   * If not specified, a new one will be generated from public key
   */
  constructor(privateKeyBytes, address) {
    if (privateKeyBytes) {
      this.signingKey = nacl2.sign.keyPair.fromSeed(privateKeyBytes.slice(0, 32));
    } else {
      this.signingKey = nacl2.sign.keyPair();
    }
    this.accountAddress = HexString.ensure(address || this.authKey().hex());
  }
  /**
   * This is the key by which Aptos account is referenced.
   * It is the 32-byte of the SHA-3 256 cryptographic hash
   * of the public key(s) concatenated with a signature scheme identifier byte
   * @returns Address associated with the given account
   */
  address() {
    return this.accountAddress;
  }
  authKey() {
    const pubKey = new Ed25519PublicKey(this.signingKey.publicKey);
    const authKey = AuthenticationKey.fromEd25519PublicKey(pubKey);
    return authKey.derivedAddress();
  }
  /**
   * Takes source address and seeds and returns the resource account address
   * @param sourceAddress Address used to derive the resource account
   * @param seed The seed bytes
   * @returns The resource account address
   */
  static getResourceAccountAddress(sourceAddress, seed) {
    const source = bcsToBytes(AccountAddress.fromHex(sourceAddress));
    const bytes = new Uint8Array([...source, ...seed, AuthenticationKey.DERIVE_RESOURCE_ACCOUNT_SCHEME]);
    const hash = sha3Hash3.create();
    hash.update(bytes);
    return HexString.fromUint8Array(hash.digest());
  }
  /**
   * Takes creator address and collection name and returns the collection id hash.
   * Collection id hash are generated as sha256 hash of (`creator_address::collection_name`)
   *
   * @param creatorAddress Collection creator address
   * @param collectionName The collection name
   * @returns The collection id hash
   */
  static getCollectionID(creatorAddress, collectionName) {
    const seed = new TextEncoder().encode(`${creatorAddress}::${collectionName}`);
    const hash = sha256.create();
    hash.update(seed);
    return HexString.fromUint8Array(hash.digest());
  }
  /**
   * This key is generated with Ed25519 scheme.
   * Public key is used to check a signature of transaction, signed by given account
   * @returns The public key for the associated account
   */
  pubKey() {
    return HexString.fromUint8Array(this.signingKey.publicKey);
  }
  /**
   * Signs specified `buffer` with account's private key
   * @param buffer A buffer to sign
   * @returns A signature HexString
   */
  signBuffer(buffer) {
    const signature = nacl2.sign.detached(buffer, this.signingKey.secretKey);
    return HexString.fromUint8Array(signature);
  }
  /**
   * Signs specified `hexString` with account's private key
   * @param hexString A regular string or HexString to sign
   * @returns A signature HexString
   */
  signHexString(hexString) {
    const toSign = HexString.ensure(hexString).toUint8Array();
    return this.signBuffer(toSign);
  }
  /**
   * Verifies the signature of the message with the public key of the account
   * @param message a signed message
   * @param signature the signature of the message
   */
  verifySignature(message, signature) {
    const rawMessage = HexString.ensure(message).toUint8Array();
    const rawSignature = HexString.ensure(signature).toUint8Array();
    return nacl2.sign.detached.verify(rawMessage, rawSignature, this.signingKey.publicKey);
  }
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
  toPrivateKeyObject() {
    return {
      address: this.address().hex(),
      publicKeyHex: this.pubKey().hex(),
      privateKeyHex: HexString.fromUint8Array(this.signingKey.secretKey.slice(0, 32)).hex()
    };
  }
};
__decorateClass([
  Memoize()
], _AptosAccount.prototype, "authKey", 1);
var AptosAccount = _AptosAccount;
function getAddressFromAccountOrAddress(accountOrAddress) {
  return accountOrAddress instanceof AptosAccount ? accountOrAddress.address() : HexString.ensure(accountOrAddress);
}

// src/indexer/generated/queries.ts
var CurrentTokenOwnershipFieldsFragmentDoc = `
    fragment CurrentTokenOwnershipFields on current_token_ownerships_v2 {
  token_standard
  token_properties_mutated_v1
  token_data_id
  table_type_v1
  storage_id
  property_version_v1
  owner_address
  last_transaction_version
  last_transaction_timestamp
  is_soulbound_v2
  is_fungible_v2
  amount
  current_token_data {
    collection_id
    description
    is_fungible_v2
    largest_property_version_v1
    last_transaction_timestamp
    last_transaction_version
    maximum
    supply
    token_data_id
    token_name
    token_properties
    token_standard
    token_uri
    current_collection {
      collection_id
      collection_name
      creator_address
      current_supply
      description
      last_transaction_timestamp
      last_transaction_version
      max_supply
      mutable_description
      mutable_uri
      table_handle_v1
      token_standard
      total_minted_v2
      uri
    }
  }
}
    `;
var TokenDataFieldsFragmentDoc = `
    fragment TokenDataFields on current_token_datas {
  creator_address
  collection_name
  description
  metadata_uri
  name
  token_data_id_hash
  collection_data_id_hash
}
    `;
var CollectionDataFieldsFragmentDoc = `
    fragment CollectionDataFields on current_collection_datas {
  metadata_uri
  supply
  description
  collection_name
  collection_data_id_hash
  table_handle
  creator_address
}
    `;
var TokenActivitiesFieldsFragmentDoc = `
    fragment TokenActivitiesFields on token_activities_v2 {
  after_value
  before_value
  entry_function_id_str
  event_account_address
  event_index
  from_address
  is_fungible_v2
  property_version_v1
  to_address
  token_amount
  token_data_id
  token_standard
  transaction_timestamp
  transaction_version
  type
}
    `;
var GetAccountCoinsDataCount = `
    query getAccountCoinsDataCount($address: String) {
  current_fungible_asset_balances_aggregate(
    where: {owner_address: {_eq: $address}}
  ) {
    aggregate {
      count
    }
  }
}
    `;
var GetAccountCoinsData = `
    query getAccountCoinsData($where_condition: current_fungible_asset_balances_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_fungible_asset_balances_order_by!]) {
  current_fungible_asset_balances(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    amount
    asset_type
    is_frozen
    is_primary
    last_transaction_timestamp
    last_transaction_version
    owner_address
    storage_id
    token_standard
    metadata {
      token_standard
      symbol
      supply_aggregator_table_key_v1
      supply_aggregator_table_handle_v1
      project_uri
      name
      last_transaction_version
      last_transaction_timestamp
      icon_uri
      decimals
      creator_address
      asset_type
    }
  }
}
    `;
var GetAccountCurrentTokens = `
    query getAccountCurrentTokens($address: String!, $offset: Int, $limit: Int) {
  current_token_ownerships(
    where: {owner_address: {_eq: $address}, amount: {_gt: 0}}
    order_by: [{last_transaction_version: desc}, {creator_address: asc}, {collection_name: asc}, {name: asc}]
    offset: $offset
    limit: $limit
  ) {
    amount
    current_token_data {
      ...TokenDataFields
    }
    current_collection_data {
      ...CollectionDataFields
    }
    last_transaction_version
    property_version
  }
}
    ${TokenDataFieldsFragmentDoc}
${CollectionDataFieldsFragmentDoc}`;
var GetAccountTokensCount = `
    query getAccountTokensCount($where_condition: current_token_ownerships_v2_bool_exp, $offset: Int, $limit: Int) {
  current_token_ownerships_v2_aggregate(
    where: $where_condition
    offset: $offset
    limit: $limit
  ) {
    aggregate {
      count
    }
  }
}
    `;
var GetAccountTransactionsCount = `
    query getAccountTransactionsCount($address: String) {
  account_transactions_aggregate(where: {account_address: {_eq: $address}}) {
    aggregate {
      count
    }
  }
}
    `;
var GetAccountTransactionsData = `
    query getAccountTransactionsData($where_condition: account_transactions_bool_exp!, $offset: Int, $limit: Int, $order_by: [account_transactions_order_by!]) {
  account_transactions(
    where: $where_condition
    order_by: $order_by
    limit: $limit
    offset: $offset
  ) {
    token_activities_v2 {
      ...TokenActivitiesFields
    }
    transaction_version
    account_address
  }
}
    ${TokenActivitiesFieldsFragmentDoc}`;
var GetCollectionData = `
    query getCollectionData($where_condition: current_collections_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_collections_v2_order_by!]) {
  current_collections_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    collection_id
    collection_name
    creator_address
    current_supply
    description
    last_transaction_timestamp
    last_transaction_version
    max_supply
    mutable_description
    mutable_uri
    table_handle_v1
    token_standard
    total_minted_v2
    uri
  }
}
    `;
var GetCollectionsWithOwnedTokens = `
    query getCollectionsWithOwnedTokens($where_condition: current_collection_ownership_v2_view_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_collection_ownership_v2_view_order_by!]) {
  current_collection_ownership_v2_view(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    current_collection {
      collection_id
      collection_name
      creator_address
      current_supply
      description
      last_transaction_timestamp
      last_transaction_version
      mutable_description
      max_supply
      mutable_uri
      table_handle_v1
      token_standard
      total_minted_v2
      uri
    }
    collection_id
    collection_name
    collection_uri
    creator_address
    distinct_tokens
    last_transaction_version
    owner_address
    single_token_uri
  }
}
    `;
var GetCurrentObjects = `
    query getCurrentObjects($where_condition: current_objects_bool_exp, $offset: Int, $limit: Int, $order_by: [current_objects_order_by!]) {
  current_objects(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    allow_ungated_transfer
    state_key_hash
    owner_address
    object_address
    last_transaction_version
    last_guid_creation_num
    is_deleted
  }
}
    `;
var GetDelegatedStakingActivities = `
    query getDelegatedStakingActivities($delegatorAddress: String, $poolAddress: String) {
  delegated_staking_activities(
    where: {delegator_address: {_eq: $delegatorAddress}, pool_address: {_eq: $poolAddress}}
  ) {
    amount
    delegator_address
    event_index
    event_type
    pool_address
    transaction_version
  }
}
    `;
var GetIndexerLedgerInfo = `
    query getIndexerLedgerInfo {
  ledger_infos {
    chain_id
  }
}
    `;
var GetNumberOfDelegators = `
    query getNumberOfDelegators($poolAddress: String) {
  num_active_delegator_per_pool(
    where: {pool_address: {_eq: $poolAddress}, num_active_delegator: {_gt: "0"}}
    distinct_on: pool_address
  ) {
    num_active_delegator
    pool_address
  }
}
    `;
var GetOwnedTokens = `
    query getOwnedTokens($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {
  current_token_ownerships_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    ...CurrentTokenOwnershipFields
  }
}
    ${CurrentTokenOwnershipFieldsFragmentDoc}`;
var GetOwnedTokensByTokenData = `
    query getOwnedTokensByTokenData($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {
  current_token_ownerships_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    ...CurrentTokenOwnershipFields
  }
}
    ${CurrentTokenOwnershipFieldsFragmentDoc}`;
var GetTokenActivities = `
    query getTokenActivities($where_condition: token_activities_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [token_activities_v2_order_by!]) {
  token_activities_v2(
    where: $where_condition
    order_by: $order_by
    offset: $offset
    limit: $limit
  ) {
    ...TokenActivitiesFields
  }
}
    ${TokenActivitiesFieldsFragmentDoc}`;
var GetTokenActivitiesCount = `
    query getTokenActivitiesCount($token_id: String) {
  token_activities_v2_aggregate(where: {token_data_id: {_eq: $token_id}}) {
    aggregate {
      count
    }
  }
}
    `;
var GetTokenCurrentOwnerData = `
    query getTokenCurrentOwnerData($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {
  current_token_ownerships_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    ...CurrentTokenOwnershipFields
  }
}
    ${CurrentTokenOwnershipFieldsFragmentDoc}`;
var GetTokenData = `
    query getTokenData($where_condition: current_token_datas_v2_bool_exp, $offset: Int, $limit: Int, $order_by: [current_token_datas_v2_order_by!]) {
  current_token_datas_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    collection_id
    description
    is_fungible_v2
    largest_property_version_v1
    last_transaction_timestamp
    last_transaction_version
    maximum
    supply
    token_data_id
    token_name
    token_properties
    token_standard
    token_uri
    current_collection {
      collection_id
      collection_name
      creator_address
      current_supply
      description
      last_transaction_timestamp
      last_transaction_version
      max_supply
      mutable_description
      mutable_uri
      table_handle_v1
      token_standard
      total_minted_v2
      uri
    }
  }
}
    `;
var GetTokenOwnedFromCollection = `
    query getTokenOwnedFromCollection($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {
  current_token_ownerships_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    ...CurrentTokenOwnershipFields
  }
}
    ${CurrentTokenOwnershipFieldsFragmentDoc}`;
var GetTokenOwnersData = `
    query getTokenOwnersData($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {
  current_token_ownerships_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    ...CurrentTokenOwnershipFields
  }
}
    ${CurrentTokenOwnershipFieldsFragmentDoc}`;
var GetTopUserTransactions = `
    query getTopUserTransactions($limit: Int) {
  user_transactions(limit: $limit, order_by: {version: desc}) {
    version
  }
}
    `;
var GetUserTransactions = `
    query getUserTransactions($where_condition: user_transactions_bool_exp!, $offset: Int, $limit: Int, $order_by: [user_transactions_order_by!]) {
  user_transactions(
    order_by: $order_by
    where: $where_condition
    limit: $limit
    offset: $offset
  ) {
    version
  }
}
    `;

// src/transaction_builder/builder.ts
import { sha3_256 as sha3Hash4 } from "@noble/hashes/sha3";

// src/transaction_builder/builder_utils.ts
function assertType(val, types, message) {
  if (!(types == null ? void 0 : types.includes(typeof val))) {
    throw new Error(
      message || `Invalid arg: ${val} type should be ${types instanceof Array ? types.join(" or ") : types}`
    );
  }
}
function ensureBoolean(val) {
  assertType(val, ["boolean", "string"]);
  if (typeof val === "boolean") {
    return val;
  }
  if (val === "true") {
    return true;
  }
  if (val === "false") {
    return false;
  }
  throw new Error("Invalid boolean string.");
}
function ensureNumber(val) {
  assertType(val, ["number", "string"]);
  if (typeof val === "number") {
    return val;
  }
  const res = Number.parseInt(val, 10);
  if (Number.isNaN(res)) {
    throw new Error("Invalid number string.");
  }
  return res;
}
function ensureBigInt(val) {
  assertType(val, ["number", "bigint", "string"]);
  return BigInt(val);
}
function serializeArg(argVal, argType, serializer) {
  serializeArgInner(argVal, argType, serializer, 0);
}
function serializeArgInner(argVal, argType, serializer, depth) {
  if (argType instanceof TypeTagBool) {
    serializer.serializeBool(ensureBoolean(argVal));
  } else if (argType instanceof TypeTagU8) {
    serializer.serializeU8(ensureNumber(argVal));
  } else if (argType instanceof TypeTagU16) {
    serializer.serializeU16(ensureNumber(argVal));
  } else if (argType instanceof TypeTagU32) {
    serializer.serializeU32(ensureNumber(argVal));
  } else if (argType instanceof TypeTagU64) {
    serializer.serializeU64(ensureBigInt(argVal));
  } else if (argType instanceof TypeTagU128) {
    serializer.serializeU128(ensureBigInt(argVal));
  } else if (argType instanceof TypeTagU256) {
    serializer.serializeU256(ensureBigInt(argVal));
  } else if (argType instanceof TypeTagAddress) {
    serializeAddress(argVal, serializer);
  } else if (argType instanceof TypeTagVector) {
    serializeVector2(argVal, argType, serializer, depth);
  } else if (argType instanceof TypeTagStruct) {
    serializeStruct(argVal, argType, serializer, depth);
  } else {
    throw new Error("Unsupported arg type.");
  }
}
function serializeAddress(argVal, serializer) {
  let addr;
  if (typeof argVal === "string" || argVal instanceof HexString) {
    addr = AccountAddress.fromHex(argVal);
  } else if (argVal instanceof AccountAddress) {
    addr = argVal;
  } else {
    throw new Error("Invalid account address.");
  }
  addr.serialize(serializer);
}
function serializeVector2(argVal, argType, serializer, depth) {
  if (argType.value instanceof TypeTagU8) {
    if (argVal instanceof Uint8Array) {
      serializer.serializeBytes(argVal);
      return;
    }
    if (argVal instanceof HexString) {
      serializer.serializeBytes(argVal.toUint8Array());
      return;
    }
    if (typeof argVal === "string") {
      serializer.serializeStr(argVal);
      return;
    }
  }
  if (!Array.isArray(argVal)) {
    throw new Error("Invalid vector args.");
  }
  serializer.serializeU32AsUleb128(argVal.length);
  argVal.forEach((arg) => serializeArgInner(arg, argType.value, serializer, depth + 1));
}
function serializeStruct(argVal, argType, serializer, depth) {
  const { address, module_name: moduleName, name, type_args: typeArgs } = argType.value;
  const structType = `${HexString.fromUint8Array(address.address).toShortString()}::${moduleName.value}::${name.value}`;
  if (structType === "0x1::string::String") {
    assertType(argVal, ["string"]);
    serializer.serializeStr(argVal);
  } else if (structType === "0x1::object::Object") {
    serializeAddress(argVal, serializer);
  } else if (structType === "0x1::option::Option") {
    if (typeArgs.length !== 1) {
      throw new Error(`Option has the wrong number of type arguments ${typeArgs.length}`);
    }
    serializeOption(argVal, typeArgs[0], serializer, depth);
  } else {
    throw new Error("Unsupported struct type in function argument");
  }
}
function serializeOption(argVal, argType, serializer, depth) {
  if (argVal === void 0 || argVal === null) {
    serializer.serializeU32AsUleb128(0);
  } else {
    serializer.serializeU32AsUleb128(1);
    serializeArgInner(argVal, argType, serializer, depth + 1);
  }
}
function argToTransactionArgument(argVal, argType) {
  if (argType instanceof TypeTagBool) {
    return new TransactionArgumentBool(ensureBoolean(argVal));
  }
  if (argType instanceof TypeTagU8) {
    return new TransactionArgumentU8(ensureNumber(argVal));
  }
  if (argType instanceof TypeTagU16) {
    return new TransactionArgumentU16(ensureNumber(argVal));
  }
  if (argType instanceof TypeTagU32) {
    return new TransactionArgumentU32(ensureNumber(argVal));
  }
  if (argType instanceof TypeTagU64) {
    return new TransactionArgumentU64(ensureBigInt(argVal));
  }
  if (argType instanceof TypeTagU128) {
    return new TransactionArgumentU128(ensureBigInt(argVal));
  }
  if (argType instanceof TypeTagU256) {
    return new TransactionArgumentU256(ensureBigInt(argVal));
  }
  if (argType instanceof TypeTagAddress) {
    let addr;
    if (typeof argVal === "string" || argVal instanceof HexString) {
      addr = AccountAddress.fromHex(argVal);
    } else if (argVal instanceof AccountAddress) {
      addr = argVal;
    } else {
      throw new Error("Invalid account address.");
    }
    return new TransactionArgumentAddress(addr);
  }
  if (argType instanceof TypeTagVector && argType.value instanceof TypeTagU8) {
    if (!(argVal instanceof Uint8Array)) {
      throw new Error(`${argVal} should be an instance of Uint8Array`);
    }
    return new TransactionArgumentU8Vector(argVal);
  }
  throw new Error("Unknown type for TransactionArgument.");
}

// src/transaction_builder/builder.ts
var RAW_TRANSACTION_SALT = "APTOS::RawTransaction";
var RAW_TRANSACTION_WITH_DATA_SALT = "APTOS::RawTransactionWithData";
var TransactionBuilder = class {
  constructor(signingFunction, rawTxnBuilder) {
    this.rawTxnBuilder = rawTxnBuilder;
    this.signingFunction = signingFunction;
  }
  /**
   * Builds a RawTransaction. Relays the call to TransactionBuilderABI.build
   * @param func
   * @param ty_tags
   * @param args
   */
  build(func, ty_tags, args) {
    if (!this.rawTxnBuilder) {
      throw new Error("this.rawTxnBuilder doesn't exist.");
    }
    return this.rawTxnBuilder.build(func, ty_tags, args);
  }
  /** Generates a Signing Message out of a raw transaction. */
  static getSigningMessage(rawTxn) {
    const hash = sha3Hash4.create();
    if (rawTxn instanceof RawTransaction) {
      hash.update(RAW_TRANSACTION_SALT);
    } else if (rawTxn instanceof MultiAgentRawTransaction) {
      hash.update(RAW_TRANSACTION_WITH_DATA_SALT);
    } else if (rawTxn instanceof FeePayerRawTransaction) {
      hash.update(RAW_TRANSACTION_WITH_DATA_SALT);
    } else {
      throw new Error("Unknown transaction type.");
    }
    const prefix = hash.digest();
    const body = bcsToBytes(rawTxn);
    const mergedArray = new Uint8Array(prefix.length + body.length);
    mergedArray.set(prefix);
    mergedArray.set(body, prefix.length);
    return mergedArray;
  }
};
var TransactionBuilderEd25519 = class extends TransactionBuilder {
  constructor(signingFunction, publicKey, rawTxnBuilder) {
    super(signingFunction, rawTxnBuilder);
    this.publicKey = publicKey;
  }
  rawToSigned(rawTxn) {
    const signingMessage = TransactionBuilder.getSigningMessage(rawTxn);
    const signature = this.signingFunction(signingMessage);
    const authenticator = new TransactionAuthenticatorEd25519(
      new Ed25519PublicKey(this.publicKey),
      signature
    );
    return new SignedTransaction(rawTxn, authenticator);
  }
  /** Signs a raw transaction and returns a bcs serialized transaction. */
  sign(rawTxn) {
    return bcsToBytes(this.rawToSigned(rawTxn));
  }
};
var TransactionBuilderMultiEd25519 = class extends TransactionBuilder {
  constructor(signingFunction, publicKey) {
    super(signingFunction);
    this.publicKey = publicKey;
  }
  rawToSigned(rawTxn) {
    const signingMessage = TransactionBuilder.getSigningMessage(rawTxn);
    const signature = this.signingFunction(signingMessage);
    const authenticator = new TransactionAuthenticatorMultiEd25519(this.publicKey, signature);
    return new SignedTransaction(rawTxn, authenticator);
  }
  /** Signs a raw transaction and returns a bcs serialized transaction. */
  sign(rawTxn) {
    return bcsToBytes(this.rawToSigned(rawTxn));
  }
};
var TransactionBuilderABI = class _TransactionBuilderABI {
  /**
   * Constructs a TransactionBuilderABI instance
   * @param abis List of binary ABIs.
   * @param builderConfig Configs for creating a raw transaction.
   */
  constructor(abis, builderConfig) {
    this.abiMap = /* @__PURE__ */ new Map();
    abis.forEach((abi) => {
      const deserializer = new Deserializer(abi);
      const scriptABI = ScriptABI.deserialize(deserializer);
      let k;
      if (scriptABI instanceof EntryFunctionABI) {
        const funcABI = scriptABI;
        const { address: addr, name: moduleName } = funcABI.module_name;
        k = `${HexString.fromUint8Array(addr.address).toShortString()}::${moduleName.value}::${funcABI.name}`;
      } else {
        const funcABI = scriptABI;
        k = funcABI.name;
      }
      if (this.abiMap.has(k)) {
        throw new Error("Found conflicting ABI interfaces");
      }
      this.abiMap.set(k, scriptABI);
    });
    this.builderConfig = {
      maxGasAmount: BigInt(DEFAULT_MAX_GAS_AMOUNT),
      expSecFromNow: DEFAULT_TXN_EXP_SEC_FROM_NOW,
      ...builderConfig
    };
  }
  static toBCSArgs(abiArgs, args) {
    if (abiArgs.length !== args.length) {
      throw new Error("Wrong number of args provided.");
    }
    return args.map((arg, i) => {
      const serializer = new Serializer();
      serializeArg(arg, abiArgs[i].type_tag, serializer);
      return serializer.getBytes();
    });
  }
  static toTransactionArguments(abiArgs, args) {
    if (abiArgs.length !== args.length) {
      throw new Error("Wrong number of args provided.");
    }
    return args.map((arg, i) => argToTransactionArgument(arg, abiArgs[i].type_tag));
  }
  setSequenceNumber(seqNumber) {
    this.builderConfig.sequenceNumber = BigInt(seqNumber);
  }
  /**
   * Builds a TransactionPayload. For dApps, chain ID and account sequence numbers are only known to the wallet.
   * Instead of building a RawTransaction (requires chainID and sequenceNumber), dApps can build a TransactionPayload
   * and pass the payload to the wallet for signing and sending.
   * @param func Fully qualified func names, e.g. 0x1::aptos_account::transfer
   * @param ty_tags TypeTag strings
   * @param args Function arguments
   * @returns TransactionPayload
   */
  buildTransactionPayload(func, ty_tags, args) {
    const typeTags = ty_tags.map((ty_arg) => new TypeTagParser(ty_arg).parseTypeTag());
    let payload;
    if (!this.abiMap.has(func)) {
      throw new Error(`Cannot find function: ${func}`);
    }
    const scriptABI = this.abiMap.get(func);
    if (scriptABI instanceof EntryFunctionABI) {
      const funcABI = scriptABI;
      const bcsArgs = _TransactionBuilderABI.toBCSArgs(funcABI.args, args);
      payload = new TransactionPayloadEntryFunction(
        new EntryFunction(funcABI.module_name, new Identifier(funcABI.name), typeTags, bcsArgs)
      );
    } else if (scriptABI instanceof TransactionScriptABI) {
      const funcABI = scriptABI;
      const scriptArgs = _TransactionBuilderABI.toTransactionArguments(funcABI.args, args);
      payload = new TransactionPayloadScript(new Script(funcABI.code, typeTags, scriptArgs));
    } else {
      throw new Error("Unknown ABI format.");
    }
    return payload;
  }
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
  build(func, ty_tags, args) {
    const { sender, sequenceNumber, gasUnitPrice, maxGasAmount, expSecFromNow, chainId } = this.builderConfig;
    if (!gasUnitPrice) {
      throw new Error("No gasUnitPrice provided.");
    }
    const senderAccount = sender instanceof AccountAddress ? sender : AccountAddress.fromHex(sender);
    const expTimestampSec = BigInt(Math.floor(Date.now() / 1e3) + Number(expSecFromNow));
    const payload = this.buildTransactionPayload(func, ty_tags, args);
    if (payload) {
      return new RawTransaction(
        senderAccount,
        BigInt(sequenceNumber),
        payload,
        BigInt(maxGasAmount),
        BigInt(gasUnitPrice),
        expTimestampSec,
        new ChainId(Number(chainId))
      );
    }
    throw new Error("Invalid ABI.");
  }
};
var TransactionBuilderRemoteABI = class {
  // We don't want the builder to depend on the actual AptosClient. There might be circular dependencies.
  constructor(aptosClient2, builderConfig) {
    this.aptosClient = aptosClient2;
    this.builderConfig = builderConfig;
  }
  async fetchABI(addr) {
    const modules = await this.aptosClient.getAccountModules(addr);
    const abis = modules.map((module) => module.abi).flatMap(
      (abi) => abi.exposed_functions.filter((ef) => ef.is_entry).map(
        (ef) => ({
          fullName: `${abi.address}::${abi.name}::${ef.name}`,
          ...ef
        })
      )
    );
    const abiMap = /* @__PURE__ */ new Map();
    abis.forEach((abi) => {
      abiMap.set(abi.fullName, abi);
    });
    return abiMap;
  }
  /**
   * Builds a raw transaction. Only support script function a.k.a entry function payloads
   *
   * @param func fully qualified function name in format <address>::<module>::<function>, e.g. 0x1::coin::transfer
   * @param ty_tags
   * @param args
   * @returns RawTransaction
   */
  async build(func, ty_tags, args) {
    const normlize = (s) => s.replace(/^0[xX]0*/g, "0x");
    func = normlize(func);
    const funcNameParts = func.split("::");
    if (funcNameParts.length !== 3) {
      throw new Error(
        // eslint-disable-next-line max-len
        "'func' needs to be a fully qualified function name in format <address>::<module>::<function>, e.g. 0x1::coin::transfer"
      );
    }
    const [addr, module] = func.split("::");
    const abiMap = await this.fetchABI(addr);
    if (!abiMap.has(func)) {
      throw new Error(`${func} doesn't exist.`);
    }
    const funcAbi = abiMap.get(func);
    const abiArgs = funcAbi.params.filter((param) => param !== "signer" && param !== "&signer");
    const typeArgABIs = abiArgs.map(
      (abiArg, i) => new ArgumentABI(`var${i}`, new TypeTagParser(abiArg, ty_tags).parseTypeTag())
    );
    const entryFunctionABI = new EntryFunctionABI(
      funcAbi.name,
      ModuleId.fromStr(`${addr}::${module}`),
      "",
      // Doc string
      funcAbi.generic_type_params.map((_, i) => new TypeArgumentABI(`${i}`)),
      typeArgABIs
    );
    const { sender, ...rest } = this.builderConfig;
    const senderAddress = sender instanceof AccountAddress ? HexString.fromUint8Array(sender.address) : sender;
    const [{ sequence_number: sequenceNumber }, chainId, { gas_estimate: gasUnitPrice }] = await Promise.all([
      (rest == null ? void 0 : rest.sequenceNumber) ? Promise.resolve({ sequence_number: rest == null ? void 0 : rest.sequenceNumber }) : this.aptosClient.getAccount(senderAddress),
      (rest == null ? void 0 : rest.chainId) ? Promise.resolve(rest == null ? void 0 : rest.chainId) : this.aptosClient.getChainId(),
      (rest == null ? void 0 : rest.gasUnitPrice) ? Promise.resolve({ gas_estimate: rest == null ? void 0 : rest.gasUnitPrice }) : this.aptosClient.estimateGasPrice()
    ]);
    const builderABI = new TransactionBuilderABI([bcsToBytes(entryFunctionABI)], {
      sender,
      sequenceNumber,
      chainId,
      gasUnitPrice: BigInt(gasUnitPrice),
      ...rest
    });
    return builderABI.build(func, ty_tags, args);
  }
};
__decorateClass([
  MemoizeExpiring(10 * 60 * 1e3)
], TransactionBuilderRemoteABI.prototype, "fetchABI", 1);

// src/providers/aptos_client.ts
var _AptosClient = class _AptosClient {
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
  constructor(nodeUrl, config, doNotFixNodeUrl = false) {
    if (!nodeUrl) {
      throw new Error("Node URL cannot be empty.");
    }
    if (doNotFixNodeUrl) {
      this.nodeUrl = nodeUrl;
    } else {
      this.nodeUrl = fixNodeUrl(nodeUrl);
    }
    this.config = config === void 0 || config === null ? {} : { ...config };
  }
  async getAccount(accountAddress) {
    const { data } = await get({
      url: this.nodeUrl,
      endpoint: `accounts/${HexString.ensure(accountAddress).hex()}`,
      originMethod: "getAccount",
      overrides: { ...this.config }
    });
    return data;
  }
  async getAccountTransactions(accountAddress, query) {
    const { data } = await get({
      url: this.nodeUrl,
      endpoint: `accounts/${HexString.ensure(accountAddress).hex()}/transactions`,
      originMethod: "getAccountTransactions",
      params: { start: query == null ? void 0 : query.start, limit: query == null ? void 0 : query.limit },
      overrides: { ...this.config }
    });
    return data;
  }
  async getAccountModules(accountAddress, query) {
    const out = await paginateWithCursor({
      url: this.nodeUrl,
      endpoint: `accounts/${accountAddress}/modules`,
      params: { ledger_version: query == null ? void 0 : query.ledgerVersion, limit: 1e3 },
      originMethod: "getAccountModules",
      overrides: { ...this.config }
    });
    return out;
  }
  async getAccountModule(accountAddress, moduleName, query) {
    const { data } = await get({
      url: this.nodeUrl,
      endpoint: `accounts/${HexString.ensure(accountAddress).hex()}/module/${moduleName}`,
      originMethod: "getAccountModule",
      params: { ledger_version: query == null ? void 0 : query.ledgerVersion },
      overrides: { ...this.config }
    });
    return data;
  }
  async getAccountResources(accountAddress, query) {
    const out = await paginateWithCursor({
      url: this.nodeUrl,
      endpoint: `accounts/${accountAddress}/resources`,
      params: { ledger_version: query == null ? void 0 : query.ledgerVersion, limit: 9999 },
      originMethod: "getAccountResources",
      overrides: { ...this.config }
    });
    return out;
  }
  async getAccountResource(accountAddress, resourceType, query) {
    const { data } = await get({
      url: this.nodeUrl,
      endpoint: `accounts/${HexString.ensure(accountAddress).hex()}/resource/${resourceType}`,
      originMethod: "getAccountResource",
      params: { ledger_version: query == null ? void 0 : query.ledgerVersion },
      overrides: { ...this.config }
    });
    return data;
  }
  /** Generates a signed transaction that can be submitted to the chain for execution. */
  static generateBCSTransaction(accountFrom, rawTxn) {
    const txnBuilder = new TransactionBuilderEd25519((signingMessage) => {
      const sigHexStr = accountFrom.signBuffer(signingMessage);
      return new aptos_types_exports.Ed25519Signature(sigHexStr.toUint8Array());
    }, accountFrom.pubKey().toUint8Array());
    return txnBuilder.sign(rawTxn);
  }
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
  static generateBCSSimulation(accountFrom, rawTxn) {
    const txnBuilder = new TransactionBuilderEd25519((_signingMessage) => {
      const invalidSigBytes = new Uint8Array(64);
      return new aptos_types_exports.Ed25519Signature(invalidSigBytes);
    }, accountFrom.pubKey().toUint8Array());
    return txnBuilder.sign(rawTxn);
  }
  /** Generates an entry function transaction request that can be submitted to produce a raw transaction that
   * can be signed, which upon being signed can be submitted to the blockchain
   * This function fetches the remote ABI and uses it to serialized the data, therefore
   * users don't need to handle serialization by themselves.
   * @param sender Hex-encoded 32 byte Aptos account address of transaction sender
   * @param payload Entry function transaction payload type
   * @param options Options allow to overwrite default transaction options.
   * @returns A raw transaction object
   */
  async generateTransaction(sender, payload, options) {
    const config = { sender };
    if (options == null ? void 0 : options.sequence_number) {
      config.sequenceNumber = options.sequence_number;
    }
    if (options == null ? void 0 : options.gas_unit_price) {
      config.gasUnitPrice = options.gas_unit_price;
    }
    if (options == null ? void 0 : options.max_gas_amount) {
      config.maxGasAmount = options.max_gas_amount;
    }
    if (options == null ? void 0 : options.expiration_timestamp_secs) {
      const timestamp = Number.parseInt(options.expiration_timestamp_secs, 10);
      config.expSecFromNow = timestamp - Math.floor(Date.now() / 1e3);
    }
    const builder = new TransactionBuilderRemoteABI(this, config);
    return builder.build(payload.function, payload.type_arguments, payload.arguments);
  }
  /**
   * Generates a fee payer transaction that can be signed and submitted to chain
   *
   * @param sender the sender's account address
   * @param payload the transaction payload
   * @param fee_payer the fee payer account
   * @param secondarySignerAccounts an optional array of the secondary signers accounts
   * @returns a fee payer raw transaction that can be signed and submitted to chain
   */
  async generateFeePayerTransaction(sender, payload, feePayer, secondarySignerAccounts = [], options) {
    const rawTxn = await this.generateTransaction(sender, payload, options);
    const signers = secondarySignerAccounts.map((signer) => AccountAddress.fromHex(signer));
    const feePayerTxn = new aptos_types_exports.FeePayerRawTransaction(rawTxn, signers, AccountAddress.fromHex(feePayer));
    return feePayerTxn;
  }
  /**
   * Submits fee payer transaction to chain
   *
   * @param feePayerTransaction the raw transaction to be submitted, of type FeePayerRawTransaction
   * @param senderAuthenticator the sender account authenticator (can get from signMultiTransaction() method)
   * @param feePayerAuthenticator the feepayer account authenticator (can get from signMultiTransaction() method)
   * @param signersAuthenticators an optional array of the signer account authenticators
   * @returns The pending transaction
   */
  async submitFeePayerTransaction(feePayerTransaction, senderAuthenticator, feePayerAuthenticator, additionalSignersAuthenticators = []) {
    const txAuthenticatorFeePayer = new aptos_types_exports.TransactionAuthenticatorFeePayer(
      senderAuthenticator,
      feePayerTransaction.secondary_signer_addresses,
      additionalSignersAuthenticators,
      { address: feePayerTransaction.fee_payer_address, authenticator: feePayerAuthenticator }
    );
    const bcsTxn = bcsToBytes(
      new aptos_types_exports.SignedTransaction(feePayerTransaction.raw_txn, txAuthenticatorFeePayer)
    );
    const transactionRes = await this.submitSignedBCSTransaction(bcsTxn);
    return transactionRes;
  }
  /**
   * Signs a multi transaction type (multi agent / fee payer) and returns the
   * signer authenticator to be used to submit the transaction.
   *
   * @param signer the account to sign on the transaction
   * @param rawTxn a MultiAgentRawTransaction or FeePayerRawTransaction
   * @returns signer authenticator
   */
  // eslint-disable-next-line class-methods-use-this
  async signMultiTransaction(signer, rawTxn) {
    const signerSignature = new aptos_types_exports.Ed25519Signature(
      signer.signBuffer(TransactionBuilder.getSigningMessage(rawTxn)).toUint8Array()
    );
    const signerAuthenticator = new aptos_types_exports.AccountAuthenticatorEd25519(
      new aptos_types_exports.Ed25519PublicKey(signer.signingKey.publicKey),
      signerSignature
    );
    return Promise.resolve(signerAuthenticator);
  }
  /** Converts a transaction request produced by `generateTransaction` into a properly
   * signed transaction, which can then be submitted to the blockchain
   * @param accountFrom AptosAccount of transaction sender
   * @param rawTransaction A raw transaction generated by `generateTransaction` method
   * @returns A transaction, signed with sender account
   */
  // eslint-disable-next-line class-methods-use-this
  async signTransaction(accountFrom, rawTransaction) {
    return Promise.resolve(_AptosClient.generateBCSTransaction(accountFrom, rawTransaction));
  }
  async getEventsByCreationNumber(address, creationNumber, query) {
    const { data } = await get({
      url: this.nodeUrl,
      endpoint: `accounts/${HexString.ensure(address).hex()}/events/${creationNumber}`,
      originMethod: "getEventsByCreationNumber",
      params: { start: query == null ? void 0 : query.start, limit: query == null ? void 0 : query.limit },
      overrides: { ...this.config }
    });
    return data;
  }
  async getEventsByEventHandle(address, eventHandleStruct, fieldName, query) {
    const { data } = await get({
      url: this.nodeUrl,
      endpoint: `accounts/${HexString.ensure(address).hex()}/events/${eventHandleStruct}/${fieldName}`,
      originMethod: "getEventsByEventHandle",
      params: { start: query == null ? void 0 : query.start, limit: query == null ? void 0 : query.limit },
      overrides: { ...this.config }
    });
    return data;
  }
  /**
   * Submits a signed transaction to the transaction endpoint.
   * @param signedTxn A transaction, signed by `signTransaction` method
   * @returns Transaction that is accepted and submitted to mempool
   */
  async submitTransaction(signedTxn) {
    return this.submitSignedBCSTransaction(signedTxn);
  }
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
  async simulateTransaction(accountOrPubkey, rawTransaction, query) {
    let signedTxn;
    if (accountOrPubkey instanceof AptosAccount) {
      signedTxn = _AptosClient.generateBCSSimulation(accountOrPubkey, rawTransaction);
    } else if (accountOrPubkey instanceof MultiEd25519PublicKey) {
      const txnBuilder = new TransactionBuilderMultiEd25519(() => {
        const { threshold } = accountOrPubkey;
        const bits = [];
        const signatures = [];
        for (let i = 0; i < threshold; i += 1) {
          bits.push(i);
          signatures.push(new aptos_types_exports.Ed25519Signature(new Uint8Array(64)));
        }
        const bitmap = aptos_types_exports.MultiEd25519Signature.createBitmap(bits);
        return new aptos_types_exports.MultiEd25519Signature(signatures, bitmap);
      }, accountOrPubkey);
      signedTxn = txnBuilder.sign(rawTransaction);
    } else {
      const txnBuilder = new TransactionBuilderEd25519(() => {
        const invalidSigBytes = new Uint8Array(64);
        return new aptos_types_exports.Ed25519Signature(invalidSigBytes);
      }, accountOrPubkey.toBytes());
      signedTxn = txnBuilder.sign(rawTransaction);
    }
    return this.submitBCSSimulation(signedTxn, query);
  }
  async submitSignedBCSTransaction(signedTxn) {
    const { data } = await post({
      url: this.nodeUrl,
      body: signedTxn,
      endpoint: "transactions",
      originMethod: "submitSignedBCSTransaction",
      contentType: "application/x.aptos.signed_transaction+bcs",
      overrides: { ...this.config }
    });
    return data;
  }
  async submitBCSSimulation(bcsBody, query) {
    var _a, _b, _c;
    const queryParams = {
      estimate_gas_unit_price: (_a = query == null ? void 0 : query.estimateGasUnitPrice) != null ? _a : false,
      estimate_max_gas_amount: (_b = query == null ? void 0 : query.estimateMaxGasAmount) != null ? _b : false,
      estimate_prioritized_gas_unit_price: (_c = query == null ? void 0 : query.estimatePrioritizedGasUnitPrice) != null ? _c : false
    };
    const { data } = await post({
      url: this.nodeUrl,
      body: bcsBody,
      endpoint: "transactions/simulate",
      params: queryParams,
      originMethod: "submitBCSSimulation",
      contentType: "application/x.aptos.signed_transaction+bcs",
      overrides: { ...this.config }
    });
    return data;
  }
  async getTransactions(query) {
    var _a;
    const { data } = await get({
      url: this.nodeUrl,
      endpoint: "transactions",
      originMethod: "getTransactions",
      params: { start: (_a = query == null ? void 0 : query.start) == null ? void 0 : _a.toString(), limit: query == null ? void 0 : query.limit },
      overrides: { ...this.config }
    });
    return data;
  }
  async getTransactionByHash(txnHash) {
    const { data } = await get({
      url: this.nodeUrl,
      endpoint: `transactions/by_hash/${txnHash}`,
      originMethod: "getTransactionByHash",
      overrides: { ...this.config }
    });
    return data;
  }
  async getTransactionByVersion(txnVersion) {
    const { data } = await get({
      url: this.nodeUrl,
      endpoint: `transactions/by_version/${txnVersion}`,
      originMethod: "getTransactionByVersion",
      overrides: { ...this.config }
    });
    return data;
  }
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
  async transactionPending(txnHash) {
    try {
      const response = await this.getTransactionByHash(txnHash);
      return response.type === "pending_transaction";
    } catch (e) {
      if ((e == null ? void 0 : e.status) === 404) {
        return true;
      }
      throw e;
    }
  }
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
  async waitForTransactionWithResult(txnHash, extraArgs) {
    var _a, _b;
    const timeoutSecs = (_a = extraArgs == null ? void 0 : extraArgs.timeoutSecs) != null ? _a : DEFAULT_TXN_TIMEOUT_SEC;
    const checkSuccess = (_b = extraArgs == null ? void 0 : extraArgs.checkSuccess) != null ? _b : false;
    let isPending = true;
    let count = 0;
    let lastTxn;
    while (isPending) {
      if (count >= timeoutSecs) {
        break;
      }
      try {
        lastTxn = await this.getTransactionByHash(txnHash);
        isPending = lastTxn.type === "pending_transaction";
        if (!isPending) {
          break;
        }
      } catch (e) {
        const isApiError = e instanceof ApiError;
        const isRequestError = isApiError && e.status !== 404 && e.status >= 400 && e.status < 500;
        if (!isApiError || isRequestError) {
          throw e;
        }
      }
      await sleep(1e3);
      count += 1;
    }
    if (lastTxn === void 0) {
      throw new Error(`Waiting for transaction ${txnHash} failed`);
    }
    if (isPending) {
      throw new WaitForTransactionError(
        `Waiting for transaction ${txnHash} timed out after ${timeoutSecs} seconds`,
        lastTxn
      );
    }
    if (!checkSuccess) {
      return lastTxn;
    }
    if (!(lastTxn == null ? void 0 : lastTxn.success)) {
      throw new FailedTransactionError(
        `Transaction ${txnHash} failed with an error: ${lastTxn.vm_status}`,
        lastTxn
      );
    }
    return lastTxn;
  }
  /**
   * This function works the same as `waitForTransactionWithResult` except it
   * doesn't return the transaction in those cases, it returns nothing. For
   * more information, see the documentation for `waitForTransactionWithResult`.
   */
  async waitForTransaction(txnHash, extraArgs) {
    await this.waitForTransactionWithResult(txnHash, extraArgs);
  }
  async getLedgerInfo() {
    const { data } = await get({
      url: this.nodeUrl,
      originMethod: "getLedgerInfo",
      overrides: { ...this.config }
    });
    return data;
  }
  async getChainId() {
    const result = await this.getLedgerInfo();
    return result.chain_id;
  }
  async getTableItem(handle, data, query) {
    var _a;
    const response = await post({
      url: this.nodeUrl,
      body: data,
      endpoint: `tables/${handle}/item`,
      originMethod: "getTableItem",
      params: { ledger_version: (_a = query == null ? void 0 : query.ledgerVersion) == null ? void 0 : _a.toString() },
      overrides: { ...this.config }
    });
    return response.data;
  }
  /**
   * Generates a raw transaction out of a transaction payload
   * @param accountFrom
   * @param payload
   * @param extraArgs
   * @returns A raw transaction object
   */
  async generateRawTransaction(accountFrom, payload, extraArgs) {
    const [{ sequence_number: sequenceNumber }, chainId, { gas_estimate: gasEstimate }] = await Promise.all([
      (extraArgs == null ? void 0 : extraArgs.providedSequenceNumber) ? Promise.resolve({ sequence_number: extraArgs.providedSequenceNumber }) : this.getAccount(accountFrom),
      this.getChainId(),
      (extraArgs == null ? void 0 : extraArgs.gasUnitPrice) ? Promise.resolve({ gas_estimate: extraArgs.gasUnitPrice }) : this.estimateGasPrice()
    ]);
    const { maxGasAmount, gasUnitPrice, expireTimestamp } = {
      maxGasAmount: BigInt(DEFAULT_MAX_GAS_AMOUNT),
      gasUnitPrice: BigInt(gasEstimate),
      expireTimestamp: BigInt(Math.floor(Date.now() / 1e3) + DEFAULT_TXN_EXP_SEC_FROM_NOW),
      ...extraArgs
    };
    return new aptos_types_exports.RawTransaction(
      aptos_types_exports.AccountAddress.fromHex(accountFrom),
      BigInt(sequenceNumber),
      payload,
      maxGasAmount,
      gasUnitPrice,
      expireTimestamp,
      new aptos_types_exports.ChainId(chainId)
    );
  }
  /**
   * Helper for generating, signing, and submitting a transaction.
   *
   * @param sender AptosAccount of transaction sender.
   * @param payload Transaction payload.
   * @param extraArgs Extra args for building the transaction payload.
   * @returns The transaction response from the API.
   */
  async generateSignSubmitTransaction(sender, payload, extraArgs) {
    const rawTransaction = await this.generateRawTransaction(sender.address(), payload, extraArgs);
    const bcsTxn = _AptosClient.generateBCSTransaction(sender, rawTransaction);
    const pendingTransaction = await this.submitSignedBCSTransaction(bcsTxn);
    return pendingTransaction.hash;
  }
  /**
   * Helper for signing and submitting a transaction.
   *
   * @param sender AptosAccount of transaction sender.
   * @param transaction A generated Raw transaction payload.
   * @returns The transaction response from the API.
   */
  async signAndSubmitTransaction(sender, transaction) {
    const bcsTxn = _AptosClient.generateBCSTransaction(sender, transaction);
    const pendingTransaction = await this.submitSignedBCSTransaction(bcsTxn);
    return pendingTransaction.hash;
  }
  /**
   * Publishes a move package. `packageMetadata` and `modules` can be generated with command
   * `aptos move compile --save-metadata [ --included-artifacts=<...> ]`.
   * @param sender
   * @param packageMetadata package metadata bytes
   * @param modules bytecodes of modules
   * @param extraArgs
   * @returns Transaction hash
   */
  async publishPackage(sender, packageMetadata, modules, extraArgs) {
    const codeSerializer = new Serializer();
    serializeVector(modules, codeSerializer);
    const payload = new aptos_types_exports.TransactionPayloadEntryFunction(
      aptos_types_exports.EntryFunction.natural(
        "0x1::code",
        "publish_package_txn",
        [],
        [bcsSerializeBytes(packageMetadata), codeSerializer.getBytes()]
      )
    );
    return this.generateSignSubmitTransaction(sender, payload, extraArgs);
  }
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
  async createResourceAccountAndPublishPackage(sender, seed, packageMetadata, modules, extraArgs) {
    const codeSerializer = new Serializer();
    serializeVector(modules, codeSerializer);
    const payload = new aptos_types_exports.TransactionPayloadEntryFunction(
      aptos_types_exports.EntryFunction.natural(
        "0x1::resource_account",
        "create_resource_account_and_publish_package",
        [],
        [bcsSerializeBytes(seed), bcsSerializeBytes(packageMetadata), codeSerializer.getBytes()]
      )
    );
    return this.generateSignSubmitTransaction(sender, payload, extraArgs);
  }
  /**
   * Helper for generating, submitting, and waiting for a transaction, and then
   * checking whether it was committed successfully. Under the hood this is just
   * `generateSignSubmitTransaction` and then `waitForTransactionWithResult`, see
   * those for information about the return / error semantics of this function.
   */
  async generateSignSubmitWaitForTransaction(sender, payload, extraArgs) {
    const txnHash = await this.generateSignSubmitTransaction(sender, payload, extraArgs);
    return this.waitForTransactionWithResult(txnHash, extraArgs);
  }
  async estimateGasPrice() {
    const { data } = await get({
      url: this.nodeUrl,
      endpoint: "estimate_gas_price",
      originMethod: "estimateGasPrice",
      overrides: { ...this.config }
    });
    return data;
  }
  async estimateMaxGasAmount(forAccount) {
    const typeTag = `0x1::coin::CoinStore<${APTOS_COIN}>`;
    const [{ gas_estimate: gasUnitPrice }, resources] = await Promise.all([
      this.estimateGasPrice(),
      this.getAccountResources(forAccount)
    ]);
    const accountResource = resources.find((r) => r.type === typeTag);
    const balance = BigInt(accountResource.data.coin.value);
    return balance / BigInt(gasUnitPrice);
  }
  /**
   * Rotate an account's auth key. After rotation, only the new private key can be used to sign txns for
   * the account.
   * WARNING: You must create a new instance of AptosAccount after using this function.
   * @param forAccount Account of which the auth key will be rotated
   * @param toPrivateKeyBytes New private key
   * @param extraArgs Extra args for building the transaction payload.
   * @returns PendingTransaction
   */
  async rotateAuthKeyEd25519(forAccount, toPrivateKeyBytes, extraArgs) {
    const { sequence_number: sequenceNumber, authentication_key: authKey } = await this.getAccount(
      forAccount.address()
    );
    const helperAccount = new AptosAccount(toPrivateKeyBytes);
    const challenge = new aptos_types_exports.RotationProofChallenge(
      aptos_types_exports.AccountAddress.CORE_CODE_ADDRESS,
      "account",
      "RotationProofChallenge",
      BigInt(sequenceNumber),
      aptos_types_exports.AccountAddress.fromHex(forAccount.address()),
      new aptos_types_exports.AccountAddress(new HexString(authKey).toUint8Array()),
      helperAccount.pubKey().toUint8Array()
    );
    const challengeHex = HexString.fromUint8Array(bcsToBytes(challenge));
    const proofSignedByCurrentPrivateKey = forAccount.signHexString(challengeHex);
    const proofSignedByNewPrivateKey = helperAccount.signHexString(challengeHex);
    const payload = new aptos_types_exports.TransactionPayloadEntryFunction(
      aptos_types_exports.EntryFunction.natural(
        "0x1::account",
        "rotate_authentication_key",
        [],
        [
          bcsSerializeU8(0),
          // ed25519 scheme
          bcsSerializeBytes(forAccount.pubKey().toUint8Array()),
          bcsSerializeU8(0),
          // ed25519 scheme
          bcsSerializeBytes(helperAccount.pubKey().toUint8Array()),
          bcsSerializeBytes(proofSignedByCurrentPrivateKey.toUint8Array()),
          bcsSerializeBytes(proofSignedByNewPrivateKey.toUint8Array())
        ]
      )
    );
    const rawTransaction = await this.generateRawTransaction(forAccount.address(), payload, extraArgs);
    const bcsTxn = _AptosClient.generateBCSTransaction(forAccount, rawTransaction);
    return this.submitSignedBCSTransaction(bcsTxn);
  }
  /**
   * Lookup the original address by the current derived address
   * @param addressOrAuthKey
   * @returns original address
   */
  async lookupOriginalAddress(addressOrAuthKey) {
    const resource = await this.getAccountResource("0x1", "0x1::account::OriginatingAddress");
    const {
      address_map: { handle }
    } = resource.data;
    const origAddress = await this.getTableItem(handle, {
      key_type: "address",
      value_type: "address",
      key: HexString.ensure(addressOrAuthKey).hex()
    });
    return new HexString(origAddress);
  }
  async getBlockByHeight(blockHeight, withTransactions) {
    const { data } = await get({
      url: this.nodeUrl,
      endpoint: `blocks/by_height/${blockHeight}`,
      originMethod: "getBlockByHeight",
      params: { with_transactions: withTransactions },
      overrides: { ...this.config }
    });
    return data;
  }
  async getBlockByVersion(version, withTransactions) {
    const { data } = await get({
      url: this.nodeUrl,
      endpoint: `blocks/by_version/${version}`,
      originMethod: "getBlockByVersion",
      params: { with_transactions: withTransactions },
      overrides: { ...this.config }
    });
    return data;
  }
  async view(payload, ledger_version) {
    const { data } = await post({
      url: this.nodeUrl,
      body: payload,
      endpoint: "view",
      originMethod: "getTableItem",
      params: { ledger_version },
      overrides: { ...this.config }
    });
    return data;
  }
  // eslint-disable-next-line class-methods-use-this
  clearCache(tags) {
    clear(tags);
  }
};
__decorateClass([
  parseApiError
], _AptosClient.prototype, "getAccount", 1);
__decorateClass([
  parseApiError
], _AptosClient.prototype, "getAccountTransactions", 1);
__decorateClass([
  parseApiError,
  MemoizeExpiring(10 * 60 * 1e3)
], _AptosClient.prototype, "getAccountModules", 1);
__decorateClass([
  parseApiError
], _AptosClient.prototype, "getAccountModule", 1);
__decorateClass([
  parseApiError
], _AptosClient.prototype, "getAccountResources", 1);
__decorateClass([
  parseApiError
], _AptosClient.prototype, "getAccountResource", 1);
__decorateClass([
  parseApiError
], _AptosClient.prototype, "getEventsByCreationNumber", 1);
__decorateClass([
  parseApiError
], _AptosClient.prototype, "getEventsByEventHandle", 1);
__decorateClass([
  parseApiError
], _AptosClient.prototype, "submitSignedBCSTransaction", 1);
__decorateClass([
  parseApiError
], _AptosClient.prototype, "submitBCSSimulation", 1);
__decorateClass([
  parseApiError
], _AptosClient.prototype, "getTransactions", 1);
__decorateClass([
  parseApiError
], _AptosClient.prototype, "getTransactionByHash", 1);
__decorateClass([
  parseApiError
], _AptosClient.prototype, "getTransactionByVersion", 1);
__decorateClass([
  parseApiError
], _AptosClient.prototype, "getLedgerInfo", 1);
__decorateClass([
  Memoize()
], _AptosClient.prototype, "getChainId", 1);
__decorateClass([
  parseApiError
], _AptosClient.prototype, "getTableItem", 1);
__decorateClass([
  parseApiError,
  Memoize({
    ttlMs: 5 * 60 * 1e3,
    // cache result for 5min
    tags: ["gas_estimates"]
  })
], _AptosClient.prototype, "estimateGasPrice", 1);
__decorateClass([
  parseApiError
], _AptosClient.prototype, "estimateMaxGasAmount", 1);
__decorateClass([
  parseApiError
], _AptosClient.prototype, "getBlockByHeight", 1);
__decorateClass([
  parseApiError
], _AptosClient.prototype, "getBlockByVersion", 1);
__decorateClass([
  parseApiError
], _AptosClient.prototype, "view", 1);
var AptosClient = _AptosClient;
var WaitForTransactionError = class extends Error {
  constructor(message, lastSubmittedTransaction) {
    super(message);
    this.lastSubmittedTransaction = lastSubmittedTransaction;
  }
};
var FailedTransactionError = class extends Error {
  constructor(message, transaction) {
    super(message);
    this.transaction = transaction;
  }
};
var ApiError = class extends Error {
  constructor(status, message, errorCode, vmErrorCode) {
    super(message);
    this.status = status;
    this.message = message;
    this.errorCode = errorCode;
    this.vmErrorCode = vmErrorCode;
  }
};
function parseApiError(target, propertyKey, descriptor) {
  const childFunction = descriptor.value;
  descriptor.value = async function wrapper(...args) {
    var _a, _b;
    try {
      const res = await childFunction.apply(this, [...args]);
      return res;
    } catch (e) {
      if (e instanceof AptosApiError) {
        throw new ApiError(
          e.status,
          JSON.stringify({ message: e.message, ...e.data }),
          (_a = e.data) == null ? void 0 : _a.error_code,
          (_b = e.data) == null ? void 0 : _b.vm_error_code
        );
      }
      throw e;
    }
  };
  return descriptor;
}

// src/providers/indexer.ts
var IndexerClient = class _IndexerClient {
  /**
   * @param endpoint URL of the Aptos Indexer API endpoint.
   */
  constructor(endpoint, config) {
    this.endpoint = endpoint;
    this.config = config;
  }
  /**
   * Indexer only accepts address in the long format, i.e a 66 chars long -> 0x<64 chars>
   * This method makes sure address is 66 chars long.
   * @param address
   */
  static validateAddress(address) {
    if (address.length < 66) {
      throw new Error(`${address} is less than 66 chars long.`);
    }
  }
  /**
   * Makes axios client call to fetch data from Aptos Indexer.
   *
   * @param graphqlQuery A GraphQL query to pass in the `data` axios call.
   */
  async queryIndexer(graphqlQuery) {
    const response = await post({
      url: this.endpoint,
      body: graphqlQuery,
      overrides: { WITH_CREDENTIALS: false, ...this.config }
    });
    if (response.data.errors) {
      throw new ApiError(
        response.data.errors[0].extensions.code,
        JSON.stringify({
          message: response.data.errors[0].message,
          error_code: response.data.errors[0].extensions.code
        })
      );
    }
    return response.data.data;
  }
  /**
   * Queries Indexer Ledger Info
   *
   * @returns GetLedgerInfoQuery response type
   */
  async getIndexerLedgerInfo() {
    const graphqlQuery = {
      query: GetIndexerLedgerInfo
    };
    return this.queryIndexer(graphqlQuery);
  }
  // TOKENS //
  /**
   * @deprecated please use `getOwnedTokens` query
   *
   * Queries an Aptos account's NFTs by owner address
   *
   * @param ownerAddress Hex-encoded 32 byte Aptos account address
   * @returns GetAccountCurrentTokensQuery response type
   */
  async getAccountNFTs(ownerAddress, options) {
    const address = HexString.ensure(ownerAddress).hex();
    _IndexerClient.validateAddress(address);
    const graphqlQuery = {
      query: GetAccountCurrentTokens,
      variables: { address, offset: options == null ? void 0 : options.offset, limit: options == null ? void 0 : options.limit }
    };
    return this.queryIndexer(graphqlQuery);
  }
  /**
   * Queries a token activities by token address (v2) or token data id (v1)
   *
   * @param idHash token address (v2) or token data id (v1)
   * @returns GetTokenActivitiesQuery response type
   */
  async getTokenActivities(token, extraArgs) {
    var _a, _b;
    const tokenAddress = HexString.ensure(token).hex();
    _IndexerClient.validateAddress(tokenAddress);
    const whereCondition = {
      token_data_id: { _eq: tokenAddress }
    };
    if (extraArgs == null ? void 0 : extraArgs.tokenStandard) {
      whereCondition.token_standard = { _eq: extraArgs == null ? void 0 : extraArgs.tokenStandard };
    }
    const graphqlQuery = {
      query: GetTokenActivities,
      variables: {
        where_condition: whereCondition,
        offset: (_a = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _a.offset,
        limit: (_b = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _b.limit,
        order_by: extraArgs == null ? void 0 : extraArgs.orderBy
      }
    };
    return this.queryIndexer(graphqlQuery);
  }
  /**
   * Gets the count of token's activities by token address (v2) or token data id (v1)
   *
   * @param token token address (v2) or token data id (v1)
   * @returns GetTokenActivitiesCountQuery response type
   */
  async getTokenActivitiesCount(token) {
    const graphqlQuery = {
      query: GetTokenActivitiesCount,
      variables: { token_id: token }
    };
    return this.queryIndexer(graphqlQuery);
  }
  /**
   * Gets the count of tokens owned by an account
   *
   * @param ownerAddress Owner address
   * @returns AccountTokensCountQuery response type
   */
  async getAccountTokensCount(ownerAddress, extraArgs) {
    var _a, _b;
    const whereCondition = {
      owner_address: { _eq: ownerAddress },
      amount: { _gt: "0" }
    };
    if (extraArgs == null ? void 0 : extraArgs.tokenStandard) {
      whereCondition.token_standard = { _eq: extraArgs == null ? void 0 : extraArgs.tokenStandard };
    }
    const address = HexString.ensure(ownerAddress).hex();
    _IndexerClient.validateAddress(address);
    const graphqlQuery = {
      query: GetAccountTokensCount,
      variables: {
        where_condition: whereCondition,
        offset: (_a = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _a.offset,
        limit: (_b = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _b.limit
      }
    };
    return this.queryIndexer(graphqlQuery);
  }
  /**
   * Queries token data by token address (v2) or token data id (v1)
   *
   * @param token token address (v2) or token data id (v1)
   * @returns GetTokenDataQuery response type
   */
  // :!:>getTokenData
  async getTokenData(token, extraArgs) {
    var _a, _b;
    const tokenAddress = HexString.ensure(token).hex();
    _IndexerClient.validateAddress(tokenAddress);
    const whereCondition = {
      token_data_id: { _eq: tokenAddress }
    };
    if (extraArgs == null ? void 0 : extraArgs.tokenStandard) {
      whereCondition.token_standard = { _eq: extraArgs == null ? void 0 : extraArgs.tokenStandard };
    }
    const graphqlQuery = {
      query: GetTokenData,
      variables: {
        where_condition: whereCondition,
        offset: (_a = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _a.offset,
        limit: (_b = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _b.limit,
        order_by: extraArgs == null ? void 0 : extraArgs.orderBy
      }
    };
    return this.queryIndexer(graphqlQuery);
  }
  // <:!:getTokenData
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
  async getTokenOwnersData(token, propertyVersion, extraArgs) {
    var _a, _b;
    const tokenAddress = HexString.ensure(token).hex();
    _IndexerClient.validateAddress(tokenAddress);
    const whereCondition = {
      token_data_id: { _eq: tokenAddress },
      amount: { _gt: "0" }
    };
    if (propertyVersion) {
      whereCondition.property_version_v1 = { _eq: propertyVersion };
    }
    if (extraArgs == null ? void 0 : extraArgs.tokenStandard) {
      whereCondition.token_standard = { _eq: extraArgs == null ? void 0 : extraArgs.tokenStandard };
    }
    const graphqlQuery = {
      query: GetTokenOwnersData,
      variables: {
        where_condition: whereCondition,
        offset: (_a = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _a.offset,
        limit: (_b = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _b.limit,
        order_by: extraArgs == null ? void 0 : extraArgs.orderBy
      }
    };
    return this.queryIndexer(graphqlQuery);
  }
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
  async getTokenCurrentOwnerData(token, propertyVersion, extraArgs) {
    var _a, _b;
    const tokenAddress = HexString.ensure(token).hex();
    _IndexerClient.validateAddress(tokenAddress);
    const whereCondition = {
      token_data_id: { _eq: tokenAddress },
      amount: { _gt: "0" }
    };
    if (propertyVersion) {
      whereCondition.property_version_v1 = { _eq: propertyVersion };
    }
    if (extraArgs == null ? void 0 : extraArgs.tokenStandard) {
      whereCondition.token_standard = { _eq: extraArgs == null ? void 0 : extraArgs.tokenStandard };
    }
    const graphqlQuery = {
      query: GetTokenCurrentOwnerData,
      variables: {
        where_condition: whereCondition,
        offset: (_a = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _a.offset,
        limit: (_b = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _b.limit,
        order_by: extraArgs == null ? void 0 : extraArgs.orderBy
      }
    };
    return this.queryIndexer(graphqlQuery);
  }
  /**
   * Queries account's current owned tokens.
   * This query returns all tokens (v1 and v2 standards) an account owns, including NFTs, fungible, soulbound, etc.
   * If you want to get only the token from a specific standrd, you can pass an optional tokenStandard param
   *
   * @param ownerAddress The token owner address we want to get the tokens for
   * @returns GetOwnedTokensQuery response type
   */
  async getOwnedTokens(ownerAddress, extraArgs) {
    var _a, _b;
    const address = HexString.ensure(ownerAddress).hex();
    _IndexerClient.validateAddress(address);
    const whereCondition = {
      owner_address: { _eq: address },
      amount: { _gt: 0 }
    };
    if (extraArgs == null ? void 0 : extraArgs.tokenStandard) {
      whereCondition.token_standard = { _eq: extraArgs == null ? void 0 : extraArgs.tokenStandard };
    }
    const graphqlQuery = {
      query: GetOwnedTokens,
      variables: {
        where_condition: whereCondition,
        offset: (_a = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _a.offset,
        limit: (_b = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _b.limit,
        order_by: extraArgs == null ? void 0 : extraArgs.orderBy
      }
    };
    return this.queryIndexer(graphqlQuery);
  }
  /**
   * Queries account's current owned tokens by token address (v2) or token data id (v1).
   *
   * @param token token address (v2) or token data id (v1)
   * @returns GetOwnedTokensByTokenDataQuery response type
   */
  async getOwnedTokensByTokenData(token, extraArgs) {
    var _a, _b;
    const address = HexString.ensure(token).hex();
    _IndexerClient.validateAddress(address);
    const whereCondition = {
      token_data_id: { _eq: address },
      amount: { _gt: 0 }
    };
    if (extraArgs == null ? void 0 : extraArgs.tokenStandard) {
      whereCondition.token_standard = { _eq: extraArgs == null ? void 0 : extraArgs.tokenStandard };
    }
    const graphqlQuery = {
      query: GetOwnedTokensByTokenData,
      variables: {
        where_condition: whereCondition,
        offset: (_a = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _a.offset,
        limit: (_b = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _b.limit,
        order_by: extraArgs == null ? void 0 : extraArgs.orderBy
      }
    };
    return this.queryIndexer(graphqlQuery);
  }
  /**
   * Queries all tokens of a specific collection that an account owns by the collection address
   *
   * @param ownerAddress owner address that owns the tokens
   * @param collectionAddress the collection address
   * @returns GetTokenOwnedFromCollectionQuery response type
   */
  async getTokenOwnedFromCollectionAddress(ownerAddress, collectionAddress, extraArgs) {
    var _a, _b;
    const ownerHexAddress = HexString.ensure(ownerAddress).hex();
    _IndexerClient.validateAddress(ownerHexAddress);
    const collectionHexAddress = HexString.ensure(collectionAddress).hex();
    _IndexerClient.validateAddress(collectionHexAddress);
    const whereCondition = {
      owner_address: { _eq: ownerHexAddress },
      current_token_data: { collection_id: { _eq: collectionHexAddress } },
      amount: { _gt: 0 }
    };
    if (extraArgs == null ? void 0 : extraArgs.tokenStandard) {
      whereCondition.token_standard = { _eq: extraArgs == null ? void 0 : extraArgs.tokenStandard };
    }
    const graphqlQuery = {
      query: GetTokenOwnedFromCollection,
      variables: {
        where_condition: whereCondition,
        offset: (_a = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _a.offset,
        limit: (_b = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _b.limit,
        order_by: extraArgs == null ? void 0 : extraArgs.orderBy
      }
    };
    return this.queryIndexer(graphqlQuery);
  }
  /**
   * Queries all tokens of a specific collection that an account owns by the collection name and collection
   * creator address
   *
   * @param ownerAddress owner address that owns the tokens
   * @param collectionName the collection name
   * @param creatorAddress the collection creator address
   * @returns GetTokenOwnedFromCollectionQuery response type
   */
  async getTokenOwnedFromCollectionNameAndCreatorAddress(ownerAddress, collectionName, creatorAddress, extraArgs) {
    const collectionAddress = await this.getCollectionAddress(creatorAddress, collectionName, extraArgs);
    const tokens = await this.getTokenOwnedFromCollectionAddress(ownerAddress, collectionAddress, extraArgs);
    return tokens;
  }
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
  async getCollectionData(creatorAddress, collectionName, extraArgs) {
    var _a, _b;
    const address = HexString.ensure(creatorAddress).hex();
    _IndexerClient.validateAddress(address);
    const whereCondition = {
      collection_name: { _eq: collectionName },
      creator_address: { _eq: address }
    };
    if (extraArgs == null ? void 0 : extraArgs.tokenStandard) {
      whereCondition.token_standard = { _eq: extraArgs == null ? void 0 : extraArgs.tokenStandard };
    }
    const graphqlQuery = {
      query: GetCollectionData,
      variables: {
        where_condition: whereCondition,
        offset: (_a = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _a.offset,
        limit: (_b = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _b.limit,
        order_by: extraArgs == null ? void 0 : extraArgs.orderBy
      }
    };
    return this.queryIndexer(graphqlQuery);
  }
  /**
   * Queries a collection address.
   *
   * @param creatorAddress the collection creator address
   * @param collectionName the collection name
   * @returns the collection address
   */
  async getCollectionAddress(creatorAddress, collectionName, extraArgs) {
    return (await this.getCollectionData(creatorAddress, collectionName, extraArgs)).current_collections_v2[0].collection_id;
  }
  /**
   * Queries for all collections that an account has tokens for.
   *
   * @param ownerAddress the account address that owns the tokens
   * @returns GetCollectionsWithOwnedTokensQuery response type
   */
  async getCollectionsWithOwnedTokens(ownerAddress, extraArgs) {
    var _a, _b;
    const ownerHexAddress = HexString.ensure(ownerAddress).hex();
    _IndexerClient.validateAddress(ownerHexAddress);
    const whereCondition = {
      owner_address: { _eq: ownerHexAddress }
    };
    if (extraArgs == null ? void 0 : extraArgs.tokenStandard) {
      whereCondition.current_collection = { token_standard: { _eq: extraArgs == null ? void 0 : extraArgs.tokenStandard } };
    }
    const graphqlQuery = {
      query: GetCollectionsWithOwnedTokens,
      variables: {
        where_condition: whereCondition,
        offset: (_a = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _a.offset,
        limit: (_b = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _b.limit,
        order_by: extraArgs == null ? void 0 : extraArgs.orderBy
      }
    };
    return this.queryIndexer(graphqlQuery);
  }
  // TRANSACTIONS //
  /**
   * Gets the count of transactions submitted by an account
   *
   * @param address Account address
   * @returns GetAccountTransactionsCountQuery response type
   */
  async getAccountTransactionsCount(accountAddress) {
    const address = HexString.ensure(accountAddress).hex();
    _IndexerClient.validateAddress(address);
    const graphqlQuery = {
      query: GetAccountTransactionsCount,
      variables: { address }
    };
    return this.queryIndexer(graphqlQuery);
  }
  /**
   * Queries an account transactions data
   *
   * @param address Account address
   * @returns GetAccountTransactionsDataQuery response type
   */
  async getAccountTransactionsData(accountAddress, extraArgs) {
    var _a, _b;
    const address = HexString.ensure(accountAddress).hex();
    _IndexerClient.validateAddress(address);
    const whereCondition = {
      account_address: { _eq: address }
    };
    const graphqlQuery = {
      query: GetAccountTransactionsData,
      variables: {
        where_condition: whereCondition,
        offset: (_a = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _a.offset,
        limit: (_b = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _b.limit,
        order_by: extraArgs == null ? void 0 : extraArgs.orderBy
      }
    };
    return this.queryIndexer(graphqlQuery);
  }
  /**
   * Queries top user transactions
   *
   * @param limit
   * @returns GetTopUserTransactionsQuery response type
   */
  async getTopUserTransactions(limit) {
    const graphqlQuery = {
      query: GetTopUserTransactions,
      variables: { limit }
    };
    return this.queryIndexer(graphqlQuery);
  }
  /**
   * Queries top user transactions
   *
   * @param startVersion optional - can be set to tell indexer what version to start from
   * @returns GetUserTransactionsQuery response type
   */
  async getUserTransactions(extraArgs) {
    var _a, _b;
    const whereCondition = {
      version: { _lte: extraArgs == null ? void 0 : extraArgs.startVersion }
    };
    const graphqlQuery = {
      query: GetUserTransactions,
      variables: {
        where_condition: whereCondition,
        offset: (_a = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _a.offset,
        limit: (_b = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _b.limit,
        order_by: extraArgs == null ? void 0 : extraArgs.orderBy
      }
    };
    return this.queryIndexer(graphqlQuery);
  }
  // STAKING //
  /**
   * Queries delegated staking activities
   *
   * @param delegatorAddress Delegator address
   * @param poolAddress Pool address
   * @returns GetDelegatedStakingActivitiesQuery response type
   */
  async getDelegatedStakingActivities(delegatorAddress, poolAddress) {
    const delegator = HexString.ensure(delegatorAddress).hex();
    const pool = HexString.ensure(poolAddress).hex();
    _IndexerClient.validateAddress(delegator);
    _IndexerClient.validateAddress(pool);
    const graphqlQuery = {
      query: GetDelegatedStakingActivities,
      variables: {
        delegatorAddress: delegator,
        poolAddress: pool
      }
    };
    return this.queryIndexer(graphqlQuery);
  }
  /**
   * Queries current number of delegators in a pool
   *
   * @returns GetNumberOfDelegatorsQuery response type
   */
  async getNumberOfDelegators(poolAddress) {
    const address = HexString.ensure(poolAddress).hex();
    _IndexerClient.validateAddress(address);
    const graphqlQuery = {
      query: GetNumberOfDelegators,
      variables: { poolAddress: address }
    };
    return this.queryIndexer(graphqlQuery);
  }
  // ACCOUNT //
  /**
   * Queries an account coin data
   *
   * @param ownerAddress Owner address
   * @returns GetAccountCoinsDataQuery response type
   */
  async getAccountCoinsData(ownerAddress, extraArgs) {
    var _a, _b;
    const address = HexString.ensure(ownerAddress).hex();
    _IndexerClient.validateAddress(address);
    const whereCondition = {
      owner_address: { _eq: address }
    };
    const graphqlQuery = {
      query: GetAccountCoinsData,
      variables: {
        where_condition: whereCondition,
        offset: (_a = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _a.offset,
        limit: (_b = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _b.limit,
        order_by: extraArgs == null ? void 0 : extraArgs.orderBy
      }
    };
    return this.queryIndexer(graphqlQuery);
  }
  /**
   * Queries an account coin data count
   *
   * @param ownerAddress Owner address
   * @returns GetAccountCoinsDataCountQuery response type
   */
  async getAccountCoinsDataCount(ownerAddress) {
    const address = HexString.ensure(ownerAddress).hex();
    _IndexerClient.validateAddress(address);
    const graphqlQuery = {
      query: GetAccountCoinsDataCount,
      variables: {
        address
      }
    };
    return this.queryIndexer(graphqlQuery);
  }
  /**
   * Queries an account owned objects
   *
   * @param ownerAddress Owner address
   * @returns GetCurrentObjectsQuery response type
   */
  async getAccountOwnedObjects(ownerAddress, extraArgs) {
    var _a, _b;
    const address = HexString.ensure(ownerAddress).hex();
    _IndexerClient.validateAddress(address);
    const whereCondition = {
      owner_address: { _eq: address }
    };
    const graphqlQuery = {
      query: GetCurrentObjects,
      variables: {
        where_condition: whereCondition,
        offset: (_a = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _a.offset,
        limit: (_b = extraArgs == null ? void 0 : extraArgs.options) == null ? void 0 : _b.limit,
        order_by: extraArgs == null ? void 0 : extraArgs.orderBy
      }
    };
    return this.queryIndexer(graphqlQuery);
  }
};

// src/providers/provider.ts
var Provider = class {
  constructor(network, config, doNotFixNodeUrl = false) {
    let fullNodeUrl = null;
    let indexerUrl = null;
    if (typeof network === "object" && isCustomEndpoints(network)) {
      fullNodeUrl = network.fullnodeUrl;
      indexerUrl = network.indexerUrl;
      this.network = "CUSTOM";
    } else {
      fullNodeUrl = NetworkToNodeAPI[network];
      indexerUrl = NetworkToIndexerAPI[network];
      this.network = network;
    }
    if (this.network === "CUSTOM" && !fullNodeUrl) {
      throw new Error("fullnode url is not provided");
    }
    if (indexerUrl) {
      this.indexerClient = new IndexerClient(indexerUrl, config);
    }
    this.aptosClient = new AptosClient(fullNodeUrl, config, doNotFixNodeUrl);
  }
};
function applyMixin(targetClass, baseClass, baseClassProp) {
  Object.getOwnPropertyNames(baseClass.prototype).forEach((propertyName) => {
    const propertyDescriptor = Object.getOwnPropertyDescriptor(baseClass.prototype, propertyName);
    if (!propertyDescriptor)
      return;
    propertyDescriptor.value = function(...args) {
      return this[baseClassProp][propertyName](...args);
    };
    Object.defineProperty(targetClass.prototype, propertyName, propertyDescriptor);
  });
  Object.getOwnPropertyNames(baseClass).forEach((propertyName) => {
    const propertyDescriptor = Object.getOwnPropertyDescriptor(baseClass, propertyName);
    if (!propertyDescriptor)
      return;
    propertyDescriptor.value = function(...args) {
      return this[baseClassProp][propertyName](...args);
    };
    if (targetClass.hasOwnProperty.call(targetClass, propertyName)) {
      return;
    }
    Object.defineProperty(targetClass, propertyName, propertyDescriptor);
  });
}
applyMixin(Provider, AptosClient, "aptosClient");
applyMixin(Provider, IndexerClient, "indexerClient");
function isCustomEndpoints(network) {
  return network.fullnodeUrl !== void 0 && typeof network.fullnodeUrl === "string";
}

// src/utils/property_map_serde.ts
var PropertyValue = class {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
};
var PropertyMap = class {
  constructor() {
    this.data = {};
  }
  setProperty(key, value) {
    this.data[key] = value;
  }
};
function getPropertyType(typ) {
  let typeTag;
  if (typ === "string" || typ === "String") {
    typeTag = new TypeTagStruct(stringStructTag);
  } else {
    typeTag = new TypeTagParser(typ).parseTypeTag();
  }
  return typeTag;
}
function getPropertyValueRaw(values, types) {
  if (values.length !== types.length) {
    throw new Error("Length of property values and types not match");
  }
  const results = new Array();
  types.forEach((typ, index) => {
    try {
      const typeTag = getPropertyType(typ);
      const serializer = new Serializer();
      serializeArg(values[index], typeTag, serializer);
      results.push(serializer.getBytes());
    } catch (error) {
      results.push(new TextEncoder().encode(values[index]));
    }
  });
  return results;
}
function getSinglePropertyValueRaw(value, type) {
  if (!value || !type) {
    throw new Error("value or type can not be empty");
  }
  try {
    const typeTag = getPropertyType(type);
    const serializer = new Serializer();
    serializeArg(value, typeTag, serializer);
    return serializer.getBytes();
  } catch (error) {
    return new TextEncoder().encode(value);
  }
}
function deserializePropertyMap(rawPropertyMap) {
  const entries = rawPropertyMap.map.data;
  const pm = new PropertyMap();
  entries.forEach((prop) => {
    const { key } = prop;
    const val = prop.value.value;
    const typ = prop.value.type;
    const typeTag = getPropertyType(typ);
    const newValue = deserializeValueBasedOnTypeTag(typeTag, val);
    const pv = new PropertyValue(typ, newValue);
    pm.setProperty(key, pv);
  });
  return pm;
}
function deserializeValueBasedOnTypeTag(tag, val) {
  const de = new Deserializer(new HexString(val).toUint8Array());
  let res = "";
  if (tag instanceof TypeTagU8) {
    res = de.deserializeU8().toString();
  } else if (tag instanceof TypeTagU64) {
    res = de.deserializeU64().toString();
  } else if (tag instanceof TypeTagU128) {
    res = de.deserializeU128().toString();
  } else if (tag instanceof TypeTagBool) {
    res = de.deserializeBool() ? "true" : "false";
  } else if (tag instanceof TypeTagAddress) {
    res = HexString.fromUint8Array(de.deserializeFixedBytes(32)).hex();
  } else if (tag instanceof TypeTagStruct && tag.isStringTypeTag()) {
    res = de.deserializeStr();
  } else {
    res = val;
  }
  return res;
}

// src/aptos_types/token_types.ts
var token_types_exports = {};
__export(token_types_exports, {
  PropertyMap: () => PropertyMap,
  PropertyValue: () => PropertyValue,
  Token: () => Token,
  TokenData: () => TokenData
});
var TokenData = class {
  constructor(collection, description, name, maximum, supply, uri, default_properties, mutability_config) {
    this.collection = collection;
    this.description = description;
    this.name = name;
    this.maximum = maximum;
    this.supply = supply;
    this.uri = uri;
    this.default_properties = deserializePropertyMap(default_properties);
    this.mutability_config = mutability_config;
  }
};
var Token = class {
  constructor(id, amount, token_properties) {
    this.id = id;
    this.amount = amount;
    this.token_properties = deserializePropertyMap(token_properties);
  }
};

// src/plugins/token_client.ts
var TokenClient = class {
  /**
   * Creates new TokenClient instance
   *
   * @param aptosClient AptosClient instance
   */
  constructor(aptosClient2) {
    this.aptosClient = aptosClient2;
  }
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
  // :!:>createCollection
  async createCollection(account, name, description, uri, maxAmount = MAX_U64_BIG_INT, extraArgs) {
    const builder = new TransactionBuilderRemoteABI(this.aptosClient, { sender: account.address(), ...extraArgs });
    const rawTxn = await builder.build(
      "0x3::token::create_collection_script",
      [],
      [name, description, uri, maxAmount, [false, false, false]]
    );
    const bcsTxn = AptosClient.generateBCSTransaction(account, rawTxn);
    const pendingTransaction = await this.aptosClient.submitSignedBCSTransaction(bcsTxn);
    return pendingTransaction.hash;
  }
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
  // :!:>createToken
  async createToken(account, collectionName, name, description, supply, uri, max = MAX_U64_BIG_INT, royalty_payee_address = account.address(), royalty_points_denominator = 0, royalty_points_numerator = 0, property_keys = [], property_values = [], property_types = [], extraArgs) {
    const builder = new TransactionBuilderRemoteABI(this.aptosClient, { sender: account.address(), ...extraArgs });
    const rawTxn = await builder.build(
      "0x3::token::create_token_script",
      [],
      [
        collectionName,
        name,
        description,
        supply,
        max,
        uri,
        royalty_payee_address,
        royalty_points_denominator,
        royalty_points_numerator,
        [false, false, false, false, false],
        property_keys,
        getPropertyValueRaw(property_values, property_types),
        property_types
      ]
    );
    const bcsTxn = AptosClient.generateBCSTransaction(account, rawTxn);
    const pendingTransaction = await this.aptosClient.submitSignedBCSTransaction(bcsTxn);
    return pendingTransaction.hash;
  }
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
  // :!:>createToken
  async createTokenWithMutabilityConfig(account, collectionName, name, description, supply, uri, max = MAX_U64_BIG_INT, royalty_payee_address = account.address(), royalty_points_denominator = 0, royalty_points_numerator = 0, property_keys = [], property_values = [], property_types = [], mutability_config = [false, false, false, false, false], extraArgs) {
    const builder = new TransactionBuilderRemoteABI(this.aptosClient, { sender: account.address(), ...extraArgs });
    const rawTxn = await builder.build(
      "0x3::token::create_token_script",
      [],
      [
        collectionName,
        name,
        description,
        supply,
        max,
        uri,
        royalty_payee_address,
        royalty_points_denominator,
        royalty_points_numerator,
        mutability_config,
        property_keys,
        property_values,
        property_types
      ]
    );
    const bcsTxn = AptosClient.generateBCSTransaction(account, rawTxn);
    const pendingTransaction = await this.aptosClient.submitSignedBCSTransaction(bcsTxn);
    return pendingTransaction.hash;
  }
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
  async offerToken(account, receiver, creator, collectionName, name, amount, property_version = 0, extraArgs) {
    const builder = new TransactionBuilderRemoteABI(this.aptosClient, { sender: account.address(), ...extraArgs });
    const rawTxn = await builder.build(
      "0x3::token_transfers::offer_script",
      [],
      [receiver, creator, collectionName, name, property_version, amount]
    );
    const bcsTxn = AptosClient.generateBCSTransaction(account, rawTxn);
    const pendingTransaction = await this.aptosClient.submitSignedBCSTransaction(bcsTxn);
    return pendingTransaction.hash;
  }
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
  async claimToken(account, sender, creator, collectionName, name, property_version = 0, extraArgs) {
    const builder = new TransactionBuilderRemoteABI(this.aptosClient, { sender: account.address(), ...extraArgs });
    const rawTxn = await builder.build(
      "0x3::token_transfers::claim_script",
      [],
      [sender, creator, collectionName, name, property_version]
    );
    const bcsTxn = AptosClient.generateBCSTransaction(account, rawTxn);
    const pendingTransaction = await this.aptosClient.submitSignedBCSTransaction(bcsTxn);
    return pendingTransaction.hash;
  }
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
  async cancelTokenOffer(account, receiver, creator, collectionName, name, property_version = 0, extraArgs) {
    const builder = new TransactionBuilderRemoteABI(this.aptosClient, { sender: account.address(), ...extraArgs });
    const rawTxn = await builder.build(
      "0x3::token_transfers::cancel_offer_script",
      [],
      [receiver, creator, collectionName, name, property_version]
    );
    const bcsTxn = AptosClient.generateBCSTransaction(account, rawTxn);
    const pendingTransaction = await this.aptosClient.submitSignedBCSTransaction(bcsTxn);
    return pendingTransaction.hash;
  }
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
  async directTransferToken(sender, receiver, creator, collectionName, name, amount, propertyVersion = 0, extraArgs) {
    const builder = new TransactionBuilderRemoteABI(this.aptosClient, { sender: sender.address(), ...extraArgs });
    const rawTxn = await builder.build(
      "0x3::token::direct_transfer_script",
      [],
      [creator, collectionName, name, propertyVersion, amount]
    );
    const multiAgentTxn = new aptos_types_exports.MultiAgentRawTransaction(rawTxn, [
      aptos_types_exports.AccountAddress.fromHex(receiver.address())
    ]);
    const senderSignature = new aptos_types_exports.Ed25519Signature(
      sender.signBuffer(TransactionBuilder.getSigningMessage(multiAgentTxn)).toUint8Array()
    );
    const senderAuthenticator = new aptos_types_exports.AccountAuthenticatorEd25519(
      new aptos_types_exports.Ed25519PublicKey(sender.signingKey.publicKey),
      senderSignature
    );
    const receiverSignature = new aptos_types_exports.Ed25519Signature(
      receiver.signBuffer(TransactionBuilder.getSigningMessage(multiAgentTxn)).toUint8Array()
    );
    const receiverAuthenticator = new aptos_types_exports.AccountAuthenticatorEd25519(
      new aptos_types_exports.Ed25519PublicKey(receiver.signingKey.publicKey),
      receiverSignature
    );
    const multiAgentAuthenticator = new aptos_types_exports.TransactionAuthenticatorMultiAgent(
      senderAuthenticator,
      [aptos_types_exports.AccountAddress.fromHex(receiver.address())],
      // Secondary signer addresses
      [receiverAuthenticator]
      // Secondary signer authenticators
    );
    const bcsTxn = bcsToBytes(new aptos_types_exports.SignedTransaction(rawTxn, multiAgentAuthenticator));
    const transactionRes = await this.aptosClient.submitSignedBCSTransaction(bcsTxn);
    return transactionRes.hash;
  }
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
  async directTransferTokenWithFeePayer(sender, receiver, creator, collectionName, name, amount, fee_payer, propertyVersion = 0, extraArgs) {
    const builder = new TransactionBuilderRemoteABI(this.aptosClient, { sender: sender.address(), ...extraArgs });
    const rawTxn = await builder.build(
      "0x3::token::direct_transfer_script",
      [],
      [creator, collectionName, name, propertyVersion, amount]
    );
    const feePayerTxn = new aptos_types_exports.FeePayerRawTransaction(
      rawTxn,
      [aptos_types_exports.AccountAddress.fromHex(receiver.address())],
      aptos_types_exports.AccountAddress.fromHex(fee_payer.address())
    );
    const senderSignature = new aptos_types_exports.Ed25519Signature(
      sender.signBuffer(TransactionBuilder.getSigningMessage(feePayerTxn)).toUint8Array()
    );
    const senderAuthenticator = new aptos_types_exports.AccountAuthenticatorEd25519(
      new aptos_types_exports.Ed25519PublicKey(sender.signingKey.publicKey),
      senderSignature
    );
    const receiverSignature = new aptos_types_exports.Ed25519Signature(
      receiver.signBuffer(TransactionBuilder.getSigningMessage(feePayerTxn)).toUint8Array()
    );
    const receiverAuthenticator = new aptos_types_exports.AccountAuthenticatorEd25519(
      new aptos_types_exports.Ed25519PublicKey(receiver.signingKey.publicKey),
      receiverSignature
    );
    const feePayerSignature = new aptos_types_exports.Ed25519Signature(
      fee_payer.signBuffer(TransactionBuilder.getSigningMessage(feePayerTxn)).toUint8Array()
    );
    const feePayerAuthenticator = new aptos_types_exports.AccountAuthenticatorEd25519(
      new aptos_types_exports.Ed25519PublicKey(fee_payer.signingKey.publicKey),
      feePayerSignature
    );
    const txAuthenticatorFeePayer = new aptos_types_exports.TransactionAuthenticatorFeePayer(
      senderAuthenticator,
      [aptos_types_exports.AccountAddress.fromHex(receiver.address())],
      [receiverAuthenticator],
      { address: aptos_types_exports.AccountAddress.fromHex(fee_payer.address()), authenticator: feePayerAuthenticator }
    );
    const bcsTxn = bcsToBytes(new aptos_types_exports.SignedTransaction(rawTxn, txAuthenticatorFeePayer));
    const transactionRes = await this.aptosClient.submitSignedBCSTransaction(bcsTxn);
    return transactionRes.hash;
  }
  /**
   * User opt-in or out direct transfer through a boolean flag
   *
   * @param sender AptosAccount where the token will be transferred
   * @param optIn boolean value indicates user want to opt-in or out of direct transfer
   * @returns The hash of the transaction submitted to the API
   */
  async optInTokenTransfer(sender, optIn, extraArgs) {
    const builder = new TransactionBuilderRemoteABI(this.aptosClient, { sender: sender.address(), ...extraArgs });
    const rawTxn = await builder.build("0x3::token::opt_in_direct_transfer", [], [optIn]);
    const bcsTxn = AptosClient.generateBCSTransaction(sender, rawTxn);
    const pendingTransaction = await this.aptosClient.submitSignedBCSTransaction(bcsTxn);
    return pendingTransaction.hash;
  }
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
  async transferWithOptIn(sender, creator, collectionName, tokenName, propertyVersion, receiver, amount, extraArgs) {
    const builder = new TransactionBuilderRemoteABI(this.aptosClient, { sender: sender.address(), ...extraArgs });
    const rawTxn = await builder.build(
      "0x3::token::transfer_with_opt_in",
      [],
      [creator, collectionName, tokenName, propertyVersion, receiver, amount]
    );
    const bcsTxn = AptosClient.generateBCSTransaction(sender, rawTxn);
    const pendingTransaction = await this.aptosClient.submitSignedBCSTransaction(bcsTxn);
    return pendingTransaction.hash;
  }
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
  async burnByCreator(creator, ownerAddress, collection, name, PropertyVersion, amount, extraArgs) {
    const builder = new TransactionBuilderRemoteABI(this.aptosClient, { sender: creator.address(), ...extraArgs });
    const rawTxn = await builder.build(
      "0x3::token::burn_by_creator",
      [],
      [ownerAddress, collection, name, PropertyVersion, amount]
    );
    const bcsTxn = AptosClient.generateBCSTransaction(creator, rawTxn);
    const pendingTransaction = await this.aptosClient.submitSignedBCSTransaction(bcsTxn);
    return pendingTransaction.hash;
  }
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
  async burnByOwner(owner, creatorAddress, collection, name, PropertyVersion, amount, extraArgs) {
    const builder = new TransactionBuilderRemoteABI(this.aptosClient, { sender: owner.address(), ...extraArgs });
    const rawTxn = await builder.build(
      "0x3::token::burn",
      [],
      [creatorAddress, collection, name, PropertyVersion, amount]
    );
    const bcsTxn = AptosClient.generateBCSTransaction(owner, rawTxn);
    const pendingTransaction = await this.aptosClient.submitSignedBCSTransaction(bcsTxn);
    return pendingTransaction.hash;
  }
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
  async mutateTokenProperties(account, tokenOwner, creator, collection_name, tokenName, propertyVersion, amount, keys, values, types, extraArgs) {
    const builder = new TransactionBuilderRemoteABI(this.aptosClient, { sender: account.address(), ...extraArgs });
    const rawTxn = await builder.build(
      "0x3::token::mutate_token_properties",
      [],
      [tokenOwner, creator, collection_name, tokenName, propertyVersion, amount, keys, values, types]
    );
    const bcsTxn = AptosClient.generateBCSTransaction(account, rawTxn);
    const pendingTransaction = await this.aptosClient.submitSignedBCSTransaction(bcsTxn);
    return pendingTransaction.hash;
  }
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
  async getCollectionData(creator, collectionName) {
    const resources = await this.aptosClient.getAccountResources(creator);
    const accountResource = resources.find(
      (r) => r.type === "0x3::token::Collections"
    );
    const { handle } = accountResource.data.collection_data;
    const getCollectionTableItemRequest = {
      key_type: "0x1::string::String",
      value_type: "0x3::token::CollectionData",
      key: collectionName
    };
    const collectionTable = await this.aptosClient.getTableItem(handle, getCollectionTableItemRequest);
    return collectionTable;
  }
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
  // :!:>getTokenData
  async getTokenData(creator, collectionName, tokenName) {
    const creatorHex = creator instanceof HexString ? creator.hex() : creator;
    const collection = await this.aptosClient.getAccountResource(
      creatorHex,
      "0x3::token::Collections"
    );
    const { handle } = collection.data.token_data;
    const tokenDataId = {
      creator: creatorHex,
      collection: collectionName,
      name: tokenName
    };
    const getTokenTableItemRequest = {
      key_type: "0x3::token::TokenDataId",
      value_type: "0x3::token::TokenData",
      key: tokenDataId
    };
    const rawTokenData = await this.aptosClient.getTableItem(handle, getTokenTableItemRequest);
    return new TokenData(
      rawTokenData.collection,
      rawTokenData.description,
      rawTokenData.name,
      rawTokenData.maximum,
      rawTokenData.supply,
      rawTokenData.uri,
      rawTokenData.default_properties,
      rawTokenData.mutability_config
    );
  }
  // <:!:getTokenData
  /**
   * Queries token balance for the token creator
   */
  async getToken(creator, collectionName, tokenName, property_version = "0") {
    const tokenDataId = {
      creator: creator instanceof HexString ? creator.hex() : creator,
      collection: collectionName,
      name: tokenName
    };
    return this.getTokenForAccount(creator, {
      token_data_id: tokenDataId,
      property_version
    });
  }
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
  async getTokenForAccount(account, tokenId) {
    const tokenStore = await this.aptosClient.getAccountResource(
      account instanceof HexString ? account.hex() : account,
      "0x3::token::TokenStore"
    );
    const { handle } = tokenStore.data.tokens;
    const getTokenTableItemRequest = {
      key_type: "0x3::token::TokenId",
      value_type: "0x3::token::Token",
      key: tokenId
    };
    try {
      const rawToken = await this.aptosClient.getTableItem(handle, getTokenTableItemRequest);
      return new Token(rawToken.id, rawToken.amount, rawToken.token_properties);
    } catch (error) {
      if ((error == null ? void 0 : error.status) === 404) {
        return {
          id: tokenId,
          amount: "0",
          token_properties: new PropertyMap()
        };
      }
      return error;
    }
  }
};

// src/plugins/fungible_asset_client.ts
var FungibleAssetClient = class {
  /**
   * Creates new FungibleAssetClient instance
   *
   * @param provider Provider instance
   */
  constructor(provider) {
    this.assetType = "0x1::fungible_asset::Metadata";
    this.provider = provider;
  }
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
  async transfer(sender, fungibleAssetMetadataAddress, recipient, amount, extraArgs) {
    const rawTransaction = await this.generateTransfer(
      sender,
      fungibleAssetMetadataAddress,
      recipient,
      amount,
      extraArgs
    );
    const txnHash = await this.provider.signAndSubmitTransaction(sender, rawTransaction);
    return txnHash;
  }
  /**
   * Get the balance of a fungible asset from the account's primary fungible store.
   *
   * @param account Account that you want to get the balance of.
   * @param fungibleAssetMetadataAddress The fungible asset address you want to check the balance of
   * @returns Promise that resolves to the balance
   */
  async getPrimaryBalance(account, fungibleAssetMetadataAddress) {
    const payload = {
      function: "0x1::primary_fungible_store::balance",
      type_arguments: [this.assetType],
      arguments: [HexString.ensure(account).hex(), HexString.ensure(fungibleAssetMetadataAddress).hex()]
    };
    const response = await this.provider.view(payload);
    return BigInt(response[0]);
  }
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
  async generateTransfer(sender, fungibleAssetMetadataAddress, recipient, amount, extraArgs) {
    const builder = new TransactionBuilderRemoteABI(this.provider, {
      sender: sender.address(),
      ...extraArgs
    });
    const rawTxn = await builder.build(
      "0x1::primary_fungible_store::transfer",
      [this.assetType],
      [HexString.ensure(fungibleAssetMetadataAddress).hex(), HexString.ensure(recipient).hex(), amount]
    );
    return rawTxn;
  }
};

// src/plugins/aptos_token.ts
var PropertyTypeMap = {
  BOOLEAN: "bool",
  U8: "u8",
  U16: "u16",
  U32: "u32",
  U64: "u64",
  U128: "u128",
  U256: "u256",
  ADDRESS: "address",
  VECTOR: "vector<u8>",
  STRING: "string"
};
var AptosToken = class {
  /**
   * Creates new AptosToken instance
   *
   * @param provider Provider instance
   */
  constructor(provider) {
    this.tokenType = "0x4::token::Token";
    this.provider = provider;
  }
  async submitTransaction(account, funcName, typeArgs, args, extraArgs) {
    const builder = new TransactionBuilderRemoteABI(this.provider, {
      sender: account.address(),
      ...extraArgs
    });
    const rawTxn = await builder.build(`0x4::aptos_token::${funcName}`, typeArgs, args);
    const bcsTxn = AptosClient.generateBCSTransaction(account, rawTxn);
    const pendingTransaction = await this.provider.submitSignedBCSTransaction(bcsTxn);
    return pendingTransaction.hash;
  }
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
  // :!:>createCollection
  async createCollection(creator, description, name, uri, maxSupply = MAX_U64_BIG_INT, options, extraArgs) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
    return this.submitTransaction(
      creator,
      "create_collection",
      [],
      [
        description,
        maxSupply,
        name,
        uri,
        (_a = options == null ? void 0 : options.mutableDescription) != null ? _a : true,
        (_b = options == null ? void 0 : options.mutableRoyalty) != null ? _b : true,
        (_c = options == null ? void 0 : options.mutableURI) != null ? _c : true,
        (_d = options == null ? void 0 : options.mutableTokenDescription) != null ? _d : true,
        (_e = options == null ? void 0 : options.mutableTokenName) != null ? _e : true,
        (_f = options == null ? void 0 : options.mutableTokenProperties) != null ? _f : true,
        (_g = options == null ? void 0 : options.mutableTokenURI) != null ? _g : true,
        (_h = options == null ? void 0 : options.tokensBurnableByCreator) != null ? _h : true,
        (_i = options == null ? void 0 : options.tokensFreezableByCreator) != null ? _i : true,
        (_j = options == null ? void 0 : options.royaltyNumerator) != null ? _j : 0,
        (_k = options == null ? void 0 : options.royaltyDenominator) != null ? _k : 1
      ],
      extraArgs
    );
  }
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
  // :!:>mint
  async mint(account, collection, description, name, uri, propertyKeys = [], propertyTypes = [], propertyValues = [], extraArgs) {
    return this.submitTransaction(
      account,
      "mint",
      [],
      [
        collection,
        description,
        name,
        uri,
        propertyKeys,
        propertyTypes,
        getPropertyValueRaw(propertyValues, propertyTypes)
      ],
      extraArgs
    );
  }
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
  async mintSoulBound(account, collection, description, name, uri, recipient, propertyKeys = [], propertyTypes = [], propertyValues = [], extraArgs) {
    return this.submitTransaction(
      account,
      "mint_soul_bound",
      [],
      [
        collection,
        description,
        name,
        uri,
        propertyKeys,
        propertyTypes,
        getPropertyValueRaw(propertyValues, propertyTypes),
        recipient.address().hex()
      ],
      extraArgs
    );
  }
  /**
   * Burn a token by its creator
   * @param creator Creator account
   * @param token Token address
   * @returns The hash of the transaction submitted to the API
   */
  async burnToken(creator, token, tokenType, extraArgs) {
    return this.submitTransaction(
      creator,
      "burn",
      [tokenType || this.tokenType],
      [HexString.ensure(token).hex()],
      extraArgs
    );
  }
  /**
   * Freeze token transfer ability
   * @param creator Creator account
   * @param token Token address
   * @returns The hash of the transaction submitted to the API
   */
  async freezeTokenTransafer(creator, token, tokenType, extraArgs) {
    return this.submitTransaction(
      creator,
      "freeze_transfer",
      [tokenType || this.tokenType],
      [HexString.ensure(token).hex()],
      extraArgs
    );
  }
  /**
   * Unfreeze token transfer ability
   * @param creator Creator account
   * @param token Token address
   * @returns The hash of the transaction submitted to the API
   */
  async unfreezeTokenTransafer(creator, token, tokenType, extraArgs) {
    return this.submitTransaction(
      creator,
      "unfreeze_transfer",
      [tokenType || this.tokenType],
      [HexString.ensure(token).hex()],
      extraArgs
    );
  }
  /**
   * Set token description
   * @param creator Creator account
   * @param token Token address
   * @param description Token description
   * @returns The hash of the transaction submitted to the API
   */
  async setTokenDescription(creator, token, description, tokenType, extraArgs) {
    return this.submitTransaction(
      creator,
      "set_description",
      [tokenType || this.tokenType],
      [HexString.ensure(token).hex(), description],
      extraArgs
    );
  }
  /**
   * Set token name
   * @param creator Creator account
   * @param token Token address
   * @param name Token name
   * @returns The hash of the transaction submitted to the API
   */
  async setTokenName(creator, token, name, tokenType, extraArgs) {
    return this.submitTransaction(
      creator,
      "set_name",
      [tokenType || this.tokenType],
      [HexString.ensure(token).hex(), name],
      extraArgs
    );
  }
  /**
   * Set token URI
   * @param creator Creator account
   * @param token Token address
   * @param uri Token uri
   * @returns The hash of the transaction submitted to the API
   */
  async setTokenURI(creator, token, uri, tokenType, extraArgs) {
    return this.submitTransaction(
      creator,
      "set_uri",
      [tokenType || this.tokenType],
      [HexString.ensure(token).hex(), uri],
      extraArgs
    );
  }
  /**
   * Add token property
   * @param creator Creator account
   * @param token Token address
   * @param key the property key for storing on-chain property
   * @param type the type of property value
   * @param value the property value to be stored on-chain
   * @returns The hash of the transaction submitted to the API
   */
  async addTokenProperty(creator, token, propertyKey, propertyType, propertyValue, tokenType, extraArgs) {
    return this.submitTransaction(
      creator,
      "add_property",
      [tokenType || this.tokenType],
      [
        HexString.ensure(token).hex(),
        propertyKey,
        PropertyTypeMap[propertyType],
        getSinglePropertyValueRaw(propertyValue, PropertyTypeMap[propertyType])
      ],
      extraArgs
    );
  }
  /**
   * Remove token property
   * @param creator Creator account
   * @param token Token address
   * @param key the property key stored on-chain
   * @returns The hash of the transaction submitted to the API
   */
  async removeTokenProperty(creator, token, propertyKey, tokenType, extraArgs) {
    return this.submitTransaction(
      creator,
      "remove_property",
      [tokenType || this.tokenType],
      [HexString.ensure(token).hex(), propertyKey],
      extraArgs
    );
  }
  /**
   * Update token property
   * @param creator Creator account
   * @param token Token address
   * @param key the property key stored on-chain
   * @param type the property typed stored on-chain
   * @param value the property value to be stored on-chain
   * @returns The hash of the transaction submitted to the API
   */
  async updateTokenProperty(creator, token, propertyKey, propertyType, propertyValue, tokenType, extraArgs) {
    return this.submitTransaction(
      creator,
      "update_property",
      [tokenType || this.tokenType],
      [
        HexString.ensure(token).hex(),
        propertyKey,
        PropertyTypeMap[propertyType],
        getSinglePropertyValueRaw(propertyValue, PropertyTypeMap[propertyType])
      ],
      extraArgs
    );
  }
  async addTypedProperty(creator, token, propertyKey, propertyType, propertyValue, tokenType, extraArgs) {
    return this.submitTransaction(
      creator,
      "add_typed_property",
      [tokenType || this.tokenType, PropertyTypeMap[propertyType]],
      [HexString.ensure(token).hex(), propertyKey, propertyValue],
      extraArgs
    );
  }
  async updateTypedProperty(creator, token, propertyKey, propertyType, propertyValue, tokenType, extraArgs) {
    return this.submitTransaction(
      creator,
      "update_typed_property",
      [tokenType || this.tokenType, PropertyTypeMap[propertyType]],
      [HexString.ensure(token).hex(), propertyKey, propertyValue],
      extraArgs
    );
  }
  /**
   * Transfer a non fungible token ownership.
   * We can transfer a token only when the token is not frozen (i.e. owner transfer is not disabled such as for soul bound tokens)
   * @param owner The account of the current token owner
   * @param token Token address
   * @param recipient Recipient address
   * @returns The hash of the transaction submitted to the API
   */
  async transferTokenOwnership(owner, token, recipient, tokenType, extraArgs) {
    const builder = new TransactionBuilderRemoteABI(this.provider, {
      sender: owner.address(),
      ...extraArgs
    });
    const rawTxn = await builder.build(
      "0x1::object::transfer",
      [tokenType || this.tokenType],
      [HexString.ensure(token).hex(), HexString.ensure(recipient).hex()]
    );
    const bcsTxn = AptosClient.generateBCSTransaction(owner, rawTxn);
    const pendingTransaction = await this.provider.submitSignedBCSTransaction(bcsTxn);
    return pendingTransaction.hash;
  }
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
  async transfer(data, isFungibleToken) {
    let isFungible = isFungibleToken;
    if (isFungible === void 0 || isFungible === null) {
      const tokenData = await this.provider.getTokenData(HexString.ensure(data.tokenAddress).hex());
      isFungible = tokenData.current_token_datas_v2[0].is_fungible_v2;
    }
    if (isFungible) {
      const token2 = data;
      const fungibleAsset = new FungibleAssetClient(this.provider);
      const txnHash2 = await fungibleAsset.transfer(
        token2.owner,
        token2.tokenAddress,
        token2.recipient,
        token2.amount,
        token2.extraArgs
      );
      return txnHash2;
    }
    const token = data;
    const txnHash = await this.transferTokenOwnership(
      token.owner,
      token.tokenAddress,
      token.recipient,
      token.tokenType,
      token.extraArgs
    );
    return txnHash;
  }
  /**
   * Burn an object by the object owner
   * @param owner The object owner account
   * @param objectId The object address
   * @optional objectType. The object type, default to "0x1::object::ObjectCore"
   * @returns The hash of the transaction submitted to the API
   */
  async burnObject(owner, objectId, objectType, extraArgs) {
    const builder = new TransactionBuilderRemoteABI(this.provider, {
      sender: owner.address(),
      ...extraArgs
    });
    const rawTxn = await builder.build(
      "0x1::object::burn",
      [objectType || "0x1::object::ObjectCore"],
      [HexString.ensure(objectId).hex()]
    );
    const bcsTxn = AptosClient.generateBCSTransaction(owner, rawTxn);
    const pendingTransaction = await this.provider.submitSignedBCSTransaction(bcsTxn);
    return pendingTransaction.hash;
  }
};

// src/plugins/coin_client.ts
var TRANSFER_COINS = "0x1::aptos_account::transfer_coins";
var COIN_TRANSFER = "0x1::coin::transfer";
var CoinClient = class {
  /**
   * Creates new CoinClient instance
   * @param aptosClient AptosClient instance
   */
  constructor(aptosClient2) {
    this.aptosClient = aptosClient2;
  }
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
  // :!:>transfer
  async transfer(from, to, amount, extraArgs) {
    var _a, _b, _c;
    const isTypeTag = ((_a = extraArgs == null ? void 0 : extraArgs.coinType) != null ? _a : "").toString().includes("::");
    if ((extraArgs == null ? void 0 : extraArgs.coinType) && !isTypeTag && AccountAddress.isValid(extraArgs.coinType)) {
      console.warn("to transfer a fungible asset, use `FungibleAssetClient()` class for better support");
      const provider = new Provider({
        fullnodeUrl: this.aptosClient.nodeUrl,
        indexerUrl: (_b = NetworkToIndexerAPI[NodeAPIToNetwork[this.aptosClient.nodeUrl]]) != null ? _b : this.aptosClient.nodeUrl
      });
      const fungibleAsset = new FungibleAssetClient(provider);
      const txnHash = await fungibleAsset.transfer(
        from,
        extraArgs == null ? void 0 : extraArgs.coinType,
        getAddressFromAccountOrAddress(to),
        amount
      );
      return txnHash;
    }
    const coinTypeToTransfer = (_c = extraArgs == null ? void 0 : extraArgs.coinType) != null ? _c : APTOS_COIN;
    let func;
    if ((extraArgs == null ? void 0 : extraArgs.createReceiverIfMissing) === void 0) {
      func = TRANSFER_COINS;
    } else {
      func = (extraArgs == null ? void 0 : extraArgs.createReceiverIfMissing) ? TRANSFER_COINS : COIN_TRANSFER;
    }
    const toAddress = getAddressFromAccountOrAddress(to);
    const builder = new TransactionBuilderRemoteABI(this.aptosClient, { sender: from.address(), ...extraArgs });
    const rawTxn = await builder.build(func, [coinTypeToTransfer], [toAddress, amount]);
    const bcsTxn = AptosClient.generateBCSTransaction(from, rawTxn);
    const pendingTransaction = await this.aptosClient.submitSignedBCSTransaction(bcsTxn);
    return pendingTransaction.hash;
  }
  // <:!:transfer
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
  // :!:>checkBalance
  async checkBalance(account, extraArgs) {
    var _a, _b, _c;
    const isTypeTag = ((_a = extraArgs == null ? void 0 : extraArgs.coinType) != null ? _a : "").toString().includes("::");
    if ((extraArgs == null ? void 0 : extraArgs.coinType) && !isTypeTag && AccountAddress.isValid(extraArgs.coinType)) {
      console.warn("to check balance of a fungible asset, use `FungibleAssetClient()` class for better support");
      const provider = new Provider({
        fullnodeUrl: this.aptosClient.nodeUrl,
        indexerUrl: (_b = NetworkToIndexerAPI[NodeAPIToNetwork[this.aptosClient.nodeUrl]]) != null ? _b : this.aptosClient.nodeUrl
      });
      const fungibleAsset = new FungibleAssetClient(provider);
      const balance = await fungibleAsset.getPrimaryBalance(
        getAddressFromAccountOrAddress(account),
        extraArgs == null ? void 0 : extraArgs.coinType
      );
      return balance;
    }
    const coinType = (_c = extraArgs == null ? void 0 : extraArgs.coinType) != null ? _c : APTOS_COIN;
    const typeTag = `0x1::coin::CoinStore<${coinType}>`;
    const address = getAddressFromAccountOrAddress(account);
    const accountResource = await this.aptosClient.getAccountResource(address, typeTag);
    return BigInt(accountResource.data.coin.value);
  }
  // <:!:checkBalance
};

// src/plugins/faucet_client.ts
var FaucetClient = class extends AptosClient {
  /**
   * Establishes a connection to Aptos node
   * @param nodeUrl A url of the Aptos Node API endpoint
   * @param faucetUrl A faucet url
   * @param config An optional config for inner axios instance
   * Detailed config description: {@link https://github.com/axios/axios#request-config}
   */
  constructor(nodeUrl, faucetUrl, config) {
    super(nodeUrl, config);
    if (!faucetUrl) {
      throw new Error("Faucet URL cannot be empty.");
    }
    this.faucetUrl = faucetUrl;
    this.config = config;
  }
  /**
   * This creates an account if it does not exist and mints the specified amount of
   * coins into that account
   * @param address Hex-encoded 16 bytes Aptos account address wich mints tokens
   * @param amount Amount of tokens to mint
   * @param timeoutSecs
   * @returns Hashes of submitted transactions
   */
  async fundAccount(address, amount, timeoutSecs = DEFAULT_TXN_TIMEOUT_SEC) {
    const { data } = await post({
      url: this.faucetUrl,
      endpoint: "mint",
      body: null,
      params: {
        address: HexString.ensure(address).noPrefix(),
        amount
      },
      overrides: { ...this.config },
      originMethod: "fundAccount"
    });
    const promises = [];
    for (let i = 0; i < data.length; i += 1) {
      const tnxHash = data[i];
      promises.push(this.waitForTransaction(tnxHash, { timeoutSecs }));
    }
    await Promise.all(promises);
    return data;
  }
};

// src/plugins/ans_client.ts
var ansContractsMap = {
  testnet: "0x5f8fd2347449685cf41d4db97926ec3a096eaf381332be4f1318ad4d16a8497c",
  mainnet: "0x867ed1f6bf916171b1de3ee92849b8978b7d1b9e0a8cc982a3d19d535dfd9c0c"
};
var nameComponentPattern = /^[a-z\d][a-z\d-]{1,61}[a-z\d]$/;
var namePattern = new RegExp(
  "^(?:(?<subdomain>[^.]+)\\.(?!apt$))?(?<domain>[^.]+)(?:\\.apt)?$"
);
var AnsClient = class {
  /**
   * Creates new AnsClient instance
   * @param provider Provider instance
   * @param contractAddress An optional contract address.
   * If there is no contract address matching to the provided network
   * then the AnsClient class expects a contract address -
   * this is to support both mainnet/testnet networks and local development.
   */
  constructor(provider, contractAddress) {
    var _a;
    this.provider = provider;
    if (!ansContractsMap[this.provider.network] && !contractAddress) {
      throw new Error("Error: For custom providers, you must pass in a contract address");
    }
    this.contractAddress = (_a = ansContractsMap[this.provider.network]) != null ? _a : contractAddress;
  }
  /**
   * Returns the primary name for the given account address
   * @param address An account address
   * @returns Account's primary name | null if there is no primary name defined
   */
  async getPrimaryNameByAddress(address) {
    const ansResource = await this.provider.getAccountResource(
      this.contractAddress,
      `${this.contractAddress}::domains::ReverseLookupRegistryV1`
    );
    const data = ansResource.data;
    const { handle } = data.registry;
    const domainsTableItemRequest = {
      key_type: "address",
      value_type: `${this.contractAddress}::domains::NameRecordKeyV1`,
      key: address
    };
    try {
      const item = await this.provider.getTableItem(handle, domainsTableItemRequest);
      return item.subdomain_name.vec[0] ? `${item.subdomain_name.vec[0]}.${item.domain_name}` : item.domain_name;
    } catch (error) {
      if (error.status === 404) {
        return null;
      }
      throw new Error(error);
    }
  }
  /**
   * Returns the target account address for the given name
   * @param name ANS name
   * @returns Account address | null
   */
  async getAddressByName(name) {
    var _a, _b;
    const { domain, subdomain } = (_b = (_a = name.match(namePattern)) == null ? void 0 : _a.groups) != null ? _b : {};
    if (!domain)
      return null;
    const registration = subdomain ? await this.getRegistrationForSubdomainName(domain, subdomain) : await this.getRegistrationForDomainName(domain);
    return registration === null ? null : registration.target;
  }
  /**
   * Mint a new Aptos name
   *
   * @param account AptosAccount where collection will be created
   * @param domainName Aptos domain name to mint
   * @param years year duration of the domain name
   * @returns The hash of the pending transaction submitted to the API
   */
  async mintAptosName(account, domainName, years = 1, extraArgs) {
    if (domainName.match(nameComponentPattern) === null) {
      throw new ApiError(400, `Name ${domainName} is not valid`);
    }
    const registration = await this.getRegistrationForDomainName(domainName);
    if (registration) {
      const now2 = Math.ceil(Date.now() / 1e3);
      if (now2 < registration.expirationTimestampSeconds) {
        throw new ApiError(400, `Name ${domainName} is not available`);
      }
    }
    const builder = new TransactionBuilderRemoteABI(this.provider.aptosClient, {
      sender: account.address(),
      ...extraArgs
    });
    const rawTxn = await builder.build(`${this.contractAddress}::domains::register_domain`, [], [domainName, years]);
    const bcsTxn = AptosClient.generateBCSTransaction(account, rawTxn);
    const pendingTransaction = await this.provider.submitSignedBCSTransaction(bcsTxn);
    return pendingTransaction.hash;
  }
  /**
   * Mint a new Aptos Subdomain
   *
   * @param account AptosAccount the owner of the domain name
   * @param subdomainName subdomain name to mint
   * @param domainName Aptos domain name to mint under
   * @param expirationTimestampSeconds must be set between the domains expiration and the current time
   * @returns The hash of the pending transaction submitted to the API
   */
  async mintAptosSubdomain(account, subdomainName, domainName, expirationTimestampSeconds, extraArgs) {
    if (domainName.match(nameComponentPattern) === null) {
      throw new ApiError(400, `Domain name ${domainName} is not valid`);
    }
    if (subdomainName.match(nameComponentPattern) === null) {
      throw new ApiError(400, `Subdomain name ${subdomainName} is not valid`);
    }
    const subdomainRegistration = await this.getRegistrationForSubdomainName(domainName, subdomainName);
    if (subdomainRegistration) {
      const now3 = Math.ceil(Date.now() / 1e3);
      if (now3 < subdomainRegistration.expirationTimestampSeconds) {
        throw new ApiError(400, `Name ${subdomainName}.${domainName} is not available`);
      }
    }
    const domainRegistration = await this.getRegistrationForDomainName(domainName);
    if (domainRegistration === null) {
      throw new ApiError(400, `Domain name ${domainName} does not exist`);
    }
    const now2 = Math.ceil(Date.now() / 1e3);
    if (domainRegistration.expirationTimestampSeconds < now2) {
      throw new ApiError(400, `Domain name ${domainName} expired`);
    }
    const actualExpirationTimestampSeconds = expirationTimestampSeconds || domainRegistration.expirationTimestampSeconds;
    if (actualExpirationTimestampSeconds < now2) {
      throw new ApiError(400, `Expiration for ${subdomainName}.${domainName} is before now`);
    }
    const builder = new TransactionBuilderRemoteABI(this.provider.aptosClient, {
      sender: account.address(),
      ...extraArgs
    });
    const rawTxn = await builder.build(
      `${this.contractAddress}::domains::register_subdomain`,
      [],
      [subdomainName, domainName, actualExpirationTimestampSeconds]
    );
    const bcsTxn = AptosClient.generateBCSTransaction(account, rawTxn);
    const pendingTransaction = await this.provider.submitSignedBCSTransaction(bcsTxn);
    return pendingTransaction.hash;
  }
  /**
   * @param account AptosAccount the owner of the domain name
   * @param subdomainName subdomain name to mint
   * @param domainName Aptos domain name to mint
   * @param target the target address for the subdomain
   * @returns The hash of the pending transaction submitted to the API
   */
  async setSubdomainAddress(account, subdomainName, domainName, target, extraArgs) {
    const standardizeAddress = AccountAddress.standardizeAddress(target);
    if (domainName.match(nameComponentPattern) === null) {
      throw new ApiError(400, `Name ${domainName} is not valid`);
    }
    if (subdomainName.match(nameComponentPattern) === null) {
      throw new ApiError(400, `Name ${subdomainName} is not valid`);
    }
    const builder = new TransactionBuilderRemoteABI(this.provider.aptosClient, {
      sender: account.address(),
      ...extraArgs
    });
    const rawTxn = await builder.build(
      `${this.contractAddress}::domains::set_subdomain_address`,
      [],
      [subdomainName, domainName, standardizeAddress]
    );
    const bcsTxn = AptosClient.generateBCSTransaction(account, rawTxn);
    const pendingTransaction = await this.provider.submitSignedBCSTransaction(bcsTxn);
    return pendingTransaction.hash;
  }
  /**
   * Initialize reverse lookup for contract owner
   *
   * @param owner the `aptos_names` AptosAccount
   * @returns The hash of the pending transaction submitted to the API
   */
  async initReverseLookupRegistry(owner, extraArgs) {
    const builder = new TransactionBuilderRemoteABI(this.provider.aptosClient, {
      sender: owner.address(),
      ...extraArgs
    });
    const rawTxn = await builder.build(`${this.contractAddress}::domains::init_reverse_lookup_registry_v1`, [], []);
    const bcsTxn = AptosClient.generateBCSTransaction(owner, rawTxn);
    const pendingTransaction = await this.provider.submitSignedBCSTransaction(bcsTxn);
    return pendingTransaction.hash;
  }
  /**
   * Returns the AnsRegistry for the given domain name
   * @param domain domain name
   * @example
   * if name is `aptos.apt`
   * domain = aptos
   *
   * @returns AnsRegistry | null
   */
  async getRegistrationForDomainName(domain) {
    if (domain.match(nameComponentPattern) === null)
      return null;
    const ansResource = await this.provider.getAccountResource(
      this.contractAddress,
      `${this.contractAddress}::domains::NameRegistryV1`
    );
    const data = ansResource.data;
    const { handle } = data.registry;
    const domainsTableItemRequest = {
      key_type: `${this.contractAddress}::domains::NameRecordKeyV1`,
      value_type: `${this.contractAddress}::domains::NameRecordV1`,
      key: {
        subdomain_name: { vec: [] },
        domain_name: domain
      }
    };
    try {
      const item = await this.provider.getTableItem(handle, domainsTableItemRequest);
      return {
        target: item.target_address.vec.length === 1 ? item.target_address.vec[0] : null,
        expirationTimestampSeconds: item.expiration_time_sec
      };
    } catch (error) {
      if (error.status === 404) {
        return null;
      }
      throw new Error(error);
    }
  }
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
  async getRegistrationForSubdomainName(domain, subdomain) {
    if (domain.match(nameComponentPattern) === null)
      return null;
    if (subdomain.match(nameComponentPattern) === null)
      return null;
    const ansResource = await this.provider.getAccountResource(
      this.contractAddress,
      `${this.contractAddress}::domains::NameRegistryV1`
    );
    const data = ansResource.data;
    const { handle } = data.registry;
    const domainsTableItemRequest = {
      key_type: `${this.contractAddress}::domains::NameRecordKeyV1`,
      value_type: `${this.contractAddress}::domains::NameRecordV1`,
      key: {
        subdomain_name: { vec: [subdomain] },
        domain_name: domain
      }
    };
    try {
      const item = await this.provider.getTableItem(handle, domainsTableItemRequest);
      return {
        target: item.target_address.vec.length === 1 ? item.target_address.vec[0] : null,
        expirationTimestampSeconds: item.expiration_time_sec
      };
    } catch (error) {
      if (error.status === 404) {
        return null;
      }
      throw new Error(error);
    }
  }
};

// src/transactions/account_sequence_number.ts
var now = () => Math.floor(Date.now() / 1e3);
var AccountSequenceNumber = class {
  constructor(provider, account, maxWaitTime, maximumInFlight, sleepTime) {
    // sequence number on chain
    this.lastUncommintedNumber = null;
    // local sequence number
    this.currentNumber = null;
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
    this.lock = false;
    this.provider = provider;
    this.account = account;
    this.maxWaitTime = maxWaitTime;
    this.maximumInFlight = maximumInFlight;
    this.sleepTime = sleepTime;
  }
  /**
   * Returns the next available sequence number for this account
   *
   * @returns next available sequence number
   */
  async nextSequenceNumber() {
    while (this.lock) {
      await sleep(this.sleepTime);
    }
    this.lock = true;
    let nextNumber = BigInt(0);
    try {
      if (this.lastUncommintedNumber === null || this.currentNumber === null) {
        await this.initialize();
      }
      if (this.currentNumber - this.lastUncommintedNumber >= this.maximumInFlight) {
        await this.update();
        const startTime = now();
        while (this.currentNumber - this.lastUncommintedNumber >= this.maximumInFlight) {
          await sleep(this.sleepTime);
          if (now() - startTime > this.maxWaitTime) {
            console.warn(`Waited over 30 seconds for a transaction to commit, resyncing ${this.account.address()}`);
            await this.initialize();
          } else {
            await this.update();
          }
        }
      }
      nextNumber = this.currentNumber;
      this.currentNumber += BigInt(1);
    } catch (e) {
      console.error("error in getting next sequence number for this account", e);
    } finally {
      this.lock = false;
    }
    return nextNumber;
  }
  /**
   * Initializes this account with the sequence number on chain
   */
  async initialize() {
    const { sequence_number: sequenceNumber } = await this.provider.getAccount(this.account.address());
    this.currentNumber = BigInt(sequenceNumber);
    this.lastUncommintedNumber = BigInt(sequenceNumber);
  }
  /**
   * Updates this account sequence number with the one on-chain
   *
   * @returns on-chain sequence number for this account
   */
  async update() {
    const { sequence_number: sequenceNumber } = await this.provider.getAccount(this.account.address());
    this.lastUncommintedNumber = BigInt(sequenceNumber);
    return this.lastUncommintedNumber;
  }
  /**
   * Synchronizes local sequence number with the seqeunce number on chain for this account.
   *
   * Poll the network until all submitted transactions have either been committed or until
   * the maximum wait time has elapsed
   */
  async synchronize() {
    if (this.lastUncommintedNumber === this.currentNumber)
      return;
    while (this.lock) {
      await sleep(this.sleepTime);
    }
    this.lock = true;
    try {
      await this.update();
      const startTime = now();
      while (this.lastUncommintedNumber !== this.currentNumber) {
        if (now() - startTime > this.maxWaitTime) {
          console.warn(`Waited over 30 seconds for a transaction to commit, resyncing ${this.account.address()}`);
          await this.initialize();
        } else {
          await sleep(this.sleepTime);
          await this.update();
        }
      }
    } catch (e) {
      console.error("error in synchronizing this account sequence number with the one on chain", e);
    } finally {
      this.lock = false;
    }
  }
};

// src/transactions/transaction_worker.ts
import EventEmitter from "eventemitter3";

// src/transactions/async_queue.ts
var AsyncQueue = class {
  constructor() {
    this.queue = [];
    // The pendingDequeue is used to handle the resolution of promises when items are enqueued and dequeued.
    this.pendingDequeue = [];
    this.cancelled = false;
  }
  /**
   * The enqueue method adds an item to the queue. If there are pending dequeued promises,
   * in the pendingDequeue, it resolves the oldest promise with the enqueued item immediately.
   * Otherwise, it adds the item to the queue.
   *
   * @param item T
   */
  enqueue(item) {
    this.cancelled = false;
    if (this.pendingDequeue.length > 0) {
      const promise = this.pendingDequeue.shift();
      promise == null ? void 0 : promise.resolve(item);
      return;
    }
    this.queue.push(item);
  }
  /**
   * The dequeue method returns a promise that resolves to the next item in the queue.
   * If the queue is not empty, it resolves the promise immediately with the next item.
   * Otherwise, it creates a new promise. The promise's resolve function is stored
   * in the pendingDequeue with a unique counter value as the key.
   * The newly created promise is then returned, and it will be resolved later when an item is enqueued.
   *
   * @returns Promise<T>
   */
  async dequeue() {
    if (this.queue.length > 0) {
      return Promise.resolve(this.queue.shift());
    }
    return new Promise((resolve, reject) => {
      this.pendingDequeue.push({ resolve, reject });
    });
  }
  /**
   * The isEmpty method returns whether the queue is empty or not.
   *
   * @returns boolean
   */
  isEmpty() {
    return this.queue.length === 0;
  }
  /**
   * The cancel method cancels all pending promises in the queue.
   * It rejects the promises with a AsyncQueueCancelledError error,
   * ensuring that any awaiting code can handle the cancellation appropriately.
   */
  cancel() {
    this.cancelled = true;
    this.pendingDequeue.forEach(async ({ reject }) => {
      reject(new AsyncQueueCancelledError("Task cancelled"));
    });
    this.pendingDequeue = [];
    this.queue.length = 0;
  }
  /**
   * The isCancelled method returns whether the queue is cancelled or not.
   *
   * @returns boolean
   */
  isCancelled() {
    return this.cancelled;
  }
  /**
   * The pendingDequeueLength method returns the length of the pendingDequeue.
   *
   * @returns number
   */
  pendingDequeueLength() {
    return this.pendingDequeue.length;
  }
};
var AsyncQueueCancelledError = class extends Error {
};

// src/transactions/transaction_worker.ts
var promiseFulfilledStatus = "fulfilled";
var TransactionWorkerEvents = /* @__PURE__ */ ((TransactionWorkerEvents2) => {
  TransactionWorkerEvents2["TransactionSent"] = "transactionSent";
  TransactionWorkerEvents2["TransactionSendFailed"] = "transactionsendFailed";
  TransactionWorkerEvents2["TransactionExecuted"] = "transactionExecuted";
  TransactionWorkerEvents2["TransactionExecutionFailed"] = "transactionexecutionFailed";
  return TransactionWorkerEvents2;
})(TransactionWorkerEvents || {});
var TransactionWorker = class extends EventEmitter {
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
  constructor(provider, account, maxWaitTime = 30, maximumInFlight = 100, sleepTime = 10) {
    super();
    this.taskQueue = new AsyncQueue();
    /**
     * transactions payloads waiting to be generated and signed
     *
     * TODO support entry function payload from ABI builder
     */
    this.transactionsQueue = new AsyncQueue();
    /**
     * signed transactions waiting to be submitted
     */
    this.outstandingTransactions = new AsyncQueue();
    /**
     * transactions that have been submitted to chain
     */
    this.sentTransactions = [];
    /**
     * transactions that have been committed to chain
     */
    this.executedTransactions = [];
    this.provider = provider;
    this.account = account;
    this.started = false;
    this.accountSequnceNumber = new AccountSequenceNumber(provider, account, maxWaitTime, maximumInFlight, sleepTime);
  }
  /**
   * Gets the current account sequence number,
   * generates the transaction with the account sequence number,
   * adds the transaction to the outstanding transaction queue
   * to be processed later.
   */
  async submitNextTransaction() {
    try {
      while (true) {
        if (this.transactionsQueue.isEmpty())
          return;
        const sequenceNumber = await this.accountSequnceNumber.nextSequenceNumber();
        if (sequenceNumber === null)
          return;
        const transaction = await this.generateNextTransaction(this.account, sequenceNumber);
        if (!transaction)
          return;
        const pendingTransaction = this.provider.submitSignedBCSTransaction(transaction);
        await this.outstandingTransactions.enqueue([pendingTransaction, sequenceNumber]);
      }
    } catch (error) {
      if (error instanceof AsyncQueueCancelledError) {
        return;
      }
      console.log(error);
    }
  }
  /**
   * Reads the outstanding transaction queue and submits the transaction to chain.
   *
   * If the transaction has fulfilled, it pushes the transaction to the processed
   * transactions queue and fires a transactionsFulfilled event.
   *
   * If the transaction has failed, it pushes the transaction to the processed
   * transactions queue with the failure reason and fires a transactionsFailed event.
   */
  async processTransactions() {
    try {
      while (true) {
        const awaitingTransactions = [];
        const sequenceNumbers = [];
        let [pendingTransaction, sequenceNumber] = await this.outstandingTransactions.dequeue();
        awaitingTransactions.push(pendingTransaction);
        sequenceNumbers.push(sequenceNumber);
        while (!this.outstandingTransactions.isEmpty()) {
          [pendingTransaction, sequenceNumber] = await this.outstandingTransactions.dequeue();
          awaitingTransactions.push(pendingTransaction);
          sequenceNumbers.push(sequenceNumber);
        }
        const sentTransactions = await Promise.allSettled(awaitingTransactions);
        for (let i = 0; i < sentTransactions.length && i < sequenceNumbers.length; i += 1) {
          const sentTransaction = sentTransactions[i];
          sequenceNumber = sequenceNumbers[i];
          if (sentTransaction.status === promiseFulfilledStatus) {
            this.sentTransactions.push([sentTransaction.value.hash, sequenceNumber, null]);
            this.emit("transactionSent" /* TransactionSent */, [
              this.sentTransactions.length,
              sentTransaction.value.hash
            ]);
            await this.checkTransaction(sentTransaction, sequenceNumber);
          } else {
            this.sentTransactions.push([sentTransaction.status, sequenceNumber, sentTransaction.reason]);
            this.emit("transactionsendFailed" /* TransactionSendFailed */, [
              this.sentTransactions.length,
              sentTransaction.reason
            ]);
          }
        }
      }
    } catch (error) {
      if (error instanceof AsyncQueueCancelledError) {
        return;
      }
      console.log(error);
    }
  }
  /**
   * Once transaction has been sent to chain, we check for its execution status.
   * @param sentTransaction transactions that were sent to chain and are now waiting to be executed
   * @param sequenceNumber the account's sequence number that was sent with the transaction
   */
  async checkTransaction(sentTransaction, sequenceNumber) {
    const waitFor = [];
    waitFor.push(this.provider.waitForTransactionWithResult(sentTransaction.value.hash, { checkSuccess: true }));
    const sentTransactions = await Promise.allSettled(waitFor);
    for (let i = 0; i < sentTransactions.length; i += 1) {
      const executedTransaction = sentTransactions[i];
      if (executedTransaction.status === promiseFulfilledStatus) {
        this.executedTransactions.push([executedTransaction.value.hash, sequenceNumber, null]);
        this.emit("transactionExecuted" /* TransactionExecuted */, [
          this.executedTransactions.length,
          executedTransaction.value.hash
        ]);
      } else {
        this.executedTransactions.push([executedTransaction.status, sequenceNumber, executedTransaction.reason]);
        this.emit("transactionexecutionFailed" /* TransactionExecutionFailed */, [
          this.executedTransactions.length,
          executedTransaction.reason
        ]);
      }
    }
  }
  /**
   * Push transaction to the transactions queue
   * @param payload Transaction payload
   */
  async push(payload) {
    await this.transactionsQueue.enqueue(payload);
  }
  /**
   * Generates a signed transaction that can be submitted to chain
   * @param account an Aptos account
   * @param sequenceNumber a sequence number the transaction will be generated with
   * @returns
   */
  async generateNextTransaction(account, sequenceNumber) {
    if (this.transactionsQueue.isEmpty())
      return void 0;
    const payload = await this.transactionsQueue.dequeue();
    const rawTransaction = await this.provider.generateRawTransaction(account.address(), payload, {
      providedSequenceNumber: sequenceNumber
    });
    const signedTransaction = AptosClient.generateBCSTransaction(account, rawTransaction);
    return signedTransaction;
  }
  /**
   * Starts transaction submission and transaction processing.
   */
  async run() {
    try {
      while (!this.taskQueue.isCancelled()) {
        const task = await this.taskQueue.dequeue();
        await task();
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   * Starts the transaction management process.
   */
  start() {
    if (this.started) {
      throw new Error("worker has already started");
    }
    this.started = true;
    this.taskQueue.enqueue(() => this.submitNextTransaction());
    this.taskQueue.enqueue(() => this.processTransactions());
    this.run();
  }
  /**
   * Stops the the transaction management process.
   */
  stop() {
    if (this.taskQueue.isCancelled()) {
      throw new Error("worker has already stopped");
    }
    this.started = false;
    this.taskQueue.cancel();
  }
};

// src/generated/index.ts
var generated_exports = {};
__export(generated_exports, {
  AptosErrorCode: () => AptosErrorCode,
  MoveFunctionVisibility: () => MoveFunctionVisibility,
  RoleType: () => RoleType
});

// src/generated/models/AptosErrorCode.ts
var AptosErrorCode = /* @__PURE__ */ ((AptosErrorCode2) => {
  AptosErrorCode2["ACCOUNT_NOT_FOUND"] = "account_not_found";
  AptosErrorCode2["RESOURCE_NOT_FOUND"] = "resource_not_found";
  AptosErrorCode2["MODULE_NOT_FOUND"] = "module_not_found";
  AptosErrorCode2["STRUCT_FIELD_NOT_FOUND"] = "struct_field_not_found";
  AptosErrorCode2["VERSION_NOT_FOUND"] = "version_not_found";
  AptosErrorCode2["TRANSACTION_NOT_FOUND"] = "transaction_not_found";
  AptosErrorCode2["TABLE_ITEM_NOT_FOUND"] = "table_item_not_found";
  AptosErrorCode2["BLOCK_NOT_FOUND"] = "block_not_found";
  AptosErrorCode2["STATE_VALUE_NOT_FOUND"] = "state_value_not_found";
  AptosErrorCode2["VERSION_PRUNED"] = "version_pruned";
  AptosErrorCode2["BLOCK_PRUNED"] = "block_pruned";
  AptosErrorCode2["INVALID_INPUT"] = "invalid_input";
  AptosErrorCode2["INVALID_TRANSACTION_UPDATE"] = "invalid_transaction_update";
  AptosErrorCode2["SEQUENCE_NUMBER_TOO_OLD"] = "sequence_number_too_old";
  AptosErrorCode2["VM_ERROR"] = "vm_error";
  AptosErrorCode2["HEALTH_CHECK_FAILED"] = "health_check_failed";
  AptosErrorCode2["MEMPOOL_IS_FULL"] = "mempool_is_full";
  AptosErrorCode2["INTERNAL_ERROR"] = "internal_error";
  AptosErrorCode2["WEB_FRAMEWORK_ERROR"] = "web_framework_error";
  AptosErrorCode2["BCS_NOT_SUPPORTED"] = "bcs_not_supported";
  AptosErrorCode2["API_DISABLED"] = "api_disabled";
  return AptosErrorCode2;
})(AptosErrorCode || {});

// src/generated/models/MoveFunctionVisibility.ts
var MoveFunctionVisibility = /* @__PURE__ */ ((MoveFunctionVisibility2) => {
  MoveFunctionVisibility2["PRIVATE"] = "private";
  MoveFunctionVisibility2["PUBLIC"] = "public";
  MoveFunctionVisibility2["FRIEND"] = "friend";
  return MoveFunctionVisibility2;
})(MoveFunctionVisibility || {});

// src/generated/models/RoleType.ts
var RoleType = /* @__PURE__ */ ((RoleType2) => {
  RoleType2["VALIDATOR"] = "validator";
  RoleType2["FULL_NODE"] = "full_node";
  return RoleType2;
})(RoleType || {});

// src/indexer/generated/types.ts
var Account_Transactions_Select_Column = /* @__PURE__ */ ((Account_Transactions_Select_Column2) => {
  Account_Transactions_Select_Column2["AccountAddress"] = "account_address";
  Account_Transactions_Select_Column2["TransactionVersion"] = "transaction_version";
  return Account_Transactions_Select_Column2;
})(Account_Transactions_Select_Column || {});
var Address_Events_Summary_Select_Column = /* @__PURE__ */ ((Address_Events_Summary_Select_Column2) => {
  Address_Events_Summary_Select_Column2["AccountAddress"] = "account_address";
  Address_Events_Summary_Select_Column2["MinBlockHeight"] = "min_block_height";
  Address_Events_Summary_Select_Column2["NumDistinctVersions"] = "num_distinct_versions";
  return Address_Events_Summary_Select_Column2;
})(Address_Events_Summary_Select_Column || {});
var Address_Version_From_Events_Select_Column = /* @__PURE__ */ ((Address_Version_From_Events_Select_Column2) => {
  Address_Version_From_Events_Select_Column2["AccountAddress"] = "account_address";
  Address_Version_From_Events_Select_Column2["TransactionVersion"] = "transaction_version";
  return Address_Version_From_Events_Select_Column2;
})(Address_Version_From_Events_Select_Column || {});
var Address_Version_From_Move_Resources_Select_Column = /* @__PURE__ */ ((Address_Version_From_Move_Resources_Select_Column2) => {
  Address_Version_From_Move_Resources_Select_Column2["Address"] = "address";
  Address_Version_From_Move_Resources_Select_Column2["TransactionVersion"] = "transaction_version";
  return Address_Version_From_Move_Resources_Select_Column2;
})(Address_Version_From_Move_Resources_Select_Column || {});
var Block_Metadata_Transactions_Select_Column = /* @__PURE__ */ ((Block_Metadata_Transactions_Select_Column2) => {
  Block_Metadata_Transactions_Select_Column2["BlockHeight"] = "block_height";
  Block_Metadata_Transactions_Select_Column2["Epoch"] = "epoch";
  Block_Metadata_Transactions_Select_Column2["FailedProposerIndices"] = "failed_proposer_indices";
  Block_Metadata_Transactions_Select_Column2["Id"] = "id";
  Block_Metadata_Transactions_Select_Column2["PreviousBlockVotesBitvec"] = "previous_block_votes_bitvec";
  Block_Metadata_Transactions_Select_Column2["Proposer"] = "proposer";
  Block_Metadata_Transactions_Select_Column2["Round"] = "round";
  Block_Metadata_Transactions_Select_Column2["Timestamp"] = "timestamp";
  Block_Metadata_Transactions_Select_Column2["Version"] = "version";
  return Block_Metadata_Transactions_Select_Column2;
})(Block_Metadata_Transactions_Select_Column || {});
var Coin_Activities_Select_Column = /* @__PURE__ */ ((Coin_Activities_Select_Column2) => {
  Coin_Activities_Select_Column2["ActivityType"] = "activity_type";
  Coin_Activities_Select_Column2["Amount"] = "amount";
  Coin_Activities_Select_Column2["BlockHeight"] = "block_height";
  Coin_Activities_Select_Column2["CoinType"] = "coin_type";
  Coin_Activities_Select_Column2["EntryFunctionIdStr"] = "entry_function_id_str";
  Coin_Activities_Select_Column2["EventAccountAddress"] = "event_account_address";
  Coin_Activities_Select_Column2["EventCreationNumber"] = "event_creation_number";
  Coin_Activities_Select_Column2["EventIndex"] = "event_index";
  Coin_Activities_Select_Column2["EventSequenceNumber"] = "event_sequence_number";
  Coin_Activities_Select_Column2["IsGasFee"] = "is_gas_fee";
  Coin_Activities_Select_Column2["IsTransactionSuccess"] = "is_transaction_success";
  Coin_Activities_Select_Column2["OwnerAddress"] = "owner_address";
  Coin_Activities_Select_Column2["StorageRefundAmount"] = "storage_refund_amount";
  Coin_Activities_Select_Column2["TransactionTimestamp"] = "transaction_timestamp";
  Coin_Activities_Select_Column2["TransactionVersion"] = "transaction_version";
  return Coin_Activities_Select_Column2;
})(Coin_Activities_Select_Column || {});
var Coin_Balances_Select_Column = /* @__PURE__ */ ((Coin_Balances_Select_Column2) => {
  Coin_Balances_Select_Column2["Amount"] = "amount";
  Coin_Balances_Select_Column2["CoinType"] = "coin_type";
  Coin_Balances_Select_Column2["CoinTypeHash"] = "coin_type_hash";
  Coin_Balances_Select_Column2["OwnerAddress"] = "owner_address";
  Coin_Balances_Select_Column2["TransactionTimestamp"] = "transaction_timestamp";
  Coin_Balances_Select_Column2["TransactionVersion"] = "transaction_version";
  return Coin_Balances_Select_Column2;
})(Coin_Balances_Select_Column || {});
var Coin_Infos_Select_Column = /* @__PURE__ */ ((Coin_Infos_Select_Column2) => {
  Coin_Infos_Select_Column2["CoinType"] = "coin_type";
  Coin_Infos_Select_Column2["CoinTypeHash"] = "coin_type_hash";
  Coin_Infos_Select_Column2["CreatorAddress"] = "creator_address";
  Coin_Infos_Select_Column2["Decimals"] = "decimals";
  Coin_Infos_Select_Column2["Name"] = "name";
  Coin_Infos_Select_Column2["SupplyAggregatorTableHandle"] = "supply_aggregator_table_handle";
  Coin_Infos_Select_Column2["SupplyAggregatorTableKey"] = "supply_aggregator_table_key";
  Coin_Infos_Select_Column2["Symbol"] = "symbol";
  Coin_Infos_Select_Column2["TransactionCreatedTimestamp"] = "transaction_created_timestamp";
  Coin_Infos_Select_Column2["TransactionVersionCreated"] = "transaction_version_created";
  return Coin_Infos_Select_Column2;
})(Coin_Infos_Select_Column || {});
var Coin_Supply_Select_Column = /* @__PURE__ */ ((Coin_Supply_Select_Column2) => {
  Coin_Supply_Select_Column2["CoinType"] = "coin_type";
  Coin_Supply_Select_Column2["CoinTypeHash"] = "coin_type_hash";
  Coin_Supply_Select_Column2["Supply"] = "supply";
  Coin_Supply_Select_Column2["TransactionEpoch"] = "transaction_epoch";
  Coin_Supply_Select_Column2["TransactionTimestamp"] = "transaction_timestamp";
  Coin_Supply_Select_Column2["TransactionVersion"] = "transaction_version";
  return Coin_Supply_Select_Column2;
})(Coin_Supply_Select_Column || {});
var Collection_Datas_Select_Column = /* @__PURE__ */ ((Collection_Datas_Select_Column2) => {
  Collection_Datas_Select_Column2["CollectionDataIdHash"] = "collection_data_id_hash";
  Collection_Datas_Select_Column2["CollectionName"] = "collection_name";
  Collection_Datas_Select_Column2["CreatorAddress"] = "creator_address";
  Collection_Datas_Select_Column2["Description"] = "description";
  Collection_Datas_Select_Column2["DescriptionMutable"] = "description_mutable";
  Collection_Datas_Select_Column2["Maximum"] = "maximum";
  Collection_Datas_Select_Column2["MaximumMutable"] = "maximum_mutable";
  Collection_Datas_Select_Column2["MetadataUri"] = "metadata_uri";
  Collection_Datas_Select_Column2["Supply"] = "supply";
  Collection_Datas_Select_Column2["TableHandle"] = "table_handle";
  Collection_Datas_Select_Column2["TransactionTimestamp"] = "transaction_timestamp";
  Collection_Datas_Select_Column2["TransactionVersion"] = "transaction_version";
  Collection_Datas_Select_Column2["UriMutable"] = "uri_mutable";
  return Collection_Datas_Select_Column2;
})(Collection_Datas_Select_Column || {});
var Current_Ans_Lookup_Select_Column = /* @__PURE__ */ ((Current_Ans_Lookup_Select_Column2) => {
  Current_Ans_Lookup_Select_Column2["Domain"] = "domain";
  Current_Ans_Lookup_Select_Column2["ExpirationTimestamp"] = "expiration_timestamp";
  Current_Ans_Lookup_Select_Column2["IsDeleted"] = "is_deleted";
  Current_Ans_Lookup_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Current_Ans_Lookup_Select_Column2["RegisteredAddress"] = "registered_address";
  Current_Ans_Lookup_Select_Column2["Subdomain"] = "subdomain";
  Current_Ans_Lookup_Select_Column2["TokenName"] = "token_name";
  return Current_Ans_Lookup_Select_Column2;
})(Current_Ans_Lookup_Select_Column || {});
var Current_Ans_Lookup_V2_Select_Column = /* @__PURE__ */ ((Current_Ans_Lookup_V2_Select_Column2) => {
  Current_Ans_Lookup_V2_Select_Column2["Domain"] = "domain";
  Current_Ans_Lookup_V2_Select_Column2["ExpirationTimestamp"] = "expiration_timestamp";
  Current_Ans_Lookup_V2_Select_Column2["IsDeleted"] = "is_deleted";
  Current_Ans_Lookup_V2_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Current_Ans_Lookup_V2_Select_Column2["RegisteredAddress"] = "registered_address";
  Current_Ans_Lookup_V2_Select_Column2["Subdomain"] = "subdomain";
  Current_Ans_Lookup_V2_Select_Column2["TokenName"] = "token_name";
  Current_Ans_Lookup_V2_Select_Column2["TokenStandard"] = "token_standard";
  return Current_Ans_Lookup_V2_Select_Column2;
})(Current_Ans_Lookup_V2_Select_Column || {});
var Current_Aptos_Names_Select_Column = /* @__PURE__ */ ((Current_Aptos_Names_Select_Column2) => {
  Current_Aptos_Names_Select_Column2["Domain"] = "domain";
  Current_Aptos_Names_Select_Column2["DomainWithSuffix"] = "domain_with_suffix";
  Current_Aptos_Names_Select_Column2["ExpirationTimestamp"] = "expiration_timestamp";
  Current_Aptos_Names_Select_Column2["IsActive"] = "is_active";
  Current_Aptos_Names_Select_Column2["IsPrimary"] = "is_primary";
  Current_Aptos_Names_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Current_Aptos_Names_Select_Column2["OwnerAddress"] = "owner_address";
  Current_Aptos_Names_Select_Column2["RegisteredAddress"] = "registered_address";
  Current_Aptos_Names_Select_Column2["Subdomain"] = "subdomain";
  Current_Aptos_Names_Select_Column2["TokenName"] = "token_name";
  Current_Aptos_Names_Select_Column2["TokenStandard"] = "token_standard";
  return Current_Aptos_Names_Select_Column2;
})(Current_Aptos_Names_Select_Column || {});
var Current_Coin_Balances_Select_Column = /* @__PURE__ */ ((Current_Coin_Balances_Select_Column2) => {
  Current_Coin_Balances_Select_Column2["Amount"] = "amount";
  Current_Coin_Balances_Select_Column2["CoinType"] = "coin_type";
  Current_Coin_Balances_Select_Column2["CoinTypeHash"] = "coin_type_hash";
  Current_Coin_Balances_Select_Column2["LastTransactionTimestamp"] = "last_transaction_timestamp";
  Current_Coin_Balances_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Current_Coin_Balances_Select_Column2["OwnerAddress"] = "owner_address";
  return Current_Coin_Balances_Select_Column2;
})(Current_Coin_Balances_Select_Column || {});
var Current_Collection_Datas_Select_Column = /* @__PURE__ */ ((Current_Collection_Datas_Select_Column2) => {
  Current_Collection_Datas_Select_Column2["CollectionDataIdHash"] = "collection_data_id_hash";
  Current_Collection_Datas_Select_Column2["CollectionName"] = "collection_name";
  Current_Collection_Datas_Select_Column2["CreatorAddress"] = "creator_address";
  Current_Collection_Datas_Select_Column2["Description"] = "description";
  Current_Collection_Datas_Select_Column2["DescriptionMutable"] = "description_mutable";
  Current_Collection_Datas_Select_Column2["LastTransactionTimestamp"] = "last_transaction_timestamp";
  Current_Collection_Datas_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Current_Collection_Datas_Select_Column2["Maximum"] = "maximum";
  Current_Collection_Datas_Select_Column2["MaximumMutable"] = "maximum_mutable";
  Current_Collection_Datas_Select_Column2["MetadataUri"] = "metadata_uri";
  Current_Collection_Datas_Select_Column2["Supply"] = "supply";
  Current_Collection_Datas_Select_Column2["TableHandle"] = "table_handle";
  Current_Collection_Datas_Select_Column2["UriMutable"] = "uri_mutable";
  return Current_Collection_Datas_Select_Column2;
})(Current_Collection_Datas_Select_Column || {});
var Current_Collection_Ownership_V2_View_Select_Column = /* @__PURE__ */ ((Current_Collection_Ownership_V2_View_Select_Column2) => {
  Current_Collection_Ownership_V2_View_Select_Column2["CollectionId"] = "collection_id";
  Current_Collection_Ownership_V2_View_Select_Column2["CollectionName"] = "collection_name";
  Current_Collection_Ownership_V2_View_Select_Column2["CollectionUri"] = "collection_uri";
  Current_Collection_Ownership_V2_View_Select_Column2["CreatorAddress"] = "creator_address";
  Current_Collection_Ownership_V2_View_Select_Column2["DistinctTokens"] = "distinct_tokens";
  Current_Collection_Ownership_V2_View_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Current_Collection_Ownership_V2_View_Select_Column2["OwnerAddress"] = "owner_address";
  Current_Collection_Ownership_V2_View_Select_Column2["SingleTokenUri"] = "single_token_uri";
  return Current_Collection_Ownership_V2_View_Select_Column2;
})(Current_Collection_Ownership_V2_View_Select_Column || {});
var Current_Collections_V2_Select_Column = /* @__PURE__ */ ((Current_Collections_V2_Select_Column2) => {
  Current_Collections_V2_Select_Column2["CollectionId"] = "collection_id";
  Current_Collections_V2_Select_Column2["CollectionName"] = "collection_name";
  Current_Collections_V2_Select_Column2["CreatorAddress"] = "creator_address";
  Current_Collections_V2_Select_Column2["CurrentSupply"] = "current_supply";
  Current_Collections_V2_Select_Column2["Description"] = "description";
  Current_Collections_V2_Select_Column2["LastTransactionTimestamp"] = "last_transaction_timestamp";
  Current_Collections_V2_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Current_Collections_V2_Select_Column2["MaxSupply"] = "max_supply";
  Current_Collections_V2_Select_Column2["MutableDescription"] = "mutable_description";
  Current_Collections_V2_Select_Column2["MutableUri"] = "mutable_uri";
  Current_Collections_V2_Select_Column2["TableHandleV1"] = "table_handle_v1";
  Current_Collections_V2_Select_Column2["TokenStandard"] = "token_standard";
  Current_Collections_V2_Select_Column2["TotalMintedV2"] = "total_minted_v2";
  Current_Collections_V2_Select_Column2["Uri"] = "uri";
  return Current_Collections_V2_Select_Column2;
})(Current_Collections_V2_Select_Column || {});
var Current_Delegated_Staking_Pool_Balances_Select_Column = /* @__PURE__ */ ((Current_Delegated_Staking_Pool_Balances_Select_Column2) => {
  Current_Delegated_Staking_Pool_Balances_Select_Column2["ActiveTableHandle"] = "active_table_handle";
  Current_Delegated_Staking_Pool_Balances_Select_Column2["InactiveTableHandle"] = "inactive_table_handle";
  Current_Delegated_Staking_Pool_Balances_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Current_Delegated_Staking_Pool_Balances_Select_Column2["OperatorCommissionPercentage"] = "operator_commission_percentage";
  Current_Delegated_Staking_Pool_Balances_Select_Column2["StakingPoolAddress"] = "staking_pool_address";
  Current_Delegated_Staking_Pool_Balances_Select_Column2["TotalCoins"] = "total_coins";
  Current_Delegated_Staking_Pool_Balances_Select_Column2["TotalShares"] = "total_shares";
  return Current_Delegated_Staking_Pool_Balances_Select_Column2;
})(Current_Delegated_Staking_Pool_Balances_Select_Column || {});
var Current_Delegated_Voter_Select_Column = /* @__PURE__ */ ((Current_Delegated_Voter_Select_Column2) => {
  Current_Delegated_Voter_Select_Column2["DelegationPoolAddress"] = "delegation_pool_address";
  Current_Delegated_Voter_Select_Column2["DelegatorAddress"] = "delegator_address";
  Current_Delegated_Voter_Select_Column2["LastTransactionTimestamp"] = "last_transaction_timestamp";
  Current_Delegated_Voter_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Current_Delegated_Voter_Select_Column2["PendingVoter"] = "pending_voter";
  Current_Delegated_Voter_Select_Column2["TableHandle"] = "table_handle";
  Current_Delegated_Voter_Select_Column2["Voter"] = "voter";
  return Current_Delegated_Voter_Select_Column2;
})(Current_Delegated_Voter_Select_Column || {});
var Current_Delegator_Balances_Select_Column = /* @__PURE__ */ ((Current_Delegator_Balances_Select_Column2) => {
  Current_Delegator_Balances_Select_Column2["DelegatorAddress"] = "delegator_address";
  Current_Delegator_Balances_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Current_Delegator_Balances_Select_Column2["ParentTableHandle"] = "parent_table_handle";
  Current_Delegator_Balances_Select_Column2["PoolAddress"] = "pool_address";
  Current_Delegator_Balances_Select_Column2["PoolType"] = "pool_type";
  Current_Delegator_Balances_Select_Column2["Shares"] = "shares";
  Current_Delegator_Balances_Select_Column2["TableHandle"] = "table_handle";
  return Current_Delegator_Balances_Select_Column2;
})(Current_Delegator_Balances_Select_Column || {});
var Current_Fungible_Asset_Balances_Select_Column = /* @__PURE__ */ ((Current_Fungible_Asset_Balances_Select_Column2) => {
  Current_Fungible_Asset_Balances_Select_Column2["Amount"] = "amount";
  Current_Fungible_Asset_Balances_Select_Column2["AssetType"] = "asset_type";
  Current_Fungible_Asset_Balances_Select_Column2["IsFrozen"] = "is_frozen";
  Current_Fungible_Asset_Balances_Select_Column2["IsPrimary"] = "is_primary";
  Current_Fungible_Asset_Balances_Select_Column2["LastTransactionTimestamp"] = "last_transaction_timestamp";
  Current_Fungible_Asset_Balances_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Current_Fungible_Asset_Balances_Select_Column2["OwnerAddress"] = "owner_address";
  Current_Fungible_Asset_Balances_Select_Column2["StorageId"] = "storage_id";
  Current_Fungible_Asset_Balances_Select_Column2["TokenStandard"] = "token_standard";
  return Current_Fungible_Asset_Balances_Select_Column2;
})(Current_Fungible_Asset_Balances_Select_Column || {});
var Current_Objects_Select_Column = /* @__PURE__ */ ((Current_Objects_Select_Column2) => {
  Current_Objects_Select_Column2["AllowUngatedTransfer"] = "allow_ungated_transfer";
  Current_Objects_Select_Column2["IsDeleted"] = "is_deleted";
  Current_Objects_Select_Column2["LastGuidCreationNum"] = "last_guid_creation_num";
  Current_Objects_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Current_Objects_Select_Column2["ObjectAddress"] = "object_address";
  Current_Objects_Select_Column2["OwnerAddress"] = "owner_address";
  Current_Objects_Select_Column2["StateKeyHash"] = "state_key_hash";
  return Current_Objects_Select_Column2;
})(Current_Objects_Select_Column || {});
var Current_Staking_Pool_Voter_Select_Column = /* @__PURE__ */ ((Current_Staking_Pool_Voter_Select_Column2) => {
  Current_Staking_Pool_Voter_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Current_Staking_Pool_Voter_Select_Column2["OperatorAddress"] = "operator_address";
  Current_Staking_Pool_Voter_Select_Column2["StakingPoolAddress"] = "staking_pool_address";
  Current_Staking_Pool_Voter_Select_Column2["VoterAddress"] = "voter_address";
  return Current_Staking_Pool_Voter_Select_Column2;
})(Current_Staking_Pool_Voter_Select_Column || {});
var Current_Table_Items_Select_Column = /* @__PURE__ */ ((Current_Table_Items_Select_Column2) => {
  Current_Table_Items_Select_Column2["DecodedKey"] = "decoded_key";
  Current_Table_Items_Select_Column2["DecodedValue"] = "decoded_value";
  Current_Table_Items_Select_Column2["IsDeleted"] = "is_deleted";
  Current_Table_Items_Select_Column2["Key"] = "key";
  Current_Table_Items_Select_Column2["KeyHash"] = "key_hash";
  Current_Table_Items_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Current_Table_Items_Select_Column2["TableHandle"] = "table_handle";
  return Current_Table_Items_Select_Column2;
})(Current_Table_Items_Select_Column || {});
var Current_Token_Datas_Select_Column = /* @__PURE__ */ ((Current_Token_Datas_Select_Column2) => {
  Current_Token_Datas_Select_Column2["CollectionDataIdHash"] = "collection_data_id_hash";
  Current_Token_Datas_Select_Column2["CollectionName"] = "collection_name";
  Current_Token_Datas_Select_Column2["CreatorAddress"] = "creator_address";
  Current_Token_Datas_Select_Column2["DefaultProperties"] = "default_properties";
  Current_Token_Datas_Select_Column2["Description"] = "description";
  Current_Token_Datas_Select_Column2["DescriptionMutable"] = "description_mutable";
  Current_Token_Datas_Select_Column2["LargestPropertyVersion"] = "largest_property_version";
  Current_Token_Datas_Select_Column2["LastTransactionTimestamp"] = "last_transaction_timestamp";
  Current_Token_Datas_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Current_Token_Datas_Select_Column2["Maximum"] = "maximum";
  Current_Token_Datas_Select_Column2["MaximumMutable"] = "maximum_mutable";
  Current_Token_Datas_Select_Column2["MetadataUri"] = "metadata_uri";
  Current_Token_Datas_Select_Column2["Name"] = "name";
  Current_Token_Datas_Select_Column2["PayeeAddress"] = "payee_address";
  Current_Token_Datas_Select_Column2["PropertiesMutable"] = "properties_mutable";
  Current_Token_Datas_Select_Column2["RoyaltyMutable"] = "royalty_mutable";
  Current_Token_Datas_Select_Column2["RoyaltyPointsDenominator"] = "royalty_points_denominator";
  Current_Token_Datas_Select_Column2["RoyaltyPointsNumerator"] = "royalty_points_numerator";
  Current_Token_Datas_Select_Column2["Supply"] = "supply";
  Current_Token_Datas_Select_Column2["TokenDataIdHash"] = "token_data_id_hash";
  Current_Token_Datas_Select_Column2["UriMutable"] = "uri_mutable";
  return Current_Token_Datas_Select_Column2;
})(Current_Token_Datas_Select_Column || {});
var Current_Token_Datas_V2_Select_Column = /* @__PURE__ */ ((Current_Token_Datas_V2_Select_Column2) => {
  Current_Token_Datas_V2_Select_Column2["CollectionId"] = "collection_id";
  Current_Token_Datas_V2_Select_Column2["Description"] = "description";
  Current_Token_Datas_V2_Select_Column2["IsFungibleV2"] = "is_fungible_v2";
  Current_Token_Datas_V2_Select_Column2["LargestPropertyVersionV1"] = "largest_property_version_v1";
  Current_Token_Datas_V2_Select_Column2["LastTransactionTimestamp"] = "last_transaction_timestamp";
  Current_Token_Datas_V2_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Current_Token_Datas_V2_Select_Column2["Maximum"] = "maximum";
  Current_Token_Datas_V2_Select_Column2["Supply"] = "supply";
  Current_Token_Datas_V2_Select_Column2["TokenDataId"] = "token_data_id";
  Current_Token_Datas_V2_Select_Column2["TokenName"] = "token_name";
  Current_Token_Datas_V2_Select_Column2["TokenProperties"] = "token_properties";
  Current_Token_Datas_V2_Select_Column2["TokenStandard"] = "token_standard";
  Current_Token_Datas_V2_Select_Column2["TokenUri"] = "token_uri";
  return Current_Token_Datas_V2_Select_Column2;
})(Current_Token_Datas_V2_Select_Column || {});
var Current_Token_Ownerships_Select_Column = /* @__PURE__ */ ((Current_Token_Ownerships_Select_Column2) => {
  Current_Token_Ownerships_Select_Column2["Amount"] = "amount";
  Current_Token_Ownerships_Select_Column2["CollectionDataIdHash"] = "collection_data_id_hash";
  Current_Token_Ownerships_Select_Column2["CollectionName"] = "collection_name";
  Current_Token_Ownerships_Select_Column2["CreatorAddress"] = "creator_address";
  Current_Token_Ownerships_Select_Column2["LastTransactionTimestamp"] = "last_transaction_timestamp";
  Current_Token_Ownerships_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Current_Token_Ownerships_Select_Column2["Name"] = "name";
  Current_Token_Ownerships_Select_Column2["OwnerAddress"] = "owner_address";
  Current_Token_Ownerships_Select_Column2["PropertyVersion"] = "property_version";
  Current_Token_Ownerships_Select_Column2["TableType"] = "table_type";
  Current_Token_Ownerships_Select_Column2["TokenDataIdHash"] = "token_data_id_hash";
  Current_Token_Ownerships_Select_Column2["TokenProperties"] = "token_properties";
  return Current_Token_Ownerships_Select_Column2;
})(Current_Token_Ownerships_Select_Column || {});
var Current_Token_Ownerships_V2_Select_Column = /* @__PURE__ */ ((Current_Token_Ownerships_V2_Select_Column2) => {
  Current_Token_Ownerships_V2_Select_Column2["Amount"] = "amount";
  Current_Token_Ownerships_V2_Select_Column2["IsFungibleV2"] = "is_fungible_v2";
  Current_Token_Ownerships_V2_Select_Column2["IsSoulboundV2"] = "is_soulbound_v2";
  Current_Token_Ownerships_V2_Select_Column2["LastTransactionTimestamp"] = "last_transaction_timestamp";
  Current_Token_Ownerships_V2_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Current_Token_Ownerships_V2_Select_Column2["OwnerAddress"] = "owner_address";
  Current_Token_Ownerships_V2_Select_Column2["PropertyVersionV1"] = "property_version_v1";
  Current_Token_Ownerships_V2_Select_Column2["StorageId"] = "storage_id";
  Current_Token_Ownerships_V2_Select_Column2["TableTypeV1"] = "table_type_v1";
  Current_Token_Ownerships_V2_Select_Column2["TokenDataId"] = "token_data_id";
  Current_Token_Ownerships_V2_Select_Column2["TokenPropertiesMutatedV1"] = "token_properties_mutated_v1";
  Current_Token_Ownerships_V2_Select_Column2["TokenStandard"] = "token_standard";
  return Current_Token_Ownerships_V2_Select_Column2;
})(Current_Token_Ownerships_V2_Select_Column || {});
var Current_Token_Pending_Claims_Select_Column = /* @__PURE__ */ ((Current_Token_Pending_Claims_Select_Column2) => {
  Current_Token_Pending_Claims_Select_Column2["Amount"] = "amount";
  Current_Token_Pending_Claims_Select_Column2["CollectionDataIdHash"] = "collection_data_id_hash";
  Current_Token_Pending_Claims_Select_Column2["CollectionId"] = "collection_id";
  Current_Token_Pending_Claims_Select_Column2["CollectionName"] = "collection_name";
  Current_Token_Pending_Claims_Select_Column2["CreatorAddress"] = "creator_address";
  Current_Token_Pending_Claims_Select_Column2["FromAddress"] = "from_address";
  Current_Token_Pending_Claims_Select_Column2["LastTransactionTimestamp"] = "last_transaction_timestamp";
  Current_Token_Pending_Claims_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Current_Token_Pending_Claims_Select_Column2["Name"] = "name";
  Current_Token_Pending_Claims_Select_Column2["PropertyVersion"] = "property_version";
  Current_Token_Pending_Claims_Select_Column2["TableHandle"] = "table_handle";
  Current_Token_Pending_Claims_Select_Column2["ToAddress"] = "to_address";
  Current_Token_Pending_Claims_Select_Column2["TokenDataId"] = "token_data_id";
  Current_Token_Pending_Claims_Select_Column2["TokenDataIdHash"] = "token_data_id_hash";
  return Current_Token_Pending_Claims_Select_Column2;
})(Current_Token_Pending_Claims_Select_Column || {});
var Cursor_Ordering = /* @__PURE__ */ ((Cursor_Ordering2) => {
  Cursor_Ordering2["Asc"] = "ASC";
  Cursor_Ordering2["Desc"] = "DESC";
  return Cursor_Ordering2;
})(Cursor_Ordering || {});
var Delegated_Staking_Activities_Select_Column = /* @__PURE__ */ ((Delegated_Staking_Activities_Select_Column2) => {
  Delegated_Staking_Activities_Select_Column2["Amount"] = "amount";
  Delegated_Staking_Activities_Select_Column2["DelegatorAddress"] = "delegator_address";
  Delegated_Staking_Activities_Select_Column2["EventIndex"] = "event_index";
  Delegated_Staking_Activities_Select_Column2["EventType"] = "event_type";
  Delegated_Staking_Activities_Select_Column2["PoolAddress"] = "pool_address";
  Delegated_Staking_Activities_Select_Column2["TransactionVersion"] = "transaction_version";
  return Delegated_Staking_Activities_Select_Column2;
})(Delegated_Staking_Activities_Select_Column || {});
var Delegated_Staking_Pools_Select_Column = /* @__PURE__ */ ((Delegated_Staking_Pools_Select_Column2) => {
  Delegated_Staking_Pools_Select_Column2["FirstTransactionVersion"] = "first_transaction_version";
  Delegated_Staking_Pools_Select_Column2["StakingPoolAddress"] = "staking_pool_address";
  return Delegated_Staking_Pools_Select_Column2;
})(Delegated_Staking_Pools_Select_Column || {});
var Delegator_Distinct_Pool_Select_Column = /* @__PURE__ */ ((Delegator_Distinct_Pool_Select_Column2) => {
  Delegator_Distinct_Pool_Select_Column2["DelegatorAddress"] = "delegator_address";
  Delegator_Distinct_Pool_Select_Column2["PoolAddress"] = "pool_address";
  return Delegator_Distinct_Pool_Select_Column2;
})(Delegator_Distinct_Pool_Select_Column || {});
var Events_Select_Column = /* @__PURE__ */ ((Events_Select_Column2) => {
  Events_Select_Column2["AccountAddress"] = "account_address";
  Events_Select_Column2["CreationNumber"] = "creation_number";
  Events_Select_Column2["Data"] = "data";
  Events_Select_Column2["EventIndex"] = "event_index";
  Events_Select_Column2["IndexedType"] = "indexed_type";
  Events_Select_Column2["SequenceNumber"] = "sequence_number";
  Events_Select_Column2["TransactionBlockHeight"] = "transaction_block_height";
  Events_Select_Column2["TransactionVersion"] = "transaction_version";
  Events_Select_Column2["Type"] = "type";
  return Events_Select_Column2;
})(Events_Select_Column || {});
var Fungible_Asset_Activities_Select_Column = /* @__PURE__ */ ((Fungible_Asset_Activities_Select_Column2) => {
  Fungible_Asset_Activities_Select_Column2["Amount"] = "amount";
  Fungible_Asset_Activities_Select_Column2["AssetType"] = "asset_type";
  Fungible_Asset_Activities_Select_Column2["BlockHeight"] = "block_height";
  Fungible_Asset_Activities_Select_Column2["EntryFunctionIdStr"] = "entry_function_id_str";
  Fungible_Asset_Activities_Select_Column2["EventIndex"] = "event_index";
  Fungible_Asset_Activities_Select_Column2["GasFeePayerAddress"] = "gas_fee_payer_address";
  Fungible_Asset_Activities_Select_Column2["IsFrozen"] = "is_frozen";
  Fungible_Asset_Activities_Select_Column2["IsGasFee"] = "is_gas_fee";
  Fungible_Asset_Activities_Select_Column2["IsTransactionSuccess"] = "is_transaction_success";
  Fungible_Asset_Activities_Select_Column2["OwnerAddress"] = "owner_address";
  Fungible_Asset_Activities_Select_Column2["StorageId"] = "storage_id";
  Fungible_Asset_Activities_Select_Column2["StorageRefundAmount"] = "storage_refund_amount";
  Fungible_Asset_Activities_Select_Column2["TokenStandard"] = "token_standard";
  Fungible_Asset_Activities_Select_Column2["TransactionTimestamp"] = "transaction_timestamp";
  Fungible_Asset_Activities_Select_Column2["TransactionVersion"] = "transaction_version";
  Fungible_Asset_Activities_Select_Column2["Type"] = "type";
  return Fungible_Asset_Activities_Select_Column2;
})(Fungible_Asset_Activities_Select_Column || {});
var Fungible_Asset_Metadata_Select_Column = /* @__PURE__ */ ((Fungible_Asset_Metadata_Select_Column2) => {
  Fungible_Asset_Metadata_Select_Column2["AssetType"] = "asset_type";
  Fungible_Asset_Metadata_Select_Column2["CreatorAddress"] = "creator_address";
  Fungible_Asset_Metadata_Select_Column2["Decimals"] = "decimals";
  Fungible_Asset_Metadata_Select_Column2["IconUri"] = "icon_uri";
  Fungible_Asset_Metadata_Select_Column2["LastTransactionTimestamp"] = "last_transaction_timestamp";
  Fungible_Asset_Metadata_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Fungible_Asset_Metadata_Select_Column2["Name"] = "name";
  Fungible_Asset_Metadata_Select_Column2["ProjectUri"] = "project_uri";
  Fungible_Asset_Metadata_Select_Column2["SupplyAggregatorTableHandleV1"] = "supply_aggregator_table_handle_v1";
  Fungible_Asset_Metadata_Select_Column2["SupplyAggregatorTableKeyV1"] = "supply_aggregator_table_key_v1";
  Fungible_Asset_Metadata_Select_Column2["Symbol"] = "symbol";
  Fungible_Asset_Metadata_Select_Column2["TokenStandard"] = "token_standard";
  return Fungible_Asset_Metadata_Select_Column2;
})(Fungible_Asset_Metadata_Select_Column || {});
var Indexer_Status_Select_Column = /* @__PURE__ */ ((Indexer_Status_Select_Column2) => {
  Indexer_Status_Select_Column2["Db"] = "db";
  Indexer_Status_Select_Column2["IsIndexerUp"] = "is_indexer_up";
  return Indexer_Status_Select_Column2;
})(Indexer_Status_Select_Column || {});
var Ledger_Infos_Select_Column = /* @__PURE__ */ ((Ledger_Infos_Select_Column2) => {
  Ledger_Infos_Select_Column2["ChainId"] = "chain_id";
  return Ledger_Infos_Select_Column2;
})(Ledger_Infos_Select_Column || {});
var Move_Resources_Select_Column = /* @__PURE__ */ ((Move_Resources_Select_Column2) => {
  Move_Resources_Select_Column2["Address"] = "address";
  Move_Resources_Select_Column2["TransactionVersion"] = "transaction_version";
  return Move_Resources_Select_Column2;
})(Move_Resources_Select_Column || {});
var Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column = /* @__PURE__ */ ((Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column2) => {
  Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column2["BuyItNowPrice"] = "buy_it_now_price";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column2["CoinType"] = "coin_type";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column2["CollectionId"] = "collection_id";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column2["ContractAddress"] = "contract_address";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column2["CurrentBidPrice"] = "current_bid_price";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column2["CurrentBidder"] = "current_bidder";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column2["EntryFunctionIdStr"] = "entry_function_id_str";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column2["ExpirationTime"] = "expiration_time";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column2["FeeScheduleId"] = "fee_schedule_id";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column2["IsDeleted"] = "is_deleted";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column2["LastTransactionTimestamp"] = "last_transaction_timestamp";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column2["ListingId"] = "listing_id";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column2["Marketplace"] = "marketplace";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column2["Seller"] = "seller";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column2["StartingBidPrice"] = "starting_bid_price";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column2["TokenAmount"] = "token_amount";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column2["TokenDataId"] = "token_data_id";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column2["TokenStandard"] = "token_standard";
  return Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column2;
})(Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column || {});
var Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column = /* @__PURE__ */ ((Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column2) => {
  Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column2["Buyer"] = "buyer";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column2["CoinType"] = "coin_type";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column2["CollectionId"] = "collection_id";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column2["CollectionOfferId"] = "collection_offer_id";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column2["ContractAddress"] = "contract_address";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column2["EntryFunctionIdStr"] = "entry_function_id_str";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column2["ExpirationTime"] = "expiration_time";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column2["FeeScheduleId"] = "fee_schedule_id";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column2["IsDeleted"] = "is_deleted";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column2["ItemPrice"] = "item_price";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column2["LastTransactionTimestamp"] = "last_transaction_timestamp";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column2["Marketplace"] = "marketplace";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column2["RemainingTokenAmount"] = "remaining_token_amount";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column2["TokenStandard"] = "token_standard";
  return Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column2;
})(Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column || {});
var Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column = /* @__PURE__ */ ((Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column2) => {
  Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column2["CoinType"] = "coin_type";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column2["CollectionId"] = "collection_id";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column2["ContractAddress"] = "contract_address";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column2["EntryFunctionIdStr"] = "entry_function_id_str";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column2["FeeScheduleId"] = "fee_schedule_id";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column2["IsDeleted"] = "is_deleted";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column2["LastTransactionTimestamp"] = "last_transaction_timestamp";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column2["ListingId"] = "listing_id";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column2["Marketplace"] = "marketplace";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column2["Price"] = "price";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column2["Seller"] = "seller";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column2["TokenAmount"] = "token_amount";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column2["TokenDataId"] = "token_data_id";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column2["TokenStandard"] = "token_standard";
  return Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column2;
})(Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column || {});
var Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column = /* @__PURE__ */ ((Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column2) => {
  Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column2["Buyer"] = "buyer";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column2["CoinType"] = "coin_type";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column2["CollectionId"] = "collection_id";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column2["ContractAddress"] = "contract_address";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column2["EntryFunctionIdStr"] = "entry_function_id_str";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column2["ExpirationTime"] = "expiration_time";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column2["FeeScheduleId"] = "fee_schedule_id";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column2["IsDeleted"] = "is_deleted";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column2["LastTransactionTimestamp"] = "last_transaction_timestamp";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column2["LastTransactionVersion"] = "last_transaction_version";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column2["Marketplace"] = "marketplace";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column2["OfferId"] = "offer_id";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column2["Price"] = "price";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column2["TokenAmount"] = "token_amount";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column2["TokenDataId"] = "token_data_id";
  Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column2["TokenStandard"] = "token_standard";
  return Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column2;
})(Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column || {});
var Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column = /* @__PURE__ */ ((Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column2) => {
  Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column2["Buyer"] = "buyer";
  Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column2["CoinType"] = "coin_type";
  Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column2["CollectionId"] = "collection_id";
  Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column2["CollectionName"] = "collection_name";
  Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column2["ContractAddress"] = "contract_address";
  Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column2["CreatorAddress"] = "creator_address";
  Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column2["EntryFunctionIdStr"] = "entry_function_id_str";
  Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column2["EventIndex"] = "event_index";
  Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column2["EventType"] = "event_type";
  Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column2["FeeScheduleId"] = "fee_schedule_id";
  Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column2["Marketplace"] = "marketplace";
  Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column2["OfferOrListingId"] = "offer_or_listing_id";
  Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column2["Price"] = "price";
  Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column2["PropertyVersion"] = "property_version";
  Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column2["Seller"] = "seller";
  Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column2["TokenAmount"] = "token_amount";
  Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column2["TokenDataId"] = "token_data_id";
  Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column2["TokenName"] = "token_name";
  Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column2["TokenStandard"] = "token_standard";
  Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column2["TransactionTimestamp"] = "transaction_timestamp";
  Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column2["TransactionVersion"] = "transaction_version";
  return Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column2;
})(Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column || {});
var Nft_Metadata_Crawler_Parsed_Asset_Uris_Select_Column = /* @__PURE__ */ ((Nft_Metadata_Crawler_Parsed_Asset_Uris_Select_Column2) => {
  Nft_Metadata_Crawler_Parsed_Asset_Uris_Select_Column2["AnimationOptimizerRetryCount"] = "animation_optimizer_retry_count";
  Nft_Metadata_Crawler_Parsed_Asset_Uris_Select_Column2["AssetUri"] = "asset_uri";
  Nft_Metadata_Crawler_Parsed_Asset_Uris_Select_Column2["CdnAnimationUri"] = "cdn_animation_uri";
  Nft_Metadata_Crawler_Parsed_Asset_Uris_Select_Column2["CdnImageUri"] = "cdn_image_uri";
  Nft_Metadata_Crawler_Parsed_Asset_Uris_Select_Column2["CdnJsonUri"] = "cdn_json_uri";
  Nft_Metadata_Crawler_Parsed_Asset_Uris_Select_Column2["ImageOptimizerRetryCount"] = "image_optimizer_retry_count";
  Nft_Metadata_Crawler_Parsed_Asset_Uris_Select_Column2["JsonParserRetryCount"] = "json_parser_retry_count";
  Nft_Metadata_Crawler_Parsed_Asset_Uris_Select_Column2["RawAnimationUri"] = "raw_animation_uri";
  Nft_Metadata_Crawler_Parsed_Asset_Uris_Select_Column2["RawImageUri"] = "raw_image_uri";
  return Nft_Metadata_Crawler_Parsed_Asset_Uris_Select_Column2;
})(Nft_Metadata_Crawler_Parsed_Asset_Uris_Select_Column || {});
var Num_Active_Delegator_Per_Pool_Select_Column = /* @__PURE__ */ ((Num_Active_Delegator_Per_Pool_Select_Column2) => {
  Num_Active_Delegator_Per_Pool_Select_Column2["NumActiveDelegator"] = "num_active_delegator";
  Num_Active_Delegator_Per_Pool_Select_Column2["PoolAddress"] = "pool_address";
  return Num_Active_Delegator_Per_Pool_Select_Column2;
})(Num_Active_Delegator_Per_Pool_Select_Column || {});
var Order_By = /* @__PURE__ */ ((Order_By2) => {
  Order_By2["Asc"] = "asc";
  Order_By2["AscNullsFirst"] = "asc_nulls_first";
  Order_By2["AscNullsLast"] = "asc_nulls_last";
  Order_By2["Desc"] = "desc";
  Order_By2["DescNullsFirst"] = "desc_nulls_first";
  Order_By2["DescNullsLast"] = "desc_nulls_last";
  return Order_By2;
})(Order_By || {});
var Processor_Status_Select_Column = /* @__PURE__ */ ((Processor_Status_Select_Column2) => {
  Processor_Status_Select_Column2["LastSuccessVersion"] = "last_success_version";
  Processor_Status_Select_Column2["LastUpdated"] = "last_updated";
  Processor_Status_Select_Column2["Processor"] = "processor";
  return Processor_Status_Select_Column2;
})(Processor_Status_Select_Column || {});
var Proposal_Votes_Select_Column = /* @__PURE__ */ ((Proposal_Votes_Select_Column2) => {
  Proposal_Votes_Select_Column2["NumVotes"] = "num_votes";
  Proposal_Votes_Select_Column2["ProposalId"] = "proposal_id";
  Proposal_Votes_Select_Column2["ShouldPass"] = "should_pass";
  Proposal_Votes_Select_Column2["StakingPoolAddress"] = "staking_pool_address";
  Proposal_Votes_Select_Column2["TransactionTimestamp"] = "transaction_timestamp";
  Proposal_Votes_Select_Column2["TransactionVersion"] = "transaction_version";
  Proposal_Votes_Select_Column2["VoterAddress"] = "voter_address";
  return Proposal_Votes_Select_Column2;
})(Proposal_Votes_Select_Column || {});
var Table_Items_Select_Column = /* @__PURE__ */ ((Table_Items_Select_Column2) => {
  Table_Items_Select_Column2["DecodedKey"] = "decoded_key";
  Table_Items_Select_Column2["DecodedValue"] = "decoded_value";
  Table_Items_Select_Column2["Key"] = "key";
  Table_Items_Select_Column2["TableHandle"] = "table_handle";
  Table_Items_Select_Column2["TransactionVersion"] = "transaction_version";
  Table_Items_Select_Column2["WriteSetChangeIndex"] = "write_set_change_index";
  return Table_Items_Select_Column2;
})(Table_Items_Select_Column || {});
var Table_Metadatas_Select_Column = /* @__PURE__ */ ((Table_Metadatas_Select_Column2) => {
  Table_Metadatas_Select_Column2["Handle"] = "handle";
  Table_Metadatas_Select_Column2["KeyType"] = "key_type";
  Table_Metadatas_Select_Column2["ValueType"] = "value_type";
  return Table_Metadatas_Select_Column2;
})(Table_Metadatas_Select_Column || {});
var Token_Activities_Select_Column = /* @__PURE__ */ ((Token_Activities_Select_Column2) => {
  Token_Activities_Select_Column2["CoinAmount"] = "coin_amount";
  Token_Activities_Select_Column2["CoinType"] = "coin_type";
  Token_Activities_Select_Column2["CollectionDataIdHash"] = "collection_data_id_hash";
  Token_Activities_Select_Column2["CollectionName"] = "collection_name";
  Token_Activities_Select_Column2["CreatorAddress"] = "creator_address";
  Token_Activities_Select_Column2["EventAccountAddress"] = "event_account_address";
  Token_Activities_Select_Column2["EventCreationNumber"] = "event_creation_number";
  Token_Activities_Select_Column2["EventIndex"] = "event_index";
  Token_Activities_Select_Column2["EventSequenceNumber"] = "event_sequence_number";
  Token_Activities_Select_Column2["FromAddress"] = "from_address";
  Token_Activities_Select_Column2["Name"] = "name";
  Token_Activities_Select_Column2["PropertyVersion"] = "property_version";
  Token_Activities_Select_Column2["ToAddress"] = "to_address";
  Token_Activities_Select_Column2["TokenAmount"] = "token_amount";
  Token_Activities_Select_Column2["TokenDataIdHash"] = "token_data_id_hash";
  Token_Activities_Select_Column2["TransactionTimestamp"] = "transaction_timestamp";
  Token_Activities_Select_Column2["TransactionVersion"] = "transaction_version";
  Token_Activities_Select_Column2["TransferType"] = "transfer_type";
  return Token_Activities_Select_Column2;
})(Token_Activities_Select_Column || {});
var Token_Activities_V2_Select_Column = /* @__PURE__ */ ((Token_Activities_V2_Select_Column2) => {
  Token_Activities_V2_Select_Column2["AfterValue"] = "after_value";
  Token_Activities_V2_Select_Column2["BeforeValue"] = "before_value";
  Token_Activities_V2_Select_Column2["EntryFunctionIdStr"] = "entry_function_id_str";
  Token_Activities_V2_Select_Column2["EventAccountAddress"] = "event_account_address";
  Token_Activities_V2_Select_Column2["EventIndex"] = "event_index";
  Token_Activities_V2_Select_Column2["FromAddress"] = "from_address";
  Token_Activities_V2_Select_Column2["IsFungibleV2"] = "is_fungible_v2";
  Token_Activities_V2_Select_Column2["PropertyVersionV1"] = "property_version_v1";
  Token_Activities_V2_Select_Column2["ToAddress"] = "to_address";
  Token_Activities_V2_Select_Column2["TokenAmount"] = "token_amount";
  Token_Activities_V2_Select_Column2["TokenDataId"] = "token_data_id";
  Token_Activities_V2_Select_Column2["TokenStandard"] = "token_standard";
  Token_Activities_V2_Select_Column2["TransactionTimestamp"] = "transaction_timestamp";
  Token_Activities_V2_Select_Column2["TransactionVersion"] = "transaction_version";
  Token_Activities_V2_Select_Column2["Type"] = "type";
  return Token_Activities_V2_Select_Column2;
})(Token_Activities_V2_Select_Column || {});
var Token_Datas_Select_Column = /* @__PURE__ */ ((Token_Datas_Select_Column2) => {
  Token_Datas_Select_Column2["CollectionDataIdHash"] = "collection_data_id_hash";
  Token_Datas_Select_Column2["CollectionName"] = "collection_name";
  Token_Datas_Select_Column2["CreatorAddress"] = "creator_address";
  Token_Datas_Select_Column2["DefaultProperties"] = "default_properties";
  Token_Datas_Select_Column2["Description"] = "description";
  Token_Datas_Select_Column2["DescriptionMutable"] = "description_mutable";
  Token_Datas_Select_Column2["LargestPropertyVersion"] = "largest_property_version";
  Token_Datas_Select_Column2["Maximum"] = "maximum";
  Token_Datas_Select_Column2["MaximumMutable"] = "maximum_mutable";
  Token_Datas_Select_Column2["MetadataUri"] = "metadata_uri";
  Token_Datas_Select_Column2["Name"] = "name";
  Token_Datas_Select_Column2["PayeeAddress"] = "payee_address";
  Token_Datas_Select_Column2["PropertiesMutable"] = "properties_mutable";
  Token_Datas_Select_Column2["RoyaltyMutable"] = "royalty_mutable";
  Token_Datas_Select_Column2["RoyaltyPointsDenominator"] = "royalty_points_denominator";
  Token_Datas_Select_Column2["RoyaltyPointsNumerator"] = "royalty_points_numerator";
  Token_Datas_Select_Column2["Supply"] = "supply";
  Token_Datas_Select_Column2["TokenDataIdHash"] = "token_data_id_hash";
  Token_Datas_Select_Column2["TransactionTimestamp"] = "transaction_timestamp";
  Token_Datas_Select_Column2["TransactionVersion"] = "transaction_version";
  Token_Datas_Select_Column2["UriMutable"] = "uri_mutable";
  return Token_Datas_Select_Column2;
})(Token_Datas_Select_Column || {});
var Token_Ownerships_Select_Column = /* @__PURE__ */ ((Token_Ownerships_Select_Column2) => {
  Token_Ownerships_Select_Column2["Amount"] = "amount";
  Token_Ownerships_Select_Column2["CollectionDataIdHash"] = "collection_data_id_hash";
  Token_Ownerships_Select_Column2["CollectionName"] = "collection_name";
  Token_Ownerships_Select_Column2["CreatorAddress"] = "creator_address";
  Token_Ownerships_Select_Column2["Name"] = "name";
  Token_Ownerships_Select_Column2["OwnerAddress"] = "owner_address";
  Token_Ownerships_Select_Column2["PropertyVersion"] = "property_version";
  Token_Ownerships_Select_Column2["TableHandle"] = "table_handle";
  Token_Ownerships_Select_Column2["TableType"] = "table_type";
  Token_Ownerships_Select_Column2["TokenDataIdHash"] = "token_data_id_hash";
  Token_Ownerships_Select_Column2["TransactionTimestamp"] = "transaction_timestamp";
  Token_Ownerships_Select_Column2["TransactionVersion"] = "transaction_version";
  return Token_Ownerships_Select_Column2;
})(Token_Ownerships_Select_Column || {});
var Tokens_Select_Column = /* @__PURE__ */ ((Tokens_Select_Column2) => {
  Tokens_Select_Column2["CollectionDataIdHash"] = "collection_data_id_hash";
  Tokens_Select_Column2["CollectionName"] = "collection_name";
  Tokens_Select_Column2["CreatorAddress"] = "creator_address";
  Tokens_Select_Column2["Name"] = "name";
  Tokens_Select_Column2["PropertyVersion"] = "property_version";
  Tokens_Select_Column2["TokenDataIdHash"] = "token_data_id_hash";
  Tokens_Select_Column2["TokenProperties"] = "token_properties";
  Tokens_Select_Column2["TransactionTimestamp"] = "transaction_timestamp";
  Tokens_Select_Column2["TransactionVersion"] = "transaction_version";
  return Tokens_Select_Column2;
})(Tokens_Select_Column || {});
var User_Transactions_Select_Column = /* @__PURE__ */ ((User_Transactions_Select_Column2) => {
  User_Transactions_Select_Column2["BlockHeight"] = "block_height";
  User_Transactions_Select_Column2["EntryFunctionIdStr"] = "entry_function_id_str";
  User_Transactions_Select_Column2["Epoch"] = "epoch";
  User_Transactions_Select_Column2["ExpirationTimestampSecs"] = "expiration_timestamp_secs";
  User_Transactions_Select_Column2["GasUnitPrice"] = "gas_unit_price";
  User_Transactions_Select_Column2["MaxGasAmount"] = "max_gas_amount";
  User_Transactions_Select_Column2["ParentSignatureType"] = "parent_signature_type";
  User_Transactions_Select_Column2["Sender"] = "sender";
  User_Transactions_Select_Column2["SequenceNumber"] = "sequence_number";
  User_Transactions_Select_Column2["Timestamp"] = "timestamp";
  User_Transactions_Select_Column2["Version"] = "version";
  return User_Transactions_Select_Column2;
})(User_Transactions_Select_Column || {});
export {
  APTOS_COIN,
  AccountSequenceNumber,
  Account_Transactions_Select_Column,
  Address_Events_Summary_Select_Column,
  Address_Version_From_Events_Select_Column,
  Address_Version_From_Move_Resources_Select_Column,
  AnsClient,
  ApiError,
  AptosAccount,
  AptosApiError,
  AptosClient,
  AptosToken,
  bcs_exports as BCS,
  Block_Metadata_Transactions_Select_Column,
  CKDPriv,
  COIN_TRANSFER,
  CoinClient,
  Coin_Activities_Select_Column,
  Coin_Balances_Select_Column,
  Coin_Infos_Select_Column,
  Coin_Supply_Select_Column,
  Collection_Datas_Select_Column,
  Current_Ans_Lookup_Select_Column,
  Current_Ans_Lookup_V2_Select_Column,
  Current_Aptos_Names_Select_Column,
  Current_Coin_Balances_Select_Column,
  Current_Collection_Datas_Select_Column,
  Current_Collection_Ownership_V2_View_Select_Column,
  Current_Collections_V2_Select_Column,
  Current_Delegated_Staking_Pool_Balances_Select_Column,
  Current_Delegated_Voter_Select_Column,
  Current_Delegator_Balances_Select_Column,
  Current_Fungible_Asset_Balances_Select_Column,
  Current_Objects_Select_Column,
  Current_Staking_Pool_Voter_Select_Column,
  Current_Table_Items_Select_Column,
  Current_Token_Datas_Select_Column,
  Current_Token_Datas_V2_Select_Column,
  Current_Token_Ownerships_Select_Column,
  Current_Token_Ownerships_V2_Select_Column,
  Current_Token_Pending_Claims_Select_Column,
  Cursor_Ordering,
  Delegated_Staking_Activities_Select_Column,
  Delegated_Staking_Pools_Select_Column,
  Delegator_Distinct_Pool_Select_Column,
  Events_Select_Column,
  FailedTransactionError,
  FaucetClient,
  FungibleAssetClient,
  Fungible_Asset_Activities_Select_Column,
  Fungible_Asset_Metadata_Select_Column,
  HexString,
  IndexerClient,
  Indexer_Status_Select_Column,
  Ledger_Infos_Select_Column,
  Move_Resources_Select_Column,
  Network,
  NetworkToIndexerAPI,
  NetworkToNodeAPI,
  Nft_Marketplace_V2_Current_Nft_Marketplace_Auctions_Select_Column,
  Nft_Marketplace_V2_Current_Nft_Marketplace_Collection_Offers_Select_Column,
  Nft_Marketplace_V2_Current_Nft_Marketplace_Listings_Select_Column,
  Nft_Marketplace_V2_Current_Nft_Marketplace_Token_Offers_Select_Column,
  Nft_Marketplace_V2_Nft_Marketplace_Activities_Select_Column,
  Nft_Metadata_Crawler_Parsed_Asset_Uris_Select_Column,
  NodeAPIToNetwork,
  Num_Active_Delegator_Per_Pool_Select_Column,
  Order_By,
  Processor_Status_Select_Column,
  PropertyMap,
  PropertyValue,
  Proposal_Votes_Select_Column,
  Provider,
  TRANSFER_COINS,
  Table_Items_Select_Column,
  Table_Metadatas_Select_Column,
  TokenClient,
  token_types_exports as TokenTypes,
  Token_Activities_Select_Column,
  Token_Activities_V2_Select_Column,
  Token_Datas_Select_Column,
  Token_Ownerships_Select_Column,
  Tokens_Select_Column,
  TransactionBuilder,
  TransactionBuilderABI,
  TransactionBuilderEd25519,
  TransactionBuilderMultiEd25519,
  TransactionBuilderRemoteABI,
  TransactionWorker,
  TransactionWorkerEvents,
  aptos_types_exports as TxnBuilderTypes,
  TypeTagParser,
  generated_exports as Types,
  User_Transactions_Select_Column,
  WaitForTransactionError,
  ansContractsMap,
  aptosRequest,
  argToTransactionArgument,
  derivePath,
  deserializePropertyMap,
  deserializeValueBasedOnTypeTag,
  ensureBigInt,
  ensureBoolean,
  ensureNumber,
  get,
  getAddressFromAccountOrAddress,
  getMasterKeyFromSeed,
  getPropertyType,
  getPropertyValueRaw,
  getPublicKey,
  getSinglePropertyValueRaw,
  isValidPath,
  nameComponentPattern,
  namePattern,
  post,
  serializeArg
};
//# sourceMappingURL=index.mjs.map