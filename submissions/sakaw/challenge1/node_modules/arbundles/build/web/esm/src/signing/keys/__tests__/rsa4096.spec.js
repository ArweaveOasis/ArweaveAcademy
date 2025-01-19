import Rsa4096Pss from "../Rsa4096Pss.js";
import { jwkTopem } from "arweave/node/lib/crypto/pem.js";
import testKey from "../../../__tests__/test_key0.json";
const privateKey = jwkTopem(testKey);
const publicKey = testKey.n;
describe("given we have a Rsa4096Pss instance", () => {
    let rsa4096;
    beforeEach(() => {
        rsa4096 = new Rsa4096Pss(privateKey, publicKey);
        // @ts-expect-error - _publicKey is not defined in this class
        rsa4096._publicKey = Buffer.from(publicKey);
    });
    describe("given we access signatureType", () => {
        it("should return the signature type", () => {
            expect(rsa4096.signatureType).toEqual(1);
        });
    });
    describe("given we access ownerLength", () => {
        it("should return the owner length", () => {
            expect(rsa4096.ownerLength).toEqual(512);
        });
    });
    describe("given we access signatureLength", () => {
        it("should return the signature length", () => {
            expect(rsa4096.signatureLength).toEqual(512);
        });
    });
    describe("given we call publicKey()", () => {
        it("should return the public key", () => {
            expect(rsa4096.pk).toEqual(publicKey);
        });
        describe("we call sign()", () => {
            it("should return the signature", () => {
                const message = "helloWorld";
                const signature = rsa4096.sign(Buffer.from(message));
                expect(Buffer.from(signature).toString("hex")).toBeDefined();
            });
        });
        describe("given we call verify()", () => {
            describe("and the signature is valid", () => {
                it("should return true", async () => {
                    const message = "helloWorld";
                    const signature = rsa4096.sign(Buffer.from(message));
                    expect(await Rsa4096Pss.verify(publicKey, Buffer.from(message), signature)).toEqual(true);
                });
            });
            describe("and the signature is invalid", () => {
                it("should return false", async () => {
                    const message = "helloWorld";
                    const signature = rsa4096.sign(Buffer.from(message));
                    expect(await Rsa4096Pss.verify(publicKey, Buffer.from("helloworld"), signature)).toEqual(false);
                });
            });
        });
    });
});
//# sourceMappingURL=rsa4096.spec.js.map