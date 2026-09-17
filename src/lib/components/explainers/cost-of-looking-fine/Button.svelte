<script lang="ts">
	import { MONO, C } from './palette';

	let {
		onclick,
		active = false,
		colour,
		children
	}: { onclick?: () => void; active?: boolean; colour?: string; children: import('svelte').Snippet } = $props();

	const bg = $derived(active ? (colour ?? C.ink) : C.panel);
</script>

<button
	{onclick}
	style="font-family: {MONO}; font-size: 14px; letter-spacing: 0.02em; padding: 10px 14px; border: 1.5px solid {C.ink}; background: {bg}; color: {active
		? '#fff'
		: C.ink}; cursor: pointer; margin-right: 8px; margin-bottom: 8px; box-shadow: {active
		? 'none'
		: `3px 3px 0 ${C.ink}`}; transform: {active ? 'translate(3px, 3px)' : 'none'};"
>
	{@render children()}
</button>
