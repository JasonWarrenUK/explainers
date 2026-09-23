<script lang="ts">
	import { createTokeniser } from './formats/tokenise';
	import ParseCards from './norway-is-not-a-boolean/ParseCards.svelte';
	import SpecimenBlock from './norway-is-not-a-boolean/SpecimenBlock.svelte';
	import { DEPLOY_FILE, GATES, RECORD } from './norway-is-not-a-boolean/gates';
	import { RULES } from './norway-is-not-a-boolean/rules';
	import type { FinePrint, Gate, Picks } from './norway-is-not-a-boolean/types';

	const tokenise = createTokeniser(RULES);

	let picks = $state<Picks>({
		marker: null,
		typing: null,
		numbers: null,
		dates: null,
		reasons: null,
		who: null,
		shape: null,
		many: null,
		change: null,
		reach: null
	});

	const answered = $derived.by(() => {
		const firstOpen = GATES.findIndex((gate) => picks[gate.id] === null);
		return firstOpen === -1 ? GATES.length : firstOpen;
	});
	const visible = $derived(GATES.slice(0, Math.min(answered + 1, GATES.length)));
	const remaining = $derived(GATES.length - answered);
	// the decision on screen and unanswered is not one of the ones still to come
	const stillHidden = $derived(GATES.length - visible.length);

	const NUMBER_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
</script>

<svelte:head>
	<title>Norway Is Not a Boolean</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..900,0..100,0..1&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{#snippet finePrint(item: FinePrint)}
	<details class="fine">
		<summary>{item.summary}</summary>
		<div class="fine-body">
			{#if item.docket}
				<article class="docket">
					<div class="dh">
						<span class="name">{item.docket.name}</span>
						<span class="meta">{item.docket.meta}</span>
					</div>
					<p class="claim">{item.docket.claim}</p>
					<div class="for">
						<h5>The case for</h5>
						<p>{item.docket.forText}</p>
					</div>
					<div class="against">
						<h5>What it costs</h5>
						<p>{item.docket.againstText}</p>
					</div>
					<p class="pays"><b>Who pays</b>{item.docket.pays}</p>
				</article>
			{/if}
			{#each item.minorFormats ?? [] as minor (minor.name)}
				<div class="minor">
					<p class="mn">{minor.name}</p>
					<p>{minor.good}</p>
					<p class="cost">{minor.bad}</p>
				</div>
			{/each}
			{#each item.paragraphs ?? [] as paragraph, i (i)}
				<p class="fine-text">{paragraph}</p>
			{/each}
			{#if item.cards}
				<ParseCards cards={item.cards} />
			{/if}
			{#if item.specimen}
				<SpecimenBlock specimen={item.specimen} {tokenise} />
			{/if}
		</div>
	</details>
{/snippet}

{#snippet decision(gate: Gate)}
	{@const chosen = picks[gate.id]}
	<div class="q">
		<div class="q-lab">Your decision</div>
		<p class="q-text">{gate.text}</p>
		<div class="opts">
			{#each gate.options as option (option.key)}
				<button
					class="opt"
					type="button"
					aria-pressed={chosen === option.key}
					onclick={() => (picks[gate.id] = option.key)}
				>
					{option.label}
				</button>
			{/each}
		</div>
	</div>
	{#if chosen}
		{@const answer = gate.answers[chosen]}
		<div class="answer">
			<p class="verdict">{answer.verdict}</p>
			{#each answer.paragraphs as paragraph, i (i)}
				<p>{paragraph}</p>
			{/each}
		</div>
		{#if answer.specimen}
			<SpecimenBlock specimen={answer.specimen} {tokenise} />
		{/if}
		{#if answer.finePrint}
			<div class="fines">
				{#each answer.finePrint as item (item.summary)}
					{@render finePrint(item)}
				{/each}
			</div>
		{/if}
	{/if}
{/snippet}

<div class="page">
	<div class="wrap">
		<header class="mast">
			<p class="eyebrow">Serialisation formats · ten decisions</p>
			<h1>Norway Is<br />Not a <em>Boolean</em></h1>
			<p class="sub">
				JSON · JSONC · JSON5 · YAML · TOML · .env<br />XML · Turtle · CSV · NDJSON<br />and the ones
				that never get invited
			</p>
			<p class="lede">
				Everything you have ever typed into a box was stored in a format somebody chose years before
				you typed it. What did that format decide you meant?
			</p>
		</header>

		<section>
			<h2>In 2020, geneticists renamed some human genes.</h2>
			<p>
				Not because the old names were wrong. Because spreadsheets kept changing them. A gene called
				SEPT2 would be opened in a spreadsheet and saved back as the second of September, and enough
				published research had been quietly corrupted this way that the naming committee gave up
				and changed the genes.
			</p>
			<p>
				Nobody decided that. No person looked at SEPT2 and thought: that is a date. A program
				written years earlier had been told that anything shaped like a date is a date, and it was
				doing what it was told, at the moment it was told to open a file.
			</p>
			<p>
				The same rule has a country in it. Norway's two-letter code is NO, and in one of the most
				widely used file formats in the world a bare NO is one of the ways of writing the word no. A
				list of countries can lose Norway and report no error at all.
			</p>
			<p>
				The problem has a name among people who configure servers: the Norway problem. A deploy file
				says <code>region: NO</code>. The service starts, and the region it starts in is
				<code>false</code>.
			</p>
			<SpecimenBlock specimen={DEPLOY_FILE} {tokenise} />
		</section>

		<section>
			<div class="howto">
				<div class="howto-lab">How this page works</div>
				<p>
					It asks you to decide things, and nothing further down appears until you have. That is
					deliberate: the cost of a decision is invisible until you have made it, and being told
					about it in advance does not work.
				</p>
				<p>
					Each answer shows its own consequences and nobody else's. To see what another answer would
					have cost, change it; the page changes with you and keeps the answers you gave further
					down. The technical detail is folded away under each answer for anybody who wants it.
				</p>
			</div>

			<h2>{GATES[0].heading}</h2>
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
				Eight facts, all of them ordinary. Six of them are about to be damaged by decisions you have
				not made yet. Look at them once more before we start: the accession number, the country, the
				weight, the registry number, the date and the note.
			</p>
			{@render decision(GATES[0])}
		</section>

		{#each visible.slice(1) as gate (gate.id)}
			<section>
				<h2>{gate.heading}</h2>
				{#each gate.lead as paragraph, i (i)}
					<p>{paragraph}</p>
				{/each}
				{#if gate.leadByMarker && picks.marker}
					<p>{gate.leadByMarker[picks.marker]}</p>
				{/if}

				{#if gate.id === 'who'}
					<p>There are three jobs, and a comparison only means anything inside one of them.</p>
					<div class="jobs">
						<div class="job">
							<h4>Configuration</h4>
							<dl>
								<dt>Written by</dt>
								<dd>a person, by hand, usually in a hurry</dd>
								<dt>Read by</dt>
								<dd>one program, at startup</dd>
								<dt>What matters</dt>
								<dd>comments, unambiguous types, diffs a reviewer can read, failing loudly</dd>
								<dt>Serious contenders</dt>
								<dd class="picks">TOML, YAML, JSONC, HCL, CUE</dd>
							</dl>
						</div>
						<div class="job">
							<h4>Interchange</h4>
							<dl>
								<dt>Written by</dt>
								<dd>a machine, at a boundary you do not control</dd>
								<dt>Read by</dt>
								<dd>somebody else's stack, in a language you did not pick</dd>
								<dt>What matters</dt>
								<dd>
									one interpretation everywhere, versioning that survives a deploy skew,
									debuggability
								</dd>
								<dt>Serious contenders</dt>
								<dd class="picks">JSON, Protobuf, XML, CBOR, Avro</dd>
							</dl>
						</div>
						<div class="job">
							<h4>Storage and stream</h4>
							<dl>
								<dt>Written by</dt>
								<dd>a machine, continuously, at volume</dd>
								<dt>Read by</dt>
								<dd>a query engine, or a tail</dd>
								<dt>What matters</dt>
								<dd>bytes, parse speed, appendability, surviving a truncated write</dd>
								<dt>Serious contenders</dt>
								<dd class="picks">NDJSON, Parquet, Avro, CSV, Arrow</dd>
							</dl>
						</div>
					</div>
				{/if}

				{@render decision(gate)}

				{#if gate.id === 'typing' && picks.typing === 'quoted' && picks.marker === 'position'}
					<div class="howto aside">
						<div class="howto-lab">Worth noting, given both your answers</div>
						<p>
							You picked the style where bare values are guessed at, and then said you would quote
							everything. That combination is exactly what experienced people do, and it works.
							Quote every value in such a file and none of the failures above can reach you.
						</p>
						<p>
							It is a discipline rather than a property, which is the difference that matters.
							Nothing in the file enforces it and no error appears when somebody forgets. Somebody will forget.
						</p>
					</div>
				{/if}
			</section>
		{/each}

		{#if remaining > 0}
			<section>
				<div class="howto waiting">
					<div class="howto-lab">There is more below</div>
					<p>
						{#if stillHidden === 0}
							One short section follows, and you may skip it.
						{:else if stillHidden === 1}
							One more decision follows.
						{:else}
							{NUMBER_WORDS[stillHidden]} more decisions follow{answered === 0
								? ', once you have settled the first one'
								: ''}.
						{/if}
					</p>
				</div>
			</section>
		{:else}
			<section>
				<h2>What the ten have in common.</h2>
				<p>
					Skip this if you like. It is a summary, and summaries are written for people who have
					finished.
				</p>
				<p>
					You have now made ten decisions, and between them they are most of what separates every
					format anybody uses. Not one of them was about syntax. They were about who is coming, what
					they are allowed to assume and what the file is willing to promise.
				</p>
				<div class="points">
					<div class="point">
						<div class="point-n">The first</div>
						<p>
							<strong>Every format guesses on your behalf.</strong> The question is never whether it
							guesses but whether it tells you when. A format that turns NO into no is not broken; it
							is doing precisely what it was designed to do, at the wrong moment, to the wrong two
							letters.
						</p>
					</div>
					<div class="point">
						<div class="point-n">The second</div>
						<p>
							<strong>The silent failures are the expensive ones.</strong> Nothing on this page
							produced an error message. A file that will not open is a nuisance you fix in ten
							minutes. A file that opens and means something slightly different is a problem you
							find in three years, in something unrelated, if you find it at all.
						</p>
					</div>
					<div class="point">
						<div class="point-n">The third</div>
						<p>
							<strong>Somebody always pays, and it is rarely the person choosing.</strong> The
							convenience is taken now, by the person writing the file. The bill arrives later and
							lands on whoever has to read it, merge it or explain to a room why the catalogue has
							no Norwegian objects in it.
						</p>
					</div>
				</div>

				<h3>The ten formats, and what each one is actually for</h3>
				<ul class="tally">
					<li><span class="nm">JSON</span> The one everything speaks. Strict and small, and it forbids remarks entirely.</li>
					<li><span class="nm">JSONC and JSON5</span> The same thing with remarks allowed, because people kept needing them. Neither is a standard anybody is obliged to follow.</li>
					<li><span class="nm">YAML</span> The kindest to write and the least safe to trust. Where Norway goes to die.</li>
					<li><span class="nm">TOML</span> Built for files a person edits, and the only one here that treats a date as a date. Awkward once things nest deeply.</li>
					<li><span class="nm">.env</span> The floor. Twelve lines of text with no kinds, no lists and no rules of any sort. Every system in the world already reads it.</li>
					<li><span class="nm">XML</span> The only one that can mark up a sentence from the inside, which is why every document you have ever opened is made of it. Heavy on every line.</li>
					<li><span class="nm">Turtle and JSON-LD</span> Statements rather than records, named so that strangers can join theirs to yours. You pay for that first and alone.</li>
					<li><span class="nm">CSV</span> One line per thing, commas between. It goes anywhere and understands nothing, and a spreadsheet can rewrite your data on the way in.</li>
					<li><span class="nm">NDJSON</span> One line per thing, but each line properly fenced. What you want the moment there is more than one of something.</li>
					<li><span class="nm">SQLite</span> Not a text file at all. The one arrangement here where a single fact can be changed without rewriting everything around it, which is why national libraries keep things in it.</li>
				</ul>

				<div class="fines">
					<details class="fine">
						<summary>What actually decides it, for people who choose formats for a living</summary>
						<div class="fine-body">
							<p class="thesis">
								Three questions, none about syntax.
								<strong>Is this a document, a record or a claim?</strong> A document has prose,
								order and structure living inside its text, and XML or something XML-shaped is the
								honest answer. A claim is something a stranger will need to merge with theirs, and
								the tell is identity having to survive leaving the file; that is RDF. Everything
								else here is competing for records, which are fields in a bag.
								<strong>Who edits it?</strong> A human under pressure needs comments, forgiving
								diffs and types that cannot surprise them, which is TOML's entire brief. A machine
								writing at volume needs a schema, small bytes and tolerance for version skew, which is Protobuf. Every text format is a compromise you make to keep the thing
								debuggable. <strong>Does anything change after it is written?</strong> If one field
								gets updated in place, no text format is the answer and SQLite is.
							</p>
							<p class="fine-text">
								The cost that bites is never verbosity. It is the ambiguity surface plus the version
								skew, meaning the gap between the specification you wrote against and the one the
								reader implements. JSON's surface is tiny and its skew is nil, and that, rather than
								any elegance, is why it won. YAML's surface is the largest here by an order of
								magnitude. TOML acquired skew for the first time in December 2025 and is still
								absorbing it. <code>.env</code> has no specification at all, which makes its surface
								unmeasurable and its blast radius small enough that nobody minds.
							</p>
							<p class="fine-text">
								If you want a default: TOML for anything a person edits, JSON for anything crossing
								a boundary, NDJSON the moment there is more than one of something, Protobuf when the
								boundary is hot and both ends are yours, XML when the thing is genuinely a document,
								JSON-LD when the consumer is somebody you will never meet, SQLite when the file gets
								written to after it is created. YAML when the tool demands it, with every string
								quoted and a schema in CI. And <code>.env</code> stays where it is, holding twelve
								strings, because the moment it holds a tree you needed a different file.
							</p>
						</div>
					</details>
				</div>

				<div class="disclose">
					<h3>What this page costs</h3>
					<p>
						This is a recommendation, so it is a party and owes the same accounting as
						everything above. The framing here rewards formats with small specifications, which is a
						preference rather than a fact. It undersells YAML: the ergonomics genuinely are better
						than anything else here, and most of the failures listed get caught by schema validation
						you should be running regardless.
					</p>
					<p>
						It also treats "two parsers disagree" as the dominant risk. That is true in a polyglot
						system and close to irrelevant if exactly one language ever reads the file. If your
						whole stack is Python, half the objections above evaporate and the YAML answers are
						unfair.
					</p>
					<p>
						And the honest version of the TOML answer is harsher than the one written: deep nesting
						is worse than "awkward", people abandon the format over it, and 1.1 fixed it late enough
						that the fix is currently its own problem.
					</p>
					<p>
						The RDF answer is the one to distrust hardest, because it was added on my recommendation
						rather than requested. Its costs land on whoever adopts first and its benefits are
						network effects that may never arrive, and twenty-five years of the semantic web mostly
						not happening is evidence against the case above rather than a tooling accident somebody
						will fix. Weighted honestly, JSON-LD as schema.org markup is the recommendation and the
						triple model is a curiosity you should find interesting rather than adopt.
					</p>
					<p>
						The form costs something too. Each answer shows only its own consequences, so one
						reading of this page covers about a third of it. The rest is there, behind the answers
						you did not give.
					</p>
				</div>
			</section>
		{/if}

		<footer>
			A companion to <a href="/explainer/what-exists"><em>What Exists</em></a>, which stopped where
			this one starts.<br />
			Specimen values are synthetic. Line and byte counts are computed from the rendered text rather
			than asserted.<br />
			TOML 1.1.0 released 18 December 2025; ecosystem support was still uneven at the start of 2026
			and worth checking against your own parser.<br />
			RDF 1.1 remains the standing W3C Recommendation. RDF 1.2, which adds triple terms, was a
			Candidate Recommendation as of April 2026 and had not advanced at the time of writing.
		</footer>
	</div>
</div>

<style>
	.page {
		--page: #faf8fd;
		--panel: #ffffff;
		--code: #f3effa;
		--edge: #8d7bac;
		--rule: #d5cae8;
		--ink: #1a1226;
		--muted: #544869;
		--faint: #6b6084;
		--amber: #7a5200;
		--mark: #ffe783;
		--green: #116644;
		--red: #a32c10;
		--violet: #5734a0;
		--mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
		--serif: 'Fraunces', Georgia, 'Times New Roman', serif;

		--spec-bg: var(--code);
		--spec-rule: var(--rule);
		--spec-radius: 4px;
		--spec-size: 13px;
		--spec-note-size: 13px;
		--spec-ink: var(--ink);
		--spec-faint: var(--faint);
		--spec-gain: var(--green);
		--spec-cost: var(--red);
		--spec-flat-edge: var(--edge);
		--spec-flat-ink: var(--muted);
		--spec-key: var(--amber);
		--spec-str: var(--green);
		--spec-num: var(--red);
		--spec-lit: var(--violet);

		background: var(--page);
		min-height: 100dvh;
		color: var(--ink);
		font-family: var(--serif);
		font-variation-settings: 'opsz' 14, 'SOFT' 0, 'WONK' 0;
		font-weight: 380;
		font-size: 17.5px;
		line-height: 1.64;
		letter-spacing: 0.003em;
	}
	.page *,
	.page *::before,
	.page *::after {
		box-sizing: border-box;
	}
	.wrap {
		max-width: 760px;
		margin: 0 auto;
		padding: 0 20px 96px;
	}
	.page ::selection {
		background: var(--mark);
		color: var(--ink);
	}
	.page :global(:focus-visible) {
		outline: 2px solid var(--amber);
		outline-offset: 3px;
		border-radius: 2px;
	}
	a {
		color: var(--violet);
		text-underline-offset: 3px;
	}

	/* ---------- masthead ---------- */
	.mast {
		padding: 56px 0 40px;
		border-bottom: 1px solid var(--rule);
	}
	.eyebrow {
		font-family: var(--mono);
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--muted);
		margin: 0 0 22px;
	}
	h1 {
		font-family: var(--serif);
		font-variation-settings: 'opsz' 144, 'SOFT' 30, 'WONK' 1;
		font-weight: 650;
		font-size: clamp(2.6rem, 11vw, 4.4rem);
		line-height: 1.02;
		letter-spacing: -0.021em;
		margin: 0 0 14px;
	}
	h1 em {
		font-style: normal;
		color: var(--ink);
		background: linear-gradient(transparent 10%, var(--mark) 10%, var(--mark) 92%, transparent 92%);
		padding: 0 0.08em;
	}
	.sub {
		font-family: var(--mono);
		font-size: 13px;
		font-weight: 400;
		color: var(--muted);
		letter-spacing: 0.01em;
		line-height: 1.75;
		margin: 0 0 32px;
	}
	.lede {
		font-size: 19.5px;
		line-height: 1.55;
		margin: 0;
		color: var(--ink);
		font-weight: 500;
		font-variation-settings: 'opsz' 60, 'SOFT' 20, 'WONK' 1;
		border-left: 3px solid var(--mark);
		padding-left: 16px;
	}

	/* ---------- generic sections ---------- */
	section {
		padding: 48px 0 0;
		border-top: 1px solid var(--rule);
		margin-top: 48px;
	}
	section:first-of-type {
		border-top: 0;
		margin-top: 0;
	}
	h2 {
		font-family: var(--serif);
		font-variation-settings: 'opsz' 90, 'SOFT' 20, 'WONK' 1;
		font-weight: 650;
		font-size: clamp(1.65rem, 6vw, 2.15rem);
		line-height: 1.12;
		letter-spacing: -0.014em;
		margin: 0 0 16px;
		color: var(--ink);
	}
	h3 {
		font-family: var(--mono);
		font-size: 12.5px;
		font-weight: 600;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: var(--muted);
		margin: 32px 0 12px;
	}
	p {
		margin: 0 0 18px;
	}
	code {
		font-family: var(--mono);
		font-size: 0.85em;
		color: var(--violet);
		background: var(--code);
		border: 1px solid var(--rule);
		border-radius: 3px;
		padding: 1px 5px;
	}

	/* ---------- instruction blocks ---------- */
	.howto {
		border: 1px solid var(--rule);
		border-radius: 4px;
		background: var(--panel);
		padding: 16px 18px;
		margin: 0 0 28px;
	}
	.howto.waiting {
		border-style: dashed;
		background: transparent;
		margin: 0;
	}
	.howto.aside {
		margin: 26px 0 0;
		border-left: 4px solid var(--mark);
	}
	.howto-lab {
		font-family: var(--mono);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: var(--muted);
		margin-bottom: 8px;
	}
	.howto p {
		font-size: 16.5px;
		line-height: 1.55;
		margin: 0 0 10px;
	}
	.howto p:last-child {
		margin: 0;
	}

	/* ---------- the record card ---------- */
	.record {
		background: var(--panel);
		border: 1px solid var(--edge);
		border-radius: 4px;
		padding: 18px 20px;
		margin: 0 0 22px;
	}
	.record dl {
		margin: 0;
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 5px 18px;
		align-items: baseline;
	}
	.record dt {
		font-family: var(--mono);
		font-size: 11.5px;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		color: var(--muted);
		white-space: nowrap;
	}
	.record dd {
		margin: 0;
		line-height: 1.5;
		word-break: break-word;
	}

	/* ---------- decisions ---------- */
	.q {
		border-left: 3px solid var(--mark);
		padding: 2px 0 2px 18px;
		margin: 30px 0 0;
	}
	.q-lab {
		font-family: var(--mono);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: var(--amber);
		margin-bottom: 8px;
	}
	.q-text {
		font-size: 19px;
		line-height: 1.5;
		font-weight: 500;
		font-variation-settings: 'opsz' 60, 'SOFT' 20, 'WONK' 1;
		margin: 0 0 16px;
	}
	.opts {
		display: grid;
		gap: 8px;
	}
	.opt {
		font-family: var(--serif);
		font-size: 16.5px;
		line-height: 1.45;
		text-align: left;
		background: var(--panel);
		color: var(--ink);
		border: 1px solid var(--edge);
		border-radius: 4px;
		padding: 12px 14px;
		cursor: pointer;
		transition: background 0.12s;
	}
	.opt:hover {
		background: var(--code);
	}
	.opt[aria-pressed='true'] {
		background: var(--mark);
		border-color: var(--amber);
		font-weight: 550;
	}

	.answer {
		border-left: 3px solid var(--violet);
		padding-left: 18px;
		margin: 26px 0 0;
	}
	.answer p:last-child {
		margin: 0;
	}
	.answer .verdict {
		font-size: 18.5px;
		line-height: 1.45;
		font-weight: 550;
		margin: 0 0 10px;
	}

	/* ---------- fine print ---------- */
	.fines {
		margin: 18px 0 0;
		display: grid;
		/* minmax(0, …) stops a wide code specimen inside from stretching the column */
		grid-template-columns: minmax(0, 1fr);
		gap: 8px;
	}
	.fine {
		border: 1px solid var(--rule);
		border-radius: 4px;
		background: var(--panel);
	}
	.fine summary {
		font-family: var(--mono);
		font-size: 13px;
		letter-spacing: 0.02em;
		color: var(--muted);
		cursor: pointer;
		padding: 11px 15px;
	}
	.fine summary:hover,
	.fine[open] summary {
		color: var(--ink);
	}
	.fine[open] summary {
		border-bottom: 1px solid var(--rule);
	}
	.fine-body {
		padding: 16px 17px 17px;
	}
	.fine-body > :global(*:first-child) {
		margin-top: 0;
	}
	.fine-body > :last-child {
		margin-bottom: 0;
	}
	.fine-text {
		font-size: 16.5px;
		line-height: 1.55;
	}

	/* ---------- job columns ---------- */
	.jobs {
		display: grid;
		gap: 14px;
		margin: 0 0 6px;
	}
	@media (min-width: 720px) {
		.jobs {
			grid-template-columns: repeat(3, 1fr);
		}
	}
	.job {
		border: 1px solid var(--rule);
		border-radius: 4px;
		padding: 16px 16px 18px;
		background: var(--panel);
	}
	.job h4 {
		font-family: var(--mono);
		font-size: 12.5px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--amber);
		margin: 0 0 10px;
	}
	.job dl {
		margin: 0;
		font-family: var(--mono);
		font-size: 13px;
		line-height: 1.65;
	}
	.job dt {
		color: var(--muted);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		font-size: 11.5px;
		margin: 10px 0 2px;
	}
	.job dd {
		margin: 0;
		color: var(--ink);
	}
	.job .picks {
		color: var(--green);
		font-weight: 500;
	}

	/* ---------- dockets ---------- */
	.dh {
		display: flex;
		align-items: baseline;
		gap: 12px;
		flex-wrap: wrap;
		margin: 0 0 8px;
	}
	.dh .name {
		font-family: var(--mono);
		font-size: 15.5px;
		font-weight: 600;
		letter-spacing: 0.03em;
		color: var(--amber);
	}
	.dh .meta {
		font-family: var(--mono);
		font-size: 12px;
		color: var(--muted);
		letter-spacing: 0.04em;
	}
	.claim {
		font-size: 18.5px;
		line-height: 1.45;
		margin: 0 0 14px;
		color: var(--ink);
		font-weight: 500;
	}
	.docket h5 {
		font-family: var(--mono);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		margin: 18px 0 6px;
	}
	.docket p {
		font-size: 16.5px;
		line-height: 1.55;
	}
	.docket .claim {
		font-size: 18.5px;
		line-height: 1.45;
	}
	.for h5 {
		color: var(--green);
	}
	.against h5 {
		color: var(--red);
	}
	.docket .pays {
		font-family: var(--mono);
		font-size: 13px;
		line-height: 1.65;
		color: var(--muted);
		border-left: 3px solid var(--violet);
		padding-left: 13px;
		margin: 18px 0 0;
	}
	.pays b {
		color: var(--violet);
		font-weight: 600;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		font-size: 11.5px;
		display: block;
		margin-bottom: 3px;
	}

	/* ---------- minor formats ---------- */
	.minor + .minor {
		border-top: 1px solid var(--rule);
		margin-top: 16px;
		padding-top: 16px;
	}
	.minor .mn {
		font-family: var(--mono);
		font-size: 13.5px;
		font-weight: 600;
		color: var(--amber);
		letter-spacing: 0.03em;
		margin: 0 0 7px;
	}
	.minor p {
		margin: 0 0 9px;
		font-size: 16.5px;
		line-height: 1.52;
	}
	.minor p:last-child {
		margin: 0;
	}
	.minor .cost {
		color: var(--muted);
	}

	/* ---------- close ---------- */
	.points {
		display: grid;
		gap: 10px;
		margin: 26px 0 0;
	}
	.point {
		border: 1px solid var(--rule);
		border-left: 4px solid var(--mark);
		border-radius: 4px;
		background: var(--panel);
		padding: 16px 18px;
	}
	.point-n {
		font-family: var(--mono);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: var(--amber);
		margin-bottom: 6px;
	}
	.point p {
		margin: 0;
		font-size: 16.5px;
		line-height: 1.55;
	}
	.tally {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.tally li {
		border-top: 1px solid var(--rule);
		padding: 12px 0;
		font-size: 16.5px;
		line-height: 1.55;
	}
	.tally .nm {
		display: block;
		font-family: var(--mono);
		font-size: 13.5px;
		font-weight: 600;
		color: var(--amber);
		letter-spacing: 0.03em;
	}
	.thesis {
		font-size: 17.5px;
		line-height: 1.55;
	}
	.thesis strong {
		color: var(--amber);
		font-weight: 650;
	}
	.disclose {
		border: 1px solid var(--rule);
		border-left: 4px solid var(--red);
		border-radius: 4px;
		padding: 19px 19px 7px;
		background: var(--panel);
		margin-top: 26px;
	}
	.disclose h3 {
		color: var(--red);
		margin-top: 0;
	}
	.disclose p {
		font-size: 16.5px;
		line-height: 1.55;
	}
	footer {
		margin-top: 56px;
		padding-top: 20px;
		border-top: 1px solid var(--rule);
		font-family: var(--mono);
		font-size: 12px;
		color: var(--faint);
		letter-spacing: 0.03em;
		line-height: 1.8;
	}
	@media (prefers-reduced-motion: reduce) {
		.opt {
			transition: none;
		}
	}
</style>
