export declare class SourceMap {
    version: number;
    sources: string[];
    names: string[];
    mappings: string;
    pcToLine: {
        [key: number]: number;
    };
    lineToPc: {
        [key: number]: number[];
    };
    constructor({ version, sources, names, mappings, }: {
        version: number;
        sources: string[];
        names: string[];
        mappings: string;
    });
    getLineForPc(pc: number): number | undefined;
    getPcsForLine(line: number): number[] | undefined;
}
