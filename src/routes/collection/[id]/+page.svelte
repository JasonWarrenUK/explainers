<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.collection.title}</title>
</svelte:head>

<main>
	<p class="eyebrow"><a href="/">← All explainers</a></p>
	<h1>{data.collection.title}</h1>
	<p class="description">{data.collection.description}</p>
	<ol class="list">
		{#each data.items as e, i (e.id)}
			<li>
				<a href="/explainer/{e.id}">
					<span class="n">{i + 1}</span>
					<span class="body">
						<h2>{e.title}</h2>
						<p>{e.blurb}</p>
					</span>
				</a>
			</li>
		{/each}
	</ol>
</main>

<style>
	main {
		max-width: 56rem;
		margin: 0 auto;
		padding: 3rem 1.25rem 6rem;
		font-family: system-ui, sans-serif;
		color: #1a1a1a;
	}
	.eyebrow {
		margin: 0 0 1rem;
	}
	.eyebrow a {
		color: #666;
		text-decoration: none;
		font-size: 0.85rem;
	}
	h1 {
		margin: 0 0 0.5rem;
	}
	.description {
		color: #555;
		margin: 0 0 2.5rem;
	}
	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		counter-reset: none;
	}
	.list li {
		border-bottom: 1px solid #eee;
	}
	.list a {
		display: flex;
		gap: 1.25rem;
		align-items: baseline;
		text-decoration: none;
		color: inherit;
		padding: 1.5rem 0;
	}
	.n {
		font-size: 2rem;
		font-style: italic;
		color: #bbb;
		min-width: 2rem;
	}
	.body h2 {
		margin: 0 0 0.3rem;
	}
	.body p {
		margin: 0;
		color: #555;
	}
</style>
