<script lang="ts">
	interface Option {
		k: string;
		label: string;
		buys: string;
		costs: string;
		pays: string;
		verdict: string;
		body: string;
	}
	interface Insert {
		when: (state: Record<string, string | null>) => boolean;
		tag: string;
		body: string;
	}
	interface Decision {
		id: string;
		n: string;
		setup: string;
		ask: string;
		opts: Option[];
		inserts: Insert[];
	}

	const DECISIONS: Decision[] = [
		{
			id: 'd1',
			n: 'Decision one',
			setup: `<p>Marchwood&rsquo;s chief executive has a suspicion that meetings are eating the place. She wants to know whether that is true, and she has 912 people who could tell her.</p>`,
			ask: 'You want to know how this organisation feels about meetings. What do you do?',
			opts: [
				{
					k: 'a',
					label: 'Put a question about meetings in the staff survey.',
					buys: 'A number that means the same thing next year and across employers.',
					costs: 'You can only learn about what you thought to ask.',
					pays: 'Anybody whose problem was not on the questionnaire.',
					verdict: 'You chose the survey',
					body: `<p>That is the option with the most evidence behind it. Staff surveys are a mature instrument, refined over decades, and they give you the one thing neither of the others does: a number that means the same thing next year. Marchwood scores 3.1 on meetings this March and 3.4 next March, and that comparison is real. You can also compare against other housing associations, because they ask the same question. Almost everything an organisation actually does with information like this depends on comparing it to something, and the survey is the only method here that makes comparison cheap.</p>
			 <p>The bill is that a survey returns what you thought to ask. You asked about meetings, so you will find out about meetings. If the thing eating Marchwood is the rota software, or one particular manager, or the fact that half the vans will not start, the survey comes back saying meetings are fine and everyone believes it, because a number arrived.</p>
			 <p>There is a subtler cost, and it is the one that matters for the rest of this page. A survey question <em>is</em> a vocabulary. &ldquo;How satisfied are you with the number of meetings you attend&rdquo; is a list of the things you are permitted to say, and the list has one item on it. Choosing a survey does not avoid the commitment the third option makes. It makes it so small you stop noticing it is there.</p>
			 <p>Marchwood chose the third option, and this page follows Marchwood. You get to watch your commitment at full size.</p>`
				},
				{
					k: 'b',
					label: 'Open a box and ask people to write whatever they like.',
					buys: 'The only method that can be surprised.',
					costs: 'Nothing countable, and the reading is unauditable.',
					pays: 'Everybody whose response was not one of the four quoted.',
					verdict: 'You chose free text',
					body: `<p>Free text is the only one of the three that can be surprised, and that is not a small thing. Every other method on this page can confirm or deny something somebody already suspected, and the reason anybody builds any of this is the hope of finding the thing nobody suspected. If the rota software is the problem, free text finds it in an afternoon and nothing else here finds it at all.</p>
			 <p>Then 912 people write about forty words each and you have thirty-six thousand words. Somebody reads them. That person is tired by response two hundred, they are looking for themes, and the themes they find are partly a fact about them. What comes out is a slide with four quotations on it. The four are real, and there is no way for anybody to check whether they were representative. Ask how many people said meetings were the problem and the honest answer is that nobody knows, because nobody counted, because counting is precisely what the method gave up in order to be able to surprise you.</p>
			 <p>You also cannot repeat it next March and compare. The second read is a different reader.</p>
			 <p>Marchwood chose the third option, and this page follows Marchwood. It is the attempt to keep the surprise and get the count as well.</p>`
				},
				{
					k: 'c',
					label: 'Give everybody a fixed vocabulary and count what they build with it.',
					buys: 'Countable at the verb end, open at the object end.',
					costs: 'Every question you can ever ask is fixed before anybody speaks.',
					pays: 'Whoever wants to say a thing the grid does not contain.',
					verdict: 'You chose composition',
					body: `<p>That is what Marchwood bought, and it is a real third thing rather than a fudge. The verb comes off a fixed grid so it can be counted. The object is typed, so people can talk about things nobody anticipated. Countable at one end and open at the other, which is exactly the gap the other two leave.</p>
			 <p>Here is the bill, and it arrives before anybody has said a word. Every question you will ever be able to ask of this data is a question about the tiles. &ldquo;What does everyone here hate&rdquo; is answerable only if the grid contains hating. &ldquo;Who is being obstructed&rdquo; is answerable only if the grid contains obstruction. The grid is the set of axes, and the axes get chosen by whoever writes the grid, months before the first person opens the tool.</p>
			 <p>This is worse than it sounds, because it cannot be fixed later. Add a verb in month nine and you have two populations: everybody who spoke before the change and could not have used it, and everybody after. Any count spanning the change is a count of two different instruments. The vocabulary is the one part of the system that has to be right first time, and it is guaranteed to be written by people who do not yet know what anybody wants to say.</p>
			 <p>The rest of this page is the four decisions that follow from yours.</p>`
				}
			],
			inserts: []
		},
		{
			id: 'd2',
			n: 'Decision two',
			setup: `<p>Priya typed <code>the pointless Monday planning meeting</code>. Something now has to happen to that string, because the entire point was to end up with something countable, and a sentence is not countable.</p>
	  <p>Fifty other people at Marchwood describe the same recurring event this month. A sample of what they actually type:</p>
	  <div class="typed">the pointless Monday planning meeting
the Monday planning meeting
our weekly planning session
Monday planning
planning mtg
the 9am on Mondays</div>
	  <p>Six strings, one meeting.</p>`,
			ask: 'What does the system keep?',
			opts: [
				{
					k: 'a',
					label: 'The phrase, exactly as typed.',
					buys: 'Nothing is lost and no machine formed an opinion about her sentence.',
					costs: 'Six strings are six things, so the noun axis does not count.',
					pays: 'Anybody hoping for a number about meetings.',
					verdict: 'You kept the phrase',
					body: `<p>You have kept everything, which means nothing has been decided on Priya&rsquo;s behalf, and that is worth more credit than it usually gets. Every other option here involves a machine forming an opinion about what her sentence was about. Go back to her string in five years and it still says what she said, which is the only guarantee on this page that survives a change of staff.</p>
			 <p>What you have is free text with extra steps. Six strings, six things. Ask how Marchwood feels about the Monday meeting and you get back whichever of the six you happened to type into the query. You paid for a controlled vocabulary at the verb end and got an uncontrolled one at the noun end, so the count works along one axis of a two-axis system, and the axis it works on is the one saying how people feel rather than the one saying what about.</p>
			 <p>That is recoverable, at a price, and the price is the next two decisions plus a person doing by hand what a parser would have done badly.</p>`
				},
				{
					k: 'b',
					label: 'A head concept, meeting, with the rest kept alongside it.',
					buys: 'Every trimming of the same noun collapses onto one node, and nothing is deleted.',
					costs: 'Different names for one thing stay different, and the demoted word was the point.',
					pays: 'Anybody whose point was in an adjective.',
					verdict: 'You kept the head and the modifiers',
					body: `<p>This is the best available engineering and it is what a serious implementation does. A parser finds the noun the phrase is built around, stores that as the thing, and keeps <code>pointless</code>, <code>Monday</code> and <code>planning</code> alongside as properties of that particular saying of it. Nothing is thrown away.</p>
			 <p>On the ordinary case it is superb. <code>meetings</code>, <code>a meeting</code>, <code>all the meetings</code> and <code>these bloody meetings</code> all land on the single node <code>meeting</code>, and nobody has lost anything, because nobody means anything by an article.</p>
			 <p>Now run it over the six above.</p>
			 <div class="typed">the pointless Monday planning meeting
    &rarr; meeting
the Monday planning meeting
    &rarr; meeting
our weekly planning session
    &rarr; session
Monday planning
    &rarr; planning
planning mtg
    &rarr; mtg
the 9am on Mondays
    &rarr; 9am</div>
			 <p>Six strings, five nodes, and only two of them found each other. The parser has done nothing wrong: <code>session</code>, <code>planning</code>, <code>mtg</code> and <code>9am</code> genuinely are the nouns those phrases are built around. It is that people name a recurring event after whichever part of it annoys them, so the trimmings collapse and the names do not, and the names are the part that differs.</p>
			 <p>There is a second thing hiding inside the word head. Deciding which word a phrase is built around is deciding what the phrase was about. The parser read the first line there and concluded it was about a meeting. Priya wrote it because it was about pointlessness, and <code>pointless</code> came out as a property, and properties are not axes, so nothing counts them. Both readings are defensible and one of them gets a node.</p>`
				},
				{
					k: 'c',
					label: 'A head concept, mapped onto a list of things Marchwood approved before launch.',
					buys: 'The query works, and the mapping is written down where it can be argued with.',
					costs: 'Whatever is not on the list did not happen.',
					pays: 'Whoever has the problem nobody anticipated.',
					verdict: 'You mapped onto a controlled list',
					body: `<p>This is the only option where the question originally asked reliably works. Marchwood writes a list of the things people can be talking about, <code>meeting</code>, <code>stand-up</code>, <code>one-to-one</code>, <code>rota software</code>, <code>vans</code>, and every typed phrase is mapped onto one of them. All six strings land on the same node, because somebody sat down and wrote the four mappings that get <code>session</code>, <code>planning</code>, <code>mtg</code> and <code>9am</code> there. The mapping is written down, and anybody can read it and argue with it. Set against a parser making a silent judgement, an explicit mapping somebody can be blamed for is a real gain.</p>
			 <p>The list was written before anybody spoke. Whatever is not on it does not exist. If the thing quietly ruining Marchwood is one manager, or the shift-swap process, or the fact that the depot has no working kettle, there is no node, so there is no count, so it did not happen. You find this out never, because absence produces no signal at all.</p>
			 <p>The mapping is also a claim. Writing <code>stand-up &rarr; meeting</code> into a config file is a decision about what a stand-up is, taken by whoever maintains the file, and applied to every sentence anybody writes for as long as the tool runs.</p>`
				}
			],
			inserts: [
				{
					when: (s) => s.d1 === 'b' && s.d2 === 'a',
					tag: 'Because of decision one',
					body: `<p>You chose free text at decision one and you have now chosen it again by a different route. That is a coherent position and it is worth saying out loud: you have decided twice that the words matter more than the arithmetic. The rest of this page is about the arithmetic, so expect it to keep charging you.</p>`
				}
			]
		},
		{
			id: 'd3',
			n: 'Decision three',
			setup: `<p>Marchwood runs the query. How does this place feel about meetings?</p>
	  <p>Tom&rsquo;s sentence is about the daily stand-up. Whatever decision two did, <code>stand-up</code> and <code>meeting</code> are different nodes, because they are different words and nothing has said otherwise. So the meetings query returns Priya and not Tom.</p>
	  <p>Tom&rsquo;s stand-up is fifteen minutes, every morning, and he loathes it.</p>`,
			ask: 'Is a stand-up a meeting?',
			opts: [
				{
					k: 'a',
					label: 'No. Count what matches, and nothing else.',
					buys: 'Every number means exactly one thing.',
					costs: 'A set of true small numbers and no way to say the true large one.',
					pays: 'Whoever asked the question in ordinary English.',
					verdict: 'You count exact matches',
					body: `<p>Every number this produces means exactly one thing, which is more than the alternatives can say. Ask about meetings and you learn about the word meeting. Nobody has decided on Tom&rsquo;s behalf that his stand-up is a meeting, and if you want to know about stand-ups you ask about stand-ups and get a clean answer to that instead.</p>
			 <p>The cost is that the question Marchwood&rsquo;s chief executive actually asked was about meetings in the ordinary English sense, which includes stand-ups, and she is about to get a number that excludes them. Forty-one people said <code>meeting</code>. Another seventy-three said stand-up, huddle, catch-up, sync and check-in, spread across five nodes. Every one of those numbers is small enough to ignore, and the thing they add up to is the largest problem in the organisation. You have a set of true small numbers and no way to say the true large one.</p>`
				},
				{
					k: 'b',
					label: 'Yes. Build a tree, put stand-up under meeting, and count everything underneath.',
					buys: 'The query finally answers the question that was asked.',
					costs: 'There is no principled place to stop rolling up.',
					pays: 'Anybody whose complaint gets absorbed into a larger, vaguer one.',
					verdict: 'You built the tree',
					body: `<p>This is right, and it is what every library, every hospital coding department and every taxonomist in history has done. A stand-up is a kind of meeting. Pretending otherwise to keep the arithmetic tidy is a worse fault than the arithmetic problem. Build the tree and the meetings query finally answers the question that was asked.</p>
			 <p>Now say where it stops. A stand-up is a meeting. A meeting is a work process. A work process is work. Every step is as defensible as the first, and if you take all of them then what everyone at Marchwood hates is work, which is true and is not information. So you stop somewhere, and the place you stop decides how large the biggest problem in the organisation is allowed to look. Stop at <code>meeting</code> and meetings are the problem, and somebody owns meetings. Stop one level up and the problem is work processes, which is vaguer, bigger, and much harder for anybody to be accountable for.</p>
			 <p>Nobody at Marchwood will experience that as a decision. They will experience a report. The stopping point lives in a file, it was set by whoever built the tree, and there will be no record of it having been chosen, in the same way there is no record of anybody deciding where 390,127 people went in 2001.</p>`
				},
				{
					k: 'c',
					label: 'Yes, partly. A stand-up counts as one stand-up and as some fraction of a meeting.',
					buys: 'An honest representation of a genuinely fuzzy world.',
					costs: 'Forty undefendable numbers, and an output that is no longer a count.',
					pays: 'Whoever reads the integer on the slide.',
					verdict: 'You weighted it',
					body: `<p>This is the honest description of the world, and the reason to prefer it is that the fuzziness is real. A stand-up genuinely is a meeting and genuinely is its own thing, and a tree that forces it to be one or the other tells a lie about stand-ups that the weighted version never has to tell. It also degrades gracefully: get a weight slightly wrong and the answer moves slightly, where a misplaced branch moves it entirely.</p>
			 <p>Then somebody has to write the weights. A stand-up is 0.6 of a meeting, and if you ask why 0.6 there is no answer, because no experiment would settle it and no expert&rsquo;s judgement is better than anybody else&rsquo;s. You have replaced one undefendable decision with forty.</p>
			 <p>And the output stops being a count. 8.4 people is not a quantity of people. What happens next is that 8.4 becomes 8 on a slide, or becomes &ldquo;around nine&rdquo;, and the weights that produced it are not on the slide, so what reaches the board is an integer carrying none of the honesty you paid for.</p>`
				}
			],
			inserts: [
				{
					when: (s) => s.d2 === 'c',
					tag: 'Because of decision two',
					body: `<p>You built the concept list at decision two, so this decision was half made already. The list and the tree are the same artefact seen from two angles, and you get the tree cheaply because you have already paid for it. What you also bought is a lock: the shape of the list is now the shape of every roll-up, and changing the tree means re-mapping every statement collected so far.</p>`
				},
				{
					when: (s) => s.d2 === 'a' && (s.d3 === 'b' || s.d3 === 'c'),
					tag: 'Because of decision two',
					body: `<p>You kept the raw phrases, so there are no concepts to hang this on. You are building it over six strings that a person has to look at and place by hand, and <code>planning mtg</code> has to be placed again every time somebody invents a new abbreviation. Everybody else on this page pays once. You pay per sentence.</p>`
				},
				{
					when: (s) => s.d2 === 'c' && s.d3 === 'a',
					tag: 'Because of decision two',
					body: `<p>Exact matching costs you less than it costs anybody else here, because you already spent decision two collapsing the six phrasings onto one node. Your scatter is across genuinely different concepts, <code>meeting</code> against <code>stand-up</code>, rather than across ways of typing the same one. That is the version of this problem worth having.</p>`
				},
				{
					when: (s) => s.d2 === 'a' && s.d3 === 'a',
					tag: 'Because of decision two',
					body: `<p>You kept every phrase and you are matching exactly, so a query for <code>meeting</code> misses <code>the pointless Monday planning meeting</code> as thoroughly as it misses Tom. There are as many nodes as there are sentences. This is not a count with a gap in it, it is a list.</p>`
				}
			]
		},
		{
			id: 'd4',
			n: 'Decision four',
			setup: `<p>Now the other slot.</p>
	  <p>The verbs are not typed. They are tiles on a grid, seventy-four of them, sorted alphabetically. Here is one row of it as Priya saw it:</p>
	  <div class="grid-row"><span>Collaborate</span><span class="hostile">Condemn</span><span class="hostile">Confront</span><span>Connect</span><span>Cooperate</span></div>
	  <p>Thirty-two of the seventy-four are hostile. That is a requirement rather than an oversight: if you want to ask what people hate, hating has to be on the grid, which means the organisation decided in advance that it wanted complaints to be countable.</p>
	  <p>Look at what kind of words they are. Of the thirty-two, thirty name something you do: Avoid, Withdraw, Resist, Delay, Interrupt, Condemn. Two name a state, Dislike and Disapprove. There is no tile for exhausted, bored, humiliated or afraid.</p>
	  <p>Priya pressed Dislike. Tom pressed Avoid. Sadia pressed Challenge. Marcus pressed nothing, because there is no tile for turning up, saying nothing and going home tired.</p>
	  <p>Three people, one feeling about one meeting, three different edges in the graph.</p>`,
			ask: 'What do you do about it?',
			opts: [
				{
					k: 'a',
					label: 'Preset the verb, so everybody answering this question uses the same one.',
					buys: "Genuinely comparable statements, which is composition's whole claim.",
					costs: 'An axis with one value on it carries no information.',
					pays: "Anybody whose feeling differs from the one the question&rsquo;s author assumed.",
					verdict: 'You preset the verb',
					body: `<p>This produces the only genuinely comparable statements on the page, and comparability is the entire reason you preferred composition to free text at decision one. If everybody answering &ldquo;how do you find the Monday meeting&rdquo; uses the same verb, then the differences between their answers are differences about the meeting rather than differences about vocabulary. Every measuring instrument that works does something along these lines.</p>
			 <p>Count what is left. An axis where every value is identical is not an axis. You built a grid of seventy-four tiles to capture how people feel, then set the answer, so the verb slot now carries nothing and every scrap of signal has moved into the object. You are counting nouns. Composition&rsquo;s whole claim was a countable feeling and an open topic, and the countable half has just been spent.</p>
			 <p>The other thing is smaller and worse. Priya thinks the Monday meeting is pointless and attends every one. Tom skips it. Under a preset verb both are recorded as having done the same thing, and the record says whichever thing the question&rsquo;s author picked. You have told two people what their feeling was, and at least one of them is now in the data as something she is not.</p>`
				},
				{
					k: 'b',
					label: 'Leave all seventy-four open and accept the spread.',
					buys: 'The difference between disliking it and avoiding it survives, and that difference is the actionable part.',
					costs: 'The count is partly a measurement of how people use a grid.',
					pays: 'Anybody in a category with a long tail of ones.',
					verdict: 'You left the grid open',
					body: `<p>Keep the seventy-four and the difference between Priya and Tom survives, which matters because it is not noise. Dislike-and-attend and Avoid-and-skip are different problems with different fixes: one is a meeting that should be shorter, the other is a person who has already left in every sense but the formal one. Any scheme that merges them throws away the most actionable thing in the dataset.</p>
			 <p>The price is that your counts are partly a measurement of how people use a grid. Sadia pressed Challenge, and she might have pressed Confront or Disagree or Oppose, all of which were on screen. The grid is alphabetical, so Condemn sits between Collaborate and Confront, and if you believe adjacency has no effect on what people press then you have never watched anybody use a form.</p>
			 <p>You also cannot repair this the way a noun can be repaired. Collapsing <code>planning mtg</code> onto <code>meeting</code> would take nothing from anybody, because nobody means anything by an abbreviation. Collapsing Condemn onto Criticize overrules a choice somebody made deliberately with the alternative visible beside it. Repairs to the noun slot are free and repairs to the verb slot are not, and in a schema the two look identical.</p>`
				},
				{
					k: 'c',
					label: 'Collapse the grid to five coarse verbs.',
					buys: 'Buckets big enough that a manager can see there are three of them.',
					costs: 'You deleted the distinction you most needed.',
					pays: 'The person whose situation was in the tail.',
					verdict: 'You collapsed the grid',
					body: `<p>Five is a defensible number. It is roughly what people can reliably discriminate, it is where most sentiment instruments settle after a few iterations, and it puts Priya, Tom and Sadia in one bucket where a manager can see that there are three of them. Seventy-four tiles produce a histogram with a long tail of ones, and a histogram of ones tells nobody anything.</p>
			 <p>You have deleted the distinction you most needed. Priya attends and hates it. Tom has stopped attending. Those are different situations needing different responses, and after the collapse they are the same row. The tail you were annoyed by is where the specific information was living.</p>
			 <p>The other cost is timing. Whichever five you choose, you are stuck with them. Widen the set in year two and everybody who spoke before the change could not have used the new words, so any comparison spanning it compares two instruments rather than two years.</p>`
				}
			],
			inserts: [
				{
					when: (s) => s.d4 !== null,
					tag: 'All three options',
					body: `<p>None of the three does anything for Marcus. He turned up, said nothing and went home tired, and there is no tile for that under any of these options. He is not in the count, and nothing about the count says he is missing.</p>`
				},
				{
					when: (s) => s.d4 === 'a' && (s.d2 === 'b' || s.d2 === 'c'),
					tag: 'Because of decision two',
					body: `<p>Both slots are now decided by the system. The verb was preset by whoever wrote the question and the object was normalised by whoever wrote the parser or the list. Priya opened a tool, typed a sentence about pointlessness, and her whole contribution to the graph is one word, and the word is <code>meeting</code>.</p>`
				},
				{
					when: (s) => s.d4 === 'b' && s.d2 === 'a',
					tag: 'Because of decision two',
					body: `<p>Both slots are open now. The verbs spread across seventy-four tiles and the objects spread across every phrasing anybody types. You have a pile of sentences with the grammar written down, which is an expensive route to decision one&rsquo;s second option.</p>`
				}
			]
		},
		{
			id: 'd5',
			n: 'Decision five',
			setup: `<p>It worked. In September Marchwood publishes the first report, and one line of it reads:</p>
	  <div class="typed">Repairs and Maintenance: 11 of 34 staff recorded a
negative statement about meetings.</div>
	  <p>In October the Monday planning meeting is replaced by a written update, and two coordinator roles are merged. The paper that went to the board cited the September figure.</p>
	  <p>In November Priya asks for her statement to be deleted. She is entitled to. She does not have to say why, and she does not.</p>`,
			ask: 'What happens?',
			opts: [
				{
					k: 'a',
					label: 'The statement is deleted. The September figure stands, because it was true in September.',
					buys: 'The only option that is true.',
					costs: 'She has been removed from the store and not from the number.',
					pays: 'Priya, who was not told the difference when she typed it.',
					verdict: 'The figure stands',
					body: `<p>This is the only option that is true. The September report accurately described what had been said by September, it was published in good faith, and going back to change it makes every historical figure Marchwood holds provisional. Anybody trying to understand what the organisation knew when it merged those two roles needs the September number to still say eleven.</p>
			 <p>The problem is what Priya thinks she has done. She asked for her statement to be removed. It has been removed from the store. It is still in a number that is still being quoted, and the gap between those two things is exactly the gap between what she wanted and what she got. Nobody told her that at the point where she typed the sentence, and nobody will tell her now, because the deletion is confirmed by an automated email saying the statement has been deleted, which is true.</p>`
				},
				{
					k: 'b',
					label: 'The statement is deleted and every figure derived from it is recomputed.',
					buys: 'The only reading under which the right to withdraw reaches anything that matters.',
					costs: 'Two published numbers a day apart differ by one, and the difference is a person.',
					pays: 'Priya, identified by arithmetic rather than by access.',
					verdict: 'You recompute',
					body: `<p>Recomputing is what withdrawal obviously means. Anything less is a system claiming to have removed somebody while continuing to use them, and if the right to withdraw does not reach the figures then it does not reach anything that matters. This is the option a decent person picks and there is nothing stupid about picking it.</p>
			 <p>It leaks. Marchwood publishes eleven of thirty-four in September and ten of thirty-four in November. The difference between two published numbers is one person, and anybody who knows Priya asked to be removed in November now knows exactly what her statement said. This needs no access to the database, no permission and no bad faith. It needs arithmetic. It is called a differencing attack and it is why statistical agencies do not simply republish.</p>
			 <p>Then the deeper thing. Recomputation reaches September. It does not reach October. The Monday meeting is already gone, the two roles are already merged, and the people who did that had read eleven. What Priya can withdraw is a row. What she wanted to withdraw is a consequence, and no system on this page or anywhere else offers that.</p>`
				},
				{
					k: 'c',
					label: 'The statement is deleted and the September figure is retracted.',
					buys: 'It treats the published number as belonging to the people it is made of.',
					costs: 'You can retract a database and you cannot retract an organisation.',
					pays: 'Everybody who now works from a number they remember rather than one they can check.',
					verdict: 'You retract',
					body: `<p>This is the only option treating the published figure as belonging to the people it is made of, and that is a coherent and rather principled position. If the number is a claim about eleven individuals and one of them removes her consent, then the claim as published is no longer one anybody has the standing to make, and withdrawing it is what integrity requires.</p>
			 <p>It cannot be done. The figure is in a board paper, in the minutes of the meeting that approved the reorganisation, in a slide somebody screenshotted, and in the memory of everybody in the room when the Monday meeting was abolished. Retraction is an operation you can perform on a database and cannot perform on an organisation. What Marchwood will actually do is issue a correction nobody reads, and the number will go on being cited by people who saw it once and remember eleven.</p>`
				}
			],
			inserts: [
				{
					when: (s) => s.d5 === 'b' && (s.d3 === 'b' || s.d3 === 'c'),
					tag: 'Because of decision three',
					body: `<p>You rolled statements up, so Priya&rsquo;s one sentence was counted more than once: at <code>meeting</code>, at whatever sits above it, and in every figure derived from those. Recomputing moves all of them by one on the same day. That is not one difference for somebody to notice. It is three, and three differences moving together is a signature.</p>`
				}
			]
		}
	];

	const KEYS = DECISIONS.map((d) => d.id);

	let state = $state<Record<string, string | null>>({ d1: null, d2: null, d3: null, d4: null, d5: null });

	const visibleCount = $derived.by(() => {
		for (let i = 0; i < KEYS.length; i++) {
			if (state[KEYS[i]] === null) return i + 1;
		}
		return KEYS.length;
	});

	const allDone = $derived(KEYS.every((k) => state[k] !== null));

	function choose(decisionIndex: number, k: string) {
		const id = KEYS[decisionIndex];
		if (state[id] === k) return;
		state[id] = k;
		for (let j = decisionIndex + 1; j < KEYS.length; j++) state[KEYS[j]] = null;

		requestAnimationFrame(() => {
			document.getElementById(`cons-${id}`)?.focus({ preventScroll: true });
		});
	}

	function chosenOption(d: Decision): Option | undefined {
		const chosen = state[d.id];
		return chosen ? d.opts.find((o) => o.k === chosen) : undefined;
	}

	function activeInserts(d: Decision): Insert[] {
		return d.inserts.filter((ins) => ins.when(state));
	}
</script>

<svelte:head>
	<title>What Everyone Said</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=IBM+Plex+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="canvas">
	<main>
		<h1>What Everyone Said</h1>
		<p class="standfirst">
			How you find out what a group thinks, when the only thing you can collect is what individuals say, one at a
			time.
		</p>

		<section class="box" aria-labelledby="how">
			<h2 id="how">How this page works</h2>
			<p>
				This page asks you to commit before it shows you anything. There are five decisions. At each one you pick
				an answer, and only then does the page tell you what your answer buys and what it costs. Nothing below the
				decision you are on exists yet.
			</p>
			<p>
				You can change any answer at any time. Changing one clears every answer below it, because those parts
				were written for a choice you have since withdrawn, and leaving them on screen would be dishonest.
			</p>
			<p>Every control says out loud what it does. There is no score and nothing is hidden.</p>
		</section>

		<p class="eyebrow">2001</p>
		<p>
			The census asked everyone in England and Wales what their religion was, and left a box underneath for
			anybody whose answer was not on the list. 390,127 people wrote Jedi.
		</p>
		<p>
			The Office for National Statistics had seen the campaign coming and had prepared for it. Jedi Knight was
			given its own processing code, number 896, so the answers could be coded automatically instead of by hand.
			ONS was careful about what that meant: a code records that an answer was common, and confers nothing else.
		</p>
		<p>Then the figures had to be published, and a published table has categories. Jedi went into <em>No religion</em>.</p>
		<p>Years later somebody asked ONS, under freedom of information, who had decided that. The answer:</p>
		<blockquote>
			<p>
				There are no records of any formal decision to allocate responses of &lsquo;Jedi Knight&rsquo; to the 2001
				Census religion question to the output category &lsquo;No religion&rsquo;.
			</p>
		</blockquote>
		<p>
			It had not gone to the advisory group. No user had asked for it. The people doing the coding had no guidance
			and did something. 390,127 people crossed from one side of the national religion headline to the other, and
			nobody&rsquo;s name is on it.
		</p>

		<hr class="div" />

		<p>
			So: suppose you have to find out what nine hundred people think. Not what any one of them thinks, which is
			easy, you ask them. What all of them think, as a single answer somebody could act on.
		</p>
		<p>What do you actually do?</p>

		<hr class="div" />

		<p class="eyebrow">The specimen</p>
		<p>
			Marchwood Housing manages about four thousand homes in the south of England and employs 912 people. In
			March it buys a tool that works like this. Instead of writing a sentence you build one: a subject, a verb
			chosen off a grid of tiles, and an object you type yourself. The bet is that sentences built this way can be
			counted and sentences typed freely cannot.
		</p>
		<p>
			Priya Rahman schedules repairs. On a Tuesday in March she opens it, and the subject is already filled in,
			because the subject is always her. She looks at the grid, presses a tile, and types into the box:
		</p>
		<div class="typed">the pointless Monday planning meeting</div>
		<p>
			She attends every one of those meetings. Three other people in her team also hate the Monday meeting. Tom
			skips it when he can get away with it. Sadia turns up and argues. Marcus turns up, says nothing, and goes
			home tired.
		</p>
		<p>Hold those four. Everything after this happens to them.</p>

		<hr class="div" />

		{#each DECISIONS as d, i (d.id)}
			{#if i + 1 <= visibleCount}
				<section class="decision">
					<p class="dnum">{d.n}</p>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html d.setup}
					<p class="ask">{d.ask}</p>
					<div class="options" role="group" aria-label={d.ask}>
						{#each d.opts as o (o.k)}
							<button
								type="button"
								class="opt"
								aria-pressed={state[d.id] === o.k}
								onclick={() => choose(i, o.k)}
							>
								<span class="letter">({o.k})</span>{o.label}
							</button>
						{/each}
					</div>
					{#if chosenOption(d)}
						{@const o = chosenOption(d)!}
						<div class="consequence" id={`cons-${d.id}`} tabindex="-1">
							<p class="verdict">{o.verdict}</p>
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html o.body}
							{#each activeInserts(d) as ins}
								<div class="insert">
									<span class="tag">{ins.tag}</span>
									<!-- eslint-disable-next-line svelte/no-at-html-tags -->
									{@html ins.body}
								</div>
							{/each}
							<p class="change">Change this answer and everything below it clears.</p>
						</div>
					{/if}
				</section>
				<hr class="div" />
			{/if}
		{/each}

		{#if allDone}
			<p class="eyebrow">The tally</p>
			<h2>Every option, side by side</h2>
			<p>
				Including the twelve you did not choose. Gains are marked <span class="g">like this</span> and costs
				<span class="c">like this</span>, and each carries a symbol so the colour is not doing the work on its own.
			</p>
			<div class="wrap">
				<table>
					<caption>Fifteen options across five decisions.</caption>
					<thead>
						<tr>
							<th scope="col">Decision</th>
							<th scope="col">Option</th>
							<th scope="col">Buys</th>
							<th scope="col">Costs</th>
							<th scope="col">Who pays</th>
						</tr>
					</thead>
					<tbody>
						{#each DECISIONS as d (d.id)}
							{#each d.opts as o, j (o.k)}
								<tr>
									<td class="d">{j === 0 ? d.n.replace('Decision ', '') : ''}</td>
									<td>({o.k}) {o.label}</td>
									<td class="g">{o.buys}</td>
									<td class="c">{o.costs}</td>
									<td>{o.pays}</td>
								</tr>
							{/each}
						{/each}
					</tbody>
				</table>
			</div>

			<details>
				<summary>Afterword</summary>
				<p>
					You can stop here. The page is finished and this part is a frame, which would have been an assertion
					at the top and is checkable now.
				</p>
				<p>
					Every decision on this page was a decision about a vocabulary, taken before the people it applies to
					had said anything. Which words are on the grid. Which word in a phrase is the one that counts. Where a
					word attaches to the words above it. How many words there ought to be. What happens to a word somebody
					takes back.
				</p>
				<p>
					So when the report says eleven of thirty-four, what has been measured is partly Repairs and
					Maintenance and partly the grid. A different grid, written by different people in a different month,
					produces a different eleven, and there is no version of any of this without a grid. The count is a
					measurement of the vocabulary, and only incidentally of the people.
				</p>
				<p>
					Which is why the census is the way in. 390,127 people wrote a word in a box that existed precisely so
					they could say something the list did not cover. The word was heard: it got its own code. Then it had
					to be published, and publishing needs categories, and somebody with no guidance put it in one. Asked
					years afterwards who had decided, ONS answered honestly that there is no record of anybody deciding.
				</p>
				<p>
					That is the ordinary case. The decision is real, it is consequential, it is invisible to everybody
					downstream, and it is usually taken by whoever happened to be doing the coding that day.
				</p>
			</details>

			<details>
				<summary>Disclosure</summary>
				<h3>Where this page is unfair</h3>
				<p>
					Composition got five decisions of scrutiny and the staff survey got one paragraph. A well-run survey,
					with a properly developed coding frame for its free text and trained coders who check each other, is a
					mature instrument with decades of methodology behind it, and it handles several of the problems above
					better than anything described here. It got a short hearing because the page is about the other
					thing. That is a choice about attention rather than a finding about surveys.
				</p>
				<h3>What was cut</h3>
				<p>
					Language models, which are the current answer to all five decisions: have a model read the free text,
					decide the head, decide whether a stand-up is a meeting, map the tiles. That approach is real and on
					several of these it works better than anything here. It was cut because every decision on the page
					then becomes &ldquo;and then a model decides&rdquo;, which is a different argument, about whether you
					can audit a judgement nobody can inspect. Also cut: the one-to-one relationship between an employee
					and their manager, which is where tools of this kind actually spend most of their time and which
					turns on completely different questions.
				</p>
				<h3>What is composed and what is real</h3>
				<p>
					Marchwood Housing does not exist, and Priya, Tom, Sadia and Marcus do not exist. The grid does:
					seventy-four verbs in nineteen categories, thirty-two of them hostile, sorted alphabetically so that
					Condemn sits between Collaborate and Confront. The census figures are real and are quoted above from
					the ONS response.
				</p>
				<h3>My own position</h3>
				<p>
					I would build it. I would control the object with an explicit list rather than a parser, count exact
					matches rather than rolling up, keep a coarse verb set, publish nothing below twenty people, and say
					at the moment somebody types the sentence that deletion removes the record and cannot remove anything
					already done with it. Every one of those is the cautious option, and the person who pays for all five
					is whoever&rsquo;s complaint has no node: their problem is now formally absent rather than merely
					unmeasured, and absence is much harder to argue with than a small number.
				</p>
			</details>
		{/if}
	</main>
</div>

<style>
	.canvas {
		--paper: #f7f3ea;
		--paper-sunk: #efe9dc;
		--mark-wash: #e7e4f0;
		--cost-wash: #f2e4df;
		--ink: #1f1b16;
		--ink-mid: #4a423a;
		--ink-soft: #6b6157;
		--rule: #dcd3c4;
		--edge: #8f8069;
		--mark: #3b3a8c;
		--gain: #2a6b45;
		--cost: #7a2617;
		--measure: 40rem;
		--body: 21px;

		min-height: 100dvh;
		background: var(--paper);
		color: var(--ink);
	}
	main {
		max-width: var(--measure);
		margin: 0 auto;
		padding: 4rem 1.25rem 8rem;
		font-family: 'Newsreader', Georgia, serif;
		font-size: var(--body);
		line-height: 1.72;
		font-variant-numeric: oldstyle-nums;
	}
	main :global(p) {
		margin: 0 0 1.15em;
	}
	main :global(a) {
		color: var(--mark);
	}
	h1 {
		font-family: 'Fraunces', Georgia, serif;
		font-weight: 600;
		font-size: 2.6rem;
		line-height: 1.1;
		letter-spacing: -0.01em;
		margin: 0 0 0.4rem;
	}
	.standfirst {
		color: var(--ink-mid);
		font-size: 1.05rem;
		margin-bottom: 2.5rem;
	}
	h2 {
		font-family: 'Fraunces', Georgia, serif;
		font-weight: 600;
		font-size: 1.5rem;
		line-height: 1.2;
		margin: 0 0 0.9rem;
	}
	main :global(h3) {
		font-family: 'Fraunces', Georgia, serif;
		font-weight: 600;
		font-size: 1.12rem;
		margin: 2rem 0 0.6rem;
	}
	.eyebrow {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-soft);
		margin: 0 0 0.5rem;
	}
	.div {
		border: 0;
		border-top: 1px solid var(--rule);
		margin: 3.5rem 0;
	}
	.box {
		background: var(--paper-sunk);
		border: 1px solid var(--edge);
		border-radius: 2px;
		padding: 1.4rem 1.5rem;
		margin: 0 0 3rem;
	}
	.box h2 {
		font-size: 1.15rem;
		margin-bottom: 0.7rem;
	}
	.box p:last-child {
		margin-bottom: 0;
	}
	.typed {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.85rem;
		line-height: 1.75;
		background: var(--paper-sunk);
		border-left: 3px solid var(--edge);
		padding: 1rem 1.1rem;
		margin: 0 0 1.4rem;
		white-space: pre-wrap;
		color: var(--ink);
	}
	main :global(code) {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.82em;
		background: var(--paper-sunk);
		padding: 0.06em 0.22em;
		border-radius: 2px;
	}
	blockquote {
		margin: 0 0 1.4rem;
		padding: 0 0 0 1.1rem;
		border-left: 3px solid var(--edge);
		color: var(--ink-mid);
		font-style: italic;
	}
	blockquote :global(p:last-child) {
		margin-bottom: 0;
	}
	:global(.grid-row) {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.78rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin: 0 0 1.4rem;
	}
	:global(.grid-row span) {
		border: 1px solid var(--edge);
		padding: 0.4rem 0.55rem;
		background: var(--paper-sunk);
		border-radius: 2px;
	}
	:global(.grid-row span.hostile) {
		background: var(--cost-wash);
	}
	.decision {
		margin: 0 0 3.5rem;
		scroll-margin-top: 1.5rem;
	}
	.dnum {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-soft);
		margin: 0 0 0.45rem;
	}
	.ask {
		font-weight: 600;
	}
	.options {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		margin: 1.4rem 0 0;
		padding: 0;
		border: 0;
	}
	.opt {
		display: block;
		width: 100%;
		text-align: left;
		font-family: 'Newsreader', Georgia, serif;
		font-size: 1rem;
		line-height: 1.55;
		color: var(--ink);
		background: var(--paper);
		border: 1px solid var(--edge);
		border-radius: 2px;
		padding: 0.85rem 1rem;
		cursor: pointer;
	}
	.opt:hover {
		background: var(--paper-sunk);
	}
	.opt:focus-visible {
		outline: 3px solid var(--mark);
		outline-offset: 2px;
	}
	.opt[aria-pressed='true'] {
		background: var(--mark-wash);
		border-color: var(--mark);
		border-left-width: 5px;
		font-weight: 600;
	}
	.opt .letter {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.78rem;
		color: var(--ink-soft);
		margin-right: 0.55rem;
	}
	.opt[aria-pressed='true'] .letter {
		color: var(--mark);
	}
	.consequence {
		margin: 1.6rem 0 0;
		padding: 1.3rem 0 0;
		border-top: 1px solid var(--rule);
	}
	.verdict {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin: 0 0 0.8rem;
		color: var(--ink-soft);
	}
	.insert {
		background: var(--mark-wash);
		border: 1px solid var(--mark);
		border-radius: 2px;
		padding: 1rem 1.1rem;
		margin: 1.4rem 0 0;
	}
	.insert :global(p:last-child) {
		margin-bottom: 0;
	}
	.insert .tag {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.7rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--mark);
		display: block;
		margin-bottom: 0.5rem;
	}
	.change {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.74rem;
		color: var(--ink-soft);
		margin: 1.2rem 0 0;
	}
	table {
		border-collapse: collapse;
		width: 100%;
		font-size: 0.82rem;
		line-height: 1.5;
	}
	caption {
		text-align: left;
		color: var(--ink-soft);
		font-size: 0.82rem;
		margin-bottom: 0.7rem;
	}
	th,
	td {
		border-bottom: 1px solid var(--rule);
		padding: 0.6rem 0.5rem;
		text-align: left;
		vertical-align: top;
	}
	th {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-soft);
		font-weight: 400;
	}
	td.d {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.75rem;
		white-space: nowrap;
		color: var(--ink-soft);
	}
	.g {
		color: var(--gain);
	}
	.c {
		color: var(--cost);
	}
	.g::before {
		content: '+\00a0';
		font-family: 'IBM Plex Mono', monospace;
	}
	.c::before {
		content: '\2212\00a0';
		font-family: 'IBM Plex Mono', monospace;
	}
	.wrap {
		overflow-x: auto;
	}
	main :global(details) {
		border-top: 1px solid var(--rule);
		padding-top: 1.2rem;
		margin-top: 3.5rem;
	}
	main :global(summary) {
		cursor: pointer;
		font-family: 'Fraunces', Georgia, serif;
		font-weight: 600;
		font-size: 1.2rem;
	}
	main :global(summary:focus-visible) {
		outline: 3px solid var(--mark);
		outline-offset: 3px;
	}
	main :global(details[open] summary) {
		margin-bottom: 1.2rem;
	}

	@media (max-width: 480px) {
		.canvas {
			--body: 19px;
		}
		h1 {
			font-size: 2rem;
		}
		main {
			padding: 2.5rem 1rem 6rem;
		}
		.typed {
			font-size: 0.78rem;
			padding: 0.9rem 0.8rem;
		}
		:global(.grid-row) {
			font-size: 0.72rem;
		}
	}
</style>
