import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import IntDecoding from '../../../types/intDecoding';
export default class GetBlockHash extends JSONRequest {
    round: number;
    constructor(c: HTTPClient, intDecoding: IntDecoding, roundNumber: number);
    path(): string;
}
