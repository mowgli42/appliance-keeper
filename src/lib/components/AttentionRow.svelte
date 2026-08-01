<script lang="ts">
	import { attentionKindLabels } from '$lib/appliance/labels';
	import type { AttentionItem } from '$lib/types/appliance';

	let { item }: { item: AttentionItem } = $props();
</script>

<a
	class="attention-row panel"
	href={`/appliances/${item.applianceId}`}
	data-urgency={item.urgency}
>
	<div class="meta">
		<span class="kind">{attentionKindLabels[item.kind]}</span>
		<span class={`when urgency-${item.urgency}`}>{item.detail}</span>
	</div>
	<strong class="title">{item.title}</strong>
	<span class="appliance">{item.applianceName}</span>
</a>

<style>
	.attention-row {
		display: grid;
		gap: 0.2rem;
		padding: 1rem 1.1rem;
		transition:
			transform 180ms ease,
			border-color 180ms ease;
	}

	.attention-row:hover {
		transform: translateY(-1px);
		border-color: color-mix(in oklab, var(--moss) 35%, var(--line));
	}

	.meta {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		font-size: 0.9rem;
	}

	.kind {
		color: var(--ink-muted);
	}

	.title {
		font-family: var(--font-display);
		font-size: 1.15rem;
		letter-spacing: -0.02em;
	}

	.appliance {
		color: var(--ink-muted);
		font-size: 0.95rem;
	}
</style>
