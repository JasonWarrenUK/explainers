<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface TwoSidedFace {
		tag: string;
		title: string;
		body: Snippet;
	}
	export interface TwoSidedItem {
		when: string;
		front: TwoSidedFace;
		back: TwoSidedFace;
		meanwhile?: Snippet;
	}

	let { item }: { item: TwoSidedItem } = $props();

	let back = $state(false);
	const side = $derived(back ? item.back : item.front);
</script>

<div>
	<div class="un-two" class:reverse={back}>
		<div class="un-two-side">
			<span class="un-two-which">{side.tag}</span>
			<span class="un-two-when">{item.when}</span>
		</div>
		<h3>{side.title}</h3>
		{@render side.body()}
		<button class="un-turn" onclick={() => (back = !back)}>
			{back ? '← Turn it back to the first side' : 'Turn it over →'}
		</button>
	</div>
	{#if item.meanwhile}
		<div class="un-meanwhile">
			<b>Elsewhere at the same moment</b>
			{@render item.meanwhile()}
		</div>
	{/if}
</div>
