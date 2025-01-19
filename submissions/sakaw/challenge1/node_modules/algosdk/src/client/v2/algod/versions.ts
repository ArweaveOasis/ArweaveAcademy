import JSONRequest from '../jsonrequest';

/**
 * retrieves the VersionResponse from the running node
 */
export default class Versions extends JSONRequest {
  // eslint-disable-next-line class-methods-use-this
  path() {
    return '/versions';
  }
}
