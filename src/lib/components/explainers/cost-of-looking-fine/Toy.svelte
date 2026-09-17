<script lang="ts">
	import Kicker from './Kicker.svelte';
	import { C } from './palette';

	let { colour, label, children }: { colour: string; label: string; children: import('svelte').Snippet } = $props();
</script>

<div class="toy" style="box-shadow: 6px 6px 0 {colour};">
	<div class="head">
		<span class="dot" style="background: {colour};"></span>
		<Kicker colour={C.ink}>{label}</Kicker>
	</div>
	{@render children()}
</div>

<style>
	.toy {
		background: #ffffff;
		border: 1.5px solid #0b0b0b;
		padding: 14px 16px 18px;
		margin: 1.4em 0 1.8em;
	}
	.head {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 14px;
		padding-bottom: 10px;
		border-bottom: 1.5px solid #0b0b0b;
	}
	.dot {
		width: 12px;
		height: 12px;
		display: inline-block;
		flex-shrink: 0;
	}
</style>
