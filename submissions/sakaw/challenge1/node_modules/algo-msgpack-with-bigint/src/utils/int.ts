// DataView extension to handle int64 / uint64,
// where the actual range is 53-bits integer (a.k.a. safe integer)

export function setUint64(view: DataView, offset: number, value: number): void {
  const high = value / 0x1_0000_0000;
  const low = value; // high bits are truncated by DataView
  view.setUint32(offset, high);
  view.setUint32(offset + 4, low);
}

export function setInt64(view: DataView, offset: number, value: number): void {
  const high = Math.floor(value / 0x1_0000_0000);
  const low = value; // high bits are truncated by DataView
  view.setUint32(offset, high);
  view.setUint32(offset + 4, low);
}

export function setBigInt64(view: DataView, offset: number, value: bigint): void {
  let high = Number(value / BigInt(0x1_0000_0000));
  const low = Number(value % BigInt(0x1_0000_0000));
  if (high < 0 && low !== 0) {
    // simulate Math.floor for negative high
    high -= 1;
  }
  view.setUint32(offset, high);
  view.setUint32(offset + 4, low);
}

export function getInt64(view: DataView, offset: number) {
  const high = view.getInt32(offset);
  const low = view.getUint32(offset + 4);

  const exceeds_min_safe_int =
    high < Math.floor(Number.MIN_SAFE_INTEGER / 0x1_0000_0000) ||
    (high === Math.floor(Number.MIN_SAFE_INTEGER / 0x1_0000_0000) && low === 0);

  const exceeds_max_safe_int = high > Math.floor(Number.MAX_SAFE_INTEGER / 0x1_0000_0000);

  if (exceeds_min_safe_int || exceeds_max_safe_int) {
    return BigInt(high) * BigInt(0x1_0000_0000) + BigInt(low);
  }
  return high * 0x1_0000_0000 + low;
}

export function getUint64(view: DataView, offset: number) {
  const high = view.getUint32(offset);
  const low = view.getUint32(offset + 4);

  const exceeds_max_safe_int = high > Math.floor(Number.MAX_SAFE_INTEGER / 0x1_0000_0000);

  if (exceeds_max_safe_int) {
    return BigInt(high) * BigInt(0x1_0000_0000) + BigInt(low);
  }
  return high * 0x1_0000_0000 + low;
}
