<script lang="ts">
	import './unhurried/unhurried.css';
	import Waiting from './unhurried/Waiting.svelte';
	import Question from './unhurried/Question.svelte';

	let shape = $state<'one' | 'two' | 'three' | null>(null);
	let fix = $state<'patch' | 'single' | 'hold' | null>(null);
	let absence = $state<'sentinel' | 'status' | 'ask' | null>(null);
	let link = $state(0);
	let time = $state<'overwrite' | 'history' | null>(null);
	let store = $state<'relational' | 'document' | 'graph' | null>(null);
	let last = $state<'enum' | 'text' | 'both' | null>(null);

	const one = $derived(shape === 'one');
	const three = $derived(shape === 'three');
</script>

<svelte:head>
	<title>What Exists</title>
</svelte:head>

<div class="un-shell">
	<div class="un-root">
		<div class="un-wrap">
			<header class="un-mast">
				<p class="un-eyebrow">Five of six · Designing records</p>
				<h1>What Exists</h1>
				<p class="un-standfirst">
					Before anybody can build a computer system, somebody has to decide what kinds of thing it
					will know about, and what facts it is allowed to hold about each of them.
					<br />
					<br />
					It sounds like the dullest job in the world. It is the point at which it is decided whose
					name will fit in the box, and whose will not.
				</p>
			</header>

			<section class="un-section">
				<h2>Before anything gets built, somebody decides what things there are.</h2>
				<p class="un-lead">
					A small charity has asked you to sort out its records. It knows about people, and it knows
					about the organisations those people work for, and at present all of it lives in a
					spreadsheet that three people edit at the same time.
				</p>
				<p>
					Your job is to write down what exists. Not to describe the world, which is what it will
					feel like, but to rule on it. Whatever you write down is what the system will be able to
					say, and anything you leave out will be unsayable for as long as the system runs.
				</p>
				<p>Start with something that could not be simpler. How do you store a name?</p>

				<Question
					text="Pick one."
					options={[
						{ key: 'one', label: 'One box. Put the whole name in it.' },
						{ key: 'two', label: 'Two boxes. First name and last name.' },
						{ key: 'three', label: 'Three boxes. First, middle, last.' }
					]}
					value={shape}
					onPick={(k) => (shape = k as typeof shape)}
				/>
				{#if shape}
					<div class="un-answer">
						<p>
							{#if one}Noted. Almost nobody picks this one, and the reasons are real rather than
								superstitious. Whether they outweigh what it buys you is a question for a few
								paragraphs from now.
							{:else if shape === 'two'}Noted. This is what nearly every form you have ever filled
								in does, which is worth knowing but is not by itself an argument.
							{:else if three}Noted. More boxes than most people give themselves, on the reasoning
								that more room handles more of the world.
							{/if}
						</p>
					</div>
				{/if}
			</section>

			{#if !shape}
				<section class="un-section">
					<Waiting>
						Four more sections follow, and they respond to the choice you make above. Pick one of
						the three and the rest of the page opens.
					</Waiting>
				</section>
			{/if}

			{#if shape}
				<section class="un-section">
					<h2>Then somebody walks in.</h2>
					<p class="un-lead">
						Four people need to go into the system this week. Not one of them is being difficult, or
						unusual, or trying to make a point. They are simply people.
					</p>

					<div class="un-fossil" style="border-left-color: {one ? 'var(--un-deep-soft)' : 'var(--un-mark-soft)'};">
						<div class="un-fossil-head">
							<span class="un-fossil-form">A new volunteer, from Java</span>
							{#if one}<span class="un-fossil-fam">your model holds this</span>{/if}
						</div>
						<div class="un-fossil-body">
							<p>
								Her name is Sukarti. That is the whole of it. Not a shortening, and not a first name
								waiting for a surname. Single names are entirely ordinary across much of Indonesia
								and in a good many other places.
							</p>
							{#if one}
								<p><strong>She goes in as Sukarti and nothing objects.</strong> You asked for a name and she gave you her name.</p>
							{:else if shape === 'two'}
								<p><strong>Your form has a required box she has nothing to put in.</strong></p>
							{:else if three}
								<p><strong>Your form has two boxes she has nothing to put in, and one of them is required.</strong> The extra box did not buy flexibility. It bought another blank.</p>
							{/if}
						</div>
					</div>

					<div class="un-fossil" style="border-left-color: {one ? 'var(--un-deep-soft)' : 'var(--un-mark-soft)'};">
						<div class="un-fossil-head">
							<span class="un-fossil-form">A trustee, from Tamil Nadu</span>
							{#if one}<span class="un-fossil-fam">stored correctly</span>{/if}
						</div>
						<div class="un-fossil-body">
							<p>
								He gives his name as R. Ganesan. The R is his father's given name, which functions
								as an initial and is not a family name at all. His own name is the second part.
							</p>
							{#if one}
								<p><strong>Stored exactly as he wrote it, which is the point.</strong> Nothing has been taken apart, so nothing has been taken apart wrongly.</p>
							{:else}
								<p>
									Asked for a last name, he does what most people in his position do on a form like
									yours, and puts the initial there, because it is the only part that resembles one.
								</p>
								<p>
									<strong>So the system files him under R and writes to him as Ganesan R.</strong>
									{#if three}The third box is empty and has changed nothing, because the assumption
										underneath all three is that a name comes apart into pieces you can label in
										advance.
									{:else}It will also print it on a badge.{/if}
								</p>
							{/if}
						</div>
					</div>

					<div class="un-fossil" style="border-left-color: var(--un-mark-soft);">
						<div class="un-fossil-head">
							<span class="un-fossil-form">A donor of eleven years</span>
						</div>
						<div class="un-fossil-body">
							<p>
								She has changed her name. The old one still has to resolve, because eleven years of
								correspondence, tax declarations and a pledge in her will are all attached to it,
								and a solicitor will one day need to follow the thread.
							</p>
							<p>
								<strong>She is not two people, and she is not one row either.</strong> Nothing in your
								model has anywhere to keep a name that is no longer current, and no number of boxes
								helped with that.
							</p>
						</div>
					</div>

					{#if one}
						<div class="un-fossil" style="border-left-color: var(--un-mark-soft);">
							<div class="un-fossil-head">
								<span class="un-fossil-form">The Christmas appeal, and the trustee list</span>
							</div>
							<div class="un-fossil-body">
								<p>
									The fundraiser wants the appeal to open with whatever each person is actually
									called, because it reads as though a human being wrote it. From your one box she
									has a single line of text per person, and she needs a rule that turns that into a
									form of address.
								</p>
								<p>
									There is no such rule. Margaret Oyelaran-Whitfield is Margaret. R. Ganesan is
									Ganesan, not R. Sukarti is Sukarti. Jón Sigurðsson is Jón. Every one of those is
									obvious to somebody who knows the convention, and not one can be worked out from
									the letters in the box.
								</p>
								<p>
									<strong>You have not lost any information. You have lost the ability to act on it.</strong>
									What somebody is called and how they should be addressed are two separate facts,
									and you are storing one.
								</p>
							</div>
						</div>
					{:else}
						<div class="un-fossil" style="border-left-color: var(--un-mark-soft);">
							<div class="un-fossil-head">
								<span class="un-fossil-form">A caseworker in Reykjavík</span>
							</div>
							<div class="un-fossil-body">
								<p>
									Jón Sigurðsson. Sigurðsson is not a family name. It is a statement that his father
									was called Sigurður. His sister's name is Sigurðardóttir.
								</p>
								<p>
									<strong>Sorting Icelanders by that box groups siblings apart and strangers together.</strong>
									Icelandic phone books sort by first name for exactly this reason, and your model
									has no way of recording that he is one of the people who needs sorting differently.
								</p>
							</div>
						</div>
					{/if}

					<p style="margin-top: 2rem;">
						None of this is exotic. Between them these patterns cover an enormous number of people,
						and every one of those people has at some point been told by a form that they have
						filled it in wrongly.
					</p>

					<Question
						text="What do you do?"
						options={one
							? [
									{ key: 'single', label: 'Keep the single box, and add a separate one for how to address them and a list of former names.' },
									{ key: 'patch', label: 'Split it back out after all. First and last name, with last name optional.' },
									{ key: 'hold', label: 'Leave it. The charity is small and the appeal can be formal.' }
								]
							: [
									{ key: 'patch', label: `Keep the ${three ? 'three' : 'two'} boxes and make the last name optional.` },
									{ key: 'single', label: 'Collapse to one name box, plus a separate one for how to address them and a list of former names.' },
									{ key: 'hold', label: 'Leave it. These are edge cases and the charity is small.' }
								]}
						value={fix}
						onPick={(k) => (fix = k as typeof fix)}
					/>
					{#if fix}
						<div class="un-answer">
							{#if fix === 'patch' && shape === 'two'}
								<p><strong>Cheap, and it half works.</strong> Sukarti fits now. Ganesan is still filed under R, Jón still sorts away from his sister, and the donor's old name still has nowhere to live. You have solved the case that was easiest to see.</p>
							{:else if fix === 'patch' && three}
								<p><strong>You now have three boxes, two of them optional, and the same assumption underneath.</strong> Sukarti fits. Nothing else moved, because the problem was never how many parts a name has. It was the belief that the parts can be labelled in advance and that everybody uses them the same way.</p>
							{:else if fix === 'patch' && one}
								<p><strong>You have traded a working model for a familiar one.</strong> Sorting and salutation get easier, and Ganesan gets filed under R, which he was not before. This is the trade almost every system makes, usually without noticing there was one.</p>
							{/if}
							{#if fix === 'single' && !one}
								<p><strong>The expensive one, and it holds.</strong> Notice the shape of what replaced it: one box for what somebody is called, one for how to sort and address them, and one for names that are no longer current. Three facts, not three parts.</p>
							{:else if fix === 'single' && one}
								<p><strong>You were most of the way there and it still took two more boxes.</strong> One to say how a person should be sorted and addressed, which is a separate fact from what they are called, and one to hold names that are no longer current.</p>
							{/if}
							{#if fix === 'hold'}
								<p>
									<strong>A real option, and a defensible one.</strong> Every set of records excludes
									somebody and no budget is infinite. What it is not is neutral.
									{#if one}Nobody is stored wrongly, the donor's history is simply gone, and the appeal
										goes out formal to two thousand people.
									{:else}Four people will be entered wrongly, and none of them will be asked whether
										they minded.{/if}
								</p>
							{/if}
						</div>
					{/if}
				</section>
			{/if}

			{#if shape && !fix}
				<section class="un-section">
					<Waiting>
						Three more sections follow. Decide what to do about the names and they open.
					</Waiting>
				</section>
			{/if}

			{#if fix}
				<section class="un-section">
					<h2>An empty box with four meanings.</h2>
					<p class="un-lead">
						There is a telephone number box. For four hundred of the charity's two thousand records
						it is blank.
					</p>
					<p>
						Blank is not one thing. Read what actually happened in each case and the box turns out
						to be carrying four entirely different pieces of information under a single appearance.
					</p>
					<div class="un-fossil"><div class="un-fossil-body">
						<p><strong>Record 1102.</strong> Nobody has ever asked her. The box is blank because the conversation has not happened.</p>
					</div></div>
					<div class="un-fossil"><div class="un-fossil-body">
						<p><strong>Record 1187.</strong> He was asked and said no. That is a decision he made, and telephoning him would be a breach of it.</p>
					</div></div>
					<div class="un-fossil"><div class="un-fossil-body">
						<p><strong>Record 1240.</strong> She has no telephone. Asking again next quarter will not change that and will be irritating.</p>
					</div></div>
					<div class="un-fossil"><div class="un-fossil-body">
						<p><strong>Record 1355.</strong> There was a number. It has been disconnected for two years, and somebody deleted it rather than record that fact.</p>
					</div></div>

					<p style="margin-top: 1.8rem;">
						The distinction that matters most is the least visible.
						<strong>We have not looked, and we looked and there is nothing, are opposite findings, and
						an empty box renders them identically.</strong>
						One of them is an open question. The other is an answer, and it cost somebody a telephone
						call to get.
					</p>

					<Question
						text="How do you make that difference sayable?"
						options={[
							{ key: 'sentinel', label: 'Agree a convention. Blank means never asked; the word NONE means asked and declined.' },
							{ key: 'status', label: 'Add a second box next to it, with the four cases as options.' },
							{ key: 'ask', label: 'Record the enquiry itself: when it was asked, and what came back.' }
						]}
						value={absence}
						onPick={(k) => (absence = k as typeof absence)}
					/>
					{#if absence}
						<div class="un-answer">
							{#if absence === 'sentinel'}
								<p><strong>Free, and it will not survive contact with staff turnover.</strong> The convention lives in somebody's head and in a training document nobody reads. Within two years there will be records containing the word "none", records containing "n/a", and records containing a hyphen.</p>
							{:else if absence === 'status'}
								<p><strong>The workable middle.</strong> The four cases become sayable and countable, at the cost of a second box that has to be kept in step with the first, which it will not always be.</p>
							{:else if absence === 'ask'}
								<p><strong>The most honest and the most work.</strong> You have stopped storing a fact and started storing the history of trying to find it out, which is what actually happened.</p>
								<p>Notice what that took. The enquiry could not live on the person, because a person can be asked more than once and give a different answer each time, so it had to become a thing in its own right. It is a third list nobody asked you for, and the charity has one part-time administrator.</p>
							{/if}
						</div>
					{/if}
				</section>
			{/if}

			{#if fix && !absence}
				<section class="un-section">
					<Waiting>Two more sections follow, once you have settled the empty boxes.</Waiting>
				</section>
			{/if}

			{#if absence}
				<section class="un-section">
					<h2>A line between two boxes turns out to be a thing.</h2>
					<p class="un-lead">
						Your model says that a person has an employer. It is a single entry pointing at an
						organisation, and it is the most natural thing in the world to write down.
					</p>
					<p>Now watch it come apart, one ordinary Tuesday at a time.</p>

					<div class="un-fossil"><div class="un-fossil-body">
						<p><strong>First.</strong> A caseworker takes a second job with a partner organisation, two days a week. Your entry holds one value.</p>
					</div></div>
					{#if link >= 1}
						<div class="un-fossil"><div class="un-fossil-body">
							<p><strong>Second.</strong> You have widened it, so a person can now be connected to several organisations. Good. The finance officer then asks which of them employs her, since one post is paid and the other is voluntary, and she has a different start date at each, and a different job title at each.</p>
							<p><strong>None of that belongs to the person, and none of it belongs to the organisation.</strong> It belongs to the connection between them, and a connection was not something your model said existed.</p>
						</div></div>
					{/if}
					{#if link >= 2}
						<div class="un-fossil" style="border-left-color: var(--un-mark);"><div class="un-fossil-body">
							<p><strong>What actually happened.</strong> The line was never a line. There was always a third thing in this domain, with its own start, its own terms and its own name, and you did not notice because on the diagram it looked like a piece of plumbing between two boxes.</p>
							<p><strong>This is not a tidying-up exercise. It is finding out that engagements exist.</strong> Every set of records you will ever design has at least one of these hiding in it, and you generally meet them at the point where somebody asks a question you cannot answer.</p>
							{#if absence === 'ask'}
								<p>You have already done this once, two sections ago, when the enquiry about a telephone number turned out to need a list of its own. Same move, different corner. It will keep happening.</p>
							{/if}
						</div></div>
					{/if}
					{#if link < 2}
						<button class="un-btn" onclick={() => (link = link + 1)}>
							{link === 0 ? 'Let people have more than one job' : 'Add the details the finance officer needs'}
						</button>
					{/if}

					{#if link >= 2}
						<h3>Two questions follow immediately</h3>
						<p>
							They are the two that separate people who have done this before from people who have
							not. The first is about time. The caseworker's hours change in April.
						</p>
						<Question
							text="What happens to the old entry?"
							options={[
								{ key: 'overwrite', label: 'Update it. The current position is what the system is for.' },
								{ key: 'history', label: 'Close it with an end date and open a new one.' }
							]}
							value={time}
							onPick={(k) => (time = k as typeof time)}
						/>
						{#if time}
							<div class="un-answer">
								{#if time === 'overwrite'}
									<p><strong>Simpler, and the past is gone.</strong> Next year somebody asks how many hours she worked in March, for a funder's report, and there is no answer anywhere in the system.</p>
								{:else}
									<p><strong>You are now recording the world changing rather than the world as it is.</strong> Every question gets a little harder, because every question has to say when it means. In exchange, "what was true in March" becomes answerable at all.</p>
								{/if}
							</div>
						{/if}

						{#if time}
							<h3>The second decides how all of this is physically kept</h3>
							<p>
								And it is genuinely a question about the world rather than about computers.
								<strong>Does an engagement exist on its own, or only as part of a person?</strong>
							</p>
							<p>
								It is easier to see on paper, so forget computers for a moment. The charity has a
								back room, and three ways of arranging it.
							</p>

							<div class="un-fossil">
								<div class="un-fossil-head"><span class="un-fossil-form">Three card indexes</span></div>
								<div class="un-fossil-body">
									<p>One drawer of cards for people, one for organisations, one for engagements. Each engagement card names a person and an organisation. To answer anything you pull cards from more than one drawer and match them up.</p>
									<p style="color: var(--un-ink-soft);">Nothing sits inside anything else. Every question costs a little work and no question is impossible.</p>
								</div>
							</div>
							<div class="un-fossil">
								<div class="un-fossil-head"><span class="un-fossil-form">A folder for each person</span></div>
								<div class="un-fossil-body">
									<p>One folder per person, and the engagement is a sheet filed inside it. Everything about somebody is in one place, so anything you want to know about a person takes one folder.</p>
									<p style="color: var(--un-ink-soft);">Ask who works at one particular organisation and you are opening every folder in the cabinet.</p>
								</div>
							</div>
							<div class="un-fossil">
								<div class="un-fossil-head"><span class="un-fossil-form">Pins and string</span></div>
								<div class="un-fossil-body">
									<p>A pin on a board for each person and each organisation, and a length of string between them for each engagement, with the role and the dates written along the string.</p>
									<p style="color: var(--un-ink-soft);">Following who is connected to whom is trivial. Producing a plain alphabetical list of everybody is oddly awkward.</p>
								</div>
							</div>

							<p style="margin-top: 1.5rem;">
								Those are the three families of database, and they are usually called relational,
								document and graph. The names matter less than what each has already assumed. Cards
								say nothing is inside anything. Folders say containment is real, because a sheet in
								somebody's folder is part of that person. String says the connection is a thing in
								its own right.
							</p>

							<Question
								text="Pick one, knowing that you are answering a question about what kind of thing an engagement is."
								options={[
									{ key: 'relational', label: 'Card indexes. Keep everything separate and match it up when asked.' },
									{ key: 'document', label: 'Folders. An engagement belongs to a person and lives inside them.' },
									{ key: 'graph', label: 'Pins and string. The connection is a thing in its own right.' }
								]}
								value={store}
								onPick={(k) => (store = k as typeof store)}
							/>
							{#if store}
								<div class="un-answer">
									{#if store === 'document'}
										<p><strong>You have committed, in the physical arrangement, to the claim that an engagement has no life of its own.</strong> It is a sheet in somebody's folder, so it goes where they go. Six months from now the funder asks for everybody connected to one organisation, and answering means opening every folder you have.</p>
									{:else if store === 'relational'}
										<p><strong>You have declined to commit, which is itself a position.</strong> Nothing is inside anything, so nothing is ever cheap and nothing is ever impossible. The arrangement also tells whoever inherits it nothing about what you believed an engagement was.</p>
									{:else if store === 'graph'}
										<p><strong>You have said the connection is as real as the things it connects.</strong> Anything of the form "who is linked to whom, and how far does that go" becomes easy. Anything of the form "give me everybody in one plain alphabetical list" becomes more work than you would expect.</p>
									{/if}
								</div>
							{/if}
						{/if}
					{/if}
				</section>
			{/if}

			{#if absence && !store}
				<section class="un-section">
					<Waiting>
						One section left. It opens once you have chosen how the records are kept, and it is
						the only one that does not resolve.
					</Waiting>
				</section>
			{/if}

			{#if store}
				<section class="un-section">
					<h2>The last one has no right answer.</h2>
					<p class="un-lead">
						One box left. The charity needs to record how each person is connected to it, because
						the trustees have to report on governance and the funder wants to know who the work
						reaches.
					</p>
					<p>
						There are two ways to build a box like this, and they are the oldest argument in the
						subject. A fixed list is enforceable: everybody picks from the same options, the
						options mean the same thing to everybody, and you can count them at the end of the
						year. Free text is expressive: anybody can say what is actually the case, in the words
						that fit.
					</p>
					<p>Here are four people, and they are not awkward. They are Tuesday.</p>

					<div class="un-fossil"><div class="un-fossil-body">
						<p><strong>A trustee.</strong> She also receives the service. That is a governance fact with legal weight, and it is also the single best reason she is on the board.</p>
					</div></div>
					<div class="un-fossil"><div class="un-fossil-body">
						<p><strong>A former beneficiary.</strong> He now runs a peer support group, unpaid, which the charity depends on but has never formally constituted.</p>
					</div></div>
					<div class="un-fossil"><div class="un-fossil-body">
						<p><strong>A funder's representative.</strong> She attends board meetings, has no vote, and is not staff, volunteer or beneficiary.</p>
					</div></div>
					<div class="un-fossil"><div class="un-fossil-body">
						<p><strong>Somebody the charity is not sure about.</strong> He has been coming to the drop-in for a year. Nobody has ever established whether he is a service user, and asking directly would probably end it.</p>
					</div></div>

					<Question
						text="Fixed list or free text?"
						options={[
							{ key: 'enum', label: 'Fixed list. Governance reporting is a legal duty and it has to be countable.' },
							{ key: 'text', label: 'Free text. People are more complicated than five options.' },
							{ key: 'both', label: 'Both. A fixed list for reporting, and a free text note beside it.' }
						]}
						value={last}
						onPick={(k) => (last = k as typeof last)}
					/>

					{#if last}
						<div class="un-answer">
							{#if last === 'enum'}
								<p><strong>Who pays:</strong> the trustee, who is filed as one thing and is two, so the conflict of interest the board is legally obliged to manage becomes invisible in its own records. The peer group leader, filed as a beneficiary while doing unpaid work the charity relies on. And the man at the drop-in, who has to be given a category before anybody has asked him.</p>
							{:else if last === 'text'}
								<p><strong>Who pays:</strong> the trustees, at the point where the annual report needs a number and there are four hundred distinct phrases in the column, eleven of which say "volunteer" with different capitalisation. Nobody is excluded and nobody can be counted, so the governance duty gets discharged by somebody reading four hundred rows and making a judgement.</p>
							{:else if last === 'both'}
								<p><strong>Who pays:</strong> whoever does the data entry, twice, for ever. And in practice the note is where the truth goes and the list is where the reporting comes from, so the two drift apart and the organisation ends up believing the list.</p>
							{/if}
						</div>

						<p style="margin-top: 2.4rem;">
							There is no fourth option, and this section does not resolve, because the world
							genuinely does not contain an answer. Some part of what these four people are will
							not survive being written down, and you are the one deciding which part.
						</p>
						<p>
							That is the whole job, and it is why it is worth doing carefully. A set of records is
							not a description of the world. It is a ruling about what the world is permitted to
							contain, made in advance, by somebody who has not met most of the people it will be
							applied to.
						</p>
						<p style="color: var(--un-ink-soft);">
							Everybody who fills in the form afterwards is living inside a decision you made on a
							Tuesday.
						</p>
					{/if}

					<div class="un-colophon">What Exists · five of six · the unhurried edition</div>
				</section>
			{/if}
		</div>
	</div>
</div>
