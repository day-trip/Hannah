import * as p from "puppeteer";
import {createCanvas, loadImage} from "canvas";
import * as fs from "fs";

void (async () => {
    const browser = await p.launch({headless: false});
    const page = await browser.newPage();
    await page.setViewport({width: 1280, height: 800});
    await page.goto("https://launchpad.classlink.com/lwsd");
    await page.waitForSelector("body");
    await page.waitForTimeout(1000);
    const [cc, tt] = await page.evaluate(() => {
        const clickable = Array.from(document.querySelectorAll("[onclick], a[href]"));
        const typeable = Array.from(document.querySelectorAll("input, textarea"));
        return [clickable.map(c => {
            const {x, y, width, height} = c.getBoundingClientRect();
            if (x < 0 || x > 1280 || y < 0 || y > 800) {
                return undefined;
            }
            let yy = y;
            if (height > 30) {
                yy += height / 2;
                yy -= 15;
            }
            return [x + width + 5, yy];
        }).filter(x => !!x), typeable.map(t => {
            const {x, y, width, height} = t.getBoundingClientRect();
            if (x < 0 || x > 1280 || y < 0 || y > 800) {
                return undefined;
            }
            let yy = y;
            if (height > 30) {
                yy += height / 2;
                yy -= 15;
            }
            return [x + width + 5, yy];
        }).filter(x => !!x)];
    });
    const x = await page.screenshot({type: "png", encoding: "binary"});
    await page.close();
    await browser.close();

    const canvas = createCanvas(1280, 800);
    const ctx = canvas.getContext("2d");
    const image = await loadImage(x);
    ctx.drawImage(image, 0, 0, 1280, 800);
    ctx.fillStyle = "black";
    let i = 0;
    cc.forEach(([x, y]) => {
        ctx.fillRect(x, y, 30, 30);
        ctx.fillStyle = "white";
        ctx.fillText(String(i), x + 10, y + 10);
        ctx.fillStyle = "black";
        i++;
    });
    tt.forEach(([x, y]) => {
        ctx.fillRect(x, y, 30, 30);
        ctx.fillStyle = "white";
        ctx.fillText(String(i), x + 10, y + 10);
        ctx.fillStyle = "black";
        i++;
    });
    const out = fs.createWriteStream("output.png");
    canvas.createPNGStream().pipe(out);
    await new Promise(resolve => {
        out.on('finish', resolve);
    });
    console.log("Done!");

})();
