// In TypeScript 3.7, could be written as a single type:
// `type DeepHashChunk = Uint8Array | DeepHashChunk[];`
import { getCryptoDriver, concatBuffers, stringToBuffer } from "./webUtils.js";
import { createHash } from "crypto";
export async function deepHash(data) {
    if (typeof data[Symbol.asyncIterator] === "function") {
        const _data = data;
        const context = createHash("sha384");
        let length = 0;
        for await (const chunk of _data) {
            length += chunk.byteLength;
            context.update(chunk);
        }
        const tag = concatBuffers([stringToBuffer("blob"), stringToBuffer(length.toString())]);
        const taggedHash = concatBuffers([await getCryptoDriver().hash(tag, "SHA-384"), context.digest()]);
        return await getCryptoDriver().hash(taggedHash, "SHA-384");
    }
    else if (Array.isArray(data)) {
        const tag = concatBuffers([stringToBuffer("list"), stringToBuffer(data.length.toString())]);
        return await deepHashChunks(data, await getCryptoDriver().hash(tag, "SHA-384"));
    }
    const _data = data;
    const tag = concatBuffers([stringToBuffer("blob"), stringToBuffer(_data.byteLength.toString())]);
    const taggedHash = concatBuffers([await getCryptoDriver().hash(tag, "SHA-384"), await getCryptoDriver().hash(_data, "SHA-384")]);
    return await getCryptoDriver().hash(taggedHash, "SHA-384");
}
export async function deepHashChunks(chunks, acc) {
    if (chunks.length < 1) {
        return acc;
    }
    const hashPair = concatBuffers([acc, await deepHash(chunks[0])]);
    const newAcc = await getCryptoDriver().hash(hashPair, "SHA-384");
    return await deepHashChunks(chunks.slice(1), newAcc);
}
export async function hashStream(stream) {
    const context = createHash("sha384");
    for await (const chunk of stream) {
        context.update(chunk);
    }
    return context.digest();
}
export default deepHash;
//# sourceMappingURL=deepHash.js.map