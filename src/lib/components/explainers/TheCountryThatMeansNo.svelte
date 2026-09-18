<script lang="ts">
	import './unhurried/unhurried.css';
	import HowTo from './unhurried/HowTo.svelte';
	import Waiting from './unhurried/Waiting.svelte';
	import Question from './unhurried/Question.svelte';
	import CodeSpecimen from './formats/CodeSpecimen.svelte';
	import { createTokeniser } from './formats/tokenise';
	import {
		ANSWERS,
		FILES,
		GATES,
		GATE_ORDER,
		RECORD,
		RULES,
		type GateId
	} from './the-country-that-means-no-data';

	const tokenise = createTokeniser(RULES);

	let picks = $state<Record<GateId, string | null>>({
		marker: null,
		typing: null,
		who: null,
		many: null,
		reach: null
	});

	// changing an answer cannot leave later answers stranded on a vanished premise
	function reopen(id: GateId): void {
		for (const later of GATE_ORDER.slice(GATE_ORDER.indexOf(id))) picks[later] = null;
	}
</script>

<svelte:head>
	<title>The Country That Means No</title>
</svelte:head>

{#snippet gate(id: GateId)}
	{@const chosen = picks[id]}
	<Question
		text={GATES[id].text}
		options={GATES[id].options}
		value={chosen}
		onPick={(key) => (picks[id] = key)}
	/>
	{#if chosen}
		{@const answer = ANSWERS[id][chosen]}
		{@const file = answer.file ? FILES[answer.file] : null}
		<button class="again" onclick={() => reopen(id)}>Change this answer</button>
		<div class="un-answer">
			{#each answer.paragraphs as paragraph, i (i)}
				<p>{#if i === 0}<strong>{answer.verdict}</strong> {/if}{paragraph}</p>
			{/each}
		</div>
		{#if file}
			<div class="file">
				<div class="file-lab">{file.label}</div>
				<CodeSpecimen lines={file.lines} family={file.family} {tokenise} />
			</div>
		{/if}
	{/if}
{/snippet}

<div class="un-shell">
	<div class="un-root">
		<div class="un-wrap">
			<header class="un-mast">
				<p class="un-eyebrow">How things get written down</p>
				<h1>The Country<br />That Means No</h1>
				<p class="un-standfirst">
					What a file format decides on your behalf, and who finds out later.
				</p>
			</header>

			<section class="un-section">
				<h2>In 2020, geneticists renamed some human genes.</h2>
				<p class="un-lead">
					Not because the old names were wrong. Because spreadsheets kept changing them. A gene
					called SEPT2 would be opened in a spreadsheet and saved back as the second of September,
					and enough published research had been quietly corrupted this way that the naming
					committee gave up and changed the genes.
				</p>
				<p>
					Nobody decided that. No person looked at SEPT2 and thought: that is a date. A program
					written years earlier had been told that anything shaped like a date is a date, and it was
					doing what it was told, at the moment it was told to open a file.
				</p>
				<p>
					The same rule has a country in it. Norway's two-letter code is NO, and in one of the most
					widely used file formats in the world, a bare NO is one of the ways of writing the word
					no. A list of countries can lose Norway and report no error at all.
				</p>
				<p>
					<strong>
						Everything you have ever typed into a box was stored in a format somebody chose years
						before you typed it. What did that format decide you meant?
					</strong>
				</p>
			</section>

			<section class="un-section">
				<HowTo>
					It asks you to decide things, and nothing further down appears until you have. That is
					deliberate: the cost of a decision is invisible until you have made it, and being told
					about it in advance does not work. You can change any answer at any point and the page
					will change with you.
				</HowTo>
				<h2>One object, and everything that can go wrong with it.</h2>
				<p>
					Here is a real kind of record: a single small object in a museum, written out the way a
					curator would put it on a card.
				</p>
				<div class="record">
					<dl>
						{#each RECORD as [field, value] (field)}
							<dt>{field}</dt>
							<dd>
								{#each value.split('\n') as line, i (i)}{#if i > 0}<br />{/if}{line}{/each}
							</dd>
						{/each}
					</dl>
				</div>
				<p>
					Seven facts, all of them ordinary. Four of them are about to be destroyed by a decision
					you have not made yet. Look at them once more before we start, particularly the accession
					number, the country and the weight.
				</p>
				{@render gate('marker')}
			</section>

			{#if !picks.marker}
				<section class="un-section">
					<Waiting>Four more decisions follow, once you have settled the first one.</Waiting>
				</section>
			{:else}
				<section class="un-section">
					<h2>The two letters that are not a country.</h2>
					<p>
						You have somewhere to put the facts now. What you have not settled is what any of them
						<em>are</em>. The letters NO are sitting in your file, and something has to decide, when
						the file is read back, whether they are a country or an answer.
					</p>
					{#if picks.marker === 'position'}
						<p>
							This matters more for what you chose than for the alternatives, and it is worth saying
							plainly rather than letting you find out. The style you picked is the one where values
							are written bare, without fences around them, so working out what they are is done by
							looking at them.
						</p>
					{:else if picks.marker === 'tags'}
						<p>
							What you chose has an unusual position here. Naming both ends tells a machine where a
							value stops, and tells it nothing whatever about what the value is. Everything in an
							XML file is text until something separate says otherwise.
						</p>
					{:else}
						<p>
							What you chose already helps, and not as much as it looks. Fencing a value in
							quotation marks does mark it as words. But nothing forces you to use the quotes, and a
							number written without them is a number.
						</p>
					{/if}
					{@render gate('typing')}
				</section>

				{#if !picks.typing}
					<section class="un-section">
						<Waiting>Three more decisions follow.</Waiting>
					</section>
				{:else}
					{#if picks.typing === 'quoted' && picks.marker === 'position'}
						<section class="un-section">
							<div class="un-howto named">
								<div class="un-howto-lab">Worth noting, given both your answers</div>
								<p>
									You picked the style where bare values are guessed at, and then said you would
									quote everything. That combination is exactly what experienced people do, and it
									works. Quote every value in such a file and none of the failures above can reach
									you.
								</p>
								<p>
									It is a discipline rather than a property, which is the difference that matters.
									Nothing in the file enforces it, no error appears when somebody forgets, and
									somebody will forget.
								</p>
							</div>
						</section>
					{/if}

					<section class="un-section">
						<h2>Two in the morning.</h2>
						<p>
							Every argument about these formats is really two arguments having a fight in one room,
							and the reason they never resolve is that the people are describing different jobs.
						</p>
						<p>
							A file a person types by hand at speed and a file a machine sends to another machine
							want opposite things. Space costs nothing in one and matters in the other. An
							explanation of why is the most valuable line in one file and pure waste in the other.
						</p>
						{@render gate('who')}
					</section>

					{#if !picks.who}
						<section class="un-section">
							<Waiting>Two more decisions follow.</Waiting>
						</section>
					{:else}
						<section class="un-section">
							<h2>Four hundred thousand of them.</h2>
							<p>
								Everything so far has assumed one object. Quantity is not a bigger version of the
								same problem; past a certain size it is a different problem, and the format that was
								right for one is usually wrong.
							</p>
							{@render gate('many')}
						</section>

						{#if !picks.many}
							<section class="un-section">
								<Waiting>One more decision follows.</Waiting>
							</section>
						{:else}
							<section class="un-section">
								<h2>Somebody you will never meet.</h2>
								<p>
									There is one more thing a format can decide, and it is the one people notice last.
									So far, everything has assumed that whoever reads this file has spoken to whoever
									wrote it, or can.
								</p>
								{@render gate('reach')}
							</section>

							{#if !picks.reach}
								<section class="un-section">
									<Waiting>One short section follows, and you may skip it.</Waiting>
								</section>
							{:else}
								<section class="un-section">
									<h2>What the ten have in common.</h2>
									<p>
										Skip this if you like. It is a summary, and summaries are written for people who
										have finished.
									</p>
									<p>
										You have now made five decisions, and between them they are most of what
										separates every format anybody uses. Not one of them was about syntax. They were
										about who is coming, what they are allowed to assume, and what the file is
										willing to promise.
									</p>
									<div class="un-points">
										<div class="un-point">
											<div class="un-point-n">The first</div>
											<p>
												<strong>Every format guesses on your behalf.</strong> The question is never
												whether it guesses but whether it tells you when. A format that turns NO into
												no is not broken; it is doing precisely what it was designed to do, at the
												wrong moment, to the wrong two letters.
											</p>
										</div>
										<div class="un-point">
											<div class="un-point-n">The second</div>
											<p>
												<strong>The silent failures are the expensive ones.</strong> Nothing on this
												page produced an error message. A file that will not open is a nuisance you
												fix in ten minutes. A file that opens and means something slightly different
												is a problem you find in three years, in something unrelated, if you find it
												at all.
											</p>
										</div>
										<div class="un-point">
											<div class="un-point-n">The third</div>
											<p>
												<strong>Somebody always pays, and it is rarely the person choosing.</strong>
												The convenience is taken now, by the person writing the file. The bill arrives
												later and lands on whoever has to read it, merge it, or explain to a room why
												the catalogue has no Norwegian objects in it.
											</p>
										</div>
									</div>

									<h3>The ten, and what each one is actually for</h3>
									<ul class="tally">
										<li><span class="nm">JSON</span>: the one everything speaks. Strict, small, and forbids remarks entirely.</li>
										<li><span class="nm">JSONC and JSON5</span>: the same thing with remarks allowed, because people kept needing them. Neither is a standard anybody is obliged to follow.</li>
										<li><span class="nm">YAML</span>: the kindest to write and the least safe to trust. Where Norway goes to die.</li>
										<li><span class="nm">TOML</span>: built for files a person edits, and the only one here that treats a date as a date. Awkward once things nest deeply.</li>
										<li><span class="nm">.env</span>: the floor. Twelve lines of text, no kinds, no lists, no rules of any sort, and every system in the world already reads it.</li>
										<li><span class="nm">XML</span>: the only one that can mark up a sentence from the inside, which is why every document you have ever opened is made of it. Heavy on every line.</li>
										<li><span class="nm">Turtle and JSON-LD</span>: statements rather than records, named so that strangers can join theirs to yours. You pay for that first and alone.</li>
										<li><span class="nm">CSV</span>: one line per thing, commas between. Goes anywhere, understands nothing, and lets a spreadsheet rewrite your data on the way in.</li>
										<li><span class="nm">NDJSON</span>: one line per thing, but each line properly fenced. What you want the moment there is more than one of something.</li>
										<li><span class="nm">SQLite</span>: not a text file at all. The one arrangement here where a single fact can be changed without rewriting everything around it, which is why national libraries keep things in it.</li>
									</ul>
								</section>
							{/if}
						{/if}
					{/if}
				{/if}
			{/if}

			<div class="un-colophon">
				The unhurried edition · one object, ten ways<br />
				A companion to <a href="/explainer/what-exists"><em>What Exists</em></a>, which stopped where
				this one starts.
			</div>
		</div>
	</div>
</div>

<style>
	.un-shell {
		--spec-bg: var(--un-paper-deep);
		--spec-rule: var(--un-rule);
		--spec-ink: var(--un-ink);
		--spec-faint: var(--un-ink-soft);
		--spec-gain: var(--gain);
		--spec-cost: var(--cost);
		--spec-flat-edge: var(--un-rule);
		--spec-flat-ink: var(--un-ink-mid);
		--spec-key: var(--un-mark);
		--spec-str: var(--gain);
		--spec-num: var(--cost);
		--spec-lit: var(--un-deep);

		/* the two colours this page needs that the shared layer does not carry */
		--gain: #2a5c3e;
		--cost: #8c3016;
	}

	.again {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		background: none;
		border: 0;
		border-bottom: 1px solid var(--un-rule);
		color: var(--un-ink-soft);
		cursor: pointer;
		padding: 0.3rem 0;
		margin-top: 0.9rem;
	}
	.again:hover {
		color: var(--un-ink);
	}
	.again:focus-visible {
		outline: 3px solid var(--un-deep);
		outline-offset: 2px;
	}

	.record {
		background: var(--un-card);
		border: 1px solid var(--un-rule);
		border-radius: 3px;
		padding: 1.2rem 1.3rem;
		margin: 0 0 1.4rem;
	}
	.record dl {
		margin: 0;
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.3rem 1.1rem;
		align-items: baseline;
	}
	.record dt {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		color: var(--un-ink-soft);
		white-space: nowrap;
	}
	.record dd {
		margin: 0;
		font-size: 1.02rem;
		line-height: 1.5;
	}

	.file {
		margin: 1.6rem 0 0;
	}
	.file-lab {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.7rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--un-ink-soft);
		margin-bottom: 0.45rem;
	}

	.named {
		margin: 0;
	}
	.named p + p {
		margin-top: 0.6rem;
	}

	.tally {
		margin: 1.4rem 0 0;
		padding: 0;
		list-style: none;
	}
	.tally li {
		border-top: 1px solid var(--un-rule-soft);
		padding: 0.75rem 0;
		font-size: 1.02rem;
		line-height: 1.55;
	}
	.tally .nm {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.86rem;
		font-weight: 600;
		color: var(--un-mark);
	}

	.un-colophon a {
		color: inherit;
	}
</style>
