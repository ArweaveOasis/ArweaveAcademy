export declare const MAX_LEN: number;
export declare const ADDR_BYTE_SIZE = 32;
export declare const SINGLE_BYTE_SIZE = 1;
export declare const SINGLE_BOOL_SIZE = 1;
export declare const LENGTH_ENCODE_BYTE_SIZE = 2;
export declare type ABIValue = boolean | number | bigint | string | Uint8Array | ABIValue[];
export declare abstract class ABIType {
    abstract toString(): string;
    abstract equals(other: ABIType): boolean;
    abstract isDynamic(): boolean;
    abstract byteLen(): number;
    abstract encode(value: ABIValue): Uint8Array;
    abstract decode(byteString: Uint8Array): ABIValue;
    static from(str: string): ABIType;
}
export declare class ABIUintType extends ABIType {
    bitSize: number;
    constructor(size: number);
    toString(): string;
    equals(other: ABIType): boolean;
    isDynamic(): boolean;
    byteLen(): number;
    encode(value: ABIValue): Uint8Array;
    decode(byteString: Uint8Array): bigint;
}
export declare class ABIUfixedType extends ABIType {
    bitSize: number;
    precision: number;
    constructor(size: number, denominator: number);
    toString(): string;
    equals(other: ABIType): boolean;
    isDynamic(): boolean;
    byteLen(): number;
    encode(value: ABIValue): Uint8Array;
    decode(byteString: Uint8Array): bigint;
}
export declare class ABIAddressType extends ABIType {
    toString(): string;
    equals(other: ABIType): boolean;
    isDynamic(): boolean;
    byteLen(): number;
    encode(value: ABIValue): Uint8Array;
    decode(byteString: Uint8Array): string;
}
export declare class ABIBoolType extends ABIType {
    toString(): string;
    equals(other: ABIType): boolean;
    isDynamic(): boolean;
    byteLen(): number;
    encode(value: ABIValue): Uint8Array;
    decode(byteString: Uint8Array): boolean;
}
export declare class ABIByteType extends ABIType {
    toString(): string;
    equals(other: ABIType): boolean;
    isDynamic(): boolean;
    byteLen(): number;
    encode(value: ABIValue): Uint8Array;
    decode(byteString: Uint8Array): number;
}
export declare class ABIStringType extends ABIType {
    toString(): string;
    equals(other: ABIType): boolean;
    isDynamic(): boolean;
    byteLen(): never;
    encode(value: ABIValue): Uint8Array;
    decode(byteString: Uint8Array): string;
}
export declare class ABIArrayStaticType extends ABIType {
    childType: ABIType;
    staticLength: number;
    constructor(argType: ABIType, arrayLength: number);
    toString(): string;
    equals(other: ABIType): boolean;
    isDynamic(): boolean;
    byteLen(): number;
    encode(value: ABIValue): Uint8Array;
    decode(byteString: Uint8Array): ABIValue[];
    toABITupleType(): ABITupleType;
}
export declare class ABIArrayDynamicType extends ABIType {
    childType: ABIType;
    constructor(argType: ABIType);
    toString(): string;
    equals(other: ABIType): boolean;
    isDynamic(): boolean;
    byteLen(): never;
    encode(value: ABIValue): Uint8Array;
    decode(byteString: Uint8Array): ABIValue[];
    toABITupleType(length: number): ABITupleType;
}
export declare class ABITupleType extends ABIType {
    childTypes: ABIType[];
    constructor(argTypes: ABIType[]);
    toString(): string;
    equals(other: ABIType): boolean;
    isDynamic(): boolean;
    byteLen(): number;
    encode(value: ABIValue): Uint8Array;
    decode(byteString: Uint8Array): ABIValue[];
    static parseTupleContent(str: string): string[];
}
