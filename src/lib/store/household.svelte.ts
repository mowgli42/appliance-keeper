import { browser } from '$app/environment';
import { seedHousehold } from '$lib/data/seed';
import { markFilterChanged } from '$lib/appliance/attentionRules';
import { removeMediaItem } from '$lib/appliance/mediaRules';
import type {
	Appliance,
	FilterSchedule,
	HouseholdState,
	MediaAttachment,
	ServiceRecord,
	Warranty
} from '$lib/types/appliance';

const STORAGE_KEY = 'appliance-keeper:v2';

function cloneSeed(): HouseholdState {
	return structuredClone(seedHousehold);
}

function normalize(parsed: Partial<HouseholdState>): HouseholdState {
	return {
		appliances: parsed.appliances ?? [],
		filters: parsed.filters ?? [],
		warranties: parsed.warranties ?? [],
		services: parsed.services ?? [],
		media: parsed.media ?? []
	};
}

function loadState(): HouseholdState {
	if (!browser) return cloneSeed();
	try {
		const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem('appliance-keeper:v1');
		if (!raw) return cloneSeed();
		const parsed = JSON.parse(raw) as Partial<HouseholdState>;
		if (!parsed?.appliances || !parsed?.filters) return cloneSeed();
		return normalize(parsed);
	} catch {
		return cloneSeed();
	}
}

function persist(state: HouseholdState) {
	if (!browser) return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = $state<HouseholdState>(loadState());

export function getHousehold(): HouseholdState {
	return state;
}

export function resetHousehold() {
	state = cloneSeed();
	persist(state);
}

export function upsertAppliance(appliance: Appliance) {
	const idx = state.appliances.findIndex((a) => a.id === appliance.id);
	if (idx >= 0) {
		state.appliances[idx] = appliance;
	} else {
		state.appliances = [...state.appliances, appliance];
	}
	persist(state);
}

export function removeAppliance(id: string) {
	state.appliances = state.appliances.filter((a) => a.id !== id);
	state.filters = state.filters.filter((f) => f.applianceId !== id);
	state.warranties = state.warranties.filter((w) => w.applianceId !== id);
	state.services = state.services.filter((s) => s.applianceId !== id);
	state.media = state.media.filter((m) => m.applianceId !== id);
	persist(state);
}

export function upsertFilter(filter: FilterSchedule) {
	const idx = state.filters.findIndex((f) => f.id === filter.id);
	if (idx >= 0) {
		state.filters[idx] = filter;
	} else {
		state.filters = [...state.filters, filter];
	}
	persist(state);
}

export function completeFilterChange(filterId: string, changedAtIso: string) {
	const filter = state.filters.find((f) => f.id === filterId);
	if (!filter) throw new Error(`Unknown filter: ${filterId}`);
	upsertFilter(markFilterChanged(filter, changedAtIso));
}

export function upsertWarranty(warranty: Warranty) {
	const idx = state.warranties.findIndex((w) => w.id === warranty.id);
	if (idx >= 0) {
		state.warranties[idx] = warranty;
	} else {
		state.warranties = [...state.warranties, warranty];
	}
	persist(state);
}

export function upsertService(service: ServiceRecord) {
	const idx = state.services.findIndex((s) => s.id === service.id);
	if (idx >= 0) {
		state.services[idx] = service;
	} else {
		state.services = [...state.services, service];
	}
	persist(state);
}

export function addMedia(attachment: MediaAttachment) {
	state.media = [...state.media, attachment];
	persist(state);
}

export function deleteMedia(mediaId: string) {
	state.media = removeMediaItem(state.media, mediaId);
	persist(state);
}

export function todayIso(now = new Date()): string {
	return now.toISOString().slice(0, 10);
}
