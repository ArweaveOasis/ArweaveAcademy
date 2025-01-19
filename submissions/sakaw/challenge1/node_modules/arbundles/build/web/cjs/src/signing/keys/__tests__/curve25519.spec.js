"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const ed25519 = __importStar(require("@noble/ed25519"));
const key = "389d91f729532f0d39ec48ac94e1e10f54bfc39f53bf59a1ff768892c9d4f1c8";
const pk = "040b99ae55a3d3384943f638ed5f8eb1f4556feb86e6d082e658f8085b410f6a";
// TODO: curve doesn't implement properly this method, since pk is just a empty buffer
jest.spyOn(__1.Curve25519.prototype, "key", "get").mockReturnValue(Buffer.from(key, "hex"));
describe("curve25519", () => {
    describe("given we have a Curve25519 instance", () => {
        let curve;
        beforeEach(() => {
            curve = new __1.Curve25519(key, pk);
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
            it("should return the signature", () => __awaiter(void 0, void 0, void 0, function* () {
                const message = "helloWorld";
                const signature = yield curve.sign(Buffer.from(message));
                expect(signature).toEqual(yield ed25519.sign(Buffer.from(message), key));
            }));
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
                it("should return true", () => __awaiter(void 0, void 0, void 0, function* () {
                    const message = "helloWorld";
                    const signature = yield curve.sign(Buffer.from(message));
                    expect(yield __1.Curve25519.verify(Buffer.from(pk, "hex"), Buffer.from(message), signature)).toEqual(true);
                }));
            });
            describe("and the signature is invalid", () => {
                it("should return false", () => __awaiter(void 0, void 0, void 0, function* () {
                    const message = "helloWorld";
                    const signature = yield curve.sign(Buffer.from(message));
                    expect(yield __1.Curve25519.verify(Buffer.from(pk, "hex"), Buffer.from("helloworld"), signature)).toEqual(false);
                }));
            });
        });
    });
});
//# sourceMappingURL=curve25519.spec.js.map