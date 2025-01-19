import { CurrentEpochValidatorInfo, NextEpochValidatorInfo } from '@near-js/types';
import BN from 'bn.js';
/** Finds seat price given validators stakes and number of seats.
 *  Calculation follow the spec: https://nomicon.io/Economics/README.html#validator-selection
 * @params validators: current or next epoch validators.
 * @params maxNumberOfSeats: maximum number of seats in the network.
 * @params minimumStakeRatio: minimum stake ratio
 * @params protocolVersion: version of the protocol from genesis config
 */
export declare function findSeatPrice(validators: (CurrentEpochValidatorInfo | NextEpochValidatorInfo)[], maxNumberOfSeats: number, minimumStakeRatio: number[], protocolVersion?: number): BN;
export interface ChangedValidatorInfo {
    current: CurrentEpochValidatorInfo;
    next: NextEpochValidatorInfo;
}
export interface EpochValidatorsDiff {
    newValidators: NextEpochValidatorInfo[];
    removedValidators: CurrentEpochValidatorInfo[];
    changedValidators: ChangedValidatorInfo[];
}
/** Diff validators between current and next epoch.
 * Returns additions, subtractions and changes to validator set.
 * @params currentValidators: list of current validators.
 * @params nextValidators: list of next validators.
 */
export declare function diffEpochValidators(currentValidators: CurrentEpochValidatorInfo[], nextValidators: NextEpochValidatorInfo[]): EpochValidatorsDiff;
