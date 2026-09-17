<script lang="ts">
	import Toy from './Toy.svelte';
	import Control from './Control.svelte';
	import Slider from './Slider.svelte';
	import Readout from './Readout.svelte';
	import { C, phi } from './palette';

	let score = $state(162);

	const z = $derived((score - 100) / 15);
	const above = $derived(1 - phi(z));
	const oneIn = $derived(above > 0 ? Math.round(1 / above) : Infinity);
	const W = 340,
		H = 120;
	const xOf = (s: number) => ((s - 40) / (180 - 40)) * W;
	const ptOf = (s: number) => {
		const zz = (s - 100) / 15;
		const y = H - 8 - Math.exp(-(zz * zz) / 2) * (H - 20);
		return `${xOf(s).toFixed(1)},${y.toFixed(1)}`;
	};
	const solid = $derived.by(() => {
		const pts: string[] = [];
		for (let s = 40; s <= 150; s += 1) pts.push(ptOf(s));
		return pts.join(' ');
	});
	const dotted = $derived.by(() => {
		const pts: string[] = [];
		for (let s = 150; s <= 180; s += 1) pts.push(ptOf(s));
		return pts.join(' ');
	});
	const beyond = $derived(score > 160);
	const sampleN = 2200;
	const expected = $derived(sampleN * above);
</script>

<Toy colour={C.reason} label="Toy 1 of 11: A Score on the Curve">
	<svg viewBox="0 0 {W} {H}" width="100%" style="display: block;">
		<rect x={xOf(160)} y={0} width={W - xOf(160)} height={H} fill={C.rule} opacity="0.35" />
		<polyline points={solid} fill="none" stroke={C.ink} stroke-width="2" />
		<polyline points={dotted} fill="none" stroke={C.ink} stroke-width="2" stroke-dasharray="3 4" />
		<line x1={xOf(150)} x2={xOf(150)} y1={H - 30} y2={H} stroke={C.mute} stroke-dasharray="2 3" />
		<text x={xOf(150) - 3} y={H - 32} font-size="10" fill={C.mute} text-anchor="end">sample thins</text>
		<line x1={xOf(160)} x2={xOf(160)} y1={0} y2={H} stroke={C.mute} stroke-dasharray="4 3" />
		<text x={xOf(160) + 4} y={14} font-size="11" fill={C.mute}>most tests stop here</text>
		<line x1={xOf(score)} x2={xOf(score)} y1={0} y2={H} stroke={C.reason} stroke-width="3" />
		{#each [70, 100, 130, 160] as s (s)}
			<text x={xOf(s)} y={H} font-size="11" fill={C.mute} text-anchor="middle">{s}</text>
		{/each}
	</svg>
	<Control label="Drag to set the score: {score}">
		<Slider min={70} max={175} bind:value={score} colour={C.reason} />
	</Control>
	<Readout colour={C.reason}>
		A score of <strong>{score}</strong> is {z >= 0 ? '+' : ''}{z.toFixed(1)} standard deviations from the middle. Roughly
		<strong>1 person in {oneIn.toLocaleString()}</strong> scores this high or higher.
		{#if beyond}
			The grey zone matters: the standard adult tests run out at about 160, so a number above it comes
			from extended norms, and the error bars are wide.
		{/if}
		{#if score === 162}
			And in the case this page is built around, the 162 is not one measurement. It is an average
			across several index scores, on extended norms, with the lowest of them down at 118. The marker
			is standing where the midpoint of a very wide spread happens to fall. Toy 4 opens that spread up.
		{/if}
	</Readout>
	<Readout colour={score > 150 ? C.drag : C.mute}>
		<strong>Who was actually measured here.</strong>
		{#if score <= 150}
			Of the 2,200 people the current children&rsquo;s test was calibrated on, about
			<strong>{expected >= 10 ? Math.round(expected) : expected.toFixed(1)}</strong> would be expected
			to score here or higher. The line is still standing on people.
		{:else if score <= 160}
			Sixteen of those 2,200 scored above 150 on any composite, and exactly one reached 151 on the
			reasoning-only composite. The dotted line means the marker is standing on a handful of people,
			and the number under it is getting soft.
		{:else}
			Nobody. Past 160 the scale is extended norms: a statistical model of where people would fall if
			there were enough of them, built from a separate sample of about a hundred high-scoring children.
			The rank &ldquo;very rare&rdquo; is solid. The digits are not.
		{/if}
	</Readout>
</Toy>
