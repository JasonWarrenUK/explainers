<script lang="ts">
	import Toy from './Toy.svelte';
	import Button from './Button.svelte';
	import Readout from './Readout.svelte';
	import Prose from './Prose.svelte';
	import Gauge from './Gauge.svelte';
	import { C } from './palette';
	import { LOOP } from './loop-data';

	let i = $state(0);
	let laps = $state(0);
	let helped = $state(false);

	const step = $derived(LOOP[i]);
	const standard = $derived(Math.min(100, 50 + 12 * laps));
	const dread = $derived(Math.max(0, Math.min(100, 20 * laps - (helped ? 30 : 0))));
	const startChance = $derived(Math.max(5, Math.min(90, 80 - 16 * laps + (helped ? 45 : 0))));
	const rescueChance = $derived(Math.max(5, 65 - 15 * laps));

	function next() {
		if (i === LOOP.length - 1) laps = laps + 1;
		i = (i + 1) % LOOP.length;
	}
</script>

<Toy colour={C.amber} label="Toy 10 of 11: The Loop">
	<div class="track-row">
		{#each LOOP as s, k (k)}
			<div
				class="track-seg"
				style="background: {k === i ? s.who : k < i ? C.rule : C.page};"
			></div>
		{/each}
	</div>
	<div class="step-title">
		{i + 1}. {step.t}
		{#if laps > 0}<span class="lap-tag"> (lap {laps + 1})</span>{/if}
	</div>
	<div class="who" style="color: {step.who};">
		{step.who === C.reason ? 'The reasoning trait does this part.' : 'The executive drag does this part.'}
	</div>
	<Prose style="font-size: 18px;">{step.r(laps)}</Prose>
	<div class="gauges">
		<div class="gauges-label">
			{laps === 0 ? 'Where things stand before the first lap' : 'What each lap leaves behind'}
		</div>
		<Gauge label="The standard the work must meet" v={standard} colour={C.reason} rising {laps} />
		<Gauge label="Dread on opening the task" v={dread} colour={C.drag} rising {laps} />
		<Gauge label="Chance of starting next time" v={startChance} colour={C.amber} {laps} />
		<Gauge label="Chance the 3am rescue works" v={rescueChance} colour={C.amber} {laps} />
	</div>
	<Button onclick={next} active colour={C.amber}>
		{i === LOOP.length - 1 ? 'Go round again' : 'What happens next'}
	</Button>
	{#if laps >= 2}
		<Button onclick={() => (helped = !helped)} active={helped} colour={C.mute}>
			{helped ? 'Take the help away' : 'Someone intervenes: diagnosis, medication, a person alongside'}
		</Button>
	{/if}
	{#if laps > 0}
		<Readout colour={C.amber}>
			{#if helped}
				Look at which gauges moved. Dread dropped and the chance of starting recovered: those are
				the executive drag, and medication and external structure act on them directly. The
				standard did not move. That one belongs to the reasoning trait and to years of evidence,
				and a prescription does nothing to it. This is why people describe a late diagnosis as a
				relief and not a cure: the loop gets slower, but the residue of every previous lap is still
				there to be worked through.
			{:else if laps >= 4}
				By now the task itself is nearly irrelevant. The loop runs on what the loop produces: the
				standard is so high that anything that could be produced would fail it, dread makes
				starting close to impossible, and hyperfocus &mdash; which needs something it wants to grip
				&mdash; will not come to something that only frightens. Nothing about this person&rsquo;s
				reasoning has changed since lap one. Everything about their odds has.
			{:else}
				Lap {laps + 1}. Watch the four gauges: none of them reset. Notice that the two traits take
				alternate turns &mdash; one supplies the standard and the rescue, the other the stall and
				the sting &mdash; and that the two things going up belong to different traits. Neither could
				sustain the loop alone.
			{/if}
		</Readout>
	{/if}
</Toy>

<style>
	.track-row {
		display: flex;
		gap: 4px;
		margin-bottom: 12px;
	}
	.track-seg {
		flex: 1;
		height: 8px;
		border: 1px solid #0b0b0b;
	}
	.step-title {
		font-size: 22px;
		font-weight: 700;
		margin-bottom: 4px;
	}
	.lap-tag {
		font-size: 15px;
		font-weight: 400;
		color: #5c5c58;
	}
	.who {
		font-size: 15px;
		margin-bottom: 8px;
	}
	.gauges {
		background: #efeee8;
		padding: 10px 12px;
		margin: 8px 0 12px;
	}
	.gauges-label {
		font-size: 14px;
		color: #5c5c58;
		margin-bottom: 4px;
	}
</style>
