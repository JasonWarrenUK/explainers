<script lang="ts">
	import Kicker from './Kicker.svelte';
	import { C } from './palette';

	let { colour, children }: { colour?: string; children: import('svelte').Snippet } = $props();
</script>

<div class="readout" style="border-top: 4px solid {colour ?? C.ink};">
	<div class="tag">
		<Kicker colour={colour ?? C.ink}>Readout</Kicker>
	</div>
	{@render children()}
</div>

<style>
	.readout {
		font-size: 17px;
		line-height: 1.5;
		padding: 12px 14px 14px;
		background: #efeee8;
		margin-top: 12px;
	}
	.tag {
		margin-bottom: 6px;
	}
</style>
