/**
 * Configure how integers in JSON response will be decoded.
 */
var IntDecoding;
(function (IntDecoding) {
    /**
     * All integers will be decoded as Numbers, meaning any values greater than
     * Number.MAX_SAFE_INTEGER will lose precision.
     */
    IntDecoding["DEFAULT"] = "default";
    /**
     * All integers will be decoded as Numbers, but if any values are greater than
     * Number.MAX_SAFE_INTEGER an error will be thrown.
     */
    IntDecoding["SAFE"] = "safe";
    /**
     * Integers will be decoded as Numbers if they are less than or equal to
     * Number.MAX_SAFE_INTEGER, otherwise they will be decoded as BigInts.
     */
    IntDecoding["MIXED"] = "mixed";
    /**
     * All integers will be decoded as BigInts.
     */
    IntDecoding["BIGINT"] = "bigint";
})(IntDecoding || (IntDecoding = {}));
export default IntDecoding;
//# sourceMappingURL=intDecoding.js.map