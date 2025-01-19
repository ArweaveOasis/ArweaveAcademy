export interface JWKPublicInterface {
    kty: string;
    e: string;
    n: string;
}
export interface JWKInterface extends JWKPublicInterface {
    d?: string;
    p?: string;
    q?: string;
    dp?: string;
    dq?: string;
    qi?: string;
}
