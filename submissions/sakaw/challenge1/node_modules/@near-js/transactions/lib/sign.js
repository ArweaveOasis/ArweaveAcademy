"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signDelegateAction = exports.signTransaction = void 0;
const js_sha256_1 = __importDefault(require("js-sha256"));
const actions_1 = require("./actions");
const create_transaction_1 = require("./create_transaction");
const schema_1 = require("./schema");
const signature_1 = require("./signature");
/**
 * Signs a given transaction from an account with given keys, applied to the given network
 * @param transaction The Transaction object to sign
 * @param signer The {Signer} object that assists with signing keys
 * @param accountId The human-readable NEAR account name
 * @param networkId The targeted network. (ex. default, betanet, etc…)
 */
function signTransactionObject(transaction, signer, accountId, networkId) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = (0, schema_1.encodeTransaction)(transaction);
        const hash = new Uint8Array(js_sha256_1.default.sha256.array(message));
        const signature = yield signer.signMessage(message, accountId, networkId);
        const signedTx = new schema_1.SignedTransaction({
            transaction,
            signature: new signature_1.Signature({ keyType: transaction.publicKey.keyType, data: signature.signature })
        });
        return [hash, signedTx];
    });
}
function signTransaction(...args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (args[0].constructor === schema_1.Transaction) {
            const [transaction, signer, accountId, networkId] = args;
            return signTransactionObject(transaction, signer, accountId, networkId);
        }
        else {
            const [receiverId, nonce, actions, blockHash, signer, accountId, networkId] = args;
            const publicKey = yield signer.getPublicKey(accountId, networkId);
            const transaction = (0, create_transaction_1.createTransaction)(accountId, publicKey, receiverId, nonce, actions, blockHash);
            return signTransactionObject(transaction, signer, accountId, networkId);
        }
    });
}
exports.signTransaction = signTransaction;
/**
 * Sign a delegate action
 * @params.delegateAction Delegate action to be signed by the meta transaction sender
 * @params.signer Signer instance for the meta transaction sender
 */
function signDelegateAction({ delegateAction, signer }) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = (0, schema_1.encodeDelegateAction)(delegateAction);
        const signature = yield signer.sign(message);
        const signedDelegateAction = new actions_1.SignedDelegate({
            delegateAction,
            signature: new signature_1.Signature({
                keyType: delegateAction.publicKey.keyType,
                data: signature,
            }),
        });
        return {
            hash: new Uint8Array(js_sha256_1.default.sha256.array(message)),
            signedDelegateAction,
        };
    });
}
exports.signDelegateAction = signDelegateAction;
