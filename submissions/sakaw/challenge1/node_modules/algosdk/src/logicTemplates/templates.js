/* eslint-disable no-bitwise */
const address = require('../encoding/address');

function putUvarint(buf, x) {
  let i = 0;
  while (x > 0x80) {
    buf.push((x & 0xff) | 0x80);
    // eslint-disable-next-line no-param-reassign
    x >>= 7;
    i += 1;
  }
  buf.push(x & 0xff);
  return i + 1;
}

const valTypes = {
  INT: 1,
  ADDRESS: 2,
  BASE64: 3,
};

function inject(orig, offsets, values, valueTypes) {
  if (
    offsets.length !== values.length ||
    offsets.length !== valueTypes.length
  ) {
    throw new Error('Lengths do not match');
  }

  let res = orig;

  function replace(arr, newVal, offset, placeholderLength) {
    const beforeReplacement = arr.slice(0, offset);
    const afterReplacement = arr.slice(offset + placeholderLength, arr.length);
    const chunks = [beforeReplacement, Buffer.from(newVal), afterReplacement];
    return Buffer.concat(chunks);
  }

  for (let i = 0; i < offsets.length; i++) {
    let decodedLength = 0;
    let val = values[i];
    const valType = valueTypes[i];

    switch (valType) {
      case valTypes.INT:
        // eslint-disable-next-line no-case-declarations
        const intBuf = [];
        decodedLength = putUvarint(intBuf, val);
        res = replace(res, intBuf, offsets[i], 1);
        break;
      case valTypes.ADDRESS:
        val = address.decodeAddress(val);
        res = replace(res, val.publicKey, offsets[i], 32);
        break;
      case valTypes.BASE64:
        // eslint-disable-next-line no-case-declarations
        const lenBuf = [];
        val = Buffer.from(val, 'base64');
        putUvarint(lenBuf, val.length);
        val = Buffer.concat([Buffer.from(lenBuf), val]);
        res = replace(res, val, offsets[i], 33);
        break;
      default:
        throw new Error('unrecognized value type');
    }

    if (decodedLength !== 0) {
      for (let o = 0; o < offsets.length; o++) {
        // eslint-disable-next-line no-param-reassign
        offsets[o] += decodedLength - 1;
      }
    }
  }

  return res;
}

module.exports = { inject, valTypes };
