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

async function shot(name, path, waitFor) {
	await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
	await page.waitForSelector(waitFor);
	await page.screenshot({
		path: new URL(name, outDir).pathname,
		fullPage: true
	});
	console.log('wrote', name);
}

await shot('01-attention-home.png', '/', 'text=Needs attention');
await shot('02-appliances-list.png', '/appliances/', 'text=Appliances');
await shot('03-appliance-detail.png', '/appliances/app-fridge/', 'text=Kitchen fridge');

// Mark filter changed, then re-shot detail + home for after state
await page.goto(`${base}/appliances/app-fridge/`, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Mark changed' }).first().click();
await page.waitForTimeout(300);
await page.screenshot({
	path: new URL('04-filter-marked-changed.png', outDir).pathname,
	fullPage: true
});
console.log('wrote 04-filter-marked-changed.png');

await shot('05-attention-after-filter.png', '/', 'text=Needs attention');
await shot('06-add-appliance.png', '/add/', 'text=Add appliance');

await browser.close();
console.log('done');
