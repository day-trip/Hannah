import {SendEmailCommand, SESv2Client} from "@aws-sdk/client-sesv2";

export default class SES {
    private readonly client: SESv2Client;

    private readonly source: string;
    private readonly template: string;

    public constructor(source: string, template: string) {
        this.source = source;
        this.template = template;

        this.client = new SESv2Client({
            region: "us-east-1",
            credentials: {
                accessKeyId: process.env.N_AWS_ACCESS_KEY!,
                secretAccessKey: process.env.N_AWS_ACCESS_KEY!,
            }
        });
    }

    public async sendTextEmail(recipient: string, subject: string, formatArgs: Record<string, string>): Promise<boolean> {
        if (recipient !== "s-jgiri@lwsd.org" && process.env.NODE_ENV !== "production") {
            console.log(`[Accidental Spam Blocker] AHA GOTCHA Mr. ${recipient}!`);
            return false;
        }

        let t = this.template + "";
        Object.keys(formatArgs).forEach(arg => {
            t = t.replaceAll(`{${arg}}`, formatArgs[arg]);
        });

        const input = {
            FromEmailAddress: this.source,
            Destination: {
                ToAddresses: [recipient],
            },
            Content: {
                Simple: {
                    Subject: {
                        Data: subject,
                        Charset: "UTF8",
                    },
                    Body: {
                        Text: {
                            Data: t,
                            Charset: "UTF8",
                        },
                    },
                }
            },
        };
        const command = new SendEmailCommand(input);
        await this.client.send(command);

        return true;
    }
}
