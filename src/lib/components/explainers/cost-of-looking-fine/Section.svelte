<script lang="ts">
	import { DISPLAY, MONO, C } from './palette';

	let {
		id,
		n,
		title,
		open,
		onToggle,
		children
	}: {
		id: string;
		n: string;
		title: string;
		open: boolean;
		onToggle: () => void;
		children: import('svelte').Snippet;
	} = $props();
</script>

<section class="section" data-section-id={id}>
	<button class="header" onclick={onToggle} aria-expanded={open}>
		<span class="n" style="color: {open ? C.ink : C.mute};">{n || '·'}</span>
		<span class="title">{title}</span>
		<span class="chev">{open ? '−' : '+'}</span>
	</button>
	{#if open}
		<div class="body">
			{@render children()}
		</div>
	{/if}
</section>

<style>
	.section {
		border-top: 1.5px solid #0b0b0b;
	}
	.header {
		font: inherit;
		width: 100%;
		text-align: left;
		background: transparent;
		border: none;
		padding: 16px 0 18px;
		cursor: pointer;
		color: #0b0b0b;
		display: flex;
		align-items: baseline;
		gap: 14px;
	}
	.n {
		font-family: 'Instrument Serif', 'Times New Roman', serif;
		font-size: 44px;
		line-height: 1;
		min-width: 44px;
		font-style: italic;
	}
	.title {
		font-family: 'Instrument Serif', 'Times New Roman', serif;
		font-size: 30px;
		line-height: 1.15;
		flex: 1;
	}
	.chev {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 16px;
		color: #5c5c58;
	}
	.body {
		padding-bottom: 18px;
	}
</style>
