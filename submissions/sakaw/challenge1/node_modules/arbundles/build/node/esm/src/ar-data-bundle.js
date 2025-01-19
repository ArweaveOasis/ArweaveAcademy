import getSignatureData from "./ar-data-base.js";
import { longTo32ByteArray } from "./utils.js";
import Bundle from "./Bundle.js";
import { getCryptoDriver } from "./nodeUtils.js";
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
export function unbundleData(txData) {
    return new Bundle(txData);
}
/**
 * Verifies all data items and returns a json object with an items array.
 * Throws if any of the data items fail verification.
 *
 * @param dataItems
 * @param signer
 */
export async function bundleAndSignData(dataItems, signer) {
    const headers = new Uint8Array(64 * dataItems.length);
    const binaries = await Promise.all(dataItems.map(async (d, index) => {
        // Sign DataItem
        const id = d.isSigned() ? d.rawId : await sign(d, signer);
        // Create header array
        const header = new Uint8Array(64);
        // Set offset
        header.set(longTo32ByteArray(d.getRaw().byteLength), 0);
        // Set id
        header.set(id, 32);
        // Add header to array of headers
        headers.set(header, 64 * index);
        // Convert to array for flattening
        return d.getRaw();
    })).then((a) => {
        return Buffer.concat(a);
    });
    const buffer = Buffer.concat([Buffer.from(longTo32ByteArray(dataItems.length)), Buffer.from(headers), binaries]);
    return new Bundle(buffer);
}
/**
 * Signs a single
 *
 * @param item
 * @param signer
 * @returns signings - signature and id in byte-arrays
 */
export async function getSignatureAndId(item, signer) {
    const signatureData = await getSignatureData(item);
    const signatureBytes = await signer.sign(signatureData);
    const idBytes = await getCryptoDriver().hash(signatureBytes);
    return { signature: Buffer.from(signatureBytes), id: Buffer.from(idBytes) };
}
/**
 * Signs and returns item id
 *
 * @param item
 * @param jwk
 */
export async function sign(item, signer) {
    const { signature, id } = await getSignatureAndId(item, signer);
    item.getRaw().set(signature, 2);
    return id;
}
//# sourceMappingURL=ar-data-bundle.js.map