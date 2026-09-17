<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const Explainer = $derived(data.component);
</script>

<svelte:head>
	<title>{data.meta.title}</title>
</svelte:head>

<Explainer />
