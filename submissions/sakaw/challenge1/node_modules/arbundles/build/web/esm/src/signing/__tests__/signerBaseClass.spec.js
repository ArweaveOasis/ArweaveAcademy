import { Signer } from "../Signer.js";
describe("given we have the abstract class Signer", () => {
    describe("and given we call the static verify", () => {
        it("should throw", () => {
            expect(() => Signer.verify("pk", Uint8Array.from([0]), Uint8Array.from([0]), {})).toThrowError("You must implement verify method on child");
        });
    });
});
//# sourceMappingURL=signerBaseClass.spec.js.map