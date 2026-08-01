<script lang="ts">
	import { goto } from '$app/navigation';
	import { kindLabels, newId, roomLabels } from '$lib/appliance/labels';
	import { upsertAppliance } from '$lib/store/household.svelte';
	import type { ApplianceKind, Room } from '$lib/types/appliance';

	const kinds = Object.keys(kindLabels) as ApplianceKind[];
	const rooms = Object.keys(roomLabels) as Room[];

	let name = $state('');
	let kind = $state<ApplianceKind>('other');
	let room = $state<Room>('other');
	let brand = $state('');
	let model = $state('');
	let error = $state('');

	function onSubmit(event: Event) {
		event.preventDefault();
		const trimmed = name.trim();
		if (!trimmed) {
			error = 'Give it a name the family will recognize — like “Kitchen fridge”.';
			return;
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
		goto(`/appliances/${id}/`);
	}
</script>

<header class="fade-up">
	<p class="eyebrow">Keep it plain-language</p>
	<h1 class="brand">Add appliance</h1>
	<p class="lede">Use the name people say out loud at home.</p>
</header>

<form class="panel form fade-up" onsubmit={onSubmit}>
	<label>
		<span>Name</span>
		<input bind:value={name} name="name" autocomplete="off" placeholder="Kitchen fridge" required />
	</label>

	<label>
		<span>Type</span>
		<select bind:value={kind} name="kind">
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

	.error {
		margin: 0;
		color: var(--coral);
	}
</style>
