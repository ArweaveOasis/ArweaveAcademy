import type DataItem from "./DataItem";
/**
 * Options for creation of a DataItem
 */
export interface DataItemCreateOptions {
    target?: string;
    anchor?: string;
    tags?: {
        name: string;
        value: string;
    }[];
}
declare function getSignatureData(item: DataItem): Promise<Uint8Array>;
export default getSignatureData;
