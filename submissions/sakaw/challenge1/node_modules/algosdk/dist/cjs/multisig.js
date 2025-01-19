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
exports.multisigAddress = exports.appendSignRawMultisigSignature = exports.appendSignMultisigTransaction = exports.signMultisigTransaction = exports.verifyMultisig = exports.mergeMultisigTransactions = exports.MultisigTransaction = exports.createMultisigTransaction = exports.MULTISIG_SIGNATURE_LENGTH_ERROR_MSG = exports.MULTISIG_USE_PARTIAL_SIGN_ERROR_MSG = exports.MULTISIG_NO_MUTATE_ERROR_MSG = exports.MULTISIG_MERGE_SIG_MISMATCH_ERROR_MSG = exports.MULTISIG_MERGE_WRONG_PREIMAGE_ERROR_MSG = exports.MULTISIG_MERGE_MISMATCH_AUTH_ADDR_MSG = exports.MULTISIG_MERGE_MISMATCH_ERROR_MSG = exports.MULTISIG_MERGE_LESSTHANTWO_ERROR_MSG = void 0;
const nacl = __importStar(require("./nacl/naclWrappers"));
const address = __importStar(require("./encoding/address"));
const encoding = __importStar(require("./encoding/encoding"));
const txnBuilder = __importStar(require("./transaction"));
const utils = __importStar(require("./utils/utils"));
/**
 Utilities for manipulating multisig transaction blobs.
 */
exports.MULTISIG_MERGE_LESSTHANTWO_ERROR_MSG = 'Not enough multisig transactions to merge. Need at least two';
exports.MULTISIG_MERGE_MISMATCH_ERROR_MSG = 'Cannot merge txs. txIDs differ';
exports.MULTISIG_MERGE_MISMATCH_AUTH_ADDR_MSG = 'Cannot merge txs. Auth addrs differ';
exports.MULTISIG_MERGE_WRONG_PREIMAGE_ERROR_MSG = 'Cannot merge txs. Multisig preimages differ';
exports.MULTISIG_MERGE_SIG_MISMATCH_ERROR_MSG = 'Cannot merge txs. subsigs are mismatched.';
const MULTISIG_KEY_NOT_EXIST_ERROR_MSG = 'Key does not exist';
exports.MULTISIG_NO_MUTATE_ERROR_MSG = 'Cannot mutate a multisig field as it would invalidate all existing signatures.';
exports.MULTISIG_USE_PARTIAL_SIGN_ERROR_MSG = 'Cannot sign a multisig transaction using `signTxn`. Use `partialSignTxn` instead.';
exports.MULTISIG_SIGNATURE_LENGTH_ERROR_MSG = 'Cannot add multisig signature. Signature is not of the correct length.';
/**
 * createMultisigTransaction creates a raw, unsigned multisig transaction blob.
 * @param txn - the actual transaction.
 * @param version - multisig version
 * @param threshold - multisig threshold
 * @param pks - ordered list of public keys in this multisig
 * @returns encoded multisig blob
 */
function createMultisigTransaction(txn, { version, threshold, addrs }) {
    // construct the appendable multisigned transaction format
    const pks = addrs.map((addr) => address.decodeAddress(addr).publicKey);
    const subsigs = pks.map((pk) => ({ pk: Buffer.from(pk) }));
    const msig = {
        v: version,
        thr: threshold,
        subsig: subsigs,
    };
    const txnForEncoding = txn.get_obj_for_encoding();
    const signedTxn = {
        msig,
        txn: txnForEncoding,
    };
    // if the address of this multisig is different from the transaction sender,
    // we need to add the auth-addr field
    const msigAddr = address.fromMultisigPreImg({
        version,
        threshold,
        pks,
    });
    if (address.encodeAddress(txnForEncoding.snd) !==
        address.encodeAddress(msigAddr)) {
        signedTxn.sgnr = Buffer.from(msigAddr);
    }
    return new Uint8Array(encoding.encode(signedTxn));
}
exports.createMultisigTransaction = createMultisigTransaction;
/**
 * createMultisigTransactionWithSignature creates a multisig transaction blob with an included signature.
 * @param txn - the actual transaction to sign.
 * @param rawSig - a Buffer raw signature of that transaction
 * @param myPk - a public key that corresponds with rawSig
 * @param version - multisig version
 * @param threshold - multisig threshold
 * @param pks - ordered list of public keys in this multisig
 * @returns encoded multisig blob
 */
function createMultisigTransactionWithSignature(txn, { rawSig, myPk }, { version, threshold, pks }) {
    // Create an empty encoded multisig transaction
    const encodedMsig = createMultisigTransaction(txn, {
        version,
        threshold,
        addrs: pks.map((pk) => address.encodeAddress(pk)),
    });
    // note: this is not signed yet, but will be shortly
    const signedTxn = encoding.decode(encodedMsig);
    let keyExist = false;
    // append the multisig signature to the corresponding public key in the multisig blob
    signedTxn.msig.subsig.forEach((subsig, i) => {
        if (nacl.bytesEqual(subsig.pk, myPk)) {
            keyExist = true;
            signedTxn.msig.subsig[i].s = rawSig;
        }
    });
    if (keyExist === false) {
        throw new Error(MULTISIG_KEY_NOT_EXIST_ERROR_MSG);
    }
    // if the address of this multisig is different from the transaction sender,
    // we need to add the auth-addr field
    const msigAddr = address.fromMultisigPreImg({
        version,
        threshold,
        pks,
    });
    if (address.encodeAddress(signedTxn.txn.snd) !== address.encodeAddress(msigAddr)) {
        signedTxn.sgnr = Buffer.from(msigAddr);
    }
    return new Uint8Array(encoding.encode(signedTxn));
}
/**
 * MultisigTransaction is a Transaction that also supports creating partially-signed multisig transactions.
 */
class MultisigTransaction extends txnBuilder.Transaction {
    /* eslint-disable class-methods-use-this,@typescript-eslint/no-unused-vars,no-dupe-class-members */
    /**
     * Override inherited method to throw an error, as mutating transactions are prohibited in this context
     */
    addLease() {
        throw new Error(exports.MULTISIG_NO_MUTATE_ERROR_MSG);
    }
    /**
     * Override inherited method to throw an error, as mutating transactions are prohibited in this context
     */
    addRekey() {
        throw new Error(exports.MULTISIG_NO_MUTATE_ERROR_MSG);
    }
    signTxn(sk) {
        throw new Error(exports.MULTISIG_USE_PARTIAL_SIGN_ERROR_MSG);
    }
    /* eslint-enable class-methods-use-this,@typescript-eslint/no-unused-vars,no-dupe-class-members */
    /**
     * partialSignTxn partially signs this transaction and returns a partially-signed multisig transaction,
     * encoded with msgpack as a typed array.
     * @param version - multisig version
     * @param threshold - multisig threshold
     * @param pks - multisig public key list, order is important.
     * @param sk - an Algorand secret key to sign with.
     * @returns an encoded, partially signed multisig transaction.
     */
    partialSignTxn({ version, threshold, pks }, sk) {
        // get signature verifier
        const myPk = nacl.keyPairFromSecretKey(sk).publicKey;
        return createMultisigTransactionWithSignature(this, { rawSig: this.rawSignTxn(sk), myPk }, { version, threshold, pks });
    }
    /**
     * partialSignWithMultisigSignature partially signs this transaction with an external raw multisig signature and returns
     * a partially-signed multisig transaction, encoded with msgpack as a typed array.
     * @param metadata - multisig metadata
     * @param signerAddr - address of the signer
     * @param signature - raw multisig signature
     * @returns an encoded, partially signed multisig transaction.
     */
    partialSignWithMultisigSignature(metadata, signerAddr, signature) {
        if (!nacl.isValidSignatureLength(signature.length)) {
            throw new Error(exports.MULTISIG_SIGNATURE_LENGTH_ERROR_MSG);
        }
        return createMultisigTransactionWithSignature(this, {
            rawSig: signature,
            myPk: address.decodeAddress(signerAddr).publicKey,
        }, metadata);
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(txnForEnc) {
        return super.from_obj_for_encoding(txnForEnc);
    }
}
exports.MultisigTransaction = MultisigTransaction;
/**
 * mergeMultisigTransactions takes a list of multisig transaction blobs, and merges them.
 * @param multisigTxnBlobs - a list of blobs representing encoded multisig txns
 * @returns typed array msg-pack encoded multisig txn
 */
function mergeMultisigTransactions(multisigTxnBlobs) {
    if (multisigTxnBlobs.length < 2) {
        throw new Error(exports.MULTISIG_MERGE_LESSTHANTWO_ERROR_MSG);
    }
    const refSigTx = encoding.decode(multisigTxnBlobs[0]);
    const refTxID = MultisigTransaction.from_obj_for_encoding(refSigTx.txn).txID();
    const refAuthAddr = refSigTx.sgnr
        ? address.encodeAddress(refSigTx.sgnr)
        : undefined;
    const refPreImage = {
        version: refSigTx.msig.v,
        threshold: refSigTx.msig.thr,
        pks: refSigTx.msig.subsig.map((subsig) => subsig.pk),
    };
    const refMsigAddr = address.encodeAddress(address.fromMultisigPreImg(refPreImage));
    const newSubsigs = refSigTx.msig.subsig.map((sig) => ({ ...sig }));
    for (let i = 1; i < multisigTxnBlobs.length; i++) {
        const unisig = encoding.decode(multisigTxnBlobs[i]);
        const unisigAlgoTxn = MultisigTransaction.from_obj_for_encoding(unisig.txn);
        if (unisigAlgoTxn.txID() !== refTxID) {
            throw new Error(exports.MULTISIG_MERGE_MISMATCH_ERROR_MSG);
        }
        const authAddr = unisig.sgnr
            ? address.encodeAddress(unisig.sgnr)
            : undefined;
        if (refAuthAddr !== authAddr) {
            throw new Error(exports.MULTISIG_MERGE_MISMATCH_AUTH_ADDR_MSG);
        }
        // check multisig has same preimage as reference
        if (unisig.msig.subsig.length !== refSigTx.msig.subsig.length) {
            throw new Error(exports.MULTISIG_MERGE_WRONG_PREIMAGE_ERROR_MSG);
        }
        const preimg = {
            version: unisig.msig.v,
            threshold: unisig.msig.thr,
            pks: unisig.msig.subsig.map((subsig) => subsig.pk),
        };
        const msgigAddr = address.encodeAddress(address.fromMultisigPreImg(preimg));
        if (refMsigAddr !== msgigAddr) {
            throw new Error(exports.MULTISIG_MERGE_WRONG_PREIMAGE_ERROR_MSG);
        }
        // now, we can merge
        unisig.msig.subsig.forEach((uniSubsig, index) => {
            if (!uniSubsig.s)
                return;
            const current = newSubsigs[index];
            // we convert the Uint8Arrays uniSubsig.s and current.s to Buffers here because (as
            // of Dec 2020) React overrides the buffer package with an older version that does
            // not support Uint8Arrays in the comparison function. See this thread for more
            // info: https://github.com/algorand/js-algorand-sdk/issues/252
            if (current.s &&
                Buffer.compare(Buffer.from(uniSubsig.s), Buffer.from(current.s)) !== 0) {
                // mismatch
                throw new Error(exports.MULTISIG_MERGE_SIG_MISMATCH_ERROR_MSG);
            }
            current.s = uniSubsig.s;
        });
    }
    const msig = {
        v: refSigTx.msig.v,
        thr: refSigTx.msig.thr,
        subsig: newSubsigs,
    };
    const signedTxn = {
        msig,
        txn: refSigTx.txn,
    };
    if (typeof refAuthAddr !== 'undefined') {
        signedTxn.sgnr = Buffer.from(address.decodeAddress(refAuthAddr).publicKey);
    }
    return new Uint8Array(encoding.encode(signedTxn));
}
exports.mergeMultisigTransactions = mergeMultisigTransactions;
function verifyMultisig(toBeVerified, msig, publicKey) {
    const version = msig.v;
    const threshold = msig.thr;
    const subsigs = msig.subsig;
    const pks = subsigs.map((subsig) => subsig.pk);
    if (msig.subsig.length < threshold) {
        return false;
    }
    let pk;
    try {
        pk = address.fromMultisigPreImg({ version, threshold, pks });
    }
    catch (e) {
        return false;
    }
    if (!utils.arrayEqual(pk, publicKey)) {
        return false;
    }
    let counter = 0;
    for (const subsig of subsigs) {
        if (subsig.s !== undefined) {
            counter += 1;
        }
    }
    if (counter < threshold) {
        return false;
    }
    let verifiedCounter = 0;
    for (const subsig of subsigs) {
        if (subsig.s !== undefined) {
            if (nacl.verify(toBeVerified, subsig.s, subsig.pk)) {
                verifiedCounter += 1;
            }
        }
    }
    if (verifiedCounter < threshold) {
        return false;
    }
    return true;
}
exports.verifyMultisig = verifyMultisig;
/**
 * signMultisigTransaction takes a raw transaction (see signTransaction), a multisig preimage, a secret key, and returns
 * a multisig transaction, which is a blob representing a transaction and multisignature account preimage. The returned
 * multisig txn can accumulate additional signatures through mergeMultisigTransactions or appendSignMultisigTransaction.
 * @param txn - object with either payment or key registration fields
 * @param version - multisig version
 * @param threshold - multisig threshold
 * @param addrs - a list of Algorand addresses representing possible signers for this multisig. Order is important.
 * @param sk - Algorand secret key. The corresponding pk should be in the pre image.
 * @returns object containing txID, and blob of partially signed multisig transaction (with multisig preimage information)
 * If the final calculated fee is lower than the protocol minimum fee, the fee will be increased to match the minimum.
 */
function signMultisigTransaction(txn, { version, threshold, addrs }, sk) {
    // check that the from field matches the mSigPreImage. If from field is not populated, fill it in.
    const expectedFromRaw = address.fromMultisigPreImgAddrs({
        version,
        threshold,
        addrs,
    });
    if (!Object.prototype.hasOwnProperty.call(txn, 'from')) {
        // eslint-disable-next-line no-param-reassign
        txn.from = expectedFromRaw;
    }
    // build pks for partialSign
    const pks = addrs.map((addr) => address.decodeAddress(addr).publicKey);
    // `txn` needs to be handled differently if it's a constructed `Transaction` vs a dict of constructor args
    const txnAlreadyBuilt = txn instanceof txnBuilder.Transaction;
    let algoTxn;
    let blob;
    if (txnAlreadyBuilt) {
        algoTxn = txn;
        blob = MultisigTransaction.prototype.partialSignTxn.call(algoTxn, { version, threshold, pks }, sk);
    }
    else {
        algoTxn = new MultisigTransaction(txn);
        blob = algoTxn.partialSignTxn({ version, threshold, pks }, sk);
    }
    return {
        txID: algoTxn.txID().toString(),
        blob,
    };
}
exports.signMultisigTransaction = signMultisigTransaction;
/**
 * appendSignMultisigTransaction takes a multisig transaction blob, and appends our signature to it.
 * While we could derive public key preimagery from the partially-signed multisig transaction,
 * we ask the caller to pass it back in, to ensure they know what they are signing.
 * @param multisigTxnBlob - an encoded multisig txn. Supports non-payment txn types.
 * @param version - multisig version
 * @param threshold - multisig threshold
 * @param addrs - a list of Algorand addresses representing possible signers for this multisig. Order is important.
 * @param sk - Algorand secret key
 * @returns object containing txID, and blob representing encoded multisig txn
 */
function appendSignMultisigTransaction(multisigTxnBlob, { version, threshold, addrs }, sk) {
    const pks = addrs.map((addr) => address.decodeAddress(addr).publicKey);
    // obtain underlying txn, sign it, and merge it
    const multisigTxObj = encoding.decode(multisigTxnBlob);
    const msigTxn = MultisigTransaction.from_obj_for_encoding(multisigTxObj.txn);
    const partialSignedBlob = msigTxn.partialSignTxn({ version, threshold, pks }, sk);
    return {
        txID: msigTxn.txID().toString(),
        blob: mergeMultisigTransactions([multisigTxnBlob, partialSignedBlob]),
    };
}
exports.appendSignMultisigTransaction = appendSignMultisigTransaction;
/**
 * appendMultisigTransactionSignature takes a multisig transaction blob, and appends a given raw signature to it.
 * This makes it possible to compile a multisig signature using only raw signatures from external methods.
 * @param multisigTxnBlob - an encoded multisig txn. Supports non-payment txn types.
 * @param version - multisig version
 * @param threshold - multisig threshold
 * @param addrs - a list of Algorand addresses representing possible signers for this multisig. Order is important.
 * @param signerAddr - address of the signer
 * @param signature - raw multisig signature
 * @returns object containing txID, and blob representing encoded multisig txn
 */
function appendSignRawMultisigSignature(multisigTxnBlob, { version, threshold, addrs }, signerAddr, signature) {
    const pks = addrs.map((addr) => address.decodeAddress(addr).publicKey);
    // obtain underlying txn, sign it, and merge it
    const multisigTxObj = encoding.decode(multisigTxnBlob);
    const msigTxn = MultisigTransaction.from_obj_for_encoding(multisigTxObj.txn);
    const partialSignedBlob = msigTxn.partialSignWithMultisigSignature({ version, threshold, pks }, signerAddr, signature);
    return {
        txID: msigTxn.txID().toString(),
        blob: mergeMultisigTransactions([multisigTxnBlob, partialSignedBlob]),
    };
}
exports.appendSignRawMultisigSignature = appendSignRawMultisigSignature;
/**
 * multisigAddress takes multisig metadata (preimage) and returns the corresponding human readable Algorand address.
 * @param version - multisig version
 * @param threshold - multisig threshold
 * @param addrs - list of Algorand addresses
 */
function multisigAddress({ version, threshold, addrs, }) {
    return address.fromMultisigPreImgAddrs({ version, threshold, addrs });
}
exports.multisigAddress = multisigAddress;
//# sourceMappingURL=multisig.js.map