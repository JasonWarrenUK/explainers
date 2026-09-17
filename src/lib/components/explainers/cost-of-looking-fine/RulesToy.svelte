<script lang="ts">
	import Toy from './Toy.svelte';
	import Button from './Button.svelte';
	import Readout from './Readout.svelte';
	import { C } from './palette';
	import { RULEBOOK, RULE_QUESTIONS } from './rules-data';

	let qi = $state(0);
	let pick = $state<string | null>(null);

	const Q = $derived(RULE_QUESTIONS[qi]);
	const right = $derived(pick !== null && pick === Q.answer);

	function chooseQuestion(k: number) {
		qi = k;
		pick = null;
	}
</script>

<Toy colour={C.reason} label="Toy 3 of 11: The Rulebook">
	<div style="font-size: 15px; color: {C.mute}; margin-bottom: 8px;">
		Eight rules from an invented card game. Six questions, two from each rung of the reading
		ladder, the second harder than the first. Answer, then see which rules did the work.
	</div>
	<ol class="rulebook">
		{#each RULEBOOK as t, i (i)}
			{@const hot = pick !== null && Q.hi.includes(i + 1)}
			<li style="background: {hot ? C.amberSoft : 'transparent'};">{t}</li>
		{/each}
	</ol>
	<div class="question-picker">
		{#each RULE_QUESTIONS as x, k (k)}
			<Button active={qi === k} onclick={() => chooseQuestion(k)} colour={C.reason}>
				{x.kicker}: {x.sub}
			</Button>
		{/each}
	</div>
	<div class="question">{Q.q}</div>
	<div class="options">
		{#each Q.options as o (o)}
			<button
				onclick={() => (pick = o)}
				class="opt-btn"
				style="background: {pick === o ? (o === Q.answer ? C.reasonSoft : C.dragSoft) : C.panel};"
			>
				{o}
			</button>
		{/each}
	</div>
	{#if pick !== null}
		<Readout colour={right ? C.reason : C.drag}>
			<strong>{right ? 'Yes.' : `No: ${Q.answer}.`} {Q.band}.</strong>
			{Q.why}
		</Readout>
	{/if}
	<div class="footnote">
		The rungs come from the adult literacy surveys, which grade reading by whether a person can
		locate a stated fact, combine several conditional pieces from one text, or infer what the text
		does as a whole; the IQ figures attached are approximate. The third rung is the one that
		settles arguments at the table, and it is the one most adults do not reach.
	</div>
</Toy>

<style>
	.rulebook {
		margin: 0 0 12px;
		padding-left: 24px;
		font-size: 14px;
		line-height: 1.45;
		list-style: decimal;
	}
	.rulebook li {
		padding: 2px 4px;
		margin-bottom: 2px;
	}
	.question-picker {
		margin-bottom: 6px;
	}
	.question {
		font-size: 17px;
		font-weight: 600;
		margin: 8px 0;
	}
	.options {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.opt-btn {
		font: inherit;
		font-size: 15px;
		text-align: left;
		padding: 8px 10px;
		border: 1.5px solid #0b0b0b;
		cursor: pointer;
	}
	.footnote {
		font-size: 14px;
		color: #5c5c58;
		margin-top: 10px;
	}
</style>
