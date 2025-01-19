"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const address = __importStar(require("./encoding/address"));
const encoding = __importStar(require("./encoding/encoding"));
const nacl = __importStar(require("./nacl/naclWrappers"));
const utils = __importStar(require("./utils/utils"));
/**
 * Bid enables construction of Algorand Auctions Bids
 * */
class Bid {
    constructor({ bidderKey, bidAmount, bidID, auctionKey, auctionID, maxPrice, }) {
        this.name = 'Bid';
        this.tag = Buffer.from([97, 66]); // "aB"
        const decodedBidderKey = address.decodeAddress(bidderKey);
        const decodedAuctionKey = address.decodeAddress(auctionKey);
        if (!Number.isSafeInteger(bidAmount) || bidAmount < 0)
            throw Error('Bid amount must be positive and 2^53-1');
        if (!Number.isSafeInteger(bidID) || bidID < 0)
            throw Error('BidID must be positive and 2^53-1');
        if (!Number.isSafeInteger(auctionID) || auctionID < 0)
            throw Error('auctionID must be positive');
        Object.assign(this, {
            bidderKey: decodedBidderKey,
            bidAmount,
            bidID,
            auctionKey: decodedAuctionKey,
            auctionID,
            maxPrice,
        });
    }
    // eslint-disable-next-line camelcase
    get_obj_for_encoding() {
        return {
            bidder: Buffer.from(this.bidderKey.publicKey),
            cur: this.bidAmount,
            price: this.maxPrice,
            id: this.bidID,
            auc: Buffer.from(this.auctionKey.publicKey),
            aid: this.auctionID,
        };
    }
    signBid(sk) {
        const encodedMsg = encoding.encode(this.get_obj_for_encoding());
        const toBeSigned = Buffer.from(utils.concatArrays(this.tag, encodedMsg));
        const sig = nacl.sign(toBeSigned, sk);
        // construct signed message
        const sBid = {
            sig: Buffer.from(sig),
            bid: this.get_obj_for_encoding(),
        };
        const note = {
            t: 'b',
            b: sBid,
        };
        return new Uint8Array(encoding.encode(note));
    }
}
exports.default = Bid;
//# sourceMappingURL=bid.js.map