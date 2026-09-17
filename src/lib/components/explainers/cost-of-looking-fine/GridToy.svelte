<script lang="ts">
	import Toy from './Toy.svelte';
	import Control from './Control.svelte';
	import Slider from './Slider.svelte';
	import Readout from './Readout.svelte';
	import Cell from './Cell.svelte';
	import CombatPayoff from './CombatPayoff.svelte';
	import { C } from './palette';
	import { cellSpec, optionsFor, MISSING_BY_LEVEL } from './grid-data';

	let level = $state(1);
	let picked = $state<number | null>(null);

	const opts = $derived(optionsFor(level));
	const MISSING = $derived(MISSING_BY_LEVEL[level]!);
	const correct = $derived(
		picked !== null && JSON.stringify(opts.opts[picked]) === JSON.stringify(opts.ans)
	);

	function pick(i: number) {
		picked = i;
	}
</script>

<Toy colour={C.reason} label="Toy 2 of 11: How Many at Once">
	<Control label="How many rules change at once: {level}">
		<Slider min={1} max={4} step={1} bind:value={level} onchange={() => (picked = null)} colour={C.reason} />
	</Control>
	<div class="grid">
		{#each [0, 1, 2] as r (r)}
			{#each [0, 1, 2] as c (c)}
				{#if r === MISSING.r && c === MISSING.c}
					<div class="missing">?</div>
				{:else}
					<Cell spec={cellSpec(r, c, level)} />
				{/if}
			{/each}
		{/each}
	</div>
	<div class="prompt">Which goes in the dashed cell?</div>
	<div class="options">
		{#each opts.opts as o, i (i)}
			<button
				onclick={() => pick(i)}
				class="opt-btn"
				style="border: {picked === i ? `3px solid ${correct ? C.reason : C.drag}` : '3px solid transparent'};"
			>
				<Cell spec={o} size={56} />
			</button>
		{/each}
	</div>
	{#if picked !== null}
		<Readout colour={correct ? C.reason : C.drag}>
			{#if correct}
				<strong>Yes. Things you had to hold at once: {level}.</strong>
				{#if level === 1}
					One rule: the shape follows the row. Items of this shape separate people from about 100
					downwards.
				{/if}
				{#if level === 2}
					Two rules: shape by row, count by column. Holding both is where items start to separate
					people around 120.
				{/if}
				{#if level === 3}
					Three rules, and the third (filled or hollow) depends on where the cell sits in both the row
					and the column. This is the load where most adults start dropping a rule; items like it
					separate people around 140.
				{/if}
				{#if level === 4}
					Four rules, and the fourth (colour) depends on two of the others: red only when there are
					several shapes and they are hollow. Holding four interacting rules at once is the soft
					ceiling for adults; the real tests run out of headroom about here.
				{/if}
			{:else}
				Not that one. Read across the missing cell&rsquo;s row for what stays the same, then down its
				column for what changes.
				{#if level >= 3}
					Then check the fill pattern against its neighbours.
				{/if}
				{#if level >= 4}
					Then ask when the shapes turn red.
				{/if}
			{/if}
		</Readout>
	{/if}
	<div class="footnote">
		These grids are mine and are not normed. The band each level &ldquo;starts separating
		people&rdquo; at follows the published analysis of how matrix items get harder (the number of
		rules and sub-goals to track), not a measurement of these particular puzzles.
	</div>
	<CombatPayoff />
</Toy>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(3, 64px);
		gap: 6px;
		justify-content: center;
		margin: 12px 0;
	}
	.missing {
		width: 64px;
		height: 64px;
		border: 2px dashed #df3a1b;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #df3a1b;
		font-size: 22px;
	}
	.prompt {
		font-size: 15px;
		color: #5c5c58;
		margin-bottom: 6px;
	}
	.options {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}
	.opt-btn {
		background: none;
		padding: 0;
		cursor: pointer;
	}
	.footnote {
		font-size: 14px;
		color: #5c5c58;
		margin-top: 10px;
	}
</style>
