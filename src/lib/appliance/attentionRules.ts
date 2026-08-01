import type {
	Appliance,
	AttentionItem,
	AttentionUrgency,
	FilterSchedule,
	ServiceRecord,
	Warranty
} from '$lib/types/appliance';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Default: surface filter changes within this many days. */
export const FILTER_SOON_DAYS = 14;

/** Default: surface warranties ending within this many days. */
export const WARRANTY_SOON_DAYS = 60;

/** Default: surface upcoming service within this many days. */
export const SERVICE_SOON_DAYS = 30;

export function daysBetween(fromIso: string, toIso: string): number {
	const from = Date.parse(fromIso);
	const to = Date.parse(toIso);
	if (Number.isNaN(from) || Number.isNaN(to)) {
		throw new Error('Invalid ISO date');
	}
	return Math.floor((to - from) / MS_PER_DAY);
}

export function addDays(isoDate: string, days: number): string {
	const d = new Date(isoDate);
	if (Number.isNaN(d.getTime())) {
		throw new Error('Invalid ISO date');
	}
	d.setUTCDate(d.getUTCDate() + days);
	return d.toISOString().slice(0, 10);
}

export function nextFilterDueAt(filter: FilterSchedule): string {
	return addDays(filter.lastChangedAt, filter.intervalDays);
}

function urgencyForDaysUntil(daysUntil: number, soonDays: number): AttentionUrgency {
	if (daysUntil < 0) return 'overdue';
	if (daysUntil <= soonDays) return 'soon';
	return 'info';
}

function applianceName(appliances: Appliance[], id: string): string {
	return appliances.find((a) => a.id === id)?.name ?? 'Appliance';
}

export function filterAttention(
	filters: FilterSchedule[],
	appliances: Appliance[],
	asOfIso: string,
	soonDays = FILTER_SOON_DAYS
): AttentionItem[] {
	const items: AttentionItem[] = [];
	for (const filter of filters) {
		const dueAt = nextFilterDueAt(filter);
		const daysUntil = daysBetween(asOfIso, dueAt);
		if (daysUntil > soonDays) continue;
		const overdue = daysUntil < 0;
		items.push({
			id: `filter:${filter.id}`,
			kind: overdue ? 'filter-overdue' : 'filter-due',
			urgency: urgencyForDaysUntil(daysUntil, soonDays),
			applianceId: filter.applianceId,
			applianceName: applianceName(appliances, filter.applianceId),
			title: filter.label,
			detail: overdue
				? `Overdue by ${Math.abs(daysUntil)} day${Math.abs(daysUntil) === 1 ? '' : 's'}`
				: daysUntil === 0
					? 'Due today'
					: `Due in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`,
			dueAt,
			daysUntil
		});
	}
	return items;
}

export function warrantyAttention(
	warranties: Warranty[],
	appliances: Appliance[],
	asOfIso: string,
	soonDays = WARRANTY_SOON_DAYS
): AttentionItem[] {
	const items: AttentionItem[] = [];
	for (const warranty of warranties) {
		const daysUntil = daysBetween(asOfIso, warranty.endsAt);
		if (daysUntil > soonDays) continue;
		const expired = daysUntil < 0;
		items.push({
			id: `warranty:${warranty.id}`,
			kind: 'warranty-expiring',
			urgency: urgencyForDaysUntil(daysUntil, soonDays),
			applianceId: warranty.applianceId,
			applianceName: applianceName(appliances, warranty.applianceId),
			title: warranty.label,
			detail: expired
				? `Ended ${Math.abs(daysUntil)} day${Math.abs(daysUntil) === 1 ? '' : 's'} ago`
				: daysUntil === 0
					? 'Ends today'
					: `Ends in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`,
			dueAt: warranty.endsAt,
			daysUntil
		});
	}
	return items;
}

export function serviceAttention(
	services: ServiceRecord[],
	appliances: Appliance[],
	asOfIso: string,
	soonDays = SERVICE_SOON_DAYS
): AttentionItem[] {
	const items: AttentionItem[] = [];
	for (const service of services) {
		if (!service.nextDueAt) continue;
		const daysUntil = daysBetween(asOfIso, service.nextDueAt);
		if (daysUntil > soonDays) continue;
		items.push({
			id: `service:${service.id}`,
			kind: 'service-due',
			urgency: urgencyForDaysUntil(daysUntil, soonDays),
			applianceId: service.applianceId,
			applianceName: applianceName(appliances, service.applianceId),
			title: service.title,
			detail:
				daysUntil < 0
					? `Overdue by ${Math.abs(daysUntil)} day${Math.abs(daysUntil) === 1 ? '' : 's'}`
					: daysUntil === 0
						? 'Due today'
						: `Due in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`,
			dueAt: service.nextDueAt,
			daysUntil
		});
	}
	return items;
}

/** Sort: overdue first, then soonest due date, then title. */
export function sortAttention(items: AttentionItem[]): AttentionItem[] {
	return [...items].sort((a, b) => {
		const urgencyRank = { overdue: 0, soon: 1, info: 2 } as const;
		const urg = urgencyRank[a.urgency] - urgencyRank[b.urgency];
		if (urg !== 0) return urg;
		if (a.daysUntil !== b.daysUntil) return a.daysUntil - b.daysUntil;
		return a.title.localeCompare(b.title);
	});
}

export function buildAttentionList(
	appliances: Appliance[],
	filters: FilterSchedule[],
	warranties: Warranty[],
	services: ServiceRecord[],
	asOfIso: string
): AttentionItem[] {
	return sortAttention([
		...filterAttention(filters, appliances, asOfIso),
		...warrantyAttention(warranties, appliances, asOfIso),
		...serviceAttention(services, appliances, asOfIso)
	]);
}

export function markFilterChanged(
	filter: FilterSchedule,
	changedAtIso: string
): FilterSchedule {
	if (Number.isNaN(Date.parse(changedAtIso))) {
		throw new Error('Invalid change date');
	}
	return { ...filter, lastChangedAt: changedAtIso.slice(0, 10) };
}
