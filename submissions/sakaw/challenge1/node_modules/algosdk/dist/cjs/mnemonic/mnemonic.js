"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterDerivationKeyToMnemonic = exports.mnemonicToMasterDerivationKey = exports.secretKeyToMnemonic = exports.mnemonicToSecretKey = exports.seedFromMnemonic = exports.mnemonicFromSeed = exports.NOT_IN_WORDS_LIST_ERROR_MSG = exports.FAIL_TO_DECODE_MNEMONIC_ERROR_MSG = void 0;
/* eslint-disable no-bitwise */
const english_1 = __importDefault(require("./wordlists/english"));
const nacl = __importStar(require("../nacl/naclWrappers"));
const address = __importStar(require("../encoding/address"));
exports.FAIL_TO_DECODE_MNEMONIC_ERROR_MSG = 'failed to decode mnemonic';
exports.NOT_IN_WORDS_LIST_ERROR_MSG = 'the mnemonic contains a word that is not in the wordlist';
// https://stackoverflow.com/a/51452614
function toUint11Array(buffer8) {
    const buffer11 = [];
    let acc = 0;
    let accBits = 0;
    function add(octet) {
        acc |= octet << accBits;
        accBits += 8;
        if (accBits >= 11) {
            buffer11.push(acc & 0x7ff);
            acc >>= 11;
            accBits -= 11;
        }
    }
    function flush() {
        if (accBits) {
            buffer11.push(acc);
        }
    }
    buffer8.forEach(add);
    flush();
    return buffer11;
}
function applyWords(nums) {
    return nums.map((n) => english_1.default[n]);
}
function computeChecksum(seed) {
    const hashBuffer = nacl.genericHash(seed);
    const uint11Hash = toUint11Array(hashBuffer);
    const words = applyWords(uint11Hash);
    return words[0];
}
/**
 * mnemonicFromSeed converts a 32-byte key into a 25 word mnemonic. The generated mnemonic includes a checksum.
 * Each word in the mnemonic represents 11 bits of data, and the last 11 bits are reserved for the checksum.
 * @param seed - 32 bytes long seed
 * @returns 25 words mnemonic
 */
function mnemonicFromSeed(seed) {
    // Sanity length check
    if (seed.length !== nacl.SEED_BTYES_LENGTH) {
        throw new RangeError(`Seed length must be ${nacl.SEED_BTYES_LENGTH}`);
    }
    const uint11Array = toUint11Array(seed);
    const words = applyWords(uint11Array);
    const checksumWord = computeChecksum(seed);
    return `${words.join(' ')} ${checksumWord}`;
}
exports.mnemonicFromSeed = mnemonicFromSeed;
// from Uint11Array
// https://stackoverflow.com/a/51452614
function toUint8Array(buffer11) {
    const buffer8 = [];
    let acc = 0;
    let accBits = 0;
    function add(ui11) {
        acc |= ui11 << accBits;
        accBits += 11;
        while (accBits >= 8) {
            buffer8.push(acc & 0xff);
            acc >>= 8;
            accBits -= 8;
        }
    }
    function flush() {
        if (accBits) {
            buffer8.push(acc);
        }
    }
    buffer11.forEach(add);
    flush();
    return new Uint8Array(buffer8);
}
/**
 * seedFromMnemonic converts a mnemonic generated using this library into the source key used to create it.
 * It returns an error if the passed mnemonic has an incorrect checksum, if the number of words is unexpected, or if one
 * of the passed words is not found in the words list.
 * @param mnemonic - 25 words mnemonic
 * @returns 32 bytes long seed
 */
function seedFromMnemonic(mnemonic) {
    const words = mnemonic.split(' ');
    const key = words.slice(0, 24);
    // Check that all words are in list
    for (const w of key) {
        if (english_1.default.indexOf(w) === -1)
            throw new Error(exports.NOT_IN_WORDS_LIST_ERROR_MSG);
    }
    const checksum = words[words.length - 1];
    const uint11Array = key.map((word) => english_1.default.indexOf(word));
    // Convert the key to uint8Array
    let uint8Array = toUint8Array(uint11Array);
    // We need to chop the last byte -
    // the short explanation - Since 256 is not divisible by 11, we have an extra 0x0 byte.
    // The longer explanation - When splitting the 256 bits to chunks of 11, we get 23 words and a left over of 3 bits.
    // This left gets padded with another 8 bits to the create the 24th word.
    // While converting back to byte array, our new 264 bits array is divisible by 8 but the last byte is just the padding.
    // check that we have 33 bytes long array as expected
    if (uint8Array.length !== 33)
        throw new Error(exports.FAIL_TO_DECODE_MNEMONIC_ERROR_MSG);
    // check that the last byte is actually 0x0
    if (uint8Array[uint8Array.length - 1] !== 0x0)
        throw new Error(exports.FAIL_TO_DECODE_MNEMONIC_ERROR_MSG);
    // chop it !
    uint8Array = uint8Array.slice(0, uint8Array.length - 1);
    // compute checksum
    const cs = computeChecksum(uint8Array);
    // success!
    if (cs === checksum)
        return uint8Array;
    throw new Error(exports.FAIL_TO_DECODE_MNEMONIC_ERROR_MSG);
}
exports.seedFromMnemonic = seedFromMnemonic;
/**
 * mnemonicToSecretKey takes a mnemonic string and returns the corresponding Algorand address and its secret key.
 * @param mn - 25 words Algorand mnemonic
 * @throws error if fails to decode the mnemonic
 */
function mnemonicToSecretKey(mn) {
    const seed = seedFromMnemonic(mn);
    const keys = nacl.keyPairFromSeed(seed);
    const encodedPk = address.encodeAddress(keys.publicKey);
    return { addr: encodedPk, sk: keys.secretKey };
}
exports.mnemonicToSecretKey = mnemonicToSecretKey;
/**
 * secretKeyToMnemonic takes an Algorand secret key and returns the corresponding mnemonic.
 * @param sk - Algorand secret key
 * @returns Secret key's associated mnemonic
 */
function secretKeyToMnemonic(sk) {
    // get the seed from the sk
    const seed = sk.slice(0, nacl.SEED_BTYES_LENGTH);
    return mnemonicFromSeed(seed);
}
exports.secretKeyToMnemonic = secretKeyToMnemonic;
/**
 * mnemonicToMasterDerivationKey takes a mnemonic string and returns the corresponding master derivation key.
 * @param mn - 25 words Algorand mnemonic
 * @returns Uint8Array
 * @throws error if fails to decode the mnemonic
 */
function mnemonicToMasterDerivationKey(mn) {
    return seedFromMnemonic(mn);
}
exports.mnemonicToMasterDerivationKey = mnemonicToMasterDerivationKey;
/**
 * masterDerivationKeyToMnemonic takes a master derivation key and returns the corresponding mnemonic.
 * @param mdk - Uint8Array
 * @returns string mnemonic
 */
function masterDerivationKeyToMnemonic(mdk) {
    return mnemonicFromSeed(mdk);
}
exports.masterDerivationKeyToMnemonic = masterDerivationKeyToMnemonic;
//# sourceMappingURL=mnemonic.js.map