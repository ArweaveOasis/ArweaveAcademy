import { MAX_TAG_BYTES } from "./DataItem.js";
export class AVSCTap {
    buf;
    pos;
    constructor(buf = Buffer.alloc(MAX_TAG_BYTES), pos = 0) {
        this.buf = buf;
        this.pos = pos;
    }
    writeTags(tags) {
        if (!Array.isArray(tags)) {
            throw new Error("input must be array");
        }
        const n = tags.length;
        let i;
        if (n) {
            this.writeLong(n);
            for (i = 0; i < n; i++) {
                // for this use case, assume tags/strings.
                const tag = tags[i];
                if (typeof tag?.name !== "string" || typeof tag?.value !== "string")
                    throw new Error(`Invalid tag format for ${tag}, expected {name:string, value: string}`);
                this.writeString(tag.name);
                this.writeString(tag.value);
                // this.itemsType._write(tap, val[i]);
            }
        }
        this.writeLong(0);
    }
    toBuffer() {
        const buffer = Buffer.alloc(this.pos);
        if (this.pos > this.buf.length)
            throw new Error(`Too many tag bytes (${this.pos} > ${this.buf.length})`);
        this.buf.copy(buffer, 0, 0, this.pos);
        return buffer;
    }
    writeLong(n) {
        const buf = this.buf;
        let f, m;
        if (n >= -1073741824 && n < 1073741824) {
            // Won't overflow, we can use integer arithmetic.
            m = n >= 0 ? n << 1 : (~n << 1) | 1;
            do {
                buf[this.pos] = m & 0x7f;
                m >>= 7;
            } while (m && (buf[this.pos++] |= 0x80));
        }
        else {
            // We have to use slower floating arithmetic.
            f = n >= 0 ? n * 2 : -n * 2 - 1;
            do {
                buf[this.pos] = f & 0x7f;
                f /= 128;
            } while (f >= 1 && (buf[this.pos++] |= 0x80));
        }
        this.pos++;
        this.buf = buf;
    }
    // for some reason using setters/getters with ++ doesn't work right.
    // set pos(newPos: number) {
    //   const d = newPos + 1 - this.buf.length;
    //   if (d > 0) this.buf = Buffer.concat([this.buf, Buffer.alloc(d)]);
    //   this._pos = newPos;
    // }
    // get pos(): number {
    //   return this._pos;
    // }
    // protected safeRead(position): number {
    //   return position > this.buf.length ? 0 : this.buf[position];
    // }
    // protected safeWrite(position, value): Buffer {
    //   if (position > this.buf.length) this.buf = Buffer.concat([this.buf, Buffer.alloc(1)]);
    //   this.buf[position] = value;
    //   return this.buf;
    // }
    writeString(s) {
        const len = Buffer.byteLength(s);
        const buf = this.buf;
        this.writeLong(len);
        let pos = this.pos;
        this.pos += len;
        if (this.pos > buf.length) {
            return;
        }
        if (len > 64) {
            // this._writeUtf8(s, len);
            this.buf.write(s, this.pos - len, len, "utf8");
        }
        else {
            let i, l, c1, c2;
            for (i = 0, l = len; i < l; i++) {
                c1 = s.charCodeAt(i);
                if (c1 < 0x80) {
                    buf[pos++] = c1;
                }
                else if (c1 < 0x800) {
                    buf[pos++] = (c1 >> 6) | 0xc0;
                    buf[pos++] = (c1 & 0x3f) | 0x80;
                }
                else if ((c1 & 0xfc00) === 0xd800 && ((c2 = s.charCodeAt(i + 1)) & 0xfc00) === 0xdc00) {
                    c1 = 0x10000 + ((c1 & 0x03ff) << 10) + (c2 & 0x03ff);
                    i++;
                    buf[pos++] = (c1 >> 18) | 0xf0;
                    buf[pos++] = ((c1 >> 12) & 0x3f) | 0x80;
                    buf[pos++] = ((c1 >> 6) & 0x3f) | 0x80;
                    buf[pos++] = (c1 & 0x3f) | 0x80;
                }
                else {
                    buf[pos++] = (c1 >> 12) | 0xe0;
                    buf[pos++] = ((c1 >> 6) & 0x3f) | 0x80;
                    buf[pos++] = (c1 & 0x3f) | 0x80;
                }
            }
        }
        this.buf = buf;
    }
    readLong() {
        let n = 0;
        let k = 0;
        const buf = this.buf;
        let b, h, f, fk;
        do {
            b = buf[this.pos++];
            h = b & 0x80;
            n |= (b & 0x7f) << k;
            k += 7;
        } while (h && k < 28);
        if (h) {
            // Switch to float arithmetic, otherwise we might overflow.
            f = n;
            fk = 268435456; // 2 ** 28.
            do {
                b = buf[this.pos++];
                f += (b & 0x7f) * fk;
                fk *= 128;
            } while (b & 0x80);
            return (f % 2 ? -(f + 1) : f) / 2;
        }
        return (n >> 1) ^ -(n & 1);
    }
    skipLong() {
        const buf = this.buf;
        while (buf[this.pos++] & 0x80) { }
    }
    readTags() {
        // var items = this.itemsType;
        const val = [];
        let n;
        while ((n = this.readLong())) {
            if (n < 0) {
                n = -n;
                this.skipLong(); // Skip size.
            }
            while (n--) {
                const name = this.readString();
                const value = this.readString();
                val.push(/* items._read(tap) */ { name, value });
            }
        }
        return val;
    }
    readString() {
        const len = this.readLong();
        const pos = this.pos;
        const buf = this.buf;
        this.pos += len;
        if (this.pos > buf.length) {
            // return undefined;
            throw new Error("TAP Position out of range");
        }
        return this.buf.slice(pos, pos + len).toString();
    }
}
export function serializeTags(tags) {
    if (tags?.length === 0) {
        return Buffer.allocUnsafe(0);
    }
    const tap = new AVSCTap();
    tap.writeTags(tags);
    return tap.toBuffer();
}
export function deserializeTags(tagsBuffer) {
    const tap = new AVSCTap(tagsBuffer);
    return tap.readTags();
}
//# sourceMappingURL=tags.js.map