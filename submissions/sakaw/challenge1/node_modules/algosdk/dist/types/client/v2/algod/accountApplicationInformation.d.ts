import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import IntDecoding from '../../../types/intDecoding';
export default class AccountApplicationInformation extends JSONRequest {
    private account;
    private applicationID;
    constructor(c: HTTPClient, intDecoding: IntDecoding, account: string, applicationID: number);
    path(): string;
}
