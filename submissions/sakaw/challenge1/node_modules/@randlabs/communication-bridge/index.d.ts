type ReplyCB<V> = (res: V) => void;

type onMessageCallback<T, V> = (req: T, origin: string, source: Window, sendResponse: ReplyCB<V>, bridge: Messenger<T,V>) => void;

interface sendMessageOptions {
    waitForReply?: boolean;
    timeout?: number;
}

export default class Messenger<Request, Response> {
    constructor(channelName: string, onMessage?: onMessageCallback<Request,Response>);
    sendMessage(targetWindow: Window, message: Request, origin: string, options?: sendMessageOptions): Promise<Response>;
    close(): void;
}
