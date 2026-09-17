<script lang="ts">
	let { children }: { children: import('svelte').Snippet } = $props();
</script>

<div class="un-howto">
	<div class="un-howto-lab">How this page works</div>
	<p>{@render children()}</p>
</div>
