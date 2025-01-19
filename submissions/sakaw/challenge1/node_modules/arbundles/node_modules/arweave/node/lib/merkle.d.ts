export interface Chunk {
    dataHash: Uint8Array;
    minByteRange: number;
    maxByteRange: number;
}
interface BranchNode {
    readonly id: Uint8Array;
    readonly type: "branch";
    readonly byteRange: number;
    readonly maxByteRange: number;
    readonly leftChild?: MerkelNode;
    readonly rightChild?: MerkelNode;
}
interface LeafNode {
    readonly id: Uint8Array;
    readonly dataHash: Uint8Array;
    readonly type: "leaf";
    readonly minByteRange: number;
    readonly maxByteRange: number;
}
export type MerkelNode = BranchNode | LeafNode;
export declare const MAX_CHUNK_SIZE: number;
export declare const MIN_CHUNK_SIZE: number;
/**
 * Takes the input data and chunks it into (mostly) equal sized chunks.
 * The last chunk will be a bit smaller as it contains the remainder
 * from the chunking process.
 */
export declare function chunkData(data: Uint8Array): Promise<Chunk[]>;
export declare function generateLeaves(chunks: Chunk[]): Promise<LeafNode[]>;
/**
 * Builds an arweave merkle tree and gets the root hash for the given input.
 */
export declare function computeRootHash(data: Uint8Array): Promise<Uint8Array>;
export declare function generateTree(data: Uint8Array): Promise<MerkelNode>;
/**
 * Generates the data_root, chunks & proofs
 * needed for a transaction.
 *
 * This also checks if the last chunk is a zero-length
 * chunk and discards that chunk and proof if so.
 * (we do not need to upload this zero length chunk)
 *
 * @param data
 */
export declare function generateTransactionChunks(data: Uint8Array): Promise<{
    data_root: Uint8Array;
    chunks: Chunk[];
    proofs: Proof[];
}>;
/**
 * Starting with the bottom layer of leaf nodes, hash every second pair
 * into a new branch node, push those branch nodes onto a new layer,
 * and then recurse, building up the tree to it's root, where the
 * layer only consists of two items.
 */
export declare function buildLayers(nodes: MerkelNode[], level?: number): Promise<MerkelNode>;
/**
 * Recursively search through all branches of the tree,
 * and generate a proof for each leaf node.
 */
export declare function generateProofs(root: MerkelNode): Proof[];
export interface Proof {
    offset: number;
    proof: Uint8Array;
}
export declare function arrayFlatten<T = any>(input: T[]): T[];
export declare function intToBuffer(note: number): Uint8Array;
export declare function bufferToInt(buffer: Uint8Array): number;
export declare const arrayCompare: (a: Uint8Array | any[], b: Uint8Array | any[]) => boolean;
export declare function validatePath(id: Uint8Array, dest: number, leftBound: number, rightBound: number, path: Uint8Array): Promise<false | {
    offset: number;
    leftBound: number;
    rightBound: number;
    chunkSize: number;
}>;
/**
 * Inspect an arweave chunk proof.
 * Takes proof, parses, reads and displays the values for console logging.
 * One proof section per line
 * Format: left,right,offset => hash
 */
export declare function debug(proof: Uint8Array, output?: string): Promise<string>;
export {};
