import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";

export default class S3 {
    private readonly name: string;
    private readonly client: S3Client;

    constructor(name: string) {
        this.name = name;
        this.client = new S3Client({
            region: "us-east-1",
            credentials: {
                accessKeyId: process.env.N_AWS_ACCESS_KEY!,
                secretAccessKey: process.env.N_AWS_SECRET_KEY!,
            }
        });
    }

    public async uploadImage(blob: Buffer, fileName: string): Promise<void> {
        await this.client.send(new PutObjectCommand({
            Bucket: this.name,
            Key: fileName + ".jpeg",
            Body: blob,
            ACL: "public-read",
            ContentType: "image/jpeg",
        }));
    }

    public getImageURL(fileName: string): string {
        return `https://${this.name}.s3.us-east-1.amazonaws.com/${fileName}.jpeg`;
    }
}
