<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface SteppedStep {
		label: string;
		body: Snippet;
	}

	let {
		where,
		title,
		steps,
		extra
	}: { where: string; title: string; steps: SteppedStep[]; extra?: Snippet } = $props();

	let i = $state(0);
</script>

<div class="un-two" style="border-left: 3px solid var(--un-deep-soft);">
	<div class="un-two-side">
		<span class="un-two-which">Step {i + 1} of {steps.length} · {steps[i].label}</span>
		<span class="un-two-when">{where}</span>
	</div>
	<h3>{title}</h3>
	{#if extra && i === 0}
		{@render extra()}
	{/if}
	{@render steps[i].body()}
	<button class="un-turn" onclick={() => (i = (i + 1) % steps.length)}>
		{i === steps.length - 1 ? '← Back to the beginning' : `Next: ${steps[i + 1].label} →`}
	</button>
</div>
