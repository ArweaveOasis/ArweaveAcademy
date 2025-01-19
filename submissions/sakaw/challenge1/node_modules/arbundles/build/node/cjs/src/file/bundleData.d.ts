import type { Signer } from "../signing/index";
import FileBundle from "./FileBundle";
import type FileDataItem from "./FileDataItem";
export declare function bundleAndSignData(dataItems: FileDataItem[], signer: Signer, dir?: string): Promise<FileBundle>;
