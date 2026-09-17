<script lang="ts">
	interface NextLink {
		href: string;
		label: string;
	}

	let {
		backHref,
		backLabel,
		next
	}: { backHref: string; backLabel: string; next?: NextLink } = $props();
</script>

<div class="explainer-nav">
	<div class="explainer-nav-inner">
		<a class="explainer-nav-btn" href={backHref}>← {backLabel}</a>
		{#if next}
			<a class="explainer-nav-btn" href={next.href}>{next.label} →</a>
		{/if}
	</div>
</div>

<style>
	/*
	 * Themeable via CSS custom properties, so a future per-explainer
	 * wrapper can override --explainer-nav-* to stay coherent with that
	 * explainer's own palette. Falls back to sane neutral defaults when
	 * nothing overrides them.
	 */
	.explainer-nav {
		position: sticky;
		top: 0;
		z-index: 20;
		background: var(--explainer-nav-bg, #ffffff);
		border-bottom: 1px solid var(--explainer-nav-rule, #ddd);
	}
	.explainer-nav-inner {
		max-width: var(--explainer-nav-width, 56rem);
		margin: 0 auto;
		padding: 0.75rem 1.25rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}
	.explainer-nav-btn {
		font-family: var(--explainer-nav-font, system-ui, sans-serif);
		font-size: 0.9rem;
		background: transparent;
		border: 1px solid var(--explainer-nav-rule, #ddd);
		color: var(--explainer-nav-ink, #444);
		text-decoration: none;
		padding: 0.5rem 0.9rem;
		border-radius: 3px;
		white-space: nowrap;
	}
	.explainer-nav-btn:hover {
		background: var(--explainer-nav-hover-bg, #f2f2f2);
	}
	.explainer-nav-btn:focus-visible {
		outline: 3px solid var(--explainer-nav-accent, #1230c8);
		outline-offset: 2px;
	}
</style>
