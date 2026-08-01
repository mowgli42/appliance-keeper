<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		nextFilterDueAt,
		daysBetween
	} from '$lib/appliance/attentionRules';
	import { kindLabels, roomLabels } from '$lib/appliance/labels';
	import {
		completeFilterChange,
		getHousehold,
		removeAppliance,
		todayIso
	} from '$lib/store/household.svelte';

	const id = $derived($page.params.id);
	const household = $derived(getHousehold());
	const appliance = $derived(household.appliances.find((a) => a.id === id));
	const filters = $derived(household.filters.filter((f) => f.applianceId === id));
	const warranties = $derived(household.warranties.filter((w) => w.applianceId === id));
	const services = $derived(
		[...household.services.filter((s) => s.applianceId === id)].sort((a, b) =>
			b.performedAt.localeCompare(a.performedAt)
		)
	);
	const asOf = todayIso();

	function onChanged(filterId: string) {
		completeFilterChange(filterId, todayIso());
	}

	function onRemove() {
		if (!appliance) return;
		if (!confirm(`Remove ${appliance.name}? This cannot be undone on this device.`)) return;
		removeAppliance(appliance.id);
		goto('/appliances/');
	}
</script>

{#if !appliance}
	<header class="fade-up">
		<p class="eyebrow">Not found</p>
		<h1 class="brand">Appliance missing</h1>
		<a class="btn btn-ghost" href="/appliances/">Back to list</a>
	</header>
{:else}
	<header class="fade-up">
		<p class="eyebrow">{roomLabels[appliance.room]} · {kindLabels[appliance.kind]}</p>
		<h1 class="brand">{appliance.name}</h1>
		{#if appliance.brand || appliance.model}
			<p class="lede">
				{[appliance.brand, appliance.model].filter(Boolean).join(' · ')}
			</p>
		{/if}
	</header>

	<section class="section fade-up" aria-labelledby="filters-heading">
		<h2 id="filters-heading">Filters</h2>
		{#if filters.length === 0}
			<p class="muted">No filter schedules yet.</p>
		{:else}
			<div class="stack">
				{#each filters as filter (filter.id)}
					{@const due = nextFilterDueAt(filter)}
					{@const days = daysBetween(asOf, due)}
					<div class="panel item">
						<div>
							<strong>{filter.label}</strong>
							<p class={days < 0 ? 'urgency-overdue' : days <= 14 ? 'urgency-soon' : 'muted'}>
								{#if days < 0}
									Overdue · was due {due}
								{:else if days === 0}
									Due today
								{:else}
									Due {due} · in {days} days
								{/if}
							</p>
							{#if filter.partHint}
								<p class="muted">Buy: {filter.partHint}</p>
							{/if}
						</div>
						<button class="btn btn-primary" type="button" onclick={() => onChanged(filter.id)}>
							Mark changed
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<section class="section fade-up" aria-labelledby="warranty-heading">
		<h2 id="warranty-heading">Warranties</h2>
		{#if warranties.length === 0}
			<p class="muted">No warranties on file.</p>
		{:else}
			<div class="stack">
				{#each warranties as warranty (warranty.id)}
					{@const days = daysBetween(asOf, warranty.endsAt)}
					<div class="panel item">
						<div>
							<strong>{warranty.label}</strong>
							<p class={days < 0 ? 'urgency-overdue' : days <= 60 ? 'urgency-soon' : 'muted'}>
								{days < 0 ? 'Ended' : 'Ends'} {warranty.endsAt}
								{#if warranty.provider}
									· {warranty.provider}
								{/if}
							</p>
							{#if warranty.documentNote}
								<p class="muted">{warranty.documentNote}</p>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<section class="section fade-up" aria-labelledby="service-heading">
		<h2 id="service-heading">Service history</h2>
		{#if services.length === 0}
			<p class="muted">No service records yet.</p>
		{:else}
			<div class="stack">
				{#each services as service (service.id)}
					<div class="panel item">
						<div>
							<strong>{service.title}</strong>
							<p class="muted">
								Done {service.performedAt}
								{#if service.technician}
									· {service.technician}
								{/if}
							</p>
							{#if service.nextDueAt}
								<p class="urgency-soon">Next due {service.nextDueAt}</p>
							{/if}
							{#if service.notes}
								<p class="muted">{service.notes}</p>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<section class="section fade-up">
		<button class="btn btn-ghost danger" type="button" onclick={onRemove}>Remove appliance</button>
	</section>
{/if}

<style>
	header {
		display: grid;
		gap: 0.35rem;
		margin-bottom: 1.5rem;
	}

	.lede,
	.muted {
		margin: 0.2rem 0 0;
		color: var(--ink-muted);
	}

	.section {
		display: grid;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.section h2 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.2rem;
		letter-spacing: -0.02em;
	}

	.stack {
		display: grid;
		gap: 0.7rem;
	}

	.item {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.85rem;
		padding: 1rem 1.1rem;
	}

	.item strong {
		font-family: var(--font-display);
		letter-spacing: -0.02em;
	}

	.danger {
		color: var(--coral);
		border-color: color-mix(in oklab, var(--coral) 35%, var(--line));
	}
</style>
