import { describe, expect, it } from 'vitest';
import { seedHousehold } from '$lib/data/seed';
import { buildApplianceDossierHtml, buildHouseholdDossierHtml } from './dossierExport';

describe('dossierExport', () => {
	it('builds an appliance dossier with identity and local-only note', () => {
		const html = buildApplianceDossierHtml(seedHousehold, 'app-fridge', '2026-08-01');
		expect(html).toContain('Kitchen fridge');
		expect(html).toMatch(/WRF535SWHZ|VS12345678/);
		expect(html).toContain('local-only');
	});

	it('lists every seed appliance in the household summary', () => {
		const html = buildHouseholdDossierHtml(seedHousehold, '2026-08-01');
		for (const appliance of seedHousehold.appliances) {
			expect(html).toContain(appliance.name);
		}
	});
});
