<script lang="ts">
	import { C } from './palette';

	let {
		min,
		max,
		step,
		value = $bindable(),
		colour,
		onchange
	}: {
		min: number;
		max: number;
		step?: number;
		value: number;
		colour?: string;
		onchange?: (v: number) => void;
	} = $props();

	function handleInput(e: Event) {
		value = +(e.target as HTMLInputElement).value;
		onchange?.(value);
	}
</script>

<input
	type="range"
	{min}
	{max}
	{step}
	{value}
	oninput={handleInput}
	style="width: 100%; accent-color: {colour ?? C.ink}; height: 28px;"
/>
