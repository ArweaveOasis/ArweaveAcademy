/// <reference types="node" />
/// <reference types="node" />
import { PassThrough } from "stream";
import type { Readable } from "stream";
import type { DataItemCreateOptions } from "../index";
import type { Signer } from "../signing/index";
export declare function processStream(stream: Readable): Promise<Record<string, any>[]>;
/**
 * Signs a stream (requires two instances/read passes)
 * @param s1 Stream to sign - same as s2
 * @param s2 Stream to sign - same as s1
 * @param signer Signer to use to sign the stream
 * @param opts Optional options to apply to the stream (same as DataItem)
 */
export declare function streamSigner(s1: Readable, s2: Readable, signer: Signer, opts?: DataItemCreateOptions): Promise<PassThrough>;
declare function readBytes(reader: AsyncGenerator<Buffer>, buffer: Uint8Array, length: number): Promise<Uint8Array>;
declare function getReader(s: Readable): AsyncGenerator<Buffer>;
export default processStream;
export declare const streamExportForTesting: {
    readBytes: typeof readBytes;
    getReader: typeof getReader;
};
