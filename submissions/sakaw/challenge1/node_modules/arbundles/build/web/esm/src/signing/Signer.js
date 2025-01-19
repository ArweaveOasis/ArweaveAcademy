export class Signer {
    publicKey;
    signatureType;
    signatureLength;
    ownerLength;
    pem;
    static verify(_pk, _message, _signature, _opts) {
        throw new Error("You must implement verify method on child");
    }
}
//# sourceMappingURL=Signer.js.map