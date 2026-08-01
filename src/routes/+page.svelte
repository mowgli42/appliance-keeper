<script lang="ts">
	import AttentionRow from '$lib/components/AttentionRow.svelte';
	import { buildAttentionList } from '$lib/appliance/attentionRules';
	import { getHousehold, resetHousehold, todayIso } from '$lib/store/household.svelte';

	const household = $derived(getHousehold());
	const attention = $derived(
		buildAttentionList(
			household.appliances,
			household.filters,
			household.warranties,
			household.services,
			todayIso()
		)
	);
</script>

<header class="hero fade-up">
	<p class="eyebrow">Household care, kept simple</p>
	<h1 class="brand">Appliance Keeper</h1>
	<p class="lede">
		See what needs a filter, warranty check, or service — without digging through manuals.
	</p>
</header>

<section class="section" aria-labelledby="attention-heading">
	<div class="section-head">
		<h2 id="attention-heading">Needs attention</h2>
		{#if attention.length === 0}
			<span class="all-clear">You're caught up</span>
		{:else}
			<span class="count">{attention.length}</span>
		{/if}
	</div>

	{#if attention.length === 0}
		<div class="panel empty fade-up">
			<p>Nothing due right now. Enjoy the quiet.</p>
			<a class="btn btn-ghost" href="/appliances/">Browse appliances</a>
		</div>
	{:else}
		<div class="list stagger">
			{#each attention as item (item.id)}
				<AttentionRow {item} />
			{/each}
		</div>
	{/if}
</section>

<section class="section tips fade-up">
	<p class="eyebrow">Demo data stays on this device</p>
	<button class="btn btn-ghost" type="button" onclick={() => resetHousehold()}>
		Reset demo household
	</button>
</section>

<style>
	.hero {
		display: grid;
		gap: 0.45rem;
		margin-bottom: 1.75rem;
		padding-top: 0.5rem;
	}

	.lede {
		margin: 0;
		max-width: 36ch;
		color: var(--ink-muted);
		font-size: 1.05rem;
	}

	.section {
		display: grid;
		gap: 0.85rem;
		margin-bottom: 1.75rem;
	}

	.section-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.section-head h2 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.25rem;
		letter-spacing: -0.02em;
	}

	.count,
	.all-clear {
		color: var(--ink-muted);
		font-size: 0.95rem;
	}

	.list {
		display: grid;
		gap: 0.75rem;
	}

	.empty {
		display: grid;
		gap: 0.85rem;
		justify-items: start;
		padding: 1.25rem;
	}

	.empty p {
		margin: 0;
	}

	.tips {
		justify-items: start;
	}
</style>
