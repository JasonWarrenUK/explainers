<script lang="ts">
	import ExplainerNav from '$lib/components/shared/ExplainerNav.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const Explainer = $derived(data.component);
</script>

<svelte:head>
	<title>{data.meta.title}</title>
</svelte:head>

<ExplainerNav backHref={data.parent.href} backLabel={data.parent.label} />
<Explainer />
