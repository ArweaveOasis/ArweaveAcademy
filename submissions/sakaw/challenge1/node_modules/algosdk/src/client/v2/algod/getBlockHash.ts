import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import IntDecoding from '../../../types/intDecoding';

export default class GetBlockHash extends JSONRequest {
  round: number;

  constructor(c: HTTPClient, intDecoding: IntDecoding, roundNumber: number) {
    super(c, intDecoding);
    if (!Number.isInteger(roundNumber))
      throw Error('roundNumber should be an integer');
    this.round = roundNumber;
  }

  path() {
    return `/v2/blocks/${this.round}/hash`;
  }
}
