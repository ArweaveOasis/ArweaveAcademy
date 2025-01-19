import { Curve25519 } from "../index.js";
import * as ed25519 from "@noble/ed25519";
const key = "389d91f729532f0d39ec48ac94e1e10f54bfc39f53bf59a1ff768892c9d4f1c8";
const pk = "040b99ae55a3d3384943f638ed5f8eb1f4556feb86e6d082e658f8085b410f6a";
// TODO: curve doesn't implement properly this method, since pk is just a empty buffer
jest.spyOn(Curve25519.prototype, "key", "get").mockReturnValue(Buffer.from(key, "hex"));
describe("curve25519", () => {
    describe("given we have a Curve25519 instance", () => {
        let curve;
        beforeEach(() => {
            curve = new Curve25519(key, pk);
            // @ts-expect-error - since its normally private and
            curve._publicKey = Buffer.from(pk, "hex");
        });
        describe("given we call key()", () => {
            it("should return the key", () => {
                expect(Buffer.from(curve.key).toString("hex")).toEqual(key);
            });
        });
        describe("given we call publicKey()", () => {
            it("should return the public key", () => {
                expect(curve.publicKey.toString("hex")).toEqual(pk);
            });
        });
        describe("given we access signatureType", () => {
            it("should return the signature type", () => {
                expect(curve.signatureType).toEqual(2);
            });
        });
        describe("given we call sign()", () => {
            // TODO: curve doesn't implement properly this method, since pk is just a empty buffer
            it("should return the signature", async () => {
                const message = "helloWorld";
                const signature = await curve.sign(Buffer.from(message));
                expect(signature).toEqual(await ed25519.sign(Buffer.from(message), key));
            });
        });
        describe("given we access ownerLength", () => {
            it("should return the owner length", () => {
                expect(curve.ownerLength).toEqual(32);
            });
        });
        describe("given we access signatureLength", () => {
            it("should return the signature length", () => {
                expect(curve.signatureLength).toEqual(64);
            });
        });
        describe("given we call verify()", () => {
            describe("and the signature is valid", () => {
                it("should return true", async () => {
                    const message = "helloWorld";
                    const signature = await curve.sign(Buffer.from(message));
                    expect(await Curve25519.verify(Buffer.from(pk, "hex"), Buffer.from(message), signature)).toEqual(true);
                });
            });
            describe("and the signature is invalid", () => {
                it("should return false", async () => {
                    const message = "helloWorld";
                    const signature = await curve.sign(Buffer.from(message));
                    expect(await Curve25519.verify(Buffer.from(pk, "hex"), Buffer.from("helloworld"), signature)).toEqual(false);
                });
            });
        });
    });
});
//# sourceMappingURL=curve25519.spec.js.map