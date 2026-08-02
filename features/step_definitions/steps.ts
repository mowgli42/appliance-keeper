import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import {
	addDays,
	buildAttentionList,
	markFilterChanged,
	nextFilterDueAt
} from '../../src/lib/appliance/attentionRules.ts';
import {
	buildApplianceDossierHtml,
	buildHouseholdDossierHtml
} from '../../src/lib/appliance/dossierExport.ts';
import {
	lookupManufacturerContact,
	type ContactLookup
} from '../../src/lib/appliance/manufacturerContacts.ts';
import {
	createMediaAttachment,
	mediaForAppliance,
	removeMediaItem
} from '../../src/lib/appliance/mediaRules.ts';
import { usefulLifeHint } from '../../src/lib/appliance/usefulLife.ts';
import { seedHousehold } from '../../src/lib/data/seed.ts';
import type {
	Appliance,
	AttentionItem,
	FilterSchedule,
	HouseholdState,
	MediaAttachment,
	UsefulLifeHint
} from '../../src/lib/types/appliance.ts';

type World = {
	filter?: FilterSchedule;
	dueAt?: string;
	updated?: FilterSchedule;
	appliances: Appliance[];
	filters: FilterSchedule[];
	attention: AttentionItem[];
	household?: HouseholdState;
	hint?: UsefulLifeHint;
	contact?: ContactLookup;
	brand?: string;
	media: MediaAttachment[];
	lastMediaId?: string;
	dossierHtml?: string;
};

const world: World = {
	appliances: [],
	filters: [],
	attention: [],
	media: []
};

Given(
	'a filter last changed on {string} with interval {int} days',
	function (lastChangedAt: string, intervalDays: number) {
		world.filter = {
			id: 'f1',
			applianceId: 'app-fridge',
			label: 'Water filter',
			intervalDays,
			lastChangedAt
		};
	}
);

When('the next due date is calculated', function () {
	assert.ok(world.filter);
	world.dueAt = nextFilterDueAt(world.filter);
});

Then('the due date should be {string}', function (expected: string) {
	assert.equal(world.dueAt, expected);
});

When('the filter is marked changed on {string}', function (changedAt: string) {
	assert.ok(world.filter);
	world.updated = markFilterChanged(world.filter, changedAt);
	world.dueAt = nextFilterDueAt(world.updated);
});

Then('the last changed date should be {string}', function (expected: string) {
	assert.equal(world.updated?.lastChangedAt, expected);
});

Then(
	'the next due date should be {int} days after {string}',
	function (days: number, from: string) {
		assert.equal(world.dueAt, addDays(from, days));
	}
);

Given('appliance {string} with id {string}', function (name: string, id: string) {
	world.appliances = [
		{
			id,
			name,
			kind: 'refrigerator',
			room: 'kitchen'
		}
	];
	world.filters = [];
});

Given(
	'a filter {string} on {string} last changed {string} interval {int} days',
	function (label: string, applianceId: string, lastChangedAt: string, intervalDays: number) {
		world.filters.push({
			id: `f-${world.filters.length + 1}`,
			applianceId,
			label,
			intervalDays,
			lastChangedAt
		});
	}
);

When('the attention list is built for {string}', function (asOf: string) {
	world.attention = buildAttentionList(world.appliances, world.filters, [], [], asOf);
});

Then('the first attention title should be {string}', function (title: string) {
	assert.ok(world.attention[0]);
	assert.equal(world.attention[0].title, title);
});

Then('attention should include {string}', function (title: string) {
	assert.ok(world.attention.some((i) => i.title === title));
});

Given('the demo household seed', function () {
	world.household = structuredClone(seedHousehold);
	world.appliances = world.household.appliances;
});

Then('an appliance named {string} should exist', function (name: string) {
	assert.ok(world.appliances.some((a) => a.name === name));
});

Then('it should be in room {string}', function (room: string) {
	const fridge = world.appliances.find((a) => a.name === 'Kitchen fridge');
	assert.ok(fridge);
	assert.equal(fridge.room, room);
});

Given('a refrigerator purchased on {string}', function (purchasedAt: string) {
	world.appliances = [
		{
			id: 'app-fridge',
			name: 'Kitchen fridge',
			kind: 'refrigerator',
			room: 'kitchen',
			purchasedAt
		}
	];
});

When('useful-life guidance is requested as of {string}', function (asOf: string) {
	assert.ok(world.appliances[0]);
	world.hint = usefulLifeHint(world.appliances[0], asOf);
});

Then('the age in years should be {int}', function (years: number) {
	assert.equal(world.hint?.ageYears, years);
});

Then(
	'the typical lifespan should be {int} to {int} years',
	function (min: number, max: number) {
		assert.equal(world.hint?.typicalMinYears, min);
		assert.equal(world.hint?.typicalMaxYears, max);
	}
);

Then('the recommendation should be {string}', function (recommendation: string) {
	assert.equal(world.hint?.recommendation, recommendation);
});

Given('an appliance brand of {string}', function (brand: string) {
	world.brand = brand;
});

When('manufacturer contacts are looked up', function () {
	world.contact = lookupManufacturerContact(world.brand);
});

Then('a support entry for {string} should be returned', function (brand: string) {
	assert.ok(world.contact?.found);
	if (world.contact?.found) {
		assert.equal(world.contact.contact.brand, brand);
	}
});

Then('no curated contact should be returned', function () {
	assert.equal(world.contact?.found, false);
});

Then('the search hint should include {string}', function (text: string) {
	assert.ok(world.contact && !world.contact.found);
	if (world.contact && !world.contact.found) {
		assert.match(world.contact.searchHint, new RegExp(text));
	}
});

Given('an empty media gallery', function () {
	world.media = [];
});

When('a nameplate photo is attached to {string}', function (applianceId: string) {
	const item = createMediaAttachment({
		applianceId,
		kind: 'nameplate',
		label: 'nameplate.jpg',
		mimeType: 'image/jpeg',
		dataUrl: 'data:image/jpeg;base64,xx',
		capturedAt: '2026-08-01'
	});
	world.media.push(item);
	world.lastMediaId = item.id;
});

Given('a receipt attachment on {string}', function (applianceId: string) {
	const item = createMediaAttachment({
		applianceId,
		kind: 'receipt',
		label: 'receipt.pdf',
		mimeType: 'application/pdf',
		dataUrl: 'data:application/pdf;base64,xx',
		capturedAt: '2026-08-01'
	});
	world.media = [item];
	world.lastMediaId = item.id;
});

When('that media item is removed', function () {
	assert.ok(world.lastMediaId);
	world.media = removeMediaItem(world.media, world.lastMediaId);
});

Then(
	'the gallery for {string} should have {int} items',
	function (applianceId: string, count: number) {
		assert.equal(mediaForAppliance(world.media, applianceId).length, count);
	}
);

Then('the first item kind should be {string}', function (kind: string) {
	assert.equal(world.media[0]?.kind, kind);
});

When(
	'an appliance dossier is generated for {string} as of {string}',
	function (applianceId: string, asOf: string) {
		assert.ok(world.household);
		world.dossierHtml = buildApplianceDossierHtml(world.household, applianceId, asOf);
	}
);

When('a household dossier is generated as of {string}', function (asOf: string) {
	assert.ok(world.household);
	world.dossierHtml = buildHouseholdDossierHtml(world.household, asOf);
});

Then('the dossier should include {string}', function (text: string) {
	assert.ok(world.dossierHtml?.includes(text));
});

Then('the dossier should note that data is local-only', function () {
	assert.match(world.dossierHtml ?? '', /local-only/i);
});
