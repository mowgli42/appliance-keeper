import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.BASE_URL ?? 'http://127.0.0.1:4173';
const outDir = new URL('../docs/images/', import.meta.url);

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
	viewport: { width: 390, height: 844 },
	deviceScaleFactor: 2
});

await page.goto(`${base}/`, { waitUntil: 'networkidle' });
await page.waitForSelector('text=Needs attention');
await page.screenshot({
	path: new URL('attention-home.png', outDir).pathname,
	fullPage: true
});

await page.goto(`${base}/appliances/app-fridge/`, { waitUntil: 'networkidle' });
await page.waitForSelector('text=Useful life');
await page.screenshot({
	path: new URL('appliance-detail.png', outDir).pathname,
	fullPage: true
});

await browser.close();
console.log('Wrote docs/images/attention-home.png and appliance-detail.png');
