import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import * as modelsv2 from './models/types';
import * as encoding from '../../../encoding/encoding';
import { setHeaders } from './compile';

export default class Dryrun extends JSONRequest {
  private blob: Uint8Array;

  constructor(c: HTTPClient, dr: modelsv2.DryrunRequest) {
    super(c);
    this.blob = encoding.encode(dr.get_obj_for_encoding(true));
  }

  // eslint-disable-next-line class-methods-use-this
  path() {
    return '/v2/teal/dryrun';
  }

  /**
   * Executes dryrun
   * @param headers - A headers object
   */
  async do(headers = {}) {
    const txHeaders = setHeaders(headers);
    const res = await this.c.post(
      this.path(),
      Buffer.from(this.blob),
      txHeaders
    );
    return res.body;
  }
}
