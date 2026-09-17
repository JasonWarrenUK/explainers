<script lang="ts">
	import { MONO, C } from './palette';

	let { label, children }: { label: string; children: import('svelte').Snippet } = $props();
</script>

<label class="control">
	<span style="display: block; font-family: {MONO}; font-size: 13px; letter-spacing: 0.04em; margin-bottom: 6px; color: {C.ink};">
		{label}
	</span>
	{@render children()}
</label>

<style>
	.control {
		display: block;
		margin: 14px 0 6px;
	}
</style>
