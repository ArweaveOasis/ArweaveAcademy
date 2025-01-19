const MICROALGOS_TO_ALGOS_RATIO = 1e6;
export const INVALID_MICROALGOS_ERROR_MSG = 'Microalgos should be positive and less than 2^53 - 1.';
/**
 * microalgosToAlgos converts microalgos to algos
 * @param microalgos - number
 * @returns number
 */
export function microalgosToAlgos(microalgos) {
    if (microalgos < 0 || !Number.isSafeInteger(microalgos)) {
        throw new Error(INVALID_MICROALGOS_ERROR_MSG);
    }
    return microalgos / MICROALGOS_TO_ALGOS_RATIO;
}
/**
 * algosToMicroalgos converts algos to microalgos
 * @param algos - number
 * @returns number
 */
export function algosToMicroalgos(algos) {
    const microalgos = algos * MICROALGOS_TO_ALGOS_RATIO;
    return Math.round(microalgos);
}
//# sourceMappingURL=convert.js.map