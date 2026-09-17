<script lang="ts">
	import './unhurried/unhurried.css';
	import HowTo from './unhurried/HowTo.svelte';
	import Question from './unhurried/Question.svelte';
	import TwoSided from './unhurried/TwoSided.svelte';

	let guess = $state<string | null>(null);
</script>

<div class="un-shell">
	<div class="un-root">
		<div class="un-wrap">
			<header class="un-mast">
				<p class="un-eyebrow">Two of six · Early medieval history</p>
				<h1>The Other Face</h1>
				<p class="un-standfirst">
					In the centuries after the Roman empire fell, a great many peoples across the world were
					in the middle of inventing themselves: taking names, drawing borders, and acquiring
					ancestors.
					<br />
					<br />
					A surprising amount of what they said about it survives. Almost none of it was written for
					us, and that turns out to be exactly why it can be trusted.
				</p>
			</header>

			<section class="un-section">
				<h2>One monument, two languages, two incompatible accounts.</h2>
				<p class="un-lead">
					Historians call the centuries after the fall of the Roman empire the early medieval
					period. The older nickname, the Dark Ages, was never really about the people who lived
					through it. It was about the sources.
				</p>
				<p>
					There is far less surviving writing from these six hundred years than from the periods
					on either side of them, and most of what does survive was produced by somebody with a
					case to make.
				</p>
				<p>
					That sounds like a problem, and it is also the opening.
					<strong>
						A document that is arguing for something usually tells you who it was arguing with.
					</strong>
				</p>

				<h3>The clearest example anybody has</h3>
				<p>
					In the 730s, in a valley in central Mongolia, two brothers of the ruling family of the
					Turkic khaganate raised carved stones for their dead. A khaganate is a steppe empire;
					this one was a serious military power on the northern border of Tang China, which was at
					that moment the richest and most sophisticated state on earth.
				</p>
				<p>
					The stones carry the oldest substantial writing in any Turkic language &mdash; the family
					that includes modern Turkish. They also carry a second inscription, in Chinese. The two
					texts do not say the same thing, because they were meant for two different audiences who
					were never going to read them side by side.
				</p>

				<HowTo>
					Every exhibit on this page has two sides. Read the first, then press the button
					underneath to turn it over. You can turn it back again at any point.
				</HowTo>

				<TwoSided
					item={{
						when: 'Mongolia · the 730s',
						front: {
							tag: 'Side one of two · the face turned outwards',
							title: 'A gracious note about a loyal neighbour',
							body: orkhonFront
						},
						back: {
							tag: 'Side two of two · the faces turned inwards',
							title: 'A warning to his own people',
							body: orkhonBack
						},
						meanwhile: orkhonMeanwhile
					}}
				/>
				{#snippet orkhonFront()}
					<p>
						One face of the monument is written in Chinese. It was composed at the court of the
						Tang emperor, who sent his own craftsmen several hundred miles north to cut it into the
						stone.
					</p>
					<p>
						Imperial inscriptions of this kind follow a well-worn pattern, and this one keeps to
						it faithfully. The dead man is praised. The relationship between the two houses is
						described as close and cordial. The whole arrangement is presented as settled,
						long-standing and agreeable to everybody concerned.
					</p>
					<p>
						If this were the only face of the stone, the story would be a simple one. A
						cooperative neighbour on the northern frontier, remembered warmly by the greater power
						he served.
					</p>
				{/snippet}
				{#snippet orkhonBack()}
					<p>
						The other faces are written in Old Turkic, in an alphabet cut specifically for the
						purpose, and the audience has changed completely. Bilge Khagan is addressing the
						Turks directly, in his own voice, and he is not being diplomatic in the slightest.
					</p>
					<p>
						His argument is that Chinese generosity is a technique. Sweet words and soft silk are
						how a distant people are drawn in close, and a people drawn in close find that they
						can no longer leave. He points to the Turks who went south believing otherwise, and
						says plainly what became of them.
					</p>
					<p>
						<strong>
							He also states why the stone exists. He is putting this somewhere it can still be
							read after everybody who remembers is dead.
						</strong>
					</p>
					<p>
						It worked, although not in the way he intended. Nobody could read the alphabet at all
						until a Danish scholar named Vilhelm Thomsen worked it out in the 1890s, more than
						eleven hundred years later.
					</p>
				{/snippet}
				{#snippet orkhonMeanwhile()}
					Tang China is near its height. The Umayyad caliphate stretches from Spain to the borders
					of India. The Maya cities of Palenque and Tikal are in full flourish. And in Northumbria,
					the previous year, a monk called Bede has just finished a history of the English church.
				{/snippet}

				<p style="margin-top: 2rem;">
					Every exhibit that follows is built the same way. There is an account meant to travel,
					and an account meant to stay at home, and the useful thing is very often the distance
					between the two.
				</p>
			</section>

			<section class="un-section">
				<h2>Most of these peoples had only recently decided who they were.</h2>
				<p class="un-lead">
					A nation almost always presents itself as old. That is what national stories are for.
					They explain that the people in charge have been here all along, that the borders follow
					something real, and that the whole arrangement is natural rather than recent.
				</p>
				<p>
					In this period the claim is often demonstrably new. Groups that had existed for two or
					three generations were acquiring names, territory and ancestors at speed, and because it
					happened so recently you can frequently see the joins.
				</p>
				<p>
					Before you read them, one question, because your answer is a fair sample of what most
					people bring to this period.
				</p>

				<Question
					text="Of these three origin stories, which would you expect to hold up best against the evidence?"
					options={[
						{ key: 'franks', label: 'The Franks, descended from refugees out of Troy.' },
						{ key: 'rus', label: "The Rus', who were invited in to rule by the people they ruled." },
						{
							key: 'khazars',
							label: "The Khazars, whose king converted after hearing all three faiths argued out."
						},
						{ key: 'none', label: 'None of them. Origin stories are written by the winners.' }
					]}
					value={guess}
					onPick={(k) => (guess = k)}
				/>

				{#if guess && guess !== 'none'}
					<div class="un-answer">
						<p>None of the three holds up as told, which is exactly what an origin story is for.</p>
						<p>
							The one you picked is the one whose purpose is best disguised, which is a genuine
							compliment to whoever wrote it.
						</p>
					</div>
				{/if}
				{#if guess === 'none'}
					<div class="un-answer">
						<p>Correct, and it does not get you out of the interesting part.</p>
						<p>
							Knowing that a story was written to do a job tells you nothing about which job it
							was, who it was for, or who it was aimed against. That is where the evidence
							actually lives.
						</p>
					</div>
				{/if}

				{#if guess}
					<TwoSided
						item={{
							when: 'Gaul, now France · the story told from the 600s',
							front: { tag: 'Side one · the story they told', title: 'The Franks came from Troy', body: franksFront },
							back: { tag: 'Side two · what the evidence suggests', title: 'A word the Romans used for a problem', body: franksBack },
							meanwhile: franksMeanwhile
						}}
					/>
					{#snippet franksFront()}
						<p>
							The Franks were the people who took over Roman Gaul and gave France its name. Their
							chroniclers gave them a founding migration: their ancestors, the story went, left
							the city of Troy when it fell, wandered for generations, and eventually settled in
							Gaul.
						</p>
						<p>
							It is a very useful pedigree. It makes the Franks cousins of the Romans rather than
							the people who replaced them. It presents their arrival in Gaul as a kind of
							homecoming. And it writes them into the single most prestigious story available
							anywhere in the Latin world.
						</p>
					{/snippet}
					{#snippet franksBack()}
						<p>
							The name arrives earlier than the story, and from the opposite direction.
							<strong>Frank</strong> appears in Roman writing of the third century as a term for a
							shifting coalition of groups along the lower Rhine. It was not the name of a nation
							with a homeland and a memory. It was closer to Roman shorthand for whoever was
							currently causing trouble in that direction.
						</p>
						<p>
							The people so described eventually took the name for themselves, kept it, and built
							a kingdom with it. The kingdom then needed a past, because kingdoms always do.
						</p>
						<p>Troy was supplied afterwards, several centuries later, by writers working for the people in charge.</p>
					{/snippet}
					{#snippet franksMeanwhile()}
						China is being reunified under the Sui and then the Tang. The Arab conquests are
						beginning. Japan is adopting Chinese administration wholesale.
					{/snippet}

					<TwoSided
						item={{
							when: 'The rivers of what is now Russia and Ukraine · the 800s',
							front: { tag: 'Side one · the story they told', title: 'The Slavs sent for princes', body: rusFront },
							back: { tag: 'Side two · what the evidence suggests', title: 'Written two hundred years later, by people who needed it', body: rusBack },
							meanwhile: rusMeanwhile
						}}
					/>
					{#snippet rusFront()}
						<p>
							The Rus&rsquo; were the people from whom Russia takes its name, and their chronicle,
							compiled in Kiev, gives a disarmingly tidy account of how they came to be ruled.
						</p>
						<p>
							The Slavic peoples of the north, it says, were quarrelling among themselves and could
							not govern. So they sent across the sea to the Varangians &mdash; Scandinavians, in
							other words &mdash; and asked them to come and take charge. Three brothers accepted
							the invitation, and the eldest, Rurik, founded a dynasty that would still be ruling
							six centuries later.
						</p>
					{/snippet}
					{#snippet rusBack()}
						<p>
							Two things sit awkwardly with that account. The first is the name itself.
							<span class="un-term">Rus&rsquo;</span> most likely reached Slavic through Finnish,
							from an Old Norse word connected with rowing and the men who did it. That points
							towards Scandinavians turning up rather than being sent for.
						</p>
						<p>
							The second is the date. The chronicle was put together roughly two hundred years
							after the events it describes, by monks working for the descendants of the dynasty
							whose right to rule it explains.
						</p>
						<p>
							<strong>An invitation is a far better story than an arrival.</strong>
							It makes the rule consensual from the very first day, which is precisely what a
							dynasty two centuries in would want on the record.
						</p>
					{/snippet}
					{#snippet rusMeanwhile()}
						Baghdad is probably the largest city on earth. The Maya cities of Central America are
						in the middle of their collapse. Southern Africa is trading into the Indian Ocean.
					{/snippet}

					<TwoSided
						item={{
							when: 'The steppe north of the Caucasus · the 800s',
							front: { tag: 'Side one · the story they told', title: 'A king held a debate and chose', body: khazarsFront },
							back: { tag: 'Side two · what the evidence suggests', title: 'A move on a board with two very large players', body: khazarsBack },
							meanwhile: khazarsMeanwhile
						}}
					/>
					{#snippet khazarsFront()}
						<p>
							The Khazars ruled a large and wealthy territory on the grasslands between the Black
							Sea and the Caspian. Their own account describes a decision taken properly and in
							the open.
						</p>
						<p>
							The ruler summoned representatives of Christianity, Islam and Judaism, and heard
							each of them out in turn. When he pressed the Christian and the Muslim, each
							conceded that Judaism had come first. He drew what the story presents as the obvious
							conclusion, and converted.
						</p>
					{/snippet}
					{#snippet khazarsBack()}
						<p>
							Something real did happen. Coins, burial practice and the accounts of neighbouring
							Arab and Byzantine writers all point to a genuine conversion, although historians
							still argue about its date and about how far beyond the ruling class it ever went.
						</p>
						<p>
							The staged debate is a different matter. Contests of this kind between three faiths
							are a recognised literary form of the period, and they turn up wherever a conversion
							needs accounting for.
						</p>
						<p>
							<strong>Look at the position it produces rather than at the theology.</strong>
							The Khazars sat between two expanding empires, each of which claimed authority over
							its own co-religionists wherever in the world they happened to live. Taking a third
							faith placed the Khazar realm outside both of those claims at once.
						</p>
					{/snippet}
					{#snippet khazarsMeanwhile()}
						Byzantine iconoclasm has recently ended. The Abbasid caliphate is past its height. The
						kingdom of Srivijaya controls the shipping straits of Southeast Asia.
					{/snippet}
				{/if}
			</section>

			<section class="un-section">
				<h2>Meaning does not survive a border intact.</h2>
				<p class="un-lead">
					Religions travelled enormous distances in these centuries, and they arrived in places
					that already had gods, temples and settled ways of talking about all of it.
				</p>
				<p>
					A missionary cannot simply hand somebody a set of ideas. In order to say anything at all,
					you have to use words your audience already knows, and those words arrive carrying
					meanings of their own. So the thing that gets delivered is never quite the thing that set
					out. Decisions get made in the crossing that nobody sat down and made.
				</p>
				<p>
					Three cases follow. A religion that changed its clothes at every border. An empire that
					tore itself apart over what a picture is. And a translation project that had to invent
					the vocabulary it needed while it was already using it.
				</p>

				<TwoSided
					item={{
						when: 'Fujian, on the south coast of China',
						front: { tag: 'Side one · what you would see', title: 'A seated Buddha in a small stone hall', body: maniFront },
						back: { tag: 'Side two · what it actually is', title: 'Mani, dressed for the neighbourhood', body: maniBack },
						meanwhile: maniMeanwhile
					}}
				/>
				{#snippet maniFront()}
					<p>
						In a small stone hall in Fujian there is a seated figure in the posture you would
						expect of a Buddha, inside a building that reads as a perfectly ordinary local temple.
					</p>
					<p>For a very long time that is exactly what everybody took it to be. Visitors came and made offerings accordingly.</p>
				{/snippet}
				{#snippet maniBack()}
					<p>
						The figure is not a Buddha. It is Mani, a religious teacher born in Mesopotamia in the
						third century, and the hall is a Manichaean one.
					</p>
					<p>
						Manichaeism was for several hundred years a genuinely intercontinental religion, and
						it spent a thousand years travelling east. At every stage it described itself using
						whatever religious vocabulary was already on the ground where it arrived. In the
						Iranian world it spoke in Zoroastrian terms. Further east it borrowed from Buddhism so
						completely that its founder ended up with a Buddha's title.
					</p>
					<p>
						<strong>
							It is tempting to call that a disguise. It is more accurate to call it the price of
							travelling at all.
						</strong>
						A religion crossing a border has no choice but to be said in words that already exist
						on the other side, and those words arrive with meanings of their own already attached.
					</p>
				{/snippet}
				{#snippet maniMeanwhile()}
					The Silk Road is carrying its heaviest traffic. Sogdian, a language now almost entirely
					extinct, is the trade tongue of Central Asia. The Chinese capital of Chang'an holds
					perhaps a million people.
				{/snippet}

				<TwoSided
					item={{
						when: 'Constantinople, now Istanbul · 726 to 843',
						front: { tag: 'Side one · the argument as stated', title: 'Whether to have pictures in church', body: iconFront },
						back: { tag: 'Side two · the argument as felt', title: 'Whether an image participates in what it shows', body: iconBack },
						meanwhile: iconMeanwhile
					}}
				/>
				{#snippet iconFront()}
					<p>
						The Byzantine empire was what remained of the Roman empire in the east, ruled from
						Constantinople, and for well over a century it tore itself apart over religious images.
					</p>
					<p>
						Stated flatly, it can sound like a dispute about decoration. Images were removed from
						churches, then restored, then removed again. Emperors and patriarchs lined up on both
						sides throughout, and the argument outlasted most of the people having it.
					</p>
				{/snippet}
				{#snippet iconBack()}
					<p>The question underneath is not about taste at all. It is about what kind of thing an image actually is.</p>
					<p>
						If a painting of a saint is pigment and board and nothing more, then bowing to it is
						foolish at best and idolatry at worst. If the image somehow participates in the person
						it depicts, then destroying one is an act of violence committed against that person.
					</p>
					<p>
						<strong>Those two positions cannot be met in the middle.</strong>
						They do not disagree about how much respect an object deserves, which would be
						negotiable. They disagree about what the object is. Monasteries were emptied and
						careers ended over it, on and off, for more than a hundred years.
					</p>
				{/snippet}
				{#snippet iconMeanwhile()}
					Charlemagne is crowned in Rome midway through. Baghdad is founded in 762. The vast
					Buddhist monument of Borobudur is under construction in Java.
				{/snippet}

				<TwoSided
					item={{
						when: 'Baghdad · the 800s and 900s',
						front: { tag: 'Side one · what it looks like', title: 'Books moved from one language to another', body: baghdadFront },
						back: { tag: 'Side two · what it actually was', title: 'A language acquiring words it did not have', body: baghdadBack },
						meanwhile: baghdadMeanwhile
					}}
				/>
				{#snippet baghdadFront()}
					<p>
						The Abbasids were the dynasty that ruled the Islamic world from Baghdad, and over
						roughly two centuries they paid for one of the largest translation projects in
						history.
					</p>
					<p>
						Greek works on medicine, mathematics, astronomy and philosophy were rendered into
						Arabic, often by way of Syriac. Caliphs and wealthy Baghdad families funded it, and it
						ran for generations.
					</p>
					<p>Put like that, it sounds like a transfer operation. Books in one language, and then the same books in another.</p>
				{/snippet}
				{#snippet baghdadBack()}
					<p>It could not possibly be a straight transfer, because the vocabulary did not exist yet.</p>
					<p>
						Greek philosophy draws distinctions for which Arabic had no settled words. The
						translators had to build the terms, argue about them, and reach agreements &mdash; and
						every later reader inherited those agreements without any sign that a decision had
						ever been taken. One translator, Hunayn ibn Ishaq, had a reputation for chasing a
						better manuscript across provinces rather than working from a poor copy.
					</p>
					<p>
						<strong>The consequences run a very long way downstream.</strong>
						Much of Aristotle reached Latin Europe centuries later through this Arabic, which
						means that European readers received a Greek philosopher with Baghdad's rulings about
						what his words meant already built into him.
					</p>
				{/snippet}
				{#snippet baghdadMeanwhile()}
					The Vikings are in Ireland and Normandy. Tang China is collapsing into the Five
					Dynasties. The empire of Ghana is taxing the gold roads of West Africa.
				{/snippet}
			</section>

			<section class="un-section">
				<h2>The best evidence was left by people who were not trying to leave any.</h2>
				<p class="un-lead">
					Everything so far was made by somebody with an argument. Chronicles, inscriptions and
					origin stories are all aimed at a reader, which means they can be checked against other
					evidence but never entirely taken at face value.
				</p>
				<p>
					There is a second kind of evidence that is much duller and very much harder to fake.
					Nobody names a river in order to inform the future. Nobody sets up a government office so
					that it will be remembered. Things like these record how people lived as a side effect of
					people living, and a side effect has no motive to mislead anybody.
				</p>
				<p>Four of them below. The third is the strongest kind of all, where somebody preserves a thing precisely by attacking it.</p>

				<TwoSided
					item={{
						when: 'Southern Spain · names still in daily use',
						front: { tag: 'Side one · what it is now', title: 'A river in Andalusia', body: guadalquivirFront },
						back: { tag: 'Side two · what it says', title: 'Arabic for ‘the great valley’', body: guadalquivirBack },
						meanwhile: guadalquivirMeanwhile
					}}
				/>
				{#snippet guadalquivirFront()}
					<p>
						The Guadalquivir runs through C&oacute;rdoba and Seville and out to the Atlantic.
						Spaniards say the name without thinking about it, in the way you would say the name of
						your nearest main road.
					</p>
				{/snippet}
				{#snippet guadalquivirBack()}
					<p>
						Southern Spain was ruled from Arabic-speaking courts for something close to eight
						hundred years, and the name is Arabic: <span class="un-term">al-w&#257;d&#299; al-kab&#299;r</span>,
						the great valley, worn down by centuries of Spanish mouths into a single word.
					</p>
					<p>
						It has a great deal of company. Guadalajara, Guadalupe, Guadiana and a long list of
						others all open the same way, and Andalusia itself comes from
						<span class="un-term">al-Andalus</span>. Plotted on a map, those names show where
						Arabic-speaking populations lived, and roughly for how long.
					</p>
					<p>
						<strong>None of it was recorded deliberately.</strong> Nobody names a river in order
						to tell the future about settlement patterns. They named it because it needed a name,
						and that is exactly why the evidence holds.
					</p>
				{/snippet}
				{#snippet guadalquivirMeanwhile()}
					C&oacute;rdoba is among the largest cities in the world. In northern France, Charlemagne's
					scribes are inventing the lower-case letters you are reading this in.
				{/snippet}

				<TwoSided
					item={{
						when: 'The Persian and Arabic world · a word going soft',
						front: { tag: 'Side one · what it is now', title: 'A couch', body: divanFront },
						back: { tag: 'Side two · what it was', title: 'A register of who gets paid', body: divanBack },
						meanwhile: divanMeanwhile
					}}
				/>
				{#snippet divanFront()}
					<p>
						A divan is a long low seat without a back, the sort of thing that ends up in a hotel
						lobby or a waiting room. The word reached English through French, and French had it
						from Turkish, and by the time it arrived it carried no trace at all of where it began.
					</p>
				{/snippet}
				{#snippet divanBack()}
					<p>
						It started as <span class="un-term">d&#299;w&#257;n</span>, a Persian and then Arabic
						word for an administrative register: the list of who was entitled to be paid.
					</p>
					<p>
						From there it moved by entirely ordinary steps. The register gave its name to the
						office that kept it. The office gave its name to the council that met there. The
						council gave its name to the long cushioned bench that the council sat on. And
						eventually the bench was all that was left.
					</p>
					<p>
						<strong>The register itself was an improvisation.</strong> Somebody had the problem of
						paying an army, invented a mechanism for it, and the mechanism outlived the army, the
						office, the council and the empire, and ended up as a piece of furniture with a
						foreign name.
					</p>
				{/snippet}
				{#snippet divanMeanwhile()}
					Byzantium is reorganising its provinces around soldiers who farm. Japan is building a
					Chinese-style bureaucracy that it will quietly stop using.
				{/snippet}

				<TwoSided
					item={{
						when: 'Northumbria · finished in 731',
						front: { tag: 'Side one · what he meant to do', title: 'Condemn the British church', body: bedeFront },
						back: { tag: 'Side two · what he actually did', title: 'Preserve almost the only description of it', body: bedeBack },
						meanwhile: bedeMeanwhile
					}}
				/>
				{#snippet bedeFront()}
					<p>
						Bede was a monk in the north of England and the finest historian anybody in western
						Europe produced for several centuries. He had a low opinion of the British church
						&mdash; meaning the Christianity of the Britons, who had been in Britain before the
						English arrived.
					</p>
					<p>
						It calculated Easter by the wrong method. Its clergy wore the wrong haircut. And worst
						of all, in his view, it had made no serious effort to convert the incoming English. He
						set the complaint out at length, and then moved on to the people he approved of.
					</p>
				{/snippet}
				{#snippet bedeBack()}
					<p>
						The British church left very little writing of its own. What survives about how it
						reckoned the calendar, how it organised itself, what its clergy looked like and what
						it cared about comes to a substantial degree from the man explaining why all of it was
						wrong.
					</p>
					<p>
						<strong>This turns out to be the normal situation rather than an oddity.</strong> You
						cannot argue against a practice without first describing it, in enough detail that
						your reader knows which practice you mean.
					</p>
					<p>So attacks are among the most detailed sources anybody has, and they exist because somebody wanted the thing gone.</p>
				{/snippet}
				{#snippet bedeMeanwhile()}
					The Orkhon stones from the first section go up the following year, four thousand miles to
					the east.
				{/snippet}

				<TwoSided
					item={{
						when: 'North-east London · recorded in the 1000s',
						front: { tag: 'Side one · what it is now', title: 'A stop on the Victoria line', body: walthamstowFront },
						back: { tag: 'Side two · what it says', title: 'Wilcumestōw, and an argument nobody can settle', body: walthamstowBack },
						meanwhile: walthamstowMeanwhile
					}}
				/>
				{#snippet walthamstowFront()}
					<p>
						Walthamstow. A postcode, a street market, the far end of an Underground line. Several
						hundred thousand people say the name every day, meaning nothing whatsoever by it
						beyond where they are going.
					</p>
				{/snippet}
				{#snippet walthamstowBack()}
					<p>
						The ending is Old English <span class="un-term">st&#333;w</span>, meaning a place, and
						used particularly for places where people gathered or that were held to be sacred.
					</p>
					<p>
						The first part is where it stops being straightforward. It is either
						<span class="un-term">wilcuma</span>, a welcome guest, or a personal name, Wilcume,
						belonging to whoever held the land. Both are perfectly good readings, and the surviving
						records contain nothing at all that would settle the question.
					</p>
					<p>
						<strong>
							So the name means either the welcoming place or one man's place, and it has quietly
							meant both at once for a thousand years.
						</strong>
					</p>
				{/snippet}
				{#snippet walthamstowMeanwhile()}
					Essex sits inside the boundary that King Alfred and the Danish leader Guthrum drew across
					England. C&oacute;rdoba is among the great cities of the world. China is consolidating
					under the Song after the fall of the Tang.
				{/snippet}
			</section>

			<section class="un-section">
				<h2>And then the ones you cannot get to.</h2>
				<p class="un-lead">One more exhibit, and it behaves differently from all the rest.</p>
				<p>
					Everything above rewards turning over. There is an account on the first side and, on the
					second, a motive, an older name or a quieter version of events, and the second side is
					the one you actually wanted.
				</p>
				<p>This one turns over exactly like the others.</p>

				<TwoSided
					item={{
						when: 'A mountain in Tajikistan · 722',
						front: { tag: 'Side one · what was found', title: 'A bundle of ordinary paperwork', body: mughFront },
						back: { tag: 'Side two · what it was', title: 'The last months of a man who lost', body: mughBack },
						meanwhile: mughMeanwhile
					}}
				/>
				{#snippet mughFront()}
					<p>
						Found on a mountainside above the Zarafshan valley in the 1930s: a bundle of documents
						on leather, wood and paper. Legal contracts, accounts, correspondence, a marriage
						agreement.
					</p>
					<p>It is exactly the sort of material that any administration anywhere produces continuously and that nobody ever thinks to preserve.</p>
				{/snippet}
				{#snippet mughBack()}
					<p>
						The papers belonged to Divashtich, the ruler of Panjikent, a Sogdian-speaking city on
						the Silk Road. When the Arab armies reached his region he withdrew to a fortress on
						that mountain and took his archive with him. He held out, negotiated a surrender, and
						was executed anyway. The documents stayed exactly where he left them for twelve
						hundred years.
					</p>
					<p>Every one of them can be read. They have been catalogued, translated and published. The legal formulae are intact and the handwriting is clear.</p>
					<p>
						<strong>None of it reaches him.</strong> A contract about a garden tells you the price
						of a garden. He kept the records that a man in his position kept, and a man in his
						position does not write down what he thought was going to happen.
					</p>
				{/snippet}
				{#snippet mughMeanwhile()}
					Sogdian is the common language from Samarkand to the Chinese frontier. Within a few
					centuries it will have one small descendant left, spoken in a single mountain valley,
					where a few thousand people speak it still.
				{/snippet}

				<p style="margin-top: 2.2rem;">
					Nothing is missing from the Mugh documents. They have been read, catalogued and
					published in full. Every legal formula is intact and the handwriting is clear.
				</p>
				<p>
					What is not there is Divashtich himself. Not the man's motives. Not what he believed he
					was doing on that mountain. Not whether he expected the terms of his surrender to be
					honoured.
				</p>
				<p>
					He kept the sort of records that a person keeps, and
					<strong>a person does not write down the thing you want to know.</strong>
				</p>
				<p style="color: var(--un-ink-soft);">
					The other face is always there. It is simply not always the one you were looking for.
				</p>

				<div class="un-colophon">The Other Face &middot; two of six &middot; the unhurried edition</div>
			</section>
		</div>
	</div>
</div>
