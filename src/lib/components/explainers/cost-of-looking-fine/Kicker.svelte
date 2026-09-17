<script lang="ts">
	import { MONO, C } from './palette';

	let { colour, children }: { colour?: string; children: import('svelte').Snippet } = $props();
</script>

<span
	style="font-family: {MONO}; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: {colour ??
		C.mute};"
>
	{@render children()}
</span>
