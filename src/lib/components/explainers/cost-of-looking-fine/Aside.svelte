<script lang="ts">
	import Kicker from './Kicker.svelte';
	import { C } from './palette';

	let { children }: { children: import('svelte').Snippet } = $props();
</script>

<div class="aside">
	<div class="tag">
		<Kicker colour={C.ink}>Disclosure</Kicker>
	</div>
	{@render children()}
</div>

<style>
	.aside {
		background: #ffe95c;
		border: 1.5px solid #0b0b0b;
		padding: 14px 16px;
		font-size: 17px;
		line-height: 1.5;
		margin: 1.2em 0;
	}
	.tag {
		margin-bottom: 6px;
	}
</style>
