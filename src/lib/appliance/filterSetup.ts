import type { ApplianceKind } from '$lib/types/appliance';

/** Common change frequencies shown as plain choices (days under the hood). */
export const frequencyPresets: { days: number; label: string }[] = [
	{ days: 30, label: 'Every month' },
	{ days: 90, label: 'Every 3 months' },
	{ days: 180, label: 'Every 6 months' },
	{ days: 365, label: 'Every year' }
];

export type FilterDraft = {
	/** Local row key for the form only */
	key: string;
	label: string;
	intervalDays: number;
	partHint: string;
	lastChangedAt: string;
};

/** Suggested first filter when the family picks an appliance type. */
export function suggestedFilterForKind(
	kind: ApplianceKind,
	asOfIso: string
): Omit<FilterDraft, 'key'> {
	const defaults: Record<ApplianceKind, { label: string; intervalDays: number; partHint: string }> =
		{
			refrigerator: {
				label: 'Water filter',
				intervalDays: 180,
				partHint: ''
			},
			freezer: { label: 'Air filter', intervalDays: 180, partHint: '' },
			washer: { label: 'Inlet screen clean', intervalDays: 365, partHint: '' },
			dryer: { label: 'Lint filter clean', intervalDays: 30, partHint: '' },
			dishwasher: { label: 'Filter clean', intervalDays: 90, partHint: '' },
			hvac: { label: 'Air filter', intervalDays: 90, partHint: '' },
			'water-heater': { label: 'Anode / flush check', intervalDays: 365, partHint: '' },
			furnace: { label: 'Air filter', intervalDays: 90, partHint: '' },
			range: { label: 'Grease filter clean', intervalDays: 90, partHint: '' },
			microwave: { label: 'Filter clean', intervalDays: 180, partHint: '' },
			'air-purifier': { label: 'HEPA / carbon filter', intervalDays: 180, partHint: '' },
			other: { label: 'Filter', intervalDays: 90, partHint: '' }
		};
	const d = defaults[kind];
	return {
		label: d.label,
		intervalDays: d.intervalDays,
		partHint: d.partHint,
		lastChangedAt: asOfIso
	};
}

export function frequencyLabel(days: number): string {
	const preset = frequencyPresets.find((p) => p.days === days);
	if (preset) return preset.label;
	if (days % 30 === 0) {
		const months = days / 30;
		return months === 1 ? 'Every month' : `Every ${months} months`;
	}
	return `Every ${days} days`;
}

export function validateFilterDraft(draft: FilterDraft): string | null {
	if (!draft.label.trim()) return 'Give each filter a plain name — like “Water filter”.';
	const days = Number(draft.intervalDays);
	if (!Number.isFinite(days) || days < 1) {
		return 'Choose how often the filter should be changed.';
	}
	if (!draft.lastChangedAt || Number.isNaN(Date.parse(draft.lastChangedAt))) {
		return 'Enter the last-changed date (use today if you just installed it).';
	}
	return null;
}
