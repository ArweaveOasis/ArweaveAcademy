"use strict";
// import MyAlgoConnect from "@randlabs/myalgo-connect/index.js";
// import * as algosdk from "algosdk";
// import { Signer } from "../index.js";
// import { SignatureConfig, SIG_CONFIG } from "../../../constants";
// import * as ed25519 from "noble-ed25519";
// export default class InjectedAlgorandSigner implements Signer {
//   private signer: MyAlgoConnect;
//   public publicKey: Buffer;
//   readonly ownerLength: number = SIG_CONFIG[SignatureConfig.ED25519].pubLength;
//   readonly signatureLength: number = SIG_CONFIG[SignatureConfig.ED25519].sigLength;
//   readonly signatureType: number = 2;
//   constructor() {
//     const myAlgoWallet = new MyAlgoConnect();
//     this.signer = myAlgoWallet;
//   }
//   async setPublicKey(): Promise<void> {
//     const accounts = await this.signer.connect();
//     const pub = algosdk.decodeAddress(accounts[0].address);
//     this.publicKey = Buffer.from(pub.publicKey);
//   }
//   public async sign(message: any): Promise<any> {
//     if (!this.publicKey) {
//       await this.setPublicKey();
//     }
//     const sig = await this.signer.signTransaction(message);
//     return sig;
//   }
//   static verify(
//     pk: Buffer,
//     message: Uint8Array,
//     signature: Uint8Array,
//   ): Promise<boolean> {
//     // let p = pk;
//     // if (typeof pk === "string") p = base64url.toBuffer(pk);
//     return ed25519.verify(
//       Buffer.from(signature),
//       Buffer.from(message),
//       Buffer.from(pk),
//     );
//   }
// }
//# sourceMappingURL=injectedAlgorandSigner.js.map