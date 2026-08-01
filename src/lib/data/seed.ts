import type { HouseholdState } from '$lib/types/appliance';

/** Demo household — realistic enough for family walkthroughs. */
export const seedHousehold: HouseholdState = {
	appliances: [
		{
			id: 'app-fridge',
			name: 'Kitchen fridge',
			kind: 'refrigerator',
			room: 'kitchen',
			brand: 'Whirlpool',
			model: 'WRF535SWHZ',
			serialNumber: 'VS12345678',
			purchasedAt: '2022-04-12',
			notes: 'Water line behind right side.'
		},
		{
			id: 'app-hvac',
			name: 'Upstairs HVAC',
			kind: 'hvac',
			room: 'utility',
			brand: 'Carrier',
			model: '24ACC636A003',
			purchasedAt: '2019-08-01'
		},
		{
			id: 'app-washer',
			name: 'Washer',
			kind: 'washer',
			room: 'laundry',
			brand: 'LG',
			model: 'WM4000HWA',
			purchasedAt: '2023-01-20'
		},
		{
			id: 'app-dishwasher',
			name: 'Dishwasher',
			kind: 'dishwasher',
			room: 'kitchen',
			brand: 'Bosch',
			model: 'SHPM65Z55N',
			purchasedAt: '2021-11-03'
		}
	],
	filters: [
		{
			id: 'flt-fridge-water',
			applianceId: 'app-fridge',
			label: 'Fridge water filter',
			intervalDays: 180,
			lastChangedAt: '2025-11-01',
			partHint: 'EveryDrop EDR2RXD1'
		},
		{
			id: 'flt-hvac',
			applianceId: 'app-hvac',
			label: 'HVAC air filter',
			intervalDays: 90,
			lastChangedAt: '2026-04-15',
			partHint: '16x25x1 MERV 11'
		},
		{
			id: 'flt-washer-mesh',
			applianceId: 'app-washer',
			label: 'Washer inlet screen clean',
			intervalDays: 365,
			lastChangedAt: '2025-06-01'
		}
	],
	warranties: [
		{
			id: 'war-fridge',
			applianceId: 'app-fridge',
			label: 'Manufacturer warranty',
			provider: 'Whirlpool',
			startsAt: '2022-04-12',
			endsAt: '2027-04-12',
			documentNote: 'Folder: Kitchen / Fridge'
		},
		{
			id: 'war-washer',
			applianceId: 'app-washer',
			label: 'Extended warranty',
			provider: 'SquareTrade',
			startsAt: '2023-01-20',
			endsAt: '2026-08-20',
			documentNote: 'Email receipt in Household'
		}
	],
	services: [
		{
			id: 'svc-hvac-tune',
			applianceId: 'app-hvac',
			title: 'Annual HVAC tune-up',
			performedAt: '2025-09-10',
			nextDueAt: '2026-08-20',
			costCents: 18900,
			technician: 'CoolAir Pros',
			notes: 'Replaced contactor; recommended filter every 90 days.'
		},
		{
			id: 'svc-dishwasher',
			applianceId: 'app-dishwasher',
			title: 'Drain pump replace',
			performedAt: '2025-12-02',
			costCents: 24500,
			technician: 'Home Appliance Co.'
		}
	]
};
