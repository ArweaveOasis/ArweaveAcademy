export type Query<F> = {
  format?: F;
  [key: string]: any;
};

export interface BaseHTTPClientResponse {
  body: Uint8Array;
  status: number; // status must always be 200 except when the response is inside an error
  headers: Record<string, string>;
}

/**
 * BaseHTTPClientError is the interface that errors thrown
 * by methods of BaseHTTPClient should be using
 */
export interface BaseHTTPClientError {
  response: BaseHTTPClientResponse;
}

/**
 * BaseHTTPClient is an interface abstracting the queries that can be
 * made to an algod/indexer endpoint.
 * The SDK normally uses the URLTokenBaseHTTPClient implementation.
 * But when used via wallets, the wallet may provide a different object
 * satisfying the HTTPClient interface. This is useful to allow
 * wallets to provide access to paid API services without leaking
 * the secret tokens/URLs.
 *
 * Note that post and delete also have an optional query parameter
 * This is to allow future extension where post and delete may have queries
 * Currently however HTTPClient does not make use of it
 *
 * Compared to HTTPClient, BaseHTTPClient does not deal with serialization/deserialization
 * Everything is already string/Uint8Array
 * and all the headers (including Accept/Content-Type) are assumed to be provided
 *
 * In case of non-200 status, all methods must throw an error of type
 * BaseHTTPClientError
 */
export interface BaseHTTPClient {
  get(
    relativePath: string,
    query?: Query<string>,
    requestHeaders?: Record<string, string>
  ): Promise<BaseHTTPClientResponse>;
  post(
    relativePath: string,
    data: Uint8Array,
    query?: Query<string>,
    requestHeaders?: Record<string, string>
  ): Promise<BaseHTTPClientResponse>;
  delete(
    relativePath: string,
    data: Uint8Array,
    query?: Query<string>,
    requestHeaders?: Record<string, string>
  ): Promise<BaseHTTPClientResponse>;
}
