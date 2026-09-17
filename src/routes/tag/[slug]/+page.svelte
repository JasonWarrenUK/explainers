<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.tag} — Explainers</title>
</svelte:head>

<main>
	<p class="eyebrow"><a href="/">← All explainers</a></p>
	<h1>Tagged &ldquo;{data.tag}&rdquo;</h1>
	<ul class="list">
		{#each data.items as e (e.id)}
			<li>
				<a href="/explainer/{e.id}">
					<h2>{e.title}</h2>
					<p>{e.blurb}</p>
				</a>
			</li>
		{/each}
	</ul>
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
		text-transform: capitalize;
		margin: 0 0 2rem;
	}
	.list {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.list li {
		border-bottom: 1px solid #eee;
		padding: 1.25rem 0;
	}
	.list a {
		text-decoration: none;
		color: inherit;
		display: block;
	}
	.list h2 {
		margin: 0 0 0.3rem;
		font-size: 1.15rem;
	}
	.list p {
		margin: 0;
		color: #555;
	}
</style>
