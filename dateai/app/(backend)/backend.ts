import dynamoose from "dynamoose";
import {AnyItem} from "dynamoose/dist/Item";
import {TokenInfo} from "@/app/(backend)/microsoft/auth";
import S3 from "@/app/(backend)/aws/S3";

dynamoose.aws.ddb.set(new dynamoose.aws.ddb.DynamoDB({
    "credentials": {
        "accessKeyId": process.env.N_AWS_ACCESS_KEY!,
        "secretAccessKey": process.env.N_AWS_SECRET_KEY!
    },
    "region": "us-east-1"
}));

export type MessageType = {
    userId: string;
    order: number;
    content: string;
    role: "user" | "assistant";
    timestamp: number;
};

export const Token = dynamoose.model<TokenInfo & AnyItem>('Hannah-Token', new dynamoose.Schema({
    scopes: {
        type: String,
        hashKey: true,
    },
    expiry: {
        type: Number,
        rangeKey: true,
    },
    id: String,
    access: String,
}));

export const Message = dynamoose.model<MessageType & AnyItem>('Hannah-Message', new dynamoose.Schema({
    userId: {
        type: String,
        hashKey: true,
    },
    order: {
        type: Number,
        rangeKey: true,
    },
    timestamp: Number,
    role: String,
    content: String,
    deletable: Boolean,
    pii: Boolean,
}));

export const ProfilePicturesBucket = new S3("hannah-pfp");
