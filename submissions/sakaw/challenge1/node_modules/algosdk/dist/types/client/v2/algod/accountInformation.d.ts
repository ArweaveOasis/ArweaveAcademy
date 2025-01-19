import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import IntDecoding from '../../../types/intDecoding';
export default class AccountInformation extends JSONRequest {
    private account;
    constructor(c: HTTPClient, intDecoding: IntDecoding, account: string);
    path(): string;
    /**
     * Exclude assets and application data from results
     *
     * #### Example
     * ```typescript
     * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
     * const accountInfo = await algodClient.accountInformation(address)
     *        .exclude('all')
     *        .do();
     * ```
     *
     * @param round
     * @category query
     */
    exclude(exclude: string): this;
}
