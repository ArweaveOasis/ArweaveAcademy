const bip39 = require('bip39-light');
const { derivePath } = require('near-hd-key');
const bs58 = require('bs58');
const nacl = require('tweetnacl');

const KEY_DERIVATION_PATH = "m/44'/397'/0'"

const generateSeedPhrase = (entropy) => {
    return parseSeedPhrase(entropy !== undefined ? bip39.entropyToMnemonic(entropy) : bip39.generateMnemonic())
}

const normalizeSeedPhrase = (seedPhrase) => seedPhrase.trim().split(/\s+/).map(part => part.toLowerCase()).join(' ')

const parseSeedPhrase = (seedPhrase, derivationPath) => {
    const seed = bip39.mnemonicToSeed(normalizeSeedPhrase(seedPhrase))
    const { key } = derivePath(derivationPath || KEY_DERIVATION_PATH, seed.toString('hex'))
    const keyPair = nacl.sign.keyPair.fromSeed(key)
    const publicKey = 'ed25519:' + bs58.encode(Buffer.from(keyPair.publicKey))
    const secretKey = 'ed25519:' + bs58.encode(Buffer.from(keyPair.secretKey))
    return { seedPhrase, secretKey, publicKey }
}

const findSeedPhraseKey = (seedPhrase, publicKeys) => {
    // TODO: Need to iterate through multiple possible derivation paths?
    const keyInfo = parseSeedPhrase(seedPhrase)
    if (publicKeys.indexOf(keyInfo.publicKey) < 0) {
        return {}
    }
    return keyInfo
}

module.exports = {
    KEY_DERIVATION_PATH,
    generateSeedPhrase,
    normalizeSeedPhrase,
    parseSeedPhrase,
    findSeedPhraseKey
}
