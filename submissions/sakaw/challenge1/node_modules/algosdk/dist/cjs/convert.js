"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.algosToMicroalgos = exports.microalgosToAlgos = exports.INVALID_MICROALGOS_ERROR_MSG = void 0;
const MICROALGOS_TO_ALGOS_RATIO = 1e6;
exports.INVALID_MICROALGOS_ERROR_MSG = 'Microalgos should be positive and less than 2^53 - 1.';
/**
 * microalgosToAlgos converts microalgos to algos
 * @param microalgos - number
 * @returns number
 */
function microalgosToAlgos(microalgos) {
    if (microalgos < 0 || !Number.isSafeInteger(microalgos)) {
        throw new Error(exports.INVALID_MICROALGOS_ERROR_MSG);
    }
    return microalgos / MICROALGOS_TO_ALGOS_RATIO;
}
exports.microalgosToAlgos = microalgosToAlgos;
/**
 * algosToMicroalgos converts algos to microalgos
 * @param algos - number
 * @returns number
 */
function algosToMicroalgos(algos) {
    const microalgos = algos * MICROALGOS_TO_ALGOS_RATIO;
    return Math.round(microalgos);
}
exports.algosToMicroalgos = algosToMicroalgos;
//# sourceMappingURL=convert.js.map