/// <reference types="node" />
import { Address } from './types/address';
interface BidStorageStructure {
    bidderKey: Address;
    bidAmount: number;
    bidID: number;
    auctionKey: Address;
    auctionID: number;
    maxPrice: number;
}
export declare type BidOptions = Omit<BidStorageStructure, 'bidderKey' | 'auctionKey'> & {
    bidderKey: string;
    auctionKey: string;
};
/**
 * Bid enables construction of Algorand Auctions Bids
 * */
export default class Bid implements BidStorageStructure {
    name: string;
    tag: Buffer;
    bidderKey: Address;
    bidAmount: number;
    bidID: number;
    auctionKey: Address;
    auctionID: number;
    maxPrice: number;
    constructor({ bidderKey, bidAmount, bidID, auctionKey, auctionID, maxPrice, }: BidOptions);
    get_obj_for_encoding(): {
        bidder: Buffer;
        cur: number;
        price: number;
        id: number;
        auc: Buffer;
        aid: number;
    };
    signBid(sk: Uint8Array): Uint8Array;
}
export {};
