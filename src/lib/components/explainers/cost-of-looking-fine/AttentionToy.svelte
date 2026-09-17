<script lang="ts">
	import Toy from './Toy.svelte';
	import Control from './Control.svelte';
	import Slider from './Slider.svelte';
	import Readout from './Readout.svelte';
	import { C } from './palette';

	let interest = $state(7);

	const W = 340;
	const H = 140;

	function adhd(i: number): number {
		return 100 / (1 + Math.exp(-1.6 * (i - 6.2)));
	}
	function typical(i: number): number {
		return 38 + 5.5 * i;
	}
	function xOf(i: number): number {
		return 20 + (i / 10) * (W - 30);
	}
	function yOf(v: number): number {
		return H - 14 - (v / 100) * (H - 26);
	}
	function path(f: (i: number) => number): string {
		const p: string[] = [];
		for (let i = 0; i <= 10; i += 0.25) p.push(`${xOf(i).toFixed(1)},${yOf(f(i)).toFixed(1)}`);
		return p.join(' ');
	}

	const a = $derived(adhd(interest));
	const verdict = $derived.by(() => {
		if (interest <= 2.5)
			return 'Almost nothing arrives. This is not a choice. Under-stimulation in this brain is aversive, close to physical discomfort in most descriptions, and a very fast mind fed slow input feels it acutely.';
		if (interest <= 5.5)
			return 'The dangerous middle. The task is important enough to matter and dull enough to be nearly impossible to start. Most of adult life lives here.';
		if (interest <= 8)
			return 'The switch flips. Attention floods in and the work looks effortless, because right now it is.';
		return 'Hyperfocus. Hours vanish. Everyone calls this genius, and it is the same dysregulated switch that produced the dead zone on the left.';
	});
</script>

<Toy colour={C.drag} label="Toy 7 of 11: Interest In, Attention Out">
	<svg viewBox="0 0 {W} {H}" width="100%" style="display: block;">
		<line x1={20} x2={W - 10} y1={H - 14} y2={H - 14} stroke={C.rule} />
		<polyline points={path(typical)} fill="none" stroke={C.rule} stroke-width="2" stroke-dasharray="5 4" />
		<polyline points={path(adhd)} fill="none" stroke={C.drag} stroke-width="3" />
		<circle cx={xOf(interest)} cy={yOf(a)} r="6" fill={C.drag} />
		<text x={xOf(0)} y={H} font-size="11" fill={C.mute}>dull</text>
		<text x={xOf(10)} y={H} font-size="11" fill={C.mute} text-anchor="end">fascinating</text>
		<text x={W - 10} y={yOf(typical(10)) - 6} font-size="11" fill={C.mute} text-anchor="end">
			a typical brain (dashed)
		</text>
	</svg>
	<Control label="Drag to set how interesting the task is: {interest} of 10">
		<Slider min={0} max={10} step={0.5} bind:value={interest} colour={C.drag} />
	</Control>
	<Readout colour={C.drag}>
		Attention available: <strong>{Math.round(a)}%</strong>. {verdict}
	</Readout>
</Toy>
