<script lang="ts">
	let { children }: { children: import('svelte').Snippet } = $props();
</script>

<div class="un-howto" style="border-style: dashed;">
	<div class="un-howto-lab">There is more below</div>
	<p>{@render children()}</p>
</div>
