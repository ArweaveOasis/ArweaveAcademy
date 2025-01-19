import HTTPClient from '../client';
import IntDecoding from '../../types/intDecoding';
import { BaseHTTPClient } from '../baseHTTPClient';
import { TokenHeader } from '../urlTokenBaseHTTPClient';

export type TokenHeaderIdentifier =
  | 'X-Indexer-API-Token'
  | 'X-KMD-API-Token'
  | 'X-Algo-API-Token'
  | string;

/**
 * Convert a token string to a token header
 * @param token - The token string
 * @param headerIdentifier - An identifier for the token header
 */
function convertTokenStringToTokenHeader(
  token: string = '',
  headerIdentifier: TokenHeaderIdentifier
): TokenHeader {
  const tokenHeader = {};
  tokenHeader[headerIdentifier] = token;
  return tokenHeader as TokenHeader;
}

function isBaseHTTPClient(
  tbc: string | TokenHeader | BaseHTTPClient
): tbc is BaseHTTPClient {
  return typeof (tbc as BaseHTTPClient).get === 'function';
}

/**
 * Abstract service client to encapsulate shared AlgodClient and IndexerClient logic
 */
export default abstract class ServiceClient {
  /** @ignore */
  c: HTTPClient;
  /** @ignore */
  intDecoding: IntDecoding;

  constructor(
    tokenHeaderIdentifier: TokenHeaderIdentifier,
    tokenHeaderOrStrOrBaseClient: string | TokenHeader | BaseHTTPClient,
    baseServer: string,
    port?: string | number,
    defaultHeaders: Record<string, any> = {}
  ) {
    if (isBaseHTTPClient(tokenHeaderOrStrOrBaseClient)) {
      // we are using a base client
      this.c = new HTTPClient(tokenHeaderOrStrOrBaseClient);
    } else {
      // Accept token header as string or object
      // - workaround to allow backwards compatibility for multiple headers
      let tokenHeader: TokenHeader;
      if (typeof tokenHeaderOrStrOrBaseClient === 'string') {
        tokenHeader = convertTokenStringToTokenHeader(
          tokenHeaderOrStrOrBaseClient,
          tokenHeaderIdentifier
        );
      } else {
        tokenHeader = tokenHeaderOrStrOrBaseClient;
      }

      this.c = new HTTPClient(tokenHeader, baseServer, port, defaultHeaders);
    }

    this.intDecoding = IntDecoding.DEFAULT;
  }

  /**
   * Set the default int decoding method for all JSON requests this client creates.
   * @param method - \{"default" | "safe" | "mixed" | "bigint"\} method The method to use when parsing the
   *   response for request. Must be one of "default", "safe", "mixed", or "bigint". See
   *   JSONRequest.setIntDecoding for more details about what each method does.
   */
  setIntEncoding(method: IntDecoding) {
    this.intDecoding = method;
  }

  /**
   * Get the default int decoding method for all JSON requests this client creates.
   */
  getIntEncoding() {
    return this.intDecoding;
  }
}
