import * as vlq from 'vlq';

export class SourceMap {
  version: number;
  sources: string[];
  names: string[];
  mappings: string;

  pcToLine: { [key: number]: number };
  lineToPc: { [key: number]: number[] };

  constructor({
    version,
    sources,
    names,
    mappings,
  }: {
    version: number;
    sources: string[];
    names: string[];
    mappings: string;
  }) {
    this.version = version;
    this.sources = sources;
    this.names = names;
    this.mappings = mappings;

    if (this.version !== 3)
      throw new Error(`Only version 3 is supported, got ${this.version}`);

    if (this.mappings === undefined)
      throw new Error(
        'mapping undefined, cannot build source map without `mapping`'
      );

    const pcList = this.mappings.split(';').map((m) => {
      const decoded = vlq.decode(m);
      if (decoded.length > 2) return decoded[2];
      return undefined;
    });

    this.pcToLine = {};
    this.lineToPc = {};

    let lastLine = 0;
    for (const [pc, lineDelta] of pcList.entries()) {
      // If the delta is not undefined, the lastLine should be updated with
      // lastLine + the delta
      if (lineDelta !== undefined) {
        lastLine += lineDelta;
      }

      if (!(lastLine in this.lineToPc)) this.lineToPc[lastLine] = [];

      this.lineToPc[lastLine].push(pc);
      this.pcToLine[pc] = lastLine;
    }
  }

  getLineForPc(pc: number): number | undefined {
    return this.pcToLine[pc];
  }

  getPcsForLine(line: number): number[] | undefined {
    return this.lineToPc[line];
  }
}
