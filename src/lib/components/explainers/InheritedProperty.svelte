<script lang="ts">
	import './unhurried/unhurried.css';
	import HowTo from './unhurried/HowTo.svelte';
	import Question from './unhurried/Question.svelte';
	import Word from './unhurried/Word.svelte';
	import { ROMANCE, HORSE, SPEAK } from './inherited-property-data';

	let reveal = $state(0);
	let openJoint = $state<number | null>(null);
	let colourGuess = $state<string | null>(null);
	let dug = $state(false);
	let stage = $state(0);
	let checked = $state(false);

	const PACIFIC_LEN = 3;
	const NEGATION_LEN = 3;
</script>

<div class="un-shell">
	<div class="un-root">
		<div class="un-wrap">
			<header class="un-mast">
				<p class="un-eyebrow">One of six · Historical linguistics</p>
				<h1>Inherited Property</h1>
				<p class="un-standfirst">
					Nobody knows anything at all about the people who spoke the languages that English and
					Hindi and Greek all came from. They left no buildings, no graves anybody can identify, and
					no writing.
					<br />
					<br />
					But the words survived, passed mouth to mouth for five thousand years, and it turns out
					that if you sort those words carefully enough they will tell you where those people lived
					and what they had invented.
				</p>
			</header>

			<section class="un-section">
				<h2>You already believe in one of these.</h2>
				<p class="un-lead">
					French, Spanish and Italian are related to one another. You knew that before you opened
					this, and you probably know roughly why. The Roman empire covered all three countries, and
					these languages are what became of Latin in each of them after Rome stopped running
					things.
				</p>

				<div class="un-table">
					<div class="un-table-cap">{ROMANCE.caption}</div>
					{#each ROMANCE.rows as r (r.lang)}
						<div class="un-row">
							<span class="un-lang">{r.lang}</span>
							<Word parts={r.parts} />
						</div>
					{/each}
					<div class="un-row parent">
						<span class="un-lang">{ROMANCE.parent.lang}</span>
						<span class="un-word">{ROMANCE.parent.form}</span>
					</div>
					<p class="un-table-note">
						Nobody finds that suspicious, and nobody should. These are not five similar languages
						that happen to resemble each other. They are one language &mdash; Latin &mdash; in five
						different states of having changed, because every generation speaks a little
						differently from the one before it, and two thousand years of a little adds up.
					</p>
				</div>

				<p>
					That is what a language family is. Not a resemblance, and not one language borrowing a
					word from another. A group of languages that are all the same language, further along.
				</p>

				<h3>Two things follow, and the second one is the whole subject</h3>
				<p>
					The first is that relatives need not be recognisable to each other. A Portuguese speaker
					and a Romanian speaker cannot hold a conversation, despite the fact that both of them are
					speaking Latin.
				</p>
				<p>
					The second is about luck. <strong>Latin happens to be sitting in a library.</strong> We
					have it. We can look at the parent and check the children against it. Almost no other
					family of languages in the world comes with its parent still available, and the actual
					work of this subject is recovering a parent that nobody ever wrote down.
				</p>
				<p>
					Which raises a perfectly fair objection, and you should hold onto it as you read on. A
					great many words in completely unrelated languages resemble one another by pure chance. So
					resemblance on its own cannot possibly be the test. Something else has to be.
				</p>
			</section>

			<section class="un-section">
				<h2>You already own two words from a family you have never heard of.</h2>
				<p class="un-lead">
					<em>Taboo</em> and <em>tattoo</em>. Captain Cook's crews picked them up in the Pacific in
					the seventeen-sixties and seventies and carried them home, and they have been sitting in
					the English language ever since, doing perfectly ordinary work and looking entirely
					English.
				</p>
				<p>
					They belong to a family of about twelve hundred languages, spread across the Pacific and
					Indian oceans. That family is nothing like the Romance one. There is no Latin sitting in a
					library. Nobody wrote the parent language down, nobody recorded an empire, and there was
					no empire.
				</p>
				<p>
					So on what grounds is anybody entitled to say these languages are related? Here is the
					answer, and it is the answer to the objection from the last section.
				</p>
				<p>
					<strong>
						The test is not whether the words look alike. The test is whether the differences
						between them are consistent.
					</strong>
					If one language has a <span class="un-term">k</span> in every single place where its
					neighbours have a <span class="un-term">t</span>, word after word after word, that is not a
					resemblance. That is a rule, being applied without exception by people who had no idea they
					were applying it.
				</p>
				<p>
					Chance does not produce rules like that. Borrowing does not either, because borrowed words
					arrive one at a time and do not reshape an entire vocabulary in step. Watch for the rule in
					the tables below.
				</p>

				<HowTo>
					The button underneath each table brings up the next one. There are three, and each adds
					languages further away than the last.
				</HowTo>

				{#if reveal >= 0}
					<div class="un-table">
						<div class="un-table-cap">&lsquo;Forbidden&rsquo;, or &lsquo;set apart&rsquo; &mdash; five Polynesian languages</div>
						<div class="un-row"><span class="un-lang">Tongan</span><Word parts={['', 'tapu', '']} /></div>
						<div class="un-row"><span class="un-lang">Samoan</span><Word parts={['', 'tapu', '']} /></div>
						<div class="un-row"><span class="un-lang">Māori</span><Word parts={['', 'tapu', '']} /></div>
						<div class="un-row"><span class="un-lang">Tahitian</span><Word parts={['', 'tapu', '']} /></div>
						<div class="un-row"><span class="un-lang">Hawaiian</span><Word parts={['', 'kapu', '']} /></div>
						<p class="un-table-note">
							English borrowed this word from Tongan in the 1770s and spelled it <em>taboo</em>. Now
							look at the last line. Hawaiian has a <span class="un-term">k</span> where all four of
							the others have a <span class="un-term">t</span>. On its own, that means nothing
							whatsoever. Two words can begin differently by pure accident. The question worth asking
							is whether it happens again.
						</p>
					</div>
				{/if}
				{#if reveal >= 1}
					<div class="un-table">
						<div class="un-table-cap">&lsquo;Person&rsquo; &mdash; the same five languages</div>
						<div class="un-row"><span class="un-lang">Tongan</span><Word parts={['', 'tangata', '']} /></div>
						<div class="un-row"><span class="un-lang">Samoan</span><Word parts={['', 'tagata', '']} /></div>
						<div class="un-row"><span class="un-lang">Māori</span><Word parts={['', 'tangata', '']} /></div>
						<div class="un-row"><span class="un-lang">Tahitian</span><Word parts={['', "ta’ata", '']} /></div>
						<div class="un-row"><span class="un-lang">Hawaiian</span><Word parts={['', 'kanaka', '']} /></div>
						<p class="un-table-note">
							It happens again, and twice in the same word. Hawaiian has <span class="un-term">k</span>
							in both places where the others have <span class="un-term">t</span>. Tahitian has done
							something different but equally consistent: it has dropped the middle consonant
							altogether and left a small catch in the throat where it used to be.
							<br />
							<br />
							This is the point on which the entire subject rests, so it is worth saying slowly.
							Neither language is varying at random. Each one is applying a rule of its own, to every
							word it inherited, without exception &mdash; and without any speaker ever deciding to
							do it or noticing that they had.
						</p>
					</div>
				{/if}
				{#if reveal >= 2}
					<div class="un-table">
						<div class="un-table-cap">&lsquo;Eye&rsquo; &mdash; now across the whole family</div>
						<div class="un-row"><span class="un-lang">Malagasy &middot; Madagascar</span><Word parts={['ma', 's', 'o']} /></div>
						<div class="un-row"><span class="un-lang">Malay &middot; Sumatra</span><Word parts={['ma', 't', 'a']} /></div>
						<div class="un-row"><span class="un-lang">Tagalog &middot; Philippines</span><Word parts={['ma', 't', 'a']} /></div>
						<div class="un-row"><span class="un-lang">Fijian &middot; Fiji</span><Word parts={['ma', 't', 'a']} /></div>
						<div class="un-row"><span class="un-lang">Māori &middot; New Zealand</span><Word parts={['ma', 't', 'a']} /></div>
						<div class="un-row"><span class="un-lang">Hawaiian &middot; Hawai‘i</span><Word parts={['ma', 'k', 'a']} /></div>
						<p class="un-table-note">
							Now compare the first line with the last. Malagasy is spoken on Madagascar, off the
							east coast of Africa. Hawaiian is spoken in the middle of the Pacific Ocean. Between
							those two points lie something like fifteen thousand miles of open water.
							<br />
							<br />
							The same rules connect them. This family of languages runs from the coast of Africa to
							Easter Island, better than halfway around the world, and it got there by boat &mdash;
							and these words are a large part of how anybody knows that it did.
						</p>
					</div>
				{/if}

				<button
					class="un-btn"
					onclick={() => (reveal = Math.min(reveal + 1, PACIFIC_LEN - 1))}
					disabled={reveal >= PACIFIC_LEN - 1}
				>
					{reveal >= PACIFIC_LEN - 1
						? 'That is the whole family'
						: reveal === 0
							? 'Show me the same rule in another word'
							: 'Now widen it to the whole family'}
				</button>

				{#if reveal >= PACIFIC_LEN - 1}
					<p style="margin-top: 2rem;">
						One last thing about that table. Malagasy's closest relatives are not anywhere in
						Africa. They are in southern Borneo, six thousand kilometres east across open ocean.
						Somebody made that crossing, in boats, more than a thousand years ago. The only
						surviving record that they did it is the way people in Madagascar say the word for eye.
					</p>
				{/if}
			</section>

			<section class="un-section">
				<h2>Your language has settings, and you cannot feel them from inside.</h2>
				<p class="un-lead">
					The obvious way to think about a language is as a set of names for things that were
					already out there in the world, with translation being a matter of swapping one label for
					another.
				</p>
				<p>
					That is not quite how it works. Every language has settled on which distinctions are worth
					building into its words, and different languages have settled differently. Some of those
					decisions are optional, in the sense that you can always add more words if you want to be
					precise. Others are compulsory: the grammar will not let you finish the sentence until you
					have chosen a side.
				</p>
				<p>Before the examples, one question. Answer it quickly.</p>

				<Question
					text="How many basic colours are there between the sky on a clear day and deep water at dusk?"
					options={[
						{ key: 'one', label: 'One. They are both blue.' },
						{ key: 'two', label: 'Two. Those are quite different colours.' },
						{ key: 'depends', label: 'That depends on which language you are asking in.' }
					]}
					value={colourGuess}
					onPick={(k) => (colourGuess = k)}
				/>

				{#if colourGuess === 'one'}
					<div class="un-answer">
						<p>
							That is the English answer, and the interesting thing about it is that it does not
							feel like an answer at all. It feels like a straightforward observation about light.
							Roughly half the people reading this sentence in translation would have said two, and
							it would have felt equally obvious to them.
						</p>
					</div>
				{/if}
				{#if colourGuess === 'two'}
					<div class="un-answer">
						<p>
							Then either you speak one of the languages that divides them, or you are being
							unusually careful. Most English speakers say one, and say it in the tone of somebody
							reporting a fact about the world rather than a fact about their own vocabulary.
						</p>
					</div>
				{/if}
				{#if colourGuess === 'depends'}
					<div class="un-answer">
						<p>
							Quite right. And the genuinely interesting part is not that languages differ, which
							one would expect. It is that speakers of each one experience their own answer as a
							fact about colour.
						</p>
					</div>
				{/if}

				<p style="margin-top: 1.8rem;">
					Four examples follow. The first two come from languages you probably do not speak. The
					last two are in the one you are reading now.
				</p>

				<HowTo>
					Each of these is a question. Tap one to open the answer, and tap it again to close it.
				</HowTo>

				<div class="un-open">
					<div class="un-open-item">
						<button class="un-open-head" onclick={() => (openJoint = openJoint === 0 ? null : 0)} aria-expanded={openJoint === 0}>
							<span>How many blues are there?</span>
							<span class="un-open-mark">{openJoint === 0 ? 'close' : 'open'}</span>
						</button>
						{#if openJoint === 0}
							<div class="un-open-body">
								<p>
									English has one basic word for blue. If you want to be more precise, you add
									something to it: light blue, navy blue, sky blue. Those are all understood as
									versions of a single colour.
								</p>
								<p>
									Russian has two words, and they are not versions of one another.
									<span class="un-term">Goluboy</span> and <span class="un-term">siniy</span> are
									separate basic colours in the way that pink and red are separate colours for an
									English speaker. Ask a Russian speaker to name the colour of a clear sky and then
									the colour of deep water, and they are not choosing between two shades of the
									same thing. They are naming two different things.
								</p>
								<p>
									<strong>There is a measurable consequence.</strong> In laboratory tests, Russian
									speakers are consistently faster at telling those two ranges of colour apart than
									English speakers are, because their language obliges them to mark the boundary
									every time they mention either one.
								</p>
								<p>
									And here is the part that matters. Neither group experiences its own arrangement
									as a decision that anybody made. Each simply sees the colours that are there.
								</p>
							</div>
						{/if}
					</div>
					<div class="un-open-item">
						<button class="un-open-head" onclick={() => (openJoint = openJoint === 1 ? null : 1)} aria-expanded={openJoint === 1}>
							<span>Can you say &ldquo;my brother&rdquo; without saying more than that?</span>
							<span class="un-open-mark">{openJoint === 1 ? 'close' : 'open'}</span>
						</button>
						{#if openJoint === 1}
							<div class="un-open-body">
								<p>
									In English, yes. You can mention a brother and stop. Whether he is older or
									younger than you is additional information, which you supply if it happens to be
									relevant.
								</p>
								<p>
									Hungarian does not offer that option. <span class="un-term">Báty</span> means an
									older brother and <span class="un-term">öcs</span> means a younger one, and there
									is no ordinary neutral word that covers both. Japanese works the same way, with
									<span class="un-term">ani</span> and <span class="un-term">otōto</span>.
								</p>
								<p>
									<strong>
										So a speaker of either language cannot refer to a brother at all without
										revealing the birth order.
									</strong>
									It is not a detail they are choosing to include, and there is no polite way to
									withhold it. It is built into the only words available.
								</p>
							</div>
						{/if}
					</div>
					<div class="un-open-item">
						<button class="un-open-head" onclick={() => (openJoint = openJoint === 2 ? null : 2)} aria-expanded={openJoint === 2}>
							<span>How do you know?</span>
							<span class="un-open-mark">{openJoint === 2 ? 'close' : 'open'}</span>
						</button>
						{#if openJoint === 2}
							<div class="un-open-body">
								<p>
									English lets you report something without saying how you found out.
									<em>He came yesterday</em> works equally well whether you watched him arrive,
									heard about it from a neighbour, or worked it out from the wet coat in the hall.
								</p>
								<p>
									Turkish makes you choose before the sentence can end.
									<span class="un-term">Geldi</span> claims direct knowledge: you were there and you
									saw it. <span class="un-term">Gelmiş</span> marks the opposite: you were told, or
									you inferred it afterwards.
								</p>
								<p>
									<strong>There is no third form that stays out of the question.</strong>
									Every statement a Turkish speaker makes about somebody else's past actions commits
									them to an account of their own evidence, whether they wanted to give one or not.
								</p>
								<p>
									This is a real difference in what a language requires of the person using it,
									rather than a difference in what it permits them to say.
								</p>
							</div>
						{/if}
					</div>
					<div class="un-open-item">
						<button class="un-open-head" onclick={() => (openJoint = openJoint === 3 ? null : 3)} aria-expanded={openJoint === 3}>
							<span>Do these boundaries stay where they are?</span>
							<span class="un-open-mark">{openJoint === 3 ? 'close' : 'open'}</span>
						</button>
						{#if openJoint === 3}
							<div class="un-open-body">
								<p>They do not, and English is a very good place to watch them move.</p>
								<p>
									<span class="un-term">Silly</span> began as an Old English word,
									<span class="un-term">gesǦlig</span>, which meant blessed. Blessed shaded into
									innocent. Innocent shaded into naive. Naive shaded into foolish, which is where it
									sits today.
								</p>
								<p>
									<span class="un-term">Nice</span> arrived in English from the Latin
									<span class="un-term">nescius</span>, meaning ignorant, and worked its way through
									foolish, then shy, then fastidious, before settling into its present job.
								</p>
								<p>
									<strong>
										Each step happened because somebody used a word in a situation where two
										readings were both available, and a listener took one of them.
									</strong>
									Nothing decayed, and nobody made a mistake. An enormous number of very small
									decisions accumulated, and the word ended up somewhere its earliest speakers would
									not have recognised.
								</p>
							</div>
						{/if}
					</div>
				</div>
			</section>

			<section class="un-section">
				<h2>How would you find out what a people farmed?</h2>
				<p class="un-lead">
					Take a community that left no farms anybody has found, no tools, no graves that can be
					identified as theirs, and not one line of writing. Nothing survives of them at all except
					the language, and even that only in the form of its descendants, thousands of years later.
				</p>
				<p>
					You can still find out what they grew, what animals they kept, and what they had invented.
					The reasoning runs in four steps, and each one is small.
				</p>
				<p>
					A word turns up right across a family of languages. In each branch it obeys that branch's
					own sound rules exactly, which is how you know it was inherited from the parent rather
					than borrowed from a neighbour later on. Therefore the shared ancestor must have had the
					word. And if the ancestor had a word for a thing, the ancestor had the thing.
				</p>
				<p>
					Which turns a list of words into an archaeological site, for a people who left no pottery
					anybody can point at.
				</p>

				<HowTo>
					Each entry below opens with the surviving words you can go and check for yourself, and the
					reconstructed ancestor sits above them, marked with an asterisk to show that nobody ever
					wrote it down.
				</HowTo>

				{#if dug}
					<div style="margin-top: 1.6rem;">
						<div class="un-fossil">
							<div class="un-fossil-head">
								<span class="un-fossil-form">*kʷekʷlos</span>
								<span class="un-fossil-gloss">wheel</span>
								<span class="un-fossil-fam">the ancestor of English, Greek and Sanskrit</span>
							</div>
							<div class="un-fossil-kids">
								<div><span class="src">English </span>wheel</div>
								<div><span class="src">Greek </span>kúklos &mdash; which gives us cycle, bicycle, encyclopedia</div>
								<div><span class="src">Sanskrit </span>cakra &mdash; which gives us chakra</div>
								<div><span class="src">Old Norse </span>hjól</div>
							</div>
							<div class="un-fossil-body">
								<p>
									The same word sits underneath all four of those, in branches of the family that
									had no contact with one another for thousands of years. That pattern means it was
									inherited from the common ancestor, rather than borrowed between them later on.
								</p>
								<p>
									<strong>Which produces a date, and this is the elegant part.</strong> Wheeled
									vehicles do not appear anywhere in the archaeological record before roughly 3500
									BC. If the ancestral community already had a shared word for the wheel, then that
									community had not yet broken up when the wheel reached it.
								</p>
								<p>
									So the family tree acquires a floor. It cannot be older than the wheel, and we
									know when the wheel is.
								</p>
							</div>
						</div>
						<div class="un-fossil">
							<div class="un-fossil-head">
								<span class="un-fossil-form">*melit</span>
								<span class="un-fossil-gloss">honey</span>
								<span class="un-fossil-fam">the same ancestor</span>
							</div>
							<div class="un-fossil-kids">
								<div><span class="src">Greek </span>méli &mdash; surviving in English as mellifluous</div>
								<div><span class="src">Latin </span>mel &mdash; surviving in English as molasses</div>
								<div><span class="src">English </span>mildew, which was originally mildeāw, ‘honey-dew’</div>
								<div><span class="src">Hittite </span>milit</div>
							</div>
							<div class="un-fossil-body">
								<p>
									They had honey, and separately they had a word for the drink fermented from it,
									which we would call mead.
								</p>
								<p>
									English lost the root almost entirely. It survives in one unexpected place.
									<em>Mildew</em> began as a word about the sticky deposits found on plants, and drifted
									across to describe damp walls, carrying the old word for honey inside it the whole
									way.
								</p>
								<p>
									<strong>The absences do work as well as the presences.</strong> There is no equally
									secure shared word for the sea, and that gap has kept scholars arguing about where
									these people lived for well over a century.
								</p>
							</div>
						</div>
						<div class="un-fossil">
							<div class="un-fossil-head">
								<span class="un-fossil-form">*ama</span>
								<span class="un-fossil-gloss">outrigger float</span>
								<span class="un-fossil-fam">the Polynesian ancestor</span>
							</div>
							<div class="un-fossil-kids">
								<div><span class="src">Hawaiian </span>ama</div>
								<div><span class="src">Māori </span>ama</div>
								<div><span class="src">Samoan </span>ama</div>
								<div><span class="src">Fijian </span>cama</div>
							</div>
							<div class="un-fossil-body">
								<p>
									Back to the family from the first section. An outrigger is the beam lashed
									parallel to a canoe's hull to stop it rolling over, and this is the word for it. It
									is still the standard term among people who paddle outrigger canoes today.
								</p>
								<p>
									<strong>
										A community with a dedicated word for that specific component has solved the
										problem of open-water sailing.
									</strong>
									What follows from solving it is the largest expansion by sea that anybody managed
									anywhere before the modern era.
								</p>
							</div>
						</div>
						<div class="un-fossil">
							<div class="un-fossil-head">
								<span class="un-fossil-form">*beRas</span>
								<span class="un-fossil-gloss">husked rice</span>
								<span class="un-fossil-fam">the wider Pacific ancestor</span>
							</div>
							<div class="un-fossil-kids">
								<div><span class="src">Malay </span>beras</div>
								<div><span class="src">Javanese </span>beras</div>
								<div><span class="src">Tagalog </span>bigas</div>
								<div><span class="src">Malagasy </span>vary</div>
							</div>
							<div class="un-fossil-body">
								<p>
									The same family again, and it fills in the other half of the picture. These
									people were farmers before they were sailors, and they took the crop with them
									when they went.
								</p>
								<p>
									<strong>
										Put the two words side by side and you have people with the technology to
										cross an ocean and a reason to want somewhere to plant when they arrive.
									</strong>
									The vocabulary amounts to a packing list for a way of life that nobody ever wrote
									down.
								</p>
							</div>
						</div>
					</div>
				{/if}

				<button class="un-btn" onclick={() => (dug = true)} disabled={dug}>
					{dug ? 'The inventory is open' : 'Open the inventory'}
				</button>

				{#if dug}
					<h3>The best evidence of all comes from people trying to stop something</h3>
					<p>
						Around the third century AD, somebody compiled a list of corrections for students of
						Latin. It is a very ordinary sort of document: say this, not that. Say
						<span class="un-term">vetulus</span>, not <span class="un-term">veclus</span>. Say
						<span class="un-term">auris</span>, not <span class="un-term">oricla</span>.
					</p>
					<p>
						<strong>
							Every single form on the wrong side of that list is the ancestor of the modern word.
						</strong>
						<span class="un-term">Veclus</span> became the Italian <span class="un-term">vecchio</span>.
						<span class="un-term">Oricla</span> became the French <span class="un-term">oreille</span>.
					</p>
					<p>
						A schoolmaster wrote down precisely how ordinary people were speaking, in the act of
						telling them to stop doing it, and it is the only reason we know. Nobody records the
						everyday. People do record what they object to.
					</p>
				{/if}
			</section>

			<section class="un-section">
				<h2>Grammar is not designed. It wears down out of ordinary sentences.</h2>
				<p class="un-lead">
					Nobody sat down and invented the future tense. No committee decided that English needed a
					way to mark politeness, or that French required two separate words in order to say no.
				</p>
				<p>
					What happens instead is erosion. An ordinary word gets used in one particular position so
					often that people stop noticing it. It loses its original meaning, wears down in the
					mouth, and ends up as a piece of grammatical machinery with no content of its own. The
					process takes centuries, which is long enough that nobody living through it can see it
					happening, and short enough that the written record catches the whole thing.
				</p>
				<p>Here is one complete cycle, from beginning to end, in French.</p>

				<HowTo>
					The button brings up the next stage. There are three, and they cover roughly eight
					hundred years.
				</HowTo>

				<div style="margin-top: 1.6rem;">
					{#if stage >= 0}
						<div class="un-stage">
							<span class="un-stage-n">1</span>
							<span class="un-stage-t">
								French once made a verb negative using the word <span class="un-term">ne</span> on
								its own. To give the negative more force, speakers added a small noun naming a tiny
								quantity: a crumb, a drop, a step. So <span class="un-term">je ne marche pas</span>
								originally meant <em>I do not walk a single step</em>, with
								<span class="un-term">pas</span> being the ordinary French word for a step.
							</span>
						</div>
					{/if}
					{#if stage >= 1}
						<div class="un-stage">
							<span class="un-stage-n">2</span>
							<span class="un-stage-t">
								The intensifier spread. It attached itself to verbs that had nothing to do with
								walking, and then to more or less every verb in the language. In doing so it stopped
								meaning a step at all. <span class="un-term">Pas</span> was now simply the second
								half of the negative, carrying no meaning of its own.
							</span>
						</div>
					{/if}
					{#if stage >= 2}
						<div class="un-stage">
							<span class="un-stage-n">3</span>
							<span class="un-stage-t">
								Then <span class="un-term">ne</span> began dropping out of speech altogether. Most
								French speakers today say <span class="un-term">je sais pas</span> rather than
								<span class="un-term">je ne sais pas</span>. So the word for step, which was never the
								negative and only ever turned up to add emphasis, now carries the entire negation by
								itself.
							</span>
						</div>
					{/if}
				</div>

				<button
					class="un-btn"
					onclick={() => (stage = Math.min(stage + 1, NEGATION_LEN - 1))}
					disabled={stage >= NEGATION_LEN - 1}
				>
					{stage >= NEGATION_LEN - 1 ? 'The cycle is complete' : 'Advance the cycle'}
				</button>

				{#if stage >= NEGATION_LEN - 1}
					<p style="margin-top: 2rem;">
						English is partway through something of the same kind. <em>Going to</em> was once a
						statement about walking somewhere. It became a statement about intending something. It
						is now a future tense that has lost the ability to take a destination, which is why
						nobody can say <em>I'm going to the shop</em> and mean it in the new sense.
					</p>
				{/if}
			</section>

			<section class="un-section">
				<h2>One family kept the receipts, so the method can be marked.</h2>
				<p class="un-lead">
					Everything above rests on reconstruction, and reconstruction is exactly the sort of thing
					a person could talk themselves into. You look at some words, you decide what the ancestor
					must have been, and there is nobody available to contradict you.
				</p>
				<p>
					There is one family where you can check the working, and it is the one from the very
					first section. The Romance languages descend from Latin, and Latin is sitting in the
					library.
				</p>
				<p>So do it properly. Reconstruct the ancestor from the children alone, without looking. Then look.</p>

				<div class="un-table">
					<div class="un-table-cap">The word for &lsquo;horse&rsquo;</div>
					{#each HORSE as [lang, w] (lang)}
						<div class="un-row">
							<span class="un-lang">{lang}</span>
							<span class="un-word">{w}</span>
						</div>
					{/each}
					{#if checked}
						<div class="un-row recon">
							<span class="un-lang">Reconstructed</span>
							<span class="un-word">*caballus</span>
						</div>
					{/if}
				</div>

				<div class="un-table">
					<div class="un-table-cap">The word for &lsquo;to speak&rsquo;</div>
					{#each SPEAK as [lang, w] (lang)}
						<div class="un-row">
							<span class="un-lang">{lang}</span>
							<span class="un-word">{w}</span>
						</div>
					{/each}
					{#if checked}
						<div class="un-row recon">
							<span class="un-lang">Reconstructed</span>
							<span class="un-word">*parabolare</span>
						</div>
					{/if}
					<p class="un-table-note">
						Spanish and Portuguese are missing from this second list on purpose. They replaced the
						verb entirely, with <span class="un-term">hablar</span> and
						<span class="un-term">falar</span>, which come down from a different Latin word again. A
						family is under no obligation to keep every word it inherits, and you reconstruct from
						the branches that did keep it.
					</p>
				</div>

				<button class="un-btn" onclick={() => (checked = true)} disabled={checked}>
					{checked ? 'Marked' : 'Now check the answers against Latin'}
				</button>

				{#if checked}
					<p style="margin-top: 2rem;">
						Classical Latin for horse is <span class="un-term">equus</span>. Classical Latin for to
						speak is <span class="un-term">loqui</span>. Neither reconstruction matches the
						textbook, and at first glance the method appears to have failed.
					</p>
					<p>
						<strong>It is the exact opposite of a failure.</strong>
						<span class="un-term">Caballus</span> is a real Latin word, and it is attested. It is the
						everyday term for a nag or a workhorse, the word soldiers and farmers actually used.
						<span class="un-term">Parabolare</span> is late spoken Latin for holding forth at somebody.
					</p>
					<p>
						The method did not recover the language of Cicero, because the Romance languages are
						not descended from the language of Cicero. They are descended from what people were
						saying to each other in the street. So the reconstruction is correct, and it is
						correct about something that the written record had been quietly hiding for two
						thousand years.
					</p>
				{/if}
			</section>

			<section class="un-section">
				<h2>Some of them have no cousins at all.</h2>
				<p>
					Every method on this page needs at least two survivors. You compare them, you find the
					rules, and you run the rules backwards. Take away the relatives and there is nothing to
					compare, and the whole machinery has nothing to bite on.
				</p>
				<p>These languages have no relatives.</p>

				<div class="un-quiet">
					<div class="un-orphans">
						Basque
						<br />
						Sumerian
						<br />
						Elamite
						<br />
						Etruscan
						<br />
						Burushaski
						<br />
						Ainu
					</div>

					<p>
						Basque is spoken by about three quarters of a million people across the western
						Pyrenees, on both sides of the border between Spain and France. It is the only language
						of western Europe that was already there before the Indo-European languages arrived,
						and that is still being used today to order a coffee.
					</p>
					<p>
						That is the part worth sitting with for a moment. Basque is not strange for being
						alone. It is a perfectly ordinary language, behaving in perfectly ordinary ways. It is
						simply the last one.
					</p>
					<p>
						Everything it was once related to is gone. Not badly recorded, not partially preserved:
						gone, without a wordlist, without a cousin, without a name. Western Europe before
						Indo-European was full of languages, and Basque is the only one anybody will ever be
						able to hear.
					</p>
					<p style="color: var(--un-ink-soft); margin-bottom: 0;">
						There is nothing to open in this section. The comparisons are lost forever.
					</p>
				</div>

				<div class="un-colophon">Inherited Property &middot; one of six &middot; the unhurried edition</div>
			</section>
		</div>
	</div>
</div>
