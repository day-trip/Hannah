import dynamoose from "dynamoose";
import {AnyItem} from "dynamoose/dist/Item";
import {UserInfo} from "@/app/(backend)/microsoft/teams";
import {TokenInfo} from "@/app/(backend)/microsoft/auth";
import S3 from "@/app/(backend)/aws/S3";

import {ClientMessage} from "@/app/message";

dynamoose.aws.ddb.set(new dynamoose.aws.ddb.DynamoDB({
    "credentials": {
        "accessKeyId": process.env.N_AWS_ACCESS_KEY!,
        "secretAccessKey": process.env.N_AWS_SECRET_KEY!
    },
    "region": "us-east-1"
}));

export type UserType = UserInfo & {
    code: string,
    verified: boolean,
};

export type TokenType = TokenInfo & {

};

export type MessageType = ClientMessage & {
    userId: string;
    order: number;
};

export const User = dynamoose.model<UserType & AnyItem>('Hannah-User', new dynamoose.Schema({
    id: {
        type: String,
        hashKey: true,
    },
    email: {
        type: String,
        rangeKey: true,
        index: {
            project: true,
            type: "global",
        }
    },
    mri: {
        type: String,
        index: {
            project: true,
            type: "global",
        }
    },
    firstName: String,
    lastName: String,
    school: String,
    grade: Number,
    code: String,
    verified: Boolean,
}));

export const Token = dynamoose.model<TokenType & AnyItem>('Hannah-Token', new dynamoose.Schema({
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
