<script lang="ts">
	import { collections } from '$lib/data/collections';
	import { explainers, getAllTags, getExplainersByTag } from '$lib/data/explainers';

	const tags = getAllTags();
	const byTag = tags.map((tag) => ({ tag, items: getExplainersByTag(tag) }));
</script>

<svelte:head>
	<title>Explainers</title>
</svelte:head>

<main>
	<header class="mast">
		<p class="eyebrow">Everything I've made</p>
		<h1>Explainers</h1>
	</header>

	<section class="collections">
		<h2>Collections</h2>
		<p class="section-note">Curated sets, put together on purpose.</p>
		<div class="collection-list">
			{#each collections as collection (collection.id)}
				<a class="collection-card" href="/collection/{collection.id}">
					<h3>{collection.title}</h3>
					<p>{collection.description}</p>
					<p class="count">{collection.explainerIds.length} explainers</p>
				</a>
			{/each}
		</div>
	</section>

	<section class="tags">
		<h2>Browse by tag</h2>
		<p class="section-note">Computed groupings. Grows automatically as explainers are added.</p>
		<div class="tag-list">
			{#each byTag as { tag, items } (tag)}
				<a class="tag-chip" href="/tag/{tag}">
					<span class="tag-name">{tag}</span>
					<span class="tag-count">{items.length}</span>
				</a>
			{/each}
		</div>
	</section>

	<section class="all">
		<h2>All explainers</h2>
		<ul class="all-list">
			{#each explainers as e (e.id)}
				<li>
					<a href="/explainer/{e.id}">{e.title}</a>
					<span class="tags-inline">{e.tags.join(', ')}</span>
				</li>
			{/each}
		</ul>
	</section>
</main>

<style>
	main {
		max-width: 56rem;
		margin: 0 auto;
		padding: 3rem 1.25rem 6rem;
		font-family: system-ui, sans-serif;
		color: #1a1a1a;
	}
	.mast {
		margin-bottom: 3rem;
	}
	.eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-size: 0.75rem;
		color: #666;
		margin: 0 0 0.5rem;
	}
	h1 {
		font-size: 2.5rem;
		margin: 0;
	}
	section {
		margin-bottom: 3.5rem;
	}
	h2 {
		font-size: 1.4rem;
		margin: 0 0 0.25rem;
	}
	.section-note {
		color: #666;
		margin: 0 0 1.25rem;
	}
	.collection-list {
		display: grid;
		gap: 1rem;
	}
	.collection-card {
		display: block;
		border: 1px solid #ddd;
		border-radius: 6px;
		padding: 1.25rem 1.5rem;
		text-decoration: none;
		color: inherit;
	}
	.collection-card h3 {
		margin: 0 0 0.4rem;
	}
	.collection-card p {
		margin: 0 0 0.4rem;
		color: #444;
	}
	.collection-card .count {
		font-size: 0.85rem;
		color: #888;
		margin: 0;
	}
	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.tag-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		border: 1px solid #ccc;
		border-radius: 999px;
		padding: 0.35rem 0.9rem;
		text-decoration: none;
		color: inherit;
		font-size: 0.9rem;
	}
	.tag-count {
		color: #888;
		font-size: 0.8rem;
	}
	.all-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.all-list li {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.5rem 0;
		border-bottom: 1px solid #eee;
	}
	.tags-inline {
		color: #888;
		font-size: 0.8rem;
	}
</style>
