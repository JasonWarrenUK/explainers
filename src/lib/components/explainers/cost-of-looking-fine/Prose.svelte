<script lang="ts">
	let { style = '', children }: { style?: string; children: import('svelte').Snippet } = $props();
</script>

<p style="margin: 0 0 1.15em; {style}">
	{@render children()}
</p>
