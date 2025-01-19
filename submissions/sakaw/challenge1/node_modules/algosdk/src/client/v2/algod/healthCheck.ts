import JSONRequest from '../jsonrequest';

/**
 * healthCheck returns an empty object iff the node is running
 */
export default class HealthCheck extends JSONRequest {
  // eslint-disable-next-line class-methods-use-this
  path() {
    return '/health';
  }

  async do(headers = {}) {
    const res = await this.c.get(this.path(), {}, headers);
    if (!res.ok) {
      throw new Error(`Health response: ${res.status}`);
    }
    return {};
  }
}
