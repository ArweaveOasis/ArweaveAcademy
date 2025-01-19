import JSONRequest from '../jsonrequest';
import { SuggestedParams } from '../../../types/transactions/base';

/**
 * Returns the common needed parameters for a new transaction, in a format the transaction builder expects
 */
export default class SuggestedParamsRequest extends JSONRequest<SuggestedParams> {
  /* eslint-disable class-methods-use-this */
  path() {
    return '/v2/transactions/params';
  }

  prepare(body: Record<string, any>): SuggestedParams {
    return {
      flatFee: false,
      fee: body.fee,
      firstRound: body['last-round'],
      lastRound: body['last-round'] + 1000,
      genesisID: body['genesis-id'],
      genesisHash: body['genesis-hash'],
    };
  }
  /* eslint-enable class-methods-use-this */
}
