/** Core domain types for Appliance Keeper (local-first household tracker). */

export type ApplianceKind =
	| 'refrigerator'
	| 'freezer'
	| 'washer'
	| 'dryer'
	| 'dishwasher'
	| 'hvac'
	| 'water-heater'
	| 'furnace'
	| 'range'
	| 'microwave'
	| 'air-purifier'
	| 'other';

export type Room =
	| 'kitchen'
	| 'laundry'
	| 'basement'
	| 'garage'
	| 'utility'
	| 'living'
	| 'bedroom'
	| 'bathroom'
	| 'other';

export type AttentionKind = 'filter-due' | 'filter-overdue' | 'warranty-expiring' | 'service-due';

export type AttentionUrgency = 'overdue' | 'soon' | 'info';

export interface Appliance {
	id: string;
	name: string;
	kind: ApplianceKind;
	room: Room;
	brand?: string;
	model?: string;
	serialNumber?: string;
	purchasedAt?: string;
	notes?: string;
	photoDataUrl?: string;
}

export interface FilterSchedule {
	id: string;
	applianceId: string;
	/** What the family sees, e.g. "Fridge water filter" */
	label: string;
	/** Interval in days between changes */
	intervalDays: number;
	lastChangedAt: string;
	/** Optional part / size hint for buying replacements */
	partHint?: string;
}

export interface Warranty {
	id: string;
	applianceId: string;
	label: string;
	provider?: string;
	startsAt: string;
	endsAt: string;
	/** Where the paper/PDF lives (path note or URL) */
	documentNote?: string;
}

export interface ServiceRecord {
	id: string;
	applianceId: string;
	title: string;
	performedAt: string;
	/** Optional next recommended service date */
	nextDueAt?: string;
	costCents?: number;
	technician?: string;
	notes?: string;
}

export interface AttentionItem {
	id: string;
	kind: AttentionKind;
	urgency: AttentionUrgency;
	applianceId: string;
	applianceName: string;
	title: string;
	detail: string;
	/** ISO date the item is due / expires */
	dueAt: string;
	/** Days until due (negative = overdue) */
	daysUntil: number;
}

export interface HouseholdState {
	appliances: Appliance[];
	filters: FilterSchedule[];
	warranties: Warranty[];
	services: ServiceRecord[];
}
