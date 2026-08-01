import type { ApplianceKind, AttentionKind, Room } from '$lib/types/appliance';

export const kindLabels: Record<ApplianceKind, string> = {
	refrigerator: 'Refrigerator',
	freezer: 'Freezer',
	washer: 'Washer',
	dryer: 'Dryer',
	dishwasher: 'Dishwasher',
	hvac: 'HVAC',
	'water-heater': 'Water heater',
	furnace: 'Furnace',
	range: 'Range / stove',
	microwave: 'Microwave',
	'air-purifier': 'Air purifier',
	other: 'Other'
};

export const roomLabels: Record<Room, string> = {
	kitchen: 'Kitchen',
	laundry: 'Laundry',
	basement: 'Basement',
	garage: 'Garage',
	utility: 'Utility',
	living: 'Living room',
	bedroom: 'Bedroom',
	bathroom: 'Bathroom',
	other: 'Other'
};

export const attentionKindLabels: Record<AttentionKind, string> = {
	'filter-due': 'Filter',
	'filter-overdue': 'Filter overdue',
	'warranty-expiring': 'Warranty',
	'service-due': 'Service'
};

export function newId(prefix: string): string {
	return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}
