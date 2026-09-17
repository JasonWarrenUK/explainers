<script lang="ts">
	import Toy from './Toy.svelte';
	import Button from './Button.svelte';
	import Readout from './Readout.svelte';
	import ScalePic from './ScalePic.svelte';
	import { C } from './palette';

	interface Scale {
		left: string;
		right: string;
		note: string;
	}
	const SCALES: Scale[] = [
		{ left: '1 square', right: '2 circles', note: 'square = 2 circles' },
		{ left: '1 triangle', right: '3 squares', note: 'triangle = 3 squares = 6 circles' },
		{ left: '1 star', right: '1 triangle + 1 square', note: 'star = 6 + 2 = 8 circles' }
	];

	let mode = $state<'paper' | 'head'>('paper');
	let step = $state(0);
	let answer = $state<number | null>(null);
	let results = $state<{ paper: boolean | null; head: boolean | null }>({ paper: null, head: null });

	const inHead = $derived(mode === 'head');
	const showQuestion = $derived(!inHead || step >= 4);

	function choose(v: number) {
		answer = v;
		results = { ...results, [mode]: v === 8 };
	}
	function reset(m: 'paper' | 'head') {
		mode = m;
		step = 0;
		answer = null;
	}
</script>

<Toy colour={C.drag} label="Toy 5 of 11: The Scales">
	<div class="mode-row">
		<Button active={mode === 'paper'} onclick={() => reset('paper')} colour={C.reason}>
			You may write the rates down
		</Button>
		<Button active={mode === 'head'} onclick={() => reset('head')} colour={C.drag}>
			Hold them in your head
		</Button>
	</div>

	{#if !inHead}
		<div>
			{#each SCALES as s (s.left)}
				<ScalePic left={s.left} right={s.right} />
			{/each}
			<div class="rates">
				{#each SCALES as s (s.note)}
					<div>{s.note}</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if inHead && step < 3}
		<div>
			<ScalePic left={SCALES[step].left} right={SCALES[step].right} />
			<Button onclick={() => (step = step + 1)} active colour={C.drag}>
				{step < 2 ? 'Next scale (this one disappears)' : 'Ready for the question'}
			</Button>
		</div>
	{/if}

	{#if inHead && step === 3}
		<div>
			<Readout colour={C.amber}>
				Someone leans over and asks whether you have seen their charger. You say no. They keep
				talking.
			</Readout>
			<Button onclick={() => (step = 4)} active colour={C.drag}>Back to the puzzle</Button>
		</div>
	{/if}

	{#if showQuestion}
		<div class="question-block">
			<div class="question">How many circles balance one star?</div>
			{#each [6, 8, 9, 12] as v (v)}
				<Button
					onclick={() => choose(v)}
					active={answer === v}
					colour={answer === v ? (v === 8 ? C.reason : C.drag) : C.ink}
				>
					{v}
				</Button>
			{/each}
		</div>
	{/if}

	{#if answer !== null}
		<Readout colour={answer === 8 ? C.reason : C.drag}>
			{#if answer === 8}
				<strong>Eight. </strong>
			{:else}
				<strong>Eight, not {answer}. </strong>
			{/if}
			{#if inHead}
				In your head, with an interruption in the middle. Nothing about the structure changed
				between the two modes: three exchange rates, chained. What changed was whether the
				intermediate results had somewhere to live. Seeing how the scales relate is the reasoning
				index. Keeping &ldquo;six&rdquo; alive while a person talks at you is the working-memory
				index. In the profile this page describes they are seventy points apart.
			{:else}
				With the rates on paper, the puzzle is easy: read the last note and add. Now try it the
				other way, and notice that the way you were about to solve it is the part that survives.
			{/if}
		</Readout>
	{/if}

	<div class="footnote">
		Written down: {results.paper === null ? 'not yet' : results.paper ? 'right' : 'wrong'} &middot; In
		your head: {results.head === null ? 'not yet' : results.head ? 'right' : 'wrong'}. Same puzzle for
		everyone; this is a demonstration, not a test of you.
	</div>
</Toy>

<style>
	.mode-row {
		margin-bottom: 6px;
	}
	.rates {
		font-size: 15px;
		color: #5c5c58;
		font-family: monospace;
		background: #efeee8;
		padding: 8px 10px;
	}
	.question-block {
		margin-top: 10px;
	}
	.question {
		font-size: 17px;
		font-weight: 600;
		margin-bottom: 6px;
	}
	.footnote {
		font-size: 14px;
		color: #5c5c58;
		margin-top: 10px;
	}
</style>
