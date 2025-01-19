/**
 * Base class for models
 */
/* eslint-disable no-underscore-dangle,camelcase */
function _is_primitive(val) {
    /* eslint-enable no-underscore-dangle,camelcase */
    return (val === undefined ||
        val == null ||
        (typeof val !== 'object' && typeof val !== 'function'));
}
function _get_obj_for_encoding(val, binary) {
    /* eslint-enable no-underscore-dangle,camelcase,no-redeclare,no-unused-vars */
    let targetPropValue;
    if (val instanceof Uint8Array) {
        targetPropValue = binary ? val : Buffer.from(val).toString('base64');
    }
    else if (typeof val.get_obj_for_encoding === 'function') {
        targetPropValue = val.get_obj_for_encoding(binary);
    }
    else if (Array.isArray(val)) {
        targetPropValue = [];
        for (const elem of val) {
            targetPropValue.push(_get_obj_for_encoding(elem, binary));
        }
    }
    else if (typeof val === 'object') {
        const obj = {};
        for (const prop of Object.keys(val)) {
            obj[prop] = _get_obj_for_encoding(val[prop], binary);
        }
        targetPropValue = obj;
    }
    else if (_is_primitive(val)) {
        targetPropValue = val;
    }
    else {
        throw new Error(`Unsupported value: ${String(val)}`);
    }
    return targetPropValue;
}
export default class BaseModel {
    /**
     * Get an object ready for encoding to either JSON or msgpack.
     * @param binary - Use true to indicate that the encoding can handle raw binary objects
     *   (Uint8Arrays). Use false to indicate that raw binary objects should be converted to base64
     *   strings. True should be used for objects that will be encoded with msgpack, and false should
     *   be used for objects that will be encoded with JSON.
     */
    get_obj_for_encoding(binary = false) {
        /* eslint-enable no-underscore-dangle,camelcase */
        const obj = {};
        for (const prop of Object.keys(this.attribute_map)) {
            const name = this.attribute_map[prop];
            const value = this[prop];
            if (typeof value !== 'undefined') {
                obj[name] =
                    value === null ? null : _get_obj_for_encoding(value, binary);
            }
        }
        return obj;
    }
}
//# sourceMappingURL=basemodel.js.map