<script lang="ts">
	import Toy from './Toy.svelte';
	import Control from './Control.svelte';
	import Slider from './Slider.svelte';
	import Button from './Button.svelte';
	import Readout from './Readout.svelte';
	import { C } from './palette';
	import { STAGES, outputFrom, verdictFor, NOTES } from './room-data';

	let k = $state(0);
	let addStructure = $state(false);
	let addInterest = $state(false);

	const s = $derived(STAGES[k]);
	const structure = $derived(Math.min(100, s.structure + (addStructure ? 40 : 0)));
	const interest = $derived(Math.min(100, s.interest + (addInterest ? 50 : 0)));
	const output = $derived(outputFrom(structure, interest));
	const real = $derived(outputFrom(s.structure, s.interest));
	const changed = $derived(output !== real);

	const W = 340;
	const H = 90;
	function xOf(i: number): number {
		return 14 + (i / (STAGES.length - 1)) * (W - 28);
	}
	function yOf(v: number): number {
		return H - 10 - (v / 100) * (H - 20);
	}
	const line = $derived(STAGES.map((st, i) => `${xOf(i)},${yOf(outputFrom(st.structure, st.interest))}`).join(' '));

	function resetToggles() {
		addStructure = false;
		addInterest = false;
	}

	const readoutText = $derived.by(() => {
		if (!changed) return NOTES[k];
		const what = addStructure && addInterest
			? 'You added structure and made it interesting'
			: addStructure
				? 'You added structure: a timetable, deadlines, somebody checking'
				: 'You made it interesting: the attention switch from Toy 7 flipped';
		const structureOnly = addStructure && !addInterest
			? ' Structure substitutes for the executive machinery the person cannot generate internally.'
			: '';
		const interestOnly = addInterest && !addStructure ? ' Interest supplies the attention that importance alone cannot.' : '';
		return `Same person, same year, different room. ${what}, and the verdict moved from ${verdictFor(real).toLowerCase()} to ${verdictFor(output).toLowerCase()}. Neither button touched the reasoning line at the top.${structureOnly}${interestOnly}`;
	});
</script>

<Toy colour={C.drag} label="Toy 8 of 11: The Room">
	<svg viewBox="0 0 {W} {H}" width="100%" style="display: block;">
		<line x1={14} x2={W - 14} y1={yOf(100)} y2={yOf(100)} stroke={C.reason} stroke-width="2" />
		<text x={W - 14} y={yOf(100) - 3} font-size="11" fill={C.reason} text-anchor="end">
			reasoning available: never moves
		</text>
		<polyline points={line} fill="none" stroke={C.drag} stroke-width="2.5" />
		{#each STAGES as st, i (st.name)}
			<circle
				cx={xOf(i)}
				cy={yOf(outputFrom(st.structure, st.interest))}
				r={i === k ? 7 : 4}
				fill={i === k ? C.drag : C.panel}
				stroke={C.drag}
				stroke-width="2"
			/>
		{/each}
	</svg>
	<Control label="Drag through life: {s.name}, age {s.age}">
		<Slider min={0} max={STAGES.length - 1} step={1} bind:value={k} onchange={resetToggles} colour={C.drag} />
	</Control>

	<div class="bar">
		<div class="bar-head"><span>Structure the room supplies</span><span class="bar-value">{structure}%</span></div>
		<div class="bar-track"><div class="bar-fill" style="width: {structure}%; background: {C.mute};"></div></div>
	</div>
	<div class="bar">
		<div class="bar-head"><span>How interesting the room is</span><span class="bar-value">{interest}%</span></div>
		<div class="bar-track"><div class="bar-fill" style="width: {interest}%; background: {C.amber};"></div></div>
	</div>
	<div class="bar">
		<div class="bar-head"><span>What everyone else sees</span><span class="bar-value">{output}%</span></div>
		<div class="bar-track"><div class="bar-fill" style="width: {output}%; background: {C.drag};"></div></div>
	</div>

	<div class="verdict" style="color: {output >= 65 ? C.reason : C.drag};">
		{verdictFor(output)}
		{#if changed}
			<span class="was">(was: {verdictFor(real)})</span>
		{/if}
	</div>

	<div class="toggles">
		<Button active={addStructure} onclick={() => (addStructure = !addStructure)} colour={C.mute}>
			{addStructure ? 'Remove the added structure' : 'Add structure to this stage'}
		</Button>
		<Button active={addInterest} onclick={() => (addInterest = !addInterest)} colour={C.amber}>
			{addInterest ? 'Make it dull again' : 'Make this stage interesting'}
		</Button>
	</div>

	<Readout colour={output >= 65 ? C.reason : C.drag}>
		{readoutText}
	</Readout>
</Toy>

<style>
	.bar {
		margin: 8px 0;
	}
	.bar-head {
		display: flex;
		justify-content: space-between;
		font-size: 15px;
		margin-bottom: 3px;
	}
	.bar-value {
		color: #5c5c58;
	}
	.bar-track {
		height: 16px;
		background: #efeee8;
		overflow: hidden;
	}
	.bar-fill {
		height: 100%;
		transition: width 0.25s;
	}
	.verdict {
		font-size: 22px;
		font-weight: 700;
		margin: 10px 0 6px;
	}
	.was {
		font-size: 15px;
		font-weight: 400;
		color: #5c5c58;
	}
	.toggles {
		margin-top: 6px;
	}
</style>
