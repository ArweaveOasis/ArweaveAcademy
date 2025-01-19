import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
/**
 * block gets the block info for the given round. this call may block
 */
export default class Block extends JSONRequest {
    private round;
    constructor(c: HTTPClient, roundNumber: number);
    path(): string;
    prepare(body: Uint8Array): Record<string, any>;
}
