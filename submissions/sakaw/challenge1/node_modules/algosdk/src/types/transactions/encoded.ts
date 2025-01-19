/**
 * Interfaces for the encoded transaction object. Every property is labelled with its associated Transaction type property
 */

export interface EncodedAssetParams {
  /**
   * assetTotal
   */
  t: number | bigint;

  /**
   * assetDefaultFrozen
   */
  df: boolean;

  /**
   * assetDecimals
   */
  dc: number;

  /**
   * assetManager
   */
  m?: Buffer;

  /**
   * assetReserve
   */
  r?: Buffer;

  /**
   * assetFreeze
   */
  f?: Buffer;

  /**
   * assetClawback
   */
  c?: Buffer;

  /**
   * assetName
   */
  an?: string;

  /**
   * assetUnitName
   */
  un?: string;

  /**
   * assetURL
   */
  au?: string;

  /**
   * assetMetadataHash
   */
  am?: Buffer;
}

export interface EncodedLocalStateSchema {
  /**
   * appLocalInts
   */
  nui: number;

  /**
   * appLocalByteSlices
   */
  nbs: number;
}

export interface EncodedGlobalStateSchema {
  /**
   * appGlobalInts
   */
  nui: number;

  /**
   * appGlobalByteSlices
   */
  nbs: number;
}

export interface EncodedBoxReference {
  /**
   * index of the app ID in the foreign apps array
   */
  i: number;

  /**
   * box name
   */
  n: Uint8Array;
}

/**
 * A rough structure for the encoded transaction object. Every property is labelled with its associated Transaction type property
 */
export interface EncodedTransaction {
  /**
   * fee
   */
  fee?: number;

  /**
   * firstRound
   */
  fv?: number;

  /**
   * lastRound
   */
  lv: number;

  /**
   * note
   */
  note?: Buffer;

  /**
   * from
   */
  snd: Buffer;

  /**
   * type
   */
  type: string;

  /**
   * genesisID
   */
  gen: string;

  /**
   * genesisHash
   */
  gh: Buffer;

  /**
   * lease
   */
  lx?: Buffer;

  /**
   * group
   */
  grp?: Buffer;

  /**
   * amount
   */
  amt?: number | bigint;

  /**
   * amount (but for asset transfers)
   */
  aamt?: number | bigint;

  /**
   * closeRemainderTo
   */
  close?: Buffer;

  /**
   * closeRemainderTo (but for asset transfers)
   */
  aclose?: Buffer;

  /**
   * reKeyTo
   */
  rekey?: Buffer;

  /**
   * to
   */
  rcv?: Buffer;

  /**
   * to (but for asset transfers)
   */
  arcv?: Buffer;

  /**
   * voteKey
   */
  votekey?: Buffer;

  /**
   * selectionKey
   */
  selkey?: Buffer;

  /**
   * stateProofKey
   */
  sprfkey?: Buffer;

  /**
   * voteFirst
   */
  votefst?: number;

  /**
   * voteLast
   */
  votelst?: number;

  /**
   * voteKeyDilution
   */
  votekd?: number;

  /**
   * nonParticipation
   */
  nonpart?: boolean;

  /**
   * assetIndex
   */
  caid?: number;

  /**
   * assetIndex (but for asset transfers)
   */
  xaid?: number;

  /**
   * assetIndex (but for asset freezing/unfreezing)
   */
  faid?: number;

  /**
   * freezeState
   */
  afrz?: boolean;

  /**
   * freezeAccount
   */
  fadd?: Buffer;

  /**
   * assetRevocationTarget
   */
  asnd?: Buffer;

  /**
   * See EncodedAssetParams type
   */
  apar?: EncodedAssetParams;

  /**
   * appIndex
   */
  apid?: number;

  /**
   * appOnComplete
   */
  apan?: number;

  /**
   * See EncodedLocalStateSchema type
   */
  apls?: EncodedLocalStateSchema;

  /**
   * See EncodedGlobalStateSchema type
   */
  apgs?: EncodedGlobalStateSchema;

  /**
   * appForeignApps
   */
  apfa?: number[];

  /**
   * appForeignAssets
   */
  apas?: number[];

  /**
   * appApprovalProgram
   */
  apap?: Buffer;

  /**
   * appClearProgram
   */
  apsu?: Buffer;

  /**
   * appArgs
   */
  apaa?: Buffer[];

  /**
   * appAccounts
   */
  apat?: Buffer[];

  /**
   * extraPages
   */
  apep?: number;

  /**
   * boxes
   */
  apbx?: EncodedBoxReference[];

  /*
   * stateProofType
   */
  sptype?: number | bigint;

  /**
   * stateProof
   */
  sp?: Buffer;

  /**
   * stateProofMessage
   */
  spmsg?: Buffer;
}

export interface EncodedSubsig {
  /**
   *  The public key
   */
  pk: Uint8Array;

  /**
   * The signature provided by the public key, if any
   */
  s?: Uint8Array;
}

/**
 * A rough structure for the encoded multi signature transaction object.
 * Every property is labelled with its associated `MultisigMetadata` type property
 */
export interface EncodedMultisig {
  /**
   * version
   */
  v: number;

  /**
   * threshold
   */
  thr: number;

  /**
   * Subset of signatures. A threshold of `thr` signors is required.
   */
  subsig: EncodedSubsig[];
}

/**
 * An encoded multisig blob that contains the encoded multisig as well as a copy of the encoded transaction
 *
 * @deprecated Use EncodedSignedTransaction instead.
 */
export interface EncodedMultisigBlob {
  /**
   * Encoded multisig
   */
  msig: EncodedMultisig;

  /**
   * Encoded transaction
   */
  txn: EncodedTransaction;
}

export interface EncodedLogicSig {
  l: Uint8Array;
  arg?: Uint8Array[];
  sig?: Uint8Array;
  msig?: EncodedMultisig;
}

export interface EncodedLogicSigAccount {
  lsig: EncodedLogicSig;
  sigkey?: Uint8Array;
}

/**
 * A structure for an encoded signed transaction object
 */
export interface EncodedSignedTransaction {
  /**
   * Transaction signature
   */
  sig?: Buffer;

  /**
   * The transaction that was signed
   */
  txn: EncodedTransaction;

  /**
   * Multisig structure
   */
  msig?: EncodedMultisig;

  /**
   * Logic signature
   */
  lsig?: EncodedLogicSig;

  /**
   * The signer, if signing with a different key than the Transaction type `from` property indicates
   */
  sgnr?: Buffer;
}
