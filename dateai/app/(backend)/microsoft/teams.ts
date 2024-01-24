/*
import MicrosoftAuth, {TokenInfo} from "@/app/(backend)/microsoft/auth";

export type TeamsUser = {
    userLocation: string;
    alias: string;
    mail: string;
    objectType: string;
    sipProxyAddress: string;
    smtpAddresses: string[];
    isSipDisabled: boolean;
    isShortProfile: boolean;
    peopleType: string;
    peopleSubType: string;
    responseSourceInformation: string;
    userPrincipalName: string;
    givenName: string;
    surname: string;
    jobTitle: string;
    department: string;
    email: string;
    userType: string;
    displayName: string;
    type: string;
    mri: string;
    objectId: string;
};

// TODO: implement onenote + raw teams functionality (skype being used right now)

export type TeamsSearchResult = {
    type: string;
    value: TeamsUser[];
};

export type TeamsUserInfo = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    school: number;
    grade: number;
};

export type SignedClientUrl = {
    url: string;
    headers: Record<string, string>;
    expiry: number;
};

export default class Teams {
    private static readonly SEARCH_ENDPOINT = `https://teams.microsoft.com/api/mt/amer/beta/users/searchV2?includeDLs=false&includeBots=false&skypeTeamsInfo=true&source=searchResults&enableGuest=false&includeMTOUsers=false`;
    private static readonly SKYPE: string = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjVFODQ4MjE0Qzc3MDczQUU1QzJCREU1Q0NENTQ0ODlEREYyQzRDODQiLCJ4NXQiOiJYb1NDRk1kd2M2NWNLOTVjelZSSW5kOHNUSVEiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjE2OTgyNzM3MzQsImV4cCI6MTY5ODI3ODQyOCwic2t5cGVpZCI6Im9yZ2lkOmE0M2VmOWY3LWY2YzUtNDhiMy05MDA3LTY2NzVkOWVjNzE1OCIsInNjcCI6NzgwLCJjc2kiOiIxNjk4MjczNDMzIiwidGlkIjoiMWZkNDY3M2YtZGY5Ni00NjIxLTg2MzgtYTFkODhjNGM4NWQ3IiwicmduIjoiYW1lciIsImFhZF91dGkiOiJ3MHZUdFZBTEFrR2VVZ0o3dE9KN0FBIiwiYWFkX2lhdCI6MTY5ODI3MzQzM30.MxexSkQ9tkpmolk_3cQzYznhrXMfhDxS8ZSbcbqjuY-6Tcwatjt1SjlNUOj0UYmxcYzXjExf-yIRCjR3cfRa5dqgGhboM7bh3YX6OVjnGd_CLiKt7wl760xXxmU_Z7eQTZ9rCMYTLlZkx3ve7QJfkXABQoSwNVGextq3s2ZxAZUxXYowHflTcDg5lVaYCxaH4vsOyQadPuFjpy6CC-lTz43Xb7cZYtaZq-xdv6oHhg5CykuWNKSOrdElM8gUTEPU-c3dbX8jbYLgnEqWZS-NhjgPAaRTskmYeK51sqDE9JeV4zeGBL-VByxFi0rg-QkguL4nwA9s-nGlT9FlhUkTUw";

    private readonly login: MicrosoftAuth;

    constructor() {
        this.login = MicrosoftAuth.teams("5e3ce6c0-2b1f-4285-8d4b-75ee78787346", "1fd4673f-df96-4621-8638-a1d88c4c85d7");
    }

    /!**
     * Underlying HTTP(s) request to get underlying Teams user profile by query
     * @param text Query - email or name
     * @param query UNSTABLE: addition parameter to filter by school/grade
     * @private
     *!/
    private async teamsSearchRequest(text: string, query?: string): Promise<[TeamsSearchResult, TokenInfo] | null> {
        const ti = await this.login.getToken(); // TODO: state machines for autorefreshing here we go
        try {
            const r = await fetch(Teams.SEARCH_ENDPOINT + (query ? `&query=${encodeURIComponent(query)}` : ""), {
                headers: {
                    "Accept": "*!/!*",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Authorization": `Bearer ${ti.access}`,
                    "Clientrequestid": "3e2dcb0d-1d65-4280-9db8-67699e15440b",
                    "Content-Type": "application/json;charset=UTF-8",
                    "X-Ms-Serp-Correlation-Id": "3e2dcb0d-1d65-4280-9db8-67699e15440b",
                    "X-Skypetoken": Teams.SKYPE,
                    "Cookie": `MUID=1AE6E50159A760F52A89F6735DA7669C; MC1=GUID=dcf8f32f8699445bb8a5c15df68f9ff5&HASH=dcf8&LV=202308&V=4&LU=1692476532717; _cs_c=0; at_check=true; IR_gbd=microsoft.com; IR_7593=1697753860190%7C0%7C1697753860190%7C%7C; _tt_enable_cookie=1; _ttp=aZw36Kvt8rxJZi0eIw7oLKwrZM2; AMCVS_EA76ADE95776D2EC7F000101%40AdobeOrg=1; _cs_id=eb7c20d6-2646-a8a9-fabe-3ec00f7b4393.1697753860.1.1697753860.1697753860.1613561419.1731917860487; _cs_cvars=%7B%7D; graceIncr=1; MSCC=NR; msresearch=%7B%22state%22%3A%7B%22name%22%3A%22IDLE%22%7D%2C%22userid%22%3A%221698191020276862661970848679%22%7D; fptctx2=H3ihr9e92IdW6yd1ZgQ9Sz4bj6XMGo9empP83sM5eweFT7rgF6BClkGOoMbV5lk1qCA7IPFTuqQStW7UxedESgL0mY0PZSR2qBB%252fD2ySRHypi08ZmsNip1zfmuLTBsUkTH7KpaQcUlx%252baMIejR8fXH3Bu%252fZvjok7KDEVsPF4XDtYoccrKCyu647ahNzLmBs72MjXpmmStO0z5dG%252bSd04FkmWy3X7G9LyCVFLo2iPa3LNAdcVH0qushmc8EVdV3OQPKaRD1UoTnzm8JmVJDVrs%252fLlwxsypBHd3%252byAbh2REJT1nnFZk%252bbHErsroy47fPZ4zPW7EA0Y4sac%252fd5l4%252bITig%253d%253d; mboxEdgeCluster=34; mbox=PC#f28873a6cfd4459b84a85f750c1725f0.34_0#1700865720|session#8297cc6a301642b69fbdbe606970d2e1#1698275580; AMCV_EA76ADE95776D2EC7F000101%40AdobeOrg=1585540135%7CMCIDTS%7C19655%7CMCMID%7C87913662653605234352589142141325703394%7CMCAAMLH-1698878519%7C9%7CMCAAMB-1698878519%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCCIDH%7C-2042935117%7CMCOPTOUT-1698280919s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C4.4.0; _uetsid=fa81c0c072c611ee8ec5755b76ecb8d6; _uetvid=510a90a06ecd11eea397d109137af4ef; MUIDB=1AE6E50159A760F52A89F6735DA7669C; TSPREAUTHCOOKIE=true; clocale=en-us; deviceId=cfa355c6-89eb-4726-97f8-9e7a03460a01; firstTimeLaunch=1698273730584; DesiredAuth=msal2_dev3; TSREGIONCOOKIE=amer; platformid_asm=1415; skypetoken_asm=${Teams.SKYPE}; authtoken=Bearer%3D${ti.access}%26Origin%3Dhttps%3A%2F%2Fteams.microsoft.com; clienttype=web; tenantId=1fd4673f-df96-4621-8638-a1d88c4c85d7; minimumVersionClientUpdateTries=0; ringFinder=%7B%22oid%22%3A%22a43ef9f7-f6c5-48b3-9007-6675d9ec7158%22%2C%22tid%22%3A%221fd4673f-df96-4621-8638-a1d88c4c85d7%22%7D; files-version=23092911200; sessionId=e55540d4-322f-e36c-bff4-8594a2ff0aba`,
                    "Referer": "https://teams.microsoft.com/multi-window/?agent=web&version=23092911205",
                    "Referrer-Policy": "strict-origin-when-cross-origin",
                },
                body: text,
                method: "POST",
            });
            return [await r.json() as TeamsSearchResult, ti];
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    /!**
     * Helper method to filter and format raw Teams user data
     * @param data Raw Teams data
     * @private
     *!/
    /!*private createUserInfo(data: TeamsUser): TeamsUserInfo {
        const [fn, ln] = data.displayName.split(", ").map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).reverse();
        return {
            school: data.department.replace(" School", ""),
            firstName: fn,
            lastName: ln,
            email: data.email,
            id: data.objectId,
            grade: Number.parseInt(data.jobTitle),
            mri: data.mri
        };
    }*!/

    /!**
     * Gets a user's profile picture as a `Buffer`
     * @param userinfo User data
     * @param tokeninfo Access token container
     * @private
     *!/
    /!*private async getProfilePicture(userinfo: TeamsUserInfo, tokeninfo: TokenInfo): Promise<Buffer> {
        const r = await fetch(`https://teams.microsoft.com/api/mt/amer/beta/users/${userinfo.mri}/profilepicturev2?displayname=${encodeURIComponent(userinfo.lastName + ", " + userinfo.firstName)}&size=HR64x64`, {
            "headers": {
                "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/!*,*!/!*;q=0.8",
                "accept-language": "en-US,en;q=0.9",
                "sec-ch-ua": "\"Chromium\";v=\"118\", \"Google Chrome\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "image",
                "sec-fetch-mode": "no-cors",
                "sec-fetch-site": "same-origin",
                "cookie": `clocale=en-us; DesiredAuth=msal2_dev3; clienttype=web; tenantId=1fd4673f-df96-4621-8638-a1d88c4c85d7; MUIDB=1AE6E50159A760F52A89F6735DA7669C; _fbp=fb.1.1698456125980.1987534673; multi-window-version=23092911207; files-version=23092911200; at_check=true; mbox=PC#eae3b5df24aa401d8ed09d77b36d3482.35_0#1732635927|session#ca4ebf2b43fa4793a7d536c3cfec41ef#1698796501; MC1=GUID=0558284532454b22afb57187c8f4d4e2&HASH=0558&LV=202311&V=4&LU=1698873230007; TSPREAUTHCOOKIE=true; deviceId=b2c98b9d-cdf8-4e66-ab5f-d44459a2187d; firstTimeLaunch=1699418082728; TSREGIONCOOKIE=amer; ringFinder=%7B%22oid%22%3A%22a43ef9f7-f6c5-48b3-9007-6675d9ec7158%22%2C%22tid%22%3A%221fd4673f-df96-4621-8638-a1d88c4c85d7%22%7D; platformid_asm=1415; authtoken=Bearer%3D${tokeninfo.access}%26Origin%3Dhttps%3A%2F%2Fteams.microsoft.com; skypetoken_asm=${Teams.SKYPE}; minimumVersionClientUpdateTries=0`,
                "Referer": "https://teams.microsoft.com/_",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            body: null,
            method: "GET"
        });
        return Buffer.from(await r.arrayBuffer());
    }*!/

    /!**
     * Gets the Microsoft Teams profile data for a user based on their email
     * @param email User's email
     *!/
    /!*public async getUserInfoByEmail(email: string): Promise<TeamsUserInfo | null> {
        const j = await this.teamsSearchRequest(email);

        if (!j) {
            return null;
        }

        const [json, ti] = j;

        for (const x of json.value) {
            if (x.mail === email && x.objectType === "User") {
                console.log(x);
                const u = this.createUserInfo(x);
                // const pfp = await this.getProfilePicture(u, ti);
                // await ProfilePicturesBucket.uploadImage(pfp, u.id);
                return u;
            }
        }
        return null;
    }*!/

    /!**
     * Gets the Microsoft Teams profile data for a user based on their email
     * @param fullName User's name
     *!/
    /!*public async getUserInfoByName(fullName: string): Promise<TeamsUserInfo | null> {
        const j = await this.teamsSearchRequest(fullName);

        if (!j) {
            return null;
        }

        const [json] = j;

        for (const x of json.value) {
            if (x.objectType === "User") {
                const u = this.createUserInfo(x);
                if (u.firstName + " " + u.lastName === fullName) {
                    return u;
                }
            }
        }
        return null;
    }*!/

    /!*public async getUserSuggestions(text: string, school: string): Promise<TeamsUserInfo[] | null> {
        const json = await this.teamsSearchRequest(text, school);

        if (!json) {
            return null;
        }

        return json[0].value.filter(x => x.objectType === "User" && x.email && x.email.startsWith("s-") && !Number.isNaN(Number.parseInt(x.jobTitle))).map(x => this.createUserInfo(x));
    }*!/
}
*/
