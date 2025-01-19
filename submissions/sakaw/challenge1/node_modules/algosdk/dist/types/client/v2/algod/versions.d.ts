import JSONRequest from '../jsonrequest';
/**
 * retrieves the VersionResponse from the running node
 */
export default class Versions extends JSONRequest {
    path(): string;
}
