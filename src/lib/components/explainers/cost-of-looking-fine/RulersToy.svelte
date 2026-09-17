<script lang="ts">
	import Toy from './Toy.svelte';
	import Button from './Button.svelte';
	import Readout from './Readout.svelte';
	import Aside from './Aside.svelte';
	import { C } from './palette';
	import { COMPOSITE, INDICES } from './rulers-data';

	let mode = $state<'pop' | 'own'>('pop');

	const peak = Math.max(...INDICES.map((i) => i.v));
	const ref = $derived(mode === 'pop' ? 100 : peak);
	function pct(v: number): number {
		return ((v - 60) / (215 - 60)) * 100;
	}
</script>

<Toy colour={C.reason} label="Toy 4 of 11: The Same Four Numbers, Two Rulers">
	<div class="intro">
		Two anchors are real: the composite of 162, and a floor of 118 on the indices ADHD drags
		down. The two reasoning bars are inferred from those &mdash; a composite that averages to
		162 with a floor at 118 must have peaks well above 162 &mdash; and their exact heights are
		illustrative.
	</div>
	<div class="mode-buttons">
		<Button active={mode === 'pop'} onclick={() => (mode = 'pop')} colour={C.reason}>Measure against everyone</Button>
		<Button active={mode === 'own'} onclick={() => (mode = 'own')} colour={C.drag}>Measure against their own peak</Button>
	</div>
	<div class="chart">
		<div
			class="ref-line"
			style="left: {pct(ref)}%; border-left: 2px dashed {mode === 'pop' ? C.mute : C.drag};"
		></div>
		<div class="composite-line" style="left: {pct(COMPOSITE)}%; border-left: 2px solid {C.amber};"></div>
		<div class="composite-label" style="color: {C.amber}; margin-left: {pct(COMPOSITE)}%;">composite 162</div>
		{#each INDICES as i (i.key)}
			{@const diff = i.v - ref}
			{@const bad = mode === 'own' && diff <= -30}
			<div class="index-row">
				<div class="index-head">
					<span>{i.key}</span>
					<span style="color: {bad ? C.drag : C.mute}; font-weight: {bad ? 700 : 400};">
						{i.v} ({diff >= 0 ? '+' : ''}{diff})
					</span>
				</div>
				<div class="index-track">
					<div class="index-fill" style="width: {pct(i.v)}%; background: {bad ? C.drag : C.reason};"></div>
				</div>
			</div>
		{/each}
	</div>
	<Readout colour={mode === 'pop' ? C.reason : C.drag}>
		{#if mode === 'pop'}
			<strong>Verdict: nothing here is below average.</strong> The floor is 118, which the manual
			calls &ldquo;high average&rdquo;. The dashed line is the population mean, and against it this
			person is above it on everything, including the two abilities ADHD damages. A clinic using
			this ruler sends them home. This is what Milioni and colleagues found in 2017: put high-IQ
			adults with ADHD through the standard test battery and they look almost normal on nearly every
			task.
		{:else}
			<strong
				>Verdict: the two dragged abilities sit roughly five standard deviations below the
				person&rsquo;s own ceiling.</strong
			>
			The dashed line is now their best index. The composite of 162 is an average, so it hides the
			size of the split: with a floor of 118, the peaks have to be far above 162, and the gap from
			peak to floor is at least 44 points and probably more like 70. This is what Brown, Reichel and
			Quinlan found in 2009, at smaller scale: measured against their own verbal ability, 73% of
			high-IQ adults with ADHD were impaired on most of the executive markers. The numbers did not
			change between the two buttons; the ruler did.
		{/if}
	</Readout>
	<Aside>
		Two knock-on effects of the headline number being an average. First, the 162 understates the
		reasoning: strip out the two dragged indices and the reasoning-only composite would sit well
		above it. Second, the 162 flatters the executive side: it lets a 118 hide inside a number that
		sounds like uniform brilliance. The single figure is wrong in both directions at once, and the
		direction it is wrong in depends on which trait you are asking about.
	</Aside>
</Toy>

<style>
	.intro {
		font-size: 15px;
		color: #5c5c58;
		margin-bottom: 8px;
	}
	.mode-buttons {
		margin-bottom: 6px;
	}
	.chart {
		position: relative;
		padding: 6px 0;
	}
	.ref-line,
	.composite-line {
		position: absolute;
		top: 0;
		bottom: 0;
	}
	.ref-line {
		transition: left 0.3s;
	}
	.composite-label {
		font-size: 12px;
		padding-left: 4px;
	}
	.index-row {
		margin: 8px 0;
	}
	.index-head {
		display: flex;
		justify-content: space-between;
		font-size: 15px;
		margin-bottom: 3px;
	}
	.index-track {
		height: 16px;
		background: #efeee8;
	}
	.index-fill {
		height: 100%;
		transition: background 0.3s;
	}
</style>
