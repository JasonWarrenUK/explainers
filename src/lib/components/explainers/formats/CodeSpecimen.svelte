<script lang="ts">
	import type { SpecimenLine, Tokeniser } from './tokenise';

	let {
		lines,
		family,
		tokenise,
		numbered = false,
		showTechnical = false
	}: {
		lines: SpecimenLine[];
		family: string;
		tokenise: Tokeniser;
		numbered?: boolean;
		showTechnical?: boolean;
	} = $props();
</script>

<!--
	Themed by the host explainer through --spec-* custom properties, so the
	same specimen sits inside any palette.
-->
<div class="code" class:numbered>
	{#each lines as [text, ...notes], i (i)}
		<div class="ln">
			{#if numbered}<span class="num">{i + 1}</span>{/if}
			<!-- kept on one line: .src is white-space: pre -->
			<span class="src">{#if text === ''}&nbsp;{:else}{#each tokenise(text, family) as token, j (j)}{#if token.kind}<span class="t-{token.kind}">{token.text}</span>{:else}{token.text}{/if}{/each}{/if}</span>
		</div>
		{#each notes as note, k (k)}
			{#if !note.technical || showTechnical}
				<div class="note {note.kind}" class:technical={note.technical}><span>{note.text}</span></div>
			{/if}
		{/each}
	{/each}
</div>

<style>
	.code {
		background: var(--spec-bg);
		border: 1px solid var(--spec-rule);
		border-radius: var(--spec-radius, 3px);
		font-family: 'IBM Plex Mono', ui-monospace, Menlo, monospace;
		font-size: var(--spec-size, 0.78rem);
		line-height: 1.85;
		padding: 0.85rem 0;
		overflow-x: auto;
		color: var(--spec-ink);
		-webkit-overflow-scrolling: touch;
	}
	.code,
	.note {
		box-sizing: border-box;
	}
	.ln {
		display: flex;
		min-width: max-content;
		padding: 0 1rem;
	}
	.num {
		flex: 0 0 26px;
		color: var(--spec-faint);
		text-align: right;
		padding-right: 12px;
		user-select: none;
		font-size: 0.92em;
	}
	.src {
		white-space: pre;
		flex: 1 1 auto;
	}
	.note {
		position: sticky;
		left: 0;
		width: 100%;
		padding: 0.3rem 1rem 0.55rem;
		font-size: var(--spec-note-size, 0.82rem);
		line-height: 1.55;
		white-space: normal;
	}
	.numbered .note {
		padding-left: calc(1rem + 38px);
	}
	.note span {
		display: inline-block;
		border-left: 3px solid;
		padding-left: 0.6rem;
	}
	.note.technical span {
		border-left-style: double;
	}
	.note.gain span {
		border-color: var(--spec-gain);
		color: var(--spec-gain);
	}
	.note.cost span {
		border-color: var(--spec-cost);
		color: var(--spec-cost);
	}
	.note.flat span {
		border-color: var(--spec-flat-edge);
		color: var(--spec-flat-ink);
	}

	.t-key,
	.t-att {
		color: var(--spec-key);
	}
	.t-str {
		color: var(--spec-str);
	}
	.t-num {
		color: var(--spec-num);
	}
	.t-lit,
	.t-tag {
		color: var(--spec-lit);
	}
	.t-com {
		color: var(--spec-faint);
		font-style: italic;
	}
	.t-pun {
		color: var(--spec-faint);
	}
</style>
