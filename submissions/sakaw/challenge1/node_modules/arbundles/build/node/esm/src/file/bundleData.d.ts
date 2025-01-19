import type { Signer } from "../signing/index.js";
import FileBundle from "./FileBundle.js";
import type FileDataItem from "./FileDataItem.js";
export declare function bundleAndSignData(dataItems: FileDataItem[], signer: Signer, dir?: string): Promise<FileBundle>;
