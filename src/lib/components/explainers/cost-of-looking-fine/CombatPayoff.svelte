<script lang="ts">
	import Kicker from './Kicker.svelte';
	import Control from './Control.svelte';
	import Slider from './Slider.svelte';
	import { C } from './palette';
	import { ROUND_RULES } from './combat-data';

	let lvl = $state(1);
	let pick = $state<'A' | 'B' | null>(null);

	const R = $derived(ROUND_RULES[lvl]!);
	const right = $derived(pick !== null && pick === R.best);

	function cardStyle(k: 'A' | 'B') {
		const isPicked = pick === k;
		return `flex: 1; padding: 10px 12px; cursor: pointer; text-align: left; font: inherit; border: 1.5px solid ${C.ink}; background: ${
			isPicked ? (right ? C.reasonSoft : C.dragSoft) : C.panel
		}; box-shadow: ${isPicked ? 'none' : `3px 3px 0 ${C.ink}`}; transform: ${isPicked ? 'translate(3px,3px)' : 'none'};`;
	}

</script>

<div class="wrap">
	<div class="tag">
		<Kicker colour={C.ink}>The same load, off the test</Kicker>
	</div>
	<div class="intro">
		One turn of a tactical card game. You hold two cards. You want the enemy dead and yourself
		alive, in that order of preference. Which card do you play?
	</div>
	<Control label="Rules in play this round: {lvl}">
		<Slider min={1} max={6} step={1} bind:value={lvl} onchange={() => (pick = null)} colour={C.reason} />
	</Control>
	<ol class="rules">
		{#each ROUND_RULES.slice(1, lvl + 1) as r, k (k)}
			<li style="background: {k === lvl - 1 ? C.amberSoft : 'transparent'};">{r!.rule}</li>
		{/each}
	</ol>
	<div class="cards">
		<button onclick={() => (pick = 'A')} style={cardStyle('A')}>
			<div class="card-tag">Card A</div>
			<div class="card-name">Hew</div>
			<div class="card-sub">melee · {lvl >= 5 ? 'move 2, then ' : ''}4 damage{lvl >= 4 ? ' · initiative 60' : ''}</div>
		</button>
		<button onclick={() => (pick = 'B')} style={cardStyle('B')}>
			<div class="card-tag">Card B</div>
			<div class="card-name">Bolt</div>
			<div class="card-sub">ranged · 2 damage{lvl >= 4 ? ' · initiative 20' : ''}</div>
		</button>
	</div>
	{#if pick}
		<div class="readout" style="border-top: 4px solid {right ? C.reason : C.drag};">
			<div class="tag"><Kicker colour={right ? C.reason : C.drag}>Readout</Kicker></div>
			<strong>{right ? 'Right.' : 'Not this round.'}</strong> Hew: {R.A} Bolt: {R.B}
			{#if lvl >= 4 && lvl < 6}
				{lvl} rules in play and the right card has flipped {lvl - 1} times. Keep going.
			{/if}
			{#if lvl === 6}
				Six rules, and the right card flipped every time one was added. Nobody at a real table reads
				the rules off a list; they hold them, and the number they can hold is what decides whether
				the turn is played well. Past four, everybody starts saying &ldquo;hang on&rdquo; and
				counting on their fingers, which is the table&rsquo;s version of writing it down.
			{/if}
		</div>
	{/if}
	<div class="footnote">
		The cards and enemy are invented; the mechanics are the ordinary ones of the tactical card
		games this page&rsquo;s author designs. The rule that changes at each notch is highlighted.
	</div>
</div>

<style>
	.wrap {
		margin-top: 18px;
		padding-top: 14px;
		border-top: 1.5px solid #0b0b0b;
	}
	.tag {
		margin-bottom: 6px;
	}
	.intro {
		font-size: 16px;
		margin-bottom: 4px;
	}
	.rules {
		margin: 6px 0 10px;
		padding-left: 22px;
		font-size: 15px;
		line-height: 1.45;
		list-style: decimal;
	}
	.rules li {
		margin-bottom: 3px;
	}
	.cards {
		display: flex;
		gap: 10px;
	}
	.card-tag {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 12px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #5c5c58;
	}
	.card-name {
		font-family: 'Instrument Serif', 'Times New Roman', serif;
		font-size: 24px;
	}
	.card-sub {
		font-size: 13px;
		color: #5c5c58;
	}
	.readout {
		font-size: 17px;
		line-height: 1.5;
		padding: 12px 14px 14px;
		background: #efeee8;
		margin-top: 12px;
	}
	.footnote {
		font-size: 14px;
		color: #5c5c58;
		margin-top: 8px;
	}
</style>
