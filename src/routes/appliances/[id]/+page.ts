import { seedHousehold } from '$lib/data/seed';

/** Prerender known demo appliances; SPA fallback covers newly added ones. */
export function entries() {
	return seedHousehold.appliances.map((a) => ({ id: a.id }));
}
