import { Assignable } from '@near-js/types';
/** Base class for NEP message prefixes **/
declare abstract class NEPPrefix extends Assignable {
    prefix: number;
}
/** Class for constructing prefixes on actionable (on-chain) messages **/
declare abstract class ActionableMessagePrefix extends NEPPrefix {
    /** Given the NEP number, set the prefix using 2^30 as the offset **/
    protected constructor(prefix: number);
}
/**
 * Class for constructing prefixes on non-actionable (off-chain) messages
 * @todo uncomment when off-chain messages are supported
 * **/
/** Prefix for delegate actions whose signatures must always be distinguishable from valid transaction signatures **/
export declare class DelegateActionPrefix extends ActionableMessagePrefix {
    constructor();
}
export {};
