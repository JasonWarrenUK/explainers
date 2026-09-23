export type OptionKey = 'a' | 'b' | 'c';
export type Picks = (OptionKey | null)[];

export interface Consequence {
	for: string;
	against: string;
}

export interface Decision {
	n: number;
	title: string;
	setup: string[];
	evidence: string | null;
	evidenceNote?: string;
	question: string;
	options: { key: OptionKey; label: string }[];
	consequences: Record<OptionKey, Consequence>;
	after: string | null;
}

/** A remark that only appears for a particular combination of answers. */
export interface Insert {
	id: string;
	at: number;
	when: (picks: Picks) => boolean;
	label: string;
	text: string;
}

export interface Cascade {
	label: string;
	change: string;
	confidence: string;
	body: string;
	truth: string;
}

export interface TallyLine {
	gains: string;
	costs: string;
}

/** was: rewritten by a cascade. stood: untouched, and now false. */
export type LineMark = 'was' | 'stood';

export interface ArrivedField {
	key: string;
	lines: { text: string; mark?: LineMark }[];
}

export const DECISIONS: Decision[] = [
	{
		n: 1,
		title: "Who does the work of updating?",
		setup: [
			"The tool can research. That part is settled: it reads the module, it goes and looks at what has changed in the world, and it comes back with something. The open question is what it is allowed to hand over.",
			"A council has one week, in evenings, while also learning last month's material. Whatever you choose here sets the budget for everything after it."
		],
		evidence: null,
		question: "Where does the human sit?",
		options: [
			{ key: "a", label: "The council writes every change itself. The tool only researches and reports what it found." },
			{ key: "b", label: "The tool proposes each change. The council approves or rejects them one at a time." },
			{ key: "c", label: "The tool proposes a batch of changes. The council approves the batch after reading a summary." }
		],
		consequences: {
			a: {
				for: "This is the only option where a human has read a sentence before it enters the document. Authorship and understanding stay in the same head, which is worth more than any amount of tooling downstream, and it is the arrangement every other option is quietly approximating.",
				against: "It does not fit in a week, so it will not happen. What happens instead is that the council writes the changes it already understands and leaves the rest, so the document drifts towards whatever this month's volunteers happened to know. That is a bias with no record and no flag."
			},
			b: {
				for: "The diligent middle, and the one almost everybody picks. Per-change judgement is preserved, every update has a named human attached to it, and a bad proposal can be stopped individually rather than in a lump.",
				against: "Fifteen changes with rationale and sources attached is an evening nobody has. It does not fail loudly. It degrades at about the third change, into approving things that look reasonable, and nothing anywhere records that the degradation happened. You will believe you built option b and you will be running option c."
			},
			c: {
				for: "The only option that has budgeted honestly. A fixed hour spent deliberately on three flagged items is worth more than the same hour spread across fifteen, and saying so out loud lets you design where the hour goes.",
				against: "You have written down, in the design, that most changes enter the document unread. That is also true of approving them one at a time, and approving them one at a time never has to admit it."
			}
		},
		after: "The tool in question picked the middle option, and this page follows it from here. {tail}"
	},
	{
		n: 2,
		title: "What goes in front of them?",
		setup: [
			"Council four sits down on a Sunday evening. Module four has been touched three times since the expert wrote it: once by a cascade from council one, once from council two, once from council three. None of those councils opened module four. They made decisions about their own modules and the consequences arrived here.",
			"You decide what appears on the screen."
		],
		evidence: null,
		question: "What does council four actually read?",
		options: [
			{ key: "a", label: "The whole module, every cycle. Read it as a document." },
			{ key: "b", label: "A diff against the last state a human verified, showing what changed." },
			{ key: "c", label: "The tool's own account of what it changed and why." }
		],
		consequences: {
			a: {
				for: "The only option where somebody reads the document rather than the changes. It is the only one that can catch a problem which is not located in any particular edit, and there is no substitute for having read the thing you are about to teach.",
				against: "Generated modules in this tool's own output archive run to five and six thousand words, so this is ten pages a cycle for volunteers with jobs, and the changes are invisible inside it. Nothing on the page distinguishes a sentence the expert wrote from one a cascade wrote last month. Reading all of it and noticing none of it is a real and common outcome, and it looks identical to diligence."
			},
			b: {
				for: "The case for this is the strongest on the page and it deserves stating properly. It is what every code review on earth does. It makes review affordable at all, it puts attention exactly where something moved, and a team that reviewed diffs instead of whole codebases shipped the software you are reading this on.",
				against: "Code review works because a reviewer can run the tests. Prose has no behaviour to check against, so a plausible diff is an accepted diff. And a diff reports what moved: anything that broke by standing still is absent from it by construction, and absent is not a state the reader can see."
			},
			c: {
				for: "Cheapest to read, and the only one that can tell you <em>why</em> a change was made, because a rationale is not recoverable from the text afterwards. If you want a council to understand the reasoning rather than just the edit, this is the only option that carries any.",
				against: "The account is written by the process that made the changes. A summary that missed a consequence does not mention the consequence it missed, and reads exactly like a summary that missed nothing. You cannot tell the two apart from the summary, which is the only thing you are looking at."
			}
		},
		after: null
	},
	{
		n: 3,
		title: "How does the hour get spent?",
		setup: [
			"Whatever you chose, council four now has more in front of them than they can properly examine. This is the decision about triage, and it is the one the real tool has thought hardest about.",
			"Here is its design note, verbatim."
		],
		evidence: "Confidence calibration: AI-proposed updates include confidence\nscores. High-confidence changes (\"Keras 2 → Keras 3 API updates\")\nget quick acceptance workflows. Low-confidence changes (\"this\npedagogical approach might need revision\") demand human attention.\n\nQuick accept / must review classification: Automatic categorisation\nof changes based on confidence and scope. Councils spend time on\nambiguous decisions, not rubber-stamping obvious updates.",
		evidenceNote: "The confidence score is one of high, medium or low, and it is written by the same process that proposes the change.",
		question: "How do you tell council four where to look?",
		options: [
			{ key: "a", label: "Sort by confidence. Quick-accept the changes the tool is sure about, spend the hour on the doubtful ones." },
			{ key: "b", label: "Sort by consequence. Flag the changes that other parts of the document depend on." },
			{ key: "c", label: "Do not sort. Read in document order until the hour is gone." }
		],
		consequences: {
			a: {
				for: "This is right about every individual change, and the alternative of spreading attention evenly is demonstrably worse. Nobody should spend a volunteer week arguing about a version number, and a tool that cannot tell a version bump from a pedagogical rewrite is not worth having.",
				against: "Confidence measures whether a claim about the world is true. A version bump scores about as high as anything can, and a version bump is precisely the edit that can invalidate the sentences around it without touching them. The quick-accept pile is not the pile where the risk is absent. It is the pile where the risk is concentrated and the attention has been deliberately removed."
			},
			b: {
				for: "The only sort aimed at what actually causes the harm, and the only one that could in principle arrive at a sentence nobody edited, by reaching it along a dependency from one that was. If any option on this page can catch the thing coming, it is this one.",
				against: "Somebody has to author the dependency graph, by hand, over prose. The edge you did not think of is the edge that breaks, and it is unavailable for exactly the reason it broke: nobody was thinking about it. The graph also costs more to maintain than the document it describes."
			},
			c: {
				for: "No false priority anywhere in the system, and no confidence number carrying weight it cannot support. Whatever does get read is read properly, by somebody making their own judgements about what matters, in the order the material actually comes in, which is also the order the cohort will meet it. There is something to be said for a reviewer whose sense of a module is built the same way a learner's will be, rather than assembled out of whichever fragments a machine flagged.",
				against: "The back half of the module is never reached. Not sometimes: every cycle, and it is the same back half every time, so one end of every module in the course accumulates changes that no human has ever looked at. It is also the end where the harder material lives, because that is how modules are built."
			}
		},
		after: null
	},
	{
		n: 4,
		title: "What does current mean?",
		setup: [
			"The tool's whole job is to answer one question about every line: has this gone stale. To answer it, it has to consult something. You choose what.",
			"The real tool ships a list. Twenty-nine hostnames, in seven categories."
		],
		evidence: "AI Platforms         anthropic.com, claude.ai, openai.com,\n                     deepmind.google, ai.google, microsoft.com,\n                     huggingface.co/blog\nDocumentation        js.langchain.com, python.langchain.com,\n                     modelcontextprotocol.io, docs.python.org\nDeveloper Resources  dev.to, github.com, medium.com, python.org\nNews & Analysis      techcrunch.com, thenextweb.com, venturebeat.com\nBlogs & Newsletters  deepgains.substack.com,\n                     newsletter.pragmaticengineer.com,\n                     simonwillison.net, sundeepteki.org/blog,\n                     writer.com/engineering,\n                     abnormal.ai/blog/category/engineering\nCommunities          stackoverflow.com, news.ycombinator.com\nAcademic & Research  arxiv.org, acm.org, ieee.org",
		evidenceNote: "Count the ones owned by a company selling something in this field and you get eleven of the twenty-nine: the whole of the first category, both LangChain domains, and the two vendor engineering blogs at the end of the fifth. Whoever wrote this list was careful. Four entries are scoped below the domain, to a blog or a section, so the author plainly knew that a domain is not always the right unit. The four that carry the most authors, github.com, medium.com, dev.to and stackoverflow.com, are the ones left unscoped.",
		question: "What is the tool allowed to consult?",
		options: [
			{ key: "a", label: "Open web search. Whatever is out there." },
			{ key: "b", label: "A curated list of sources you trust, reviewed and versioned." },
			{ key: "c", label: "What actually broke for the last cohort who tried it." }
		],
		consequences: {
			a: {
				for: "Nobody has pre-decided what counts, so a warning published somewhere unfashionable can still reach the document. Every list ever written has excluded the thing that turned out to matter, and this is the only option that does not. It is also the only one that keeps working when the field moves somewhere nobody expected: a list has to be updated by a human who noticed, and noticing is the thing in short supply here. The absence of a list is not an absence of judgement, it is a decision to place the judgement later, at the point where somebody reads the result.",
				against: "Current becomes whatever is being written about most, and what is being written about most is whatever launched. The tool inherits the enthusiasm of the internet with no way to discount it, and enthusiasm is loudest exactly where the evidence is thinnest. It is also unauditable in a way the others are not: when a council asks why a change was proposed, the answer is a URL somebody found, and there is no standing artefact anybody can review or argue with before the fact."
			},
			b: {
				for: "Reviewable, auditable, versioned, and it keeps the obvious rubbish out. Somebody can be held responsible for the list, which is more accountability than either of the other two can offer, and it is a genuine artefact of judgement rather than a shrug.",
				against: "For four entries it is a claim that trust is a property of a hostname, and medium.com is millions of authors behind one domain name. And the question being asked is <em>has this gone stale</em>, which the eleven vendor-owned entries are structurally unable to answer with a no, because their product is the answer being yes. That is not a flaw in this particular list. Any list assembled by somebody who works in a field will be made of the places that field publishes."
			},
			c: {
				for: "The only non-commercial signal available anywhere in this design, and the only evidence in the building that is about learners rather than about the field. When it fires it is real, because somebody actually hit it. It is also the only source here that can see a requirement rather than a version: nobody publishes an article saying a brief has become unrunnable on a laptop, and a cohort that could not run it knows.",
				against: "It can only report on things somebody already tried, so it has no reach into anything new, and it lags by exactly one module. A cohort has to fail at something before it becomes visible, which makes it a record of damage rather than a warning. And it needs somebody to collect it, which is a job nobody has been given, on a course whose whole problem is that nobody has time for the jobs they already have."
			}
		},
		after: null
	},
	{
		n: 5,
		title: "What does acceptance do to the baseline?",
		setup: [
			"Council four accepts. The module is delivered, the cohort builds their projects, the council disbands. The next time the course runs, with new people, the tool starts proposing updates to module four all over again.",
			"The diff has to be computed against something."
		],
		evidence: null,
		question: "What is the next diff measured from?",
		options: [
			{ key: "a", label: "The expert's original. Forever. Every diff shows the full distance travelled." },
			{ key: "b", label: "The version council four accepted. Their acceptance sets the new reference." },
			{ key: "c", label: "The version council four accepted, but every line carries an age: any line nobody has read in place for four cycles is forced back into review whether or not it changed." }
		],
		consequences: {
			a: {
				for: "The only option where the expert's text stays the reference permanently, so drift is always measured against something a human definitely understood. It is also the only one under which the question an incoming council most wants answered, how far is this from what a qualified person actually designed, has an answer at all, in year one or year five. Every other option here answers that question with a shrug and a date.",
				against: "The diff grows every cycle. By the fourth run it is longer than the module, so it stops being read, and a diff nobody reads has quietly become the whole document with none of the advantages of being the whole document. The growth is not useful growth either: the second cycle's distance is informative and the eighth cycle's is archaeology, a record of a document that no longer exists being compared to one nobody remembers."
			},
			b: {
				for: "This is what acceptance means, and it is the only thing that keeps a diff small enough to be read. Every affordable review in this design depends on it. A human looked at this and said yes, and a design that ignores that has thrown away its only human signal. It is also the only option that treats a council as having done something: refuse it and you are telling four volunteers who gave up a week that their approval changed nothing about what happens next, which is both untrue and a good way to stop getting volunteers.",
				against: "The expert recedes by one acceptance at a time, and each of those acceptances was granted by somebody reading a diff rather than the document. The mechanism that arrests the drift is the mechanism that discards the baseline, and at no point does anybody do anything wrong. It is invisible from inside for the same reason: every individual step is a small, well-earned, obviously correct move, and there is no cycle in which the recession is large enough for anybody to remark on it."
			},
			c: {
				for: "The only option that tracks staleness separately from change, which is the distinction everything on this page has turned on. A line unread through four cycles is exactly the line this brief lost, and it is invisible to every other mechanism here precisely because nothing happened to it. It also gives human-verified a meaning that survives contact with a diff, since a line becomes verified by somebody having looked at that line.",
				against: "It spends the scarce hour on text nobody has any reason to suspect, and decision one established that the hour is roughly an evening. Somebody has to choose the number four, and nobody can defend it: too high and it never fires, too low and councils re-read material that was fine. And it does not find anything. It forces a look, and somebody looking at an unchanged line with no reason to doubt it will read straight past."
			}
		},
		after: null
	}
];

export const INSERTS: Insert[] = [
	{ id: "I1", at: 2, when: (picks) => picks[0] === "c" && picks[1] === "b",
		label: "Because of your first answer",
		text: "You chose to approve changes in a batch, and then chose to show that batch as a diff. Those are the same object. This decision did not add any scrutiny to the last one; it gave a name to the thing you had already picked." },
	{ id: "I2", at: 2, when: (picks) => picks[0] === "a" && picks[1] === "a",
		label: "Because of your first answer",
		text: "Authoring every change and then reading the whole document is the arrangement that existed before anybody built a tool. What you have designed saves a council the research and nothing else. That is a defensible product, and it is a much smaller one than the thing being proposed." },
	{ id: "I3", at: 3, when: (picks) => picks[1] === "a" && picks[2] === "a",
		label: "Because of your second answer",
		text: "You are showing council four the entire module and then sorting the changes within it by confidence. You have paid for the expensive option and then installed the triage machinery that only earns its place if you had not." },
	{ id: "I4", at: 3, when: (picks) => picks[1] === "b" && picks[2] === "b",
		label: "Because of your second answer",
		text: "A diff sorted by consequence is the strongest pair available on this page, and it is worth saying that plainly. It is also the only combination here that could have reached the local-machine line, by following an edge from the model name that changed to the requirement that depended on it. Whether it does depends entirely on whether somebody drew that edge, and nobody draws the edge from a model name to a sentence about laptops, because until the model got large enough the two had nothing to do with each other." },
	{ id: "I5", at: 4, when: (picks) => picks[2] === "a" && picks[3] === "b",
		label: "Because of your third answer",
		text: "You are sorting by confidence and sourcing from a fixed list, so the two decisions are now geared together. A change taken from a vendor's own documentation is about as well sourced as this system can measure, so it scores high, so it goes in the quick-accept pile. The vendor is the most confident party about its own release, and confidence is what you chose to sort on." },
	{ id: "I6", at: 4, when: (picks) => picks[2] === "b" && picks[3] === "c",
		label: "Because of your third answer",
		text: "Both of your last two answers get their evidence from somewhere nobody publishes. A dependency graph is drawn by whoever maintains the document, and a cohort's failures are generated by learners, so between them these two are the only signals in the design that are not written by somebody with something to announce. Point the second at the first and the dependency edges start coming from things that actually broke instead of from what somebody thought to declare. Nobody has built that, and it would take longer than the course does." },
	{ id: "I7", at: 4, when: (picks) => picks[3] === "a" && picks[0] === "c",
		label: "Because of your first answer",
		text: "An unfiltered supply of proposals feeding an approval step that reads a summary is the highest-throughput arrangement available here. It will produce the most current-looking document of any combination on this page, and it will do it fastest, and both of those are things somebody will report as success." },
	{ id: "I8", at: 5, when: (picks) => picks[4] === "b" && picks[2] === "a",
		label: "Because of your third answer",
		text: "The reference moves when a council accepts, and you designed acceptance to be fastest for the changes the tool was surest about. So the edits that set the new baseline are precisely the ones that received the least attention, by design, on purpose, for good reasons." },
	{ id: "I9", at: 5, when: (picks) => picks[4] === "a" && picks[1] === "b",
		label: "Because of your second answer",
		text: "You chose a diff because it was readable, and then refused to let it shrink. The thing you picked for being short is the thing you have guaranteed will stop being short, and by the fourth run through the course it is the longest document anybody is asked to look at." }
];

export const TAIL: Record<OptionKey, string> = {
	a: "Which means this page is about to show you a system that made a different choice from yours, and the distance between the two is worth keeping in view.",
	b: "Which is your answer, so from here you are watching your own design being run.",
	c: "Which is not what it says it does, and it is what it does, and you are the only one on this page who has already admitted it."
};

export const CASCADES: Cascade[] = [
	{
		label: "cascade 1 · triggered by council one, working on module one",
		change: "every model named in the brief → its current equivalent",
		confidence: "high",
		body: "Council one accepted, for their own module, that the model generation named in the course had been superseded. That judgement propagated forward and swept module four in one pass: Llama 2 and GPT-J in criterion one, Llama-2-7B or 13B in example one, and the GPT-3.5 the example compares against. One entry in the changelog, four substitutions, because leaving any of them behind would have been an inconsistency somebody would have filed as a bug.",
		truth: "Correct, in all four places. Nothing here is a judgement call: the named models were three years old and two of them were dead."
	},
	{
		label: "cascade 2 · triggered by council two, working on module two",
		change: "Transformers, llama.cpp, containerized → current serving runtimes",
		confidence: "high",
		body: "Council two's own module covers deployment, and they took an update reflecting how people actually serve open models now. The same change cascaded into module four's first skill, which listed the tooling by name.",
		truth: "Correct. That bullet named a library list from 2023."
	},
	{
		label: "cascade 3 · triggered by council three, working on module three",
		change: "against benchmarks → against current evaluation suites",
		confidence: "medium",
		body: "Evaluation practice moved, council three took the update for module three, and module four's criterion about evaluating performance came along with it.",
		truth: "Correct, and the only one of the three the tool was less than certain about."
	}
];

export const TALLY: Record<string, TallyLine> = {
	"1a": { gains: "A human has read every sentence before it enters.", costs: "Does not fit in a week, so the document drifts towards what this month's volunteers already knew." },
	"1b": { gains: "Per-change judgement, with a named human on each update.", costs: "Degrades into batch approval by the third change, and nothing records that it did." },
	"1c": { gains: "An honest budget, so you can decide where the hour goes.", costs: "You have written down that most changes enter unread." },
	"2a": { gains: "Somebody reads the document rather than the changes.", costs: "Ten pages a cycle, and nothing marks which sentences are new." },
	"2b": { gains: "Affordable review, with attention where something moved.", costs: "Anything that broke by standing still is absent by construction." },
	"2c": { gains: "The only form that carries the reasoning.", costs: "Written by the process being reviewed, and a bad one reads like a good one." },
	"3a": { gains: "No volunteer week spent arguing about version numbers.", costs: "Quick-accept is where the consequential edits are, and where the attention is not." },
	"3b": { gains: "Aimed at what causes the harm, and can arrive at an unedited line.", costs: "A hand-authored graph whose missing edge is the one that breaks." },
	"3c": { gains: "No false priority and no unsupported number.", costs: "The back half of every module is never reached, every cycle." },
	"4a": { gains: "No list, so an unfashionable warning can still arrive.", costs: "Current becomes whatever launched, at the volume of the internet." },
	"4b": { gains: "Auditable, versioned, and somebody is accountable for it.", costs: "Trust as a property of a hostname, and eleven of the twenty-nine sell the answer." },
	"4c": { gains: "The only signal about learners rather than about the field.", costs: "Lags by a module, and reports damage rather than warning of it." },
	"5a": { gains: "The expert stays the permanent reference.", costs: "The diff outgrows the module and stops being read." },
	"5b": { gains: "Diffs stay short enough to actually read.", costs: "The baseline recedes one acceptance at a time, and nobody errs." },
	"5c": { gains: "Tracks staleness separately from change, which nothing else here does.", costs: "Spends the scarce hour on a rota, on an interval nobody can defend." }
};

/** The author's own answers, flagged in the tally so the reader can disagree. */
export const MY_PICKS: OptionKey[] = ['c', 'b', 'b', 'c', 'c'];

/** Module 4, brief 2, as it stands after three cascades. */
export const ARRIVED: ArrivedField[] = [
	{
		key: 'Criteria',
		lines: [
			{ text: 'Develop an application using an open-source LLM as its core (e.g. Llama 4 Scout, or similar).', mark: 'was' },
			{ text: 'Deploy the model on your local machine or a server under your control.', mark: 'stood' },
			{ text: 'The app can be similar to something done earlier or a new concept – emphasis is on the technical challenge of using an open model.' },
			{ text: 'Evaluate the open-source model’s performance against current evaluation suites.', mark: 'was' },
			{ text: 'Possibly customize it via parameter tweaks, prompt tuning, or lightweight fine-tuning.' }
		]
	},
	{
		key: 'Example 1',
		lines: [
			{ text: 'Local Chat Assistant. A ChatGPT clone running offline. Set up Llama 4 Scout and build a console or web chat interface. Compare its answers to a current frontier API model on questions to see differences.', mark: 'was' }
		]
	},
	{
		key: 'Skill 1',
		lines: [
			{ text: 'Learn how to obtain and run an LLM on hardware or free cloud instance.', mark: 'stood' },
			{ text: 'Work with current serving runtimes.', mark: 'was' },
			{ text: 'Face practical concerns like model size, inference speed, GPU vs CPU differences.' },
			{ text: 'Understand what resources AI models need and how to manage them.', mark: 'stood' }
		]
	}
];

/** What the tool reports when asked for its own account of the three cascades. */
export const TOOL_ACCOUNT = `Updated every model named in this brief to its current equivalent.
Four substitutions. High confidence. Source: vendor release
documentation.

Updated the named serving tooling to current runtimes.
High confidence. Source: vendor release documentation.

Updated the evaluation criterion to current evaluation suites.
Medium confidence. Source: two practitioner blogs.`;
