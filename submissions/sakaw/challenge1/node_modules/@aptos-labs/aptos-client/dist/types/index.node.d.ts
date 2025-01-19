import { AptosClientRequest, AptosClientResponse } from "./types";
export default function aptosClient<Res>(requestOptions: AptosClientRequest): Promise<AptosClientResponse<Res>>;
