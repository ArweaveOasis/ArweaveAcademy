"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegateActionPrefix = void 0;
const types_1 = require("@near-js/types");
const ACTIONABLE_MESSAGE_BASE = Math.pow(2, 30);
// const NON_ACTIONABLE_MESSAGE_BASE = Math.pow(2, 31);
/** The set of NEPs for which an [NEP-461](https://github.com/near/NEPs/pull/461) prefix is required on the message prior to hashing **/
const NEP = {
    MetaTransactions: 366,
};
/** Base class for NEP message prefixes **/
class NEPPrefix extends types_1.Assignable {
}
/** Class for constructing prefixes on actionable (on-chain) messages **/
class ActionableMessagePrefix extends NEPPrefix {
    /** Given the NEP number, set the prefix using 2^30 as the offset **/
    constructor(prefix) {
        super({ prefix: ACTIONABLE_MESSAGE_BASE + prefix });
    }
}
/**
 * Class for constructing prefixes on non-actionable (off-chain) messages
 * @todo uncomment when off-chain messages are supported
 * **/
// abstract class NonActionableMessagePrefix extends NEPPrefix {
//     /** Given the NEP number, set the prefix using 2^31 as the offset **/
//     protected constructor(prefix: number) {
//         super({ prefix: NON_ACTIONABLE_MESSAGE_BASE + prefix });
//     }
// }
/** Prefix for delegate actions whose signatures must always be distinguishable from valid transaction signatures **/
class DelegateActionPrefix extends ActionableMessagePrefix {
    constructor() { super(NEP.MetaTransactions); }
}
exports.DelegateActionPrefix = DelegateActionPrefix;
