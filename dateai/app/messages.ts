import MessageFlow, {MessageResponseType} from "@/app/message";

class FriendsFlow extends MessageFlow<{}> {
    canSend(message: string): boolean {
        return false;
    }

    async onMessage(message: string, args: {}): Promise<MessageResponseType> {
        // return Promise.resolve(undefined);
    }

}