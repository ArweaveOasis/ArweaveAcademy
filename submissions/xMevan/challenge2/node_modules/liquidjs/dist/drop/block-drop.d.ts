import { Drop } from './drop';
export declare class BlockDrop extends Drop {
    private superBlockRender;
    constructor(superBlockRender?: () => Iterable<any>);
    /**
     * Provide parent access in child block by
     * {{ block.super }}
     */
    super(): Iterable<any>;
}
