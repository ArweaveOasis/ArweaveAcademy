interface Cookie {
    name: string;
    value: string;
    expires?: Date;
    path?: string;
    sameSite?: "Lax" | "None" | "Strict";
    secure?: boolean;
}
export declare class CookieJar {
    private jar;
    constructor(jar?: Map<string, Cookie[]>);
    setCookie(url: URL, cookieStr: string): void;
    getCookies(url: URL): Cookie[];
    static parse(str: string): Cookie;
}
export {};
