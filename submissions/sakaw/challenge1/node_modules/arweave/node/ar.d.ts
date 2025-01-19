export default class Ar {
    /**
     * Method to take a string value and return a bignumber object.
     *
     * @protected
     * @type {Function}
     * @memberof Arweave
     */
    protected readonly BigNum: Function;
    constructor();
    winstonToAr(winstonString: string, { formatted, decimals, trim }?: {
        formatted?: boolean | undefined;
        decimals?: number | undefined;
        trim?: boolean | undefined;
    }): string;
    arToWinston(arString: string, { formatted }?: {
        formatted?: boolean | undefined;
    }): string;
    compare(winstonStringA: string, winstonStringB: string): number;
    isEqual(winstonStringA: string, winstonStringB: string): boolean;
    isLessThan(winstonStringA: string, winstonStringB: string): boolean;
    isGreaterThan(winstonStringA: string, winstonStringB: string): boolean;
    add(winstonStringA: string, winstonStringB: string): string;
    sub(winstonStringA: string, winstonStringB: string): string;
    private stringToBigNum;
}
