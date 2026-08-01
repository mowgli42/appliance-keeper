<script lang="ts">
	import { kindLabels, roomLabels } from '$lib/appliance/labels';
	import { getHousehold } from '$lib/store/household.svelte';

	const household = $derived(getHousehold());
	const appliances = $derived(
		[...household.appliances].sort((a, b) => a.name.localeCompare(b.name))
	);
</script>

<header class="fade-up">
	<p class="eyebrow">Your household</p>
	<h1 class="brand">Appliances</h1>
	<p class="lede">Tap one to see filters, warranties, and service notes.</p>
</header>

<div class="list stagger">
	{#each appliances as appliance (appliance.id)}
		<a class="row panel" href={`/appliances/${appliance.id}/`}>
			<div>
				<strong>{appliance.name}</strong>
				<p>{kindLabels[appliance.kind]} · {roomLabels[appliance.room]}</p>
			</div>
			<span class="chev" aria-hidden="true">›</span>
		</a>
	{/each}
</div>

{#if appliances.length === 0}
	<div class="panel empty fade-up">
		<p>No appliances yet.</p>
		<a class="btn btn-primary" href="/add/">Add an appliance</a>
	</div>
{/if}

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

	.list {
		display: grid;
		gap: 0.7rem;
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.1rem;
	}

	.row strong {
		font-family: var(--font-display);
		font-size: 1.15rem;
		letter-spacing: -0.02em;
	}

	.row p {
		margin: 0.15rem 0 0;
		color: var(--ink-muted);
	}

	.chev {
		font-size: 1.5rem;
		color: var(--ink-muted);
	}

	.empty {
		display: grid;
		gap: 0.85rem;
		justify-items: start;
		padding: 1.25rem;
		margin-top: 0.75rem;
	}

	.empty p {
		margin: 0;
	}
</style>
