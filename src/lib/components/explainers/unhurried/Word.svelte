<script lang="ts">
	let { parts }: { parts: [string, string, string] } = $props();
	const [pre, hit, post] = $derived(parts);
</script>

<span class="un-word">{pre}<span class="hit">{hit}</span>{post}</span>
