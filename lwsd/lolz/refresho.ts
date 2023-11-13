import { Configuration, LogLevel, PublicClientApplication } from "@azure/msal-node";

const msalConfig = {
    auth: {
        clientId: "",
        authority: `https://login.microsoftonline.com/`,
        clientSecret: process.env.CLIENT_SECRET
    },
    cache: {
        cachePlugin: msalCachePlugin(config.msalCacheLocation)
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
}

// Initialize MSAL Node application object using authentication parameters
const cca = new msal.ConfidentialClientApplication(msalConfig);

const cryptoProvider = new CryptoProvider();

const authCodeUrlParameters = {
    scopes: ["user.read"],
    responseMode: 'form_post',
    redirectUri: "https://teams.microsoft.com/go",
    state: req.session.state,
};

try {
    // Request auth code url, then redirect
    const authCodeUrl = await cca.getAuthCodeUrl(authCodeUrlParameters);
    res.redirect(authCodeUrl);
} catch (error) {
    next(error);
}