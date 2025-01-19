/**
 * Base class for models
 */
export default class BaseModel {
    attribute_map: Record<string, string>;
    /**
     * Get an object ready for encoding to either JSON or msgpack.
     * @param binary - Use true to indicate that the encoding can handle raw binary objects
     *   (Uint8Arrays). Use false to indicate that raw binary objects should be converted to base64
     *   strings. True should be used for objects that will be encoded with msgpack, and false should
     *   be used for objects that will be encoded with JSON.
     */
    get_obj_for_encoding(binary?: boolean): Record<string, any>;
}
