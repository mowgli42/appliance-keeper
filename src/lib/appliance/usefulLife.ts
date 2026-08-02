import type { Appliance, ApplianceKind, UsefulLifeHint, UsefulLifeRecommendation } from '$lib/types/appliance';

/** Conservative residential useful-life ranges (years). */
export const usefulLifeRanges: Record<ApplianceKind, { min: number; max: number }> = {
	refrigerator: { min: 12, max: 15 },
	freezer: { min: 12, max: 20 },
	washer: { min: 10, max: 12 },
	dryer: { min: 10, max: 13 },
	dishwasher: { min: 9, max: 12 },
	hvac: { min: 15, max: 20 },
	'water-heater': { min: 8, max: 12 },
	furnace: { min: 15, max: 20 },
	range: { min: 12, max: 15 },
	microwave: { min: 7, max: 10 },
	'air-purifier': { min: 5, max: 10 },
	other: { min: 8, max: 12 }
};

export function ageYearsAsOf(purchasedAt: string | undefined, asOfIso: string): number | null {
	if (!purchasedAt) return null;
	const purchased = Date.parse(purchasedAt);
	const asOf = Date.parse(asOfIso);
	if (Number.isNaN(purchased) || Number.isNaN(asOf) || asOf < purchased) return null;
	const days = Math.floor((asOf - purchased) / (24 * 60 * 60 * 1000));
	return Math.floor(days / 365);
}

function recommendationFor(
	ageYears: number | null,
	min: number,
	max: number
): UsefulLifeRecommendation {
	if (ageYears === null) return 'evaluate';
	if (ageYears < min - 2) return 'repair-friendly';
	if (ageYears > max) return 'replace-likely';
	return 'evaluate';
}

function summaryFor(
	kindLabel: string,
	ageYears: number | null,
	min: number,
	max: number,
	recommendation: UsefulLifeRecommendation
): string {
	const agePart =
		ageYears === null
			? `Age unknown for this ${kindLabel.toLowerCase()}.`
			: `This ${kindLabel.toLowerCase()} is about ${ageYears} year${ageYears === 1 ? '' : 's'} old.`;
	const lifePart = `Typical useful life is ${min}–${max} years.`;
	const tip =
		recommendation === 'repair-friendly'
			? 'Most owners repair confidently at this age.'
			: recommendation === 'replace-likely'
				? 'Weigh repair cost carefully — replacement is often wiser past this age.'
				: 'Compare repair quotes against replacement before deciding.';
	return `${agePart} ${lifePart} ${tip}`;
}

const kindWords: Record<ApplianceKind, string> = {
	refrigerator: 'fridge',
	freezer: 'freezer',
	washer: 'washer',
	dryer: 'dryer',
	dishwasher: 'dishwasher',
	hvac: 'HVAC system',
	'water-heater': 'water heater',
	furnace: 'furnace',
	range: 'range',
	microwave: 'microwave',
	'air-purifier': 'air purifier',
	other: 'appliance'
};

export function usefulLifeHint(appliance: Appliance, asOfIso: string): UsefulLifeHint {
	const range = usefulLifeRanges[appliance.kind];
	const ageYears = ageYearsAsOf(appliance.purchasedAt, asOfIso);
	const recommendation = recommendationFor(ageYears, range.min, range.max);
	return {
		kind: appliance.kind,
		ageYears,
		typicalMinYears: range.min,
		typicalMaxYears: range.max,
		recommendation,
		summary: summaryFor(kindWords[appliance.kind], ageYears, range.min, range.max, recommendation)
	};
}
