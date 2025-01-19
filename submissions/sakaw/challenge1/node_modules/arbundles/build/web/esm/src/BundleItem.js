export class BundleItem {
    signatureType;
    rawSignature;
    signature;
    signatureLength;
    rawOwner;
    owner;
    ownerLength;
    rawTarget;
    target;
    rawAnchor;
    anchor;
    rawTags;
    tags;
    rawData;
    data;
    static async verify(..._) {
        throw new Error("You must implement `verify`");
    }
}
//# sourceMappingURL=BundleItem.js.map