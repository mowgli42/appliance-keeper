import { describe, expect, it } from 'vitest';
import { lookupManufacturerContact } from './manufacturerContacts';

describe('manufacturerContacts', () => {
	it('matches known brands case-insensitively', () => {
		const result = lookupManufacturerContact('whirlpool');
		expect(result.found).toBe(true);
		if (result.found) {
			expect(result.contact.brand).toBe('Whirlpool');
			expect(result.contact.supportUrl || result.contact.phone).toBeTruthy();
		}
	});

	it('returns search hint for unknown brands', () => {
		const result = lookupManufacturerContact('AcmeFancyCo');
		expect(result.found).toBe(false);
		if (!result.found) {
			expect(result.searchHint).toMatch(/AcmeFancyCo/);
		}
	});
});
