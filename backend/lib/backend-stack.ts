import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Passwordless} from "amazon-cognito-passwordless-auth/cdk";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BackendStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const passwordless = new Passwordless(this, "Hannah-Auth-Stack", {
            allowedOrigins: [
                "http://localhost:3000",
                "https://localhost:3000",
                "http://hannah.jcc.lol",
                "https://hannah.jcc.lol",
            ],
            smsOtpStepUp: {
                otpLength: 6,
                snsRegion: "us-east-1",
                senderId: "jainitaigiri@gmail.com",
            },
        });

        new cdk.CfnOutput(this, "ClientId", {
            value: passwordless.userPoolClients!.at(0)!.userPoolClientId,
        });
        new cdk.CfnOutput(this, "Fido2Url", {
            value: passwordless.fido2Api!.url!,
        });
    }
}
