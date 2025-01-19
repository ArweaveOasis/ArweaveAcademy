import SolanaSigner from "./SolanaSigner.js";
export default class NearSigner extends SolanaSigner {
    constructor(_key) {
        super(_key.replace("ed25519:", ""));
    }
}
//# sourceMappingURL=NearSigner.js.map