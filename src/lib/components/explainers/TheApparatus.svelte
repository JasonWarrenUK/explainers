<script lang="ts">
	import './unhurried/unhurried.css';
	import Waiting from './unhurried/Waiting.svelte';
	import HowTo from './unhurried/HowTo.svelte';
	import Question from './unhurried/Question.svelte';
	import HistorySection from './unhurried/HistorySection.svelte';
	import {
		rngA,
		wildName,
		tameName,
		buildName,
		spaceSize,
		describeFind,
		SET_A,
		SET_B,
		FIND_SPACE,
		FOLLOW_UP,
		PROHIBITIONS,
		type OnRules,
		type Lens
	} from './apparatus-generator';

	let lens = $state<Exclude<Lens, 'neutral'> | 'refuse' | null>(null);
	let second = $state<string | null>(null);
	let opened = $state(false);
	let roll = $state(0);
	let on = $state<OnRules>({ harmony: false, norepeat: false, openend: false, oneharsh: false });
	let gen = $state(0);
	let seed = $state(31417);
	let layer = $state(0);

	const wild = $derived.by(() => {
		const r = rngA(1234 + roll * 7);
		return Array.from({ length: 8 }, () => wildName(r));
	});
	const tame = $derived.by(() => {
		const r = rngA(8888 + roll * 13);
		return Array.from({ length: 8 }, () => tameName(r));
	});
	const built = $derived.by(() => {
		const r = rngA(20260731 + gen * 31);
		return Array.from({ length: 10 }, () => buildName(r, on));
	});
	const size = $derived(spaceSize(on));
	const nOn = $derived(Object.values(on).filter(Boolean).length);
	const wasRight = $derived(lens === 'production');
	const others = $derived((['rank', 'ritual', 'production'] as const).filter((k) => k !== lens));
	const sample = SET_B[0];
	// Only read once `second` is set, which only happens after `lens` was narrowed
	// to a real Lens (the 'refuse' branch never reaches that state).
	const shownLens = $derived((lens === 'refuse' ? null : lens) as Lens | null);

	function toggleRule(id: keyof OnRules) {
		on = { ...on, [id]: !on[id] };
	}
</script>

<svelte:head>
	<title>The Apparatus</title>
</svelte:head>

<div class="un-shell">
	<div class="un-root">
		<div class="un-wrap">
			<header class="un-mast">
				<p class="un-eyebrow">Four of six · Making stories by machine</p>
				<h1>The Apparatus</h1>
				<p class="un-standfirst">
					It is possible to build a machine that invents stories: you write the rules rather than
					the words, set it running, and read what comes out.
					<br />
					<br />
					The hard part is not making it produce a great deal. Anything can produce a great deal. The
					hard part is making the things it produces feel meaningfully different from one another.
				</p>
			</header>

			<section class="un-section">
				<h2>A word before this one starts.</h2>
				<p class="un-lead">
					The other five explain something and then show you the evidence. This one goes the other
					way round: it asks for your opinion first, and opens the workings at the end. It seemed
					only decent to say so before starting rather than afterwards.
				</p>
				<p>It will make a good deal more sense at the end than it does at the beginning, which is the arrangement.</p>
			</section>

			<section class="un-section">
				<h2>Have a look at these first.</h2>
				<p class="un-lead">
					Below are four objects recovered from a single archaeological site. Do what anybody does
					when handed a set of things: notice a pattern and form a view about what it means.
				</p>
				<p>
					Nobody is available to ask. The people who made these are gone, they left no writing, and
					everything anybody will ever know about them has to come out of the objects themselves.
				</p>

				{#each SET_A as f (f.id)}
					<div class="un-fossil">
						<div class="un-fossil-head">
							<span class="un-fossil-gloss">Find {f.id}</span>
						</div>
						<div class="un-fossil-body">
							<p>{describeFind(f, 'neutral')}</p>
						</div>
					</div>
				{/each}

				<Question
					text="Some of them carry a spiral mark and some do not. What is your best guess about what the mark means?"
					options={[
						{ key: 'rank', label: 'It marks status. These belonged to people who mattered.' },
						{ key: 'ritual', label: 'It marks the sacred. These were used in ceremony.' },
						{ key: 'production', label: 'It marks who made the object, and says nothing about who used it.' },
						{ key: 'refuse', label: 'Four objects is not enough to say anything at all.' }
					]}
					value={lens}
					onPick={(k) => (lens = k as Exclude<Lens, 'neutral'> | 'refuse')}
				/>

				{#if lens === 'refuse'}
					<div class="un-answer">
						<p>That is the correct answer, and it is not available. Four finds will support any of the readings on that list equally well.</p>
						<p>A site director still has to write something down before the next season is funded, so pick a working hypothesis. You are allowed to abandon it later. Everybody in this field is doing exactly this.</p>
					</div>
				{:else if lens}
					<div class="un-answer">
						<p>Reasonable, and the evidence permits it. Hold onto it, because the next three finds are going to be written up by somebody who has read your interim report.</p>
					</div>
				{/if}
			</section>

			{#if !lens || lens === 'refuse'}
				<section class="un-section">
					<Waiting>
						Four more sections follow. Choose one of the four answers above and the next one opens.
					</Waiting>
				</section>
			{/if}

			{#if lens && lens !== 'refuse'}
				{@const activeLens = lens}
				<section class="un-section">
					<h2>Three more from the same site.</h2>
					<p class="un-lead">
						A second season has produced three further objects. The site director has written them
						up, and she has read your interim report.
					</p>
					{#each SET_B as f (f.id)}
						<div class="un-fossil">
							<div class="un-fossil-head">
								<span class="un-fossil-gloss">Find {f.id}</span>
							</div>
							<div class="un-fossil-body">
								<p>{describeFind(f, activeLens)}</p>
							</div>
						</div>
					{/each}
					<Question
						text="At least one of these carries no spiral. What is the most likely explanation?"
						options={FOLLOW_UP[activeLens]}
						value={second}
						onPick={(k) => (second = k)}
					/>
				</section>
			{/if}

			{#if lens && lens !== 'refuse' && !second}
				<section class="un-section">
					<Waiting>The workings open once you have answered the second question.</Waiting>
				</section>
			{/if}

			{#if second}
				<section class="un-section">
					<h2>Now the machine.</h2>
					<p class="un-lead">
						There is no site. There are no objects. Everything you have just read was produced by a
						small generator running inside this page, and its rules fit on a postcard.
					</p>

					{#if !opened}
						<button class="un-btn" onclick={() => (opened = true)}>Open the workings</button>
					{/if}

					{#if opened}
						<div class="un-fossil" style="border-left-color: var(--un-mark);">
							<div class="un-fossil-head">
								<span class="un-fossil-gloss">The rules, in full</span>
							</div>
							<div class="un-fossil-kids">
								<div>the workshop is A or B, chosen at random</div>
								<div>A works in bronze and bone, and always cuts the spiral</div>
								<div>B works in clay and stone, and never cuts the spiral</div>
								<div>form, findspot and wear are independent of all of that</div>
								<div style="color: var(--un-ink-soft);">{FIND_SPACE} possible finds. You were shown seven.</div>
							</div>
						</div>

						<p style="margin-top: 2rem;">
							The spiral marks who made the object. That is the whole of its meaning. There is no
							status in the generator and no ritual either, because neither was ever written into it.
						</p>

						{#if wasRight}
							<h3>You had it right from the first section</h3>
							<p>Now look at what happened next, because being right did not protect you from anything.</p>
							<p>
								The three finds in the second season were written up in the language of manufacture
								— consistency of cut, of alloy, of finish — because that is what you had asked for.
								Every sentence pushed you further towards a conclusion you had already reached, and
								the case would have felt as though it were strengthening.
							</p>
							<p>
								<strong>The evidence did not strengthen.</strong> Four finds underdetermined the question
								and seven underdetermine it in exactly the same way. What changed was the vocabulary,
								and it would have done identical work for a wrong answer.
							</p>
						{:else}
							<h3>You did not reason badly</h3>
							<p>
								This is the part to be precise about. The evidence supports your reading as well as it
								supports any other, which is what it means for a question to be underdetermined.
								Seven objects and no writing will not settle it, and no amount of care would have.
							</p>
							<p>
								What is worth noticing is the second question rather than the first. You were asked
								why one object had no spiral, and you were offered three explanations. All three
								assumed your reading was correct and asked only what sort of exception this was.
							</p>
							<p>
								<strong>The answer that the object simply came out of a different workshop was not on
								the list</strong>, and it was never going to be, because you had already ruled it out
								without knowing that is what you had done.
							</p>
						{/if}

						<h3>The same object, written up four ways</h3>
						<div class="un-fossil">
							<div class="un-fossil-head">
								<span class="un-fossil-gloss">What the generator produced</span>
							</div>
							<div class="un-fossil-body"><p>{describeFind(sample, 'neutral')}</p></div>
						</div>
						<div class="un-fossil">
							<div class="un-fossil-head">
								<span class="un-fossil-gloss">As you were shown it</span>
							</div>
							<div class="un-fossil-body"><p>{describeFind(sample, shownLens!)}</p></div>
						</div>
						{#each others as o (o)}
							<div class="un-fossil">
								<div class="un-fossil-head">
									<span class="un-fossil-gloss">As the {o} reading would have written it</span>
								</div>
								<div class="un-fossil-body"><p>{describeFind(sample, o)}</p></div>
							</div>
						{/each}

						<p style="margin-top: 2rem;">
							The underlying facts are identical in all four. Material, mark, wear, findspot:
							nothing moves. What moves is the language wrapped around them, and none of these
							versions contains a false statement. Each one selects an emphasis and lets the rest
							sit quietly.
						</p>
						<p>
							<strong>That is a mechanism rather than a trick.</strong> A system that filters what somebody
							sees through what they have already said will produce a person who grows more confident
							and no more correct, without having been lied to once.
						</p>
					{/if}
				</section>
			{/if}

			<section class="un-section">
				<h2>Making a lot of things is easy. Making them feel different is not.</h2>
				<p class="un-lead">
					The obvious way to judge a machine like this is by how much it can produce. By that
					measure the generator on the left is far better than the one on the right. It has more
					sounds to draw on, longer words, more possible combinations, and every output it has ever
					made is unique.
				</p>
				<p>
					Read them and see whether that is how it feels. This is a problem the game designer Kate
					Compton gave a name to: you can serve ten thousand bowls of porridge, each one
					mathematically distinct from all the others, and every person you serve will say they have
					been given the same thing twice.
				</p>
				<p>
					The numbers underneath are worth taking literally.
					<strong>Think of a generator as a bag of tiles rather than as a machine.</strong>
					You are not writing the words. You are deciding which tiles go in the bag, and then reaching
					in. The number is how many tiles are in there.
				</p>

				<div class="un-fossil">
					<div class="un-fossil-head">
						<span class="un-fossil-form">Unconstrained</span>
						<span class="un-fossil-gloss">about 660 billion tiles</span>
					</div>
					<div class="un-fossil-kids">
						{#each wild as w, i (i)}<div>{w}</div>{/each}
					</div>
				</div>
				<div class="un-fossil">
					<div class="un-fossil-head">
						<span class="un-fossil-form">Constrained</span>
						<span class="un-fossil-gloss">about 5,700 tiles</span>
					</div>
					<div class="un-fossil-kids">
						{#each tame as w, i (i)}<div>{w}</div>{/each}
					</div>
				</div>
				<button class="un-btn" onclick={() => (roll = roll + 1)}>Run them both again</button>

				<p style="margin-top: 2rem;">
					The second generator can produce roughly a hundred million times fewer things than the
					first, and it is the one that reads as a language. Its words could belong to the same
					people. You could probably invent a plausible new one yourself, which is a sign that you
					have picked up its rules without being told them.
				</p>
				<p>
					The first has more variety and no character at all, so its outputs blur into one another.
					Variety and distinctiveness are not the same quantity, and past a certain point they pull
					in opposite directions.
				</p>

				<h3>The same problem has a twin</h3>
				<p>
					Between them they define the two ways anybody builds a story machine, and both are easier
					to see as objects on a table than as software.
				</p>
				<p>
					The first is <strong>a deck of cards</strong>. Each card has a scene written on the front and
					a condition on the back saying when it may be played, and the machine deals whichever cards
					are currently legal. Every word the reader sees was written by a person. It fails by
					running out: there is only ever as much as somebody found time to write.
				</p>
				<p>
					The second is <strong>a board with pieces on it</strong> that move according to rules, where
					the story is whatever you find yourself narrating while you watch. Nobody wrote any of it.
					It fails by porridge: it will produce events for ever, and almost all of them are
					indistinguishable from one another.
				</p>
				<p>
					Neither failure is a fault to be fixed later. Each is the standing cost of the approach,
					and choosing between them is mostly a decision about which problem you would rather spend
					the next several years on.
				</p>
			</section>

			<section class="un-section">
				<h2>So the design work is deciding what cannot happen.</h2>
				<p class="un-lead">
					Here is the same generator with nothing switched on. It can produce an enormous number of
					words and none of them belong together.
				</p>
				<p>
					Underneath are four prohibitions. Each one removes possibilities and not one of them adds
					anything at all. Switch them on and watch both numbers move: the size of the bag goes
					down, and the sense that these words come from somewhere goes up.
				</p>

				<HowTo>Tap any rule to switch it on or off. The list of words changes immediately.</HowTo>

				<div class="un-fossil">
					<div class="un-fossil-head">
						<span class="un-fossil-form">{nOn === 0 ? 'No rules' : `${nOn} rule${nOn > 1 ? 's' : ''} in force`}</span>
						<span class="un-fossil-gloss">about {size.toLocaleString()} tiles in the bag</span>
					</div>
					<div class="un-fossil-kids">
						{#each built as w, i (i)}<div>{w}</div>{/each}
					</div>
				</div>

				<div class="un-opts" style="margin-top: 1.2rem;">
					{#each PROHIBITIONS as r (r.id)}
						<button class="un-opt" class:chosen={on[r.id]} onclick={() => toggleRule(r.id)}>
							{r.label}
						</button>
					{/each}
				</div>
				<button class="un-btn" onclick={() => (gen = gen + 1)}>Generate a new set of words</button>

				<p style="margin-top: 2.2rem;">
					Back to the bag. The thing you are actually designing is not any of the words that came out
					of it. It is what is in the bag, and every one of those switches takes tiles out. None of
					them puts any in.
				</p>
				<p>
					Which is the part that takes some getting used to. Adding a rule feels like adding
					something, and it is the opposite. A generator gets better by being allowed to do less.
				</p>

				<h3>And what that costs</h3>
				<p>
					This section has so far made only one side of the case, so here is the other. Every
					prohibition deletes outputs, and some of them were good. A rule forbidding a consonant from
					following itself has just removed every name that would have been memorable for precisely
					that reason, and it removed them silently, because a bag of tiles gives you no way of
					inspecting what is no longer in it.
				</p>
				<p>
					Push it far enough and coherence turns into monotony: a bag small enough that a reader sees
					the whole of it and stops looking. There is no formula for where that point sits. It is a
					judgement, made by ear, and it is the part of the job that stays a craft.
				</p>
				<p style="color: var(--un-ink-soft);">The spiral meant something because it was never once cut by the wrong workshop.</p>
			</section>

			<HistorySection bind:seed bind:layer />
		</div>
	</div>
</div>
