/// <reference types="node" />
import type DataItem from "./DataItem";
import Bundle from "./Bundle";
import type { Signer } from "./signing/Signer";
/**
 * Unbundles a transaction into an Array of DataItems.
 *
 * Takes either a json string or object. Will throw if given an invalid json
 * string but otherwise, it will return an empty array if
 *
 * a) the json object is the wrong format
 * b) the object contains no valid DataItems.
 *
 * It will verify all DataItems and discard ones that don't pass verification.
 *
 * @param txData
 */
export declare function unbundleData(txData: Buffer): Bundle;
/**
 * Verifies all data items and returns a json object with an items array.
 * Throws if any of the data items fail verification.
 *
 * @param dataItems
 * @param signer
 */
export declare function bundleAndSignData(dataItems: DataItem[], signer: Signer): Promise<Bundle>;
/**
 * Signs a single
 *
 * @param item
 * @param signer
 * @returns signings - signature and id in byte-arrays
 */
export declare function getSignatureAndId(item: DataItem, signer: Signer): Promise<{
    signature: Buffer;
    id: Buffer;
}>;
/**
 * Signs and returns item id
 *
 * @param item
 * @param jwk
 */
export declare function sign(item: DataItem, signer: Signer): Promise<Buffer>;
