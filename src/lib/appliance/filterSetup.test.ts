import { describe, expect, it } from 'vitest';
import {
	frequencyLabel,
	frequencyPresets,
	suggestedFilterForKind,
	validateFilterDraft
} from './filterSetup';

describe('filterSetup', () => {
	it('suggests water filter every 6 months for refrigerators', () => {
		const suggestion = suggestedFilterForKind('refrigerator', '2026-08-21');
		expect(suggestion.label).toBe('Water filter');
		expect(suggestion.intervalDays).toBe(180);
		expect(suggestion.lastChangedAt).toBe('2026-08-21');
	});

	it('maps 6-month preset to 180 days', () => {
		expect(frequencyPresets.find((p) => p.label === 'Every 6 months')?.days).toBe(180);
		expect(frequencyLabel(180)).toBe('Every 6 months');
	});

	it('rejects empty filter names', () => {
		expect(
			validateFilterDraft({
				key: 'x',
				label: '  ',
				intervalDays: 90,
				partHint: '',
				lastChangedAt: '2026-08-21'
			})
		).toMatch(/plain name/i);
	});

	it('rejects non-positive frequency', () => {
		expect(
			validateFilterDraft({
				key: 'x',
				label: 'Air filter',
				intervalDays: 0,
				partHint: '',
				lastChangedAt: '2026-08-21'
			})
		).toMatch(/how often/i);
	});
});
