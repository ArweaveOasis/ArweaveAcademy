"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Signer_1 = require("../Signer");
describe("given we have the abstract class Signer", () => {
    describe("and given we call the static verify", () => {
        it("should throw", () => {
            expect(() => Signer_1.Signer.verify("pk", Uint8Array.from([0]), Uint8Array.from([0]), {})).toThrowError("You must implement verify method on child");
        });
    });
});
//# sourceMappingURL=signerBaseClass.spec.js.map