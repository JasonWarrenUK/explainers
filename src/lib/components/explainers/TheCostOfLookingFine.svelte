<script lang="ts">
	import { C, DISPLAY } from './cost-of-looking-fine/palette';
	import Kicker from './cost-of-looking-fine/Kicker.svelte';
	import Prose from './cost-of-looking-fine/Prose.svelte';
	import Aside from './cost-of-looking-fine/Aside.svelte';
	import Section from './cost-of-looking-fine/Section.svelte';
	import PartLabel from './cost-of-looking-fine/PartLabel.svelte';
	import CurveToy from './cost-of-looking-fine/CurveToy.svelte';
	import GridToy from './cost-of-looking-fine/GridToy.svelte';
	import RulesToy from './cost-of-looking-fine/RulesToy.svelte';
	import RulersToy from './cost-of-looking-fine/RulersToy.svelte';
	import ScalesToy from './cost-of-looking-fine/ScalesToy.svelte';
	import ChunksToy from './cost-of-looking-fine/ChunksToy.svelte';
	import AttentionToy from './cost-of-looking-fine/AttentionToy.svelte';
	import RoomToy from './cost-of-looking-fine/RoomToy.svelte';
	import DoingToy from './cost-of-looking-fine/DoingToy.svelte';
	import LoopToy from './cost-of-looking-fine/LoopToy.svelte';
	import InvisibleStepsToy from './cost-of-looking-fine/InvisibleStepsToy.svelte';

	const SECTION_IDS = ['intro', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', 'end'];

	let openIds = $state<Record<string, boolean>>({});
	let seen = $state<Record<string, boolean>>({});

	function toggle(id: string) {
		openIds[id] = !openIds[id];
		if (openIds[id]) seen[id] = true;
	}
	function openAll() {
		for (const id of SECTION_IDS) {
			openIds[id] = true;
			seen[id] = true;
		}
	}
	function closeAll() {
		openIds = {};
	}
	const seenCount = $derived(SECTION_IDS.filter((id) => seen[id]).length);
</script>

<svelte:head>
	<title>The Cost of Looking Fine</title>
	<link
		href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Sans:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="cost-canvas">
	<div class="cost-root">
		<div class="frame">
			<div class="masthead">
				<Kicker colour={C.ink}>Assessment Sheet</Kicker>
				<Kicker>Eleven toys, three parts</Kicker>
			</div>
			<h1>
				The Cost of <span class="hl">Looking Fine</span>
			</h1>
			<Prose style="font-family: {DISPLAY}; font-size: 27px; line-height: 1.3; font-style: italic;">
				If somebody can do the hardest thing in the room, why can they not do the easiest?
			</Prose>

			<div class="progress-bar">
				<Kicker colour={C.ink}>Opened {seenCount} of {SECTION_IDS.length}</Kicker>
				<span class="track">
					<span class="fill" style="width: {(seenCount / SECTION_IDS.length) * 100}%"></span>
				</span>
				<button class="link-btn" onclick={openAll}>Open all</button>
				<button class="link-btn" onclick={closeAll}>Close all</button>
			</div>

			<Section id="intro" n="" title="Where This Starts" open={!!openIds.intro} onToggle={() => toggle('intro')}>
				<Prose>
					Here is a scene. Somebody talks you through how a national rail timetable propagates
					delays: which junctions amplify, which absorb, why a late train at Reading becomes a
					cancelled one at Cardiff. They are doing it from memory, unprompted, correcting
					themselves as they go. It is the best explanation of the thing you have ever heard.
				</Prose>
				<Prose>
					The same person has an expense claim for &pound;41 that is now fourteen weeks overdue.
					They have opened the form eleven times. They have not filled in the first box. They can
					tell you, accurately, exactly why they haven&rsquo;t, and it does not help.
				</Prose>
				<Prose>
					This page is about people who live in that scene permanently: a reasoning ability so far
					out on the curve the tests barely reach it, and a severe form of ADHD that affects both
					attention and impulse control. Not either trait alone. The collision. Eleven toys in
					three parts: what the number is, what the room does, and what is left behind. Each
					section is folded; open them in order the first time.
				</Prose>
			</Section>

			<PartLabel>Part One: The Number</PartLabel>

			<Section id="1" n="1" title="How Far Out Is Far Out?" open={!!openIds['1']} onToggle={() => toggle('1')}>
				<Prose>
					One thing you need before the rest makes sense. An IQ score is a position on a curve, not
					a quantity of anything. The middle is 100, and each step of 15 is one standard deviation.
					Drag the marker to see what a given number means, and pay attention to what happens past
					150, and again past 160.
				</Prose>
				<CurveToy />
				<Prose>
					Hold on to the dotted line and the grey zone. Together they mean that every study you will
					meet below was done on people scoring 120 or 130, sometimes 115: the top tenth or so.
					Nobody has studied a room full of 162s, because there is no such room. Everything that
					follows is an honest extrapolation up a very long tail, and it should be held that way.
				</Prose>
			</Section>

			<Section id="2" n="2" title="How Many Things at Once" open={!!openIds['2']} onToggle={() => toggle('2')}>
				<Prose>
					What does a higher number buy, concretely? Mostly one thing: how many rules you can hold
					in relation at the same moment. The grid below is the kind of item the tests use. Start
					with one rule and turn it up; then the same load arrives as one turn of a card game, where
					you have to pick. The point is to feel the load, not to pass.
				</Prose>
				<GridToy />
				<Prose>
					Most adults hold about four interacting things before the structure collapses and they
					have to break it into steps or write it down. That ceiling, and the way people differ in
					it, is the single most useful way to think about what the bands mean. It also sets up the
					split at the centre of this page: seeing the rules is one faculty, and keeping four of
					them alive while you work is another.
				</Prose>
			</Section>

			<Section id="3" n="3" title="The Rulebook" open={!!openIds['3']} onToggle={() => toggle('3')}>
				<Prose>
					The same ladder off the test. Here are eight rules from a card game and three questions,
					one from each rung: find a fact, combine several, and settle a dispute the text never
					addresses. Answer each, then look at which rules did the work.
				</Prose>
				<RulesToy />
				<Prose>
					Reading, at the top of the scale, stops being a search for the right sentence and becomes
					modelling the document as a system: what it does, what it was written to avoid saying,
					and where it will bite. The person this page is about settles the rules argument at the
					table without effort. They also have a &pound;41 form they cannot open, and part two is
					about why.
				</Prose>
			</Section>

			<Section id="4" n="4" title="Same Numbers, Opposite Diagnosis" open={!!openIds['4']} onToggle={() => toggle('4')}>
				<Prose>
					The standard adult IQ test produces four main index scores. ADHD drags two of them down,
					working memory and processing speed, and leaves the two reasoning indices alone. So a
					person with this profile has a jagged shape, and the 162 from Toy 1 is the average of that
					shape: in this case an extended-norms composite whose lowest indices fall to 118. Whether
					the jaggedness counts as a problem depends entirely on what you hold the ruler against.
					Press both buttons.
				</Prose>
				<RulersToy />
				<Prose>
					The two research camps here are not really contradicting each other. One measured against
					the population and found the person fine. The other measured against the person&rsquo;s
					own ceiling and found them impaired. For somebody whose composite is 162, the second
					ruler is the honest one, and it is also the one almost nobody picks up, because 118 is a
					perfectly good score, and a clinician looking at it in isolation has no reason to ask
					what it is sitting next to.
				</Prose>
			</Section>

			<Section id="5" n="5" title="The Scales" open={!!openIds['5']} onToggle={() => toggle('5')}>
				<Prose>
					Toy 4 says the reasoning and the buffer are seventy points apart. This one lets you feel
					the gap. Three balance scales, each one&rsquo;s exchange rate needed for the next. Do it
					once with the rates written down, then once without.
				</Prose>
				<ScalesToy />
				<Prose>
					Seeing how the scales relate and holding &ldquo;six&rdquo; through an interruption are
					different organs. The first is what the reasoning indices measure and the second is what
					working memory measures, and for most people they sit close enough together that nobody
					notices they are two things. In this profile they are not close, and everyday life is
					full of chained exchange rates with no paper.
				</Prose>
			</Section>

			<Section id="6" n="6" title="Chunks Versus Digits" open={!!openIds['6']} onToggle={() => toggle('6')}>
				<Prose>
					If the buffer is only high-average, how does the reasoning engine get anything done? By
					never handing it raw items. Two memory tasks, then a slider.
				</Prose>
				<ChunksToy />
				<Prose>
					This is the mechanism behind the rail-timetable explanation in the opening scene: years of
					knowledge have turned the network into a few large chunks, and the buffer holds chunks
					comfortably. It is also the mechanism behind the failure that follows it. A form is raw
					items. So is a spoken instruction, and so is the number somebody just said.
				</Prose>
			</Section>

			<PartLabel>Part Two: The Room</PartLabel>

			<Section
				id="7"
				n="7"
				title="The Attention System Is a Switch, Not a Dial"
				open={!!openIds['7']}
				onToggle={() => toggle('7')}
			>
				<Prose>
					The second thing you need. ADHD is badly named. The attention is all there; what is
					missing is any way of pointing it. Interest turns it on. Importance does not. Drag the
					slider and watch what comes out.
				</Prose>
				<AttentionToy />
				<Prose>
					Now put the two things together. A mind that reasons at the far end of the curve is
					constantly under-stimulated by ordinary tasks, so it spends more of its life on the left
					of that graph than most people do. And when it does hit the right-hand side, the result is
					spectacular, which is exactly what makes the left-hand side unforgivable to everyone
					watching. The gift makes the switch more visible; the switch makes the gift unreliable.
				</Prose>
			</Section>

			<Section id="8" n="8" title="The Room Does the Deciding" open={!!openIds['8']} onToggle={() => toggle('8')}>
				<Prose>
					This is the toy to spend time on. Put the last toy together with part one: the attention
					system needs interest to switch on, and ADHD means the person cannot reliably generate
					their own structure, the timetables, deadlines and sense of time passing. So whether
					things go well at any given age depends on whether the <em>room</em> supplies what the
					head cannot. The reasoning is flat the whole way through. Drag through a life and watch
					the line move for reasons that have nothing to do with ability.
				</Prose>
				<RoomToy />
				<Prose>
					The textbook version of this story, the one clinicians like Thomas Brown describe, is a
					slow slide: high grades through childhood, then a gradual loss of footing as school and
					work demand more self-management, then a first assessment in the late teens or at
					thirty-five. That shape exists. But the life in the toy is at least as common and gets
					told less, because it does not flatter anyone: the drop comes at twelve, when secondary
					school hands the structure over to a child who cannot carry it; the dropout comes before
					the exams; and the one spectacular success comes years later, in a room that happened to
					supply both scaffolding and fascination at once. Brute cleverness explains why primary
					school looked fine. It does not explain the sawtooth. The room does.
				</Prose>
				<Prose>
					Two things follow. The distinction was not a recovery, and the collapse afterwards was not
					a relapse; nothing inside the person changed between them. And the population data agrees
					with the sawtooth more than with the slide: a large Mayo Clinic cohort found no difference
					in age of diagnosis by IQ at all. The slow-slide story is strong among people who
					eventually turn up at clinics with a clean academic record. It is not the only shape, and
					for someone whose executive floor is 118 against a ceiling near 200, it may not even be
					the usual one.
				</Prose>
			</Section>

			<Section id="9" n="9" title="Knowing More Does Not Help" open={!!openIds['9']} onToggle={() => toggle('9')}>
				<Prose>
					The most common piece of advice this person receives, from teachers, parents, managers
					and eventually themselves, is some version of &ldquo;you know what you need to do.&rdquo;
					They do. That is the problem. This toy gives you the £41 expense form from the opening
					scene. Move the slider first and watch the plan improve; then try to actually do it.
				</Prose>
				<DoingToy />
				<Prose>
					The numbers behind the button are fixed, not random, so the ratio you got is the ratio
					everyone gets: roughly four false starts for every step, alone, and roughly one for every
					five with somebody sitting there. Those are my figures, chosen to show the shape. What
					they stand for is real: the only thing that moved the right-hand column was structure
					from outside, which is the same finding as Toy 8 arriving from the other direction.
				</Prose>
			</Section>

			<PartLabel>Part Three: The Residue</PartLabel>

			<Section
				id="10"
				n="10"
				title="What It Does to a Person, Over Years"
				open={!!openIds['10']}
				onToggle={() => toggle('10')}
			>
				<Prose>
					The toys so far are about mechanism. This one is about residue. Two traits, taking turns,
					can build a cycle neither could sustain on its own, and every lap leaves something behind.
					Step through it more than once, and watch the four gauges underneath.
				</Prose>
				<LoopToy />
				<Prose>
					Clinicians describe the emotional side of this as central rather than incidental. Brown
					argues that weak working memory lets a single feeling flood the whole system, with nothing
					left over for the other facts and memories that would put it in proportion. Combine that
					with a very high internal standard, and ordinary feedback lands as catastrophe. This
					part of the picture is well described by people who treat it, and thinly measured; take
					it as good testimony rather than settled effect sizes.
				</Prose>
			</Section>

			<Section id="11" n="11" title="The Invisible Steps" open={!!openIds['11']} onToggle={() => toggle('11')}>
				<Prose>
					One more piece of residue, and it belongs to the reasoning trait rather than the ADHD. At
					the top of the scale, the intermediate steps of one&rsquo;s own thinking are often not
					available to look at. This toy does not tell you that. It times you. Three rounds, from
					a paper puzzle through drawn faces to arguments: in each you judge against a clock, then
					explain with nothing offered to choose from and no clock, then say which came first.
				</Prose>
				<InvisibleStepsToy />
				<Prose>
					Put this next to the loop. A person who cannot show their working, and who has spent
					years failing at things everyone else finds easy, has two independent reasons to conclude
					that the good results were flukes. Neither reason is evidence. Both feel like it.
				</Prose>
			</Section>

			<Section id="end" n="" title="What the Evidence Cannot See" open={!!openIds.end} onToggle={() => toggle('end')}>
				<Prose>
					Three honest limits. First, the dotted line from Toy 1: nobody at 162 has been studied as a
					group, so the whole picture is extrapolated from people a standard deviation or two
					lower. Second, the numbers in these toys are mostly models drawn to show a shape; the bar
					heights, curves, grids, rulebook and puzzles are mine. The exceptions are in Toy 4, where
					the composite of 162 and the floor of 118 are real anchors and the two reasoning peaks are
					inferred from them, not measured. Third, the lived-experience material comes largely from
					clinicians and from people describing their own lives, and above 160 it is a few dozen
					children in a century of case notes. It is consistent and vivid. It is not measurement.
				</Prose>
				<Prose>
					One thing that does hold up: medication seems to work about as well at high IQ as at any
					other, and the practical corrections are the same ones anyone with ADHD needs, structure
					outside the head rather than resolve inside it. The difference for this person is that
					they will be told they don&rsquo;t need any of it, by people who saw the rail timetable
					and never saw the expense form.
				</Prose>
				<Aside>
					What this page&rsquo;s own framing costs: it treats the diagnosis as settled and never
					gives the other side a hearing. Serious people argue that gifted traits are routinely
					mistaken for ADHD, and that argument has real force at the mild end of the spectrum, where
					a bored, bright child in the wrong classroom can look a lot like a disorder. It has much
					less force for a severe, cross-setting picture with a test profile split by seventy points,
					which is why this page proceeds as it does. But you have not seen that case made here,
					only dismissed. And the toys in part one make the reasoning estimate vivid, which is the
					flattering direction; the label &ldquo;inferred, not measured&rdquo; is on every screen
					where the number appears for that reason.
				</Aside>
			</Section>
		</div>
	</div>
</div>

<style>
	.cost-canvas {
		--cost-paper: #ffffff;
		--cost-hair: #ddddd6;
		min-height: 100dvh;
		background-color: #ffffff;
		background-image:
			linear-gradient(#ddddd6 1px, transparent 1px), linear-gradient(90deg, #ddddd6 1px, transparent 1px);
		background-size: 28px 28px;
		color: #0b0b0b;
	}
	.cost-root {
		font-family: 'IBM Plex Sans', system-ui, sans-serif;
		font-size: 19px;
		line-height: 1.6;
	}
	.cost-root :global(button:focus-visible),
	.cost-root :global(input:focus-visible) {
		outline: 3px solid #1230c8;
		outline-offset: 2px;
	}
	.cost-root :global(input[type='range']) {
		cursor: pointer;
	}
	@media (prefers-reduced-motion: reduce) {
		.cost-root :global(*) {
			transition: none !important;
		}
	}
	.frame {
		max-width: 640px;
		margin: 0 auto;
		padding: 40px 22px 90px;
		background: #ffffff;
		border-left: 1.5px solid #0b0b0b;
		border-right: 1.5px solid #0b0b0b;
		box-sizing: border-box;
	}
	.masthead {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 22px;
	}
	h1 {
		font-family: 'Instrument Serif', 'Times New Roman', serif;
		font-size: 60px;
		line-height: 0.98;
		font-weight: 400;
		letter-spacing: -0.01em;
		margin: 0 0 0.45em;
	}
	.hl {
		font-style: italic;
		background: linear-gradient(transparent 55%, #ffe95c 55%);
	}
	.progress-bar {
		position: sticky;
		top: 0;
		z-index: 5;
		background: #ffffff;
		border-top: 1.5px solid #0b0b0b;
		border-bottom: 1.5px solid #0b0b0b;
		padding: 8px 0;
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 4px;
	}
	.track {
		flex: 1;
		height: 6px;
		background: #efeee8;
		border: 1px solid #0b0b0b;
	}
	.fill {
		display: block;
		height: 100%;
		background: #0b0b0b;
		transition: width 0.3s;
	}
	.link-btn {
		font: inherit;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 12px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		background: none;
		border: none;
		padding: 0;
		color: #1230c8;
		cursor: pointer;
		text-decoration: underline;
	}
</style>
