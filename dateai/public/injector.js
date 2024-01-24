self.addEventListener('fetch', (event) => {
    if (/^https?:\/\/discord.com/.test(event.request.url)) {
        console.log("DISCORDY!")
    }
});

self.addEventListener("install", function (event) {
    console.log("Hello world from the Service Worker 🤙");
});
