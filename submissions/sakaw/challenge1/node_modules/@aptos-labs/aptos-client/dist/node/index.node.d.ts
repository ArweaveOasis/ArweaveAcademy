type AptosClientResponse<Res> = {
    status: number;
    statusText: string;
    data: Res;
    config?: any;
    request?: any;
    response?: any;
    headers?: any;
};
type AptosClientRequest = {
    url: string;
    method: "GET" | "POST";
    body?: any;
    params?: any;
    headers?: any;
    overrides?: any;
};

declare function aptosClient<Res>(requestOptions: AptosClientRequest): Promise<AptosClientResponse<Res>>;

export { aptosClient as default };
