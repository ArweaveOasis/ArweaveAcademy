import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import * as modelsv2 from './models/types';
export default class Dryrun extends JSONRequest {
    private blob;
    constructor(c: HTTPClient, dr: modelsv2.DryrunRequest);
    path(): string;
    /**
     * Executes dryrun
     * @param headers - A headers object
     */
    do(headers?: {}): Promise<any>;
}
