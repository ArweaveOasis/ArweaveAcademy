import JSONRequest from '../jsonrequest';
import { BoxesResponse } from './models/types';
export default class SearchForApplicationBoxes extends JSONRequest {
    /**
     * Returns information about indexed application boxes.
     *
     * #### Example
     * ```typescript
     * const maxResults = 20;
     * const appID = 1234;
     *
     * const responsePage1 = await indexerClient
     *        .searchForApplicationBoxes(appID)
     *        .limit(maxResults)
     *        .do();
     * const boxNamesPage1 = responsePage1.boxes.map(box => box.name);
     *
     * const responsePage2 = await indexerClient
     *        .searchForApplicationBoxes(appID)
     *        .limit(maxResults)
     *        .nextToken(responsePage1.nextToken)
     *        .do();
     * const boxNamesPage2 = responsePage2.boxes.map(box => box.name);
     * ```
     *
     * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2applicationsapplication-idboxes)
     * @oaram index - application index.
     * @category GET
     */
    constructor(c, intDecoding, index) {
        super(c, intDecoding);
        this.index = index;
        this.index = index;
    }
    /**
     * @returns `/v2/applications/${index}/boxes`
     */
    path() {
        return `/v2/applications/${this.index}/boxes`;
    }
    /**
     * Specify the next page of results.
     *
     * #### Example
     * ```typescript
     * const maxResults = 20;
     * const appID = 1234;
     *
     * const responsePage1 = await indexerClient
     *        .searchForApplicationBoxes(appID)
     *        .limit(maxResults)
     *        .do();
     * const boxNamesPage1 = responsePage1.boxes.map(box => box.name);
     *
     * const responsePage2 = await indexerClient
     *        .searchForApplicationBoxes(appID)
     *        .limit(maxResults)
     *        .nextToken(responsePage1.nextToken)
     *        .do();
     * const boxNamesPage2 = responsePage2.boxes.map(box => box.name);
     * ```
     * @param nextToken - provided by the previous results.
     * @category query
     */
    nextToken(next) {
        this.query.next = next;
        return this;
    }
    /**
     * Limit results for pagination.
     *
     * #### Example
     * ```typescript
     * const maxResults = 20;
     * const boxesResponse = await indexerClient
     *        .searchForApplicationBoxes(1234)
     *        .limit(maxResults)
     *        .do();
     * ```
     *
     * @param limit - maximum number of results to return.
     * @category query
     */
    limit(limit) {
        this.query.limit = limit;
        return this;
    }
    // eslint-disable-next-line class-methods-use-this
    prepare(body) {
        return BoxesResponse.from_obj_for_encoding(body);
    }
}
//# sourceMappingURL=searchForApplicationBoxes.js.map