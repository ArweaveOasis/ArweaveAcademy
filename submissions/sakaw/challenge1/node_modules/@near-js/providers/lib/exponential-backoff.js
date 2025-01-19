"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exponentialBackoff = void 0;
function exponentialBackoff(startWaitTime, retryNumber, waitBackoff, getResult) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: jitter?
        let waitTime = startWaitTime;
        for (let i = 0; i < retryNumber; i++) {
            const result = yield getResult();
            if (result) {
                return result;
            }
            yield sleep(waitTime);
            waitTime *= waitBackoff;
        }
        return null;
    });
}
exports.exponentialBackoff = exponentialBackoff;
// Sleep given number of millis.
function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}
