import * as danfo from "danfojs-node";
import * as _ from "lodash";
import * as fs from "fs/promises";


class Queue {
    private readonly tasks: CallableFunction[] = [];
    private readonly batches: number;
    private readonly cooldown: number;

    private running: number = 0;

    constructor(batches: number, cooldown: number) {
        this.batches = batches;
        this.cooldown = cooldown;
    }

    enqueue(task: CallableFunction) {
        this.tasks.push(task);
        void this.process();
    }

    async process() {
        if (this.running < this.batches && this.tasks.length > 0) {
            const task = this.tasks.shift();
            if (task) {
                this.running++;
                try {
                    await task();
                } finally {
                    await new Promise(resolve => setTimeout(resolve, this.cooldown));
                    this.running--;
                    void this.process();
                }
            }
        }
    }
}


const TOKEN = `Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6InM2cWIzeTF4d0lJWU1DOUZWS0o0VTN5REtxOW5oRVdfMFdXTlMtWVFtdmMiLCJhbGciOiJSUzI1NiIsIng1dCI6IlQxU3QtZExUdnlXUmd4Ql82NzZ1OGtyWFMtSSIsImtpZCI6IlQxU3QtZExUdnlXUmd4Ql82NzZ1OGtyWFMtSSJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20vIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMWZkNDY3M2YtZGY5Ni00NjIxLTg2MzgtYTFkODhjNGM4NWQ3LyIsImlhdCI6MTcwMzA5OTMxNiwibmJmIjoxNzAzMDk5MzE2LCJleHAiOjE3MDMxMDQ5NTMsImFjY3QiOjAsImFjciI6IjEiLCJhY3JzIjpbInVybjp1c2VyOnJlZ2lzdGVyc2VjdXJpdHlpbmZvIl0sImFpbyI6IkFUUUF5LzhWQUFBQXZvdDFsWDUwQXZyVnI2QkRRYVJrc1QwNEQ1N2VoUUU3UEZleUtTN3dMc1NxaE5mYlpteEk4bFdiMnRJd0doTW0iLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6Ik1pY3Jvc29mdF9BQURfVXNlcnNBbmRUZW5hbnRzIiwiYXBwaWQiOiJmOTg4NWU2ZS02Zjc0LTQ2YjMtYjU5NS0zNTAxNTdhMjc1NDEiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IkdJUkkiLCJnaXZlbl9uYW1lIjoiSkFJIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMjYwMzo4MDBjOjRjNDA6NGIyYTo5MTFkOjg1YWM6YjNkNzo4MjVhIiwibmFtZSI6IkdJUkksIEpBSSIsIm9pZCI6ImE0M2VmOWY3LWY2YzUtNDhiMy05MDA3LTY2NzVkOWVjNzE1OCIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0xMTk1ODQwOTkxLTE2MjMwODg5NzAtMTEzNjI2Mzg2MC0zNzExMzkiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzdGRkU5Q0U4MTk4MyIsInJoIjoiMC5BVmdBUDJmVUg1YmZJVWFHT0tIWWpFeUYxd01BQUFBQUFBQUF3QUFBQUFBQUFBRHlBTlEuIiwic2NwIjoiQWRtaW5pc3RyYXRpdmVVbml0LlJlYWRXcml0ZS5BbGwgQXVkaXRMb2cuUmVhZC5BbGwgRGlyZWN0b3J5LkFjY2Vzc0FzVXNlci5BbGwgRGlyZWN0b3J5LldyaXRlLlJlc3RyaWN0ZWQgZW1haWwgb3BlbmlkIE9yZ2FuaXphdGlvbi5SZWFkLkFsbCBQb2xpY3kuUmVhZFdyaXRlLkF1dGhvcml6YXRpb24gcHJvZmlsZSBVc2VyLkVuYWJsZURpc2FibGVBY2NvdW50LkFsbCBVc2VyLlJlYWRXcml0ZS5BbGwiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJTUTZwU1Q2aVdXZlN6MTJDd1BweERsSENwVG9wcTZ0MEwwaTBTTlVmRmNzIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6Ik5BIiwidGlkIjoiMWZkNDY3M2YtZGY5Ni00NjIxLTg2MzgtYTFkODhjNGM4NWQ3IiwidW5pcXVlX25hbWUiOiJzLWpnaXJpQGx3c2Qub3JnIiwidXBuIjoicy1qZ2lyaUBsd3NkLm9yZyIsInV0aSI6IlZlQkNTaXE5Z0VxMVY2R2sxaGJkQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfc3QiOnsic3ViIjoiTE5BU0V5RXZpNmxmVGFIT3dJMEgwTXZjU3FZSlVwUng0MU5NeFNyYXVLMCJ9LCJ4bXNfdGNkdCI6MTM0MjU0MDc5MH0.iuYLyD2-r-EwO1NFrbvVCfp-C27pT-R650pWwhc24u621RCgmibLhtfLhJns6lmXecGVjFoRVRPekhHKtsfeRg36uTPY4ZZ7eW1KwXmV17DGog8dOrNAk-5RwuTyuSGOX177w3dZ57OiNA0QIspo78GcsmU3nmomUujJClqjbIuX4nzXmlKjS0c3p5XWJbVBe_sXSTAf6wfr-o5zZpJbtJr9vHMnOxepGMqUOrOsxbB4VyxrUDbHHoxUk5AbECAAmVsaQQ9eoUqfNen8vSBFULgb_44ogwJAvJ9No8upnDAFdQ_WWNUtdW9Qr5w-0xZ0E7lP081AzFh7Q48kHPBiGA`;

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const processBatch = async (batch: string[]): Promise<void> => {
    const mapping: Record<string, string> = {};

    const r = await fetch("https://graph.microsoft.com/beta/$batch", {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "authorization": TOKEN,
            "content-type": "application/json",
            "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "x-ms-client-request-id": "c9bb8b1a-9bc4-4766-8fb4-885023ce09a5",
            "x-ms-client-session-id": "da5cd5972b1b4c6e9893d6fba6335f97",
            "x-ms-command-name": "Common - GetPhotos",
            "Referer": "https://sandbox-87-2.reactblade.portal.azure.net/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        body: JSON.stringify({
            "requests": batch.map(bid => {
                const id = generateUUID();
                mapping[id] = bid;
                return {
                    "id": id,
                    "method": "GET",
                    "url": `/users/${bid}/photo/$value`,
                    "headers": {
                        "x-ms-command-name": "Shared - GetUserPhoto",
                        "x-ms-client-request-id": generateUUID(),
                        "x-ms-client-session-id": "c4cfc6591d9b4fca947a680a02655f3b"
                    }
                }
            })
        }),
        method: "POST"
    });

    const json: {responses?: {body: string, id: string}[]} = await r.json();

    if (!json.responses) {
        throw TypeError("Wrong access key - API failed!");
    }


    for (let picture of json.responses) {
        if (!picture.body.startsWith("/9j")) {
            continue;
        }
        const imageBuffer = Buffer.from(picture.body, 'base64');
        await fs.writeFile(`pictures/${mapping[picture.id]}.jpg`, imageBuffer);
    }
}

void (async() => {
    let df = await danfo.readCSV("./users_2023_12_16.csv");
    // const ids: string[] = df["id"].values.slice(2000, 2100);
    // const ids = ['a43ef9f7-f6c5-48b3-9007-6675d9ec7158'];
    const ids: string[] = df["id"].values;

    const batches = _.chunk(ids, 20);
    const queue = new Queue(2, 2);
    for (const batch of batches) {
        queue.enqueue(processBatch.bind(null, batch));
    }
})();
