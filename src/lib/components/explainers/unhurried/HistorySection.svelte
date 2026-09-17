<script lang="ts">
	import HowTo from './HowTo.svelte';
	import { simulate, FATE_LABEL } from '../apparatus-generator';

	let { seed = $bindable(), layer = $bindable() }: { seed: number; layer: number } = $props();

	const LAYER_LABELS = ['What survives', 'What was written down', 'What actually happened'];
	const CAPTIONS = [
		'The chronicle as it comes down to us',
		'Everything the chroniclers wrote',
		'Every event, as it happened'
	];
	const HIDDEN = ['lost', 'unwritten', 'absorbed'];

	const sim = $derived(simulate(seed));

	interface Row {
		key: number;
		year: number;
		text: string;
		note: string | null;
		gap: boolean;
	}

	const rows = $derived.by((): Row[] => {
		const { events, records } = sim;
		if (layer === 0) {
			return records
				.filter((r) => !HIDDEN.includes(r.fate))
				.slice()
				.sort((a, b) => a.year - b.year)
				.map((r, i) => ({ key: i, year: r.year, text: r.text ?? '', note: null, gap: false }));
		}
		if (layer === 1) {
			return records
				.filter((r) => r.fate !== 'unwritten' && r.fate !== 'absorbed')
				.slice()
				.sort((a, b) => a.year - b.year)
				.map((r, i) => ({
					key: i,
					year: r.year,
					text: r.fate === 'lost' ? '— a page is missing here —' : (r.text ?? ''),
					note: FATE_LABEL[r.fate],
					gap: r.fate === 'lost'
				}));
		}
		return events.map((e, i) => {
			const rec = records.find((r) => r.of === i);
			return {
				key: i,
				year: e.year,
				text: e.text,
				note: rec ? FATE_LABEL[rec.fate] : 'never written down at all',
				gap: false
			};
		});
	});

	const nUnwritten = $derived(sim.records.filter((r) => r.fate === 'unwritten').length);
	const nLost = $derived(sim.records.filter((r) => r.fate === 'lost').length);
	const nWrong = $derived(sim.records.filter((r) => r.fate === 'misdated' || r.fate === 'conflated').length);

	function regenerate() {
		seed = (seed * 7919) % 2147483647;
	}
</script>

<section class="un-section">
	<h2>What is the difference between a plot and a past?</h2>
	<p class="un-lead">
		A plot is a sequence of events that somebody arranged so that it would land properly. A past
		is a sequence of events that merely happened, most of which nobody bothered to write down, and
		which reaches you through people who were not trying to help.
	</p>
	<p>
		Generating a plot is very difficult. Generating a past is not, so long as you build three
		things rather than one.
	</p>
	<p>
		<strong>The first is consequence.</strong> Events have to change the state of the world, so that
		later events can only happen because earlier ones did. A war costs both sides strength; weakness
		invites revolt; a kingdom that runs out of strength stops existing. Without that you have a
		list, and a list is porridge with dates on it.
	</p>
	<p>
		<strong>The second and third are the two kinds of loss.</strong> Things that were never written
		down, and things that were written down and did not survive. A record that captures everything
		is not a record. It is a transcript, and no history has ever been one.
	</p>

	<HowTo>
		Below is a century of an invented country, in three versions. Start with what survives, then
		look at what was written, then at what actually happened.
	</HowTo>

	<div class="un-opts" style="margin-top: 1.4rem;">
		{#each LAYER_LABELS as label, i (label)}
			<button class="un-opt" class:chosen={layer === i} onclick={() => (layer = i)}>
				{label}
			</button>
		{/each}
	</div>

	<div class="un-table" style="margin-top: 1.2rem;">
		<div class="un-table-cap">{CAPTIONS[layer]}</div>
		{#each rows as row (row.key)}
			<div class="history-row">
				<span class="un-lang" style="color: var(--un-deep);">year {row.year}</span>
				<span>
					<span class="history-text" class:gap={row.gap}>{row.text}</span>
					{#if row.note}
						<span class="history-note" class:correct={row.note.startsWith('written down correctly')}>
							{row.note}
						</span>
					{/if}
				</span>
			</div>
		{/each}
	</div>

	<button class="un-btn" onclick={regenerate}>Generate a different century</button>

	<p style="margin-top: 2.2rem;">
		In this particular run, {nUnwritten}
		{nUnwritten === 1 ? 'event was' : 'events were'} never written down at all, {nLost}
		{nLost === 1 ? 'record was' : 'records were'} written and then lost, and {nWrong} of what remains
		is either under the wrong year or has two separate events fused into a single episode.
	</p>
	<p>
		Notice one rule in particular. Every collapse goes unrecorded, and it does so by design,
		because the kingdom that would have written it down is the thing that stopped existing.
	</p>
	<p>
		<strong>Nothing in the first column is false, and the first column is not what happened.</strong>
		A reader given only that view will build a perfectly coherent account of this century, and it
		will be wrong in ways that nothing available to them could possibly expose.
	</p>
	<p>
		Which is where this joins up with the rest. The first three sections put you in front of a
		record and let you draw conclusions from it. This one is the same machine seen from the other
		side: not interpreting a past, but manufacturing one with the gaps already built in, so that
		somebody else can come along afterwards and get it wrong in the ordinary way.
	</p>

	<div class="un-colophon">The Apparatus · four of six · the unhurried edition</div>
</section>

<style>
	.history-row {
		display: grid;
		grid-template-columns: 3.2rem 1fr;
		gap: 1rem;
		padding: 0.55rem 0;
		border-bottom: 1px solid var(--un-rule-soft);
		align-items: baseline;
	}
	.history-text {
		font-size: 1rem;
		line-height: 1.55;
		color: var(--un-ink);
	}
	.history-text.gap {
		color: var(--un-ink-soft);
		font-style: italic;
	}
	.history-note {
		display: block;
		margin-top: 0.25rem;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		color: var(--un-mark);
	}
	.history-note.correct {
		color: var(--un-ink-soft);
	}
</style>
