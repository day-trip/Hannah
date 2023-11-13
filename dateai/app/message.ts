export enum MessageResponseType {
    IGNORE,
    FAIL,
    SUCCEED,
    RETRY
}

export type ClientMessage = {
    content: string;
    role: "user" | "assistant";
    timestamp: number;
    deletable?: boolean;
    pii?: boolean;
}
export const createUserMessage = (text: string, deletable: boolean = false): ClientMessage => ({role: "user", timestamp: Date.now(), content: text, deletable});
export const createAssistantMessage = (text: string): ClientMessage => ({role: "assistant", timestamp: Date.now(), content: text, deletable: false});

export default abstract class MessageFlow<T extends {[key: string]: any}> {
    private readonly succeed: string;
    private readonly reject?: string;
    private readonly retry?: string;

    protected constructor(succeed: string, reject?: string, retry?: string) {
        this.succeed = succeed;
        this.reject = reject;
        this.retry = retry;
    }

    public abstract onMessage(message: string, args: T): Promise<MessageResponseType>;

    public abstract canSend(message: string): boolean;

    public async sendMessage(message: string, args: T): Promise<ClientMessage[]> {
        const result = await this.onMessage(message, args);
        if (result === MessageResponseType.IGNORE) {
            return [];
        }
        if (result === MessageResponseType.FAIL) {
            return [createUserMessage(message), createAssistantMessage(this.reject!)];
        }
        if (result === MessageResponseType.RETRY) {
            return [createUserMessage(message), createAssistantMessage(this.retry!)];
        }
        return [createUserMessage(message), createAssistantMessage(this.succeed)];
    }
}
