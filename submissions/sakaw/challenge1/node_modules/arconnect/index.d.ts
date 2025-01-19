import { SignatureOptions } from "arweave/node/lib/crypto/crypto-interface";
import Transaction from "arweave/node/lib/transaction";

/**
 * Arweave wallet declarations
 */
declare global {
  interface Window {
    arweaveWallet: {
      /**
       * Name of the wallet the API was provided by.
       */
      walletName: string;

      /**
       * Connect to ArConnect and request permissions. This function can always be
       * called again if you want to request more permissions for your site.
       *
       * @param permissions
       * @param appInfo
       */
      connect(
        permissions: PermissionType[],
        appInfo?: AppInfo,
        gateway?: GatewayConfig
      ): Promise<void>;

      /**
       * Disconnect from ArConnect. Removes all permissions from your site.
       */
      disconnect(): Promise<void>;

      /**
       * Get the currently used wallet's address in the extension.
       *
       * @returns Promise of wallet address string
       */
      getActiveAddress(): Promise<string>;

      /**
       * Get all addresses added to the ArConnect extension
       *
       * @returns Promise of a list of the added wallets' addresses.
       */
      getAllAddresses(): Promise<string[]>;

      /**
       * Get wallet names for addresses.
       *
       * @returns Promise of an object with addresses and wallet names
       */
      getWalletNames(): Promise<{ [addr: string]: string }>;

      /**
       * Sign a transaction.
       *
       * @param transaction A valid Arweave transaction without a wallet keyfile added to it
       * @param options Arweave signing options
       *
       * @returns Promise of a signed transaction instance
       */
      sign(
        transaction: Transaction,
        options?: SignatureOptions
      ): Promise<Transaction>;

      /**
       * Get the permissions allowed for you site by the user.
       *
       * @returns Promise of a list of permissions allowed for your dApp.
       */
      getPermissions(): Promise<PermissionType[]>;

      /**
       * Encrypt a string, using the user's wallet.
       *
       * @param data String to encrypt
       * @param options Encrypt options
       *
       * @returns Promise of the encrypted string
       */
      encrypt(
        data: string,
        options: {
          algorithm: string;
          hash: string;
          salt?: string;
        }
      ): Promise<Uint8Array>;

      /**
       * Decrypt a string encrypted with the user's wallet.
       *
       * @param data `Uint8Array` data to decrypt to a string
       * @param options Decrypt options
       *
       * @returns Promise of the decrypted string
       */
      decrypt(
        data: Uint8Array,
        options: {
          algorithm: string;
          hash: string;
          salt?: string;
        }
      ): Promise<string>;

      /**
       * Get the user's custom Arweave config set in the extension
       *
       * @returns Promise of the user's Arweave config
       */
      getArweaveConfig(): Promise<{
        host: string;
        port: number;
        protocol: "http" | "https";
      }>;

      /**
       * Get the signature for data array
       *
       * @param data `Uint8Array` data to get the signature for
       * @param algorithm
       *
       * @returns Promise of signature
       */
      signature(
        data: Uint8Array,
        // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign#parameters
        algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams
      ): Promise<Uint8Array>;

      /**
       * Get the user's active public key, from their wallet
       *
       * @returns Promise of the active public key
       */
      getActivePublicKey(): Promise<string>;

      /**
       * Add a token to ArConnect (if it is not already present)
       *
       * @param id Token contract ID
       */
      addToken(id: string): Promise<void>;

      /**
       * Dispatch an Arweave transaction (preferably bundled)
       *
       * @param transaction Transaction to dispatch
       * @returns Dispatched transaction ID and type
       */
      dispatch(transaction: Transaction): Promise<DispatchResult>;
    };
  }
  interface WindowEventMap {
    walletSwitch: CustomEvent<{ address: string }>;
    arweaveWalletLoaded: CustomEvent<{}>;
  }
}

/**
 * Arweave wallet permission types
 */
export type PermissionType =
  | "ACCESS_ADDRESS"
  | "ACCESS_PUBLIC_KEY"
  | "ACCESS_ALL_ADDRESSES"
  | "SIGN_TRANSACTION"
  | "ENCRYPT"
  | "DECRYPT"
  | "SIGNATURE"
  | "ACCESS_ARWEAVE_CONFIG"
  | "DISPATCH";

export interface DispatchResult {
  id: string;
  type?: "BASE" | "BUNDLED";
}

export interface AppInfo {
  name?: string;
  logo?: string;
}

export interface GatewayConfig {
  host: string;
  port: number;
  protocol: "http" | "https";
}

export {};
