import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import IntDecoding from '../../../types/intDecoding';
export default class AccountAssetInformation extends JSONRequest {
    private account;
    private assetID;
    constructor(c: HTTPClient, intDecoding: IntDecoding, account: string, assetID: number);
    path(): string;
}
