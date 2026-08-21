<script lang="ts">
	import { goto } from '$app/navigation';
	import { suggestedFilterForKind, frequencyPresets, validateFilterDraft, type FilterDraft } from '$lib/appliance/filterSetup';
	import { kindLabels, newId, roomLabels } from '$lib/appliance/labels';
	import { todayIso, upsertAppliance, upsertFilter } from '$lib/store/household.svelte';
	import type { ApplianceKind, Room } from '$lib/types/appliance';

	const kinds = Object.keys(kindLabels) as ApplianceKind[];
	const rooms = Object.keys(roomLabels) as Room[];

	let name = $state('');
	let kind = $state<ApplianceKind>('refrigerator');
	let room = $state<Room>('kitchen');
	let brand = $state('');
	let model = $state('');
	let trackFilter = $state(true);
	let filters = $state<FilterDraft[]>([draftFromKind('refrigerator')]);
	let error = $state('');

	function draftFromKind(k: ApplianceKind): FilterDraft {
		return { key: newId('draft'), ...suggestedFilterForKind(k, todayIso()) };
	}

	function onKindChange() {
		if (!trackFilter) return;
		// Refresh suggestions only when the single default row is still the suggestion shape
		if (filters.length === 1) {
			filters = [draftFromKind(kind)];
		}
	}

	function addFilterRow() {
		filters = [...filters, draftFromKind(kind)];
	}

	function removeFilterRow(key: string) {
		filters = filters.filter((f) => f.key !== key);
		if (filters.length === 0) trackFilter = false;
	}

	function onTrackToggle() {
		if (trackFilter && filters.length === 0) {
			filters = [draftFromKind(kind)];
		}
	}

	function onSubmit(event: Event) {
		event.preventDefault();
		error = '';
		const trimmed = name.trim();
		if (!trimmed) {
			error = 'Give it a name the family will recognize — like “Kitchen fridge”.';
			return;
		}

		const activeFilters = trackFilter ? filters : [];
		for (const draft of activeFilters) {
			const filterError = validateFilterDraft(draft);
			if (filterError) {
				error = filterError;
				return;
			}
		}

		const id = newId('app');
		upsertAppliance({
			id,
			name: trimmed,
			kind,
			room,
			brand: brand.trim() || undefined,
			model: model.trim() || undefined
		});

		for (const draft of activeFilters) {
			upsertFilter({
				id: newId('flt'),
				applianceId: id,
				label: draft.label.trim(),
				intervalDays: Number(draft.intervalDays),
				lastChangedAt: draft.lastChangedAt.slice(0, 10),
				partHint: draft.partHint.trim() || undefined
			});
		}

		goto(`/appliances/${id}/`);
	}
</script>

<header class="fade-up">
	<p class="eyebrow">Keep it plain-language</p>
	<h1 class="brand">Add appliance</h1>
	<p class="lede">Name it, then tell us about any filter and how often to change it.</p>
</header>

<form class="panel form fade-up" onsubmit={onSubmit}>
	<label>
		<span>Name</span>
		<input bind:value={name} name="name" autocomplete="off" placeholder="Kitchen fridge" required />
	</label>

	<label>
		<span>Type</span>
		<select bind:value={kind} name="kind" onchange={onKindChange}>
			{#each kinds as k}
				<option value={k}>{kindLabels[k]}</option>
			{/each}
		</select>
	</label>

	<label>
		<span>Room</span>
		<select bind:value={room} name="room">
			{#each rooms as r}
				<option value={r}>{roomLabels[r]}</option>
			{/each}
		</select>
	</label>

	<label>
		<span>Brand (optional)</span>
		<input bind:value={brand} name="brand" autocomplete="organization" />
	</label>

	<label>
		<span>Model (optional)</span>
		<input bind:value={model} name="model" autocomplete="off" />
	</label>

	<fieldset class="filter-block">
		<legend>Filter care</legend>
		<label class="check">
			<input
				type="checkbox"
				bind:checked={trackFilter}
				onchange={onTrackToggle}
			/>
			<span>This appliance has a filter (or similar care item)</span>
		</label>

		{#if trackFilter}
			{#each filters as draft, index (draft.key)}
				<div class="filter-card">
					<p class="filter-title">Filter {index + 1}</p>
					<label>
						<span>What to change</span>
						<input
							bind:value={draft.label}
							placeholder="Water filter"
							required={trackFilter}
						/>
					</label>
					<label>
						<span>How often</span>
						<select bind:value={draft.intervalDays}>
							{#each frequencyPresets as preset}
								<option value={preset.days}>{preset.label}</option>
							{/each}
						</select>
					</label>
					<label>
						<span>Last changed</span>
						<input type="date" bind:value={draft.lastChangedAt} required={trackFilter} />
					</label>
					<label>
						<span>Part / size (optional)</span>
						<input bind:value={draft.partHint} placeholder="e.g. 16x25x1 or EDR2RXD1" />
					</label>
					{#if filters.length > 1}
						<button class="btn btn-ghost" type="button" onclick={() => removeFilterRow(draft.key)}>
							Remove this filter
						</button>
					{/if}
				</div>
			{/each}
			<button class="btn btn-ghost" type="button" onclick={addFilterRow}>Add another filter</button>
		{/if}
	</fieldset>

	{#if error}
		<p class="error" role="alert">{error}</p>
	{/if}

	<button class="btn btn-primary" type="submit">Save appliance</button>
</form>

<style>
	header {
		display: grid;
		gap: 0.35rem;
		margin-bottom: 1.25rem;
	}

	.lede {
		margin: 0;
		color: var(--ink-muted);
	}

	.form {
		display: grid;
		gap: 0.9rem;
		padding: 1.15rem;
	}

	label {
		display: grid;
		gap: 0.35rem;
	}

	label span {
		color: var(--ink-muted);
		font-size: 0.95rem;
	}

	input,
	select {
		min-height: 2.75rem;
		padding: 0.55rem 0.75rem;
		border: 1px solid var(--line);
		border-radius: 0.85rem;
		background: white;
		color: var(--ink);
	}

	.check {
		display: flex;
		align-items: flex-start;
		gap: 0.65rem;
		grid-template-columns: none;
	}

	.check input {
		min-height: auto;
		margin-top: 0.2rem;
		width: 1.15rem;
		height: 1.15rem;
	}

	.check span {
		color: var(--ink);
		font-size: 1rem;
	}

	.filter-block {
		margin: 0;
		padding: 0.85rem 0 0;
		border: none;
		border-top: 1px solid var(--line);
		display: grid;
		gap: 0.85rem;
	}

	legend {
		padding: 0;
		font-family: var(--font-display);
		font-size: 1.1rem;
		letter-spacing: -0.02em;
	}

	.filter-card {
		display: grid;
		gap: 0.75rem;
		padding: 0.85rem;
		border: 1px solid var(--line);
		border-radius: 1rem;
		background: color-mix(in oklab, white 70%, transparent);
	}

	.filter-title {
		margin: 0;
		font-weight: 700;
	}

	.error {
		margin: 0;
		color: var(--coral);
	}
</style>
