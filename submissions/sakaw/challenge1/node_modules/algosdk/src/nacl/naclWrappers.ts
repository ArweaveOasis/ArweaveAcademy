import nacl from 'tweetnacl';
import sha512 from 'js-sha512';

export function genericHash(arr: sha512.Message) {
  return sha512.sha512_256.array(arr);
}

export function randomBytes(length: number) {
  return nacl.randomBytes(length);
}

export function keyPairFromSeed(seed: Uint8Array) {
  return nacl.sign.keyPair.fromSeed(seed);
}

export function keyPair() {
  const seed = randomBytes(nacl.box.secretKeyLength);
  return keyPairFromSeed(seed);
}

export function isValidSignatureLength(len: number) {
  return len === nacl.sign.signatureLength;
}

export function keyPairFromSecretKey(sk: Uint8Array) {
  return nacl.sign.keyPair.fromSecretKey(sk);
}

export function sign(msg: Uint8Array, secretKey: Uint8Array) {
  return nacl.sign.detached(msg, secretKey);
}

export function bytesEqual(a: Uint8Array, b: Uint8Array) {
  return nacl.verify(a, b);
}

export function verify(
  message: Uint8Array,
  signature: Uint8Array,
  verifyKey: Uint8Array
) {
  return nacl.sign.detached.verify(message, signature, verifyKey);
}

// constants
export const PUBLIC_KEY_LENGTH = nacl.sign.publicKeyLength;
export const SECRET_KEY_LENGTH = nacl.sign.secretKeyLength;
export const HASH_BYTES_LENGTH = 32;
export const SEED_BTYES_LENGTH = 32;
