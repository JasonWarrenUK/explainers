<script lang="ts">
	import {
		ARRIVED,
		CASCADES,
		DECISIONS,
		INSERTS,
		MY_PICKS,
		TAIL,
		TALLY,
		TOOL_ACCOUNT,
		type OptionKey,
		type Picks
	} from './last-verified-data';

	let picks = $state<Picks>(DECISIONS.map(() => null));

	const answered = $derived.by(() => {
		const firstOpen = picks.findIndex((pick) => pick === null);
		return firstOpen === -1 ? picks.length : firstOpen;
	});
	const visible = $derived(DECISIONS.slice(0, Math.min(answered + 1, DECISIONS.length)));
	const remaining = $derived(DECISIONS.length - answered);
	const shown = $derived(picks[1]);

	// consequences further down were standing on this answer, so they go with it
	function choose(index: number, key: OptionKey): void {
		if (picks[index] === key) return;
		picks[index] = key;
		for (let later = index + 1; later < picks.length; later++) picks[later] = null;
	}
</script>

<svelte:head>
	<title>Last Verified</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,400&family=IBM+Plex+Mono:wght@400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{#snippet arrived(marked: boolean, caption: string)}
	<div class="doc">
		<div class="doc-cap">{caption}</div>
		{#each ARRIVED as field (field.key)}
			<div class="doc-field">
				<span class="doc-key">{field.key}</span>
				<div class="doc-val">
					<ul>
						{#each field.lines as line (line.text)}
							<li>
								{#if marked && line.mark}
									<span class={line.mark}>{line.text}</span>
								{:else}
									{line.text}
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			</div>
		{/each}
	</div>
{/snippet}

<div class="page">
	<div class="wrap">
		<header class="mast">
			<p class="eyebrow">Keeping documents true · designing review</p>
			<h1>Last Verified</h1>
			<p class="standfirst">
				Some documents have to stay true after they are written. Somebody has to maintain them, and
				that somebody usually cannot check most of what they say.
				<br /><br />
				This is about the machinery people build to close that gap, and about which part of a
				document that machinery decides, in advance, not to look at.
			</p>
		</header>

		<section>
			<div class="howto">
				<div class="howto-lab">How this page works</div>
				<p>
					There are five decisions. Each one asks you to commit to an answer before you see any
					evidence about it, and the page then responds to the answer you actually gave.
				</p>
				<p>
					Nothing below a decision exists until you have answered it. If you go back and change an
					earlier answer, everything built on it is cleared, because those consequences were
					standing on a premise you have just withdrawn. You can change your mind as often as you
					like.
				</p>
			</div>

			<h2>The same five sentences, cited six hundred and eight times.</h2>

			<p class="lead">
				On 10 January 1980 the <em>New England Journal of Medicine</em> printed a letter five
				sentences long. Two researchers at Boston University, Jane Porter and Hershel Jick, had
				examined the files of 39,946 hospitalised medical patients monitored consecutively. Of
				those, 11,882 received at least one narcotic preparation, and among them there were four
				documented cases of addiction in patients with no history of it. They concluded that
				addiction is rare in medical patients with no history of addiction.
			</p>
			<p>
				Every word of that is true, and the conditions are load-bearing. The patients were
				inpatients, on a ward, monitored while they were on it, and nobody followed them after they
				went home.
			</p>
			<p>
				The letter was then cited 608 times. A bibliographic analysis published in 2017 went through
				those citations and found that 72.2% used it to support the claim that patients treated with
				opioids rarely became addicted, and that 80.8% did not mention that the patients had been in
				hospital.
			</p>
			<p>
				Nothing was fabricated. Every citation pointed at a real letter, in a real journal, saying a
				real thing. The <em>New England Journal of Medicine</em> attached an editor's note to it in
				2017.
			</p>
			<p>
				<strong>So what did the four fifths think they were citing?</strong> Not something false.
				Something true, whose conditions had come off in transit, one reasonable citation at a time,
				without anybody noticing the moment it stopped applying.
			</p>
			<p>
				That is the failure this page is about, and it has a shape worth learning, because the same
				shape turns up wherever a document has to be kept current by people who cannot personally
				verify it. Every internal wiki. Every runbook. Every set of clinical guidelines. Every
				dependency upgrade a team accepts because the tests went green.
			</p>
		</section>

		<section>
			<h2>One course, and nobody in charge of it for more than three weeks.</h2>

			<p class="lead">
				Here is the specimen. It is a real one, from a real tool, and everything quoted from it
				below is quoted exactly.
			</p>
			<p>
				A peer-led course in AI engineering runs in modules of three weeks each. There is no
				permanent teacher. Each module is prepared and delivered by a rotating council of volunteers
				with day jobs, and a council gets one week to prepare its module while still learning the
				content of the previous one. Council one takes module one, and is then finished. Council
				four takes module four.
			</p>
			<p>
				An expert wrote every module up front. That is the baseline, and it is the reason this is
				tractable at all: nobody is asking a machine to invent pedagogy. The problem is that the
				subject moves faster than the course does. A specification written in September is
				questionable by October.
			</p>
			<p>
				So a tool reads each module, researches what has changed in the world, and proposes updates.
				A council reviews its own module intensively, and the proposals cascade forward into the
				modules that have not been taught yet. Module four therefore receives updates from councils
				one, two and three, triggered by decisions those councils made about <em>their</em> modules,
				before council four has ever opened it.
			</p>
			<p>
				<strong>You are designing the review.</strong> Not sitting on a council: you are the person
				deciding what a council will be shown, and how, and when. The five decisions below are
				yours, and everyone who sits on a council afterwards lives inside them.
			</p>

			<h3>The document, as the expert wrote it</h3>

			<p>
				This is the second project brief from module four. Its Task, Focus and Criteria are complete
				and exact, including the spelling and the dashes. The Skills and Examples run to
				thirty-three bullets in total, so those are abridged, and each block says below exactly what
				has been left out. Everything that happens for the rest of this page happens to this.
			</p>

			<div class="doc">
				<div class="doc-cap">module 4 · brief 2 · baseline, as written</div>
				<div class="doc-field">
					<span class="doc-key">Name</span>
					<p class="doc-val">Open-Source LLM Application</p>
				</div>
				<div class="doc-field">
					<span class="doc-key">Task</span>
					<p class="doc-val">
						Develop an application using an open-source language model instead of relying on closed
						APIs.
					</p>
				</div>
				<div class="doc-field">
					<span class="doc-key">Focus</span>
					<p class="doc-val">
						Hands-on experience with open-source AI models &ndash; how to install or invoke them,
						performance considerations, and comparing their outputs to commercial models.
						Understanding model internals and building AI features without accessing external APIs.
					</p>
				</div>
				<div class="doc-field">
					<span class="doc-key">Criteria</span>
					<div class="doc-val">
						<ul>
							<li>
								Develop an application using an open-source LLM as its core (e.g. Llama 2, GPT-J, or
								similar).
							</li>
							<li>Deploy the model on your local machine or a server under your control.</li>
							<li>
								The app can be similar to something done earlier or a new concept &ndash; emphasis
								is on the technical challenge of using an open model.
							</li>
							<li>Evaluate the open-source model's performance against benchmarks.</li>
							<li>
								Possibly customize it via parameter tweaks, prompt tuning, or lightweight
								fine-tuning.
							</li>
						</ul>
					</div>
				</div>
				<div class="doc-field">
					<span class="doc-key">Skill 1 of 4, complete</span>
					<div class="doc-val">
						<p class="doc-sub"><em>Hands-on model deployment</em></p>
						<ul>
							<li>Learn how to obtain and run an LLM on hardware or free cloud instance.</li>
							<li>
								Work with Hugging Face Transformers library, llama.cpp, or containerized solutions.
							</li>
							<li>
								Face practical concerns like model size, inference speed, GPU vs CPU differences.
							</li>
							<li>Understand what resources AI models need and how to manage them.</li>
						</ul>
					</div>
				</div>
				<div class="doc-field">
					<span class="doc-key">Skills 2 to 4, titles only, 13 bullets not shown</span>
					<div class="doc-val">
						<ul>
							<li>
								<em>Understanding model specifics.</em> Four bullets about model cards, architecture
								and training data.
							</li>
							<li><em>Model customization and fine-tuning.</em> Four bullets, including LoRA.</li>
							<li>
								<em>Critical evaluation: open vs closed models.</em> Five bullets, weighing both
								sides: &ldquo;Note pros: no cost per request, full control, privacy benefits&rdquo;
								and &ldquo;Note cons: maybe lower quality, more engineering effort, memory
								usage&rdquo;.
							</li>
						</ul>
					</div>
				</div>
				<div class="doc-field">
					<span class="doc-key">Example 1 of 4, complete; the other three are titles only</span>
					<div class="doc-val">
						<ul>
							<li>
								<em>Local Chat Assistant.</em> A ChatGPT clone running offline. Set up Llama-2-7B or
								13B and build a console or web chat interface. Compare its answers to GPT-3.5 on
								questions to see differences.
							</li>
							<li>
								<em>Code Assistant with Code LLM</em>, <em>Specialized Task Model</em>,
								<em>Fully Open RAG System.</em>
							</li>
						</ul>
					</div>
				</div>
				<div class="doc-field">
					<span class="doc-key">Notes</span>
					<div class="doc-val">
						<ul>
							<li>
								This project is about demystifying the AI black box and gaining self-sufficiency
								with AI tech.
							</li>
							<li>
								Completing this gives participants confidence that they are not dependent on
								proprietary AI services for building intelligent features.
							</li>
						</ul>
					</div>
				</div>
			</div>

			<p>
				Llama 2 was released in July 2023 in three sizes, the smallest of which has seven billion
				parameters and will run on a reasonable laptop. GPT-J has six billion and dates from 2021.
				Both names were already behind the field on the day the expert typed them, which is exactly
				why somebody wanted a tool.
			</p>
			<p>
				Now find every place in that document where it says how much computer a learner will need.
				There are four, and they come in two kinds.
			</p>
			<p>
				Two of them name a thing. Criterion one says
				<span class="term">e.g. Llama 2, GPT-J</span>. Example one says
				<span class="term">Llama-2-7B or 13B</span>, which is the only place a parameter count
				appears anywhere in the brief.
			</p>
			<p>
				The other two state a requirement. Criterion two says
				<em>deploy the model on your local machine or a server under your control</em>. Skill one
				says <em>on hardware or free cloud instance</em>, and then, four bullets later,
				<em>understand what resources AI models need and how to manage them</em>.
			</p>
			<p>
				<strong>So the expert knew.</strong> The constraint is in that brief four times, and the
				difference between the two kinds is the thing to hold onto: a named model carries a version,
				and a requirement does not.
			</p>
		</section>

		{#each visible as decision, index (decision.n)}
			{@const pick = picks[index]}
			<section>
				<p class="eyebrow">Decision {decision.n} of {DECISIONS.length}</p>
				<h2>{decision.title}</h2>
				{#each decision.setup as paragraph, i (i)}
					<p class:lead={i === 0}>{paragraph}</p>
				{/each}
				{#if decision.evidence}
					<div class="typed">{decision.evidence}</div>
					{#if decision.evidenceNote}<p>{decision.evidenceNote}</p>{/if}
				{/if}

				<div class="q">
					<p class="q-text">{decision.question}</p>
					<div class="opts">
						{#each decision.options as option (option.key)}
							<button
								class="opt"
								type="button"
								aria-pressed={pick === option.key}
								onclick={() => choose(index, option.key)}
							>
								{option.label}
							</button>
						{/each}
					</div>
				</div>

				{#if pick}
					{@const consequence = decision.consequences[pick]}
					<div class="answer">
						<p>
							<span class="side for">▲ the case for what you chose</span>
							{@html consequence.for}
						</p>
						<p>
							<span class="side against">▼ what it costs, and who pays</span>
							{@html consequence.against}
						</p>
						{#if decision.after}
							<p>{decision.after.replace('{tail}', TAIL[pick])}</p>
						{/if}
					</div>
					{#each INSERTS.filter((insert) => insert.at === decision.n && insert.when(picks)) as insert (insert.id)}
						<div class="insert"><b>{insert.label}</b>{insert.text}</div>
					{/each}
				{/if}
			</section>

			{#if decision.n === 2 && shown}
				<section>
					<h2>What council four opens.</h2>
					<p class="lead">
						Three cascades reached module four before its council did, each triggered by a council
						working on an earlier module, none of whom opened module four. What council four sees of
						them is what you chose one section ago.
					</p>

					{#if shown === 'a'}
						<p>
							You chose the whole module. So here is the brief, as it now stands, presented the way
							a document is presented. No marks, no highlighting, nothing indicating which words
							arrived last month, because you did not ask for any and the document does not carry
							any of its own accord.
						</p>
						{@render arrived(false, 'module 4 · brief 2 · current version')}
						<p>
							Read it as council four would. It is coherent, it is current, and it is about a
							hundred times more sensible than a brief still recommending GPT-J. Three cascades
							changed four lines of it since the expert wrote it, and nothing you are looking at
							tells you which four.
						</p>
					{:else if shown === 'b'}
						<p>
							You chose a diff. So council four gets three entries, each with what changed, how sure
							the tool was about it, and why. A confidence level, here, is the tool's own rating of
							a change it is proposing, one of high, medium or low.
						</p>
						{#each CASCADES as cascade (cascade.label)}
							<div class="doc">
								<div class="doc-cap">{cascade.label}</div>
								<div class="doc-field">
									<span class="doc-key">change</span>
									<p class="doc-val"><span class="term">{cascade.change}</span></p>
								</div>
								<div class="doc-field">
									<span class="doc-key">confidence</span>
									<p class="doc-val">{cascade.confidence}</p>
								</div>
								<div class="doc-field">
									<span class="doc-key">what happened</span>
									<p class="doc-val">{cascade.body}</p>
								</div>
								<div class="doc-field">
									<span class="doc-key">is it right</span>
									<p class="doc-val">{cascade.truth}</p>
								</div>
							</div>
						{/each}
						<p>
							And here is the brief with those three edits marked in place, which is the
							side-by-side half of what you chose.
						</p>
						{@render arrived(true, 'module 4 · brief 2 · as it arrives')}
					{:else}
						<p>
							You chose the tool's own account. So council four gets no document and no marked-up
							text. They get three sentences, which is the whole of what the tool reports having
							done.
						</p>
						<div class="typed">{TOOL_ACCOUNT}</div>
						<p>
							Every sentence there is accurate. Nothing in it is hedged that should not be, nothing
							is claimed that did not happen, and a council reading it in four minutes would come
							away with a correct understanding of what the tool did.
						</p>
					{/if}

					<p>
						Every one of those changes is true, sourced, and an improvement. The document is now
						more current than the expert left it. Two of the three the tool rated high confidence,
						one medium.
					</p>
					<p>
						<strong>Llama 4 Scout has 109 billion total parameters</strong>, 17 billion of them
						active across 16 experts. Meta's own announcement carries, as its headline boast, that
						Scout fits in a single NVIDIA H100 GPU, and notes in the same article that this is with
						Int4 quantisation. Both halves of that are accurate. An H100 is a datacentre card that
						costs more than a car, and the boast is simultaneously the proof that criterion two is
						dead.
					</p>
					<p>
						So is the free cloud instance in skill one, since no free tier anywhere will serve a
						109-billion-parameter model, and so is the fourth bullet of that same skill, about
						understanding what resources a model needs. Nobody edited either. Cascade two came
						closer than anything else on this page: it rewrote the bullet sitting directly between
						them, and had no reason to look up or down. They went from true to false by standing
						still.
					</p>
					<p>
						Meanwhile the two lines that <em>did</em> carry the constraint in checkable form, the
						model names in criterion one and the <span class="term">Llama-2-7B or 13B</span> in
						example one, were correctly updated in a single pass, because they were expressed as
						model names and model names are exactly what a currency check is for. The parameter
						count went with them, in one changelog entry, at high confidence, along with two other
						substitutions nobody could argue with.
					</p>

					{#if shown === 'a'}
						<p>
							Council four has one week and the whole document. Everything they need to notice this
							is on the page in front of them: the dead lines and the live ones that killed them, in
							one screenful. Nothing indicates that any of them is worth a second look.
						</p>
					{:else if shown === 'b'}
						<p>
							Council four has one week and three entries. The edits that killed the brief are the
							first entry in that list, the one nobody would spend a minute on. The lines that broke
							are the ones the diff cannot contain, because a diff is a report on what moved.
						</p>
					{:else}
						<p>
							Council four has one week and three sentences. None of them mentions a laptop, a GPU
							or a free tier, and none of them should, because a report on what happened has no
							reason to mention a line that nothing happened to.
						</p>
					{/if}
				</section>
			{/if}
		{/each}

		{#if remaining > 0}
			<section>
				<div class="howto waiting">
					<div class="howto-lab">There is more below</div>
					<p>
						Answer decision {answered + 1} and the next section opens. There
						{remaining === 1 ? 'is one decision' : `are ${remaining} decisions`} left.
					</p>
				</div>
			</section>
		{:else}
			<section>
				<h2>All fifteen, side by side.</h2>
				<p class="lead">
					You made five choices and saw five consequences. Here is every option you did not take,
					with what it would have bought you and what it would have cost, so the ones you rejected
					get their case made in the same words as the ones you kept.
				</p>
				<p>
					The marked rows are the ones you chose. Where a row is marked
					<span class="tally-mine">my pick</span>, that is my own answer, stated so you can disagree
					with it.
				</p>
				<div class="tally">
					{#each DECISIONS as decision, index (decision.n)}
						<div class="tally-group">
							<div class="tally-head">Decision {decision.n} · {decision.title}</div>
							{#each decision.options as option (option.key)}
								{@const line = TALLY[`${decision.n}${option.key}`]}
								<div class="tally-row" class:yours={picks[index] === option.key}>
									<p class="tally-opt">
										{option.label}
										{#if MY_PICKS[index] === option.key}<span class="tally-mine">my pick</span>{/if}
									</p>
									<p class="tally-line"><span class="g">▲ gains</span> {line.gains}</p>
									<p class="tally-line"><span class="c">▼ costs</span> {line.costs}</p>
								</div>
							{/each}
						</div>
					{/each}
				</div>
			</section>

			<section>
				<h2>Afterword, which you can skip.</h2>
				<p class="lead">
					This is the frame the page was built on. It is at the end rather than the beginning
					because at the beginning you would have had to take it on trust, and now you can check it
					against five decisions you actually made.
				</p>
				<p>
					<strong>
						Every mechanism for making review affordable works by deciding in advance what will not
						be looked at.
					</strong>
				</p>
				<p>
					A diff decides that the unchanged text will not be looked at. A confidence sort decides
					that the confident changes will not be looked at. A source list decides that everything
					off the list will not be looked at. Reading in order decides that the back half will not
					be looked at. There is no version of this that does not make the decision, because
					attention is finite and the whole point of the machinery is to spend it somewhere rather
					than everywhere.
				</p>
				<p>
					So the design question is never whether to have a blind spot. It is where to put it, and
					whether anybody wrote down where they put it. The four fifths who cited Porter and Jick
					without the word <em>hospitalised</em> were not careless. They were reading the part of
					the letter that had been made easy to read.
				</p>
				<p>
					And the reason those particular lines are the casualties is worth being exact about,
					because it is not that nobody thought of the problem. The expert wrote the constraint into
					that brief four separate times. Twice as an instance, a model name and a parameter count,
					and an instance is the most refreshable thing in any technical document, so both were
					correctly updated and the constraint went with them. Twice as a requirement, and a
					requirement carries no version number, so nothing that checks versions can see it at all.
				</p>
				<p>
					Which suggests something to do on Monday, if you maintain a document like this. Go and
					find the places where a requirement is standing in the text disguised as an example,
					because those are the places a currency check will quietly convert into something else.
				</p>
			</section>

			<section>
				<h2>What this page is not telling you.</h2>
				<div class="quiet">
					<p>
						<strong>The tool comes off worse than it deserves.</strong> Rhea is at version 0.1.0,
						the compound drift problem is named in its own documentation before anybody else raised
						it, and the alternative it is competing with is not a well-maintained course. It is a
						course whose September specification gets taught in December unchanged, by volunteers,
						with nobody researching anything. Every criticism on this page is aimed at the best
						version of the design rather than the current one, and the best version is better than
						doing nothing by a wide margin.
					</p>
					<p>
						<strong>The specimen is loaded.</strong> I picked the one brief in the module whose most
						soft, least checkable sentence is also load-bearing. Most sentences in most documents
						are not like that, and most cascaded updates are exactly what they look like: a version
						number that needed changing. The failure described here is a minority case. It is an
						unbounded minority, because nothing in the design can count it.
					</p>
					<p>
						<strong>The cascade is compressed.</strong> Three cascades, three clean changes, one
						broken line. A real course would produce more changes, most of them boring, and the
						broken line would be somewhere in the middle of them rather than second in a list of
						five.
					</p>
					<p>
						<strong>What was cut.</strong> How you specify quality to a generator at all, which the
						same tool handles with five worked examples and five prohibitions in its prompt, and
						which is a page of its own. And whether anybody learned anything, which is assessment,
						and is a different subject.
					</p>
					<p>
						<strong>The mechanism here is not exotic and it is not confined to machines.</strong>
						Every failure on this page would happen just as readily with a diligent human researcher
						in the tool's place, proposing the same correct updates for the same good reasons.
						Nothing above turns on the updates having been generated. It turns on review being
						cheaper than authorship, which is the condition that made anybody want to automate it in
						the first place.
					</p>
					<p>
						<strong>My own answers</strong>, marked in the tally, are 1c, 2b, 3b, 4c, 5c. I
						recommend a diff while telling you a diff is the trap, because the trap is not that a
						diff is wrong. It is that a diff is right and insufficient, and the second half of that
						sentence is the part nobody builds for. The rest of my answer is an attempt to pay for
						that second half: sort by consequence so something at least points inwards from a
						change, take the one signal that comes from learners rather than from publishers, and
						put an age on every line so that standing still eventually costs something.
					</p>
					<p>
						It is not a solution and I would rather not dress it as one. Every part of it spends the
						same evening, and the evening was already too small at decision one. If you build all
						five you have bought yourself a system that fails later and more visibly, which is worth
						something and is not the same as a system that works.
					</p>
				</div>
				<div class="colophon">Last Verified · one of one · specimen: Rhea, module 4, brief 2</div>
			</section>
		{/if}
	</div>
</div>

<style>
	.page {
		--paper: #f6f2e9;
		--paper-sunk: #ede7da;
		--card: #ffffff;
		--ink: #1c1e24;
		--ink-mid: #43474f;
		--ink-soft: #5d6069;
		--rule: #dcd4c4;
		--mark: #2a3f6b;
		--machine: #6e6455;
		--gain: #24503a;
		--cost: #a34a31;

		background: var(--paper);
		min-height: 100dvh;
		color: var(--ink);
		font-family: 'Newsreader', Georgia, serif;
		font-weight: 400;
		font-size: 21px;
		line-height: 1.72;
		padding-bottom: 7rem;
		-webkit-font-smoothing: antialiased;
	}
	.page *,
	.page *::before,
	.page *::after {
		box-sizing: border-box;
	}
	.wrap {
		max-width: 40rem;
		margin: 0 auto;
		padding: 0 1.6rem;
	}

	.eyebrow {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.74rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-soft);
		margin: 0 0 1.4rem;
	}
	.mast {
		padding: 5.5rem 0 3rem;
	}
	.mast h1 {
		font-family: 'Fraunces', Georgia, serif;
		font-variation-settings: 'SOFT' 20, 'WONK' 0, 'opsz' 144;
		font-weight: 700;
		font-size: clamp(2.6rem, 8vw, 4.2rem);
		line-height: 1.02;
		letter-spacing: -0.02em;
		margin: 0 0 1.4rem;
		color: var(--ink);
	}
	.standfirst {
		font-size: 1.24rem;
		line-height: 1.6;
		max-width: 32rem;
		margin: 0;
		color: var(--ink-mid);
	}

	section {
		padding: 3rem 0;
		border-top: 1px solid var(--rule);
	}
	h2 {
		font-family: 'Fraunces', Georgia, serif;
		font-variation-settings: 'SOFT' 20, 'WONK' 0, 'opsz' 90;
		font-weight: 600;
		font-size: clamp(1.6rem, 4.2vw, 2.15rem);
		line-height: 1.16;
		letter-spacing: -0.015em;
		margin: 0 0 1.5rem;
		color: var(--ink);
	}
	h3 {
		font-family: 'Fraunces', Georgia, serif;
		font-variation-settings: 'SOFT' 20, 'WONK' 0, 'opsz' 40;
		font-weight: 600;
		font-size: 1.28rem;
		line-height: 1.25;
		margin: 2.4rem 0 0.9rem;
		color: var(--ink);
	}
	p {
		margin: 0 0 1.3rem;
		max-width: 36rem;
	}
	p.lead {
		font-size: 1.1rem;
	}
	strong {
		font-weight: 500;
		color: var(--ink);
	}
	.page :global(em) {
		font-style: italic;
	}
	.term {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.9em;
		color: var(--mark);
		font-weight: 500;
	}

	.howto {
		background: var(--paper-sunk);
		border: 1px solid var(--rule);
		border-radius: 3px;
		padding: 1.2rem 1.35rem;
		margin: 2rem 0;
	}
	.howto-lab {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.7rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--mark);
		margin-bottom: 0.6rem;
	}
	.howto p {
		font-size: 0.98rem;
		color: var(--ink-mid);
		margin: 0 0 0.8rem;
		max-width: none;
	}
	.howto p:last-child {
		margin-bottom: 0;
	}
	.howto.waiting {
		border-style: dashed;
	}

	/* ---------- the specimen ---------- */

	.doc {
		background: var(--card);
		border: 1px solid var(--rule);
		border-radius: 3px;
		padding: 1.5rem 1.5rem 1.3rem;
		margin: 2rem 0;
	}
	.doc-cap {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-soft);
		margin-bottom: 1.1rem;
	}
	.doc-field {
		margin-bottom: 1.1rem;
	}
	.doc-field:last-child {
		margin-bottom: 0;
	}
	.doc-key {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--mark);
		display: block;
		margin-bottom: 0.3rem;
	}
	.doc-val {
		font-size: 1rem;
		line-height: 1.62;
		color: var(--ink);
		margin: 0;
		max-width: none;
	}
	.doc-val ul {
		margin: 0;
		padding-left: 1.15rem;
	}
	.doc-val li {
		margin-bottom: 0.35rem;
	}
	.doc-sub {
		margin: 0 0 0.4rem;
	}

	.was {
		color: var(--machine);
	}
	.was::after {
		/* the space ends the escape; without it the c of changed reads as a hex digit */
		content: '\00a0\00a0\25B8\00a0 changed by a cascade';
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.68rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--machine);
		white-space: nowrap;
	}
	.stood {
		color: var(--mark);
		border-left: 3px solid var(--mark);
		padding-left: 0.75rem;
		display: block;
	}
	.stood::after {
		content: '\00a0\00a0\25AA\00a0not in any diff';
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.68rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--mark);
		white-space: nowrap;
	}

	.typed {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.86rem;
		line-height: 1.75;
		background: var(--paper-sunk);
		border: 1px solid var(--rule);
		border-radius: 3px;
		padding: 0.9rem 1.05rem;
		margin: 1.2rem 0;
		color: var(--ink-mid);
		white-space: pre-wrap;
		overflow-x: auto;
	}

	/* ---------- questions ---------- */

	.q {
		margin: 2.2rem 0 0;
	}
	.q-text {
		font-size: 1.08rem;
		margin: 0 0 1.1rem;
		max-width: 34rem;
		font-weight: 500;
	}
	.opts {
		display: grid;
		gap: 0.6rem;
	}
	.opt {
		text-align: left;
		background: var(--card);
		border: 1px solid var(--rule);
		color: var(--ink);
		font-family: 'Newsreader', Georgia, serif;
		font-size: 1.02rem;
		font-weight: 400;
		padding: 0.95rem 1.15rem;
		border-radius: 3px;
		cursor: pointer;
		line-height: 1.5;
		width: 100%;
	}
	.opt:hover {
		border-color: var(--mark);
	}
	.opt:focus-visible {
		outline: 3px solid var(--mark);
		outline-offset: 2px;
	}
	.opt[aria-pressed='true'] {
		border-color: var(--mark);
		border-width: 2px;
		padding: 0.9rem 1.1rem;
	}
	.opt[aria-pressed='true']::before {
		content: '\2713\00a0\00a0';
		color: var(--mark);
		font-weight: 600;
	}

	.answer {
		margin: 1.6rem 0 0;
		padding: 1.25rem 1.4rem;
		background: var(--paper-sunk);
		border: 1px solid var(--rule);
		border-radius: 3px;
	}
	.answer p {
		font-size: 1.02rem;
		color: var(--ink-mid);
		margin: 0 0 0.95rem;
		max-width: none;
	}
	.answer p:last-child {
		margin-bottom: 0;
	}
	.answer .side {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.68rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		display: block;
		margin-bottom: 0.4rem;
	}
	.answer .side.for {
		color: var(--gain);
	}
	.answer .side.against {
		color: var(--cost);
	}

	.insert {
		margin-top: 1.1rem;
		padding: 0.85rem 1.1rem;
		border-left: 3px solid var(--machine);
		background: var(--card);
		border-radius: 0 3px 3px 0;
		font-size: 0.96rem;
		line-height: 1.65;
		color: var(--ink-mid);
	}
	.insert b {
		display: block;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.66rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--machine);
		font-weight: 500;
		margin-bottom: 0.3rem;
	}

	/* ---------- the tally ---------- */

	.tally {
		margin: 2rem 0 0;
	}
	.tally-group {
		margin-bottom: 1.6rem;
	}
	.tally-head {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-soft);
		margin-bottom: 0.6rem;
		padding-bottom: 0.4rem;
		border-bottom: 1px solid var(--rule);
	}
	.tally-row {
		background: var(--card);
		border: 1px solid var(--rule);
		border-radius: 3px;
		padding: 0.9rem 1.1rem;
		margin-bottom: 0.5rem;
	}
	.tally-row.yours {
		border-color: var(--mark);
		border-width: 2px;
		padding: 0.85rem 1.05rem;
	}
	.tally-opt {
		font-size: 1rem;
		color: var(--ink);
		margin: 0 0 0.55rem;
		max-width: none;
		font-weight: 500;
	}
	.tally-mine {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.66rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--mark);
		margin-left: 0.5rem;
	}
	.tally-line {
		font-size: 0.95rem;
		line-height: 1.6;
		margin: 0 0 0.35rem;
		max-width: none;
	}
	.tally-line:last-child {
		margin-bottom: 0;
	}
	.tally-line .g {
		color: var(--gain);
		font-weight: 500;
	}
	.tally-line .c {
		color: var(--cost);
		font-weight: 500;
	}

	/* ---------- closing ---------- */

	.quiet {
		background: var(--paper-sunk);
		border: 1px solid var(--rule);
		border-radius: 3px;
		padding: 1.6rem 1.5rem;
		margin: 1.8rem 0 0;
	}
	.quiet p:last-child {
		margin-bottom: 0;
	}
	.colophon {
		margin-top: 4rem;
		padding-top: 1.6rem;
		border-top: 1px solid var(--rule);
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.74rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	@media (max-width: 560px) {
		.page {
			font-size: 19.5px;
		}
		.mast {
			padding: 3.5rem 0 2.4rem;
		}
		section {
			padding: 2.4rem 0;
		}
		.was::after,
		.stood::after {
			white-space: normal;
		}
	}
</style>
