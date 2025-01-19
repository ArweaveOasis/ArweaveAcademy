/// <reference types="node" />
import FileDataItem from "./FileDataItem.js";
import type { DataItemCreateOptions } from "../ar-data-base.js";
import type { Signer } from "../signing/index.js";
export declare function createData(data: string | Uint8Array | NodeJS.ReadableStream, signer: Signer, opts?: DataItemCreateOptions): Promise<FileDataItem>;
