<script lang="ts">
	import type { CellSpec } from './grid-data';
	import { C } from './palette';

	let { spec, size = 64, highlight = false }: { spec: CellSpec; size?: number; highlight?: boolean } = $props();

	const r = 9;
	const gap = $derived(size / (spec.count + 1));
	const colour = $derived(spec.accent ? C.drag : C.ink);
	const fill = $derived(spec.filled ? colour : 'none');
</script>

<svg
	viewBox="0 0 {size} {size}"
	width={size}
	height={size}
	style="background: {highlight ? C.amberSoft : C.panel}; border: 1px solid {C.rule};"
>
	{#each Array.from({ length: spec.count }) as _, i (i)}
		{@const cx = gap * (i + 1)}
		{@const cy = size / 2}
		{#if spec.shape === 'circle'}
			<circle {cx} {cy} {r} {fill} stroke={colour} stroke-width="2.5" />
		{:else if spec.shape === 'square'}
			<rect x={cx - r} y={cy - r} width={2 * r} height={2 * r} {fill} stroke={colour} stroke-width="2.5" />
		{:else}
			<polygon points="{cx},{cy - r} {cx + r},{cy + r} {cx - r},{cy + r}" {fill} stroke={colour} stroke-width="2.5" />
		{/if}
	{/each}
</svg>
