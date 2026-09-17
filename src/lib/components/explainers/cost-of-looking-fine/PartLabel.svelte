<script lang="ts">
	import Kicker from './Kicker.svelte';
	import { C } from './palette';

	let { children }: { children: import('svelte').Snippet } = $props();
</script>

<div class="part-label">
	<Kicker colour={C.ink}>{@render children()}</Kicker>
	<span class="rule"></span>
</div>

<style>
	.part-label {
		display: flex;
		align-items: center;
		gap: 12px;
		margin: 3em 0 0.6em;
	}
	.rule {
		flex: 1;
		border-top: 1.5px solid #0b0b0b;
	}
</style>
