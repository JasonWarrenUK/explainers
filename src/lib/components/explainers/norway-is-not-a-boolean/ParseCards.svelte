<script lang="ts">
	import type { ParseCard } from './types';

	let { cards }: { cards: ParseCard[] } = $props();

	let open = $state<Record<string, boolean>>({});
</script>

<div class="cards" class:single={cards.length === 1}>
	{#each cards as card (card.inp)}
		<button
			class="card"
			type="button"
			aria-expanded={open[card.inp] ?? false}
			onclick={() => (open[card.inp] = !open[card.inp])}
		>
			<span class="fmt">{card.fmt}</span>
			<span class="in">{card.inp}</span>
			{#if open[card.inp]}
				<span class="out">
					<span class="res">&rarr; {card.out}</span>
					<span class="why">{card.why}</span>
				</span>
			{:else}
				<span class="cue">tap for the result</span>
			{/if}
		</button>
	{/each}
</div>

<style>
	.cards {
		display: grid;
		gap: 9px;
	}
	@media (min-width: 640px) {
		.cards:not(.single) {
			grid-template-columns: 1fr 1fr;
		}
	}
	.card {
		width: 100%;
		text-align: left;
		background: var(--panel);
		border: 1px solid var(--edge);
		border-radius: 4px;
		padding: 14px 15px;
		cursor: pointer;
		color: inherit;
		font-family: var(--mono);
		display: block;
		transition: background 0.12s;
	}
	.card:hover {
		background: var(--code);
	}
	.card span {
		display: block;
	}
	.fmt {
		font-size: 11.5px;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: var(--muted);
		margin-bottom: 8px;
	}
	.in {
		font-size: 13.5px;
		color: var(--ink);
		word-break: break-word;
	}
	.out {
		margin-top: 11px;
		padding-top: 10px;
		border-top: 1px solid var(--rule);
	}
	.res {
		font-size: 13.5px;
		color: var(--red);
		font-weight: 500;
		margin-bottom: 7px;
		word-break: break-word;
	}
	.why {
		font-size: 13px;
		line-height: 1.65;
		color: var(--muted);
		white-space: normal;
	}
	.cue {
		font-size: 11.5px;
		letter-spacing: 0.11em;
		text-transform: uppercase;
		color: var(--faint);
		margin-top: 9px;
	}
	@media (prefers-reduced-motion: reduce) {
		.card {
			transition: none;
		}
	}
</style>
