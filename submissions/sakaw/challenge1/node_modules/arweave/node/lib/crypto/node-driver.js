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
Object.defineProperty(exports, "__esModule", { value: true });
const pem_1 = require("./pem");
const crypto = __importStar(require("crypto"));
class NodeCryptoDriver {
    constructor() {
        this.keyLength = 4096;
        this.publicExponent = 0x10001;
        this.hashAlgorithm = "sha256";
        this.encryptionAlgorithm = "aes-256-cbc";
    }
    generateJWK() {
        if (typeof crypto.generateKeyPair != "function") {
            throw new Error("Keypair generation not supported in this version of Node, only supported in versions 10+");
        }
        return new Promise((resolve, reject) => {
            crypto.generateKeyPair("rsa", {
                modulusLength: this.keyLength,
                publicExponent: this.publicExponent,
                privateKeyEncoding: {
                    type: "pkcs1",
                    format: "pem",
                },
                publicKeyEncoding: { type: "pkcs1", format: "pem" },
            }, (err, publicKey, privateKey) => {
                if (err) {
                    reject(err);
                }
                resolve(this.pemToJWK(privateKey));
            });
        });
    }
    sign(jwk, data, { saltLength } = {}) {
        return new Promise((resolve, reject) => {
            resolve(crypto
                .createSign(this.hashAlgorithm)
                .update(data)
                .sign({
                key: this.jwkToPem(jwk),
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                saltLength,
            }));
        });
    }
    verify(publicModulus, data, signature) {
        return new Promise((resolve, reject) => {
            const publicKey = {
                kty: "RSA",
                e: "AQAB",
                n: publicModulus,
            };
            const pem = this.jwkToPem(publicKey);
            resolve(crypto.createVerify(this.hashAlgorithm).update(data).verify({
                key: pem,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            }, signature));
        });
    }
    hash(data, algorithm = "SHA-256") {
        return new Promise((resolve, reject) => {
            resolve(crypto
                .createHash(this.parseHashAlgorithm(algorithm))
                .update(data)
                .digest());
        });
    }
    /**
     * If a key is passed as a buffer it *must* be exactly 32 bytes.
     * If a key is passed as a string then any length may be used.
     *
     * @param {Buffer} data
     * @param {(string | Buffer)} key
     * @returns {Promise<Uint8Array>}
     */
    async encrypt(data, key, salt) {
        // create a random string for deriving the key
        // const salt = crypto.randomBytes(16);
        // console.log(salt);
        // As we're using CBC with a randomised IV per cypher we don't really need
        // an additional random salt per passphrase.
        const derivedKey = crypto.pbkdf2Sync(key, (salt = salt ? salt : "salt"), 100000, 32, this.hashAlgorithm);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.encryptionAlgorithm, derivedKey, iv);
        const encrypted = Buffer.concat([iv, cipher.update(data), cipher.final()]);
        return encrypted;
    }
    /**
     * If a key is passed as a buffer it *must* be exactly 32 bytes.
     * If a key is passed as a string then any length may be used.
     *
     * @param {Buffer} encrypted
     * @param {(string | Buffer)} key
     * @returns {Promise<Uint8Array>}
     */
    async decrypt(encrypted, key, salt) {
        try {
            // create a random string for deriving the key
            // const salt = crypto.randomBytes(16).toString('hex');
            // As we're using CBC with a randomised IV per cypher we don't really need
            // an additional random salt per passphrase.
            const derivedKey = crypto.pbkdf2Sync(key, (salt = salt ? salt : "salt"), 100000, 32, this.hashAlgorithm);
            const iv = encrypted.slice(0, 16);
            const data = encrypted.slice(16);
            const decipher = crypto.createDecipheriv(this.encryptionAlgorithm, derivedKey, iv);
            const decrypted = Buffer.concat([
                decipher.update(data),
                decipher.final(),
            ]);
            return decrypted;
        }
        catch (error) {
            throw new Error("Failed to decrypt");
        }
    }
    jwkToPem(jwk) {
        return (0, pem_1.jwkTopem)(jwk);
    }
    pemToJWK(pem) {
        let jwk = (0, pem_1.pemTojwk)(pem);
        return jwk;
    }
    parseHashAlgorithm(algorithm) {
        switch (algorithm) {
            case "SHA-256":
                return "sha256";
            case "SHA-384":
                return "sha384";
            default:
                throw new Error(`Algorithm not supported: ${algorithm}`);
        }
    }
}
exports.default = NodeCryptoDriver;
//# sourceMappingURL=node-driver.js.map