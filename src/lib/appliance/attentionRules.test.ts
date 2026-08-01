import { describe, expect, it } from 'vitest';
import {
	addDays,
	buildAttentionList,
	daysBetween,
	filterAttention,
	markFilterChanged,
	nextFilterDueAt,
	sortAttention
} from './attentionRules';
import type { Appliance, AttentionItem, FilterSchedule } from '$lib/types/appliance';

const fridge: Appliance = {
	id: 'app-fridge',
	name: 'Kitchen fridge',
	kind: 'refrigerator',
	room: 'kitchen'
};

describe('attentionRules', () => {
	it('computes next filter due date from last change + interval', () => {
		const filter: FilterSchedule = {
			id: 'f1',
			applianceId: 'app-fridge',
			label: 'Water filter',
			intervalDays: 180,
			lastChangedAt: '2026-01-01'
		};
		expect(nextFilterDueAt(filter)).toBe('2026-06-30');
	});

	it('marks overdue filters when past due', () => {
		const filter: FilterSchedule = {
			id: 'f1',
			applianceId: 'app-fridge',
			label: 'Water filter',
			intervalDays: 30,
			lastChangedAt: '2026-01-01'
		};
		const items = filterAttention([filter], [fridge], '2026-03-01');
		expect(items).toHaveLength(1);
		expect(items[0].kind).toBe('filter-overdue');
		expect(items[0].urgency).toBe('overdue');
		expect(items[0].daysUntil).toBeLessThan(0);
	});

	it('sorts overdue before soon', () => {
		const items: AttentionItem[] = [
			{
				id: 'a',
				kind: 'filter-due',
				urgency: 'soon',
				applianceId: 'x',
				applianceName: 'A',
				title: 'Soon',
				detail: '',
				dueAt: '2026-08-10',
				daysUntil: 5
			},
			{
				id: 'b',
				kind: 'filter-overdue',
				urgency: 'overdue',
				applianceId: 'x',
				applianceName: 'A',
				title: 'Late',
				detail: '',
				dueAt: '2026-07-01',
				daysUntil: -10
			}
		];
		expect(sortAttention(items).map((i) => i.id)).toEqual(['b', 'a']);
	});

	it('resets filter schedule when marked changed', () => {
		const filter: FilterSchedule = {
			id: 'f1',
			applianceId: 'app-fridge',
			label: 'Water filter',
			intervalDays: 90,
			lastChangedAt: '2026-01-01'
		};
		const updated = markFilterChanged(filter, '2026-08-01');
		expect(updated.lastChangedAt).toBe('2026-08-01');
		expect(nextFilterDueAt(updated)).toBe(addDays('2026-08-01', 90));
	});

	it('builds combined attention list for seed-like data', () => {
		const filters: FilterSchedule[] = [
			{
				id: 'f1',
				applianceId: 'app-fridge',
				label: 'Water filter',
				intervalDays: 14,
				lastChangedAt: '2026-07-25'
			}
		];
		const list = buildAttentionList([fridge], filters, [], [], '2026-08-01');
		expect(list.length).toBeGreaterThan(0);
		expect(daysBetween('2026-08-01', list[0].dueAt)).toBe(list[0].daysUntil);
	});
});
