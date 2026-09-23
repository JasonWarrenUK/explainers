<script lang="ts">
	import CodeSpecimen from '../formats/CodeSpecimen.svelte';
	import type { Tokeniser } from '../formats/tokenise';
	import type { Specimen } from './types';

	let { specimen, tokenise }: { specimen: Specimen; tokenise: Tokeniser } = $props();

	let showTechnical = $state(false);

	const encoder = new TextEncoder();
	const technicalCount = $derived(
		specimen.lines.reduce((count, [, ...notes]) => count + notes.filter((n) => n.technical).length, 0)
	);
	// computed from the rendered text rather than asserted
	const byteCount = $derived(encoder.encode(specimen.lines.map(([text]) => text).join('\n')).length);
</script>

<figure class="specimen">
	<figcaption>{specimen.label}</figcaption>
	{#if specimen.spec}
		<div class="readout">
			<span>lines <b>{specimen.lines.length}</b></span>
			<span>bytes <b>{byteCount}</b></span>
			<span>remarks <b>{specimen.comments ? 'yes' : 'no'}</b></span>
			<span>standard <b>{specimen.spec}</b></span>
		</div>
	{/if}
	<CodeSpecimen lines={specimen.lines} family={specimen.family} {tokenise} {showTechnical} />
	{#if technicalCount > 0}
		<button class="toggle" aria-pressed={showTechnical} onclick={() => (showTechnical = !showTechnical)}>
			{showTechnical ? 'Hide' : 'Show'} the technical notes ({technicalCount})
		</button>
	{/if}
</figure>

<style>
	.specimen {
		margin: 22px 0 0;
	}
	figcaption {
		font-family: var(--mono);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: var(--muted);
		margin: 0 0 8px;
	}
	.readout {
		display: flex;
		flex-wrap: wrap;
		gap: 0 22px;
		font-family: var(--mono);
		font-size: 12px;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: var(--muted);
		border-top: 1px solid var(--rule);
		padding: 8px 0;
		line-height: 1.9;
	}
	.readout b {
		color: var(--ink);
		font-weight: 600;
	}
	.toggle {
		font-family: var(--mono);
		font-size: 12px;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		background: none;
		border: 0;
		border-bottom: 1px solid var(--edge);
		color: var(--muted);
		cursor: pointer;
		padding: 5px 0;
		margin-top: 10px;
	}
	.toggle:hover {
		color: var(--ink);
	}
</style>
