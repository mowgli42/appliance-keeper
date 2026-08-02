<script lang="ts">
	import { createMediaAttachment, readFileAsDataUrl } from '$lib/appliance/mediaRules';
	import { addMedia, deleteMedia, todayIso } from '$lib/store/household.svelte';
	import type { MediaAttachment, MediaKind } from '$lib/types/appliance';

	let {
		applianceId,
		items
	}: {
		applianceId: string;
		items: MediaAttachment[];
	} = $props();

	let kind = $state<MediaKind>('nameplate');
	let busy = $state(false);
	let error = $state('');
	let inputEl: HTMLInputElement | undefined = $state();

	const kinds: { value: MediaKind; label: string }[] = [
		{ value: 'nameplate', label: 'Nameplate' },
		{ value: 'receipt', label: 'Receipt' },
		{ value: 'manual', label: 'Manual / PDF' },
		{ value: 'other', label: 'Other' }
	];

	async function onPick(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		busy = true;
		error = '';
		try {
			const dataUrl = await readFileAsDataUrl(file);
			addMedia(
				createMediaAttachment({
					applianceId,
					kind,
					label: file.name,
					mimeType: file.type || 'application/octet-stream',
					dataUrl,
					capturedAt: todayIso()
				})
			);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Could not add that file';
		} finally {
			busy = false;
			input.value = '';
		}
	}
</script>

<section class="section" aria-labelledby="media-heading">
	<h2 id="media-heading">Photos & documents</h2>
	<p class="muted">Stay on this device — nameplate, receipt, or manual.</p>

	<div class="add-row panel">
		<label>
			<span>Type</span>
			<select bind:value={kind}>
				{#each kinds as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</label>
		<button
			class="btn btn-primary"
			type="button"
			disabled={busy}
			onclick={() => inputEl?.click()}
		>
			{busy ? 'Adding…' : 'Add photo or PDF'}
		</button>
		<input
			bind:this={inputEl}
			class="sr-only"
			type="file"
			accept="image/*,application/pdf"
			onchange={onPick}
		/>
	</div>

	{#if error}
		<p class="error" role="alert">{error}</p>
	{/if}

	{#if items.length === 0}
		<p class="muted">No attachments yet.</p>
	{:else}
		<div class="gallery">
			{#each items as item (item.id)}
				<figure class="panel tile">
					{#if item.mimeType.startsWith('image/')}
						<img src={item.dataUrl} alt={item.label} />
					{:else}
						<a class="doc" href={item.dataUrl} download={item.label}>PDF / file</a>
					{/if}
					<figcaption>
						<span>{item.kind} · {item.label}</span>
						<button class="btn btn-ghost" type="button" onclick={() => deleteMedia(item.id)}>
							Remove
						</button>
					</figcaption>
				</figure>
			{/each}
		</div>
	{/if}
</section>

<style>
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

	.muted {
		margin: 0;
		color: var(--ink-muted);
	}

	.add-row {
		display: flex;
		flex-wrap: wrap;
		align-items: end;
		gap: 0.75rem;
		padding: 1rem;
	}

	label {
		display: grid;
		gap: 0.3rem;
		flex: 1 1 10rem;
	}

	label span {
		color: var(--ink-muted);
		font-size: 0.9rem;
	}

	select {
		min-height: 2.75rem;
		padding: 0.45rem 0.7rem;
		border: 1px solid var(--line);
		border-radius: 0.85rem;
		background: white;
	}

	.gallery {
		display: grid;
		gap: 0.75rem;
		grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
	}

	.tile {
		margin: 0;
		overflow: hidden;
		padding: 0.5rem;
	}

	.tile img {
		display: block;
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		border-radius: 0.75rem;
	}

	.doc {
		display: grid;
		place-items: center;
		aspect-ratio: 4 / 3;
		border-radius: 0.75rem;
		background: var(--paper-deep);
		font-weight: 700;
	}

	figcaption {
		display: grid;
		gap: 0.35rem;
		margin-top: 0.45rem;
		font-size: 0.85rem;
	}

	.error {
		margin: 0;
		color: var(--coral);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}
</style>
