"use strict";
// import keccak256, { exportForTesting } from "../keccak256.js";
// import BN from "bn.js";
test.todo("stub");
// describe("intTohex", function () {
//   describe("given we have a number", () => {
//     it("should convert the number to a hex string", () => {
//       const i = 10;
//       const hex = exportForTesting.intToHex(i);
//       expect(hex).toBe("0xa");
//     });
//   });
//   describe("given we have a negative number", () => {
//     it("should convert the number to a hex string", () => {
//       const i = -10;
//       const hex = exportForTesting.intToHex(i);
//       // TODO: This test case fails (fix implementation). -0xa ist also not optimal, normally u would want the first bits set, thus something like 0xfffa
//       expect(hex).toEqual("-0xa");
//     });
//   });
//   describe("given we have a float", () => {
//     it("should throw an error", () => {
//       expect(() => exportForTesting.intToHex(0.1)).toThrow();
//     });
//   });
// });
// describe("intToBuffer", () => {
//   describe("Given we have a number", () => {
//     it("should convert the number to a buffer", () => {
//       const buf = exportForTesting.intToBuffer(1);
//       expect(buf.toString("hex")).toEqual("01");
//     });
//   });
//   describe("Given we have a negative number", () => {
//     it("should convert the number to a buffer", () => {
//       const buf = exportForTesting.intToBuffer(-1);
//       expect(buf.toString("hex")).toEqual("ff");
//     });
//   });
//   describe("given we have a zero", () => {
//     it("should convert the number to a buffer", () => {
//       const buf = exportForTesting.intToBuffer(0);
//       expect(buf.toString("hex")).toEqual("00");
//     });
//   });
//   describe("given we have a float", () => {
//     it("should throw an error", () => {
//       expect(() => exportForTesting.intToBuffer(0.1)).toThrowError();
//     });
//   });
// });
// describe("isHexPrefixed", () => {
//   describe("given we have a string", () => {
//     describe("and the string is hex prefixed", () => {
//       it("should return true", () => {
//         const isPrefixed = exportForTesting.isHexPrefixed("0x123");
//         expect(isPrefixed).toEqual(true);
//       });
//     });
//     describe("and the string is not hex prefixed", () => {
//       it("should return false", () => {
//         const isPrefixed = exportForTesting.isHexPrefixed("123");
//         expect(isPrefixed).toEqual(false);
//       });
//     });
//   });
//   describe("given we have a number", () => {
//     it("should throw", () => {
//       expect(() => exportForTesting.isHexPrefixed(123)).toThrow();
//     });
//   });
// });
// describe("stripHexPrefix", () => {
//   describe("given we have a string", () => {
//     describe("and the string is hex prefixed", () => {
//       it("should remove the prefix", () => {
//         const stripped = exportForTesting.stripHexPrefix("0x123");
//         expect(stripped).toEqual("123");
//       });
//     });
//     describe("and the string is not hex prefixed", () => {
//       it("should return the string", () => {
//         const stripped = exportForTesting.stripHexPrefix("123");
//         expect(stripped).toEqual("123");
//       });
//     });
//   });
//   describe("given we have a number", () => {
//     it("should return the number", () => {
//       const stripped = exportForTesting.stripHexPrefix(123);
//       expect(stripped).toEqual(123);
//     });
//   });
// });
// describe("padToEven", () => {
//   describe("given we have a string", () => {
//     describe("and the string is even", () => {
//       it("should return the string", () => {
//         const padded = exportForTesting.padToEven("1234");
//         expect(padded).toEqual("1234");
//       });
//     });
//     describe("and the string is odd", () => {
//       it("should pad the string", () => {
//         const padded = exportForTesting.padToEven("123");
//         expect(padded).toEqual("0123");
//       });
//     });
//   });
//   describe("given we have a number", () => {
//     it("should throw an error", () => {
//       expect(() => exportForTesting.padToEven(123)).toThrowError();
//     });
//   });
// });
// describe("isHexString", () => {
//   describe("given we have a string", () => {
//     describe("and the string is a hex string", () => {
//       it("should return true", () => {
//         const isHex = exportForTesting.isHexString("0x123");
//         expect(isHex).toEqual(true);
//       });
//     });
//     describe("and the string is not a hex string", () => {
//       it("should return false", () => {
//         const isHex = exportForTesting.isHexString("123");
//         expect(isHex).toEqual(false);
//       });
//     });
//     describe("and we give a length and the length is not 2+2*length of string", () => {
//       it("should return false", () => {
//         const isHex = exportForTesting.isHexString("0x123", 1000);
//         expect(isHex).toEqual(false);
//       });
//     });
//     describe("and we give a length and the length is 2+2*length of string", () => {
//       it("should return true", () => {
//         const isHex = exportForTesting.isHexString("0x1234", 2);
//         expect(isHex).toEqual(true);
//       });
//     });
//   });
// });
// describe("toBuffer", () => {
//   describe("given we have a string", () => {
//     describe("and the string is hex prefixed", () => {
//       it("should convert the string to a buffer", () => {
//         const buf = exportForTesting.toBuffer("0x123");
//         expect(buf.toString("hex")).toEqual("0123");
//       });
//     });
//     describe("and the string is not hex prefixed", () => {
//       it("should convert the string to a buffer", () => {
//         const buf: Buffer = exportForTesting.toBuffer("123");
//         expect(buf.toString()).toEqual("123");
//       });
//     });
//   });
//   describe("given we have a number", () => {
//     it("should convert the number to a buffer", () => {
//       const buf = exportForTesting.toBuffer(123);
//       expect(buf.toString("hex")).toEqual("7b");
//     });
//   });
//   describe("given we have a buffer", () => {
//     it("should return the buffer", () => {
//       const buf = exportForTesting.toBuffer(Buffer.from("123", "hex"));
//       expect(buf).toEqual(Buffer.from("123", "hex"));
//     });
//   });
//   describe("given we have an array", () => {
//     it("should convert the array to a buffer", () => {
//       const buf = exportForTesting.toBuffer([1, 2, 3]);
//       expect(buf.toString("hex")).toEqual("010203");
//     });
//   });
//   describe("given we have null or undefined", () => {
//     it("should return a buffer of size 0", () => {
//       const buf = exportForTesting.toBuffer(null);
//       expect(buf.length).toEqual(0);
//       expect(buf).toBeInstanceOf(Buffer);
//       const buf2 = exportForTesting.toBuffer(undefined);
//       expect(buf2.length).toEqual(0);
//       expect(buf2).toBeInstanceOf(Buffer);
//     });
//   });
//   describe("and given we have BN", () => {
//     it("should convert the BN to a buffer", () => {
//       const buf = exportForTesting.toBuffer(new BN(123));
//       expect(buf.toString("hex")).toEqual("7b");
//     });
//   });
//   describe("and given we have a type with a toArray method", () => {
//     it("should convert the type to a buffer", () => {
//       const ownType = {
//         toArray: (): number[] => {
//           return [1, 2, 3];
//         },
//       };
//       const buf = exportForTesting.toBuffer(ownType);
//       expect(buf.toString("hex")).toEqual("010203");
//     });
//   });
//   describe("and given we have a invalid type", () => {
//     it("should throw", () => {
//       expect(() => exportForTesting.toBuffer({})).toThrowError("invalid type");
//     });
//   });
// });
// describe("keccak256", () => {
//   describe("given we string", () => {
//     it("should return the keccak256 hash of the string", () => {
//       const hash = keccak256("123");
//       expect((hash as Buffer).toString("hex")).toEqual("64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107");
//     });
//   });
//   describe("given we have a buffer", () => {
//     it("should return the keccak256 hash of the buffer", () => {
//       const hash = keccak256(Buffer.from("123", "hex"));
//       expect((hash as Buffer).toString("hex")).toEqual("5fa2358263196dbbf23d1ca7a509451f7a2f64c15837bfbb81298b1e3e24e4fa");
//     });
//   });
// });
//# sourceMappingURL=keccak256.test.js.map