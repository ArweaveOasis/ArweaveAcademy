import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import IntDecoding from '../../../types/intDecoding';
export default class GetTransactionProof extends JSONRequest {
    private round;
    private txID;
    constructor(c: HTTPClient, intDecoding: IntDecoding, round: number, txID: string);
    path(): string;
    /**
     * Exclude assets and application data from results
     * The type of hash function used to create the proof, must be one of: "sha512_256", "sha256"
     *
     * #### Example
     * ```typescript
     * const hashType = "sha256";
     * const round = 123456;
     * const txId = "abc123;
     * const txProof = await algodClient.getTransactionProof(round, txId)
     *        .hashType(hashType)
     *        .do();
     * ```
     *
     * @param hashType
     * @category query
     */
    hashType(hashType: string): this;
}
