"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Rsa4096Pss_1 = __importDefault(require("../Rsa4096Pss"));
const pem_1 = require("arweave/node/lib/crypto/pem");
const test_key0_json_1 = __importDefault(require("../../../__tests__/test_key0.json"));
const privateKey = (0, pem_1.jwkTopem)(test_key0_json_1.default);
const publicKey = test_key0_json_1.default.n;
describe("given we have a Rsa4096Pss instance", () => {
    let rsa4096;
    beforeEach(() => {
        rsa4096 = new Rsa4096Pss_1.default(privateKey, publicKey);
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
                it("should return true", () => __awaiter(void 0, void 0, void 0, function* () {
                    const message = "helloWorld";
                    const signature = rsa4096.sign(Buffer.from(message));
                    expect(yield Rsa4096Pss_1.default.verify(publicKey, Buffer.from(message), signature)).toEqual(true);
                }));
            });
            describe("and the signature is invalid", () => {
                it("should return false", () => __awaiter(void 0, void 0, void 0, function* () {
                    const message = "helloWorld";
                    const signature = rsa4096.sign(Buffer.from(message));
                    expect(yield Rsa4096Pss_1.default.verify(publicKey, Buffer.from("helloworld"), signature)).toEqual(false);
                }));
            });
        });
    });
});
//# sourceMappingURL=rsa4096.spec.js.map