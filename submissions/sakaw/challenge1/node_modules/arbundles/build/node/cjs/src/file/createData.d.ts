/// <reference types="node" />
import FileDataItem from "./FileDataItem";
import type { DataItemCreateOptions } from "../ar-data-base";
import type { Signer } from "../signing/index";
export declare function createData(data: string | Uint8Array | NodeJS.ReadableStream, signer: Signer, opts?: DataItemCreateOptions): Promise<FileDataItem>;
