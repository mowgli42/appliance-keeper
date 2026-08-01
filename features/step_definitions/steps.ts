import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import {
	addDays,
	buildAttentionList,
	markFilterChanged,
	nextFilterDueAt
} from '../../src/lib/appliance/attentionRules.ts';
import { seedHousehold } from '../../src/lib/data/seed.ts';
import type {
	Appliance,
	AttentionItem,
	FilterSchedule
} from '../../src/lib/types/appliance.ts';

type World = {
	filter?: FilterSchedule;
	dueAt?: string;
	updated?: FilterSchedule;
	appliances: Appliance[];
	filters: FilterSchedule[];
	attention: AttentionItem[];
};

const world: World = {
	appliances: [],
	filters: [],
	attention: []
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
	world.appliances = structuredClone(seedHousehold.appliances);
});

Then('an appliance named {string} should exist', function (name: string) {
	assert.ok(world.appliances.some((a) => a.name === name));
});

Then('it should be in room {string}', function (room: string) {
	const fridge = world.appliances.find((a) => a.name === 'Kitchen fridge');
	assert.ok(fridge);
	assert.equal(fridge.room, room);
});
