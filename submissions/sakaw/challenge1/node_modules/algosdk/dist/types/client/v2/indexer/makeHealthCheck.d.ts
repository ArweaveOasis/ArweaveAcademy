import JSONRequest from '../jsonrequest';
/**
 * Returns the health object for the service.
 * Returns 200 if healthy.
 *
 * #### Example
 * ```typescript
 * const health = await indexerClient.makeHealthCheck().do();
 * ```
 *
 * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-health)
 * @category GET
 */
export default class MakeHealthCheck extends JSONRequest {
    /**
     * @returns `/health`
     */
    path(): string;
}
