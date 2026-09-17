<script lang="ts">
	export interface DigLine {
		t: string;
		notes: (string | null)[];
		later?: boolean;
		older?: boolean;
	}

	let { caption, lines, labels }: { caption: string; lines: DigLine[]; labels: string[] } = $props();

	let d = $state(0);
</script>

<div class="un-table">
	<div class="un-table-cap">{caption}</div>
	<div class="un-opts" style="margin-bottom: 1.2rem;">
		{#each labels as l, i (l)}
			<button class="un-opt" class:chosen={d === i} onclick={() => (d = i)}>
				{l}
			</button>
		{/each}
	</div>
	{#each lines as l, i (i)}
		<div style="padding: 0.7rem 0; border-bottom: {i < lines.length - 1 ? '1px solid var(--un-rule-soft)' : 'none'};">
			<p
				style="margin: 0; font-size: 1.02rem; line-height: 1.6; max-width: none; color: {d > 0 && l.later
					? 'var(--un-mark)'
					: d > 0 && l.older
						? 'var(--un-deep)'
						: 'var(--un-ink)'};"
			>
				{l.t}
			</p>
			{#if l.notes[d]}
				<p style="margin: 0.5rem 0 0; font-size: 0.95rem; color: var(--un-ink-soft); max-width: none; line-height: 1.6;">
					{l.notes[d]}
				</p>
			{/if}
		</div>
	{/each}
</div>
