<script lang="ts">
	import './unhurried/unhurried.css';
	import HowTo from './unhurried/HowTo.svelte';
	import Question from './unhurried/Question.svelte';
	import Stepped from './unhurried/Stepped.svelte';
	import { LIGHTS } from './the-break-data';

	let guess = $state<string | null>(null);
	let broken = $state(false);
</script>

{#snippet shipExtra()}
	<div class="un-fossil-kids" style="margin-bottom: 1rem;">
		<div><span class="src">from Cyprus </span>ten tonnes of copper, cast in ox-hide ingots</div>
		<div><span class="src">from somewhere east </span>a tonne of tin, roughly the ratio bronze needs</div>
		<div><span class="src">from the Baltic </span>amber</div>
		<div><span class="src">from Africa </span>ebony, hippo and elephant ivory, ostrich eggshell</div>
		<div><span class="src">from Egypt </span>a gold scarab carrying Nefertiti's name</div>
		<div><span class="src">from the Levant </span>jars of resin</div>
		<div><span class="src">from Greece and Cyprus </span>pottery, weapons, tools</div>
	</div>
{/snippet}
{#snippet shipManifest()}
	<p>
		A sponge diver spotted metal slabs on an underwater slope off the coast of Turkey in 1982.
		Eleven diving seasons later, the wreck had produced the most complete cargo anybody has from
		the entire Bronze Age. The list above is a fair summary of what was in it.
	</p>
{/snippet}
{#snippet shipMeaning()}
	<p>
		Copper from one island and tin from thousands of miles away had to meet in the same hull,
		because bronze is an alloy and neither metal is much use on its own.
	</p>
	<p>
		Which means the technology that gives the age its name could not exist unless goods crossed
		continents reliably. The network was not a luxury laid over the period. It was holding the
		period up.
	</p>
	<p>
		<strong>Nobody knows whose ship it was or where it was going.</strong> The single most
		informative object of the period is anonymous. And among the cargo was a wooden writing board
		with an ivory hinge, of the kind that held wax pages. The wax dissolved. The book survived and
		the words did not.
	</p>
{/snippet}

{#snippet amarnaFound()}
	<p>
		Around three hundred and fifty clay tablets turned up at the site of an abandoned Egyptian
		capital. They are the diplomatic correspondence of the Egyptian court with the other great
		powers of the day: Babylonia, Assyria, the Hittites, Cyprus, and a long list of smaller rulers
		in between.
	</p>
	<p>
		Kings address one another as brother, arrange marriages, ask for gold, and complain at length
		when a gift arrives late or turns out to be of lower quality than promised.
	</p>
{/snippet}
{#snippet amarnaMeaning()}
	<p>
		They are written in Akkadian, which was the first language of none of the great kings involved.
		It had become the common tongue of international business, in the way that people who share no
		native language today will negotiate in a third.
	</p>
	<p>
		<strong>A shared working language is not something anybody sets up in an afternoon.</strong> It
		implies generations of scribes trained to the same standard in different countries, a stable
		convention about how a letter should open, and enough traffic to make all of that worth the
		expense.
	</p>
	<p>Which also tells you what sort of thing can break. The whole system runs on everybody continuing to answer.</p>
{/snippet}

{#snippet indusFound()}
	<p>
		By area this was the biggest civilisation of the Bronze Age. Its cities were laid out on
		street grids, built from fired brick made to consistent proportions, and drained by covered
		sewer systems that would not be matched anywhere for thousands of years.
	</p>
	<p>Weights recovered from sites hundreds of miles apart agree with one another to a fraction of a gram.</p>
{/snippet}
{#snippet indusMissing()}
	<p>
		Standardisation on that scale normally means somebody is enforcing it, and enforcement normally
		leaves traces: a palace, a rich burial, a temple, an image of somebody looking as though they
		are in charge.
	</p>
	<p>
		<strong>None of it has been found.</strong> No securely identified palace, no royal tomb, no
		unambiguous depiction of a ruler, and very little sign of organised warfare.
	</p>
	<p>
		Either power was arranged in some way that leaves no trace of the kind we know how to look for,
		or we have spent a century looking for the wrong things.
	</p>
{/snippet}

{#snippet caralFound()}
	<p>
		While the pyramids were going up in Egypt, people in a river valley north of modern Lima were
		raising platform mounds and sunken circular plazas at a site now called Caral. It is among the
		oldest urban complexes anywhere in the world.
	</p>
	<p>
		They did it without pottery, which had not reached them, and with no evidence so far of
		fortification, weaponry or the destruction layers that mark a conquest.
	</p>
{/snippet}
{#snippet caralMissing()}
	<p>
		<strong>They also did it without writing.</strong> The Indus at least left a script, and being
		unable to read a script is a different problem from there being nothing to read.
	</p>
	<p>
		Caral left knotted cords and architecture. Whatever these people understood themselves to be
		doing, the only surviving account of it is the shape of what they built. It is the most opaque
		society on this page by a considerable distance.
	</p>
{/snippet}

{#snippet uruwWhat()}
	<p>
		The oldest substantial writing anybody has is not literature, law or scripture. It is stock
		control. The earliest tablets record quantities of grain, beer, textiles and livestock, and who
		was answerable for them.
	</p>
	<p>
		It grew out of an older habit of sealing small clay tokens inside clay envelopes and marking
		the outside to show what was inside, until somebody noticed the tokens had become redundant.
	</p>
{/snippet}
{#snippet uruwWhy()}
	<p>
		<strong>For several centuries the system cannot record a sentence.</strong> It has signs for
		commodities and numbers and almost nothing for the words in between.
	</p>
	<p>
		So the thing that would eventually carry epic poetry, law, correspondence and every argument
		anybody has ever written down spent its first stretch of existence unable to express anything
		except how much barley was in the shed. Nobody designed it to become what it became.
	</p>
{/snippet}

{#snippet enheduannaWhat()}
	<p>
		Enheduanna was the daughter of Sargon of Akkad and high priestess of the moon god at Ur. A body
		of hymns comes down attached to her name, and by long convention she is the earliest author in
		history who can be called by one.
	</p>
	<p>
		She writes about herself in trouble: driven from her office, appealing to the goddess Inanna,
		describing what the loss of position felt like from the inside.
	</p>
{/snippet}
{#snippet enheduannaFirm()}
	<p>
		<strong>The attribution is not beyond argument.</strong> The surviving copies were made
		centuries after she lived, and scholars differ over how much of the text is hers and how much
		accrued to a famous name later on.
	</p>
	<p>
		That the question can be asked at all is the novelty worth noticing. Before this there is a
		great deal of writing and nobody to attribute any of it to, so there is no earlier case where
		the argument would even be possible.
	</p>
{/snippet}

{#snippet nebraObject()}
	<p>
		A bronze disc about the size of a dinner plate, inlaid with gold: a sun or full moon, a
		crescent, a scatter of stars, and a tight cluster usually read as the Pleiades. It is the
		oldest concrete depiction of the night sky anybody has found.
	</p>
{/snippet}
{#snippet nebraDone()}
	<p>
		It did not stay the same. Gold arcs were added along the edges later, marking how far along the
		horizon the sun rises and sets across the year. A further curved band went on after that. Later
		still, somebody punched holes around the rim, and then it went into the ground.
	</p>
	<p>
		<strong>Each modification is a different generation deciding what the object was for.</strong>
		It is not a finished statement of what these people believed. It is an argument still in
		progress, stopped at the point where somebody buried it.
	</p>
{/snippet}

{#snippet anyangWritten()}
	<p>
		Diviners of the Shang dynasty applied heat to ox shoulder blades and turtle shells until they
		cracked, read the cracks as answers, and inscribed the question alongside. Will the harvest
		hold. Will the king's toothache pass. Is a particular ancestor responsible for the trouble.
	</p>
	<p>
		These are the oldest Chinese writings anybody has, and they are somebody's actual anxieties
		rather than an official account of anything.
	</p>
{/snippet}
{#snippet anyangWhy()}
	<p>
		<strong>Keep this one in mind, because it is the control for everything that follows.</strong>
	</p>
	<p>
		The script on these bones is the direct ancestor of the characters written in China this
		morning. The line of descent has never once been cut, so anyone who learns the modern system
		can be walked back three thousand years to the shells and read them.
	</p>
	<p>Nothing else on this page can say that, and the next section is about why.</p>
{/snippet}

{#snippet creteHave()}
	<p>
		Minoan Crete wrote in a script called Linear A. A later script, Linear B, borrowed a great many
		of its signs in order to write early Greek, and Linear B was successfully cracked in the 1950s.
	</p>
	<p>
		Because the signs are shared, we can make a decent guess at how a Linear A tablet sounded. You
		could read one aloud in a room and be broadly right about the noises.
	</p>
{/snippet}
{#snippet creteMissing()}
	<p>
		<strong>Nobody has the faintest idea what you would be saying.</strong> The language underneath
		is not Greek and matches nothing else known.
	</p>
	<p>
		A century of very capable people have failed at it, and without a text in two languages there
		may be no way in at all. The sound survived the break and the sense did not, which is an
		unusually clean illustration of what a chain of transmission actually carries.
	</p>
{/snippet}

{#snippet egyptHave()}
	<p>
		Egyptian inscriptions describe a coalition arriving by land and sea, overwhelming everything in
		its path, and being fought off. The inscriptions name them: Peleset, Tjeker, Shekelesh, Denyen,
		Weshesh.
	</p>
	<p>
		That is very nearly the whole file. Modern writing calls them the Sea Peoples, which is a
		scholarly convenience rather than anything they would have recognised.
	</p>
{/snippet}
{#snippet egyptMissing()}
	<p><strong>They have no account of themselves anywhere, in any language.</strong></p>
	<p>
		Whether they were invaders, refugees from the collapse, opportunists moving into a vacuum, or
		several unrelated groups filed under one convenient heading is still argued, because the only
		witness available is the empire that fought them and wrote up the victory on a temple wall.
	</p>
{/snippet}

{#snippet greeceHave()}
	<p>
		Greece came out of the break without writing and stayed that way for roughly four hundred
		years. When literacy returned it had to be borrowed: the Greek alphabet is an adaptation of a
		Phoenician one.
	</p>
	<p>Homer is composed at around that point, about a war set in the world that fell.</p>
{/snippet}
{#snippet greeceMissing()}
	<p>
		Some details are genuinely Bronze Age, carried across the whole gap by word of mouth. A helmet
		made of boar's tusks appears in the poems and again in graves of the period, and nobody in
		Homer's own century had ever seen one.
	</p>
	<p>
		<strong>Other details belong to the poet's own century, and the two are mixed together with no
		seam.</strong>
	</p>
	<p>
		Nobody involved could check anything. The archives had burned, the script was gone, and there
		was no living person who had read a word of it.
	</p>
{/snippet}

<div class="un-shell">
	<div class="un-root">
		<div class="un-wrap">
			<header class="un-mast">
				<p class="un-eyebrow">Three of six · The Bronze Age</p>
				<h1>The Break</h1>
				<p class="un-standfirst">
					Three thousand years ago the eastern Mediterranean was a connected world of kingdoms,
					ports and long trade routes. Within about fifty years most of it was destroyed or
					abandoned.
					<br />
					<br />
					The people who came afterwards lived among the ruins, could see them perfectly well, and
					had lost the ability to read a single word of the writing left on them.
				</p>
			</header>

			<section class="un-section">
				<h2>For a few centuries, the world was joined up.</h2>
				<p class="un-lead">
					The Bronze Age takes its name from a metal, and the metal is the reason for everything
					else. Bronze is copper mixed with tin. Copper is common enough in the ancient world. Tin
					is rare, and the places that had it were nowhere near the places that needed it.
				</p>
				<p>
					So a technology that every state depended on, for tools and for weapons alike, could
					only exist if goods moved reliably across enormous distances. That requirement built
					something: a network of kingdoms, ports and agreements running from Greece to
					Mesopotamia and out towards Afghanistan and the Baltic.
				</p>
				<p>Two objects show what that looked like from the inside.</p>

				<HowTo>
					Each exhibit has two steps. Read the first, then press the button to move to the second.
				</HowTo>

				<Stepped
					where="Off the Turkish coast · about 1300 BC"
					title="One ship, and most of the known world inside it"
					extra={shipExtra}
					steps={[
						{ label: 'the manifest', body: shipManifest },
						{ label: 'what it tells you', body: shipMeaning }
					]}
				/>

				<Stepped
					where="Amarna, in Egypt · the 1300s BC"
					title="Kings who had never met, writing to each other as brothers"
					steps={[
						{ label: 'what was found', body: amarnaFound },
						{ label: 'what it tells you', body: amarnaMeaning }
					]}
				/>
			</section>

			<section class="un-section">
				<h2>Two of them refused the template.</h2>
				<p class="un-lead">
					Before the exhibits, a question, because the answer you give is what this section is
					actually about.
				</p>
				<p>
					Imagine archaeologists working on a Bronze Age city. Several hundred hectares. Tens of
					thousands of people. Standardised weights, planned streets, brick made to consistent
					proportions. They have been digging for a hundred years.
				</p>

				<Question
					text="Which of these would you expect them to have found by now?"
					options={[
						{ key: 'palace', label: 'A palace, or something like one.' },
						{ key: 'tomb', label: 'A rich burial for whoever was in charge.' },
						{ key: 'ruler', label: 'An image of a ruler, looking like a ruler.' },
						{ key: 'war', label: 'Evidence of organised warfare.' },
						{ key: 'all', label: 'All of those, frankly. That is what cities have.' }
					]}
					value={guess}
					onPick={(k) => (guess = k)}
				/>

				{#if guess}
					<div class="un-answer">
						<p>
							<strong>Whichever you picked, it has not been found.</strong> Not one of those five,
							at any site of the Indus civilisation, in a century of excavation.
						</p>
						<p>
							The expectation is entirely reasonable and it comes from somewhere. There is a
							standard picture of what an early civilisation looks like, assembled mostly from
							Mesopotamia and Egypt, in which power announces itself in stone.
						</p>
						<p>
							That picture is a description of some places rather than a rule about all of them,
							and carrying it into these two societies guarantees that you will misread what you
							are looking at.
						</p>
					</div>

					<Stepped
						where="Pakistan and north-west India · 2600 to 1900 BC"
						title="The largest of them all, and nobody can find the king"
						steps={[
							{ label: 'what was dug up', body: indusFound },
							{ label: 'what is not there', body: indusMissing }
						]}
					/>

					<Stepped
						where="The Supe valley, Peru · from about 2600 BC"
						title="Monuments, no pottery, and nothing to read"
						steps={[
							{ label: 'what was dug up', body: caralFound },
							{ label: 'what is not there', body: caralMissing }
						]}
					/>
				{/if}
			</section>

			<section class="un-section">
				<h2>Some things had not yet become inevitable.</h2>
				<p class="un-lead">
					Writing, authorship and astronomy all feel like fixed features of human life. The sort
					of thing that was always going to happen, and always going to take roughly the shape it
					took.
				</p>
				<p>
					This period is early enough that you can catch several of them before they settled,
					while the decisions were still being made and could have gone otherwise. The last of
					the four is here for a different reason, and it will matter shortly.
				</p>

				<Stepped
					where="Uruk, southern Iraq · about 3300 BC"
					title="Writing begins as a warehouse problem"
					steps={[
						{ label: 'what the tablets say', body: uruwWhat },
						{ label: 'why that matters', body: uruwWhy }
					]}
				/>

				<Stepped
					where="Ur, southern Iraq · about 2300 BC"
					title="The first person to put her name to her own work"
					steps={[
						{ label: 'what survives', body: enheduannaWhat },
						{ label: 'how firm it is', body: enheduannaFirm }
					]}
				/>

				<Stepped
					where="Nebra, central Germany · about 1600 BC"
					title="An object revised by successive owners"
					steps={[
						{ label: 'the object', body: nebraObject },
						{ label: 'what was done to it', body: nebraDone }
					]}
				/>

				<Stepped
					where="Anyang, northern China · about 1250 BC"
					title="The one that never stopped"
					steps={[
						{ label: 'what they wrote on', body: anyangWritten },
						{ label: 'why it is here', body: anyangWhy }
					]}
				/>
			</section>

			<section class="un-section">
				<h2>Then, in about fifty years, most of it stopped.</h2>
				<p class="un-lead">
					Between roughly 1200 and 1150 BC, city after city in the eastern Mediterranean and the
					Near East was destroyed or abandoned. Some were burned. Some were simply walked away
					from. The trade routes emptied, the correspondence stopped, and the palace
					administrations that had run the whole system ceased to exist.
				</p>
				<p>
					Historians still argue about the cause, and the honest answer is that there probably is
					not one. Drought, earthquake, migration, warfare and the fragility of a system in which
					every state depended on every other are all somewhere in the mix.
				</p>
				<p>
					<strong>What matters here is not why it happened but what it did to the record.</strong>
					Below is a list of things that were running in 1200 BC. Some of them stop. Some of them
					do not, and noticing which is which is the whole point of the exercise.
				</p>

				<HowTo>Press the button underneath the list to run the collapse. You can put it all back afterwards.</HowTo>

				<div class="un-dimmed" class:out={broken} style="margin-top: 1.6rem;">
					{#each LIGHTS as l, i (l.name)}
						<div
							class="un-stage"
							style="border-left-color: {broken && !l.survives
								? 'var(--un-rule)'
								: broken
									? 'var(--un-deep)'
									: 'var(--un-mark-soft)'}; opacity: {broken && !l.survives
								? 0.5
								: 1}; filter: {broken && l.survives
								? 'saturate(6) brightness(1.02)'
								: 'none'}; transition: opacity 600ms ease, border-color 600ms ease, filter 600ms ease; transition-delay: {broken
								? `${i * 150}ms`
								: '0ms'};"
						>
							<span class="un-stage-n" style="color: {broken && !l.survives ? 'var(--un-ink-soft)' : 'var(--un-mark)'};">
								{broken ? (l.survives ? 'held' : 'gone') : '·'}
							</span>
							<span class="un-stage-t">
								<strong style="text-decoration: {broken && !l.survives ? 'line-through' : 'none'};">{l.name}</strong>
								<br />
								<span style="color: var(--un-ink-soft); font-size: 0.95rem;">{broken ? l.note : 'running'}</span>
							</span>
						</div>
					{/each}
				</div>

				<button class="un-btn" onclick={() => (broken = !broken)}>
					{broken ? 'Put it back' : 'Let it happen'}
				</button>

				{#if broken}
					<p style="margin-top: 2.4rem;">
						Four of them held, and that is worth dwelling on, because the shorthand for this
						period encourages you to imagine a global catastrophe. It was not one.
					</p>
					<p>
						Egypt survived in reduced form. Assyria came through. Shang China was entirely
						unaffected and had another two centuries ahead of it. The Andes were on a separate
						trajectory that this had nothing whatever to do with, and the Indus cities had already
						declined several centuries earlier for reasons of their own.
					</p>
					<p>
						<strong>The instinct to globalise it is itself the thing to correct.</strong> What
						collapsed was one very interconnected region, and being interconnected is precisely
						what made it collapsible.
					</p>
					<p>
						The line that matters most on that list is the sixth. Greece did not merely lose its
						palaces. It lost the ability to write, and it did not get it back for four hundred
						years.
					</p>
				{/if}
			</section>

			<section class="un-section">
				<h2>What it looks like from the far side.</h2>
				<p class="un-lead">
					Everything in the first three sections could be opened and read. The ship's cargo has
					been catalogued, the letters have been translated, and the oracle bones can be studied
					by anybody who learns the script.
				</p>
				<p>
					The material below is the same sort of thing. Objects, inscriptions, poems. The
					difference is what happened to the chain carrying them, and that chain is worth
					picturing properly, because it is not a metaphor.
				</p>
				<p>
					<strong>Writing is not a property of a place. It is a line of people</strong>, in which
					every single person who can read learned it from a person who could. There has never
					been any other way of acquiring it. Break that line for one generation and the marks are
					all still there, on the same walls and tablets, and there is nobody alive who can turn
					them back into words.
				</p>
				<p>
					The Shang line has never once been broken, which is why a reader today can be walked
					back to the oracle bones. The line in Greece was cut, and stayed cut for four centuries.
				</p>

				<Stepped
					where="Crete · the script that stopped"
					title="Readable aloud, and meaningless"
					steps={[
						{ label: 'what we have', body: creteHave },
						{ label: 'what is missing', body: creteMissing }
					]}
				/>

				<Stepped
					where="A temple wall in Egypt · about 1177 BC"
					title="A list of enemies, and no other trace"
					steps={[
						{ label: 'what we have', body: egyptHave },
						{ label: 'what is missing', body: egyptMissing }
					]}
				/>

				<Stepped
					where="Greece · four centuries later"
					title="A memory of a memory"
					steps={[
						{ label: 'what we have', body: greeceHave },
						{ label: 'what is missing', body: greeceMissing }
					]}
				/>

				<p style="margin-top: 2.4rem;">
					This is the part worth taking away. A collapse of this kind is not buildings falling
					over. Buildings can be rebuilt, and generally were.
				</p>
				<p>
					What broke was transmission. The people who came afterwards were living among the ruins
					of something they could see perfectly well and could no longer read, in a landscape
					full of writing that had become decoration. Everything they said about it was
					reconstruction, and they had no way of knowing which parts they had got right.
				</p>
				<p style="color: var(--un-ink-soft);">Neither, for a good deal of it, do we.</p>

				<div class="un-colophon">The Break · three of six · the unhurried edition</div>
			</section>
		</div>
	</div>
</div>
