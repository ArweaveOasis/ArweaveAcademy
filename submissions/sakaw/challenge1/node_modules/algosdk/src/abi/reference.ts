export enum ABIReferenceType {
  /**
   * Account reference type
   */
  account = 'account',

  /**
   * Application reference type
   */
  application = 'application',

  /**
   * Asset reference type
   */
  asset = 'asset',
}

export function abiTypeIsReference(type: any): type is ABIReferenceType {
  return (
    type === ABIReferenceType.account ||
    type === ABIReferenceType.application ||
    type === ABIReferenceType.asset
  );
}
