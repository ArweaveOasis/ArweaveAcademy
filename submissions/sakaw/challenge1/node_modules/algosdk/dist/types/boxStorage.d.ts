import { EncodedBoxReference } from './types';
import { BoxReference } from './types/transactions/base';
/**
 * translateBoxReferences translates an array of BoxReferences with app IDs
 * into an array of EncodedBoxReferences with foreign indices.
 */
export declare function translateBoxReferences(references: BoxReference[] | undefined, foreignApps: number[], appIndex: number): EncodedBoxReference[];
