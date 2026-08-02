import type { ManufacturerContact } from '$lib/types/appliance';

const contacts: ManufacturerContact[] = [
	{
		brand: 'Whirlpool',
		phone: '1-866-698-2538',
		supportUrl: 'https://www.whirlpool.com/services/contact-us.html'
	},
	{
		brand: 'Maytag',
		phone: '1-800-344-1274',
		supportUrl: 'https://www.maytag.com/services/contact-us.html'
	},
	{
		brand: 'KitchenAid',
		phone: '1-800-422-1230',
		supportUrl: 'https://www.kitchenaid.com/service-and-support.html'
	},
	{
		brand: 'LG',
		phone: '1-800-243-0000',
		supportUrl: 'https://www.lg.com/us/support'
	},
	{
		brand: 'Samsung',
		phone: '1-800-726-7864',
		supportUrl: 'https://www.samsung.com/us/support/'
	},
	{
		brand: 'GE',
		phone: '1-800-432-2737',
		supportUrl: 'https://www.geappliances.com/ge/service-and-support/'
	},
	{
		brand: 'Bosch',
		phone: '1-800-944-2904',
		supportUrl: 'https://www.bosch-home.com/us/owner-support/get-support'
	},
	{
		brand: 'Carrier',
		phone: '1-800-227-7437',
		supportUrl: 'https://www.carrier.com/residential/en/us/contact-us/'
	},
	{
		brand: 'Trane',
		phone: '1-800-945-1980',
		supportUrl: 'https://www.trane.com/residential/en/support/'
	},
	{
		brand: 'Rheem',
		phone: '1-800-432-8373',
		supportUrl: 'https://www.rheem.com/support/'
	}
];

export function normalizeBrand(brand: string): string {
	return brand.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

export type ContactLookup =
	| { found: true; contact: ManufacturerContact }
	| { found: false; searchHint: string };

export function lookupManufacturerContact(brand: string | undefined): ContactLookup {
	const raw = brand?.trim();
	if (!raw) {
		return { found: false, searchHint: 'Search for manufacturer support' };
	}
	const needle = normalizeBrand(raw);
	const contact = contacts.find((c) => normalizeBrand(c.brand) === needle);
	if (contact) return { found: true, contact };
	return { found: false, searchHint: `Search for ${raw} support` };
}

export function allManufacturerContacts(): ManufacturerContact[] {
	return [...contacts];
}
