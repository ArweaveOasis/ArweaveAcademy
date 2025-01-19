import JSONRequest from '../jsonrequest';
import { SuggestedParams } from '../../../types/transactions/base';
/**
 * Returns the common needed parameters for a new transaction, in a format the transaction builder expects
 */
export default class SuggestedParamsRequest extends JSONRequest<SuggestedParams> {
    path(): string;
    prepare(body: Record<string, any>): SuggestedParams;
}
