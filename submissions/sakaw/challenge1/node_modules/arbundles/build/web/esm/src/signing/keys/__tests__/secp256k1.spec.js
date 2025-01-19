import Secp256k1 from "../secp256k1.js";
import secp256k1 from "secp256k1";
const privateKey = "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";
const publicKey = Buffer.from(secp256k1.publicKeyCreate(Buffer.from(privateKey, "hex"), false));
describe("given we have a Secp256k1 instance", () => {
    let sec256k1;
    beforeEach(() => {
        sec256k1 = new Secp256k1(privateKey, publicKey);
    });
    describe("given we access ownerLength", () => {
        it("should return the owner length", () => {
            expect(sec256k1.ownerLength).toEqual(65);
        });
    });
    describe("given we access signatureLength", () => {
        it("should return the signature length", () => {
            expect(sec256k1.signatureLength).toEqual(65);
        });
    });
    describe("given we access signatureType", () => {
        it("should return the signature type", () => {
            expect(sec256k1.signatureType).toEqual(3);
        });
    });
    describe("given we call publicKey()", () => {
        it("should throw an error, since its not implemented", () => {
            expect(() => sec256k1.publicKey).toThrowError("You must implement `publicKey`");
        });
    });
    describe("given we call key()", () => {
        it("should return the key", () => {
            expect(Buffer.from(sec256k1.key).toString("hex")).toEqual(privateKey);
        });
    });
    describe("given we call sign()", () => {
        it("should return the signature", async () => {
            const message = "helloWorld";
            const signature = await sec256k1.sign(Buffer.from(message));
            expect(Buffer.from(signature).toString("hex")).toEqual("4629c3932db8991787e0f22b6d7e3af6797f7ba5993772ac3de1f8ce8e8548b93a7463ce0a46a17318faea728685fed6b8eb7ee912696b8cb9ee975be0bf6c23");
        });
    });
    describe("given we call verify()", () => {
        describe("and the signature is valid", () => {
            it("should return true", async () => {
                const message = "helloWorld";
                const signature = await sec256k1.sign(Buffer.from(message));
                expect(await Secp256k1.verify(Buffer.from(publicKey), Buffer.from(message), signature)).toEqual(true);
            });
        });
        describe("and the signature is invalid", () => {
            it("should return false", async () => {
                const message = "helloWorld";
                const signature = await sec256k1.sign(Buffer.from(message));
                expect(await Secp256k1.verify(Buffer.from(publicKey), Buffer.from("helloworld"), signature)).toEqual(false);
            });
        });
    });
});
//# sourceMappingURL=secp256k1.spec.js.map