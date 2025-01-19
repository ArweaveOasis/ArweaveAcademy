import JSONRequest from '../jsonrequest';
/**
 * healthCheck returns an empty object iff the node is running
 */
export default class HealthCheck extends JSONRequest {
    path(): string;
    do(headers?: {}): Promise<{}>;
}
