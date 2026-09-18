<script lang="ts">
	import CodeSpecimen from './formats/CodeSpecimen.svelte';
	import { createTokeniser } from './formats/tokenise';
	import { CARDS, DOCKETS, FORMATS, OTHERS, RULES } from './norway-is-not-a-boolean-data';

	const tokenise = createTokeniser(RULES);
	const encoder = new TextEncoder();

	let currentId = $state(FORMATS[0].id);
	let notesHidden = $state(false);
	let openCards = $state<boolean[]>(CARDS.map(() => false));

	const current = $derived(FORMATS.find((format) => format.id === currentId) ?? FORMATS[0]);
	// computed from the rendered text rather than asserted
	const byteCount = $derived(encoder.encode(current.lines.map(([text]) => text).join('\n')).length);
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

<div class="page">
	<div class="wrap">
		<header class="mast">
			<p class="eyebrow">Serialisation formats · a comparison</p>
			<h1>Norway Is<br />Not a <em>Boolean</em></h1>
			<p class="sub">
				JSON · JSONC · JSON5 · YAML · TOML · .env<br />XML · Turtle · CSV · NDJSON<br />and the ones
				that never get invited
			</p>
			<p class="lede">
				Somebody chose the format your service reads its configuration from. What did that choice
				buy, and who has been paying for it since?
			</p>
		</header>

		<section>
			<h2>One record, ten ways</h2>
			<p class="sec-note">
				Same deploy config throughout. The notes are what each format did to it without asking.
				Worth saying up front: a configuration file is JSON's worst job, so the tally below is
				unfair to it. Its real case is the docket further down.
			</p>

			<ul class="chips" role="group" aria-label="Choose a format">
				{#each FORMATS as format (format.id)}
					<li>
						<button
							class="chip"
							type="button"
							aria-pressed={format.id === currentId}
							onclick={() => (currentId = format.id)}
						>
							{format.label}
						</button>
					</li>
				{/each}
			</ul>
			<div class="readout">
				<span>lines <b>{current.lines.length}</b></span>
				<span>bytes <b>{byteCount}</b></span>
				<span>comments <b>{current.comments ? 'yes' : 'no'}</b></span>
				<span>spec <b>{current.spec}</b></span>
			</div>
			<p class="stance">{current.stance}</p>
			<div class="specimen">
				<CodeSpecimen lines={current.lines} family={current.family} {tokenise} numbered {notesHidden} />
			</div>
			<button
				class="toggle"
				aria-pressed={!notesHidden}
				onclick={() => (notesHidden = !notesHidden)}
			>
				{notesHidden ? 'Show margin notes' : 'Hide margin notes'}
			</button>
		</section>

		<section>
			<h2>Three different jobs</h2>
			<p>
				Most format arguments are two people doing unrelated work. A file a human edits at 2am and
				a payload crossing a network boundary share almost no requirements, and the properties that
				matter invert between them. Comments are load-bearing in one and dead weight in the other; a
				byte of overhead per field is free in one and ruinous in the other.
			</p>
			<p>The comparison only means anything inside a column.</p>
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
							one interpretation everywhere, versioning that survives a deploy skew, debuggability
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
		</section>

		<section>
			<h2>Five arguments, and one different question</h2>
			<p class="sec-note">
				Each gets its strongest case made properly, then what it costs, then who pays. The first
				five are arguing about syntax for the same thing; the sixth disagrees about what the thing
				is.
			</p>
			{#each DOCKETS as docket (docket.name)}
				<article class="docket">
					<div class="dh">
						<span class="name">{docket.name}</span>
						<span class="meta">{docket.meta}</span>
					</div>
					<p class="claim">{docket.claim}</p>
					<div class="for">
						<h5>The case for</h5>
						<p>{docket.forText}</p>
					</div>
					<div class="against">
						<h5>What it costs</h5>
						<p>{docket.againstText}</p>
					</div>
					<p class="pays"><b>Who pays</b>{docket.pays}</p>
				</article>
			{/each}
		</section>

		<section>
			<h2>Who else is in the room</h2>
			<p>
				These lose the argument by never being in it. Each is the correct answer to a question the
				JSON-versus-YAML fight does not ask.
			</p>
			{#each OTHERS as other (other.name)}
				<div class="minor">
					<p class="mn">{other.name}</p>
					<p>{other.good}</p>
					<p class="cost">{other.bad}</p>
				</div>
			{/each}
		</section>

		<section>
			<h2>The ambiguity surface</h2>
			<p>
				A format's real cost is the set of inputs where two conforming parsers disagree. None of
				these are bugs. Every one of them is a document behaving as specified, and none of them
				raise an error.
			</p>
			<p class="sec-note">Tap a card for what the parser returns.</p>
			<div class="cards">
				{#each CARDS as card, i (i)}
					<button
						class="card"
						type="button"
						aria-expanded={openCards[i]}
						onclick={() => (openCards[i] = !openCards[i])}
					>
						<span class="fmt">{card.fmt}</span>
						<span class="in">{card.inp}</span>
						{#if openCards[i]}
							<span class="out">
								<span class="res">&rarr; {card.out}</span>
								<span class="why">{card.why}</span>
							</span>
						{:else}
							<span class="cue">tap for the result</span>
						{/if}
					</button>
				{/each}
			</div>
		</section>

		<section>
			<h2>What actually decides it</h2>
			<p class="thesis">
				Three questions, none about syntax.
				<strong>Is this a document, a record or a claim?</strong> A document has prose, order and
				structure living inside its text, and XML or something XML-shaped is the honest answer. A
				claim is something a stranger will need to merge with theirs, and the tell is identity
				having to survive leaving the file; that is RDF. Everything else here is competing for
				records, which are fields in a bag. <strong>Who edits it?</strong> A human under pressure
				needs comments, forgiving diffs and types that cannot surprise them, which is TOML's entire
				brief. A machine writing at volume needs a schema, small bytes and tolerance for version
				skew, which is Protobuf, and every text format is a compromise you make to keep the thing
				debuggable. <strong>Does anything change after it is written?</strong> If one field gets
				updated in place, no text format is the answer and SQLite is.
			</p>
			<p>
				The cost that bites is never verbosity. It is the ambiguity surface plus the version skew,
				meaning the gap between the specification you wrote against and the one the reader
				implements. JSON's surface is tiny and its skew is nil, and that, rather than any elegance,
				is why it won. YAML's surface is the largest here by an order of magnitude. TOML acquired
				skew for the first time in December 2025 and is still absorbing it. <code>.env</code> has no
				specification at all, which makes its surface unmeasurable and its blast radius small enough
				that nobody minds.
			</p>
			<p>
				If you want a default: TOML for anything a person edits, JSON for anything crossing a
				boundary, NDJSON the moment there is more than one of something, Protobuf when the boundary
				is hot and both ends are yours, XML when the thing is genuinely a document, JSON-LD when the
				consumer is somebody you will never meet, SQLite when the file gets written to after it is
				created. YAML when the tool demands it, with every string quoted and a schema in CI. And
				<code>.env</code> stays where it is, holding twelve strings, because the moment it holds a
				tree you needed a different file.
			</p>

			<div class="disclose">
				<h3>What this page costs</h3>
				<p>
					This is a recommendation, so it is a party, and it owes the same accounting as everything
					above. The framing here rewards formats with small specifications, which is a preference
					rather than a fact. It undersells YAML: the ergonomics genuinely are better than anything
					else here, and most of the failures listed get caught by schema validation you should be
					running regardless.
				</p>
				<p>
					It also treats "two parsers disagree" as the dominant risk. That is true in a polyglot
					system and close to irrelevant if exactly one language ever reads the file. If your whole
					stack is Python, half the objections above evaporate and the YAML section is unfair.
				</p>
				<p>
					And the honest version of the TOML section is harsher than the one written: deep nesting
					is worse than "awkward", people abandon the format over it, and 1.1 fixed it late enough
					that the fix is currently its own problem.
				</p>
				<p>
					The RDF section is the one to distrust hardest, because it was added on my recommendation
					rather than requested. Its costs land on whoever adopts first and its benefits are network
					effects that may never arrive, and twenty-five years of the semantic web mostly not
					happening is evidence against the case above rather than a tooling accident somebody will
					fix. Weighted honestly, JSON-LD as schema.org markup is the recommendation and the triple
					model is a curiosity you should find interesting rather than adopt.
				</p>
			</div>
		</section>

		<footer>
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
	.page :focus-visible {
		outline: 2px solid var(--amber);
		outline-offset: 3px;
		border-radius: 2px;
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
		margin: 0 0 10px;
		color: var(--ink);
	}
	h3 {
		font-family: var(--mono);
		font-size: 12.5px;
		font-weight: 600;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: var(--muted);
		margin: 0 0 12px;
	}
	.sec-note {
		font-family: var(--mono);
		font-size: 13px;
		line-height: 1.65;
		color: var(--muted);
		margin: 0 0 26px;
	}
	p {
		margin: 0 0 18px;
	}

	/* ---------- format chips ---------- */
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 7px;
		margin: 0 0 18px;
		padding: 0;
		list-style: none;
	}
	.chip {
		font-family: var(--mono);
		font-size: 13px;
		font-weight: 500;
		letter-spacing: 0.05em;
		background: var(--panel);
		color: var(--muted);
		border: 1px solid var(--edge);
		border-radius: 3px;
		padding: 8px 12px;
		cursor: pointer;
		transition:
			color 0.12s,
			background 0.12s;
	}
	.chip:hover {
		color: var(--ink);
		background: var(--code);
	}
	.chip[aria-pressed='true'] {
		background: var(--mark);
		border-color: var(--amber);
		color: var(--ink);
		font-weight: 600;
	}

	/* ---------- specimen ---------- */
	.readout {
		display: flex;
		flex-wrap: wrap;
		gap: 0 22px;
		font-family: var(--mono);
		font-size: 12px;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: var(--muted);
		border-top: 1px solid var(--rule);
		border-bottom: 1px solid var(--rule);
		padding: 10px 0;
		line-height: 1.9;
	}
	.readout b {
		color: var(--ink);
		font-weight: 600;
	}
	.stance {
		font-family: var(--serif);
		font-size: 17.5px;
		line-height: 1.5;
		color: var(--ink);
		margin: 18px 0 16px;
		padding-left: 16px;
		border-left: 3px solid var(--mark);
	}
	.specimen {
		margin: 0 0 10px;
	}
	.toggle {
		font-family: var(--mono);
		font-size: 12px;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		background: none;
		border: 0;
		border-bottom: 1px solid var(--edge);
		color: var(--muted);
		cursor: pointer;
		padding: 5px 0;
	}
	.toggle:hover {
		color: var(--ink);
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
	.docket {
		border-top: 1px solid var(--rule);
		padding: 26px 0 4px;
	}
	.docket:first-of-type {
		border-top: 0;
		padding-top: 6px;
	}
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
	.for h5 {
		color: var(--green);
	}
	.against h5 {
		color: var(--red);
	}
	.pays {
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
	.minor {
		border: 1px solid var(--rule);
		border-radius: 4px;
		padding: 16px 17px;
		margin: 0 0 10px;
		background: var(--panel);
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

	/* ---------- parse cards ---------- */
	.cards {
		display: grid;
		gap: 9px;
	}
	@media (min-width: 640px) {
		.cards {
			grid-template-columns: 1fr 1fr;
		}
	}
	.card {
		width: 100%;
		text-align: left;
		background: var(--panel);
		border: 1px solid var(--edge);
		border-radius: 4px;
		padding: 14px 15px;
		cursor: pointer;
		color: inherit;
		font-family: var(--mono);
		display: block;
		transition: background 0.12s;
	}
	.card:hover {
		background: var(--code);
	}
	.card span {
		display: block;
	}
	.card .fmt {
		font-size: 11.5px;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: var(--muted);
		margin-bottom: 8px;
	}
	.card .in {
		font-size: 13.5px;
		color: var(--ink);
		word-break: break-word;
	}
	.card .out {
		margin-top: 11px;
		padding-top: 10px;
		border-top: 1px solid var(--rule);
	}
	.card .res {
		font-size: 13.5px;
		color: var(--red);
		font-weight: 500;
		margin-bottom: 7px;
		word-break: break-word;
	}
	.card .why {
		font-size: 13px;
		line-height: 1.65;
		color: var(--muted);
		white-space: normal;
	}
	.card .cue {
		font-size: 11.5px;
		letter-spacing: 0.11em;
		text-transform: uppercase;
		color: var(--faint);
		margin-top: 9px;
	}

	/* ---------- close ---------- */
	.thesis {
		font-size: 19px;
		line-height: 1.55;
	}
	.thesis strong {
		color: var(--amber);
		font-weight: 650;
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
		.chip,
		.card {
			transition: none;
		}
	}
</style>
