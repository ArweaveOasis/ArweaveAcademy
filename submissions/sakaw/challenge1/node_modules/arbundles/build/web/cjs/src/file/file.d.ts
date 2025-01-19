/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import type { FileHandle } from "fs/promises";
import type { Signer } from "../signing/index";
import type { DataItemCreateOptions } from "../index";
import type { Readable } from "stream";
type File = string | FileHandle;
interface Transaction {
    id: string;
    owner: string;
    tags: {
        name: string;
        value: string;
    }[];
    target: string;
    data_size: number;
    fee: number;
    signature: string;
}
export declare function fileToJson(filename: string): Promise<Transaction>;
export declare function numberOfItems(file: File): Promise<number>;
interface DataItemHeader {
    offset: number;
    id: string;
}
export declare function getHeaderAt(file: File, index: number): Promise<DataItemHeader>;
export declare function getHeaders(file: string): AsyncGenerator<DataItemHeader>;
export declare function getId(file: File, options?: {
    offset: number;
}): Promise<Buffer>;
export declare function getSignature(file: File, options?: {
    offset: number;
}): Promise<Buffer>;
export declare function getOwner(file: File, options?: {
    offset: number;
}): Promise<string>;
export declare function getTarget(file: File, options?: {
    offset: number;
}): Promise<string | undefined>;
export declare function getAnchor(file: File, options?: {
    offset: number;
}): Promise<string | undefined>;
export declare function getTags(file: File, options?: {
    offset: number;
}): Promise<{
    name: string;
    value: string;
}[]>;
export declare function signedFileStream(path: string, signer: Signer, opts?: DataItemCreateOptions): Promise<Readable>;
export declare const fileExportForTesting: {
    fileToFd: (f: File) => Promise<FileHandle>;
};
export {};
