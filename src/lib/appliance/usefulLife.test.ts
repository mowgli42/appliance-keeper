import { describe, expect, it } from 'vitest';
import { ageYearsAsOf, usefulLifeHint } from './usefulLife';
import type { Appliance } from '$lib/types/appliance';

const fridge: Appliance = {
	id: 'app-fridge',
	name: 'Kitchen fridge',
	kind: 'refrigerator',
	room: 'kitchen',
	purchasedAt: '2022-04-12'
};

describe('usefulLife', () => {
	it('computes whole years of age', () => {
		expect(ageYearsAsOf('2022-04-12', '2026-08-01')).toBe(4);
	});

	it('returns mid-life refrigerator guidance', () => {
		const hint = usefulLifeHint(fridge, '2026-08-01');
		expect(hint.ageYears).toBe(4);
		expect(hint.typicalMinYears).toBe(12);
		expect(hint.typicalMaxYears).toBe(15);
		expect(hint.recommendation).toBe('repair-friendly');
		expect(hint.summary).toMatch(/4 years old/);
		expect(hint.summary).toMatch(/12–15/);
	});
});
