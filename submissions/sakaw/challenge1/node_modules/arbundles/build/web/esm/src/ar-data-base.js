import { deepHash, stringToBuffer } from "./webUtils.js";
async function getSignatureData(item) {
    return deepHash([
        stringToBuffer("dataitem"),
        stringToBuffer("1"),
        stringToBuffer(item.signatureType.toString()),
        item.rawOwner,
        item.rawTarget,
        item.rawAnchor,
        item.rawTags,
        item.rawData,
    ]);
}
export default getSignatureData;
//# sourceMappingURL=ar-data-base.js.map